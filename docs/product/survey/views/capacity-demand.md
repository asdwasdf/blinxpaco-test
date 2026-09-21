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
last_observed: 2026-09-19
---

# Capacity & Demand

## Purpose and context

`Observed`: `Analytics & Reports` → `Capacity & Demand` opens `/capacity-demand/` in dev for role `Super Admin GB`.

## Entry and transitions

1. Expand `Analytics & Reports` from global navigation.
2. Select `Capacity & Demand`.
3. Landing state now exposes populated analytical cards for clinician capacity, consultation observations, planned-versus-actual time, session loss, and staff/session data. Organisation metric values are omitted.
4. Global controls include organisation selection, `Date Range`, and chart alignment controls; card-level controls include observation and session selectors.
5. Opening `Date Range` exposed a calendar with start/end inputs plus `Cancel` and `Apply`. `Cancel` closed it without changing the `All Time` selection.

Some card controls were present in the DOM but outside the visible viewport during this bounded pass. They were not forced or changed.

## Execution guidance

- Authenticate manually as the required role.
- Open the view through `Analytics & Reports`.
- Record loading/data availability without retaining organisation data.

## Automation guidance

- Stable landmark: `/capacity-demand/` route and timestamp label.
- Do not assert populated metrics until test data and expected behavior are known.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Populated analytics were visible; `Date Range` opened and was cancelled with `All Time` unchanged. Organisation values and identities excluded. Mutation: `None`.

## Open questions

- Observation/session selector empty and filtered states remain unverified because controls were outside the visible viewport during this pass.
- Chart semantics and expected metric values lack a trusted baseline.

## Tester notes

[Protected area]
