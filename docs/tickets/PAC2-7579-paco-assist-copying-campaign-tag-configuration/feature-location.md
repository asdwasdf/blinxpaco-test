# Feature Location: PAC2-7579 — PACO Assist Copying Campaign Tag Configuration

**Scope:** `dev`, `blinx.dev.blinxpaco-np.com`; Comms Hub dev trong allowlist.
**Role/context đã quan sát:** `Super Admin GB`, `Haringey Demo Org`.
**Updated:** 2026-10-21.
**Route status cho toàn bộ ticket:** `Blocked` — chọn được own tagged source2 và mở `Create Campaign with PACO Assist` trên branch; generation trả UI `403`, chưa tạo B.
**Budget:** ceiling `12` meaningful views / `15` phút. Mainline và lần retry branch bắt đầu khoảng `10:41 UTC` đều vượt thời gian; không reset budget sau compaction. Không có counter đủ tin cậy để ghi tổng views. Đã dừng scan và đóng form/composer.

## Feature branch PAC2-7579 — entry form đã xác minh

- Tester cung cấp `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-7579`; UI chuyển tới `/paco/feature-branch/pac2-7579/dashboard`. Đây là route ứng dụng, không phải Git branch. `[Tester-provided / Observed: 2026-10-21]`
- Context đọc từ UI: `Super Admin GB` / `Haringey Demo Org`. Browser plugin hoạt động trong retry này; thông báo `CONNECTION_CLOSED` ở checkpoint cũ không còn là blocker hiện tại. `[Observed]`
- Ordered entry: branch dashboard → global patient search → `Patient actions menu` → `Quick Send` → `PACO Assist` → `Write my templates` → `Create Campaign with PACO Assist`. Menu còn có `Optimise message`; chưa dùng option này. `[Observed]`
- Composer đang ở `SMS`; `Enable Email` disabled trong patient context đã mở. Không sửa patient, contact, campaign có sẵn hoặc tài nguyên gắn sẵn. Không suy ra Email Assist/license toàn hệ thống thay đổi. `[Observed]`
- `Select Campaign`: search chính xác `QA-test-7579-source1` trả `No available options`; đã clear search, không chọn campaign vào draft. Không kết luận source bị xóa hoặc nguyên nhân do org mismatch. `[Observed]`
- Form có required `What is this campaign for?`, hướng dẫn `Minimum 10 characters. Do not include any patient names or personal information.`; `Tone` mặc định `Friendly`; `Email` và `SMS (Optimised)` checked; `Booking Link` checked, `Health Form` unchecked; `Additional Details (Optional)`; `Generate Templates` disabled khi prompt trống. Đây là trạng thái UI, chưa kiểm thử validation hoặc generate. `[Observed]`
- Đã `Cancel` form rồi `Close` composer; kiểm tra còn `0` visible dialogs. Không nhập prompt, generate, save, tạo B, recipient, send hoặc schedule. `[Observed]`
- Recheck NHS tại `11:00 UTC`: mở `/commshub/campaign-manager` chuyển tới `/commshub/login`; auth check trả `false`. Chưa read-back tag hoặc cleanup own source. Helper auth hiện chỉ export functions, không có CLI login runner cho tab plugin; không đưa credentials vào tool args hoặc đọc auth state. `[Observed: URL/UI; Inferred: cần khôi phục auth trước read-back]`
- Evidence local: `test-results/PAC2-7579-featurebranch-assist-form.yml` (chỉ form, đã đọc/review); search/menu/dialog counts từ live browser tools. Raw evidence khác chưa duyệt để chia sẻ. Full A → B và tag inheritance vẫn chưa được kiểm tra.

## Entry mainline đã xác minh trước retry branch

### Quick Send composer

