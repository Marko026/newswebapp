import config from "@payload-config";
import { getPayload } from "payload";
import { isApprovedUser } from "@/lib/auth/permissions";
import { encryptMfaSecret, generateTotpSecret } from "@/lib/mfa";
import { getClientAddress, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: request.headers });
  if (!auth.user || !isApprovedUser(auth.user) || !["owner", "admin"].includes(String(auth.user.role))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await rateLimit(`mfa:setup:${auth.user.id}:${getClientAddress(request)}`, 3, 60_000))) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": "60" } });
  const user = await payload.findByID({ collection: "users", id: auth.user.id, overrideAccess: true });
  if (user.mfaEnabled) return Response.json({ error: "MFA is already enabled" }, { status: 409 });
  const secret = generateTotpSecret();
  await payload.update({ collection: "users", id: user.id, data: { mfaEnabled: false, mfaSecretEncrypted: encryptMfaSecret(secret) }, overrideAccess: true });
  return Response.json({ secret, otpauth: `otpauth://totp/Nile%20Chronicle?secret=${secret}&issuer=Nile%20Chronicle` }, { headers: { "cache-control": "no-store" } });
}
