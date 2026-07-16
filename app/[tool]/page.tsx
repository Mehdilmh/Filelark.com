import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import FaqSection from '@/components/Faq';
import FormatSwitcher from '@/components/FormatSwitcher';
import PromptShowcase from '@/components/PromptShowcase';
import RelatedTools from '@/components/RelatedTools';
import TrustBadges from '@/components/TrustBadges';
import ToolWidget from '@/components/widgets/ToolWidget';
import { toolContent, toolFaqs, toolJsonLd } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { getTool, TOOLS } from '@/lib/tools';

interface Params {
  params: { tool: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const tool = getTool(params.tool);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `${SITE_URL}/${tool.slug}` },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `${SITE_URL}/${tool.slug}`,
      type: 'website',
    },
  };
}

export default function ToolPage({ params }: Params) {
  const tool = getTool(params.tool);
  if (!tool) notFound();

  const sections = toolContent(tool);
  const faqs = toolFaqs(tool);
  const jsonLd = toolJsonLd(tool);
  const midIndex = Math.ceil(sections.length / 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-content px-4 py-10">
        <div className="lg:flex lg:gap-8">
          <div className="min-w-0 flex-1">
            {/* Hero */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                {tool.h1}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                {tool.subtitle}
              </p>
            </header>

            {/* Format quick-chooser (conversion pages only) */}
            <FormatSwitcher tool={tool} />

            {/* The working tool */}
            <ToolWidget tool={tool} />
            <TrustBadges serverSide={tool.kind === 'image-to-prompt'} />

            {tool.kind === 'image-to-prompt' && (
              <div className="mt-10">
                <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Example prompts generated with FileLark
                </h2>
                <PromptShowcase />
              </div>
            )}

            <AdSlot position="below-tool" />

            {/* SEO content */}
            <article className="prose-section mt-4">
              {sections.map((section, i) => (
                <section key={section.heading}>
                  {i === midIndex && <AdSlot position="mid-content" />}
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </section>
              ))}
            </article>

            <FaqSection faqs={faqs} />
            <RelatedTools tool={tool} />
          </div>

          {/* Desktop sidebar ad */}
          <aside className="hidden w-[300px] shrink-0 lg:block">
            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
