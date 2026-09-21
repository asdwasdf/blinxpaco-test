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
last_observed: 2026-09-19
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

## Tester notes

[Protected area]
