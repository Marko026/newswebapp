import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLocale, defaultLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1];
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", isLocale(locale) ? locale : defaultLocale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
