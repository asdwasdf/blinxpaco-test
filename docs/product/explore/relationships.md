# Cross-feature Relationships

Owner: `paco-explore` mode `autonomous` (và `interact`). Chỉ ghi relationship có evidence quan sát ở cả hai phía; tên giống nhau chỉ là `Inferred`. Không PII/test data id.

## Teams receiver — 2026-10-23

| From → To | Trigger | Observed effect | Classification | Evidence / ledger ref | Last verified |
|---|---|---|---|---|---|
| `Users & Staff / Teams` → `Work Boards / Assign Staff/Team` | Owned Create và page Save, source reload | Fresh new-board treeselect có exact owned Team; không select/Save | `Observed: dev, Super Admin GB` | `product-explore/auto-20261023-0506/ledger.md#8–9` | 2026-10-23 |
| `Users & Staff / Teams` → `Work Boards / Assign Staff/Team` | Owned Rename và page Save, source reload | Fresh treeselect edited present, old absent; Cancel đóng draft | `Observed: dev, Super Admin GB` | `product-explore/auto-20261023-0506/ledger.md#9` | 2026-10-23 |

Một unique availability edge với hai triggers; không saved assignment/notification proof. Source intentionally retained theo answered decision.

| From → To | Trigger | Observed effect | Classification | Evidence / ledger ref | Last verified |
|---|---|---|---|---|---|
| `Organisation / Skills` → `Staff Profiles / Skill Capabilities` | Create owned Skill | Fresh unsaved `Add Care Professional` → `Skill Capabilities & Attributes` picker có exact owned Name; không chọn/lưu profile | `Observed: dev, Blinx Deployment` | `product-explore/auto-20261021-1359/ledger.md#11`, `skills-staff-picker.js` | 2026-10-21 |
| `Organisation / Skills` → `Staff Profiles / Skill Capabilities` | Rename owned Skill | Fresh picker hiện tên mới, không còn tên cũ | `Observed: dev, Blinx Deployment` | `product-explore/auto-20261021-1359/ledger.md#11` | 2026-10-21 |
| `Organisation / Skills` → `Staff Profiles / Skill Capabilities` | Archive owned Skill | Fresh picker không còn tên cũ/tên mới; profile draft đóng, source UI archive | `Observed: dev, Blinx Deployment` | `product-explore/auto-20261021-1359/ledger.md#11` | 2026-10-21 |
| `Appointment Books source` → `Appointment Book / Select Appointment Books` | Create owned Book | Fresh picker có exact original unselected; không chọn hoặc Save schedule | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-1742/ledger.md#3` | 2026-10-22 |
| `Appointment Books source` → `Appointment Book / Select Appointment Books` | Rename owned Book | Source reload/fresh editor giữ edited; fresh picker original absent, edited present | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-1742/ledger.md#3` | 2026-10-22 |
| `Appointment Books source` → `Appointment Book / Select Appointment Books` | Archive owned Book | Source reload không thấy owned row; fresh base-token picker báo `No appointment books found`, original/edited absent; selection unchanged | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-1742/ledger.md#3`, `book-cleanup-readback.js` | 2026-10-22 |

Ba Book trigger observations là **một unique relationship**, không ba entity edges; Archive không chứng minh hard delete hoặc past-record/analytics retention.

| From → To | Trigger | Observed effect | Classification | Evidence / ledger ref | Last verified |
|---|---|---|---|---|---|
| `Slot Types source` → `Appointment Sessions source / Assigned Slot Types` | Create owned Slot Type | Fresh Add picker có exact original unselected; không chọn hoặc Save Session | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-1742/ledger.md#6` | 2026-10-22 |
| `Slot Types source` → `Appointment Sessions source / Assigned Slot Types` | Rename owned Slot Type | Source reload/editor giữ edited; fresh picker original absent, edited present | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-1742/ledger.md#6` | 2026-10-22 |
| `Slot Types source` → `Appointment Sessions source / Assigned Slot Types` | Archive owned Slot Type | Fresh picker original/edited absent và `No results found`; source reload supporting absence, không Session Save | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-1742/ledger.md#6`, `slot-session-readback.js` | 2026-10-22 |

