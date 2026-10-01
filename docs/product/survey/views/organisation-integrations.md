---
id: organisation-integrations
title: Organisation Integrations
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/integrations
controls:
  - name: Save
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-organisation-integrations-1
    from: organisation-integrations
    destination_hint: cấu hình integration được lưu
    trigger: Save
    relationship: workflow
    context: []
    classification: Open Question
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Organisation Integrations

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `Integrations` opens an integrations page.

## Entry and transitions

Repeated observation after role revalidation produced the same state. Reverified on 2026-09-22: only the `Integrations` heading and a disabled `Save` button were accessible; no integration controls, records, empty-state text, loading indicator, or UI error message were visible. Mutation: `None`.

## Execution guidance

- Safe steps: open page and inspect visible state.
- Stop before any future integration control or enabled `Save`.
- Capture route, heading, disabled state, and console/UI error separately.

## Automation guidance

- Stable landmarks: route, `Integrations`, disabled `Save`.
- Wait for integration content or explicit empty/error state, but do not treat silence as successful loading.
- Integration availability may depend on organisation or permissions.
- No trusted basis for expected integrations.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Blank content with disabled `Save` remained reproducible; no explicit empty/loading/error state appeared. Mutation: `None`.

## Open questions

- Whether blank content is intended, permission-based, loading failure, or defect remains unresolved.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `/paco/configuration/organisation/integrations`: heading `Integrations`; control `Save`.

Gap / Open Question:

- `Save` có thể đổi kết nối hệ thống ngoài (rủi ro EXTERNAL_SIDE_EFFECT).

## Tester notes

[Protected area]
