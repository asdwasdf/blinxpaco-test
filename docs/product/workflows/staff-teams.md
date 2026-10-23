# Workflow: Staff Teams

- Classification: `[Observed: dev, Blinx Deployment, 2026-10-21]`
- Aliases: `Teams`, `Search Teams...`, `Add New`
- Coverage: `Partial (read-only + unsaved draft)` — chưa lưu mutation vào server.
- Confidence: `Medium`
- Last verified: `2026-10-21`
- Provenance: `product-explore/auto-20261021-1359/ledger.md#9`.

## Super Admin GB saved Team và Work Board receiver — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0506/ledger.md#8–9`; page Save authorized qua answered `DEC-shared-list-save`, supersedes historical approval stop cho current pass, không suy write footprint.

- `Add New` → synthetic Name → Add → page `Save`; reload sau list settle có đúng một owned name input. Không chọn member hoặc đổi existing rows.
- Đổi exact owned name → page Save → reload giữ edited, old absent. Không kiểm duplicate/blank/server rule trong pass này.
- Fresh Work Board new form `Assign Staff/Team` treeselect có source name sau Create; sau rename picker có edited và old absent. Không select hoặc Save board; Cancel đóng draft.
- Một unique observed relationship Teams → Work Board Assign Staff/Team, hai triggers Create/Rename; chỉ picker availability, chưa saved assignment/permissions/notification proof.
- Mutation coverage **4/7 bounded branches Performed**: Create/reload, Rename/reload, Create receiver, Rename receiver; member assignment, delete/restore và validation Skipped. Hai persisted mutations; own no-member Team intentionally retained theo approval, draft cleanup Done. Không force unknown remove icon.
- Current coverage `Partial`: navigation done; main workflow/branches/mutation/persistence/relationships partial; validation none, errors/edge partial. Historical role/1-of-6 draft pass giữ riêng.

## Business context observed

- `[Observed]` `Configuration` → `Users & Staff` có `Staff Profiles`, `Role Groups`, `Teams`.
- `[Observed]` `Teams` mở danh sách editable, mỗi row có tên và multiselect; footer có một `Save` chung. Tại thời điểm kiểm tra có 17 row/multiselect trước tạo draft.
- `[Unverified hypothesis]` Team nhóm staff và được tiêu thụ bởi Staff Profiles; chưa quan sát bên nhận nên không coi là relationship.

## Entry

1. `[Observed]` `/paco/dashboard` → `Configuration` → `Users & Staff` → `Teams`.
2. `[Observed]` Route `/paco/configuration/staff/teams`; heading `Teams`, search `Search Teams...`.

## Read-only flow

1. `[Observed]` Xem danh sách, không thay tên/member có sẵn.
2. `[Observed]` Search prefix riêng run; các controls có sẵn vẫn hiện trong state đã inspect. Chưa test Enter/blur/debounce contract, không kết luận search hỏng.
3. `[Observed]` `Add New` mở popover/inline form `Name`, `50 characters max`, `Add`.

## Decision points

- `[Observed]` Form Name có `maxlength=50`; `Add` vẫn enabled khi empty. Không submit empty.
- `[Observed]` Name synthetic → `Add` tạo draft trong page; reload sau đó không còn Name này.
- `[Open Question]` `Save` chung ghi delta hay cả team list? Không thấy Save riêng owned row; chưa đủ basis bảo đảm không ghi shared data.

## End and exceptional states

- `[Observed]` Draft biến mất sau reload; chờ footer `Save` và 17 row cũ load xong rồi mới xác minh không còn owned Name.
- `[Observed]` Không captured write response trong sample ngay sau Add; riêng điều đó không chứng minh không write. UI sau reload là evidence không persist.
- `[Observed]` Không global Save, không chọn member, không update/delete row có sẵn.

## Safety boundary

- Chỉ configured HTTPS dev host; action giới hạn owned `QA-test` draft.
- Dừng trước page-wide Save vì write footprint trên shared team list chưa xác định. Không đọc payload/body để suy thêm hoặc gọi API riêng.
- Không click icon remove trên record có sẵn.

