'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList, ResultFile } from './shared';

const PRESETS = [
  { id: 'light', label: 'Light (best quality)', quality: 0.85, scale: 2 },
  { id: 'balanced', label: 'Balanced (recommended)', quality: 0.7, scale: 1.5 },
  { id: 'strong', label: 'Strong (smallest file)', quality: 0.5, scale: 1.2 },
] as const;

export default function CompressPdfWidget() {
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>(PRESETS[1]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFiles(files: File[]) {
    setBusy(true);
    setResults([]);
    setErrors([]);

    const { compressPdf, pdfOutputName } = await import('@/lib/convert/pdf');
    const out: ResultFile[] = [];
    const errs: string[] = [];

    for (const file of files) {
      try {
        const blob = await compressPdf(file, {
          quality: preset.quality,
          scale: preset.scale,
          onProgress: (done, total) => {
            setProgressLabel(`Compressing page ${done} of ${total} — ${file.name}`);
            setProgress((done / total) * 100);
          },
        });
        out.push({ name: pdfOutputName(file, 'compressed'), blob, originalSize: file.size });
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

      <div className="mt-4 flex flex-wrap gap-2">
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
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Note: compression re-renders pages as optimized images, so text in the output is no longer selectable.
      </p>

      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="compressed-pdfs.zip" />
    </div>
  );
}
