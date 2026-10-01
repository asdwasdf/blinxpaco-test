---
id: organisation-locations
title: Organisation Locations
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/locations
controls:
  - name: Search Locations...
    kind: read-only
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Organisation Locations

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Locations` opens a location register for the selected organisation.

## Entry and transitions

The grid exposes `Assigned Staff`, `Name`, `Address`, `Contact Number`, `Email Address`, `Created Date`, `Created By`, `Updated Date`, `Updated By`, and `Actions`. `Search Locations...` is the visible read-only filter. A synthetic no-match query removed all data rows while retaining the grid header/action structure; no explicit empty-state label appeared. Clearing the query restored location rows.

On 2026-09-22, `Created Date` sorting cycled none → ascending → descending → none; `Updated Date` was initially descending. The `Created Date` column menu exposed `general`, `filter`, and `columns`. Its distinct-value filter search produced explicit `No matches.` for a synthetic query and restored after clearing. The columns panel listed all ten fields. The menu was dismissed without applying filters, changing visibility, pinning, sizing, or resetting. Row details and `Actions` were not opened because their persistence boundary was not established. Mutation: `None`.

## Execution guidance

- Setup: authenticated `Super Admin GB` context and selected organisation.
- Safe steps: open page, inspect headings/columns, use search only with non-sensitive text.
- Stop before any control under `Actions` or any create/edit/delete flow.
- Capture route, heading, redacted column structure, and empty/loading/error state if encountered.

## Automation guidance

- Stable landmarks: route, `Locations` heading, `Search Locations...`, grid column headers.
- Wait for grid rows or an explicit empty state after navigation/search.
- Row counts and contents depend on selected organisation.
- No trusted basis yet for expected row count or specific records.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. `Created Date` sort cycled ascending/descending/none; its value-filter no-match state and full column inventory were inspected, then restored unchanged. Record values omitted. Mutation: `None`.

## Open questions

- Meaning and safety of row `Actions` remain unverified.
- Pagination, detail transitions, and an explicit page-search empty-state presentation remain unobserved.
- Additional field sorts and applied grid filters remain unverified.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/organisation/locations`: heading `Locations`, có 3 row.

## Tester notes

[Protected area]
