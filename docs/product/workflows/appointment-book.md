# Workflow: Appointment Book (PACO Connect)

- Classification: `[Observed: dev, Super Admin GB, 2026-10-22]` cho current-role breadth; pass `Blinx Deployment` và lịch sử ticket giữ scope riêng.
- Aliases: `Appointment Book`, `Appt. Book`, `PACO Connect`, `Appointment Settings`, `Session`, `Slot`
- Coverage: `Partial (read-only)` — Super Admin GB breadth 7/15, selector boundary 1/4 và later selector search/baseline 4/7 giữ riêng; Blinx Deployment 4/15, chưa saved booking lifecycle.
- Confidence: `Medium` cho root/forms/view hiện tại; ticket/feature-branch không tự áp vào dev hiện tại.

File tạo ngày 2026-10-02 để gom logic ticket; bổ sung autonomous breadth ngày 2026-10-22. Route và landmark xem `docs/product/feature-map.md` (module `Appointment Book (PACO Connect)`).

## Autonomous breadth (2026-10-22)

### Location, actor và entities

- `[Observed]` Role `Blinx Deployment` mở trực tiếp `/paco-connect/appointment-book`; toolbar có `Day`, `Week`, `Month`, `Year`, `Previous`, `Next`, `Go to today`, `Quick Book`, `Filters`, `Group Send`, `Export`. Chờ role và `Loading your appointment data` biến mất; document HTTP `404` vẫn render root usable. — `product-explore/auto-20261022-0236/ledger.md#12`.
- `[Observed]` `Day` ban đầu active; có session/slot structure, summary `Sessions`, `Booked`, `Available`, page search `Search patients, NHS number, clinicians, times...` tách global search. Summary chưa đối chiếu detail; book selector chưa xác định trong pass này. — `ledger.md#12,#15` cùng run.
- `[Observed]` Navigation/search/filter/view là read-only. `Quick Book` đã mở form, chưa submit; `Find Appointment` chỉ là gate đã quan sát, chưa chứng minh tạo booking. `Group Send` (`SEND`) và `Export` (`DOWNLOAD`) mới thấy control, chưa bấm. Saved booking/update/cancel/session-slot edit là candidate từ lịch sử, chưa reverify entry hiện tại. — `ledger.md#12–15`.

### Required test data và safety boundary

- `[Open Question]` Saved booking cần patient synthetic do run sở hữu, slot/session owned và cleanup an toàn. `DEC-patient-fixture` / OQ-065 đã pending; không dùng patient, booking hoặc shared slot có sẵn làm fixture. Không retry dependency trước khi tester trả lời. — `ledger.md#14–15`.
- `[Observed]` Pass này chỉ đổi view/filter selection và query synthetic; không tạo appointment/session/slot, không chọn patient, không `Find Appointment`, `Group Send` hay `Export`. — `ledger.md#13–15`.

### Interactive flow observed

1. `[Observed]` Từ root đã load, mở `Filters`: drawer role `complementary`, không phải dialog. `All Appts` checked, `My Appts` unchecked; có `Reset all`, hai `Deselect all`, `Close`. — `ledger.md#13`.
2. `[Observed]` Filter groups gồm `Booked`, `Available`, `Non-Bookable`; các status `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled`; accordions `Healthcare Professional`, `Patient`, `Appointment Type`, `Slot Type`, `Session Name`, `Location`. Chỉ map labels, chưa chọn status/accordion option. — `ledger.md#13`.
3. `[Observed]` Chọn `My Appts`, đọc checked state, chọn lại `All Appts`, xác minh `My Appts` unchecked rồi `Close`. Dataset filtering correctness và saved preferences chưa kiểm. — `ledger.md#13`.
4. `[Observed]` `Quick Book` mở dialog có `Select Patient`, `Search patients...`, `Within Organisations Hierarchy` unchecked và search sessions/slot types/clinicians/campaigns/locations. Footer `Reset` enabled, `Find Appointment` disabled khi chưa chọn patient. — `ledger.md#14`.
5. `[Observed]` Query patient synthetic đã nhập nhưng không có settled empty-result proof; không chọn result. Clear query rồi `Close` đưa về root, không booking. — `ledger.md#14`.
6. `[Observed]` `Day` sang `Week` đổi query `viewAs=week`; về `Day` đổi `viewAs=agenda`. Loading hidden, root search trống, Filters và Quick Book đóng sau restore. — `ledger.md#15`.

### Validation, states và persistence

| Nhánh | Đã thử | Quan sát | Giới hạn |
|---|---|---|---|
| Blank Quick Book | Mở form, không chọn patient | `Find Appointment` disabled | Chưa xác định toàn bộ required fields hoặc server validation |
| Patient search | Query synthetic, chờ empty state | Không có recognized empty message/ARIA option; action vẫn disabled | Kết quả `Inconclusive`, không chứng minh no-match hoặc defect |
| All/My view | Chọn rồi restore | Checked state phản ánh và trở lại baseline | Không chứng minh dataset hay persisted preference |
| Day/Week | Chuyển rồi restore | Active view và URL query đổi | Không saved business persistence hoặc count correctness |

`[Observed]` — `product-explore/auto-20261022-0236/ledger.md#13–15`. Không saved mutation; cleanup chỉ query/filter/view vừa đổi.

### Cross-feature relationships

- `[Observed / Open Question]` Quick Book có patient search, nhưng chưa có owned saved patient và chưa booking; không đủ source/receiver evidence cho two-sided edge với Patient Search/Profile. Dùng OQ-065 hiện có cho patient dependency. — `ledger.md#14–15`.
- `[Unverified hypothesis]` Session/slot configuration và communications có thể cấp context hoặc consume booking; chưa probe receiver trong pass này. — `ledger.md#11,#15`.

### Anomalies và unverified behavior

- `[Observed]` Normal entry click có actionability timeout trước dispatch; read-only kiểm visible/enabled/center hit trước guarded forced entry, form render bất đồng bộ. Đây automation observation, chưa product defect. — `ledger.md#13–14`.
- `[Open Question]` Chưa kiểm book selector, selected filter dataset, Month/Year/date navigation, root search; chưa booking/readback/edit/reschedule/cancel/status/session-slot changes, send/export hoặc audit/profile handoff. Historical defects bên dưới chưa retest trong run này. — `ledger.md#15`.

### Execution guidance

Dùng dev host đã cấu hình, role visible và loaded root. Chỉ read-only branch độc lập khi patient fixture còn pending; restore đúng selection/view trước khi rời màn. Booking hoặc status/session-slot mutation phải có owned target, runtime gate, ledger và UI cleanup đã xác định; không lấy real/shared record để mở khóa flow.

### Automation guidance

- `[Observed]` Scope Filters bằng heading trong `complementary`; scope Quick Book bằng dialog chứa `Search patients...`. Global dialog count và immediate return sau click không đủ xác nhận form đã mở. — `ledger.md#13–14`.
- `[Observed]` Chờ actual active view/loading/role; không assert navigation thất bại từ HTTP `404`. Query `viewAs` hỗ trợ view readback, không thay persistence proof. — `ledger.md#12,#15`.
- `[Open Question]` Patient search thiếu settled-result landmark; không assert no-match bằng 0 ARIA options. Không assert current count, booking status hoặc historical defect nếu chưa fixture và basis đáng tin. — `ledger.md#14–15`.

## Super Admin GB breadth — 2026-10-22

`[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1001/ledger.md#9–11`. Coverage độc lập với pass `Blinx Deployment` phía trên.

### Location, workflow và dữ liệu

- Direct route `/paco-connect/appointment-book` render root, actual header exact role và organisation đã chọn; document HTTP `404` không ngăn UI load. Baseline `Day`, page search blank, date hiện tại; `Appt. Book` selector visible nhưng chưa mở.
- Entities/controls đã map: calendar, sessions/slots, summary, book selector, search, `Filters`, `Quick Book`, `Group Send`, `Export`. Calendar/search/filter là read-only; booking/session-slot thay đổi là mutation candidate, send/export cần owned-data scope.
- Chỉ synthetic query; không chọn patient, book hoặc shared schedule record. Saved booking giữ `DEC-patient-fixture`/OQ-065 và prerequisite owned slot/session, cleanup; không retry dependency pending.

### Interactive flow, validation và persistence

