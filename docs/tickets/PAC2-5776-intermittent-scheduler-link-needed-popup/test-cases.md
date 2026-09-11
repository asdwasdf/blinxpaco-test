# Test Cases: PAC2-5776

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-10T21:43:00+07:00

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| `REQ-PAC2-5776-001` | `PAC2-5776-TC-001`, `PAC2-5776-TC-002`, `PAC2-5776-TC-004` | Template đã có scheduler link; thêm `Health Form` hoặc `Booking Link`; biến thể tự thêm `Booking Link` vào draft trước khi thêm `Health Form` | Expected behavior và định nghĩa scheduler link hợp lệ chỉ là `Inferred`; thiếu test data xác nhận |
| `REQ-PAC2-5776-002` | `PAC2-5776-TC-003` | HF inbox `Quick Send` follow-up; popup/layer và khả năng tương tác | Chưa rõ popup phải biến mất hay chỉ cần hiển thị phía trước; chưa có visual evidence |

## Cases

### PAC2-5776-TC-001 — Thêm `Health Form` vào template đã có `Booking Link`

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-5776-001`
**Expected-result basis:** `Inferred` từ `ticket.md:9-15`; ticket thiếu `Acceptance Criteria` thực tế
**Environment:** dev
**Role:** `GP Paco Assist`
**Preconditions:** Đã đăng nhập; có patient/test record được phép dùng; mở `Quick Send`; có template chứa scheduler link hợp lệ từ `Booking Link`
**Test Data:** Template và `Health Form` test chưa được xác nhận; không dùng patient thật nếu chưa được phép
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Patient actions menu` và chọn `Quick Send` | Hộp `Quick Send` hiển thị và cho phép chọn template |
| 2 | Tải template có `Booking Link` và scheduler link hiện hữu | Template hiển thị scheduler link hiện hữu; ghi nhận link/context đang dùng |
| 3 | Chọn tab `Health Forms`, chọn một `Health Form`, rồi chọn vị trí chèn | `Health Form` được thêm vào draft; chưa `Send` hoặc `Save` |
| 4 | Quan sát UI sau khi chèn | [Inferred] Không xuất hiện yêu cầu thêm scheduler link thừa nếu scheduler link hiện hữu vẫn hợp lệ |
| 5 | Nếu popup xuất hiện, chụp cùng frame gồm popup và hộp `Quick Send`; thử focus/click `Close` hoặc `Cancel` nhưng không `Send` | Ghi nhận popup có thể tương tác, vị trí layer, message, trigger và việc popup có chặn luồng hay không; chưa kết luận `Fail` nếu expected rule chưa được xác nhận |

**Postconditions:** Draft có thể đã thay đổi; không gửi dữ liệu
**Cleanup:** Đóng/hủy draft nếu UI xác nhận không lưu; nếu không xác minh được persistence, dừng và ghi identifier của draft/test record để tester cleanup thủ công
**Automation:** Blocked — expected result chỉ `Inferred`, mutation chưa rõ, test data chưa xác nhận
**Evidence:** Screenshot/trace đã redact cần được tạo khi chạy; liên kết `exploration.md#obs-pac2-5776-001`
**Execution History:** Chưa chạy theo test case

### PAC2-5776-TC-002 — Thêm `Booking Link` vào template đã có `Health Form` và scheduler link

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-5776-001`
**Expected-result basis:** `Inferred` từ `ticket.md:9-15`; ticket thiếu `Acceptance Criteria` thực tế
**Environment:** dev
**Role:** `GP Paco Assist`
**Preconditions:** Đã đăng nhập; có patient/test record được phép dùng; mở `Quick Send`; có template chứa `Health Form` và scheduler link hợp lệ
**Test Data:** Template, slot type và scheduler link test chưa được xác nhận
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở template có `Health Form` và scheduler link hiện hữu trong `Quick Send` | Template và scheduler link hiện hữu hiển thị |
| 2 | Chọn tab `Booking Link` và cấu hình slot type bằng test data được duyệt | Cấu hình được phản ánh trong draft; chưa `Send` hoặc `Save` |
| 3 | Quan sát UI sau khi cấu hình | [Inferred] Không xuất hiện yêu cầu thêm scheduler link thừa nếu scheduler link hiện hữu vẫn hợp lệ |
| 4 | Nếu popup xuất hiện, ghi message, layer, focus và khả năng đóng/hủy | Có evidence đủ để phân biệt popup sai nghiệp vụ với popup hợp lệ nhưng sai layer; chưa kết luận `Fail` nếu expected rule chưa được xác nhận |

**Postconditions:** Draft có thể đã thay đổi; không gửi dữ liệu
**Cleanup:** Đóng/hủy draft nếu UI xác nhận không lưu; nếu persistence chưa rõ, dừng và ghi identifier để cleanup thủ công
**Automation:** Blocked — expected result chỉ `Inferred`, mutation chưa rõ, test data chưa xác nhận
**Evidence:** Screenshot/trace đã redact cần được tạo khi chạy; liên kết `exploration.md#obs-pac2-5776-001`
**Execution History:** Chưa chạy theo test case

