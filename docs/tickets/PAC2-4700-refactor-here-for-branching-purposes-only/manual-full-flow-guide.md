# PAC2-4700 — Hướng dẫn test full flow từng branch

Ngày: 2026-10-05. Tài liệu hướng dẫn tester thực hiện và quay evidence; không phải kết quả execution hoặc sign-off. Giữ nguyên stable case IDs và lịch sử ticket.

## Scope

- Lặp Quick Send trên Connect → OS → GP.
- Bao gồm Patient Details, Campaign/search/sort, Health Forms, Files, Booking Link, channel, editor, preview, Save/reopen/cleanup.
- GP thêm Quick Form.
- **Không bấm `Send Now` hoặc `Schedule`. Không gửi SMS/email.**
- Không sửa contact/consent, campaign template nguồn hoặc clinical records có sẵn.

## 1. Chuẩn bị

| Branch | URL |
|---|---|
| Connect | `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard` |
| OS | `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard` |
| GP | `https://pac2-4700-qs-only.dev.blinxpaco-np.com/` |

1. Login thủ công role `Super Admin GB`; không quay password hoặc auth data.
2. Giữ cùng kích thước cửa sổ, zoom `100%`, theme; mỗi branch một tab.
3. Bắt đầu quay sau login. Trước chia sẻ, redact names/contact/NHS/clinical content và URL có token.
4. Dùng `Beth Green` theo scope tester chọn. Nếu Connect/GP không mở được, thử `Test TEsting QA` làm control; ghi rõ đổi fixture, không coi hai patient là cùng prerequisites.
5. Xác minh fixture từng backend: Patient Number/NHS, contact state, documents, campaign test, mapped booking configuration, form test. Không assume cùng tên là cùng dataset.
6. Mọi draft/record mới đặt marker `QA-AUTO-PAC2-4700-<branch>-<run>`.
7. Nhập/chọn/lưu chỉ trên draft test riêng có safe-data và cleanup đã xác minh. Nếu chưa rõ `Save` lưu draft hay sửa shared campaign, dừng trước action.
8. Nếu agent/CLI chạy mutation: hostname allowlist, mutation gate, runtime guard do tester cấp, ledger và cleanup vẫn bắt buộc.
9. GP root NHS và GP-host `/paco/dashboard` là hai route/consumer đã quan sát khác nhau; ghi URL thực tế, không gộp kết quả.

## 2. Mở Quick Send

1. Nhập tên patient vào global search.
2. Chờ result đúng patient.
3. Bấm `Patient actions menu` tại result; không click patient row.
4. Chọn `Quick Send`.
5. Chờ composer tải xong.
6. Kiểm tra header đúng patient.
7. Quay toàn composer: header, editor, channel, preview, bốn tabs.
8. Ghi mở thành công/không, loading kết thúc/chưa, control bị cắt/đè hay không.

Nếu không mở:
1. Giữ evidence attempt gốc.
2. Clear search, tìm lại, thử cùng fixture.
3. Thử control fixture đáp ứng prerequisites.
4. Reload branch, thử lại.
5. Không gọi defect chỉ từ locator timeout; kiểm tra UI thực tế và unexpected state.

## 3. Patient Details

1. Bấm `View Patient Details`; kiểm tra panel `Patient Information`.
2. Mở dropdown `Number`, xem danh sách rồi đóng; không đổi contact.
3. Mở dropdown `Email`, xem danh sách rồi đóng; không đổi contact.
4. Quan sát SMS/email consent; không thay đổi.
5. Nếu có `Search all tabs...`, nhập từ có trong thông tin đang thấy.
6. Kiểm tra nội dung liên quan được hiển thị.
7. Nhập `QA-AUTO-NO-MATCH-4700`; kiểm tra empty/no-match state.
8. Clear search; kiểm tra thông tin quay lại.
9. Mở/đóng `Personal Info`.
10. Mở/đóng `Significant Info` và các nhóm thực tế còn lại.
11. Bấm `Close Patient Details`; kiểm tra panel đóng.

