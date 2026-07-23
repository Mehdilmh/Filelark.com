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
    slug: 'gif-to-png-explained',
    title: 'GIF to PNG: How to Convert (and What Happens to the Animation)',
    description:
      'Converting GIF to PNG is instant and free — but a PNG can’t animate. What you get, what you lose, and the right format when you need moving images.',
    date: '2026-07-23',
    readingMinutes: 5,
    emoji: '🎠',
  },
  {
    slug: 'cloudconvert-alternative-no-upload',
    title: 'CloudConvert Alternatives: When You Don’t Want to Upload Your Files',
    description:
      'CloudConvert is a fine service with a real limitation: your files go to their servers, with daily limits. Here’s when a browser-based converter is the better pick.',
    date: '2026-07-23',
    readingMinutes: 6,
    emoji: '🔁',
  },
  {
    slug: 'trim-video-from-dropbox',
    title: 'How to Trim a Video From Dropbox (Free, No App Needed)',
    description:
      'Dropbox can’t cut videos on the free plan — but you don’t need an editor. Download, trim losslessly in your browser, and put the clip back in under two minutes.',
    date: '2026-07-22',
    readingMinutes: 4,
    emoji: '📦',
  },
  {
    slug: 'split-pdf-extract-pages',
    title: 'How to Split a PDF or Extract Specific Pages (Free, No Upload)',
    description:
      'Pull exactly the pages you need out of any PDF — a range, a single page, or every page as its own file — privately in your browser.',
    date: '2026-07-22',
    readingMinutes: 5,
    emoji: '✄',
  },
  {
    slug: 'photos-to-pdf-scan-documents',
    title: 'How to Turn Photos into a PDF (Scan Documents with Just Your Phone)',
    description:
      'Receipts, contracts, IDs, homework — combine phone photos into one clean PDF for free, fix sideways pages, and shrink it for upload portals.',
    date: '2026-07-22',
    readingMinutes: 6,
    emoji: '📑',
  },
  {
    slug: 'what-is-avif-how-to-open',
    title: 'What Is an AVIF File — and How Do You Open or Convert It?',
    description:
      'AVIF images are showing up everywhere and half your apps refuse to open them. What the format is, why sites use it, and how to convert it in seconds.',
    date: '2026-07-22',
    readingMinutes: 5,
    emoji: '🆕',
  },
  {
    slug: 'social-media-image-sizes',
    title: 'Social Media Image Sizes in 2026 (and How to Resize for Each)',
    description:
      'The exact pixel dimensions for Instagram, X, Facebook, LinkedIn, TikTok and YouTube — plus a free way to resize and compress every image to spec.',
    date: '2026-07-22',
    readingMinutes: 7,
    emoji: '📐',
  },
  {
    slug: 'trim-video-without-software',
    title: 'How to Trim a Video Without Installing Anything (Lossless)',
    description:
      'Cut the exact section you need from any video in your browser — no watermark, no re-encoding, no quality loss, and files never leave your device.',
    date: '2026-07-22',
    readingMinutes: 5,
    emoji: '✂️',
  },
  {
    slug: 'merge-pdf-files-free',
    title: 'How to Merge PDF Files for Free (in the Right Order, Without Uploading)',
    description:
      'Combine contracts, scans and chapters into one PDF — private, lossless, and free. Plus how to reorder pages and fix mixed-up documents.',
    date: '2026-07-18',
    readingMinutes: 5,
    emoji: '🗂️',
  },
  {
    slug: 'compress-video-for-whatsapp-email',
    title: 'How to Compress a Video for WhatsApp, Email or Discord',
    description:
      'WhatsApp caps files at 64 MB, email at 25 MB. Here’s how to shrink phone videos by 60–90% in your browser — and when trimming beats compressing.',
    date: '2026-07-18',
    readingMinutes: 5,
    emoji: '📤',
  },
  {
    slug: 'optimize-images-for-web',
    title: 'Image Optimization for Faster Websites: A Practical Guide',
    description:
      'Oversized images are the #1 cause of slow pages. The format, size and compression rules that cut page weight by 80% — with free browser tools.',
    date: '2026-07-18',
    readingMinutes: 7,
    emoji: '⚡',
  },
  {
    slug: 'word-to-html-clean',
    title: 'How to Convert Word to Clean HTML (Without the <span> Soup)',
    description:
      'Pasting from Word into a CMS creates a mess of inline styles. How to get semantic, SEO-friendly HTML from any .docx or Google Doc — free.',
    date: '2026-07-18',
    readingMinutes: 5,
    emoji: '🧹',
  },
  {
    slug: 'stable-diffusion-prompt-guide',
    title: 'Stable Diffusion Prompts: A Practical Guide (With Negative Prompts)',
    description:
      'How SD prompting differs from Midjourney, how to structure tags and weights, what belongs in a negative prompt — and how to learn from images you love.',
    date: '2026-07-18',
    readingMinutes: 7,
    emoji: '🧪',
  },
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
