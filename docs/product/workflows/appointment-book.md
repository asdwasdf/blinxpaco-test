# Workflow: Appointment Book (PACO Connect)

- Classification: `[Observed: dev, Super Admin GB, 2026-10-02]` (header) — logic bên dưới giữ tag riêng từng bullet
- Aliases: `Appointment Book`, `Appt. Book`, `PACO Connect`, `Appointment Settings`, `Session`, `Slot`
- Coverage: `Partial`
- Confidence: `Low`

File này được tạo ngày 2026-10-02 để gom logic từ ticket cho module Appointment Book (day view, filter, session/slot editor, session configuration, booking/cancel backend). Route và landmark xem `docs/product/feature-map.md` (module `Appointment Book (PACO Connect)`).

## Business context observed

- Visible purpose: xem lịch theo ngày/tuần/tháng/năm, đặt/hủy appointment, cấu hình `Session` (template → child session) và `Slot`. `[Observed]` — PAC2-7137/exploration.md, PAC2-8552/exploration.md
- Actor/role: `Super Admin GB` (7786, 8241, 8384, 8552, 7137); ticket 7137 nhắc `Config Admin` chưa xác nhận. `[Observed]` — PAC2-7137/status.md, PAC2-7786/automation.md
- Môi trường: nhiều route trả document HTTP `404` hoặc redirect qua role selection nhưng SPA vẫn render; chờ `Loading` biến mất thay vì assert response đầu. `[Observed]` — PAC2-8241/exploration.md, PAC2-8384/status.md, PAC2-8552/status.md, PAC2-7137/exploration.md
- Feature branch dùng prefix `/paco-connect/feature-branch/<ticket-branch>/...`; URL thiếu prefix không phải môi trường chứa fix. `[Observed]` — PAC2-7786/status.md, PAC2-8241/requirements.md
- Hầu hết ticket thiếu `Acceptance criteria` chính thức (7786, 8241, 8384, 8552); expected lấy từ Description/comment. `[Confirmed]` — các `requirements.md`

## Logic từ ticket

Dedupe từ 6 ticket (`PAC2-7137`, `PAC2-7786`, `PAC2-8241`, `PAC2-8384`, `PAC2-8552`, phần cấu hình session). Kết quả Pass/Fail là manual execute của từng ticket, có thể gắn feature branch chứ không phải dev main.

### Count summary Day/Week

**Luồng**
1. Mở `Appointment Book` → `Day` hoặc `Week` view; header hiện `Sessions`, `Booked`, `Available`, `LIVE`. `[Observed]` — PAC2-7137/exploration.md
2. Selector `Appt. Book` cho chọn nhiều book; count tính trên tập book đã chọn. `[Observed]` — PAC2-7137/exploration.md
3. Summary được so với tổng count trong session/slot detail của cùng ngày, cùng book, cùng filter. `[Confirmed]` — PAC2-7137/requirements.md (REQ-001)
4. Empty state hiện `No available sessions.` với mọi count = 0. `[Observed]` — PAC2-7137/exploration.md

**Business rules**
- `Sessions`/`Booked`/`Available` ở summary phải bằng tổng detail block tương ứng. `[Confirmed]` — PAC2-7137/requirements.md (REQ-001, REQ-002)
- Appointment có 2 session holder chỉ đóng góp `1` vào `Booked` (tester/QA xác nhận 2026-09-30). `[Confirmed]` — PAC2-7137/test-cases.md (TC-004)
- Session gồm các slot 10 phút; cột clinician hiện `booked N`/`available N`; ở state không booking summary và detail khớp. `[Observed]` — PAC2-7137/exploration.md, automation.md
- `Day` view đếm theo holder occurrence, `Week` đếm theo appointment. `[Inferred from: 7 lần thử ổn định, needs confirmation]` — PAC2-7137/automation.md

**Trạng thái**
- Slot `Bookable` off hiển thị nhãn `Non-bookable` và vẫn nằm trong session; bật lại thì `Available` trở về giá trị cũ. `[Observed]` — PAC2-7137/automation.md
- Slot non-bookable bị loại khỏi `Available` (6 → 5); chỉ là observation. `[Observed]` — PAC2-7137/automation.md
- Slot chuyển non-bookable phải còn hiện dưới dạng blocked. `[Confirmed]` — PAC2-7137/requirements.md (REQ-003)

