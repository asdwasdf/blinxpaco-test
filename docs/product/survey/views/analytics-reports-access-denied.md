---
id: analytics-reports-access-denied
title: Analytics and Reports — Access Denied
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - analytics-reports-scr-unauthorized
controls: []
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Analytics and Reports — Access Denied

## Purpose and context

`Observed` (run-20261001-085609): Tab `Prescriptions` (`/paco/analytics-reports/prescriptions`) và `NCRS` (`/paco/analytics-reports/ncrs-reports`) hiển thị `Access Denied` cho role `Super Admin GB` (Observed).

## Execution guidance

- Đăng nhập thủ công role cần kiểm tra.
- Mở `Analytics & Reports > Reports`, chọn tab `Prescriptions` hoặc `NCRS`.
- Ghi heading; không cố thay đổi quyền.

## Automation guidance

- Landmark: tab text `Prescriptions`/`NCRS`, heading `Access Denied`.
- Chưa có requirement về quyền của role này; không assert là defect.

## Evidence

- `test-results/product-survey/run-20261001-085609/outcomes/` (raw, chưa promote)

## Open questions

- Đây là hành vi hiện tại; chưa đối chiếu requirement.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- Thêm: tab `Patient Cases` (`/paco/analytics-reports/patient-cases`) cũng `Access Denied`.

## Tester notes
