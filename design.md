# Design — Nile Chronicle

This is the shared visual system for the bilingual news and history publication.
It is intentionally restrained, readable, and editorial rather than promotional.

## Genre

Editorial · newsprint · archival

## Macrostructure family

- Marketing / public home: Nile Ledger — featured story, story index, latest stream
- Content pages: Long Document — reading-led article and history layouts
- Utility pages: Index-First — direct navigation and task-focused forms

## Theme

The `Newsprint` theme uses a warm paper field, ink typography, vermilion editorial
signals, and a restrained green-blue art register. Dark mode keeps the same
hierarchy with deep green paper and warm paper ink.

The source of truth is `app/(site)/tokens.css`.

## Typography

- Display: Georgia, normal roman, tight tracking
- Body: Arial with Noto Sans Arabic fallback
- Mono: Courier New for metadata and controls
- Hero display is capped below 5rem and is sized by headline length

## Spacing and motion

The site uses the named 4px spacing scale in `tokens.css`. Motion is limited to
opacity and transform transitions; reduced-motion users receive an opacity-only
fallback.

## Interaction voice

- Primary action: underlined editorial link, never a pill
- Carousel: keyboard, buttons, touch drag, pause/play, and visible focus
- Controls remain single-line and keep their dimensions across locales

## What pages must share

The wordmark, paper/ink hierarchy, vermilion accent, typography pairing, focus
ring, RTL/LTR support, and content-first spacing rhythm.

## Visual thesis

Nile Chronicle is a living front page: every story is presented as a trace through
time, with editorial rules, paper surfaces, and restrained vermilion signals making
the publication feel precise rather than promotional.

Principles:

- discovery begins with one clear lead, then opens into an index;
- real media carries meaning, while fallback art is visibly illustrative;
- pages vary in rhythm but share the same paper, ink, type, and rule language;
- Arabic and English are parallel editorial systems, not translated afterthoughts.

## Implementation mapping

- Tokens: `app/(site)/tokens.css`
- Composition layer: `app/(site)/editorial.css`
- Shared shell: `components/site-header.tsx`, `components/site-footer.tsx`
- Discovery: `app/(site)/[locale]/page.tsx`, `components/featured-carousel.tsx`, `components/article-card.tsx`
- Reading: `app/(site)/[locale]/news/[slug]/page.tsx`, `app/(site)/[locale]/history/[slug]/page.tsx`
- Utilities: search, contact, newsletter, register, loading, error, and not-found routes.

## Hallmark implementation note

The homepage uses the `Nile Ledger` macrostructure so discovery is the main
job of the page. It replaces the previous oversized `Long Document` hero rhythm
with a front-page lead and an explicit story index. No routes, CMS logic, or
production files were deleted.

## Exports

- CSS tokens: `app/(site)/tokens.css`
- Tailwind semantic theme: `tailwind.config.js`
- DTCG/shadcn mapping: the semantic `--color-*`, `--font-*`, `--space-*`,
  `--text-*`, `--ease-*`, `--dur-*`, `--rule-*`, and `--radius-*` tokens above
  are the portable source for future exports.
