# Editorial security and newsroom workflow hardening

Status: application foundation implemented; deployment runbook and production gates remain for WAF, E2E and restore evidence.

## Implemented foundation

- Legacy owners are normalized to `approved` during Payload initialization.
- User permissions are role-aware (`owner`, `admin`, `editor`) and pending/suspended users cannot authenticate.
- Role/status transitions revoke persisted sessions; the last owner cannot be demoted, suspended, or deleted.
- Articles have assignment, review, correction, approval, publish, archive, soft-delete, preview-token and workflow audit fields.
- Audit logs are append-only and owner-readable; registration, public submissions, user mutations and article mutations emit events.
- Public collection mutations require approved staff and security headers include production HSTS.
- Session revocation requires an `Origin` header matching the configured site origin.
- Google OIDC now verifies state, nonce, PKCE and Google JWKS, requires an approved
  local account, persists the Payload session, and redirects to the admin shell.
- Public registration, contact, and newsletter limits use Upstash Redis REST in
  production; the in-process map remains a development-only fallback and
  production startup fails closed when Redis credentials are missing.
- Deployment controls and restore evidence are specified in
  `docs/production-security-runbook.md`.
- TOTP MFA setup, enablement, five-minute step-up cookies, and conditional
  enforcement for account governance and article publish/archive/delete are
  implemented when `MFA_REQUIRED=true`.

## Remaining production gates

1. Put `/admin` and Payload REST behind Cloudflare/WAF/bot protection.
2. Add browser E2E coverage for login/logout, article open/preview, approval and mobile/RTL layouts.
3. Add immutable external audit export and backup/restore drills.
4. Provision the first owner through a single private deployment transaction or
   database-level lock; the local bootstrap flag is intentionally not a
   multi-instance provisioning mechanism.