Nếu hiện `Patient missing NHS number in order to show patient details`, ghi thiếu fixture; không gọi các nhóm thông tin vắng là lỗi UI.

## 4. Campaign, search và sort

1. Mở `Campaign`.
2. Bấm `(click to change)`; chờ campaign list tải xong.
3. Search một phần tên campaign có trong list; kiểm tra lọc.
4. Search `QA-AUTO-NO-MATCH-4700`; kiểm tra empty state.
5. Clear search; kiểm tra list quay lại.
6. Mở sort; quay options thực tế.
7. Chọn `A - Z`; chờ render khoảng 3 giây và kiểm tra selected label.
8. Chọn `Z - A`; kiểm tra label/list.
9. Thử các options date/message type đang có; kiểm tra selection/display.
10. Chọn campaign test riêng đã duyệt, nếu có; không chọn ngẫu nhiên shared campaign để sửa.
11. Kiểm tra campaign name và nội dung composer cập nhật.

Không khẳng định ordering date nếu chưa biết timestamps/grouping. Option-set consistency không tự trở thành acceptance criterion.

## 5. Health Forms — chọn và remove

1. Bấm `Health Forms`; kiểm tra heading đổi đúng.
2. Bấm `Select Health Form`; chờ list tải xong.
3. Search tên form có trong list; kiểm tra lọc.
4. Search chuỗi không khớp; kiểm tra empty state.
5. Clear search; kiểm tra list quay lại.
6. Trên draft test riêng, chọn form test đã duyệt.
7. Kiểm tra selected item/badge.
8. Chuyển `Campaign`; kiểm tra preview phản ánh form/link nếu UI hỗ trợ.
9. Quay lại `Health Forms`; remove/bỏ chọn form vừa thêm.
10. Kiểm tra item/badge/link cập nhật.
11. Thêm lại nếu dùng cho Save test.

Picker mở được chưa đủ để kết luận select/remove Pass.

## 6. Files — chọn và remove

1. Bấm `Files`.
2. Chờ loading kết thúc; giữ evidence đến khoảng 30 giây nếu chưa xong, không coi đây là product SLA.
3. Kiểm tra heading `Files` và `Select Attachment`.
4. Bấm `Select Attachment`; chờ list tải.
5. Search file test đã biết tồn tại; kiểm tra lọc.
6. Search chuỗi không khớp; kiểm tra empty state trong đúng picker, không dùng global listitem count.
7. Clear search.
8. Trên draft test riêng, chọn file test không PII.
9. Kiểm tra attachment/item/badge xuất hiện.
10. Chuyển `Campaign`; kiểm tra attachment trong preview nếu có.
11. Quay lại `Files`; remove file vừa thêm.
12. Kiểm tra selected item biến mất.
13. Thêm lại nếu dùng cho Save test.

Riêng Connect/GP: quay button và nội dung panel sau click. Nếu vẫn hiện Health Forms, ghi đúng actual: “Click Files nhưng panel vẫn là Health Forms”. Thiếu Patient Number/documents là fixture blocker; không tự upload tài liệu thật.

## 7. Booking Link

1. Bấm `Booking Link`; kiểm tra heading, `Date & Time`, `Refresh Availability`, slot-type, clinician/location controls.
2. Mở `Date & Time`; kiểm tra date/time controls. Chỉ thay đổi trên draft test riêng.
3. Mở lần lượt `Face to Face Slot Type(s)`, `Phone Slot Type(s)`, `Video Slot Type(s)`, `Web Chat Slot Type(s)`.
4. Kiểm tra list tải xong, options hoặc empty state rõ ràng.
5. Với mapped campaign/config test đã duyệt, chọn một slot type.
6. Kiểm tra selected value; bỏ chọn rồi chọn lại.
7. Mở `Select Clinician(s)`; chọn/bỏ chọn clinician test.
8. Mở `Select Location(s)`; chọn/bỏ chọn location test.
9. Nhập booking note marker `QA-AUTO-PAC2-4700-<branch>-<run>`.
10. Bấm `Refresh Availability` nếu scope cho phép; chờ terminal state, ghi kết quả/thời gian tải.
11. Nếu có action thêm link vào draft, dùng đúng UI action đó; không đặt appointment.
12. Chuyển `Campaign`; kiểm tra link/placeholder trong preview.
13. Remove link bằng UI nếu có; kiểm tra preview cập nhật.

