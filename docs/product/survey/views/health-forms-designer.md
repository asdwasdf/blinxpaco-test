---
id: health-forms-designer
title: Health Forms Designer
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: New Health Form
    kind: mutation
  - name: Search
    kind: read-only
  - name: Columns
    kind: read-only
  - name: Filters
    kind: read-only
verified_by: []
last_observed: 2026-09-20
---

# Health Forms Designer

## Purpose and context

`Observed`: `Health Forms` → `Designer` opens `/health-forms/builder/`.

## Entry and transitions

Page displays existing health forms in sortable grid with columns: `Health Form type`, `Health Form Reviewer`, `Updated By`, `Health Form Name`, `Created Date`, `Created By`, `Created By Organisation`, `Shared To Organisation(s)`, `Updated Date`, `Archived`, `Archived Date`, `Editable`.

Existing shared forms are visible; names, creators, and organisation values are omitted. `New Health Form` is a mutation boundary. Search, column configuration, filters, and row actions are exposed.

A synthetic no-match search reduced 56 visible structural `role=row` elements to two structural rows without an explicit empty-state message. Clearing search restored the populated grid. Structural counts are not form totals. `Columns` exposed one hidden and thirteen visible column toggles. `Filters` exposed fields for form identity/type/reviewer, creation/update provenance, organisation sharing, archive state, and editability. Both panels were closed unchanged.

Sorting changed the active column from date-based descending order to `Health Form Name` ascending, then restored `Created Date` descending. No form row or action was opened.

## Execution guidance

- Treat existing forms as shared production data; do not edit/delete without explicit approval and rollback plan.
- New form creation persists immediately; requires unique synthetic name and cleanup verification.
- Search/filter/sort are read-only and safe for general survey.

## Automation guidance

- Stable landmarks: route, page title `Health Forms`, `New Health Form` button, grid structure.
- Mutation tests require controlled synthetic form with known cleanup path.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Synthetic no-match search changed structural rows to header-only content and cleared cleanly; no explicit empty state. `Columns` and `Filters` panels opened and closed unchanged. Sort changed to `Health Form Name` ascending and restored to `Created Date` descending. Mutation: `None`; form names, creators, and organisation values excluded.

## Open questions

- New form creation workflow steps and mandatory fields remain unverified.
- Archive/restore semantics and whether deletion is permanent remain unspecified.

## Tester notes

[Protected area]
