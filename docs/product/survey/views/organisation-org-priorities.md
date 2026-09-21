---
id: organisation-org-priorities
title: Organisation Priorities
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/organisation/org-priorities]
controls:
  - { name: Search Org Priority..., kind: read-only }
  - { name: Add new, kind: mutation }
  - { name: Edit, kind: mutation }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Organisation Priorities

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Org Priority` opens organisation priority configuration.

## Entry and transitions

Visible columns are `Priorities`, `Priority Grouping`, `Total Time`, `Breaching Red`, `Breaching Amber`, `Breaching Green`, `Case Ranking`, and `Default`. Mutation controls are `Add new`, `Edit`, and `Save`. The observed table had no accessible body rows before or after a synthetic no-match search, and no explicit empty/no-match message appeared. `Add new`, `Edit`, and `Save` remained enabled and were not used. Clearing search preserved the same header-only state. No mutation was performed.

## Execution guidance

- Safe steps: open page, inspect columns, and use search only with non-sensitive text.
- Stop before `Add new`, `Edit`, changing values, or `Save`.
- Capture route, column structure, and empty/loading/error state.

## Automation guidance

- Stable landmarks: route, `Org Priorities`, `Search Org Priority...`, table headers.
- Wait for body rows or explicit empty state.
- Priority values depend on organisation configuration.
- No trusted basis for expected thresholds, ranking, or default.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search produced no distinct empty state because the initial view already had no accessible body rows. Mutation: `None`.

## Open questions

- Empty body cause and priority lifecycle remain unverified.

## Tester notes

[Protected area]
