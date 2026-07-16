import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description: `Guides and tips on image formats, PDF workflows, and AI art prompting from the ${SITE_NAME} team.`,
  alternates: { canonical: `${SITE_URL}/blog` },
};

/**
 * Blog scaffold. Add articles as `app/blog/<slug>/page.tsx` (or wire up MDX)
 * and list them here.
 */
export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Blog</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Guides on image formats, PDF workflows, and AI prompting are coming soon.
        In the meantime, every <Link href="/" className="text-brand-600 underline dark:text-brand-400">tool page</Link> includes
        a practical explainer about its formats and when to use them.
      </p>
    </div>
  );
}
