type Bucket = number[];
const buckets = new Map<string, Bucket>();

/** Limitation de débit en mémoire (par processus) : `max` requêtes par fenêtre glissante. */
export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
  now: number = Date.now(),
): { ok: boolean; retryAfterSec: number } {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    buckets.set(key, recent);
    const oldest = recent[0] ?? now;
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfterSec: 0 };
}

export function resetRateLimit(): void {
  buckets.clear();
}