Ba Slot Type triggers là một unique relationship; run này tổng hai unique edges/sáu trigger observations, không saved Session hoặc schedule propagation proof.

### Saved Session prerequisite pass — 2026-10-22

| From → To | Trigger | Observed effect | Classification | Evidence / ledger ref | Last verified |
|---|---|---|---|---|---|
| `Appointment Books source` → `Appointment Sessions source / Assigned Appointment Book` | Create owned Book | Source reload/editor retained; exact own picker option selected và saved Session fresh editor retained assignment | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-2011/ledger.md#3` | 2026-10-22 |
| `Appointment Books source` → `Appointment Sessions source / Assigned Appointment Book` | Archive owned Book sau Session template Delete | Fresh source absent; fresh Add Session picker exact `No results found`, own option absent | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-2011/ledger.md#3` | 2026-10-22 |
| `Slot Types source` → `Appointment Sessions source / Assigned Slot Types` | Create owned Slot Type, reverify | Source reload/editor retained; exact own option selected và retained trong saved Session fresh editor | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-2011/ledger.md#3` | 2026-10-22 |
| `Slot Types source` → `Appointment Sessions source / Assigned Slot Types` | Archive owned Slot Type, reverify | Fresh source absent; fresh Add Session own picker exact `No results found` | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-2011/ledger.md#3` | 2026-10-22 |
| `Appointment Books source` → `Appointment Book / Select Appointment Books` | Archive owned Book, reverify | Fresh own query exact `No appointment books found`; settled selection unchanged, query cleared | `Observed: dev, Super Admin GB` | `product-explore/auto-20261022-2011/ledger.md#4` | 2026-10-22 |

Run2011: ba observed unique edges với năm trigger observations; chỉ Book→Session là new unique product edge. Template Delete và prerequisite Archive không chứng minh generated Session occurrences đã mất; Session→schedule cleanup `Inconclusive` theo OQ-073, không thêm observed edge.

Later Patient offline entry dừng tại context gate; Capacity role/card interactions chỉ same-feature UI preference/help, không source action và receiver effect hai phía. Không thêm relationship từ hai pass này. `[Observed: dev, 2026-10-22]` — `product-explore/auto-20261022-2011/ledger.md#5–7`.

### Inconclusive probes (không đủ evidence hai phía)

**Health Forms Designer / Designer V2** (`/health-forms/builder/`, `/paco/health-forms/`): legacy control có owned template `Active` lúc probe. V2 lần vào đầu chưa thấy rows; fresh reload chờ20s vẫn không có rendered data rows, console errors2/pageerror0, same-origin capture chỉ document GET200. Relationship `Inconclusive`; không thêm observed edge, không chứng minh sync absent hoặc data filter exclude. Source sau đó đã UI Archive, receiver archived visibility chưa biết. `[Observed / Open Question: dev, Blinx Deployment, 2026-10-21]` — `product-explore/auto-20261021-1626/ledger.md#7,#10`, `ui-observations.json#designer_v2`, OQ-055.

### Chưa probe receiver

**Organisation / Locations**: owned source create/update/Archive đã có UI reload/reopen proof; chưa kiểm related receiver hoặc effect hai phía. `Assigned Staff`/`Shared Organisation` mới là source-side controls, không chứng minh relationship với feature cụ thể. UI Archive đã thực hiện, source row0 sau fresh reload/search; không `Archived` status-cell hoặc retention proof. Receiver coverage `Not Run`, không restore/create lại source chỉ để kiểm audit/receiver, không thêm observed edge. `[Observed / Unverified hypothesis: dev, Blinx Deployment, 2026-10-21]` — `product-explore/auto-20261021-1844/ledger.md#3,#7–11,#14–16`, `ui-observations.json#relationships`. Connection failure original recovered qua auth/owned reconciliation/cleanup Done 19:27:59.966Z; notice sau Add Close recovered qua role/auth và read-only exact cleaned/cancelled Names0/dialogs0 tại20:00:15.316Z — ledger #17. Latest connector notice sau Sharing Agreements Column Menu chưa recheck current state; notice timestamp không có — ledger #18–19.

