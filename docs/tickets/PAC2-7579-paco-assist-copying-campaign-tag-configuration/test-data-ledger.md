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

## Tester notes

