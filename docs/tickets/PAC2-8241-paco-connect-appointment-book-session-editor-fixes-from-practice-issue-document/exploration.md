# Exploration: PAC2-8241

**Input Revision:** 1
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com` (DEV main)
**Role:** `Super Admin GB`
**Observed:** 2026-10-02T02:35Z
**Mode:** observe, read-only (mutation: None)
**Starting point:** `feature-location.md` paths A, B

## Observed behavior

1. `Configuration` → row `Actions` → `Edit` mở drawer `Edit Session` (template-level). Toàn bộ text drawer (đọc bằng DOM, gồm phần scroll):
   `Session Name`, `Session Type` (`Timed Appts`/`Untimed Appts`), `Slot Duration (min)`, `Frequency`, `Apply Multi-Org Split`, `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, `Select Location & Care Professional(s)`, `Add another`, `Required Attributes`, `Cancel`, `Save`.
   - **Không có `Time Range` / `Hours (From)` / `Hours (To)` / `Start Date` / `End Date`.** (Observed)
   - Không field nào disabled trên template `QA-AUTO-PAC2-7786-…` (booking status của template Unknown).
2. Trên FB (video 01:30–01:36) drawer `Edit Session` mở từ icon bút chì ở header session trong `Appointment Book` và có `Time Range` + `Hours (From)`/`Hours (To)`, `Start Date`/`End Date`, `Days`, `Reoccurrence`. Entry này **không tồn tại trên DEV** (header chỉ có `Add a note to this session`).
3. Slot modal (`?preview=true`) trên DEV có `Select All`, `Actions`, `Close`, `Save`, `Session ends at:`; header hiển thị `Preview` (FB: `EDIT SESSION <name>`).
4. Route document `/paco-connect/appointment-book` và `/paco-connect/configuration` trả HTTP 404 nhưng SPA render.

## Correction (MANUAL_EXECUTE 2026-10-02)

Kết luận "không có `Time Range` trên DEV" **sai**: section `Frequency` (collapsed) chứa Hours/Date, và session-level pencil drawer có `Time Range` (xem `automation.md`). Mục Interpretation bên dưới đã lỗi thời.

## Interpretation

- `Inferred`: Session-level editor có `Time Range` (scope fix PAC2-8241 trên FB) chưa có trên DEV main → REQ-003, REQ-005 và phần lock `Time Range` của REQ-001 **không thể test trên DEV** qua UI hiện tại. Điều này khớp evidence `8241 DEV Not work.mp4` (chưa ingest, chưa xác nhận nội dung).
- REQ-002, REQ-006, REQ-007 có entry point trên DEV (slot modal, Quick Book).

## Unperformed actions

- Không mở `Actions` bulk panel, không `Save`, không tạo/sửa session, không booking.
- Chưa so sánh behavior slot modal DEV vs FB (cần mutation trên session `QA-AUTO`).

## Possible defect

- `Possible defect` (Inferred): FB fix chưa merge/deploy lên DEV — thiếu entry `Edit Session` (Time Range) trong `Appointment Book`. Cần dev/tester xác nhận release status trước khi log defect.

## Suggested coverage

- TC cho REQ-002/006 trên session `QA-AUTO` tự tạo (không booking): bulk slot type, Empty, Bookable, boundary error, reopen + fresh reload.
- TC REQ-007: book → cancel → re-book past slot + reload (cần safe patient).
- TC REQ-001/003/005: `Blocked` trên DEV nếu entry Time Range vẫn không có; ghi blocker.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
