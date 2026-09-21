---
id: organisation-services
title: Organisation Services
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/organisation/services]
controls:
  - { name: Search Services..., kind: read-only }
  - { name: Remove service, kind: destructive }
  - { name: Add Another, kind: mutation }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Organisation Services

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Services` displays organisation service configuration.

## Entry and transitions

Existing service blocks expose `Remove service`; page also exposes `Search Services...`, `Add Another`, and `Save`. A synthetic no-match query hid existing service blocks and displayed `No services match “__qa_no_match_20260919__”`; `Add Another` and `Save` remained visible. Clearing the query restored four visible service blocks. No service was added, removed, edited, or saved.

## Execution guidance

- Setup: authenticated `Super Admin GB` and selected organisation.
- Safe steps: open page and inspect current structure; search only with non-sensitive text.
- Stop before `Remove service`, `Add Another`, editing a service, or `Save`.
- Capture route, heading, control labels, and redacted empty/error state.

## Automation guidance

- Stable landmarks: route, `Services`, `Search Services...`, `Add Another`, `Save`.
- Wait for service blocks or explicit empty state.
- Service list depends on selected organisation.
- No trusted basis for expected services or validation.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search showed an explicit message; clearing it restored four visible service blocks. Organisation service values omitted. Mutation: `None`.

## Open questions

- Service fields, dependencies, validation, and removal semantics remain unobserved.

## Tester notes

[Protected area]
