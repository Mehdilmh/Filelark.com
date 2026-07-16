/**
 * Image format metadata. This single source of truth drives:
 *  - which conversion pairs get a dedicated landing page
 *  - the unique SEO copy generated for each pair
 *  - the accept/encode configuration of the converter widget
 */

export type FormatId = 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'bmp' | 'heic';

export interface ImageFormat {
  id: FormatId;
  /** Short display name, e.g. "JPG" */
  name: string;
  /** Long name, e.g. "JPEG (Joint Photographic Experts Group)" */
  longName: string;
  extension: string;
  mime: string;
  /** Extra mime types / extensions accepted as input */
  acceptMimes: string[];
  lossy: boolean;
  transparency: boolean;
  animation: boolean;
  /** Can browsers (or our WASM codec) encode this format? */
  encodable: boolean;
  /** One-line positioning used in copy */
  pitch: string;
  /** 2–3 sentence description of the format */
  about: string;
  /** When this format is the right choice */
  bestFor: string;
  /** Honest weaknesses, used in comparison copy */
  drawbacks: string;
  /** Typical compatibility note */
  support: string;
}

export const FORMATS: Record<FormatId, ImageFormat> = {
  jpg: {
    id: 'jpg',
    name: 'JPG',
    longName: 'JPEG (Joint Photographic Experts Group)',
    extension: 'jpg',
    mime: 'image/jpeg',
    acceptMimes: ['image/jpeg', 'image/jpg'],
    lossy: true,
    transparency: false,
    animation: false,
    encodable: true,
    pitch: 'the universal standard for photographs',
    about:
      'JPEG has been the default format for photographs since 1992. It uses lossy compression tuned for natural images, which lets it shrink photos to a fraction of their raw size while keeping them visually convincing. Virtually every camera, phone, browser, and app on the planet can open a JPG.',
    bestFor:
      'photographs, screenshots of photos, email attachments, and anywhere maximum compatibility matters more than perfect fidelity',
    drawbacks:
      'no transparency support, visible artifacts at low quality settings, and quality degrades each time the file is re-saved',
    support: 'opened by every browser, OS, and image application ever made',
  },
  png: {
    id: 'png',
    name: 'PNG',
    longName: 'PNG (Portable Network Graphics)',
    extension: 'png',
    mime: 'image/png',
    acceptMimes: ['image/png'],
    lossy: false,
    transparency: true,
    animation: false,
    encodable: true,
    pitch: 'lossless quality with full transparency',
    about:
      'PNG is a lossless format designed for the web. Every pixel is preserved exactly, and its alpha channel supports smooth, variable transparency — which is why logos, icons, and UI screenshots are almost always PNGs. The tradeoff is file size: photographs saved as PNG can be several times larger than an equivalent JPG.',
    bestFor:
      'logos, icons, screenshots with text, diagrams, and any image that needs a transparent background',
    drawbacks: 'large file sizes for photographic content and no animation support',
    support: 'universally supported in every modern and legacy browser',
  },
  webp: {
    id: 'webp',
    name: 'WebP',
    longName: 'WebP',
    extension: 'webp',
    mime: 'image/webp',
    acceptMimes: ['image/webp'],
    lossy: true,
    transparency: true,
    animation: true,
    encodable: true,
    pitch: "Google's modern web format — smaller than JPG and PNG",
    about:
      'WebP was created by Google to replace both JPG and PNG on the web. It supports lossy and lossless compression, transparency, and even animation in a single format. In lossy mode WebP files are typically 25–35% smaller than a JPG of comparable visual quality, which directly improves page-load speed and Core Web Vitals.',
    bestFor:
      'website images of every kind — product photos, hero images, thumbnails — where smaller files mean faster pages',
    drawbacks:
      'not accepted by some older software, printing services, and government/upload forms that still expect JPG or PNG',
    support: 'supported by all modern browsers (Chrome, Firefox, Safari 14+, Edge)',
  },
  avif: {
    id: 'avif',
    name: 'AVIF',
    longName: 'AVIF (AV1 Image File Format)',
    extension: 'avif',
    mime: 'image/avif',
    acceptMimes: ['image/avif'],
    lossy: true,
    transparency: true,
    animation: true,
    encodable: true,
    pitch: 'the newest web format with the best compression available',
    about:
      'AVIF is built on the AV1 video codec and delivers the strongest compression of any mainstream image format — files are often about half the size of an equivalent JPG and noticeably smaller than WebP at the same visual quality. It supports transparency, HDR, and wide color gamuts.',
    bestFor:
      'performance-critical websites where every kilobyte counts, and modern image pipelines that can serve fallbacks',
    drawbacks:
      'encoding is slower than other formats, and very old browsers or desktop tools may not open AVIF files',
    support: 'supported by all current versions of Chrome, Firefox, Safari, and Edge',
  },
  gif: {
    id: 'gif',
    name: 'GIF',
    longName: 'GIF (Graphics Interchange Format)',
    extension: 'gif',
    mime: 'image/gif',
    acceptMimes: ['image/gif'],
    lossy: false,
    transparency: true,
    animation: true,
    encodable: false,
    pitch: 'the classic format for simple animations',
    about:
      'GIF dates back to 1987 and survives today almost entirely because of animation. It is limited to a 256-color palette, which makes it a poor choice for photographs, and its compression is inefficient by modern standards — but every platform on earth plays a GIF.',
    bestFor: 'short looping animations, memes, and legacy compatibility',
    drawbacks:
      'only 256 colors, hard-edged (1-bit) transparency, and much larger files than modern formats',
    support: 'universally supported everywhere',
  },
  bmp: {
    id: 'bmp',
    name: 'BMP',
    longName: 'BMP (Windows Bitmap)',
    extension: 'bmp',
    mime: 'image/bmp',
    acceptMimes: ['image/bmp', 'image/x-ms-bmp'],
    lossy: false,
    transparency: false,
    animation: false,
    encodable: false,
    pitch: 'the uncompressed Windows legacy format',
    about:
      'BMP is the original Windows bitmap format. It stores pixels with little or no compression, so files are enormous — a single photo can be tens of megabytes. BMPs mostly appear today as exports from old software, scanners, medical devices, and industrial equipment.',
    bestFor:
      'nothing modern — BMPs are almost always converted to another format before being shared or published',
    drawbacks: 'huge file sizes, no transparency in common variants, no animation',
    support: 'opened by most software, but far too large to use on the web',
  },
  heic: {
    id: 'heic',
    name: 'HEIC',
    longName: 'HEIC (High Efficiency Image Container)',
    extension: 'heic',
    mime: 'image/heic',
    acceptMimes: ['image/heic', 'image/heif'],
    lossy: true,
    transparency: true,
    animation: false,
    encodable: false,
    pitch: "Apple's iPhone photo format",
    about:
      'HEIC is the format iPhones and iPads have used for photos since iOS 11. Built on the HEVC video codec, it stores photos at roughly half the size of an equivalent JPG — but outside the Apple ecosystem support is patchy. Windows needs paid codecs, many websites reject HEIC uploads, and most printing services will not accept it.',
    bestFor: 'staying on Apple devices — for everything else, convert it first',
    drawbacks:
      'poor support on Windows, Android, the web, and most upload forms; licensing restrictions keep adoption low',
    support: 'native on Apple devices; limited everywhere else',
  },
};

/** Formats we can decode in the browser (all of them). */
export const INPUT_FORMATS: FormatId[] = ['jpg', 'png', 'webp', 'avif', 'gif', 'bmp', 'heic'];

/** Formats we can encode in the browser (canvas + WASM AVIF). */
export const OUTPUT_FORMATS: FormatId[] = ['jpg', 'png', 'webp', 'avif'];

/** Accept attribute covering every supported input image type. */
export const ALL_IMAGE_ACCEPT = [
  ...new Set(INPUT_FORMATS.flatMap((f) => FORMATS[f].acceptMimes)),
  '.heic',
  '.heif',
  '.avif',
  '.bmp',
].join(',');
