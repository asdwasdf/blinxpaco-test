# Workflow: Capacity & Demand

- Classification: `[Observed: dev, Super Admin GB, 2026-09-16]`
- Aliases: `Capacity & Demand`, `Analytics`, clinician capacity, consultation observations, DNA
- Coverage: `Partial`
- Confidence: `High` cho route và dashboard landmarks; `Low` cho filter transitions và expected metric values

## Business context observed

- Visible purpose: tổng hợp clinician capacity, consultation observations, appointment duration/session usage và DNA rates.
- Actor/role: `Super Admin GB` tại `General Practice (Blinx Demo Site)`.
- Required context: authenticated Paco session, organisation context và analytics data.
- Starting data state: route `/capacity-demand/`; `Date Range` hiển thị `All Time`; một filter hiển thị `1 Selected`.
- Entities and statuses: appointment booked/unused/seen/DNA; clinician role; consultation observation; planned/actual duration; session.

## Entry

1. Dashboard → `Analytics & Reports` → `Capacity & Demand`.
2. Route `/capacity-demand/`, title `Capacity & Demand`.
3. Stable landmarks: breadcrumb `Analytics > Capacity & Demand` và heading `CLINICIAN CAPACITY`.

## Read-only flow

1. **Action:** mở landing dashboard và xem cards.
   - **Transition:** route giữ `/capacity-demand/`; data render sau bounded wait.
   - **Observed result:** `Date Range` là `All Time`; `CLINICIAN CAPACITY` hiện `345 Booked Appt. of 345 Total Appt.` và `0 Unused Appt.`; clinician-role selections gồm `Nurse`, `Doctor`, `Unallocated`, `Pharmacist`, `Mental Health Practitioner`, `Admin`.
   - **Evidence:** `test-results/product-survey/batch32/01-capacity-demand.png`.
2. **Action:** xem consultation and appointment metric cards, không đổi filter.
   - **Transition:** giữ state `All Time`.
   - **Observed result:** `CONSULTATION OBSERVATIONS` hiện `5 Observations Selected`; cards khác gồm `APPT. DURATION: PLANNED vs ACTUAL`, `APPT. TIME BY SESSION`, `APPT. SEEN vs DNA`, `DNA BY CLINICIAN`. `APPT. SEEN vs DNA` hiện `27 DNA's from 345 Appt. Booked (7.83% loss)` trong dataset hiện tại.
   - **Evidence:** `test-results/product-survey/batch32/01-capacity-demand.png`.

## Decision points

- **Visible condition:** date range.
  - **Branch/state A:** `[Observed]` `All Time` populated dashboard.
  - **Branch/state B:** `[Open Question]` metric changes cho range khác.
- **Visible condition:** clinician-role hoặc observation selection.
  - **Branch/state A:** `[Observed]` six role labels và five observations selected ở landing state.
  - **Branch/state B:** `[Open Question]` deselect/select behavior và card dependencies.

## End and exceptional states

- End state observed: populated `All Time` dashboard; không đổi selections.
- Empty/loading/error states: không thấy visible empty/loading/error copy sau bounded wait. Console có HTTP `500` và `Error fetching user provider roles`, nhưng dashboard vẫn populated; chưa chứng minh console error gây visible impact.
- Cross-feature handoff: không thấy handoff; cards dùng cùng analytics context.

## Safety boundary

- Last safe read-only state: xem cards, labels, totals và chart legends.
- Approval stop: export/download/share hoặc unknown action có thể gửi dữ liệu; không thấy mutation control rõ trong observed state.
- Actions not performed: không đổi date range, role hoặc observation; không dùng `More options`; không force-click control bị overlay intercept.
- Mutation: `None`

## Execution guidance

- Setup/data: environment `dev`, role `Super Admin GB`, selected organisation và analytics dataset đã load.
- Safe manual steps: mở route; xác nhận breadcrumb và `CLINICIAN CAPACITY`; xem date range, selected roles/observations và six card families; chỉ dùng filters khi control visible và clickable tự nhiên.
- Stop and request approval before: export/download/share hoặc action không rõ persistence/external effect.
- Evidence to capture: route, role/org, date range, selected filters, card headings, visible empty/loading/error copy; không ghi clinician/patient identifiers vào docs.

## Automation guidance

