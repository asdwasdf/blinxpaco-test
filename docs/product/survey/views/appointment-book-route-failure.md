---
id: appointment-book-route-failure
title: Appointment Book Route Failure
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - dashboard
controls:
  - name: Appointment Book
    kind: navigation
  - name: Appointment Settings
    kind: navigation
verified_by: []
last_observed: 2026-09-20
---

# Appointment Book Route Failure

## Purpose and context

`Observed`: `Appointment Book` submenu exposes `Appointment Book` and `Appointment Settings`.

## Entry and transitions

Selecting `Appointment Book` opens `/paco-connect/appointment-book`, which returns HTTP 404 under page title `PACO Connect`. Selecting `Appointment Settings` opens `/paco-connect/configuration`, which also returns HTTP 404 under page title `PACO Connect`. No appointment workflow was available.

## Execution guidance

- Confirm intended dev route and role access before testing appointment behavior.
- Do not create bookings until approved test patient, clinician and cleanup are defined.

## Automation guidance

- Do not automate product assertions while route is unavailable.
- Route availability may become regression coverage after expected behavior is confirmed.

## Evidence

Accessibility observation reverified, dev, `Super Admin GB`, 2026-09-20. `/paco-connect/appointment-book` and `/paco-connect/configuration` returned HTTP 404 under page title `PACO Connect`. Mutation: `None`; no PII retained.

## Open questions

- Is `/paco-connect/appointment-book` the intended route?
- Are `/paco-connect/appointment-book` and `/paco-connect/configuration` intended dev routes, or is deployment/routing missing?

## Tester notes

[Protected area]