1. Trên `/paco/quick-send`, dùng global patient search với query test.
2. Mở `Patient actions menu` của kết quả test → `Quick Send`; không mở patient profile.
3. Composer tự tải campaign có sẵn. Có control `PACO Assist` cạnh editor và `Save` với tooltip `Save New or Update existing campaign`.
4. Control `PACO Assist` hiện tooltip: `Premium Feature`, `AI-powered tools to create your email templates`, `Upgrade your license to unlock`. Không có form generate mở được trong context này.
5. Đóng bằng `Close`; không chọn campaign vào draft, không edit/save/send hoặc thay đổi patient/campaign có sẵn.

`[Observed: dev, Super Admin GB, Haringey Demo Org, 2026-10-21 khoảng 09:30–09:33 UTC]` Entry/control được xác minh, **không** chứng minh full campaign-base flow khả dụng. Không bypass license. Evidence local: `test-results/PAC2-7579-composer-assist-license.yml`; evaluate trả tooltip text hai lần, snapshot ghi `aria-hidden`. Không coi snapshot này là bằng chứng modal đang mở.

## Candidate và rejected paths

| Candidate | Quan sát | Kết luận giới hạn |
|---|---|---|
| `/paco/quick-send` → `Campaigns` | UI `Quick Send Campaigns` tải, không có data row; frontend `getAllCreatedCampaigns` HTTP `404` lặp qua navigation mới | Không chọn nguồn từ grid này được; không suy ra inventory thật sự rỗng hoặc feature chưa deploy |
| `/paco/quick-send/campaign` → `PACO Assist` | Panel `Describe what you need and PACO Assist will generate Email and SMS templates for you.`, prompt + `Generate Templates` | Chưa thấy bước chọn campaign nguồn. Không nhập prompt/generate/save; chưa chứng minh luồng ticket |
| Topbar `More options` → `PACO Assist` | Item có `cursor-not-allowed`; click không mở panel/navigation | Không dùng làm entry ticket; chưa xác định nguyên nhân |

`[Observed: cùng role/context, 2026-10-21 khoảng 09:09–09:22 UTC]` Evidence: `test-results/PAC2-7579-campaign-load-recheck.txt`, `test-results/PAC2-7579-assist-panel.yml`, `test-results/PAC2-7579-more-options-assist.yml`.

- `/paco-connect/dashboard`: authenticated UI render dashboard dù document HTTP `404`. Kết luận cũ “mọi route Connect thiếu” bị thay thế. `[Observed: cùng role/context, 2026-10-21 khoảng 09:13 UTC]`
- `/paco-connect/campaigns/create`: sau SPA load vẫn UI `404` / `back to home`. Chỉ rejected candidate trong context đã kiểm tra; không suy ra cần branch. Không xem lại video hoặc thử lại branch tester đã loại. `[Observed: cùng role/context, 2026-10-21 khoảng 09:15 UTC]`
- Sidebar `Comms Hub` → `Campaign Manager`: tới `nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager`, rồi `/commshub/login`; UI báo `You were signed out due to inactivity. Please sign in again.` Không khẳng định chỉ có SSO; password login đã dùng được trước đó. `[Observed: 2026-10-21 khoảng 09:12 UTC]`
- Cuối lần tiếp tục, UI chuyển sang `Primary Care 24` / `PAC2-6186 SUPER ADMIN` ngoài chuỗi chọn context đã hoàn tất của agent; nguyên nhân chưa rõ. Query `test` không có kết quả. Chưa kiểm chứng license hoặc Assist trong context này. `[Observed: 2026-10-21 khoảng 09:39–09:41 UTC]`

## Admin-account source recheck — 2026-10-21 12:21 UTC

