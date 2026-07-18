import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['make-gif-from-video'];

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
        GIFs refuse to die, and for good reason: they autoplay everywhere, loop forever,
        need no play button, and work in places video can&apos;t — README files, docs,
        Slack, email signatures, support articles. The catch has always been making one
        that looks good <em>and</em> doesn&apos;t weigh 40 MB.
      </p>

      <h2>Make one in your browser</h2>
      <p>
        Drop any video into FileLark&apos;s{' '}
        <Link href="/video-to-gif" className={A}>video to GIF converter</Link>, choose
        the start time and duration, pick a width and frame rate, and convert. It runs
        entirely on your device (no upload), and it uses the <em>two-pass palette</em>{' '}
        technique — the converter first analyses your clip to build an optimal 256-color
        palette, then renders with it. That&apos;s the difference between the crisp GIFs you
        see from professionals and the grainy, banded ones from naive converters.
      </p>

      <h2>The three dials that control file size</h2>
      <p>
        GIF is a 1987 format that stores every frame as an indexed image, so size grows
        fast. Three settings control it. <strong>Duration:</strong> the biggest lever —
        keep clips under ~10 seconds; the tool caps at 30 for good reason.{' '}
        <strong>Width:</strong> 320 px is plenty for chat previews, 480 px is the
        standard sweet spot, 640 px only when the GIF is the main content.{' '}
        <strong>Frame rate:</strong> 12 fps looks smooth for almost everything at half
        the size of 24 fps; screen recordings and slideshows get away with 8.
      </p>
      <p>
        Rough guide: 5 seconds at 480 px / 12 fps lands around 2–4 MB. Double any dial
        and the size roughly doubles with it.
      </p>

      <h2>GIF or video — which should you post?</h2>
      <p>
        Social platforms (Twitter/X, Reddit, Discord) convert uploads to video anyway, so
        posting the MP4 there gives better quality at smaller size — if your file is too
        big, use the <Link href="/compress-video" className={A}>video compressor</Link>{' '}
        instead. Choose an actual GIF when the destination can&apos;t do video:
        documentation, GitHub READMEs, HTML emails, CMSs that only accept images, or
        anywhere you need guaranteed silent autoplay with zero player chrome.
      </p>

      <h2>Pro workflow for clean results</h2>
      <p>
        First <Link href="/trim-video" className={A}>trim the video</Link> to the exact
        moment (lossless, instant), then convert the trimmed clip — this keeps the
        two-pass palette focused on the frames that matter, which visibly improves color.
        If your source is huge phone footage, compressing it first doesn&apos;t help the GIF
        (it re-encodes anyway); trimming is the step that pays.
      </p>
    </ArticleLayout>
  );
}
