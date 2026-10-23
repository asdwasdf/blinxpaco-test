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

## Autonomous Role Groups locate — 2026-10-22

`Observed: dev, Blinx Deployment` trước navigation; run `auto-20261022-0500`, provenance `product-explore/auto-20261022-0500/ledger.md#9–10`.

- Historical route hint `/paco/configuration/staff/role-groups` chuyển tới `Login`, sau helper một lần tới context picker. Chưa thấy Role Groups root hoặc xác minh role tại destination.
- Context recovery từng chọn được Organisation và Location đã dùng trước; Role còn trống, chưa hoàn tất `Next`. Script đà dừng và document được reload để hủy evaluation; cuối run picker trở về Organisation trống.
- Resume: đối chiếu picker, hoàn tất đúng context và xác minh exact role trước khi kiểm route; không submit credential lại khi picker vẫn mở. Không sửa existing/shared roles hoặc permission; chưa có basis kết luận thiếu quyền, credential sai hoặc lỗi Role Groups.

### Mutation coverage (locate attempt)

| Nhánh/candidate | Thực hiện | End state hoặc lý do |
|---|---|---|
| Historical route tới Role Groups root | `Skipped` | Auth/context boundary; root chưa render |

0/1 bounded navigation candidate; supported business actions chưa map. Validation, business state transitions và persistence `Not Run`; không business mutation hoặc two-sided relationship. Cleanup `N/A` cho business records, không tạo record/leftover; context selection chưa hoàn tất, không tính feature coverage.

## Autonomous Role Groups breadth — 2026-10-22

`Observed: dev, Blinx Deployment verified trước navigation`; current root reached trong run `auto-20261022-0714`, provenance `product-explore/auto-20261022-0714/ledger.md#6–7`. Role tại Role Groups root chưa independently checked; exact label xuất hiện ở hai Web Chat child roots nhưng chưa independently established là active-role header. Reports và final Dashboard header hiển thị `Config Admin`; whole-page label không đủ chứng minh active role (ledger #8–12).

- Root `/paco/configuration/staff/role-groups` render heading Role Groups, Search Role Groups input, page controls, Add New/Edit buttons. Grid fields Role, Role Group, RBAC Role, RBAC Activities, Activity Status. Footer Save disabled. Không đọc role names hoặc permissions vào docs.
- Search với synthetic no-match giữ input, không có role rows, không empty message visible. Clear restore list (page controls trở lại). Save vẫn disabled.
- Pagination Page 2 active, content đổi; Page 1 restore active marker về 1, content khác Page 2 trong memory comparison, Search blank, Save disabled. Không kết luận timing cause.
- Read-only baseline; không Add New draft, không Edit existing, không Save shared config, không chọn RBAC Activities/Status. Không tạo/sửa/xóa role record hoặc staff assignment.

### Mutation coverage

| Nhánh/candidate | Thực hiện | End state hoặc lý do |
|---|---|---|
| Root access | `Performed` | Heading/controls/fields observed; Save disabled |
| Search synthetic no-match/clear | `Performed` | No rows/no empty message; clear restore list |
| Pagination Page 2/Page 1 restore | `Performed` | Active marker/content change; Search blank |
| Add New draft/Cancel | `Skipped` | Shared config; write footprint chưa rõ |
| Saved create role/readback | `Skipped` | Shared config; no isolated owned target |
| Edit role/Save or Cancel | `Skipped` | Shared config; no existing row change |
| Group/RBAC/Status changes | `Skipped` | Domain rules/permission mapping chưa biết |
| Staff assignment downstream | `Skipped` | Receiver relationship chưa verified |

3/8 bounded branches Partial (read-only). Validation `Not tried` — không invalid input submit. State transitions `Not Run` — không Edit/Add. Persistence `No` — không Save. Two-sided relationships `None` — không staff receiver verification. Cleanup `Done` (read-only baseline) — không role records/drafts/dialogs; shared Save chưa bấm. Business CRUD main flow `Not verified`.

## Resume role availability — 2026-10-22

`Observed: dev, intended Blinx Deployment chưa hoàn tất`; provenance `product-explore/resume-preflight-20261022-0946/ledger.md#1–2`.

- Shared `.env` helper tới context picker, không chứng minh auth hoàn tất chỉ vì trả `done`.
- Với Organisation `Haringey Demo Org` và Location `test again - old location`, actual Role listbox chỉ offered `Super Admin GB`; intended `Blinx Deployment` không có trong state đã kiểm, `Next` disabled khi Role trống.
- Không tự chọn role thay thế, replay credentials hoặc kết luận entitlement cause; phải giữ checkpoint riêng nếu tester chốt role khác.

### Mutation coverage

Preflight không mở business workflow; 0 business branch end states, validation/persistence/relationships `Not Run`, business cleanup `N/A`, không leftovers. Intended-role boundary ở trên giữ provenance riêng, không đổi historical coverage.

### Tester-approved alternate role

- `[Observed: dev, Super Admin GB, 2026-10-22]` Tester chọn `Dùng Super Admin GB`; hoàn tất exact offered role trên picker hiện tại, không credential replay. Dashboard header độc lập chứa exact `Super Admin GB`; checkpoint mới `roles.Super Admin GB`, run `auto-20261022-1001`. Source: `product-explore/resume-preflight-20261022-0946/ledger.md#3–4`.
- OQ-063 vẫn Open về nguyên nhân thiếu role cũ và historical header/context; không còn chờ role choice. Role approval không mở bốn pending mutation decisions hoặc chuyển coverage từ `Blinx Deployment`.

## Super Admin GB Role Groups breadth — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#2`.

- Known route `/paco/configuration/staff/role-groups` render heading `Role Groups`; actual active-role header independently verified tại root và sau reload.
- Search placeholder `Search Role Groups...`. Synthetic no-match giữ query, không row inputs/paging; clear phục hồi list. Footer `Save` vẫn disabled.
- `Page 2` rồi `Page 1` có `aria-current` marker; fresh reload giữ Page 1/search blank, không dialog. Chưa chứng minh dataset đổi hoặc pagination data accuracy bằng input-value comparison.
- Không Add/Edit, chọn RBAC hoặc shared Save; `DEC-shared-list-save` giữ pending. Không staff assignment receiver hoặc saved role source.

### Mutation coverage

| Nhánh | Thực hiện | End state hoặc lý do |
|---|---|---|
| Current-role root | `Performed` | Heading/actions và header verified |
| Synthetic no-match / clear | `Performed` | Không row inputs/paging rồi list trở lại |
| Paging marker / baseline restore | `Performed` | Page 2 rồi Page 1 active; reload baseline |
| Add New draft/Cancel | `Skipped` | Existing shared-write decision pending |
| Saved create/readback | `Skipped` | Existing shared-write decision pending |
| Edit/Save hoặc Cancel | `Skipped` | Không owned saved target |
| Group/RBAC/Status | `Skipped` | Shared-write decision và domain mapping |
| Staff assignment receiver | `Skipped` | Không owned source/receiver |

3/8 bounded branches, `Partial (read-only)`. Validation và saved transitions/persistence `Not Run`; UI reload baseline verified, cleanup `Done`, không record/draft/leftover. Historical role coverage giữ riêng. Locator timeout không chứng minh product failure; phải đọc settled UI trước khi retry.

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

