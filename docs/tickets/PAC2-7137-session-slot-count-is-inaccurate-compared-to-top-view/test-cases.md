# Test Cases: PAC2-7137

**Input Revision:** 1  
**Design Maturity:** Explored  
**Generated:** 2026-09-30

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-7137-001 | PAC2-7137-TC-001, PAC2-7137-TC-002, PAC2-7137-TC-003 | `Day`, `Week`, empty state; summary/detail consistency | Chưa có baseline capacity > 1 trên từng slot |
| REQ-PAC2-7137-002 | PAC2-7137-TC-001, PAC2-7137-TC-002, PAC2-7137-TC-003, PAC2-7137-TC-004 | Zero-booking baseline và multi-holder boundary | Multi-holder case bị chặn vì chưa có safe appointment/patient data |
| REQ-PAC2-7137-003 | PAC2-7137-TC-005 | Slot non-bookable vẫn hiển thị blocked | Cần mutation tạm thời và cleanup được xác minh khi execute |
| REQ-PAC2-7137-004 | PAC2-7137-TC-005 | Chỉ ghi nhận count trước/sau; không Pass/Fail theo inclusion rule | Domain rule vẫn chưa được xác nhận |

## Cases

### PAC2-7137-TC-001 — `Day` summary khớp session và slot details