1. `Day` → `Month` render table `Month View`, month heading và `Go to this month`; `Year` render month-calendar buttons và `Go to this year`. Chọn October từ Year mở Month October, chuyển `Day` chọn ngày đầu tháng.
2. `Previous` lùi một ngày, `Next` trở lại; `Go to today` restore baseline. `Week` rồi `Day` đổi active view và query `viewAs`; chưa kiểm aggregate/count correctness.
3. Root search synthetic có `No available sessions.` và zero summary; clear phục hồi schedule. Không dùng patient/NHS data.
4. `Filters` là complementary drawer; `All Appts` → `My Appts` → `All Appts` có checked end states. Reload/reopen vẫn baseline All; selected dataset correctness và preference persistence chưa được phân lập.
5. Blank `Quick Book Appointment` có patient search, session/slot/appt type/clinician/Email & SMS/location/date preferences; `Find Appointment` disabled. Không chọn option, không submit; đóng về root.
6. Final reload/readback: role đúng, `Day`, date baseline, search blank, drawer/dialog đóng, schedule hiện. Không saved business persistence hoặc error-message validation.

### Relationships, anomalies và guidance

- Patient search trong Quick Book chỉ source-side control; không owned patient/booking hoặc receiver effect, chưa thêm two-sided relationship.
- Drawer Close có outside-viewport automation error trong animation; chỉ reconcile current drawer, đợi enter-done rồi đóng. Script batch trước lỗi là incomplete diagnostic, không passing cleanup test.
- Execution: reuse verified route, chờ actual header/loading/active view; giữ baseline view/date/query/All Appts. Booking, session-slot, send/export không dùng existing data để vượt fixture gate.
- Automation: scope main search bằng exact placeholder, Quick Book bằng named dialog, Filters bằng complementary; chờ `Month View`/active calendar mode và settled empty message, không chỉ query URL. Count semantics và saved lifecycle cần trusted basis/owned fixtures.

## Super Admin GB book-selector boundary — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1414/ledger.md#9–10`; later independent pass, không cộng vào 7/15 của run1001.

- Loaded root và actual header verified; `Appt. Book` mở dialog `Select Appointment Books`, có textbox `Search appointment books` (placeholder `Search appointment books...`), listbox `Appointment books`, sections `Selected`/`Other books` và `Close`. Có selected option; không chọn/bỏ chọn existing book hoặc đọc schedule/patient details.
- Chỉ open/map selector; chưa thử search/empty/clear, close/reopen hoặc selection persistence. Khi resume đã quá deadline gốc và browser ở `Login`, picker absent; không recovery hoặc tiếp tục branch trong run hết budget.
- Không query/selection change hoặc business record được tạo; owned-data cleanup `Done`, không leftovers. Authenticated selector baseline/reload verification `Inconclusive`, không coi picker absent tại Login là close/persistence proof.
- Execution: sau auth helper và actual-role check trong run mới, mở picker, giữ selection baseline chỉ trong script memory, search synthetic token rồi clear và `Close`; không click option/shared schedule. Chờ end state thật, không giả định zero options luôn là empty result.
- Automation: scope named dialog/textbox/listbox; prepared `appointment-selector.js` mới syntax-checked, chưa chạy nên không dùng làm result. Search/filter correctness, domain validation và saved business persistence `Not Run`.
- Cross-feature: chỉ mapped same-feature selector; không owned Appointment Book source hoặc schedule receiver effect, không thêm two-sided edge.

## Super Admin GB selector search và baseline — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1742/ledger.md#2`; independent later pass, không cộng với denominators trước.

- `Select Appointment Books` có search/listbox, selected/unselected options, status selected count, `Close`, `Cancel`, `Done`. Đợi selected option settled trước lấy baseline; immediate count sau open từng trả 0 rồi thành 1, không là mất selection.
- Synthetic search không match hiện exact `No appointment books found`, listbox không còn option nhưng status vẫn `1 selected`; clear khôi phục list và exact original selection. Search visibility không đồng nghĩa deselection.
- `Close` rồi reopen giữ search blank và selection cũ; reload loaded root/actual role rồi reopen vẫn cùng selection và blank query, cuối cùng đóng picker. Chỉ unchanged baseline retention, không verification persistence của selection mới hoặc saved business record.
- Không click book option, `Done` hoặc `Cancel`; matching-search correctness, changed-selection Apply/Cancel và domain validation `Not Run`. Cleanup `Done`, không business record/leftover hoặc two-sided edge mới.
- Execution/automation: scope named dialog, wait selected option/loaded root; giữ original labels trong memory để so equality, không lưu shared book names. Chỉ dùng exact empty message cộng query/list/status để phân biệt empty state với render delay; restore query trước Close.

## Quick Book draft và filter lifetime — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0000/ledger.md#2`. Independent pass, không cộng historical breadth/selector denominators.

- `Quick Book Appointment` có patient search, hierarchy scope và preference panels. `Find Appointment` disabled khi chưa chọn Patient, Slot Type và Email & SMS; tooltip nêu ba prerequisites, chưa server validation.
- Synthetic random-letter patient query giữ trong input sau debounce và `Enter`, nhưng không recognized empty/result end state trong bounded waits; search completion `Inconclusive`. `Clear search` đưa input về blank, clear control biến mất; không lấy 0 ARIA options làm no-match proof.
- Footer `Reset` giữ synthetic patient query và checked `Within Organisations Hierarchy` trong attempt đã kiểm. `Close` rồi mở lại đưa query về blank và hierarchy unchecked; đây transient draft discard, không saved patient/booking persistence.
- `Clinician Gender` có `Male`, `Female`, `I don't mind`, ban đầu `aria-checked=false`. Chọn `Male` có checked true; `Reset` xóa preference selection, cả ba false. Reset selection khác search/scope lifetime; intended contract chưa xác lập.
- Filters: bỏ đúng `Booked` giữ unchecked qua Close/reopen; reload khôi phục exact original status signature và `All Appts`. Final fresh reload/reopen giữ baseline, dialog/drawer đóng. Không kiểm dataset accuracy hoặc storage mechanism.
- Execution: Quick Book search và enum preference chỉ own unsaved view; không chọn existing patient/session/slot/clinician, `Find Appointment`, send/export hoặc shared Save. Filter selected marker nằm ở child checkbox class, không outer button ARIA.
- Một console resource 404 ở final reload không xác lập nguyên nhân search/Reset. Không business mutation/new record hoặc cross-feature edge; carried Session occurrence OQ-073 không liên quan và chưa resolved.

### Mutation coverage — draft/filter pass

**5/6 bounded branches**, `Partial (read-only)`.

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Synthetic query / Clear search | Performed | Query retained, Clear blank và button absent | Transient input | Done |
| Query + hierarchy / Reset | Performed | Both unchanged sau Reset | No saved state proof | Done qua Close/reopen |
| Gender preference / Reset | Performed | Male checked rồi cả ba false | Transient selection | Done |
| Close / reopen draft | Performed | Blank query, unchecked hierarchy, Find disabled | Fresh form default | Done |
| Booked criterion retention / restore | Performed | Unchecked retained qua reopen; reload exact baseline | UI reset after reload | Done |
| Patient search no-match completion | Skipped | `Inconclusive`: no recognized result/empty end state | Not Run | Done — query clear/discard |

Validation chỉ disabled gate; duplicate/format/server và saved booking transitions untested. Dimensions: navigation `done`; main_workflow, branches_states, validation, persistence, errors_edge `partial`; mutation/relationships `none`. Matching correctness, Reset intended scope và changed preference server persistence chưa established.

## Cross-feature relationships

- `[Observed: dev, Super Admin GB, 2026-10-22]` `Appointment Books source` → `Select Appointment Books`: owned Create xuất hiện unselected; rename thay original bằng edited; Archive làm cả hai absent trong fresh picker với `No appointment books found`. Selection baseline unchanged, query cleared và picker đóng; không booking/clinical relationship. Một unique relationship với ba trigger observations. Source lifecycle xem `appointment-books-settings.md`; evidence `product-explore/auto-20261022-1742/ledger.md#3`.

- `[Observed: dev, Super Admin GB, 2026-10-22]` Later prerequisite pass reverify owned Book Archive→selector absence bằng exact `No appointment books found`; settled selection unchanged, query cleared và dialog closed. Không chọn book/`Done`, không independent generated Session occurrence cleanup proof; OQ-073 giữ `Inconclusive`. — `product-explore/auto-20261022-2011/ledger.md#4`.

## Mutation coverage

### Blinx Deployment — historical autonomous pass