### PAC2-5776-TC-003 — Kiểm tra popup scheduler-link trong HF inbox `Quick Send`

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** `REQ-PAC2-5776-002`
**Expected-result basis:** `Inferred` từ `ticket.md:17`; ticket chưa xác nhận popup phải biến mất hay hiển thị đúng layer
**Environment:** dev
**Role:** `GP Paco Assist`
**Preconditions:** Đã đăng nhập; có HF inbox record/test patient được phép dùng; `Quick Send` là follow-up action; có dữ liệu tái hiện điều kiện popup
**Test Data:** HF inbox record, patient và template test chưa được xác nhận
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở record phù hợp trong HF inbox bằng test data được duyệt | Record mở trong đúng context và không làm thay đổi trạng thái ngoài phạm vi được duyệt |
| 2 | Chọn `Quick Send` làm follow-up action và tải template liên quan | Hộp `Quick Send` hiển thị; ghi nhận template và scheduler link hiện hữu |
| 3 | Thực hiện chuỗi chọn `Health Form`/`Booking Link` cần thiết để kích hoạt popup, dừng trước `Send` | Nếu popup xuất hiện, popup và hộp `Quick Send` cùng được capture trong screenshot/trace |
| 4 | Kiểm tra focus, z-index/layer, click target và khả năng `Close`/`Cancel` popup | [Inferred] Popup phải có thể tương tác và không bị hộp `Quick Send` che hoặc chặn; không khẳng định popup phải biến mất |
| 5 | Không bấm `Send`; ghi trạng thái luồng sau khi đóng/hủy popup | Không có message/notification được gửi; ghi nhận có thể tiếp tục hoặc hủy luồng rõ ràng hay không |

**Postconditions:** Không gửi message; draft hoặc trạng thái HF record có thể đã thay đổi nếu UI tự lưu
**Cleanup:** Hủy/đóng draft nếu được xác nhận không tạo side effect; nếu HF record đã đổi trạng thái hoặc draft được lưu, ghi identifier và dừng để cleanup thủ công trong approval scope
**Automation:** Blocked — assertion nghiệp vụ chỉ `Inferred`; mutation, test data và trigger intermittent chưa rõ
**Evidence:** Screenshot toàn cảnh, trace và timestamp đã redact; liên kết `exploration.md#obs-pac2-5776-001`
**Execution History:** Chưa chạy theo test case

### PAC2-5776-TC-004 — Tự thêm `Booking Link` vào draft rồi thêm `Health Form`

