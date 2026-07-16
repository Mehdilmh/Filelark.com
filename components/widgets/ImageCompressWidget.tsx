'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, QualitySlider, ResultsList, ResultFile } from './shared';
import { ALL_IMAGE_ACCEPT } from '@/lib/formats';
import type { EncodeFormat } from '@/lib/convert/image';

export default function ImageCompressWidget() {
  const [pending, setPending] = useState<File[]>([]);
  const [mode, setMode] = useState<'quality' | 'target'>('target');
  const [quality, setQuality] = useState(0.75);
  const [targetKB, setTargetKB] = useState('200');
  const [format, setFormat] = useState<EncodeFormat>('jpg');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function run() {
    if (pending.length === 0) {
      setErrors(['Add at least one image first.']);
      return;
    }
    const target = parseInt(targetKB, 10);
    if (mode === 'target' && (!target || target < 5)) {
      setErrors(['Enter a target size of at least 5 KB.']);
      return;
    }

    setBusy(true);
    setResults([]);
    setErrors([]);
    const { compressImage } = await import('@/lib/convert/image');
    const out: ResultFile[] = [];
    const errs: string[] = [];

    for (let i = 0; i < pending.length; i++) {
      const file = pending[i];
      setProgressLabel(`Compressing ${file.name} (${i + 1}/${pending.length})…`);
      try {
        const r = await compressImage(file, {
          format,
          targetBytes: mode === 'target' ? target * 1024 : undefined,
          quality: mode === 'quality' ? quality : undefined,
        });
        out.push({ name: r.name, blob: r.blob, originalSize: r.originalSize });
      } catch (err) {
        errs.push(err instanceof Error ? err.message : `"${file.name}" failed.`);
      }
      setProgress(((i + 1) / pending.length) * 100);
    }

    setResults(out);
    setErrors(errs);
    setBusy(false);
  }

  return (
    <div>
      <DropZone
        accept={ALL_IMAGE_ACCEPT}
        onFiles={(f) => {
          setPending(f);
          setResults([]);
          setErrors([]);
        }}
        hint="images"
        disabled={busy}
      />
      {pending.length > 0 && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          {pending.length} image{pending.length === 1 ? '' : 's'} ready to compress.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex gap-2">
            {(['target', 'quality'] as const).map((m) => (
              <button
                key={m}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === m
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
                onClick={() => setMode(m)}
                disabled={busy}
              >
                {m === 'target' ? 'Target file size' : 'Quality level'}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            Output
            <select
              className="input-field"
              value={format}
              onChange={(e) => setFormat(e.target.value as EncodeFormat)}
              disabled={busy}
            >
              <option value="jpg">JPG (best compatibility)</option>
              <option value="webp">WebP (smallest)</option>
              <option value="png">PNG (lossless)</option>
            </select>
          </label>
        </div>

        {mode === 'target' ? (
          <label className="flex items-center gap-2 text-sm">
            Compress each image to under
            <input
              type="number"
              min={5}
              className="input-field w-28"
              value={targetKB}
              onChange={(e) => setTargetKB(e.target.value)}
              disabled={busy}
            />
            KB
          </label>
        ) : (
          <QualitySlider value={quality} onChange={setQuality} disabled={busy} />
        )}

        <div>
          <button className="btn-primary" onClick={run} disabled={busy || pending.length === 0}>
            {busy ? 'Compressing…' : 'Compress images'}
          </button>
        </div>
      </div>

      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="compressed-images.zip" />
    </div>
  );
}
