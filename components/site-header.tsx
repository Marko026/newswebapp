import Link from "next/link";
import { brand } from "@/lib/brand";
import { localizedPath, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { ThemeToggle } from "./theme-toggle";
import { SiteMenu } from "./site-menu";
import { SiteNav } from "./site-nav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const labels = locale === "ar"
    ? { home: "الرئيسية", news: "الأخبار", history: "التاريخ", topics: "المواضيع", about: "عن الموقع", search: "بحث", theme: "المظهر", switch: "English" }
    : { home: "Home", news: "News", history: "History", topics: "Topics", about: "About", search: "Search", theme: "Theme", switch: "العربية" };
  const menuItems = [{ href: "", label: labels.home }, { href: "/news", label: labels.news }, { href: "/history", label: labels.history }, { href: "/topics", label: labels.topics }, { href: "/about", label: labels.about }];
  return <header className="site-header">
    <div className="utility-bar"><span>{locale === "ar" ? "من القاهرة" : "From Cairo"}</span><span className="utility-center">CAIRO · ALEXANDRIA · THE DIASPORA</span><span className="utility-status"><i /> {locale === "ar" ? "تغطية مستقلة" : "Independent coverage"}</span></div>
    <div className="brand-row page-wrap"><Link className="wordmark" href={localizedPath(locale)} aria-label={brand.name}><span className="wordmark-mark">N</span><span className="wordmark-name">{brand.logoText}</span></Link><SiteNav locale={locale} items={menuItems} label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"} /><div className="header-actions"><Link className="search-link" href={localizedPath(locale, "/search")} aria-label={labels.search}>⌕ <span>{labels.search}</span></Link><ThemeToggle label={labels.theme} /><LanguageSwitch locale={locale} label={labels.switch} /><SiteMenu locale={locale} items={menuItems} label={locale === "ar" ? "فتح القائمة" : "Open menu"} /></div></div>
  </header>;
}
