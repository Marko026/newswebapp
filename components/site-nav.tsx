"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n";

type MenuItem = { href: string; label: string };

function isCurrent(pathname: string, locale: Locale, href: string) {
  const target = localizedPath(locale, href);
  return href ? pathname === target || pathname.startsWith(`${target}/`) : pathname === target;
}

export function SiteNav({ locale, items, label }: { locale: Locale; items: MenuItem[]; label: string }) {
  const pathname = usePathname() || localizedPath(locale);

  return <nav className="main-nav" aria-label={label}>
    {items.map((item) => {
      const current = isCurrent(pathname, locale, item.href);
      return <Link key={item.href} href={localizedPath(locale, item.href)} className={current ? "is-current" : undefined} aria-current={current ? "page" : undefined}>{item.label}</Link>;
    })}
  </nav>;
}