- Stable roles/labels/landmarks: title `Capacity & Demand`; breadcrumb `Analytics`; headings `CLINICIAN CAPACITY`, `CONSULTATION OBSERVATIONS`, `APPT. DURATION: PLANNED vs ACTUAL`, `APPT. TIME BY SESSION`, `APPT. SEEN vs DNA`, `DNA BY CLINICIAN`.
- Observable waits: chờ `CLINICIAN CAPACITY` và totals/card labels; không coi Paco shell render là dashboard ready.
- Date-range interaction: click `.date-range-picker__input-field--outline` → mở preset dropdown `.rdrStaticRanges`. Mọi preset đều mở calendar view (không direct-apply). Calendar view tạo `.modal-container-date-range` + `modal-overlay` + `.rdrMonth` (2 elements). Calendar có `Apply` và `Cancel` buttons. Preset "This Month" + Apply → "This Month" + NO DATA FOUND (expected — Sep 2026 không có data trong dev). Preset "All Time" + Apply → "All Time" + data restored. Date-range state persist trong localStorage (không clear khi test).
- Chip rows (3 groups): Role chips at Y≈410 ("Deselect All" + 6 role labels), Observation chips at Y≈186 (5 observations + 10 appointment type chips), Appointment type chips at Y≈560 (10 items). Role toggle không ảnh hưởng metrics trong dev data (all clinicians contribute). "Select All" / "Deselect All" chỉ ảnh hưởng role chips, không ảnh hưởng observation/appointment chips.
- Observation chip removal: chips có `MuiChip-deletable` class và delete icon (SVG). Click X bằng `dispatchEvent(new MouseEvent('click', {bubbles:true}))` — `el.click()` không works với React synthetic events. Confirm: xóa "Blood Pressure" → obs count 5→4; xóa "Pulse" → 4→3.
- Observation combobox (search-to-add): `input[placeholder="Search observation"]` với `role="combobox"` và `aria-autocomplete=list` trong `.MuiAutocomplete-root`. Các bước thêm observation chip:
  1. Tìm nút `Open` (`.MuiAutocomplete-popupIndicator`, `aria-label="Open"`) trên card `CONSULTATION OBSERVATIONS` — chỉ expand section, chưa mở dropdown.
  2. Click một lần để expand section → input trở thành `visibility:hidden` nhưng `pointer-events:auto` và `aria-expanded=false`.
  3. Dispatch `mousedown` + `focus` events lên input (`locator.dispatchEvent('mousedown')` + `locator.dispatchEvent('focus')`) → `aria-expanded=true`, dropdown `.MuiAutocomplete-popper` hiện với 17 nhóm observations.
  4. `page.keyboard.type('text')` filter dropdown (React controlled — input value attribute không cập nhật, nhưng dropdown hiện đúng kết quả).
  5. `ArrowDown` + `ArrowDown` + `Enter` để chọn option → chip được thêm vào thanh observation chips.
  6. Ngoài ra, click trực tiếp vào một group option (e.g. `+ Haematology (1)`) cũng thêm chip ngay mà không cần keyboard navigation.
  7. Dropdown groups (17): Administration (19), Biochemistry (9), Biological values (5), Conditions/procedures (57), Cytology/Histology (2), Diagnostics (10), Ethnicity (2), HMP (1), Haematology (1), Health management (26), Immunisations (5), Investigation requests (1), Microbiology (9), Personal Health (30), Reason for care (1), Referral (13), Symptoms and Findings (26).
  8. Playwright `locator.click()` timeout vì `visibility:hidden`; `locator.fill()` và `locator.type()` cũng không works — bắt buộc phải dùng `dispatchEvent`.
  9. Một số observation chips đã có sẵn trong dev data: `O/E - blood pressure reading`, `Pulse rate`, `O/E - pulse rhythm regular`, `Chronic obstructive pulmonary disease`, `Chronic obstructive pulmonary disease monitoring`.
  10. Observation chip removal: tương tự role chip — `dispatchEvent(new MouseEvent('click', {bubbles:true}))` trên `[class*="deleteIcon"]`.
