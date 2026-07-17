'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, QualitySlider, ResultsList, ResultFile } from './shared';

export default function PdfToImagesWidget() {
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(files: File[]) {
    setBusy(true);
    setResults([]);
    setErrors([]);
    setProgress(0);

    const { pdfToImages } = await import('@/lib/convert/pdf');
    const out: ResultFile[] = [];
    const errs: string[] = [];

    for (const file of files) {
      try {
        const pages = await pdfToImages(file, {
          format,
          quality,
          onProgress: (done, total) => {
            setProgressLabel(`Rendering page ${done} of ${total} — ${file.name}`);
            setProgress((done / total) * 100);
          },
        });
        out.push(...pages.map((p) => ({ name: p.name, blob: p.blob })));
      } catch (err) {
        errs.push(err instanceof Error ? err.message : `"${file.name}" failed.`);
      }
    }

    setResults(out);
    setErrors(errs);
    setBusy(false);
  }

  return (
    <div>
      <DropZone accept="application/pdf,.pdf" onFiles={handleFiles} hint="PDF files" disabled={busy} />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Output format
          <select
            className="input-field"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'jpg' | 'png')}
            disabled={busy}
          >
            <option value="jpg">JPG (smaller files)</option>
            <option value="png">PNG (lossless)</option>
          </select>
        </label>
        {format === 'jpg' && (
          <div className="flex-1">
            <QualitySlider value={quality} onChange={setQuality} disabled={busy} />
          </div>
        )}
      </div>

      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName={`pdf-pages-${format}.zip`} />
    </div>
  );
}