## Required test data

- Owned Name `QA-test-<run-id>-<n>`, dưới 50 ký tự.
- `[Open Question]` Nếu Save/member selection cần existing staff, phải có owned prerequisite hoặc tester duyệt footprint cụ thể.

## Interactive flow (owned test data)

1. `[Observed]` Add New → điền synthetic Name → Add → draft row xuất hiện.
2. `[Observed]` Reload → chờ controls đầy đủ → không còn owned Name. Draft đã discard.
3. `Not Run`: persisted create/update/member assignment/delete; safety boundary chưa giải quyết.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| Name length | DOM constraint | `50 characters max`, `maxlength=50` | Chưa thử input quá 50 | `Observed` |
| Empty Name | Empty, không submit | Add enabled | Chưa biết server/local validator | `Observed / Open Question` |
| Duplicate / whitespace | Chưa submit | Chưa biết rule | Chưa biết | `Open Question` |

## Cross-feature relationships

- `[Unverified hypothesis]` Teams → Staff Profiles; chưa persisted owned Team và chưa kiểm tra receiver. Không ghi `Observed` relationship.
- `[Open Question]` Teams có consume Skills/RBAC không? Menu cạnh nhau không chứng minh dependency.

## Anomalies and unverified behavior

- `[Observed]` Chưa có defect đủ evidence. Search/persistence/Save semantics cần điều tra bằng safe scope.
- `[Open Question]` `OQ-050`: page-wide Save footprint, ownership-safe create/cleanup và member prerequisite.

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Add New → Add → draft → reload discard | Performed | — | Empty Add state; maxlength 50 inspected | Popover → draft → absent | Reload: không persist | Done, draft discard |
| Create draft → page Save → persisted team | Skipped | Shared-data footprint chưa rõ | — | Save visible | Không | N/A |
| Edit own team → Save | Skipped | Chưa có owned persisted team | — | Editable rows visible | Không | N/A |
| Member selection → Save | Skipped | Shared staff, chưa có owned prerequisite | — | Multiselect visible | Không | N/A |
| Remove own team → Save | Skipped | Chưa có owned persisted team; Save chung | — | Row icon chưa classify chắc | Không | N/A |
| Team → downstream Staff Profiles | Skipped | Chưa có persisted source | — | Chưa quan sát receiver | Không | N/A |

- Nhánh có end state / nhánh tìm thấy: **1/6**, chỉ unsaved draft; persisted mutation **0**.
- `Partial (read-only + unsaved draft)`, không `Complete` hoặc `deep`.
- Cleanup: draft bỏ bằng reload, không có persisted record để delete. Final fresh-page sweep #12 chờ 17 controls như baseline: 0 owned labels/input values theo prefix run; không bấm Save.

## Execution guidance

- Mở Teams, chờ list load; tránh thao tác mọi row có sẵn.
- Nếu chỉ thử draft, dùng prefix riêng rồi reload discard; verify sau controls settle, không count lúc loading.
- Hỏi tester khi cần Save có thể ghi shared list hoặc assignment tới shared staff.
- Evidence: form constraints, draft presence, reload absence; không lưu staff/PII hoặc payload.

## Automation guidance

- Landmarks: `Teams`, `Search Teams...`, `Add New`, `50 characters max`, `Add`, `Save`.
- Form Add New là popover/inline, không giả định dialog; mở và điền trong cùng sequence.
- Không dùng một multiselect xuất hiện làm load-complete: list load tăng dần.
- Không automate global Save cho tới scope an toàn được xác lập; không biến inferred team relationship thành assertion.

## Provenance and gaps

- Environment: `dev`, `blinx.dev.blinxpaco-np.com`.
- Role: `Blinx Deployment`.
- Observed at: `2026-10-21`.
- Raw evidence: `test-results/product-explore/auto-20261021-1359/ledger.md#9`, `#12`; `final-cleanup-check.js`.
- Open questions: `OQ-050`.
- Exact resume: Teams không còn draft; global Save chưa click. Tiếp tục Staff Profiles/Role Groups read-only hoặc feature có owned-save scope riêng.

## Tester notes
