# Status - PAC2-7579

**Ticket:** PAC2-7579 — PACO Assist Copying Campaign Tag Configuration
**Current Phase:** `LOCATE` — `Blocked`
**Updated:** 2026-10-21
**Environment:** `dev`, `blinx.dev.blinxpaco-np.com`

## Summary

| Phase | Status | Ghi chú |
|---|---|---|
| `ANALYZE` | Hoàn thành theo checkpoint cũ | Expected lấy từ `ticket.md` Description; không xem lại video trong lần tiếp tục |
| `LOCATE` | `Blocked` | Branch chọn được tagged source2 mới; `Generate Templates` trả UI `403`, chưa tạo B hoặc xác minh full A → Assist → B |
| `EXPLORE` | `stale` | Không chấp nhận flag `complete` cũ làm bằng chứng tag inheritance |
| `TEST_DESIGN` / `AUTOMATE` / `AUTOMATION_EXECUTE` | Chưa chạy | Chưa có route/precondition khả dụng cho luồng tạo B |
| `REPORT` / `COMPLETE` | Chưa chạy | Không chuyển phase chỉ để đóng blocker |

## Expected và kết quả

- `[Confirmed: ticket.md#description]` Khi dùng Quick Send A có Comms Hub tag làm base và tạo campaign B bằng `PACO Assist`, B không được tự kế thừa Comms Hub tag của A. Không suy rộng sang mọi loại tag hoặc xóa tag trên A.
- Kết quả kiểm tra: `Blocked`. Chưa tạo B, chưa kiểm tra tag của B trước/sau lưu, không có kết luận `Pass`/`Fail` cho bug.
- Không có manual case inventory, standalone spec hoặc CLI execution trong lần tiếp tục này. Không gọi lỗi setup/license là product `Fail`.

## Retry branch tester cung cấp — 2026-10-21

- `[Tester-provided / Observed]` `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-7579` chuyển tới `/paco/feature-branch/pac2-7579/dashboard`; role/org `Super Admin GB` / `Haringey Demo Org`. Browser plugin hoạt động; không login mới hoặc đổi quyền/license.
- `[Observed]` Global patient search → `Patient actions menu` → `Quick Send` → `PACO Assist` mở menu `Optimise message` / `Write my templates`. `Write my templates` mở form `Create Campaign with PACO Assist`; `Generate Templates` disabled khi prompt trống. Composer đang ở `SMS`, `Enable Email` disabled trong patient context này. Không kết luận Email Assist/license toàn hệ thống thay đổi.
- `[Observed]` `Select Campaign`, search chính xác own source `QA-test-7579-source1` trả `No available options`. Không chọn campaign vào draft; không kết luận source mất hoặc nguyên nhân do org mismatch.
- `[Observed: 11:00 UTC]` NHS `/commshub/campaign-manager` chuyển `/commshub/login`; auth check trả `false`. Chưa read-back persisted tag hoặc cleanup. Helper hiện export-only, không có standalone UI runner cho tab plugin; không đưa credentials vào tool args hoặc đọc auth state.
- `[Observed]` Đã `Cancel` form rồi `Close` composer; `0` visible dialogs. Không prompt/generate/save/B/recipient/send/schedule. Result vẫn `Blocked`, không `Pass`/`Fail`. Evidence form: `test-results/PAC2-7579-featurebranch-assist-form.yml`; các bước khác xem `feature-location.md`, `test-data-ledger.md`.
- Budget `LOCATE` bắt đầu khoảng `10:41 UTC`, vượt ceiling `15` phút; không reset sau compaction, không có counter views đủ tin cậy. Đã dừng scan. Full source-base workflow và legacy schema vẫn chưa hợp lệ cho downstream.

## Quan sát mainline trước retry branch