**Role/permission**
- Role cần thiết chưa xác nhận (`Super Admin GB` truy cập được). `[Observed]` — PAC2-7137/status.md

**Defect đã biết**
- PAC2-7137 · Fail (TC-004, ổn định qua same-data/fresh navigation/fresh tab, 7 lần) · `Day` `Booked` 3 trong khi kỳ vọng 2; `Week` cùng ngày hiện 2; quay lại `Day` vẫn 3. `[Observed]` — PAC2-7137/automation.md, status.md
- PAC2-7137 · Blocked (control trên route mặc định) · HTTP 404 rồi redirect login. `[Observed]` — PAC2-7137/automation.md

**Open questions**
- Non-bookable slot có nên tính vào `Available`? Ticket tự mâu thuẫn (Disputed). `[Open Question]` — PAC2-7137/requirements.md (REQ-004)
- Multi-holder: dedupe theo appointment hay theo patient booking/holder (QA đã xác nhận = 1, domain owner chưa ghi chính thức). `[Open Question]` — PAC2-7137/requirements.md

Kết quả test: TC-001/002/003/005 `Pass`; TC-004 `Fail`. — PAC2-7137/automation.md

### Session delete / archive

**Luồng**
1. `Configuration` (`Appointment Settings`) → toggle `Active`/`Removed` → row session → menu `Actions`. `[Observed]` — PAC2-7786/exploration.md (OBS-001, 002)
2. Row `Active` có `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session`; không có `Delete Session` (lặp lại trên template và cả hai child session, sau fresh reload). `[Observed]` — PAC2-7786/automation.md (TC-001, TC-005)
3. `Cancel Session` + reason + confirm → session sang `Removed` (archive, không xóa). `[Observed]` — PAC2-7786/automation.md (TC-004)
4. Row `Removed`: `Edit`, `View Audit`, `Restore`, `Clone` enabled; `Cancel Session`/`Block Session` disabled; `Restore` đưa về `Active`. `[Observed]` — PAC2-7786/automation.md (TC-003, TC-005)
5. `Block Session` mở dialog xác nhận: không có patient booked, mọi bookable slot thành non-bookable, không hủy appointment; `Cancel` thì không mutation. `[Observed]` — PAC2-7786/automation.md

**Business rules**
- Xóa session không booking: có confirmation trước mutation, sau confirm session biến mất khỏi cả `Active` và `Removed` sau refresh. `[Confirmed]` — PAC2-7786/requirements.md (REQ-001, REQ-004)
- Cancel/close confirmation không được đổi dữ liệu. `[Confirmed]` — PAC2-7786/requirements.md (REQ-004)
- Session có booked appointment: backend từ chối với lý do `SESSION_HAS_BOOKINGS` kèm booking count; UI không báo success giả. Message chính xác không quy định. `[Confirmed]` — PAC2-7786/requirements.md (REQ-002)
- Archived session không gây lỗi 500 khi xóa. `[Confirmed]` — PAC2-7786/requirements.md (REQ-003)
- Ba lỗi backend `deleteSessionById` theo comment kỹ thuật: từ chối vẫn báo thành công, archived session gây lỗi, early return rò transaction; retest cần bản ghép FE+BE. `[Confirmed]` — PAC2-7786/requirements.md
- `Delete Session` phải còn khả dụng; `Block Session` chưa được thay thế delete khi chưa có quyết định sản phẩm. `[Confirmed, Disputed]` — PAC2-7786/requirements.md (REQ-005)
- Template session mở rộng thành child session rời nhau, cùng menu; child rỗng appointments với `check-editable` = `editable: true` mà vẫn không có `Delete Session`, nên thiếu action không do booking/non-editable. `[Observed]` — PAC2-7786/automation.md
- Phân tích bundle public của feature branch: hook xóa session có đủ flow (pre-check future bookings, cảnh báo, reason bắt buộc, mutation, restore) nhưng configuration chỉ nối restore vào row menu. Chưa có baseline nên không kết luận regression. `[Observed]` — PAC2-7786/automation.md
- Rule suy ra từ bundle (static, không runtime): pre-check trả `has_future_bookings` + `future_bookings_count`; remove gửi `allowFutureDates` kèm `archiveReason` (8 option); lỗi 403 hiện hướng dẫn liên hệ Appointment Book Admin. `[Observed]` — PAC2-7786/automation.md
- Cleanup: archive session template bị chặn bởi `Session Can't Be Archived`; owned session xóa được qua permanent delete có confirm, rồi archive book; book archive vẫn còn trong history/analytics. `[Observed]` — PAC2-8384/automation.md
- `Configuration` → `Delete` có trên dev main cho template tự tạo (cleanup 200), trong khi feature branch 7786 không thấy `Delete Session`; hai môi trường chưa đối chiếu. `[Observed]` — PAC2-8241/automation.md so với PAC2-7786/automation.md