- Card info buttons: mỗi card có icon button (`[aria-label="This card is an overview..."]`) chứa mô tả chi tiết của card đó — click show tooltip/popup. 5 buttons tổng cộng.
- Charts: 6 `svg.highcharts-root` SVG charts (names: "Total Clinician Capacity", "No. of Obs.", "Total Appt. Time", "No. of Appts.", "Appointments", "No. of DNAs"). Chart data series paths have classes `highcharts-graph` và `highcharts-tracker-line` (SVG `path` elements, `d` attribute contains coordinate path). Hover over any data path → `.highcharts-tooltip` element appears inside the SVG with data (e.g. "2049\n● Admin: 0 (booked) / 0 (total) 0.00%"). Tooltip is an SVG `.highcharts-tooltip` element, not a DOM overlay. Automation: find data paths via `document.querySelectorAll('path')` filtered by `cls` includes `highcharts-graph`, get bounding rect, then `page.mouse.move(x, y)`; check `.highcharts-tooltip` presence via `.highcharts-tooltip.offsetHeight > 0`. Clicking (vs hovering) does not reliably show tooltip — use `mouse.move` instead of `mouse.click`. Chart titles accessible via `svg.querySelector('text.highcharts-title')` text content.
- "More options" menu (top-right): PaComms menu với `role="menuitem"` — items: "PaComms", "Quick View", "PACO Assist", "Idle" (×2). Không có menu item nào trên Capacity & Demand page.
- "Sessions Selected" button: clickable filter button (text e.g. "5 Sessions Selected"); toggles session chip visibility in the filter panel. "Session 66AAE" removed → count changes from 5→4. Remove chips via `dispatchEvent(MouseEvent)` on `[class*="deleteIcon"]`; session chips include "Session 66AAE", "Session C95AF", "Session 6642B".
- "Clinicians Selected": display-only text (not a button), static descriptor of which clinician roles are selected — not an interactive control. Located in the Clinician Capacity filter area.
- Appointment chips: 17 chips (1 "Deselect All" + 6 role + 10 session type). Remove tương tự observation: `dispatchEvent(MouseEvent)` trên `[class*="deleteIcon"]`.
- Overlay dismissal: sau calendar hoặc preset dropdown, có thể có `modal-overlay` hoặc `.modal-container-date-range` chặn pointer events. Dùng `Escape` key hoặc `page.evaluate()` để force-hide.
- Data dependencies: organisation analytics data, provider roles, selected date range, clinician-role và observation filters.
- Assertions lacking trusted expected basis: metric values, expected roles/observations, date-range defaults, và impact của console provider-role error.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-16`.
- Raw evidence: `test-results/product-survey/batch32/`; local only, review/redact trước khi share.
- Open questions: console `Error fetching user provider roles` có visible impact không. Combobox search-to-add, chart tooltip, session chip impact, "Clinicians Selected" expand: all RESOLVED — see Automation guidance.
- Exact resume state: route `/capacity-demand/` (app redirect không có `/paco/` prefix); SPA mount sau ~8s; date-range control clickable tự nhiên sau khi `CLINICIAN CAPACITY` xuất hiện trong DOM. Batch 32 intercept là timing issue (SPA chưa mount xong), không phải z-index bug. Filter interaction test (2026-09-16) xác nhận: date container click mở dropdown, preset "This Month" mở calendar, doctor chip click stable, observation chips icon-only.
- Route: `https://blinx.dev.blinxpaco-np.com/capacity-demand/` (redirect từ `/paco/capacity-demand/`)
- Stable selectors:
  - Date-range container: `.date-range-picker__input-field--outline` — click mở dropdown preset (JS evaluate hoặc CDP click)
  - Preset dropdown: `.rdrStaticRanges` — hiện 20 options
  - Preset buttons: `.rdrStaticRange` — "All Time", "Today", "Yesterday", "This/Last Week", "This/Last Month", "Last 12 Months", "This/Last Year", "Year to Date", "This/Last Financial Year", "Financial Year To Date", "Next Week/Month/3/6/9/12 Months"
  - Calendar view (khi chọn preset): `.rdrMonth` (2 elements), `modal-container-date-range`, `modal-overlay`
  - Role chips: `.MuiChip-root` với text "Nurse", "Doctor", "Unallocated", "Pharmacist", "Mental Health Practitioner", "Admin" — click stable
  - All chips: 22 total — 1 "Deselect All" + 6 role labels + 15 icon-only observation chips (không có visible text)
  - Breadcrumb: `.Breadcrumb_breadcrumb__Btn__Q0ZAp` (button "Analytics")
  - Console errors (không visible impact): HTTP 500, "Error fetching user provider roles"

## Discovery update run-20261001-085609

`Observed: dev, Super Admin GB, 2026-10-01`; autonomous discovery read-only, checkpoint `docs/product/survey/roles/super-admin-gb-run-20261001-085609.discovery.yaml`. Không có mutation; mọi điểm dưới đây là hành vi hiện tại, chưa đối chiếu requirement.

- `Analytics & Reports > Capacity & Demand` mở app `/capacity-demand/` với dữ liệu (tổng appointment booked, planned vs actual hours).

## Super Admin GB date-filter persistence — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#17–18`.

