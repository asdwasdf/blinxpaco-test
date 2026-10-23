# Workflow: Rocket Bar

- Classification: `[Observed: dev, Super Admin GB, 2026-10-22]`
- Aliases: `Rocket Bar`, `Rocketbar`, desktop launcher
- Coverage: `Partial (read-only)`; main client workflow `Blocked`.
- Confidence: High cho menu boundary; client/installation chưa kiểm.

## Business context và entry

- Sidebar `Rocket Bar` mở launcher menu trên current page, không điều hướng route riêng trong observed context.
- Source `/paco-connect/user-training-portal`, actual header `Super Admin GB`.
- Enabled controls `Launch Rocket Bar` và `Download Rocket Bar`; không DOM href/title cung cấp target.
- OQ-026 historical đã phân biệt desktop launcher với global patient search; current menu không thêm patient-search equivalence.

## Read-only flow

1. Click sidebar icon: launcher menu mở, source page giữ nguyên.
2. Inspect visible controls, không execute launch/download.
3. Click cùng icon: cả hai menu buttons biến mất; source route giữ nguyên.

## Safety boundary và required test data

- Không owned business entity trong menu; installed client/runtime, destination và approved install scope chưa biết.
- Launch/download/install `Not Run`; không cài software, extension, external authentication hoặc patient action.
- Mutation `None`; không record được tạo, menu đã đóng.

## Validation, persistence và relationships

- Không form validation hoặc saved state transitions được kiểm.
- Chỉ transient menu open/close; không client persistence hoặc business-record persistence.
- Launcher boundary không two-sided business relationship; User Portal Rocketbar guide category chỉ instructional content.

## Mutation coverage

**1/3 bounded branches**, chỉ launcher menu map; main flow blocked bởi OQ-070.

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Launcher entry / close | Performed | Hai enabled buttons; source không đổi, menu đóng | Transient UI | Done |
| Launch / client workflow | Skipped | Chưa established installed runtime/destination/approved scope | Chưa kiểm | N/A |
| Download / install | Skipped | Software target và install scope chưa established | Chưa kiểm | N/A |

## Execution và automation guidance

- Dùng visible sidebar icon rồi exact button names để verify menu, không suy route riêng.
- Không dispatch hidden handlers hoặc đọc source code để đoán launch target.
- Tiếp client workflow chỉ khi prerequisite/scope OQ-070 được tester xác lập; host allowlist vẫn áp dụng trước mọi mutation.

## Provenance and gaps

- Environment/role/date: dev, `Super Admin GB`, 2026-10-22.
- Evidence: `product-explore/auto-20261022-1414/ledger.md#6`, `rocket-bar-observation.json`.
- Cleanup Done: menu đóng, không file/client/record mới. Không product defect được xác lập.

## Tester notes
