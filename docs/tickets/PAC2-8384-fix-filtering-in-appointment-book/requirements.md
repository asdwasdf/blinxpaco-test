# Requirements: PAC2-8384

**Input Revision:** 1
**Generated:** 2026-09-25
**Status:** Active

## Source Summary

Ticket yêu cầu sửa các filter trong `Appointment Book`, trọng tâm là `Location` khi mở một hoặc nhiều appointment book. Mô tả nêu các lỗi/cải tiến đề xuất: option có thể thiếu ở single-book, multi-book chỉ hiện dữ liệu của một book hoặc rỗng, trạng thái tải/empty khó phân biệt, và kết quả filter chỉ áp dụng trên dữ liệu thuộc date range cùng các book đang chọn. Ticket không có Acceptance Criteria chính thức. Comment ngày 2026-09-24 xác nhận behavior hiện tại của `Appointment Type`: chỉ hiện option đang dùng trong book và khi chọn sẽ lọc cả session lẫn slot có appointment phù hợp; thay đổi behavior này cần BA xác nhận.

## Video Coverage

| Video | Timeline | Contact sheet | Nội dung review |
|---|---|---|---|
| `126788` | `video/126788/timeline.md` | `video/126788/contact-sheet.webp` | Luồng một appointment book; mở filter sidebar và thao tác `Location`. |
| `126786` | `video/126786/timeline.md` | `video/126786/contact-sheet.webp` | Luồng nhiều appointment book; mở filter sidebar và so sánh option `Location`. |
| `126787` | `video/126787/timeline.md` | `video/126787/contact-sheet.webp` | Luồng nhiều book; thao tác `Appointment Type`, `Slot Type`, `Session`, `Book`, `Patient`. |

Video là source minh họa behavior được ticket báo cáo. Environment và role của bản ghi không được xác định, nên không nâng các quan sát từ video thành expected behavior độc lập.

## Atomic Requirements

### REQ-PAC2-8384-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Appointment Book` — option của `Location` với một appointment book
**Search Terms/Aliases:** `Appointment Book`, appointment books, `Filters`, `Location`, locations
**Known Location:** `Appointment Book` → filter sidebar → `Location` (location clue từ ticket/video; cần browser validation)
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Một appointment book được chọn.
- Date range chứa dữ liệu liên quan.

**Expected Behavior:**
Option `Location` thuộc appointment book đang chọn phải tải và bao gồm location mới thêm khi location đó thuộc dữ liệu trong scope hiện hành.

**Provenance:**
- **Source:** `ticket.md:13`, mục `6a. Open one appointment book and check Location filter options load` và kết quả báo cáo `Not showing newly added location`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/126788/timeline.md`, `video/126788/contact-sheet.webp`
**Related Tests:** Chưa thiết kế
**Notes:** Ticket không định nghĩa rõ “newly added” location, cách tạo test data, hoặc thời điểm dữ liệu phải xuất hiện.

---

### REQ-PAC2-8384-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Appointment Book` — option của `Location` với nhiều appointment book
**Search Terms/Aliases:** `Appointment Book`, multiple books, `Filters`, `Location`, locations
**Known Location:** `Appointment Book` → chọn nhiều appointment book → filter sidebar → `Location` (cần browser validation)
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Nhiều appointment book được chọn.
- Các book có location khác nhau trong date range.

**Expected Behavior:**
Danh sách option `Location` phải tải dữ liệu từ toàn bộ appointment book đang chọn, không chỉ một book và không rỗng do multi-book input.

**Provenance:**
- **Source:** `ticket.md:13`, mô tả lỗi multi-book và mục `6b. Open multiple appointment books and check Location filter options load`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/126786/timeline.md`, `video/126786/contact-sheet.webp`
**Related Tests:** Chưa thiết kế
**Notes:** Ticket đề xuất backend array hoặc fan-out/merge client-side nhưng không xác nhận implementation bắt buộc.

---

### REQ-PAC2-8384-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Multi-book filter options: `Slot Type`, `Session`, `Clinician`, `Patient`
**Search Terms/Aliases:** `Slot Type`, slot types, `Session`, sessions, `Clinician`, clinicians, `Patient`, patients, multiple books
**Known Location:** `Appointment Book` → chọn nhiều appointment book → filter sidebar (cần browser validation)
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Nhiều appointment book được chọn.
- Các book có dữ liệu filter khác nhau trong date range.

**Expected Behavior:**
Các danh sách option `Slot Type`, `Session`, `Clinician` và `Patient` phải tải option phù hợp từ toàn bộ appointment book đang chọn.

**Provenance:**
- **Source:** `ticket.md:13`, lỗi chung của multi-book và mục `6c`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/126787/timeline.md`, `video/126787/contact-sheet.webp`
**Related Tests:** Chưa thiết kế
**Notes:** Dòng “Slot Type, Session, Book, Patient all work” mô tả behavior quan sát trước fix, không loại bỏ regression coverage cho các filter liên quan.

---

