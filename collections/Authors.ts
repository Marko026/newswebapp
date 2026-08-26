import type { CollectionConfig } from "payload";
import { isApprovedOwner, isApprovedUser } from "../lib/auth/permissions";

export const Authors: CollectionConfig = { slug: "authors", admin: { useAsTitle: "name" }, access: { read: () => true, create: ({ req }) => isApprovedUser(req.user), update: ({ req }) => isApprovedUser(req.user), delete: ({ req }) => isApprovedOwner(req.user) }, fields: [{ name: "name", type: "text", localized: true, required: true }, { name: "bio", type: "textarea", localized: true }, { name: "avatar", type: "upload", relationTo: "media" }] };
