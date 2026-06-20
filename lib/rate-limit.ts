type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function assertRateLimit(input: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const bucket = buckets.get(input.key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(input.key, { count: 1, resetAt: now + input.windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > input.limit) {
    const retrySeconds = Math.ceil((bucket.resetAt - now) / 1000);
    throw new Error(`Too many requests. Try again in ${retrySeconds}s.`);
  }
}

export function rateLimitKey(request: Request, scope: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}
