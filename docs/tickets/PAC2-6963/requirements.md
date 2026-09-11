# Requirements: PAC2-6963

**Input Revision:** 1
**Generated:** 2026-09-11T13:49:19Z
**Status:** Active

## Source Summary

Ticket mô tả sự không nhất quán giữa tập bệnh nhân xuất hiện trong Analytics Reports và tập bệnh nhân được gửi campaign qua Comms Hub. Ví dụ tại Myrtle Practice ghi nhận 404 bệnh nhân khi `Deleted Patient Included`, 23 bệnh nhân khi `Deleted Patient Excluded`, và 379 trường hợp không được liên hệ với `Outbox status` là `Not Sent - Patient Deleted or Inactive`. Mục tiêu là xử lý trạng thái deleted nhất quán và làm cho số lượng bệnh nhân giữa report, search và campaign send khớp nhau qua các lần chạy.

## Atomic Requirements

### REQ-PAC2-6963-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Đồng nhất cách xử lý bệnh nhân marked as deleted giữa Analytics Reports và Comms Hub
**Actor/Role:** `practice user`
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng; đây là Acceptance Criteria, không phải quan sát trực tiếp trong environment
**Acceptance Criteria Status:** Present

**Preconditions:**
- Có cùng tập dữ liệu bệnh nhân đủ điều kiện được đánh giá trong Analytics Reports và Comms Hub.

**Expected Behavior:**
Bệnh nhân marked as deleted được xử lý nhất quán giữa Analytics Reports và Comms Hub.

**Provenance:**
- **Source:** `ticket/PAC2-6963/ticket.md:39-40`
- **Input Revision:** 1
- **First Recorded:** 2026-09-11
- **Last Verified:** 2026-09-11

**Evidence:** Chưa có evidence runtime
**Related Tests:** Chưa thiết kế
**Notes:** Ticket chưa định nghĩa chính xác quy tắc eligibility hoặc nguồn dữ liệu authoritative cho trạng thái deleted.

---

### REQ-PAC2-6963-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Đồng nhất tập bệnh nhân của campaign send và Analytics Reports
**Actor/Role:** `practice user`
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng; đây là Acceptance Criteria, không phải quan sát trực tiếp trong environment
**Acceptance Criteria Status:** Present

**Preconditions:**
- Analytics Report và campaign send sử dụng cùng scope bệnh nhân và cùng thời điểm dữ liệu có thể so sánh.

**Expected Behavior:**
Campaign send phản ánh cùng tập bệnh nhân được hiển thị trong Analytics Reports.

**Provenance:**
- **Source:** `ticket/PAC2-6963/ticket.md:41-42`
- **Input Revision:** 1
- **First Recorded:** 2026-09-11
- **Last Verified:** 2026-09-11

**Evidence:** Chưa có evidence runtime
**Related Tests:** Chưa thiết kế
**Notes:** Ticket chưa xác định report cụ thể, campaign configuration, timing, hay cách so sánh identity giữa hai tập dữ liệu.

---

### REQ-PAC2-6963-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Hiển thị lý do không gửi trong Comms Hub Outbox
**Actor/Role:** `practice user`
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng; đây là Acceptance Criteria, không phải quan sát trực tiếp trong environment
**Acceptance Criteria Status:** Present

**Preconditions:**
- Một bệnh nhân không được gửi vì được xác định là deleted hoặc inactive.
- Kết quả send xuất hiện trong `Outbox`.

**Expected Behavior:**
`Outbox status` hiển thị `Not Sent - Patient Deleted or Inactive` khi lý do không gửi tương ứng là bệnh nhân deleted hoặc inactive.

**Provenance:**
- **Source:** `ticket/PAC2-6963/ticket.md:43-44`
- **Input Revision:** 1
- **First Recorded:** 2026-09-11
- **Last Verified:** 2026-09-11

**Evidence:** Chưa có evidence runtime
**Related Tests:** Chưa thiết kế
**Notes:** Cụm “where applicable” chưa chỉ rõ rule phân biệt deleted với inactive hoặc các lý do không gửi khác.

---

### REQ-PAC2-6963-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Tính ổn định của Advanced Search với deleted patients
**Actor/Role:** `practice user`
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng; đây là Acceptance Criteria, không phải quan sát trực tiếp trong environment
**Acceptance Criteria Status:** Present

**Preconditions:**
- Chạy `Advanced Search` nhiều lần trên cùng dữ liệu và cùng search criteria.
- Lần lượt dùng `Deleted Patient Included` và `Deleted Patient Excluded`.

**Expected Behavior:**
Mỗi lựa chọn `Deleted Patient Included` và `Deleted Patient Excluded` trả về kết quả nhất quán qua các lần chạy khi input không đổi.

**Provenance:**
- **Source:** `ticket/PAC2-6963/ticket.md:45-47`
- **Input Revision:** 1
- **First Recorded:** 2026-09-11
- **Last Verified:** 2026-09-11

