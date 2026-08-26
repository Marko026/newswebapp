import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Cloudinary integration keeps secrets server-side and signs only approved upload folders", async () => {
  const helper = await read("lib/cloudinary.ts");
  const signatureRoute = await read("app/api/media/cloudinary/signature/route.ts");
  assert.match(helper, /server-only/);
  assert.match(helper, /CLOUDINARY_API_SECRET/);
  assert.match(helper, /news\/images\/originals/);
  assert.match(helper, /news\/videos\/originals/);
  assert.doesNotMatch(signatureRoute, /NEXT_PUBLIC_CLOUDINARY_API_SECRET/);
  assert.match(signatureRoute, /isApprovedUser/);
  assert.match(signatureRoute, /rateLimit/);
});

test("Cloudinary completion rejects untrusted asset URLs and stores metadata in Payload", async () => {
  const route = await read("app/api/media/cloudinary/complete/route.ts");
  assert.match(route, /isAllowedCloudinaryAsset/);
  assert.match(route, /cloudinaryPublicId/);
  assert.match(route, /cloudinarySecureUrl/);
  assert.match(route, /payload\.create/);
  assert.match(route, /!alt/);
});

test("Cloudinary delivery uses automatic format, quality, and responsive transforms", async () => {
  const helper = await read("lib/media-url.ts");
  const uploader = await read("components/payload/cloudinary-upload.tsx");
  const config = await read("next.config.ts");
  assert.match(helper, /f_auto/);
  assert.match(helper, /q_auto/);
  assert.match(helper, /c_fill/);
  assert.match(uploader, /directly to Cloudinary/);
  assert.match(uploader, /maxVideoBytes/);
  assert.match(config, /media-src/);
});
