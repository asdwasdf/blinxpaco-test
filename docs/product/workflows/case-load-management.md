# Workflow: Case Load Management

- Classification: `[Observed: dev, Super Admin GB, 2026-09-15]`
- Aliases: `Unallocated`, `Case Workboards`, `Task Workboards`, `My Case`, `Work Boards`
- Coverage: `Partial`
- Confidence: `Medium`

## Super Admin GB owned board draft — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0223/ledger.md#16–17`.

- `Create new board` mở `/paco/workboards/new-workboard`. Name, Assign Staff/Team, Board Owner, Organisation, Type, Add Actioned Cases, task permission, resolved-card interval, Home Visit, consultation template và Columns visible.
- Blank Save giữ form: name `String must contain at least 1 character(s)`, Board Owner và Type `Required`. Type có `Case`/`Task`; Case selected trên own draft.
- Board Owner search trả nhiều identities tên giống current account; chưa verified approved-email identity. Không chọn owner hoặc valid Save; Cancel trở `/paco/workboards`, 0 dialogs. Board retained được tester duyệt nhưng chưa tạo, không notification/leftover mới.

### Mutation coverage

**3/5 bounded branches**: blank required gate, Type Case draft và Cancel `Performed`; valid Create/reload và downstream case/board workflow `Skipped` vì owner identity/recipient chưa verified. Duplicate/server/boundary validation, saved transitions/persistence `Not Run`; 0 new relationships. Cleanup draft `Done`; bước tiếp xác minh account qua Staff Profiles UI, không sửa identity/email hoặc chọn owner chỉ dựa tên.

### Owner prerequisite follow-up

`[Observed: dev, Super Admin GB, 2026-10-23]` — `product-explore/auto-20261023-0223/ledger.md#18`: Staff Profiles `My Profile` email không khớp approved recipient; exact-email list search empty nhưng semantics chưa verified. Không chọn owner dựa tên, không valid Save/invite. Chờ identity mapping mới; không lặp same lookup hoặc sửa account email để vượt gate.

## Teams receiver availability — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0506/ledger.md#8–9`: owned Team source Create/Save/reload cho exact name trong fresh `Assign Staff/Team` treeselect; source rename/Save/reload cho edited name và old absent trong fresh picker. Một two-sided availability edge, không chọn team/owner hoặc Save board. Hai receiver branches Performed, saved assignment Skipped vì owner prerequisite chưa đổi; Cancel đóng cả hai drafts, cleanup Done.

## Business context observed

- Visible purpose: phân loại case chưa phân bổ, xem case/task theo board và xem case gắn với người dùng.
- Actor/role: `Super Admin GB` tại `General Practice (Blinx Demo Site)`.
- Required context: authenticated Paco session; organisation context; workboard data tải bất đồng bộ.
- Starting data state: `Unallocated` ban đầu báo `0`, sau chuyển `List View` tải `617` case; Task Workboards còn `Loading workboards...` tại capture; `My Case` blank.
- Entities and statuses: case, task, board, priority (`Mid Priority`, `High Priority`, `Low Priority`, `white`, `Emergency`), PDS validation, staff availability.

## Entry

1. Dashboard → `Case Load Management`.
2. Child routes: `/paco/unallocated`, `/paco/workboards?tab=case`, `/paco/workboards?tab=task`, `/paco/my-case`.
3. Stable landmarks: `Unallocated`, `Work Boards`, `View My Tasks Only`, `View My Cases Only`, `Search all boards`.

## Read-only flow

1. **Action:** mở `Unallocated`.
   - **Transition:** board view tải dữ liệu.
   - **Observed result:** heading ban đầu `Unallocated (0)` với `List View`, sort `Breaching (high to low)`, `Filters`, PDS legend.
   - **Evidence:** `test-results/product-survey/2026-09-15T04-26-30/01-unallocated-board.png`.
2. **Action:** chọn `List View`.
   - **Transition:** control đổi thành `Card View`; dữ liệu case xuất hiện.
   - **Observed result:** `Unallocated (617)` và priority tabs `All (617)`, `Mid Priority (508)`, `High Priority (17)`, `Low Priority (23)`, `white (1)`, `Emergency (68)`.
   - **Evidence:** `test-results/product-survey/2026-09-15T04-26-30/02-unallocated-list.png`.
3. **Action:** mở Task Workboards.
   - **Transition:** `Work Boards` shell hiển thị trước khi board list tải.
   - **Observed result:** `View My Tasks Only`, `View My Cases Only`, search modes `Board`/`Case ID`/`Patient`, counts `Tasks (0)`/`Cases (0)`, rồi `Loading workboards...`.
   - **Evidence:** `test-results/product-survey/2026-09-15T04-27-30/observations.json`.
