---
id: health-forms-inbox
title: Health Forms Inbox
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /health-forms/responses/
controls:
  - name: Filters
    kind: filter
  - name: Search
    kind: search
  - name: Expand All
    kind: toggle
  - name: Collapse All
    kind: toggle
  - name: View By Patient
    kind: toggle
  - name: View By Health Form
    kind: toggle
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-hf-inbox-1
    from: dashboard
    to: health-forms-inbox
    trigger: Health Forms > Inbox
    relationship: navigation
    context: [PACO -> Health Forms app]
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Health Forms Inbox

## Purpose and context

`Observed`: View for reviewing health form responses submitted by patients.

## Entry

1. Dashboard → Health Forms submenu → Inbox
2. URL: `/health-forms/responses/`

## Statistics Panel

- Total Sent to Patient: 58,679
- Incomplete: 47,310
- Overdue from Patient: 11,642
- Completed by Patient: 11,369 of 58,679

## Status Tabs

- All (58,679)
- Incomplete (47,310)
- Overdue (11,642)
- Completed (11,369)
- Awaiting Review (339)
- Reviewed (11,030)

## Controls

- Filters button
- Search textbox
- Expand All / Collapse All
- View By Patient / View By Health Form toggle

## Grouped Results

- Completed By Patient - Alarm Triggered
- Completed By Patient - No Alarm Triggered

## Observations

- Cross-app navigation: PACO sidebar → Health Forms app
- Top bar shows TFN org context
- Refresh countdown visible

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:05:15Z

## Tester notes
