---
id: quick-pay-404
title: Quick Pay - Route Failure
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

# Quick Pay - Route Failure

## Purpose and context

`Observed`: Quick Pay navigation returns 404 error.

## Entry

1. Dashboard → Quick Pay
2. URL: `/paco-connect/quick-pay/invoices`
3. HTTP Status: 404 Not Found

## Observations

- Quick Pay navigation redirects to PACO Connect but returns 404
- Route may require specific configuration or permissions
- Page title: "PACO Connect"

## Gap

- Quick Pay functionality not accessible - route returns 404

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T04:08:54Z

## Tester notes
