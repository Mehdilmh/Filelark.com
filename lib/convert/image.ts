import { FORMATS, FormatId } from '../formats';
import { checkFileSize, ConversionError, replaceExtension } from './util';

export type EncodeFormat = 'jpg' | 'png' | 'webp' | 'avif';

const ENCODE_MIME: Record<EncodeFormat, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

export interface ResizeOptions {
  mode: 'pixels' | 'percent';
  width?: number;
  height?: number;
  percent?: number;
  lockAspect?: boolean;
}

export interface ConvertResult {
  blob: Blob;
  name: string;
  originalSize: number;
  newSize: number;
  width: number;
  height: number;
}

function isHeic(file: File): boolean {
  return (
    /image\/hei[cf]/.test(file.type) || /\.hei[cf]$/i.test(file.name)
  );
}

function isAvif(file: File): boolean {
  return file.type === 'image/avif' || /\.avif$/i.test(file.name);
}

/** Decode any supported image file into an ImageBitmap. Heavy codecs load lazily. */
export async function decodeImage(file: File): Promise<ImageBitmap> {
  checkFileSize(file);

  let blob: Blob = file;

  if (isHeic(file)) {
    // heic2any is ~1 MB — loaded only when a HEIC file is actually dropped
    const heic2any = (await import('heic2any')).default;
    try {
      const out = await heic2any({ blob: file, toType: 'image/png' });
      blob = Array.isArray(out) ? out[0] : out;
    } catch {
      throw new ConversionError(
        `"${file.name}" could not be decoded. It may be corrupt or not a real HEIC file.`,
      );
    }
  }

  try {
    return await createImageBitmap(blob);
  } catch {
    // Fall through to alternative decoders
  }

  if (isAvif(file)) {
    // Browser can't decode AVIF (very old versions) → WASM decoder
    try {
      const { decode } = await import('@jsquash/avif');
      const imageData = await decode(await blob.arrayBuffer());
      if (imageData) return await createImageBitmap(imageData);
    } catch {
      /* fall through */
    }
  }

  // Last resort: HTMLImageElement (handles some quirky BMP/ICO variants)
  try {
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('decode failed'));
        el.src = url;
      });
      return await createImageBitmap(img);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    throw new ConversionError(
      `"${file.name}" could not be read as an image. The file may be corrupt or in an unsupported format.`,
    );
  }
}

function targetDimensions(
  w: number,
  h: number,
  resize?: ResizeOptions,
): { width: number; height: number } {
  if (!resize) return { width: w, height: h };
  if (resize.mode === 'percent') {
    const p = Math.max(1, Math.min(1000, resize.percent ?? 100)) / 100;
    return {
      width: Math.max(1, Math.round(w * p)),
      height: Math.max(1, Math.round(h * p)),
    };
  }
  let width = resize.width;
  let height = resize.height;
  if (resize.lockAspect !== false) {
    if (width && !height) height = Math.round((width / w) * h);
    else if (height && !width) width = Math.round((height / h) * w);
    else if (width && height) {
      // fit within box, preserving aspect
      const scale = Math.min(width / w, height / h);
      width = Math.round(w * scale);
      height = Math.round(h * scale);
    }
  }
  return {
    width: Math.max(1, width ?? w),
    height: Math.max(1, height ?? h),
  };
}

function drawToCanvas(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  whiteBackground: boolean,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ConversionError('Your browser blocked canvas rendering.');
  if (whiteBackground) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mime, quality),
  );
  if (!blob || blob.type !== mime) {
    throw new ConversionError(
      `Your browser cannot encode ${mime.replace('image/', '').toUpperCase()} images.`,
    );
  }
  return blob;
}

/** Encode a canvas to the requested format. AVIF uses a WASM encoder (lazy-loaded). */
export async function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: EncodeFormat,
  quality = 0.9,
): Promise<Blob> {
  if (format === 'avif') {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { encode } = await import('@jsquash/avif');
    const buffer = await encode(imageData, {
      quality: Math.round(quality * 100),
    } as never);
    return new Blob([buffer], { type: 'image/avif' });
  }
  return canvasToBlob(canvas, ENCODE_MIME[format], format === 'png' ? undefined : quality);
}

/** Full pipeline: decode → optional resize → encode. */
export async function convertImage(
  file: File,
  format: EncodeFormat,
  options: { quality?: number; resize?: ResizeOptions } = {},
): Promise<ConvertResult> {
  const bitmap = await decodeImage(file);
  try {
    const { width, height } = targetDimensions(bitmap.width, bitmap.height, options.resize);
    const canvas = drawToCanvas(bitmap, width, height, format === 'jpg');
    const blob = await encodeCanvas(canvas, format, options.quality ?? 0.9);
    return {
      blob,
      name: replaceExtension(file.name, FORMATS[format as FormatId].extension),
      originalSize: file.size,
      newSize: blob.size,
      width,
      height,
    };
  } finally {
    bitmap.close();
  }
}

/** Which encodable format should a resize keep the image in? */
export function preservedFormat(file: File): EncodeFormat {
  switch (file.type) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    case 'image/png':
      return 'png';
    default:
      // GIF/BMP/HEIC → PNG keeps quality and transparency
      return 'png';
  }
}

/**
 * Compress an image, optionally to a target size in bytes.
 * Uses quality search first, then dimension reduction as a last resort.
 */
export async function compressImage(
  file: File,
  opts: { format: EncodeFormat; targetBytes?: number; quality?: number },
): Promise<ConvertResult> {
  const bitmap = await decodeImage(file);
  try {
    let width = bitmap.width;
    let height = bitmap.height;

    const encodeAt = async (q: number, w: number, h: number) => {
      const canvas = drawToCanvas(bitmap, w, h, opts.format === 'jpg');
      return encodeCanvas(canvas, opts.format, q);
    };

    if (!opts.targetBytes) {
      const blob = await encodeAt(opts.quality ?? 0.75, width, height);
      return {
        blob,
        name: replaceExtension(file.name, FORMATS[opts.format as FormatId].extension),
        originalSize: file.size,
        newSize: blob.size,
        width,
        height,
      };
    }

    const target = opts.targetBytes;
    let best: Blob | null = null;

    // Up to 4 rounds of dimension reduction
    for (let round = 0; round < 4; round++) {
      if (opts.format === 'png') {
        // PNG has no quality dial — only dimensions help
        const blob = await encodeAt(1, width, height);
        best = blob;
        if (blob.size <= target) break;
      } else {
        // Binary search quality in [0.05, 0.95]
        let lo = 0.05;
        let hi = 0.95;
        let fit: Blob | null = null;
        for (let i = 0; i < 7; i++) {
          const mid = (lo + hi) / 2;
          const blob = await encodeAt(mid, width, height);
          if (blob.size <= target) {
            fit = blob;
            lo = mid;
          } else {
            hi = mid;
          }
        }
        if (fit) {
          best = fit;
          break;
        }
        best = await encodeAt(0.05, width, height);
        if (best.size <= target) break;
      }
      // Still too big → shrink dimensions 30% and try again
      width = Math.max(1, Math.round(width * 0.7));
      height = Math.max(1, Math.round(height * 0.7));
    }

    if (!best) throw new ConversionError('Compression failed.');
    return {
      blob: best,
      name: replaceExtension(file.name, FORMATS[opts.format as FormatId].extension),
      originalSize: file.size,
      newSize: best.size,
      width,
      height,
    };
  } finally {
    bitmap.close();
  }
}
