# PAC2-4700 — branch recheck 2026-10-05

## Scope tester chốt

Ba branches Connect, OS, GP; patient test do tester chọn. Full Quick Send gồm Patient Details, Campaign, Health Forms, Files, Booking Link, channel/editor/preview/Save; Send Now và Schedule ngoài scope. Không sửa contact/consent/records nguồn. Không mutation trong observations dưới đây. Không phải full-flow completion.

## Connect — Observed

- Global search đúng patient tester chọn trả một result.
- Patient actions menu → Quick Send: hai attempts không thấy dialog trong 30s và 60s. URL vẫn branch dashboard, không chuyển login.
- Chưa đủ diagnostic same/clean/fresh/control để gọi confirmed product Fail. Không thực hiện tab/editor/Save trên patient này vì không mở được composer.
- Browser tool provenance 2026-10-05T09:00 vicinity; chưa durable screenshot/video redacted cho candidate.

## OS — Observed

- Quick Send mở được với patient tester chọn.
- Patient Details mở (button lúc kiểm tra đã là Close Patient Details). Personal Info/Significant Info click được; Search all tabs nhập và clear được; đóng panel thành công. Chưa assert nội dung search filtering/contact dropdown selection.
- Health Forms: selector mở picker có search/sort/list. Nhập no-match rồi clear. Count listitem global không đủ chứng minh filter behavior; không claim search Pass. Chưa chọn/add/remove form.
- Files: loading kết thúc, Select Attachment hiện và mở được. Chưa xác định file availability hoặc chọn/remove attachment.
- Booking Link: sáu multiselect wrappers visible, Refresh Availability hiện. Face to Face selector mở danh sách slot types. Chưa chọn slot/clinician/location, chưa refresh/add/remove link.
- Campaign picker có 33 treeitems; search no-match giảm còn 0 rồi clear. Dialog Close đã wait hidden.
- Không editor/preview/channel changes/Save. Không Send Now/Schedule.

## GP — Observed

- Global search đúng patient tester chọn có một actions menu.
- Quick Send click xong không thấy dialog trong 30s. Chưa đủ retries/control để confirmed Fail. Chưa test Patient Details/four tabs trên patient này.
- GP Quick Form smoke trước đó dùng fixture khác; không tính là full flow patient hiện tại.

## Giới hạn và next action

- Worker không chạy case nào, không sửa file; parent observations trên là nguồn duy nhất cho run patient mới.
- Chưa full-flow, chưa đủ 12 cases, chưa automation, chưa sign-off.
- Tiếp tục Connect/GP fresh-page + clean-data diagnostics và control baseline; OS select/remove draft items rồi editor/preview/Save khi persistence/cleanup basis đã xác minh.
- Không dữ liệu mới/Save/send; không leftovers do run này. OS dialog closed; Connect/GP không thấy dialog.
- Chưa cập nhật manifest/status COMPLETE; source revision 1. Tài liệu hướng dẫn trước đó không phải execution evidence.

## Retry Connect / GP theo yêu cầu tester

- Reload từng branch, clear/refill patient search, click actions menu và Quick Send bằng UI.
- Connect: menu/action click thành công, không thấy role=dialog visible sau 45s.
- GP: attempt sau reload gặp menu trigger outside viewport (tool/actionability, không product failure). Clear/refill search rồi retry menu/action click thành công; không thấy role=dialog visible sau 45s.
- Đây là observation dựa trên role locator; chưa snapshot unexpected state để loại trừ composer có markup khác/iframe. Không coi absence role=dialog là bằng chứng UI chắc chắn không mở. Cần kiểm tra full unexpected-state snapshot + visible landmarks trước confirmed defect.
- Không mutation, không Save/Send/Schedule. Không thay kết quả cũ.

## Revalidation sau tester mở composer

- Tab inventory hiện ba URLs, không còn index cũ: Connect index0, OS index1, GP-host index2.
- GP-host hiện authenticated `/paco/dashboard` (title PACO OS), không còn root NHS page. Đóng dialog tester mở, search patient đã chọn, Patient actions menu → Quick Send: mở thành công và đúng patient context. Không kết luận root GP consumer và `/paco/dashboard` là cùng app/build; route change cần giữ rõ.
- Connect tester screenshot chứng minh composer mở được với patient khác; parent verify role=dialog count1 trước đóng. Đóng, search patient tester chọn → Quick Send: không thấy dialog sau30s. Đây không phải lỗi luôn không mở; candidate phụ thuộc patient/state hoặc action tooling.
- Console Connect có TypeError `Cannot read properties of undefined (reading 'hideOverlaysOnDocumentScrolling')` và font404. Chưa chứng minh TypeError gây failure mở composer. Raw local log `test-results/PAC2-4700/manual-20261005/connect-open-errors.txt`.
- Không mutation/Send/Schedule. GP-host composer đang mở đúng patient, sẵn tiếp tục.

## Connect — control patient theo yêu cầu tester

- Observed 2026-10-05: search `test` → first visible Patient actions menu → Quick Send mở dialog thành công trong timeout 30s. Snapshot xác minh đúng fixture test tester đã minh họa; không lưu contact/định danh vào artifact.
- Control này chứng minh Connect vẫn mở được composer với fixture khác. Timeout trên patient trước chưa đủ xác nhận defect; chưa xác định nguyên nhân patient/state/tooling.
- Chỉ search/open/read; không Save/Send/Schedule, không tạo dữ liệu. Composer Connect đang mở; chưa full-flow completion.

## Tester notes

