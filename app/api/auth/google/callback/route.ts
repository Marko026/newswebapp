import config from "@payload-config";
import { randomUUID } from "node:crypto";
import { generatePayloadCookie, getFieldsToSign, getPayload, jwtSign } from "payload";
import { recordAuditLog, requestAuditContext } from "@/lib/audit";
import { isApprovedUser } from "@/lib/auth/permissions";
import { exchangeCode, oidcConfig, verifyIdToken } from "@/lib/google-oidc";

function cookies(request: Request) { return Object.fromEntries((request.headers.get("cookie") || "").split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value)); }
function clearCookies(response: Response) { response.headers.append("set-cookie", "google_oidc_state=; Path=/api/auth/google/callback; Max-Age=0"); response.headers.append("set-cookie", "google_oidc_verifier=; Path=/api/auth/google/callback; Max-Age=0"); response.headers.append("set-cookie", "google_oidc_nonce=; Path=/api/auth/google/callback; Max-Age=0"); return response; }

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const stored = cookies(request);
    if (!query.get("code") || !query.get("state") || query.get("state") !== stored.google_oidc_state || !stored.google_oidc_verifier || !stored.google_oidc_nonce) return clearCookies(Response.json({ error: "Invalid OIDC state" }, { status: 400 }));
    const oidc = oidcConfig();
    const exchanged = await exchangeCode(oidc, query.get("code")!, stored.google_oidc_verifier);
    if (!exchanged.id_token) throw new Error("Google did not return an ID token");
    const identity = await verifyIdToken(exchanged.id_token, oidc);
    const email = identity.email!;
    if (identity.nonce !== stored.google_oidc_nonce) return clearCookies(Response.json({ error: "Invalid OIDC nonce" }, { status: 400 }));
    const payload = await getPayload({ config });
    const users = await payload.find({ collection: "users", where: { email: { equals: email.toLowerCase() } }, limit: 1, overrideAccess: true });
    if (!users.docs[0] || !isApprovedUser(users.docs[0])) return clearCookies(Response.json({ error: "Account pending approval" }, { status: 403 }));
    const existingIdentity = await payload.find({ collection: "google-identities", where: { subject: { equals: identity.sub } }, limit: 1, depth: 0, overrideAccess: true });
    if (existingIdentity.docs[0] && String(existingIdentity.docs[0].user) !== String(users.docs[0].id)) return clearCookies(Response.json({ error: "Google identity is linked to another account" }, { status: 403 }));
    if (existingIdentity.docs[0]) {
      await payload.update({ collection: "google-identities", id: existingIdentity.docs[0].id, data: { email: email.toLowerCase(), user: users.docs[0].id, lastVerifiedAt: new Date().toISOString() }, overrideAccess: true });
    } else {
      await payload.create({ collection: "google-identities", data: { subject: identity.sub!, email: email.toLowerCase(), user: users.docs[0].id, lastVerifiedAt: new Date().toISOString() }, overrideAccess: true });
    }
    const user = users.docs[0];
    const collection = payload.collections.users;
    const sid = randomUUID();
    const expiresAt = new Date(Date.now() + collection.config.auth.tokenExpiration * 1000).toISOString();
    await payload.update({ collection: "users", id: user.id, data: { sessions: [...(user.sessions || []), { id: sid, createdAt: new Date().toISOString(), expiresAt }] }, overrideAccess: true });
    const fieldsToSign = getFieldsToSign({ collectionConfig: collection.config, email: user.email, sid, user });
    const { token } = await jwtSign({ fieldsToSign, secret: payload.secret, tokenExpiration: collection.config.auth.tokenExpiration });
    const response = Response.redirect(new URL("/admin", request.url));
    response.headers.append("set-cookie", generatePayloadCookie({ collectionAuthConfig: collection.config.auth, cookiePrefix: payload.config.cookiePrefix, token }));
    await recordAuditLog(payload, { ...requestAuditContext(request), action: "auth.login.google", collection: "users", documentId: String(user.id), actorEmail: email.toLowerCase(), actorRole: String(user.role) });
    return clearCookies(response);
  } catch { return clearCookies(Response.json({ error: "Google authentication unavailable" }, { status: 503 })); }
}