**Type:** Ticket validation  
**Risk:** High  
**Priority:** P0  
**Requirements:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Expected-result basis:** Confirmed — `ticket.md:85-97,108-133`; baseline Observed — `exploration.md` OBS-PAC2-7137-004  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`; `/paco-connect/feature-branch/pac2-7137/appointment-book`  
**Entry Path:** Authenticated Paco page → direct `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda` → wait for `Appointment Book` landmark → `Day`  
**Context:** `Appointment Book`, `Day` view  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Preconditions:** Manual auth còn hiệu lực; `PAC2-8384 Manual Book A/B` đang được chọn; ngày 2026-09-29 có session 08:00–09:00 với sáu slot 10 phút; không đổi filters trong lúc đối chiếu.  
**Test Data Category:** QA-approved safe appointment books; read-only baseline  
**Test Data:** `PAC2-8384 Manual Book A/B`; 2026-09-29; 08:00–09:00  
**Mutation Class:** None  
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở feature-branch URL theo entry path; chờ controls và session hoặc explicit empty state xuất hiện. | `Appointment Book` render tại URL chứa `/feature-branch/pac2-7137/`; không dùng initial `Loading`/response status làm readiness assertion. |
| 2 | Chọn `Day`; điều hướng tới 2026-09-29; xác nhận đúng safe books. | Summary và session 08:00–09:00 xuất hiện trong cùng context. |
| 3 | Đếm session và các slot/detail counts đang hiển thị. | Có 1 session; sáu slot 08:00–08:50; detail `available` bằng tổng capacity hiển thị. |
| 4 | Đối chiếu summary `Sessions`, `Booked`, `Available` với details cùng ngày. | Summary bằng tổng details: `Sessions 1`, `Booked 0`, `Available 6`. |

**Postconditions:** Không đổi product data.  
**Cleanup:** Không cần; khôi phục view/date chỉ khi cần giữ browser context.  
**Automation:** Yes — stable labels/date/session landmarks; standalone spec sau manual `Pass`/`Fail`.  
**Evidence:** `exploration.md` OBS-PAC2-7137-004; execution evidence phải ghi timestamp, environment, role, expected/actual.  
**Execution History:** Chưa chạy.

### PAC2-7137-TC-002 — `Week` summary khớp daily và hourly details

**Type:** Ticket validation  
**Risk:** High  
**Priority:** P0  
**Requirements:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Expected-result basis:** Confirmed — `ticket.md:85-97,108-133`; baseline Observed — `exploration.md` OBS-PAC2-7137-003  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`; `/paco-connect/feature-branch/pac2-7137/appointment-book`  
**Entry Path:** Authenticated Paco page → direct `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=week` → wait for `Appointment Book` landmark → `Week`  
**Context:** `Appointment Book`, `Week` view  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Preconditions:** Manual auth còn hiệu lực; safe books được chọn; tuần 2026-09-28–2026-10-04; không đổi filters trong lúc đối chiếu.  
**Test Data Category:** QA-approved safe appointment books; read-only baseline  
**Test Data:** `PAC2-8384 Manual Book A/B`; week 2026-09-28–2026-10-04  
**Mutation Class:** None  
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Week` view cho tuần 2026-09-28–2026-10-04. | Week summary, daily counts và hourly details render. |
| 2 | Đọc summary tuần `Booked` và `Available`. | Summary phản ánh cùng appointment-book/filter/week context. |
| 3 | Cộng daily/hourly detail counts của tuần. | Tổng daily/hourly details bằng summary tuần; baseline: Tuesday 29/9 và row 14:00 đều `Booked 0`, `Available 6`; tổng tuần `Booked 0`, `Available 6`. |

**Postconditions:** Không đổi product data.  
**Cleanup:** Không cần.  
**Automation:** Yes — standalone spec sau manual `Pass`/`Fail`.  
**Evidence:** `exploration.md` OBS-PAC2-7137-003; execution evidence phải ghi các giá trị summary/daily/hourly.  
**Execution History:** Chưa chạy.

### PAC2-7137-TC-003 — Empty `Day` state có count bằng 0

**Type:** Regression  
**Risk:** Medium  
**Priority:** P1  
**Requirements:** REQ-PAC2-7137-001, REQ-PAC2-7137-002  
**Expected-result basis:** Confirmed consistency requirements — `ticket.md:85-97,108-133`; baseline Observed — `exploration.md` OBS-PAC2-7137-001  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`; `/paco-connect/feature-branch/pac2-7137/appointment-book`  
**Entry Path:** Authenticated Paco page → direct `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda` → wait for `Appointment Book` landmark → `Day`  
**Context:** `Appointment Book`, empty `Day` state  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Preconditions:** Manual auth còn hiệu lực; safe books được chọn; ngày 2026-09-30 vẫn không có session.  
**Test Data Category:** QA-approved safe appointment books; read-only empty baseline  
**Test Data:** `PAC2-8384 Manual Book A/B`; 2026-09-30  
**Mutation Class:** None  
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Day` view ngày 2026-09-30. | Empty-state landmark `No available sessions.` xuất hiện nếu data vẫn trống. |
| 2 | Đối chiếu summary với empty detail area. | `Sessions 0`, `Booked 0`, `Available 0`, `LIVE 0`; không có hidden/non-zero detail count. |

**Postconditions:** Không đổi product data.  
**Cleanup:** Không cần.  
**Automation:** Yes — data-dependent; spec phải skip/block rõ nếu ngày không còn empty.  
**Evidence:** `exploration.md` OBS-PAC2-7137-001.  
**Execution History:** Chưa chạy.

### PAC2-7137-TC-004 — Multi-holder appointment chỉ tăng `Booked` một lần

**Type:** Ticket validation  
**Risk:** High  
**Priority:** P1  
**Requirements:** REQ-PAC2-7137-002  
**Expected-result basis:** Confirmed by QA on 2026-09-30 — một appointment có hai session holders đóng góp `1` vào `Booked`; ticket source `ticket.md:85-97` xác nhận summary phải bằng booking details.  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`; exact safe booking setup route chưa được xác minh  
**Entry Path:** Authenticated Paco page → direct `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`; booking setup path chưa được xác minh  
**Context:** `Appointment Book`, appointment có hai session holders  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Preconditions:** Có appointment/patient data rõ ràng test-owned, safe, thuộc `PAC2-8384 Manual Book A/B`, có đúng hai holders và cleanup tin cậy. Hiện chưa có.  
**Test Data Category:** Missing safe patient/appointment data  
**Test Data:** Chưa xác định; không dùng patient thật hoặc data không rõ ownership.  
**Mutation Class:** Unknown  
**Approval Required:** Yes — chỉ sau khi QA cung cấp safe data và mutation/cleanup scope cụ thể.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Xác minh safe appointment có đúng hai session holders trong cùng scope. | Nếu thiếu safe data hoặc setup route, case `Blocked`; không tạo booking. |
| 2 | Khi safe setup được duyệt, mở view chứa appointment và đối chiếu booking detail với summary. | Appointment đóng góp đúng `1` vào `Booked`; tổng summary bằng số appointment details, không nhân theo holder. |

