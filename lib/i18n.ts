import { notFound } from "next/navigation";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeConfig: Record<Locale, {
  dir: "rtl" | "ltr";
  lang: Locale;
  label: string;
  nativeLabel: string;
  other: Locale;
}> = {
  ar: { dir: "rtl", lang: "ar", label: "Arabic", nativeLabel: "العربية", other: "en" },
  en: { dir: "ltr", lang: "en", label: "English", nativeLabel: "English", other: "ar" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function requireLocale(value: unknown): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

/** Build an internal localized URL while preserving a leading slash. */
export function localizedPath(locale: Locale, path = "") {
  const normalized = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${normalized}`;
}

export function replaceLocale(pathname: string, locale: Locale) {
  const path = pathname || "/";
  const segments = path.split("/");
  if (isLocale(segments[1])) segments[1] = locale;
  else segments.splice(1, 0, locale);
  const result = segments.join("/");
  return result || `/${locale}`;
}

export const localeText = {
  en: {
    description: "Independent news, history, and context from Egypt and the world.",
    home: "Home",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you requested does not exist or has moved.",
    backHome: "Back to the home page",
    errorTitle: "We could not load this page",
    errorBody: "Please try again. Published stories remain safe.",
    retry: "Try again",
  },
  ar: {
    description: "أخبار مستقلة وتاريخ وسياق من مصر والعالم.",
    home: "الرئيسية",
    notFoundTitle: "الصفحة غير موجودة",
    notFoundBody: "الصفحة التي طلبتها غير موجودة أو ربما نُقلت.",
    backHome: "العودة إلى الصفحة الرئيسية",
    errorTitle: "تعذر تحميل الصفحة",
    errorBody: "يرجى المحاولة مرة أخرى. تظل القصص المنشورة محفوظة.",
    retry: "حاول مرة أخرى",
  },
} as const;
