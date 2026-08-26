import type { Access, AccessArgs, CollectionBeforeChangeHook, CollectionConfig, Where } from "payload";
import { recordAuditLog } from "../lib/audit";
import { hasRecentMfa } from "../lib/mfa";

type WorkflowStatus = "draft" | "assigned" | "in_review" | "needs_correction" | "approved" | "published" | "archived";

// Owners created before the status field was introduced have no status value.
// They remain valid newsroom users and must be able to open draft documents.
const isApprovedUser = (user: AccessArgs["req"]["user"]) => Boolean(
  user && (user.status === "approved" || (user.role === "owner" && !user.status)),
);
const isOwner = (user: AccessArgs["req"]["user"]) => Boolean(user?.role === "owner" && isApprovedUser(user));
const canManage: Access = ({ req }) => isApprovedUser(req.user);
const canRead: Access = ({ req }) => {
  if (isApprovedUser(req.user)) return { deletedAt: { exists: false } } as Where;
  return { and: [{ _status: { equals: "published" } }, { deletedAt: { exists: false } }] } as Where;
};
const canDelete: Access = ({ req }) => isOwner(req.user);

const workflowValues: { label: string; value: WorkflowStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Assigned", value: "assigned" },
  { label: "In review", value: "in_review" },
  { label: "Needs correction", value: "needs_correction" },
  { label: "Approved", value: "approved" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

/** Keep workflow transitions explicit and make the audit fields deterministic. */
const enforceEditorialWorkflow: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  const user = req.user;
  if (!user || !isApprovedUser(user)) return data;

  const nextStatus = (data.editorialStatus ?? originalDoc?.editorialStatus ?? "draft") as WorkflowStatus;
  const previousStatus = (originalDoc?.editorialStatus ?? "draft") as WorkflowStatus;
  const assignedTo = data.assignedTo ?? originalDoc?.assignedTo;
  const assignedId = assignedTo && typeof assignedTo === "object" ? assignedTo.id : assignedTo;
  const userId = String(user.id);

  if (process.env.MFA_REQUIRED === "true" && (nextStatus === "published" || nextStatus === "archived") && !hasRecentMfa(req as unknown as Request, userId)) {
    throw new Error("Recent MFA verification is required to publish or archive an article.");
  }

  // Editors may only advance their own assignments; owners can triage any story.
  if (user.role !== "owner" && operation !== "create" && assignedId && String(assignedId) !== userId) {
    throw new Error("Editors may only update articles assigned to them.");
  }
  if (operation === "create" && user.role !== "owner") {
    data.assignedTo = user.id;
    data.editorialStatus = "assigned";
  }
  if (nextStatus === "in_review" && !assignedTo) {
    throw new Error("An article must be assigned before review.");
  }
  if (nextStatus === "needs_correction" && !data.correctionNotes && !originalDoc?.correctionNotes) {
    throw new Error("Correction notes are required when an article needs correction.");
  }
  if (nextStatus === "published" && !isOwner(user) && previousStatus !== "approved") {
    throw new Error("Only an owner can publish an unapproved article.");
  }
  if (nextStatus !== previousStatus || operation === "create") {
    data.workflowChangedAt = new Date().toISOString();
    data.workflowChangedBy = user.id;
  }
  if (nextStatus === "in_review" && !data.reviewer) data.reviewer = user.id;
  return data;
};

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: { useAsTitle: "title", defaultColumns: ["title", "editorialStatus", "assignedTo", "_status", "updatedAt"] },
  access: { read: canRead, create: canManage, update: canManage, delete: canDelete },
  hooks: {
    beforeChange: [enforceEditorialWorkflow],
    beforeDelete: [async ({ req }) => {
      if (process.env.MFA_REQUIRED === "true" && (!req.user || !hasRecentMfa(req as unknown as Request, String(req.user.id)))) {
        throw new Error("Recent MFA verification is required to delete an article.");
      }
    }],
    afterChange: [async ({ doc, operation, req }) => {
      await recordAuditLog(req.payload, { action: `article.${operation}`, collection: "articles", documentId: String(doc.id), actorEmail: req.user?.email, actorRole: req.user?.role ?? undefined, metadata: { editorialStatus: doc.editorialStatus, title: doc.title } }, { required: true });
      return doc;
    }],
    afterDelete: [async ({ id, req }) => {
      await recordAuditLog(req.payload, { action: "article.delete", collection: "articles", documentId: String(id), actorEmail: req.user?.email, actorRole: req.user?.role ?? undefined }, { required: true });
    }],
  },
  versions: { drafts: { autosave: { interval: 2000 }, schedulePublish: true }, maxPerDoc: 50 },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { position: "sidebar" } },
    { name: "excerpt", type: "textarea", localized: true, required: true },
    { name: "body", type: "richText", localized: true, required: true },
    { name: "category", type: "relationship", relationTo: "categories", required: true, admin: { position: "sidebar" } },
    { name: "topics", type: "relationship", relationTo: "topics", hasMany: true, admin: { position: "sidebar" } },
    { name: "author", type: "relationship", relationTo: "authors", required: true, admin: { position: "sidebar" } },
    { name: "coverImage", type: "upload", relationTo: "media", required: true },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "caption", type: "text", localized: true },
    { name: "seoTitle", type: "text", localized: true, admin: { description: "Optional search title" } },
    { name: "seoDescription", type: "textarea", localized: true },
    { name: "editorialStatus", type: "select", defaultValue: "draft", options: workflowValues, index: true, admin: { position: "sidebar" } },
    { name: "assignedTo", type: "relationship", relationTo: "users", admin: { position: "sidebar", description: "Editor responsible for the next pass" } },
    { name: "reviewer", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "correctionNotes", type: "textarea", localized: true, admin: { description: "Required for the Needs correction state" } },
    { name: "reviewNotes", type: "textarea", localized: true },
    { name: "workflowChangedAt", type: "date", access: { update: ({ req }) => isOwner(req.user) }, admin: { readOnly: true, position: "sidebar" } },
    { name: "workflowChangedBy", type: "relationship", relationTo: "users", access: { update: ({ req }) => isOwner(req.user) }, admin: { readOnly: true, position: "sidebar" } },
    { name: "previewToken", type: "text", unique: true, access: { update: ({ req }) => isOwner(req.user) }, admin: { hidden: true } },
    // Soft-delete is intentionally data-driven: records remain recoverable and are
    // excluded from both public and authenticated reads by canRead above.
    { name: "deletedAt", type: "date", index: true, access: { update: ({ req }) => isOwner(req.user) }, admin: { hidden: true } },
  ],
};
