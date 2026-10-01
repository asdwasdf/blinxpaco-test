---
id: set-your-status-dialog
title: Set your status dialog
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls: []
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-set-your-status-dialog-1
    from: set-your-status-dialog
    destination_hint: presence status của user thay đổi
    trigger: Choose status
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-set-your-status-dialog-2
    from: set-your-status-dialog
    destination_hint: dialog đóng; persistence reminder chưa rõ
    trigger: Remind me later
    relationship: workflow
    context: []
    classification: Open Question
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Set your status dialog

## Purpose and context

`Observed` (run-20261001-085609): Modal `Set your status` xuất hiện trên dashboard trong lúc làm việc, chặn toàn bộ UI. Nếu không chọn, hệ thống báo sẽ đặt status `TEST STATUS` sau countdown khoảng 5 phút. Các lựa chọn gồm `Admin`, `Screening`, `Available`, `Away from Desk`, các mức `Lunch`, `TEST STATUS` và `Remind me later`.

## Execution guidance

- Khi modal chặn UI, chọn `Admin` (quy ước tester 2026-10-01).
- Không để countdown tự đặt `TEST STATUS`.

## Automation guidance

- Landmark: dialog name `Set your status`.
- Thêm handler đóng modal trước mỗi bước điều hướng; nút có animation nên cần chờ ổn định hoặc retry.

## Evidence

- `test-results/product-survey/run-20261001-085609/outcomes/` (raw, chưa promote)

## Open questions

- Đây là hành vi hiện tại; chưa đối chiếu requirement.

## Tester notes
