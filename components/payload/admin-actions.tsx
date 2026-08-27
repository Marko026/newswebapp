import Link from "next/link";

/** Persistent, explicit navigation for the admin shell. Payload still owns
 * the underlying logout operation and session cookie invalidation. */
export function AdminActions() {
  return <nav className="payload-admin-actions" aria-label="Admin shortcuts">
    <Link href="/admin/collections/articles">Articles</Link>
    <Link href="/admin/collections/users">Users</Link>
    <Link href="/admin/collections/audit-logs">Audit log</Link>
    <Link className="is-secondary" href="/admin/logout">Log out</Link>
    <form action="/api/auth/revoke-all" method="post"><button type="submit">Revoke all sessions</button></form>
  </nav>;
}
