---
id: unallocated-cases
title: Unallocated Cases
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - my-case
controls:
  - name: Search this board
    kind: search
  - name: List View
    kind: navigation
  - name: Filters
    kind: filter
  - name: Create new case
    kind: mutation
verified_by: []
last_observed: 2026-09-20
---

# Unallocated Cases

## Purpose and context

`Observed`: `Case Load Management` → `Unallocated` opens `/paco/unallocated` for role `Super Admin GB` in dev.

## Entry and transitions

The board exposes `Search this board`, `List View`, priority/status tabs, sort control, `Filters`, and `Create new case`. A synthetic no-match query produced explicit `No cases found !`; clearing restored the board. Priority/status coverage visited every visible tab and restored `All`: `Mid Priority`, `High Priority`, `Low Priority`, anomalously labeled `white`, and `Emergency`. The sort selector exposed eight options covering age/order, priority, breaching, and case score in both directions; it was closed without selection. `List View` exposed a grid with 36 structural rows and columns `Indicators`, `Date`, `Case Status`, `Priority`, `Case Score`, `Case ID`, `Viewer`, `Patient Name`, `Age`, and `Actions`; `Card View` was then restored. Opening `Filters` exposed `Age`, `Incoming Service`, `Pathway`, `Skills`, `Priority`, `Case Status`, and `PDS Validated Status`, plus `Clear all`, `Cancel`, and disabled `Save`. The drawer was cancelled unchanged.

`Create new case` is a mutation boundary and was not used. Case cards, patient data, live counts, and filter values are omitted.

## Execution guidance

- Treat case cards and patient context as sensitive.
- Use search, tabs, sorting, view switch, and filters only for read-only exploration.
- Require explicit approval and controlled synthetic data before `Create new case` or case actions.

## Automation guidance

- Stable landmarks: route, heading prefix `Unallocated`, `Search this board`, priority tabs, and `Filters`.
- Do not assert live counts or case content without controlled data.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-20. Synthetic no-match search reached explicit empty state and cleared. Every visible priority tab was visited before restoring `All`; sort options inspected unchanged; `List View` opened and `Card View` restored. Filter drawer opened for field inventory and was cancelled unchanged. Mutation: `None`; case, patient, and live-count data excluded.

## Open questions

- Case allocation, status transitions, and board-card actions remain unverified.
- The visible `white` priority label may represent configuration data rather than intended UI terminology; expected label remains unknown.
- Applying alternate sort values remains unverified to avoid unnecessary exposure of live case ordering.

## Tester notes

[Protected area]
