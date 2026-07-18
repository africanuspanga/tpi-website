// Simple in-memory rate limiter. For production with multiple instances, use Redis.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): { success: boolean; resetAt: number; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { success: true, resetAt, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, resetAt: entry.resetAt, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, resetAt: entry.resetAt, remaining: limit - entry.count };
}

export function rateLimitIp(
  ip: string,
  action: string,
  limit = 5,
  windowSeconds = 3600
) {
  return rateLimit(`rate:${action}:${ip}`, limit, windowSeconds);
}
