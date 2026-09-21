---
id: organisation-inbound-priority-flow
title: Organisation Inbound Priority Flow
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/organisation/inbound-priority-flow]
controls:
  - { name: Preview walk, kind: read-only }
  - { name: Reset to default, kind: destructive }
  - { name: Add, kind: mutation }
  - { name: Delete, kind: destructive }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Organisation Inbound Priority Flow

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Inbound Priority Flow` opens an `Inbound priority rules engine` for the question pathway used when manually creating an inbound case and mapping outcomes to organisation priorities.

## Entry and transitions

Page shows flow settings, an entry question, question and outcome lists, selected-node prompt/help/response type, and option branches with next targets. Controls include `Preview walk`, `Reset to default`, `Add`, `Delete`, and `Save`. `Preview walk` opened a read-only `Inbound case` dialog at question `01` with `Yes`, `No`, and `Cancel`. Selecting `Yes` advanced to question `02`, which added `Back`; `Back` returned to question `01`, and `Cancel` closed the dialog. No configuration field or mutation control was used.

## Execution guidance

- Safe steps: open page, inspect visible graph/list structure, and walk/cancel the isolated `Preview walk` dialog.
- Stop before `Reset to default`, `Add`, `Delete`, editing fields/branches, or `Save`.
- Capture route, engine heading, redacted node categories, and mutation boundary.

## Automation guidance

- Stable landmarks: route, `Inbound priority rules engine`, `Flow settings`, `Questions`, `Outcomes`.
- Wait for entry node and both lists.
- Flow depends on organisation priorities and domain rules.
- Assertions about correct branching/outcomes lack trusted requirements.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Preview question `01` → `Yes` → question `02` → `Back` → `Cancel` completed without editing configuration. Clinical wording recorded only where needed to identify state; organisation mapping values omitted. Mutation: `None`.

## Open questions

- Full preview branches, draft persistence outside preview, publish semantics, validation, and correct clinical branching remain unverified.

## Tester notes

[Protected area]
