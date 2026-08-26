import Link from "next/link";

/** Persistent, explicit navigation for the admin shell. Payload still owns
 * the underlying logout operation and session cookie invalidation. */
export function AdminActions() {
  return <nav aria-label="Admin shortcuts" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem", padding: "0.75rem 1rem", border: "1px solid var(--theme-elevation-100)", borderRadius: "4px" }}>
    <Link href="/admin/collections/articles">Articles</Link>
    <Link href="/admin/collections/users">Users</Link>
    <Link href="/admin/collections/audit-logs">Audit log</Link>
    <Link href="/admin/logout" style={{ marginInlineStart: "auto" }}>Log out</Link>
    <form action="/api/auth/revoke-all" method="post"><button type="submit" style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: 0 }}>Revoke all sessions</button></form>
  </nav>;
}
