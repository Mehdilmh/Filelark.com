import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit, DAILY_LIMIT } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // Claude vision limit is ~5 MB post-encoding; keep raw uploads sane
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

const SYSTEM_PROMPT = `You are an expert AI-art prompt engineer. You analyse images and write prompts that would recreate their style and content in text-to-image generators.

Rules:
- Describe subjects generically ("a woman with short silver hair"), never identify real people.
- Be specific about: subject, composition/framing, lighting, color palette, mood, artistic style/medium, and rendering details.
- Respond ONLY with a JSON object, no markdown fences, matching exactly this shape:
{
  "midjourney": "<prompt written for Midjourney: vivid comma-separated descriptors, ending with the parameters --ar <ratio> --v 7>",
  "stable_diffusion": {
    "prompt": "<comma-separated tags/descriptors optimised for Stable Diffusion, most important first, including quality tags>",
    "negative_prompt": "<comma-separated negative prompt listing artifacts and traits to avoid for this image>"
  },
  "generic": "<2-4 flowing sentences describing the image in rich detail, usable with any AI image generator>"
}`;

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
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Image-to-prompt is not configured on this server (missing ANTHROPIC_API_KEY).' },
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
  if (!ALLOWED_TYPES.includes(image.type as AllowedType)) {
    return NextResponse.json(
      { error: 'Unsupported image type. Use JPG, PNG, WebP or GIF (convert HEIC first).' },
      { status: 415 },
    );
  }

  const aspectRatio = typeof form.get('ar') === 'string' ? (form.get('ar') as string) : '1:1';
  const safeAr = /^\d{1,2}:\d{1,2}$/.test(aspectRatio) ? aspectRatio : '1:1';

  const data = Buffer.from(await image.arrayBuffer()).toString('base64');

  const anthropic = new Anthropic();

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: image.type as AllowedType,
                data,
              },
            },
            {
              type: 'text',
              text: `Analyse this image and produce the three prompts as JSON. The image aspect ratio is ${safeAr}, so use "--ar ${safeAr}" in the Midjourney prompt.`,
            },
          ],
        },
      ],
    });

    // Newer API models can return a "refusal" stop reason not yet in the SDK types
    if ((response.stop_reason as string) === 'refusal') {
      return NextResponse.json(
        { error: 'This image could not be analysed. Please try a different image.' },
        { status: 422 },
      );
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    const parsed = extractJson(text);
    const sd = (parsed?.stable_diffusion ?? {}) as Record<string, unknown>;

    const result = {
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
    };

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      if (err.status === 429 || err.status === 529) {
        return NextResponse.json(
          { error: 'The AI service is busy right now. Please try again in a minute.' },
          { status: 503 },
        );
      }
      if (err.status === 401) {
        return NextResponse.json(
          { error: 'Server API key is invalid. Please contact the site owner.' },
          { status: 503 },
        );
      }
      console.error('Anthropic API error:', err.status, err.message);
      return NextResponse.json(
        { error: 'The image could not be analysed. Please try again.' },
        { status: 502 },
      );
    }
    console.error('image-to-prompt error:', err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
