# Gauntlet Loop Workbench — Nile Chronicle

Source of truth: `design.md`, `docs/production-status.md`, and the current repository.

| Work item | Status | Critic verdict | Iterations | Open findings |
|---|---|---|---:|---|
| Repository baseline and route inventory | PASS | PASS | 1 | lint has 4 existing migration warnings |
| Public bilingual routes and content states | PASS | PASS | 2 | 24 core + 44 dynamic routes returned 200 |
| Responsive geometry and RTL/LTR behavior | PASS* | PASS* | 1 | Browser screenshot evidence still unavailable in this pass |
| Forms, interaction states, and accessibility | PASS* | PASS* | 3 | Shared wipe treatment and accessible labels; browser interaction not automated |
| Integrated repo verification | PASS | PASS | 2 | lint/typecheck/test/build green |
| Final smoothing pass | PASS* | PASS* | 2 | Integrated route and artifact checks pass; visual comparison remains limited |

## Hard stops

- No production credentials, secret values, or private user data may be invented or committed.
- No public deployment, managed database provisioning, vendor spend, or irreversible mutation without explicit approval.
- Existing unrelated user changes remain in scope and must not be discarded.

## Evidence log

The orchestrator updates this file after every implementation and critic verdict.

### Iteration 1 — baseline

- `npm run lint`: exit 0; 4 warnings in `migrations/20260826_144755_initial_postgres_schema.ts`.
- `npm run typecheck`: exit 0.
- `npm test`: exit 0; 17/17 tests passed.
- `npm run build`: exit 0; 71 static pages generated and all public/admin/API routes compiled.
- Existing server on `http://localhost:3001`: `/en`, `/ar`, news, history, topics, search, contact, newsletter, register, and `/api/health` returned 200.
- `/en` rendered `dir="ltr"`, `/ar` rendered `dir="rtl"`; both included the skip link and brand markup.
- `/api/health` returned `{"status":"ok","service":"news-website",...}`.

### Blind critic 1 — baseline and route surface

**PASS for the criteria directly evidenced above.** No route or locale failure was found in the supplied artifacts. Responsive visual behavior, keyboard interaction, and production readiness remain separate gated items because this pass did not produce browser-level evidence.

### Iteration 2 — premium frontend finish

- Added a shared visual finish in `app/(site)/globals.css`: ruled paper depth, selection treatment, sticky desktop masthead, artwork texture, card lift/focus states, topic-link feedback, and mobile/reduced-motion safeguards.
- `git diff --check`: no whitespace errors.
- Route matrix: all 16 tested `/en` and `/ar` public routes returned 200.
- Locale contract: `/en` contains `dir="ltr"`; `/ar` contains `dir="rtl"`; both include the skip link.
- `npm run lint`: exit 0; 4 pre-existing migration warnings.
- `npm run typecheck`: exit 0.
- `npm test`: exit 0; 19/19 tests passed.
- `npm run build`: exit 0; 71 static pages generated.

### Blind critic 2 — premium finish

**PASS*** for all criteria with direct command or route evidence. The asterisk records one unresolved evidence limitation: no browser screenshot/DOM geometry harness is installed in this repository, so visual comparison and exact overflow measurements are not claimed as proven.

### Iteration 3 — full application audit

- Core matrix: 24 routes pass, including locale pages, forms, admin entry, health, robots, and sitemap.
- Dynamic matrix: 44 routes pass across 6 stories, 5 topics, and 5 authors in both locales.
- Control inventory: navigation links, carousel controls, theme toggle, forms, error actions, admin actions, and media upload controls were inspected for visible labels or accessible names.
- Fixed: search submit accessible name, Arabic register eyebrow, malformed admin separator, and explicit LTR direction for email input.
- Final `npm run lint`: exit 0 with 4 existing migration warnings.
- Final `npm run typecheck`: exit 0.
- Final `npm test`: exit 0; 19/19 tests passed.
- Final `npm run build`: exit 0; 71 static pages generated.

### Iteration 4 — exact button interaction pass

- Replaced the earlier generic transform sweep with the requested two-half wipe pattern: opposing `::before`/`::after` layers and a `.button-line` that expands from 6px to the available action width.
- Applied to shared form buttons and explicitly to CTA links, error retry, theme toggle, and carousel navigation/pause controls.
- Preserved the Nile Chronicle palette: vermilion accent surface, deep ink sweep, warm paper text, and strong focus/hover contrast.
- Added `.button-label`/`.button-line` structure to the shared `Button` component and raw controls where pseudo-element layering needs stable content order.
- Final verification: lint exit 0 with 4 existing migration warnings; typecheck exit 0; tests 20/20; build exit 0; `git diff --check` has no whitespace errors.

