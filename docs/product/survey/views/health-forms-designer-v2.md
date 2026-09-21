---
id: health-forms-designer-v2
title: Health Forms Designer V2
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Create new SPN
    kind: mutation
  - name: Create new health forms
    kind: mutation
  - name: Create new consultation
    kind: mutation
  - name: Create new case form
    kind: mutation
  - name: Search Templates
    kind: read-only
  - name: Filters
    kind: read-only
verified_by: []
last_observed: 2026-09-20
---

# Health Forms Designer V2

## Purpose and context

`Observed`: `Health Forms` → `Designer V2` opens `/paco/health-forms`.

## Entry and transitions

Page heading `Health Form Templates` with create menu dropdown exposing four template types: `Create new SPN` (`/paco/health-forms/create-spn-form`), `Create new health forms` (`/paco/health-forms/create-health-form-template`), `Create new consultation` (`/paco/health-forms/create-consultation-template`), `Create new case form` (`/paco/health-forms/create-case-form`).

Grid finishes loading and exposes columns `Archived`, `Editable`, `Name`, `Type`, `Created date`, `Created by`, `Updated date`, `Updated by`, `Archived date`, and `Actions`. A synthetic no-match search reduced 51 structural `role=row` elements to three structural rows without an explicit empty-state message; clearing restored the grid. Structural counts are not template totals.

Opening `Filters` exposed a drawer with `Date Range`, `Type`, `Clear all`, `Cancel`, and `Save`. Opening `Type` exposed the current available option `case_form`; it was closed without selection. `Date Range` exposed presets from `Today` through `All time`, relative-day fields, and paired `From`/`To` calendars. Its `Apply` remained disabled; both picker and drawer were cancelled unchanged. Sorting changed the active column from default `Updated date` descending to `Name` ascending, then restored `Updated date` descending. Existing template rows and `Actions` were not opened.

## Execution guidance

- Treat existing templates as shared production data; do not edit/delete without explicit approval and rollback plan.
- New template creation persists immediately; requires unique synthetic name, known template type and cleanup verification.
- Search/filter/sort are read-only and safe for general survey.

## Automation guidance

- Stable landmarks: route, heading `Health Form Templates`, create menu, grid structure.
- Mutation tests require controlled synthetic template with known cleanup path.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Grid loaded; synthetic no-match search changed 51 structural rows to three and cleared cleanly. `Filters`, `Type`, and `Date Range` opened and closed unchanged; sort changed to `Name` ascending and restored to `Updated date` descending. Mutation: `None`; template names, creators, and organisation context excluded.

## Open questions

- Explicit no-match behavior beyond structural row reduction remains unspecified.
- Each template type's mandatory fields and workflow steps remain unspecified.
- Archive/restore semantics and whether deletion is permanent remain unspecified.

## Tester notes

[Protected area]
