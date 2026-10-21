# PAC2-7579 — Test data ledger

## 2026-10-21 — NHS Comms Hub

- Authorization: tester yêu cầu tạo data test trong phiên; configured external dev host; manifest `mutationMode: auto`.
- Host: `nhs-comms-hub-dev.blinxhealthcare.com`.
- Action: Create campaign `QA-test-7579-source1` — thành công; UI `Successfully created the campaign(s) at 21/10/2026 15:27`. Sau `Back to Campaigns`, danh sách hiển thị `QA-test-7579-source1 QA-test-7579`.
- Type: chỉ `Quick Send`; channel `Email`.
- Campaign tag: `Copied from Template QOF Cervical Smear`.
- Template: `Instant Send - Comms Hub Testing` (chỉ tham chiếu; không sửa template gốc).
- Confirmation/reminder: `MR Test - Confirmation` / `PC24 Test Appt Reminder`.
- Không chọn bệnh nhân/recipient; không Send/Schedule; không thay đổi dữ liệu có sẵn.
- Setup diagnosis: `Next` bật sau keypress trong Campaign Name; email step yêu cầu chọn cả confirmation/reminder.
- Cleanup: giữ làm source cho bước kiểm tra PACO Assist kế tiếp; đã xác nhận record persisted trong danh sách campaign sau navigation. Xóa dữ liệu tự tạo khi kết thúc kiểm tra.
- Discovery/workflow checkpoint chưa cập nhật.

## Kiểm tra handoff sang PACO Quick Send

- Observed: NHS campaign row `558` có `Analytics`, `Outbox`, `Edit`, `Delete`; context menu có `View send details`, không thấy `Paco Assist`.
- Observed: PACO dev `/paco/quick-send`, org `Primary Care 24`, location `test again`, role `Blinx Deployment`: tab `Campaigns` không hiển thị campaign; search chính xác `QA-test-7579-source1` vẫn không có row dữ liệu. Không đủ evidence để phân biệt empty inventory với load failure.
- Result: `Blocked` tại bước chọn nguồn để copy; chưa dùng được Paco Assist trên source, chưa đánh giá tag inheritance. Không tạo campaign copy, không send.
- Leftover: `QA-test-7579-source1` trong NHS được giữ cho lần tiếp tục; chưa cleanup. Không có mutation nào thêm trong bước handoff.
- Raw evidence: `.playwright-mcp/page-2026-10-21T08-28-59-020Z.yml` (NHS context menu), `.playwright-mcp/page-2026-10-21T08-33-14-915Z.yml` (PACO Campaigns).

## Thử nguồn có sẵn theo yêu cầu tester

- Observed 2026-10-21: mở `Campaign Details` của `DFD TRiage` (row `557`), `Campaign Tags` = `0`, không thấy `Paco Assist`; đóng bằng `Cancel`.
- Observed: mở `Campaign Details` của `Asthma Clinic (Test)` (row `553`), type `Quick Send`, `Campaign Tags` = `0`, không thấy `Paco Assist`; đóng bằng `Cancel`.
- Observed: `/paco-connect/dashboard` với org `Primary Care 24`, role `Blinx Deployment` hiển thị `Access Denied`; không suy ra feature không deploy.
- Không lưu, sửa, xóa, resend hoặc pause dữ liệu có sẵn. Không có bản copy mới; chưa có evidence tag inheritance. Kết quả vẫn `Blocked` do chưa tìm được entry `Paco Assist` từ nguồn campaign.
- Evidence: `.playwright-mcp/page-2026-10-21T08-52-45-643Z.yml`, `.playwright-mcp/page-2026-10-21T08-53-19-139Z.yml`; các giá trị tag được đọc sau khi UI tải xong bằng browser evaluate.
- Leftover không đổi: `QA-test-7579-source1`; workflow checkpoint chưa cập nhật.

## Tiếp tục 2026-10-21 — tìm entry PACO Assist

