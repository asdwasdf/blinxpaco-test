# Requirements: PAC2-8999

**Input Revision:** 1
**Generated:** 2026-10-13T13:10:00.000Z
**Status:** Active

## Source Summary

Ticket báo cáo bug **PBT-332**: khi `book` hoặc `cancel` appointment trong PACO Connect, action không được ghi vào **patient profile audit** trong PACO. Regression của PBT-252 (đã pass trên prod trước đó). Severity `Critical`, báo cáo trên Production/Live bởi Chloe Stephens; services affected: The Royal, Alder Hey, CAS, OOH, PCAS.

Dev reply ngày 2026-10-13 cung cấp:
- Hai feature branch: PACO Connect `/paco-connect/feature-branch/pac2-8999/` (book/cancel) và PACO `/paco/feature-branch/pac2-8999/` (xem patient audit).
- Wording audit mong đợi: `<user> cancelled appointment`.
- Phần "booking not logged" **không reproduce** trên dev → chỉ phạm vi cancellation trong scope verify.
- Optional: `check-in` và `move` appointment cũng phải xuất hiện trong patient audit.

## Video Coverage

N/A — ticket không có video attachment.

## Atomic Requirements

### REQ-PAC2-8999-001

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Patient profile audit — cancellation entry  
**Search Terms/Aliases:** `Audit`, `Audit Trail`, `Patient Audit`, `cancelled appointment`, `Cancel`, `Patient Profile`, `cancelled by`  
**Known Location:** PACO `/paco/feature-branch/pac2-8999/` patient profile → audit view; book/cancel ở PACO Connect `/paco-connect/feature-branch/pac2-8999/`  
**Actor/Role:** Booking user; tester sử dụng `Super Admin GB` (theo PAC2-8381 baseline)  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing trên Jira; wording cung cấp bởi dev reply 2026-10-13

**Preconditions:**
- Patient tồn tại trong PACO (tester dùng bất kỳ patient không PII trên dev).
- Có slot bookable trong PACO Connect trong ngày làm việc.
- User `Super Admin GB` có quyền book/cancel trong PACO Connect và xem patient audit trong PACO.

**Expected Behavior:**
Sau khi cancel appointment trong PACO Connect, mở patient profile trong PACO → tab `Audit`/audit view phải có một entry dạng `<authenticated user> cancelled appointment`, với timestamp gần đúng thời điểm cancel action.

