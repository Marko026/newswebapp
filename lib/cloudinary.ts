import "server-only";
import { v2 as cloudinary } from "cloudinary";

export type CloudinaryResourceType = "image" | "video";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

export const CLOUDINARY_IMAGE_UPLOAD_PRESET = process.env.CLOUDINARY_IMAGE_UPLOAD_PRESET?.trim();
export const CLOUDINARY_VIDEO_UPLOAD_PRESET = process.env.CLOUDINARY_VIDEO_UPLOAD_PRESET?.trim();

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

function getConfiguredCloudinary() {
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

export function createCloudinaryUploadSignature(resourceType: CloudinaryResourceType) {
  const client = getConfiguredCloudinary();
  if (!apiSecret) throw new Error("Cloudinary is not configured");
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = resourceType === "video" ? CLOUDINARY_VIDEO_UPLOAD_PRESET : CLOUDINARY_IMAGE_UPLOAD_PRESET;
  const folder = resourceType === "video" ? "news/videos/originals" : "news/images/originals";
  if (!uploadPreset) throw new Error(`Cloudinary ${resourceType} upload preset is not configured`);
  const paramsToSign = { folder, timestamp, upload_preset: uploadPreset };
  return {
    cloudName,
    apiKey,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    timestamp,
    folder,
    uploadPreset,
    signature: client.utils.api_sign_request(paramsToSign, apiSecret),
  };
}

export function isAllowedCloudinaryAsset(publicId: string, resourceType: CloudinaryResourceType, secureUrl: string) {
  if (!cloudName || !/^[A-Za-z0-9/_-]+$/.test(publicId) || publicId.includes("..")) return false;
  try {
    const url = new URL(secureUrl);
    return url.protocol === "https:"
      && url.hostname === "res.cloudinary.com"
      && url.pathname.startsWith(`/${cloudName}/`)
      && publicId.startsWith(resourceType === "video" ? "news/videos/originals/" : "news/images/originals/");
  } catch { return false; }
}

export function cloudinaryImageUrl(publicId: string, width: number, height?: number) {
  return getConfiguredCloudinary().url(publicId, {
    secure: true,
    resource_type: "image",
    type: "upload",
    transformation: [{ width, ...(height ? { height } : {}), crop: height ? "fill" : "limit", gravity: height ? "auto" : undefined, fetch_format: "auto", quality: "auto" }],
  });
}