1. `[Observed: dev, Super Admin GB, Haringey Demo Org, 2026-10-21]` Global patient search → `Patient actions menu` → `Quick Send` mở composer có control `PACO Assist`. Control hiện tooltip `Premium Feature`, `AI-powered tools to create your email templates`, `Upgrade your license to unlock`. Không bypass license; đóng composer bằng `Close`, không sửa/lưu/gửi trên patient hoặc campaign có sẵn. Evidence: `test-results/PAC2-7579-composer-assist-license.yml` và `feature-location.md`.
2. `[Observed: cùng context]` `/paco/quick-send`, tab `Campaigns`: không có data row; request frontend `getAllCreatedCampaigns` trả HTTP `404` lặp, kể cả sau navigation mới. Không coi đây là bằng chứng inventory rỗng thật. Evidence: `test-results/PAC2-7579-campaign-load-recheck.txt`.
3. `[Observed: cùng context]` `/paco/quick-send/campaign` → `PACO Assist` mở panel prompt + `Generate Templates`; chưa chứng minh campaign-base flow. Không generate hoặc save. Topbar `More options` → `PACO Assist` không mở UI, item có `cursor-not-allowed`.
4. `[Observed: cùng context]` `/paco-connect/dashboard` render dashboard sau auth dù document HTTP `404`; `/paco-connect/campaigns/create` sau SPA load vẫn hiện UI `404` / `back to home`. Kết luận cũ “mọi route Connect thiếu” và “create chắc chắn chỉ là SPA fallback” đều bị thay thế bởi quan sát cụ thể này. Không suy ra cần feature branch; giữ dev theo yêu cầu tester.
5. `[Observed: cuối lần tiếp tục]` Browser chuyển sang `Primary Care 24` / `PAC2-6186 SUPER ADMIN` ngoài chuỗi chọn context đã hoàn tất của agent; chưa rõ nguyên nhân. Search `test` không có kết quả. Chưa kiểm chứng `PACO Assist` hoặc license trong context này.
6. `[Observed]` Mở `Campaign Manager` từ sidebar dẫn tới Comms Hub dev nhưng session đã hết hạn. Không kiểm tra lại tag hoặc cleanup source được trong state này.

## Test data và cleanup

- Last observed: `QA-test-7579-source1` đã được tạo trong NHS Comms Hub dev và xuất hiện ở campaign list. Tag được chọn lúc create: `Copied from Template QOF Cervical Smear`; chưa read-back tag trong detail sau lưu.
- Leftover chưa được xác minh lại/cleanup: `QA-test-7579-source1`. Không có campaign B; không thêm recipient, không `Send`/`Schedule`. Chi tiết: `test-data-ledger.md`.
- Response chứa auth data do phiên trước lưu nhầm đã được xóa khỏi local evidence; không dùng làm evidence và không đọc lại nội dung. Raw browser snapshots khác vẫn là local, chưa được duyệt để chia sẻ.

## Checkpoint integrity

- Manifest hiện dùng legacy shape không có `schema_version`/`input_snapshot`; `reconcileManifest()` không thay đổi shape này, `validateManifest()` không chấp nhận. Không tự migrate schema hoặc bịa input revision.
- Ghi correction `LOCATE: blocked`, `EXPLORE: stale` và giữ lịch sử flag cũ; automation vẫn bị chặn bởi schema và location. `sourceChecksum` là checksum hiện tại, không chứng minh source chưa từng thay đổi vì baseline trước đó để trống.
- `mcp:run:ports` / `mcp:run:list`: không có tracked active run; browser plugin hiện tại không có run ID để cleanup. Không tạo allocation hồi tố và không kill browser/process khác.
- Checkpoint mainline từng ghi `playwright-plugin` / `playwright-user` báo `CONNECTION_CLOSED`. Retry branch dùng được tabs/click/evaluate/snapshot và mở form Assist; lỗi kết nối cũ không còn là blocker hiện tại. NHS auth vẫn `false` theo recheck riêng.
- Đã sync quan sát giới hạn vào `docs/product/feature-map.md`, `workflows/comms-hub.md`, `open-questions.md` (OQ-046), `change-log.md`. Không tạo `exploration.md` hoặc đánh dấu `EXPLORE` complete khi full flow còn blocked.
- `rtk proxy bash validate-docs-structure.sh` exit `1`: `FAIL: PAC2-7398 reached EXPLORE/REPORT but is missing from docs/product/feature-map.md`. Không sửa ticket khác để làm validator pass.
- Targeted `git diff --check` pass; kiểm tra source checksum và protected notes của `feature-location.md` / `workflows/comms-hub.md` pass. Manifest ghi checksum hiện tại của 8 artifacts, không coi chúng là baseline lịch sử hoặc schema migration.

## Kiểm tra checkpoint branch

- `git diff --check`: exit `0` trên diff 8 files sau cập nhật branch.
- Assert check: source checksum khớp, artifact checksums `8/8`, protected `Tester notes` giữ nguyên byte `7/7`, route branch đúng; `LOCATE blocked`, `EXPLORE stale`, case inventory vẫn rỗng. YAML parse được không đồng nghĩa manifest legacy hợp lệ schema v2.
- `rtk proxy bash validate-docs-structure.sh`: exit `1`, `FAIL: PAC2-7398 reached EXPLORE/REPORT but is missing from docs/product/feature-map.md`. Không sửa ticket ngoài scope. Không chạy product spec/CLI hoặc claim bug đã fixed.

