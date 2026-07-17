'use client';

import DropZone from '../DropZone';
import { ErrorAlert, ProgressBar, ResultsList } from './shared';
import { ENGINE_NOTE, useVideoRunner } from './videoShared';

export default function VideoToMp3Widget() {
  const { busy, loadingEngine, progress, results, errors, setErrors, run } = useVideoRunner();

  async function handleFiles(files: File[]) {
    await run(async (hooks) => {
      const { videoToMp3 } = await import('@/lib/convert/video');
      const out = [];
      for (const file of files) {
        const r = await videoToMp3(file, hooks);
        out.push({ name: r.name, blob: r.blob, originalSize: file.size });
      }
      return out;
    });
  }

  return (
    <div>
      <DropZone
        accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
        onFiles={handleFiles}
        hint="videos"
        disabled={busy}
      />
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ENGINE_NOTE}</p>
      {busy && (
        <ProgressBar
          value={loadingEngine ? 0 : progress}
          label={loadingEngine ? 'Loading conversion engine…' : 'Extracting audio…'}
        />
      )}
      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />
      <ResultsList results={results} zipName="audio.zip" />
    </div>
  );
}
