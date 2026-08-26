import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { Articles } from "./collections/Articles";
import { AuditLogs } from "./collections/AuditLogs";
import { GoogleIdentities } from "./collections/GoogleIdentities";
import { ArticleTranslations } from "./collections/ArticleTranslations";
import { Authors } from "./collections/Authors";
import { Categories } from "./collections/Categories";
import { ContactMessages } from "./collections/ContactMessages";
import { Media } from "./collections/Media";
import { NewsletterSubscribers } from "./collections/NewsletterSubscribers";
import { Topics } from "./collections/Topics";
import { Users } from "./collections/Users";
import { assertRuntimeEnvironment } from "./lib/env";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
assertRuntimeEnvironment();
const payloadSecret = process.env.PAYLOAD_SECRET ?? "local-only-payload-secret-for-development";
const databaseDriver = process.env.DB_DRIVER ?? (process.env.NODE_ENV === "production" && process.env.DATABASE_URL ? "postgres" : "sqlite");
const s3Bucket = process.env.S3_BUCKET?.trim();
const s3Endpoint = process.env.S3_ENDPOINT?.trim();

if (s3Bucket && !s3Endpoint) {
  throw new Error("S3_BUCKET requires S3_ENDPOINT so Payload can generate public media URLs.");
}

if (databaseDriver === "postgres" && !process.env.DATABASE_URL) {
  throw new Error("DB_DRIVER=postgres requires DATABASE_URL to be configured.");
}

const database = databaseDriver === "postgres"
  ? postgresAdapter({
      pool: { connectionString: process.env.DATABASE_URL },
      prodMigrations: migrations,
    })
  : sqliteAdapter({
      client: { url: process.env.SQLITE_DATABASE_URL || "file:./payload.db" },
      wal: true,
      busyTimeout: 5000,
    });

export default buildConfig({
  // Normalize owner records created before the status field existed. This is
  // deliberately idempotent and runs before the admin is served, so legacy
  // owners can open drafts and article permissions stay consistent.
  onInit: async (payload) => {
    const legacyOwners = await payload.find({ collection: "users", where: { and: [{ role: { equals: "owner" } }, { status: { exists: false } }] }, limit: 100, pagination: false, overrideAccess: true });
    for (const owner of legacyOwners.docs) {
      await payload.update({ collection: "users", id: owner.id, data: { status: "approved" }, overrideAccess: true, context: { legacyOwnerMigration: true } });
    }
  },
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    components: {
      beforeLogin: ["@/components/payload/request-access#RequestAccess"],
      afterLogin: ["@/components/payload/request-access#RequestAccess"],
      beforeDashboard: ["@/components/payload/admin-actions#AdminActions"],
    },
    meta: { titleSuffix: " — Nile Chronicle" },
  },
  collections: [Users, Articles, ArticleTranslations, Categories, Topics, Authors, Media, NewsletterSubscribers, ContactMessages, AuditLogs, GoogleIdentities],
  editor: lexicalEditor(),
  localization: { locales: [{ code: "ar", label: "العربية", rtl: true }, { code: "en", label: "English" }], defaultLocale: "ar", fallback: true },
  secret: payloadSecret,
  db: database,
  plugins: [s3Storage({ enabled: Boolean(s3Bucket), bucket: s3Bucket || "local-disabled", collections: { media: { prefix: "news-media" } }, config: { region: process.env.S3_REGION || "auto", endpoint: s3Endpoint, forcePathStyle: Boolean(s3Endpoint), credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || "local-disabled", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "local-disabled" } } })],
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  graphQL: { disable: true },
});