- `[Observed]` `PAC_ADMIN_*` account login được đúng `Super Admin GB` / `Haringey Demo Org` / `test again - old location`; role unavailable trước đó chỉ quan sát trên PAC account khác. Branch dashboard authenticated. Không thay env hoặc cấp quyền.
- `[Observed]` Known route patient search → `Quick Send` → `(click to change)` → `Select Campaign`, exact `QA-test-7579-source1` + `Enter` trả `No available options`. Recheck ở hai test patient contexts: một `email not on file`, một `email on file`; source matches `0` ở cả hai. `Enable Email` disabled cả hai; nguyên nhân chưa xác định. Không chọn campaign hoặc sửa patient/shared data.
- `[Observed]` Đã clear search/close composer; `0` visible dialogs, auth `true`. Không B/generate/save/send. Evidence: `test-results/PAC2-7579-admin-picker-recheck-20261021T1221.json`. Không reset exhausted scan budget; chỉ kiểm tra lại dependency admin-account tại route đã biết.

## Blockers và safety

- Branch `pac2-7579` đã mở form Assist; license gate mainline không phải blocker cho entry SMS đã kiểm tra trên branch. Không thay quyền/license hoặc suy rộng sang context khác.
- `[Observed: 2026-10-21, source2 retry]` Tester yêu cầu tạo source khác. NHS home/viewing `Haringey Demo Org`; own source2 SMS `Quick Send`, persisted read-back `1` tag `Test tag - no codes`. PAC admin branch cùng role/org/location tìm đúng `1` match source2 và chọn được. Source1 unavailable là lịch sử riêng, chưa xác định nguyên nhân. Evidence: `test-data-ledger.md#source2-paco-handoff-và-assist--2026-10-21`, `test-results/PAC2-7579-source2-assist-20261021.json`.
- `[Observed]` Blocker mới: `Generate Templates` trả `HTTP error! status: 403` với synthetic prompt, SMS-only options và retry default options. Không có generated template/B/Save/Send; không suy ra root cause quyền/backend. `Cancel`/`Close`, xác minh `0` visible dialogs. Source2 cleanup qua Delete/Confirm; reload/expand vẫn listed với `Restore` thay `Delete` (deleted/restore state, không hard absence). Source1 retained.
- `[Observed: diagnostic 2026-10-21]` Restore/read-back source2, fresh PAC admin login rồi cùng prompt vẫn `403`. UI-triggered `POST /paco/feature-branch/pac2-7579/undefined/v1/chat/completions` trên frontend host trả HTTP `403`, không transport failure. `[Inferred]` AI base URL thiếu/sai cấu hình; chưa biết exact variable hoặc nguyên nhân reject, không kết luận quyền/license. Không rewrite endpoint/probe/bypass. Cancel/Close dialogs `0`, cleanup source2 lại deleted/restore sau reload. Evidence: `test-results/PAC2-7579-403-diagnosis-20261021.json`.
- Campaign list load HTTP `404` chỉ được quan sát trên mainline; chưa recheck grid trên branch. Chưa đủ xác định root cause backend/deployment hoặc phân loại thành defect riêng.
- Không có campaign B, recipient hoặc send; không có kết luận `Pass`/`Fail` về tag inheritance.
- Legacy manifest thiếu schema/revision hợp lệ; không tự đánh dấu downstream phase complete. Raw browser evidence chỉ local, chưa duyệt để chia sẻ.

## Next action

Khôi phục khả năng `Generate Templates` trên branch sau UI `403`; không scan lại route hoặc tạo thêm source khi dependency chưa đổi. Khi tiếp tục: recheck auth/gate, reconcile own source2 hiện deleted/restore state trước khi restore có ledger; chạy A → Assist → B, kiểm tra tag trước Save New và sau reopen, không Send. Cleanup own source/copy, báo source1 retained và deleted source2 record; không claim hard absence.

Ghi chú tester phía dưới giữ nguyên lịch sử; nhận định cần branch trong ghi chú chưa được xác minh và không dùng làm quyết định hiện tại.

## Tester notes

[Protected area - survey done trên dev chung `blinx.dev.blinxpaco-np.com`. Kết luận: PACO Assist campaign create route 404. Decision: báo BLOCKED và yêu cầu tester cung cấp đúng environment/branch.]
