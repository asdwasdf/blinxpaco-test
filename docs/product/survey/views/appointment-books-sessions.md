---
id: appointment-books-sessions
title: Appointment Books Sessions Configuration
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco-connect/configuration/#clinics]
controls: []
verified_by: []
last_observed: 2026-09-19
---

# Appointment Books Sessions Configuration

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Sessions` navigates to a PACO Connect configuration route.

## Entry and transitions

The route returned HTTP 404 and exposed only a `Loading` status in the accessibility tree. No session configuration, empty state, or actionable control became available.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not infer session behavior or retry actions from the route fragment.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for configuration content or explicit terminal error; persistent `Loading` is not success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, 2026-09-19. HTTP 404 with `Loading`-only state. Mutation: `None`.

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Tester notes

[Protected area]
