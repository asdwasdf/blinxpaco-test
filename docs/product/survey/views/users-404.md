---
id: users-404
title: Users - Route Failure
roles:
  - Super Admin GB
environment: dev
status: Observed
routes: []
controls: []
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# Users - Route Failure

## Purpose and context

`Observed`: Users navigation returns 404 error.

## Entry

1. Dashboard → Users
2. URL: `/paco-connect/user-training-portal`
3. HTTP Status: 404 Not Found

## Observations

- Users navigation redirects to PACO Connect but returns 404
- Route may require specific configuration or permissions
- Page title: "PACO Connect"

## Gap

- Users functionality not accessible - route returns 404

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T04:08:31Z

## Tester notes
