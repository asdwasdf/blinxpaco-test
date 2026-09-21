---
id: organisation-integrations
title: Organisation Integrations
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/organisation/integrations]
controls:
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Organisation Integrations

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Integrations` opens an integrations page.

## Entry and transitions

Repeated observation after role revalidation produced the same state: only the `Integrations` heading and a disabled `Save` button were accessible; no integration controls, records, empty-state text, loading indicator, or error message were visible.

## Execution guidance

- Safe steps: open page and inspect visible state.
- Stop before any future integration control or enabled `Save`.
- Capture route, heading, disabled state, and console/UI error separately.

## Automation guidance

- Stable landmarks: route, `Integrations`, disabled `Save`.
- Wait for integration content or explicit empty/error state, but do not treat silence as successful loading.
- Integration availability may depend on organisation or permissions.
- No trusted basis for expected integrations.

## Evidence

Accessibility and targeted DOM observation repeated after role revalidation, dev, `Super Admin GB`, 2026-09-19. Blank content with disabled `Save` remained reproducible. Mutation: `None`.

## Open questions

- Whether blank content is intended, permission-based, loading failure, or defect remains unresolved.

## Tester notes

[Protected area]
