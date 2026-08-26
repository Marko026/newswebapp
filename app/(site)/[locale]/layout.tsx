import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, localeConfig, isLocale, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LocaleDocument } from "@/components/locale-document";
import { localizedMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale;
  if (!isLocale(locale)) notFound();
  return localizedMetadata(locale, {
    title: locale === "ar" ? "نيل كرونيكل" : "Nile Chronicle",
    path: "",
  });
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const config = localeConfig[locale];

  return <div lang={config.lang} dir={config.dir} className={`locale-shell locale-${locale}`}><LocaleDocument locale={locale as Locale} /><a className="skip-link" href="#main-content">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a><SiteHeader locale={locale as Locale} /><div id="main-content">{children}</div><SiteFooter locale={locale as Locale} /></div>;
}
