import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['png-vs-jpg-when-to-use'];

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
        PNG or JPG? It&apos;s the most common file-format decision there is, and picking
        wrong has real costs: photos saved as PNG can be ten times larger than they need
        to be, while logos saved as JPG grow fuzzy halos around every edge. The good news
        is that the rule is simple once you know what each format was built for.
      </p>

      <h2>The one-sentence rule</h2>
      <p>
        <strong>JPG for photographs, PNG for graphics.</strong> If a camera made it, JPG.
        If a human designed it — logos, icons, screenshots with text, diagrams, anything
        with sharp edges or a transparent background — PNG.
      </p>

      <h2>Why JPG wins for photos</h2>
      <p>
        JPG&apos;s lossy compression was engineered specifically for the smooth gradients
        and organic textures of natural images. It throws away detail your eye can&apos;t
        see, which is why a 24-megapixel photo can compress from 70 MB of raw data down
        to 4 MB and still look perfect. Save that same photo as PNG and you get 30–50 MB,
        because PNG&apos;s lossless compression refuses to discard anything — a discipline
        that buys you nothing on a photo.
      </p>

      <h2>Why PNG wins for graphics</h2>
      <p>
        Graphics are JPG&apos;s weakness. Its compression works on 8×8 pixel blocks, and at
        sharp edges — text, line art, flat color boundaries — those blocks produce the
        smudgy &quot;mosquito noise&quot; you&apos;ve seen around letters in over-compressed memes.
        PNG reproduces every pixel exactly, so a screenshot of code or a logo stays
        razor sharp. PNG also supports full transparency, which JPG simply cannot do —
        any transparent area saved as JPG becomes a white box.
      </p>

      <h2>The mistakes that bloat files</h2>
      <p>
        The classic error is the &quot;PNG photo&quot;: a phone photo that ends up as PNG via a
        screenshot or an export setting, quietly weighing 15 MB. Converting it to{' '}
        <Link href="/png-to-jpg" className={A}>JPG</Link> or, better for the web,{' '}
        <Link href="/png-to-webp" className={A}>WebP</Link> typically cuts it by 80–95%
        with no visible difference. The reverse error — a JPG logo — can&apos;t be fully
        fixed by converting back (the artifacts are baked in), but re-exporting from the
        original design file as PNG always can.
      </p>

      <h2>Where the modern formats fit</h2>
      <p>
        WebP and AVIF do both jobs — photos <em>and</em> transparency — at smaller sizes,
        which is why we recommend them for anything you publish on the web (see our{' '}
        <Link href="/blog/webp-vs-avif-vs-jpg" className={A}>WebP vs AVIF vs JPG comparison</Link>).
        JPG and PNG keep two advantages: universal acceptance by upload forms, printers
        and old software, and zero surprises. When a website says &quot;JPG or PNG only&quot;,
        convert with <Link href="/webp-to-jpg" className={A}>WebP to JPG</Link> or{' '}
        <Link href="/webp-to-png" className={A}>WebP to PNG</Link> and move on.
      </p>

      <h2>Cheat sheet</h2>
      <p>
        Photo for email or an upload form → <Link href="/png-to-jpg" className={A}>JPG</Link>.
        Photo for your own website → <Link href="/jpg-to-webp" className={A}>WebP</Link>.
        Logo, icon, or anything transparent → <Link href="/jpg-to-png" className={A}>PNG</Link>.
        Screenshot with text → PNG. File too big either way → the{' '}
        <Link href="/compress-image" className={A}>image compressor</Link> finds the best
        quality for a target size automatically. Every converter linked here runs free in
        your browser with no upload.
      </p>
    </ArticleLayout>
  );
}
