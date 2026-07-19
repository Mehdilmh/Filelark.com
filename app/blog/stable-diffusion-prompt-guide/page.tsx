import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['stable-diffusion-prompt-guide'];

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
        Stable Diffusion rewards a very different prompting style from Midjourney. Where
        Midjourney likes flowing natural language, SD interfaces like AUTOMATIC1111 and
        ComfyUI respond best to structured <em>tag lists</em>, weighted terms, and — the
        piece beginners most often skip — a well-built negative prompt. Get those right
        and the same model produces dramatically better images.
      </p>

      <h2>Structure: most important first</h2>
      <p>
        SD reads a prompt as a comma-separated list of concepts, and terms near the front
        carry more weight. A reliable order is: <strong>subject → key details → style /
        medium → lighting → quality tags</strong>. For example:{' '}
        <em>&quot;portrait of an old fisherman, weathered skin, salt-and-pepper beard,
        oil painting, dramatic rembrandt lighting, highly detailed, masterpiece&quot;</em>.
        Each comma is a lever; front-load what matters most.
      </p>

      <h2>Weights: turn concepts up and down</h2>
      <p>
        SD lets you emphasise terms with parentheses and numbers:{' '}
        <code>(golden hour:1.3)</code> pushes that concept harder,{' '}
        <code>(background:0.7)</code> eases it back. Use this sparingly — over-weighting
        one term at the expense of everything else is the most common way prompts go
        sideways. Start neutral, generate, then nudge a single weight at a time.
      </p>

      <h2>The negative prompt is half the work</h2>
      <p>
        This is what separates SD from other tools. The negative prompt lists what you
        <em>don&apos;t</em> want, and it&apos;s where you fix SD&apos;s characteristic
        failures. A solid general-purpose starting point:{' '}
        <em>&quot;blurry, low quality, distorted, deformed, extra limbs, bad anatomy,
        watermark, text, signature, jpeg artifacts&quot;</em>. Add specifics as problems
        appear — if hands keep coming out wrong, add <em>&quot;bad hands, extra
        fingers&quot;</em>. Half of good SD output is a good negative prompt.
      </p>

      <h2>Learn faster by working backwards from images</h2>
      <p>
        The quickest way to build prompt vocabulary is to reverse-engineer images you
        admire. Drop one into FileLark&apos;s{' '}
        <Link href="/image-to-stable-diffusion-prompt" className={A}>image to Stable
        Diffusion prompt generator</Link> and it produces a structured positive prompt{' '}
        <em>and</em> a matching negative prompt from the picture — teaching you the actual
        tags for the look you&apos;re after (that &quot;cinematic glow&quot; turns out to be
        specific lighting and lens terms). Then swap the subject and keep the rest; that
        subject-swap trick is how prompt libraries get built. For a broader take on
        prompting from images, see our{' '}
        <Link href="/blog/midjourney-prompts-from-images" className={A}>Midjourney guide</Link>.
      </p>

      <h2>A few habits that pay off</h2>
      <p>
        Keep a text file of negative prompts that work for you and reuse them. Change one
        thing per generation so you learn what each change does. Don&apos;t pile on twenty
        quality tags — three or four (<em>&quot;highly detailed, sharp focus,
        masterpiece&quot;</em>) do the job; more just dilute each other. And remember
        prompting is iteration, not incantation: your third attempt, informed by the
        first two, is almost always the good one.
      </p>
    </ArticleLayout>
  );
}
