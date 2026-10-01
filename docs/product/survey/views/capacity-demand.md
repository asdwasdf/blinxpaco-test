---
id: capacity-demand
title: Capacity & Demand
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Notifications
    kind: navigation
  - name: Timestamp information
    kind: information
  - name: Date Range
    kind: filter
  - name: Search observation
    kind: search
verified_by: []
last_observed: 2026-09-22
---

# Capacity & Demand

## Purpose and context

`Observed`: `Analytics & Reports` → `Capacity & Demand` opens `/capacity-demand/` in dev for role `Super Admin GB`.

## Entry and transitions

1. Expand `Analytics & Reports` from global navigation.
2. Select `Capacity & Demand`.
3. Landing state now exposes populated analytical cards for clinician capacity, consultation observations, planned-versus-actual time, session loss, and staff/session data. Organisation metric values are omitted.
4. Global controls include organisation selection, `Date Range`, and chart alignment controls; card-level controls include observation and session selectors.
5. Opening `Date Range` exposed presets from `All Time` through relative, calendar-year, financial-year, and future ranges; relative-day inputs; start/end inputs; dual calendars; `Cancel`; and `Apply`. `Cancel` closed it without changing `All Time`.
6. Opening the organisation selector exposed `Select All` plus two configured organisations. A synthetic no-match search hid every option; `Cancel` restored the existing single selection without applying changes. Organisation names and codes are omitted.
7. `Deselect All` on the clinician-capacity card changed to `Select All`; selecting it restored every role series. This changed only the chart display and did not persist data.
8. The chart/table toggle opened `/capacity-demand/data-table-new/`. The table view exposed saved-report navigation, report search, `Consultations with Observations` and `Consultations without Observations` tabs, grid search, `Advanced Search`, `Reset View`, `Expand All`, `Collapse All`, and grid-side `Columns`/`Filters`. The without-observations tab exposed grouped appointment columns; business values are omitted.
9. `Advanced Search` opened `Advanced Patient Search` with `Tutorial`, `Existing version`, `Analyse`, `Import`, a reference-report selector, `Add Rule Group`, `Deleted Patients Excluded`, `Cancel`, and `Search`. It was cancelled without constructing or running a query. The observations tab and chart view were then restored.

`Save Report`, `Import`, report selection, table search, query execution, column/filter changes, row expansion, and data export were not used. Mutation: `None`.

## Execution guidance

- Authenticate manually as the required role.
- Open the view through `Analytics & Reports`.
- Record loading/data availability without retaining organisation data.

## Automation guidance

- Stable landmark: `/capacity-demand/` route and timestamp label.
- Do not assert populated metrics until test data and expected behavior are known.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. Populated chart view, organisation-selector no-match state, full date-range chooser, clinician-role display toggle, table view, both consultation tabs, and cancelled advanced-search dialog were observed. Organisation, patient, clinician, appointment, and metric values excluded. Mutation: `None`.

## Open questions

- Observation selector filtering, session selection, saved-report behavior, table search, grid-side panels, row expansion, and query execution remain unverified.
- `Save Report` and `Import` are mutation boundaries and require approval.
- Chart semantics and expected metric values lack a trusted baseline.

## Tester notes

[Protected area]
