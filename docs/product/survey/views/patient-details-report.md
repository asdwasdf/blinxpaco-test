---
id: patient-details-report
title: Patient Details Report
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

# Patient Details Report

## Purpose and context

`Observed`: `Patient Details` is a distinct selected report state within `/patient-analyser-new/`.

## Entry and transitions

Select `Analytics & Reports` → `Patient Details`. Report list and grid refresh inside the shared analyser shell. Visible structural headers are age, date of birth, email address, full name, gender, and actions; 54 visible `role=row` elements include structural rows and must not be treated as a patient total. No row or action was opened.

## Execution guidance

- Treat all grid content as sensitive patient data.
- Capture only route, selected state and control structure.

## Automation guidance

- Assert selected state and shell landmarks only.
- Never place patient data in fixtures or evidence without explicit approved handling.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Grid headers and 54 visible structural rows observed; no row opened. Mutation: `None`; PII excluded.

## Open questions

- Data prerequisites and intended report fields remain unknown.

## Tester notes

[Protected area]
