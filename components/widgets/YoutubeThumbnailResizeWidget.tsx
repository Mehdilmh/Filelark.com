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

export default function YoutubeThumbnailResizeWidget() {
  const [mode, setMode] = useState<'fill' | 'fit'>('fill');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  async function process(f: File, m: 'fill' | 'fit') {
    setBusy(true);
    setErrors([]);
    setResult(null);
    try {
      const { makeYoutubeThumbnail } = await import('@/lib/convert/image');
      const r = await makeYoutubeThumbnail(f, m);
      setResult({ blob: r.blob, name: r.name, url: URL.createObjectURL(r.blob) });
    } catch (err) {
      setErrors([
        err instanceof Error && err.message
          ? err.message
          : 'This image could not be processed.',
      ]);
    }
    setBusy(false);
  }

  return (
    <div>
      <DropZone
        accept={ALL_IMAGE_ACCEPT}
        multiple={false}
        onFiles={(files) => {
          setFile(files[0]);
          process(files[0], mode);
        }}
        hint="image"
        disabled={busy}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          If the image isn&apos;t 16:9:
        </span>
        {(
          [
            ['fill', 'Crop to fill (recommended)'],
            ['fit', 'Fit with black bars'],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === m
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
            onClick={() => {
              setMode(m);
              if (file) process(file, m);
            }}
            disabled={busy}
          >
            {label}
          </button>
        ))}
      </div>

      {busy && (
        <p className="mt-4 animate-pulse text-sm text-slate-500 dark:text-slate-400">
          Resizing to 1280×720…
        </p>
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />

      {result && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="mb-3 font-semibold text-emerald-800 dark:text-emerald-300">
            ✓ Ready — 1280×720 JPG, {formatBytes(result.blob.size)} (limit: 2 MB)
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.url}
            alt="YouTube thumbnail preview at 1280×720"
            className="w-full max-w-xl rounded-lg shadow"
          />
          <div className="mt-4">
            <button className="btn-primary" onClick={() => downloadBlob(result.blob, result.name)}>
              Download thumbnail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