- `[Observed: dev, Super Admin GB, Haringey Demo Org, 09:09–09:33 UTC]` `/paco/quick-send/campaign` → `PACO Assist` mở panel prompt + `Generate Templates`; không nhập prompt, không generate/save. Chưa chứng minh campaign-base flow.
- `[Observed: cùng context]` `/paco/quick-send` → `Campaigns` có 0 data rows; frontend `getAllCreatedCampaigns` HTTP `404` lặp qua navigation mới. Không kết luận inventory thật sự rỗng. Evidence: `test-results/PAC2-7579-campaign-load-recheck.txt`.
- `[Observed: cùng context]` Topbar `More options` → `PACO Assist` có `cursor-not-allowed`, click không mở UI. Không suy ra root cause quyền.
- `[Observed: cùng context]` Global patient search test → `Patient actions menu` → `Quick Send` mở composer tự tải campaign có sẵn. Không chọn campaign, không sửa/lưu/gửi trên patient/campaign có sẵn. Control `PACO Assist` hiện `Premium Feature` / `AI-powered tools to create your email templates` / `Upgrade your license to unlock`; không bypass. Đóng bằng `Close`. Evidence: `test-results/PAC2-7579-composer-assist-license.yml`; tooltip text được evaluate hai lần, snapshot có `aria-hidden`.
- `[Observed]` `/paco-connect/dashboard` render UI sau auth dù document HTTP `404`; `/paco-connect/campaigns/create` sau SPA load hiện UI `404` / `back to home`. Không suy ra cần branch khác, không xem lại video.
- `[Observed: 09:12 UTC]` Comms Hub dev `Campaign Manager` chuyển `/commshub/login`, UI báo session hết hạn. Chưa kiểm tra lại tag source hoặc cleanup.
- `[Observed: 09:39–09:41 UTC]` Browser chuyển sang `Primary Care 24` / `PAC2-6186 SUPER ADMIN` ngoài chuỗi chọn context đã hoàn tất của agent; nguyên nhân chưa rõ. Query `test` không có kết quả; chưa kiểm chứng Assist/license ở context này.
- Mutation trong phần tiếp tục: không. Campaign B: không. Không recipient, không send/schedule. Result: `Blocked`, tag inheritance chưa có kết luận `Pass`/`Fail`.
- Leftover theo last observed: `QA-test-7579-source1`; source tồn tại trong list ở bước trước nhưng tag persisted chưa read-back. Cleanup pending vì Comms Hub session hết hạn, không phải cleanup hoàn thành.
- Parent `paco-ticket` cập nhật workflow checkpoint cuối phần tiếp tục; discovery checkpoint không thay đổi. Các dòng “checkpoint chưa cập nhật” phía trên là lịch sử tại thời điểm ghi.
- Evidence hygiene: response auth-bearing lưu nhầm đã được xóa; không dùng làm evidence. Raw snapshots còn local, chưa duyệt để chia sẻ.
- Cuối checkpoint: `playwright-plugin` và `playwright-user` báo `CONNECTION_CLOSED`; không có browser recheck hoặc xác nhận auth/license mới. Đây là lỗi kết nối, không phải thiếu cấu hình/access.

## Retry 2026-10-21 — feature branch PAC2-7579

- Scope: tester cung cấp route `/paco/feature-branch/pac2-7579`; UI chuyển tới `/paco/feature-branch/pac2-7579/dashboard` trên configured dev host. Context đọc từ UI: `Super Admin GB` / `Haringey Demo Org`. Browser plugin hoạt động; thông báo kết nối ở checkpoint trước là lịch sử.
- `[Observed]` Global patient search → `Patient actions menu` → `Quick Send` mở composer ở `SMS`; `Enable Email` disabled trong patient context đã mở. Chỉ xem trên patient/campaign có sẵn, không sửa contact hoặc assets.
- `[Observed]` `Select Campaign`, search chính xác `QA-test-7579-source1` trả `No available options`. Đã clear search; không chọn campaign vào draft, không kết luận source bị xóa hoặc nguyên nhân do org mismatch.
- `[Observed]` `PACO Assist` mở menu có `Optimise message` / `Write my templates`; chọn `Write my templates` mở `Create Campaign with PACO Assist`. Prompt required, minimum `10` characters; `Generate Templates` disabled khi prompt trống. Không nhập prompt hoặc generate. Evidence đã review, chỉ form: `test-results/PAC2-7579-featurebranch-assist-form.yml`.
- `[Observed: 11:00 UTC]` Recheck NHS `/commshub/campaign-manager` chuyển `/commshub/login`; auth check trả `false`. Chưa read-back tag hoặc cleanup source. Không chạy login helper export-only như CLI, không đưa credentials vào tool args, không đọc auth state.
- Kết thúc bằng `Cancel` form và `Close` composer; kiểm tra `0` visible dialogs. Mutation app-data trong retry: không. Không campaign B, recipient, send hoặc schedule. Result: `Blocked`; chưa có `Pass`/`Fail` tag inheritance.
- Leftover không đổi: `QA-test-7579-source1`, last observed trong NHS list; persisted tag chưa read-back, cleanup pending do auth. Không blind recreate.
- Parent `paco-ticket` cập nhật checkpoint retry; discovery checkpoint không thay đổi. Budget locate bắt đầu khoảng `10:41 UTC`, đã vượt ceiling `15` phút; không reset sau compaction, không ghi tổng views thiếu evidence.

