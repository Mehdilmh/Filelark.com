export const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB guard

export class ConversionError extends Error {}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function checkFileSize(file: File) {
  if (file.size > MAX_FILE_BYTES) {
    throw new ConversionError(
      `"${file.name}" is larger than 100 MB. Please use a smaller file.`,
    );
  }
  if (file.size === 0) {
    throw new ConversionError(`"${file.name}" is empty.`);
  }
}

export function replaceExtension(name: string, ext: string): string {
  const base = name.replace(/\.[^./\\]+$/, '');
  return `${base}.${ext}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment before revoking
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function zipAndDownload(
  files: { name: string; blob: Blob }[],
  zipName: string,
) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const used = new Set<string>();
  for (const f of files) {
    // De-duplicate names inside the archive
    let name = f.name;
    let i = 1;
    while (used.has(name)) {
      name = f.name.replace(/(\.[^.]+)?$/, `-${i}$1`);
      i += 1;
    }
    used.add(name);
    zip.file(name, f.blob);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, zipName);
}
