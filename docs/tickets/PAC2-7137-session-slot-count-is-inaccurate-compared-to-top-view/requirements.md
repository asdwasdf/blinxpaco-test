# Requirements: PAC2-7137

**Input Revision:** 1  
**Generated:** 2026-09-30  
**Status:** Active

## Source Summary

Ticket yêu cầu các count trong `Appointment Book` phải nhất quán giữa summary ở đầu `Day`/`Week` view và các session/detail blocks. Source mô tả nhiều lần fail: slot chuyển thành non-bookable bị loại khỏi session thay vì vẫn hiển thị blocked; `Booked` tổng không bằng tổng booking hiển thị; `Available` theo ngày không bằng tổng capacity của từng slot. Ticket không có Acceptance Criteria riêng; expected behavior được nêu trực tiếp trong comments và attachment captions.

## Video Coverage

Đã ingest và review contact sheet của 8 video dưới `docs/tickets/PAC2-7137-session-slot-count-is-inaccurate-compared-to-top-view/video/`:

- `117378-20260703-1212-00.5637485/`: thao tác `Appointment Book`, thay đổi slot/session và quan sát các count.
- `117381-Screen_sharing_-_2026-07-03_1_40_15_PM/`: `Day` view, menu slot, dialog `Edit Slot`, toggle `Bookable`, rồi kiểm tra slot sau save.
- `117419-20260703-1813-51.5665139/`: luồng cấu hình và kiểm tra session/appointment counts.
- `117623-20260706-1317-12.2371613/`: `Appointment Book`, sửa `Bookable`, quan sát slot/detail blocks.
- `117731-20260706-2227-10.5886819/`: kiểm tra count sau thay đổi.
- `117801-20260707-1038-39.5541664/`: kiểm tra `Day`/`Week` views và `Sessions`, `Booked`, `Available` counts.
- `120739-20260729-1641-27.5946892/` và bản duplicate `120740-.../`: kiểm tra `Week` view; từng slot thứ Bảy hiển thị `Available 3`, trong khi summary ngày hiển thị tổng.

Timeline frame timestamps là extraction aids; contact sheets được dùng để xác nhận phạm vi và terminology, không tự nâng behavior thành `Confirmed`. Các image/video chứa dữ liệu người dùng/patient; chỉ tham chiếu local, không sao chép PII vào artifact.

## Atomic Requirements

### REQ-PAC2-7137-001

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** `Appointment Book` count consistency giữa summary và session/detail blocks  
**Search Terms/Aliases:** `Appointment Book`, `Appt. Book`, session, session slot, top bar, top view, `Sessions`, `Booked`, `Available`, `Day`, `Week`  
**Known Location:** URL clue từ attachment: `/paco-connect/appointment-book`; ordered route chưa được browser xác minh  
**Actor/Role:** Người dùng có quyền xem/chỉnh appointment book; exact role cần xác minh  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; expected behavior được nêu trong comment ngày 2026-07-29

**Preconditions:**
- Có một ngày/session với slot capacities hiển thị trong detail blocks.
- Áp dụng cùng appointment book và cùng filter/date range khi so sánh.

**Expected Behavior:**
Count summary theo ngày phải bằng tổng các count tương ứng trong các detail blocks thuộc đúng ngày và filter hiện tại. Ví dụ nguồn nêu 8 slots, mỗi slot có 3 available appointments, nên `Available` summary phải là 24.

**Provenance:**
- **Source:** `ticket.md:108-133`
- **Input Revision:** 1
- **First Recorded:** 2026-07-29
- **Last Verified:** 2026-09-30

**Evidence:** `attachments/120742-image-20260729-164427.png`, `attachments/120741-image-20260729-164507.png`, `attachments/121001-image-20260731-083303.png`, `attachments/121000-image-20260731-083333.png`, video contact sheet `120739-20260729-1641-27.5946892/contact-sheet.webp` (local; may contain sensitive data)  
**Related Tests:** TBD  
**Notes:** Phép cộng phải được xác minh trên live test data; screenshot nguồn có ví dụ 42 và 8 × 3 = 24 ở các state khác nhau.

---

### REQ-PAC2-7137-002

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** `Booked` count consistency  
**Search Terms/Aliases:** `Booked`, booking count, patient booking, top filter, session holder  
**Known Location:** `/paco-connect/appointment-book`; route chưa được browser xác minh  
**Actor/Role:** Người dùng `Appointment Book`; exact role cần xác minh  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; expected behavior được nêu trong failure comment

**Preconditions:**
- Có booking nằm trong các session/detail blocks của ngày đang xem.
- Filter/date/view giữ nguyên trong lúc so sánh.

