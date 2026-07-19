import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['merge-pdf-files-free'];

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
        You scanned a document in three batches. Your accountant sent four separate
        invoices. A report&apos;s chapters live in five different files. Whenever a single
        PDF has to be assembled from pieces, you need to merge — and the tools that offer
        it are mostly upload sites that queue your files, cap the size, and keep a copy on
        someone else&apos;s server.
      </p>

      <h2>Merge without uploading anything</h2>
      <p>
        FileLark&apos;s <Link href="/merge-pdf" className={A}>Merge PDF tool</Link> combines
        files entirely inside your browser. Drop in two or more PDFs, drag them into the
        order you want, and press Merge — the pages are copied losslessly, so text stays
        selectable and nothing is re-compressed. Because the work happens on your device,
        there&apos;s no page limit, no file-size cap beyond your computer&apos;s memory, and no
        server that ever sees documents that are often contracts, leases or medical
        records.
      </p>

      <h2>Getting the order right</h2>
      <p>
        Order is where merges go wrong. Before you press the button, drag each file up or
        down in the list until the sequence is correct — the merged document follows that
        order exactly. If a single file has its own pages out of sequence, or you only
        want <em>some</em> of its pages, fix that first with{' '}
        <Link href="/split-pdf" className={A}>Split PDF</Link> to extract just what you
        need, then merge the clean pieces.
      </p>

      <h2>Common real-world jobs</h2>
      <p>
        <strong>Multi-batch scans:</strong> merge the batches into one document in page
        order. <strong>Application packets:</strong> combine a cover letter, CV and
        certificates into a single file a portal will accept. <strong>Signed pages:</strong>{' '}
        drop a signed signature page back into the contract it belongs to.{' '}
        <strong>Mixed sources:</strong> turn a folder of images into a PDF first with{' '}
        <Link href="/jpg-to-pdf" className={A}>images to PDF</Link>, then merge it with
        your text documents.
      </p>

      <h2>A few things to know</h2>
      <p>
        Password-protected PDFs must be unlocked in their original app before merging —
        the tool won&apos;t crack encryption. If the merged file comes out larger than
        you&apos;d like (usually because one source was an image-heavy scan), run it through
        the <Link href="/compress-pdf" className={A}>PDF compressor</Link> afterwards.
        And keep your originals until you&apos;ve confirmed the merged file is right —
        merging is quick to redo, but there&apos;s no reason to delete the parts early.
      </p>
    </ArticleLayout>
  );
}
