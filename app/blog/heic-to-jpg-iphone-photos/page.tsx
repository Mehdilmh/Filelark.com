import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['heic-to-jpg-iphone-photos'];

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
        You AirDrop a photo to yourself, plug your iPhone into a Windows laptop, or
        download an image from iCloud — and the file ends in <strong>.heic</strong>.
        Windows Photos wants you to buy a codec, the government form you&apos;re filling in
        says &quot;JPG or PNG only&quot;, and your printer&apos;s upload page rejects it outright.
        You&apos;re not doing anything wrong: HEIC is simply a format most of the world
        outside Apple hasn&apos;t adopted.
      </p>

      <h2>What is HEIC, and why does Apple use it?</h2>
      <p>
        HEIC (High Efficiency Image Container) has been the default photo format on
        iPhones since iOS 11 in 2017. It stores images using the HEVC video codec, which
        compresses a photo to roughly <strong>half the size of an equivalent JPG</strong> at
        the same visual quality. For Apple, the math is simple: billions of photos taken
        every day, each one half as large, means enormous savings in storage and iCloud
        bandwidth. HEIC also supports 16-bit color, transparency, and storing bursts or
        Live Photos in a single file — things JPG cannot do.
      </p>

      <h2>So why won&apos;t anything open it?</h2>
      <p>
        Licensing. The HEVC codec inside HEIC is patent-encumbered, and every vendor who
        wants to decode it is supposed to pay royalties. Microsoft chose to sell the
        codec as a paid add-on rather than absorb the cost; many websites, printers, and
        upload forms never added support at all. The result is a format that works
        beautifully inside the Apple ecosystem and causes friction everywhere else.
      </p>

      <h2>The fastest fix: convert HEIC to JPG in your browser</h2>
      <p>
        You don&apos;t need to install anything or upload your photos to a stranger&apos;s
        server. FileLark&apos;s <Link href="/heic-to-jpg" className={A}>HEIC to JPG converter</Link> decodes
        the file right in your browser tab — drop in one photo or a hundred, and download
        JPGs (individually or as a ZIP) a second later. Because the conversion runs on
        your own device, private photos stay private, and there is no file size limit or
        daily cap.
      </p>
      <p>
        Need transparency or plan to edit the image further? Convert to{' '}
        <Link href="/heic-to-png" className={A}>PNG</Link> instead. Publishing to the web?{' '}
        <Link href="/heic-to-webp" className={A}>HEIC to WebP</Link> keeps the small file
        size benefit while being universally supported by modern browsers.
      </p>

      <h2>Can I stop my iPhone from using HEIC?</h2>
      <p>
        Yes. Go to <strong>Settings → Camera → Formats</strong> and choose{' '}
        <strong>Most Compatible</strong> — new photos will be saved as JPG. The tradeoff
        is that your photos will take about twice the storage space, which is exactly why
        Apple doesn&apos;t make it the default. A middle path: keep HEIC on the phone (it
        also enables 4K/60fps video) and turn on{' '}
        <strong>Settings → Photos → Transfer to Mac or PC → Automatic</strong>, which
        converts to JPG during transfer. For everything that slips through, a browser
        converter has you covered.
      </p>

      <h2>Quick answers</h2>
      <p>
        <strong>Does converting HEIC to JPG lose quality?</strong> Slightly, in theory —
        both formats are lossy, so a re-encode at 90% quality introduces changes that are
        invisible in practice. For maximum fidelity, convert to PNG (lossless).
      </p>
      <p>
        <strong>Is HEIC better than JPG?</strong> Technically yes: smaller files, richer
        color, more features. Practically, JPG wins wherever compatibility matters — which
        is still most of the internet.
      </p>
      <p>
        <strong>Is it safe to convert private photos online?</strong> With server-based
        converters, you&apos;re trusting their deletion policy. With FileLark the question
        doesn&apos;t arise — files are processed on your device and never uploaded.
      </p>
    </ArticleLayout>
  );
}
