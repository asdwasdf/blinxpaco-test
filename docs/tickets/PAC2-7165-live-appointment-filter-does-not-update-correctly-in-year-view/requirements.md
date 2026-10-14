---
ticket_id: PAC2-7165
title: "Live appointment filter does not update correctly in Year View"
source: ticket/PAC2-7165-live-appointment-filter-does-not-update-correctly-in-year-view/ticket.md
source_revision: "2026-10-07T15:39:35Z"
import_sha256: null
created: 2026-10-07T15:43:00Z
classification: Bug Fix
---

# Requirements — PAC2-7165

## Summary

Bug: Live Appointments filter trong Year View không update đúng. Year Live = 0 thay vì tổng Live của cả năm.

## Root Cause

Year view Live chỉ đếm appointments của hôm nay, không phải cả năm.

## Expected Behavior

### REQ-001: Year View Live Appointments Count

**Statement:** Year View hiển thị số Live Appointments = tổng số appointments có status `Arrived` hoặc `In-Consultation` trong **toàn bộ năm** được chọn.

**Classification:** `Confirmed` (developer retest, 2026-10-07)

**Evidence:** 
- Developer retest on feature branch `pac2-7081-2` (Book `111 PC24`, 7 Oct 2026)
- Year 2026 Live = 54 (May 7, Jun 24, Jul 7, Aug 1, Sep 5, Oct 10)
- Source: `ticket.md` comment tony.do 2026-10-07T12:02:51

### REQ-002: Year Live = Sum of Month Lives

**Statement:** Year Live count phải bằng tổng Live counts của tất cả các tháng trong năm đó.

**Classification:** `Confirmed` (developer retest, 2026-10-07)

**Evidence:**
- Year 2026 Live = 54
- Month Oct Live = 10
- October trong Year totals = 10 ✓
- Source: `ticket.md` comment tony.do 2026-10-07T12:02:51

### REQ-003: Year Live Polled on Load

**Statement:** Year Live được tính lại mỗi khi Year view được load hoặc reload.

**Classification:** `Confirmed` (developer retest, 2026-10-07)

**Evidence:**
- Source: `ticket.md` comment tony.do 2026-10-07T12:02:51
- Note: Year totals không được poll every 30s như Day/Week/Month; cached 5 minutes

### REQ-004: Day/Week/Month Live Unchanged

**Statement:** Live Appointments logic cho Day/Week/Month view không thay đổi. Mỗi view vẫn đếm appointments có status `Arrived` hoặc `In-Consultation` trong period được hiển thị.

**Classification:** `Confirmed` (developer retest, 2026-10-07)

**Evidence:**
- Month Oct Live = 10 (same rule as before)
- Week 5–11 Oct Live = 6 (agrees with per-day backend figures)
- Source: `ticket.md` comment tony.do 2026-10-07T12:02:51

## Test Scenarios

| ID | Scenario | Expected | Source |
|----|----------|----------|--------|
| TS-001 | Year view Live count | > 0 (không phải 0) | REQ-001 |
| TS-002 | Year Live = sum of months | Year Live = Σ Month Live | REQ-002 |
| TS-003 | Year Live on reload | Cập nhật sau reload | REQ-003 |
| TS-004 | Month Live count | > 0, đúng số | REQ-004 |
| TS-005 | Week Live count | > 0, đúng số | REQ-004 |

## Test Data

- **Appointment Book:** `111 PC24` (ID: 111)
- **Test date:** 7 Oct 2026
- **Expected Year Live:** 54 (May 7, Jun 24, Jul 7, Aug 1, Sep 5, Oct 10)
- **Expected Month Oct Live:** 10

## Open Questions

- None. Developer đã cung cấp đầy đủ test data và evidence.

## Source Evidence

1. `ticket.md` — Jira import, 2026-10-07
2. `128985-pac2-7165-year-live.png` — Year 2026 Live = 54 (developer retest)
3. `128986-pac2-7165-month-live.png` — Month Oct Live = 10 (developer retest)
4. `128972-Screen Recording 2026-10-07 at 4.13.24 PM.mov` — Original bug recording (Year Live = 0)
