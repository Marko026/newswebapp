import type { CollectionConfig } from "payload";
import { isApprovedOwner, isApprovedUser } from "../lib/auth/permissions";

export const Topics: CollectionConfig = { slug: "topics", admin: { useAsTitle: "name" }, access: { read: () => true, create: ({ req }) => isApprovedUser(req.user), update: ({ req }) => isApprovedUser(req.user), delete: ({ req }) => isApprovedOwner(req.user) }, fields: [{ name: "name", type: "text", localized: true, required: true }, { name: "slug", type: "text", required: true, unique: true },] };
