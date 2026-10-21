# Status - PAC2-7579

**Ticket:** PAC2-7579 — PACO Assist Copying Campaign Tag Configuration
**Current Phase:** `LOCATE` — `Blocked`
**Updated:** 2026-10-21
**Environment:** `dev`, `blinx.dev.blinxpaco-np.com`

## Summary

| Phase | Status | Ghi chú |
|---|---|---|
| `ANALYZE` | Hoàn thành theo checkpoint cũ | Expected lấy từ `ticket.md` Description; không xem lại video trong lần tiếp tục |
| `LOCATE` | `Blocked` | Tìm thấy entry `PACO Assist` trong `Quick Send` composer, nhưng bị chặn license; chưa xác minh đầy đủ luồng A → Assist → B |
| `EXPLORE` | `stale` | Không chấp nhận flag `complete` cũ làm bằng chứng tag inheritance |
| `TEST_DESIGN` / `AUTOMATE` / `AUTOMATION_EXECUTE` | Chưa chạy | Chưa có route/precondition khả dụng cho luồng tạo B |
| `REPORT` / `COMPLETE` | Chưa chạy | Không chuyển phase chỉ để đóng blocker |

## Expected và kết quả

- `[Confirmed: ticket.md#description]` Khi dùng Quick Send A có Comms Hub tag làm base và tạo campaign B bằng `PACO Assist`, B không được tự kế thừa Comms Hub tag của A. Không suy rộng sang mọi loại tag hoặc xóa tag trên A.
- Kết quả kiểm tra: `Blocked`. Chưa tạo B, chưa kiểm tra tag của B trước/sau lưu, không có kết luận `Pass`/`Fail` cho bug.
- Không có manual case inventory, standalone spec hoặc CLI execution trong lần tiếp tục này. Không gọi lỗi setup/license là product `Fail`.

## Quan sát mới

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
- Cuối checkpoint, `playwright-plugin` và `playwright-user` báo `CONNECTION_CLOSED`. Chưa có browser recheck hoặc xác nhận auth/license mới; đây là lỗi kết nối, không phải thiếu cấu hình/access.
- Đã sync quan sát giới hạn vào `docs/product/feature-map.md`, `workflows/comms-hub.md`, `open-questions.md` (OQ-046), `change-log.md`. Không tạo `exploration.md` hoặc đánh dấu `EXPLORE` complete khi full flow còn blocked.
- `rtk proxy bash validate-docs-structure.sh` exit `1`: `FAIL: PAC2-7398 reached EXPLORE/REPORT but is missing from docs/product/feature-map.md`. Không sửa ticket khác để làm validator pass.
- Targeted `git diff --check` pass; kiểm tra source checksum và protected notes của `feature-location.md` / `workflows/comms-hub.md` pass. Manifest ghi checksum hiện tại của 8 artifacts, không coi chúng là baseline lịch sử hoặc schema migration.

## Next Steps

1. Khôi phục kết nối browser server. Khi có session và license hợp lệ trên dev, xác minh role/org từ UI; mở `Quick Send` composer qua patient test và đọc lại tooltip/control. Không lặp rejected routes nếu dependency không đổi.
2. Đăng nhập lại Comms Hub qua manual auth đã cấu hình; tìm đúng `QA-test-7579-source1`, xác minh persisted tag. Nếu source không còn, không tự lặp create khi state chưa rõ.
3. Chỉ khi `PACO Assist` khả dụng mới chuyển sang own `QA-test` data, chạy luồng A → B, kiểm tra tag trước lưu và sau reopen; không send. Cleanup source/copy qua UI và ghi kết quả; nếu vẫn blocked, giữ leftover rõ ràng.
4. Reconcile legacy manifest bằng migration được duyệt trước CLI workflow. Chưa chuyển `TEST_DESIGN`, `REPORT` hoặc `COMPLETE`.

## Tester notes
