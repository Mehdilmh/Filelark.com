export const SITE_NAME = 'FileLark';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://filelark.com'
).replace(/\/$/, '');

export const SITE_TAGLINE =
  'Free online file converters that run entirely in your browser — no uploads, no sign-up, no limits.';

/** Master switch for every <AdSlot />. Toggle via NEXT_PUBLIC_ADS_ENABLED=true */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

/**
 * AdSense publisher ID (ca-pub-…). Baked in as the default (publisher IDs are
 * public — they appear in every site's ads.txt and page source); the env var
 * can still override it. Loads the AdSense script and activates /ads.txt.
 */
export const ADSENSE_PUBLISHER =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER || 'ca-pub-1099488297236173';

/** Optional per-position AdSense ad-unit slot IDs (numbers from the AdSense UI). */
export const ADSENSE_SLOTS = {
  'below-tool': process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_TOOL || '',
  'mid-content': process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_CONTENT || '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
} as const;

export const CONTACT_EMAIL = 'hello@filelark.com';
