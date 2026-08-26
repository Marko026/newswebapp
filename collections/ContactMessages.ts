import type { CollectionConfig } from "payload";
import { isApprovedOwner, isApprovedUser } from "../lib/auth/permissions";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  admin: { useAsTitle: "email", defaultColumns: ["email", "createdAt"] },
  access: { read: ({ req }) => isApprovedOwner(req.user), create: ({ req }) => isApprovedUser(req.user), update: ({ req }) => isApprovedOwner(req.user), delete: ({ req }) => isApprovedOwner(req.user) },
  fields: [{ name: "name", type: "text", required: true }, { name: "email", type: "email", required: true }, { name: "message", type: "textarea", required: true }],
};
