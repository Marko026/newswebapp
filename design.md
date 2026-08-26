# Design — Nile Chronicle

This is the shared visual system for the bilingual news and history publication.
It is intentionally restrained, readable, and editorial rather than promotional.

## Genre

Editorial · newsprint · archival

## Macrostructure family

- Marketing / public home: Ecosystem Index — featured story, discovery rail, latest index
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

## Hallmark implementation note

The homepage uses the `Ecosystem Index` macrostructure so discovery is the main
job of the page. It replaces the previous oversized `Long Document` hero rhythm
with a front-page lead and an explicit story index. No routes, CMS logic, or
production files were deleted.
