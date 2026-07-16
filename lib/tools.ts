import {
  FORMATS,
  FormatId,
  INPUT_FORMATS,
  OUTPUT_FORMATS,
} from './formats';

export type ToolKind =
  | 'image-convert'
  | 'image-resize'
  | 'image-compress'
  | 'pdf-to-images'
  | 'images-to-pdf'
  | 'merge-pdf'
  | 'split-pdf'
  | 'compress-pdf'
  | 'rotate-pdf'
  | 'pdf-to-word'
  | 'docx-to-html'
  | 'youtube-thumbnail'
  | 'image-to-prompt';

export type ToolCategory =
  | 'Image Converters'
  | 'Image Tools'
  | 'PDF Tools'
  | 'Document Tools'
  | 'Download Tools'
  | 'AI Tools';

export interface Tool {
  slug: string;
  kind: ToolKind;
  category: ToolCategory;
  /** <title> tag */
  title: string;
  /** meta description */
  description: string;
  /** on-page H1 matching the search query */
  h1: string;
  /** subtitle under the H1 */
  subtitle: string;
  /** short blurb for tool cards */
  short: string;
  /** conversion pair (image-convert only) */
  from?: FormatId;
  to?: FormatId;
  /** prompt style pre-selected (image-to-prompt only) */
  promptStyle?: 'midjourney' | 'stable-diffusion' | 'generic';
}

/* ------------------------------------------------------------------ */
/* Image conversion pairs — generated from the formats config          */
/* ------------------------------------------------------------------ */

const conversionTools: Tool[] = [];

for (const from of INPUT_FORMATS) {
  for (const to of OUTPUT_FORMATS) {
    if (from === to) continue;
    const f = FORMATS[from];
    const t = FORMATS[to];
    conversionTools.push({
      slug: `${from}-to-${to}`,
      kind: 'image-convert',
      category: 'Image Converters',
      from,
      to,
      title: `Convert ${f.name} to ${t.name} Online — Free, No Upload | FileLark`,
      description: `Convert ${f.name} to ${t.name} for free, right in your browser. No upload, no watermark, no sign-up. Batch convert with a quality slider and download as ZIP.`,
      h1: `Convert ${f.name} to ${t.name} Online — Free, No Upload`,
      subtitle: `Turn ${f.longName} images into ${t.name} instantly. Your files never leave your device.`,
      short: `${f.name} → ${t.name}`,
    });
  }
}

/* ------------------------------------------------------------------ */
/* Image tools                                                         */
/* ------------------------------------------------------------------ */

const imageTools: Tool[] = [
  {
    slug: 'compress-image',
    kind: 'image-compress',
    category: 'Image Tools',
    title: 'Compress Images Online — Free, No Upload | FileLark',
    description:
      'Compress JPG, PNG and WebP images to a target file size for free. Runs 100% in your browser — no upload, instant results, before/after size comparison.',
    h1: 'Compress Images Online — Free, No Upload',
    subtitle:
      'Shrink JPG, PNG and WebP files to a target size without visible quality loss. Everything happens on your device.',
    short: 'Shrink images to a target file size',
  },
  {
    slug: 'resize-image',
    kind: 'image-resize',
    category: 'Image Tools',
    title: 'Resize Images Online — Free, No Upload | FileLark',
    description:
      'Resize images by pixels or percentage for free, directly in your browser. Batch resize with locked aspect ratio — no upload, no watermark, no sign-up.',
    h1: 'Resize Images Online — Free, No Upload',
    subtitle:
      'Scale images to exact pixel dimensions or by percentage. Batch-friendly and completely private.',
    short: 'Resize by pixels or percentage',
  },
];

/* ------------------------------------------------------------------ */
/* PDF tools                                                           */
/* ------------------------------------------------------------------ */