**Postconditions:** Hiện không mutation; khi unblocked phải ghi state cụ thể.  
**Cleanup:** Chưa xác định; bắt buộc thiết kế và xác minh trước execution.  
**Automation:** Blocked — thiếu safe patient/appointment data và trusted setup/cleanup path.  
**Evidence:** QA confirmation 2026-09-30; `requirements.md` REQ-PAC2-7137-002.  
**Execution History:** Chưa chạy; dự kiến `Blocked` nếu context không đổi.

### PAC2-7137-TC-005 — Slot non-bookable vẫn hiển thị blocked

**Type:** Ticket validation  
**Risk:** Critical  
**Priority:** P0  
**Requirements:** REQ-PAC2-7137-003, REQ-PAC2-7137-004  
**Expected-result basis:** Confirmed visibility requirement — `ticket.md:43-52`; `Available` inclusion rule là Inferred/Disputed và không phải Pass/Fail assertion.  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`; slot edit path phải được re-verify trong safe session  
**Entry Path:** Authenticated Paco page → direct `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda` → wait for `Appointment Book` landmark → `Day` 2026-09-29 → session 08:00–09:00 → một safe slot → `Edit Slot`  
**Context:** `Appointment Book`, safe slot thuộc `PAC2-8384 Manual Book A/B`  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Preconditions:** Hostname chính xác `blinx.dev.blinxpaco-np.com`; manual auth; safe books; session/slot baseline còn tồn tại; ghi original `Bookable` state; mutation ledger mở; action giới hạn ở đúng một slot test-owned.  
**Test Data Category:** QA-approved safe mutable appointment-book slot  
**Test Data:** `PAC2-8384 Manual Book A/B`; 2026-09-29; session 08:00–09:00; chọn một slot đang `Bookable` sau khi xác minh UI  
**Mutation Class:** Temporary  
**Approval Required:** No — nằm trong execution-first scope đã duyệt; vẫn bắt buộc hostname guard, exact-data guard, ledger và cleanup.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Guard hostname, role, safe books, date/session; ghi slot identity và original `Bookable` state. | Sai bất kỳ guard nào thì `Blocked`, không mutation. |
| 2 | Mở `Edit Slot` của đúng một slot safe; đổi `Bookable` từ on sang off; `Save`. | Update chỉ áp dụng cho slot đã ghi ledger; UI báo/hiển thị completion theo observable state. |
| 3 | Reload hoặc mở lại cùng `Day`/session; tìm đúng slot. | Slot vẫn xuất hiện trong session dưới dạng blocked/non-bookable; biến mất hoàn toàn là `Fail`. |
| 4 | Ghi `Available` summary/detail trước và sau mutation, không dùng inclusion/exclusion để quyết định Pass/Fail. | Giá trị được lưu như observation; case không kết luận domain rule của REQ-PAC2-7137-004. |
| 5 | Mở lại `Edit Slot`; hoàn nguyên `Bookable` về original state; `Save`; reload và xác minh. | Cleanup thành công; slot trở lại original state. Cleanup lỗi phải ghi slot identity đã redact và dừng mutation tiếp theo. |

**Postconditions:** Slot phải ở original `Bookable` state.  
**Cleanup:** Bắt buộc trong `finally`/manual equivalent; restore original state, reload, verify. Không dùng destructive cleanup.  
**Automation:** Yes — sau manual `Pass`/`Fail`; standalone spec phải có hostname/exact-data guards, mutation ledger và cleanup `finally`. Không assert non-bookable contribution vào `Available`.  
**Evidence:** `requirements.md` REQ-PAC2-7137-003/004; execution cần before/after/cleanup evidence đã review và redact.  
**Execution History:** Chưa chạy.

## Open Questions and Blockers

- Ticket execution baseline là `/paco-connect/feature-branch/pac2-7137/appointment-book`; `/paco-connect/appointment-book` chỉ dùng làm control path nếu cần diagnostics.
- REQ-PAC2-7137-004: non-bookable slot được bao gồm hay loại khỏi `Available` chưa được xác nhận; PAC2-7137-TC-005 chỉ observation, không Pass/Fail assertion cho count rule.
- PAC2-7137-TC-004: thiếu safe patient/appointment data, verified setup route, mutation class và cleanup path; giữ `Blocked`, không tự tạo booking.
- Baseline dates là data-dependent. Nếu 2026-09-29 hoặc 2026-09-30 đổi state, execution phải ghi blocker/data drift thay vì dùng số cũ làm expected result không còn cùng context.

## Tester notes