**Expected Behavior:**
`Booked` summary phải bằng tổng booking hiển thị trong các session/detail blocks thuộc cùng phạm vi. Nguồn nêu 4 patient bookings nhưng summary chỉ đọc 3 là không đúng.

**Provenance:**
- **Source:** `ticket.md:85-97`
- **Input Revision:** 1
- **First Recorded:** 2026-07-06
- **Last Verified:** 2026-09-30

**Evidence:** `attachments/117698-image-20260706-201745.png`, video contact sheet `117731-20260706-2227-10.5886819/contact-sheet.webp` (local; may contain sensitive data)  
**Related Tests:** TBD  
**Notes:** Chưa rõ booking spanning/multi-holder được de-duplicate hay counted per holder; cần domain confirmation.

---

### REQ-PAC2-7137-003

**Classification:** Confirmed  
**Lifecycle:** Active  
**Feature/Scope:** Hiển thị slot non-bookable trong session  
**Search Terms/Aliases:** `Bookable`, non-bookable, blocked slot, `Edit Slot`, block session, empty slot  
**Known Location:** `Appointment Book` → session slot menu → `Edit Slot`; route chưa được browser xác minh  
**Actor/Role:** Người dùng có quyền edit slot/session; exact role cần xác minh  
**Inference Basis:** N/A  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Missing; requirement được nêu trong failure comment

**Preconditions:**
- Một slot đang hiển thị trong session.
- Slot/session được chuyển sang non-bookable theo action hợp lệ.

**Expected Behavior:**
Slot non-bookable vẫn phải xuất hiện trong session dưới dạng blocked/non-bookable; không được bị loại hoàn toàn khỏi session.

**Provenance:**
- **Source:** `ticket.md:43-52`
- **Input Revision:** 1
- **First Recorded:** 2026-07-03
- **Last Verified:** 2026-09-30

**Evidence:** `attachments/117335-image-20260703-093734.png`, video contact sheets `117381-Screen_sharing_-_2026-07-03_1_40_15_PM/contact-sheet.webp` và `117419-20260703-1813-51.5665139/contact-sheet.webp` (local; may contain sensitive data)  
**Related Tests:** TBD  
**Notes:** Mutation required để tạo state; chỉ thực hiện trong execution scope với runtime guard và cleanup.

---

### REQ-PAC2-7137-004

**Classification:** Inferred  
**Lifecycle:** Candidate  
**Feature/Scope:** Ảnh hưởng của non-bookable slots tới `Available` count  
**Search Terms/Aliases:** non-bookable count, unavailable slot, empty slot, `Available` count  
**Known Location:** `Appointment Book` summary/detail; route chưa được browser xác minh  
**Actor/Role:** Unknown  
**Inference Basis:** Comments nói count “không counting the non bookable slots” và video developer mô tả `Available` giảm khi slot thành unbookable; ticket không nêu công thức chuẩn đủ rõ.  
**Observation Context:** N/A  
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Có capacity/slots chuyển giữa bookable và non-bookable.

**Expected Behavior:**
Cần một quy tắc duy nhất, nhất quán cho việc non-bookable slots được bao gồm hay loại khỏi `Available` summary và detail counts.

**Provenance:**
- **Source:** `ticket.md:47-65`
- **Input Revision:** 1
- **First Recorded:** 2026-07-03
- **Last Verified:** 2026-09-30

**Evidence:** video contact sheets `117419-20260703-1813-51.5665139/contact-sheet.webp`, `117623-20260706-1317-12.2371613/contact-sheet.webp` (local; may contain sensitive data)  
**Related Tests:** TBD  
**Notes:** Không automate assertion về inclusion/exclusion cho tới khi QA xác nhận domain rule.

## Ambiguities and Conflicts

- Ticket không có Acceptance Criteria riêng.
- `ticket.md:49-52` mô tả available count giảm do unbookable/empty slots như test của developer; `ticket.md:54-65` lại báo non-bookable slots không được count là fail. Quy tắc inclusion/exclusion đang `Disputed`.
- Summary “If 2 session holders being treated as unique appts, would expect total at top to be double” chưa xác định count là unique appointment, patient booking hay holder occurrence.
- Source attachments đến từ nhiều ngày, tenant và feature-branch state; số tuyệt đối không thể so chéo giữa attachments.

## Open Questions

1. Role nào cần dùng để test: `Config Admin` hay role khác có đủ quyền chỉnh session/slot?
2. Test tenant/appointment book nào có safe mutable data và cleanup path?
3. Non-bookable slot phải được tính vào `Available` summary hay chỉ phải vẫn hiện dưới dạng blocked trong detail?
4. Với một appointment có hai session holders, `Booked` phải count một appointment hay hai holder occurrences?
5. Baseline cần test trên configured default dev host hay feature branch host? Feature branch URL trong source không nằm trong current allowlist.

---

## Tester notes
