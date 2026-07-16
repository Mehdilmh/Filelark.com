import { checkFileSize, ConversionError, replaceExtension } from './util';
import { decodeImage } from './image';

/* ------------------------------------------------------------------ */
/* Lazy loaders — heavy libraries load only when a file is processed   */
/* ------------------------------------------------------------------ */

async function loadPdfjs() {
  const pdfjs = await import('pdfjs-dist');
  // Served from public/ — copied there by scripts/copy-pdf-worker.mjs
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  return pdfjs;
}

async function loadPdfLib() {
  return import('pdf-lib');
}

function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

async function openWithPdfjs(file: File) {
  checkFileSize(file);
  const pdfjs = await loadPdfjs();
  try {
    return await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  } catch (err) {
    if (err instanceof Error && err.name === 'PasswordException') {
      throw new ConversionError(
        `"${file.name}" is password-protected. Remove the password first.`,
      );
    }
    throw new ConversionError(
      `"${file.name}" could not be opened. It may be corrupt or not a real PDF.`,
    );
  }
}

async function openWithPdfLib(file: File) {
  checkFileSize(file);
  const { PDFDocument } = await loadPdfLib();
  try {
    return await PDFDocument.load(await file.arrayBuffer(), {
      ignoreEncryption: false,
    });
  } catch (err) {
    if (err instanceof Error && /encrypted/i.test(err.message)) {
      throw new ConversionError(
        `"${file.name}" is password-protected. Remove the password first.`,
      );
    }
    throw new ConversionError(
      `"${file.name}" could not be opened. It may be corrupt or not a real PDF.`,
    );
  }
}

/* ------------------------------------------------------------------ */
/* PDF → images                                                        */
/* ------------------------------------------------------------------ */

export interface PageImage {
  pageNumber: number;
  name: string;
  blob: Blob;
}

export async function pdfToImages(
  file: File,
  options: {
    format: 'jpg' | 'png';
    quality?: number;
    onProgress?: (done: number, total: number) => void;
  },
): Promise<PageImage[]> {
  const doc = await openWithPdfjs(file);
  const results: PageImage[] = [];
  const mime = options.format === 'jpg' ? 'image/jpeg' : 'image/png';
  const base = file.name.replace(/\.pdf$/i, '');

  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      // 2x scale ≈ 150 DPI for a letter page — sharp text, sane sizes
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d')!;
      if (options.format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({ canvasContext: ctx, viewport }).promise;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, mime, options.quality ?? 0.9),
      );
      if (!blob) throw new ConversionError(`Page ${i} could not be rendered.`);
      results.push({
        pageNumber: i,
        name: `${base}-page-${String(i).padStart(2, '0')}.${options.format}`,
        blob,
      });
      options.onProgress?.(i, doc.numPages);
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }
  return results;
}

/** Small page previews for the rotate/delete editor. */
export async function pdfThumbnails(
  file: File,
  maxWidth = 160,
): Promise<{ pageNumber: number; dataUrl: string }[]> {
  const doc = await openWithPdfjs(file);
  const thumbs: { pageNumber: number; dataUrl: string }[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: maxWidth / base.width });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      thumbs.push({ pageNumber: i, dataUrl: canvas.toDataURL('image/jpeg', 0.7) });
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }
  return thumbs;
}

/* ------------------------------------------------------------------ */
/* Images → PDF                                                        */
/* ------------------------------------------------------------------ */

export async function imagesToPdf(
  files: File[],
  onProgress?: (done: number, total: number) => void,
): Promise<Blob> {
  const { PDFDocument } = await loadPdfLib();
  const doc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    checkFileSize(file);
    let image;
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await doc.embedJpg(await file.arrayBuffer());
    } else if (file.type === 'image/png') {
      image = await doc.embedPng(await file.arrayBuffer());
    } else {
      // WebP/AVIF/GIF/BMP/HEIC → decode in browser, embed as PNG
      const bitmap = await decodeImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
      bitmap.close();
      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      );
      if (!pngBlob) throw new ConversionError(`"${file.name}" could not be converted.`);
      image = await doc.embedPng(await pngBlob.arrayBuffer());
    }
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    onProgress?.(i + 1, files.length);
  }

  const bytes = await doc.save();
  return pdfBlob(bytes);
}

/* ------------------------------------------------------------------ */
/* Merge                                                               */
/* ------------------------------------------------------------------ */

