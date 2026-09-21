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
last_observed: 2026-09-19
---

# Organisation Locations

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Locations` opens a location register for the selected organisation.

## Entry and transitions

The grid exposes `Assigned Staff`, `Name`, `Address`, `Contact Number`, `Email Address`, `Created Date`, `Created By`, `Updated Date`, `Updated By`, and `Actions`. `Search Locations...` is the visible read-only filter. A synthetic no-match query removed all data rows while retaining the grid header/action structure; no explicit empty-state label appeared. Clearing the query restored location rows. Row details and action controls were not opened because their persistence boundary was not established.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search removed data rows without an explicit empty-state label; clearing it restored rows. Record values omitted. Mutation: `None`.

## Open questions

- Meaning and safety of row `Actions` remain unverified.
- Pagination, sorting, detail transitions, and an explicit empty-state presentation remain unobserved.

## Tester notes

[Protected area]
