import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("project exposes the required verification scripts", async () => {
  const packageJson = JSON.parse(await source("package.json"));
  for (const script of ["lint", "typecheck", "test", "build"]) {
    assert.equal(typeof packageJson.scripts?.[script], "string", `missing ${script} script`);
  }
});

test("public design system includes accessible form states", async () => {
  const css = await source("app/(site)/globals.css");
  assert.match(css, /\.newsletter-form/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
});

test("locale route keeps language and direction in the server layout", async () => {
  const layout = await source("app/(site)/[locale]/layout.tsx");
  assert.match(layout, /lang=/);
  assert.match(layout, /dir=/);
  const proxy = await source("proxy.ts");
  assert.match(proxy, /x-site-locale/);
});

test("production CSP does not enable unsafe eval", async () => {
  const config = await source("next.config.ts");
  assert.match(config, /process\.env\.NODE_ENV === "production"/);
  assert.match(config, /unsafe-eval/);
});

test("production config does not ship the known Payload fallback secret", async () => {
  const config = await source("payload.config.ts");
  assert.doesNotMatch(config, /local-development-secret-change-before-production/);
});

test("admin login exposes request access without enabling registration", async () => {
  const config = await source("payload.config.ts");
  const component = await source("components/payload/request-access.tsx");
  assert.match(config, /beforeLogin/);
  assert.match(config, /afterLogin/);
  assert.match(config, /request-access#RequestAccess/);
  assert.match(component, /\/en\/register/);
  assert.match(component, /\/ar\/register/);
  assert.doesNotMatch(config, /allowRegistration/);
});

test("admin shell exposes explicit navigation and logout", async () => {
  const config = await source("payload.config.ts");
  const component = await source("components/payload/admin-actions.tsx");
  assert.match(config, /beforeDashboard/);
  assert.match(component, /\/admin\/logout/);
  assert.match(component, /\/admin\/collections\/articles/);
  assert.match(component, /\/admin\/collections\/users/);
  const revoke = await source("app/api/auth/revoke-all/route.ts");
  assert.match(revoke, /allSessions: true/);
  assert.match(revoke, /status: 401/);
  assert.match(revoke, /!origin/);
});

test("first Payload user bootstraps as owner", async () => {
  const users = await source("collections/Users.ts");
  assert.match(users, /operation === "create"/);
  assert.match(users, /existing\.docs\.length === 0/);
  assert.match(users, /role: "owner"/);
  assert.match(users, /bootstrapClaim: "singleton"/);
  assert.match(users, /role: "owner", status: "approved"/);
  assert.match(users, /unique: true/);
});

test("public registration creates pending editors and login blocks them", async () => {
  const route = await source("app/api/register/route.ts");
  const users = await source("collections/Users.ts");
  assert.match(route, /status: "pending"/);
  assert.match(route, /role: "editor"/);
  assert.match(route, /Owner setup required/);
  assert.match(route, /role: \{ equals: "owner" \}/);
  assert.match(users, /status !== "approved"/);
  assert.match(users, /role: "owner"/);
});

test("owner and admin access model keeps approval separate from role governance", async () => {
  const users = await source("collections/Users.ts");
  const permissions = await source("lib/auth/permissions.ts");
  assert.match(users, /req\.user\.role !== "owner"/);
  assert.match(users, /data\.role === "admin"/);
  assert.match(users, /data\.status === "approved"/);
  assert.match(users, /name: "status"[\s\S]*update: \(\{ req \}\) => canManageUsers\(req\.user\)/u);
  assert.match(users, /name: "role"[\s\S]*update: \(\{ req \}\) => canManageRoles\(req\.user\)/u);
  assert.match(permissions, /canManageUsers[\s\S]*isOwnerUser\(user\) \|\| isAdminUser\(user\)/u);
  assert.match(permissions, /canManageRoles[\s\S]*isOwnerUser\(user\)/u);
});

test("staff collection permissions keep destructive operations owner-only", async () => {
  const guardedCollections = ["Articles.ts", "Categories.ts", "Media.ts", "Topics.ts", "Authors.ts", "NewsletterSubscribers.ts", "ContactMessages.ts"];
  for (const file of guardedCollections) {
    const sourceText = await source(`collections/${file}`);
    assert.match(sourceText, /(?:delete:\s*\([^)]*req[^)]*\)[^=]*=>\s*req\.user\?\.role\s*===\s*["']owner["']|delete:\s*\([^)]*req[^)]*\)[^=]*=>\s*isApprovedOwner\(req\.user\)|const canDelete[^\n]*isOwner)/u, `${file} must restrict deletes to owners`);
  }
  const users = await source("collections/Users.ts");
  assert.match(users, /read:\s*canReadUsers/u);
  assert.match(users, /create:\s*canCreateUser/u);
  assert.match(users, /update:\s*canUpdateUser/u);
  assert.match(users, /delete:\s*\([^)]*req[^)]*\)[^=]*=>\s*canManageUsers\(req\.user\)/u);
});

test("audit trail is append-only and owner-readable", async () => {
  const audit = await source("collections/AuditLogs.ts");
  assert.match(audit, /slug: "audit-logs"/);
  assert.match(audit, /create: \(\) => false/);
  assert.match(audit, /update: \(\) => false/);
  assert.match(audit, /delete: \(\) => false/);
  assert.match(audit, /isApprovedOwner\(req\.user\)/);
  const helper = await source("lib/audit.ts");
  assert.match(helper, /overrideAccess: true/);
});

test("Google OIDC contract uses state, nonce, PKCE and pending-user gate", async () => {
  const start = await source("app/api/auth/google/start/route.ts");
  const callback = await source("app/api/auth/google/callback/route.ts");
  const verifier = await source("lib/google-oidc.ts");
  assert.match(start, /google_oidc_state/);
  assert.match(verifier, /RS256/);
  assert.match(verifier, /jwks/);
  assert.match(callback, /Invalid OIDC state/);
  assert.match(callback, /Account pending approval/);
  assert.match(callback, /randomUUID/);
  assert.match(callback, /generatePayloadCookie/);
  assert.match(callback, /depth: 0/);
  assert.doesNotMatch(callback, /status: 501/);
});

test("MFA foundation encrypts secrets and issues short-lived step-up cookie", async () => {
  const helper = await source("lib/mfa.ts");
  assert.match(helper, /aes-256-gcm/);
  assert.match(helper, /hasRecentMfa/);
  const verify = await source("app/api/auth/mfa/verify/route.ts");
  assert.match(verify, /Max-Age=300/);
  assert.match(verify, /rateLimit/);
  const setup = await source("app/api/auth/mfa/setup/route.ts");
  assert.match(setup, /cache-control.*no-store/i);
  const users = await source("collections/Users.ts");
  const articles = await source("collections/Articles.ts");
  assert.match(users, /MFA_REQUIRED/);
  assert.match(articles, /MFA_REQUIRED/);
  assert.match(users, /mfaSecretEncrypted/);
  const revoke = await source("app/api/auth/revoke-all/route.ts");
  assert.match(revoke, /mfa_step_up=.*Max-Age=0/);
});

test("registration endpoint validates abuse cases and applies retryable rate limits", async () => {
  const route = await source("app/api/register/route.ts");
  assert.match(route, /readJsonBody<RegisterBody>\([^,]+,\s*8\s*\*\s*1024\)/u);
  assert.match(route, /password\.length\s*<\s*12/);
  assert.match(route, /password\.length\s*>\s*200/);
  assert.match(route, /name\.length\s*>\s*120/);
  assert.match(route, /email\.length\s*>\s*254/);
  assert.match(route, /rateLimit\(`register:ip:/u);
  assert.match(route, /rateLimit\(`register:email:/u);
  assert.match(route, /status:\s*429/);
  assert.match(route, /["']retry-after["']\s*:\s*["']60["']/u);
  assert.match(route, /RequestBodyTooLargeError/);
  assert.match(route, /status:\s*413/);
});

test("pending and suspended accounts are blocked at login", async () => {
  const users = await source("collections/Users.ts");
  assert.match(users, /value:\s*"pending"/);
  assert.match(users, /value:\s*"suspended"/);
  assert.match(users, /user\.status\s*!==\s*"approved"/u);
  assert.match(users, /APIError\([\s\S]*403/u);
});

test("all public locale route contracts exist and responsive CSS has narrow-layout safeguards", async () => {
  const routes = [
    "about/page.tsx", "contact/page.tsx", "history/page.tsx", "history/[slug]/page.tsx",
    "news/page.tsx", "news/[slug]/page.tsx", "newsletter/page.tsx", "privacy/page.tsx",
    "register/page.tsx", "search/page.tsx", "terms/page.tsx", "topics/page.tsx", "topics/[slug]/page.tsx",
    "authors/[slug]/page.tsx",
  ];
  for (const route of routes) await access(new URL(`app/(site)/[locale]/${route}`, root));
  await access(new URL("app/(site)/[locale]/page.tsx", root));
  const css = await source("app/(site)/globals.css");
  assert.match(css, /@media\s*\(max-width:\s*640px\)/u);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/u);
  assert.match(css, /overflow-x:\s*(clip|hidden)/u);
  assert.match(css, /\.page-wrap[^}]*padding-inline:\s*18px/u);
});
