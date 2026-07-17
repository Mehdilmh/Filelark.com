'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList, ResultFile } from './shared';
import { ALL_IMAGE_ACCEPT } from '@/lib/formats';

export default function ImageResizeWidget() {
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percent, setPercent] = useState('50');
  const [lockAspect, setLockAspect] = useState(true);
  const [pending, setPending] = useState<File[]>([]);
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
    const w = parseInt(width, 10) || undefined;
    const h = parseInt(height, 10) || undefined;
    const p = parseFloat(percent) || undefined;
    if (mode === 'pixels' && !w && !h) {
      setErrors(['Enter a width and/or height in pixels.']);
      return;
    }
    if (mode === 'percent' && (!p || p <= 0)) {
      setErrors(['Enter a valid percentage.']);
      return;
    }

    setBusy(true);
    setResults([]);
    setErrors([]);
    const { convertImage, preservedFormat } = await import('@/lib/convert/image');
    const out: ResultFile[] = [];
    const errs: string[] = [];

    for (let i = 0; i < pending.length; i++) {
      const file = pending[i];
      setProgressLabel(`Resizing ${file.name} (${i + 1}/${pending.length})…`);
      try {
        const r = await convertImage(file, preservedFormat(file), {
          quality: 0.92,
          resize:
            mode === 'pixels'
              ? { mode, width: w, height: h, lockAspect }
              : { mode, percent: p },
        });
        out.push({
          name: r.name.replace(/(\.[^.]+)$/, `-${r.width}x${r.height}$1`),
          blob: r.blob,
          originalSize: r.originalSize,
        });
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
          {pending.length} image{pending.length === 1 ? '' : 's'} ready to resize.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2">
          {(['pixels', 'percent'] as const).map((m) => (
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
              {m === 'pixels' ? 'Exact pixels' : 'Percentage'}
            </button>
          ))}
        </div>

        {mode === 'pixels' ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              Width
              <input
                type="number"
                min={1}
                placeholder="auto"
                className="input-field w-28"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                disabled={busy}
              />
              px
            </label>
            <label className="flex items-center gap-2">
              Height
              <input
                type="number"
                min={1}
                placeholder="auto"
                className="input-field w-28"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                disabled={busy}
              />
              px
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="accent-brand-600"
                disabled={busy}
              />
              Lock aspect ratio
            </label>
          </div>
        ) : (
          <label className="flex items-center gap-2 text-sm">
            Scale to
            <input
              type="number"
              min={1}
              max={1000}
              className="input-field w-24"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              disabled={busy}
            />
            % of original size
          </label>
        )}

        <div>
          <button className="btn-primary" onClick={run} disabled={busy || pending.length === 0}>
            {busy ? 'Resizing…' : 'Resize images'}
          </button>
        </div>
      </div>

      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="resized-images.zip" />
    </div>
  );
}
