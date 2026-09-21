---
id: users-staff-teams
title: Users and Staff Teams
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/staff/teams]
controls:
  - { name: Add New, kind: mutation }
  - { name: Team Name, kind: mutation }
  - { name: Assign Staff, kind: mutation }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Users and Staff Teams

## Purpose and context

`Observed`: `Configuration` → `Users & Staff` → `Teams` configures named teams and assigned staff.

## Entry and transitions

The page displayed `Search Teams...`, repeated `Team Name` and `Assign Staff` fields, plus `Add New` and `Save`. A synthetic no-match query did not hide the 18 visible team assignment blocks and produced no explicit empty-state message, so current search matching behavior could not be established from DOM state. Clearing the query preserved the same block count. Existing team names and staff assignments are omitted. No field, assignment, add action, or save action was used.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search left 18 visible team assignment blocks unchanged and showed no explicit empty state. Team and staff values redacted. Mutation: `None`.

## Open questions

- Team creation/removal, membership validation, duplicate handling, authorization, and save behavior remain unverified.

## Tester notes

[Protected area]
