'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ResultsList, ResultFile } from './shared';
import type { PageEdit } from '@/lib/convert/pdf';

interface Thumb {
  pageNumber: number;
  dataUrl: string;
}

export default function RotatePdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [edits, setEdits] = useState<PageEdit[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setThumbs([]);
    setEdits([]);
    setResults([]);
    setErrors([]);
    setLoading(true);
    try {
      const { pdfThumbnails } = await import('@/lib/convert/pdf');
      const t = await pdfThumbnails(f);
      setThumbs(t);
      setEdits(t.map(() => ({ rotate: 0, deleted: false })));
    } catch (err) {
      setFile(null);
      setErrors([err instanceof Error ? err.message : `"${f.name}" could not be opened.`]);
    }
    setLoading(false);
  }

  function rotatePage(i: number) {
    setEdits((list) => list.map((e, j) => (j === i ? { ...e, rotate: (e.rotate + 90) % 360 } : e)));
  }
  function toggleDelete(i: number) {
    setEdits((list) => list.map((e, j) => (j === i ? { ...e, deleted: !e.deleted } : e)));
  }

  async function apply() {
    if (!file) return;
    setBusy(true);
    setResults([]);
    setErrors([]);
    try {
      const { rotateDeletePdf, pdfOutputName } = await import('@/lib/convert/pdf');
      const blob = await rotateDeletePdf(file, edits);
      setResults([{ name: pdfOutputName(file, 'edited'), blob }]);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Editing failed.']);
    }
    setBusy(false);
  }

  const changed = edits.some((e) => e.rotate !== 0 || e.deleted);

  return (
    <div>
      <DropZone accept="application/pdf,.pdf" multiple={false} onFiles={handleFiles} hint="PDF file" disabled={busy || loading} />

      {loading && (
        <p className="mt-4 animate-pulse text-sm text-slate-500 dark:text-slate-400">
          Rendering page previews…
        </p>
      )}

      {thumbs.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {thumbs.map((t, i) => (
              <div
                key={t.pageNumber}
                className={`rounded-xl border p-2 text-center transition ${
                  edits[i]?.deleted
                    ? 'border-red-300 bg-red-50 opacity-60 dark:border-red-900 dark:bg-red-950/30'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex h-36 items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.dataUrl}
                    alt={`Page ${t.pageNumber}`}
                    className="max-h-32 max-w-full shadow transition-transform"
                    style={{ transform: `rotate(${edits[i]?.rotate ?? 0}deg)` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Page {t.pageNumber}</p>
                <div className="mt-1 flex justify-center gap-1">
                  <button
                    className="btn-secondary !px-2 !py-1 text-xs"
                    onClick={() => rotatePage(i)}
                    disabled={busy || edits[i]?.deleted}
                    aria-label={`Rotate page ${t.pageNumber}`}
                    title="Rotate 90° clockwise"
                  >
                    ⟳
                  </button>
                  <button
                    className="btn-secondary !px-2 !py-1 text-xs"
                    onClick={() => toggleDelete(i)}
                    disabled={busy}
                    aria-label={`${edits[i]?.deleted ? 'Restore' : 'Delete'} page ${t.pageNumber}`}
                    title={edits[i]?.deleted ? 'Restore page' : 'Delete page'}
                  >
                    {edits[i]?.deleted ? '↩' : '🗑'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button className="btn-primary" onClick={apply} disabled={busy || !changed}>
              {busy ? 'Applying…' : 'Apply changes & download'}
            </button>
          </div>
        </>
      )}

      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="edited-pdf.zip" />
    </div>
  );
}
