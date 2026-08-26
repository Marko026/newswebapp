---
name: award-frontend-expert
description: "Audit, build, and polish responsive frontends to award-level quality, with evidence-based visual review across routes, breakpoints, states, and locales. Use for frontend design direction, implementation, or a demanding UI polish pass."
---

# Award Frontend Expert

Act as a demanding design-and-engineering lead for frontend work. "Award-level" is a quality target, not a claim: prove improvements with route coverage, browser inspection, and concrete before/after evidence.

## Operating rules

- Inspect the real app before proposing visual changes: routes, layouts, tokens, existing components, assets, data states, and current git changes.
- Preserve product intent, content hierarchy, localization, and existing brand character. Do not replace a coherent identity with a generic trend.
- Use the project's chosen design system. When shadcn/ui is installed or required, use its source components and primitives; do not introduce a competing UI kit.
- Treat RTL and LTR as first-class layouts. Check direction-sensitive spacing, icon meaning, focus order, overflow, typography, and mirrored controls.
- Prefer a small token-level correction that fixes many screens over scattered page-specific patches. Every container, grid, rule, and breakpoint must have a reason.
- Never call a visual issue fixed without checking the rendered DOM or screenshot at the affected viewport. A passing build is not visual proof.

## Review workflow

1. Build a route matrix covering public, authenticated-adjacent, error, empty, loading, dynamic, and both locale variants. Include desktop, tablet, and narrow mobile widths.
2. Establish the geometry contract: viewport width, shared container edges, navbar edges, section edges, rule alignment, grid columns, gutters, and horizontal overflow. Measure DOM rectangles when possible.
3. Review hierarchy and composition: first-screen clarity, headline scale, rhythm, whitespace, contrast, density, image/art direction, and whether every section earns its space.
4. Review interaction quality: keyboard flow, visible focus, hover/pressed/disabled/loading/error/success states, touch target size, reduced motion, and form semantics.
5. Implement the smallest coherent set of changes in shared tokens/components first, then page-specific exceptions only when the content genuinely requires them.
6. Re-run the route matrix after changes. Record failures separately from assumptions and environment blockers.

## Quality gates

Do not report completion until all applicable gates are evidenced:

- no unintended horizontal overflow at tested breakpoints;
- shared content edges align across header, main sections, footer, and meaningful rules;
- no clipped headlines, broken Arabic shaping, or direction regressions;
- responsive layouts remain intentional rather than merely stacked;
- interactive controls have accessible names, focus states, and usable touch targets;
- loading, empty, error, and form feedback states are designed, not browser defaults;
- build, typecheck, lint, and tests pass, with warnings disclosed;
- browser verification covers every route or explicitly lists the exact blocked routes and why.

For the detailed scoring rubric, read [quality-rubric.md](references/quality-rubric.md) when performing a full audit or preparing a handoff.
