const hits = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 5000;

/** Returns false when `key` has used up `limit` requests within the window. */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => time > now - windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [otherKey, times] of hits) {
      const newest = times[times.length - 1] ?? 0;
      if (newest <= now - windowMs) hits.delete(otherKey);
    }
  }
  return true;
}