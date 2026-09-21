---
id: patients-proxy-role-groups
title: Patients and Proxy Role Groups
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/proxy/role-groups]
controls:
  - { name: Search Role Groups..., kind: read-only }
  - { name: Add New Role, kind: mutation }
  - { name: Add New Role Group, kind: mutation }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Patients and Proxy Role Groups

## Purpose and context

`Observed`: `Configuration` → `Patients & Proxy` → `Role Groups` opens role and role-group configuration with RBAC mappings.

## Entry and transitions

The page exposed `Role`, `Role Group`, `RBAC Role`, and `RBAC Activities` configuration areas. Controls included `Search Role Groups...`, two `Add New` actions for role and role group, and page-level `Save`. A synthetic no-match query left the visible mapping inputs and controls unchanged and produced no explicit empty-state message. Clearing the query preserved the same state. Existing role names and RBAC activity assignments are omitted. No control or configuration value was changed.

## Execution guidance

- Safe steps: open page, inspect headings and redacted mapping structure, and search only with non-sensitive text.
- Stop before either `Add New`, changing role/group/RBAC assignments, or `Save`.
- Capture route, structural labels, redacted state, and mutation boundary.

## Automation guidance

- Stable landmarks: route, headings `Configuration` and `Role Groups`, `Search Role Groups...`, and `Save`.
- Wait for role, role-group, and RBAC mapping areas to load.
- Role names and activity assignments are organisation-specific security configuration.
- No trusted basis exists for expected roles, memberships, or RBAC activities.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search left mappings unchanged and showed no explicit empty state. Role and RBAC values redacted. Mutation: `None`.

## Open questions

- Add/edit/delete lifecycle, validation, assignment semantics, authorization safeguards, and save behavior remain unverified.

## Tester notes

[Protected area]
