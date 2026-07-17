# FileLark

Free, SEO-first file conversion SaaS built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

Every image and PDF tool runs **100% client-side** (Canvas API, WebAssembly, pdf-lib, pdf.js) — files never leave the user's device, so hosting costs are effectively zero and usage is unlimited. The only server-side feature is the AI **Image-to-Prompt** tool, which calls the Anthropic API.

## Features

- **Image converters** — 24 statically generated landing pages covering every sensible pair of JPG / PNG / WebP / AVIF / GIF / BMP / HEIC (HEIC decoded via `heic2any`, AVIF encoded via `@jsquash/avif` WASM). Batch conversion, quality slider, ZIP download, before/after sizes.
- **Image tools** — resize (pixels or percent, aspect lock), compress (target file size with automatic quality search), and AI background removal (U²-Net small via onnxruntime-web WASM, ~4.5 MB model committed at `public/models/`, runtime self-hosted under `/ort/` and loaded with a bundler-ignored dynamic import).
- **PDF tools** — PDF→JPG/PNG, images→PDF, merge, split (ranges or every page), compress (re-render at lower quality), rotate/delete pages with visual thumbnails.
- **Document tools** — PDF → Word (.docx text extraction, in-browser) and Word → clean HTML (mammoth.js) for publishing articles.
- **Video tools** — MP4→MP3, video→GIF (palette-optimized), compress video (H.264 presets) and lossless trim, all in-browser via ffmpeg.wasm (single-thread core, self-hosted, ~31 MB lazy-loaded on first use).
- **Download tools** — YouTube thumbnail downloader: paste any link (watch/youtu.be/Shorts) and grab every available resolution via a whitelisted same-origin proxy (`/api/thumbnail`).
- **Image to Prompt (AI)** — upload an image, get Midjourney / Stable Diffusion / generic prompts with copy buttons. Rate-limited to 5/day per user (localStorage + in-memory IP limiting).
- **Format quick-chooser** — every conversion page shows pill links to switch source/target format without searching.
- **SEO architecture** — one server-rendered page per tool with unique title/description/H1, 300–500 words of format-specific content, FAQ section, FAQPage + SoftwareApplication JSON-LD, auto-generated `sitemap.xml` / `robots.txt`, and "People also use…" internal linking.
- **Ads-ready** — `<AdSlot />` component with reserved dimensions (zero CLS) in three positions, toggled by `NEXT_PUBLIC_ADS_ENABLED`.
- **UX** — drag-and-drop hero zones, progress bars, dark mode, mobile-first responsive design, trust badges.

## Quick start

```bash
npm install
cp .env.example .env.local   # then edit
npm run dev                  # http://localhost:3000
```

Everything except Image-to-Prompt works with no configuration at all.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | One AI key needed for Image-to-Prompt | Claude vision (primary provider). |
| `OPENAI_API_KEY` | Optional | OpenAI vision (`gpt-4o-mini`) — automatic fallback if Claude fails. |
| `GEMINI_API_KEY` | Optional | Google Gemini vision (`gemini-2.0-flash`) — final fallback. |
| `ANTHROPIC_VISION_MODEL` / `OPENAI_VISION_MODEL` / `GEMINI_VISION_MODEL` | Optional | Override the default model per provider. |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Canonical URL used in metadata, sitemap and robots (default: `https://filelark.com`). |
| `NEXT_PUBLIC_ADS_ENABLED` | No | `true` renders the ad slots. Leave unset during development. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID (`G-…`). Loads gtag.js when set. |
| `NEXT_PUBLIC_GTM_ID` | No | Google Tag Manager container ID (`GTM-…`). Loads GTM when set. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Search Console HTML-tag verification value (not needed with DNS verification). |

## Production build

```bash
npm run build   # statically generates all ~40 pages
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo (framework auto-detected).
3. Add the environment variables above in *Project → Settings → Environment Variables*.
4. Deploy. Conversions are client-side, so the free tier comfortably handles heavy traffic; only `/api/image-to-prompt` consumes serverless compute.

Any Node host works too: `npm run build && npm start` behind a reverse proxy.

## AdSense integration

No code changes needed — set env vars and redeploy:

1. `NEXT_PUBLIC_ADSENSE_PUBLISHER=ca-pub-XXXXXXXXXXXXXXXX` — loads the AdSense script and activates `/ads.txt` automatically.
2. `NEXT_PUBLIC_ADS_ENABLED=true` — renders the three reserved ad slots (no layout shift).
3. Optional: create three display ad units in AdSense and set `NEXT_PUBLIC_ADSENSE_SLOT_BELOW_TOOL` / `_MID_CONTENT` / `_SIDEBAR` to their slot IDs so real units render in the reserved spaces. Without slot IDs the spaces show placeholders (and Auto Ads can still fill the page).

## Notes & limitations

- **AVIF output** uses a WebAssembly encoder, so it works in every modern browser but is slower than JPG/WebP encoding (~1–3s per image).
- **PDF compression** re-renders pages as images, so output text is not selectable (this is inherent to the technique and noted in the UI).
- **IP rate limiting** for the AI route is in-memory per serverless instance — a cost guard, not a hard boundary. For a strict global limit, swap `lib/rate-limit.ts` for Upstash/Redis.
- Adding conversion pairs or tools = editing `lib/formats.ts` / `lib/tools.ts`; pages, sitemap, internal links and footer all update automatically.

## Project structure

```
app/
  [tool]/page.tsx        # every tool landing page (SSG from lib/tools.ts)
  api/image-to-prompt/   # the only server-side feature
  sitemap.ts, robots.ts  # generated from the tools config
components/
  widgets/               # client-side tool widgets (code-split per tool)
lib/
  formats.ts             # image format metadata → drives pages + copy
  tools.ts               # tool registry → drives routing, sitemap, linking
  content.ts             # per-tool SEO copy, FAQs, JSON-LD
  convert/               # the client-side conversion engine
```
