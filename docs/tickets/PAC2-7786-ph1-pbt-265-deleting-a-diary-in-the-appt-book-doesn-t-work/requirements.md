# Requirements: PAC2-7786

**Input Revision:** 1  
**Generated:** 2026-10-01  
**Status:** Active

## Source Summary

Ticket báo lỗi không thể xóa hoàn toàn một diary/session khỏi appointment book. Nguồn ticket không có mục `Acceptance criteria` riêng, nhưng phần mô tả và bình luận xác nhận người dùng cần xóa được session không có booking. Bình luận kỹ thuật ghi ba lỗi trong `deleteSessionById`: từ chối xóa bị báo thành công, archived session gây lỗi, và early return làm rò transaction. Hai PR backend/frontend phải được QA theo cặp.

QA sau đó ghi nhận thêm hai vấn đề: `Delete Session` biến mất và xuất hiện `Block Session`; thao tác remove session khỏi appointment book xảy ra trước bước xác nhận. Video đính kèm đã được ingest và contact sheet được review; role và environment trong video chưa được nguồn xác nhận nên visual chỉ dùng làm bằng chứng hỗ trợ, không nâng thành `Observed`.

## Video Coverage

- **Timeline 1:** `docs/tickets/PAC2-7786-ph1-pbt-265-deleting-a-diary-in-the-appt-book-doesn-t-work/video/PAC2-7786/timeline.md`
- **Contact Sheet 1:** `docs/tickets/PAC2-7786-ph1-pbt-265-deleting-a-diary-in-the-appt-book-doesn-t-work/video/PAC2-7786/contact-sheet.webp`
- **Timeline 2:** `docs/tickets/PAC2-7786-ph1-pbt-265-deleting-a-diary-in-the-appt-book-doesn-t-work/video/screen-recording-2026-08-27/timeline.md`
- **Contact Sheet 2:** `docs/tickets/PAC2-7786-ph1-pbt-265-deleting-a-diary-in-the-appt-book-doesn-t-work/video/screen-recording-2026-08-27/contact-sheet.webp`
- Video `PAC2-7786.mp4` hỗ trợ claim remove xảy ra trước confirmation và cho thấy appointment-book grid cùng dialog.
- Video `Screen Recording 2026-08-27...mov` hỗ trợ các flow quản lý session, dialog delete/refusal, và trạng thái session trên appointment book/configuration.
- Environment/role/test-data cụ thể trong hai recording vẫn là `Open Question`.

## Atomic Requirements

### REQ-PAC2-7786-001

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Xóa diary/session khỏi appointment book  
**Search Terms/Aliases:** `diary`, `session`, `appointment book`, `appt book`, `Delete Session`, `remove session`  
**Known Location:** Unknown  
**Actor/Role:** User có quyền quản lý appointment book; role cụ thể Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; expected behavior có trong Description và comment

**Preconditions:**
- Session tồn tại trong appointment book.
- Session đủ điều kiện xóa theo business rules; ít nhất scenario mới tạo, không có booking cần được cover.

**Expected Behavior:**
Người dùng có thể xóa hoàn toàn session đủ điều kiện khỏi appointment book; session không còn tồn tại trong configuration sau khi thao tác thành công.

**Provenance:**
- **Source:** `ticket.md:13`, `ticket.md:40-48`, `ticket.md:81-99`, `ticket.md:135-139`
- **Input Revision:** 1
- **First Recorded:** 2026-08-06
- **Last Verified:** 2026-10-01

**Evidence:** `ticket.md:99`; video timelines/contact sheets nêu trên  
**Related Tests:** Chưa thiết kế  
**Notes:** Claim “brand-new session, no bookings” chưa giải thích hết bởi ba root cause đã nêu; cần retest trên build ghép FE/BE.

---

### REQ-PAC2-7786-002

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Từ chối xóa session có booked appointments  
**Search Terms/Aliases:** `SESSION_HAS_BOOKINGS`, `Delete Session`, `booked appointments`, `booking count`  
**Known Location:** Unknown  
**Actor/Role:** User có quyền quản lý session; role cụ thể Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; behavior sửa lỗi được xác nhận trong comment kỹ thuật

**Preconditions:**
- Session có ít nhất một booked appointment.

**Expected Behavior:**
Hệ thống không xóa session, trả failure rõ ràng thay vì success giả, và cung cấp lý do `SESSION_HAS_BOOKINGS` cùng booking count cho UI xử lý.

**Provenance:**
- **Source:** `ticket.md:111-129`
- **Input Revision:** 1
- **First Recorded:** 2026-08-21
- **Last Verified:** 2026-10-01

**Evidence:** `ticket.md:123-129`  
**Related Tests:** Chưa thiết kế  
**Notes:** Exact user-facing message chưa được ticket quy định.

---