Map giới hạn 15 nhánh/candidate từ UI hiện tại và lịch sử đã đánh dấu; không khẳng định tất cả action còn supported trên current role/build. `Performed` chỉ khi đã thấy end state. `[Observed]` — `product-explore/auto-20261022-0236/ledger.md#13–15`.

| Nhánh | Trạng thái | End state / lý do chưa chạy | Persistence / cleanup |
|---|---|---|---|
| Filters open/close | Performed | Drawer đóng | Không saved persistence; Done |
| All/My/All selection | Performed | Baseline `All Appts` restored | Dataset/persistence chưa kiểm; Done |
| Blank Quick Book gate/close | Performed | `Find Appointment` disabled, dialog đóng | Không saved draft; Done |
| Day/Week/Day | Performed | `Day` active, loading hidden | URL state only; Done |
| Quick Book patient search | Skipped | Đã thử, thiếu settled result/end state | Query cleared; Done |
| Selected filter/data correctness | Skipped | Chỉ map/current selection branch | N/A |
| Month/Year/date navigation | Skipped | Visible controls, breadth chưa chạy | N/A |
| Root search/clear | Skipped | Chỉ thấy input | N/A |
| Owned booking/create readback | Skipped | OQ-065; owned slot và cleanup chưa đủ | N/A |
| Owned edit/reschedule/cancel | Skipped | Historical candidate, current entry và owned booking chưa có | N/A |
| Attendance/status transitions | Skipped | Historical candidate; filter labels không là mutation proof | N/A |
| Session/slot edit | Skipped | Historical candidate, chưa owned target/cleanup | N/A |
| Group Send | Skipped | Chưa owned booking/recipient scope | N/A |
| Export | Skipped | Chưa giới hạn export vào owned data | N/A |
| Patient/profile handoff | Skipped | Historical candidate, chưa owned source | N/A |

Tổng: **4/15** nhánh/candidate có end state, **0** saved mutations với verified persistence, **0** two-sided relationships. Validation mới blank-form gate; saved validation/transitions vẫn untested. Coverage: navigation `done`; main workflow, branches/states, validation `partial`; mutation, persistence, relationships, errors/edge `none`. Cleanup Done, không leftover mới. — `ledger.md#15`.

### Super Admin GB — current autonomous pass

`[Observed: dev, Super Admin GB, 2026-10-22]` — `product-explore/auto-20261022-1001/ledger.md#9–11`. Bounded map hiện tại 15 nhánh; không cộng coverage role khác.

| Nhánh | Trạng thái | End state / lý do chưa chạy | Persistence / cleanup |
|---|---|---|---|
| Calendar mode cycle | Performed | Month, Year, Week và restored Day observed | Reload baseline Day; Done |
| Year → Month drilldown | Performed | October control mở Month October | View only; Done |
| Previous / Next / Today | Performed | Date đổi và baseline trở lại | View only; Done |
| Root search / clear | Performed | Settled empty rồi schedule phục hồi | Blank sau reload; Done |
| Filters open / close | Performed | Drawer đóng | Done |
| All / My / All | Performed | Checked selection restored | All sau reload, dataset chưa kiểm; Done |
| Blank Quick Book gate / close | Performed | Find Appointment disabled, dialog đóng | Không saved draft; Done |
| Book selector | Skipped | Chỉ map control | N/A |
| Selected filter criteria / dataset | Skipped | Breadth gate; chưa apply criteria | N/A |
| Quick Book patient search | Skipped | Blank gate đủ cho pass, chưa thử query | N/A |
| Owned booking create / edit / cancel | Skipped | Pending patient fixture; owned slot/cleanup chưa map | N/A |
| Session / slot mutation | Skipped | Chưa owned target | N/A |
| Group Send | Skipped | Chưa owned booking/recipient scope | N/A |
| Export | Skipped | Chưa giới hạn owned data | N/A |
| Patient / profile handoff | Skipped | Chưa owned source | N/A |

Tổng **7/15**, `Partial (read-only)`; **0** saved business mutations/persistence, **0** two-sided relationships. Navigation `done`; main workflow, branches/states, validation, transient persistence và errors/edge `partial`; mutation/relationships `none`. Validation mới blank disabled gate; saved transitions và count correctness untested. Cleanup Done, không leftover mới.

### Super Admin GB — later independent selector pass

`[Observed]` — `product-explore/auto-20261022-1414/ledger.md#9–10`. Bounded map **1/4**, không whole-feature inventory và không cộng với previous run.

| Nhánh | Trạng thái | End state / lý do chưa chạy | Persistence / cleanup |
|---|---|---|---|
| Selector open / map | Performed | Named dialog/search/listbox/sections render | Không thay query/selection; owned-data cleanup Done, final picker absent tại Login |
| Synthetic search / empty / clear | Skipped | Budget hết trước execution; prepared script chưa chạy | N/A |
| Close / reopen baseline | Skipped | Auth expired trước verification, không click Close | N/A |
| Selection / reload persistence | Skipped | Không chọn existing/shared book; auth/budget không cho verify baseline | N/A |

Navigation/branches `partial` trong pass riêng; mutation, validation, persistence, relationships `none`; không đổi coverage dimensions từ prior breadth. Main booking workflow vẫn pending fixture, domain lifecycle `Not Run`.

### Super Admin GB — selector search và unchanged baseline pass

`[Observed]` — `product-explore/auto-20261022-1742/ledger.md#2`. **4/7 bounded branches**, không cộng coverage các run/role khác.

| Nhánh | Trạng thái | End state / lý do chưa chạy | Persistence / cleanup |
|---|---|---|---|
| Selector open / map | Performed | Search/listbox/selection status và Close/Cancel/Done visible | Transient UI; Done |
| Synthetic empty search / clear | Performed | Exact empty message; clear khôi phục list/selection | UI reset; Done |
| Close / reopen | Performed | Query blank, original selection unchanged | Reopen baseline; Done |
| Unchanged selection reload | Performed | Loaded root và fresh picker giữ baseline/query blank | Baseline retention only; Done |
| Matching search correctness | Skipped | Chưa có owned source/book fixture | N/A |
| Changed selection / Done | Skipped | Không chọn existing/shared book trong pass | N/A |
| Changed selection / Cancel | Skipped | Không thay selection; không thử Cancel | N/A |

Navigation/branches/persistence `partial` trong pass; persistence chỉ unchanged UI baseline, không saved change. Mutation/validation/relationships `none`, 0 business records/leftovers; booking lifecycle vẫn chờ prerequisite riêng.

## Business context observed (lịch sử ticket)

- Visible purpose: xem lịch theo ngày/tuần/tháng/năm, đặt/hủy appointment, cấu hình `Session` (template → child session) và `Slot`. `[Observed]` — PAC2-7137/exploration.md, PAC2-8552/exploration.md
- Actor/role: `Super Admin GB` (7786, 8241, 8384, 8552, 7137); ticket 7137 nhắc `Config Admin` chưa xác nhận. `[Observed]` — PAC2-7137/status.md, PAC2-7786/automation.md
- Môi trường: nhiều route trả document HTTP `404` hoặc redirect qua role selection nhưng SPA vẫn render; chờ `Loading` biến mất thay vì assert response đầu. `[Observed]` — PAC2-8241/exploration.md, PAC2-8384/status.md, PAC2-8552/status.md, PAC2-7137/exploration.md
- Feature branch dùng prefix `/paco-connect/feature-branch/<ticket-branch>/...`; URL thiếu prefix không phải môi trường chứa fix. `[Observed]` — PAC2-7786/status.md, PAC2-8241/requirements.md
- Hầu hết ticket thiếu `Acceptance criteria` chính thức (7786, 8241, 8384, 8552); expected lấy từ Description/comment. `[Confirmed]` — các `requirements.md`

## Logic từ ticket

Dedupe từ 6 ticket (`PAC2-7137`, `PAC2-7786`, `PAC2-8241`, `PAC2-8384`, `PAC2-8552`, phần cấu hình session). Kết quả Pass/Fail là manual execute của từng ticket, có thể gắn feature branch chứ không phải dev main.

### Count summary Day/Week

