import { getPayload } from "payload";
import config from "@payload-config";
import { isApprovedUser } from "@/lib/auth/permissions";
import { createCloudinaryUploadSignature, isCloudinaryConfigured, type CloudinaryResourceType } from "@/lib/cloudinary";
import { getClientAddress, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: request.headers });
  if (!auth.user || !isApprovedUser(auth.user)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await rateLimit(`media:cloudinary-signature:${auth.user.id}:${getClientAddress(request)}`, 20, 60_000))) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": "60" } });
  if (!isCloudinaryConfigured()) return Response.json({ error: "Cloudinary is not configured" }, { status: 503 });

  let body: { resourceType?: unknown };
  try { body = await request.json() as { resourceType?: unknown }; } catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }); }
  if (body.resourceType !== "image" && body.resourceType !== "video") return Response.json({ error: "resourceType must be image or video" }, { status: 400 });

  try {
    return Response.json(createCloudinaryUploadSignature(body.resourceType as CloudinaryResourceType));
  } catch (error) {
    console.error("Cloudinary signature generation failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "Cloudinary upload is unavailable" }, { status: 503 });
  }
}
