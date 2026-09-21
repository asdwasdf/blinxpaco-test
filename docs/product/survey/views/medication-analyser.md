---
id: medication-analyser
title: Medication Analyser
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - patient-analyser
controls:
  - name: Reports
    kind: tab
  - name: Search...
    kind: search
verified_by: []
last_observed: 2026-09-19
---

# Medication Analyser

## Purpose and context

`Observed`: `Medication Analyser` is a distinct selected report state within `/patient-analyser-new/`.

## Entry and transitions

Select `Analytics & Reports` → `Medication Analyser`. The analyser shell remains visible while report list and grid refresh. Visible structural headers include latest recorded date, current age, days left, prescription type, full name, and actions; values are omitted. A synthetic query in the visible grid search left 54 structural rows unchanged and showed no explicit empty state; clearing restored the empty search field. No medication or patient row was opened.

## Execution guidance

- Wait for selected report state and refreshed grid.
- Do not retain medication, patient, date, count or organisation values.

## Automation guidance

- Assert selected state and shell landmarks, not dynamic report contents.
- Use condition-based grid waits.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Synthetic grid search left 54 visible structural rows unchanged and showed no explicit empty state; search cleared. Mutation: `None`; medication and patient data excluded.

## Open questions

- Report definitions and expected calculations remain unknown.
- Grid search behavior remains unestablished because the synthetic query produced no observable row change.

## Tester notes

[Protected area]