## Resume auth recheck — 2026-10-21 11:25 UTC

- `[Observed]` Browser plugin trả tabs và navigation bình thường. Mở đúng NHS dev `/commshub/campaign-manager` chuyển về `/commshub/login`; chạy `CHECK_AUTH_SCRIPT` trả `authenticated: false`. Lỗi kết nối MCP khai báo lúc bắt đầu phiên không tái hiện trong các call này.
- Giữ manual authentication theo `CLAUDE.md` / `paco.config.yaml`; không đọc credentials, chạy auto-login, xuất auth state hoặc dùng helper export-only như CLI. Tester cần đăng nhập thủ công tại tab NHS Comms Hub dev đang mở.
- Source checksum khớp checkpoint. Không reset budget `LOCATE`, lặp branch scan, tạo source mới, tạo B, mutate hoặc cleanup khi chưa có auth. `QA-test-7579-source1` vẫn là leftover chưa recheck.
- `mcp:run:ports` không liệt kê allocation. Không cấp run hồi tố cho session plugin hiện tại; không kill process/browser khác.
- Evidence đã rút gọn/redact: `test-results/PAC2-7579-auth-resume-20261021T1125.json`. Kết quả vẫn `Blocked`; chưa có product `Pass`/`Fail`, standalone spec hoặc CLI execution. Giữ legacy schema, history và protected notes.
- Bước tiếp: tester đăng nhập NHS dev rồi báo đã xong; recheck auth, role/context và đọc lại persisted tag của đúng own source trước mọi A → B. Migration manifest vẫn cần phê duyệt riêng trước CLI.

## NHS login configuration clarification — 2026-10-21

- `[Tester-provided]` NHS domain dùng `nhs_admin_username`, không dùng PACO account. Kiểm tra local chỉ trả tên key và trạng thái configured: `NHS_ADMIN_USERNAME` / `NHS_ADMIN_PASSWORD` đều có giá trị; không xuất giá trị.
- `[Observed]` Plugin runner không hỗ trợ `require`, dynamic import thiếu callback và không có local env access qua `process.getBuiltinModule`. Login chưa tới bước fill/submit; không đưa credentials vào tool args, file trung gian hoặc browser evidence. Không thay helper/config hay dùng account PACO để thử.
- Auth vẫn chưa được xác minh lại; cần đăng nhập thủ công trong NHS dev tab bằng NHS admin account rồi recheck. Source/B/cleanup và các blocker khác không thay đổi.

## NHS auth restored và persisted tag verified — 2026-10-21

- `[Tester-provided]` Cho phép đọc env để login NHS admin. `[Observed]` Login `NHS_ADMIN_USERNAME` / `NHS_ADMIN_PASSWORD` thành công, auth check `true` tại `/commshub/`. Không xuất giá trị credentials hoặc auth state; handoff local một lần đã kết thúc exit `0`.
- `[Observed]` `/commshub/campaign-manager`: search own source, `Enter`, expand `Non-Shared Campaigns (1)` hiện đúng row `558` / `QA-test-7579-source1`. `Edit` → `Campaign Details` read-back persisted `Campaign Tags`: `1`, `Copied from Template QOF Cervical Smear`. UI label `Haringey Demo Org (YGMQJ) (3)` chưa chứng minh ownership/org mismatch.
- Đã `Cancel`, detail đóng, source vẫn listed. Không save/resend/pause/delete/send hoặc tạo B. Leftover source còn nguyên để test A → B.
- Blocker NHS auth/read-back đã gỡ; PACO tab hiện `/paco/login`, branch picker chưa recheck. Kết quả ticket vẫn `Blocked`; legacy schema và exhausted locate budget giữ nguyên. Không kết luận `Pass`/`Fail` hoặc tự migrate.
- Evidence: `test-results/PAC2-7579-nhs-source-readback-20261021T1136.json`; ledger/location đã cập nhật. Các dòng auth expired/chưa read-back phía trên là lịch sử, được supersede bởi recheck này.
- Bước tiếp: khôi phục auth PACO theo configured PAC account, recheck branch role/context rồi đúng source trong picker; không scan lại rejected routes hoặc tạo source trùng. Migration legacy manifest vẫn cần phê duyệt riêng trước CLI.

