import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['midjourney-prompts-from-images'];

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
        Every Midjourney user has had the experience: you see an image with a look you
        love — a lighting style, a color mood, a rendering technique — and your own
        attempts to describe it produce something completely different. The problem
        usually isn&apos;t your imagination; it&apos;s vocabulary. The fastest way to build
        prompt vocabulary is to <strong>reverse-engineer images you admire</strong>.
      </p>

      <h2>Anatomy of a strong Midjourney prompt</h2>
      <p>
        Prompts that consistently work tend to follow the same skeleton:{' '}
        <strong>subject → composition → lighting → palette/mood → style/medium →
        parameters</strong>. For example: <em>&quot;weathered lighthouse on a basalt cliff,
        low-angle wide shot, storm light breaking through clouds, muted teal and slate
        palette, cinematic photography --ar 16:9 --v 7&quot;</em>. Each segment does one
        job. When a prompt fails, you can usually point to which segment is missing —
        most beginner prompts have a subject and nothing else.
      </p>

      <h2>The parameters that matter</h2>
      <p>
        <strong>--ar</strong> sets aspect ratio (16:9 cinematic, 9:16 for phone
        wallpapers and Reels, 1:1 for avatars). <strong>--v</strong> pins the model
        version so results stay consistent. <strong>--stylize</strong> (0–1000) controls
        how much Midjourney imposes its own aesthetic — lower for literal renderings of
        your words, higher for beauty at the cost of obedience. <strong>--chaos</strong>{' '}
        adds variety across the four grid images when you want exploration rather than
        refinement.
      </p>

      <h2>Learn by reverse-engineering</h2>
      <p>
        Here&apos;s the loop that levels people up quickly. Take an image whose style you
        want — your own photo, a render, a painting — and run it through FileLark&apos;s{' '}
        <Link href="/image-to-midjourney-prompt" className={A}>image-to-Midjourney-prompt
        generator</Link>. A vision AI describes the subject, framing, light, palette, and
        style in prompt form, with --ar matched to the image. The output teaches
        you the <em>words</em> for what you&apos;re seeing: that &quot;glowy portrait look&quot; turns
        out to be &quot;backlit golden-hour rim lighting with haze&quot;; that &quot;clean product
        style&quot; is &quot;studio softbox lighting on seamless background, high-key&quot;.
      </p>
      <p>
        Then iterate: swap the subject and keep everything else. A prompt that renders a
        &quot;bioluminescent jellyfish, macro photography, inky black background&quot; will apply
        the same treatment to a dandelion or a chess piece. This subject-swap technique is
        how prompt libraries are actually built.
      </p>

      <h2>Common mistakes to avoid</h2>
      <p>
        <strong>Contradictory instructions</strong> (&quot;minimalist, intricate details&quot;)
        force the model to average two aesthetics and produce mush.{' '}
        <strong>Keyword salads</strong> of twenty comma-separated adjectives dilute each
        other — five precise descriptors beat twenty vague ones.{' '}
        <strong>Negation</strong> mostly doesn&apos;t work in the main prompt: &quot;no text&quot;
        often <em>adds</em> text; use the --no parameter instead (e.g.{' '}
        <em>--no text, watermark</em>).
      </p>

      <h2>Working across models</h2>
      <p>
        Midjourney rewards flowing natural language, while Stable Diffusion interfaces
        respond better to weighted tag lists plus a negative prompt. If you generate
        across both, FileLark&apos;s <Link href="/image-to-prompt" className={A}>image-to-prompt
        tool</Link> outputs all three variants — Midjourney, Stable Diffusion (with a
        matching negative prompt), and a rich plain-language description for DALL·E,
        Flux, and everything else — from a single image, each with one-click copy.
      </p>

      <h2>A note on ethics</h2>
      <p>
        Reverse-engineering a <em>style</em> — lighting, palette, mood, technique — is how
        every artist has always learned. Passing off a recreation of someone&apos;s specific
        work as your own is different. Use these tools to learn vocabulary and develop
        your own direction, credit inspirations where it matters, and avoid prompting for
        identifiable artists&apos; signatures on commercial work.
      </p>
    </ArticleLayout>
  );
}
