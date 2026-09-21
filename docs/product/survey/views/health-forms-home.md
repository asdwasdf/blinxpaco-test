---
id: health-forms-home
title: Health Forms Home
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - health-form-inbox
controls:
  - name: Health Form Designer
    kind: navigation
  - name: Health Form Inbox
    kind: navigation
verified_by: []
last_observed: 2026-09-20
---

# Health Forms Home

## Purpose and context

`Observed`: `/health-forms/` is a landing view linking to `Health Form Designer` and `Health Form Inbox`.

## Entry and transitions

Reached through the `Health Forms` breadcrumb from Inbox. Landing cards navigate to `Health Form Designer` and `Health Form Inbox`. Expanded global navigation exposed the `Health Forms` submenu entries `Inbox`, `Designer`, and `Designer V2`. A synthetic no-match `Search menu...` query hid all menu entries without an explicit empty-state message; clearing restored the menu. `Health Form Designer` was opened for read-only grid inspection; no creation or edit action was used.

## Execution guidance

- Use `Health Form Inbox` for response navigation.
- Confirm test form, expected behavior and cleanup before designer actions.
- Omit user and organisation context from evidence.

## Automation guidance

- Stable landmarks: route and two destination labels.
- Do not automate designer mutation without a controlled form lifecycle.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-20. `Health Form Designer` landing transition verified. Expanded navigation exposed `Inbox`, `Designer`, and `Designer V2`; synthetic no-match menu search hid entries and cleared cleanly. Mutation: `None`; identity and organisation data excluded.

## Open questions

- Designer V2 loading behavior remains separately observed; mutation workflows remain `Not Run`.

## Tester notes

[Protected area]
