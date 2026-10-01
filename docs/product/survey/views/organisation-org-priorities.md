---
id: organisation-org-priorities
title: Organisation Priorities
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/org-priorities
controls:
  - name: Search Org Priority...
    kind: read-only
  - name: Add new
    kind: mutation
  - name: Edit
    kind: mutation
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-organisation-org-priorities-1
    from: organisation-org-priorities
    destination_hint: org priority list thay đổi
    trigger: Add new
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-org-priorities-2
    from: organisation-org-priorities
    destination_hint: org priority list thay đổi
    trigger: Edit
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-org-priorities-3
    from: organisation-org-priorities
    destination_hint: org priority list thay đổi
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Organisation Priorities

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Org Priority` opens organisation priority configuration.

## Entry and transitions

Visible columns are `Priorities`, `Priority Grouping`, `Total Time`, `Breaching Red`, `Breaching Amber`, `Breaching Green`, `Case Ranking`, and `Default`. Mutation controls are `Add new`, `Edit`, and `Save`. Reverified on 2026-09-22: the table still had no accessible body rows in its initial state. A synthetic no-match search produced the same header-only state with no explicit empty/no-match message; clearing restored the identical state. `Add new`, `Edit`, and `Save` remained enabled and were not used. Mutation: `None`.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. Initial and synthetic no-match states both remained header-only with no explicit empty message; search was cleared. Mutation: `None`.

## Open questions

- Empty body cause and priority lifecycle remain unverified.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/organisation/org-priorities`: heading `Org Priorities`; control `Add new`, `Add`, `Edit`, `Save`.

Gap / Open Question:

- Thay đổi ảnh hưởng case prioritisation; VERIFY_FLOW cần priority test thuộc sở hữu và approval cleanup.

## Tester notes

[Protected area]
