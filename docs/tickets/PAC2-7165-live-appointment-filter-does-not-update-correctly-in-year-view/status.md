# Status — PAC2-7165

## Checkpoint

**Phase:** DISCOVER → INGEST

## Tóm tắt

- Bug: Live Appointments filter trong Year View không update đúng
- Root cause: Year view chỉ đếm appointments của hôm nay thay vì cả năm
- Fix đã delivery trên feature branch `pac2-7081-2`
- Developer retest: All Pass trên feature branch

## Bug Details

| Aspect | Broken | Fixed |
|--------|--------|-------|
| Year Live count | 0 (chỉ hôm nay) | Tổng arrived/in-consultation cả năm |
| Logic | Khác Day/Week/Month | Giống Day/Week/Month |

## QA Scope

1. Year view Live count đúng (không phải 0)
2. Year Live = tổng Live các tháng
3. Day/Week/Month Live không đổi
4. Live updates on load/reload

## Progress

- [x] DISCOVER: Import ticket từ Jira
- [ ] INGEST: Tạo feature-location.md
- [ ] ANALYZE: Phân tích requirements
- [ ] LOCATE: Tìm navigation route đến Appointment Book → Year View
- [ ] EXPLORE: Quan sát Live filter behavior
- [ ] TEST_DESIGN: Thiết kế test cases
- [ ] MANUAL_EXECUTE: Thực thi manual test
- [ ] AUTOMATE: Tạo Playwright specs
- [ ] AUTOMATION_EXECUTE: Chạy specs
- [ ] REPORT: Tổng hợp kết quả

## Open Questions

1. Cần xác nhận test data: appointment book nào để test? (developer dùng 111 PC24)
2. Có cần test trên feature branch hay chỉ Fresh Build?

## Next Action

Chạy `paco-requirements` để phân tích ticket thành requirements.
