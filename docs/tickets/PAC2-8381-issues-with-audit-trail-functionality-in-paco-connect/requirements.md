# Requirements: PAC2-8381

**Input Revision:** 1
**Generated:** 2026-10-02T20:35:43.6011161+07:00
**Status:** Active

## Source Summary

Ticket yêu cầu audit trail của appointment trong `PACO Connect` phân biệt rõ action booking với action tạo slot/session. Audit phải ghi đúng user, thời điểm booking và câu mô tả tương đương `<user> booked this appointment`. Booking từ `Care Navigation` và booking trực tiếp trong `Connect` đều cần audit. Thay đổi appointment, gồm đổi `Slot Type`, và cancellation cần tạo audit đúng user/thời gian. Appointment slide panel cần hiển thị đúng `Booked by`/`Actioned by`.

Ticket không có section `Acceptance Criteria`; các statement trong `Description` được dùng làm requirement source. Video direct booking quan sát wording cũ `Beth Green created this slot`; video `Care Navigation` không ghi lại flow booking.

## Video Coverage

**Timeline:** `docs/tickets/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/video/timeline.md`  
**Contact Sheet:** `docs/tickets/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/video/contact-sheet.webp`  
**Detailed Notes:** `docs/tickets/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/video/video-notes.md`

- Direct `Connect` booking: `Quick Book` → chọn patient → `Book Appointment` → appointment panel → `Audit`. Quan sát `BOOKED BY: Beth Green` và audit `Beth Green created this slot`.
- `Care Navigation`: chỉ thấy patient card và service tiles; không có click/booking/audit result.
- Mức hiểu flow từ video: 85% cho direct `Connect` booking; dưới 80% cho `Care Navigation` booking và appointment amendment vì hai flow không xuất hiện. Các phần thiếu được giữ thành `Open Question` và coverage cần chạy trực tiếp.

## Atomic Requirements

### REQ-PAC2-8381-001

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Appointment booking audit description  
**Search Terms/Aliases:** `Audit`, `Audit Trail`, `View Audit Log`, `created this slot`, `booked this appointment`, appointment audit  
**Known Location:** Route clue `/paco-connect/appointment-book`; appointment slide panel → `Audit`  
**Actor/Role:** User booking appointment; exact required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- User can book an appointment in `PACO Connect`.
- Appointment slide panel and `Audit` tab are accessible.

**Expected Behavior:**
Audit entry for booking clearly identifies action as booking an appointment, using a matching sentence such as `<user> booked this appointment`; it must not describe booking as `created this slot`.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** `video/video-notes.md:42-56`  
**Related Tests:** TBD  
**Notes:** Video shows current/previous wording mismatch; this observation does not prove current target build status.

---

### REQ-PAC2-8381-002

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Audit actor and booking timestamp  
**Search Terms/Aliases:** `Booked by`, `Actioned by`, user, date, time, created user  
**Known Location:** Appointment slide panel and `Audit` tab; exact live route requires `LOCATE`  
**Actor/Role:** Booking user; exact required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- Appointment is booked by an identifiable authenticated user.

**Expected Behavior:**
Booking audit records correct booking user and correct booking time, both corresponding to the actual booking action.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13` items 1c and ticket introduction
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** Video confirms `BOOKED BY: Beth Green`, but notes do not establish exact audit timestamp correctness: `video/video-notes.md:28-55`.  
**Related Tests:** TBD  
**Notes:** Timestamp display format and tolerance are unspecified.

---

### REQ-PAC2-8381-003

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Direct `PACO Connect` booking audit  
**Search Terms/Aliases:** `Quick Book`, `Book Appointment`, direct booking, appointment panel  
**Known Location:** `/paco-connect/appointment-book`; `Quick Book` flow  
**Actor/Role:** Booking user; video used `Super Admin GB`, required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- Bookable slot and safe test patient exist in `PACO Connect`.

**Expected Behavior:**
Booking directly in `Connect` creates a concise audit entry satisfying REQ-PAC2-8381-001 and REQ-PAC2-8381-002.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13` item 1b
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** Reproduction flow and prior observation: `video/video-notes.md:14-56`.  
**Related Tests:** TBD  
**Notes:** Video environment was feature branch `pac2-8012`, not stated target branch for PAC2-8381.

---

### REQ-PAC2-8381-004

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** `Care Navigation` booking audit visibility in `PACO Connect` FE  
**Search Terms/Aliases:** `Care Navigation`, service tiles, booking audit, no appointment audit trail in FE  
**Known Location:** Start clue `/care-navigation/`; target audit location in `PACO Connect` requires `LOCATE`  
**Actor/Role:** Care Navigation booking user; exact required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- Safe patient and a bookable `Care Navigation` service/appointment exist.
- Resulting appointment can be opened in `PACO Connect`.