### REQ-PAC2-7786-003

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Xóa archived session  
**Search Terms/Aliases:** `archived session`, `includeArchived`, `Delete Session`, `hide`, `obsolete`  
**Known Location:** Unknown  
**Actor/Role:** User có quyền quản lý session; role cụ thể Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; behavior sửa lỗi được xác nhận trong comment kỹ thuật

**Preconditions:**
- Session từng được archived.
- Session không bị chặn bởi booking/reference hợp lệ khác.

**Expected Behavior:**
Archived state không làm session trở nên không thể xóa và thao tác không trả lỗi 500 chỉ vì session archived.

**Provenance:**
- **Source:** `ticket.md:127-129`
- **Input Revision:** 1
- **First Recorded:** 2026-08-21
- **Last Verified:** 2026-10-01

**Evidence:** `ticket.md:127`  
**Related Tests:** Chưa thiết kế  
**Notes:** Cần xác nhận UI biểu diễn archived session và đường vào delete.

---

### REQ-PAC2-7786-004

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Confirmation trước khi remove session khỏi appointment book  
**Search Terms/Aliases:** `remove session`, `confirmation`, `confirm`, `appointment book`, `diary`  
**Known Location:** Unknown  
**Actor/Role:** User có quyền quản lý appointment book; role cụ thể Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; regression expectation được ghi trong QA comment

**Preconditions:**
- Session đang hiển thị trong appointment book.
- User bắt đầu action remove/delete.

**Expected Behavior:**
Hệ thống yêu cầu confirmation trước khi session bị remove; cancel không được thay đổi dữ liệu.

**Provenance:**
- **Source:** `ticket.md:157-161`
- **Input Revision:** 1
- **First Recorded:** 2026-08-27
- **Last Verified:** 2026-10-01

**Evidence:** `ticket.md:161`; `video/PAC2-7786/contact-sheet.webp`  
**Related Tests:** Chưa thiết kế  
**Notes:** Copy và dạng confirmation chưa được ticket quy định.

---

### REQ-PAC2-7786-005

**Classification:** Confirmed  
**Lifecycle:** Disputed  
**Feature/Scope:** Availability của `Delete Session` so với `Block Session`  
**Search Terms/Aliases:** `Delete Session`, `Block Session`, `session options`, `diary options`  
**Known Location:** Unknown  
**Actor/Role:** User trên FB được QA dùng; role cụ thể Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- User mở action menu của session trên appointment book.

**Expected Behavior:**
`Delete Session` vẫn khả dụng theo behavior trước đây; việc xuất hiện thêm `Block Session` không được thay thế chức năng delete nếu không có requirement thay đổi rõ ràng.

**Provenance:**
- **Source:** `ticket.md:145-155`
- **Input Revision:** 1
- **First Recorded:** 2026-08-27
- **Last Verified:** 2026-10-01

**Evidence:** `ticket.md:151-155`; `video/screen-recording-2026-08-27/contact-sheet.webp`  
**Related Tests:** Chưa thiết kế  
**Notes:** `Disputed` vì ticket không chứa quyết định sản phẩm chính thức về quan hệ giữa `Block Session` và `Delete Session`.

## Ambiguities and Conflicts

- `ticket.md:47-51`: `Expected Outcome` và `Actual Outcome` đều ghi “To be able to remove a diary…”, nên actual outcome tại đoạn này mâu thuẫn với Description; dùng Description và QA evidence làm nguồn lỗi, không coi dòng actual đó là behavior đúng.
- `ticket.md:93-99` ghi session mới, không booking vẫn không xóa được; `ticket.md:135-139` thừa nhận ba root cause chưa chắc giải thích scenario này. Giữ scope retest, không suy đoán nguyên nhân thứ tư.
- `ticket.md:145-155` coi mất `Delete Session` là regression, nhưng chưa có BA/PO decision xác nhận `Block Session` phải coexist hay replace delete.
- Ticket yêu cầu hai PR FE/BE test paired (`ticket.md:115-120`), nhưng source import không xác nhận environment nào đã deploy đủ cặp.
- Hai video cho thấy UI và dialog, nhưng không đủ provenance để xác nhận role, environment, hay dữ liệu có booking/archive; không phân loại các frame là `Observed`.

## Open Questions

1. Environment nào có cả backend PR 695 và frontend PR 2720 để retest paired?
2. Role/permission nào phải dùng để quản lý và xóa diary/session?
3. `Block Session` có phải coexist với `Delete Session`, hay thay thế trong một số trạng thái/session type?
4. User-facing message chính xác khi session có bookings là gì, hay chỉ cần failure rõ ràng và không báo “Session deleted.”?
5. “Referenced as a template” có phải điều kiện hợp lệ để chặn delete không; expected message là gì?
6. Các video được ghi ở environment/role nào và test data có booking/archive status gì?
7. Ticket thiếu formal `Acceptance criteria`; có cần thêm coverage cho transaction leak qua repeated refusals/performance hoặc DB-level verification không?

---

## Tester notes

[Protected area]
