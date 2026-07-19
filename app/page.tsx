import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import PromptShowcase from '@/components/PromptShowcase';
import ToolCard from '@/components/ToolCard';
import TrustBadges from '@/components/TrustBadges';
import ToolWidget from '@/components/widgets/ToolWidget';
import { POSTS } from '@/lib/blog';
import { websiteJsonLd } from '@/lib/content';
import { CATEGORIES, getTool, toolsByCategory } from '@/lib/tools';

const LATEST_POSTS = [...POSTS]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 6);

const POPULAR = ['remove-background', 'heic-to-jpg', 'mp4-to-mp3', 'youtube-thumbnail-downloader', 'video-to-gif', 'pdf-to-word', 'compress-image', 'image-to-prompt'];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-content px-4 py-16 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Free File Converter — No Uploads, No Limits
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Convert images, edit PDFs, and generate AI prompts — everything runs
            in your browser, so your files never leave your device.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span>🔒 100% private</span>
            <span>⚡ Instant results</span>
            <span>🆓 Free forever</span>
            <span>🚫 No sign-up</span>
          </div>
        </div>
      </section>

      {/* Image to Prompt — try it right here */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-content px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              ✨ Featured tool
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Turn Any Image into an AI Prompt
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              Drop an image below and get ready-to-use Midjourney, Stable Diffusion
              and detailed prompts in seconds — 5 free generations every day.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <ToolWidget tool={getTool('image-to-prompt')!} />
            <TrustBadges serverSide />
            <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Want Midjourney-only or Stable-Diffusion-only output?{' '}
              <Link href="/image-to-midjourney-prompt" className="text-brand-600 underline dark:text-brand-400">
                Midjourney generator
              </Link>{' '}
              ·{' '}
              <Link href="/image-to-stable-diffusion-prompt" className="text-brand-600 underline dark:text-brand-400">
                Stable Diffusion generator
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Example prompts generated with FileLark
            </h3>
            <PromptShowcase />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4">
        {/* Popular tools */}
        <section className="py-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Popular tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR.map((slug) => {
              const tool = getTool(slug);
              return tool ? <ToolCard key={slug} tool={tool} /> : null;
            })}
          </div>
        </section>

        {/* All tools by category */}
        {CATEGORIES.map((cat) => (
          <section key={cat} className="py-6">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{cat}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {toolsByCategory(cat).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        ))}

        {/* From the blog — article intros with read-more buttons */}
        <section className="py-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Guides &amp; tips from the blog
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Practical how-tos on image formats, PDFs, video and AI prompting.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden shrink-0 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400 sm:inline"
            >
              View all articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LATEST_POSTS.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/blog" className="btn-secondary">
              View all articles →
            </Link>
          </div>
        </section>

        {/* SEO content */}
        <section className="prose-section mx-auto max-w-3xl py-12">
          <h2>Why use a browser-based file converter?</h2>
          <p>
            Traditional online converters upload your files to a server, process them
            remotely, and send back the result. That means waiting in queues, hitting
            arbitrary size limits, and — most importantly — trusting a stranger&apos;s server
            with your photos and documents. FileLark works differently: every
            conversion runs locally in your browser using the Canvas API and WebAssembly.
            Nothing is uploaded, ever.
          </p>
          <h2>What can you convert?</h2>
          <p>
            Images: JPG, PNG, WebP, AVIF, GIF, BMP and iPhone HEIC photos, with batch
            conversion, resizing and compression to a target file size. PDFs: convert
            pages to images, combine images into a PDF, merge, split, compress, rotate
            and delete pages. And for AI artists, the <Link href="/image-to-prompt" className="text-brand-600 underline dark:text-brand-400">image-to-prompt generator</Link>{' '}
            turns any picture into ready-to-use Midjourney and Stable Diffusion prompts.
          </p>
          <h2>Free forever — here&apos;s how</h2>
          <p>
            Because conversions happen on your device, running this site costs almost
            nothing — there are no processing servers to pay for. The site is supported
            by unobtrusive ads, which means every tool stays free, unlimited, and
            available without an account.
          </p>
        </section>
      </div>
    </>
  );
}
