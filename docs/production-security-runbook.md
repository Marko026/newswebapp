# Production security runbook

This runbook is the deployment-side part of the editorial security plan. The
application code cannot create a Cloudflare zone, managed PostgreSQL backup, or
restore drill by itself, so these checks are release gates.

## Required origin and secrets

- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- Set `PAYLOAD_SECRET` to a random value of at least 32 characters.
- Set `DB_DRIVER=postgres` and a managed `DATABASE_URL`.
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Set `MFA_ENCRYPTION_KEY` before enabling `MFA_REQUIRED=true`.
- Prvi nalog se kreira kroz Payload `/admin` i automatski postaje odobreni
  owner. Korisnike ne unositi ručno direktno u SQL bazu.

The repository contains the initial PostgreSQL migration. On deployment,
Payload applies pending migrations before serving the admin or API.

## Cloudflare/WAF policy

Put the origin behind Cloudflare and do not expose the origin IP publicly.

- Rate limit `POST /api/register` to 5 requests/minute/IP.
- Rate limit `POST /api/auth/*` to 10 requests/minute/IP, with a stricter rule
  for repeated login failures.
- Challenge or block requests with excessive `POST /api/contact` and
  `POST /api/newsletter` volume; application-level Redis limits remain enabled.
- Allow only the canonical site origin to reach the origin; restrict the admin
  path to newsroom VPN/identity-aware proxy where possible.
- Enable managed DDoS protection and bot management before launch.
- Forward the real client IP only after the proxy strips incoming spoofed
  `X-Forwarded-For`; then set `TRUST_PROXY=true`.

## Backup and restore gate

Before every public launch, record evidence for:

1. Managed PostgreSQL point-in-time recovery enabled.
2. Payload media bucket versioning/retention enabled.
3. A restore into an isolated database and media prefix.
4. Login, article read, owner approval, publish, and audit-log checks after restore.
5. Recovery time and recovery point results in the release record.

## Audit retention

Export the append-only `audit-logs` collection to write-once storage on a
scheduled basis. Do not use the application database as the only copy of
security evidence.
