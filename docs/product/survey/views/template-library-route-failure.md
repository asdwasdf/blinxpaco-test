---
id: template-library-route-failure
title: Template Library Route Failure
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

# Template Library Route Failure

## Purpose and context

`Observed`: `Configuration` → `Clinical Config` → `Template Library` opens `/paco/configuration/clinical-config/template-library`, which returns HTTP 404 with page title `Page Not Found`.

## Entry and transitions

No template library controls or workflow available.

## Execution guidance

- Confirm intended route and role access before further testing.
- Do not infer product defect from route availability alone.

## Automation guidance

- Do not automate product assertions while route unavailable.
- Add route availability coverage only after expected behavior confirmed.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Is `/paco/configuration/clinical-config/template-library` the intended dev destination?

## Tester notes

[Protected area]
