# Workflow: Organisation / Dx Priority

- Classification: `[Observed: dev, Blinx Deployment trước reload, 2026-10-22]`
- Aliases: `Dx Priority`, `DX Priorities`, `Search Priorities...`
- Coverage: `Partial (read-only)` — 4/7 nhánh trong inventory giới hạn có end state; 3 `Skipped`. Không `Complete`/`deep`.
- Confidence: `Low` — navigation/search/picker đã quan sát; domain workflow, write footprint và active role sau reload chưa xác lập.

## Business context observed

- `[Observed; ledger #2]` Root `DX Priorities` hiển thị `Disposition Code`, `Disposition Text`, `Service`, `Priority`, `Add Service & Priority`, `Remove pair` và một page-level `Save` đang disabled.
- `[Unverified hypothesis; ledger #1]` Màn có thể cấu hình service/priority theo disposition; clinical semantics, consumer, actor được phép và effect thực tế chưa biết. Không suy business rule từ tên field.
- `[Observed; preflight0151 #2–4; ledger #3–4]` `Blinx Deployment` verified trước run. Sau fresh reload Dx, root vẫn render nhưng exact role label absent; active role tại state đó chưa verified, không suy đã switch role hoặc credentials expired.
- `[Observed; ledger #2]` Starting state là configuration có sẵn, không owned synthetic disposition. Bounded inventory thấy 72 rendered `Add Service & Priority`, 14 `Remove pair`, 14 Service/Priority controls; đây rendered counts trong context đã thử, không dataset total hoặc requirement.

## Entry

1. `[Observed; ledger #2]` `Configuration` → `Organisation` → visible menu `Dx Priority`.
2. Route `/paco/configuration/organisation/dx-priorities`; headings `Configuration` và `DX Priorities`, search `Search Priorities...`.

## Read-only flow

1. **Action:** Mở visible menu, đọc root và action boundary.
   - **Observed result:** Các disposition fields có sẵn; một shared `Save` disabled, chưa thấy separate owned `Create` target trong bounded root.
   - **Evidence:** `product-explore/auto-20261022-0158/ledger.md#2`, root `2026-10-22T02:00:25.168Z`.
2. **Action:** Nhập synthetic no-match query trong `Search Priorities...`, rồi clear.
   - **Transition:** Rendered Add controls 72→0; `No priorities match “<synthetic-query>”`; clear trả 72, search trống, `Save` disabled/dialogs0.
   - **Evidence:** ledger #3, no-match `02:02:01.844Z`, clear `02:02:03.973Z`.
3. **Action:** Mở `Select a service`, không chọn; click heading để đóng.
   - **Observed result:** Một listbox với 4 rendered options; `Save` disabled. Option labels không lưu vào reusable knowledge.
   - **Evidence:** ledger #3, picker `02:02:31.857Z`; close được quan sát trước Priority picker.
4. **Action:** Mở `Select a priority`, không chọn; click heading để đóng rồi reload.
   - **Observed result:** Một rendered option; `Save` disabled. Sau reload root/baseline render, dialogs0/listboxes0, nhưng exact role label absent.
   - **Evidence:** ledger #3, picker `02:03:00.154Z`, root reconciliation `02:05:30.280Z`.

## Decision points

- `[Observed; ledger #3]` Search không match có empty-result message; clear phục hồi rendered baseline trong cùng context. Không kiểm matching theo Code/Text hoặc normalization.
- `[Observed; ledger #2–3]` Picker mở/đóng read-only; chọn option, `Add Service & Priority`, `Remove pair` và shared `Save` tác động configuration có sẵn nên không chạy.
- `[Open Question; OQ-062]` Chưa có isolated owned disposition, separate write footprint hoặc cleanup; không force CRUD hay kết luận action unsupported.
- `[Open Question; OQ-063]` Khi active role không verify được, chỉ diagnosis read-only. Sau connector notice phải reconnect trước; không credential retry từ label absent/path-based auth result.

## End and exceptional states

