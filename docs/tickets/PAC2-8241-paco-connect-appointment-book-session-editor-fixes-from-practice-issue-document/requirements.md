# Requirements: PAC2-8241

**Input Revision:** 1  
**Generated:** 2026-10-01  
**Refreshed:** 2026-10-02 (timeline 1 fps)  
**Status:** Active with disputed fix status

## Source Summary

Ticket không có `Description` hoặc Acceptance Criteria chính thức. Scope được suy ra từ comment kỹ thuật ngày 2026-09-22: session có booking phải khóa `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types`; slot phải nằm trong session boundary; muốn thêm slot sau end time phải extend `Time Range` trên session không có booking. Comment `PASSED QA on FB` và video 5:08 là prior validation evidence, không phải expected behavior độc lập. Evidence mới ngày 2026-10-01 (`8241 DEV Not work.mp4`) tạo conflict về fix status.

## Video Coverage

**Timeline:** `docs/tickets/PAC2-8241-paco-connect-appointment-book-session-editor-fixes-from-practice-issue-document/video/timeline.md`  
**Contact Sheet:** `docs/tickets/PAC2-8241-paco-connect-appointment-book-session-editor-fixes-from-practice-issue-document/video/contact-sheet.webp`

Timeline cũ 161 frame (~2s) không có observation. Timeline mới `video/timeline-1s.md` (308 frame, 1 fps): 01:36–05:08 đã review từng frame, 00:00–01:35 lấy mẫu ~50%. URL trong video là `/paco-connect/feature-branch/pac2-8241/...` → evidence thuộc **FB**, không phải DEV main. Role không hiển thị (user `Johnny (2255) Bravo`). Video là prior observation/procedure hint, không phải current result.

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

**Evidence:** `video/timeline-1s.md` 03:27–04:05 và 04:19–04:31 (reopen `Edit Session` giữ state đã lưu trên FB); video không có bước fresh reload; `attachments/128798-8241 DEV Not work.mp4` chưa ingest (ngoài scope tester)  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Cần manual run để resolve, không dùng prior `PASSED QA` làm current result.

---

### REQ-PAC2-8241-005

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** `Edit Session` drawer — extend `Time Range` cập nhật ngay  
**Search Terms/Aliases:** `Edit Session`, `Hours (To)`, `Time Range`, session header time, slot count  
**Known Location:** Unknown trên DEV; FB clue `Appointment Book` → `Day` → session menu → `Edit Session`  
**Actor/Role:** User có quyền edit session; role Unknown  
**Acceptance Criteria Status:** Missing; derived từ FAILED 2026-09-20 + PASSED video

**Preconditions:**
- Session không có booking.

**Expected Behavior:**
Đổi `Hours (To)` (vd 04:00 PM → 05:00 PM) rồi `Save` một lần: toast `Session updated successfully.`, header session đổi sang range mới và slot mới hiển thị ngay, không cần save lần hai.

**Provenance:**
- **Source:** `ticket.md` comment Sean Huynh 2026-09-20 (bullet 2); video 127720
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** Chỉ trên FB (video 01:36–01:53)

**Evidence:** `video/timeline-1s.md` 01:36–01:53 (header `08:00 - 16:00`→`08:00 - 17:00`, slot count 144→150)  
**Related Tests:** TBD tại `TEST_DESIGN`

---

### REQ-PAC2-8241-006

**Classification:** Observed  
**Lifecycle:** Active  
**Feature/Scope:** `EDIT SESSION` slot modal — slot type/bookable/empty changes persist khi reopen  
**Search Terms/Aliases:** `Select All`, `Actions`, `SLOT TYPE`, `Empty Slot Type`, `Bookable`, `NON-BOOKABLE`, `Save will change N slots`, `Undo`  
**Known Location:** Unknown trên DEV; FB clue session slot menu → `Edit Session` (`?preview=true`)  
**Actor/Role:** User có quyền edit session; role Unknown  
**Acceptance Criteria Status:** Missing; derived từ FAILED 2026-09-21 (stale slot types khi reopen)

**Preconditions:**
- Session không có booking.

**Expected Behavior:**
Bulk/single đổi slot type, set `Empty Slot`, bỏ/tick `Bookable` rồi `Save`: dashboard phản ánh thay đổi; reopen `Edit Session` hiển thị đúng state đã lưu (không stale/revert); counter `Available` cập nhật tương ứng.

**Provenance:**
- **Source:** `ticket.md` comments 2026-09-21 (2 comment FAILED); video 127720
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** Chỉ trên FB

**Evidence:** `video/timeline-1s.md` 02:08–04:49 (Available 944→942→890→944; reopen 03:59, 04:29)  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Fresh reload không có trong video → kết hợp REQ-004.

---

### REQ-PAC2-8241-007

**Classification:** Confirmed  
**Lifecycle:** Disputed  
**Feature/Scope:** Cancel rồi book lại slot trong past session phải persist sau reload  
**Search Terms/Aliases:** `Quick Book Appointment`, `Recommended Appointment`, `Cancel only`, `Appointment Cancelled`, `This appointment time is in the past!`  
**Known Location:** Unknown trên DEV; FB clue `Appointment Book` → `Day` past date  
**Actor/Role:** User có quyền book/cancel; role Unknown  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Past session có slot bookable; patient test an toàn.

**Expected Behavior:**
Cancel appointment rồi book lại cùng slot: toast success và UI cập nhật; sau reload page, state mới vẫn giữ (không revert).

**Provenance:**
- **Source:** `ticket.md` comment Sean Huynh 2026-09-22 08:10 (Issue 1); tony.do "Issue 1 ✅"
- **Input Revision:** 1
- **First Recorded:** 2026-10-02
- **Last Verified:** FB video chỉ thấy book (00:12–00:41) và cancel (01:00–01:05); không thấy reload trong phần đã review

**Evidence:** `video/timeline-1s.md` 00:12–01:05  
**Related Tests:** TBD tại `TEST_DESIGN`  
**Notes:** Disputed vì dev xác nhận ✅ nhưng không có evidence reload; mutation cần safe patient + cleanup.

## Ambiguities and Conflicts

- `PASSED QA on FB` ngày 2026-09-22 mâu thuẫn evidence mới `8241 DEV Not work.mp4` ngày 2026-10-01; current fix status là `Disputed`.
- Video prior cho thấy error boundary và preview slots trong cùng flow; chưa đủ chứng minh partial save hay rollback.
- Prior video `Session ends at` đổi `17:00` → `16:55`; thao tác gây thay đổi không đủ rõ.
- `FB` = path `/paco-connect/feature-branch/pac2-8241/` trên host `blinx.dev.blinxpaco-np.com` (Observed từ URL video); DEV target là path chính `/paco-connect/...` — cần xác nhận URL DEV chính xác.
- Sau khi xóa slot cuối, footer `Session ends at: 16:55` trong khi header vẫn `08:00 - 17:00` (video 03:14–04:05) — chưa rõ thiết kế.

## Open Questions

- Test data nào trên current dev có thể dùng an toàn cho hai trạng thái: session có booking và session không booking?
- Evidence `8241 DEV Not work.mp4` tái hiện requirement/case nào cụ thể? (ngoài scope tester hiện tại)
- URL DEV chính xác để re-check (path không `feature-branch`) và role sử dụng?
- Có cần assert server rejection trực tiếp, hay UI rejection + no persistence đủ cho acceptance?

---

## Tester notes