4. **Action:** mở `My Case` và chờ body ổn định.
   - **Transition:** route đổi sang `/paco/my-case`.
   - **Observed result:** empty state `There are no new cases` và `You don't have any active case assigned to you`; đây là user-scoped case inbox, không phải render failure.
   - **Evidence:** `test-results/product-survey/2026-09-15T04-30-02/observations.json`.

## Decision points

- **Visible condition:** chọn presentation mode.
  - **Board state:** `List View` control.
  - **List state:** `Card View` control và priority counts đã tải.
- **Visible condition:** priority tab.
  - **Branches observed:** `All`, `Mid Priority`, `High Priority`, `Low Priority`, `white`, `Emergency`.
  - **Result after selecting each branch:** `Open Question` trong pass này.
- **Visible condition:** workboard search mode.
  - **Branches observed:** `Board`, `Case ID`, `Patient`.
  - **Search result behavior:** `Open Question`.

## End and exceptional states

- End state observed: read-only list of unallocated cases với priority totals.
- Empty/loading/error states: transient `Unallocated (0)` before list data; both Case Workboards and Task Workboards remained `Loading workboards...` after bounded waits under the current session; `My Case` has explicit no-new/no-active-case empty state.
- Cross-feature handoff: `Add to Board`, assignment và case/task actions nhìn thấy trong các survey trước nhưng không thực hiện.

## Safety boundary

- Last safe read-only state: list/card view, filter/sort/search/pagination, known `View` detail.
- Approval stop: `Create new case`, `Create new board`, `Add to Board`, assign/unassign, priority/status change, close, move, edit, send, archive hoặc unknown action.
- Actions not performed: toàn bộ mutation controls và staff `Set your status` choices.
- Mutation: `None`

## Execution guidance

- Setup/data: login role cần khảo sát; giữ đúng một browser tab; chờ counts/board list ổn định trước assertion; cần ít nhất một populated case board và task board.
- Safe manual steps: mở từng child route; đổi Card/List view; dùng filter/sort/search không lưu; mở known `View` detail khi có card.
- Stop and request approval before: mọi action thay đổi case/task/board hoặc staff availability.
- Evidence to capture: route, role/org, counts trước/sau load, selected board, priority/status, empty/loading/error state; redact patient identity.

## Automation guidance

- Stable roles/labels/landmarks: headings `Unallocated`, `Work Boards`; controls `List View`/`Card View`, `Filters`, `Board`, `Case ID`, `Patient`.
- Observable waits: không assert trên count `0` đầu tiên; đợi `Loading workboards...` biến mất hoặc stable empty/error state; tránh full-page screenshot khi fonts còn tải.
- Data dependencies: organisation có populated unallocated cases, case board và task board; board names/counts là environment data.
- Assertions lacking trusted expected basis: priority totals, nghĩa của `white`, expected breach behavior, auto-assignment/handoff, `My Case` content và mọi mutation result.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-15`.
- Raw evidence: `test-results/product-survey/2026-09-15T04-26-30/`, `test-results/product-survey/2026-09-15T04-27-30/`.
- Open questions: Case và Task Workboards đều không thoát `Loading workboards...` trong session hiện tại; business meaning của priority/PDS/breach chưa có trusted source; data condition đưa case vào `My Case` chưa được quan sát.
- Exact resume state: defer cả hai Workboards cho tới khi session/environment loading được làm rõ; không lặp lại cùng state. Tiếp tục workflow khác hoặc retry bằng session mới. Tránh chọn staff status.

## Discovery update run-20261001-085609

`Observed: dev, Super Admin GB, 2026-10-01`; autonomous discovery read-only, checkpoint `docs/product/survey/roles/super-admin-gb-run-20261001-085609.discovery.yaml`. Không có mutation; mọi điểm dưới đây là hành vi hiện tại, chưa đối chiếu requirement.

- Entry: sidebar `Case Load Management` mở submenu `My Case`, `Unallocated`, `Case Workboards`, `Task Workboards`.
- `My Case` (`/paco/my-case`) empty: `There are no new cases`; workflow có dữ liệu cần case được giao (data dependency).
- `Unallocated` (`/paco/unallocated`): `Unallocated (0)`, sort `Breaching (high to low)`, `List View`, `Filters` mở sidebar (`Clear all`, `Cancel`, `Save`).
- `Task Workboards` → `/paco/workboards?tab=task` (`Tasks (0)`, `Cases (0)`); `View My Cases Only` điều hướng sang board `/paco/workboards/<id>`; `Case Workboards` mở `Master Case Board` với cột `Awaiting patient validation`.
- Approval stop: `Create new case`, `Create new board`, `Filters > Save` (persistence chưa rõ).
- Gap: `Loading workboards...` còn hiện lúc 3.5s; chưa phân biệt empty với tải chậm.

## Autonomous Work Boards — 2026-10-22

`Observed: dev, intended Blinx Deployment; destination role/context chưa verified`; evidence `product-explore/auto-20261022-0714/ledger.md#10–12`. Chỉ mở form blank rồi `Cancel`, không submit hoặc tạo business record; sau đó Reports và Dashboard hiển thị `Config Admin`, thời điểm/nguyên nhân context khác chưa rõ.