**Luồng**
1. Mở `Appointment Book` → `Day` hoặc `Week` view; header hiện `Sessions`, `Booked`, `Available`, `LIVE`. `[Observed]` — PAC2-7137/exploration.md
2. Selector `Appt. Book` cho chọn nhiều book; count tính trên tập book đã chọn. `[Observed]` — PAC2-7137/exploration.md
3. Summary được so với tổng count trong session/slot detail của cùng ngày, cùng book, cùng filter. `[Confirmed]` — PAC2-7137/requirements.md (REQ-001)
4. Empty state hiện `No available sessions.` với mọi count = 0. `[Observed]` — PAC2-7137/exploration.md

**Business rules**
- `Sessions`/`Booked`/`Available` ở summary phải bằng tổng detail block tương ứng. `[Confirmed]` — PAC2-7137/requirements.md (REQ-001, REQ-002)
- Appointment có 2 session holder chỉ đóng góp `1` vào `Booked` (tester/QA xác nhận 2026-09-30). `[Confirmed]` — PAC2-7137/test-cases.md (TC-004)
- Session gồm các slot 10 phút; cột clinician hiện `booked N`/`available N`; ở state không booking summary và detail khớp. `[Observed]` — PAC2-7137/exploration.md, automation.md
- `Day` view đếm theo holder occurrence, `Week` đếm theo appointment. `[Inferred from: 7 lần thử ổn định, needs confirmation]` — PAC2-7137/automation.md

**Trạng thái**
- Slot `Bookable` off hiển thị nhãn `Non-bookable` và vẫn nằm trong session; bật lại thì `Available` trở về giá trị cũ. `[Observed]` — PAC2-7137/automation.md
- Slot non-bookable bị loại khỏi `Available` (6 → 5); chỉ là observation. `[Observed]` — PAC2-7137/automation.md
- Slot chuyển non-bookable phải còn hiện dưới dạng blocked. `[Confirmed]` — PAC2-7137/requirements.md (REQ-003)

**Role/permission**
- Role cần thiết chưa xác nhận (`Super Admin GB` truy cập được). `[Observed]` — PAC2-7137/status.md

**Defect đã biết**
- PAC2-7137 · Fail (TC-004, ổn định qua same-data/fresh navigation/fresh tab, 7 lần) · `Day` `Booked` 3 trong khi kỳ vọng 2; `Week` cùng ngày hiện 2; quay lại `Day` vẫn 3. `[Observed]` — PAC2-7137/automation.md, status.md
- PAC2-7137 · Blocked (control trên route mặc định) · HTTP 404 rồi redirect login. `[Observed]` — PAC2-7137/automation.md

**Open questions**
- Non-bookable slot có nên tính vào `Available`? Ticket tự mâu thuẫn (Disputed). `[Open Question]` — PAC2-7137/requirements.md (REQ-004)
- Multi-holder: dedupe theo appointment hay theo patient booking/holder (QA đã xác nhận = 1, domain owner chưa ghi chính thức). `[Open Question]` — PAC2-7137/requirements.md

Kết quả test: TC-001/002/003/005 `Pass`; TC-004 `Fail`. — PAC2-7137/automation.md

### Session delete / archive

**Luồng**
1. `Configuration` (`Appointment Settings`) → toggle `Active`/`Removed` → row session → menu `Actions`. `[Observed]` — PAC2-7786/exploration.md (OBS-001, 002)
2. Row `Active` có `Edit`, `View Audit`, `Clone`, `Cancel Session`, `Block Session`; không có `Delete Session` (lặp lại trên template và cả hai child session, sau fresh reload). `[Observed]` — PAC2-7786/automation.md (TC-001, TC-005)
3. `Cancel Session` + reason + confirm → session sang `Removed` (archive, không xóa). `[Observed]` — PAC2-7786/automation.md (TC-004)
4. Row `Removed`: `Edit`, `View Audit`, `Restore`, `Clone` enabled; `Cancel Session`/`Block Session` disabled; `Restore` đưa về `Active`. `[Observed]` — PAC2-7786/automation.md (TC-003, TC-005)
5. `Block Session` mở dialog xác nhận: không có patient booked, mọi bookable slot thành non-bookable, không hủy appointment; `Cancel` thì không mutation. `[Observed]` — PAC2-7786/automation.md

**Business rules**
- Xóa session không booking: có confirmation trước mutation, sau confirm session biến mất khỏi cả `Active` và `Removed` sau refresh. `[Confirmed]` — PAC2-7786/requirements.md (REQ-001, REQ-004)
- Cancel/close confirmation không được đổi dữ liệu. `[Confirmed]` — PAC2-7786/requirements.md (REQ-004)
- Session có booked appointment: backend từ chối với lý do `SESSION_HAS_BOOKINGS` kèm booking count; UI không báo success giả. Message chính xác không quy định. `[Confirmed]` — PAC2-7786/requirements.md (REQ-002)
- Archived session không gây lỗi 500 khi xóa. `[Confirmed]` — PAC2-7786/requirements.md (REQ-003)
- Ba lỗi backend `deleteSessionById` theo comment kỹ thuật: từ chối vẫn báo thành công, archived session gây lỗi, early return rò transaction; retest cần bản ghép FE+BE. `[Confirmed]` — PAC2-7786/requirements.md
- `Delete Session` phải còn khả dụng; `Block Session` chưa được thay thế delete khi chưa có quyết định sản phẩm. `[Confirmed, Disputed]` — PAC2-7786/requirements.md (REQ-005)
- Template session mở rộng thành child session rời nhau, cùng menu; child rỗng appointments với `check-editable` = `editable: true` mà vẫn không có `Delete Session`, nên thiếu action không do booking/non-editable. `[Observed]` — PAC2-7786/automation.md
- Phân tích bundle public của feature branch: hook xóa session có đủ flow (pre-check future bookings, cảnh báo, reason bắt buộc, mutation, restore) nhưng configuration chỉ nối restore vào row menu. Chưa có baseline nên không kết luận regression. `[Observed]` — PAC2-7786/automation.md
- Rule suy ra từ bundle (static, không runtime): pre-check trả `has_future_bookings` + `future_bookings_count`; remove gửi `allowFutureDates` kèm `archiveReason` (8 option); lỗi 403 hiện hướng dẫn liên hệ Appointment Book Admin. `[Observed]` — PAC2-7786/automation.md
- Cleanup: archive session template bị chặn bởi `Session Can't Be Archived`; owned session xóa được qua permanent delete có confirm, rồi archive book; book archive vẫn còn trong history/analytics. `[Observed]` — PAC2-8384/automation.md
- `Configuration` → `Delete` có trên dev main cho template tự tạo (cleanup 200), trong khi feature branch 7786 không thấy `Delete Session`; hai môi trường chưa đối chiếu. `[Observed]` — PAC2-8241/automation.md so với PAC2-7786/automation.md

**Trạng thái**
- `Active` → (`Cancel Session`) → `Removed` → (`Restore`) → `Active`. `[Observed]` — PAC2-7786/automation.md

**Role/permission**
- Role quan sát `Super Admin GB`; role nào được xóa session chưa rõ. `[Observed]` — PAC2-7786/automation.md; `[Open Question]` — PAC2-7786/requirements.md

**Defect đã biết**
- PAC2-7786 · Fail (TC-001) · không có `Delete Session` cho session mới không booking, mọi trạng thái. `[Observed]` — PAC2-7786/automation.md
- PAC2-7786 · Fail (TC-003) · không xóa được archived session. `[Observed]` — PAC2-7786/status.md
- PAC2-7786 · Fail (TC-004) · confirm chỉ archive, không xóa hoàn toàn; để lại 1 record test không cleanup được bằng delete. `[Observed]` — PAC2-7786/status.md
- PAC2-7786 · Blocked (TC-002) · thiếu dữ liệu synthetic an toàn cho session có booking. `[Observed]` — PAC2-7786/status.md
- PAC2-7786 · Inconclusive (TC-005) · availability Delete vs Block do rule còn Disputed. `[Observed]` — PAC2-7786/status.md

**Open questions**
- Môi trường nào có đủ BE PR và FE PR để retest; role được xóa session; `Block Session` coexist hay thay `Delete Session`; message khi có booking; "referenced as a template" có chặn delete không; có cần coverage cho transaction leak. `[Open Question]` — PAC2-7786/requirements.md

### Session editor và khóa field

