---
id: appointment-books-sessions
title: Appointment Books Sessions Configuration
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco-connect/configuration/#clinics
controls: []
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Appointment Books Sessions Configuration

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Sessions` navigates to a PACO Connect configuration route.

## Entry and transitions

Reverified on 2026-09-22: the route returned HTTP 404 and remained on an explicit `Loading sessions` status after a bounded wait. No session configuration, empty state, terminal UI error, or actionable content became available. Mutation: `None`.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not infer session behavior or retry actions from the route fragment.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for configuration content or explicit terminal error; persistent `Loading` is not success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. HTTP 404 with persistent `Loading sessions` after a three-second bounded wait. Mutation: `None`.

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Appointment Books > Sessions` trong Configuration chuyển sang app `/paco-connect/configuration/`; không thấy heading sau 4s.

## Tester notes

[Protected area]
