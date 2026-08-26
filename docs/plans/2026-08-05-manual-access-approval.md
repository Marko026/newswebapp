# Plan: Manual admin access approval

Date: 2026-08-05
Status: superseded

This plan is retained as historical context only. The implemented design moved
from a separate access-request collection to pending authenticated users with
owner approval, because that gives the owner one auditable account lifecycle
and prevents an approved request from requiring a second manual account
creation step. See `docs/plans/2026-08-06-editorial-security-hardening.md` for
the active plan and remaining production gates.

## What we are building

The admin login will expose a safe "Request access" path instead of public user registration. A visitor can submit an access request, but only an existing owner can review it and approve or reject it. The first version deliberately keeps account creation manual: after approval, the owner creates an editor account in Payload admin and shares onboarding instructions.

## Vocabulary

- Access request: a public request for editorial/admin access; it is not an account and cannot log in.
- Owner: the only role allowed to read, approve, reject, or delete access requests.
- Editor: the normal approved newsroom user role; public applicants cannot request owner privileges.
- Manual approval: owner reviews the request and creates the user separately in the admin UI.

## Decisions (and why)

- Use a separate `access-requests` collection instead of creating pending auth users: this keeps unapproved people outside the login system and avoids password/reset edge cases.
- Add a visible request link near admin login, but keep the request form on a public localized site route: Payload's built-in login remains stable and the flow is easy to discover.
- Permit only `editor` as the requested role: owner elevation must remain an explicit owner-only admin action.
- Make approval state owner-controlled (`pending`, `approved`, `rejected`): this gives the owner an audit trail without requiring email infrastructure in the first release.
- Reuse the existing body limits, email validation, rate limiter, and trusted-proxy behavior: the new public endpoint must meet the security baseline already used by contact/newsletter.

## Assumptions

- An owner account already exists and can access Payload admin.
- Manual onboarding is acceptable for the first release; automatic email invitations are a later phase.
- Existing `editor` and `owner` users remain active and are not migrated out of the current auth collection.
- The public request form does not accept passwords or owner role requests.

## Steps

1. Add the access request collection, fields, indexes, and owner-only access rules.
2. Add a localized public request page and a rate-limited API endpoint with duplicate-pending handling.
3. Add a request-access link to the admin/login experience without enabling anonymous `users` creation.
4. Add contract/unit coverage for anonymous boundaries, owner approval permissions, validation, rate limits, and localized rendering.
5. Run lint, typecheck, tests, build, and a manual browser/API smoke check.
6. Document the manual owner workflow and leave automatic invite/email as a separate follow-up.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Verify anonymous `POST /api/access-request` can create only a pending request.
- Verify anonymous Payload `POST /api/users` remains denied.
- Verify editor cannot read or update access requests.
- Verify owner can review and change request status.
- Verify `/ar/request-access` and `/en/request-access` have correct direction and labels.

## DOX files we touch

- `AGENTS.md`

## Changes during build

<!-- Append-only. The plan is never rewritten retroactively. -->

- 2026-08-05: Implemented the first release as a separate `access-requests` collection with manual owner approval and owner-created editor accounts; automatic email invites remain a follow-up.
- 2026-08-06: Superseded by the pending-user approval model. No `access-requests` collection is part of the current implementation.
