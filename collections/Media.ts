import type { CollectionConfig } from "payload";
import { isApprovedOwner, isApprovedUser } from "../lib/auth/permissions";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { components: { beforeList: ["@/components/payload/cloudinary-upload#CloudinaryUpload"] } },
  access: { read: () => true, create: ({ req }) => isApprovedUser(req.user), update: ({ req }) => isApprovedUser(req.user), delete: ({ req }) => isApprovedOwner(req.user) },
  upload: { filesRequiredOnCreate: false, mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm", "video/quicktime"], imageSizes: [{ name: "thumbnail", width: 400, height: 300, position: "centre" }, { name: "card", width: 900, height: 650, position: "centre" }, { name: "hero", width: 1800, height: 1200, position: "centre" }] },
  fields: [{ name: "alt", type: "text", localized: true, required: true }, { name: "caption", type: "text", localized: true }, { name: "provider", type: "select", defaultValue: "payload", options: [{ label: "Payload", value: "payload" }, { label: "Cloudinary", value: "cloudinary" }], admin: { position: "sidebar" } }, { name: "cloudinaryPublicId", type: "text", unique: true, admin: { condition: (_, siblingData) => siblingData?.provider === "cloudinary" } }, { name: "cloudinarySecureUrl", type: "text", admin: { condition: (_, siblingData) => siblingData?.provider === "cloudinary" } }, { name: "cloudinaryResourceType", type: "select", options: [{ label: "Image", value: "image" }, { label: "Video", value: "video" }], admin: { condition: (_, siblingData) => siblingData?.provider === "cloudinary" } }, { name: "cloudinaryBytes", type: "number", admin: { readOnly: true } }, { name: "cloudinaryDuration", type: "number", admin: { readOnly: true } }],
};
