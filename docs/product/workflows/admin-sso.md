# Workflow: Admin, SSO và Role context

- Classification: `[Observed: dev, nhiều role, 2026-10-02]` — logic bên dưới giữ tag riêng từng bullet
- Aliases: `User Management`, `SSO`, `Add User`, `role selection`, `Organisation hierarchy`
- Coverage: `Minimal`
- Confidence: `Low`

File tạo ngày 2026-10-02 để gom logic từ ticket (PAC2-191, role context từ nhiều ticket). Chưa có route verified (xem `feature-map.md`).

## Business context observed

- Role đã dùng: `Super Admin GB`, `GP Paco Assist`, `Super User`, `Blinx Deployment`. Top-bar `PaComms` disabled với ba role đầu. `[Observed]` — PAC2-6540/status.md, exploration.md
- `Super Admin GB` truy cập được Comms Hub (app ngoài, auth riêng, redirect login nếu chưa auth). `[Observed]` — PAC2-6540/status.md
- Organisation selector chỉ hiện org trong entitlement; thiếu org gốc ticket gây `Blocked`. `[Observed]` — PAC2-6540/exploration.md
- Quyền kế thừa theo hierarchy organisation (parent → child) hiển thị qua `Viewing data for`. `[Observed]` — PAC2-6982/exploration.md
- Role selection/status dialog có thể chen vào navigation (redirect qua role selection trước route feature). `[Observed]` — PAC2-7137/exploration.md
- Role `Blinx Deployment` có quyền tương đương admin theo tester. `[Observed]` — PAC2-7669/requirements.md

## Logic từ ticket

### SSO không tự tạo user khi thiếu organisation assignment (PAC2-191)

**Luồng**
1. Identity SSO chưa có PACO user/organisation assignment cố gắng login. `[Inferred from: title và comment ticket, needs confirmation]` — PAC2-191/requirements.md (REQ-001)
2. Hệ thống không tự tạo PACO user dùng được; user thấy lỗi login rõ ràng và có đường quay lại `login`. `[Inferred from: REQ-001/002, needs confirmation]` — PAC2-191/requirements.md
3. User hợp lệ (có organisation assignment) vẫn login thành công vào landing được phép. `[Inferred from: REQ-003, needs confirmation]` — PAC2-191/requirements.md

**Business rules**
- Ticket không có `Description`/AC; ý định suy ra từ title và comment. `[Confirmed]` — PAC2-191/requirements.md
- Biến thể lỗi lịch sử: `No Organisation Found`, `Unable to Log In`, trang trắng, Cognito `redirect_mismatch`; expected cụ thể `Disputed`. `[Inferred from: video/lịch sử, needs confirmation]` — PAC2-191/requirements.md (REQ-002)
- Cần tách kiểm tra SSO và username/password. `[Inferred from: REQ-003, needs confirmation]` — PAC2-191/requirements.md
- Video lịch sử: tạo user thủ công xuất hiện trong `User Management`; `Add User` + gán organisation; feature env gặp `redirect_mismatch` và lỗi standard login (có thể là blocker cấu hình). `[Observed]` — PAC2-191/requirements.md

**Trạng thái**
- User: chưa tồn tại / tồn tại thiếu organisation / có organisation assignment (phân biệt negative case chưa rõ). `[Open Question]` — PAC2-191/requirements.md

**Role/permission**
- `Super Admin GB` phù hợp kiểm tra `User Management` nhưng không đại diện SSO user chưa gán organisation. `[Observed]` — PAC2-191/requirements.md

**Defect đã biết**
- PAC2-191 · Blocked · LOCATE pending, chưa EXPLORE/test; host feature chưa trong allowlist (read-only); không có Pass/Fail. `[Observed]` — PAC2-191/status.md

**Open questions**
- Negative case là account chưa tồn tại hay thiếu organisation; message/route cuối; SSO identity an toàn và cách reset; nguồn chứng minh "không auto-created"; `redirect_mismatch` là blocker hay ticket failure. `[Open Question]` — PAC2-191/requirements.md

### Role/permission cho flow Comms Hub

**Open questions**
- Role/permission cụ thể của "practice user" cho Outbox/Shared Campaign (ticket không nêu). `[Open Question]` — PAC2-6540/requirements.md, PAC2-7201/requirements.md

### Môi trường dev và ràng buộc test (ghi chú chung)

- Dev có nhiều host con (baseline PACO OS, Connect, GP Supergrid, Comms Hub, scheduler), mỗi host session riêng. `[Observed]` — PAC2-1805/status.md, PAC2-4700/exploration.md
- Test data an toàn: record tự tạo prefix `QA-AUTO`; không dùng patient thật; cleanup bằng delete hoặc archive; case cần booking bị `Blocked` khi chưa có synthetic patient được duyệt. `[Observed]` — PAC2-7786/automation.md, PAC2-8241/automation.md, PAC2-8552/status.md
- `AUTOMATION_EXECUTE` bị chặn khi local login browser không chạy (7669, 8241, 3798); là setup blocker, không phải product `Fail`. `[Observed]` — PAC2-7669/report.md, PAC2-8241/status.md, PAC2-3798/automation.md

## Tester notes

