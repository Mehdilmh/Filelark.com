import type { Metadata } from 'next';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE_NAME}`,
  description: `How ${SITE_NAME} handles your data: files are processed locally in your browser and never uploaded. Details on cookies, ads, and your GDPR/CCPA rights.`,
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="prose-section mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 2026</p>

      <h2>The short version</h2>
      <p>
        Your files are processed entirely inside your browser and are never uploaded to
        our servers — with one clearly-marked exception (the Image to Prompt tool). We
        collect minimal analytics, show ads to keep the site free, and never sell your
        personal data.
      </p>

      <h2>1. Files you convert</h2>
      <p>
        All image and PDF tools on {SITE_NAME} run locally on your device using browser
        technology (Canvas API, WebAssembly). When you convert, resize, compress, merge,
        or split a file, the file&apos;s contents are read by JavaScript running in your
        browser and are not transmitted over the network. We have no ability to see,
        store, or recover the files you process.
      </p>
      <p>
        <strong>Exception — Image to Prompt.</strong> This tool sends your uploaded image
        to our server, which forwards it to Anthropic&apos;s Claude API for analysis over an
        encrypted (HTTPS) connection. The image is used solely to generate the prompt
        text, is not written to disk by us, and is not used to train models. Anthropic&apos;s
        handling of API inputs is described in their privacy documentation.
      </p>

      <h2>2. Data we collect automatically</h2>
      <p>
        Like most websites, we receive standard technical information when you visit:
        IP address, browser type, device type, pages viewed, and referring page. We use
        this for aggregate analytics (understanding which tools are useful) and abuse
        prevention (rate-limiting the AI tool). We do not build individual profiles.
      </p>

      <h2>3. Cookies and local storage</h2>
      <p>
        We use browser local storage for functional purposes only: remembering your
        dark/light theme choice and counting your daily Image-to-Prompt usage. These
        values never leave your browser. Advertising partners (below) may set their own
        cookies, subject to your consent where required.
      </p>

      <h2>4. Advertising</h2>
      <p>
        {SITE_NAME} is funded by display advertising (Google AdSense). Ad providers may
        use cookies or similar technologies to show ads that are relevant to you and to
        measure ad performance. In the European Economic Area, the UK, and other regions
        with consent requirements, ads are only personalised with your consent; you can
        decline and still use every tool. You can also opt out of personalised
        advertising at adssettings.google.com.
      </p>

      <h2>5. Your rights (GDPR &amp; CCPA)</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete,
        or port personal data we hold about you, to object to processing, and to lodge a
        complaint with a supervisory authority. Because we deliberately hold almost no
        personal data — files never reach us — most requests are satisfied by clearing
        your own browser storage. For anything else, contact us and we will respond
        within 30 days. We do not sell personal information as defined by the CCPA.
      </p>

      <h2>6. Children</h2>
      <p>
        {SITE_NAME} does not knowingly collect personal information from children under
        13 (or the higher age required in your jurisdiction).
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        We will update this page when our practices change and adjust the date at the
        top. Significant changes will be highlighted on the homepage.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 underline dark:text-brand-400">{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
