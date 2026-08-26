# Media, motion, WebGL, and 3D

Aura's lesson library treats still references, video references, generated media, browser animation, WebGL, and physics as parts of one design system. Use the smallest medium and technology that communicates the idea.

## Choose the medium

| Need | Preferred medium |
| --- | --- |
| Explain product UI | Real screenshot or interactive product slice |
| Establish environment/mood | Contextual photograph or short ambient video |
| Show transformation | Before/after or controlled sequence |
| Clarify a process | Diagram, annotated UI, or state transition |
| Add tactile feedback | CSS/SVG microinteraction |
| Show depth with real manipulation | WebGL/3D |
| Show collisions, drag, or physical response | Physics layer such as Matter.js |

Do not use video because it feels expensive. Do not use Three.js for a passive rotating object that a still can replace.

## Contextual media brief

For every asset define:

```text
Section or workflow:
Communication job:
Subject and environment:
Composition and crop:
Lighting and palette:
Texture/realism level:
Relationship to nearby copy or data:
Responsive art direction:
Fallback/poster/alt behavior:
Forbidden generic outcomes:
```

Generate variants only after the slot's role is clear. Judge relevance, brand fit, anatomy/geometry, lighting, crop, and visible AI artifacts. Regenerate or replace weak assets individually.

## Motion brief

Video references contain information that screenshots lose. Observe and record:

```text
Purpose: attention / continuity / feedback / spatial model / atmosphere
Target:
Trigger: load / in-view / hover / focus / click / drag / state change
From and to states:
Direction and distance:
Duration and delay/stagger:
Easing:
Depth, blur, glow, rotation, or parallax:
Iteration and stop condition:
Interaction/physics response:
Reduced-motion result:
Performance budget:
```

Describe motion with measurements and behavior, not adjectives such as "cool" or "cinematic."

## Playback semantics

- Loop: only subtle ambient hero/environment motion that can disappear into the background.
- Once: first-load or state reveal that should settle.
- Hover and focus: card, gallery, or feature previews; always provide touch/click behavior.
- User-controlled: explanatory media, sound, long animation, carousels, demos.
- Static: default when motion adds no information.

Autoplay video must be muted and playsinline. Provide poster/fallback, dimensions/aspect ratio, controls when needed, and a reduced-data strategy. Do not lazy-load the LCP asset; lazy-load below-fold media.

## Technology ladder

Choose the lowest rung that achieves the design:

1. CSS transitions/keyframes for state and simple ambience.
2. Hand-built SVG for masks, paths, strokes, diagrams, and lightweight illustration.
3. Framework-native motion library for orchestrated component/state transitions.
4. GSAP/scroll tooling when timeline coordination or advanced scroll choreography is genuinely required.
5. Canvas/WebGL/Three.js for spatial visuals that earn GPU and bundle cost.
6. Physics engine when user manipulation, collisions, inertia, or constraints are central.
7. Hosted animation/embed services only when self-built options are inadequate and external dependency risk is accepted.

Do not add Lenis, GSAP, Three.js, Matter.js, Spline, Unicorn Studio, Lottie, or another runtime merely because Aura demonstrates it. Check existing dependencies, bundle impact, cleanup, SSR compatibility, input devices, reduced motion, and low-power fallback.

## Motion system

Use named duration and easing tokens. Ordinary UI feedback should normally stay under 500ms; signature hero reveals may be longer when they settle quickly. Do not animate focus rings. Avoid `transition-all`, layout-property animation, universal hover scale, bounce/overshoot on routine controls, and scroll reveals on every section.

One page should normally have:

- one signature motion idea;
- one entrance orchestration;
- a consistent hover/focus/press language;
- clear loading/progress behavior;
- a reduced-motion alternative.

## WebGL/physics acceptance gate

Ship the advanced effect only if all are true:

- it communicates product meaning or enables meaningful manipulation;
- it remains usable without pointer hover;
- it has static/reduced-motion/low-power fallback;
- it does not obscure headline, CTA, controls, or reading;
- cleanup prevents leaking animation loops, listeners, observers, and GPU resources;
- mobile frame rate, memory, and input behavior are tested;
- content remains available when the effect fails to load.

If any condition fails, step down the technology ladder.
