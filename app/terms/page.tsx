import type { Metadata } from 'next';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE_NAME}`,
  description: `The terms that govern your use of ${SITE_NAME}'s free browser-based file conversion tools.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="prose-section mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 2026</p>

      <h2>1. Acceptance of terms</h2>
      <p>
        By using {SITE_NAME} (the &quot;Service&quot;) you agree to these Terms of Service. If you
        do not agree, please do not use the Service.
      </p>

      <h2>2. The service</h2>
      <p>
        {SITE_NAME} provides free, browser-based file utilities: image conversion,
        resizing and compression, PDF manipulation, and an AI-powered image-to-prompt
        generator. Except for the image-to-prompt generator, all processing happens
        locally on your device. The Service is provided free of charge and supported by
        advertising.
      </p>

      <h2>3. Acceptable use</h2>
      <p>
        You agree to use the Service only for lawful purposes. You must not use the
        Service to process content that infringes intellectual-property rights, contains
        malware, or is otherwise illegal; attempt to disrupt, overload, or reverse the
        Service&apos;s security measures (including AI rate limits); or scrape, resell, or
        rebrand the Service without permission.
      </p>

      <h2>4. Your content</h2>
      <p>
        You retain all rights to the files you process. Because conversion happens in
        your browser, we never receive, store, or claim any rights over your files.
        Images submitted to the image-to-prompt tool are processed transiently to
        generate a response and are not retained by us. You are solely responsible for
        ensuring you have the rights to process the files you use with the Service.
      </p>

      <h2>5. No warranty</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any
        kind, express or implied, including fitness for a particular purpose and
        non-infringement. We do not guarantee that conversions will be error-free or
        that the Service will be uninterrupted. Always keep copies of your original
        files.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {SITE_NAME} and its operators shall not
        be liable for any indirect, incidental, special, consequential, or punitive
        damages, or for any loss of data, arising from your use of the Service. Our
        total liability for any claim shall not exceed one hundred US dollars (US$100).
      </p>

      <h2>7. Third-party services</h2>
      <p>
        The image-to-prompt feature relies on Anthropic&apos;s Claude API; its availability
        depends on that third-party service. Advertisements are served by third-party
        ad networks that operate under their own terms and policies.
      </p>

      <h2>8. Changes and termination</h2>
      <p>
        We may modify or discontinue any part of the Service at any time, and may update
        these terms by posting a revised version on this page. Continued use after
        changes constitutes acceptance.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 underline dark:text-brand-400">{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