**Luồng**
1. `Configuration` → `Actions` → `Edit` mở drawer `Edit Session` (template-level): `Session Name`, `Session Type` (`Timed Appts`/`Untimed Appts`), `Slot Duration (min)`, `Frequency`, `Apply Multi-Org Split`, `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, location/care professional, `Required Attributes`. Hours/Date nằm trong section `Frequency` (collapsed). `[Observed]` — PAC2-8241/exploration.md (Correction), automation.md
2. Trong `Appointment Book`, icon bút chì trên header session mở drawer có `Time Range`, `Hours (From)`, `Hours (To)`, `Start Date`, `End Date`. Session có sẵn đã xem không có icon bút chì (có thể do booking). `[Observed]`; điều kiện do booking là `[Inferred from: session có booking không có icon, needs confirmation]` — PAC2-8241/automation.md
3. Right-click slot trong cột session → slot modal: `Select All`, `Actions` (bulk), `Close`, `Save`, footer `Session ends at:`; bulk `Bookable` mặc định unchecked khi selection hỗn hợp; slot chưa save là pending slot. `[Observed]` — PAC2-8241/exploration.md, automation.md
4. Đổi slot type (đơn/bulk), `Empty Slot`, `Bookable` rồi `Save`: dashboard phản ánh, reopen giữ state, counter `Available` cập nhật. `[Observed]` — PAC2-8241/requirements.md (REQ-006), automation.md (TC-002, TC-003)
5. Extend `Hours (To)` rồi `Save` một lần: toast `Session updated successfully.`, header đổi range, slot mới hiện ngay (chỉ thấy trên feature branch qua video). `[Observed]` — PAC2-8241/requirements.md (REQ-005)

**Business rules**
- Session (hoặc session sinh từ template) có ít nhất một booking: khóa `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types`; vẫn sửa được `Name`, `Location`, `Staff`, `Split`. Chưa verify trên dev. `[Confirmed]` — PAC2-8241/requirements.md (REQ-001)
- Thêm/di chuyển slot ra ngoài start/end bị từ chối với message `Slots must sit inside the session (<start> to <end>). Change the session times first.`; slot invalid không lưu, slot hiện có giữ nguyên; server cũng phải reject. `[Confirmed]` — PAC2-8241/requirements.md (REQ-002)
- Muốn thêm slot sau end time phải extend `Time Range` trên session không booking; save sau extend thêm default slot cho phần mở rộng và giữ slot cũ. `[Confirmed]` — PAC2-8241/requirements.md (REQ-003)
- Save hợp lệ phải persist qua reopen và fresh reload; UI không báo success nếu server không lưu. `[Inferred, Disputed]` — PAC2-8241/requirements.md (REQ-004)
- Cancel rồi book lại slot trong past session phải persist sau reload (dev xác nhận pass nhưng không có evidence reload). `[Confirmed, Disputed]` — PAC2-8241/requirements.md (REQ-007)
- Session tạo cần: appointment book, location, slot type, care professional, ngày, tần suất (`Daily`...), giờ, slot duration; số slot bookable tính từ giờ/duration. `[Observed]` — PAC2-7786/automation.md, PAC2-8241/automation.md
- `Required Attributes` ảnh hưởng gán care professional: session tự tạo có thể `No Match` nên slot `No care professional assigned` và không book được. `[Observed]` — PAC2-8241/automation.md
- Session mới tạo xếp ở cột `Not Assigned` nên counter `Available` trên cùng không đổi khi đổi bookable. `[Observed]` — PAC2-8241/automation.md (TC-003)
- Date picker session không cho chọn ngày quá khứ. `[Observed]` — PAC2-8241/automation.md

**Trạng thái**
- Slot pending (client) → `Save` → persisted; slot ngoài range vẫn tạo được pending ở client. `[Observed]` — PAC2-8241/automation.md

**Role/permission**
- `Super Admin GB`; ticket nhắc quyền Appointment Book Admin cho session removal. `[Observed]` — PAC2-8241/automation.md, PAC2-7786/automation.md

**Defect đã biết**
- PAC2-8241 · Fail (TC-001) · slot ngoài range: `appointment-slots/update` trả 500, UI im lặng, modal mở, không có message boundary; pending slot cũ xuất hiện lại sau reload (stale draft). `[Observed]` — PAC2-8241/automation.md
- PAC2-8241 · Fail (TC-007) · extend `Hours (To)`: `sessions/update` 200 + toast success nhưng header đổi chậm (~5 giây), không sinh slot mới, slot đã chỉnh revert về ban đầu; đổi chỉ `Session Name` thì lưu bình thường. `[Observed]` — PAC2-8241/automation.md
- PAC2-8241 · Fail (TC-007, biến thể) · nhập giờ `HH:MM` gây 400 `FST_ERR_VALIDATION` với toast generic; phụ thuộc cách nhập. `[Inferred from: cách nhập giờ, needs confirmation]` — PAC2-8241/automation.md
- PAC2-8241 · Blocked (TC-005) · date picker không cho quá khứ, session tự tạo không gán được care professional. `[Observed]` — PAC2-8241/automation.md
- PAC2-8241 · Blocked (TC-006) · thiếu session có booking an toàn để verify khóa field. `[Observed]` — PAC2-8241/status.md
- Kết quả đã Pass: TC-002 (bulk slot type persist), TC-003 (đơn Empty/Non-bookable + bulk Bookable persist). `[Observed]` — PAC2-8241/status.md

**Open questions**
- Footer `Session ends at` không khớp header sau khi xóa slot cuối; fix feature branch đã merge lên dev chưa; `PASSED QA on FB` mâu thuẫn video "DEV not work"; assert server rejection trực tiếp hay chỉ UI + no persistence; test data an toàn cho session có booking. `[Open Question]` — PAC2-8241/requirements.md

### Filter trong Appointment Book

**Luồng**
1. Toolbar `Filters` → sidebar: `Healthcare Professional`, `Patient`, `Appointment Type`, `Slot Type`, `Session Name`, `Location` (textbox `Search...`). Chọn nhiều book hiện `+N`/`N selected`. `[Observed]` — PAC2-8384/exploration.md
2. Chọn `Session Name` của một book: kết quả giảm (2 session/60 available → 1 session/48 available), chỉ session đó render. `[Observed]` — PAC2-8384/automation.md (TC-004)
3. `Healthcare Professional`, `Slot Type`, `Session Name` tải option đúng ở multi-book (dataset có location/slot type/clinician dùng chung). `[Observed]` — PAC2-8384/automation.md (TC-003)

**Business rules**
- Single book: `Location` tải và gồm location mới thêm khi thuộc dữ liệu trong scope (date range, book đang chọn). `[Confirmed]` — PAC2-8384/requirements.md (REQ-001)
- Multi-book: `Location`, `Slot Type`, `Session`, `Clinician`, `Patient` lấy option từ tất cả book đã chọn, không rỗng. Gợi ý backend nhận array hoặc fan-out/merge client (không bắt buộc). `[Confirmed]` — PAC2-8384/requirements.md (REQ-002, REQ-003)
- Áp filter nhiều book trả kết quả đúng trên toàn bộ book chọn trong date range. `[Confirmed]` — PAC2-8384/requirements.md (REQ-004)
- `Appointment Type` chỉ liệt kê type đang dùng trong book hiện hành, lọc cả session và slot khớp; comment 2026-09-24 ghi đây là đúng, không coi việc chỉ có `F2F`/ẩn session không khớp là lỗi. `[Confirmed]` — PAC2-8384/requirements.md (REQ-005)
- Đề xuất chip `Location` ở toolbar; phân biệt loading với empty trong từng filter section; cần BA/PO xác nhận. `[Inferred, Candidate]` — PAC2-8384/requirements.md (REQ-006, REQ-007)
- Chờ `Loading your appointment data` biến mất trước khi đọc option. `[Observed]` — PAC2-8384/feature-location.md

**Role/permission**
- Role test filter chưa xác định; quan sát bằng `Super Admin GB`. `[Open Question]` — PAC2-8384/requirements.md

**Defect đã biết**
- PAC2-8384 · Fail (TC-002, `PAC2-8384-DEF-001`) · chọn hai book với session cùng hiển thị một location thì `Location` trả `No results found`. `[Observed]` — PAC2-8384/report.md, automation.md
- PAC2-8384 · Inconclusive (TC-003, TC-004, TC-006) · TC-004 mới áp `Session Name`; TC-006 không verdict vì Inferred. `[Observed]` — PAC2-8384/report.md
- Tổng ticket: 0 Pass / 1 Fail / 2 Inconclusive / 3 Not Run (TC-001, 005, 007); overall `Fail`. `[Observed]` — PAC2-8384/report.md

**Open questions**
- "Newly added location" tạo ở đâu/đồng bộ bao lâu/phụ thuộc configuration hay session trong range; multi-book là union hay dedupe; chip và loading/empty có bắt buộc không; expected cho slot trống/session khi lọc multi-book. `[Open Question]` — PAC2-8384/requirements.md, exploration.md

### Hiệu năng booking/cancel (partitioned table)

**Luồng**
1. Booking: `bookAppointment` ghi `appointment`/`appointment_slot`, thêm `bx_organisation_uuid` vào query/write khi organisation xác định an toàn; phạm vi hai backend `nhs-scheduler-be` và `paco-connect-be`. `[Confirmed]` — PAC2-8552/requirements.md (Summary, REQ-001)
2. Cancel appointment qua từng repo vẫn thành công, không trả `APPOINTMENT_NOT_FOUND` giả do organisation mismatch. `[Confirmed]` — PAC2-8552/requirements.md (REQ-002)
3. Cancel session multi-org: mỗi appointment patch theo organisation của chính row; guard so requested IDs với found appointments (không so hai tập đã narrow). `[Confirmed]` — PAC2-8552/requirements.md (REQ-003)
4. Sửa session window: appointment multi-slot bị cancel phải release mọi slot, không slot nào còn trỏ appointment cancelled; `knownSlots` gồm toàn bộ `appointment_slots` fetch từ graph. `[Confirmed]` — PAC2-8552/requirements.md (REQ-004)

**Business rules**
- Cột `appointment.bx_organisation_uuid` có semantics khác nhau giữa hai repo nên không áp một rule filter chung. `[Confirmed]` — PAC2-8552/requirements.md (Ambiguities)
- `sessionSplitStatus`: enforcement và count split allocation không đổi; lookup phía appointment không filter theo token organisation khi semantics không tương thích. `[Confirmed]` — PAC2-8552/requirements.md (REQ-005)
- Write path không trả success im lặng khi zero rows/thiếu appointment; không chấp nhận trạng thái nửa vời (`Cancelled` nhưng slot chưa release). Error contract chưa nêu. `[Confirmed]` — PAC2-8552/requirements.md (REQ-007)
- `getAppointmentsBySlotId` trả đúng appointment, dùng partition key ở bước organisation đã biết, bỏ dead-code query; lookup slot-by-ID đầu tiên không partition-scope được. `[Confirmed]` — PAC2-8552/requirements.md (REQ-008)
- Xác nhận hiệu năng cần `EXPLAIN ANALYZE` trước/sau (DB owner), không kết luận từ UI latency. `[Confirmed]` — PAC2-8552/requirements.md (REQ-006)
- Nhánh reschedule "documented, not fixed". `[Confirmed]` — PAC2-8552/requirements.md (REQ-001)
- `/configuration/#appointments` có grid appointment, `Show Cancelled Bookings`, `Fetch Latest Appointments`, `Fetch All Slot Details` (side effect của hai nút fetch chưa rõ, không dùng). `[Observed]` — PAC2-8552/exploration.md
- Route feature branch Connect không có session (`No available sessions`) nên chưa có availability để book. `[Observed]` — PAC2-8552/exploration.md

