# PAC2-7669 — Requirements

**Ticket:** PAC2-7669 — Poor Performance in Scheduler Configuration Clinician Selection
**Source:** Jira import + video attachment
**Date:** 2026-10-01

## Summary

Khi proxy được bật, việc chọn clinician trong Scheduler Configuration rất chậm (5-10 giây) hoặc gây freeze/crash trang.

## Root Cause (Dev Confirmed)

- Proxy DB views không được index cho các queries
- Selection component fetch sessions từng row một
- Re-compute nặng trên mỗi render

## Fix (Dev Deployed 2026-09-09)

- Memory leak đã được fix
- Redundant API fetching đã được loại bỏ

## Observable Requirements

### REQ-7669-001: Clinician Selection Performance
- **Classification:** `Confirmed` (Jira comment + video evidence)
- **Claim:** Clinician selection trong Scheduler Configuration không còn chậm đáng kể sau khi fix deploy
- **Trigger:** Mở Scheduler Configuration, chọn một clinician từ dropdown
- **Expected:** Clinician xuất hiện gần như ngay lập tức (< 1 giây)
- **Context:** Cả EMIS và PACO Connect slots

### REQ-7669-002: No Page Timeout
- **Classification:** `Confirmed` (Jira comment)
- **Claim:** Không còn popup "waiting for this page to respond"
- **Trigger:** Chọn clinician trong Scheduler Configuration
- **Expected:** Trang không bị freeze hoặc timeout

### REQ-7669-003: No Crash
- **Classification:** `Confirmed` (Jira description)
- **Claim:** Trang không crash khi chọn clinician
- **Trigger:** Chọn clinician nhiều lần liên tiếp
- **Expected:** UI vẫn responsive, không crash

## Known Constraints

- Issue xảy ra khi **proxy được bật** (điều kiện tiên quyết để reproduce)
- Fix đã deploy trên dev environment
- Cần verify với cả EMIS và PACO Connect organizations

## Missing Information

- Acceptance Criteria chi tiết từ Jira không được cung cấp
- Specific performance benchmarks (vd: < 500ms, < 1s) không được nêu

## QA Scope

- Verify fix hoạt động trên dev environment
- Test với proxy bật
- Test với cả EMIS và PACO Connect
- Measure actual response time để xác nhận improvement

## Open Questions

- Có baseline performance metrics trước fix để so sánh không?
- Có specific SLA/performance target không?

## Tester notes

[Protected area]
