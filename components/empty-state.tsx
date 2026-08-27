import Link from "next/link";

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="empty-state" role="status">
      <p className="eyebrow">—</p>
      <h2>{title}</h2>
      <p>{body}</p>
      {href && action ? <Link className="line-link" href={href}>{action} ↗</Link> : null}
    </div>
  );
}
