'use client';

import { useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList } from './shared';
import { ENGINE_NOTE, parseTime, useVideoRunner } from './videoShared';

export default function VideoToGifWidget() {
  const { busy, loadingEngine, progress, results, errors, setErrors, run } = useVideoRunner();
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState('0');
  const [duration, setDuration] = useState('5');
  const [width, setWidth] = useState(480);
  const [fps, setFps] = useState(12);

  async function convert() {
    if (!file) return;
    const startSec = parseTime(start) ?? 0;
    const durationSec = parseTime(duration);
    if (!durationSec || durationSec <= 0 || durationSec > 30) {
      setErrors(['Enter a duration between 1 and 30 seconds — longer GIFs get enormous.']);
      return;
    }
    await run(async (hooks) => {
      const { videoToGif } = await import('@/lib/convert/video');
      const r = await videoToGif(file, {
        fps,
        width,
        start: startSec,
        duration: durationSec,
        ...hooks,
      });
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
          Start at
          <input type="text" className="input-field w-20" value={start} onChange={(e) => setStart(e.target.value)} disabled={busy} placeholder="0:00" />
        </label>
        <label className="flex items-center gap-2">
          Duration
          <input type="text" className="input-field w-16" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={busy} />
          s
        </label>
        <label className="flex items-center gap-2">
          Width
          <select className="input-field" value={width} onChange={(e) => setWidth(parseInt(e.target.value, 10))} disabled={busy}>
            <option value={320}>320 px (chat)</option>
            <option value={480}>480 px (standard)</option>
            <option value={640}>640 px (large)</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          Frame rate
          <select className="input-field" value={fps} onChange={(e) => setFps(parseInt(e.target.value, 10))} disabled={busy}>
            <option value={8}>8 fps (small)</option>
            <option value={12}>12 fps (smooth)</option>
            <option value={15}>15 fps (smoothest)</option>
          </select>
        </label>
        <button className="btn-primary" onClick={convert} disabled={busy || !file}>
          {busy ? 'Converting…' : 'Convert to GIF'}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ENGINE_NOTE}</p>

      {busy && (
        <ProgressBar
          value={loadingEngine ? 0 : progress}
          label={loadingEngine ? 'Loading conversion engine…' : 'Building GIF…'}
        />
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="gifs.zip" />
    </div>
  );
}