Nếu xuất hiện `Scheduler Link Required`, quay popup và options thực tế. Không gọi popup absent là lỗi khi campaign không có scheduler placeholder. Không chia sẻ booking URL/token nguyên bản.

## 8. Channel, editor và preview

Chỉ trên draft test riêng; không sửa shared template.

1. Mở `Campaign`; quan sát channel hiện tại và enabled/disabled state.
2. Nếu fixture có cả SMS/email, toggle từng channel; kiểm tra selected indicator.
3. Với fixture thiếu contact, ghi disabled state; không sửa contact để ép test.
4. Bấm `Edit` nếu cần.
5. Nhập marker `QA-AUTO-PAC2-4700-<branch>-<run>` vào draft.
6. Bôi đen marker; thử `Bold`, rồi bỏ `Bold`.
7. Thử `Undo`/`Redo`; kiểm tra nội dung đúng.
8. Bấm `Preview`; kiểm tra marker, formatting, forms/files/booking đúng với draft.
9. Bấm `Edit`; kiểm tra nội dung còn đúng.
10. Mở `Preview SMS`/`Preview Email` nếu enabled.
11. Kiểm tra format theo channel, không mất nội dung hoặc lộ unresolved placeholder.

Không bấm Send Now/Schedule hoặc send action để kiểm tra preview.

## 9. Save, mở lại và cleanup

**Chỉ tiếp tục khi đã biết đối tượng được lưu, route mở lại và cleanup. Nếu Save sửa campaign dùng chung hoặc chưa rõ persistence, dừng và ghi Blocked.**

1. Chuẩn bị draft test riêng có marker.
2. Ghi campaign/channel/form/file/booking bằng alias; không ghi contact/token.
3. Quay trạng thái trước Save.
4. Bấm `Save` đúng một lần.
5. Chờ success/error/loading kết thúc; không retry nếu chưa biết lần đầu đã lưu hay chưa.
6. Đóng composer.
7. Mở draft đã lưu bằng route UI tương ứng đã xác minh.
8. Kiểm tra marker và selected items còn đúng.
9. Reload; mở lại lần nữa.
10. Kiểm tra không mất dữ liệu, không duplicate.
11. Cleanup chỉ draft test vừa tạo bằng action đã được phép.
12. Kiểm tra draft không còn; ghi leftovers nếu cleanup thất bại.

Toast chưa đủ chứng minh persistence. Không tìm được route mở lại: ghi “Save response observed; persistence chưa xác minh”. Không delete shared campaign/patient/clinical records nền để cleanup.

## 10. GP Quick Form

1. Search patient test → `Patient actions menu` → `Quick Form`.
2. Kiểm tra dialog đúng patient.
3. Mở `Select Quick Form`; chọn form test đã duyệt, chờ fields/preview tải xong.
4. Kiểm tra controls thực tế: text/textarea với dữ liệu giả, dropdown, checkbox/radio nếu có, keyboard focus.
5. Mở `Comments`; nhập marker nếu draft scope cho phép.
6. Mở `SNOMED Code`; quan sát, không thêm clinical code chưa được duyệt.
7. Mở `Advanced`; kiểm tra controls hiện.
8. Quay lại `Health Form`; kiểm tra input còn đúng.
9. Chỉ khi approved clinical submission trên dedicated test patient: thử thiếu required field và kiểm tra validation theo form definition.
10. Hoàn thiện required fields; review.
11. Submit chỉ khi record test và cleanup/irreversible effect đã được duyệt riêng.
12. Mở record qua UI sau reload; xác minh persistence.
13. Cleanup record test theo quyền cho phép; ghi leftovers.
14. Đóng dialog.

