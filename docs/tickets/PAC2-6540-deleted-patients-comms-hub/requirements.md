# Requirements: PAC2-6540

**Input Revision:** 1
**Generated:** 2026-09-13T03:55:10Z
**Status:** Active

## Source Summary

Ticket mô tả sai lệch không ổn định giữa tập bệnh nhân trong `Analytics Reports` và tập nhận chiến dịch từ `Comms Hub`. Ví dụ được báo cáo tại Myrtle Practice có 379 bệnh nhân ở `Outbox` với trạng thái `Not Sent - Patient Deleted or Inactive`; `Advanced Search` trả 404 bệnh nhân khi `Deleted Patient Included` và 23 bệnh nhân khi `Deleted Patient Excluded`. Acceptance criteria yêu cầu cách xử lý bệnh nhân bị xóa, tập người nhận, trạng thái không gửi và số lượng phải nhất quán.

## Atomic Requirements

### REQ-PAC2-6540-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Xử lý bệnh nhân bị xóa giữa `Analytics Reports` và `Comms Hub`
**Search Terms/Aliases:** `Analytics Reports`, `Analytics`, `Comms Hub`, communications hub, campaign, deleted patient, inactive patient
**Known Location:** Unknown
**Actor/Role:** Practice user; role/permission cụ thể Unknown
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng; ví dụ trong ticket chưa được QA quan sát trực tiếp
**Acceptance Criteria Status:** Present

**Preconditions:**
- Cùng dữ liệu bệnh nhân và cùng quy tắc eligibility được dùng để đối chiếu.
- Trạng thái deleted/inactive của bệnh nhân có thể xác định tại thời điểm chạy.

**Expected Behavior:**
Bệnh nhân được đánh dấu deleted phải được xử lý nhất quán giữa `Analytics Reports` và `Comms Hub`.

**Provenance:**
- **Source:** `ticket/PAC2-6540-deleted-patients-comms-hub/ticket.md:37-40`
- **Input Revision:** 1
- **First Recorded:** 2026-09-13
- **Last Verified:** 2026-09-13

**Evidence:** Ticket acceptance criteria
**Related Tests:** Chưa thiết kế
**Notes:** Ticket chưa định nghĩa quy tắc eligibility hoặc thời điểm snapshot trạng thái bệnh nhân.

---

### REQ-PAC2-6540-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Tập người nhận chiến dịch trong `Comms Hub`
**Search Terms/Aliases:** `Comms Hub`, campaign, send campaign, recipients, `Analytics Reports`, patient set
**Known Location:** Unknown
**Actor/Role:** Practice user; role/permission cụ thể Unknown
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Present

**Preconditions:**
- Có một report xác định tập bệnh nhân eligible.
- Có một campaign dùng cùng tập dữ liệu và điều kiện eligibility để gửi.

**Expected Behavior:**
Tập bệnh nhân mà campaign gửi phải khớp với tập bệnh nhân hiển thị trong `Analytics Reports`.

**Provenance:**
- **Source:** `ticket/PAC2-6540-deleted-patients-comms-hub/ticket.md:41-42`
- **Input Revision:** 1
- **First Recorded:** 2026-09-13
- **Last Verified:** 2026-09-13

**Evidence:** Ticket acceptance criteria
**Related Tests:** Chưa thiết kế
**Notes:** “Khớp” chưa nêu rõ có so sánh theo patient ID, tổng số hay cả hai.

---

### REQ-PAC2-6540-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Trạng thái không gửi trong `Outbox`
**Search Terms/Aliases:** `Outbox`, `Not Sent - Patient Deleted or Inactive`, not sent, patient deleted, patient inactive
**Known Location:** Unknown
**Actor/Role:** Practice user; role/permission cụ thể Unknown
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Present

**Preconditions:**
- Campaign đã được xử lý và một bệnh nhân không được gửi do deleted hoặc inactive.

**Expected Behavior:**
`Outbox` hiển thị trạng thái `Not Sent - Patient Deleted or Inactive` cho bệnh nhân không được gửi khi nguyên nhân đó áp dụng.

**Provenance:**
- **Source:** `ticket/PAC2-6540-deleted-patients-comms-hub/ticket.md:43-44`
- **Input Revision:** 1
- **First Recorded:** 2026-09-13
- **Last Verified:** 2026-09-13

