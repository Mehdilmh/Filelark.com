'use client';

import { useEffect, useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert } from './shared';
import { downloadBlob, formatBytes } from '@/lib/convert/util';
import { ALL_IMAGE_ACCEPT } from '@/lib/formats';

interface Result {
  blob: Blob;
  name: string;
  url: string;
}

export default function RemoveBackgroundWidget() {
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  async function handleFiles(files: File[]) {
    const f = files[0];
    setFile(f);
    setResult(null);
    setErrors([]);
    setBusy(true);
    try {
      const { removeBackground } = await import('@/lib/convert/bgremove');
      const r = await removeBackground(f, {
        background: 'transparent',
        onLoadStart: () => setStage('Loading AI model (~4.5 MB, first time only)…'),
        onProgress: setStage,
      });
      setResult({ blob: r.blob, name: r.name, url: URL.createObjectURL(r.blob) });
    } catch (err) {
      setErrors([
        err instanceof Error && err.message
          ? err.message
          : 'The background could not be removed from this image.',
      ]);
    }
    setBusy(false);
    setStage('');
  }

  async function downloadWithWhiteBg() {
    if (!file) return;
    setBusy(true);
    try {
      const { removeBackground } = await import('@/lib/convert/bgremove');
      const r = await removeBackground(file, { background: '#ffffff' });
      downloadBlob(r.blob, r.name);
    } catch {
      setErrors(['Could not generate the white-background version.']);
    }
    setBusy(false);
  }

  return (
    <div>
      <DropZone
        accept={ALL_IMAGE_ACCEPT}
        multiple={false}
        onFiles={handleFiles}
        hint="image"
        disabled={busy}
      />

      {busy && (
        <p className="mt-4 animate-pulse text-sm text-slate-500 dark:text-slate-400">
          {stage || 'Working…'}
        </p>
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />

      {result && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="mb-3 font-semibold text-emerald-800 dark:text-emerald-300">
            ✓ Background removed
          </p>
          <div
            className="flex items-center justify-center rounded-lg p-4"
            style={{
              // checkerboard so the transparency is visible
              backgroundImage:
                'linear-gradient(45deg,#e2e8f0 25%,transparent 25%,transparent 75%,#e2e8f0 75%),linear-gradient(45deg,#e2e8f0 25%,transparent 25%,transparent 75%,#e2e8f0 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0,10px 10px',
              backgroundColor: '#f8fafc',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Result with background removed" className="max-h-80 max-w-full" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="btn-primary" onClick={() => downloadBlob(result.blob, result.name)}>
              Download PNG (transparent)
            </button>
            <button className="btn-secondary" onClick={downloadWithWhiteBg} disabled={busy}>
              Download JPG (white background)
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(result.blob.size)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