Chưa có approved form/test record: dừng trước submit, ghi Blocked. Không claim full flow Pass chỉ từ open/tab/Close.

## 11. Overlay và reopen

1. Mở Campaign picker và sort dropdown.
2. Click vùng trống; ghi overlay đóng/còn.
3. Mở lại; click Files, chờ khoảng 3 giây; ghi overlay và panel thực tế.
4. Close composer, chờ hidden.
5. Mở lại qua cùng patient actions menu; kiểm tra đúng branch/patient.

Không assert Escape phải đóng hoặc overlay phải persist khi expected chưa Confirmed. Khác behavior giữa datasets/consumers chưa đủ chứng minh regression.

## 12. Rocket Bar — nếu cần đủ stable inventory

1. Xác minh desktop handler đã cài và consumer/build thuộc ticket.
2. Dùng entry Rocket Bar đã xác minh; quay app/version/environment, không quay secrets.
3. Lặp Quick Send flow trong đúng desktop consumer, giữ cùng safety scope.
4. Không handler/build chưa rõ: TC-006 Blocked; browser smoke không thay thế Rocket Bar.

## 13. Diagnostics khi có candidate lỗi

1. Giữ attempt gốc: prerequisites, action, expected basis, actual, timestamp/evidence.
2. Diagnostic cùng dữ liệu để kiểm tra reproducibility.
3. Diagnostic fixture sạch đáp ứng cùng prerequisites.
4. Diagnostic fresh page/session; login thủ công nếu cần.
5. Thêm baseline/control path cùng prerequisites để phân biệt existing bug và regression.
6. Không lấy locator timeout, console error hoặc global DOM count làm product Fail nếu chưa gắn được với UI behavior.
7. Stable reproduced defect + trusted expected basis mới Fail. Mixed Pass/Fail: Inconclusive.

## 14. Kết thúc từng branch

1. Đóng dialogs.
2. Verify cleanup test drafts/records; ghi leftovers.
3. Ghi từng mục Pass/Fail/Blocked/Not Run/Inconclusive; không gộp smoke thành full-flow Pass.
4. Rà 12 stable IDs: TC-001/002/003/004/005/006/010/011/012/013/014/015.
5. Supplemental mutation flows ghi riêng; không đổi mutation class/expected basis của stable cases ngầm.
6. Automation theo workflow ticket cần standalone specs cho manual Pass/Fail; CLI result tách manual product result.
7. Chỉ tổng hợp nhận xét branch từ phần đã thực hiện; ghi rõ phần blocked/chưa verify.

## Thứ tự quay

Entry → Patient Details → Campaign/search/sort → Health Forms → Files → Booking Link → channel/editor/preview → Save/reopen → cleanup. GP thêm video Quick Form. Không Send Now/Schedule.

## Mẫu result sheet

| Branch | Hạng mục | Fixture alias / prerequisites | Result | Actual / blocker | Evidence timestamp | Cleanup / leftovers |
|---|---|---|---|---|---|---|
| Connect | Entry / Patient Details | | Not Run | | | |
| Connect | Campaign/search/sort | | Not Run | | | |
| Connect | Health Forms select/remove | | Not Run | | | |
| Connect | Files select/remove | | Not Run | | | |
| Connect | Booking Link | | Not Run | | | |
| Connect | Channel/editor/preview | | Not Run | | | |
| Connect | Save/reopen | | Not Run | | | |
| OS | Các hạng mục Quick Send như trên | | Not Run | | | |
| GP | Các hạng mục Quick Send như trên | | Not Run | | | |
| GP | Quick Form | | Not Run | | | |
| Desktop | Rocket Bar TC-006 | | Not Run | | | |

## Tester notes

