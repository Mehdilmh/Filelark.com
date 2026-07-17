'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, QualitySlider, ResultsList, ResultFile } from './shared';
import { ALL_IMAGE_ACCEPT, FORMATS, FormatId, OUTPUT_FORMATS } from '@/lib/formats';
import type { EncodeFormat } from '@/lib/convert/image';

interface Props {
  from?: FormatId;
  to?: FormatId;
}

export default function ImageConvertWidget({ from, to }: Props) {
  const [target, setTarget] = useState<EncodeFormat>((to as EncodeFormat) ?? 'png');
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [results, setResults] = useState<ResultFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const fromFormat = from ? FORMATS[from] : undefined;
  const accept = fromFormat
    ? [...fromFormat.acceptMimes, `.${fromFormat.extension}`, ...(from === 'heic' ? ['.heif'] : [])].join(',')
    : ALL_IMAGE_ACCEPT;
  const lossy = target !== 'png';

  async function handleFiles(files: File[]) {
    setBusy(true);
    setResults([]);
    setErrors([]);
    setProgress(0);

    const { convertImage } = await import('@/lib/convert/image');
    const out: ResultFile[] = [];
    const errs: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgressLabel(`Converting ${files[i].name} (${i + 1}/${files.length})…`);
      try {
        const r = await convertImage(files[i], target, { quality });
        out.push({ name: r.name, blob: r.blob, originalSize: r.originalSize });
      } catch (err) {
        errs.push(err instanceof Error ? err.message : `"${files[i].name}" failed to convert.`);
      }
      setProgress(((i + 1) / files.length) * 100);
    }

    setResults(out);
    setErrors(errs);
    setBusy(false);
  }

  return (
    <div>
      <DropZone
        accept={accept}
        onFiles={handleFiles}
        hint={fromFormat ? `${fromFormat.name} images` : 'images'}
        disabled={busy}
      />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        {!to && (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Convert to
            <select
              className="input-field"
              value={target}
              onChange={(e) => setTarget(e.target.value as EncodeFormat)}
              disabled={busy}
            >
              {OUTPUT_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {FORMATS[f].name}
                </option>
              ))}
            </select>
          </label>
        )}
        {lossy && (
          <div className="flex-1">
            <QualitySlider value={quality} onChange={setQuality} disabled={busy} />
          </div>
        )}
      </div>

      {busy && <ProgressBar value={progress} label={progressLabel} />}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName={`converted-${target}.zip`} />
    </div>
  );
}
