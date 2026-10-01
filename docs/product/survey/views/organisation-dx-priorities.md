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
last_observed: 2026-09-22
---

# Organisation DX Priorities

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Dx Priority` opens `DX Priorities`, where diagnosis identifiers can be associated with service/priority pairs.

## Entry and transitions

Page exposes `Search Priorities...`, disabled diagnosis identifier fields, repeated `Add Service & Priority` and `Remove pair` controls, and a `Save` button initially disabled. Reverified on 2026-09-22: a synthetic no-match query hid the priority blocks and displayed an explicit `No priorities match` message containing the query; `Save` remained visible and disabled. Clearing restored the configured blocks. Exact counts and configured values are intentionally omitted. No pair or field was changed. Mutation: `None`.

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

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Synthetic no-match search showed an explicit message and disabled `Save`; clearing restored the configured blocks. Diagnosis, priority values, and exact counts omitted. Mutation: `None`.

## Open questions

- Pair validation, save behavior, and effects on case handling remain unobserved.

## Tester notes

[Protected area]
