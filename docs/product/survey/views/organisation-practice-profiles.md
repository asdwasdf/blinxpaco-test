---
id: organisation-practice-profiles
title: Configuration — Practice Profiles
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

# Configuration — Practice Profiles

## Purpose and context

`Observed` (run-20261001-085609): `Configuration > Organisation > Practice Profiles` mở `/paco/configuration/organisation/practice-profiles`; trang chứa text `Page Not Found` hoặc `Access Denied` cho role `Super Admin GB` (probe chưa tách hai trường hợp).

## Execution guidance

- Đăng nhập thủ công role cần kiểm tra.
- Mở `Configuration`, chọn `Practice Profiles` trong nhóm `Organisation`; ghi heading chính xác.

## Automation guidance

- Landmark: `.p-menuitem` text `Practice Profiles` (lọc visible).
- Chưa có trusted basis để assert trạng thái lỗi là đúng hay defect.

## Evidence

- `test-results/product-survey/run-20261001-085609/outcomes/` (raw, chưa promote)

## Open questions

- Role này có được phép xem Practice Profiles không?

## Tester notes
