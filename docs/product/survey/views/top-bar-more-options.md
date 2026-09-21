---
id: top-bar-more-options
title: Top Bar More Options
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/]
controls:
  - { name: PaComms, kind: navigation }
  - { name: Quick View, kind: unknown }
  - { name: PACO Assist, kind: unknown }
  - { name: Idle, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Top Bar More Options

## Purpose and context

`Observed`: top-bar `More options` opens an auxiliary menu.

## Entry and transitions

The menu contained `PaComms` with count `0`, `Quick View`, `PACO Assist`, and two entries labelled `Idle`. No menu item was selected because destination and persistence behavior were not established.

## Execution guidance

- Safe steps: open and close `More options`; inspect labels and counts.
- Stop before `Quick View`, `PACO Assist`, or either `Idle` until behavior is classified; treat status changes as mutation.
- Capture menu labels, counts, duplicated labels, and unopened state.

## Automation guidance

- Stable landmarks: `More options`, menu role, `PaComms`, `Quick View`, and `PACO Assist`.
- Do not select ambiguous duplicated `Idle` items by text alone.
- Menu availability and counters may depend on role and session state.
- No trusted basis exists for destinations or correct activity status.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Mutation: `None`.

## Open questions

- Destinations for `Quick View` and `PACO Assist`, purpose of duplicate `Idle` items, status-change behavior, and `PaComms` contents remain unverified.

## Tester notes

[Protected area]
