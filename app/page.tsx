import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { websiteJsonLd } from '@/lib/content';
import { CATEGORIES, toolsByCategory } from '@/lib/tools';

const POPULAR = ['heic-to-jpg', 'jpg-to-png', 'png-to-webp', 'webp-to-png', 'pdf-to-jpg', 'merge-pdf', 'compress-image', 'image-to-prompt'];

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

      <div className="mx-auto max-w-content px-4">
        {/* Popular tools */}
        <section className="py-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Popular tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR.map((slug) => {
              const tool = toolsByCategory('Image Converters')
                .concat(toolsByCategory('Image Tools'), toolsByCategory('PDF Tools'), toolsByCategory('AI Tools'))
                .find((t) => t.slug === slug);
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

        {/* SEO content */}
        <section className="prose-section mx-auto max-w-3xl py-12">
          <h2>Why use a browser-based file converter?</h2>
          <p>
            Traditional online converters upload your files to a server, process them
            remotely, and send back the result. That means waiting in queues, hitting
            arbitrary size limits, and — most importantly — trusting a stranger&apos;s server
            with your photos and documents. ConvertKitPro works differently: every
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
