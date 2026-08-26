import config from "@payload-config";
import { getPayload } from "payload";
import { getClientAddress, rateLimit } from "@/lib/rate-limit";
import { recordAuditLog, requestAuditContext } from "@/lib/audit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request-body";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 8 * 1024;

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<{ name?: unknown; email?: unknown; message?: unknown }>(request, MAX_BODY_BYTES);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!name || name.length > 120 || email.length > 254 || !emailPattern.test(email) || !message || message.length > 5000) return Response.json({ error: "Invalid request" }, { status: 400 });
    const address = getClientAddress(request);
    if (!(await rateLimit(`contact:ip:${address}`, 10)) || !(await rateLimit(`contact:email:${email}`, 3))) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": "60" } });
    const payload = await getPayload({ config });
    const created = await payload.create({ collection: "contact-messages", data: { name, email, message }, overrideAccess: true });
    await recordAuditLog(payload, { ...requestAuditContext(request), action: "contact.submitted", collection: "contact-messages", documentId: String(created.id), metadata: { messageLength: message.length } });
    return Response.json({ ok: true, message: "Message accepted" }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: "Request body too large" }, { status: 413 });
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid request" }, { status: 400 });
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  }
}
