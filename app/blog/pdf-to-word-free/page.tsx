import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['pdf-to-word-free'];

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
        Someone sends you a contract as a PDF and asks for &quot;your edits by Friday&quot;. A
        report needs updating but the original Word file is long gone. PDF is built to be
        looked at, not edited — so &quot;PDF to Word&quot; is one of the most searched document
        tasks on the internet, and also one of the most oversold. Here&apos;s what actually
        works, for free, and where every converter (including ours) has limits.
      </p>

      <h2>The two kinds of PDF — this determines everything</h2>
      <p>
        <strong>Text-based PDFs</strong> were exported from software (Word, Google Docs, a
        billing system). Open one in any viewer and you can select the text with your
        cursor. These convert well. <strong>Scanned PDFs</strong> are photographs of
        paper — try to select the text and you just drag a box over an image. These
        contain no text at all, only pixels, and converting them requires OCR (optical
        character recognition), a different technology with its own error rate. The
        30-second cursor test tells you which kind you have before you waste any time.
      </p>

      <h2>Converting a text-based PDF</h2>
      <p>
        Drop it into FileLark&apos;s{' '}
        <Link href="/pdf-to-word" className={A}>PDF to Word converter</Link>. The text of
        every page is extracted in your browser — the document is never uploaded, which
        matters since the PDFs people most need to edit are contracts, agreements and
        financial documents — and downloads as a .docx that opens in Word, Google Docs or
        LibreOffice.
      </p>
      <p>
        Honest expectations: you get the <em>text</em>, faithfully and in order, page by
        page. You don&apos;t get a pixel-perfect replica — multi-column magazine layouts,
        embedded images and elaborate tables are simplified into flowing paragraphs.
        For the actual job (reusing the wording, updating clauses, quoting passages)
        that&apos;s precisely what you want; for reproducing the document&apos;s appearance,
        you want the original file, not a conversion.
      </p>

      <h2>Is it really free — no sign-up, no credit card?</h2>
      <p>
        Yes. No account, no email, no card, no trial that flips to paid, no watermark,
        and no daily conversion limit. That&apos;s possible precisely <em>because</em> the
        conversion runs on your device: there are no server costs to recover, so there&apos;s
        nothing to charge for. Services that convert on their servers have to meter free
        use — the &quot;free&quot; converters that demand a card at download time are
        recovering real compute bills. Different architecture, different economics.
      </p>

      <h2>Only need part of the document?</h2>
      <p>
        Don&apos;t convert 60 pages to edit two. Use{' '}
        <Link href="/split-pdf" className={A}>Split PDF</Link> to extract just the pages
        you need, convert that, and keep the rest untouched. The reverse trip works too:
        when your edits are done, images of signatures or exhibits can be reattached by
        rebuilding with <Link href="/jpg-to-pdf" className={A}>images to PDF</Link> and{' '}
        <Link href="/merge-pdf" className={A}>merge</Link>.
      </p>

      <h2>What about scanned documents?</h2>
      <p>
        A scan needs OCR, which our converter deliberately doesn&apos;t pretend to do —
        tools that silently return a blank document for scans waste your afternoon. For
        occasional scans, Google Docs has serviceable built-in OCR: upload the PDF to
        Drive, right-click → Open with → Google Docs. For high-stakes documents, dedicated
        OCR software is still worth it, and always proofread the output — even the best
        OCR misreads a character here and there, and in a contract, one character
        matters.
      </p>
    </ArticleLayout>
  );
}
