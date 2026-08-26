import { getPayload } from "payload";
import config from "@payload-config";
import { isApprovedUser } from "@/lib/auth/permissions";
import { isAllowedCloudinaryAsset, isCloudinaryConfigured, type CloudinaryResourceType } from "@/lib/cloudinary";

type CloudinaryUploadResult = {
  publicId?: unknown;
  secureUrl?: unknown;
  resourceType?: unknown;
  format?: unknown;
  bytes?: unknown;
  width?: unknown;
  height?: unknown;
  duration?: unknown;
  originalFilename?: unknown;
  alt?: unknown;
};

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const positiveNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
const mimeTypeFor = (resourceType: "image" | "video", format: string) => resourceType === "image" && format === "jpg" ? "image/jpeg" : `${resourceType}/${format}`;

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: request.headers });
  if (!auth.user || !isApprovedUser(auth.user)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCloudinaryConfigured()) return Response.json({ error: "Cloudinary is not configured" }, { status: 503 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 32_768) return Response.json({ error: "Request too large" }, { status: 413 });

  let body: CloudinaryUploadResult;
  try { body = await request.json() as CloudinaryUploadResult; } catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }); }
  const publicId = text(body.publicId);
  const secureUrl = text(body.secureUrl);
  const resourceType = body.resourceType === "video" ? "video" : body.resourceType === "image" ? "image" : "";
  const format = text(body.format);
  const alt = text(body.alt);
  const originalFilename = text(body.originalFilename) || publicId.split("/").pop() || "cloudinary-asset";
  if (!resourceType || !publicId || !secureUrl || !/^[a-z0-9]+$/.test(format) || format.length > 12 || !alt || alt.length > 500 || !isAllowedCloudinaryAsset(publicId, resourceType as CloudinaryResourceType, secureUrl)) return Response.json({ error: "Invalid Cloudinary asset" }, { status: 400 });

  const existing = await payload.find({ collection: "media", where: { cloudinaryPublicId: { equals: publicId } }, limit: 1, overrideAccess: true });
  if (existing.docs[0]) return Response.json({ doc: existing.docs[0], created: false });

  const doc = await payload.create({ collection: "media", overrideAccess: true, data: {
    filename: originalFilename,
    mimeType: mimeTypeFor(resourceType as "image" | "video", format),
    filesize: positiveNumber(body.bytes) || 0,
    width: positiveNumber(body.width),
    height: positiveNumber(body.height),
    alt,
    provider: "cloudinary",
    cloudinaryPublicId: publicId,
    cloudinarySecureUrl: secureUrl,
    cloudinaryResourceType: resourceType,
    cloudinaryBytes: positiveNumber(body.bytes),
    cloudinaryDuration: positiveNumber(body.duration),
  } as never });
  return Response.json({ doc, created: true }, { status: 201 });
}