const pdfTools: Tool[] = [
  {
    slug: 'pdf-to-jpg',
    kind: 'pdf-to-images',
    category: 'PDF Tools',
    title: 'PDF to JPG Converter — Free, No Upload | FileLark',
    description:
      'Convert PDF pages to JPG or PNG images for free. Renders every page in your browser — no upload, no watermark. Download pages individually or as a ZIP.',
    h1: 'Convert PDF to JPG Online — Free, No Upload',
    subtitle:
      'Turn every page of a PDF into a high-quality JPG or PNG image, right on your device.',
    short: 'PDF pages → JPG/PNG images',
  },
  {
    slug: 'jpg-to-pdf',
    kind: 'images-to-pdf',
    category: 'PDF Tools',
    title: 'JPG to PDF Converter — Free, No Upload | FileLark',
    description:
      'Combine JPG, PNG, WebP or HEIC images into a single PDF for free. Reorder pages, pick a page size, and download instantly — no upload, no sign-up.',
    h1: 'Convert JPG to PDF Online — Free, No Upload',
    subtitle:
      'Combine one or many images into a clean PDF document. Drag to reorder, then download.',
    short: 'Images → one PDF document',
  },
  {
    slug: 'merge-pdf',
    kind: 'merge-pdf',
    category: 'PDF Tools',
    title: 'Merge PDF Files — Free, No Upload | FileLark',
    description:
      'Merge multiple PDFs into one file for free. Drag to reorder, then combine — all processing happens in your browser, so your documents stay private.',
    h1: 'Merge PDF Files Online — Free, No Upload',
    subtitle:
      'Combine two or more PDFs into a single document, in the order you choose.',
    short: 'Combine PDFs into one file',
  },
  {
    slug: 'split-pdf',
    kind: 'split-pdf',
    category: 'PDF Tools',
    title: 'Split PDF — Extract Pages Free, No Upload | FileLark',
    description:
      'Split a PDF or extract page ranges for free. Type ranges like 1-3,7 or split every page into its own PDF — processed privately in your browser.',
    h1: 'Split PDF Online — Free, No Upload',
    subtitle:
      'Extract a page range into a new PDF, or split every page into separate files.',
    short: 'Extract pages or split every page',
  },
  {
    slug: 'compress-pdf',
    kind: 'compress-pdf',
    category: 'PDF Tools',
    title: 'Compress PDF — Reduce File Size Free, No Upload | FileLark',
    description:
      'Compress a PDF to a smaller file size for free. Choose a quality level and shrink scanned or image-heavy PDFs directly in your browser — no upload.',
    h1: 'Compress PDF Online — Free, No Upload',
    subtitle:
      'Re-render pages at a lower quality to dramatically shrink image-heavy PDFs.',
    short: 'Shrink PDF file size',
  },
  {
    slug: 'rotate-pdf',
    kind: 'rotate-pdf',
    category: 'PDF Tools',
    title: 'Rotate & Delete PDF Pages — Free, No Upload | FileLark',
    description:
      'Rotate or delete individual PDF pages for free. Visual page thumbnails, per-page rotation, and instant download — all processed in your browser.',
    h1: 'Rotate & Delete PDF Pages — Free, No Upload',
    subtitle:
      'Fix sideways scans or remove unwanted pages with a visual page editor.',
    short: 'Rotate or remove PDF pages',
  },
];

/* ------------------------------------------------------------------ */
/* Document tools                                                      */
/* ------------------------------------------------------------------ */

const documentTools: Tool[] = [
  {
    slug: 'pdf-to-word',
    kind: 'pdf-to-word',
    category: 'Document Tools',
    title: 'PDF to Word Converter — Free, No Upload | FileLark',
    description:
      'Convert PDF to an editable Word (.docx) document for free. Text is extracted right in your browser — no upload, no sign-up, no watermark.',
    h1: 'Convert PDF to Word Online — Free, No Upload',
    subtitle:
      'Extract the text of any PDF into an editable Word document, privately on your device.',
    short: 'PDF → editable Word (.docx)',
  },
  {
    slug: 'word-to-html',
    kind: 'docx-to-html',
    category: 'Document Tools',
    title: 'Word to HTML Converter — Clean HTML from DOCX | FileLark',
    description:
      'Convert a Word document or article to clean HTML for free. Semantic markup ready for blogs and CMSs — generated in your browser, no upload.',
    h1: 'Convert Word to HTML Online — Free, No Upload',
    subtitle:
      'Turn a .docx article into clean, semantic HTML you can paste into any blog or CMS.',
    short: 'Word article → clean HTML',
  },
];

/* ------------------------------------------------------------------ */
/* Download tools                                                      */
/* ------------------------------------------------------------------ */

const downloadTools: Tool[] = [
  {
    slug: 'youtube-thumbnail-downloader',
    kind: 'youtube-thumbnail',
    category: 'Download Tools',
    title: 'YouTube Thumbnail Downloader — All Qualities (HD, 4K) | FileLark',
    description:
      'Download any YouTube video thumbnail in every available quality — from 120p up to full HD 1280×720. Paste the link, preview all sizes, save with one click.',
    h1: 'YouTube Thumbnail Downloader — Every Quality, One Click',
    subtitle:
      'Paste any YouTube link (video, Shorts, or youtu.be) and download its thumbnail in all available resolutions.',
    short: 'YouTube thumbnail → all qualities',
  },
];