### REQ-PAC2-8384-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Kết quả áp dụng filter trên nhiều appointment book
**Search Terms/Aliases:** apply filters, filtered results, multiple appointment books, date range
**Known Location:** `Appointment Book` → chọn nhiều book → filter sidebar → apply filter (cần browser validation)
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Nhiều appointment book được chọn.
- Filter option hợp lệ được chọn.

**Expected Behavior:**
Kết quả sau khi áp dụng filter phải đúng trên toàn bộ appointment book đang chọn, trong date range hiện hành.

**Provenance:**
- **Source:** `ticket.md:13`, mục `5d. Apply filters across multiple appointment books and confirm results are correct`; mô tả scope date range/selected books
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Ticket text; video hỗ trợ navigation nhưng không xác lập đầy đủ expected dataset.
**Related Tests:** Chưa thiết kế
**Notes:** Cần test data có mapping rõ giữa book, location và các filter option để tính expected result.

---

### REQ-PAC2-8384-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Behavior hiện hành của `Appointment Type`
**Search Terms/Aliases:** `Appointment Type`, appointment types, `F2F`, slots, sessions
**Known Location:** `Appointment Book` → filter sidebar → `Appointment Type` (cần browser validation)
**Actor/Role:** Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Appointment book/date range có appointment type đang được sử dụng.

**Expected Behavior:**
Danh sách `Appointment Type` chỉ hiện option đang dùng trong book hiện hành. Khi chọn một type, hệ thống lọc session và cả slot có appointment khớp type đó. Không coi việc chỉ hiện `F2F` hoặc ẩn các slot/session không khớp là defect nếu dataset phù hợp.

**Provenance:**
- **Source:** `ticket.md:31-35`, comment ngày 2026-09-24
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/126787/timeline.md`, `video/126787/contact-sheet.webp`
**Related Tests:** Chưa thiết kế
**Notes:** Comment yêu cầu BA xác nhận nếu muốn đổi behavior này.

---

### REQ-PAC2-8384-006

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Trạng thái tải và empty state của từng filter section
**Search Terms/Aliases:** loading, no locations found, empty state, filter section
**Known Location:** `Appointment Book` → filter sidebar → từng filter section (cần browser validation)
**Actor/Role:** Unknown
**Inference Basis:** Ticket ghi “Proposed fix” về explicit loading và empty state; không có Acceptance Criteria xác nhận đây là phạm vi phải giao.
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Filter panel và section được mở lần đầu.

**Expected Behavior:**
Nếu đề xuất thuộc scope được duyệt, từng filter section phải phân biệt rõ trạng thái đang tải với trạng thái không có option trong range.

**Provenance:**
- **Source:** `ticket.md:13`, đoạn `Proposed fix`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Ticket text
**Related Tests:** Chưa thiết kế; không tự động hóa assertion này khi chưa xác nhận.
**Notes:** Cần BA/PO xác nhận scope.

---

### REQ-PAC2-8384-007

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Discoverability của `Location`
**Search Terms/Aliases:** location chip, toolbar, search bar, filter chips, discoverability
**Known Location:** `Appointment Book` toolbar/search area (đề xuất, chưa xác minh)
**Actor/Role:** Unknown
**Inference Basis:** Ticket ghi “Proposed fix” về `Location` chip cạnh filter chip; không có Acceptance Criteria xác nhận.
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Người dùng ở `Appointment Book`.

**Expected Behavior:**
Nếu đề xuất thuộc scope được duyệt, entry point cho `Location` phải dễ thấy từ toolbar/search area thay vì chỉ nằm trong sidebar.

**Provenance:**
- **Source:** `ticket.md:13`, đoạn `Proposed fix`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** Ticket text
**Related Tests:** Chưa thiết kế; không tự động hóa assertion này khi chưa xác nhận.
**Notes:** Cần BA/PO xác nhận UI design và expected control.

## Ambiguities and Conflicts

- Ticket không có Acceptance Criteria; các mục đánh số `6a`, `6b`, `6c`, `5d` được dùng làm scope observable, không giả định là AC chính thức.
- Mô tả ban đầu gọi `Appointment Type` chỉ có `F2F` và ẩn một phần session là vấn đề; comment ngày 2026-09-24 nói đây là behavior đúng. Claim này dùng comment mới hơn làm nguồn Confirmed; mọi thay đổi cần BA xác nhận.
- “Not showing newly added location” không nêu location, book, date range hoặc thời điểm đồng bộ.
- Video không xác định environment/role; chỉ dùng làm source minh họa, không gắn nhãn `Observed` theo chuẩn environment hiện tại.

## Open Questions

1. Role nào phải dùng để test `Appointment Book` và filters?
2. Test data nào có ít nhất hai appointment book với location, slot type, session, clinician và patient khác nhau nhưng có expected mapping rõ?
3. Hai đề xuất UI — `Location` chip và explicit loading/empty state — có nằm trong phạm vi bắt buộc của PAC2-8384 không?
4. “Newly added location” được tạo ở đâu, cần chờ đồng bộ bao lâu, và phải xuất hiện dựa trên configuration hay chỉ khi có session trong date range?
5. Với filter applied across multiple books, expected behavior cụ thể cho slot trống, session và appointment là gì ngoài rule đã xác nhận cho `Appointment Type`?

---

## Tester notes

[Protected area]
