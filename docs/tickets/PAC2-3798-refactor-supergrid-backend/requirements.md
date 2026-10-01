# Requirements: PAC2-3798

**Input Revision:** 1
**Generated:** 2026-09-21
**Status:** Active

## Source Summary

Ticket mô tả refactor lớn `supergrid` nhằm tăng responsiveness và thay đổi đồng thời `Analytics`, `C&D`, các bảng dùng `Aggrid`, `advanced search`, báo cáo chia sẻ URL, `pivot mode`, export/send flows và thứ tự/nội dung tab. Không có Acceptance Criteria, role, test data, expected result chi tiết hoặc baseline kèm theo.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

Không có video source trong ticket.

## Atomic Requirements

### REQ-PAC2-3798-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Responsiveness của `supergrid` khi tạo report mới hoặc clear `advanced search`
**Search Terms/Aliases:** `supergrid`, `new report`, `create report`, `advanced search`, `clear`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- User truy cập được khu vực có `supergrid`.

**Expected Behavior:**
- Tạo report mới hoặc clear `advanced search` không yêu cầu page refresh.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:6-9`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Chưa định nghĩa indicator/loading state hay tiêu chí responsiveness đo được.

---

### REQ-PAC2-3798-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient count trong grid
**Search Terms/Aliases:** `patient count`, `grid data`, `supergrid`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Grid có patient count và grid data.

**Expected Behavior:**
- `Patient count` tải độc lập với grid data; không cần refresh lại mỗi lần grid thay đổi.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:10-11`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Mục tiêu “loads faster” không có ngưỡng thời gian.

---

### REQ-PAC2-3798-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Aggrid` trên `supergrid`
**Search Terms/Aliases:** `Aggrid`, `supergrid`, `analytics`, `tables`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- User có quyền xem một hay nhiều bảng `supergrid`.

**Expected Behavior:**
- Nâng cấp `Aggrid` áp dụng xuyên suốt `supergrid`, không chỉ `Analytics`.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:12`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Danh sách bảng chịu ảnh hưởng chưa được cung cấp.

---

### REQ-PAC2-3798-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Graph trong `Analytics` grid
**Search Terms/Aliases:** `Analytics`, `graph`, `graphs`, `numerical values`, `grid`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- `Analytics` grid có numerical value.

**Expected Behavior:**
- Graph khả dụng trong `Analytics` grid cho numerical value.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:13-14`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Không xác định loại graph, trigger hay column type chi tiết.

---

### REQ-PAC2-3798-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `pivot mode` và `pivot mode helper modal`
**Search Terms/Aliases:** `pivot mode`, `pivot helper`, `pivot modal`, `aggregate`, `pivot column`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- User truy cập `Analytics`/`supergrid` có cấu hình pivot.

**Expected Behavior:**
- `Pivot mode` có helper modal hỗ trợ user xây dựng pivot có ý nghĩa; chỉ column phù hợp mới dùng được làm aggregate function hoặc pivot column.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:15-16,32-35`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Eligibility rules của column chưa xác định.

---

### REQ-PAC2-3798-006

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Migration `advanced search` cũ
**Search Terms/Aliases:** `old advanced search`, `advanced search editor`, `deprecated`, `update`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Có saved `advanced search` cũ; user mở search đó trong `advanced search editor`.

**Expected Behavior:**
- Old `advanced search` bị deprecated và được update sang dạng mới khi load vào editor.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:17-18`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Cần test data chứa search cũ; chưa rõ update có persistent hay không.

---

### REQ-PAC2-3798-007

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Shareable report URL
**Search Terms/Aliases:** `report ID`, `URL`, `anchor`, `share`, `bookmark`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Report tồn tại và có ID.

**Expected Behavior:**
- URL chứa report ID dạng anchor để có thể copy, share hoặc bookmark report.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:20-21`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Chưa xác nhận behavior khi mở URL bằng session/user khác hoặc report không tồn tại.

---

### REQ-PAC2-3798-008

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Analytics` tab và `C&D`
**Search Terms/Aliases:** `Analytics`, `C&D`, `tabs`, `QOF`, `registers`, `observations`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- User truy cập các tab `Analytics` và `C&D`.

**Expected Behavior:**
- `Analytics` tabs được reorder theo tần suất sử dụng; `QOF` và `registers` tabs bị remove; `C&D with observations` được rename để rõ nghĩa hơn.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:22-28`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Target order và target label mới chưa được nêu.

---

### REQ-PAC2-3798-009

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Regression-sensitive `Analytics` flows
**Search Terms/Aliases:** `Analytics`, `send to comms hub`, `generate CSV`, `column settings`
**Known Location:** Unknown
**Actor/Role:** Unknown
**Acceptance Criteria Status:** Missing

**Preconditions:**
- User có quyền thực hiện relevant `Analytics` flows.

**Expected Behavior:**
- Các flow `send to comms hub` và `generate CSV` vẫn được bao phủ regression; column settings có thể cần điều chỉnh cho pivot configuration.

**Provenance:**
- **Source:** `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:30-35`
- **Input Revision:** 1
- **First Recorded:** 2026-09-21
- **Last Verified:** 2026-09-21

**Evidence:** Ticket source
**Related Tests:** TBD
**Notes:** Đây là phạm vi/risk ticket, không phải acceptance result chi tiết. `send to comms hub` có side effect và cần approval, verified test recipient/destination trước execution.

---

## Ambiguities and Conflicts

- Ticket không có Acceptance Criteria, baseline, role, test data hoặc expected result chi tiết.
- “Reordered to reflect how often they are used” không cung cấp thứ tự đích.
- Rename của `C&D with observations` không cung cấp label đích.
- Migration old `advanced search` chưa xác định persistence, schema mapping hoặc fallback/error behavior.
- Eligibility của aggregate/pivot column chưa xác định.

## Open Questions

1. Role nào và test data nào được phép dùng cho `Analytics`, `C&D`, old `advanced search` và report sharing? Ảnh hưởng LOCATE và toàn bộ test cases.
2. Thứ tự đích của `Analytics` tabs và label mới của `C&D with observations` là gì? Ảnh hưởng REQ-PAC2-3798-008.
3. Điều kiện eligibility chính xác cho aggregate function và pivot column là gì? Ảnh hưởng REQ-PAC2-3798-005.
4. Old `advanced search` được migrate chỉ in-memory hay persist sau khi load? Expected behavior khi migration lỗi? Ảnh hưởng REQ-PAC2-3798-006.
5. `send to comms hub` có approved test recipient/destination và approval mutation nào? Ảnh hưởng REQ-PAC2-3798-009.

---

## Tester notes

