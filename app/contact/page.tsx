import type { Metadata } from 'next';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Contact — ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team — bug reports, feature requests, and feedback.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact us</h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-400">
        Found a bug? Missing a format you need? Have feedback about a tool? We read every
        message and usually reply within a couple of days.
      </p>
      <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary mt-8">
        ✉️ {CONTACT_EMAIL}
      </a>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Please don&apos;t attach sensitive files — remember, we can&apos;t see anything you convert
        on the site, and we&apos;d like to keep it that way.
      </p>
    </div>
  );
}
