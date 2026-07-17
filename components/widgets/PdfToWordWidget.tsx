'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList, ResultFile } from './shared';

export default function PdfToWordWidget() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(files: File[]) {
    setBusy(true);
    setResults([]);
    setErrors([]);

    const { pdfToWord } = await import('@/lib/convert/pdf');
    const out: ResultFile[] = [];
    const errs: string[] = [];

    for (const file of files) {
      try {
        const r = await pdfToWord(file, (done, total) => {
          setProgressLabel(`Extracting page ${done} of ${total} — ${file.name}`);
          setProgress((done / total) * 100);
        });
        out.push({ name: r.name, blob: r.blob, originalSize: file.size });
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
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Extracts the text of each page into an editable .docx — complex layouts are simplified,
        and scanned PDFs (no text layer) are not supported.
      </p>
      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="pdf-to-word.zip" />
    </div>
  );
}
