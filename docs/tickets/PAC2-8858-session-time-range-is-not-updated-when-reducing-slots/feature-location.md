# PAC2-8858 — Feature Location

**Mode:** LOCATE  
**Environment:** dev  
**Role:** `Blinx Deployment` (Super Admin GB equivalent)  
**Timestamp:** 2026-10-06T14:50:00Z

## Route

**Entry:** `/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`  
**Feature-branch route:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8858/appointment-book`

**Confirmed:** ✅ Route hoạt động, page load thành công.

## Landmarks

- `Day` / `Week` / `Month` / `Year` view tabs
- `Previous` / `Next` navigation
- `Active sessions today` với `Sessions`, `Booked`, `Available`, `LIVE` counters
- `Quick Book` button
- `Filters` button
- Session headers với time range (ví dụ: `08:00 - 16:15`)
- Context menu trên session: `Edit Session`, `Edit Slot`, `Block Session`, `Remove Session`, v.v.

## Session context menu

Right-click vào session area để mở context menu:
- `SET STATUS`: Patient Arrived, Consultation Started, Consultation Ended, Patient Left, Did Not Attend, Cancel Appointment
- `SLOT MANAGE`: Edit Slot, Add a note, View Audit Log, **Edit Session**, Block Session, Remove Session, Message Session Patients

## Test data candidates

1. **Session "PC 24 Test Sophie PC24 HQ"**: 08:00 - 16:15, 48 available slots
2. Có thể cần tạo session mới để test REQ-001 (end time update khi xóa slots)

## Budget

- Views: 2/12 (dashboard → appointment book)
- Time: ~5 phút

## Next

Tiến hành `EXPLORE` để observe behavior của session editor và popup bug.

## Tester notes

[Protected area]