**Organisation / Announcements**: root Welcome/Service accordion, own unsaved drafts Add/Delete/reload; existing content untouched. `Apply to locations` picker 285 rendered options, no selection/Save. Receiver coverage `Not Run`, không thêm observed edge. `[Observed / Unverified hypothesis: dev, Blinx Deployment, 2026-10-21]` — `product-explore/auto-20261021-2259/ledger.md#5–10`, `ui-observations.json#announcements`, OQ-061. Cleanup Done `23:09:25.321Z`: editors1/owned text0/dialogs0.

**Organisation / Sharing Agreements**: cumulative 4/5 bounded branches có end state: root/menu/general-layout/columns. Paging navigation Skipped, chỉ visibility inspection; Performed4/Skipped1. Columns tab six checked columns, Filter Columns Input `Status` filters column names only (layout search), clear restored six, no checkbox changed. Autosize This Column Name width200→279, fresh reload six200/unpinned, no layout persistence trong context đã thử. Paging four controls `visible:false`/`hidden ancestor` measured `23:01:07.299Z`, visibility only, no navigation/support proof; branch Skipped not `Not supported`. Bounded root không thấy feature Add/Save/row Actions. Column menu/filter chỉ own layout UI preference only, no agreement-record mutations/domain persistence/receiver. Receiver coverage `Not Run`, không thêm observed edge. `[Observed / Unverified hypothesis: dev, Blinx Deployment, 2026-10-21]` — `product-explore/auto-20261021-1844/ledger.md#18–19`, `auto-20261021-2259/ledger.md#1–4`, `ui-observations.json#sharing_agreements`, OQ-060. Run1844 connector timeout recovered preflight2253; run2259 measurements hoàn tất, baseline restored `23:02:44.955Z`.

**Organisation / Dx Priority**: Service/Priority picker options chỉ source-side availability, no selection/Add/Remove/shared Save; không owned source record, source mutation hoặc receiver probe. Relationship `Not Run`, không thêm observed edge hoặc dependency chỉ vì field name. `[Observed / Unverified hypothesis: dev, Blinx Deployment trước reload, 2026-10-22]` — `product-explore/auto-20261022-0158/ledger.md#2–5`, `ui-observations.json`, OQ-062/OQ-063. 4/7 bounded branches Partial read-only; role label absent sau reload, later connector failure/current recheck Blocked không là product defect/relationship evidence.

**Patient Search**: own unsaved draft đã bỏ bằng Close/fresh reopen; không saved patient source. `Profile`/`View` và Relationships & Permissions chỉ candidate handoff, chưa receiver probe; chưa thêm two-sided edge. `[Observed / Open Question: dev, Blinx Deployment, 2026-10-22]` — `product-explore/auto-20261022-0236/ledger.md#5–9`, OQ-065.

**Appointment Book / Quick Book**: blank form có patient search và `Find Appointment` disabled; chưa chọn patient hoặc tạo booking. Không có owned source/receiver effect để thêm two-sided edge với Patient Search/Profile; OQ-065 giữ patient-fixture dependency. `[Observed / Open Question: dev, Blinx Deployment, 2026-10-22]` — `product-explore/auto-20261022-0236/ledger.md#14–15`.

**Web Chat & Video / Virtual Appointments**: root load và Date Range filter observed; không có `Create`/`Book` visible, appointment action fixture chưa có. Không owned source/receiver appointment hoặc patient để thêm two-sided edge; OQ-065 làm context hint cho appointment-dependent workflows. Media Library patient selection và Outstanding Reviews chưa mở. `[Observed / Open Question: dev, Blinx Deployment, 2026-10-22]` — `product-explore/auto-20261022-0500/ledger.md#6–7`.

**Paco navigation / Comms Hub**: sidebar `Campaign Manager` chuyển cùng tab tới external Login; chưa authenticated campaign root hoặc owned campaign source/receiver. Chỉ navigation handoff, không thêm two-sided business edge. `[Observed / Open Question: dev, Blinx Deployment trên Paco, 2026-10-22]` — `product-explore/auto-20261022-0500/ledger.md#2–3`, OQ-040.

### Read-only closure reconciliation (2026-10-22)

