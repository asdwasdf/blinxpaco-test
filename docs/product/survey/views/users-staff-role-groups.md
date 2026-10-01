---
id: users-staff-role-groups
title: Users and Staff Role Groups
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/staff/role-groups
controls:
  - name: Add New Role
    kind: mutation
  - name: Add New Role Group
    kind: mutation
  - name: Edit
    kind: mutation
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-users-staff-role-groups-1
    from: users-staff-role-groups
    destination_hint: role group mới
    trigger: Add New
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-users-staff-role-groups-2
    from: users-staff-role-groups
    destination_hint: quyền role group thay đổi
    trigger: Edit
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-users-staff-role-groups-3
    from: users-staff-role-groups
    destination_hint: role groups được lưu
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Users and Staff Role Groups

## Purpose and context

`Observed`: `Configuration` → `Users & Staff` → `Role Groups` opens staff role and role-group configuration with RBAC mappings.

## Entry and transitions

The page exposes `Role`, `Role Group`, `RBAC Role`, `RBAC Activities`, and `Search Role Groups...`. Controls include two `Add New` actions, `Edit`, and a disabled `Save`. Reverified on 2026-09-22: a synthetic no-match query hid all mapping inputs and mutation controls except disabled `Save`; no explicit empty-state message appeared. Clearing restored the mappings and controls without enabling `Save`. Existing role names and activity assignments are omitted. No control or value was changed. Mutation: `None`.

## Execution guidance

- Safe steps: open page and inspect redacted mapping structure and disabled state.
- Stop before `Add New`, `Edit`, changing RBAC assignments, or `Save`.
- Capture route, structural labels, redacted state, and mutation boundary.

## Automation guidance

- Stable landmarks: route, heading `Role Groups`, RBAC labels, and disabled `Save` initial state.
- Wait for role and activity mappings to load.
- Role names and activity assignments are organisation-specific security configuration.
- No trusted basis exists for expected roles, groups, or RBAC activities.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Synthetic no-match search hid mappings without an explicit empty-state message; disabled `Save` remained, and clearing restored mappings. Role and RBAC values redacted. Mutation: `None`.

## Open questions

- Difference from proxy role groups, edit lifecycle, validation, authorization safeguards, and save behavior remain unverified.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/staff/role-groups`: heading `Role Groups`; control `Add New`, `Edit`, `Save`.

Gap / Open Question:

- Sửa role group đổi quyền (mutation rủi ro cao); VERIFY_FLOW cần role group test thuộc sở hữu.

## Tester notes

[Protected area]
