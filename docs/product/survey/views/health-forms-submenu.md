---
id: health-forms-submenu
title: Health Forms Navigation
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Inbox
    kind: navigation
  - name: Designer
    kind: navigation
  - name: Designer V2
    kind: navigation
verified_by: []
last_observed: 2026-09-19
---

# Health Forms Navigation

## Purpose and context

`Observed`: expanding `Health Forms` from `/paco/dashboard` exposes `Inbox`, `Designer` and `Designer V2`.

## Entry and transitions

1. Expand global sidebar.
2. Expand `Health Forms`.
3. Select a child destination.

## Execution guidance

- Use `Inbox` for read-only response exploration.
- Confirm approved test form and cleanup before opening designer mutation flows.
- Keep form and patient content out of reusable evidence.

## Automation guidance

- Stable landmarks: exact submenu labels.
- Designer assertions require controlled test data and known persistence behavior.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. No mutation or PII retained.

## Open questions

- Safe creation/edit and cleanup flow for both designers remains unspecified.

## Tester notes

[Protected area]
