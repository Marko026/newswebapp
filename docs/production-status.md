# Production status

Updated: 2026-08-26

## Current gate

The application foundation is implemented, but the project is not ready for a
public production launch. The immediate target is a private Vercel staging
deployment backed by managed PostgreSQL, Upstash Redis, and durable S3/R2
media storage.

## Verified baseline

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm test` passes: 16 contract tests.
- `npm run build` passes on Next.js 16.3.0.
- The production server starts only with a valid production environment.
- `/api/health` is a liveness endpoint; `/api/health?ready=1` checks database and
  Redis readiness without exposing connection details.

## Known blockers

1. Production environment values are not provisioned: a real `PAYLOAD_SECRET`,
   `DB_DRIVER=postgres`, `DATABASE_URL`, and Upstash Redis credentials are
   required. Placeholder and incomplete values must never be deployed.
2. PostgreSQL schema initialization/migration and first-owner provisioning have
   not been proven on a clean managed database.
3. Browser E2E coverage is missing for authentication, editorial workflow,
   article rendering, forms, mobile layouts, and Arabic RTL behavior.
4. Cloudflare/WAF, backup/restore evidence, immutable audit export, monitoring,
   and a tested rollback path are not yet in place.
5. The repository needs a staging tag and a remote release workflow.

## Staging acceptance gate

Staging is accepted only when all of the following are true:

- `/ar`, `/en`, `/admin`, article routes, and forms return expected responses.
- A clean PostgreSQL database can create an owner and an approved editor.
- An article can move through draft, review, correction, approval, publish, and
  archive states with audit records.
- Media upload works from durable S3/R2 storage.
- Login, logout, session revocation, pending-user blocking, and optional MFA
  pass in a browser.
- Readiness checks prove the database and Redis are reachable.
- A backup restore reproduces login, content, publishing, and audit logs.
- The deployment can be rolled back to the previous known-good release.

## Evidence log

The detailed command output remains in the task handoff. Re-run the four local
verification commands after any release-affecting change and record staging
URL, commit, database migration result, E2E result, and restore result here.
