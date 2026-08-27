"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n";

type MenuItem = { href: string; label: string };

export function SiteMenu({ locale, items, label }: { locale: Locale; items: MenuItem[]; label: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || localizedPath(locale);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return <>
    <button ref={triggerRef} className="menu-trigger" type="button" aria-expanded={open} aria-controls="site-menu-panel" aria-label={label} onClick={() => setOpen((value) => !value)}><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
    {open ? <div className="menu-backdrop" aria-hidden="true" onClick={close} /> : null}
    <aside ref={panelRef} id="site-menu-panel" className={`site-menu-panel${open ? " is-open" : ""}`} aria-label={label} aria-hidden={!open}>
      <div className="site-menu-panel__head"><span className="eyebrow">{locale === "ar" ? "التنقل" : "Navigation"}</span><button className="site-menu-close" type="button" onClick={close} aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}>×</button></div>
      <nav className="site-menu-links">{items.map((item) => { const target = localizedPath(locale, item.href); const current = item.href ? pathname === target || pathname.startsWith(`${target}/`) : pathname === target; return <Link href={target} key={item.href} onClick={() => setOpen(false)} className={current ? "is-current" : undefined} aria-current={current ? "page" : undefined}>{item.label}<span aria-hidden="true">↗</span></Link>; })}</nav>
    </aside>
  </>;
}
