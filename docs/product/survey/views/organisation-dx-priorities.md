---
id: organisation-dx-priorities
title: Organisation DX Priorities
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/dx-priorities
controls:
  - name: Search Priorities...
    kind: read-only
  - name: Add Service & Priority
    kind: mutation
  - name: Remove pair
    kind: destructive
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-organisation-dx-priorities-1
    from: organisation-dx-priorities
    destination_hint: mapping dx priority thay đổi
    trigger: Add Service & Priority
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-organisation-dx-priorities-2
    from: organisation-dx-priorities
    destination_hint: mapping dx priority thay đổi
    trigger: Remove pair
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-organisation-dx-priorities-3
    from: organisation-dx-priorities
    destination_hint: dx priorities được lưu
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
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

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/organisation/dx-priorities`: heading `DX Priorities`; control `Remove pair`, `Add Service & Priority`, `Save`.

## Tester notes

[Protected area]
