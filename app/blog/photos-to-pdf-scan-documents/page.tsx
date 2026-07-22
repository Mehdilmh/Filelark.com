import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['photos-to-pdf-scan-documents'];

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
        Nobody owns a scanner anymore — and nobody needs to. A phone camera plus a
        browser is a complete document-scanning setup: photograph the pages, combine them
        into a single PDF, and submit. The catch is that most &quot;scanner apps&quot; want a
        subscription, stamp watermarks on your documents, or quietly upload your ID and
        contracts to their servers. Here&apos;s the free, private version of the workflow.
      </p>

      <h2>Step 1: Photograph the pages properly</h2>
      <p>
        Two minutes of care here beats any amount of fixing later. Lay the page flat in
        even light (near a window, not under a single lamp), fill the frame with the
        page, hold the phone parallel to the paper, and let the camera focus before
        shooting. Shadows from your own hand or phone are the most common problem —
        shoot from slightly to the side of the light source.
      </p>

      <h2>Step 2: Combine the photos into one PDF</h2>
      <p>
        Open FileLark&apos;s <Link href="/jpg-to-pdf" className={A}>images to PDF tool</Link>{' '}
        and drop in all the photos — JPG, PNG, and iPhone HEIC all work directly, no
        pre-conversion needed. Drag them into page order, press Create PDF, and each
        photo becomes one page, sized to the image so nothing gets cropped. It all
        happens in your browser: your ID, lease or medical form is never uploaded
        anywhere.
      </p>

      <h2>Step 3: Fix and finish</h2>
      <p>
        Sideways page? The <Link href="/rotate-pdf" className={A}>rotate &amp; delete
        tool</Link> shows a thumbnail of every page — turn any page in 90° steps and drop
        the accidental duplicates. Too big for the upload portal? Phone photos are 3–5 MB
        each, so a ten-page &quot;scan&quot; can hit 40 MB; the{' '}
        <Link href="/compress-pdf" className={A}>PDF compressor</Link> typically brings it
        down 70–90%, comfortably under the usual 10 MB limits. For the smallest possible
        file, <Link href="/compress-image" className={A}>compress the photos first</Link>{' '}
        (150–200 KB each is plenty for documents), then build the PDF.
      </p>

      <h2>When to use this vs. a scanner app</h2>
      <p>
        For submitting readable documents — applications, receipts, signed forms,
        homework — photos-to-PDF is all you need. Dedicated scanner apps still earn their
        keep in two cases: automatic edge-cropping/de-skewing when you scan dozens of
        pages daily, and OCR when you need the text to be searchable. For the occasional
        scan that just needs to arrive as one clean PDF, the browser workflow is free,
        watermark-free, and private.
      </p>

      <h2>One habit worth keeping</h2>
      <p>
        Name the file properly before you send it — <em>lastname-lease-2026.pdf</em>{' '}
        beats <em>images.pdf</em> in every inbox — and keep the original photos until the
        recipient confirms. Rebuilding a PDF takes a minute; re-photographing a returned
        document you already mailed back does not.
      </p>
    </ArticleLayout>
  );
}
