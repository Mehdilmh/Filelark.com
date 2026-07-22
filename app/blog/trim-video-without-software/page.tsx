import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['trim-video-without-software'];

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
        A two-hour meeting recording where the decision took ninety seconds. A phone clip
        with ten seconds of pocket fumbling on each end. The demo take that finally
        worked — buried at minute 14. Trimming is the most common video edit in
        existence, and it shouldn&apos;t require downloading an editor, creating an account,
        or accepting a watermark.
      </p>

      <h2>Trim in the browser, losslessly</h2>
      <p>
        FileLark&apos;s <Link href="/trim-video" className={A}>video trimmer</Link> cuts a
        section out of any video using <em>stream copy</em> — the video data is copied
        byte-for-byte between your start and end points, with no re-encoding at all. That
        has two consequences most online trimmers can&apos;t offer: the output quality is
        exactly identical to the original, and the cut takes seconds even on an hour-long
        file, because nothing is being re-rendered.
      </p>
      <p>
        Drop the video, enter start and end times (plain seconds like <em>90</em>, or{' '}
        <em>1:30</em>, or <em>1:02:15</em> for long recordings), press Trim, download.
        MP4, WebM, MOV, MKV and AVI all work, and the whole thing runs on your device —
        meetings, family footage and work-in-progress edits are never uploaded anywhere.
      </p>

      <h2>The keyframe thing, explained honestly</h2>
      <p>
        Lossless cutting has one technical quirk: video files can only be cut cleanly at{' '}
        <em>keyframes</em>, which occur every few seconds. So your clip may start up to a
        couple of seconds <em>before</em> the time you typed — never after, so you never
        lose content, you occasionally get a moment extra. For most uses that&apos;s
        irrelevant. If you need frame-exact boundaries, trim slightly wide here, then run
        the clip through the <Link href="/compress-video" className={A}>video
        compressor</Link> — it re-encodes, which snaps the cut precisely (at the cost of
        the re-encoding time).
      </p>

      <h2>Trim first, everything else second</h2>
      <p>
        Trimming is the highest-leverage first step of almost every video task, because
        every later step gets faster and smaller when the input is shorter. Need the
        audio? Trim, then <Link href="/mp4-to-mp3" className={A}>extract MP3</Link>. Need
        a GIF? Trim to the exact moment, then{' '}
        <Link href="/video-to-gif" className={A}>convert the clip</Link>. File too big
        for WhatsApp? Trim the dead air first — it&apos;s free size reduction with zero
        quality cost — and only then{' '}
        <Link href="/compress-video" className={A}>compress</Link> if you still need to.
      </p>

      <h2>Quick answers</h2>
      <p>
        <strong>Is there a length limit?</strong> No — because nothing is re-encoded,
        even very long recordings trim in seconds; the practical limit is your
        device&apos;s memory (files up to ~100 MB are safest in-browser).{' '}
        <strong>Watermarks?</strong> Never. <strong>Multiple sections?</strong> Run the
        trimmer once per section, then stitch the pieces in any editor — or rethink and
        cut one wider range that covers them all.
      </p>
    </ArticleLayout>
  );
}