- Entry: sidebar `Case Load Management` mở submenu `My Case`, `Unallocated`, `Case Workboards`, `Task Workboards`.
- `Case Workboards` (`/paco/workboards?tab=case`) auto-select board có sẵn → `/paco/workboards/:id`.
- Controls: search mode `Board`/`Case ID`/`Patient`, Board name field, counts `Tasks`/`Cases`, `Create new board`, `Search this board`, List/Card view toggle, `Filters`.
- `Create new board` mở form blank tại `/paco/workboards/new-workboard`: fields `Assign Staff`/`Team`, `Board Owner`, `Organisation`, `Type`, `Add Actioned Cases`, `Permission for users to create tasks`, `Display resolved cards for`, `Home Visit Board`, `Default Consultation Template`, `Columns`. `Save` và `Cancel` enabled; không bấm `Save`.
- `Type` dropdown mở options `Case`/`Task`; không chọn, không nhập name, không Save.
- `Cancel` đóng form, list auto-select board khác có sẵn; form absent sau đó.
- `My Case` submenu handoff tới `/paco/patient-profile/:id/cases/:id`; rời ngay không đọc clinical content/actions. Historical empty `My Case` khác 2026-09-15 và 2026-10-01; giữ cả hai provenance, không kết luận rootcause data condition.
- Bounded branches performed: 3/9 (root, blank form `Type`/`Cancel`, `My Case` handoff); 6 skipped (search, view toggle, `Filters`, saved create/readback, board update/cleanup, assignment/case/task lifecycle).
- Không thấy saved persistence/validation/two-sided relationship. Scoped cleanup/private/default visibility unknown; create class là `unknown-scope`, không reuse shared-list/staff rootcause từ feature khác.
- Mutation coverage: `Create new board` form opened nhưng không submit; `Cancel` reverted, không business record. Decision `DEC-workboard-create` cho main workflow.
- Open question `OQ-066`: safe owned new board fixture, visibility/notification/write footprint/cleanup behavior.

## Mutation coverage

| Nhánh/candidate | Thực hiện | End state hoặc lý do |
|---|---|---|
| Submenu / Work Boards root | `Performed` | Existing board tự được chọn; destination role/context chưa verified |
| Blank new-board form / Type options / Cancel | `Performed` | `Case`/`Task` visible, không chọn hoặc nhập; Cancel đóng form |
| My Case navigation | `Performed` | Tới redacted patient-case route; không đọc clinical content/action |
| Board search | `Skipped` | Chưa thử trong bounded breadth |
| List/Card view | `Skipped` | Chưa thử trong bounded breadth |
| Filters | `Skipped` | Chưa mở/chưa Save |
| Saved create/readback | `Skipped` | `DEC-workboard-create` pending, unknown scope |
| Board update/cleanup | `Skipped` | Không owned saved board |
| Assignment/case/task lifecycle | `Skipped` | Existing/shared clinical data không trong mutation scope |

3/9 bounded nhánh có end state, context-unverified; không gán access cho role `Blinx Deployment`. Validation chưa thử; business state transitions/persistence và two-sided relationships `Not Run`. Cleanup unsaved form `Done`, business records `N/A`, không leftovers. Reverify exact role trước tiếp main workflow.

## Super Admin GB Work Boards breadth — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#16`. Current-role bounded pass riêng với historical context-unverified pass.

- Known `/paco/workboards?tab=case` auto-select existing board tại `/paco/workboards/:id`; actual role header và `Work Boards` verified. Root có `Board`/`Case ID`/`Patient`, `Board name`, `Search this board`, `View My Tasks Only`/`View My Cases Only`, counts `Tasks`/`Cases`, `Create new board`, `Filters`.
- Synthetic `Board name` search cho Tasks/Cases zero và board list không rows; `Clear search` khôi phục populated sidebar, query blank. Chỉ UI search state, chưa kiểm dataset/count accuracy hoặc saved board.
- `Filters`: `Age`, `Incoming Service`, `Pathway`, `Skills`, `Priority`, `Case Status`, `PDS Validated Status`; unchanged `Save` disabled. `Cancel` không edit đóng panel; reload giữ blank searches/closed panel. Không filter `Save`.
- `Case score updates are delayed.` từng hiện trên populated board; early post-reload check không thấy notice không đủ chứng minh resolved. Chưa triage scoring/console causality; không patient card/clinical content inspected.
- `DEC-workboard-create`/OQ-066 giữ pending, không reopen create form hoặc retry shared prerequisites. Không assignment/status/priority/write, My Case hoặc patient handoff.