export async function mergePdfs(
  files: File[],
  onProgress?: (done: number, total: number) => void,
): Promise<Blob> {
  const { PDFDocument } = await loadPdfLib();
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const src = await openWithPdfLib(files[i]);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const p of pages) merged.addPage(p);
    onProgress?.(i + 1, files.length);
  }
  const bytes = await merged.save();
  return pdfBlob(bytes);
}

/* ------------------------------------------------------------------ */
/* Split                                                               */
/* ------------------------------------------------------------------ */

/** Parse "1-3, 7, 12-14" into zero-based page indices, validated. */
export function parsePageRanges(spec: string, pageCount: number): number[] {
  const indices: number[] = [];
  const parts = spec.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) {
    throw new ConversionError('Enter at least one page or range, e.g. "1-3, 7".');
  }
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/) || part.match(/^(\d+)$/);
    if (!m) {
      throw new ConversionError(`"${part}" is not a valid page or range.`);
    }
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end > pageCount || start > end) {
      throw new ConversionError(
        `"${part}" is out of range — this PDF has ${pageCount} page${pageCount === 1 ? '' : 's'}.`,
      );
    }
    for (let p = start; p <= end; p++) indices.push(p - 1);
  }
  return indices;
}

export async function extractPages(file: File, spec: string): Promise<Blob> {
  const src = await openWithPdfLib(file);
  const indices = parsePageRanges(spec, src.getPageCount());
  const { PDFDocument } = await loadPdfLib();
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  for (const p of pages) out.addPage(p);
  const bytes = await out.save();
  return pdfBlob(bytes);
}

export async function splitEveryPage(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<{ name: string; blob: Blob }[]> {
  const src = await openWithPdfLib(file);
  const { PDFDocument } = await loadPdfLib();
  const base = file.name.replace(/\.pdf$/i, '');
  const out: { name: string; blob: Blob }[] = [];
  const count = src.getPageCount();
  for (let i = 0; i < count; i++) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(src, [i]);
    doc.addPage(page);
    const bytes = await doc.save();
    out.push({
      name: `${base}-page-${String(i + 1).padStart(2, '0')}.pdf`,
      blob: pdfBlob(bytes),
    });
    onProgress?.(i + 1, count);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Compress                                                            */
/* ------------------------------------------------------------------ */

export async function compressPdf(
  file: File,
  options: { quality: number; scale?: number; onProgress?: (done: number, total: number) => void },
): Promise<Blob> {
  const doc = await openWithPdfjs(file);
  const { PDFDocument } = await loadPdfLib();
  const out = await PDFDocument.create();
  const scale = options.scale ?? 1.5;

  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;

      const jpgBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', options.quality),
      );
      if (!jpgBlob) throw new ConversionError(`Page ${i} could not be rendered.`);
      const image = await out.embedJpg(await jpgBlob.arrayBuffer());

      // Keep the original page dimensions (PDF points)
      const original = page.getViewport({ scale: 1 });
      const newPage = out.addPage([original.width, original.height]);
      newPage.drawImage(image, {
        x: 0,
        y: 0,
        width: original.width,
        height: original.height,
      });
      options.onProgress?.(i, doc.numPages);
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }

  const bytes = await out.save();
  return pdfBlob(bytes);
}

/* ------------------------------------------------------------------ */
/* Rotate / delete pages                                               */
/* ------------------------------------------------------------------ */

export interface PageEdit {
  /** additional rotation in degrees, multiple of 90 */
  rotate: number;
  deleted: boolean;
}

export async function rotateDeletePdf(
  file: File,
  edits: PageEdit[],
): Promise<Blob> {
  const src = await openWithPdfLib(file);
  const { degrees } = await loadPdfLib();
  const pages = src.getPages();

  if (edits.length !== pages.length) {
    throw new ConversionError('Page list is out of date — please re-add the file.');
  }
  if (edits.every((e) => e.deleted)) {
    throw new ConversionError('At least one page must remain in the document.');
  }

  pages.forEach((page, i) => {
    const extra = ((edits[i].rotate % 360) + 360) % 360;
    if (extra !== 0) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + extra) % 360));
    }
  });

  // Remove pages from the end so indices stay valid
  for (let i = edits.length - 1; i >= 0; i--) {
    if (edits[i].deleted) src.removePage(i);
  }

  const bytes = await src.save();
  return pdfBlob(bytes);
}

export function pdfOutputName(file: File, suffix: string): string {
  return replaceExtension(file.name, '').replace(/\.$/, '') + `-${suffix}.pdf`;
}