/* ------------------------------------------------------------------ */
/* AI tools                                                            */
/* ------------------------------------------------------------------ */

const aiTools: Tool[] = [
  {
    slug: 'image-to-prompt',
    kind: 'image-to-prompt',
    category: 'AI Tools',
    promptStyle: 'generic',
    title: 'Image to Prompt Generator — Free AI Prompt from Any Image | FileLark',
    description:
      'Upload an image and get a detailed AI art prompt in seconds. Generates Midjourney, Stable Diffusion and generic prompts you can copy with one click. 5 free per day.',
    h1: 'Image to Prompt Generator — Turn Any Image into an AI Prompt',
    subtitle:
      'Upload an image and get three ready-to-use prompts: Midjourney, Stable Diffusion, and a detailed description.',
    short: 'Image → AI art prompt',
  },
  {
    slug: 'image-to-midjourney-prompt',
    kind: 'image-to-prompt',
    category: 'AI Tools',
    promptStyle: 'midjourney',
    title: 'Image to Midjourney Prompt — Free Prompt Generator | FileLark',
    description:
      'Turn any image into a Midjourney prompt, complete with --ar and --v parameters. AI-powered analysis, copy-ready output, 5 free generations per day.',
    h1: 'Image to Midjourney Prompt Generator',
    subtitle:
      'Get a copy-ready Midjourney prompt — including aspect ratio and version parameters — from any image.',
    short: 'Image → Midjourney prompt',
  },
  {
    slug: 'image-to-stable-diffusion-prompt',
    kind: 'image-to-prompt',
    category: 'AI Tools',
    promptStyle: 'stable-diffusion',
    title: 'Image to Stable Diffusion Prompt — Free Generator | FileLark',
    description:
      'Generate a Stable Diffusion prompt (with negative prompt) from any image. AI-powered, copy-ready, and free — 5 generations per day.',
    h1: 'Image to Stable Diffusion Prompt Generator',
    subtitle:
      'Get a detailed Stable Diffusion prompt plus a matching negative prompt from any image.',
    short: 'Image → Stable Diffusion prompt',
  },
];

/* ------------------------------------------------------------------ */

export const TOOLS: Tool[] = [
  ...conversionTools,
  ...imageTools,
  ...pdfTools,
  ...documentTools,
  ...downloadTools,
  ...aiTools,
];

export const TOOLS_BY_SLUG: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export function getTool(slug: string): Tool | undefined {
  return TOOLS_BY_SLUG[slug];
}

export const CATEGORIES: ToolCategory[] = [
  'Image Converters',
  'Image Tools',
  'PDF Tools',
  'Document Tools',
  'Download Tools',
  'AI Tools',
];

export function toolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

/** "People also convert…" — related tools for internal linking. */
export function relatedTools(tool: Tool, limit = 6): Tool[] {
  const related: Tool[] = [];

  if (tool.kind === 'image-convert' && tool.from && tool.to) {
    // Reverse pair first if it exists
    const reverse = getTool(`${tool.to}-to-${tool.from}`);
    if (reverse) related.push(reverse);
    // Same source, different targets
    for (const t of TOOLS) {
      if (t.kind === 'image-convert' && t.from === tool.from && t.slug !== tool.slug) {
        related.push(t);
      }
    }
    // Same target, different sources
    for (const t of TOOLS) {
      if (t.kind === 'image-convert' && t.to === tool.to && t.slug !== tool.slug) {
        related.push(t);
      }
    }
    related.push(getTool('compress-image')!, getTool('resize-image')!);
  } else {
    // Same category first, then a spread of others
    for (const t of toolsByCategory(tool.category)) {
      if (t.slug !== tool.slug) related.push(t);
    }
    related.push(
      getTool('jpg-to-png')!,
      getTool('heic-to-jpg')!,
      getTool('compress-image')!,
      getTool('image-to-prompt')!,
    );
  }

  const seen = new Set<string>([tool.slug]);
  return related
    .filter((t) => {
      if (!t || seen.has(t.slug)) return false;
      seen.add(t.slug);
      return true;
    })
    .slice(0, limit);
}
