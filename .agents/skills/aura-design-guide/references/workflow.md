# Aura-informed execution workflow

## Preflight

Read the existing product before proposing a look:

- framework, routes, layouts, component library, and data patterns;
- global CSS, tokens, typography, spacing, radius, and icon system;
- motion dependencies and existing interaction conventions;
- accessibility, localization, theme, and responsive constraints;
- dirty worktree and files that must not be overwritten.

State what will be preserved and what the design work will introduce.

## Product and creative brief

Capture these facts without inventing missing content:

```text
Product:
Primary audience:
Primary job and action:
Trust level and emotional target:
Content/data available:
Primary devices and input methods:
Existing brand constraints:
Performance and accessibility constraints:
What must remain unchanged:
```

Then write a one-sentence visual thesis. It must connect product meaning to a visual behavior. "Modern and clean" is invalid. Example: "A calm editorial command center where breaking stories feel verified, not sensational."

## Reference mining

When external research is allowed, collect three references from distinct structural families. Include at least one current Aura template, component, design system, or relevant lesson. Keep at least one reference outside Aura so the result does not become an Aura-only echo chamber. If live access is unavailable, use the dated Aura research map and say that it may be stale.

For each reference, record:

```text
Source and provenance:
Useful DNA:
Product relevance:
What must not be copied:
Transformation axes:
```

Use screenshots for visible rhythm and composition, URLs/HTML for exact type/color/structure, and video for timing and physics. A still cannot prove motion; HTML cannot prove perceived rhythm.

## Direction matrix

Create three materially different directions against the same product facts:

| Axis | Direction A | Direction B | Direction C |
| --- | --- | --- | --- |
| Macrostructure/app shell | | | |
| Type roles | | | |
| Surface and color model | | | |
| Media language | | | |
| Density | | | |
| Signature interaction | | | |
| Main risk | | | |

Choose one using product fit, distinctiveness, clarity, feasibility, accessibility, and performance. Do not average the three into a bland compromise.

## Controlled implementation

### Landing page or marketing site

1. Tokens and typography.
2. Navigation and hero.
3. Primary product proof or demonstration.
4. Supporting sections with varied composition.
5. Trust, pricing, FAQ, CTA, and closing structure only when real content supports them.
6. Contextual assets.
7. Motion, responsive, accessibility, and performance polish.

Spend disproportionate attention on the hero because it establishes the promise and visual thesis, but do not let it consume the product proof below it.

### Web app

1. App shell and information architecture.
2. One complete critical workflow with real states.
3. Reusable components and data patterns.
4. Secondary workflows.
5. Empty, loading, error, permission, offline, and destructive-action behavior.
6. Responsive and keyboard behavior.
7. Visual polish and motion after task clarity is stable.

### Component

Build the real component and a small state preview. Show default, hover, focus, active, disabled, loading, error, and success where meaningful. Match surrounding tokens and geometry.

## Targeted edit language

Use precise prompts or implementation plans:

```text
Edit only: <section/component/state>.
Preserve: <approved regions, behavior, copy, routes, tokens>.
Problem: <named visual or UX defect>.
Change: <specific composition, state, media, or motion behavior>.
Verify: <observable acceptance criteria>.
```

For reference adaptation:

```text
Use the reference only for <structure/timing/type role>.
Adapt it to <product and current design system>.
Replace all copy, data, branding, icons, and media.
Change <at least three transformation axes>.
Do not alter <approved regions>.
```

Negative instructions should name a concrete failure: "remove the unmotivated purple glow," "keep button labels on one line," or "do not change the navigation." Avoid vague negatives such as "do not make it bad."

## Taste pass

After implementation, inspect the render and ask:

- Is this composition specific to the product?
- Did any reference survive too literally?
- Is every image relevant to nearby copy or task?
- Are repeated cards actually the best information shape?
- Does every decorative element have a semantic or atmospheric job?
- Can one type, color, border, shadow, label, or animation be removed?
- Does mobile read as designed, or merely collapsed?

Keep successful decisions in DESIGN.md or project tokens. Record failed directions only when they prevent repeated mistakes.
