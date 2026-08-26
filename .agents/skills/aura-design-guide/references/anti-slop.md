# Anti-AI-slop gate

Anti-slop is not a single aesthetic. It is evidence that a design was shaped for one product rather than emitted from a default attractor.

## Immediate critical tells

Fail and revise when the design contains an unjustified combination of these:

- generic purple/blue glow, aurora blob, gradient headline, or random light source;
- centered full-viewport hero with short generic copy and one CTA;
- wordmark-left, five-links, CTA-right default SaaS navigation regardless of genre;
- four-column Product/Company/Resources/Legal footer without a real sitemap need;
- three equal icon-above-heading feature cards;
- card inside card inside micro-card;
- uppercase eyebrow on every section or a random status pill;
- Inter/Roboto/Open Sans used as both display and body without a deliberate reason;
- mismatched icon libraries or emoji as product/feature icons;
- fake browser, phone, terminal, or IDE chrome;
- invented metrics, testimonials, logos, customers, or product claims;
- stock/AI imagery that does not describe the nearby product content;
- WebGL or Three.js used for a still object the user cannot meaningfully interact with;
- autoplay video with sound, no poster, or lazy-loaded hero/LCP media;
- every section fading up on scroll;
- `transition-all`, universal hover scaling, animated focus rings, or bounce easing on ordinary UI;
- primary buttons, nav links, or tabs wrapping to two lines;
- design tokens abandoned for one-off colors and fonts during later edits.

Aura's own anti-slop lesson also calls out uneven selected states, oversized eyebrow spacing, unnecessary status indicators, mismatched gray/purple color relationships, generic pricing, two-line buttons, and sections whose geometry no longer matches the rest of the page.

## Specificity test

Answer with evidence:

1. What visual decision could exist only because of this product, audience, or content?
2. What is the page/app's structural fingerprint?
3. Which media asset proves or explains the product?
4. What interaction reveals product behavior rather than adding decoration?
5. Which generic element was removed during the taste pass?

If answers are vague, the design is still generic.

## Structure and rhythm

- Do not reuse Hero -> three features -> CTA -> footer as a default.
- Vary section rhythm: dense/quiet, split/full-bleed, text/proof, static/interactive.
- Avoid equal padding on every section.
- Use one containment layer unless semantics require nesting.
- Keep the hero's essential promise, lede, CTA, and focal media visible at 1280x800 unless the concept explicitly requires a longer opening composition.
- Decorative elements must have semantic or atmospheric rationale.

## Typography and color

- Choose type roles, not a random favorite font. Display and body may share a family only when weight, width, and scale create intentional contrast.
- Keep prose measure roughly 45-75 characters.
- Use fluid type and protect long words/localization.
- Keep one primary accent and verified text-on-accent pair.
- Do not use color as the only state signal.
- Any class that flips to a dark surface must explicitly flip text and icon colors.

## Interaction and states

- Interactive controls need default, hover, focus-visible, active, disabled, loading, error, and success where meaningful.
- Focus appears instantly and passes 3:1 contrast.
- Touch targets are at least 44x44 CSS pixels.
- Inputs keep border width and geometry stable across states.
- Prefer skeletons for predictable content shapes and inline progress for local actions.
- Empty states explain why, what can happen next, and provide a useful action.
- Reversible actions prefer optimistic completion plus Undo; irreversible actions use a serious confirmation.

## Responsive floor

Inspect at 320, 375, 414, 768, 1280x800, and a wide desktop viewport:

- no horizontal overflow;
- no two-line primary affordances;
- image grids use `minmax(0, 1fr)` tracks;
- long display text can wrap safely;
- hover behavior has focus/tap equivalents;
- secondary sticky elements offset the page-level sticky header;
- mobile is recomposed, not merely shrunk;
- tables and dense data have a mobile information strategy.

## Media and motion

- Every motion has a purpose, trigger, duration, easing, iteration count, stop condition, and reduced-motion treatment.
- Animate transform and opacity for ordinary UI; justify anything more expensive.
- Use one signature motion and a small supporting system.
- Loop only ambient motion. Use once for a reveal and hover/focus for previews.
- Pause or disable auto-rotating content; never trap attention.

## Final verdict

Classify the result:

- `blocked`: critical functional, accessibility, provenance, or content-truth failure;
- `reads as AI-generated`: two or more strong visual tells remain;
- `close`: no critical tell, but hierarchy, specificity, media, or polish is weak;
- `ready for comparison`: all critical gates pass and the render is available for the evaluation rubric.

When Hallmark is installed, its current full slop test outranks this compact gate.
