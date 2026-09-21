---
id: user-portal-route-failure
title: User Portal Route Failure
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - dashboard
controls: []
verified_by: []
last_observed: 2026-09-20
---

# User Portal Route Failure

## Purpose and context

`Observed`: global `User Portal` opens `/paco-connect/user-training-portal`, which returns HTTP 404 under page title `PACO Connect`.

## Entry and transitions

No portal controls or training workflow were available.

## Execution guidance

- Confirm intended route and role access before further testing.
- Do not infer a product defect from route availability alone.

## Automation guidance

- Do not automate product assertions while route is unavailable.
- Add route availability coverage only after expected behavior is confirmed.

## Evidence

Accessibility observation reverified, dev, `Super Admin GB`, 2026-09-20. `/paco-connect/user-training-portal` still returned HTTP 404 under page title `PACO Connect`. Mutation: `None`; no PII retained.

## Open questions

- Is `/paco-connect/user-training-portal` the intended dev destination?

## Tester notes

[Protected area]
