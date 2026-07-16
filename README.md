# FileLark

Free, SEO-first file conversion SaaS built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

Every image and PDF tool runs **100% client-side** (Canvas API, WebAssembly, pdf-lib, pdf.js) — files never leave the user's device, so hosting costs are effectively zero and usage is unlimited. The only server-side feature is the AI **Image-to-Prompt** tool, which calls the Anthropic API.

## Features

- **Image converters** — 24 statically generated landing pages covering every sensible pair of JPG / PNG / WebP / AVIF / GIF / BMP / HEIC (HEIC decoded via `heic2any`, AVIF encoded via `@jsquash/avif` WASM). Batch conversion, quality slider, ZIP download, before/after sizes.
- **Image tools** — resize (pixels or percent, aspect lock) and compress (target file size with automatic quality search).
- **PDF tools** — PDF→JPG/PNG, images→PDF, merge, split (ranges or every page), compress (re-render at lower quality), rotate/delete pages with visual thumbnails.
- **Image to Prompt (AI)** — upload an image, get Midjourney / Stable Diffusion / generic prompts with copy buttons. Rate-limited to 5/day per user (localStorage + in-memory IP limiting).
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
| `ANTHROPIC_API_KEY` | Only for Image-to-Prompt | Server-side key for the Claude vision API. Without it, the AI tool returns a friendly "not configured" message; all converters still work. |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Canonical URL used in metadata, sitemap and robots (default: `https://filelark.com`). |
| `NEXT_PUBLIC_ADS_ENABLED` | No | `true` renders the ad slots. Leave unset during development. |

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

Paste your AdSense snippet inside `components/AdSlot.tsx` (the placeholder `<div>` marks the spot), add the AdSense loader script to `app/layout.tsx`, and set `NEXT_PUBLIC_ADS_ENABLED=true`. Slot dimensions are reserved per position so ads cause no layout shift.

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
