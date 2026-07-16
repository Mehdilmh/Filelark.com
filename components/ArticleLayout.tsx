import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export default function ArticleLayout({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <Link href="/blog" className="text-brand-600 hover:underline dark:text-brand-400">
          ← Blog
        </Link>{' '}
        · {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
        {post.readingMinutes} min read
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
        {post.title}
      </h1>
      <div className="prose-section mt-6">{children}</div>
    </article>
  );
}
