# PAC2-4700 — Recheck 2026-10-05

## Run đang thực hiện

- Input revision: 1; 15 source files và 6 output artifacts checksum MATCH.
- Role baseline/OS: `Super Admin GB`, xác minh trực tiếp header. Connect authenticated cùng browser; role label chưa xác minh riêng.
- Scope tester chọn: toàn bộ 12 stable cases. Chưa hoàn tất inventory; không thay kết quả cũ.
- Mutation: None. Không Save/Send/Schedule/chọn campaign/form/file/slot. Dialog baseline, Connect, OS đã đóng bằng Close; không tạo QA-AUTO record.
- Routes: baseline `/paco/dashboard`; Connect `/paco-connect/feature-branch/pac2-4700-qs-only/dashboard`; OS `/paco/feature-branch/pac2-4700-qs-only/dashboard`.

## Observed, chưa phải final case result

- Quick Send mở từ global search `test` → first Patient actions menu → Quick Send trên baseline/Connect/OS. Bốn tab Campaign/Health Forms/Files/Booking Link click được; Close đóng dialog.
- Baseline sort chọn A - Z, input hiển thị A - Z. Connect chọn Z - A, visible label hiển thị Z - A. Option list có năm unique options: By date (descending), By date (ascending), By message type, A - Z, Z - A.
- OS attempt đầu đọc input vẫn By message type sau chọn Z - A. Retry mở lại cùng query, chờ panel settle 3s: A - Z hiển thị đúng; chọn tiếp Z - A hiển thị đúng. Chưa phân biệt timing/re-render/tool stale state với product intermittent; KHÔNG ghi Fail. Cần thêm clean-data/fresh-page diagnostic attempts + evidence/control nếu kết luận intermittent.
- Một số locator timeout do exact name/state đã đổi; không quy thành product Fail.
- GP host được allowlist nhưng redirect `/login/`; auth riêng chưa có. TC-004/005 chưa chạy trong run này. Rocket Bar TC-006 chưa chạy.
- TC-003/010/011/012/013/014/015 chưa hoàn tất; không copy patient identity/contact vào artifact này.

## Evidence

- Browser tool results 2026-10-05T08:09–08:19Z là provenance observation.
- Raw snapshot `test-results/PAC2-4700/manual-20261005/baseline-dialog.yml`: local only, có thể chứa PII; không share/promote chưa redact.
- Chưa có durable redacted per-attempt evidence; chưa đủ MANUAL_EXECUTE completion gate.

## Next action

1. Tester login thủ công GP tại tab hiện tại `https://pac2-4700-qs-only.dev.blinxpaco-np.com/login/`, role Super Admin GB.
2. Orchestrator reconcile schema v1 theo helper, preserve checkpoint history; inventory 12 IDs; chưa checkpoint COMPLETE theo workflow mới.
3. Tiếp tục TC-003 và OS sort diagnostics; verify GP/Quick Form location qua child ownership trước TC-004/005. TC-006 cần desktop handler; TC-013 cần mapped campaign; các Inferred cases chỉ observation, không unsupported assertion.
4. Hoàn tất manual records/evidence trước generate specs và CLI. Không sửa manual result từ CLI.

## GP tiếp tục sau manual login

- GP authenticated; tester xác nhận role Super Admin GB, header GP chưa expose role label.
- Quick Form mở từ patient actions menu; Select Quick Form hiện; Health Form/Comments/SNOMED Code/Advanced chuyển được; Close đóng. Không chọn form/sửa dữ liệu.
- Quick Send GP mở được; Campaign/Health Forms/Files/Booking Link chuyển được; Close đóng. Không mutation.
- Các timeout trong bước này là locator/actionability: first search result ngoài viewport; Quick Form accessible names tab-* khác Quick Send. Retry dùng result trong viewport và correct accessible names thành công; không product Fail.
- feature-location.md đã thêm revalidation riêng, giữ nguyên lịch sử và Tester notes. Route sync feature-map/checksum reconciliation chưa hoàn tất; chưa checkpoint phase.
- Tiếp tục: hoàn tất route knowledge sync, TC-003, sort diagnostics, inventory còn lại, standalone specs và CLI. Không coi smoke GP/Quick Form là full functional coverage.

## Inventory review bổ sung — chưa completion gate

| Case | Run 2026-10-05 | Cơ sở / phần chưa hoàn tất |
|---|---|---|
| TC-001 | Inconclusive | Open/tab/Close 4 hosts thành công; chưa visual review đầy đủ / durable evidence |
| TC-002 | Inconclusive | Baseline/Connect đổi sort; OS mixed trước settle, retry A-Z/Z-A đúng; chưa đủ clean/fresh diagnostics |
| TC-003 | Blocked | UI hiện Enable SMS/Enable Email buttons; fixture baseline SMS enabled nhưng chưa selected; các result viewport khác thiếu contacts, cả hai disabled. Không switch channel theo case scope |
| TC-004 | Inconclusive | GP Quick Form open/4 tabs/Close thành công; chưa full visual evidence |
| TC-005 | Inconclusive | GP Quick Send open/4 tabs/Close thành công; chưa đủ TC-002/003 trên GP |
| TC-006 | Blocked | Chưa có verified Rocket Bar desktop handler/consumer environment |
| TC-010 | Blocked | Chưa xác minh same-patient email fixture giữa backends; result theo viewport không phải same patient |
| TC-011 | Inconclusive | Năm unique sort options match Connect/OS/GP; expected Inferred |
| TC-012 | Blocked | Chưa có same-patient fixture với documents tồn tại từng backend |
| TC-013 | Blocked | Chưa có approved mapped campaign/config fixture |
| TC-014 | Blocked | Popup absent trên dialogs đã mở; chưa xác minh default campaign chứa scheduler placeholder, không kết luận đúng/sai |
| TC-015 | Inconclusive | Files click dismiss sort Connect/GP; OS immediate probe còn overlay; chưa repeat/settle evidence; expected Inferred |

- Provenance: direct Playwright browser observations trong run này; không dùng matrix cũ thay kết quả mới.
- Cleanup: tất cả Quick Send dialogs đóng; OS cần chờ hidden sau Close, đã xác minh hidden. Mutation None; QA-AUTO leftovers None.
- Worker được giao chạy bổ sung không hoàn thành case nào, không sửa file; timeout locator không chứng minh auth expired. Parent trực tiếp xác minh auth và chạy observations bên trên.
- Automation chưa tạo/chạy: manual gate chưa đạt. Không claim đủ 12 đã execute hoàn tất; bảng chỉ xử lý inventory và blockers.

## Tester notes

