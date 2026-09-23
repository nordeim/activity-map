// In-memory sliding-window rate limiter (per key, e.g. client IP).
// Login endpoints: 10 attempts / 15 min / IP — exceeding answers 429
// RATE_LIMITED with a Retry-After header. In-memory keeps the zero-config
// story; swap for Redis behind a load-balanced deployment.

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 10;

const hits = new Map<string, number[]>();

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the oldest attempt leaves the window (0 when allowed). */
  retryAfter: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= LIMIT) {
    hits.set(key, list);
    const retryAfter = Math.max(1, Math.ceil((list[0] + WINDOW_MS - now) / 1000));
    return { ok: false, retryAfter };
  }
  list.push(now);
  hits.set(key, list);
  // Opportunistic cleanup so the map does not grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}
