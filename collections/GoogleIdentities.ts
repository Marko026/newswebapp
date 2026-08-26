import type { CollectionConfig } from "payload";
import { isApprovedOwner } from "../lib/auth/permissions";

export const GoogleIdentities: CollectionConfig = {
  slug: "google-identities",
  admin: { useAsTitle: "subject", defaultColumns: ["subject", "email", "user"] },
  access: { read: ({ req }) => isApprovedOwner(req.user), create: () => false, update: () => false, delete: ({ req }) => isApprovedOwner(req.user) },
  fields: [
    { name: "subject", type: "text", required: true, unique: true, index: true },
    { name: "email", type: "email", required: true },
    { name: "user", type: "relationship", relationTo: "users", required: true },
    { name: "lastVerifiedAt", type: "date", required: true },
  ],
};