## PACO auto-login theo env — 2026-10-21

- `[Tester-provided]` Yêu cầu check env và tự login PACO. `[Observed]` Sáu key `PAC_USERNAME`, `PAC_PASSWORD`, `PAC_ORG`, `PAC_LOCATION`, `PAC_ROLE`, `PAC_BASE_URL` có giá trị. Credentials được app chấp nhận; UI chuyển tới `/paco/location-roles` với redirect branch `pac2-7579`. Không xuất credentials hoặc auth state; local handoff một lần kết thúc exit `0`.
- Chọn đúng configured `Haringey Demo Org` / `test again - old location`. Configured role `Super Admin GB` không có trong toàn bộ `21` options render ở picker; có `Blinx Deployment`, `GP - paco assist`, `Super User`. Không tự đổi role, không bấm `Next` với role khác. Auth chưa hoàn tất theo `CHECK_AUTH_SCRIPT` vì còn `/paco/location-roles`.
- `[Tester decision]` Giữ `Super Admin GB`, không dùng role thay thế. Dừng tại picker; cần tester chỉ location có role này hoặc chỉnh cấu hình. Không kết luận mất quyền hoặc product `Fail`. Không thay env. NHS tab hiện lại `/commshub/login` theo tab list; read-back tag trước đó vẫn là evidence lịch sử hợp lệ, không claim NHS session hiện còn active.
- Không app-data mutation, B, send hoặc cleanup. Source leftover giữ nguyên; `LOCATE Blocked`, legacy schema/budget không đổi.

## Admin-account correction và ticket recheck — 2026-10-21 12:21 UTC

- `[Observed]` Env còn có `PAC_ADMIN_USERNAME` / `PAC_ADMIN_PASSWORD` riêng với PAC account đã thử trước. Login admin thành công; chọn đúng `Haringey Demo Org` / `test again - old location` → picker có duy nhất `Super Admin GB` → `Next` → dashboard. Blocker role trước đó chỉ áp dụng PAC account, không phải location thiếu role trên admin account.
- `[Observed]` Mở lại đúng branch `pac2-7579`, auth `true`. Đi theo known route patient search → `Quick Send` → `(click to change)` → `Select Campaign`; exact own source `QA-test-7579-source1` vẫn trả `No available options`.
- `[Observed]` Đối chiếu thêm một test patient context có `email on file` thay context trước `email not on file`; exact source vẫn `0` và `No available options`. `Enable Email` disabled trong cả hai context; chưa rõ nguyên nhân, không kết luận do channel/org/license. Không chọn source/shared campaign hoặc mutate patient.
- Đã clear picker, đóng composer; auth vẫn `true`, `0` visible dialogs. Không generate/save/B/send/schedule/cleanup. Source tag đã read-back tại NHS trước đó; source vẫn leftover, NHS tab hiện login.
- Evidence redacted: `test-results/PAC2-7579-admin-picker-recheck-20261021T1221.json`. Result `Blocked` tại source selection, không phải login; chưa có `Pass`/`Fail` tag inheritance. Không reset scan budget, migrate manifest hoặc chạy CLI.
- Cần mapping/access làm own tagged source khả dụng trong branch Quick Send hoặc tester cung cấp own safe source khả dụng. Không blind recreate, không dùng shared source để tạo bản copy khi ownership/scope chưa rõ. Phê duyệt migration manifest vẫn là dependency riêng trước CLI.

## Source2 và generation blocker — 2026-10-21

