# Exploration: PAC2-8381

**Input Revision:** 1
**Environment:** `dev` feature branch `pac2-8381`
**Role:** `Super Admin GB`
**Observed:** 2026-10-02T21:01:23+07:00
**Status:** Complete with warnings

## Scope

Quan sát read-only route đã xác nhận trong `Appointment Book`: mở appointment có sẵn, xác định entry `View Audit Log`, đọc cấu trúc audit và đối chiếu với requirements. Không book, edit, cancel, save hoặc đổi status.

## Observations

### OBS-PAC2-8381-001

**Classification:** Observed  
**Location/URL:** dev feature branch `/paco-connect/feature-branch/pac2-8381/appointment-book`  
**Action:** Chọn ngày có booking, bật `Booked`, click appointment có sẵn.  
**Observed Behavior:** `Appointment Details sidebar` mở và hiển thị metadata `Start Time`, `End Time`, `Booked By`; appointment lịch sử được xem có giá trị `Booked By` đã populate.  
**Requirement Links:** REQ-PAC2-8381-002, REQ-PAC2-8381-007  
**Evidence:** Local Playwright snapshot 2026-10-02T20:56+07:00; không share vì chứa patient data.  
**Sensitive Data Review:** Redacted

### OBS-PAC2-8381-002

**Classification:** Observed  
**Location/URL:** cùng route, context menu của booked appointment  
**Action:** Right-click appointment có sẵn; không chọn mutation action.  
**Observed Behavior:** Context menu chia nhóm `Appointment` và `Slot manage`. Nhóm appointment có `Cancel Appointment` và `View Audit Log`; nhóm slot có `Edit Slot`, `View Audit Log`, `Edit Session`, `Cancel Session`, `Remove Session`, `Message Session Patients`. Hai `View Audit Log` cùng label nhưng khác scope; appointment audit là item trong nhóm `Appointment`.  
**Requirement Links:** REQ-PAC2-8381-001, REQ-PAC2-8381-003, REQ-PAC2-8381-005, REQ-PAC2-8381-006  
**Evidence:** Local Playwright snapshot 2026-10-02T21:01+07:00; redacted route/menu labels only.  
**Sensitive Data Review:** Redacted

### OBS-PAC2-8381-003

**Classification:** Observed  
**Location/URL:** appointment `View Audit Log` dialog  
**Action:** Chọn read-only `View Audit Log` trong nhóm `Appointment`.  
**Observed Behavior:** Dialog `Audit | Activity Log` mở với filter `All time` và columns `Description`, `Date`, `Time`, `Patient`, `NHS Number`, `Appt Name`. Các row lịch sử của appointment chứa cùng timestamp booking và các description dạng `Beth Green set Planned start date...`, `set Planned end date...`, `set Planned start time...`, `set Planned end time...`, `set Appointment name...`. Trong phần row nhìn thấy không có sentence `booked this appointment` hoặc `created this slot`.  
**Requirement Links:** REQ-PAC2-8381-001, REQ-PAC2-8381-002, REQ-PAC2-8381-003  
**Evidence:** Local Playwright snapshot 2026-10-02T21:01+07:00; patient/NHS fields not copied into reusable docs.  
**Sensitive Data Review:** Redacted

### OBS-PAC2-8381-004

**Classification:** Observed  
**Location/URL:** appointment and slot context menu  
**Action:** Chỉ mở menu/dialog; dừng trước mutation.  
**Observed Behavior:** `Edit Slot`, `Cancel Appointment`, status actions và session actions là mutation boundaries cần controlled test appointment. Existing historical appointment không đủ để verify amendment/cancellation audit vì thực hiện sẽ sửa dữ liệu có sẵn.  
**Requirement Links:** REQ-PAC2-8381-005, REQ-PAC2-8381-006  
**Evidence:** Local Playwright snapshot 2026-10-02T21:01+07:00.  
**Sensitive Data Review:** None

## Mismatches and Possible Defects

- Possible mismatch: visible historical appointment audit rows ghi field-level `set ...` events, nhưng phần đã quan sát không có booking sentence theo REQ-PAC2-8381-001. Không kết luận `Fail`: record được tạo trước target fix, có thể pagination/row order chưa lộ booking event, và chưa tạo controlled appointment trên current build.
- Video source trước đó thấy `Beth Green created this slot`; current audit dialog của cùng flow/data hiển thị field-level descriptions. Hai observation không chứng minh current build pass/fail.
- `Booked By` hiện populate trên historical appointment, trái statement mở đầu ticket rằng field không visible. Có thể fix một phần hoặc khác build/state; cần controlled booking để xác nhận.

## Actions Not Taken

- Không click `Quick Book`/`Book Appointment`.
- Không click `Edit Slot`, `Cancel Appointment`, status actions, `Edit Session`, `Cancel Session`, `Remove Session`, `Message Session Patients`.
- Không dùng patient/appointment lịch sử làm mutation target.
- Không mở `Care Navigation` booking vì chưa có safe tile/test-data mapping và cleanup path.

## Suggested Coverage

1. Controlled direct booking trên PAC2-8381 branch: capture user/time trước action, open appointment audit, assert booking sentence và `Booked By`.
2. Controlled `Care Navigation` booking: trace resulting appointment into `PACO Connect` audit.
3. Controlled `Slot Type` amendment: compare audit before/after; verify actor/time and description.
4. Controlled cancellation: verify actor/time and no unrelated audit mutation.
5. Distinguish appointment-level `View Audit Log` from slot-level duplicate label using menu group/context, not label alone.
6. Verify audit row order/pagination/filter `All time`; ensure booking event is not merely below visible rows.

## Blockers and Open Questions

- Need safe owned `QA-AUTO` appointment, bookable slot, appointment book and patient mapping for mutation phases.
- Need exact `Care Navigation` tile/flow and cleanup path.
- Need confirmation whether booking audit should be one concise sentence in addition to field-level rows, or replace them.
- Need expected final label: `Booked By`, `Actioned By`, or both.
- Need timestamp format/tolerance and whether amendment audit must show old/new value.

## Tester notes

[Protected area]