**Type:** Exploratory ticket validation — biến thể không dùng template có sẵn
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-5776-001`
**Expected-result basis:** `Inferred` từ `ticket.md:9-15`; ticket mô tả template có scheduler link, còn case này dựng cùng trạng thái trong một draft mới
**Environment:** dev
**Role:** `GP Paco Assist`
**Preconditions:** Đã đăng nhập; có patient/test record được team cho phép dùng; cửa sổ `Quick Send` đang mở; draft chưa có `Booking Link`; xác nhận không bấm `Send` hoặc `Save`
**Test Data:** Patient/test record, slot type và `Health Form` cụ thể phải được team duyệt trước khi chạy
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Quick Send` cho đúng patient/test record đã được duyệt | Cửa sổ `Quick Send` hiển thị; kiểm tra đúng patient và dừng nếu là patient không được duyệt |
| 2 | Ghi lại trạng thái ban đầu của draft trong `Preview` | Nội dung ban đầu được ghi nhận; chưa có booking button/link dùng cho case này |
| 3 | Chọn `Booking Link` ở thanh công cụ bên phải | Màn cấu hình `Booking Link` hiển thị; chưa chọn slot type |
| 4 | Mở nhóm slot type phù hợp, tìm và tick đúng slot type test đã được duyệt | Slot type đã chọn hiển thị rõ trong cấu hình; không chọn nhiều slot type ngoài dữ liệu test |
| 5 | Tiếp tục tới lựa chọn vị trí chèn và chọn `Add at End` | Booking button/link được thêm vào cuối draft; nếu xuất hiện popup khác hoặc không chèn được, chụp evidence và dừng |
| 6 | Chuyển sang `Preview`; cuộn tới cuối nội dung và chụp booking button/link vừa thêm | Booking button/link hiển thị trong cùng draft. Đây là evidence precondition; chỉ text nhắc đặt lịch hoặc logo không đạt điều kiện này |
| 7 | Chọn `Health Forms` ở thanh công cụ bên phải | Danh sách `Health Form` hiển thị; booking button/link vẫn thuộc cùng draft |
| 8 | Chọn đúng `Health Form` test đã được duyệt và chọn vị trí chèn | `Health Form` được thêm vào draft hoặc hệ thống hiển thị popup liên quan scheduler link; không bấm `Send`/`Save` |
| 9 | Quan sát ngay sau thao tác chèn; chụp toàn bộ vùng draft, booking button và popup nếu có | [Inferred] Không xuất hiện `Scheduler Link Required` thừa khi booking link vừa thêm vẫn hợp lệ. Nếu popup xuất hiện, ghi actual result nhưng chỉ kết luận `Fail` sau khi BA/dev xác nhận expected behavior và tính hợp lệ của link |
| 10 | Nếu popup xuất hiện, kiểm tra bằng quan sát liệu popup nằm trước `Quick Send`; chỉ thử `Close` nếu được phép và không chọn `Add as Button`, `Add at End`, `Customise Button` hoặc `I'll Choose Where` | Ghi nhận popup có bị che, có nhận focus và có thể đóng hay không; không thực hiện action có thể sửa thêm draft |
| 11 | Đóng/hủy cửa sổ `Quick Send` nếu UI xác nhận thao tác này không lưu; nếu không rõ có auto-save, dừng và báo tester phụ trách cleanup | Không gửi message. Trạng thái draft/record sau test và nhu cầu cleanup được ghi rõ |

**Postconditions:** Không gửi message; draft có thể đã thay đổi hoặc được auto-save
**Cleanup:** Chỉ đóng/hủy draft khi đã xác nhận không tạo side effect. Nếu draft tự lưu hoặc trạng thái patient/HF record thay đổi, ghi identifier và nhờ tester được ủy quyền cleanup; không tự xóa
**Automation:** Blocked — expected result chỉ `Inferred`, trigger intermittent, mutation và persistence chưa rõ
**Evidence:** Tối thiểu hai screenshot đã redact trong cùng run: (1) booking button/link trong `Preview` trước khi thêm `Health Form`; (2) trạng thái sau khi thêm `Health Form`, gồm popup nếu xuất hiện. Ghi timestamp, environment, role và test data không nhạy cảm
**Execution History:** Chưa chạy theo test case

## Open Questions and Blockers

1. BA/PO cần xác nhận expected behavior: không hiện popup, tái sử dụng scheduler link hiện hữu, hay cho phép chọn/thay link.
2. Cần định nghĩa scheduler link “hợp lệ” theo template và booking/health-form context.
3. Cần test patient/record, template, `Health Form`, slot type và scheduler link cụ thể được phép dùng tại dev.
4. Cần xác nhận thao tác `Insert Here`, chọn slot type, mở `Edit` và đóng draft có tự lưu server-side không.
5. Mọi case hiện có mutation class `Unknown`; phải xin approval theo từng run trước khi thực hiện.
6. Không bấm `Send` trong scope hiện tại. Nếu cần xác nhận end-to-end send, phải xin approval riêng gồm recipient, notification, side effect và cleanup.
7. Cần xác định số lần lặp để đánh giá lỗi intermittent.

## Tester notes

[Protected area]
