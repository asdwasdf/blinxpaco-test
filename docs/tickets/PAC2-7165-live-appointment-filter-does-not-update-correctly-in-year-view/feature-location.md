---
ticket_id: PAC2-7165
title: "Live appointment filter does not update correctly in Year View"
roles:
  - Super Admin GB
environment: dev
routes:
  - /paco-connect/appointment-book
last_verified: 2026-10-07
status: Observed
---

# Feature Location — PAC2-7165

## Entry

`/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`
→ Route: `/paco-connect/appointment-book`

## Feature under test

**Live Appointments filter** trong **Year View** của Appointment Book.

### Location in UI

1. Mở Appointment Book
2. Chọn **Year view** từ view switcher (Day/Week/Month/Year)
3. Tìm filter **Live Appointments** (có thể trong toolbar hoặc filter panel)

### Expected behavior

| View | Live Appointments count |
|------|------------------------|
| Day | Appointments trong ngày có status Arrived/In-Consultation |
| Week | Appointments trong tuần có status Arrived/In-Consultation |
| Month | Appointments trong tháng có status Arrived/In-Consultation |
| Year | Appointments trong năm có status Arrived/In-Consultation |

**Bug trước fix:** Year Live = 0 (chỉ đếm hôm nay thay vì cả năm)

**Sau fix:** Year Live = tổng Live của tất cả tháng trong năm

## Source knowledge

- **Feature Map:** `docs/product/feature-map.md#appointment-book`
- **Module workflow:** `docs/product/workflows/appointment-book.md`
- **Root cause:** Year view Live chỉ query appointments của `today`, không phải cả năm
- **Fix:** Backend change để year totals report live figure per month
- **Developer test data:** Book `111 PC24`, 7 Oct 2026

## Known routes

- **Root:** `/paco-connect/appointment-book`
- **Feature branch:** `/paco-connect/feature-branch/<ticket-branch>/appointment-book`
- **Direct AB by ID:** `/paco-connect/appointment-book?bookId=<book-id>`

## Scope for LOCATE

1. Navigate to Appointment Book → Year View
2. Find Live Appointments filter
3. Verify Live count shows correct value (not 0)
4. Verify Live count = sum of monthly Live counts
5. Compare with Day/Week/Month Live counts

## Related tickets

- `PAC2-7081-2` — Feature branch chứa fix (re-work after QA)