### Mutation coverage

| Nhánh | Thực hiện | End state / persistence / lý do | Cleanup |
|---|---|---|---|
| Current-role Work Boards root | `Performed` | Auto-selected populated board, actual header verified | `Done`: không record |
| Synthetic Board search / Clear search | `Performed` | Tasks/Cases zero rồi populated list restored | `Done`: query blank |
| Unchanged Filters / Cancel | `Performed` | Panel/disabled Save, Cancel/reload closed | `Done`: baseline reload |
| Current-board search / Case ID / Patient modes | `Skipped` | Chưa exercise trong bounded pass | `N/A` |
| List/Card presentation | `Skipped` | Chưa xác lập toggle target/end state | `N/A` |
| Saved board create/readback | `Skipped` | DEC-workboard-create pending | `N/A` |
| Board update/cleanup | `Skipped` | Không owned saved board | `N/A` |
| Assignment/case/task/clinical lifecycle | `Skipped` | Existing/shared clinical data ngoài mutation scope | `N/A` |

**3/8 bounded branches**, `Partial (read-only)`. UI baseline qua reload verified; input/domain validation, business transitions/persistence và two-sided relationships `Not Run`; không mutation hoặc leftover. Counts là environment observations, không trusted expected result.

## Independent search modes và presentation — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0000/ledger.md#3`. Pass riêng với historical 3/8 current-role và 3/9 context-unverified; không cộng denominators.

- `Search this board` với synthetic query có helper `Nothing on this board matches [query]. Search all boards by patient or case ID.` Clear query đưa field về blank và helper gone. Đây current-board no-match UI, chưa matching accuracy trên known owned case.
- Sidebar `Case ID` mode đổi active marker và input thành `Case ID`; `Patient` mode thành `Patient name`. Synthetic query/Enter retained nhưng không recognized result copy trong bounded wait; Patient sidebar counters về zero. Query completion/matching correctness còn `Inconclusive`; đổi mode/clear và restore `Board` verified.
- Baseline `Card view`; `List view` đổi active presentation marker và URL có `?view=list`, giữ qua reload. Chưa tách URL-driven state khỏi saved preference. Restore `Card view`, reload không còn `view` query; actual role, `Board`, blank searches và original presentation verified.
- `Set your status` reappears sau reload; `Remind me later` dismiss mà không chọn colleague-visible status. Presentation script timeout ở restoration do modal intercept; separate guarded cleanup verified, không replay full script hoặc force click.
- Không clinical card/record selection, assignment/status update, new board, business mutation hoặc two-sided relationship. `DEC-workboard-create` và OQ-066 không đổi.

### Mutation coverage

| Nhánh | Thực hiện | End state / persistence / lý do | Cleanup |
|---|---|---|---|
| Current-board synthetic no-match / clear | `Performed` | Exact scoped helper rồi blank/helper gone | `Done` |
| Case ID mode / query clear | `Performed` | Mode/input đổi, own query cleared | `Done` |
| Patient mode / query clear | `Performed` | Mode/input đổi, zero sidebar counters rồi own query cleared | `Done` |
| List/Card presentation / reload / restore | `Performed` | List marker và URL retained; Card baseline verified sau reload | `Done` |
| Case ID matching completion | `Skipped` | `Inconclusive`: chưa recognized result completion | `N/A` |
| Patient matching completion | `Skipped` | `Inconclusive`: zero counters không chứng minh matching correctness | `N/A` |

**4/6 independent bounded branches**, `Partial (read-only)`. Native Case ID input không có required/pattern/min/max constraint; domain validation và business transitions/persistence `Not Run`. Persistence chỉ own presentation URL/UI lifetime; final blank searches, `Board`/Card baseline và closed dialogs/drawers verified. Không new records/leftovers; carried Session occurrence uncertainty không được giải quyết bởi pass này.

## Cross-feature relationships

`[Observed]` Search modes và List/Card là same-feature UI states; không source mutation hoặc observed receiver effect nên không thêm two-sided edge. — `product-explore/auto-20261023-0000/ledger.md#3`.

## Tester notes