`[Observed; auto-20261021-2259/ledger.md#12–13; resume-preflight-20261022-0103/ledger.md#4–6]` Sau auth recovery, Announcements `01:07:48.305Z` baseline1editor/exact own matches0/0/dialogs0; Sharing `01:08:14.018Z` six200px/unpinned/dialogs0/menu absent/roletrue. Không source mutation replay hoặc receiver probe, không thêm edge; organisation continuity qua re-auth chưa independently established. Historical Locations/Health Form không recheck, các observations cũ giữ timestamp riêng. Run2259 done do elapsed133/120, không coverage Complete/deep. Latest connector notice sau sweep lại `CONNECTION_CLOSED`, timestamp null/current recheck Blocked, không browser action sau latest notice hoặc current-state guarantee.

### Autonomous breadth — 2026-10-22

- `Role Groups`: Search/pagination baseline restored, không saved role source hoặc staff assignment receiver; không thêm edge. `[Observed]` — `product-explore/auto-20261022-0714/ledger.md#7`.
- `Media Library`: root yêu cầu chọn patient; không owned patient/media, không selection hoặc receiver effect. `Outstanding Reviews`: empty queue và Date Range Cancel, không owned consultation/review. Exact intended label observed tại roots, chưa independently established là active-role header. `[Observed: dev]` — `product-explore/auto-20261022-0714/ledger.md#8–9,#12`.
- `Case Load Management / My Case`: navigation tới `/paco/patient-profile/:id/cases/:id`, không source mutation hoặc clinical readback; không phải two-sided business edge. Destination role/context chưa verified; Reports và Dashboard sau đó hiển thị `Config Admin`, không suy role access hoặc context cause. `[Observed / Open Question]` — `product-explore/auto-20261022-0714/ledger.md#10–12`.

### Super Admin GB breadth — 2026-10-22

- `Patient Search`: root/search/filter Cancel và reload reset chỉ transient same-feature UI; không saved patient source, không receiver probe. `Care Navigation` là submenu hint chưa mở, không thêm two-sided edge. `[Observed]` — `product-explore/auto-20261022-1001/ledger.md#3–7`, OQ-065/OQ-067.

- `Appointment Book`: calendar/search/filter là same-feature read-only flow; blank Quick Book chỉ map patient control, không owned source/receiver effect. Không thêm two-sided edge; saved fixture OQ-065 giữ pending. `[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1001/ledger.md#9–11`.

- `Comms Hub`: authenticated Campaign Manager/Outbox search/navigation đã observed trong external organisation context; không source campaign/recipient mutation hoặc receiver effect, external role unverified. Chỉ navigation giữa views, chưa thêm business edge. `[Observed / Open Question]` — `product-explore/auto-20261022-1001/ledger.md#13–14`.

- `Web Chat & Video`: verified Paco header và module Login gate chỉ navigation/auth boundary; chưa authenticated appointment body hoặc source/receiver effect, không thêm edge. `[Observed / Open Question: dev, Super Admin GB]` — `product-explore/auto-20261022-1001/ledger.md#15`, OQ-068.

- `Health Forms / Designer`: owned draft được discard, fresh list/reopen reset verified; không saved template source hoặc Inbox/V2 receiver effect. Không thêm edge. `[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1001/ledger.md#16`.

- `Role Groups`: current `Super Admin GB` root/search/paging chỉ same-feature read-only; không saved role source hoặc staff receiver effect. Không thêm edge. `[Observed]` — `product-explore/auto-20261022-1206/ledger.md#2`.

- `Health Forms / Designer` → `Designer V2`: current-role saved source có exact Active Title trước probe; V2 root/header và exact search verified nhưng không data rows sau loading indicator biến mất. Concurrent resource errors không đủ xác định nguyên nhân; relationship `Inconclusive`, không thêm observed edge. Source đã UI Archive sau probe; receiver archived visibility chưa biết. `[Observed / Open Question: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#11–13`, OQ-055.

- `Analytics & Reports / Reports`: current-role SCR/Patient Cases access gates chỉ permission/navigation states; không source report mutation, data row hoặc receiver effect. Không thêm two-sided edge. `[Observed / Open Question: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#15`, OQ-069.

- `Case Load Management / Work Boards`: current-role root/search/Filters chỉ same-feature UI states; không owned board source, clinical card hoặc assignment receiver. Không thêm two-sided edge; DEC-workboard-create giữ pending. `[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#16`.

