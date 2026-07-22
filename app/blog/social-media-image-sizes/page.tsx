import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['social-media-image-sizes'];

export const metadata: Metadata = {
  title: `${post.title} | FileLark Blog`,
  description: post.description,
  alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
};

const A = 'text-brand-600 underline dark:text-brand-400';

export default function Page() {
  return (
    <ArticleLayout post={post}>
      <p>
        Every platform crops, squeezes or blurs images that arrive at the wrong size —
        and &quot;the wrong size&quot; is different on every platform. Here are the dimensions
        that matter in 2026, followed by the two-minute workflow to hit them exactly.
      </p>

      <h2>The sizes that matter</h2>
      <p>
        <strong>Instagram:</strong> posts 1080×1350 (4:5 portrait — takes the most feed
        space; square 1080×1080 still works), Stories and Reels 1080×1920 (9:16), profile
        picture 320×320. <strong>Facebook:</strong> shared images 1200×630, cover photo
        820×312, profile 170×170. <strong>X (Twitter):</strong> in-stream images
        1600×900, header 1500×500. <strong>LinkedIn:</strong> shared images 1200×627,
        personal cover 1584×396, company logo 300×300. <strong>TikTok:</strong> video and
        photo-mode 1080×1920, profile 200×200. <strong>YouTube:</strong> thumbnail
        1280×720, channel banner 2048×1152 (with the safe area in the middle
        1235×338), avatar 800×800 — our{' '}
        <Link href="/blog/youtube-thumbnail-size-guide" className={A}>thumbnail guide</Link>{' '}
        goes deeper. <strong>Pinterest:</strong> pins 1000×1500 (2:3).
      </p>

      <h2>Why exact sizes beat &quot;close enough&quot;</h2>
      <p>
        Upload the wrong aspect ratio and the platform decides what to cut — usually
        someone&apos;s forehead or your headline. Upload too small and it stretches into
        blur; comically large and aggressive recompression adds artifacts. Matching the
        native size keeps the crop, the sharpness and the compression under{' '}
        <em>your</em> control.
      </p>

      <h2>The two-minute workflow</h2>
      <p>
        Open FileLark&apos;s <Link href="/resize-image" className={A}>image resizer</Link>,
        drop your image, switch to exact-pixels mode and enter the target dimensions —
        with the aspect-ratio lock on, it fits your image inside the box without
        distortion. Batch mode applies one size to a whole folder, handy for resizing a
        campaign&apos;s worth of visuals in one pass. Everything runs in your browser, so
        client work and unreleased creatives never touch a server.
      </p>
      <p>
        Then compress: platforms cap file sizes (and recompress big uploads badly), so
        run the result through the{' '}
        <Link href="/compress-image" className={A}>image compressor</Link> — under 1 MB
        is a safe universal target, under 200 KB for anything that&apos;s mostly a
        thumbnail. iPhone screenshots and photos in HEIC format? Convert them first with{' '}
        <Link href="/heic-to-jpg" className={A}>HEIC to JPG</Link>, since most platforms
        and schedulers still reject HEIC uploads.
      </p>

      <h2>Three habits that keep images sharp</h2>
      <p>
        Start from the largest original you have and scale <em>down</em> — enlarging
        can&apos;t invent detail. Keep text and faces away from the edges, where platform
        crops bite first. And export a fresh size per platform instead of reusing one
        compromise image everywhere: the 20 seconds per variant is the visible difference
        between a feed that looks professional and one that looks resized by the
        algorithm.
      </p>
    </ArticleLayout>
  );
}
