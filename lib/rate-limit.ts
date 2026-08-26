const windows = new Map<string, { count: number; expires: number }>();
let callsSinceCleanup = 0;

export class RateLimitUnavailableError extends Error {
  constructor() { super("Shared rate limiter is not configured"); }
}

function positiveInteger(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

async function sharedRateLimit(key: string, limit: number, durationMs: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new RateLimitUnavailableError();
  const safeKey = encodeURIComponent(key.slice(0, 256));
  const headers = { Authorization: `Bearer ${token}` };
  const setResponse = await fetch(`${url}/set/${safeKey}/1/ex/${Math.max(1, Math.ceil(durationMs / 1000))}/nx`, { headers, cache: "no-store" });
  if (!setResponse.ok) throw new RateLimitUnavailableError();
  const setResult = await setResponse.text();
  if (setResult.includes('"OK"') || setResult.trim() === "OK") return true;
  const incrementResponse = await fetch(`${url}/incr/${safeKey}`, { headers, cache: "no-store" });
  if (!incrementResponse.ok) throw new RateLimitUnavailableError();
  const incrementResult = await incrementResponse.json() as { result?: number };
  return Number(incrementResult.result) <= limit;
}

export async function rateLimit(key: string, limit = 5, durationMs = 60_000) {
  const now = Date.now();
  const safeKey = key.slice(0, 256);
  const safeLimit = positiveInteger(limit, 5);
  const safeDuration = positiveInteger(durationMs, 60_000);
  if (process.env.NODE_ENV === "production") return sharedRateLimit(safeKey, safeLimit, safeDuration);
  // Keep the in-process fallback bounded. Deployments with multiple
  // instances should replace this with a shared store, but this still avoids
  // retaining every historical visitor forever during local development.
  if (++callsSinceCleanup >= 100) {
    callsSinceCleanup = 0;
    for (const [windowKey, value] of windows) if (value.expires <= now) windows.delete(windowKey);
  }
  const current = windows.get(safeKey);
  if (!current || current.expires <= now) { windows.set(safeKey, { count: 1, expires: now + safeDuration }); return true; }
  if (current.count >= safeLimit) return false;
  current.count += 1;
  return true;
}

export function getClientAddress(request: Request) {
  // Forwarded addresses are only trustworthy when the deployment proxy strips
  // and rewrites them. Keep the safe default closed for direct public access.
  if (process.env.TRUST_PROXY !== "true") return "untrusted-client";
  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}
