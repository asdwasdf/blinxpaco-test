---
id: comms-analytics
title: Communications Hub Analytics
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - patient-analyser
controls:
  - name: Search Patients...
    kind: search
  - name: Apply
    kind: filter
  - name: Reset Column Widths
    kind: button
  - name: Show All Columns
    kind: button
  - name: Clear Filters
    kind: button
  - name: Export to CSV
    kind: download
verified_by: []
last_observed: 2026-09-21
---

# Communications Hub Analytics

## Purpose and context

`Observed`: `Analytics & Reports` → `Comms Analytics` opens `/commshub/analytics` for role `Super Admin GB` in dev.

## Entry and transitions

Landing state exposes patient search, date range, `Viewing data for` context selection, analytics summaries, grid controls and navigation links. `Email`, `SMS` and `Conversion` summary regions are visible. A synthetic no-match patient query caused no observable structural grid change; `Reset` cleared it. The date picker exposed presets from `All Time` through `Financial Year`, dual calendars, and `Cancel`/`Apply`; it was cancelled unchanged. The context selector exposed `Select All (2)`, two checkbox-backed organisation options, one current selection, and `Apply`; it was closed unchanged without applying. Organisation values are omitted.

The analytics grid exposes campaign/date, patient engagement, email and SMS delivery metrics. Pagination showed page 1 of 3; `Next` opened page 2, then `First` restored page 1. No grid row was opened and no live values were retained.

With explicit approval for download testing, `Export to CSV` was activated once from the default analytics grid. The UI issued `POST /CommsHub/Analytics/exportAllCampaignAnalyticsCsv` and received HTTP 200 with a small JSON response; no `.csv` file appeared in the workspace. Response content and patient/campaign values were not inspected or retained. Context `Apply` remains unused because selector persistence and approved alternate context are not established.

## Execution guidance

- Confirm approved organisation context before applying filters.
- Treat patient search, grid, dates, counts and organisation values as sensitive.
- Obtain evidence before export; downloads require an approved evidence path.

## Automation guidance

- Stable landmarks: `/commshub/analytics`, summary region labels and grid controls.
- Wait for periodic analytics refresh rather than fixed sleep.
- Do not assert live counts without controlled data.

## Evidence

Accessibility observation, external Comms Hub dev, authenticated session associated with Paco `Super Admin GB`, 2026-09-21. Synthetic patient no-match was reset; date presets/calendars were inspected and cancelled unchanged; grid pagination moved page 1 → 2 → 1. `Viewing data for` exposed two checkbox contexts plus `Select All` and `Apply`, then closed unchanged without applying. Approved `Export to CSV` attempt returned HTTP 200 JSON without creating a workspace CSV; response body was not inspected. Mutation: `None`; no row detail, organisation value, live value or PII retained.

## Open questions

- Context selector persistence remains unverified.
- `Export to CSV` returned HTTP 200 JSON rather than an observable workspace `.csv`; whether the response represents an empty export, asynchronous export or UI defect remains unknown.

## Tester notes

[Protected area]
