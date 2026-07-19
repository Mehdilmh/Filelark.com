import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

/**
 * Homepage/blog article preview: emoji, title, an intro line (the post's
 * description), reading time, and an explicit "Read article" button. The whole
 * card is a link; the button is a visual affordance within it.
 */
export default function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500"
    >
      <span className="text-2xl" aria-hidden>
        {post.emoji}
      </span>
      <h3 className="mt-3 font-semibold leading-snug text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {post.description}
      </p>
      <span className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {post.readingMinutes} min read
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-300 dark:group-hover:bg-brand-600 dark:group-hover:text-white">
          Read article
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
