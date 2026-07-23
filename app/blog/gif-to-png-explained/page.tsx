import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['gif-to-png-explained'];

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
        You have a GIF and you need a PNG — for a form that rejects GIFs, an editor that
        mangles them, a print job, or just a crisper version of a single frame. The
        conversion itself takes two seconds; the useful part is knowing exactly what you
        get, because GIF and PNG differ in one big way: <strong>PNG doesn&apos;t animate</strong>.
      </p>

      <h2>How to convert (the easy part)</h2>
      <p>
        Drop your file into FileLark&apos;s{' '}
        <Link href="/gif-to-png" className={A}>GIF to PNG converter</Link>. It runs in your
        browser — nothing uploads — and handles batches, so a folder of GIFs converts in
        one pass with a ZIP download. For an animated GIF, the converter takes the{' '}
        <strong>first frame</strong> and outputs it as a still PNG.
      </p>

      <h2>What you gain</h2>
      <p>
        PNG is a strictly better <em>still-image</em> format than GIF. GIF is capped at
        256 colors — the reason photographic GIFs look posterized and grainy — while PNG
        stores full 24-bit color plus a proper alpha channel. GIF transparency is
        all-or-nothing (each pixel fully visible or fully invisible, which causes those
        crunchy white edges); PNG supports smooth partial transparency. And for
        graphics, PNG usually compresses <em>smaller</em> than the same image as GIF.
        Converting logos, icons and diagrams that are stuck as GIFs is pure upgrade.
      </p>

      <h2>What you lose — and the honest alternatives</h2>
      <p>
        The animation. A standard PNG holds one frame, and converting an animated GIF
        gives you its opening frame as a sharp still. If what you actually want is{' '}
        <em>moving</em> pictures in a smaller or higher-quality file, converting to PNG
        isn&apos;t the answer — you have two better routes. For the web and social,
        convert the GIF&apos;s source video (or the GIF itself via a video editor) to MP4 or
        WebM — see our <Link href="/blog/make-gif-from-video" className={A}>GIF vs video
        guide</Link> for when each wins. There is technically an animated PNG format
        (APNG), which some searches for &quot;animated gif to animated png&quot; are after —
        it&apos;s real but patchily supported outside browsers, produces large files, and
        most upload forms treat it as a plain PNG&apos;s first frame anyway. For almost
        every practical purpose, animation belongs in video formats, and stills belong
        in PNG.
      </p>

      <h2>Related conversions</h2>
      <p>
        Going the other way for a smaller still image?{' '}
        <Link href="/gif-to-jpg" className={A}>GIF to JPG</Link> is the compact choice
        when transparency doesn&apos;t matter, and{' '}
        <Link href="/gif-to-webp" className={A}>GIF to WebP</Link> gives modern
        compression with transparency intact. All of them run free in your browser, batch
        included, with your files never leaving your device.
      </p>
    </ArticleLayout>
  );
}
