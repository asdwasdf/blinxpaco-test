# Requirements: PAC2-8552

**Input Revision:** 1
**Generated:** 2026-09-25T09:34:09+07:00
**Status:** Active

## Source Summary

Ticket tối ưu truy vấn/ghi trên các bảng partitioned `appointment` và `appointment_slot` bằng cách bổ sung `bx_organisation_uuid` khi giá trị này xác định an toàn. Phạm vi trải trên `nhs-scheduler-be` và `paco-connect-be`, gồm đặt lịch, hủy lịch, tính split status và lookup slot. Ticket cũng yêu cầu giữ nguyên correctness trong các trường hợp khác biệt semantics của organisation giữa hai repo, multi-org session, multi-slot appointment và zero-row update. `Acceptance criteria` chính thức không có; test plan trong Description là nguồn xác nhận phạm vi kiểm thử, không phải bằng chứng fix đã đạt.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

Không có video hoặc attachment.

## Atomic Requirements

### REQ-PAC2-8552-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `nhs-scheduler-be` — `bookAppointment`
**Search Terms/Aliases:** appointment booking, book appointment, Patient Scheduler, scheduler
**Known Location:** Patient Scheduler booking flow; exact route Unknown
**Actor/Role:** Patient hoặc scheduler user; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có bookable appointment slot hợp lệ.

**Expected Behavior:**
Đặt appointment qua `book-appointment` vẫn thành công end-to-end sau thay đổi partition scoping.

**Provenance:**
- **Source:** `ticket.md:13`, test plan item “Book an appointment via book-appointment”
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có runtime evidence
**Related Tests:** Chưa thiết kế
**Notes:** Nhánh reschedule được ghi nhận chưa filter và ngoài phần fix hiện tại.

---

### REQ-PAC2-8552-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `nhs-scheduler-be` và `paco-connect-be` — cancel single appointment
**Search Terms/Aliases:** cancel appointment, cancellation, booking cancellation
**Known Location:** PACO Connect và Patient Scheduler cancellation flows; exact routes Unknown
**Actor/Role:** Staff và patient/scheduler actor; exact roles Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Một appointment hợp lệ tồn tại và có thể hủy qua từng repo.

**Expected Behavior:**
Hủy một appointment qua mỗi repo vẫn thành công; không trả false `APPOINTMENT_NOT_FOUND` do organisation mismatch.

**Provenance:**
- **Source:** `ticket.md:13`, review round 1 và test plan item “Cancel a single appointment in both repos”
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có runtime evidence
**Related Tests:** Chưa thiết kế
**Notes:** Organisation semantics khác nhau giữa hai repo là constraint correctness bắt buộc.

---

### REQ-PAC2-8552-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `paco-connect-be` — cancel multi-org session appointments
**Search Terms/Aliases:** cancel session, multi-org session, grouped cancellation
**Known Location:** PACO appointment book/session cancellation; exact route Unknown
**Actor/Role:** Staff role có quyền quản lý appointment book; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Session chứa appointments thuộc hơn một organisation.

**Expected Behavior:**
Khi hủy session, từng appointment được patch theo organisation của chính row; toàn bộ appointment được yêu cầu phải được tìm thấy và xử lý.

**Provenance:**
- **Source:** `ticket.md:13`, `cancelAppointment` grouping và test plan multi-org session
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có runtime evidence
**Related Tests:** Chưa thiết kế
**Notes:** Guard phải so requested IDs với found appointments, không so hai tập đã cùng bị narrowed.

---

### REQ-PAC2-8552-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `paco-connect-be` — multi-slot appointment cancellation during session edit
**Search Terms/Aliases:** multi-slot appointment, release slots, edit session, future slots
**Known Location:** PACO appointment book session edit/cancel flow; exact route Unknown
**Actor/Role:** Staff role có quyền sửa session; exact role Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Multi-slot appointment có một phần slot nằm ngoài session window mới và một phần nằm trong.

**Expected Behavior:**
Sau cancellation, mọi slot của appointment được release; không slot nào tiếp tục trỏ vào appointment đã cancelled.

**Provenance:**
- **Source:** `ticket.md:13`, review round 2 và test plan multi-slot case
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có runtime evidence
**Related Tests:** Chưa thiết kế
**Notes:** `knownSlots` phải bao gồm full graph-fetched `appointment_slots`, không chỉ out-of-range slots.

---

### REQ-PAC2-8552-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `nhs-scheduler-be` — `sessionSplitStatus`
**Search Terms/Aliases:** session split status, split allocation, allocation count
**Known Location:** Scheduler/session capacity logic; UI location Unknown
**Actor/Role:** System/backend; UI actor Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Organisation có active split allocation.