**Defect đã biết**
- PAC2-8552 · Blocked (9/9 case) · không có approval mutation, fixture synthetic/cleanup, DB owner; không có spec Playwright; case backend nên chạy trong repo backend; mutation ledger rỗng. `[Observed]` — PAC2-8552/automation.md, status.md

**Open questions**
- Build dev chứa commit nào; fixture/role/approval cho Book/Cancel/session edit; DB owner chạy `EXPLAIN ANALYZE`; error contract khi guard fail; reschedule có trong scope; `appointment_status` có semantics organisation khác nhau (follow-up). `[Open Question]` — PAC2-8552/requirements.md


### Appointment audit trail

**Luồng**
1. Trên feature branch, mở `Appointment Book` → chọn ngày/book có booking → bật `Booked` → right-click appointment. `[Observed]` — PAC2-8381/feature-location.md, exploration.md
2. Context menu có hai `View Audit Log`: một dưới nhóm `Appointment`, một dưới `Slot manage`; audit appointment phải chọn item trong nhóm `Appointment`. `[Observed]` — PAC2-8381/exploration.md (OBS-002)
3. `View Audit Log` mở dialog `Audit | Activity Log`, filter `All time`, columns `Description`/`Date`/`Time`/`Patient`/`NHS Number`/`Appt Name`. `[Observed]` — PAC2-8381/exploration.md (OBS-003)

**Business rules**
- Booking audit phải mô tả rõ `<user> booked this appointment`, không dùng `created this slot`; đúng actor và booking time. `[Confirmed]` — PAC2-8381/requirements.md (REQ-001, 002)
- Booking trực tiếp trong Connect và qua `Care Navigation` đều phải có appointment audit ở Connect FE. `[Confirmed]` — PAC2-8381/requirements.md (REQ-003, 004)
- Đổi `Slot Type` sau booking và cancellation phải tạo audit đúng actor/time. `[Confirmed]` — PAC2-8381/requirements.md (REQ-005, 006)
- Appointment slide panel phải populate attribution `Booked By`/`Actioned By`; label cuối còn ambiguous. `[Confirmed]` — PAC2-8381/requirements.md (REQ-007)

**Trạng thái quan sát**
- Historical appointment trên branch PAC2-8381 có `Booked By` populate. `[Observed]` — PAC2-8381/exploration.md (OBS-001)
- Rows audit nhìn thấy là field-level events `set Planned start/end date/time` và `set Appointment name`; chưa thấy concise booking sentence trong viewport đã quan sát. Không phải verdict vì record cũ và chưa kiểm tra toàn bộ rows/pagination. `[Observed]` — PAC2-8381/exploration.md (OBS-003)

**Mutation boundary**
- `Quick Book`, `Edit Slot`, `Cancel Appointment`, status/session actions đều mutation; chỉ chạy với appointment `QA-AUTO` do run tạo và có cleanup. `[Observed]` — PAC2-8381/exploration.md (OBS-004)

**Possible defect**
- Có thể thiếu concise booking event trên current branch, nhưng chưa đủ kết luận `Fail` cho tới khi tạo controlled appointment trên build hiện tại và xem toàn bộ audit. `[Inferred from: historical audit rows, needs confirmation]` — PAC2-8381/exploration.md

**Open questions**
- Sentence booking là row bổ sung hay thay field-level rows; label `Booked By` hay `Actioned By`; timestamp tolerance; amendment có cần old/new value; tile `Care Navigation` và fixture/cleanup an toàn. `[Open Question]` — PAC2-8381/requirements.md, exploration.md

### Patient-profile audit (booking/cancel)

**Luồng**
1. PACO `/paco/feature-branch/<ticket-branch>/patient-search` → search patient (vd `adhoc` → `Floy adhoc` NHS `76835143`) → row action menu (`cell-renderers--actions`, `aria-controls="popup_menu_left"`) → menuitem `View Audit`. `[Observed]` — PAC2-8999/feature-location.md
2. Dialog `Audit Trail` mở overlay (không đổi URL). Search `Search by category, user, event, NHS number, details…`, filter `Filter audit by date` → `Date & Time`, AG Grid cols `Date/Time`/`Summary`/`Field`/`Previous Value`/`New Value`/`Details`. `[Observed]` — PAC2-8999/feature-location.md
3. Sau `Quick Book` qua PACO Connect, mở lại dialog → có 2 row top: `Booked appointment` actor = JWT user, rawAction `appointment-create` + `appointment-book-appointment-create`, categoryLabel `Appointment Create` / `Appointment Book Appointment Create`. `[Observed]` — PAC2-8999/manual-test.md Step 3
4. Cancel qua Calendar Day view Appointment Details sidebar `Mark as:` → menuitem `Cancel` KHÔNG tạo audit row; click là no-op (không dialog, không API call, không state change, không audit row). `[Confirmed]` — PAC2-8999/manual-test.md Step 6+7+8

