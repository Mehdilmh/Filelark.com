import type { InferenceSession, Tensor } from 'onnxruntime-web';
import { decodeImage } from './image';
import { checkFileSize, ConversionError, replaceExtension } from './util';

type OrtNamespace = typeof import('onnxruntime-web');

let ortPromise: Promise<OrtNamespace> | null = null;

/**
 * Load the self-hosted onnxruntime ESM build at runtime. A plain
 * `import('onnxruntime-web')` would make webpack bundle it, which breaks
 * Next's minifier — so the import is deliberately opaque to the bundler.
 */
function getOrt(): Promise<OrtNamespace> {
  if (!ortPromise) {
    ortPromise = (
      new Function("return import('/ort/ort.wasm.min.mjs')")() as Promise<OrtNamespace>
    ).then((ort) => {
      ort.env.wasm.wasmPaths = '/ort/';
      // Single-threaded: avoids the SharedArrayBuffer / cross-origin-isolation requirement
      ort.env.wasm.numThreads = 1;
      return ort;
    });
    ortPromise.catch(() => {
      ortPromise = null;
    });
  }
  return ortPromise;
}

/**
 * Client-side background removal using the U²-Net (small) salient-object
 * model — ~4.5 MB ONNX running on onnxruntime-web's WASM backend. The model
 * and runtime are self-hosted under /public; nothing is uploaded.
 */

const MODEL_URL = '/models/u2netp.onnx';
const INPUT_SIZE = 320;
// Standard ImageNet normalisation used by the U²-Net family
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

let sessionPromise: Promise<InferenceSession> | null = null;

async function getSession(onLoadStart?: () => void): Promise<InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      onLoadStart?.();
      const ort = await getOrt();
      return ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ['wasm'],
      });
    })().catch((err) => {
      sessionPromise = null;
      throw err;
    });
  }
  return sessionPromise;
}

export interface BgRemoveResult {
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

export async function removeBackground(
  file: File,
  options: {
    /** 'transparent' → PNG with alpha; a CSS color → JPG on that background */
    background?: 'transparent' | string;
    onLoadStart?: () => void;
    onProgress?: (stage: string) => void;
  } = {},
): Promise<BgRemoveResult> {
  checkFileSize(file);
  const background = options.background ?? 'transparent';

  const [session, bitmap] = await Promise.all([
    getSession(options.onLoadStart),
    decodeImage(file),
  ]);

  try {
    options.onProgress?.('Analysing image…');

    // --- Preprocess: letterbox-free resize to 320×320, normalised CHW float ---
    const pre = document.createElement('canvas');
    pre.width = INPUT_SIZE;
    pre.height = INPUT_SIZE;
    const preCtx = pre.getContext('2d', { willReadFrequently: true })!;
    preCtx.drawImage(bitmap, 0, 0, INPUT_SIZE, INPUT_SIZE);
    const { data: rgba } = preCtx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);

    const px = INPUT_SIZE * INPUT_SIZE;
    const input = new Float32Array(3 * px);
    for (let i = 0; i < px; i++) {
      for (let c = 0; c < 3; c++) {
        input[c * px + i] = (rgba[i * 4 + c] / 255 - MEAN[c]) / STD[c];
      }
    }

    const ort = await getOrt();
    const feeds: Record<string, Tensor> = {
      [session.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, INPUT_SIZE, INPUT_SIZE]),
    };
    const results = await session.run(feeds);
    // First output (d0) is the fused, highest-quality mask
    const mask = results[session.outputNames[0]].data as Float32Array;

    // --- Post-process: min-max normalise the mask ---
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < px; i++) {
      if (mask[i] < min) min = mask[i];
      if (mask[i] > max) max = mask[i];
    }
    const range = max - min || 1;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = INPUT_SIZE;
    maskCanvas.height = INPUT_SIZE;
    const maskCtx = maskCanvas.getContext('2d')!;
    const maskImage = maskCtx.createImageData(INPUT_SIZE, INPUT_SIZE);
    for (let i = 0; i < px; i++) {
      const a = Math.round(((mask[i] - min) / range) * 255);
      maskImage.data[i * 4 + 3] = a;
    }
    maskCtx.putImageData(maskImage, 0, 0);

    options.onProgress?.('Compositing…');

    // --- Composite at full resolution: image ∩ upscaled mask ---
    const out = document.createElement('canvas');
    out.width = bitmap.width;
    out.height = bitmap.height;
    const outCtx = out.getContext('2d')!;
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';
    outCtx.drawImage(bitmap, 0, 0);
    outCtx.globalCompositeOperation = 'destination-in';
    outCtx.drawImage(maskCanvas, 0, 0, bitmap.width, bitmap.height);
    outCtx.globalCompositeOperation = 'source-over';

    let blob: Blob | null;
    let name: string;
    if (background === 'transparent') {
      blob = await new Promise<Blob | null>((r) => out.toBlob(r, 'image/png'));
      name = replaceExtension(file.name, '').replace(/\.$/, '') + '-no-bg.png';
    } else {
      const bg = document.createElement('canvas');
      bg.width = out.width;
      bg.height = out.height;
      const bgCtx = bg.getContext('2d')!;
      bgCtx.fillStyle = background;
      bgCtx.fillRect(0, 0, bg.width, bg.height);
      bgCtx.drawImage(out, 0, 0);
      blob = await new Promise<Blob | null>((r) => bg.toBlob(r, 'image/jpeg', 0.92));
      name = replaceExtension(file.name, '').replace(/\.$/, '') + '-new-bg.jpg';
    }
    if (!blob) throw new ConversionError('The result could not be encoded.');

    return { blob, name, width: bitmap.width, height: bitmap.height };
  } finally {
    bitmap.close();
  }
}
