export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", service: "news-website", timestamp: new Date().toISOString() });
}
