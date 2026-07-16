// Copies the pdf.js worker into public/ so it can be served as a static file.
// Runs automatically before `next dev` and `next build` (see package.json).
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const workerSrc = join(
  dirname(require.resolve('pdfjs-dist/package.json')),
  'build',
  'pdf.worker.min.mjs',
);

mkdirSync('public', { recursive: true });
copyFileSync(workerSrc, join('public', 'pdf.worker.min.mjs'));
console.log('Copied pdf.worker.min.mjs → public/');
