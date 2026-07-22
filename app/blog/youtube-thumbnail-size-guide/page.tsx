import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['youtube-thumbnail-size-guide'];

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
        Thumbnails decide clicks. YouTube&apos;s own creator research keeps repeating the
        same finding: alongside the title, the thumbnail is the single biggest factor in
        whether someone taps your video. Here are the exact specs, plus answers to the
        questions creators actually search for.
      </p>

      <h2>The official upload spec</h2>
      <p>
        Upload your custom thumbnail at <strong>1280 × 720 pixels</strong> (16:9), as JPG,
        PNG or WebP, <strong>under 2 MB</strong>, with a minimum width of 640 px. YouTube
        scales it down everywhere it appears — often to a tile barely 200 px wide on
        phones — which leads to the real design rule: <strong>compose for small</strong>.
        Big faces, three-to-four-word text, high contrast. If it isn&apos;t readable at the
        size of a postage stamp, it isn&apos;t readable where it counts.
      </p>
      <p>
        If your image is the wrong size, the{' '}
        <Link href="/resize-image" className={A}>image resizer</Link> gets it to exactly
        1280×720, and the <Link href="/compress-image" className={A}>compressor</Link>{' '}
        brings it under the 2 MB cap without visible loss.
      </p>

      <h2>What is the maximum file size for a YouTube thumbnail?</h2>
      <p>
        <strong>2 MB for videos</strong> (and 10 MB for podcast cover art) — upload
        anything larger and YouTube Studio rejects it with an error. If your thumbnail
        is over the limit, don&apos;t screenshot it smaller: run it through the{' '}
        <Link href="/compress-image" className={A}>image compressor</Link> with a target
        of 1.5 MB and it will fit with no visible quality loss. PNG thumbnails hit the
        2 MB wall far more often than JPG — if yours does, convert it with{' '}
        <Link href="/png-to-jpg" className={A}>PNG to JPG</Link> first; at 1280×720 the
        difference is invisible in the feed.
      </p>

      <h2>The five sizes YouTube stores</h2>
      <p>
        Every video&apos;s thumbnail exists on YouTube&apos;s servers at up to five fixed
        resolutions: <strong>1280×720</strong> (maxres), <strong>640×480</strong> (SD),{' '}
        <strong>480×360</strong> (HQ — this one always exists), <strong>320×180</strong>{' '}
        (MQ) and <strong>120×90</strong>. A quirk worth knowing: the HD version only
        exists if the uploader provided a large enough custom thumbnail — which is why
        &quot;maxresdefault&quot; sometimes returns nothing for older or auto-thumbnailed
        videos, and the next size down is the best available.
      </p>

      <h2>How to download any video&apos;s thumbnail</h2>
      <p>
        Paste the video link into FileLark&apos;s{' '}
        <Link href="/youtube-thumbnail-downloader" className={A}>YouTube thumbnail
        downloader</Link> — normal watch URLs, youtu.be short links and Shorts all work.
        You&apos;ll see every available resolution as a live preview with a download button
        under each. No login, no software, no watermark.
      </p>
      <p>
        Legitimate uses are everywhere: recovering your own thumbnail when the source
        file is lost, archiving A/B test variants, citing a video in an article or
        presentation, building a moodboard of thumbnails that work in your niche.
        Remember thumbnails belong to their creators — using someone else&apos;s
        commercially needs permission.
      </p>

      <h2>Quick design checklist</h2>
      <p>
        One subject, shot close. Maximum four words of text, thick font, placed away
        from the bottom-right corner (the duration badge covers it). Colors that contrast
        with YouTube&apos;s white and dark themes both. Consistent style across your
        channel so returning viewers recognise you in the feed. And test at 20% zoom
        before uploading — that&apos;s the size most people will actually see.
      </p>
    </ArticleLayout>
  );
}
