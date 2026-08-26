import { APIError, type Access, type AccessArgs, type CollectionConfig } from "payload";
import {
  canManageRoles,
  canManageUsers,
  hasAccountTransition,
  isApprovedUser,
  isApprovedOwner,
} from "../lib/auth/permissions";
import { recordAuditLog } from "../lib/audit";
import { hasRecentMfa } from "../lib/mfa";

const isSelf = ({ req, id }: AccessArgs) => Boolean(req.user && id && String(req.user.id) === String(id));
const canReadUsers: Access = ({ req }) => {
  if (!req.user || !isApprovedUser(req.user)) return false;
  return canManageUsers(req.user) ? true : { id: { equals: req.user.id } };
};
const canUpdateUser: Access = ({ req, id }) => canManageUsers(req.user) || isSelf({ req, id } as AccessArgs);
const canCreateUser: Access = ({ req }) => canManageUsers(req.user);
const isActiveOwner = (user: { role?: unknown; status?: unknown } | null | undefined) => user?.role === "owner" && (user.status === "approved" || !user.status);

export const Users: CollectionConfig = {
  slug: "users",
  auth: { maxLoginAttempts: 5, lockTime: 600000, tokenExpiration: 60 * 60 * 8 },
  admin: { useAsTitle: "email", defaultColumns: ["email", "status", "role"] },
  access: {
    read: canReadUsers,
    create: canCreateUser,
    update: canUpdateUser,
    delete: ({ req }) => canManageUsers(req.user),
  },
  hooks: {
    beforeChange: [async ({ data, operation, req, originalDoc }) => {
      if (operation === "create") {
        const existing = await req.payload.find({ collection: "users", limit: 1, pagination: false, overrideAccess: true, req });
        if (existing.docs.length === 0 && process.env.NODE_ENV === "production" && process.env.ALLOW_FIRST_USER_SETUP !== "true") {
          throw new APIError("Owner provisioning is disabled until the deployment setup window is enabled.", 503);
        }
        return existing.docs.length === 0
          ? { ...data, role: "owner", status: "approved", bootstrapClaim: "singleton" }
          : { ...data, role: "editor", status: "pending" };
      }

      // Normalize legacy owners on their next write without changing other legacy rows.
      if (originalDoc?.role === "owner" && !originalDoc.status && data.status === undefined) data.status = "approved";
      const nextRole = data.role ?? originalDoc?.role;
      const nextStatus = data.status ?? originalDoc?.status ?? (originalDoc?.role === "owner" ? "approved" : undefined);

      const accountTransition = hasAccountTransition(originalDoc, { role: nextRole, status: nextStatus });
      const isLegacyOwnerMigration = (req.context as Record<string, unknown> | undefined)?.legacyOwnerMigration === true;
      if (accountTransition && process.env.MFA_REQUIRED === "true" && !isLegacyOwnerMigration && (!req.user || !hasRecentMfa(req as unknown as Request, String(req.user.id)))) {
        throw new APIError("Recent MFA verification is required for account governance changes.", 403);
      }
      if (accountTransition) {
        data.sessions = [];
        if (nextStatus !== "approved") {
          data.mfaEnabled = false;
          data.mfaSecretEncrypted = null;
        }
      }

      if (originalDoc?.role === "owner" && (nextRole !== "owner" || nextStatus !== "approved")) {
        const owners = await req.payload.find({ collection: "users", where: { role: { equals: "owner" } }, limit: 2, overrideAccess: true, req });
        if (owners.docs.filter(isActiveOwner).length <= 1) throw new APIError("The last active owner cannot be demoted or suspended.", 400);
      }
      return data;
    }],
    beforeDelete: [async ({ id, req }) => {
      if (process.env.MFA_REQUIRED === "true" && req.user && !hasRecentMfa(req as unknown as Request, String(req.user.id))) {
        throw new APIError("Recent MFA verification is required to delete a user.", 403);
      }
      const target = await req.payload.findByID({ collection: "users", id, overrideAccess: true, req });
      if (target.role !== "owner") return;
      const owners = await req.payload.find({ collection: "users", where: { role: { equals: "owner" } }, limit: 2, overrideAccess: true, req });
      if (owners.docs.filter(isActiveOwner).length <= 1) throw new APIError("The last active owner cannot be deleted.", 400);
    }],
    afterChange: [async ({ doc, operation, req }) => {
      await recordAuditLog(req.payload, { action: `user.${operation}`, collection: "users", documentId: String(doc.id), actorEmail: req.user?.email, actorRole: req.user?.role ?? undefined, metadata: { targetEmail: doc.email, targetRole: doc.role, targetStatus: doc.status } }, { required: true });
      return doc;
    }],
    afterDelete: [async ({ id, req }) => {
      await recordAuditLog(req.payload, { action: "user.delete", collection: "users", documentId: String(id), actorEmail: req.user?.email, actorRole: req.user?.role ?? undefined }, { required: true });
    }],
    afterLogin: [async ({ user, req }) => {
      await recordAuditLog(req.payload, { action: "auth.login.success", collection: "users", documentId: String(user.id), actorEmail: user.email, actorRole: user.role ?? undefined }, { required: true });
      return user;
    }],
    afterLogout: [async ({ req }) => {
      await recordAuditLog(req.payload, { action: "auth.logout", collection: "users", documentId: req.user ? String(req.user.id) : undefined, actorEmail: req.user?.email, actorRole: req.user?.role ?? undefined }, { required: true });
    }],
    beforeLogin: [async ({ user }) => {
      if (user.status !== "approved" && !(user.role === "owner" && !user.status)) {
        throw new APIError("Your account is not approved for access.", 403);
      }
      if (!isApprovedUser(user)) throw new APIError("Your account is not approved for access.", 403);
      return user;
    }],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "bootstrapClaim",
      type: "text",
      unique: true,
      index: true,
      hidden: true,
      access: { read: () => false, update: () => false },
    },
    { name: "mfaEnabled", type: "checkbox", defaultValue: false, access: { read: ({ req }) => isApprovedOwner(req.user), update: () => false } },
    { name: "mfaSecretEncrypted", type: "text", hidden: true, access: { read: () => false, update: () => false } },
    { name: "status", type: "select", defaultValue: "pending", options: [{ label: "Pending", value: "pending" }, { label: "Approved", value: "approved" }, { label: "Suspended", value: "suspended" }], access: { update: ({ req }) => canManageRoles(req.user) } },
    { name: "role", type: "select", defaultValue: "editor", options: [{ label: "Editor", value: "editor" }, { label: "Admin", value: "admin" }, { label: "Owner", value: "owner" }], access: { update: ({ req }) => canManageRoles(req.user) } },
  ],
};
