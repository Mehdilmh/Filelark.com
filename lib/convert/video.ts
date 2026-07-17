import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { checkFileSize, ConversionError, replaceExtension } from './util';

/**
 * Browser-side video engine built on ffmpeg.wasm (single-thread core, so no
 * cross-origin-isolation headers are required). The ~31 MB core is served
 * from /public and loaded once per session, only when a video tool is used.
 */

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export async function getFFmpeg(onLoadStart?: () => void): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (!loadPromise) {
    loadPromise = (async () => {
      onLoadStart?.();
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpeg = new FFmpeg();
      // Surface ffmpeg's own log in the devtools console for diagnostics
      ffmpeg.on('log', ({ message }) => console.debug('[ffmpeg]', message));
      // Absolute URLs are required: the library resolves relative URLs
      // against the bundled module's base (file://) instead of the page.
      const base = window.location.origin;
      await ffmpeg.load({
        coreURL: `${base}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${base}/ffmpeg/ffmpeg-core.wasm`,
        classWorkerURL: `${base}/ffmpeg/worker.js`,
      });
      ffmpegInstance = ffmpeg;
      return ffmpeg;
    })().catch((err) => {
      loadPromise = null;
      throw err;
    });
  }
  return loadPromise;
}

interface RunOptions {
  onProgress?: (percent: number) => void;
  onLoadStart?: () => void;
}

async function runFFmpeg(
  file: File,
  args: (inName: string, outName: string) => string[],
  outName: string,
  outMime: string,
  options: RunOptions = {},
): Promise<Blob> {
  checkFileSize(file);
  const ffmpeg = await getFFmpeg(options.onLoadStart);

  const inName = `in-${Date.now()}.${(file.name.split('.').pop() || 'mp4').toLowerCase()}`;
  const progressHandler = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress) && progress >= 0 && progress <= 1) {
      options.onProgress?.(progress * 100);
    }
  };

  ffmpeg.on('progress', progressHandler);
  try {
    await ffmpeg.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
    const code = await ffmpeg.exec(args(inName, outName));
    if (code !== 0) {
      throw new ConversionError(
        `"${file.name}" could not be processed. The file may be corrupt or use an unsupported codec.`,
      );
    }
    const data = await ffmpeg.readFile(outName);
    if (typeof data === 'string' || data.length === 0) {
      throw new ConversionError(`"${file.name}" produced no output.`);
    }
    return new Blob([data as unknown as BlobPart], { type: outMime });
  } finally {
    ffmpeg.off('progress', progressHandler);
    // Best-effort cleanup of the in-memory FS
    ffmpeg.deleteFile(inName).catch(() => {});
    ffmpeg.deleteFile(outName).catch(() => {});
  }
}

/* ------------------------------------------------------------------ */

export async function videoToMp3(
  file: File,
  options: RunOptions = {},
): Promise<{ blob: Blob; name: string }> {
  const blob = await runFFmpeg(
    file,
    (inName, outName) => ['-i', inName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outName],
    'out.mp3',
    'audio/mpeg',
    options,
  );
  return { blob, name: replaceExtension(file.name, 'mp3') };
}

export async function videoToGif(
  file: File,
  opts: { fps: number; width: number; start?: number; duration?: number } & RunOptions,
): Promise<{ blob: Blob; name: string }> {
  const filters = `fps=${opts.fps},scale=${opts.width}:-2:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
  const blob = await runFFmpeg(
    file,
    (inName, outName) => [
      ...(opts.start ? ['-ss', String(opts.start)] : []),
      ...(opts.duration ? ['-t', String(opts.duration)] : []),
      '-i',
      inName,
      '-vf',
      filters,
      '-f',
      'gif',
      outName,
    ],
    'out.gif',
    'image/gif',
    opts,
  );
  return { blob, name: replaceExtension(file.name, 'gif') };
}

export async function compressVideo(
  file: File,
  opts: { crf: number } & RunOptions,
): Promise<{ blob: Blob; name: string }> {
  const blob = await runFFmpeg(
    file,
    (inName, outName) => [
      '-i',
      inName,
      '-vcodec',
      'libx264',
      '-crf',
      String(opts.crf),
      '-preset',
      'veryfast',
      '-acodec',
      'aac',
      '-b:a',
      '96k',
      '-movflags',
      '+faststart',
      outName,
    ],
    'out.mp4',
    'video/mp4',
    opts,
  );
  return {
    blob,
    name: replaceExtension(file.name, '').replace(/\.$/, '') + '-compressed.mp4',
  };
}

export async function trimVideo(
  file: File,
  opts: { start: number; end: number } & RunOptions,
): Promise<{ blob: Blob; name: string }> {
  if (opts.end <= opts.start) {
    throw new ConversionError('End time must be after the start time.');
  }
  // Stream copy = no re-encoding, so the output must keep the input's
  // container (e.g. VP8 video is not allowed inside an .mp4).
  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
  const outExt = ext === 'webm' ? 'webm' : ext === 'mkv' ? 'mkv' : 'mp4';
  const outMime =
    outExt === 'webm' ? 'video/webm' : outExt === 'mkv' ? 'video/x-matroska' : 'video/mp4';
  const blob = await runFFmpeg(
    file,
    (inName, outName) => [
      '-ss',
      String(opts.start),
      '-to',
      String(opts.end),
      '-i',
      inName,
      '-c',
      'copy',
      outName,
    ],
    `out.${outExt}`,
    outMime,
    opts,
  );
  return {
    blob,
    name: replaceExtension(file.name, '').replace(/\.$/, '') + `-trimmed.${outExt}`,
  };
}

export const VIDEO_ACCEPT =
  'video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo,.mp4,.webm,.mov,.mkv,.avi,.m4v';
