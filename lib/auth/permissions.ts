import type { AccessArgs } from "payload";

export type StaffRole = "owner" | "admin" | "editor";
export type AccountStatus = "pending" | "approved" | "suspended";

type AuthUser = NonNullable<AccessArgs["req"]["user"]> & {
  role?: StaffRole | string | null;
  status?: AccountStatus | string | null;
};

/** Legacy owners predate the status field and are treated as approved. */
export const isApprovedUser = (user: AuthUser | null | undefined): boolean =>
  Boolean(user && (user.status === "approved" || (user.role === "owner" && !user.status)));

export const isOwnerUser = (user: AuthUser | null | undefined): boolean =>
  Boolean(user && user.role === "owner" && isApprovedUser(user));

export const isApprovedOwner = isOwnerUser;

export const isAdminUser = (user: AuthUser | null | undefined): boolean =>
  Boolean(user && String(user.role) === "admin" && isApprovedUser(user));

export const isStaffUser = (user: AuthUser | null | undefined): boolean =>
  isOwnerUser(user) || isAdminUser(user) || Boolean(user && user.role === "editor" && isApprovedUser(user));

export const canManageUsers = (user: AuthUser | null | undefined): boolean =>
  isOwnerUser(user) || isAdminUser(user);

export const canManageRoles = (user: AuthUser | null | undefined): boolean => isOwnerUser(user);

export const hasAccountTransition = (
  original: { role?: unknown; status?: unknown } | null | undefined,
  next: { role?: unknown; status?: unknown },
): boolean => {
  if (!original) return false;
  return (next.role !== undefined && next.role !== original.role)
    || (next.status !== undefined && next.status !== original.status);
};
