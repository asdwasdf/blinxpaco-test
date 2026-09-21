---
id: quick-pay-route-failure
title: Quick Pay Route Failure
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - dashboard
controls:
  - name: Quick Pay
    kind: navigation
verified_by: []
last_observed: 2026-09-20
---

# Quick Pay Route Failure

## Purpose and context

`Observed`: selecting global `Quick Pay` from the Paco sidebar opens `/paco-connect/quick-pay/invoices`.

## Entry and transitions

The target returned HTTP 404 under page title `PACO Connect`. No invoice workflow or read-only state was available.

## Execution guidance

- Confirm intended dev route and role access before testing invoice behavior.
- Require approved test data and explicit approval before payment, refund, invoice, or account actions.

## Automation guidance

- Do not automate product assertions while route is unavailable.
- Route availability may become regression coverage after expected behavior is confirmed.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-20. `/paco-connect/quick-pay/invoices` returned HTTP 404 under page title `PACO Connect`. Mutation: `None`; no payment, account, invoice, or PII data retained.

## Open questions

- Is `/paco-connect/quick-pay/invoices` the intended dev route, or is deployment/routing missing?

## Tester notes

[Protected area]
