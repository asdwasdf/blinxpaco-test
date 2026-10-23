# Workflow: Organisation Sharing Agreements

- Classification: `Observed: dev, Blinx Deployment, 2026-10-21`; không requirement hoặc product verdict.
- Aliases: `Sharing Agreements`, `Organisations you share data with`, `Column Menu`.
- Coverage: `Partial (read-only)` — cumulative 4/5 bounded branches có end state: root/menu/general-layout/columns; paging navigation `Skipped`, chỉ visibility inspection. Không `Complete` hoặc `deep`.
- Confidence: `Medium`; bounded navigation/layout UI preference verified; không business data persistence/CRUD/domain validation hoặc product verdict.

## Business context observed

- `[Observed; ledger #18]` Root hiển thị `Organisations you share data with`, grid gồm `ODS Code`, `Name`, `Address`, `Access`, `Status`, `ID`.
- Actor/role: `Blinx Deployment`, environment `dev`; auth/role verified trước khi vào feature — ledger #17.
- Starting data: ba rendered center rows; không phải dataset total. Không sao chép organisation names, addresses hoặc IDs vào knowledge.
- `[Observed; ledger #18]` Có status label `active`; `Access` hiển thị `prescribing`, `consultations`, `documents`, `codings`. Chưa thử quyền hoặc effect tương ứng.
- `[Unverified hypothesis]` Feature có thể quản lý sharing giữa organisations; purpose, lifecycle, ownership và consumers chưa có trusted basis. Heading không chứng minh business rule hoặc permission.

## Entry

1. Từ `Configuration`, mở visible `Organisation` rồi `Sharing Agreements`.
2. Route observed: `/paco/configuration/organisation/sharing-agreements`.
3. Chờ heading `Sharing Agreements` và `Organisations you share data with`, grid headers tương ứng.

Nguồn: `product-explore/auto-20261021-1844/ledger.md#17–18`.

## Read-only flow

1. **Action:** Chọn visible menu entry.
   - **Transition:** Locations root sang Sharing Agreements root.
   - **Observed result:** Heading/list/columns và rendered records xuất hiện; không tương tác record.
   - **Evidence:** ledger #18; entry measured `2026-10-21T20:02:04.431Z`, root observations `20:02:37.620Z–20:03:16.033Z`.
2. **Action:** Hover header `Name`, mở column menu từ icon đã quan sát.
   - **Transition:** Root sang dialog `Column Menu`.
   - **Observed result:** Tabs `general`, `columns`; general tree items `Pin Column`, `Autosize This Column`, `Autosize All Columns`, `Reset Columns`.
   - **Evidence:** ledger #18; menu-open click measured `2026-10-21T20:04:00.999Z`. Targeted snapshot sau click không cung cấp timestamp riêng.
3. **Action:** Mở tab `columns`, nhập filter `Status`, clear filter.
   - **Transition:** General tab sang columns list với filtered/unfiltered columns.
   - **Observed result:** Six checked columns baseline; filter `Status` hiện một column label `Status`, clear trả lại six columns. Không toggle checkbox.
   - **Evidence:** `auto-20261021-2259/ledger.md#2`; menu reopened `2026-10-21T23:01:17.231Z`, sau đó mở `columns` (snapshot không timestamp riêng); clear restored six `23:02:02.744Z`.
4. **Action:** General layout: `Autosize This Column` trên `Name`, reload.
   - **Transition:** Name width thay đổi, reload restore baseline.
   - **Observed result:** Width 200px→279px; fresh reload cả six headers 200px/unpinned. Không persist layout qua reload trong context đã thử.
   - **Evidence:** `auto-20261021-2259/ledger.md#3–4`; baseline restored `23:02:44.955Z`.
5. **Action:** Kiểm paging controls visibility.
   - **Observed result:** Four labels `First Page`, `Previous Page`, `Next Page`, `Last Page` có `visible:false`/`hidden ancestor:true`. Không click hidden controls hoặc navigation.
   - **Evidence:** `auto-20261021-2259/ledger.md#2`; measured `23:01:07.299Z`.

## Decision points

- Columns tab filter: `Status` chỉ filter column names trong list, không phải data-row filter. Clear immediate readback có render delay nhưng eventual six-column count đúng.
- `Autosize This Column` thay width từ 200px sang 279px; fresh reload trả lại baseline six headers 200px/unpinned. Layout không persist qua reload trong context đã thử; chưa biết session-level hoặc user-preference persistence.
- Paging controls hidden; không click hidden elements, không navigation hoặc support proof. Branch `Skipped`, không `Not supported`.
- General layout choices `Pin Column`, `Autosize All Columns`, `Reset Columns` chưa chọn. Reset không cần vì baseline đã restore qua reload.
- Bounded root không thấy feature `Add`, `Save`, row `Actions`, links, search hoặc inputs. Không kết luận CRUD unsupported; global user `More options` không được coi feature action.

