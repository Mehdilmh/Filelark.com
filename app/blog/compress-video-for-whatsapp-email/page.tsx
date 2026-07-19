import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['compress-video-for-whatsapp-email'];

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
        &quot;File too large to send.&quot; A single minute of 4K phone footage can top 400 MB,
        while WhatsApp caps video at 64 MB, email at around 25 MB, and Discord at 25 MB on
        the free tier. The clip that means something to you won&apos;t leave your phone — and
        the messaging app&apos;s own auto-compression, when it bothers, turns it to mush.
      </p>

      <h2>Compress it yourself, in the browser</h2>
      <p>
        FileLark&apos;s <Link href="/compress-video" className={A}>video compressor</Link>{' '}
        re-encodes video with the efficient H.264 codec at a quality level you choose,
        typically shrinking phone videos by 60–90% while keeping them perfectly watchable.
        It runs entirely on your device using WebAssembly — no upload, no account, and no
        server that sees private family clips. Drop the video, pick a preset, and download
        the smaller file.
      </p>

      <h2>Which preset for which limit</h2>
      <p>
        <strong>Balanced</strong> is the right choice for almost everyone: near-identical
        quality on a phone screen at a fraction of the size — usually enough to clear
        WhatsApp&apos;s 64 MB and email&apos;s 25 MB in one pass. If it&apos;s still too big,
        step up to <strong>Strong</strong>, which prioritises the smallest file (visibly
        softer only on large screens). <strong>Light</strong> is for when you just want
        modest savings with no perceptible change.
      </p>

      <h2>The trick most people miss: trim first</h2>
      <p>
        Compression fights file size by lowering quality. Trimming fights it by removing
        seconds — with <em>zero</em> quality loss. If your 90-second clip has 40 seconds
        of dead air at the start and end, <Link href="/trim-video" className={A}>trim it</Link>{' '}
        to the 50 seconds that matter first (lossless and instant), then compress only if
        you still need to. Often the trim alone gets you under the limit, and the part
        that&apos;s left stays crisp.
      </p>

      <h2>A realistic expectation</h2>
      <p>
        Re-encoding is real work happening on your device, so it runs at roughly
        real-time speed — a two-minute clip takes about two minutes. That&apos;s the honest
        cost of doing it privately instead of handing your video to a server. It&apos;s
        ideal for the clips people actually send; for hour-long recordings, trim to the
        section you need first. And once the file fits, remember WhatsApp and email will
        transmit exactly what you give them — so the quality you see after compressing is
        the quality that arrives.
      </p>
    </ArticleLayout>
  );
}
