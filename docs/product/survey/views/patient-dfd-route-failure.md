---
id: patient-dfd-route-failure
title: Patient DFD Route Failure
roles:
  - Super Admin GB
environment: dev
status: Open Question
routes:
  - configuration
controls: []
verified_by: []
last_observed: 2026-09-19
---

# Patient DFD Route Failure

## Purpose and context

`Observed`: `Configuration` → `Patient` → `DFD` navigation attempted via `/paco/configuration/patient/dfd`, which returns HTTP 404 with page title `Page Not Found`.

## Entry and transitions

No DFD configuration controls or workflow available.

## Execution guidance

- Confirm intended route pattern and role access before further testing.
- Do not infer product defect from route availability alone.

## Automation guidance

- Do not automate product assertions while route unavailable.
- Add route availability coverage only after expected behavior confirmed.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Is `/paco/configuration/patient/dfd` the intended dev route pattern for Patient DFD config?
- Does DFD config exist under different route structure?

## Tester notes

[Protected area]