## End and exceptional states

- `[Observed; auto-20261021-1844/ledger.md#18; auto-20261021-2259/ledger.md#1–4]` Root/list, `Column Menu` tabs, column-list filter và autosize có end state. Paging chỉ visibility inspection, không navigation end state. Baseline restored qua reload; dialogs `0`.
- Menu navigation timeout run1844 và connector pause run2259 đã recover cho read-only final sweep `2026-10-22T01:08:14.018Z`. Sau sweep, latest plugin/user `CONNECTION_CLOSED` notice lại chặn current UI recheck; notice timestamp null, không browser action sau latest notice. Nguồn `auto-20261021-2259/ledger.md#11–13`, `resume-preflight-20261022-0103/ledger.md#4–6`.
- Empty/loading/error branches của feature chưa kiểm; ba rendered rows không chứng minh full dataset hoặc access đầy đủ.
- Cross-feature handoff: `Not Run`; không observed relationship edge.

## Safety boundary

- Root/menu/columns và một Autosize/reload có end state; paging chỉ visibility inspection. Baseline restored `2026-10-21T23:02:44.955Z`; final read-only `2026-10-22T01:08:14.018Z` có six200px/unpinned/dialogs0/menu absent/roletrue, không replay layout mutation. Không current UI guarantee sau latest connector notice.
- Không chọn shared row/checkbox, không sửa agreement có sẵn hoặc dùng global `More options` để tìm mutation.
- Column filter chỉ search column names (layout UI preference), không phải data-row filter.
- Autosize thay width layout owner, không mutate agreement-record hay business data.
- Chỉ exercise owned synthetic data khi UI xác lập được separate target, write footprint và cleanup; runtime host/environment/ownership guard cùng pre-action ledger bắt buộc.
- Shared/unknown ownership, bulk hoặc external effects ngoài scope cần tester approval; SMS chưa được duyệt. Không private API, app source hoặc auth-state readback.
- Mutation: `None` — owned layout UI preference (column width) không persist qua reload trong context đã thử; không agreement-record mutations/CRUD/validation hoặc domain persistence/receiver.

## Required test data

- Root/menu read-only không cần tạo dữ liệu; existing records chỉ quan sát và redact.
- Owned prerequisite để tạo agreement chưa xác lập. Không chọn existing organisation để lấp dependency hoặc ép CRUD.
- Email nếu có send chỉ recipient được duyệt trong `CLAUDE.md`; run này không send hoặc nhập recipient.

## Interactive flow (owned test data)

- `Not Run`: chưa có supported owned mutation surface, separate scope hoặc cleanup path được map. Không tạo data qua API.
- Không mutation/persistence/validation claim từ root/menu observation.

## Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| Form, required/format/duplicate rules | Không nhập/submit | Chưa có scoped form được map | Not Run | Open Question, OQ-060 |

## State and persistence

- Root/list/menu/columns và layout change đã observed. `Autosize This Column` thay `Name` width200→279px; fresh reload trở lại200px cùng năm headers còn lại200px/unpinned — `auto-20261021-2259/ledger.md#2–4`.
- Đây own layout reload experiment, không agreement mutation hoặc business-data persistence. Other grid preferences, data-row sort/filter state, agreement lifecycle và server persistence: `Not Run`.
- Không dùng UI render hoặc HTTP status làm save proof.

## Cross-feature relationships

- `Not Run`: không source mutation hoặc receiver probe; không observed edge.
- `Access` labels và organisation list không đủ evidence hai phía hoặc dependency với Locations/Staff/clinical modules.

## Anomalies and unverified behavior

- Chưa có `Possible defect`; menu timeout, hidden indicators và locator mismatch không tự thành product failure.
- OQ-060: purpose, supported actions, role/ownership/prerequisites, safe owned mutation và cleanup còn chưa rõ.
- Historical connector blocker đã recover cho run2259 measurements; general Autosize/columns/paging visibility đã kiểm. Other choices và paging navigation còn chưa thử; không suy backend/root cause từ historical `CONNECTION_CLOSED`.

## Mutation coverage

Inventory gồm observed read-only branches và visible/DOM candidates chưa xác lập support; không phải toàn feature hoặc supported CRUD inventory.