## NHS admin login và source read-back — 2026-10-21

- `[Tester-provided]` Cho phép đọc env và dùng NHS admin account cho NHS domain. `[Observed]` Login bằng `NHS_ADMIN_USERNAME` / `NHS_ADMIN_PASSWORD` thành công; auth check `true` trên đúng NHS dev host. Không ghi giá trị credential, cookie, token hoặc auth state; local handoff dùng một lần đã kết thúc.
- `[Observed]` `Campaign Manager` → `Search campaigns`: nhập exact source rồi `Enter` → `Non-Shared Campaigns (1)` → expand group → row `558`, `QA-test-7579-source1`, type `Quick Send`, Email template `Instant Send - Comms Hub Testing`. Không phải source mất; row bị ẩn khi group collapsed.
- `[Observed]` Hover own row → `Edit` mở `Campaign Details` của đúng source. Sau detail load, `Campaign Tags` có `1` selected tag: `Copied from Template QOF Cervical Smear`. Đây là persisted read-back sau login/navigation mới, không còn chỉ là lựa chọn tại create.
- `[Observed]` UI context label `Haringey Demo Org (YGMQJ) (3)`; chưa chứng minh org sở hữu hoặc nguyên nhân source không xuất hiện trong branch picker. Không switch role/org.
- Đóng bằng `Cancel`, detail closed, own source vẫn listed. Không `Save`, `Resend`, `Pause`, `Delete`, recipient, Send/Schedule hoặc B. Leftover: `QA-test-7579-source1` giữ cho pending A → B; chưa cleanup.
- Evidence đã rút gọn/redact: `test-results/PAC2-7579-nhs-source-readback-20261021T1136.json`. PACO tab hiện `/paco/login`; branch picker chưa recheck. Result tag inheritance vẫn `Blocked`; không reset budget locate hoặc thay discovery checkpoint.

## PAC admin branch picker recheck — 2026-10-21 12:21 UTC

- `[Observed]` Login PAC admin thành công, context `Haringey Demo Org` / `test again - old location` / `Super Admin GB`. Không ghi credential values/auth state; local handoff một lần đã đóng exit `0`.
- Known entry → `Quick Send` → `(click to change)` → `Select Campaign`: own `QA-test-7579-source1` search exact + `Enter` trả `No available options` trong hai test patient contexts (`email not on file` và `email on file`). Không chọn campaign vào draft. `Enable Email` disabled; chưa rõ nguyên nhân.
- Đã clear search/close composer; `0` visible dialogs. Không mutation app-data, B, generate/save/send/schedule/cleanup. `Remind me later` chỉ dismiss status prompt; không đổi activity status. Source `QA-test-7579-source1` vẫn leftover; persisted NHS tag từ read-back trước giữ nguyên provenance, NHS hiện lại login.
- Result `Blocked` tại source availability; không có tag inheritance verdict. Evidence: `test-results/PAC2-7579-admin-picker-recheck-20261021T1221.json`. Discovery checkpoint không thay đổi; không scan lại rejected routes hoặc blind recreate source.

## New source theo tester — 2026-10-21 12:39 UTC