**Expected Behavior:**
Appointment booked through `Care Navigation` has an appointment booking audit entry visible in the `PACO Connect` frontend, with correct action, user and time.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13` item 1a
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** `video/video-notes.md:60-106` only shows home view; no booking result.  
**Related Tests:** TBD  
**Notes:** Exact service tile and end-to-end booking steps remain unknown.

---

### REQ-PAC2-8381-005

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Appointment amendment audit  
**Search Terms/Aliases:** amend appointment, `Slot Type`, change, update audit, appointment audit  
**Known Location:** Appointment/slot editor under `PACO Connect`; exact action requires `EXPLORE`  
**Actor/Role:** User amending appointment; exact required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- Existing test appointment can be amended safely.

**Expected Behavior:**
Amending an appointment creates an audit record for the change. Changing `Slot Type` after booking must not leave the audit unchanged.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13` item 1d
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** Ticket claim only; videos do not demonstrate amendment: `video/video-notes.md:108-112`.  
**Related Tests:** TBD  
**Notes:** Required audit wording and whether old/new values must appear are unspecified.

---

### REQ-PAC2-8381-006

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Appointment cancellation audit  
**Search Terms/Aliases:** cancel appointment, cancellation audit, cancelling user, cancellation time  
**Known Location:** Appointment slide panel; exact cancellation control requires `EXPLORE`  
**Actor/Role:** User cancelling appointment; exact required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- Existing owned test appointment can be cancelled safely.

**Expected Behavior:**
Appointment cancellation is captured in audit with correct cancelling user and time.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13` item 1d
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** Ticket states prior observation; no supporting video segment.  
**Related Tests:** TBD  
**Notes:** Cancellation wording and timestamp tolerance are unspecified.

---

### REQ-PAC2-8381-007

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Appointment slide panel attribution  
**Search Terms/Aliases:** `Booked by`, `Actioned by`, appointment slide panel, created user  
**Known Location:** Appointment slide panel right-side metadata  
**Actor/Role:** Viewer with access to appointment details; exact required role Unknown  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement stated in ticket `Description`

**Preconditions:**
- Appointment exists and slide panel is open.

**Expected Behavior:**
Appointment slide panel correctly populates booking attribution in the `Booked by`/`Actioned by` presentation defined by the deployed UI.

**Provenance:**
- **Source:** `ticket/PAC2-8381-issues-with-audit-trail-functionality-in-paco-connect/ticket.md:13` item 1e
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** 2026-10-02

**Evidence:** Video observes `BOOKED BY: Beth Green`: `video/video-notes.md:28-55`.  
**Related Tests:** TBD  
**Notes:** Ticket says `Actioned by column`, while video shows `BOOKED BY` field; expected final label is ambiguous.

---

## Ambiguities and Conflicts

- Ticket nói `Booked by` không visible, nhưng video direct booking thấy `BOOKED BY: Beth Green`. Có thể video ở build khác hoặc issue đã sửa một phần; cần kiểm tra target environment.
- Ticket item 1e dùng cả `Booked by` và `Actioned by column`; không xác định label cuối cùng bắt buộc là gì.
- Video direct booking dùng feature branch `pac2-8012`, không phải branch PAC2-8381; video chỉ là source/history, không chứng minh current fix.
- Filename video `no tiles clickable in connect` gợi ý lỗi click tile, nhưng nội dung không có click attempt; chưa đủ basis đưa clickability thành requirement của audit trail.
- Workflow product hiện có chỉ hỗ trợ route/setup hints; không được dùng làm expected-result source.

## Open Questions

1. Target environment/feature branch nào chứa fix PAC2-8381? Comment Jira chỉ nói `Feature branch in testing tab`.
2. Role dùng để test là gì? Video dùng `Super Admin GB`; ticket không quy định role.
3. Safe patient, `Appointment Book`, bookable slot và `Care Navigation` service tile nào được phép dùng?
4. Booking timestamp cần exact format/tolerance nào?
5. Appointment amendment audit cần wording gì và có bắt buộc ghi old/new `Slot Type` không?
6. Label cuối cùng trong slide panel phải là `Booked by`, `Actioned by`, hay hai field khác nhau?
7. Flow `Care Navigation` chính xác bắt đầu từ tile nào và appointment kết quả được tìm lại trong `PACO Connect` bằng cách nào?
8. Lỗi `no tiles clickable` có nằm trong PAC2-8381 hay chỉ là blocker/evidence ngoài scope?

---

## Tester notes

[Protected area]
