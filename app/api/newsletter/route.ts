import config from "@payload-config";
import { getPayload } from "payload";
import { getClientAddress, rateLimit } from "@/lib/rate-limit";
import { recordAuditLog, requestAuditContext } from "@/lib/audit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request-body";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 2 * 1024;

function isDuplicateError(error: unknown) {
  return error instanceof Error && /(unique|duplicate)/i.test(error.message);
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<{ email?: unknown; locale?: unknown }>(request, MAX_BODY_BYTES);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!emailPattern.test(email) || email.length > 254) return Response.json({ error: "Invalid email" }, { status: 400 });
    if (body.locale !== "ar" && body.locale !== "en") return Response.json({ error: "Invalid locale" }, { status: 400 });
    const address = getClientAddress(request);
    if (!(await rateLimit(`newsletter:ip:${address}`, 10)) || !(await rateLimit(`newsletter:email:${email}`, 3))) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": "60" } });
    const payload = await getPayload({ config });
    const existing = await payload.find({ collection: "newsletter-subscribers", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    if (existing.docs.length > 0) return Response.json({ ok: true, message: "Subscription already active" }, { status: 200 });
    try {
      const created = await payload.create({ collection: "newsletter-subscribers", data: { email, locale: body.locale }, overrideAccess: true });
      await recordAuditLog(payload, { ...requestAuditContext(request), action: "newsletter.subscribed", collection: "newsletter-subscribers", documentId: String(created.id), metadata: { locale: body.locale } });
    } catch (error) {
      // A concurrent request may win the unique constraint between find and
      // create. Treat that race as the same idempotent success.
      if (!isDuplicateError(error)) throw error;
    }
    return Response.json({ ok: true, message: "Subscription accepted" }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: "Request body too large" }, { status: 413 });
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request" }, { status: 400 });
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  }
}
