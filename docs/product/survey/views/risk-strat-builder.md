---
id: risk-strat-builder
title: Risk Strat Builder
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - configuration
controls:
  - name: New Model
    kind: mutation
  - name: Delete Model
    kind: destructive
  - name: Save Model
    kind: mutation
  - name: Models
    kind: navigation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-risk-strat-builder-1
    from: risk-strat-builder
    destination_hint: risk model mới
    trigger: New Model
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-risk-strat-builder-2
    from: risk-strat-builder
    destination_hint: risk model thay đổi
    trigger: Add Risk Factor
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-risk-strat-builder-3
    from: risk-strat-builder
    destination_hint: risk model được lưu
    trigger: Save Model
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-risk-strat-builder-4
    from: risk-strat-builder
    destination_hint: risk model bị xóa (DELETE)
    trigger: Delete Model
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Risk Strat Builder

## Purpose and context

`Observed`: `Configuration` → `Clinical Config` → `Risk Strat Builder` opens `/paco/configuration/clinical-config/risk-strat-builder`.

## Entry and transitions

The page exposes a Models panel, existing model editor structure and `New Model`, `Delete Model`, `Save Model` actions. The `☰ Models` control and `Close panel` toggle the panel presentation; reopening and closing did not change the selected model or expose a save prompt. Existing model names and values are omitted.

## Execution guidance

- Use a uniquely named synthetic model for mutation coverage.
- Record original selection and delete only the synthetic model during cleanup.
- Never edit/delete an existing shared model during general survey.

## Automation guidance

- Stable landmarks: route, `Models`, `New Model`, `Delete Model`, `Save Model`.
- Mutation tests require unique fixture naming and guaranteed cleanup.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Existing model values omitted.

Mutation verified: created uniquely named empty synthetic model, observed score `0`, then deleted it through confirmation. Cleanup verified by absence of model name. See `docs/product/survey/mutation-ledger/2026-09-19-super-admin-gb.md`.

## Open questions

- Required fields and whether deletion has confirmation/usage constraints remain unverified.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/clinical-config/risk-strat-builder`: `Models`, model mẫu `My BMI Risk Model`; control `New Model`, `Add Risk Factor`, `Save Model`, `Delete Model`, `Save`.

## Tester notes

[Protected area]
