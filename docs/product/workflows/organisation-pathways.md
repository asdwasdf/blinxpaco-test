# Workflow: Organisation Pathways Config

- Classification: `[Observed: dev, Blinx Deployment, 2026-10-21]`
- Aliases: `Pathways Config`, `Assign Pathways`
- Coverage: `Partial (read-only)` — feature `Blocked`, không vào được root sử dụng.
- Confidence: `High` cho route/error hiện tại; purpose chưa verified.
- Last verified: `2026-10-21`
- Provenance: `product-explore/auto-20261021-1359/ledger.md#8`.

## Business context observed

- `[Observed]` `Pathways Config` là mục trong `Configuration` → `Organisation`; `Skills` có field `Assign Pathways`.
- `[Unverified hypothesis]` Màn quản lý entity tiêu thụ bởi `Assign Pathways`; chưa tạo entity hoặc thấy effect hai phía.
- `[Observed]` Role hiện tại `Blinx Deployment`; không kiểm tra role khác.

## Entry

1. `[Observed]` `/paco/dashboard` → `Configuration` → `Organisation` → `Pathways Config`.
2. `[Observed]` Route `/paco/configuration/organisation/pathways`; landmark thực tế `Page Not Found`.

## Read-only flow

1. `[Observed]` Click visible menu mở route trên; UI ghi `Page Not Found`, `Sorry, the page you are looking for does not exist.`, `Go to Home`.
2. `[Observed]` Re-enter qua `Skills` control vẫn lỗi. Reload chờ heading và fresh tab cùng browser context cũng lỗi.
3. `[Observed]` Control `/paco/configuration/organisation/skills` render được; không kết luận lỗi toàn Configuration.

## Decision points

- `[Observed]` Không vào được feature root nên chưa map được forms, entity/status hoặc mutation actions.
- `[Open Question]` Menu sai route, deployment thiếu hay điều kiện role/context? Chưa có basis xác định.

## End and exceptional states

- `[Observed]` Error UI tái hiện từ menu, reload, fresh tab.
- `[Observed]` Network sample chỉ có static audio GET 404 không liên quan; không dùng làm HTTP status của target hoặc nguyên nhân backend.
- `[Observed]` Không mutation hoặc owned record tạo trên target.

## Safety boundary

- Chỉ navigate/read; không sửa route internals hoặc probe private APIs.
- Không fallback sửa pre-existing pathway để vượt blocker.

## Required test data

- `[Open Question]` Cần UI creatable owned pathway để thử Skills relationship. Chưa biết fields bắt buộc.

## Interactive flow (owned test data)

- `Not Run`: root `Blocked`; chưa tạo prerequisite.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| Feature root | Visible menu | `Page Not Found` | Không có form để thử | `Observed` |

## Cross-feature relationships

- `[Inferred]` `Skills` → `Pathways Config` vì field `Assign Pathways`; chưa đủ evidence effect phía target, không ghi thành relationship Observed.

## Anomalies and unverified behavior

- `[Observed / Possible defect]` Visible menu đưa tới `Page Not Found`, tái hiện sau reload và fresh tab; root cause chưa biết, không gán product `Fail` hoặc intent `Confirmed`.
- `[Open Question]` Route triển khai đúng và role/context cần thiết: `OQ-049`.

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Visible menu → usable Pathways root | Skipped | `Blocked`: route chỉ render error | Chưa có form | Menu → error, không tới feature root | N/A, read-only | N/A |

- Nhánh có end state feature / nhánh tìm thấy: **0/1**; error state đã quan sát nhưng không thay thế coverage workflow.
- CREATE/UPDATE/DELETE/SEND/UPLOAD/DOWNLOAD chưa map được, không đánh dấu `Not supported`.

## Execution guidance

- Mở menu, chờ heading error hoặc feature root; dùng Skills làm control.
- Blocker đổi mới retry, không lặp error-state exploration.
- Không mutation, cleanup N/A.

## Automation guidance

- Stable landmark hiện tại: heading `Page Not Found`.
- Chờ heading sau reload; immediate `isVisible` trong loading không chứng minh đã fix.
- Chưa đủ basis sinh business assertions hoặc automation CRUD.

## Provenance and gaps

- Environment: `dev`, `blinx.dev.blinxpaco-np.com`.
- Role: `Blinx Deployment`.
- Observed at: `2026-10-21`.
- Raw evidence: `test-results/product-explore/auto-20261021-1359/ledger.md#8`.
- Open questions: `OQ-049`.
- Exact resume: chỉ retry Pathways khi blocker đổi; tiếp tục feature khác trong autonomous frontier.

## Tester notes
