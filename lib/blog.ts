export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date */
  date: string;
  readingMinutes: number;
  emoji: string;
}

/**
 * Blog registry — drives the index page, sitemap and JSON-LD.
 * Each post lives at app/blog/<slug>/page.tsx.
 */
export const POSTS: BlogPost[] = [
  {
    slug: 'png-vs-jpg-when-to-use',
    title: 'PNG vs JPG: Which Format Should You Actually Use?',
    description:
      'The two most common image formats explained in plain language — when JPG wins, when PNG is worth the size, and the mistakes that bloat your files.',
    date: '2026-07-18',
    readingMinutes: 6,
    emoji: '🖼️',
  },
  {
    slug: 'convert-video-to-mp3',
    title: 'How to Convert a Video to MP3 for Free (No Software, No Upload)',
    description:
      'Extract the audio from any MP4, WebM or MOV as an MP3 — right in your browser, without installing converters or uploading private recordings.',
    date: '2026-07-18',
    readingMinutes: 5,
    emoji: '🎵',
  },
  {
    slug: 'remove-background-without-photoshop',
    title: 'How to Remove an Image Background for Free (No Photoshop, No Upload)',
    description:
      'You don’t need Photoshop or a paid service for clean cutouts. How AI background removal works, what it’s good at, and how to do it privately.',
    date: '2026-07-18',
    readingMinutes: 6,
    emoji: '✂️',
  },
  {
    slug: 'make-gif-from-video',
    title: 'How to Make a GIF from a Video (and Keep the File Size Sane)',
    description:
      'Turn any video clip into a crisp animated GIF for free — plus the width, frame-rate and length settings that keep GIFs under a few megabytes.',
    date: '2026-07-17',
    readingMinutes: 5,
    emoji: '🎞️',
  },
  {
    slug: 'youtube-thumbnail-size-guide',
    title: 'YouTube Thumbnail Size Guide: Dimensions, Best Practices & How to Download Any Thumbnail',
    description:
      'The exact thumbnail resolution YouTube wants, why maxresdefault sometimes doesn’t exist, and how to download any video’s thumbnail in every quality.',
    date: '2026-07-17',
    readingMinutes: 6,
    emoji: '📺',
  },
  {
    slug: 'pdf-to-word-free',
    title: 'How to Convert PDF to Word for Free (and When It Won’t Work)',
    description:
      'Get editable text out of any PDF without paid software — plus the honest truth about layouts, scanned documents, and OCR.',
    date: '2026-07-17',
    readingMinutes: 5,
    emoji: '📝',
  },
  {
    slug: 'heic-to-jpg-iphone-photos',
    title: "HEIC vs JPG: Why Your iPhone Photos Won't Open (and How to Fix It)",
    description:
      'iPhone photos are saved as HEIC files that Windows, Android and many websites reject. Here is why Apple uses HEIC, and the fastest free way to convert it.',
    date: '2026-07-16',
    readingMinutes: 6,
    emoji: '📱',
  },
  {
    slug: 'webp-vs-avif-vs-jpg',
    title: 'WebP vs AVIF vs JPG: Which Image Format Should You Use in 2026?',
    description:
      'A practical comparison of the three main web image formats — file sizes, browser support, quality, and exactly when to pick each one.',
    date: '2026-07-16',
    readingMinutes: 7,
    emoji: '⚖️',
  },
  {
    slug: 'midjourney-prompts-from-images',
    title: 'How to Write Better Midjourney Prompts (Starting from an Image You Love)',
    description:
      'The fastest way to learn prompting is to reverse-engineer images you admire. A practical guide to prompt structure, parameters, and iteration.',
    date: '2026-07-16',
    readingMinutes: 8,
    emoji: '🎨',
  },
  {
    slug: 'compress-pdf-under-10mb',
    title: 'How to Compress a PDF Under 10 MB (Without Ruining It)',
    description:
      'Upload portals and email attachments have hard size limits. Here is what actually makes PDFs huge and three ways to shrink them — privately, in your browser.',
    date: '2026-07-16',
    readingMinutes: 5,
    emoji: '🗜️',
  },
];

export const POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  POSTS.map((p) => [p.slug, p]),
);
