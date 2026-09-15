# Workflow: Case Load Management

- Classification: `[Observed: dev, Super Admin GB, 2026-09-15]`
- Aliases: `Unallocated`, `Case Workboards`, `Task Workboards`, `My Case`, `Work Boards`
- Coverage: `Partial`
- Confidence: `Medium`

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

## Tester notes