- Known route `/capacity-demand/` có actual role header và `CLINICIAN CAPACITY`; aggregate cards populated. Không dùng metric values làm expected results.
- `Date Range` từ `All Time` mở 20 presets. Calendar có hai tháng, `Cancel` và `Apply`; `Cancel` giữ `All Time` và đóng calendar.
- Visible `This Month` → `Apply` đổi label; fresh reload giữ `This Month`. Chọn `All Time` → `Apply` rồi reload khôi phục baseline, calendar đóng. Đây là UI filter persistence; storage mechanism và metric recalculation chưa verified.
- Current root có role selection, observation section, session filter, năm card info buttons và sáu charts; chưa exercise các nhánh này.
- Execution: dùng visible controls, chờ settled actual header/date field; reconcile trước retry. Không dùng hướng dẫn force-hide overlay/dispatch lên hidden controls trong phần historical phía trên; các kỹ thuật và số liệu cũ chưa re-verify trong pass này.
- Cross-feature relationships: chỉ same-feature filter state; không source/receiver effect hai phía.

## Mutation coverage

**4/9 bounded nhánh**, `Partial (read-only)`; denominator chỉ map current pass.

| Branch | Exercised | Observed end state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Current-role root | Performed | Actual header, populated aggregate root | Reload baseline | Done |
| Date presets / Cancel | Performed | 20 presets; calendar đóng, `All Time` giữ nguyên | UI readback | Done |
| `This Month` / Apply | Performed | Selected label giữ sau reload | Reload | Done |
| Restore `All Time` | Performed | Baseline giữ sau reload, 0 dialogs | Reload | Done |
| Role selection | Skipped | Deferred sau date persistence | Chưa kiểm | N/A |
| Observation selection | Skipped | Deferred sau date persistence | Chưa kiểm | N/A |
| Session filter | Skipped | Deferred sau date persistence | Chưa kiểm | N/A |
| Card info | Skipped | Visible controls, chưa mở | Chưa kiểm | N/A |
| Chart tooltip | Skipped | Charts visible, chưa hover | Chưa kiểm | N/A |

Validation/metric correctness chưa kiểm; transitions observed chỉ filter labels. Không business-record mutation, export/share hoặc browser-storage access; không tạo record, baseline đã restore.

## Independent role/card pass — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-2011/ledger.md#6–7`. Historical date pass **4/9** phía trên giữ riêng.

- Actual destination header cần chờ shell settle; root có `All Time`, clinician-role chips và sáu card families. Role ở app khác không chứng minh access app này.
- Exact visible `Doctor` click đổi child icon/text marker sang grey; outer chip class/style không phản ánh selected state. Từ observed grey state, click restore non-grey rồi reload giữ cùng color. Original child color chưa capture trước first click, nên không kết luận exact initial selection hoặc metric correctness.
- Clinician card info mở bằng natural hover, không phải click trong pass này; hover heading dismiss. Help copy mô tả axes, clinical-role lines và loại session type `List`, không là trusted calculation rule.
- `Sessions Selected` có DOM rect nhưng computed `visibility: hidden`; observation `Search observation` cũng hidden, scoped actionable `Open` không có. Không force-click, unhide, dispatch hoặc keyboard-select; historical hidden-control instructions không áp dụng cho pass hiện tại.
- Natural chart-path hover bị background rect intercept; natural SVG hover không hiện tooltip. Tooltip interaction `Inconclusive`, chưa xác lập defect hoặc nguyên nhân.
- Persistence chỉ UI marker retention sau reload; không validation submit, export, saved business mutation hoặc new two-sided relationship. Không record được tạo; exact original marker restoration chưa proven.

### Mutation coverage — independent pass

**2/5 bounded branches**, `Partial (read-only)`; không cộng denominator historical date pass.

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Doctor toggle / restore | Performed | Grey rồi non-grey; exact original color chưa capture | Non-grey color retained sau reload | Done — no business record; initial marker equality unverified |
| Clinician card info hover / dismiss | Performed | Tooltip hiện rồi đóng | Transient UI | Done |
| Session filter open / close | Skipped | `Blocked`: control computed hidden; 0 clicks | Not Run | N/A |
| Observation search / clear | Skipped | `Blocked`: hidden input, không naturally actionable opener | Not Run | N/A |
| Chart tooltip | Skipped | `Inconclusive`: intercepted line hover, natural SVG hover không tooltip | Not Run | N/A |

- Untested: metric correctness, role-selection semantics, changed preference persistence isolation, other info cards, observation/session selection, chart tooltip content. Dimensions: navigation `done`; main_workflow, branches_states, persistence, errors_edge `partial`; mutation/validation/relationships `none`.
- Closure: `All Time`, non-grey Doctor marker, tooltip đóng; idle-session prompt giữ nguyên. URL/header check không chứng minh renewed session validity; auth preflight cần làm lại khi run sau bắt đầu.

## Tester notes