**Trạng thái**
- `Active` → (`Cancel Session`) → `Removed` → (`Restore`) → `Active`. `[Observed]` — PAC2-7786/automation.md

**Role/permission**
- Role quan sát `Super Admin GB`; role nào được xóa session chưa rõ. `[Observed]` — PAC2-7786/automation.md; `[Open Question]` — PAC2-7786/requirements.md

**Defect đã biết**
- PAC2-7786 · Fail (TC-001) · không có `Delete Session` cho session mới không booking, mọi trạng thái. `[Observed]` — PAC2-7786/automation.md
- PAC2-7786 · Fail (TC-003) · không xóa được archived session. `[Observed]` — PAC2-7786/status.md
- PAC2-7786 · Fail (TC-004) · confirm chỉ archive, không xóa hoàn toàn; để lại 1 record test không cleanup được bằng delete. `[Observed]` — PAC2-7786/status.md
- PAC2-7786 · Blocked (TC-002) · thiếu dữ liệu synthetic an toàn cho session có booking. `[Observed]` — PAC2-7786/status.md
- PAC2-7786 · Inconclusive (TC-005) · availability Delete vs Block do rule còn Disputed. `[Observed]` — PAC2-7786/status.md

**Open questions**
- Môi trường nào có đủ BE PR và FE PR để retest; role được xóa session; `Block Session` coexist hay thay `Delete Session`; message khi có booking; "referenced as a template" có chặn delete không; có cần coverage cho transaction leak. `[Open Question]` — PAC2-7786/requirements.md

### Session editor và khóa field