- `[Tester authorization]` “Tạo source test khác rồi check tiếp đi”. Scope: new owned `QA-test-7579-source2-20261021`, tagged `Quick Send` trên configured dev host; không recipient/send. Đây là source mới có chủ đích sau source1 unavailable, không blind retry create source1.
- `[Observed]` NHS admin login lại thành công, auth `true`. UI `Your Home Organisation` và context hiện đều `Haringey Demo Org (YGMQJ)`, khác home label `Primary Care 24` trong lần read-back trước; chưa suy ra nguyên nhân thay đổi.
- Runtime `evaluateMutationGate()` cho create source2: `allowed: true`, `reason: auto_mode`; bổ sung HTTPS/exact host guard tại browser trước mutation.
- Planned action: `Create Campaign` tagged `Quick Send`, ưu tiên kênh `SMS` để đối chiếu với composer đang SMS; dùng text tổng hợp, không gửi SMS. Cleanup qua UI `Delete` chỉ own new source/B sau kiểm tra và verify list; nếu lỗi ghi leftover.
- State: trước create; chưa submit hoặc tạo source2/B. Source1 giữ nguyên, không sửa/xóa trong scope tạo mới.
- `[Observed]` Source1 tag không có trong dropdown hiện tại; không suy ra tag bị xóa. Chọn tham chiếu tag hiện có `Test tag - no codes` cho source2 (không sửa tag shared). Type read-back ban đầu còn cả `Scheduled` và `Quick Send`; bỏ `Scheduled` trước khi tiếp wizard.
- `[Observed]` Trước submit: chỉ `Quick Send`, tag `Test tag - no codes`, SMS template `Quick Send Test GB3 - mike 2620`, confirmation `merge tag test`, reminder `Flu Reminder SMS` (chỉ tham chiếu assets). Cảnh báo SMS dài được `Continue` sang `Review`, không phải gửi. Không chọn recipient hoặc org chia sẻ thêm; gate recheck `auto_mode` allow. Action kế tiếp: `Create` own source2, cleanup bằng UI Delete sau handoff.
- `[Observed]` `Create` một lần thành công: `Successfully created the campaign(s) at 21/10/2026 19:57`. `Back to Campaigns` → exact search + Enter → expand `Non-Shared Campaigns (1)` hiện row `4467`, own source2, `Quick Send`, SMS template đúng. Hover → Edit → chờ detail load: persisted `Campaign Tags` = `1`, `Test tag - no codes`; type chỉ `Quick Send`. `Cancel` không Save, source vẫn listed. Không B/recipient/send/schedule. Source2 hiện leftover trong lúc kiểm tra PACO handoff; source1 giữ nguyên.

## Source2 PACO handoff và Assist — 2026-10-21

- `[Observed]` PAC admin login lại đúng branch, `Haringey Demo Org` / `test again - old location` / `Super Admin GB`. Known entry → `Quick Send` → `Select Campaign` exact source2 search; chờ kết quả xong có đúng `1` match `QA-test-7579-source2-20261021`. Không còn blocker source2 availability; source1 không được recheck ở lượt này.
- Planned mutation: chọn own source2 vào composer, `PACO Assist` → `Write my templates`, prompt tổng hợp không PII, generate rồi Save New own `QA-test-7579-copy2-20261021` nếu UI cho phép; không Update shared source/patient, không recipient/send. Runtime gate `auto_mode` allow; guard HTTPS/exact PACO host. Kiểm tra tag trước/sau lưu tại UI; cleanup copy2/source2 bằng UI Delete, log leftovers nếu chặn.
- State trước action: chưa chọn source, generate hoặc tạo B. Patient context chỉ dùng mở composer, không sửa profile/contact và không Send.
- `[Observed]` Chọn đúng own source2; Assist form nhận prompt tổng hợp về practice opening hours, chỉ chọn `SMS (Optimised)`, bỏ `Email`/`Booking Link`, không Health Form. `Generate Templates` trả UI `HTTP error! status: 403`; form còn mở, chưa có generated template/B/save/send. Đây là blocker generation, không phải product `Fail` tag inheritance.
- Diagnostic: giữ source2/prompt, bật lại `Email` + `Booking Link` về defaults và retry generate một lần; vẫn thấy đúng một visible `HTTP error! status: 403`, không có control apply/generated template. Listener không lưu response metadata do locator strict-mode error ở hidden duplicate; không claim network path/status từ listener. Không bypass permission hoặc retry thêm khi kết quả generation chưa có.
- `Cancel` Assist, `Close` composer, chờ xác nhận `0` visible dialogs. Không Save/B/send. Cleanup: target own NHS row `4467` / source2 đã quan sát trước, runtime gate `auto_mode` allow `Delete`; confirmation hiển thị đúng own name dù title `Delete Scheduled Campaign`. `Confirm` một lần.
- `[Observed]` Sau reload → exact search + Enter → expand group, source2 còn listed nhưng action đổi từ `Delete` sang `Restore`; đây là deleted/restore state, không phải hard absence. Không Restore hoặc retry Delete. Cleanup UI hoàn tất tới trạng thái xóa có thể khôi phục; retained deleted record được báo rõ. Source1 giữ nguyên, chưa cleanup. Không có B được tạo qua UI.
- Kết quả tag inheritance: `Blocked` bởi generation `403`, không `Pass`/`Fail`. Evidence rút gọn: `test-results/PAC2-7579-source2-assist-20261021.json`. Không thay discovery checkpoint; legacy schema giữ nguyên.

