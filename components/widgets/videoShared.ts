'use client';

import { useState } from 'react';
import type { ResultFile } from './shared';

/** Shared state machine for the ffmpeg.wasm-based video widgets. */
export function useVideoRunner() {
  const [busy, setBusy] = useState(false);
  const [loadingEngine, setLoadingEngine] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function run(
    task: (hooks: {
      onProgress: (p: number) => void;
      onLoadStart: () => void;
    }) => Promise<ResultFile[]>,
  ) {
    setBusy(true);
    setResults([]);
    setErrors([]);
    setProgress(0);
    try {
      const out = await task({
        onProgress: (p) => {
          setLoadingEngine(false);
          setProgress(p);
        },
        onLoadStart: () => setLoadingEngine(true),
      });
      setResults(out);
    } catch (err) {
      console.error('video tool error:', err);
      setErrors([
        err instanceof Error && err.message
          ? err.message
          : 'The video could not be processed. It may use an unsupported codec.',
      ]);
    }
    setLoadingEngine(false);
    setBusy(false);
  }

  return {
    busy,
    loadingEngine,
    progress,
    results,
    errors,
    setErrors,
    run,
  };
}

/** Parse "90", "1:30" or "01:02:03" into seconds. Returns null when invalid. */
export function parseTime(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^\d+(\.\d+)?$/.test(raw)) return parseFloat(raw);
  const parts = raw.split(':').map((p) => p.trim());
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !/^\d+(\.\d+)?$/.test(p))) {
    return null;
  }
  return parts.reduce((acc, p) => acc * 60 + parseFloat(p), 0);
}

export const ENGINE_NOTE =
  'First use downloads the conversion engine (~31 MB) — it’s cached for future visits.';
