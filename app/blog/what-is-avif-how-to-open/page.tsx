import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['what-is-avif-how-to-open'];

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
        You save an image from a website and get a <strong>.avif</strong> file. Windows
        Photos shrugs, your photo editor refuses it, and the upload form you needed it
        for says &quot;JPG or PNG only&quot;. AVIF files are suddenly everywhere because they&apos;re
        excellent for websites — and mildly infuriating everywhere else. Here&apos;s what
        you&apos;re dealing with and the fastest way through it.
      </p>

      <h2>What AVIF actually is</h2>
      <p>
        AVIF (AV1 Image File Format) is an image format built on the AV1 video codec —
        the same compression technology behind modern streaming. That ancestry gives it
        the best compression of any mainstream image format: AVIF files are typically
        about <strong>half the size of an equivalent JPG</strong> and noticeably smaller
        than WebP at the same visual quality, with support for transparency, HDR and
        wide color. That&apos;s exactly why performance-conscious websites serve their
        images as AVIF — and why the images you save from them arrive in a format your
        older software has never heard of.
      </p>

      <h2>Why half your apps won&apos;t open it</h2>
      <p>
        Browsers moved fast — every current version of Chrome, Firefox, Safari and Edge
        displays AVIF fine. Desktop software moved slowly: older image editors, Office
        versions, printers&apos; upload portals, government forms and plenty of phone apps
        still expect the formats of 2005. The file isn&apos;t broken; the app is behind.
      </p>

      <h2>The 10-second fix: convert it</h2>
      <p>
        Drop the file into FileLark&apos;s{' '}
        <Link href="/avif-to-jpg" className={A}>AVIF to JPG converter</Link> — or{' '}
        <Link href="/avif-to-png" className={A}>AVIF to PNG</Link> if the image has
        transparency you need to keep, or{' '}
        <Link href="/avif-to-webp" className={A}>AVIF to WebP</Link> for a web-friendly
        middle ground. Conversion happens in your browser (nothing is uploaded), works in
        batches, and takes about a second per image. JPG is the &quot;works absolutely
        everywhere&quot; choice; PNG when you need lossless quality or transparency.
      </p>

      <h2>Going the other way</h2>
      <p>
        Running a website? Converting your images <em>to</em> AVIF is one of the easiest
        page-speed wins available —{' '}
        <Link href="/jpg-to-avif" className={A}>JPG to AVIF</Link> and{' '}
        <Link href="/png-to-avif" className={A}>PNG to AVIF</Link> routinely halve image
        weight, which feeds straight into Core Web Vitals and rankings. See our{' '}
        <Link href="/blog/webp-vs-avif-vs-jpg" className={A}>WebP vs AVIF vs JPG
        comparison</Link> for when each format earns its place.
      </p>

      <h2>Quick answers</h2>
      <p>
        <strong>Is AVIF better than JPG?</strong> Technically, clearly yes — smaller,
        richer, more capable. Practically, JPG still wins wherever compatibility matters.{' '}
        <strong>Does converting AVIF to JPG lose quality?</strong> Marginally — both are
        lossy formats, but at 85–90% quality the difference is invisible; use PNG if
        you want zero loss. <strong>Why do saved website images keep coming out as
        AVIF?</strong> Because that&apos;s what the site serves modern browsers. Converting
        after saving is simpler than fighting it.
      </p>
    </ArticleLayout>
  );
}