## Chẩn đoán 403 theo tester — 2026-10-21

- Tester yêu cầu “Check lỗi 403 rồi thử tiếp đi”. Reconcile source2 row `4467` còn listed, action `Restore`, NHS auth qua URL/UI hiện true. Gate `auto_mode` allow NHS restore/cleanup và PACO generation trên own source2. Không đổi role/quyền, không API probing, không đọc auth state/headers/response body.
- Kế hoạch: Restore đúng own source2, đọc lại persisted tag, fresh PACO page/auth/context, retry cùng synthetic prompt với listener chỉ host/path/method/resource type/status và safe error category. Giả thuyết chưa xác minh: lỗi ở request generation hay app session/branch routing, không mặc định thiếu quyền. Chỉ UI-triggered traffic; không replay request hoặc bypass `403`.
- Sau diagnostic: nếu generate được tiếp Save New own B và tag checks; nếu vẫn chặn Cancel/Close và Delete source2 trở lại deleted/restore state, log outcome. Không Send.
- `[Observed]` Restore/Confirm own source2 thành công; Edit read-back tag `Test tag - no codes`, type chỉ `Quick Send`, Cancel không Save. PACO session đã hết hạn; login mới PAC admin đúng org/location/role, source2 vẫn tìm thấy/chọn được. Không đổi quyền/config.
- `[Observed]` Fresh-login diagnostic cùng synthetic prompt, SMS-only/no Booking Link: UI vẫn `HTTP error! status: 403`. Listener chỉ metadata xác định generation `POST https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-7579/undefined/v1/chat/completions` trả HTTP `403`; không transport failure. Một background XHR cùng lúc trả `204` (chỉ control connectivity, không chứng minh authorization generation).
- `[Inferred]` Segment literal `undefined` cho thấy generation target URL malformed hoặc thiếu cấu hình AI base; chưa xác định biến build/runtime hoặc root cause HTTP rejection. Fresh login không khắc phục; không đủ kết luận role/license. Không đọc response body/headers/auth state, không sửa URL, không replay/probe API. Dừng generation retries vì cùng malformed target; không B/Save/Send.
- Cleanup hoàn tất: Cancel Assist, Close composer xác nhận `0` visible dialogs; destructive gate `auto_mode` allow, UI Delete/Confirm source2. Reload/search/expand xác nhận row còn listed, `Restore: 1`, `Delete: 0`: deleted/restore state, không hard absence. Source1 không đổi. Không B/Save/Send.
- Evidence rút gọn: `test-results/PAC2-7579-403-diagnosis-20261021.json`. Kết quả `Blocked`; dependency tiếp theo là owner deployment kiểm tra AI base URL config branch và sửa target `undefined`, không thay endpoint client-side hoặc bypass quyền. Chưa biết exact config variable; không claim fix thành công.

## Tester notes

