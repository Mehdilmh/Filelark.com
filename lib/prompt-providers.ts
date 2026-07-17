import Anthropic from '@anthropic-ai/sdk';

/**
 * Vision providers for the image-to-prompt tool.
 *
 * Each provider is enabled by setting its API key env var:
 *   ANTHROPIC_API_KEY  → Claude   (claude-sonnet-4-6, override: ANTHROPIC_VISION_MODEL)
 *   OPENAI_API_KEY     → OpenAI   (gpt-4o-mini,       override: OPENAI_VISION_MODEL)
 *   GEMINI_API_KEY     → Gemini   (gemini-2.0-flash,  override: GEMINI_VISION_MODEL)
 *
 * The API route tries them in the order below and falls through to the next
 * on any error, so one provider having an outage never breaks the tool.
 */

export interface ImageInput {
  /** base64-encoded image bytes (no data: prefix) */
  data: string;
  mime: string;
}

/** Thrown when a provider deliberately declines the image (don't retry elsewhere). */
export class PromptRefusalError extends Error {}

export const SYSTEM_PROMPT = `You are an expert AI-art prompt engineer. You analyse images and write prompts that would recreate their style and content in text-to-image generators.

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

function userText(ar: string): string {
  return `Analyse this image and produce the three prompts as JSON. The image aspect ratio is ${ar}, so use "--ar ${ar}" in the Midjourney prompt.`;
}

const PROVIDER_TIMEOUT_MS = 25_000;

export interface PromptProvider {
  name: string;
  isConfigured(): boolean;
  /** Returns the model's raw text response. Throws on any failure. */
  generate(image: ImageInput, ar: string): Promise<string>;
}

/* ------------------------------------------------------------------ */
/* Anthropic (Claude)                                                  */
/* ------------------------------------------------------------------ */

const anthropicProvider: PromptProvider = {
  name: 'anthropic',
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async generate(image, ar) {
    const client = new Anthropic();
    const response = await client.messages.create(
      {
        model: process.env.ANTHROPIC_VISION_MODEL || 'claude-sonnet-4-6',
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
                  media_type: image.mime as
                    | 'image/jpeg'
                    | 'image/png'
                    | 'image/webp'
                    | 'image/gif',
                  data: image.data,
                },
              },
              { type: 'text', text: userText(ar) },
            ],
          },
        ],
      },
      { timeout: PROVIDER_TIMEOUT_MS },
    );

    if ((response.stop_reason as string) === 'refusal') {
      throw new PromptRefusalError('Image declined by safety policy.');
    }

    return response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
  },
};

/* ------------------------------------------------------------------ */
/* OpenAI                                                              */
/* ------------------------------------------------------------------ */

const openaiProvider: PromptProvider = {
  name: 'openai',
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  async generate(image, ar) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: userText(ar) },
              {
                type: 'image_url',
                image_url: { url: `data:${image.mime};base64,${image.data}` },
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`OpenAI responded ${res.status}`);
    }
    const json = await res.json();
    return json?.choices?.[0]?.message?.content ?? '';
  },
};

/* ------------------------------------------------------------------ */
/* Google Gemini                                                       */
/* ------------------------------------------------------------------ */

const geminiProvider: PromptProvider = {
  name: 'gemini',
  isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
  async generate(image, ar) {
    const model = process.env.GEMINI_VISION_MODEL || 'gemini-2.0-flash';
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: image.mime, data: image.data } },
                { text: userText(ar) },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 1500 },
        }),
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      throw new Error(`Gemini responded ${res.status}`);
    }
    const json = await res.json();
    const parts = json?.candidates?.[0]?.content?.parts;
    return Array.isArray(parts)
      ? parts.map((p: { text?: string }) => p.text ?? '').join('\n')
      : '';
  },
};

/* ------------------------------------------------------------------ */

/** Fallback order: Claude → OpenAI → Gemini. Unconfigured ones are skipped. */
export const PROVIDERS: PromptProvider[] = [
  anthropicProvider,
  openaiProvider,
  geminiProvider,
];

export function configuredProviders(): PromptProvider[] {
  return PROVIDERS.filter((p) => p.isConfigured());
}
