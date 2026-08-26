import Link from "next/link";
import { brand } from "@/lib/brand";
import { localizedPath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const labels = locale === "ar" ? { contact: "اتصل بنا", newsletter: "النشرة الإخبارية", privacy: "الخصوصية", terms: "الشروط", note: "أخبار وسياق من مصر والعالم" } : { contact: "Contact", newsletter: "Newsletter", privacy: "Privacy", terms: "Terms", note: "News and context from Egypt and the world" };
  return <footer className="site-footer"><div className="page-wrap footer-grid"><div><p className="footer-kicker">{brand.logoText}</p><p className="footer-note">{labels.note}</p></div><div className="footer-links"><Link href={localizedPath(locale, "/contact")}>{labels.contact}</Link><Link href={localizedPath(locale, "/newsletter")}>{labels.newsletter}</Link><Link href={localizedPath(locale, "/privacy")}>{labels.privacy}</Link><Link href={localizedPath(locale, "/terms")}>{labels.terms}</Link></div><div className="footer-meta"><span>AR · EN</span><span>© 2026 {brand.name}</span></div></div></footer>;
}
