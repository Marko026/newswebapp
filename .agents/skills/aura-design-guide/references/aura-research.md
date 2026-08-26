# Aura.build research map

Reviewed: 2026-08-27. Re-check current pages before relying on product counts, model names, plan limits, or other drift-prone details.

## What Aura contributes

Aura's durable contribution is a workflow:

```text
reference evidence
-> design system / DESIGN.md
-> multiple directions
-> section-level or component-level generation
-> contextual assets
-> targeted edits
-> motion and interaction polish
-> responsive review
-> human taste pass
-> reusable rules
```

Aura supports references to templates, components, snippets, earlier iterations, images, URLs, and Figma. It emphasizes real HTML/Tailwind/JavaScript output, multi-page composition, visual editing plus code editing, responsive breakpoints, contextual image generation, and export. Treat feature counts and available model names as current-product facts that can change, not skill invariants.

Primary documentation:

- https://www.aura.build/
- https://www.aura.build/learn/introduction
- https://www.aura.build/learn/installation
- https://www.aura.build/learn/how-to-design
- https://www.aura.build/learn/documentation
- https://www.aura.build/learn/prompt-for-ui
- https://www.aura.build/learn/prompt-for-typography
- https://www.aura.build/learn/prompt-for-styling
- https://www.aura.build/learn/prompt-for-animation
- https://www.aura.build/learn/prompt-for-layout
- https://www.aura.build/learn/master-customizations
- https://www.aura.build/learn/ai-landing-pages-images-videos
- https://www.aura.build/learn/gemini-3-masterclass
- https://www.aura.build/learn/faq

## Live homepage observations

Observed directly in Chrome on 2026-08-27:

- The production homepage is a restrained dark product shell, not a maximal WebGL demo.
- Body and display typography use Inter. At a wide desktop viewport, the H1 computed at 60px, weight 500, line-height 60px, and -3px letter spacing.
- The page uses a faint structural grid, compact uppercase navigation, a large central prompt surface, and gallery cards as proof.
- Control transitions cluster around 150-300ms. Hero/text entrances use roughly 700ms opacity, blur, and translate treatment.
- The homepage contained no `video` or `canvas` element during inspection. Its richer video, 3D, physics, and WebGL ideas live in lessons, components, and templates.
- Gallery cards use restrained border, image-transform, overlay-opacity, and action-reveal states rather than constant animation.

Transfer the restraint, systematic rhythm, and proof-oriented gallery. Do not make Inter, centered heroes, dark mode, or grid backgrounds universal rules.

## Sixteen current video lessons

The lesson page exposes the following source videos and topic maps. Read or watch only the lessons relevant to the current task.

1. Interactive Rain Hero - https://www.youtube.com/watch?v=p1e-gofinDc
   - Hero-only refinement, interactive rain, water bounce, distortion, dashboard improvement, CTA/footer atmosphere.
2. Brutalist Landing Page - https://www.youtube.com/watch?v=jID-rK3D-Yc
   - Screenshot reference, Prompt Builder, GSAP, manual edits, missing sections, image updates, navigation wiring.
3. Cinematic One-Prompt Website - https://www.youtube.com/watch?v=CYzs7NlevHI
   - Precise cinematic vocabulary, Lenis-style weighted scroll, GSAP-style triggers, real Three.js-style 3D, complete polish.
4. Premium Website Recreation - https://www.youtube.com/watch?v=YFd3Vdyb7Mo
   - URL to design DNA, screenshot-derived hero, global style fixes, interactive background, complex sections and animation, original adaptation.
5. GPT Images plus Grok Imagine - https://www.youtube.com/watch?v=BC5gl7ErntY
   - Reference structure, 3D asset extraction, image generation, image-to-video, media as one system.
6. Avoid AI Slop - https://www.youtube.com/watch?v=M4DNgmI7MIM
   - Named AI tells, AGENTS.md, DESIGN.md, screenshots/URLs, contextual media, targeted critique, reusable rules.
7. Claude Opus versus GPT - https://www.youtube.com/watch?v=nT4USUu_PGM
   - Same references across workflows, export to local files, direct edits, layout accuracy, spacing, typography, depth, pricing, polish.
8. Landing Pages with Images and Videos - https://www.youtube.com/watch?v=T1WTGQesbrE
   - DESIGN.md first, multiple foundations, contextual image batches, loop/once/hover video, overlap and playback fixes.
9. Image-First Landing Page - https://www.youtube.com/watch?v=8eSkewmgi84
   - Section-by-section visual references, image-guided versus prompt-only results, before/after interaction, pricing/CTA/footer polish.
10. Animated WebGL Pages - https://www.youtube.com/watch?v=tiwh7Ef9dsU
    - Reference variation, prompt structure, mask-reveal skills, WebGL, Matter.js physics, draggable interaction, full-page assembly.
11. Complex Animations from Video - https://www.youtube.com/watch?v=lT7_fTkB-do
    - Observe timing, direction, easing, glow, depth, rotation, and physics; translate motion evidence into a motion brief.
12. Stronger DESIGN.md - https://www.youtube.com/watch?v=jLiox47HkMI
    - Plain prompt versus style word versus design system, navigation improvement, component replacement, full-page consistency.
13. Pro Landing Page Blueprint - https://www.youtube.com/watch?v=HO2a_BTx12k
    - Positioning, inspiration, custom 3D, icon systems, professional typography, beams/marquees, bento sections, responsive polish.
14. GPT plus DESIGN.md Section Workflow - https://www.youtube.com/watch?v=Jw7B8EtYMX8
    - Screenshot to new direction, Generate versus Edit, section-level control, consistency, system extraction.
15. DESIGN.md Workflow System - https://www.youtube.com/watch?v=wRTu2dWpG4A
    - Typography, color, spacing, radius, rhythm, URL import, de-cloning, asset replacement, skills/components, portable visual DNA.
16. End-to-End Gemini Design - https://www.youtube.com/watch?v=b-kTkak2FKs
    - Reference steering, image-to-HTML, style mixing, snippets, new sections, advanced backgrounds, border/gradient polish, export.

## Anti-slop findings from the lesson

The anti-slop lesson names concrete problems: lazy or uneven selected states, oversized uppercase eyebrows, unexplained status pills, random glow lights, default purple gradients, mismatched palettes, generic pricing, two-line button labels, inconsistent section geometry, default fonts, generic icons, and imagery that does not match the product.

The durable fix loop is:

1. stop prompting from zero;
2. use visual and URL references responsibly;
3. put stable rules in AGENTS.md and visual rules in DESIGN.md;
4. name the exact defect rather than asking to "make it better";
5. adapt reference patterns to the current system;
6. generate contextual media;
7. preserve strong regions and edit only weak regions;
8. turn successful decisions into reusable rules.

Important nuance from the lesson: HTML references are richer and more prescriptive, especially for animation; DESIGN.md is more portable but cannot guarantee composition quality by itself. Use both only when provenance and authorization are clear.

## Refresh rule

On a new design task, inspect the relevant current Aura template/component category rather than reusing the same remembered examples forever. Record sources, extract principles, and discard source branding. If Aura changes materially, update the reviewed date and source map; do not copy marketing text into operational rules.
