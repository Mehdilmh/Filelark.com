// Copies runtime assets that must be served as static files into public/.
// Runs automatically before `next dev` and `next build` (see package.json).
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

function pkgDir(name) {
  return dirname(require.resolve(`${name}/package.json`));
}

mkdirSync('public/ffmpeg', { recursive: true });

// pdf.js render worker
copyFileSync(
  join(pkgDir('pdfjs-dist'), 'build', 'pdf.worker.min.mjs'),
  join('public', 'pdf.worker.min.mjs'),
);

// ffmpeg.wasm, single-thread core (no cross-origin isolation needed).
// The FFmpeg class spawns its worker as a MODULE worker, so we self-host the
// ESM builds: the library's own worker (plus the modules it imports) and the
// ESM core (which the worker dynamic-imports at runtime).
// @ffmpeg/* restrict their exports map, so resolve from the main entry.
const ffmpegCoreEsm = join(dirname(require.resolve('@ffmpeg/core')), '..', 'esm');
copyFileSync(join(ffmpegCoreEsm, 'ffmpeg-core.js'), join('public', 'ffmpeg', 'ffmpeg-core.js'));
copyFileSync(join(ffmpegCoreEsm, 'ffmpeg-core.wasm'), join('public', 'ffmpeg', 'ffmpeg-core.wasm'));

const ffmpegLibEsm = join(dirname(require.resolve('@ffmpeg/ffmpeg')), '..', 'esm');
for (const f of ['worker.js', 'const.js', 'errors.js']) {
  copyFileSync(join(ffmpegLibEsm, f), join('public', 'ffmpeg', f));
}

// onnxruntime-web WASM runtime (for background removal). Self-hosted and
// loaded at runtime with a webpack-ignored dynamic import — bundling ort
// breaks Next's minifier. The u2netp model is committed at public/models/.
mkdirSync('public/ort', { recursive: true });
const ortDist = join('node_modules', 'onnxruntime-web', 'dist');
for (const f of [
  'ort.wasm.min.mjs', // wasm-only ESM entry, imported at runtime
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
]) {
  copyFileSync(join(ortDist, f), join('public', 'ort', f));
}

console.log('Copied pdf.js worker and ffmpeg.wasm assets → public/');
