import Link from "next/link";
import { brand } from "@/lib/brand";
import { localizedPath, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const labels = locale === "ar"
    ? { home: "الرئيسية", news: "الأخبار", history: "التاريخ", topics: "المواضيع", about: "عن الموقع", search: "بحث", theme: "المظهر", switch: "English" }
    : { home: "Home", news: "News", history: "History", topics: "Topics", about: "About", search: "Search", theme: "Theme", switch: "العربية" };
  return <header className="site-header">
    <div className="utility-bar"><span>{locale === "ar" ? "الثلاثاء، ٤ أغسطس ٢٠٢٦" : "Tuesday, August 4, 2026"}</span><span className="utility-center">CAIRO · ALEXANDRIA · THE DIASPORA</span><span className="utility-status"><i /> {locale === "ar" ? "تغطية مستقلة" : "Independent coverage"}</span></div>
    <div className="brand-row page-wrap"><Link className="wordmark" href={localizedPath(locale)} aria-label={brand.name}><span className="wordmark-mark">N</span><span className="wordmark-name">{brand.logoText}</span></Link><nav className="main-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}><Link href={localizedPath(locale)}>{labels.home}</Link><Link href={localizedPath(locale, "/news")}>{labels.news}</Link><Link href={localizedPath(locale, "/history")}>{labels.history}</Link><Link href={localizedPath(locale, "/topics")}>{labels.topics}</Link><Link href={localizedPath(locale, "/about")}>{labels.about}</Link></nav><div className="header-actions"><Link className="search-link" href={localizedPath(locale, "/search")} aria-label={labels.search}>⌕ <span>{labels.search}</span></Link><ThemeToggle label={labels.theme} /><LanguageSwitch locale={locale} label={labels.switch} /></div></div>
  </header>;
}