**Expected Behavior:**
Split allocation enforcement và counts không đổi sau tối ưu; appointment-side lookup không được filter bằng token organisation khi semantics không tương thích.

**Provenance:**
- **Source:** `ticket.md:13`, review round 1 và test plan split-status item
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có runtime evidence
**Related Tests:** Chưa thiết kế
**Notes:** Đây là regression requirement, không phải yêu cầu thay đổi count.

---

### REQ-PAC2-8552-006

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Affected partitioned queries/writes
**Search Terms/Aliases:** partition pruning, `EXPLAIN ANALYZE`, `bx_organisation_uuid`
**Known Location:** Database/query layer; non-UI
**Actor/Role:** Engineer/DB operator
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có DB environment và representative data cho hai repo.

**Expected Behavior:**
`EXPLAIN ANALYZE` trước/sau xác nhận partition pruning trên các query đã được scope an toàn bằng `bx_organisation_uuid`.

**Provenance:**
- **Source:** `ticket.md:13`, “Still needed before merge” và test plan
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có DB evidence
**Related Tests:** Chưa thiết kế
**Notes:** Ticket ghi rõ chưa có DB access; không thể kết luận performance chỉ từ UI latency.

---

### REQ-PAC2-8552-007

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Update integrity guards trong cả hai repo
**Search Terms/Aliases:** zero-row update, requested-vs-found guard, under-patch guard
**Known Location:** Backend; non-UI
**Actor/Role:** System/backend
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Update target bị thiếu hoặc organisation filter làm hẹp sai tập dữ liệu.

**Expected Behavior:**
Write path không trả success im lặng khi zero rows hoặc thiếu requested appointments; inconsistent partial state như status `Cancelled` nhưng slot chưa release không được chấp nhận.

**Provenance:**
- **Source:** `ticket.md:13`, review rounds 1–2
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Existing suite được ticket báo cáo green; chưa được workflow này verify
**Related Tests:** Chưa thiết kế
**Notes:** Error contract cụ thể khi guard fail chưa được nêu.

---

### REQ-PAC2-8552-008

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `nhs-scheduler-be` — `getAppointmentsBySlotId`
**Search Terms/Aliases:** appointment by slot, slot lookup, scheduler appointment lookup
**Known Location:** Backend; caller/UI route Unknown
**Actor/Role:** System/backend
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Slot ID hợp lệ được lookup.

**Expected Behavior:**
Lookup trả đúng appointments và dùng partition key ở những bước mà organisation đã được xác định an toàn; dead-code query không còn thực thi.

**Provenance:**
- **Source:** `ticket.md:13`, scope `getAppointmentsBySlotId` và review round 1
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Chưa có runtime evidence
**Related Tests:** Chưa thiết kế
**Notes:** First slot-by-ID lookup không thể partition-scope theo thiết kế hiện tại.

---

## Ambiguities and Conflicts

- `Acceptance criteria` là Missing; các requirement trên được xác nhận từ Description/test plan, chưa xác nhận fix đã hoạt động trên environment.
- Cùng column `appointment.bx_organisation_uuid` có semantics khác giữa `nhs-scheduler-be` và `paco-connect-be`; không được áp một rule filter chung.
- `bookAppointment` reschedule branch được ghi “documented, not fixed”; cần xác nhận có thuộc test scope bắt buộc hay follow-up.
- Ticket nói PR `nhs-scheduler-be#524` approved, `paco-connect-be#742` awaiting re-review tại thời điểm import; deployment status trên dev chưa biết.
- `appointment_status` có organisation semantics khác nhau và partition status chưa biết; đây là limitation/follow-up, không tự đưa vào expected fix scope.

## Open Questions

1. Dev environment hiện deploy commit/version nào của `nhs-scheduler-be#524` và `paco-connect-be#742`?
2. Role và test data nào được phép dùng cho booking, single cancellation, multi-org session và multi-slot session edit?
3. Mutation approval có bao gồm `Book`, `Cancel`, session edit và cleanup không?
4. Có DB access/owner nào chạy `EXPLAIN ANALYZE` và `IS DISTINCT FROM` diagnostic query? Production diagnostic cần approval riêng; workflow không tự chạy.
5. Error/result contract mong đợi khi requested-vs-found hoặc zero-row guard fail là gì?
6. Reschedule branch của `bookAppointment` thuộc run này hay follow-up?

---

## Tester notes