**Provenance:**
- **Source:** Dev reply 2026-10-13 (saved at `docs/tickets/PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/dev-question.md`); ticket `PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** TBD — sẽ capture sau `MANUAL_EXECUTE`  
**Related Tests:** TBD  
**Notes:** Dev note: phần "booking not logged" không reproduce trên dev; chỉ cancel trong scope.

---

### REQ-PAC2-8999-002

**Classification:** Inferred  
**Lifecycle:** Active  
**Feature/Scope:** Patient profile audit — booking entry (sanity)  
**Search Terms/Aliases:** `booked appointment`, `Booked by`, `Audit`, `booked an appointment`  
**Known Location:** PACO `/paco/feature-branch/pac2-8999/` patient profile → audit view  
**Actor/Role:** Booking user; `Super Admin GB`  
**Inference Basis:** Dev nói "booking not logged" không reproduce trên dev, nhưng ticket mô tả cả book + cancel đều không log. Cần smoke test lại booking trên dev để confirm trạng thái hiện tại (vì có thể chỉ chưa phát hiện chứ chưa hẳn là pass).  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Same as REQ-PAC2-8999-001.

**Expected Behavior:**
Sau khi book appointment trong PACO Connect, patient profile audit trong PACO có một entry liên quan tới booking (vd `<user> booked appointment` hoặc tương đương).

**Provenance:**
- **Source:** ticket `PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/ticket.md:13`; dev reply 2026-10-13
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** TBD  
**Related Tests:** TBD  
**Notes:** Marked `Inferred` vì dev nói không reproduce nhưng ticket vẫn liệt kê; cần verify trên dev để có verdict thực.

---

### REQ-PAC2-8999-003

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Patient profile audit — check-in / move entry (optional)  
**Search Terms/Aliases:** `Check In`, `checked in`, `Move`, `moved appointment`, `Audit`  
**Known Location:** PACO Connect `/paco-connect/feature-branch/pac2-8999/`; PACO `/paco/feature-branch/pac2-8999/`  
**Actor/Role:** Booking user; `Super Admin GB`  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Đã có appointment booked cho patient.

**Expected Behavior:**
Sau khi `Check In` hoặc `Move` appointment trong PACO Connect, patient profile audit trong PACO phải có entry tương ứng (wording chính xác chưa được dev xác nhận — ghi Open Question).

**Provenance:**
- **Source:** dev reply 2026-10-13
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** TBD  
**Related Tests:** TBD  
**Notes:** Dev ghi rõ "optional" — chỉ chạy nếu timebox cho phép.

---

### REQ-PAC2-8999-004

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Audit attribution — actor identity  
**Search Terms/Aliases:** `cancelled by`, `actor`, `user`, `Actioned by`, `Booked by`  
**Known Location:** Patient profile audit view; exact label/column TBD after `LOCATE`  
**Actor/Role:** Authenticated user thực hiện action  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có user thực hiện action trong PACO Connect.

**Expected Behavior:**
Audit entry ghi rõ actor là user thực hiện action (không phải system user, không phải user khác). Với cancellation, actor khớp với user cancel appointment trong PACO Connect.

**Provenance:**
- **Source:** ticket `PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/ticket.md:13` (Expected Outcome "to be logged in audit against patient profile"); PAC2-8381 baseline
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** TBD  
**Related Tests:** TBD  
**Notes:** Cross-check với `Booked by` / `Actioned by` ở appointment slide panel từ PAC2-8381.

---

### REQ-PAC2-8999-005

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Audit timestamp correctness  
**Search Terms/Aliases:** `timestamp`, `time`, `date`, `logged at`  
**Known Location:** Patient profile audit view; exact format TBD after `LOCATE`  
**Actor/Role:** N/A  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có action book/cancel/check-in/move được thực hiện.

**Expected Behavior:**
Audit timestamp phải gần đúng thời điểm action thực hiện (tolerance chưa được dev xác nhận — ghi Open Question).

**Provenance:**
- **Source:** ticket `PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** TBD  
**Related Tests:** TBD  
**Notes:** Timestamp format (ISO, locale, with/without timezone) chưa biết — capture trong `LOCATE`/`EXPLORE`.

---

### REQ-PAC2-8999-006

**Classification:** Inferred  
**Lifecycle:** Active  
**Feature/Scope:** Regression — PBT-252 baseline (booking + cancel both logged)  
**Search Terms/Aliases:** `PBT-252`, `regression`, `booked appointment`, `cancelled appointment`  
**Known Location:** PACO patient profile audit  
**Actor/Role:** Any authenticated user  
**Inference Basis:** PBT-252 đã pass trên prod (theo ticket); PAC2-8999 báo cáo regression. Không có diff/commit reference từ dev.  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Same as REQ-PAC2-8999-001/002.

**Expected Behavior:**
Trên feature branch `/paco/feature-branch/pac2-8999/`, cả booking lẫn cancellation đều phải xuất hiện trong patient profile audit; không được phép thiếu một trong hai.

**Provenance:**
- **Source:** ticket `PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** TBD  
**Related Tests:** TBD  
**Notes:** Dev cho biết booking không reproduce; chỉ cancel được verify chính.

---

## Ambiguities and Conflicts

- Dev nói "booking not logged" không reproduce trên dev, nhưng ticket gốc liệt kê cả book + cancel. Ghi nhận conflict → cần test cả hai trong `MANUAL_EXECUTE` để có verdict độc lập.
- Dev không cung cấp expected wording cho check-in / move; chỉ confirm có entry.

## Open Questions

- Wording chính xác cho `booked appointment` entry (nếu có) — dev không xác nhận.
- Wording chính xác cho `check-in` và `move` audit entries.
- Timestamp tolerance và format.
- Có phải audit hiển thị cùng lúc trong appointment-level audit (PACO Connect) và patient profile audit (PACO), hay chỉ patient profile? Dev mô tả chỉ patient profile.
- Test data cụ thể (QA-AUTO identifier) cho ledger — sẽ dùng bất kỳ patient/slot có sẵn trên dev; cần record identifier sau khi locate.

## Tester notes