- `[Observed; ledger #3]` Last measured root `2026-10-22T02:05:30.280Z`: rendered Add72, `Save` disabled, dialogs0/listboxes0; role label count0.
- `[Observed; ledger #4]` Global `More options` mở `02:06:23.494Z`; targeted snapshot sau đó chỉ application shortcuts, không role proof. Snapshot timestamp null; không chọn item, menu last open.
- `[Observed; ledger #4]` Later Playwright plugin/user `CONNECTION_CLOSED`, notice timestamp null. Không browser action sau notice; current UI/role, menu dismissal và final sweep `Blocked`. Không product `Fail` hoặc root-cause claim.
- Cross-feature handoff: `Not Run`; không source mutation hoặc receiver observation.

## Safety boundary

- `[Observed; ledger #2–5]` Mutation `None`: không Add/Remove/option selection/`Save`, không đổi existing configuration, không tạo owned draft/record, không send/upload/download.
- Guard cho lần tiếp: configured dev HTTPS host, environment mutation-enabled và actual role/context verified; dữ liệu phải do run tạo với prefix `QA-test`.
- Shared configuration không được sửa theo direct-exploration exception. Muốn vượt boundary cần tester authorization cho action/target cụ thể hoặc UI path tạo isolated owned target an toàn.
- Last business baseline không pending owned draft/`Save` và không new leftovers; final browser recheck `Blocked`, global shortcuts menu last open. Không dùng empty leftovers làm current UI proof.

## Required test data

- `[Observed; ledger #3]` Chỉ synthetic search query, không tạo business entity.
- `[Open Question; OQ-062]` Cần owned disposition/service/priority prerequisites với trusted domain values, write scope và cleanup rõ trước saved lifecycle. Existing options không phải owned test data.

## Interactive flow (owned test data)

- `Not Run`: chưa xác lập owned target. Không chạy mutation chỉ để kiểm `Save` enablement hoặc tạo relationship evidence.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| `Search Priorities...` | Synthetic no-match query / clear | `No priorities match “<synthetic-query>”`; clear phục hồi baseline | Không submit; đây search, không domain validation | `Observed; ledger #3` |
| Disposition / Service / Priority rules | Không chọn/đổi/submit | Required, duplicate, boundary, ordering và server rules chưa biết | `Not Run`; baseline `Save` disabled không validation proof | `Open Question; OQ-062` |

## Cross-feature relationships

- `[Observed; ledger #3,#5]` Service/Priority pickers có options chỉ là source-side availability. Không tạo/chỉnh source hoặc kiểm receiver; relationship `Not Run`, không thêm observed edge.
- `[Unverified hypothesis]` Màn có thể tiêu thụ Services/Priority configuration; chưa xác lập source feature hoặc downstream consumer, không enqueue dependency chỉ vì tên giống nhau.

## Anomalies and unverified behavior

- `[Observed; ledger #3–4]` Exact `Blinx Deployment` timeout25s sau reload dù DX root visible; hai readbacks role absent, global shortcut menu không giải thích active context. Cause/role continuity `Open Question` OQ-063; chưa đủ `Possible defect` hoặc authentication-expired verdict.
- `[Open Question; OQ-062]` Owned prerequisites, Add/Remove/change saved lifecycle, validation, persistence và consumer chưa verified. Không dùng populated picker hoặc disabled fields làm requirement.
- Selective console/network diagnosis `Not Run` trước connector failure; không suy nguyên nhân từ console count.

## Current-role pair draft — Super Admin GB, 2026-10-23

`Observed`; provenance `product-explore/auto-20261023-0506/ledger.md#12`. `DEC-shared-list-save` permits current shared Save scope; historical approval stops above no longer apply to authorized scope.

- Add Service & Priority appends one empty pair and enables Save. Remove only appended pair restores baseline pair count but Save remains enabled; reload restores disabled Save after loading settles.
- Appended pair exposes Service and Priority pickers; no selection or Save performed. Existing dev data authorization exists, but saved mapping/domain semantics not established in this bounded pass.
- Current Super Admin GB header visible before/after reload; historical role-label absence not reproduced in this role, old cause unresolved.
- Cleanup draft Done; no persisted business mutation, new leftover or relationship.

### Current-role mutation coverage

| Branch | Status | End state / limitation |
|---|---|---|
| Add own pair | Performed | Appended empty pair, Save enabled |
| Remove appended pair | Performed | Baseline count restored, Save still enabled |
| Reload discard / role continuity | Performed | Settled baseline, Save disabled, role verified |
| Saved mapping/update/delete | Skipped | Domain mapping not established; no Save |
| Validation | Skipped | No submit; server rules unknown |
| Receiver | Skipped | No source saved |

