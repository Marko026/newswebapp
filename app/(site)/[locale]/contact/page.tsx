import { ContactForm } from "@/components/contact-form";
import { requireLocale } from "@/lib/i18n";
import { ui } from "@/lib/content";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].contact}</p><h1>{locale === "ar" ? "لديك قصة؟" : "Have a story?"}</h1><p className="subpage-lede">{locale === "ar" ? "نرحب بالرسائل والاقتراحات والتصحيحات." : "We welcome tips, suggestions, and corrections."}</p></div><ContactForm locale={locale} /></main>; }
