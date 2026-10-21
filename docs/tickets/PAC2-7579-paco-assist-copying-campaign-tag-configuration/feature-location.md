# Feature Location: PAC2-7579 — PACO Assist Copying Campaign Tag Configuration

**Scope:** `dev`, `blinx.dev.blinxpaco-np.com`; Comms Hub dev trong allowlist.
**Role/context đã quan sát:** `Super Admin GB`, `Haringey Demo Org`.
**Updated:** 2026-10-21.
**Route status cho toàn bộ ticket:** `Blocked` — chưa hoàn tất Quick Send A → `PACO Assist` → campaign B.
**Budget:** ceiling `12` meaningful views / `15` phút; lần tiếp tục đã vượt thời gian. Không có counter đủ tin cậy để ghi tổng views; dừng, không tiếp tục scan.

## Entry đã xác minh

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

## Blockers và safety

- `PACO Assist` trong composer chặn tại thông báo license của context đã kiểm tra. Chưa biết context được cấp license phù hợp; không sửa quyền/license để vượt gate.
- Campaign list load HTTP `404` là blocker quan sát được, chưa đủ xác định root cause backend/deployment hoặc phân loại thành defect riêng.
- Comms Hub session hết hạn; chưa read-back tag sau save hoặc cleanup own source `QA-test-7579-source1`. Last observed source có trong list; xem `test-data-ledger.md`.
- Không có campaign B, recipient hoặc send; không có kết luận `Pass`/`Fail` về tag inheritance.
- Legacy manifest thiếu schema/revision hợp lệ; không tự đánh dấu downstream phase complete. Raw browser evidence chỉ local, chưa duyệt để chia sẻ.

## Next action

Khi session/license dependency thay đổi: xác minh role/org từ UI → mở composer theo entry trên → kiểm tra Assist gate → đọc lại tag của own source trong Comms Hub → chỉ chạy A → B trên owned `QA-test` data nếu gate cho phép. Kiểm tra tag trước save và sau reopen, không send; cleanup source/copy và ghi leftovers nếu không xóa được. Không lặp rejected routes với dependency không đổi.

Ghi chú tester phía dưới giữ nguyên lịch sử; nhận định cần branch trong ghi chú chưa được xác minh và không dùng làm quyết định hiện tại.

## Tester notes

[Protected area - survey done trên dev chung `blinx.dev.blinxpaco-np.com`. Kết luận: PACO Assist campaign create route 404. Decision: báo BLOCKED và yêu cầu tester cung cấp đúng environment/branch.]
