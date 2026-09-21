---
id: organisation-dx-priorities
title: Organisation DX Priorities
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/paco/configuration/organisation/dx-priorities]
controls:
  - { name: Search Priorities..., kind: read-only }
  - { name: Add Service & Priority, kind: mutation }
  - { name: Remove pair, kind: destructive }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-19
---

# Organisation DX Priorities

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Dx Priority` opens `DX Priorities`, where diagnosis identifiers can be associated with service/priority pairs.

## Entry and transitions

Page exposes `Search Priorities...`, disabled diagnosis identifier fields, repeated `Add Service & Priority` and `Remove pair` controls, and a `Save` button initially disabled. A synthetic no-match query hid the priority blocks and displayed `No priorities match “__qa_no_match_20260919__”`; `Save` remained visible. Clearing the query restored 72 visible `Add Service & Priority` controls. No pair or field was changed.

## Execution guidance

- Safe steps: open page and inspect/search without changing values.
- Stop before `Add Service & Priority`, `Remove pair`, any editable field, or `Save`.
- Capture route, heading, control structure, and disabled `Save` initial state.

## Automation guidance

- Stable landmarks: route, `DX Priorities`, `Search Priorities...`, mutation control names.
- Wait for priority rows and disabled `Save` initial state.
- Data depends on organisation diagnosis configuration.
- Expected mappings and priority semantics lack trusted basis.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Synthetic no-match search showed an explicit message; clearing it restored 72 visible priority-block controls. Diagnosis and priority values omitted. Mutation: `None`.

## Open questions

- Pair validation, save behavior, and effects on case handling remain unobserved.

## Tester notes

[Protected area]
