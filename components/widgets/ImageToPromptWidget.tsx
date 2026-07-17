'use client';

import { useEffect, useState } from 'react';
import DropZone from '../DropZone';
import { ErrorAlert } from './shared';

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'ckp-itp-usage';

type Style = 'midjourney' | 'stable-diffusion' | 'generic';

interface PromptResult {
  midjourney: string;
  stableDiffusion: { prompt: string; negativePrompt: string };
  generic: string;
}

function readUsage(): { start: number; count: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.start === 'number' &&
        typeof parsed.count === 'number' &&
        Date.now() - parsed.start < 24 * 60 * 60 * 1000
      ) {
        return parsed;
      }
    }
  } catch {
    /* ignore */
  }
  return { start: Date.now(), count: 0 };
}

function nearestAspectRatio(w: number, h: number): string {
  const ratios: [string, number][] = [
    ['1:1', 1],
    ['4:3', 4 / 3],
    ['3:4', 3 / 4],
    ['3:2', 3 / 2],
    ['2:3', 2 / 3],
    ['16:9', 16 / 9],
    ['9:16', 9 / 16],
  ];
  const r = w / h;
  return ratios.reduce((best, cur) =>
    Math.abs(cur[1] - r) < Math.abs(best[1] - r) ? cur : best,
  )[0];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn-secondary !px-3 !py-1 text-xs"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked */
        }
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function PromptCard({ title, text, extra }: { title: string; text: string; extra?: { label: string; text: string } }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <CopyButton text={text} />
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
      {extra && (
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {extra.label}
            </h4>
            <CopyButton text={extra.text} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{extra.text}</p>
        </div>
      )}
    </div>
  );
}

export default function ImageToPromptWidget({ defaultStyle = 'generic' }: { defaultStyle?: Style }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [style, setStyle] = useState<Style>(defaultStyle);

  useEffect(() => {
    setRemaining(DAILY_LIMIT - readUsage().count);
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFiles(files: File[]) {
    const f = files[0];
    if (f.size > 8 * 1024 * 1024) {
      setErrors(['Image must be under 8 MB — compress it first with our image compressor.']);
      return;
    }
    setFile(f);
    setResult(null);
    setErrors([]);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
  }

  async function generate() {
    if (!file) return;

    const usage = readUsage();
    if (usage.count >= DAILY_LIMIT) {
      setErrors([`You've used all ${DAILY_LIMIT} free generations for today. The counter resets 24 hours after your first generation.`]);
      setRemaining(0);
      return;
    }

    setBusy(true);
    setErrors([]);
    setResult(null);

    try {
      // Convert unsupported input types (HEIC/BMP/AVIF) to JPG before uploading
      let upload: Blob = file;
      let uploadType = file.type;
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        const { convertImage } = await import('@/lib/convert/image');
        const converted = await convertImage(file, 'jpg', { quality: 0.9 });
        upload = converted.blob;
        uploadType = 'image/jpeg';
      }

      // Compute aspect ratio for the --ar parameter
      const bitmap = await createImageBitmap(upload);
      const ar = nearestAspectRatio(bitmap.width, bitmap.height);
      bitmap.close();

      const form = new FormData();
      form.append('image', new File([upload], file.name, { type: uploadType }));
      form.append('ar', ar);

      const res = await fetch('/api/image-to-prompt', { method: 'POST', body: form });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors([typeof body.error === 'string' ? body.error : 'Generation failed. Please try again.']);
        if (res.status === 429) setRemaining(0);
      } else {
        setResult(body as PromptResult);
        const next = { start: usage.count === 0 ? Date.now() : usage.start, count: usage.count + 1 };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* private browsing */
        }
        setRemaining(DAILY_LIMIT - next.count);
      }
    } catch {
      setErrors(['Something went wrong analysing the image. Please try again.']);
    }
    setBusy(false);
  }

  const TABS: { id: Style; label: string }[] = [
    { id: 'midjourney', label: 'Midjourney' },
    { id: 'stable-diffusion', label: 'Stable Diffusion' },
    { id: 'generic', label: 'Detailed description' },
  ];

  return (
    <div>
      <DropZone
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/avif,image/bmp,.heic,.heif"
        multiple={false}
        onFiles={handleFiles}
        hint="image"
        disabled={busy}
      />

      {preview && (
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview of your uploaded file" className="h-28 w-28 rounded-xl object-cover shadow" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{file?.name}</p>
            <button className="btn-primary mt-2" onClick={generate} disabled={busy || remaining === 0}>
              {busy ? 'Analysing image…' : 'Generate prompts'}
            </button>
            {remaining !== null && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {remaining} of {DAILY_LIMIT} free generations left today
              </p>
            )}
          </div>
        </div>
      )}

      {busy && (
        <p className="mt-4 animate-pulse text-sm text-slate-500 dark:text-slate-400">
          The AI is studying your image — this takes a few seconds…
        </p>
      )}

      <ErrorAlert errors={errors} onDismiss={() => setErrors([])} />

      {result && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  style === t.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
                onClick={() => setStyle(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {style === 'midjourney' && <PromptCard title="Midjourney prompt" text={result.midjourney} />}
          {style === 'stable-diffusion' && (
            <PromptCard
              title="Stable Diffusion prompt"
              text={result.stableDiffusion.prompt}
              extra={{ label: 'Negative prompt', text: result.stableDiffusion.negativePrompt }}
            />
          )}
          {style === 'generic' && <PromptCard title="Detailed description" text={result.generic} />}
        </div>
      )}
    </div>
  );
}
