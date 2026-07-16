'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList, ResultFile } from './shared';

export default function SplitPdfWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<'range' | 'every'>('range');
  const [ranges, setRanges] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setResults([]);
    setErrors([]);
    setPageCount(null);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: false });
      setPageCount(doc.getPageCount());
    } catch {
      setFile(null);
      setErrors([`"${f.name}" could not be opened. It may be corrupt or password-protected.`]);
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setResults([]);
    setErrors([]);
    try {
      const pdf = await import('@/lib/convert/pdf');
      if (mode === 'range') {
        const blob = await pdf.extractPages(file, ranges);
        setResults([{ name: pdf.pdfOutputName(file, 'pages'), blob }]);
      } else {
        const parts = await pdf.splitEveryPage(file, (done, total) =>
          setProgress((done / total) * 100),
        );
        setResults(parts);
      }
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Splitting failed.']);
    }
    setBusy(false);
  }

  return (
    <div>
      <DropZone accept="application/pdf,.pdf" multiple={false} onFiles={handleFiles} hint="PDF file" disabled={busy} />

      {file && pageCount !== null && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-white">{file.name}</strong> — {pageCount} page{pageCount === 1 ? '' : 's'}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === 'range' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            onClick={() => setMode('range')}
            disabled={busy}
          >
            Extract page range
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === 'every' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            onClick={() => setMode('every')}
            disabled={busy}
          >
            Split every page
          </button>
        </div>

        {mode === 'range' && (
          <label className="flex flex-wrap items-center gap-2 text-sm">
            Pages to extract
            <input
              type="text"
              placeholder="e.g. 1-3, 7, 12-14"
              className="input-field w-56"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              disabled={busy}
            />
          </label>
        )}

        <div>
          <button className="btn-primary" onClick={run} disabled={busy || !file || (mode === 'range' && !ranges.trim())}>
            {busy ? 'Splitting…' : mode === 'range' ? 'Extract pages' : 'Split every page'}
          </button>
        </div>
      </div>

      {busy && mode === 'every' && <ProgressBar value={progress} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName={`${file?.name.replace(/\.pdf$/i, '') ?? 'split'}-pages.zip`} />
    </div>
  );
}
