/**
 * Basic in-memory IP rate limiter for the image-to-prompt API route.
 *
 * Notes for serverless deployments (e.g. Vercel): each warm instance keeps its
 * own map, so this is a cost guard rather than a hard security boundary. The
 * client additionally enforces the same limit via localStorage. For a strict
 * global limit, back this with Upstash/Redis.
 */

const WINDOW_MS = 24 * 60 * 60 * 1000;

interface Entry {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Entry>();

export const DAILY_LIMIT = 5;

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded
  if (buckets.size > 10_000) {
    for (const [key, entry] of buckets) {
      if (now - entry.windowStart > WINDOW_MS) buckets.delete(key);
    }
  }

  let entry = buckets.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    entry = { count: 0, windowStart: now };
    buckets.set(ip, entry);
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.windowStart + WINDOW_MS };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: DAILY_LIMIT - entry.count,
    resetAt: entry.windowStart + WINDOW_MS,
  };
}
