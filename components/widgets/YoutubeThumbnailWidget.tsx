'use client';

import { useState } from 'react';
import { ErrorAlert } from './shared';

const QUALITIES = [
  { key: 'maxresdefault', label: 'HD — 1280×720' },
  { key: 'sddefault', label: 'SD — 640×480' },
  { key: 'hqdefault', label: 'HQ — 480×360' },
  { key: 'mqdefault', label: 'Medium — 320×180' },
  { key: 'default', label: 'Small — 120×90' },
] as const;

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

function parseVideoId(input: string): string | null {
  const raw = input.trim();
  if (ID_RE.test(raw)) return raw;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^(www|m|music)\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/')[1] ?? '';
      return ID_RE.test(id) ? id : null;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v');
      if (v && ID_RE.test(v)) return v;
      const m = url.pathname.match(/\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function ThumbCard({ videoId, quality, label }: { videoId: string; quality: string; label: string }) {
  const [available, setAvailable] = useState(true);
  if (!available) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/${quality}.jpg`}
        alt={`YouTube thumbnail ${label}`}
        className="aspect-video w-full bg-slate-100 object-cover dark:bg-slate-800"
        loading="lazy"
        onLoad={(e) => {
          // YouTube serves a 120x90 grey placeholder for missing sizes
          const img = e.currentTarget;
          if (quality !== 'default' && img.naturalWidth <= 120) setAvailable(false);
        }}
        onError={() => setAvailable(false)}
      />
      <div className="flex items-center justify-between gap-2 p-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <a
          href={`/api/thumbnail?v=${videoId}&q=${quality}`}
          className="btn-primary !px-3 !py-1 text-xs"
          download
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default function YoutubeThumbnailWidget() {
  const [input, setInput] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function submit() {
    const id = parseVideoId(input);
    if (!id) {
      setVideoId(null);
      setErrors([
        'That doesn’t look like a YouTube link. Paste a URL like youtube.com/watch?v=…, youtu.be/…, or a Shorts link.',
      ]);
      return;
    }
    setErrors([]);
    setVideoId(id);
  }

  return (
    <div>
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <svg className="mx-auto mb-4 h-12 w-12 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23 12s0-3.85-.5-5.7c-.27-1-1.07-1.8-2.07-2.07C18.6 3.75 12 3.75 12 3.75s-6.6 0-8.43.48c-1 .27-1.8 1.07-2.07 2.07C1 8.15 1 12 1 12s0 3.85.5 5.7c.27 1 1.07 1.8 2.07 2.07 1.83.48 8.43.48 8.43.48s6.6 0 8.43-.48c1-.27 1.8-1.07 2.07-2.07.5-1.85.5-5.7.5-5.7ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Paste a YouTube link</p>
        <div className="mx-auto mt-4 flex max-w-xl flex-col gap-2 sm:flex-row">
          <input
            type="url"
            className="input-field flex-1"
            placeholder="https://www.youtube.com/watch?v=…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            aria-label="YouTube video URL"
          />
          <button className="btn-primary" onClick={submit} disabled={!input.trim()}>
            Get thumbnails
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Works with youtube.com/watch, youtu.be, Shorts and embed links
        </p>
      </div>

      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />

      {videoId && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" key={videoId}>
          {QUALITIES.map((q) => (
            <ThumbCard key={q.key} videoId={videoId} quality={q.key} label={q.label} />
          ))}
        </div>
      )}
    </div>
  );
}
