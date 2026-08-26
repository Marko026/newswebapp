import type { Metadata } from "next";
import { defaultLocale, localeConfig, locales, type Locale, localizedPath } from "@/lib/i18n";

const SITE_NAME = "Nile Chronicle";

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
    }
    return new URL("http://localhost:3000");
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL");
  }
  if (!/^https?:$/.test(url.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https");
  }
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url;
}

export function absoluteUrl(path = "") {
  const url = new URL(path.replace(/^\/+/, ""), `${getSiteUrl().toString().replace(/\/$/, "")}/`);
  return url.toString();
}

export function localizedAlternates(path = "") {
  return Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
  ) as Record<Locale, string>;
}

export function localizedMetadata(
  locale: Locale,
  options: {
    title: string;
    description?: string;
    path?: string;
    image?: string;
    noIndex?: boolean;
  },
): Metadata {
  const path = options.path ?? "";
  const description = options.description ?? localeText(locale).description;
  const title = options.title;
  const canonical = absoluteUrl(localizedPath(locale, path));
  const images = options.image ? [{ url: absoluteUrl(options.image), alt: title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical, languages: localizedAlternates(path) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: localeConfig[locale].lang,
      alternateLocale: locales.filter((item) => item !== locale).map((item) => localeConfig[item].lang),
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
    robots: options.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function localeText(locale: Locale) {
  return locale === "ar"
    ? { description: "أخبار مستقلة وتاريخ وسياق من مصر والعالم." }
    : { description: "Independent news, history, and context from Egypt and the world." };
}

export function siteMetadata(): Metadata {
  const title = SITE_NAME;
  const description = localeText(defaultLocale).description;
  return {
    metadataBase: getSiteUrl(),
    title: { default: title, template: `%s | ${title}` },
    description,
    alternates: { canonical: absoluteUrl(localizedPath(defaultLocale)) },
    openGraph: { type: "website", siteName: SITE_NAME, title, description },
  };
}

export { SITE_NAME };
