import config from "@payload-config";
import { createLocalReq, getPayload, logoutOperation } from "payload";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : null;
  // Revoking every session is a state-changing action. A missing Origin is
  // not considered safe because it would allow a cross-site form POST to
  // trigger a logout-all denial of service.
  if (!origin || (siteOrigin && origin !== siteOrigin)) return Response.json({ error: "Invalid origin" }, { status: 403 });
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: request.headers });
  if (!auth.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const req = await createLocalReq({ user: auth.user }, payload);
  const collection = payload.collections[auth.user.collection];
  await logoutOperation({ allSessions: true, collection, req });
  const response = Response.json({ ok: true, message: "All sessions revoked" });
  response.headers.append("set-cookie", "mfa_step_up=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  return response;
}
