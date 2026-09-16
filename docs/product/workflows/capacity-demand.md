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
- Observation search input: `input[placeholder="Search observation"]` với `role="combobox"` — dùng để thêm observations mới (chưa test).
- Card info buttons: mỗi card có icon button (`[aria-label="This card is an overview..."]`) chứa mô tả chi tiết của card đó — click show tooltip/popup. 5 buttons tổng cộng.
- Charts: 6 `highcharts-root` SVG charts. Interactive paths với Highcharts (fill/stroke attributes). Click path → tooltip.
- "More options" menu (top-right): PaComms menu với `role="menuitem"` — items: "PaComms", "Quick View", "PACO Assist", "Idle" (×2). Không có menu item nào trên Capacity & Demand page.
- "Sessions Selected" button: clickable filter button (visible after scroll, count phản ánh số session chips đã chọn). "Session 66AAE" removed → count giảm 5→4.
- "Clinicians Selected": display-only text, không expand được.
- Appointment chips: 17 chips (1 "Deselect All" + 6 role + 10 session type). Remove tương tự observation: `dispatchEvent(MouseEvent)` trên `[class*="deleteIcon"]`.
- Overlay dismissal: sau calendar hoặc preset dropdown, có thể có `modal-overlay` hoặc `.modal-container-date-range` chặn pointer events. Dùng `Escape` key hoặc `page.evaluate()` để force-hide.
- Data dependencies: organisation analytics data, provider roles, selected date range, clinician-role và observation filters.
- Assertions lacking trusted expected basis: metric values, expected roles/observations, date-range defaults, và impact của console provider-role error.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-16`.
- Raw evidence: `test-results/product-survey/batch32/`; local only, review/redact trước khi share.
- Open questions: observation chip thêm (search combobox `input[placeholder="Search observation"]`); chart tooltip interaction; "Clinicians Selected" expand behavior; session type chip toggle impact; console `Error fetching user provider roles` có visible impact không.
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

## Tester notes
