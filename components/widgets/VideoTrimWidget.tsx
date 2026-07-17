'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList } from './shared';
import { ENGINE_NOTE, parseTime, useVideoRunner } from './videoShared';

export default function VideoTrimWidget() {
  const { busy, loadingEngine, progress, results, errors, setErrors, run } = useVideoRunner();
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState('0:00');
  const [end, setEnd] = useState('');

  async function trim() {
    if (!file) return;
    const startSec = parseTime(start);
    const endSec = parseTime(end);
    if (startSec === null || endSec === null) {
      setErrors(['Enter times as seconds (90) or minutes:seconds (1:30).']);
      return;
    }
    if (endSec <= startSec) {
      setErrors(['End time must be after the start time.']);
      return;
    }
    await run(async (hooks) => {
      const { trimVideo } = await import('@/lib/convert/video');
      const r = await trimVideo(file, { start: startSec, end: endSec, ...hooks });
      return [{ name: r.name, blob: r.blob, originalSize: file.size }];
    });
  }

  return (
    <div>
      <DropZone
        accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
        multiple={false}
        onFiles={(f) => {
          setFile(f[0]);
          setErrors([]);
        }}
        hint="video"
        disabled={busy}
      />
      {file && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-white">{file.name}</strong> ready.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          Start
          <input
            type="text"
            className="input-field w-24"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="0:00"
            disabled={busy}
          />
        </label>
        <label className="flex items-center gap-2">
          End
          <input
            type="text"
            className="input-field w-24"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="1:30"
            disabled={busy}
          />
        </label>
        <button className="btn-primary" onClick={trim} disabled={busy || !file || !end.trim()}>
          {busy ? 'Trimming…' : 'Trim video'}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {ENGINE_NOTE} Trimming is lossless and nearly instant — the cut starts at the nearest keyframe.
      </p>

      {busy && (
        <ProgressBar
          value={loadingEngine ? 0 : progress}
          label={loadingEngine ? 'Loading conversion engine…' : 'Trimming…'}
        />
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="trimmed-video.zip" />
    </div>
  );
}
