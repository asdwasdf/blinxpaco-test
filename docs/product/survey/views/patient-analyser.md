---
id: patient-analyser
title: Patient Analyser
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Analytics
    kind: navigation
  - name: Date Range
    kind: filter
  - name: Reports
    kind: tab
  - name: Search...
    kind: search
verified_by: []
last_observed: 2026-09-19
---

# Patient Analyser

## Purpose and context

`Observed`: `Analytics & Reports` → `Patient Analyser` opens `/patient-analyser-new/` for role `Super Admin GB` in dev.

## Entry and transitions

Default state exposes analyser tabs, report search, `Save Report`, `Advanced Search`, `Reset View`, hierarchy expansion controls, grid tools, and a patient grid. Visible structural headers include age, date of birth, email, full name, gender, and actions; values are omitted.

A synthetic no-match query in the report search did not change the 54 visible structural grid rows and produced no explicit empty-state message. A synthetic query in the visible grid search also left 54 structural rows unchanged with no explicit empty state. Both searches were cleared. Search semantics remain unestablished; no patient row or action was opened.

## Execution guidance

- Authenticate manually and open `Patient Analyser` through global navigation.
- Use report search and pagination only with approved data handling.
- Capture control structure, not patient/report contents.

## Automation guidance

- Stable landmarks: route, `Reports`, `Date Range` and search controls.
- Wait for grid state; do not assert changing report contents without trusted requirements.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Report and grid synthetic searches left 54 visible structural rows unchanged and showed no explicit empty state; both cleared. Mutation: `None`; PII excluded.

## Open questions

- Report data prerequisites and expected calculations remain unknown.
- Search scope and delayed/filter-trigger behavior remain unestablished because synthetic queries produced no observable row change.

## Tester notes

[Protected area]
