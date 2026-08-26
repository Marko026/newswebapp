import config from "@payload-config";
import { getPayload } from "payload";
import { isApprovedUser } from "@/lib/auth/permissions";
import { decryptMfaSecret, verifyTotp } from "@/lib/mfa";
import { getClientAddress, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: request.headers });
  if (!auth.user || !isApprovedUser(auth.user) || !["owner", "admin"].includes(String(auth.user.role))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await rateLimit(`mfa:enable:${auth.user.id}:${getClientAddress(request)}`, 5, 60_000))) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": "60" } });
  const body = await request.json() as { code?: string };
  const user = await payload.findByID({ collection: "users", id: auth.user.id, overrideAccess: true });
  if (!user.mfaSecretEncrypted || !body.code) return Response.json({ error: "MFA setup required" }, { status: 400 });
  let valid = false;
  try { valid = verifyTotp(decryptMfaSecret(user.mfaSecretEncrypted), body.code); } catch { valid = false; }
  if (!valid) return Response.json({ error: "Invalid MFA code" }, { status: 400 });
  await payload.update({ collection: "users", id: user.id, data: { mfaEnabled: true }, overrideAccess: true });
  return Response.json({ ok: true });
}
