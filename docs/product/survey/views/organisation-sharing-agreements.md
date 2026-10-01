---
id: organisation-sharing-agreements
title: Organisation Sharing Agreements
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/sharing-agreements
controls: []
verified_by: []
last_observed: 2026-09-22
---

# Organisation Sharing Agreements

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Sharing Agreements` displays organisations with which the current organisation shares data.

## Entry and transitions

The read-only grid exposes `ODS Code`, `Name`, `Address`, `Access`, `Status`, and `ID`. Observed rows had `active` status and access categories including prescribing, consultations, documents, and codings. No dedicated page search or pagination control was visible. Selecting the `Status` header did not expose `aria-sort`, so sortable behavior remains unestablished.

Keyboard-opening the `Status` column menu exposed `general` and `columns` tabs. `general` contained `Pin Column`, `Autosize This Column`, `Autosize All Columns`, and `Reset Columns`. `columns` listed all six fields with checked visibility controls and a search box. A synthetic no-match search emptied the column list; clearing restored it. The menu was dismissed without pinning, resizing, resetting, or changing visibility. Organisation and agreement identifiers are omitted. Mutation: `None`.

## Execution guidance

- Setup: authenticated `Super Admin GB` context and selected organisation.
- Safe steps: open page and inspect redacted column/status/access structure.
- Stop before any future agreement create/edit/revoke control; none was used in this observation.
- Capture route, headings, column structure, status categories, and empty/error state without identifiers.

## Automation guidance

- Stable landmarks: route, `Sharing Agreements`, `Organisations you share data with`, grid headers.
- Wait for rows or an explicit empty state.
- Agreement records depend on selected organisation and may be sensitive.
- No trusted basis yet for expected counterpart count, exact organisations, or access set.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, reverified 2026-09-22. `Status` header selection produced no observable sort state. Its column menu `general`/`columns` tabs and a synthetic no-match column search were inspected and restored unchanged. Organisation names, addresses, ODS codes, and IDs redacted. Mutation: `None`.

## Open questions

- Source, approval lifecycle, and management controls for agreements remain unobserved.
- `Status` did not expose a sort state; field-value filtering remains unavailable or unverified because its menu exposed only `general` and `columns` tabs.

## Tester notes

[Protected area]
