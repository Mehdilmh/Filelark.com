'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList, ResultFile } from './shared';
import { formatBytes } from '@/lib/convert/util';

export default function MergePdfWidget() {
  const [pending, setPending] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
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
    if (pending.length < 2) {
      setErrors(['Add at least two PDFs to merge.']);
      return;
    }
    setBusy(true);
    setResults([]);
    setErrors([]);
    try {
      const { mergePdfs } = await import('@/lib/convert/pdf');
      const blob = await mergePdfs(pending, (done, total) => setProgress((done / total) * 100));
      setResults([{ name: 'merged.pdf', blob }]);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Merging failed.']);
    }
    setBusy(false);
  }

  return (
    <div>
      <DropZone
        accept="application/pdf,.pdf"
        onFiles={(f) => {
          setPending((prev) => [...prev, ...f]);
          setResults([]);
          setErrors([]);
        }}
        hint="PDF files"
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
        <button className="btn-primary" onClick={run} disabled={busy || pending.length < 2}>
          {busy ? 'Merging…' : `Merge ${pending.length || ''} PDFs`.trim()}
        </button>
      </div>

      {busy && <ProgressBar value={progress} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="merged.zip" />
    </div>
  );
}
