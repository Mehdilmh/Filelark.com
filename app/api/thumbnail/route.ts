import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Tiny same-origin proxy for YouTube thumbnails so the Download button can
 * force a file download (cross-origin <a download> is ignored by browsers).
 * Only whitelisted i.ytimg.com thumbnail URLs can be fetched — no SSRF surface.
 */

const QUALITIES = new Set(['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default']);
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

export async function GET(req: NextRequest) {
  const v = req.nextUrl.searchParams.get('v') ?? '';
  const q = req.nextUrl.searchParams.get('q') ?? 'hqdefault';

  if (!ID_RE.test(v)) {
    return NextResponse.json({ error: 'Invalid video ID.' }, { status: 400 });
  }
  if (!QUALITIES.has(q)) {
    return NextResponse.json({ error: 'Invalid quality.' }, { status: 400 });
  }

  const upstream = await fetch(`https://i.ytimg.com/vi/${v}/${q}.jpg`, {
    // Thumbnails are immutable per upload; let the CDN cache aggressively
    next: { revalidate: 86400 },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: 'This thumbnail size is not available for that video.' },
      { status: 404 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="youtube-${v}-${q}.jpg"`,
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
