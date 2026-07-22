import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['split-pdf-extract-pages'];

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
        The portal wants &quot;pages 12–14 of your bank statement&quot; — not all forty. A
        client should see the proposal, not the internal pricing appendix behind it. You
        need the signed signature page, nothing else. Sending a whole PDF when someone
        needs three pages of it is how private information leaks by accident, and
        splitting is the two-minute fix.
      </p>

      <h2>Extract a page range</h2>
      <p>
        Drop your PDF into FileLark&apos;s{' '}
        <Link href="/split-pdf" className={A}>Split PDF tool</Link>, and it shows the page
        count. Type the pages you want using ranges and commas — <em>1-3, 7, 12-14</em> —
        and press Extract. A new PDF containing exactly those pages, in that order,
        downloads immediately. The pages are copied losslessly: text stays selectable,
        images aren&apos;t re-compressed, and the quality is identical to the original.
      </p>

      <h2>Or split every page into its own file</h2>
      <p>
        The second mode explodes the document: every page becomes a separate single-page
        PDF, delivered together as a ZIP. It&apos;s the right choice when a scanner
        combined a stack of separate documents into one file, or when each page goes to a
        different recipient — invoices, certificates, tickets.
      </p>

      <h2>Why in-browser matters here specifically</h2>
      <p>
        Think about what people split: bank statements, medical records, contracts,
        filings. Upload-based tools put those documents on someone else&apos;s server and
        ask you to trust a deletion policy. FileLark&apos;s splitter runs entirely in your
        browser — the file never leaves your device, so there is nothing to trust and
        nothing to leak. It also means no size caps and no queues, even on a 500-page
        document.
      </p>

      <h2>Split, then recombine</h2>
      <p>
        Splitting pairs naturally with{' '}
        <Link href="/merge-pdf" className={A}>Merge PDF</Link>: extract the pieces you
        need from several documents, then merge them into one tidy packet — the standard
        workflow for applications, claims and court filings. If a page is sideways or an
        extra blank crept in, fix it visually with the{' '}
        <Link href="/rotate-pdf" className={A}>rotate &amp; delete pages tool</Link>{' '}
        before you send. And if the extracted file still needs to fit an upload limit,
        finish with the <Link href="/compress-pdf" className={A}>PDF compressor</Link>.
      </p>

      <h2>Quick answers</h2>
      <p>
        <strong>Does splitting reduce quality?</strong> No — pages are copied, not
        re-rendered. <strong>Password-protected PDFs?</strong> Unlock them in their
        original app first; the tool doesn&apos;t bypass encryption.{' '}
        <strong>Page order?</strong> Pages come out in the order you type them, so{' '}
        <em>7, 1-3</em> puts page 7 first — occasionally exactly what you want.
      </p>
    </ArticleLayout>
  );
}
