import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { POSTS_BY_SLUG } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

const post = POSTS_BY_SLUG['remove-background-without-photoshop'];

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
        Cutting a subject out of its background used to mean twenty minutes with
        Photoshop&apos;s pen tool — or paying a per-image fee to an online service that
        keeps a copy of your photo. Neither is necessary anymore: AI segmentation models
        are now small enough to run inside your browser, on your own device.
      </p>

      <h2>How AI background removal works</h2>
      <p>
        The tool runs a neural network trained on &quot;salient object detection&quot; — the
        task of finding the thing a photo is <em>about</em>. Given your image, the model
        (FileLark uses U²-Net, a widely cited research model) produces a mask that scores
        every pixel from &quot;definitely subject&quot; to &quot;definitely background&quot;. That mask
        becomes the alpha channel of a PNG: subject opaque, background transparent, with
        soft edges where the model is less certain.
      </p>

      <h2>Do it in two clicks</h2>
      <p>
        Open the <Link href="/remove-background" className={A}>background remover</Link>{' '}
        and drop your image. The AI model (~4.5 MB) downloads once and is cached; the
        cutout itself takes a couple of seconds. You get a live preview over a
        checkerboard so you can inspect the edges, then download either a{' '}
        <strong>transparent PNG</strong> (for design work, thumbnails, profile pictures)
        or a <strong>white-background JPG</strong> (the format Amazon, eBay and most
        marketplaces require for product photos).
      </p>
      <p>
        Everything happens on your device — the photo is never uploaded. For pictures of
        yourself, your kids, or products you haven&apos;t launched yet, that&apos;s not a
        nice-to-have; it&apos;s the whole point.
      </p>

      <h2>What works well — and what doesn&apos;t</h2>
      <p>
        On-device models are honest about their trade-offs. <strong>Great:</strong>{' '}
        people and portraits, products on fairly plain surfaces, pets, vehicles, food —
        anything with a clear subject. <strong>Harder:</strong> wispy hair, fur edges,
        semi-transparent objects (glass, veils), and cluttered scenes where even a human
        would hesitate about what counts as &quot;the subject&quot;. Cloud services running
        hundred-times-larger models still win on those edge cases. For the everyday 90% —
        listings, avatars, slides, mockups — the two-second private version gets you
        there.
      </p>

      <h2>Getting the best results</h2>
      <p>
        Give the model contrast to work with: subjects that stand out from the background
        cut out dramatically better than subjects that blend in. Good lighting helps more
        than resolution. And if the first result has rough patches, try cropping tighter
        around the subject first with the{' '}
        <Link href="/resize-image" className={A}>resize tool</Link> — a subject that
        fills the frame gives the model more pixels to reason with. For the final file,
        the transparent PNG can be layered in any editor, Canva, Figma, or PowerPoint;
        if you need it smaller, run it through the{' '}
        <Link href="/compress-image" className={A}>image compressor</Link>.
      </p>
    </ArticleLayout>
  );
}