| Workflow branch | Status | Reason if skipped | Validation tried / found | Transitions observed / visible | Persistence verified (how) | Cleanup |
|---|---|---|---|---|---|---|
| Visible entry và root/list readback | Performed | — | Không form/submit | Menu entry sang root/grid | Not Run; display only | N/A |
| Name Column Menu open, general tab | Performed | — | Không input/submit | Root sang Column Menu/general | Not Run | N/A |
| General layout: autosize column, reload | Performed | — | Không business form/submit | Width 200→279, fresh reload six 200/unpinned | Layout không persist trong context đã thử (reload proof) | Baseline restored |
| Columns tab, filter column names | Performed | — | Column-list search input; không domain validation/submit | General sang columns list, filter `Status`, clear six | No checkbox change; không business-data persistence | Filter cleared |
| Paging availability/navigation | Skipped | DOM labels `visible:false`/`hidden ancestor`; không click hidden | Not Run | Chưa có page transition | Not Run | N/A |

- Branches exercised / found: **4/5**, **1 Skipped**, `Partial (read-only)`; ledger run 1844 #18–19, run 2259 #1–4. Chưa xác lập toàn bộ supported branches.
- Still needs interaction testing: paging navigation (branch Skipped, không `Not supported`); sort/filter support, known read-only detail, owned prerequisites/CRUD/validation/persistence và receiver khi có UI basis an toàn.

### Coverage dimensions

| Dimension | Status | Scope / limitation |
|---|---|---|
| navigation | done | Visible entry/root verified |
| main_workflow | partial | List/menu/columns verified; business lifecycle chưa biết |
| branches_states | partial | Root/menu/columns/autosize/paging observed, 4/5 có end state |
| mutation | none | Layout UI preference only, không agreement-record mutations |
| validation | none | Không business form/submit; column-list search không domain validation |
| persistence | partial | Own layout (column width) không persist qua reload; business data chưa thử |
| relationships | none | Không source/receiver evidence |
| errors_edge | none | Không feature error coverage |

## Execution guidance

1. Khôi phục Claude Playwright plugin; kiểm exact configured dev HTTPS host, existing auth helper và role trước action. Không đọc credentials/auth state.
2. Reconcile root/menu/columns/autosize/paging read-only; dismiss `Column Menu` nếu vẫn mở. Menu là UI state, không product draft; không chọn item để đóng.
3. Run1844 và run2259 đã `done` theo budget; run2259 closure clock `2026-10-22T01:12:45.669Z` đo133/120minutes, không coverage Complete/deep. Resume theo autonomous state; fresh run chỉ sau reconnect/auth/role/read-only reconciliation, không reset/reopen closed runs.
4. Chỉ dùng read-only actions đã hiểu; own layout change cần guard/pre-action ledger và restore baseline. Dừng trước shared/unknown ownership hoặc agreement-record mutation.
5. Redact existing record values; ghi labels, counts giới hạn, messages, transition và timestamp thực tế. Không replay Locations Create/Save/Archive hoặc restore source để lấy coverage.

## Automation guidance

- Landmarks: `Sharing Agreements`, `Organisations you share data with`, header `Name`, dialog `Column Menu`, tabs `general`/`columns`.
- Chờ visible root/header/menu; DOM presence không thay visibility/enabled. Không bake grid row index, record IDs hoặc generated selectors vào reusable guidance.
- Data dependency/ownership chưa đủ cho standalone agreement mutation assertions. Own layout chỉ có bounded reload proof `Name`200→279→200px trong context đã thử; không generalize thành session/user-preference persistence. Không assert CRUD unsupported, permission semantics hoặc dataset total.

## Provenance and gaps

- Environment: `dev`; role: `Blinx Deployment`; observed date: `2026-10-21` theo tool UTC.
- Raw evidence: `product-explore/auto-20261021-1844/ledger.md#17–19` (run 1844 root/menu), `auto-20261021-2259/ledger.md#1–4` (run 2259 columns/autosize/paging), local `ui-observations.json#sharing_agreements`.
- Latest read-only Sharing UI readback: `2026-10-22T01:08:14.018Z`, route/roletrue, six200px/unpinned/dialogs0/Column Menu absent; `resume-preflight-20261022-0103/ledger.md#4`. Không replay Autosize/Reset/checkbox hoặc agreement mutation, không full feature revalidation. Run1844 menu-open click measured `20:04:00.999Z`; subsequent snapshot không có timestamp riêng.
- Open questions: `OQ-060`. No product verdict, no observed relationship edge, cleanup `N/A` cho agreement records; own layout baseline verified theo last measured sweep.
- Run2259 closure `auto-20261021-2259/ledger.md#12–13`: done do elapsed133/120 tại `2026-10-22T01:12:45.669Z`, hai features/11tracked states lower bound không tăng sau read-only reconciliation. Latest connector notice sau sweep không timestamp riêng/current recheck Blocked; không product Fail hoặc current-state guarantee. Historical outcomes giữ nguyên; chỉ autonomous checkpoint cập nhật, ticket/discovery không đổi.

## Tester notes
