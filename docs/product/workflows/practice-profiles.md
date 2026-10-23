# Workflow: Practice Profiles

- Classification: `Observed: dev, Blinx Deployment, 2026-10-21`
- Aliases: `Practice Profiles`
- Coverage: `Partial (read-only)`, `Blocked` — 0/1 nhánh truy cập feature root
- Confidence: `Low` cho business workflow; lỗi điều hướng đã tái hiện

## Business context observed

- Mục đích: `Unverified hypothesis` — cấu hình profile cấp practice; chưa vào được feature root để xác lập.
- Actor/role: `Blinx Deployment`.
- Prerequisite quan sát được: session đã xác thực, menu `Configuration` và `Organisation` hiển thị.
- Entity, ownership, status và consumer: chưa biết; không suy từ tên menu hoặc `Staff Profiles`.

## Entry

1. Mở `Configuration` từ sidebar, mở submenu `Organisation`, chọn `Practice Profiles`.
2. Route quan sát được: `/paco/configuration/organisation/practice-profiles`.
3. UI hiện heading `Page Not Found`, text `Sorry, the page you are looking for does not exist.`, button `Go to Home`; không phải feature root.

Nguồn: `product-explore/auto-20261021-1626/ledger.md#13`, `resume-observations.json#practice_profiles`.

## Read-only flow

1. Chọn visible menu `Practice Profiles`; quan sát route và error state trên.
2. Reload cùng route; heading `Page Not Found` vẫn xuất hiện.
3. Mở tab mới trong **cùng browser context**, vào cùng route; lỗi tái hiện. Đóng tab sau check; không tạo session/context xác thực mới.
4. Control: mở `/paco/configuration/organisation/skills`; heading `Skills` hiển thị trong cùng context.

Nguồn: ledger `#13`, local `practice-profiles-route-check.js` và `resume-observations.json#practice_profiles`. Không gọi hoặc replay API.

## Decision points

Chưa map được decision branch của feature do root access bị chặn. Reload/fresh tab/control là diagnostic retries, không nhánh CRUD hoàn tất.

## End and exceptional states

- Error end state: `Page Not Found` tái hiện qua menu, reload và fresh tab.
- Chưa xác lập empty/loading/success state của feature hoặc permission rule.
- Không suy HTTP status, backend availability hay root cause từ client error page. Control hoạt động chỉ giới hạn lỗi trong context quan sát được.

## Safety boundary

- Chỉ navigation/reload/read-only control; mutation `0`, draft mới `0`, data mới `0`.
- Không sửa shared organisation settings, không dùng route `Staff Profiles` thay thế.
- Khi root hoạt động trở lại, phải map action, ownership và cleanup trước owned CRUD. Hard limits vẫn áp dụng; thiếu interactive controls không thay thế authorization.

## Required test data

- Lần kiểm này không cần hoặc tạo dữ liệu.
- Entity model, required fields và prerequisite data chưa biết. Không tự giả định schema hoặc CRUD được hỗ trợ.

## Interactive flow (owned test data)

`Not Run`: root access bị chặn; không tạo draft hoặc persisted record.

## Validation behavior

`Not Run`: chưa có form để kiểm client/server validation.

## State and persistence

Chỉ error state tái hiện; không có entity state transition hay persistence được kiểm. Reload error page không chứng minh data persistence.

## Cross-feature relationships

Chưa quan sát relationship. `Staff Profiles` là feature khác; organisation/location consumer chỉ là hypothesis, không observed edge.

## Anomalies and unverified behavior

- `Observed`: visible menu dẫn tới `Page Not Found`, reload/fresh tab tái hiện, `Skills` control hoạt động.
- `Open Question` — `OQ-057`: route triển khai, role/deployment prerequisite và nguyên nhân lỗi chưa biết.
- Không suy cùng root cause với `Pathways Config`; không có trusted expected basis để kết luận product `Fail`.
- Dừng retry cùng blocker; chỉ reverify khi route/role/deployment context đổi hoặc tester cung cấp thông tin mới.

## Mutation coverage

| Workflow branch | Status | Reason if skipped | Validation tried | Transitions observed | Persistence verified | Cleanup |
|---|---|---|---|---|---|---|
| Truy cập feature root | Skipped | Menu, reload và fresh tab đều `Page Not Found`; chưa vào được root | `Not Run`: chưa có form | Menu tới error page; `Skills` control hoạt động | `Not Run`: không có entity mutation | N/A: không data/draft mới |

- Branches exercised / found: **0/1**; không tạo hàng CRUD giả khi chưa thấy feature root.
- Coverage dimensions: `navigation: partial`, `main_workflow: none`, `branches_states: none`, `mutation: none`, `validation: none`, `persistence: none`, `relationships: none`, `errors_edge: done`.
- `errors_edge: done` chỉ cho root-error diagnostic này, không toàn bộ lỗi của feature.

## Execution guidance

- Chỉ reverify root khi blocker context đổi; không lặp chỉ vì `resume`.
- Khi root hoạt động, map form/actions/scope dữ liệu trước; chỉ owned `QA-test` data trên configured dev host mới được mutation theo policy.
- Không có persisted data hoặc cleanup action cần replay từ probe này.

## Automation guidance

- Diagnostic script local chỉ kiểm heading error sau reload/fresh tab và heading control.
- Không dùng `Page Not Found` làm business expected result; không có requirement cho CRUD hoặc assertion về HTTP status.
- Không gọi script là standalone product test hoặc coverage đầy đủ.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`); role `Blinx Deployment`.
- Ngày quan sát: `2026-10-21`. Ledger `#13` không có timestamp riêng cho route check; không lấy timestamp docs checkpoint làm timestamp browser navigation.
- Evidence: `product-explore/auto-20261021-1626/ledger.md#12–14`, local `practice-profiles-route-check.js`, `resume-observations.json#practice_profiles`.
- Checkpoint: root `Blocked`, no mutation/data/draft; `OQ-057` còn mở. Ticket/discovery checkpoint không đổi.

## Tester notes