**Luồng**
1. `Configuration` → `Actions` → `Edit` mở drawer `Edit Session` (template-level): `Session Name`, `Session Type` (`Timed Appts`/`Untimed Appts`), `Slot Duration (min)`, `Frequency`, `Apply Multi-Org Split`, `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, location/care professional, `Required Attributes`. Hours/Date nằm trong section `Frequency` (collapsed). `[Observed]` — PAC2-8241/exploration.md (Correction), automation.md
2. Trong `Appointment Book`, icon bút chì trên header session mở drawer có `Time Range`, `Hours (From)`, `Hours (To)`, `Start Date`, `End Date`. Session có sẵn đã xem không có icon bút chì (có thể do booking). `[Observed]`; điều kiện do booking là `[Inferred from: session có booking không có icon, needs confirmation]` — PAC2-8241/automation.md
3. Right-click slot trong cột session → slot modal: `Select All`, `Actions` (bulk), `Close`, `Save`, footer `Session ends at:`; bulk `Bookable` mặc định unchecked khi selection hỗn hợp; slot chưa save là pending slot. `[Observed]` — PAC2-8241/exploration.md, automation.md
4. Đổi slot type (đơn/bulk), `Empty Slot`, `Bookable` rồi `Save`: dashboard phản ánh, reopen giữ state, counter `Available` cập nhật. `[Observed]` — PAC2-8241/requirements.md (REQ-006), automation.md (TC-002, TC-003)
5. Extend `Hours (To)` rồi `Save` một lần: toast `Session updated successfully.`, header đổi range, slot mới hiện ngay (chỉ thấy trên feature branch qua video). `[Observed]` — PAC2-8241/requirements.md (REQ-005)

**Business rules**
- Session (hoặc session sinh từ template) có ít nhất một booking: khóa `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types`; vẫn sửa được `Name`, `Location`, `Staff`, `Split`. Chưa verify trên dev. `[Confirmed]` — PAC2-8241/requirements.md (REQ-001)
- Thêm/di chuyển slot ra ngoài start/end bị từ chối với message `Slots must sit inside the session (<start> to <end>). Change the session times first.`; slot invalid không lưu, slot hiện có giữ nguyên; server cũng phải reject. `[Confirmed]` — PAC2-8241/requirements.md (REQ-002)
- Muốn thêm slot sau end time phải extend `Time Range` trên session không booking; save sau extend thêm default slot cho phần mở rộng và giữ slot cũ. `[Confirmed]` — PAC2-8241/requirements.md (REQ-003)
- Save hợp lệ phải persist qua reopen và fresh reload; UI không báo success nếu server không lưu. `[Inferred, Disputed]` — PAC2-8241/requirements.md (REQ-004)
- Cancel rồi book lại slot trong past session phải persist sau reload (dev xác nhận pass nhưng không có evidence reload). `[Confirmed, Disputed]` — PAC2-8241/requirements.md (REQ-007)
- Session tạo cần: appointment book, location, slot type, care professional, ngày, tần suất (`Daily`...), giờ, slot duration; số slot bookable tính từ giờ/duration. `[Observed]` — PAC2-7786/automation.md, PAC2-8241/automation.md
- `Required Attributes` ảnh hưởng gán care professional: session tự tạo có thể `No Match` nên slot `No care professional assigned` và không book được. `[Observed]` — PAC2-8241/automation.md
- Session mới tạo xếp ở cột `Not Assigned` nên counter `Available` trên cùng không đổi khi đổi bookable. `[Observed]` — PAC2-8241/automation.md (TC-003)
- Date picker session không cho chọn ngày quá khứ. `[Observed]` — PAC2-8241/automation.md

**Trạng thái**
- Slot pending (client) → `Save` → persisted; slot ngoài range vẫn tạo được pending ở client. `[Observed]` — PAC2-8241/automation.md

**Role/permission**
- `Super Admin GB`; ticket nhắc quyền Appointment Book Admin cho session removal. `[Observed]` — PAC2-8241/automation.md, PAC2-7786/automation.md

**Defect đã biết**
- PAC2-8241 · Fail (TC-001) · slot ngoài range: `appointment-slots/update` trả 500, UI im lặng, modal mở, không có message boundary; pending slot cũ xuất hiện lại sau reload (stale draft). `[Observed]` — PAC2-8241/automation.md
- PAC2-8241 · Fail (TC-007) · extend `Hours (To)`: `sessions/update` 200 + toast success nhưng header đổi chậm (~5 giây), không sinh slot mới, slot đã chỉnh revert về ban đầu; đổi chỉ `Session Name` thì lưu bình thường. `[Observed]` — PAC2-8241/automation.md
- PAC2-8241 · Fail (TC-007, biến thể) · nhập giờ `HH:MM` gây 400 `FST_ERR_VALIDATION` với toast generic; phụ thuộc cách nhập. `[Inferred from: cách nhập giờ, needs confirmation]` — PAC2-8241/automation.md
- PAC2-8241 · Blocked (TC-005) · date picker không cho quá khứ, session tự tạo không gán được care professional. `[Observed]` — PAC2-8241/automation.md
- PAC2-8241 · Blocked (TC-006) · thiếu session có booking an toàn để verify khóa field. `[Observed]` — PAC2-8241/status.md
- Kết quả đã Pass: TC-002 (bulk slot type persist), TC-003 (đơn Empty/Non-bookable + bulk Bookable persist). `[Observed]` — PAC2-8241/status.md

**Open questions**
- Footer `Session ends at` không khớp header sau khi xóa slot cuối; fix feature branch đã merge lên dev chưa; `PASSED QA on FB` mâu thuẫn video "DEV not work"; assert server rejection trực tiếp hay chỉ UI + no persistence; test data an toàn cho session có booking. `[Open Question]` — PAC2-8241/requirements.md

### Filter trong Appointment Book

**Luồng**
1. Toolbar `Filters` → sidebar: `Healthcare Professional`, `Patient`, `Appointment Type`, `Slot Type`, `Session Name`, `Location` (textbox `Search...`). Chọn nhiều book hiện `+N`/`N selected`. `[Observed]` — PAC2-8384/exploration.md
2. Chọn `Session Name` của một book: kết quả giảm (2 session/60 available → 1 session/48 available), chỉ session đó render. `[Observed]` — PAC2-8384/automation.md (TC-004)
3. `Healthcare Professional`, `Slot Type`, `Session Name` tải option đúng ở multi-book (dataset có location/slot type/clinician dùng chung). `[Observed]` — PAC2-8384/automation.md (TC-003)

**Business rules**
- Single book: `Location` tải và gồm location mới thêm khi thuộc dữ liệu trong scope (date range, book đang chọn). `[Confirmed]` — PAC2-8384/requirements.md (REQ-001)
- Multi-book: `Location`, `Slot Type`, `Session`, `Clinician`, `Patient` lấy option từ tất cả book đã chọn, không rỗng. Gợi ý backend nhận array hoặc fan-out/merge client (không bắt buộc). `[Confirmed]` — PAC2-8384/requirements.md (REQ-002, REQ-003)
- Áp filter nhiều book trả kết quả đúng trên toàn bộ book chọn trong date range. `[Confirmed]` — PAC2-8384/requirements.md (REQ-004)
- `Appointment Type` chỉ liệt kê type đang dùng trong book hiện hành, lọc cả session và slot khớp; comment 2026-09-24 ghi đây là đúng, không coi việc chỉ có `F2F`/ẩn session không khớp là lỗi. `[Confirmed]` — PAC2-8384/requirements.md (REQ-005)
- Đề xuất chip `Location` ở toolbar; phân biệt loading với empty trong từng filter section; cần BA/PO xác nhận. `[Inferred, Candidate]` — PAC2-8384/requirements.md (REQ-006, REQ-007)
- Chờ `Loading your appointment data` biến mất trước khi đọc option. `[Observed]` — PAC2-8384/feature-location.md

**Role/permission**
- Role test filter chưa xác định; quan sát bằng `Super Admin GB`. `[Open Question]` — PAC2-8384/requirements.md

**Defect đã biết**
- PAC2-8384 · Fail (TC-002, `PAC2-8384-DEF-001`) · chọn hai book với session cùng hiển thị một location thì `Location` trả `No results found`. `[Observed]` — PAC2-8384/report.md, automation.md
- PAC2-8384 · Inconclusive (TC-003, TC-004, TC-006) · TC-004 mới áp `Session Name`; TC-006 không verdict vì Inferred. `[Observed]` — PAC2-8384/report.md
- Tổng ticket: 0 Pass / 1 Fail / 2 Inconclusive / 3 Not Run (TC-001, 005, 007); overall `Fail`. `[Observed]` — PAC2-8384/report.md

**Open questions**
- "Newly added location" tạo ở đâu/đồng bộ bao lâu/phụ thuộc configuration hay session trong range; multi-book là union hay dedupe; chip và loading/empty có bắt buộc không; expected cho slot trống/session khi lọc multi-book. `[Open Question]` — PAC2-8384/requirements.md, exploration.md

### Hiệu năng booking/cancel (partitioned table)

**Luồng**
1. Booking: `bookAppointment` ghi `appointment`/`appointment_slot`, thêm `bx_organisation_uuid` vào query/write khi organisation xác định an toàn; phạm vi hai backend `nhs-scheduler-be` và `paco-connect-be`. `[Confirmed]` — PAC2-8552/requirements.md (Summary, REQ-001)
2. Cancel appointment qua từng repo vẫn thành công, không trả `APPOINTMENT_NOT_FOUND` giả do organisation mismatch. `[Confirmed]` — PAC2-8552/requirements.md (REQ-002)
3. Cancel session multi-org: mỗi appointment patch theo organisation của chính row; guard so requested IDs với found appointments (không so hai tập đã narrow). `[Confirmed]` — PAC2-8552/requirements.md (REQ-003)
4. Sửa session window: appointment multi-slot bị cancel phải release mọi slot, không slot nào còn trỏ appointment cancelled; `knownSlots` gồm toàn bộ `appointment_slots` fetch từ graph. `[Confirmed]` — PAC2-8552/requirements.md (REQ-004)

**Business rules**
- Cột `appointment.bx_organisation_uuid` có semantics khác nhau giữa hai repo nên không áp một rule filter chung. `[Confirmed]` — PAC2-8552/requirements.md (Ambiguities)
- `sessionSplitStatus`: enforcement và count split allocation không đổi; lookup phía appointment không filter theo token organisation khi semantics không tương thích. `[Confirmed]` — PAC2-8552/requirements.md (REQ-005)
- Write path không trả success im lặng khi zero rows/thiếu appointment; không chấp nhận trạng thái nửa vời (`Cancelled` nhưng slot chưa release). Error contract chưa nêu. `[Confirmed]` — PAC2-8552/requirements.md (REQ-007)
- `getAppointmentsBySlotId` trả đúng appointment, dùng partition key ở bước organisation đã biết, bỏ dead-code query; lookup slot-by-ID đầu tiên không partition-scope được. `[Confirmed]` — PAC2-8552/requirements.md (REQ-008)
- Xác nhận hiệu năng cần `EXPLAIN ANALYZE` trước/sau (DB owner), không kết luận từ UI latency. `[Confirmed]` — PAC2-8552/requirements.md (REQ-006)
- Nhánh reschedule "documented, not fixed". `[Confirmed]` — PAC2-8552/requirements.md (REQ-001)
- `/configuration/#appointments` có grid appointment, `Show Cancelled Bookings`, `Fetch Latest Appointments`, `Fetch All Slot Details` (side effect của hai nút fetch chưa rõ, không dùng). `[Observed]` — PAC2-8552/exploration.md
- Route feature branch Connect không có session (`No available sessions`) nên chưa có availability để book. `[Observed]` — PAC2-8552/exploration.md

