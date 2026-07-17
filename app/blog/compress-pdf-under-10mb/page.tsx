import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['compress-pdf-under-10mb'];

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
        &quot;Attachment exceeds the maximum size.&quot; Whether it&apos;s a visa application
        portal capped at 5 MB, a court filing system at 10 MB, or plain old email at
        25 MB, PDF size limits always appear at the worst possible moment. The good news:
        most oversized PDFs are oversized for one specific, fixable reason.
      </p>

      <h2>Why is your PDF huge?</h2>
      <p>
        Text is essentially free — a 300-page novel as a text-only PDF is about 2 MB. What
        bloats PDFs is <strong>images</strong>: scanned pages stored as full-resolution
        photos, phone-camera &quot;scans&quot; at 12 megapixels each, or slide decks exported
        with uncompressed screenshots. One scanned page at 600 DPI can be 5 MB on its
        own. That&apos;s why a 20-page scan can weigh 60 MB while a 200-page contract weighs 1.
      </p>

      <h2>Method 1: Compress the whole document</h2>
      <p>
        FileLark&apos;s <Link href="/compress-pdf" className={A}>PDF compressor</Link>{' '}
        re-renders every page at a sensible resolution and re-encodes it as an optimized
        JPEG — the same technique &quot;print to PDF at reduced quality&quot; uses, but in one
        step and entirely in your browser (nothing is uploaded, which matters for the
        contracts and medical records people most often need to shrink). Scanned and
        image-heavy documents routinely drop 70–90%: a 40 MB scan becomes 4–6 MB at the
        Balanced preset. One honest caveat: because pages are re-rendered as images,
        text in the output is no longer selectable — irrelevant for scans, worth knowing
        for born-digital documents.
      </p>

      <h2>Method 2: Remove what you don&apos;t need</h2>
      <p>
        Often the fastest win isn&apos;t compression — it&apos;s scope. If the portal wants
        &quot;pages 12–14 of your bank statement&quot;, don&apos;t upload all 40 pages:{' '}
        <Link href="/split-pdf" className={A}>extract just the range you need</Link>. Blank
        scanner pages and duplicate sheets can be dropped with the{' '}
        <Link href="/rotate-pdf" className={A}>page editor</Link>. Cutting a document from
        40 pages to 3 shrinks it proportionally with zero quality loss.
      </p>

      <h2>Method 3: Rebuild from better sources</h2>
      <p>
        If your PDF was built from photos, compress the images <em>first</em>, then
        rebuild. Run the photos through the{' '}
        <Link href="/compress-image" className={A}>image compressor</Link> with a target of
        150–200 KB each, then combine them with{' '}
        <Link href="/jpg-to-pdf" className={A}>images to PDF</Link>. Ten photos × 200 KB
        gives you a 2 MB document with quality that&apos;s indistinguishable on screen.
      </p>

      <h2>Hitting a specific number</h2>
      <p>
        Aim below the limit, not at it — portals often measure size differently than your
        file manager (megabytes vs mebibytes), so treat &quot;10 MB&quot; as &quot;9 MB&quot;. Start with
        the Balanced preset, check the before/after size shown, and step up to Strong
        only if needed. For extreme targets, combine methods: extract the required pages
        first, then compress the result. And always keep your original — compression is a
        one-way street.
      </p>
    </ArticleLayout>
  );
}