### Blind critic 3 — exact interaction pattern

**PASS***. The supplied code pattern is now represented directly in the shared CSS and control markup. The remaining asterisk is only for live pixel comparison and pointer interaction capture inside the browser.

### Iteration 5 — interactive CTA component

- Added `components/interactive-button-link.tsx` with CSS custom properties and Tailwind-compatible class names.
- The component includes animated dots, drawn border, grid overlay, arrow motion, hover/focus/active states, and mobile/reduced-motion fallbacks.
- Applied to the hero story CTA, history CTA, and newsletter CTA.
- Gauntlet retry after a type contract failure: wrapper now accepts standard anchor attributes including `tabIndex`.
- Final gates: typecheck exit 0, lint exit 0 with 4 pre-existing migration warnings, tests 20/20, build exit 0.

### Iteration 6 — reference animation correction

- Reworked the CTA component to mirror the supplied reference structure: four corner dots, four animated border lines, diagonal grid overlay, staggered timing, and smooth scale/letter-spacing transitions.
- Kept the interaction valid and accessible by using a real anchor with nested spans instead of nesting a button inside an anchor.
- Final gates: typecheck exit 0, lint exit 0 with 4 pre-existing migration warnings, tests 20/20, build exit 0.

### Iteration 7 — live-browser CTA repair

- Live inspection on `http://localhost:3000/en` reproduced the defect: the newsletter CTA expanded from roughly 184px to more than 426px on hover because the legacy `.button-filled` wipe rules leaked into the interactive anchor.
- Removed the legacy variant classes from the interactive component call sites and replaced them with isolated `interactive-button--primary` and `interactive-button--outline` variants.
- Added a final authority layer that locks compact geometry and makes the four-dot, drawn-border, grid-overlay, arrow, focus, active, mobile, and reduced-motion states reversible and independent of the older button system.
- Browser evidence now covers normal and hover states for the hero CTA, newsletter CTA, outline history CTA, and header theme control. No CTA changes section width or overflows its component boundary.
- Final gates: typecheck exit 0; lint exit 0 with 4 pre-existing migration warnings; tests 20/20; production build exit 0 with 71 generated static pages.

### Blind critic 4 — live pointer interaction

**PASS.** The previously unproven browser criterion is now directly evidenced in the running application: the problem was reproduced, the cascade source was measured from the live DOM, and all three interactive CTA variants were rechecked after the repair.

### Iteration 8 — supplied amber edge button replacement

- Replaced the dots/grid CTA markup with a direct semantic adaptation of the supplied reference: transparent surface, solid neutral border, amber dashed offset frame, `-2px/-2px` hover movement, lower-right corner detail, uppercase label, and arrow motion.
- Link actions remain real Next.js anchors; form/error actions remain real buttons. The same visual system now covers hero/history/newsletter links, shared form submits, retry actions, search, theme toggle, and carousel navigation controls.
- Removed legacy interactive class names from live call sites so the previous animation cascade cannot alter the new component.
- Live browser comparison passed for CTA rest/hover, full-width contact submit rest/hover, and compact header control hover.
- Final gates: typecheck exit 0 after the build completed; lint exit 0 with 4 pre-existing migration warnings; tests 20/20; production build exit 0 with 71 generated static pages; diff check has no whitespace errors.

### Iteration 9 — label-slide arrow reveal

- Replaced the edge-button hover motion with the requested interaction: the label translates left by 8px while the arrow starts hidden 13px to the right and enters at the same time.
- Both CTA anchors and shared form buttons use the same 300ms cubic-bezier transition; the arrow is absolutely positioned so the button width never changes.
- Added RTL mirroring and preserved keyboard focus, active press, disabled, and reduced-motion behavior.
- Live browser evidence confirms the newsletter CTA rest state hides the arrow and hover state reveals it without layout shift; the same button system remains active on contact submit and compact header controls.
- Final gates: lint exit 0 with 4 pre-existing migration warnings; tests 20/20; typecheck exit 0; production build exit 0 with 71 generated static pages; diff check has no whitespace errors.

### Iteration 10 — smoothness correction

- Browser feedback showed the first label/arrow motion felt too abrupt even though the transition existed.
- Increased the visual travel and softened the timing: label `-12px`, arrow `18px` entry, `420ms` symmetric cubic-bezier easing, with `will-change` on transform/opacity.
- Kept the arrow absolutely positioned, so the slower motion still causes no layout shift; RTL and reduced-motion overrides remain active.
- Production build passed after the correction and generated all 71 pages successfully.
