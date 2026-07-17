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
