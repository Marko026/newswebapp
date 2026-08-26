"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { replaceLocale, type Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;
  const searchParams = useSearchParams();
  const targetLocale: Locale = locale === "ar" ? "en" : "ar";
  const query = searchParams.toString();
  const href = `${replaceLocale(pathname, targetLocale)}${query ? `?${query}` : ""}`;
  return <Link className="language-switch" href={href} hrefLang={targetLocale}>{label}</Link>;
}