- `[Tester authorization / Observed]` Theo yêu cầu tạo source khác, NHS admin home/viewing `Haringey Demo Org`: tạo `QA-test-7579-source2-20261021` row `4467`, chỉ `Quick Send`, `SMS`, tag `Test tag - no codes`. Create success, navigation/list/Edit read-back xác nhận persisted tag `1`; `Cancel` không Save. Assets chỉ tham chiếu, không sửa shared template/tag.
- `[Observed]` PAC admin login lại đúng branch/context. Exact source2 search có `1` match, chọn được vào composer. Blocker source availability được gỡ cho source2; không suy ra nguyên nhân source1 unavailable hoặc do channel/org.
- `[Observed]` `PACO Assist` → `Write my templates`, prompt tổng hợp không PII, `Generate Templates` trả `HTTP error! status: 403`. Retry cùng prompt với Email/SMS/Booking Link defaults vẫn lỗi. Không bypass, không generated templates/B/Save/Send. Đây là generation blocker, không phải `Fail` tag inheritance.
- `Cancel` Assist và `Close` composer; chờ `0` visible dialogs. Cleanup own source2 bằng NHS `Delete` → confirmation đúng tên → `Confirm`; reload/search/expand còn listed với `Restore` thay `Delete`. Deleted/restore state đã xác minh, không claim hard absence. Source1 giữ nguyên, cleanup pending; source2 còn deleted record có thể restore.
- Evidence: `test-results/PAC2-7579-source2-assist-20261021.json`; ledger ghi gate/guard/action/outcome. Không credentials/auth state trong evidence. Discovery checkpoint không thay đổi, legacy schema không migrate, chưa có CLI/spec hoặc product `Pass`/`Fail`.
- Các phần source unavailable/auth expired/chưa persisted read-back phía trên là lịch sử; checkpoint mới nhất ở section này.
- Product knowledge đã sync trong main working tree: `feature-map.md`, `workflows/comms-hub.md`, `open-questions.md` (OQ-046 trả lời một phần), `change-log.md`. Manifest artifact checksums cập nhật theo bytes main tree; không dùng checksum từ isolated agent khi chưa xác minh.
- Checkpoint checks: `git diff --check` pass; source checksum unchanged, evidence JSON parse được, legacy shape/empty cases giữ nguyên, protected ticket notes `3/3` unchanged. `mcp:run:ports` không có allocation. Docs validator vẫn exit `1`: `FAIL: PAC2-7398 reached EXPLORE/REPORT but is missing from docs/product/feature-map.md`; không sửa ticket ngoài scope.

## Diagnostic 403 — 2026-10-21

- `[Tester request]` Kiểm tra lỗi `403` rồi thử tiếp. Runtime gate allow; restore source2 đúng row `4467`, read-back persisted tag/type đúng, Cancel không Save.
- Fresh PAC admin login đúng org/location/role; source2 tìm thấy/chọn được. Cùng synthetic prompt SMS-only/no Booking Link vẫn UI `HTTP error! status: 403`.
- `[Observed]` UI-triggered request: `POST https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-7579/undefined/v1/chat/completions` trả HTTP `403`; không transport failure. Background XHR trả `204` chỉ là connectivity control, không chứng minh authorization generation.
- `[Inferred]` Literal `undefined` gợi ý thiếu/sai AI base URL config. Chưa biết exact build/runtime variable hoặc nguyên nhân reject; không kết luận role/license, không rewrite endpoint/replay request/probe/bypass. Không đọc response body/headers/auth state.
- Không generated template/B/Save/Send. Cancel/Close dialogs `0`; gate cleanup allow, Delete/Confirm source2, reload/search/expand xác nhận `Restore: 1`, `Delete: 0`. Source2 deleted/restore state, source1 unchanged/retained.
- Evidence: `test-results/PAC2-7579-403-diagnosis-20261021.json`. Sync bốn product docs và OQ-046; legacy schema/discovery checkpoint không đổi. Tag inheritance vẫn `Blocked`, chưa `Pass`/`Fail`.
- Validation diagnostic: `git diff --check` pass; artifact checksums `8/8`, protected notes, evidence/cleanup và legacy checkpoint assertions pass. Docs validator vẫn exit `1` với lỗi ngoài scope `PAC2-7398 reached EXPLORE/REPORT but is missing from docs/product/feature-map.md`. Không product spec/CLI hoặc application fix trong black-box repo.

## Next Steps

1. Owner deployment kiểm tra AI base URL config branch `pac2-7579` vì generation target có literal `undefined`; sửa cấu hình/build rồi recheck request từ UI. Exact variable chưa xác định trong black-box repo. Không scan lại route hoặc tạo thêm source khi dependency chưa đổi.
2. Sau khi generation dùng được, recheck auth và runtime gate. Dùng own tagged `QA-test` source khả dụng; source2 hiện deleted/restore state, chỉ restore khi có kế hoạch tiếp tục ghi ledger. Chạy A → Assist → B, kiểm tra tag trước Save New và sau reopen; không Send.
3. Cleanup B/source test sau kiểm tra; source1 vẫn retained, source2 deleted record được báo rõ. Không mutate shared campaign/patient hoặc blind retry Create.
4. Legacy manifest migration vẫn cần phê duyệt trước CLI workflow. Giữ `LOCATE Blocked` / `EXPLORE stale`, chưa chuyển downstream phase.

## Tester notes
