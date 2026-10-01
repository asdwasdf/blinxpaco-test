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
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-health-forms-submenu-1
    from: health-forms-submenu
    to: health-forms-designer
    trigger: Designer
    relationship: cross-module handoff
    context:
      - Health Forms app
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
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

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- Submenu `Health Forms`: `Inbox`, `Designer`, `Designer V2`.

## Tester notes

[Protected area]
