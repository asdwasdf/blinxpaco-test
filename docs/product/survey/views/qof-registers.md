---
id: qof-registers
title: QOF Registers
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

# QOF Registers

## Purpose and context

`Observed`: `QOF Registers` is a distinct selected report state within `/patient-analyser-new/`.

## Entry and transitions

Select `Analytics & Reports` → `QOF Registers`. Report list and grid refresh inside the shared analyser shell. The state exposes `Register/Indicator` selectors and a `Run` action. Opening the first selector exposed a listbox with 299 options; `Escape` closed it without selection. Grid structure remained visible, but patient values and register labels beyond structural evidence are omitted. `Run` was not used.

## Execution guidance

- Wait for selected report state and refreshed grid.
- Capture structure only; omit register contents, dates and counts.

## Automation guidance

- Assert selected state and stable shell landmarks.
- Do not assert QOF values without trusted requirements and controlled data.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. `Register/Indicator` list opened with 299 options and closed via `Escape` without selection. `Run` remained unused. Mutation: `None`; PII excluded.

## Open questions

- Register definitions, selector dependency, `Run` behavior, and expected calculations remain unknown.

## Tester notes

[Protected area]
