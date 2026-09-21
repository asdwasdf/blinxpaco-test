---
id: patient-search
title: Patient Search
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Search Patients...
    kind: search
  - name: Filters
    kind: filter
  - name: Show archived
    kind: filter
verified_by: []
last_observed: 2026-09-20
---

# Patient Search

## Purpose and context

`Observed`: `Patients` → `Patient Search` opens `/paco/patient-search` for role `Super Admin GB` in dev.

## Entry and transitions

The landing state exposes patient search, filters, archived-record toggle, result grid and audit modal region. A synthetic no-match query reduced the grid to three structural rows without an explicit empty-state message; clearing restored the populated grid. Opening `Filters` exposed `Title`, `Age`, `Gender`, `Ethnicity`, `Country of Birth`, `Language`, `Postcode`, and `Practice`, plus `Clear all`, `Cancel`, and `Save`. `Title` exposed nine labeled options and closed without selection. `Gender` exposed four options whose accessible names rendered as `undefined`; it was closed without selection. The drawer was dismissed unchanged. Representative sorting on `Date of Registration` cycled `none` → `ascending` → `descending` → `none`, restoring the original unsorted state. `Show archived` was toggled on and restored off; both states retained 54 structural rows in the observed DOM. `Offline config`, `Create new patient`, patient rows, and audit actions were not used.

## Execution guidance

- Use only approved test-patient identifiers.
- Treat all result rows, counts and audit data as sensitive.
- Avoid storing search terms or patient values in reusable evidence.

## Automation guidance

- Stable landmarks: route, heading, search and filter controls.
- Do not assert live counts or patient rows without controlled data.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Synthetic no-match search reached a three-structural-row state and cleared cleanly. `Filters` opened for field inventory and was dismissed unchanged; `Title` exposed nine labeled options, while four `Gender` options surfaced as `undefined`. `Date of Registration` sort cycled ascending, descending, then restored unsorted. `Show archived` toggled on and restored off without structural row-count change. Mutation: `None`; live count, patient rows, filter values, and PII excluded.

## Open questions

- Patient-detail actions and audit behavior remain unverified.
- `Gender` filter options expose `undefined` accessible names, preventing reliable option identification and indicating an accessibility/data-label gap.

## Tester notes

[Protected area]
