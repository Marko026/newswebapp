import type { CollectionConfig } from "payload";
import { isApprovedOwner, isApprovedUser } from "../lib/auth/permissions";

export const Media: CollectionConfig = { slug: "media", access: { read: () => true, create: ({ req }) => isApprovedUser(req.user), update: ({ req }) => isApprovedUser(req.user), delete: ({ req }) => isApprovedOwner(req.user) }, upload: { mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"], imageSizes: [{ name: "thumbnail", width: 400, height: 300, position: "centre" }, { name: "card", width: 900, height: 650, position: "centre" }, { name: "hero", width: 1800, height: 1200, position: "centre" }] }, fields: [{ name: "alt", type: "text", localized: true, required: true }, { name: "caption", type: "text", localized: true }] };