**Evidence:** Chưa có evidence runtime
**Related Tests:** Chưa thiết kế
**Notes:** “Consistent” chưa có tolerance, số lần lặp, khoảng thời gian, hoặc quy tắc xử lý thay đổi dữ liệu nền.

---

### REQ-PAC2-6963-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Đồng nhất số lượng bệnh nhân giữa report và campaign send
**Actor/Role:** `practice user`
**Inference Basis:** Không áp dụng
**Observation Context:** Không áp dụng; đây là Acceptance Criteria, không phải quan sát trực tiếp trong environment
**Acceptance Criteria Status:** Present

**Preconditions:**
- Report và campaign send sử dụng cùng patient cohort, eligibility rules, và data snapshot.

**Expected Behavior:**
Số lượng bệnh nhân trong report và campaign send khớp nhau một cách nhất quán.

**Provenance:**
- **Source:** `ticket/PAC2-6963/ticket.md:48-49`
- **Input Revision:** 1
- **First Recorded:** 2026-09-11
- **Last Verified:** 2026-09-11

**Evidence:** Chưa có evidence runtime
**Related Tests:** Chưa thiết kế
**Notes:** Chưa rõ “campaign send” là tổng selected, queued, sent thành công, hay sent cộng `Not Sent`.

---

### REQ-PAC2-6963-006

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Quan hệ tập hợp giữa hai lựa chọn deleted patient
**Actor/Role:** `practice user`
**Inference Basis:** Từ ví dụ 404 bệnh nhân với `Deleted Patient Included`, 23 với `Deleted Patient Excluded`, và chênh lệch 379 bằng số bệnh nhân không được liên hệ; Acceptance Criteria không quy định công thức này cho mọi dataset.
**Observation Context:** Không áp dụng; số liệu do ticket cung cấp, chưa được quan sát trực tiếp
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Hai search dùng cùng report, criteria, data snapshot; chỉ khác lựa chọn deleted patient.

**Expected Behavior:**
Số bệnh nhân bị loại khi chuyển từ `Deleted Patient Included` sang `Deleted Patient Excluded` có thể phải bằng số bệnh nhân bị ngăn gửi do deleted status cho cùng cohort; cần xác nhận trước khi dùng làm assertion tự động.

**Provenance:**
- **Source:** `ticket/PAC2-6963/ticket.md:22-33`
- **Input Revision:** 1
- **First Recorded:** 2026-09-11
- **Last Verified:** 2026-09-11

**Evidence:** Số liệu ticket: 404 included, 23 excluded, 379 not contacted
**Related Tests:** Chưa thiết kế; không automate assertion này khi chưa xác nhận
**Notes:** Cần xác nhận liệu inactive patients có thể làm thay đổi quan hệ tập hợp này.

## Ambiguities and Conflicts

- Ticket nói 379 bệnh nhân nhận `Not Sent - Patient Deleted or Inactive`, trong khi “All patients are marked as `Regular`” và deleted status là `False` (`ticket/PAC2-6963/ticket.md:22-33`). Hai tín hiệu trạng thái có vẻ mâu thuẫn; chưa đủ căn cứ xác định nguồn nào authoritative.
- Acceptance Criteria yêu cầu campaign send và report cùng patient set, nhưng cũng yêu cầu trạng thái `Not Sent` cho trường hợp applicable. Chưa rõ patient set cần khớp ở bước selected/queued hay chỉ ở số contacted thành công.
- “This behaviour is not consistent each time the report is run” (`ticket/PAC2-6963/ticket.md:35`) không nêu tần suất, điều kiện tái hiện, data refresh, hay ví dụ các kết quả khác nhau.
- Linked tickets từ Vauxhall và Oaklands không được cung cấp; không dùng chúng làm nguồn requirement.

## Open Questions

1. Nguồn authoritative cho deleted/inactive status là Analytics, patient record, hay Comms Hub eligibility service?
2. `Deleted Patient Included` có nghĩa là chỉ deleted patients hay tất cả patients bao gồm deleted patients?
3. “Campaign sends reflect the same patient set” so sánh với selected, queued, delivered, hay toàn bộ `Outbox` gồm `Not Sent`?
4. Có rule riêng cho inactive patients không, và cách phân biệt inactive với deleted trong dữ liệu/evidence là gì?
5. Dataset, report, campaign, site, role, và quyền nào có thể dùng an toàn trên dev để tái hiện?
6. Có thể cung cấp linked tickets hoặc acceptance details từ Vauxhall/Oaklands không?
7. Kết quả được coi là nhất quán sau bao nhiêu lần chạy và trong điều kiện data snapshot nào?
8. Việc gửi campaign có side effect ra ngoài không; test nào được phép thực hiện và cần approval cụ thể nào?

---

## Tester notes

[Protected area]
