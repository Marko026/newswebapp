import { NewsletterForm } from "@/components/newsletter-form";
import { requireLocale } from "@/lib/i18n";
import { ui } from "@/lib/content";

export default async function NewsletterPage({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); return <main className="page-wrap subpage"><div className="subpage-heading"><p className="eyebrow">{ui[locale].newsletter}</p><h1>{locale === "ar" ? "قصص تستحق وقتك" : "Stories worth your time"}</h1><p className="subpage-lede">{locale === "ar" ? "رسالة أسبوعية قصيرة من هيئة التحرير، بدون ضجيج." : "A short weekly note from the editorial desk, without the noise."}</p></div><NewsletterForm locale={locale} /></main>; }
