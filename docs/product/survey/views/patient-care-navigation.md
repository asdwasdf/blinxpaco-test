---
id: patient-care-navigation
title: Patient Care Navigation
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/configuration/#care-navigation-config]
controls:
  - { name: Item Settings, kind: mutation }
  - { name: "+", kind: mutation }
  - { name: Delete, kind: destructive }
verified_by: []
last_observed: 2026-09-19
---

# Patient Care Navigation

## Purpose and context

`Observed`: `Configuration` → `Patient` → `Care Navigation` opens the legacy `Care Navigation Config` page containing a large hierarchical organisation configuration table.

## Entry and transitions

The observed nested table structure contained 1,640 total `tr` elements across 410 nested tables, with four direct rows in the outer table and 162 visible `+` controls. No search, filter, sort, or pagination control was visible. `Item Settings` and `Delete` were observed previously but were not visible in the current collapsed/rendered state. Organisation-specific configuration values and test labels are omitted. No row, settings control, addition, or deletion action was used.

## Execution guidance

- Safe steps: open the page and inspect the visible hierarchy and control types only.
- Stop before `Item Settings`, `+`, `Delete`, editing any value, or any unknown persistence control.
- Capture route, page title, structural counts, and redacted control categories only.

## Automation guidance

- Stable landmarks: route fragment `#care-navigation-config` and `Care Navigation Config`.
- Wait for the hierarchical table before inspecting structure.
- Configuration values depend on organisation and may contain operational or test data.
- No trusted basis exists for expected hierarchy, labels, or item counts.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Observed 1,640 total table rows across 410 nested tables, four direct outer-table rows, and 162 visible `+` buttons; no read-only grid controls were available. Organisation-specific values redacted. Mutation: `None`.

## Open questions

- Hierarchy semantics, settings behavior, validation, persistence, and deletion safeguards remain unverified.

## Tester notes

[Protected area]
