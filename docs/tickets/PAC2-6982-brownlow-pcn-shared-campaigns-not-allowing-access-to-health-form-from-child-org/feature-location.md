# Feature Location: PAC2-6982

**Input Revision:** 1
**Environment:** `dev` — `https://blinx.dev.blinxpaco-np.com`
**Role:** `Admin` — QA xác nhận trong hội thoại 2026-10-01; chưa độc lập xác minh tên role trên UI.
**Mode:** `locate`, read-only
**Observed at:** 2026-10-01T12:49:00Z–2026-10-01T12:52:00Z
**Route Status:** Blocked (toàn bộ shared campaign/patient flow); route `Health Forms` đã xác minh.

## Source and reusable hints

- Requirements revision 1: `requirements.md`, REQ-PAC2-6982-001/002.
- `docs/product/feature-map.md` chưa có matching entry.
- `docs/product/survey/views/comms-campaign-manager.md` và `docs/product/workflows/comms-hub.md` gợi ý `Comms Hub` → `Campaign Manager`; workflow cũ trỏ external host `nhs-comms-hub-dev.blinxhealthcare.com`, không nằm trong configured host scope hiện tại. Không điều hướng external host, không coi survey là expected-result source.

## Authentication and context

`Observed`: browser hiện tại có authenticated shell tại `/paco/dashboard`, navigation `Comms Hub`, `Health Forms`, `Patients`, `Configuration`, `Sign Out` và patient search. QA đã login thủ công. Không đọc/lưu auth state, cookie, token hoặc headers. Organisation context đang có nhưng không ghi giá trị; chưa được QA xác nhận PCN/child hierarchy hoặc safe test data.

## Ordered entry paths

### Candidate 1 — Health Form ownership/sharing grid

**Status:** Confirmed route, không phải xác nhận business behavior.

1. Mở `/paco/dashboard` với authenticated session.
2. `Expand sidebar`.
3. `Health Forms`.
4. `Designer`.
5. Browser mở `/health-forms/builder/`, title `Health Forms`.

`Observed`: grid có `Health Form Name`, `Created By Organisation`, `Shared To Organisation(s)`, `Archived`, `Editable`, `Actions`. Đây là nơi có thể xem ownership/sharing khi QA cung cấp form cụ thể. Không mở row, sửa form, dùng `Actions` hoặc thay organisation context.

### Candidate 2 — Campaign Manager entry

**Status:** Candidate, root chưa mở.

1. Dashboard → `Expand sidebar` → `Comms Hub`.
2. Submenu hiển thị `Template Manager`, `Campaign Manager`, `Patient Manager`.
3. `Campaign Manager` là button, không có DOM `href`. Không click vì reusable hint trỏ external host ngoài configured scope; chưa biết destination hiện tại.

### Candidate 3 — Patient scheduler link

**Status:** Blocked.

Chưa có campaign/link, PCN/child test hierarchy, test patient hoặc phương thức patient authentication. Không dựng URL/token, không probe API và không gửi campaign để lấy link.

## Budget

- Meaningful views: 5/12 — authenticated dashboard, expanded sidebar, `Comms Hub` submenu, `Health Forms` submenu, Designer root.
- Elapsed: khoảng 3/15 phút.
- Một stale-ref retry không tính view mới.
- Dừng vì context/host boundary, không phải hết budget.

## Evidence and provenance

- Live Playwright MCP dashboard snapshot 2026-10-01T12:49–12:50Z: authenticated shell và navigation.
- Live scoped submenu snapshot 2026-10-01T12:50Z: ba navigation buttons của `Comms Hub`.
- Live Playwright MCP Designer snapshot/DOM observation 2026-10-01T12:51–12:52Z: `/health-forms/builder/`, title và structural grid headers ở trên.
- Raw tool snapshots local tại `.playwright-mcp/`; không coi là curated evidence, không đưa raw grid/organisation/person values vào docs. Không chụp screenshot vì chưa xác minh redaction dữ liệu nền.
- Chưa có durable screenshot cho full route. Không dùng artifact này làm automation gate cho shared campaign/patient flow.

## Rejected paths and unperformed actions

