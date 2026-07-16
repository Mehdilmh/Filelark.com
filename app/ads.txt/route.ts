import { ADSENSE_PUBLISHER } from '@/lib/site';

/**
 * Serves /ads.txt once NEXT_PUBLIC_ADSENSE_PUBLISHER is set — required by
 * AdSense so advertisers can verify you are the authorized seller.
 */
export function GET() {
  if (!ADSENSE_PUBLISHER) {
    return new Response('# ads.txt — set NEXT_PUBLIC_ADSENSE_PUBLISHER to activate\n', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  return new Response(
    `google.com, ${ADSENSE_PUBLISHER.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`,
    { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400' } },
  );
}
