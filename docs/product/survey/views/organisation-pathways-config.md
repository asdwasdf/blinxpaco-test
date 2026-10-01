---
id: organisation-pathways-config
title: Configuration — Pathways Config
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - organisation-general
controls: []
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Configuration — Pathways Config

## Purpose and context

`Observed` (run-20261001-085609): `Configuration > Organisation > Pathways Config` mở `/paco/configuration/organisation/pathways` và hiển thị `Page Not Found` cho role `Super Admin GB` (Observed). Mục menu vẫn hiển thị.

## Execution guidance

- Đăng nhập thủ công role `Super Admin GB`.
- Mở `Configuration` rồi chọn `Pathways Config` trong nhóm `Organisation`.
- Ghi lại heading và URL; không thao tác thêm.

## Automation guidance

- Landmark: menu item `.p-menuitem` text `Pathways Config` (lọc visible vì có bản ẩn trùng text).
- Chờ heading xuất hiện; chưa có trusted basis để assert `Page Not Found` là đúng hay lỗi.

## Evidence

- `test-results/product-survey/run-20261001-085609/outcomes/` (raw, chưa promote)

## Open questions

- Đây là hành vi hiện tại; chưa đối chiếu requirement.

## Tester notes
