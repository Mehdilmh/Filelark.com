'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList } from './shared';
import { ENGINE_NOTE, useVideoRunner } from './videoShared';

const PRESETS = [
  { id: 'light', label: 'Light (best quality)', crf: 23 },
  { id: 'balanced', label: 'Balanced (recommended)', crf: 28 },
  { id: 'strong', label: 'Strong (smallest file)', crf: 33 },
] as const;

export default function VideoCompressWidget() {
  const { busy, loadingEngine, progress, results, errors, setErrors, run } = useVideoRunner();
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>(PRESETS[1]);
  const [file, setFile] = useState<File | null>(null);

  async function compress() {
    if (!file) return;
    await run(async (hooks) => {
      const { compressVideo } = await import('@/lib/convert/video');
      const r = await compressVideo(file, { crf: preset.crf, ...hooks });
      return [{ name: r.name, blob: r.blob, originalSize: file.size }];
    });
  }

  return (
    <div>
      <DropZone
        accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
        multiple={false}
        onFiles={(f) => {
          setFile(f[0]);
          setErrors([]);
        }}
        hint="video"
        disabled={busy}
      />
      {file && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-white">{file.name}</strong> ready.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              preset.id === p.id
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
            onClick={() => setPreset(p)}
            disabled={busy}
          >
            {p.label}
          </button>
        ))}
        <button className="btn-primary" onClick={compress} disabled={busy || !file}>
          {busy ? 'Compressing…' : 'Compress video'}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {ENGINE_NOTE} Re-encoding runs at roughly real-time speed — best for clips, not full movies.
      </p>

      {busy && (
        <ProgressBar
          value={loadingEngine ? 0 : progress}
          label={loadingEngine ? 'Loading conversion engine…' : `Compressing… ${Math.round(progress)}%`}
        />
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="compressed-video.zip" />
    </div>
  );
}
