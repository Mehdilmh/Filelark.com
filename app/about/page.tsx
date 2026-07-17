import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `About ${SITE_NAME} — Private, Browser-Based File Tools`,
  description: `Learn how ${SITE_NAME} converts images and PDFs entirely in your browser — no uploads, no accounts, free forever.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="prose-section mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About {SITE_NAME}</h1>

      <h2>Our one big idea</h2>
      <p>
        Most online file converters work the same way they did in 2005: you upload your
        file to someone else&apos;s server, wait in a queue, and hope the site deletes your
        data afterwards. {SITE_NAME} was built on a simple observation — modern browsers
        are powerful enough to do all of this work themselves.
      </p>
      <p>
        Every image conversion, resize, compression, and PDF operation on this site runs
        locally on your device, using the same web technologies (Canvas, WebAssembly, Web
        Workers) that power browser games and photo editors. Your files are never
        transmitted anywhere. That isn&apos;t a marketing promise that depends on our good
        behaviour — it&apos;s an architectural fact you can verify: open your browser&apos;s
        network tab while converting and you&apos;ll see zero uploads.
      </p>

      <h2>What that means for you</h2>
      <p>
        <strong>Privacy by design.</strong> Contracts, IDs, medical documents, and family
        photos are processed on your own computer. There is no server copy to breach, sell,
        or subpoena. <strong>No limits.</strong> Server-based converters cap file sizes and
        daily conversions because processing costs them money. Our conversions cost nothing
        to run, so there are no caps, queues, or paywalls. <strong>Speed.</strong> There is
        no upload or download round-trip — a 20 MB photo converts in about a second.
      </p>

      <h2>The one exception</h2>
      <p>
        Our <Link href="/image-to-prompt" className="text-brand-600 underline dark:text-brand-400">Image to Prompt</Link> tool
        is the single feature that uses a server, because it sends your image to a vision
        AI model for analysis. Images are analysed over an encrypted connection and never
        stored. It&apos;s limited to five free generations per day to keep it sustainable.
      </p>

      <h2>How the site stays free</h2>
      <p>
        {SITE_NAME} is supported by display advertising. Ads let us keep every tool free
        and unlimited without accounts, subscriptions, or &quot;pro&quot; upsells. We never sell
        user data — see our <Link href="/privacy-policy" className="text-brand-600 underline dark:text-brand-400">privacy policy</Link> for
        the details.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a bug, need a format we don&apos;t support yet, or want to say hi? Visit the{' '}
        <Link href="/contact" className="text-brand-600 underline dark:text-brand-400">contact page</Link> — we read everything.
      </p>
    </div>
  );
}
