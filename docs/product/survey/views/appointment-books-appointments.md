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
last_observed: 2026-09-19
---

# Appointment Books Appointments

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Appointments` opens an appointment listing sourced from configured appointment systems.

## Entry and transitions

The grid exposed columns `Appointment ID`, `Patient Name`, `Appointment Slot ID`, `Session Name`, `Clinician`, `Appointment Date`, `Booked Via`, and `Session Ids`. Seven rows were visible in the initial observation. Controls included `Fetch Latest Appointments`, `Fetch All Slot Details`, `Show Cancelled Bookings`, `Search...`, `Columns`, and `Filters`. Enabling `Show Cancelled Bookings` expanded the loaded grid state from 16 to 46 visible `role=row` elements; disabling it restored 16. Counts include grid structural rows and therefore are evidence of a filter-state change, not appointment totals. Patient, clinician, session, and identifier values are omitted. Selecting `Appointment ID` cycled `aria-sort` through `ascending`, `descending`, and `none` while the summary remained `Rows: 7`, `Total Rows: 7`. Fetch controls were not used.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Seven appointment rows observed initially. `Show Cancelled Bookings` changed visible grid structure from 16 to 46 `role=row` elements and returned to 16 when disabled. `Appointment ID` sorting cycled ascending/descending/none without changing the 7-row summary. All personal and operational values redacted. Mutation: `None`.

## Open questions

- Fetch side effects, refresh semantics, exact cancelled-booking totals/status values, pagination, and source synchronization remain unverified.

## Tester notes

[Protected area]
