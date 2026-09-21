---
id: comms-patient-manager
title: Communications Hub Patient Manager
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - comms-hub-submenu
controls:
  - name: Lists
    kind: tab
  - name: Patients
    kind: tab
  - name: Date Range
    kind: filter
  - name: All Tags
    kind: filter
  - name: Search Patients
    kind: search
  - name: Search any data in the table
    kind: search
  - name: Columns
    kind: grid-panel
  - name: Filters
    kind: grid-panel
  - name: Create List
    kind: mutation
  - name: Add to Existing List
    kind: mutation
verified_by: []
last_observed: 2026-09-21
---

# Communications Hub Patient Manager

## Purpose and context

`Observed`: external Comms Hub dev exposes patient management at `/commshub/patient-management`.

## Entry and transitions

Default `Lists` state contains `Lists` and `Patients` tabs, date range, `Viewing data for` context selection and tag filters. The context selector exposed `Select All (2)`, two checkbox-backed organisation options, one current selection, and `Apply`; it was closed unchanged without applying. Organisation values are omitted. Global `Search Patients...` accepted a synthetic no-match query without an observable structural result change; query was cleared. The date picker exposed presets `All Time`, `Today`, `Yesterday`, `Last 7 Days`, `Last 30 Days`, `Next 30 Days`, `This Week`, `Next 2 Weeks`, `Month To Date`, `This Month`, `This Year`, `Year to Date`, `Financial Year`, and `Custom Range`, plus dual calendars and `Cancel`/`Apply`; it was cancelled unchanged. The Lists grid exposes multi-organisation flag, recipient-list ID, name, description, tags, creator organisation, shared organisations and created/updated dates, grouped as `Non-Shared Lists` and `Shared Lists`. Its `Columns` and `Filters` panels were opened and closed unchanged. A synthetic no-match grid query caused no observable filtered-total change and was cleared.

`Patients` exposed a grid search, `Select All`, `Reset Column Widths`, `Show All Columns`, `Clear Filters`, `Columns`, and `Filters`. A synthetic no-match grid query did not change the visible filtered total; query was cleared. `Columns` exposed patient identity/contact/address, tag, vaccination, verification, communication and audit field names. `Filters` exposed searchable per-column filter controls. Both panels were closed unchanged, then `Lists` restored. `Create List` and `Add to Existing List` remained disabled because no patients were selected. No patient row or tag was opened.

## Execution guidance

- Treat patient, list, tag, date and organisation values as sensitive.
- Confirm approved test patient and action semantics before opening records or applying persistent context.
- Unknown unlabeled controls remain outside safe execution scope.

## Automation guidance

- Stable landmarks: route and exact `Lists`/`Patients` tabs.
- Avoid patient data in fixtures, logs and screenshots.

## Evidence

Accessibility observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. Synthetic searches cleared; date presets/calendars inspected and cancelled unchanged; `Viewing data for` exposed two checkbox contexts plus `Select All` and `Apply`, then closed unchanged without applying; `Columns` and `Filters` inspected unchanged on both Lists and Patients grids; `Lists` restored. Mutation: `None`; no patient, list, tag, organisation or live-count values retained.

## Open questions

- Patient record actions, list membership changes, tag selection, applied date filtering and context persistence remain unverified.
- Global patient search and both Lists/Patients grid searches accepted synthetic input but caused no observable result reduction; trigger and matching semantics remain unknown.

## Tester notes

[Protected area]
