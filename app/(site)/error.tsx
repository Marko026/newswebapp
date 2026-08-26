"use client";

import { usePathname } from "next/navigation";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isArabic = (usePathname() || "").split("/")[1] === "ar";
  return <main className="error-page" lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}><p className="eyebrow">NILE CHRONICLE</p><h1>{isArabic ? "تعذر تحميل الصفحة" : "We could not load this page"}</h1><p>{isArabic ? "يرجى المحاولة مرة أخرى. تظل القصص المنشورة محفوظة." : "Please try again. Published stories remain safe."}</p><button onClick={() => reset()}>{isArabic ? "حاول مرة أخرى" : "Try again"}</button></main>;
}
