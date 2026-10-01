---
id: organisation-inbound-priority-flow
title: Organisation Inbound Priority Flow
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/inbound-priority-flow
controls:
  - name: Preview walk
    kind: read-only
  - name: Reset to default
    kind: destructive
  - name: Add
    kind: mutation
  - name: Delete
    kind: destructive
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-organisation-inbound-priority-flow-1
    from: organisation-inbound-priority-flow
    destination_hint: inbound priority rules thay đổi
    trigger: Add
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-inbound-priority-flow-2
    from: organisation-inbound-priority-flow
    destination_hint: inbound priority rules thay đổi
    trigger: Delete
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-inbound-priority-flow-3
    from: organisation-inbound-priority-flow
    destination_hint: inbound priority rules thay đổi
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Organisation Inbound Priority Flow

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Inbound Priority Flow` opens an `Inbound priority rules engine` for the question pathway used when manually creating an inbound case and mapping outcomes to organisation priorities.

## Entry and transitions

Page shows flow settings, an entry question, question and outcome lists, selected-node prompt/help/response type, and option branches with next targets. Controls include `Preview walk`, `Reset to default`, `Add`, `Delete`, and `Save`. `Preview walk` opened a read-only `Inbound case` dialog at question `01` with `Yes`, `No`, and `Cancel`. The `Yes` branch was previously observed advancing to question `02`. Reverified on 2026-09-22: selecting `No` reached a terminal preview state exposing `End preview`, `Back`, and `Cancel`; `Back` returned to question `01`, and `Cancel` closed the dialog. Clinical text and mapped outcomes are omitted. No configuration field or mutation control was used. Mutation: `None`.

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

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Preview question `01` → `No` → terminal state with `End preview` → `Back` → `Cancel` completed without editing configuration. Clinical wording and organisation mapping values omitted. Mutation: `None`.

## Open questions

- Full preview branches, draft persistence outside preview, publish semantics, validation, and correct clinical branching remain unverified.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/organisation/inbound-priority-flow`: `Inbound priority rules engine` với `Questions`/`Outcomes`; control `Save`, `Add`, `Delete`.

Gap / Open Question:

- Thay đổi rule ảnh hưởng ưu tiên case inbound; cần rule test thuộc sở hữu và approval cleanup.

## Tester notes

[Protected area]
