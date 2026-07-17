import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['webp-vs-avif-vs-jpg'];

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
        Three formats dominate web images today: the 30-year-old JPG, Google&apos;s WebP,
        and the newer AVIF. All three are excellent — but they trade off file size,
        encoding speed, and compatibility differently, and picking the right one can cut
        your page weight in half.
      </p>

      <h2>The short version</h2>
      <p>
        <strong>JPG</strong> is the compatibility king: every device, app, form, and
        printer made since the 90s can open it. <strong>WebP</strong> is the sensible
        default for websites: 25–35% smaller than JPG at the same quality, supports
        transparency, and works in every modern browser. <strong>AVIF</strong> is the
        compression champion: often about half the size of JPG, at the cost of slower
        encoding and patchier support in older software.
      </p>

      <h2>File size: what the savings actually look like</h2>
      <p>
        Take a typical 1920px photograph that lands at 500 KB as an 85%-quality JPG.
        Re-encoded as WebP at comparable visual quality it drops to roughly 320–380 KB.
        As AVIF, 220–280 KB is common — and for images with smooth gradients or flat
        regions AVIF pulls even further ahead, since its video-codec ancestry excels at
        exactly that content. Multiply those savings across a page with a dozen images
        and the difference is a second or more of load time on a mid-range phone.
      </p>

      <h2>Quality and features</h2>
      <p>
        All three are lossy formats with a quality dial, but they degrade differently. JPG
        artifacts appear as blocky 8×8 mosquito noise around edges. WebP stays cleaner at
        moderate compression but can smear fine texture at low quality. AVIF preserves
        edges and gradients remarkably well even at aggressive settings, though it may
        soften very fine detail like film grain. Feature-wise, JPG has no transparency
        and no animation; WebP and AVIF support both, plus wide color gamuts — AVIF adds
        HDR on top.
      </p>

      <h2>Compatibility: the deciding factor</h2>
      <p>
        Every modern browser — Chrome, Firefox, Safari, Edge — renders both WebP and AVIF
        today. The gap is everything that isn&apos;t a browser: desktop software, upload
        forms, CMS pipelines, printing services, and government portals often accept only
        JPG or PNG. That&apos;s why the practical rule is:{' '}
        <strong>WebP/AVIF for images you serve, JPG for images you submit</strong>.
      </p>

      <h2>Which should you choose?</h2>
      <p>
        <strong>Publishing images on your own site?</strong> Use{' '}
        <Link href="/jpg-to-webp" className={A}>WebP</Link> as the workhorse, or{' '}
        <Link href="/jpg-to-avif" className={A}>AVIF</Link> if you&apos;re chasing every
        kilobyte of Core Web Vitals. <strong>Uploading to someone else&apos;s
        platform?</strong> Convert to <Link href="/webp-to-jpg" className={A}>JPG</Link> —
        it will never be rejected. <strong>Need transparency?</strong> WebP or AVIF give
        you PNG-style alpha at a fraction of PNG&apos;s size; keep{' '}
        <Link href="/png-to-webp" className={A}>PNG</Link> only for lossless
        screenshots and logos in legacy contexts.
      </p>

      <h2>Convert without uploading anything</h2>
      <p>
        Every conversion mentioned in this article runs free and entirely in your browser
        on FileLark — batch files, adjust quality with a live slider, and compare
        before/after sizes: try{' '}
        <Link href="/jpg-to-webp" className={A}>JPG → WebP</Link>,{' '}
        <Link href="/png-to-avif" className={A}>PNG → AVIF</Link>, or{' '}
        <Link href="/avif-to-jpg" className={A}>AVIF → JPG</Link> for going back to
        maximum compatibility. If your goal is simply &quot;make this image smaller&quot;, the{' '}
        <Link href="/compress-image" className={A}>image compressor</Link> finds the best
        quality for a target file size automatically.
      </p>
    </ArticleLayout>
  );
}