- `Capacity & Demand`: date Cancel/Apply/reload/restore chỉ same-feature UI filter persistence; không business-record source/receiver effect hoặc two-sided edge. `[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#17–18`.

- `Patients / Care Navigation`: text/A-Z search và field selection/reset chỉ same-feature read-only states. Chưa chọn owned patient hoặc mở clinical navigator receiver; không thêm two-sided edge. `[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1414/ledger.md#2–3`, OQ-065.

- `User Portal`: guide categories/FAQ modules chỉ instructional content; Release Notes mở public tab là navigation boundary, không business source/receiver effect. Không thêm two-sided edge hoặc dùng FAQ làm permission authorization. `[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1414/ledger.md#4–5`.

- `Rocket Bar`: launcher menu trên source page, không launch client/download hoặc business receiver effect. Không thêm two-sided edge; OQ-070 chặn client workflow. `[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1414/ledger.md#6`.

- `Patient Analyser`: synthetic query apply/reload/reset là same-feature UI preference; không saved report source, Reference Report(s) selection hoặc comms receiver. Không thêm two-sided edge; grid-result correctness chưa xác lập. `[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1414/ledger.md#7–8`.

- `Appointment Book / book selector`: dialog/listbox là same-feature mapping, không chọn book, tạo owned source hoặc verify schedule receiver. Không thêm two-sided edge; search/close/reload còn gap sau budget/auth expiry. `[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1414/ledger.md#9–10`.

- `Appointment Book / selector search`: synthetic empty/clear, Close/reopen và unchanged selection reload chỉ same-feature view baseline; không owned source hoặc receiver effect. Không thêm two-sided edge. `[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1742/ledger.md#2`.

- `Care Navigation / A-Z results`: First Name+A và fresh Last Name+A populated, field-switch completion Inconclusive; chỉ same-feature search, không patient opened hoặc clinical receiver edge. `[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1742/ledger.md#4`.
- `Appointment Sessions source`: draft Frequency/Timed/Untimed/Keep editing/Discard verified; saved Session→schedule receiver chưa kiểm. Slot Type→Session picker là observed edge riêng phía trên, không từ unsaved draft suy saved propagation. `[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1742/ledger.md#5–6`.

- `Appointment Book / Quick Book` và `Work Boards`: draft/reset/filter lifetime, search modes và List/Card URL retention chỉ same-feature UI states; không new business source hoặc observed receiver effect. Không thêm two-sided edge, carried Session occurrence uncertainty và pending decisions giữ nguyên. `[Observed: dev, Super Admin GB, 2026-10-23]` — `product-explore/auto-20261023-0000/ledger.md#2–3`.

- `User Portal / guide-video-FAQ`: category viewer, native media pop-out và FAQ search/category reset là help-content/own UI navigation; không business record source/receiver effect. Module labels và instructional prose không tạo two-sided edge hoặc authorization; Scribe refusal giữ OQ-074. `[Observed: dev, Super Admin GB, 2026-10-23]` — `product-explore/auto-20261023-0000/ledger.md#5`.

- `Health Forms Designer / unsaved Preview`: component configuration và neutral answer/clear/reopen chỉ owned draft/presentation; không template/response Save hoặc clinical receiver. Không thêm two-sided edge; historical V2 uncertainty và retained records giữ nguyên. `[Observed: dev, Super Admin GB, 2026-10-23]` — `product-explore/auto-20261023-0000/ledger.md#8`.

## Patient Search → Profile — 2026-10-23

| From → To | Trigger | Observed effect | Classification | Evidence/ledger ref | Last verified |
|---|---|---|---|---|---|
| Patient Search owned registration/demographics → Patient Profile Dashboard | Create, Known As Save rồi Actions Profile | Source identity/updated field giữ sau list reload; receiver hiện đúng owned identity và Known As, actual Super Admin GB verified | Observed | `product-explore/auto-20261023-0223/ledger.md#3–4` | 2026-10-23 |

Một new two-sided edge; chưa clinical filing, booking/media receiver hoặc downstream Delete effect. Patient retained theo approval; historical Session occurrence uncertainty không đổi.

## Tester notes