**Defect đã biết**
- PAC2-8552 · Blocked (9/9 case) · không có approval mutation, fixture synthetic/cleanup, DB owner; không có spec Playwright; case backend nên chạy trong repo backend; mutation ledger rỗng. `[Observed]` — PAC2-8552/automation.md, status.md

**Open questions**
- Build dev chứa commit nào; fixture/role/approval cho Book/Cancel/session edit; DB owner chạy `EXPLAIN ANALYZE`; error contract khi guard fail; reschedule có trong scope; `appointment_status` có semantics organisation khác nhau (follow-up). `[Open Question]` — PAC2-8552/requirements.md


### Appointment audit trail

**Luồng**
1. Trên feature branch, mở `Appointment Book` → chọn ngày/book có booking → bật `Booked` → right-click appointment. `[Observed]` — PAC2-8381/feature-location.md, exploration.md
2. Context menu có hai `View Audit Log`: một dưới nhóm `Appointment`, một dưới `Slot manage`; audit appointment phải chọn item trong nhóm `Appointment`. `[Observed]` — PAC2-8381/exploration.md (OBS-002)
3. `View Audit Log` mở dialog `Audit | Activity Log`, filter `All time`, columns `Description`/`Date`/`Time`/`Patient`/`NHS Number`/`Appt Name`. `[Observed]` — PAC2-8381/exploration.md (OBS-003)