**Business rules**
- Sau `book` appointment, patient profile audit phải có entry với actor = authenticated user, timestamp gần đúng click time (window 1s). `[Confirmed]` — PAC2-8999/manual-test.md Step 3
- Sau `cancel` appointment, patient profile audit phải có entry dạng `<user> cancelled appointment` (dev's hint). `[Confirmed from dev reply 2026-10-13, NOT verified due to cancel no-op]` — PAC2-8999/dev-reply.md
- Wording booking: `Booked appointment` (noun phrase) thay vì `<user> booked appointment` (full sentence). Dev chỉ confirm cancel wording, booking wording chưa dev-confirm. `[Observed, Open Question]` — PAC2-8999/manual-test.md Step 3 + dev-reply.md

**Defect đã biết**
- `PAC2-8999` REQ-001 Fail: Cancel menuitem trong Calendar Day view Appointment Details sidebar `Mark as:` menu là no-op. Reproducible ×3 attempts (regular click + `browser_click` by id + `dispatchEvent` MouseEvent sequence). 4 indicator: dialog (none), network (no PATCH/PUT/DELETE/POST to `/api/appointments/.../cancel`), sidebar state (`Mark as:` còn `<Select Patient Status>`), calendar slot (còn `Mr Floy adhoc`). 4 suspected cause (chưa confirm): (a) React onClick bound sai element `<a>` vs `<li>`; (b) `Reason Code` required server-side; (c) menubar portal event chain broken; (d) handler onMouseDown thay vì onClick. PAC2-8999/manual-test.md Step 6+7+8. Booking vẫn work (REQ-002 Pass) — bug scope dừng ở cancel path.

**Open questions**
- Wording chính xác cho booking entry (`Booked appointment` noun phrase observed, dev chưa confirm expected).
- Cancel có confirm dialog thiết kế không, hay cancel 1-step?
- Try cancel qua path khác (right-click slot context menu / Group Send / Appointment Book list view) — bug scoped hay systemic?
- Timestamp tolerance chính xác cho audit (window 1s observed với booking; cancel không có event để measure).

**Mutation boundary**
- Book + cancel qua PACO Connect Calendar Day view; chỉ chạy với test patient `QA-AUTO` hoặc pre-existing non-PII (vd `Floy adhoc` NHS 76835143) và có cleanup orphan appointment. `[Observed]` — PAC2-8999/manual-test.md Step 2+6+7+8

### Session cancel RBAC (P7032)

Ticket scope: tách quyền cancel session khỏi `Appointment Book User`, tạo activity mới `P7032 - Appointment Book Cancel Session`. 3 PR đã merge: `paco-connect-be #792`, `paco-one-db #1022`, `connect-fe #2875`. Video self-test từ tester: `attachments/129284-pac2-9001-browser-qa.mp4` (456.7s, 1600x960, no audio, 6 captioned steps).

**Luồng**
1. Open `Appointment Book` → Day view → session card (e.g. `Dan E2E test` 09:00-16:00, 3 booked). Entry point for "Cancel session appointments" NOT Confirmed in browser (OQ-4). Video skips entry control — jumps from board to resulting dialog. `[Observed]` — PAC2-9001/feature-location.md (R-2), `video-notes.md` step 4/6
2. User without P7032 invokes Cancel session: `Access Denied` modal opens — `You do not have permissions to perform this action. Contact your administrator.` + `OK` button. Same generic copy used across RBAC blocks in Paco. `[Observed]` — `video-notes.md` step 1/6, `extra-42s.jpg`/`extra-50s.jpg`
3. User with P7032 invokes Cancel session: `Cancel session appointments` modal opens — `This will cancel N appointments for N patients in this session.`, required `Cancellation Reason` select, two pill actions `Cancel only` / `Cancel & notify`. `[Observed]` — `video-notes.md` step 4/6, `frame-230s.jpg`
4. `Cancel & notify` opens Quick Send for affected patients; save happens only on Send; closing Quick Send saves nothing. `[Confirmed]` — PAC2-9001/requirements.md (REQ-001, scenario 2)
5. Block Session on empty session (any role): dialog `No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled.` + `Cancel` (outlined) / `Block Session` (filled). `[Observed]` — `video-notes.md` step 2/6, `frame-070s.jpg`/`extra-60s.jpg`
6. Configuration > Sessions: list page reachable for User +P7032 (NOT Admin); each row has `…` kebab under Actions. Row-kebab content not captured in video (OQ-3). `[Observed]` — `video-notes.md` step 6/6, `frame-350s.jpg`
7. Edit Session modal (right-side `Session settings` form): Session name, Assigned Locations, Assigned Staff. Warning `This session has 3 booked patients — Changing location or staff moves their appointments with it. Nobody is notified automatically.` — covers location/staff change, NOT time-edit cancellation dialog. `[Observed]` — `video-notes.md` step 5/6, `extra-260s.jpg`

**Business rules**
- Permission triplet `canEdit / canAdmin / canCancelSession` (per video caption step 4/6 — `canEdit:true, canAdmin:false, canCancelSession:true`); triplet quoted from caption, not directly read from visible console/network. `[Inferred from video caption, needs confirmation]` — `video-notes.md` step 4/6
- Permissions matrix 7 actions x 3 roles (per AC tony.do comment 14:31:47Z 2026-10-13): `[Confirmed]` — PAC2-9001/requirements.md (REQ-001..REQ-007)
  - Cancel a single future appointment: User / User+P7032 / Admin — all 3 allow
  - Cancel a past appointment: only Admin
  - Cancel session (appt book): only User+P7032 / Admin
  - Block an empty session: all 3 allow (no P7032 needed)
  - Change session details / times: all 3 allow
  - Remove (archive) session: only Admin
  - Cancel session from Configuration > Sessions: only Admin
- 9 expected behaviour scenarios per AC table. `[Confirmed]` — PAC2-9001/requirements.md (REQ-001 scenarios 1-9)
- Pre-existing limitation: session times locked in EDIT SESSION modal when session has bookings — only template edits whose generated sessions hold bookings outside template times can trigger time-edit cancellation dialog. `[Confirmed]` — PAC2-9001/requirements.md (REQ-008, QA notes)
- Server rule (Plan approved 2026-10-12): if RBAC gate cancels `appointments/cancel` on session-level endpoint for users without `canCancelSession`, server returns 403 with message consumed as "Access Denied" dialog. `[Confirmed]` — PAC2-9001/requirements.md (REQ-001, Plan approved)
- Appointment Book Admin auto-includes P7032 (P7032 granted to Admin role at backend). `[Confirmed]` — PAC2-9001/requirements.md (REQ-009, tony.do comment 14:31Z)
- P7032 only visible in Role Management UI after `paco-one-db #1022` deploys. `[Confirmed]` — PAC2-9001/requirements.md (REQ-009, QA notes)
- Pre-existing `appointments/cancel` org-check split to REQ-010 (out of scope for PAC2-9001). `[Confirmed]` — PAC2-9001/requirements.md (REQ-010)

**Trạng thái**
- Session card buttons verified (rev 2 attempt-4 16:00Z): Edit pencil + Note icon. Cancel/Block/Remove session entry NOT on session card. `[Observed]` — PAC2-9001/feature-location.md (R-2)
- EDIT SESSION drawer verified: 8 buttons, no Cancel/Block/Remove session entry in drawer. `[Observed]` — PAC2-9001/feature-location.md (R-2)
- Right-click on session name: no context menu opens. `[Observed]` — PAC2-9001/feature-location.md (R-2)
- P7032 not visible in RBAC list (max P7507, has P7030 prerequisite, missing P7032). Inferred paco-one-db #1022 not yet deployed on dev. `[Inferred from: RBAC list scan, needs confirmation]` — PAC2-9001/feature-location.md (R-4)

**Role/permission**
- 3 test personas: `Appointment Book User` (no P7032), `User + P7032` (QA-AUTO role), `Appointment Book Admin` (auto-include P7032). `[Confirmed]` — PAC2-9001/requirements.md (REQ-001..REQ-009)
- P7032 grant path: `Super Admin` (e.g. Fiona Nguyen GB) → `/paco/configuration/staff/role-groups` → create/grant `Appt Book User` + P7032 to QA-AUTO test role. Mutation required; deferred to MANUAL_EXECUTE setup. `[Confirmed]` — PAC2-9001/requirements.md (REQ-009)

**Defect đã biết**
- PAC2-9001 · **DEF-PAC2-9001-01 Block Session UX gap** (Medium) · slot context menu `Block Session` enabled but click produces no dialog, no error, no effect on empty or booked sessions. Possible regression. `[Observed]` — PAC2-9001/defects/DEF-PAC2-9001-01-block-session-ux-gap.md (TC-006 diagnostic, 14 Oct + 15 Oct 2026)
- PAC2-9001 · **Partial-complete 2026-10-15** · 3 Pass (TC-007/008/009), 6 Blocked (P7032 deploy + test data + UX), 2 Not Run (data-dependent). `[Confirmed]` — PAC2-9001/report.md
- PAC2-9001 · Inconclusive (video review 80% coverage) · entry-point for "Cancel session appointments" NOT captured in video. `[Observed]` — `video-notes.md` Open questions
- PAC2-9001 · OQ-1 open · P7032 not visible in Role Groups list (max P7507, 181 P-codes scanned P0001–P9000). Confirmed paco-one-db #1022 not deployed. `[Confirmed via diagnostic spec TC-011]` — PAC2-9001/automation.md

**Open questions**
- OQ-1 / OQ-030: paco-one-db #1022 đã deploy dev chưa? RBAC list max P7507, no P7032 visible. Escalate to dev. `[Open Question]` — PAC2-9001/requirements.md (OQ-1)
- OQ-2: Block session trên session có ≥1 booking có gate bằng P7032 không? Video chỉ test trên empty session. `[Answered via OQ-031]` — 15 Oct attempt với Booked=2: Block Session enabled in slot menu, click non-functional (UX gap).
- OQ-3: Configuration > Sessions row-kebab menu content cho User +P7032 (NOT Admin): Cancel option visible hay hidden? Tester reached page trong step 6 nhưng không mở kebab. `[Open Question]` — chưa test (P7032 deploy gate). Admin verification: 8-item kebab bao gồm Cancel session appointments (TC-009).
- OQ-4: Entry-point shape cho "Cancel session appointments"? Video KHÔNG capture. Session card + EDIT drawer + right-click đều không có. **RESOLVED 2026-10-15** = `Configuration → Appointment Books → Sessions → row kebab → Cancel session appointments`. `[Resolved]` — PAC2-9001/manual/rev-2/final-report.md (TC-009)
- OQ-5 / OQ-034: Time-edit cancellation dialog (REQ-008) trigger bằng template edit — không có test data phù hợp trên dev. `[Open Question]` — PAC2-9001/requirements.md (OQ-5). TC-010 Not Run.
- OQ-033: Cancel session appointments entry point shape (kebab vs menu icon vs right-click). **RESOLVED 2026-10-15** = row kebab in Configuration → Sessions table. `[Resolved]`

### Single-click arrive (PAC2-8575)

Ticket scope: reception report rằng phải double click slot patient mới arrive được. Fix mong đợi: single click trigger arrive hoặc mở UI arrive. Acceptance criteria ticket = "Not provided"; expected behavior dựa trên UX inference (REQ-001 Confirmed từ description, REQ-002 Inferred).

**Luồng (branch host `pac2-8575`)**
1. Open `Appointment Book` → Day view (default) tại ngày `15 October 2026` — 6 booked slots, 23 sessions, 1,018 available. `[Observed]` — PAC2-8575/feature-location.md, PAC2-8575/exploration.md OBS-003
2. **Single click** lên patient slot parent `.session-slot-button` → mở `Appointment Details sidebar` ở phải màn hình với thông tin patient + `Mark as: Select Patient Status` (chevron-down). Slot class KHÔNG mutate (`appointment-booked` giữ nguyên). KHÔNG no-op — fix có vẻ đã apply. `[Observed]` — PAC2-8575/exploration.md OBS-001
3. Sidebar có `Mark as:`, `Select Patient Status` chevron-down, `Save` buttons (slot count, reason codes, booking notes) — một số disabled cho past appointments. `[Observed]` — PAC2-8575/exploration.md OBS-001
4. **Double click** native (Playwright `dblclick()`) cùng slot → sidebar vẫn mở cùng patient, slot class KHÔNG đổi, `Booked 6` summary KHÔNG đổi. **Double click KHÔNG còn là cơ chế arrive/change status** trên branch. `[Observed]` — PAC2-8575/exploration.md OBS-002
5. 6/6 booked slots trên Day view đều `isBeforeNow` (past appointments, time `08:00-08:10` ... `15:50-16:00`) → KHÔNG test được arrive transition trực tiếp trong session này. `[Observed]` — PAC2-8575/exploration.md OBS-003
6. Sau page refresh, `Booked 0` — data volatile; session test có thể cache. `[Observed]` — PAC2-8575/exploration.md OBS-003

**Business rules (inferred từ UX)**
- Arrive trigger mong đợi: single click mở sidebar + trong sidebar có action arrive (vd chọn status trong dropdown, hoặc click icon trạng thái). Hiện tại `Select Patient Status` chevron-down inside sidebar KHÔNG có onClick (chain parent 6 levels) — có thể UX gap hoặc trigger nằm chỗ khác. `[Inferred, needs confirmation]` — PAC2-8575/exploration.md OBS-004
- Reception report nói double click mới arrive; trên branch này double click không mutate. Có thể fix đã move arrive sang sidebar (single click → sidebar → arrive action) hoặc fix chưa hoàn chỉnh. `[Open Question]` — PAC2-8575/exploration.md OQ-1
- Trên mainline/dev chung, behavior có thể vẫn là double click (chưa promote fix). `[Open Question]` — PAC2-8575/requirements.md OQ-003

**Trạng thái**
- TC-001 Single click mở `Appointment Details sidebar`: **Pass**. Single click KHÔNG no-op; slot class `appointment-booked` giữ nguyên (không mutate); aside mở với patient details + `Mark as: Select Patient Status` chevron-down. `[Confirmed: Pass]` — PAC2-8575/manual-execution.md TC-001 (4 diagnostic attempts; precondition resolved bằng fresh tab)
- TC-002 Double click benign regression: **Pass**. Native dblclick cùng slot → aside mở cùng patient; `Booked 6→6`; no extra modal/popover/toast. `[Confirmed: Pass regression]` — PAC2-8575/manual-execution.md TC-002
- TC-003..007: **Blocked** — cần QA-AUTO test data với appointment future (6/6 booked slots hiện tại đều `isBeforeNow`); TC-003/004 (arrive end-to-end), TC-005 (right-click), TC-006 (status transition khác), TC-007 (cross-host) chưa thực thi. `[Blocked]` — PAC2-8575/manual-execution.md
- Arrive transition thực tế chưa xác minh được (TC-003 Blocked). Overall ticket: **Inconclusive** — partial coverage; reception report "double click arrive" không còn tái hiện trên branch, nhưng chưa confirm single click mới có thực sự trigger arrive. `[Inconclusive]` — PAC2-8575/exploration.md Status + PAC2-8575/manual-execution.md Verdict

**Role/permission**
- Test ở role `Blinx Deployment` (Johnny Bravo 2255, Super Admin GB equivalent) tại org `General Practice (Demo Site)`, location `test again - old location`. `[Observed]` — PAC2-8575/feature-location.md
- Reception role cũng cần test (reception là reporter chính) — chưa xác minh trong scope này. `[Open Question]`

**Defect đã biết**
- Chưa có defect confirmed. Diagnostic note (TC-001 attempts 1-3): data `Booked 6` chỉ có ở fresh tab; existing tab state trả `Booked 0` do stale state — KHÔNG phải product bug, là tab state issue. Có thể do cookie/date persistence trong tab. Automation cần navigate trong fresh tab hoặc trigger session reload. `[Observed]` — PAC2-8575/manual-execution.md
- Limit chưa confirm: TC-003..006 không chạy được → arrive transition end-to-end chưa xác minh. Cần QA-AUTO test data future booked.

**Open questions**
- OQ-1: Single click mở sidebar. Trong sidebar có arrive action thực sự không? Chevron-down không clickable → cần explore thêm (right-click context menu, keyboard, drag, button arrive ẩn). `[Open Question]` — PAC2-8575/exploration.md OQ-4, OQ-035
- OQ-2: Scope status transition ngoài `Arrive` (vd `In consultation`, `No show`) — chưa test. `[Open Question]` — PAC2-8575/requirements.md OQ-002, OQ-036
- OQ-3: Cross-host behavior (production/mainline có còn double click?). `[Open Question]` — PAC2-8575/requirements.md OQ-003, OQ-037
- OQ-4: Data volatile — Booked 6 → 0 sau page refresh ở existing tab. **Partially answered**: 4 diagnostic attempts cho thấy chỉ là stale tab state (cookie/date persistence), KHÔNG phải product data issue. Fresh tab vẫn có `Booked 6`. Automation cần handle fresh-tab context. `[Partially Answered]` — PAC2-8575/manual-execution.md, OQ-038

## Tester notes

