import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const scriptSources = ["'self'", "'unsafe-inline'", ...(process.env.NODE_ENV === "production" ? [] : ["'unsafe-eval'"])].join(" ");
const mediaSources = ["'self'", "data:"];
if (process.env.NEXT_PUBLIC_MEDIA_ORIGIN) {
  const mediaOrigin = new URL(process.env.NEXT_PUBLIC_MEDIA_ORIGIN);
  if (!/^https?:$/.test(mediaOrigin.protocol)) throw new Error("NEXT_PUBLIC_MEDIA_ORIGIN must use http or https");
  mediaSources.push(mediaOrigin.origin);
}
if (process.env.CLOUDINARY_CLOUD_NAME) mediaSources.push("https://res.cloudinary.com");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Content-Security-Policy", value: `default-src 'self'; img-src ${mediaSources.join(" ")}; media-src ${mediaSources.join(" ")}; style-src 'self' 'unsafe-inline'; script-src ${scriptSources}; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` },
];

if (process.env.NODE_ENV === "production") securityHeaders.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 70, 75, 80, 90, 100],
    minimumCacheTTL: 2_678_400,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withPayload(nextConfig);
