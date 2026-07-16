import { ADS_ENABLED } from '@/lib/site';

type AdPosition = 'below-tool' | 'mid-content' | 'sidebar';

/**
 * Reserved-size ad container. Dimensions are fixed per position so ads never
 * cause layout shift (CLS). Paste your AdSense snippet where indicated.
 */
const SIZES: Record<AdPosition, { className: string; label: string }> = {
  'below-tool': {
    // 728x90 leaderboard on desktop, 320x100 on mobile
    className: 'mx-auto my-8 h-[100px] w-full max-w-[320px] md:h-[90px] md:max-w-[728px]',
    label: 'Advertisement',
  },
  'mid-content': {
    // 336x280 large rectangle
    className: 'mx-auto my-8 h-[280px] w-full max-w-[336px]',
    label: 'Advertisement',
  },
  sidebar: {
    // 300x600 half page, desktop only
    className: 'sticky top-20 hidden h-[600px] w-[300px] lg:block',
    label: 'Advertisement',
  },
};

export default function AdSlot({ position }: { position: AdPosition }) {
  if (!ADS_ENABLED) return null;

  const { className, label } = SIZES[position];
  return (
    <div className={className} aria-label={label}>
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600">
        {/* AdSense snippet goes here — e.g.
            <ins className="adsbygoogle" style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" /> */}
        {label}
      </div>
    </div>
  );
}
