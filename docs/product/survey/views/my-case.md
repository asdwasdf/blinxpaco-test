---
id: my-case
title: My Case
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls: []
verified_by: []
last_observed: 2026-09-20
---

# My Case

## Purpose and context

`Observed`: `Case Load Management` → `My Case` opens `/paco/my-case`.

## Entry and transitions

Current empty state says there are no new cases and no active case assigned to the user. No case data or actions were available.

## Execution guidance

- Use approved synthetic cases when testing non-empty workflows.
- Treat case and patient content as sensitive.
- Capture empty-state text without user identity.

## Automation guidance

- Stable landmarks: route and two empty-state messages.
- Non-empty assertions require controlled case assignment.

## Evidence

Accessibility observation reverified after manual re-authentication, dev, `Super Admin GB`, 2026-09-20. Empty state remained unchanged. Mutation: `None`; no PII retained.

## Open questions

- Assignment, status transition and case closure flows remain unverified.

## Tester notes

[Protected area]
