export const SITE_NAME = 'ConvertKitPro';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://convertkitpro.com'
).replace(/\/$/, '');

export const SITE_TAGLINE =
  'Free online file converters that run entirely in your browser — no uploads, no sign-up, no limits.';

/** Master switch for every <AdSlot />. Toggle via NEXT_PUBLIC_ADS_ENABLED=true */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

export const CONTACT_EMAIL = 'hello@convertkitpro.com';
