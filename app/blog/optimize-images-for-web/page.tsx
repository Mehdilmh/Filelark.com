import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['optimize-images-for-web'];

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
        Images are almost always the heaviest thing on a web page — and the number one
        reason pages load slowly. Google measures that slowness directly through Core Web
        Vitals and factors it into rankings, so image optimization isn&apos;t just about
        speed; it&apos;s about whether your pages get found at all. The good news: a handful
        of simple rules routinely cut image weight by 80% with no visible loss.
      </p>

      <h2>Rule 1: Pick the right format</h2>
      <p>
        For photographs on the web, use <strong>WebP</strong> — it&apos;s 25–35% smaller
        than JPG at the same quality and supported by every modern browser. For maximum
        savings, <strong>AVIF</strong> goes further still (often half the size of JPG).
        Keep <strong>PNG</strong> only for graphics that need transparency or pixel-exact
        edges. The one place plain JPG still wins is compatibility with old software and
        upload forms — not your own website. Convert with{' '}
        <Link href="/jpg-to-webp" className={A}>JPG to WebP</Link> or{' '}
        <Link href="/png-to-webp" className={A}>PNG to WebP</Link> (see our full{' '}
        <Link href="/blog/webp-vs-avif-vs-jpg" className={A}>format comparison</Link>).
      </p>

      <h2>Rule 2: Stop serving pixels nobody sees</h2>
      <p>
        This is the single biggest mistake: uploading a 4000-pixel-wide phone photo into
        a slot that displays at 800 pixels. The browser downloads all four thousand and
        throws three-quarters away. <Link href="/resize-image" className={A}>Resize
        images</Link> to roughly the size they&apos;ll actually display — 1600px wide is
        plenty for a full-width hero, 800px for a content image, 400px for a thumbnail.
        This alone often cuts file size by 75% before you compress a single byte.
      </p>

      <h2>Rule 3: Compress to a sensible target</h2>
      <p>
        After format and dimensions, compression is the finishing step. The{' '}
        <Link href="/compress-image" className={A}>image compressor</Link> lets you set a
        target file size and finds the best quality that fits. Sensible targets: under
        200 KB for large hero images, under 100 KB for content images, under 50 KB for
        thumbnails. At 80–85% quality the difference from the original is invisible to
        the eye but dramatic on the scale.
      </p>

      <h2>The compounding effect</h2>
      <p>
        These rules multiply. A 6 MB phone photo → resized to display width (down to
        ~1.5 MB) → converted to WebP (~1 MB) → compressed to target (~150 KB). That&apos;s a
        40× reduction on one image; across a page with a dozen images it&apos;s the
        difference between a page that loads in half a second and one that makes visitors
        leave. Every tool mentioned here runs free in your browser, so you can optimize a
        whole gallery without uploading anything or paying for a plugin.
      </p>

      <h2>Two extras that help</h2>
      <p>
        Add <code>loading=&quot;lazy&quot;</code> to images below the fold so the browser only
        fetches them as the visitor scrolls, and always set explicit width and height
        attributes so the layout doesn&apos;t jump as images arrive (that jump is the
        &quot;CLS&quot; part of Core Web Vitals). Format, size and compression do the heavy
        lifting; these two make sure the browser uses your optimized images well.
      </p>
    </ArticleLayout>
  );
}
