---
id: analytics-reports-scr-unauthorized
title: Analytics and Reports — SCR Unauthorized
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - dashboard
controls:
  - name: Expand sidebar
    kind: navigation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-analytics-reports-scr-unauthorized-1
    from: analytics-reports-scr-unauthorized
    to: analytics-reports-access-denied
    trigger: Prescriptions
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-analytics-reports-scr-unauthorized-2
    from: analytics-reports-scr-unauthorized
    to: analytics-reports-access-denied
    trigger: NCRS
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Analytics and Reports — SCR Unauthorized

## Purpose and context

`Observed`: `Analytics & Reports` → `Reports` opens `/paco/analytics-reports?report=scr&error=not-authorized` for role `Super Admin GB` in dev.

## Entry and transitions

The view displays heading `Analytics and Reports` and reports that the role is not authorized to view the Summary Care Record (`SCR`) report. No report action was performed.

## Execution guidance

- Authenticate manually with the intended role.
- Capture authorization state without attempting privilege changes.
- Confirm expected role access with QA before treating this as a defect.

## Automation guidance

- Do not automate an expected-result assertion until authorization rules are confirmed.
- Route and visible authorization message can support later regression coverage.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Should `Super Admin GB` access the default `SCR` report?
- Should global `Reports` navigation target a report unavailable to this role?

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `Reports` mặc định mở `/paco/analytics-reports?report=scr&error=not-authorized`; tab `SCR`, `Patient Cases`, `Prescriptions`, `NCRS`.

## Tester notes

[Protected area]
