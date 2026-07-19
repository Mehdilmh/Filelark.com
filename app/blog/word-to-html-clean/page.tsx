import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['word-to-html-clean'];

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
        Every writer knows the mess: you draft an article in Word or Google Docs, paste it
        into WordPress or your CMS, and the formatting explodes into a tangle of{' '}
        <code>&lt;span style=&quot;...&quot;&gt;</code> tags, phantom fonts and broken
        spacing. Word wasn&apos;t built to produce web markup — it exports its own internal
        styling, and pasting drags all of it along.
      </p>

      <h2>What &quot;clean HTML&quot; means</h2>
      <p>
        Clean HTML uses <em>semantic</em> tags that describe structure, not appearance:
        headings become <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code>, bold becomes{' '}
        <code>&lt;strong&gt;</code>, italics <code>&lt;em&gt;</code>, lists become real{' '}
        <code>&lt;ul&gt;</code> and <code>&lt;ol&gt;</code>, and links survive as proper{' '}
        <code>&lt;a&gt;</code> tags — with no inline styles fighting your site&apos;s
        design. This is what search engines read to understand your content and what keeps
        pages fast and consistent.
      </p>

      <h2>Convert without the mess</h2>
      <p>
        FileLark&apos;s <Link href="/word-to-html" className={A}>Word to HTML converter</Link>{' '}
        turns a .docx file into exactly that — semantic markup only. Drop the file and you
        get a live preview, the raw HTML with a one-click copy button, and a downloadable
        .html file. It runs in your browser, so your draft is never uploaded. Writing in
        Google Docs? Use <strong>File → Download → Microsoft Word (.docx)</strong> first,
        then drop that file in.
      </p>

      <h2>Why this helps your SEO</h2>
      <p>
        Search engines infer meaning from structure. A real <code>&lt;h2&gt;</code> tells
        Google &quot;this is a section heading&quot;; the same text styled bold in a{' '}
        <code>&lt;p&gt;</code> tells it nothing. Proper heading hierarchy, semantic
        emphasis and lean markup all feed the signals that help pages rank — and lean HTML
        loads faster, which feeds Core Web Vitals too. Word&apos;s exported soup does the
        opposite: it buries your structure under styling noise.
      </p>

      <h2>A note on images</h2>
      <p>
        Images embedded in the .docx come through as inline data URIs, so the HTML is
        self-contained and nothing goes missing. For a production site, though, it&apos;s
        better to upload those images to your CMS and swap the sources — inline images
        make the HTML file large and can&apos;t be cached or optimized separately. Optimize
        them first with the <Link href="/compress-image" className={A}>image compressor</Link>{' '}
        and <Link href="/resize-image" className={A}>resizer</Link> so your published page
        stays fast.
      </p>
    </ArticleLayout>
  );
}
