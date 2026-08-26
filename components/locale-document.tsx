"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export function LocaleDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    return () => {
      root.lang = previousLang;
      root.dir = previousDir;
    };
  }, [locale]);

  return null;
}
