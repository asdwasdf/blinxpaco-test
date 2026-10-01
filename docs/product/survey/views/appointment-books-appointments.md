---
id: appointment-books-appointments
title: Appointment Books Appointments
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/configuration/#appointments]
controls:
  - { name: Fetch Latest Appointments, kind: unknown }
  - { name: Fetch All Slot Details, kind: unknown }
  - { name: Show Cancelled Bookings, kind: read-only }
  - { name: Search..., kind: read-only }
  - { name: Columns, kind: read-only }
  - { name: Filters, kind: read-only }
verified_by: []
last_observed: 2026-09-22
---

# Appointment Books Appointments

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Appointments` opens an appointment listing sourced from configured appointment systems.

## Entry and transitions

The grid exposed columns `Appointment ID`, `Patient Name`, `Appointment Slot ID`, `Session Name`, `Clinician`, `Appointment Date`, `Booked Via`, `Session Ids`, `Slot Length`, and `Slot Type ID`. Six rows were visible during the 2026-09-22 recheck; live totals are not treated as expected values. Controls included `Fetch Latest Appointments`, `Fetch All Slot Details`, `Show Cancelled Bookings`, `Columns`, and `Filters`. Enabling `Show Cancelled Bookings` previously expanded the loaded grid state from 16 to 46 visible `role=row` elements; disabling it restored 16. Counts include grid structural rows and therefore evidence a filter-state change, not appointment totals. Patient, clinician, session, and identifier values are omitted. Selecting `Appointment ID` previously cycled `aria-sort` through `ascending`, `descending`, and `none`.

On 2026-09-22, `Columns` exposed searchable visibility controls and a `Row Groups` drop area. A synthetic no-match query emptied the column list; clearing restored it. `Filters` exposed searchable entries for appointment, patient, session, clinician, date, booking-source, and slot metadata. A synthetic no-match query hid all filter entries; clearing restored them. Both panels were closed without changing visibility, grouping, or filter values. Fetch controls and row-selection checkboxes were not used. Mutation: `None`.

## Execution guidance

- Safe steps: open the page and inspect redacted grid structure and row count; use local search/filter only with non-sensitive input.
- Stop before `Fetch Latest Appointments` or `Fetch All Slot Details` because external fetch and persistence effects are unknown.
- Capture route, columns, row count, source categories, and redacted loading/error state.

## Automation guidance

- Stable landmarks: route fragment `#appointments`, title `Appointments`, grid column labels, and row count summary.
- Wait for columns plus a terminal data, empty, or error state.
- Appointment content contains patient and staff data; evidence must stay redacted.
- No trusted basis exists for expected appointments, counts, source, or cancellation state.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. Six live rows were present during recheck; values excluded. `Columns` and `Filters` panels each transitioned through synthetic no-match and restored states without changing grid configuration. Earlier `Show Cancelled Bookings` and `Appointment ID` sort transitions remain documented as historical observations. All personal and operational values redacted. Mutation: `None`.

## Open questions

- Fetch side effects, refresh semantics, exact cancelled-booking totals/status values, row selection, pagination, and source synchronization remain unverified.
- Applying field filters, changing column visibility, and row grouping remain unverified; no configuration was changed.

## Tester notes

[Protected area]
