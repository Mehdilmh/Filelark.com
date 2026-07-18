import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['convert-video-to-mp3'];

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
        A lecture recording where you only need the audio for your commute. A voice memo
        that your phone saved as video. An interview you want in your podcast app. Music
        from a screen recording of your own performance. &quot;Video to MP3&quot; is one of the
        most common conversion needs there is — and most of the tools offering it are
        either adware-laden desktop installers or upload sites with size limits and
        questionable privacy.
      </p>

      <h2>The browser-only way</h2>
      <p>
        FileLark&apos;s <Link href="/mp4-to-mp3" className={A}>MP4 to MP3 converter</Link>{' '}
        does the extraction entirely inside your browser using ffmpeg compiled to
        WebAssembly — the same audio engine used by professional video software, running
        on your own device. Drop in an MP4, WebM, MOV, MKV or AVI; the audio track is
        extracted as a high-quality variable-bitrate MP3 (~190 kbps, transparent for
        speech and very good for music) and downloads straight away.
      </p>
      <p>
        Because nothing is uploaded, three usual problems disappear: there is no file
        size cap beyond your device&apos;s memory, no queue behind other users, and no
        server that ever sees your recording — which matters when the video is a
        private meeting, a lecture, or family footage.
      </p>

      <h2>Step by step</h2>
      <p>
        Open the <Link href="/mp4-to-mp3" className={A}>converter</Link>, drop your video
        (or several — batch works), and wait. The first use downloads the ~31 MB
        conversion engine, which your browser then caches; after that it&apos;s instant to
        start. Extraction runs at many times real-time speed for audio-only work — a
        one-hour lecture typically takes a couple of minutes. Then press Download, or
        grab everything as a ZIP if you converted a batch.
      </p>

      <h2>Tips for common cases</h2>
      <p>
        <strong>Long recordings:</strong> if you only need part of the audio, run the
        video through the <Link href="/trim-video" className={A}>video trimmer</Link>{' '}
        first (it&apos;s lossless and takes seconds), then extract MP3 from the trimmed
        clip. <strong>Voice memos saved as video:</strong> these convert perfectly — the
        black or static video track is simply discarded. <strong>Audio quality:</strong>{' '}
        extraction can never sound better than the source; a video with tinny 96 kbps
        audio produces an MP3 of that same underlying quality, because the information
        was never there to begin with.
      </p>

      <h2>A note on copyright</h2>
      <p>
        Extracting audio from your own recordings, lectures you have permission to use,
        and public-domain material is exactly what this tool is for. Ripping audio from
        copyrighted music videos or streaming platforms violates those platforms&apos; terms
        and usually copyright law — use the official download features those services
        provide instead.
      </p>
    </ArticleLayout>
  );
}
