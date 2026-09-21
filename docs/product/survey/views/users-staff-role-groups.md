---
id: users-staff-role-groups
title: Users and Staff Role Groups
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/staff/role-groups]
controls:
  - { name: Add New Role, kind: mutation }
  - { name: Add New Role Group, kind: mutation }
  - { name: Edit, kind: mutation }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Users and Staff Role Groups

## Purpose and context

`Observed`: `Configuration` → `Users & Staff` → `Role Groups` opens staff role and role-group configuration with RBAC mappings.

## Entry and transitions

The page exposed `Role`, `Role Group`, `RBAC Role`, `RBAC Activities`, and `Search Role Groups...`. Controls included two `Add New` actions, `Edit`, and a disabled `Save`. A synthetic no-match query hid all mapping inputs and mutation controls except disabled `Save`; no explicit empty-state message appeared. Clearing search restored the mappings and controls without enabling `Save`. Existing role names and activity assignments are omitted. No control or value was changed.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search hid mappings without an explicit empty-state message; clearing restored them. Role and RBAC values redacted. Mutation: `None`.

## Open questions

- Difference from proxy role groups, edit lifecycle, validation, authorization safeguards, and save behavior remain unverified.

## Tester notes

[Protected area]
