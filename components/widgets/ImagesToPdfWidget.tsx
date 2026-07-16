'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList, ResultFile } from './shared';
import { ALL_IMAGE_ACCEPT } from '@/lib/formats';
import { formatBytes } from '@/lib/convert/util';

export default function ImagesToPdfWidget() {
  const [pending, setPending] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  function move(index: number, dir: -1 | 1) {
    setPending((list) => {
      const next = [...list];
      const j = index + dir;
      if (j < 0 || j >= next.length) return list;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  async function run() {
    if (pending.length === 0) {
      setErrors(['Add at least one image first.']);
      return;
    }
    setBusy(true);
    setResults([]);
    setErrors([]);

    try {
      const { imagesToPdf } = await import('@/lib/convert/pdf');
      const blob = await imagesToPdf(pending, (done, total) => {
        setProgressLabel(`Adding image ${done} of ${total}…`);
        setProgress((done / total) * 100);
      });
      setResults([{ name: 'images.pdf', blob }]);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Failed to create the PDF.']);
    }
    setBusy(false);
  }

  return (
    <div>
      <DropZone
        accept={ALL_IMAGE_ACCEPT}
        onFiles={(f) => {
          setPending((prev) => [...prev, ...f]);
          setResults([]);
          setErrors([]);
        }}
        hint="images"
        disabled={busy}
      />

      {pending.length > 0 && (
        <ul className="mt-4 space-y-2">
          {pending.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="w-6 text-center text-xs font-semibold text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{f.name}</span>
              <span className="text-xs text-slate-400">{formatBytes(f.size)}</span>
              <div className="flex gap-1">
                <button className="btn-secondary !px-2 !py-1 text-xs" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move up">↑</button>
                <button className="btn-secondary !px-2 !py-1 text-xs" onClick={() => move(i, 1)} disabled={busy || i === pending.length - 1} aria-label="Move down">↓</button>
                <button
                  className="btn-secondary !px-2 !py-1 text-xs"
                  onClick={() => setPending((list) => list.filter((_, j) => j !== i))}
                  disabled={busy}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <button className="btn-primary" onClick={run} disabled={busy || pending.length === 0}>
          {busy ? 'Creating PDF…' : `Create PDF${pending.length > 0 ? ` (${pending.length} page${pending.length === 1 ? '' : 's'})` : ''}`}
        </button>
      </div>

      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="images-pdf.zip" />
    </div>
  );
}