**Business rules**
- Booking audit phải mô tả rõ `<user> booked this appointment`, không dùng `created this slot`; đúng actor và booking time. `[Confirmed]` — PAC2-8381/requirements.md (REQ-001, 002)
- Booking trực tiếp trong Connect và qua `Care Navigation` đều phải có appointment audit ở Connect FE. `[Confirmed]` — PAC2-8381/requirements.md (REQ-003, 004)
- Đổi `Slot Type` sau booking và cancellation phải tạo audit đúng actor/time. `[Confirmed]` — PAC2-8381/requirements.md (REQ-005, 006)
- Appointment slide panel phải populate attribution `Booked By`/`Actioned By`; label cuối còn ambiguous. `[Confirmed]` — PAC2-8381/requirements.md (REQ-007)

**Trạng thái quan sát**
- Historical appointment trên branch PAC2-8381 có `Booked By` populate. `[Observed]` — PAC2-8381/exploration.md (OBS-001)
- Rows audit nhìn thấy là field-level events `set Planned start/end date/time` và `set Appointment name`; chưa thấy concise booking sentence trong viewport đã quan sát. Không phải verdict vì record cũ và chưa kiểm tra toàn bộ rows/pagination. `[Observed]` — PAC2-8381/exploration.md (OBS-003)

**Mutation boundary**
- `Quick Book`, `Edit Slot`, `Cancel Appointment`, status/session actions đều mutation; chỉ chạy với appointment `QA-AUTO` do run tạo và có cleanup. `[Observed]` — PAC2-8381/exploration.md (OBS-004)

**Possible defect**
- Có thể thiếu concise booking event trên current branch, nhưng chưa đủ kết luận `Fail` cho tới khi tạo controlled appointment trên build hiện tại và xem toàn bộ audit. `[Inferred from: historical audit rows, needs confirmation]` — PAC2-8381/exploration.md

