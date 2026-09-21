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
last_observed: 2026-09-19
---

# Organisation Sharing Agreements

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Sharing Agreements` displays organisations with which the current organisation shares data.

## Entry and transitions

The read-only grid exposes `ODS Code`, `Name`, and `Address`; previously observed row content also included access categories, status, and an identifier. Observed rows had `active` status and access categories including prescribing, consultations, documents, and codings. No dedicated search field or pagination control was visible. Selecting the `ODS Code` header did not expose `aria-sort` or a visible sort indicator, so sortable behavior is not established. Organisation and agreement identifiers are omitted from this artifact.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. `ODS Code` header selection produced no observable sort state. Organisation names, addresses, ODS codes, and IDs redacted from documentation. Mutation: `None`.

## Open questions

- Source, approval lifecycle, and management controls for agreements remain unobserved.
- Whether status or access columns support filtering/sorting remains unverified.

## Tester notes

[Protected area]
