import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['trim-video-from-dropbox'];

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
        You&apos;ve got a video sitting in Dropbox — a meeting recording, an event clip, a
        screen capture — and you only need part of it. You look for a trim button
        and… there isn&apos;t one. Dropbox is a superb place to <em>store</em> video, but
        editing isn&apos;t what it does: the standard Dropbox web and mobile apps have no
        cut or trim feature at all, and Dropbox Replay (its video-review product) keeps
        trimming behind a paid add-on.
      </p>

      <h2>The two-minute workflow</h2>
      <p>
        The good news: you don&apos;t need an editor, an app, or a Replay subscription —
        just your browser.
      </p>
      <p>
        <strong>1. Download the video from Dropbox.</strong> On the web, hover the file →
        ⋯ → Download (on your phone, use Export / Save to device). Yes, downloading feels
        like a detour — but no online service can safely edit a file <em>inside</em> your
        Dropbox without you granting it full access to your account, which is a much
        worse trade than a download.
      </p>
      <p>
        <strong>2. Trim it in your browser.</strong> Open FileLark&apos;s{' '}
        <Link href="/trim-video" className={A}>video trimmer</Link>, drop the file in,
        and enter the start and end times (<em>90</em>, <em>1:30</em>, or{' '}
        <em>1:02:15</em> all work). The cut is lossless — the video is copied without
        re-encoding, so quality is untouched and even an hour-long recording trims in
        seconds. Nothing is uploaded anywhere: the trimming happens on your own device,
        which matters when the video is an internal meeting.
      </p>
      <p>
        <strong>3. Put the clip back in Dropbox.</strong> Upload the trimmed file to the
        same folder — done. Keep or delete the original as you prefer; since the trim was
        lossless, the clip is exactly as sharp as the source.
      </p>

      <h2>Common Dropbox video tasks, same pattern</h2>
      <p>
        The download → process → re-upload pattern covers the rest of the video jobs
        Dropbox can&apos;t do. Recording too large for a shared link recipient?{' '}
        <Link href="/compress-video" className={A}>Compress it</Link> by 60–90%. Need
        just the audio of a recorded call?{' '}
        <Link href="/mp4-to-mp3" className={A}>Extract an MP3</Link>. Want a moment as a
        looping preview? <Link href="/video-to-gif" className={A}>Make a GIF</Link>.
        Each runs free in your browser with no account.
      </p>

      <h2>What about Google Drive, OneDrive, iCloud?</h2>
      <p>
        Same story, same fix. None of the mainstream cloud drives offer real trimming on
        their free tiers — they&apos;re storage, not editors. The workflow above works
        identically for a video stored anywhere: get the file to your device, trim
        locally, put it back. Two minutes, no watermark, no subscription.
      </p>
    </ArticleLayout>
  );
}