**Open questions**
- Sentence booking là row bổ sung hay thay field-level rows; label `Booked By` hay `Actioned By`; timestamp tolerance; amendment có cần old/new value; tile `Care Navigation` và fixture/cleanup an toàn. `[Open Question]` — PAC2-8381/requirements.md, exploration.md

### Session cancel RBAC (P7032)

Ticket scope: tách quyền cancel session khỏi `Appointment Book User`, tạo activity mới `P7032 - Appointment Book Cancel Session`. 3 PR đã merge: `paco-connect-be #792`, `paco-one-db #1022`, `connect-fe #2875`. Video self-test từ tester: `attachments/129284-pac2-9001-browser-qa.mp4` (456.7s, 1600x960, no audio, 6 captioned steps).

**Luồng**
1. Open `Appointment Book` → Day view → session card (e.g. `Dan E2E test` 09:00-16:00, 3 booked). Entry point for "Cancel session appointments" NOT Confirmed in browser (OQ-4). Video skips entry control — jumps from board to resulting dialog. `[Observed]` — PAC2-9001/feature-location.md (R-2), `video-notes.md` step 4/6
2. User without P7032 invokes Cancel session: `Access Denied` modal opens — `You do not have permissions to perform this action. Contact your administrator.` + `OK` button. Same generic copy used across RBAC blocks in Paco. `[Observed]` — `video-notes.md` step 1/6, `extra-42s.jpg`/`extra-50s.jpg`
3. User with P7032 invokes Cancel session: `Cancel session appointments` modal opens — `This will cancel N appointments for N patients in this session.`, required `Cancellation Reason` select, two pill actions `Cancel only` / `Cancel & notify`. `[Observed]` — `video-notes.md` step 4/6, `frame-230s.jpg`
4. `Cancel & notify` opens Quick Send for affected patients; save happens only on Send; closing Quick Send saves nothing. `[Confirmed]` — PAC2-9001/requirements.md (REQ-001, scenario 2)
5. Block Session on empty session (any role): dialog `No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled.` + `Cancel` (outlined) / `Block Session` (filled). `[Observed]` — `video-notes.md` step 2/6, `frame-070s.jpg`/`extra-60s.jpg`
6. Configuration > Sessions: list page reachable for User +P7032 (NOT Admin); each row has `…` kebab under Actions. Row-kebab content not captured in video (OQ-3). `[Observed]` — `video-notes.md` step 6/6, `frame-350s.jpg`
7. Edit Session modal (right-side `Session settings` form): Session name, Assigned Locations, Assigned Staff. Warning `This session has 3 booked patients — Changing location or staff moves their appointments with it. Nobody is notified automatically.` — covers location/staff change, NOT time-edit cancellation dialog. `[Observed]` — `video-notes.md` step 5/6, `extra-260s.jpg`

**Business rules**
- Permission triplet `canEdit / canAdmin / canCancelSession` (per video caption step 4/6 — `canEdit:true, canAdmin:false, canCancelSession:true`); triplet quoted from caption, not directly read from visible console/network. `[Inferred from video caption, needs confirmation]` — `video-notes.md` step 4/6
- Permissions matrix 7 actions x 3 roles (per AC tony.do comment 14:31:47Z 2026-10-13): `[Confirmed]` — PAC2-9001/requirements.md (REQ-001..REQ-007)
  - Cancel a single future appointment: User / User+P7032 / Admin — all 3 allow
  - Cancel a past appointment: only Admin
  - Cancel session (appt book): only User+P7032 / Admin
  - Block an empty session: all 3 allow (no P7032 needed)
  - Change session details / times: all 3 allow
  - Remove (archive) session: only Admin
  - Cancel session from Configuration > Sessions: only Admin
