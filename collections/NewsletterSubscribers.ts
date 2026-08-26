import type { CollectionConfig } from "payload";
import { isApprovedOwner } from "../lib/auth/permissions";

export const NewsletterSubscribers: CollectionConfig = { slug: "newsletter-subscribers", admin: { useAsTitle: "email", defaultColumns: ["email", "locale", "createdAt"] }, access: { read: ({ req }) => isApprovedOwner(req.user), create: ({ req }) => isApprovedOwner(req.user), update: ({ req }) => isApprovedOwner(req.user), delete: ({ req }) => isApprovedOwner(req.user) }, fields: [{ name: "email", type: "email", required: true, unique: true }, { name: "locale", type: "select", required: true, options: [{ label: "Arabic", value: "ar" }, { label: "English", value: "en" }] }] };