**Evidence:** Ticket acceptance criteria
**Related Tests:** Chưa thiết kế
**Notes:** “Where applicable” chưa định nghĩa thứ tự ưu tiên nếu có nhiều nguyên nhân không gửi.

---

### REQ-PAC2-6540-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Bộ lọc deleted patient trong `Advanced Search`
**Search Terms/Aliases:** `Advanced Search`, `Deleted Patient Included`, `Deleted Patient Excluded`, deleted patients included, deleted patients excluded
**Known Location:** Unknown
**Actor/Role:** Practice user; role/permission cụ thể Unknown
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Present

**Preconditions:**
- Có cùng dataset ổn định để chạy lại `Advanced Search`.
- Có bệnh nhân deleted và non-deleted phân biệt được trong dataset.

**Expected Behavior:**
`Advanced Search` trả kết quả nhất quán khi chọn `Deleted Patient Included` và khi chọn `Deleted Patient Excluded`.

**Provenance:**
- **Source:** `ticket/PAC2-6540-deleted-patients-comms-hub/ticket.md:45-47`
- **Input Revision:** 1
- **First Recorded:** 2026-09-13
- **Last Verified:** 2026-09-13

**Evidence:** Ticket acceptance criteria
**Related Tests:** Chưa thiết kế
**Notes:** Ticket chưa định nghĩa kết quả cụ thể cho từng lựa chọn ngoài ví dụ Myrtle Practice.

---

### REQ-PAC2-6540-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Đối chiếu số lượng report và campaign
**Search Terms/Aliases:** patient count, report count, campaign send count, sent count, not sent count, reconciliation
**Known Location:** Unknown
**Actor/Role:** Practice user; role/permission cụ thể Unknown
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Present

**Preconditions:**
- Report và campaign dùng cùng dataset, thời điểm snapshot và điều kiện eligibility.

**Expected Behavior:**
Số lượng bệnh nhân trong report và số lượng tương ứng trong campaign phải khớp nhất quán.

**Provenance:**
- **Source:** `ticket/PAC2-6540-deleted-patients-comms-hub/ticket.md:48-49`
- **Input Revision:** 1
- **First Recorded:** 2026-09-13
- **Last Verified:** 2026-09-13

**Evidence:** Ticket acceptance criteria
**Related Tests:** Chưa thiết kế
**Notes:** Chưa rõ công thức đối chiếu có gồm `Sent`, `Not Sent`, failed và excluded hay không.

## Ambiguities and Conflicts

- Ticket gọi nhóm bệnh nhân là “marked as deleted”, nhưng ví dụ cũng nói tất cả có deleted status `False` tại `ticket.md:31-33`. Hai claim mâu thuẫn về trạng thái nguồn; chưa chọn claim nào làm expected data state.
- Ví dụ nêu 404 kết quả khi included và 23 khi excluded, suy ra chênh lệch 381, trong khi 379 bệnh nhân không được liên hệ tại `ticket.md:20-31`. Chênh lệch 2 chưa được giải thích.
- Trạng thái `Not Sent - Patient Deleted or Inactive` gộp hai nguyên nhân; ticket chưa cho biết 379 bệnh nhân là deleted, inactive hay tổ hợp.
- Cụm “not consistent each time” tại `ticket.md:35` chưa có tần suất, điều kiện tái hiện hoặc bằng chứng theo từng run.

## Open Questions

1. Role/permission cụ thể nào đại diện cho “practice user” khi test?
2. Environment, practice/site và test dataset nào được phép dùng?
3. Patient ID list hoặc report tương đương nào dùng để đối chiếu mà không đưa dữ liệu cá nhân vào artifact?
4. Quy tắc authoritative để xác định deleted/inactive nằm ở hệ thống hoặc field nào, tại thời điểm nào?
5. Expected count chính xác cho Myrtle Practice là 379, 381 hay giá trị khác? Hai bệnh nhân chênh lệch được xử lý thế nào?
6. “Campaign sends reflect the same patient set” so sánh total recipients, successful sends, attempted sends hay gồm cả `Not Sent`?
7. Có thể kiểm tra campaign/report đã tồn tại theo read-only không, hay bắt buộc tạo/upload/send dữ liệu?
8. Cần bao nhiêu lần chạy lặp để kết luận hành vi “consistent” cho lỗi intermittent?

---

## Tester notes

[Protected area]