- External Comms Hub route từ reusable hint: không đi vì host ngoài scope; dependency config/requirements revision 1. Chỉ xem lại khi configured host scope thay đổi hoặc destination same-host được QA xác nhận.
- Không `Create`, `Update`, `Delete`, `Submit`, `Send`, upload hoặc thay context.
- Mutation: `None`; cleanup: không áp dụng.

## Blockers and exact next action

1. QA xác nhận current `Campaign Manager` có chạy trên configured Paco host hay cần external dev host. Nếu external, cần sửa configured scope hợp lệ trước khi điều hướng.
2. QA cung cấp PCN organisation/child practice và safe synthetic/owned form, campaign, patient; hoặc xác nhận chưa có để thiết kế setup cases ở phase test-design sau khi location đủ.
3. Shared campaign root và patient scheduler route chưa verified; chưa được kết luận `Pass`/`Fail` hoặc generate business assertion.

## Resume observation — 2026-10-01T13:22Z

- QA đã cho phép configured external dev host; `paco.config.yaml` hiện có `nhs-comms-hub-dev.blinxhealthcare.com`. Host blocker ở các đoạn lịch sử trên đã được giải quyết.
- Chỉ dùng `playwright-user`; không dùng browser `playwright-admin` đang được sử dụng riêng.
- Ordered entry đã verified: authenticated Paco dashboard → `Comms Hub` → `Campaign Manager` → external Comms Hub login; QA manual login → Comms Hub home → `Campaign Manager` → `/commshub/campaign-manager`.
- `Observed`: Campaign Manager có `Create Campaign`, `Campaign Outbox`, `Search campaigns`, `Clear Filters`, nhóm `Shared Campaigns` và ownership/sharing columns. Root đã verified, không xác nhận full patient flow.
- QA cung cấp candidate name qua screenshot; chưa biết đó là campaign hay organisation. Search campaign bằng full name `test-7201-Redmoor Liverpool-fiona-nguyen`, rồi `test-7201` chưa cho thấy matching campaign row. Không kết luận record không tồn tại.
- Scoped `Viewing data for` chỉ hiện hai organisation options, không có candidate QA cung cấp. Mở và đóng selector, không thay selection hoặc `Apply`. Hai options không tự chứng minh quan hệ PCN–child.
- `Clear Filters` và thao tác expand group chỉ thay view; không sửa campaign. Ownership/sharing ô group trống không phải evidence thiếu ownership ở campaign thật.
- Tổng locate budget đạt ceiling 12 meaningful views sau các lượt resume (prior checkpoint 5; Comms Hub home/root, search, reset/group/context states). Dừng scan, không tự mở rộng budget.
- QA chấp thuận tạo campaign test riêng, dùng existing form sau khi xác minh PCN–child; chưa tạo campaign. Quyền mutation không dùng trong `locate`/`observe`.
- Remaining blocker: cần current account/context truy cập candidate QA cung cấp và xác minh parent–child + existing form ownership/sharing. Patient scheduler link/recipient chưa xác minh. Next action: QA chỉ rõ candidate là organisation hay campaign và chọn organisation context tương ứng thủ công nếu account hiện tại không có.
- Provenance: live scoped Playwright user DOM/snapshots 2026-10-01T13:18–13:22Z; không lưu patient, token hoặc credentials. Mutation `None`.

## Hierarchy confirmation — 2026-10-01T13:33Z

- QA screenshot và live `Viewing data for` tree xác nhận: `General Practice (Demo Site) (YGMQJ)` → `Redmoor Liverpool (Non-OBE) (M85065)` → child practices `3ST (M85055)` và `Primary Care 24 (Y05825)`.
- `Campaign Manager` route và PCN-child context đủ cho location. Health Forms route đã verified riêng.
- Approved setup: tạo campaign test riêng ở parent `Redmoor Liverpool`, dùng existing active form của child sau khi ownership/no-`Shared To` được xác minh; không sửa campaign nền.
- Route status: `Confirmed` cho campaign/form setup surfaces. Patient scheduler route còn là execution dependency, không còn là location blocker.

## Tester notes
