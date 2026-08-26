import config from "@payload-config";
import { getPayload } from "payload";
import { getClientAddress, rateLimit } from "@/lib/rate-limit";
import { recordAuditLog, requestAuditContext } from "@/lib/audit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request-body";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type RegisterBody = { name?: unknown; email?: unknown; password?: unknown };

export async function POST(request: Request) {
  try {
    const body = await readJsonBody<RegisterBody>(request, 8 * 1024);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!name || name.length > 120 || !emailPattern.test(email) || email.length > 254 || password.length < 12 || password.length > 200) return Response.json({ error: "Invalid registration" }, { status: 400 });
    const address = getClientAddress(request);
    if (!(await rateLimit(`register:ip:${address}`, 5)) || !(await rateLimit(`register:email:${email}`, 2))) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": "60" } });
    const payload = await getPayload({ config });
    // The first owner must be created through Payload's protected
    // /admin/create-first-user flow. Public registration is never allowed to
    // bootstrap or claim ownership.
    const owners = await payload.find({ collection: "users", where: { role: { equals: "owner" } }, limit: 1, overrideAccess: true });
    if (owners.docs.length === 0) return Response.json({ error: "Owner setup required" }, { status: 503 });
    const existing = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
    if (existing.docs.length > 0) return Response.json({ ok: true, message: "Registration received" }, { status: 202 });
    const created = await payload.create({ collection: "users", data: { name, email, password, role: "editor", status: "pending" }, overrideAccess: true });
    await recordAuditLog(payload, { ...requestAuditContext(request), action: "registration.requested", collection: "users", documentId: String(created.id), actorEmail: email, actorRole: "editor" });
    return Response.json({ ok: true, message: "Registration received" }, { status: 202 });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: "Request body too large" }, { status: 413 });
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid registration" }, { status: 400 });
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  }
}
