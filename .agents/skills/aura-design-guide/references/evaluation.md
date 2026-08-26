# Evidence-based quality evaluation

Do not claim that the skill beats Claude Code, another model, Aura, a designer, or a baseline from intuition. Run a controlled comparison.

## Baseline protocol

Use the same:

- product brief and real content;
- framework and existing code constraints;
- allowed assets and dependencies;
- implementation time/budget when practical;
- target viewports and acceptance criteria.

Compare:

1. baseline output (existing design or plain design prompt);
2. Aura Design Guide candidate;
3. optional second candidate with a different art direction.

Keep filenames and self-assessments away from the reviewer when a blind review is possible.

## Required evidence

- screenshots at 320, 375, 414, 768, 1280x800, and one wide desktop size;
- short recording for motion and critical interactions;
- keyboard walkthrough;
- state preview for forms and interactive components;
- functional tests/build checks already expected by the project;
- performance/accessibility measurements proportional to risk;
- source/reference provenance and transformation notes.

## Scoring rubric

Score 1-5 with one sentence of evidence per axis:

| Axis | Question |
| --- | --- |
| Product specificity | Could this interface belong only to this product? |
| Visual thesis | Is there a coherent position beyond "clean/modern"? |
| Hierarchy | Is the primary task or promise clear in two seconds? |
| Structural originality | Does the composition avoid default AI page/app patterns? |
| Typography | Are type roles, scale, measure, and localization intentional? |
| Media relevance | Do images/video/3D explain or prove something? |
| Interaction quality | Are feedback, focus, press, loading, error, and recovery coherent? |
| Motion | Is motion purposeful, restrained, performant, and reducible? |
| Responsive quality | Is each target viewport composed rather than merely collapsed? |
| Accessibility | Are keyboard, contrast, semantics, touch, and reduced motion covered? |
| Functional completeness | Can users complete the critical job and recover from failure? |
| Restraint | Has unearned decoration and complexity been removed? |

## Pass condition

The candidate may be described as an improvement only when:

- it scores higher than baseline on at least 7 of 12 axes;
- it has no regression in functional completeness, accessibility, or content truth;
- no critical anti-slop failure remains;
- the claim names the measured scope, for example: "The candidate scored higher on 8/12 rubric axes in this homepage benchmark."

One benchmark does not prove universal superiority. Keep the raw evidence and note unresolved tradeoffs.

## Self-critique before review

Before external or comparative review, score the candidate on:

- philosophy;
- hierarchy;
- execution;
- specificity;
- restraint;
- variety.

Any score below 3 triggers a revision before the candidate enters the benchmark. Self-critique is a filter, not final proof.
