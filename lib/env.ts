/**
 * Validate environment variables that are required by a running production
 * server. During `next build`, Next imports the Payload config before runtime
 * environment variables are available, so validation is deferred until the
 * production server starts. Local development intentionally supports SQLite.
 */
export function assertRuntimeEnvironment() {
  const isProductionRuntime = process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build";
  if (!isProductionRuntime) return;

  const missing: string[] = [];
  const payloadSecret = process.env.PAYLOAD_SECRET;
  const isPlaceholderSecret = !payloadSecret || payloadSecret === "local-development-secret-change-before-production" || payloadSecret === "replace-with-a-long-random-secret" || payloadSecret === "local-only-payload-secret-for-development";
  if (!payloadSecret || isPlaceholderSecret || payloadSecret.length < 32) missing.push("PAYLOAD_SECRET (a non-placeholder value of at least 32 characters)");
  if (!process.env.NEXT_PUBLIC_SITE_URL) missing.push("NEXT_PUBLIC_SITE_URL");
  if (process.env.DB_DRIVER !== "postgres") missing.push("DB_DRIVER=postgres");
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.UPSTASH_REDIS_REST_URL) missing.push("UPSTASH_REDIS_REST_URL");
  if (!process.env.UPSTASH_REDIS_REST_TOKEN) missing.push("UPSTASH_REDIS_REST_TOKEN");
  if (process.env.MFA_REQUIRED === "true" && (!process.env.MFA_ENCRYPTION_KEY || process.env.MFA_ENCRYPTION_KEY.length < 32)) missing.push("MFA_ENCRYPTION_KEY (at least 32 characters when MFA_REQUIRED=true)");
  const cloudinaryValues = [process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET, process.env.CLOUDINARY_IMAGE_UPLOAD_PRESET, process.env.CLOUDINARY_VIDEO_UPLOAD_PRESET];
  if (cloudinaryValues.some((value) => !value?.trim())) missing.push("Cloudinary credentials and image/video upload presets");

  if (missing.length > 0) {
    throw new Error(`Production environment is not configured: ${missing.join(", ")}`);
  }
}
