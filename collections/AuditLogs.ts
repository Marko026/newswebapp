import type { CollectionConfig } from "payload";
import { isApprovedOwner } from "../lib/auth/permissions";

/**
 * Append-only security and editorial audit trail. Writers can create content,
 * but only owners may inspect the trail; no role can mutate or delete entries.
 */
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  admin: { useAsTitle: "action", defaultColumns: ["createdAt", "action", "collection", "actorEmail"] },
  access: {
    read: ({ req }) => isApprovedOwner(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "action", type: "text", required: true, maxLength: 80 },
    { name: "collection", type: "text", required: true, maxLength: 80 },
    { name: "documentId", type: "text", maxLength: 120 },
    { name: "actorEmail", type: "email" },
    { name: "actorRole", type: "text", maxLength: 40 },
    { name: "ipAddress", type: "text", maxLength: 128 },
    { name: "userAgent", type: "text", maxLength: 512 },
    { name: "requestId", type: "text", maxLength: 120 },
    { name: "metadata", type: "json" },
  ],
};
