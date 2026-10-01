---
id: appointment-books
title: Appointment Books Configuration
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco-connect/configuration/#appointment-books]
controls: []
verified_by: []
last_observed: 2026-09-22
---

# Appointment Books Configuration

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Appointment Books` navigates to a PACO Connect configuration route.

## Entry and transitions

Reverified on 2026-09-22: the route retained the `PACO Connect` shell but exposed no appointment-book configuration, loading status, empty state, terminal UI error, or actionable content after a bounded wait. The earlier HTTP 404 was not surfaced by this navigation observation. Mutation: `None`.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not retry mutations or infer intended configuration from route name.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for either configuration content or explicit terminal error; do not treat persistent `Loading` as success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. `PACO Connect` shell remained blank after a three-second bounded wait; no terminal state or controls appeared. Mutation: `None`.

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Tester notes

[Protected area]
