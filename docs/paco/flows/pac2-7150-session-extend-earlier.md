# Session — Extend Earlier via Edit Session (PAC2-7150)

**Aliases**: `start session earlier`, `extend session start`, `shaded hour`, `earlier slot`, `Edit Session prompt`, `session time extension`

## Classification

`Confirmed` — fix deployed, QA passed on feature branch + dev 2026-10-07

## Entry

`https://blinx.dev.blinxpaco-np.com/paco/dashboard` → `Appointment Book` → chọn ngày → session card → `Edit` (pencil icon) **HOẶC** `Configuration` → `Sessions` → row → `Edit`

## Route

`/paco-connect/appointment-book` (Day view) → Edit Session drawer

## Role

`Super Admin GB` / session holder

## Environment

`dev` (fix deployed on feature branch PAC2-7150; confirmed working on dev)

## Source

PAC2-7150 (replay.md, Sean Huynh QA PASSED 2026-10-07)

## Logic chính

1. **Shaded hour zone**: Trong Edit Session modal, giờ PHÍA TRÊN session start hiển thị dưới dạng **shaded** — vùng cho phép thêm slot ở thời điểm trước session start time. Trước fix, shaded zone không cho phép tạo slot.
2. **Single-direction prompt**: Khi thêm slot trong shaded hour (before start) → prompt hiện "Start session at [time]". Chấp nhận → session start cập nhật + slot mới persist.
3. **Dual-direction prompt**: Khi chọn slots thêm TRƯỚC start VÀ SAU end → prompt đọc "Run session [start]–[end]" (range mới đầy đủ). Cancel → giữ nguyên. Accept → cập nhật cả start và end.
4. **Appointment Book entry**: Từ Appointment Book settings panel → mở slot preview → thêm slot trước start → accept prompt → save → settings panel và board đều cập nhật start time.
5. **Clash detection**: Nếu earlier time trùng với session khác → clash prompt cảnh báo xuất hiện.
6. **Save persists**: Session update persist qua reopen và fresh reload.

## Defect đã biết

- `PAC2-7150` **Resolved**: Trước fix — không thể thêm slot trong shaded hour phía trên session start. Sau fix — shaded hour cho phép tạo slot và prompt "Start session at [time]" xuất hiện. Fix deployed + QA passed 2026-10-07.

## Evidence

- `ticket/PAC2-7150-paco-connect-can-t-make-sessions-earlier/attachments/128961-Screen Recording 2026-10-07 at 3.00.17 PM (baa288b0-b505-4919-9d42-75f2185ce124).mov` — TC-001 PASSED (start earlier)
- `ticket/PAC2-7150-paco-connect-can-t-make-sessions-earlier/attachments/128958-Screen Recording 2026-10-07 at 3.07.40 PM.mov` — TC-002 PASSED (extend both ends, cancel/accept)
- `ticket/PAC2-7150-paco-connect-can-t-make-sessions-earlier/attachments/128960-Screen Recording 2026-10-07 at 3.09.01 PM.mov` — TC-003 PASSED (from Appointment Book panel)
- `ticket/PAC2-7150-paco-connect-can-t-make-sessions-earlier/attachments/129046-Screen Recording 2026-10-07 at 10.12.01 PM.mov` — PASSED on DEV

## Chi tiết

- `docs/paco/tickets/PAC2-7150-paco-connect-can-t-make-sessions-earlier/replay.md`
- `docs/product/workflows/appointment-book.md#session-editor-và-khóa-field`
