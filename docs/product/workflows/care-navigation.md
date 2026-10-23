# Workflow: Care Navigation

- Classification: `[Observed: dev, Super Admin GB, 2026-10-22]`
- Aliases: `Care Navigation`, `Care Navigator`, `Patient Profile Search`, `A-Z Search`
- Coverage: `Partial (read-only)`
- Confidence: High cho entry/search modes; chưa verified clinical navigator body.

## Business context observed

- Visible purpose: tìm patient trước khi mở `Care Navigator`; instruction yêu cầu search rồi click icon `Care Navigator`.
- Actor/role: actual header `Super Admin GB` tại destination.
- Required context: authenticated Paco dev; clinical workflow cần approved owned patient fixture theo OQ-065.
- Starting state: blank text search, `Care Navigator` và `A-Z Search`.
- Entity: patient search result; không mở patient hoặc ghi clinical content.

## Entry

1. Sidebar `Patient Search` icon mở Patients submenu.
2. `Care Navigation` mở `/patient-search/?careRoute`.
3. Verify actual role header và landmarks `Patient Profile Search`, `Care Navigator`, `Search Patients...`.

## Read-only flow

1. Nhập synthetic query rồi `Enter`: query giữ trong text field, result summary render. Query có tiền tố `QA-test` vẫn có thể match records; không mặc định là empty fixture.
2. Random-letter synthetic query đã hiện exact `No Patients Found`; clear/reload khôi phục blank search.
3. Từ fresh blank root, `A-Z Search` thay text input bằng 26 letters và prompt `Please Select A Letter To Begin Search`.
4. Field selector mặc định `First Name`, options `First Name`/`Last Name`; chọn `Last Name` đổi visible field, chưa chọn letter.
5. Reload từ A-Z khôi phục text-search root trống, không expanded result panel hoặc dialog. Query flag `careRoute` giữ nguyên.

## Decision points

- Text search có populated summary hoặc `No Patients Found`; matching semantics chưa verified.
- `A-Z Search` cho chọn field trước letter; letter-result dataset chưa kiểm.
- Patient result tới clinical navigator chỉ là visible instruction/historical hint; chưa current-role receiver proof.

## End and exceptional states

- Final state: text-search root trống, actual role verified, 0 dialogs.
- Expanded search panel intercept `A-Z Search` click sau clear; `Escape`/click heading chưa đóng panel trong pass này. Fresh reload cho natural A-Z click; không force-hide DOM.
- Đọc text input sau A-Z transition bị timeout vì input đã được thay bởi A-Z view; không coi đó là navigation failure.
- Tool selector miss không chứng minh control absent; role-based locator hoạt động.

## Safety boundary và required test data

- Mutation `None`; chỉ search/mode selection/reload, không patient selection, registration, PDS, clinical writes hoặc Send.
- Clinical lifecycle chờ existing OQ-065 / `DEC-patient-fixture`; không reopen pending branch.
- Search tokens synthetic; không dựa existing patient làm test fixture. Không tạo record nên cleanup chỉ reset UI.

## Validation behavior và persistence

- Text input DOM `maxLength=50`; boundary truncation/server validation chưa thử.
- `Last Name` selection observed trong A-Z view; reload quay lại text-search baseline. Không saved business persistence verified.

## Cross-feature relationships

- Sidebar tới Care Navigation chỉ navigation; chưa có owned patient source/clinical receiver effect hai phía.

## A-Z letter-result experiment — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1742/ledger.md#4`; separate bounded pass, không cộng với historical 4/7.

- `First Name` + `A` có active letter và populated grid; chỉ headers/rendered-row count đọc, không patient details hoặc dataset correctness.
- Đổi sang `Last Name` rồi chọn cùng `A` từng giữ `Fetching results...`, không grid hoặc `No Patients Found` trong bounded wait; completion `Inconclusive`.
- Fresh reload, chọn `Last Name` trước letter `A` có populated grid và loading biến mất. Timing không ổn định, chưa xác định root cause hoặc product defect.
- Reload cuối trở về text query blank, không active letter/result grid/dialog, actual role verified. Không patient opened hoặc business mutation.
- Bounded coverage **2/3**: First Name+A và fresh Last Name+A `Performed`; same-letter field-switch completion `Skipped` vì chưa end state. Persistence chỉ UI baseline reset qua reload; cleanup `Done`. Clinical branches vẫn chờ OQ-065, không reopen decision.

## Mutation coverage

**4/7 bounded branches**, không inventory toàn clinical feature.

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Current-role root | Performed | Route/query variant, header và search landmarks | Reload baseline | Done |
| Text search / empty / clear | Performed | Populated summary với QA token, `No Patients Found` với random token, reset blank | Reload reset | Done |
| A-Z entry | Performed | 26 letters, prompt; text input replaced | Transient UI | Done |
| Field selection / reset | Performed | `Last Name` selected, reload text root | Reload reset | Done |
| A-Z letter results | Skipped | Deferred sau search-mode breadth | Chưa kiểm | N/A |
| Patient / Care Navigator handoff | Skipped | Không owned approved patient fixture, OQ-065 | Chưa kiểm | N/A |
| Clinical forms/save lifecycle | Skipped | Chưa owned source/receiver hoặc clinical scope | Chưa kiểm | N/A |

Validation chỉ attribute inspection; saved transitions, input boundary và clinical persistence chưa kiểm. Không business mutation; cleanup Done, 0 new records.

## Execution và automation guidance

- Scope `Search Patients...` riêng với global `Search...`; wait result summary hoặc `No Patients Found`.
- Verify settled actual header tại destination, không chỉ whole-page role text.
- A-Z thay DOM; không tiếp tục assertion trên text input cũ. Nếu expanded panel intercept, reconcile/reload baseline trước thử mode transition; không force-click.
- Không dùng historical role/ticket flow làm current clinical assertion. Matching rules, ordering, count accuracy và clinical intent cần trusted basis.

## Provenance and gaps

- Environment/role/date: dev, `Super Admin GB`, 2026-10-22.
- Evidence: `product-explore/auto-20261022-1414/ledger.md#2–3`, `care-navigation-observation.json`; raw scoped snapshots local dưới cùng run.
- Open question: OQ-065 patient fixture; clinical navigation, letter search và validation chưa kiểm.
- Resume: next independent branch theo frontier, không replay completed modes hoặc pending fixture.

## Tester notes
