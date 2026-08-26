import { createHash, randomBytes } from "node:crypto";

const issuer = "https://accounts.google.com";
const jwksUrl = "https://www.googleapis.com/oauth2/v3/certs";
const b64 = (input: Uint8Array | string) => Buffer.from(input).toString("base64url");
const unb64 = (value: string) => Buffer.from(value, "base64url");

export function oidcConfig() {
  const clientId = process.env.GOOGLE_OIDC_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OIDC_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_OIDC_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) throw new Error("Google OIDC is not configured");
  return { clientId, clientSecret, redirectUri };
}

export function createOidcState() {
  const state = b64(randomBytes(32));
  const verifier = b64(randomBytes(48));
  const challenge = b64(createHash("sha256").update(verifier).digest());
  const nonce = b64(randomBytes(32));
  return { state, verifier, challenge, nonce };
}

export function authorizationUrl(config: ReturnType<typeof oidcConfig>, values: ReturnType<typeof createOidcState>) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: "code", scope: "openid email profile", state: values.state, nonce: values.nonce, code_challenge: values.challenge, code_challenge_method: "S256", access_type: "online", prompt: "select_account" }).toString();
  return url;
}

export async function exchangeCode(config: ReturnType<typeof oidcConfig>, code: string, verifier: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: "authorization_code", code_verifier: verifier }) });
  if (!response.ok) throw new Error("Google token exchange failed");
  return response.json() as Promise<{ id_token?: string }>;
}

export async function verifyIdToken(token: string, config: ReturnType<typeof oidcConfig>) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) throw new Error("Malformed Google ID token");
  const header = JSON.parse(unb64(encodedHeader).toString("utf8")) as { kid?: string; alg?: string };
  const payload = JSON.parse(unb64(encodedPayload).toString("utf8")) as { iss?: string; aud?: string; sub?: string; email?: string; email_verified?: boolean; nonce?: string; exp?: number };
  if (header.alg !== "RS256" || payload.iss !== issuer || payload.aud !== config.clientId || !payload.sub || !payload.email || !payload.email_verified || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Invalid Google ID token claims");
  const jwks = await (await fetch(jwksUrl, { cache: "no-store" })).json() as { keys?: JsonWebKey[] };
  const key = jwks.keys?.find((candidate) => (candidate as JsonWebKey & { kid?: string }).kid === header.kid);
  if (!key) throw new Error("Google signing key not found");
  const cryptoKey = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, unb64(encodedSignature), new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));
  if (!valid) throw new Error("Invalid Google ID token signature");
  return payload;
}