- 9 expected behaviour scenarios per AC table. `[Confirmed]` — PAC2-9001/requirements.md (REQ-001 scenarios 1-9)
- Pre-existing limitation: session times locked in EDIT SESSION modal when session has bookings — only template edits whose generated sessions hold bookings outside template times can trigger time-edit cancellation dialog. `[Confirmed]` — PAC2-9001/requirements.md (REQ-008, QA notes)
- Server rule (Plan approved 2026-10-12): if RBAC gate cancels `appointments/cancel` on session-level endpoint for users without `canCancelSession`, server returns 403 with message consumed as "Access Denied" dialog. `[Confirmed]` — PAC2-9001/requirements.md (REQ-001, Plan approved)
- Appointment Book Admin auto-includes P7032 (P7032 granted to Admin role at backend). `[Confirmed]` — PAC2-9001/requirements.md (REQ-009, tony.do comment 14:31Z)
- P7032 only visible in Role Management UI after `paco-one-db #1022` deploys. `[Confirmed]` — PAC2-9001/requirements.md (REQ-009, QA notes)
- Pre-existing `appointments/cancel` org-check split to REQ-010 (out of scope for PAC2-9001). `[Confirmed]` — PAC2-9001/requirements.md (REQ-010)

**Trạng thái**
- Session card buttons verified (rev 2 attempt-4 16:00Z): Edit pencil + Note icon. Cancel/Block/Remove session entry NOT on session card. `[Observed]` — PAC2-9001/feature-location.md (R-2)
- EDIT SESSION drawer verified: 8 buttons, no Cancel/Block/Remove session entry in drawer. `[Observed]` — PAC2-9001/feature-location.md (R-2)
- Right-click on session name: no context menu opens. `[Observed]` — PAC2-9001/feature-location.md (R-2)
- P7032 not visible in RBAC list (max P7507, has P7030 prerequisite, missing P7032). Inferred paco-one-db #1022 not yet deployed on dev. `[Inferred from: RBAC list scan, needs confirmation]` — PAC2-9001/feature-location.md (R-4)

**Role/permission**
- 3 test personas: `Appointment Book User` (no P7032), `User + P7032` (QA-AUTO role), `Appointment Book Admin` (auto-include P7032). `[Confirmed]` — PAC2-9001/requirements.md (REQ-001..REQ-009)
- P7032 grant path: `Super Admin` (e.g. Fiona Nguyen GB) → `/paco/configuration/staff/role-groups` → create/grant `Appt Book User` + P7032 to QA-AUTO test role. Mutation required; deferred to MANUAL_EXECUTE setup. `[Confirmed]` — PAC2-9001/requirements.md (REQ-009)

**Defect đã biết**
- PAC2-9001 · Inconclusive (video review 80% coverage) · entry-point for "Cancel session appointments" NOT captured in video; tester jumps from Day board to dialog. OQ-4 open for MANUAL_EXECUTE. `[Observed]` — `video-notes.md` Open questions
- PAC2-9001 · Inconclusive (LOCATE attempt-4) · session card UI verified has NO direct Cancel/Block/Remove button. EDIT SESSION drawer has NO Cancel/Block/Remove session entry. Right-click = no-op. Entry point must be at patient slot row level (untested). `[Observed]` — PAC2-9001/feature-location.md (R-2, OQ-4)
- PAC2-9001 · OQ-1 open · P7032 not visible in Role Groups list (max P7507). Inferred paco-one-db #1022 not deployed. `[Inferred from: RBAC list scan]` — PAC2-9001/feature-location.md (R-4)

**Open questions**
- OQ-1: paco-one-db #1022 đã deploy dev chưa? RBAC list max P7507, no P7032 visible. `[Open Question]` — PAC2-9001/requirements.md (OQ-1)
- OQ-2: Block session trên session có ≥1 booking có gate bằng P7032 không? Video chỉ test trên empty session. `[Open Question]` — PAC2-9001/requirements.md (OQ-2)
- OQ-3: Configuration > Sessions row-kebab menu content cho User +P7032 (NOT Admin): Cancel option visible hay hidden? Tester reached page trong step 6 nhưng không mở kebab. `[Open Question]` — PAC2-9001/requirements.md (OQ-3)
- OQ-4: Entry-point shape cho "Cancel session appointments" (right-click vs kebab vs menu icon)? Video KHÔNG capture. Session card + EDIT drawer + right-click đều không có. Cần test patient slot row level trong MANUAL_EXECUTE. `[Open Question]` — PAC2-9001/requirements.md (OQ-4)
- OQ-5: Time-edit cancellation dialog (REQ-008) trigger bằng template edit (per QA notes) — có sẵn test data trên dev không? `[Open Question]` — PAC2-9001/requirements.md (OQ-5)

## Tester notes

