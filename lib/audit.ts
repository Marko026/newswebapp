import type { Payload } from "payload";
import { getClientAddress } from "./rate-limit";

export type AuditEvent = {
  action: string;
  collection: string;
  documentId?: string;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

type AuditOptions = { required?: boolean };

/** Best-effort audit write: an audit outage must not turn a valid public form into a 503. */
export async function recordAuditLog(payload: Payload, event: AuditEvent, options: AuditOptions = {}): Promise<void> {
  try {
    await payload.create({ collection: "audit-logs", data: event, overrideAccess: true });
  } catch (error) {
    console.error("audit log write failed", error);
    if (options.required) throw error;
  }
}

export function requestAuditContext(request: Request) {
  return {
    ipAddress: getClientAddress(request),
    userAgent: request.headers.get("user-agent")?.slice(0, 512),
    requestId: request.headers.get("x-request-id")?.slice(0, 120),
  };
}
