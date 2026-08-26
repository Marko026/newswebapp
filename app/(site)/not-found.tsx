"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const isArabic = (usePathname() || "").split("/")[1] === "ar";
  return <main className="error-page" lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}><p className="eyebrow">404</p><h1>{isArabic ? "الصفحة غير موجودة" : "Page not found"}</h1><p>{isArabic ? "الصفحة التي طلبتها غير موجودة أو ربما نُقلت." : "The page you requested does not exist or has moved."}</p><Link href={isArabic ? "/ar" : "/en"}>{isArabic ? "العودة إلى الصفحة الرئيسية" : "Back to the home page"}</Link></main>;
}
