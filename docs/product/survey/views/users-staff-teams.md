---
id: users-staff-teams
title: Users and Staff Teams
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/staff/teams
controls:
  - name: Add New
    kind: mutation
  - name: Team Name
    kind: mutation
  - name: Assign Staff
    kind: mutation
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-users-staff-teams-1
    from: users-staff-teams
    destination_hint: team mới
    trigger: Add New
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-users-staff-teams-2
    from: users-staff-teams
    destination_hint: teams được lưu
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Users and Staff Teams

## Purpose and context

`Observed`: `Configuration` → `Users & Staff` → `Teams` configures named teams and assigned staff.

## Entry and transitions

The page displays `Search Teams...`, repeated `Team Name` and `Assign Staff` fields, plus `Add New` and `Save`. Reverified after manual authentication on 2026-09-22: a synthetic no-match query did not hide any of the 18 accessible team assignment blocks and produced no explicit empty-state message, so current search matching behavior remains unestablished. Clearing preserved the same structure. Existing team names and staff assignments are omitted. No field, assignment, add action, or save action was used. Mutation: `None`.

## Execution guidance

- Safe steps: open page and inspect redacted structure only.
- Stop before editing `Team Name`, changing `Assign Staff`, `Add New`, or `Save`.
- Capture route, repeated field structure, redacted state, and mutation boundary.

## Automation guidance

- Stable landmarks: route, heading `Teams`, repeated `Team Name`/`Assign Staff`, `Add New`, and `Save`.
- Wait for existing team rows or explicit empty/error state.
- Team names and staff membership are organisation-specific and sensitive.
- No trusted basis exists for expected teams or memberships.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22 after manual authentication. Synthetic no-match search left 18 accessible team assignment blocks unchanged and showed no explicit empty state; search was cleared. Team and staff values redacted. Mutation: `None`.

## Open questions

- Team creation/removal, membership validation, duplicate handling, authorization, and save behavior remain unverified.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/staff/teams`: heading `Teams`; control `Add New`, `Save`.

## Tester notes

[Protected area]
