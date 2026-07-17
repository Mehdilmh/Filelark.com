'use client';

import { downloadBlob, formatBytes, zipAndDownload } from '@/lib/convert/util';

export interface ResultFile {
  name: string;
  blob: Blob;
  originalSize?: number;
}

export function ErrorAlert({ errors, onDismiss }: { errors: string[]; onDismiss: () => void }) {
  if (errors.length === 0) return null;
  return (
    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
      <div className="flex items-start justify-between gap-4">
        <ul className="list-inside list-disc space-y-1">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
        <button onClick={onDismiss} aria-label="Dismiss errors" className="font-bold">
          ✕
        </button>
      </div>
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="mt-4" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      {label && <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">{label}</p>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-200"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export function ResultsList({
  results,
  zipName,
}: {
  results: ResultFile[];
  zipName: string;
}) {
  if (results.length === 0) return null;
  return (
    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
          ✓ Done — {results.length} file{results.length === 1 ? '' : 's'} ready
        </p>
        {results.length > 1 && (
          <button
            className="btn-secondary text-sm"
            onClick={() => zipAndDownload(results, zipName)}
          >
            Download all (ZIP)
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {results.map((r, i) => (
          <li
            key={`${r.name}-${i}`}
            className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-900"
          >
            <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{r.name}</span>
            <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
              {r.originalSize !== undefined && (
                <>
                  <s>{formatBytes(r.originalSize)}</s>{' → '}
                </>
              )}
              {formatBytes(r.blob.size)}
            </span>
            <button className="btn-primary !px-3 !py-1 text-xs" onClick={() => downloadBlob(r.blob, r.name)}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function QualitySlider({
  value,
  onChange,
  label = 'Quality',
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
      <span className="shrink-0 font-medium">{label}</span>
      <input
        type="range"
        min={10}
        max={100}
        step={5}
        value={Math.round(value * 100)}
        disabled={disabled}
        onChange={(e) => onChange(parseInt(e.target.value, 10) / 100)}
        className="w-full accent-brand-600"
      />
      <span className="w-10 shrink-0 text-right tabular-nums">{Math.round(value * 100)}%</span>
    </label>
  );
}
