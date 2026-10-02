# PAC2-7669 — Test Cases

**Ticket:** PAC2-7669 — Poor Performance in Scheduler Configuration Clinician Selection
**Input revision:** `119562275d74aa7562cfe99a27e0502e86c3716aa377a6e0404f1c14f7bce99f`
**Date:** 2026-10-01
**Environment:** `dev` — `https://pac2-7669.dev.blinxpaco-np.com`
**Role:** `Blinx Deployment` (tester xác nhận quyền tương đương admin)

## Shared setup

- Route: `/configuration/`.
- Mở existing mapping qua template `Edit` để thấy `Select a clinician`.
- Expected performance basis: loại bỏ hoặc giảm đáng kể baseline 5–10 giây; không có SLA `< 1 giây`.
- Mutation: `Temporary` trong unsaved dialog draft.
- Không bấm `Save`; cleanup bằng gỡ chip khi cần và `Cancel`; mở lại để xác minh persisted state.

## Test Case Inventory

### TC-7669-001: Clinician Selection Performance

- **Requirement:** REQ-7669-001
- **Risk/Priority:** Critical / High
- **Maturity:** Ready
- **Mutation:** `Temporary`
- **Coverage:** Chọn clinician trên cả mapping `EMIS` và `PACO Connect`; đo từ click đến chip hiển thị.
- **Expected:** Selection nhanh hơn rõ rệt baseline 5–10 giây.
- **Postcondition:** Draft bị hủy; persisted mapping không đổi.

### TC-7669-002: No Page Timeout

- **Requirement:** REQ-7669-002
- **Risk/Priority:** High / High
- **Maturity:** Ready
- **Mutation:** `Temporary`
- **Coverage:** Quan sát browser qua từng selection.
- **Expected:** Không popup `waiting for this page to respond`; UI tiếp tục phản hồi.
- **Postcondition:** Draft bị hủy.

### TC-7669-003: No Freeze or Crash on Repeated Selections

- **Requirement:** REQ-7669-003
- **Risk/Priority:** High / Medium
- **Maturity:** Ready
- **Mutation:** `Temporary`
- **Steps:** Chọn clinician A, gỡ; chọn B, gỡ; chọn lại A hoặc clinician thứ ba.
- **Expected:** Mọi selection hoạt động; trang không freeze/crash.
- **Postcondition:** Draft bị hủy.

### TC-7669-004: EMIS Clinician Selection

- **Requirements:** REQ-7669-001, REQ-7669-002, REQ-7669-003
- **Risk/Priority:** Medium / Medium
- **Maturity:** Ready
- **Mutation:** `Temporary`
- **Test data category:** Existing non-patient scheduler mapping.
- **Mapping:** `Blood Test FJ` / `Face to Face` / `Same Day GP Appt` (`EMIS`).
- **Steps:** Mở mapping, thực hiện ít nhất ba purposeful selections, quan sát timing/responsiveness, gỡ temporary chips, `Cancel`, mở lại.
- **Expected:** Không thấy baseline delay 5–10 giây, timeout, freeze hoặc crash; mở lại không có clinician tạm.

### TC-7669-005: PACO Connect Clinician Selection

- **Requirements:** REQ-7669-001, REQ-7669-002, REQ-7669-003
- **Risk/Priority:** Medium / Medium
- **Maturity:** Ready
- **Mutation:** `Temporary`
- **Test data category:** Existing non-patient scheduler mapping.
- **Mapping:** `Blood Test Due - Boot Camp 240225` / `Face to Face` / `Blood Test` (`PACO Connect`).
- **Steps:** Ghi baseline clinician, thực hiện ít nhất ba purposeful draft selections, gỡ temporary chips, `Cancel`, mở lại.
- **Expected:** Không thấy baseline delay 5–10 giây, timeout, freeze hoặc crash; baseline persisted state không đổi.

## Execution Summary

| Case ID | Requirement | Mutation | Manual result |
|---|---|---|---|
| TC-7669-001 | REQ-7669-001 | `Temporary` | `Pass` |
| TC-7669-002 | REQ-7669-002 | `Temporary` | `Pass` |
| TC-7669-003 | REQ-7669-003 | `Temporary` | `Pass` |
| TC-7669-004 | REQ-7669-001/002/003 | `Temporary` | `Pass` |
| TC-7669-005 | REQ-7669-001/002/003 | `Temporary` | `Pass` |

## Tester notes

[Protected area]
