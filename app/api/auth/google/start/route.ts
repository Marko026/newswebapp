import { authorizationUrl, createOidcState, oidcConfig } from "@/lib/google-oidc";

export const dynamic = "force-dynamic";

export function GET() {
  const config = oidcConfig();
  const values = createOidcState();
  const response = Response.redirect(authorizationUrl(config, values));
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const cookies = [`google_oidc_state=${values.state}`, `google_oidc_verifier=${values.verifier}`, `google_oidc_nonce=${values.nonce}`].map((value) => `${value}; Path=/api/auth/google/callback; HttpOnly${secure}; SameSite=Lax; Max-Age=600`);
  for (const value of cookies) response.headers.append("set-cookie", value);
  return response;
}
