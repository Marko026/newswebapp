import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isLocale, localeConfig, type Locale } from "@/lib/i18n";
import { siteMetadata } from "@/lib/seo";
import "./tokens.css";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = siteMetadata();

// The site route group still owns `/` as a redirect while localized pages live
// below `[locale]`. Reading the matched request path lets the root document
// render the correct language and direction on the first response (the client
// LocaleDocument is retained only as a navigation fallback).
export const dynamic = "force-dynamic";

async function requestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const candidates = [
    requestHeaders.get("x-site-locale"),
    requestHeaders.get("x-next-url"),
    requestHeaders.get("next-url"),
    requestHeaders.get("x-invoke-path"),
    requestHeaders.get("x-matched-path"),
    requestHeaders.get("referer"),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const pathname = new URL(candidate, "http://localhost").pathname;
      const segment = pathname.split("/")[1];
      if (isLocale(segment)) return segment;
    } catch {
      // Ignore malformed proxy headers and use the stable default below.
    }
  }
  return defaultLocale;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await requestLocale();
  const config = localeConfig[locale];

  return (
    <html lang={config.lang} dir={config.dir} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {"document.documentElement.dataset.theme=localStorage.getItem('theme')||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light')"}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
