---
id: connect-dashboard
title: Connect Dashboard
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - dashboard
controls: []
verified_by: []
last_observed: 2026-09-19
---

# Connect Dashboard

## Purpose and context

`Observed`: `Dashboard` → `Connect` navigates to `/paco-connect/dashboard` in dev for role `Super Admin GB`.

## Entry and transitions

1. Expand `Dashboards` from the global navigation.
2. Select `Connect`.
3. Target displays an HTTP 404/loading state.

No product behavior was available for observation.

## Execution guidance

- Authenticate manually as the required role.
- Open `Connect` from `Dashboards`.
- Capture HTTP/error state without entering patient or staff data.

## Automation guidance

- Do not automate product assertions while target remains unavailable.
- A route availability check may be useful after expected behavior is confirmed.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Is `/paco-connect/dashboard` the intended dev route?
- Is the HTTP 404 expected for this role or environment?

## Tester notes

[Protected area]
