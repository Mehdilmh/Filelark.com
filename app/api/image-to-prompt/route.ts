import { NextRequest, NextResponse } from 'next/server';
import {
  configuredProviders,
  ImageInput,
  PromptRefusalError,
} from '@/lib/prompt-providers';
import { checkRateLimit, DAILY_LIMIT } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function extractJson(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```(?:json)?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const providers = configuredProviders();
  if (providers.length === 0) {
    return NextResponse.json(
      {
        error:
          'Image-to-prompt is not configured on this server (set ANTHROPIC_API_KEY, OPENAI_API_KEY or GEMINI_API_KEY).',
      },
      { status: 503 },
    );
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Daily limit reached (${DAILY_LIMIT} free generations per day). Try again after ${new Date(limit.resetAt).toISOString()}.`,
        resetAt: limit.resetAt,
      },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const image = form.get('image');
  if (!(image instanceof Blob)) {
    return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
  }
  if (image.size === 0 || image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: 'Image must be between 1 byte and 8 MB. Compress it first if needed.' },
      { status: 413 },
    );
  }
  if (!ALLOWED_TYPES.includes(image.type)) {
    return NextResponse.json(
      { error: 'Unsupported image type. Use JPG, PNG, WebP or GIF (convert HEIC first).' },
      { status: 415 },
    );
  }

  const aspectRatio = typeof form.get('ar') === 'string' ? (form.get('ar') as string) : '1:1';
  const safeAr = /^\d{1,2}:\d{1,2}$/.test(aspectRatio) ? aspectRatio : '1:1';

  const input: ImageInput = {
    data: Buffer.from(await image.arrayBuffer()).toString('base64'),
    mime: image.type,
  };

  // Try each configured provider in order; fall through on any failure so a
  // single provider outage never breaks the tool.
  let text: string | null = null;
  let servedBy: string | null = null;
  const failures: string[] = [];

  for (const provider of providers) {
    try {
      const result = await provider.generate(input, safeAr);
      if (result && result.trim()) {
        text = result;
        servedBy = provider.name;
        break;
      }
      failures.push(`${provider.name}: empty response`);
    } catch (err) {
      if (err instanceof PromptRefusalError) {
        // Deliberate content decline — don't shop the image to other providers
        return NextResponse.json(
          { error: 'This image could not be analysed. Please try a different image.' },
          { status: 422 },
        );
      }
      failures.push(
        `${provider.name}: ${err instanceof Error ? err.message : 'unknown error'}`,
      );
    }
  }

  if (!text) {
    console.error('image-to-prompt: all providers failed —', failures.join(' | '));
    return NextResponse.json(
      { error: 'The AI service is busy right now. Please try again in a minute.' },
      { status: 503 },
    );
  }

  const parsed = extractJson(text);
  const sd = (parsed?.stable_diffusion ?? {}) as Record<string, unknown>;

  return NextResponse.json({
    midjourney: typeof parsed?.midjourney === 'string' ? parsed.midjourney : text,
    stableDiffusion: {
      prompt: typeof sd.prompt === 'string' ? sd.prompt : text,
      negativePrompt:
        typeof sd.negative_prompt === 'string'
          ? sd.negative_prompt
          : 'blurry, low quality, distorted, watermark, text',
    },
    generic: typeof parsed?.generic === 'string' ? parsed.generic : text,
    remaining: limit.remaining,
    provider: servedBy,
  });
}