Coverage `Partial`, 3/6 current-role branches, separate historical 4/7 read-only inventory. Loading can briefly render zero pairs; wait for settled baseline before readback.

## Mutation coverage

| Workflow branch | Status (Performed/Skipped/Not supported) | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Visible entry / root | Performed | — | Không submit | Menu tới `DX Priorities`, root/actions observed | Không saved-data proof | N/A |
| Search no-match / clear | Performed | — | Search only | Baseline → empty result → baseline | Cùng page; không domain persistence | Query cleared |
| Service picker open / close | Performed | — | Không chọn/submit | Listbox4 rendered options → closed | Not Run | Picker closed |
| Priority picker open / close | Performed | — | Không chọn/submit | Listbox1 rendered option → closed; reload root | Not Run; reload không chứng minh saved workflow | Picker closed |
| Add pair + shared Save | Skipped | Existing disposition/shared write; chưa có owned target | Not Run | Control visible, chưa click | Not Run | N/A |
| Remove pair + shared Save | Skipped | Pair có sẵn, không thuộc run | Not Run | Control visible, chưa click | Not Run | N/A |
| Change Service/Priority + shared Save | Skipped | Existing configuration/shared write footprint chưa rõ | Not Run | Picker selection/Save chưa chạy | Not Run | N/A |

- Branches exercised / found: **4/7** trong bounded inventory; 3 `Skipped`, không toàn bộ feature coverage.
- Dimensions: navigation `done`; main_workflow/branches_states `partial`; mutation/validation/persistence/relationships `none`; errors_edge `partial` chỉ search-empty state, không domain-error coverage.
- Still needs interaction testing: owned target/prerequisites, saved Add/Remove/change, validation/domain boundaries, reload/reopen saved persistence, cleanup/retention và receiver. Search match semantics cũng chưa thử.

## Execution guidance

- Reconnect Playwright trước; verify current configured host/path và actual role. Preflight0151 Pass là dated evidence, không current verification sau reload/connection failure.
- Chỉ read-only dismiss global menu và reconcile search empty/`Save` state/dialogs/listboxes; không replay Add/Remove/Save hoặc switch role/logout.
- Resume original run/budget từ `autonomous-state.yaml`; elapsed gồm pause/file work. Không reset run để né budget; closed historical runs không reopen.
- Shared target không đổi: giữ OQ-062, chọn eligible unmapped feature khác khi auth/role/budget cho phép, không thử mutation để lấp gap.
- Evidence cần capture: path/landmark/role result, state transition và actual timestamp; thiếu timestamp ghi null, không snapshot existing option identities vào docs.

## Automation guidance

- Stable landmarks: `DX Priorities`, `Search Priorities...`, `Select a service`, `Select a priority`, `Add Service & Priority`, `Remove pair`, `Save`.
- Wait actual heading/listbox/empty-result/hidden-picker conditions; path-based auth true không đủ active-role proof. Không assert exact rendered counts thành requirement.
- No automated shared selection/Add/Remove/Save trước owned target/write footprint/cleanup. Không private APIs hoặc internal UI state.
- Observations chỉ làm navigation/setup hint; expected clinical semantics, validation và persistence phải có trusted basis riêng.

## Provenance and gaps

- Environment: `dev`, configured `https://blinx.dev.blinxpaco-np.com`.
- Role: `Blinx Deployment` verified trước run `2026-10-22T01:54:48.999Z`, check lại `01:57:07.281Z`; exact label absent sau Dx reload, current role chưa verified.
- Raw evidence: `test-results/product-explore/auto-20261022-0158/ledger.md#1–5`, `ui-observations.json`; auth/read-only prior cleanup tại `resume-preflight-20261022-0151/ledger.md#1–4`.
- Open questions: `OQ-062`, `OQ-063`.
- Exact resume state: run `auto-20261022-0158` paused; Dx route, global `More options` menu last open, no business mutation/owned leftover. Reconnect/role/read-only baseline/budget trước target mới. Ticket/discovery checkpoint không cập nhật.

## Tester notes
