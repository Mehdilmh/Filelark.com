import type { Metadata } from 'next';
import Link from 'next/link';
import { POSTS } from '@/lib/blog';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: `Blog — Image Formats, PDF Workflows & AI Prompting | ${SITE_NAME}`,
  description: `Practical guides on image formats, PDF workflows, and AI art prompting from the ${SITE_NAME} team.`,
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Blog</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Practical guides on image formats, PDF workflows, and AI prompting.
      </p>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500"
          >
            <span className="text-2xl" aria-hidden>
              {post.emoji}
            </span>
            <span>
              <span className="block font-semibold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                {post.title}
              </span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">
                {post.description}
              </span>
              <span className="mt-2 block text-xs text-slate-400 dark:text-slate-500">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readingMinutes} min read
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
