# Requirements: PAC2-8241

**Input Revision:** 1  
**Generated:** 2026-10-01  
**Status:** Active with disputed fix status

## Source Summary

Ticket không có `Description` hoặc Acceptance Criteria chính thức. Scope được suy ra từ comment kỹ thuật ngày 2026-09-22: session có booking phải khóa `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types`; slot phải nằm trong session boundary; muốn thêm slot sau end time phải extend `Time Range` trên session không có booking. Comment `PASSED QA on FB` và video 5:08 là prior validation evidence, không phải expected behavior độc lập. Evidence mới ngày 2026-10-01 (`8241 DEV Not work.mp4`) tạo conflict về fix status.

## Video Coverage

**Timeline:** `docs/tickets/PAC2-8241-paco-connect-appointment-book-session-editor-fixes-from-practice-issue-document/video/timeline.md`  
**Contact Sheet:** `docs/tickets/PAC2-8241-paco-connect-appointment-book-session-editor-fixes-from-practice-issue-document/video/contact-sheet.webp`

Đã review 161/161 frame. Video cover `Quick Book Appointment`, `Edit Session`, bulk slot change, boundary validation, save toast và navigation sang Configuration. Video không hiển thị role và có vài transition không đủ rõ, nên chỉ dùng làm prior observation/procedure hint.

## Atomic Requirements

### REQ-PAC2-8241-001

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** `Appointment Book` → `Edit Session` field locking  
**Search Terms/Aliases:** `Appointment Book`, `Edit Session`, session editor, `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types`  
**Known Location:** Unknown; product workflow clue `/paco-connect/configuration/#clinics`  
**Actor/Role:** Authenticated user có quyền edit session; run role `Super Admin`  
**Acceptance Criteria Status:** Missing; behavior confirmed bằng written developer clarification

**Preconditions:**
- Session hoặc session sinh từ template có ít nhất một booking.

**Expected Behavior:**
`Time Range`, `Frequency`, `Slot Duration`, `Session Type` và `Slot Types` bị khóa. `Name`, `Location`, `Staff` và `Split` vẫn có thể edit.

**Provenance:**
- **Source:** `ticket.md:157-174`
- **Input Revision:** 1
- **First Recorded:** 2026-10-01
- **Last Verified:** Chưa verify trên dev hiện tại

**Evidence:** `ticket.md:161-163`  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Cần session test có booking an toàn.

---

### REQ-PAC2-8241-002

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Session slot boundary validation  
**Search Terms/Aliases:** add slot, move slot, session end time, `Slots must sit inside the session`, phantom appointments  
**Known Location:** Unknown  
**Actor/Role:** Authenticated user có quyền edit session; run role `Super Admin`  
**Acceptance Criteria Status:** Missing; behavior confirmed bằng written developer clarification

**Preconditions:**
- Mở slot editor cho session có `Time Range` xác định.

**Expected Behavior:**
Add/move slot ra ngoài start/end time bị từ chối với message rõ ràng: `Slots must sit inside the session (<start> to <end>). Change the session times first.` Không lưu slot invalid; slots hiện có giữ nguyên.

**Provenance:**
- **Source:** `ticket.md:164-168`
- **Input Revision:** 1
- **First Recorded:** 2026-10-01
- **Last Verified:** Chưa verify trên dev hiện tại

**Evidence:** `ticket.md:164-168`; prior video timeline `00:03:12`  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Server cũng được mô tả là phải reject; browser-only run chỉ assert qua observable UI/network nếu evidence an toàn.

---

### REQ-PAC2-8241-003

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Extend session và retain existing slots  
**Search Terms/Aliases:** extend `Time Range`, add slots, default slots, session end  
**Known Location:** Unknown  
**Actor/Role:** Authenticated user có quyền edit session; run role `Super Admin`  
**Acceptance Criteria Status:** Missing; behavior confirmed bằng written developer clarification

**Preconditions:**
- Session không có booking.

**Expected Behavior:**
Extend end time rồi save sẽ thêm default slots cho thời gian mở rộng và giữ slots hiện có; sau đó user có thể add/adjust slots trong range mới.

**Provenance:**
- **Source:** `ticket.md:170-174`
- **Input Revision:** 1
- **First Recorded:** 2026-10-01
- **Last Verified:** Chưa verify trên dev hiện tại

**Evidence:** `ticket.md:170-174`  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Nếu session có booking thì requirement 001 khóa `Time Range`.

---

### REQ-PAC2-8241-004

**Classification:** Inferred  
**Lifecycle:** Disputed  
**Feature/Scope:** Save/persistence của session editor  
**Search Terms/Aliases:** `Session updated successfully`, persist, refresh, revert, Configuration  
**Known Location:** Unknown  
**Actor/Role:** Authenticated user có quyền edit session; prior video role Unknown  
**Inference Basis:** Prior failures mô tả values revert; video `PASSED QA on FB` cho thấy success toast và navigation, nhưng frame sampling không chứng minh đầy đủ mọi value sau fresh reload. Evidence mới 2026-10-01 nói `DEV Not work`.
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Save valid session changes.

**Expected Behavior:**
Các thay đổi hợp lệ phải tồn tại sau reopen và fresh reload; UI không được báo success nếu server không lưu.

**Provenance:**
- **Source:** `ticket.md:31-64`, `ticket.md:176-186`
- **Input Revision:** 1
- **First Recorded:** 2026-10-01
- **Last Verified:** Chưa verify trên dev hiện tại

**Evidence:** prior video timeline `00:04:48–00:05:07`; `attachments/128798-8241 DEV Not work.mp4` chưa ingest/review trong focused request  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Cần manual run để resolve, không dùng prior `PASSED QA` làm current result.

## Ambiguities and Conflicts

- `PASSED QA on FB` ngày 2026-09-22 mâu thuẫn evidence mới `8241 DEV Not work.mp4` ngày 2026-10-01; current fix status là `Disputed`.
- Video prior cho thấy error boundary và preview slots trong cùng flow; chưa đủ chứng minh partial save hay rollback.
- Prior video `Session ends at` đổi `17:00` → `16:55`; thao tác gây thay đổi không đủ rõ.
- Ticket không chỉ rõ `FB` là feature branch host nào; configured default dev hiện là `https://blinx.dev.blinxpaco-np.com`.

## Open Questions

- Test data nào trên current dev có thể dùng an toàn cho hai trạng thái: session có booking và session không booking?
- Evidence `8241 DEV Not work.mp4` tái hiện requirement/case nào cụ thể?
- Có cần assert server rejection trực tiếp, hay UI rejection + no persistence đủ cho acceptance?

---

## Tester notes

