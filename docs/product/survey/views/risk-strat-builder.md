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
  - id: run-20261001-085609-p6-risk-strat-builder-1
    from: risk-strat-builder
    destination_hint: factor lưu ngay vào model đang chọn (không cần Save Model)
    trigger: Create Risk Factor
    relationship: workflow
    context: []
    classification: Verified-by-Mutation
    mutation_boundary: false
    reservation_id: ledger:test-results/product-survey/direct-mutation-20261001/ledger.md#9
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p6-risk-strat-builder-2
    from: risk-strat-builder
    destination_hint: factor bị gỡ khỏi model sau reload
    trigger: Remove factor > Save all changes
    relationship: workflow
    context: []
    classification: Verified-by-Mutation
    mutation_boundary: false
    reservation_id: ledger:test-results/product-survey/direct-mutation-20261001/ledger.md#10
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

## Discovery run-20261001-085609 (part 5 — direct mutation discovery)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `New Model` mở model nháp trống với ô `Model name`; nút `New Model`/`Save Model` có thể bị panel `Models` che (cần `Close panel`) hoặc nằm ngoài viewport ở màn nhỏ.
- `Save Model` khi chỉ nhập tên (`QA-AUTO Model 20261001`): không toast, không lỗi, và model không xuất hiện trong danh sách sau reload.

Gap / Open Question:

- Điều kiện tối thiểu để lưu model (risk factor/threshold?) chưa rõ; không có thông báo validation.

## Discovery run-20261001-085609 (part 6 — Role Groups và Risk Strat factor)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- **Rủi ro dữ liệu (đã xảy ra và đã khôi phục):** `New Model` không chuyển editor sang model mới khi panel `Models` đóng/mở; `Create Risk Factor` **lưu ngay** factor vào model đang chọn sẵn (`Dr Bs Test`, score 4 → 5) với toast `Success — Factor created.`
- `Remove this risk factor from the model` chỉ xóa ở client; phải `Save all changes` (`Save Model`) mới lưu. Sau khi remove + save, model trở lại score 4 và 6 factor gốc.
- Form factor: `FACTOR NAME`, `FACTOR TYPE` (`Clinical Codes` – SNOMED), `BASE SCORE`, scoring (`Thresholds`, occurrence); không bắt buộc chọn code.

Gap / Open Question:

- Model nào đang được chỉnh không hiển thị rõ khi vừa bấm `New Model`; cần làm rõ hành vi `New Model`.
- Audit log server có thể còn ghi 2 thay đổi trên `Dr Bs Test`.

## Tester notes

[Protected area]
