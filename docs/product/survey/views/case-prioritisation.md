---
id: case-prioritisation
title: Case Prioritisation
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - configuration
controls:
  - name: View audit
    kind: navigation
  - name: Add Another
    kind: mutation
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-09-19
---

# Case Prioritisation

## Purpose and context

`Observed`: `Configuration` → `Case Prioritisation` opens `/paco/configuration/case-prioritisation`.

## Entry and transitions

The page exposes existing rule configuration, `View audit`, `Add Another` and `Save`. `View audit` opened `Case Prioritisation Audit` with `Refresh` and the empty state `No audit events found.` Closing the dialog returned to the unchanged configuration page. `Refresh` was not used because its external retrieval behavior was not established. Sensitive organisation values are omitted.

## Execution guidance

- Read audit and existing structure before mutation.
- Add/save only with a domain-valid synthetic rule and explicit cleanup value.
- Record before/after state in mutation ledger.

## Automation guidance

- Stable landmarks: route, heading and action labels.
- Mutation regression needs controlled rule fixtures and restoration.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Audit dialog opened, showed no events, and closed. Mutation: `None`.

## Open questions

- Valid rule semantics, precedence, audit refresh behavior, and safe cleanup remain unspecified.

## Tester notes

[Protected area]
