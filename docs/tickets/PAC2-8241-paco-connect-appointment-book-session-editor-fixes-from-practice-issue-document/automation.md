# Automation: PAC2-8241

**Input Revision:** 1
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com` (DEV main)
**Role:** `Super Admin GB`
**Updated:** 2026-10-02T03:15Z

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| TC-001 | Yes | valid | Confirmed (path A) | Yes | Allowed |
| TC-002 | Yes | valid | Confirmed (path A) | Yes | Allowed |
| TC-003 | Yes | valid | Confirmed (path A) | Yes | Allowed |
| TC-005 | Yes | valid | Confirmed (path A) | No — past-date QA-AUTO session + bookable mapped slot chưa có | Not Run |
| TC-006 | Yes | valid | Confirmed (path B / session pencil) | No — cần booking từ TC-005 | Not Run |
| TC-007 | Yes | stale→corrected | Confirmed in run: pencil icon trên header session QA-AUTO → drawer `Edit Session` có `Time Range` | Yes | Allowed |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| PAC2-8241-TC-001 | Fail | 3 + control | `PAC2-8241-TC-001-002-003-007.spec.ts` | N/A | N/A | — |
| PAC2-8241-TC-002 | Pass | 1 (+2 re-verify) | `…TC-001-002-003-007.spec.ts` | N/A | N/A | — |
| PAC2-8241-TC-003 | Pass | 2 | `…TC-001-002-003-007.spec.ts` | N/A | N/A | Counter step không quan sát được (session ở cột `Not Assigned`) |
| PAC2-8241-TC-005 | Blocked | 0 | N/A | N/A | N/A | Test data: date picker không cho ngày quá khứ; session tự tạo không gán được care professional (`No Match` do `Required Attributes`) → `No care professional assigned` khi click slot |
| PAC2-8241-TC-006 | Blocked | 0 | N/A | N/A | N/A | Cần booking (TC-005 Blocked) |
| PAC2-8241-TC-007 | Fail | 4 + control | `…TC-001-002-003-007.spec.ts` | N/A | N/A | — |

## Manual Execution Evidence

### TC-001 — boundary (REQ-002, REQ-004)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | initial: drag 16:20→16:45 trên session 08:00–16:00 | Fail | Confirmed (tony.do 2026-09-22) | UI tạo pending slot ngoài range, footer `Session ends at: 16:45`, không có message boundary; `Save` → `POST appointment-slots/update 500`, UI im lặng, modal vẫn mở; reload: 48 slots, không lưu |
| a2 | same (16:20→16:40), fresh page | Fail | Confirmed | Giống a1 (500, không message). Observed: pending slot 16:20–16:45 của a1 vẫn xuất hiện lại sau reload (stale draft) |
| a3 | clean (16:00→16:10), fresh page | Fail | Confirmed | pending 16:00–16:15, `Save` → 500, không message; reload không lưu |
| control | valid in-range save (TC-002) | Pass | — | `appointment-slots/update 200`, persist |

Kết luận: không lưu slot invalid (server reject) nhưng **không có message `Slots must sit inside the session…`** và lỗi 500 **silent** → Fail (REQ-002 message, ticket item "failed saves display a clear error").

### TC-002 — bulk slot type (REQ-006, REQ-004)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | 48 slots `Dermatology Clinic` → `Test Billable` | Pass | Confirmed + Inferred | `slots/update 200`; dashboard 48 TB; reopen 48 TB; reload+reopen 48 TB |

Note: toast `Session updated successfully` không bắt được bằng selector trong attempt này (không assert).

### TC-003 — single Empty/Non-bookable + bulk Bookable (REQ-006)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | slot 08:00 bỏ `Bookable`, 08:10 `Empty Slot Type` | Pass | Confirmed | reopen + reload: 08:00 `NON-BOOKABLE`, 08:10 `Empty Slot` |
| a2 | `Select All` → `Bookable` off (48 pending NON-BOOKABLE, 200) → reload → on (0 pending, 200) → reload | Pass | Confirmed | Final reload+reopen: 0 NON-BOOKABLE, 47 TB + 1 Empty |

Observed: bulk panel `Bookable` mặc định unchecked khi selection mixed. Top `Available` (168) không đổi vì session ở cột `Not Assigned`.

### TC-007 — extend Time Range (REQ-003, REQ-005, REQ-004, REQ-006)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | slots 47 TB + 1 Empty; `Hours (To)` 16:00→17:00 (fill) | Fail | Confirmed (tony.do 2026-09-22; Sean 2026-09-20) | `sessions/update 200`, toast `Success — Session updated successfully.`; header ngay sau save vẫn `08:00 - 16:00`, sau ~5s `08:00 - 17:00`; **không có slot 16:00–17:00** (48 slots); **toàn bộ slot revert về `Dermatology Clinic`, Empty slot mất**; modal `Session ends at: 16:00`; persist sau reload |
| a2 | same method, 17:30 (diag script) | Fail | Confirmed | `sessions/update 400` (`FST_ERR_VALIDATION`), UI toast generic `…went wrong!` |
| a3 | clean data (slots set lại 48 TB, verified), 17:30 typed | Fail | Confirmed | request `session_endtime:"17:30"` → 400; message generic; slots không đổi |
| a4 | fresh page, fill `18:00` | Fail | Confirmed | `session_endtime:"18:00"` → 400 generic; không đổi |
| control | chỉ đổi `Session Name` → `…-R` | Pass | — | `sessions/update 200`; name persist; slots không đổi |

Kết luận: expected (thêm default slots, giữ slot cũ) không đạt ở mọi attempt → Fail. Hai failure mode: (1) save 200 nhưng revert slot changes + không sinh slot; (2) giờ dạng `HH:MM` → 400 với message không rõ. `Inferred`: mode (2) có thể phụ thuộc cách nhập (time mask) — cần dev xác nhận.

**Control path checked:** Yes (TC-002 valid slot save; TC-007 name-only save)
**Persisted state checked:** fresh reload + reopen `Edit Session` mỗi case
**Coverage review:** REQ-001 (TC-006) và REQ-007 (TC-005) Blocked (test data); REQ-002/003/004/005/006 có kết quả.

## Automation Implementation

- Spec: `playwright/tests/tickets/PAC2-8241-TC-001-002-003-007.spec.ts` (sha256 `9e11a8f3…f059`), serial, Chromium, auth qua CDP fixture.
- Flow: setup tạo `QA-AUTO-PAC2-8241-<stamp>` (08:00–16:00 hôm nay, 111 PC24, Temi PCN, Dermatology Clinic + Test Billable) → TC-002 → TC-003 → TC-001 → TC-007 → `afterAll` cleanup `Configuration` → `Delete`.
- Guard: hostname check + `evaluateMutationGate()` (`PACO_ALLOW_MUTATION=true`), action `qa-auto-session-create-update-delete`.
- TC-001/TC-007 encode Confirmed expected (boundary message; extend thêm 6 slot + giữ slot cũ) → kỳ vọng fail khi defect còn.
- TC-005/006 không có spec: Blocked (test data).
- Rủi ro locator: menu `⋯` single slot (TC-003) và confirm `Delete` (cleanup) không có trong manual record.

## CLI Verification

Run r1 (2026-10-02, partial, debug spec):

| Case | CLI result | Classification |
|---|---|---|
| setup | Pass | — |
| PAC2-8241-TC-002 | Pass | Matched product result |
| PAC2-8241-TC-003 | Fail (locator `⋯` panel) → sửa, chưa chạy lại | Automation defect |
| PAC2-8241-TC-001 | Not Run | Setup or authentication failure (login browser killed) |
| PAC2-8241-TC-007 | Not Run | Setup or authentication failure |

Ledger: `test-results/PAC2-8241/cli/r1/ledger.md`; leftovers: none.

## Mutation and Cleanup

**Occurred:** Yes
**Class:** Persistent
**Workflow Scope:** PAC2-8241 / TC-001,002,003,007 / create+update session & slots / QA-AUTO data only
**Ledger:** `test-results/PAC2-8241/manual/r1/ledger.md`
**Cleanup:** Done 03:29Z — `Configuration` → `Delete` 2 template QA-AUTO (200), verify grid + Appointment Book 02/10 không còn
**Leftover Identifiers:** None. Không booking/patient data nào được tạo; không Email/SMS gửi.

## Blockers and Warnings

- LOCATE/EXPLORE kết luận "DEV không có `Time Range`" sai: (a) Configuration/Add Session có `Time Range` dưới nhãn `Frequency` (collapsed); (b) icon bút chì (button không có accessible name) có trên header session QA-AUTO → drawer có `Time Range`. Session có sẵn đã xem không có icon (có thể do booking — Inferred).
- Toàn bộ route document trả 404 nhưng SPA render.
- Script automation mắc lỗi chọn option bulk ở diag d1/d2 (không áp dụng type) — đã loại khỏi evidence, re-verify manual.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
