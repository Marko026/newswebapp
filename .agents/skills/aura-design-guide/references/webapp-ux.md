# Web app and product UI extension

Aura's strongest public material is landing-page oriented. To build better web apps, preserve its reference-driven craft while adding product-system rigor.

## Product hierarchy

Design in this order:

1. user job and critical workflow;
2. information architecture and navigation model;
3. data hierarchy and action priority;
4. permissions, validation, errors, loading, and recovery;
5. responsive/keyboard/touch behavior;
6. component system and visual language;
7. motion and visual enrichment.

Spectacle never outranks task completion.

## Critical workflow slice

Before designing the whole app, complete one realistic end-to-end slice:

```text
Entry point
-> locate/select data
-> inspect or edit
-> validate
-> submit or save
-> loading/progress
-> success or error
-> undo/retry/recovery
```

Use real or clearly labeled fixture data. A visually polished happy path without failure and recovery states is not a complete app design.

## App shell

Choose the navigation shape from product scale and frequency:

- top nav for few peer destinations;
- side rail for frequent multi-area tools;
- split navigation for admin or dense domain products;
- command palette as acceleration, never the only discoverability layer;
- contextual subnavigation only when hierarchy requires it.

Do not import a marketing-site navbar into a working application. Preserve screen area for the user's task.

## Data and density

- Use cards only when each item is a distinct object with meaningful grouping.
- Use lists/tables when comparison and scanning matter.
- Use tabular numerals for aligned data.
- Keep persistent filters and bulk actions discoverable.
- Design density modes only when users genuinely need both overview and detail.
- On mobile, reorder information by task priority; do not simply stack every desktop panel.

## State matrix

For every route or major surface, consider:

- first use/onboarding;
- loading and slow loading;
- populated/normal;
- empty because no data exists;
- zero search/filter results;
- partial data;
- stale/offline;
- validation error;
- server/network error;
- permission denied/read-only;
- success/confirmation;
- destructive action and recovery.

Use skeletons when content shape is known. Delay fast spinners to prevent flashing. Explain why an empty state exists and give the next useful action. Errors state what happened, why when known, and how to recover.

## Component states

Interactive elements need default, hover, focus-visible, active/pressed, disabled, loading, error, and success where semantically relevant. Maintain geometry across states. Inputs and adjacent buttons share control height. Error/help slots reserve space to avoid layout jump.

## Application motion

Motion should reveal causality and spatial relationship:

- where a panel came from;
- what changed after an action;
- which item moved or was removed;
- whether work is still processing;
- how to undo or recover.

Avoid ambient hero motion inside task-heavy screens. Route transitions are subtle and hierarchy-aware. Dense apps normally need less motion than marketing pages.

## Accessibility and efficiency

- Full keyboard operation and logical focus order.
- Visible focus and no focus loss after async updates.
- Screen-reader names, live regions, table semantics, and error association.
- Touch targets at least 44px where touch is expected.
- Reduced motion and high contrast compatibility.
- No hover-only action or information.
- Shortcuts complement visible UI and never conflict with browser/platform conventions.

## App-specific anti-slop

Reject:

- dashboard full of decorative KPI cards with invented numbers;
- meaningless gradient charts;
- every object placed in the same rounded card;
- sidebars filled with placeholder destinations;
- fake real-time status dots;
- non-functional command palette, search, filters, sorting, or pagination;
- loading spinners with no progress/retry strategy;
- empty states that say only "No data";
- destructive actions with no undo or serious confirmation;
- beautiful mock screens that cannot complete the primary job.

The app is ready for visual polish only after the critical workflow and state matrix are coherent.
