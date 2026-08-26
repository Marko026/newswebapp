import { getPayload } from "payload";

export const dynamic = "force-dynamic";

async function checkDatabase() {
  try {
    const { default: config } = await import("@payload-config");
    const payload = await getPayload({ config });
    await payload.find({ collection: "articles", limit: 1, pagination: false, overrideAccess: true });
    return true;
  } catch {
    return false;
  }
}

async function checkRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const response = await fetch(`${url}/ping`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get("ready") === "1") {
    const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);
    const ready = database && redis;
    return Response.json({ status: ready ? "ready" : "not_ready", service: "news-website", checks: { database, redis }, timestamp: new Date().toISOString() }, { status: ready ? 200 : 503, headers: { "cache-control": "no-store" } });
  }

  return Response.json({ status: "ok", service: "news-website", timestamp: new Date().toISOString() });
}
