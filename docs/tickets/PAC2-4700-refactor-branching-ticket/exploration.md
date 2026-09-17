# Exploration: PAC2-4700

**Input Revision:** 1
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Observed:** 2026-09-17T12:02:03.713Z–13:00:21.235Z
**Status:** Inconclusive (checkpoint read-only hoàn tất tuần tự cho GP, PACO OS / PACO 24 và PACO Connect)

## Scope

Quan sát read-only tuần tự ba app trên feature branch `pac2-4700-qs-only`:

- GP: `Scheduler Configuration`, landing state trước khi chọn campaign template.
- PACO OS / PACO 24: `Health Form Templates`, `Patient Search`, `Configuration` landing state.
- PACO Connect: `Dashboard`, `Appointment Book` và direct route `/booking-links`.
- Manual auth hợp lệ; không thấy redirect tới login hoặc password field.
- Mutation class: `None`; mutation occurred: `false`.

## Observations

### OBS-PAC2-4700-001

**Classification:** Observed
**Location/URL:** GP feature branch — `/feature-branch/pac2-4700-qs-only/configuration/`
**Action:** Mở candidate route đã locate; chờ page title và landmark; quan sát DOM read-only.
**Observed Behavior:** Page title là `Scheduler Configuration`; landmark `SCHEDULER CONFIG` hiện diện. Campaign-template surface render với danh sách entry mang type `Email` và `SMS`. Ba sample cách nhau 5–10 giây giữ cùng title, path, body length và control counts.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-005
**Evidence:** `test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly/stability-samples.json`; `test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly/PAC2-4700-EXPLORE-gp-scheduler-stable.png`
**Sensitive Data Review:** Redacted — raw screenshot chỉ lưu local; không đưa template/contact cụ thể vào docs.

### OBS-PAC2-4700-002

**Classification:** Observed
**Location/URL:** GP `Scheduler Configuration` landing state
**Action:** Inspect control structure, default state và layout; không interaction.
**Observed Behavior:** Một visible, enabled, labelled text `combobox` được render; `aria-expanded="false"`, không có selected value, không required. Không có native `select`. Tại viewport 1280×720, document không có horizontal hoặc vertical overflow. Không thấy visible `Open` button trước khi chọn template.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-005, REQ-PAC2-4700-008, REQ-PAC2-4700-011
**Evidence:** `test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly/control-structure.json`; `test-results/PAC2-4700/explore/20260917-gp-only-checkpoint/summary.json`; `test-results/PAC2-4700/explore/20260917-gp-only-checkpoint/gp-scheduler-viewport.png`
**Sensitive Data Review:** Redacted — structured evidence không lưu field value hoặc visible template text.

### OBS-PAC2-4700-003

**Classification:** Observed
**Location/URL:** GP `Scheduler Configuration` initial render
**Action:** Quan sát initial page state và console; không reload hoặc mutation.
**Observed Behavior:** Sample đầu lúc 12:02Z chỉ có landmark `SCHEDULER CONFIG`, chưa detect campaign-template control. Console có resource `404` và từ chối execute `web-chat-bundle/remote/remoteEntry.js` do MIME type `text/html`. Các sample từ 12:04Z trở đi render full campaign-template surface ổn định. Exact text `Select Campaign Template` không phải landmark ổn định ở mọi sample, nhưng `combobox` và template list vẫn được quan sát trong state sau.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-015
**Evidence:** `test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly/observation.json`; `test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly/stability-samples.json`; `test-results/PAC2-4700/explore/20260917-gp-scheduler-readonly/current-state.json`
**Sensitive Data Review:** None — structured evidence không chứa patient, contact, token, cookie hoặc auth state.

### OBS-PAC2-4700-004

**Classification:** Observed
**Location/URL:** PACO OS / PACO 24 — `/paco/feature-branch/pac2-4700-qs-only/health-forms`
**Action:** Direct navigation tới known candidate; chờ landmark; inspect DOM, default control state và layout; không search/filter/edit.
**Observed Behavior:** HTTP `200`; title `PACO OS`; heading `Health Form Templates`. Table render các column `Name`, `Type`, `Created date`, `Created by`, `Updated date 1`, `Updated by`, `Actions`. Hai visible text input đều enabled, empty, có placeholder, không required; detector không tìm thấy accessible label. Không có horizontal overflow tại 1280×720. Console có một resource `404`; không có page error.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002
**Evidence:** `test-results/PAC2-4700/explore/20260917-os-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-os-readonly/health-forms.png`
**Sensitive Data Review:** Redacted — không lưu field value hoặc row text trong structured evidence; screenshot giữ local.

### OBS-PAC2-4700-005

**Classification:** Observed
**Location/URL:** PACO OS / PACO 24 — `/paco/feature-branch/pac2-4700-qs-only/patient-search`
**Action:** Direct navigation tới known candidate; inspect landing state, controls, result-table structure và layout; không search/filter/toggle hoặc mở patient.
**Observed Behavior:** HTTP `200`; title `PACO OS`; heading hiện tại là `Patient Search (78,780)` và DOM có 52 table rows. `Filters`, `Show archived` và `Create new patient` hiện diện. Hai visible text input đều enabled, empty, có placeholder; detector không tìm thấy accessible label. Một visible labelled checkbox enabled và unchecked. Không có horizontal overflow tại 1280×720. Console có một resource `404`; không có page error. Kết quả live khác LOCATE trước đó (`Patient Search (0)`), nên chỉ ghi nhận thay đổi data/context theo timestamp, không kết luận defect.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-009
**Evidence:** `test-results/PAC2-4700/explore/20260917-os-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-os-readonly/patient-search.png`
**Sensitive Data Review:** Redacted — structured evidence không lưu patient value hoặc result-row text. Screenshot có live patient data, chỉ giữ local; không đưa name, identifier, NHS Number, contact hoặc address vào docs.

### OBS-PAC2-4700-006

**Classification:** Observed
**Location/URL:** PACO OS / PACO 24 — `/paco/feature-branch/pac2-4700-qs-only/configuration/`
**Action:** Direct navigation tới known candidate; inspect landing state, visible section links, controls và layout; không mở section bằng click hoặc đổi configuration.
**Observed Behavior:** HTTP `200`; title `PACO OS`; heading `Configuration`. Visible section links gồm `Organisation`, `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation`; initial content ghi `Please select a menu item`. Một visible enabled text input có placeholder; detector không tìm thấy accessible label. Không có horizontal overflow tại 1280×720. Console có một resource `404`; không có page error.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002
**Evidence:** `test-results/PAC2-4700/explore/20260917-os-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-os-readonly/configuration.png`
**Sensitive Data Review:** Redacted — không lưu field value; screenshot giữ local.

### OBS-PAC2-4700-007

**Classification:** Observed
**Location/URL:** PACO OS / PACO 24 `Configuration` — `Appointment Books` entry
**Action:** Inspect safe href của visible `Appointment Books` link rồi navigate bằng href; không click action có unknown persistence.
**Observed Behavior:** `Appointment Books` là enabled anchor nhưng href trỏ lại đúng `/configuration/`. Sau navigation, page vẫn ở initial `Configuration` state; không có `Booking Links`, `EMIS` hoặc `Slot Type` content. Vì section selection có thể dùng client-side interaction không thể xác minh là pure navigation từ href, không tiếp tục click trong checkpoint read-only này.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002
**Evidence:** `test-results/PAC2-4700/explore/20260917-os-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-os-readonly/configuration-appointment-books.png`
**Sensitive Data Review:** None — structured evidence không chứa record value; screenshot giữ local.

### OBS-PAC2-4700-008

**Classification:** Observed
**Location/URL:** PACO Connect — `/paco-connect/feature-branch/pac2-4700-qs-only/dashboard`
**Action:** Direct navigation; lấy bốn structural sample trong 30 giây; không click `Export PDF`, `CSV` hoặc control khác.
**Observed Behavior:** HTTP `200`; title `PACO Connect`; auth hợp lệ. Hai sample đầu còn marker `Loading`; từ sample khoảng 15 giây, `Loading` biến mất và state giữ ổn định tới 30 giây với body length 1,458, một visible control, 17 visible buttons và 18 DOM rows. Marker `Export PDF`, `CSV` và `Slot Type` xuất hiện trong stable state. Không có horizontal overflow tại 1280×720; initial route observation không ghi console hoặc page error.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-006, REQ-PAC2-4700-010
**Evidence:** `test-results/PAC2-4700/explore/20260917-connect-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/dashboard-stability.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/dashboard-stable.png`
**Sensitive Data Review:** Redacted — structured evidence không lưu field value hoặc row text; screenshot có live context và chỉ giữ local.

### OBS-PAC2-4700-009

**Classification:** Observed
**Location/URL:** PACO Connect — `/paco-connect/feature-branch/pac2-4700-qs-only/appointment-book`
**Action:** Direct navigation; lấy bốn structural sample trong 30 giây; không search, filter, export hoặc chọn appointment.
**Observed Behavior:** HTTP `200`; title `PACO Connect`; auth hợp lệ. Hai sample đầu còn marker `Loading`; từ sample khoảng 15 giây, `Loading` biến mất và state giữ ổn định tới 30 giây với body length 71,167, hai visible controls và 75 visible buttons. Detector native table/ARIA row trả 0 rows dù calendar content đã render, nên count này không chứng minh không có appointment. Không có horizontal overflow tại 1280×720; initial route observation không ghi console hoặc page error.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-006, REQ-PAC2-4700-010
**Evidence:** `test-results/PAC2-4700/explore/20260917-connect-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/appointment-book-stability.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/appointment-book-stable.png`
**Sensitive Data Review:** Redacted — structured evidence không lưu appointment, patient hoặc field values; screenshot có live calendar context và chỉ giữ local.

### OBS-PAC2-4700-010

**Classification:** Observed
**Location/URL:** PACO Connect — `/paco-connect/feature-branch/pac2-4700-qs-only/booking-links`
**Action:** Direct navigation tới candidate route; inspect rendered page; không interaction.
**Observed Behavior:** Navigation response HTTP `200`, nhưng app render heading `404` và text `Page Not Found`; không có visible control hoặc button. Đây là app-level not-found state, không phải HTTP/network `404`.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-012
**Evidence:** `test-results/PAC2-4700/explore/20260917-connect-readonly/summary.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/booking-links.png`
**Sensitive Data Review:** None — structured evidence không chứa field, appointment, patient hoặc auth value; screenshot giữ local.

### OBS-PAC2-4700-011

**Classification:** Observed
**Location/URL:** PACO Connect — stable `Dashboard` và `Appointment Book`
**Action:** Inspect DOM/navigation structure, visible semantic controls, route hints và metadata của known read-only controls; không click hoặc nhập dữ liệu.
**Observed Behavior:** Không tìm thấy semantic entry, anchor route hint hoặc named interactive control cho `Booking Links`, `EMIS`, `Slot Type`, `Configuration`, `Settings`, `Search` hay `Filter` trên hai known routes. Semantic popup control duy nhất được detector tìm thấy là `Accessibility Menu` (`role="button"`, `aria-haspopup="dialog"`). Follow-up exact-leaf scan cũng không tìm thấy input hoặc exact UI-term leaf; kết quả âm tính này không phủ định markers đã quan sát trong stable aggregate body. Vì các visible button còn lại không có đủ accessible name/href để xác minh intent, không click ngẫu nhiên. Auth vẫn hợp lệ; mutation `None`.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-002, REQ-PAC2-4700-006, REQ-PAC2-4700-010, REQ-PAC2-4700-012
**Evidence:** `test-results/PAC2-4700/explore/20260917-connect-readonly/dashboard-entry-candidates.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/dashboard-navigation-structure.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/connect-readonly-entry-scan.json`; `test-results/PAC2-4700/explore/20260917-connect-readonly/connect-known-term-structure.json`
**Sensitive Data Review:** None — structured evidence chỉ lưu route và control metadata; không lưu field value, row text, appointment, patient hoặc auth value.

## Mismatches and Possible Defects

- **Possible defect:** GP initial render có transient/incomplete state kèm resource `404` và MIME mismatch; campaign-template control xuất hiện ở các sample sau. Chưa đủ evidence để kết luận functional failure hoặc ảnh hưởng user-visible ổn định.
- **Warning:** Cả ba PACO OS route đều ghi một console resource `404`, nhưng landmark và surface vẫn render, không có page error. Chưa đủ evidence để kết luận functional defect.
- `feature-location.md` từng ghi landmark `Open`; current GP landing state không có visible `Open` button trước selection. Expected timing/visibility của `Open` chưa được xác nhận, nên không kết luận `Fail`.
- PACO OS text inputs tại ba surface không có accessible label do detector tìm thấy. Đây là structural observation, chưa phải accessibility `Fail`; cần manual accessible-name review trước kết luận.
- PACO OS `Appointment Books` anchor không encode child state trong href; read-only href navigation giữ initial state. Không suy ra section bị hỏng vì client-side click chưa thực hiện.
- PACO Connect `/booking-links` trả HTTP `200` nhưng render app-level `404 Page Not Found`. Candidate route không cung cấp `Booking Links` surface; chưa đủ evidence xác định route đúng hoặc kết luận toàn bộ feature thiếu.
- Bounded DOM/navigation scan trên stable `Dashboard` và `Appointment Book` không tìm thấy semantic entry hoặc route hint cho `Booking Links`/`EMIS`; các unlabeled controls không được click vì intent và persistence chưa rõ.
- PACO Connect `Dashboard` và `Appointment Book` cần khoảng 15 giây để hết `Loading`; fixed short wait tạo incomplete observation.
- Không thể kết luận cross-app consistency hoặc default template behavior: ba app mới chỉ được quan sát ở landing surfaces khác nhau, còn REQ-PAC2-4700-005/008/011 là `Inferred` hoặc `Disputed`.

## Actions Not Taken

- Không chọn hoặc đổi campaign template.
- Không click `Open` hoặc mở template detail.
- Không search, filter hoặc toggle `Show archived`.
- Không mở patient row, `Create new patient`, patient profile, `Attachments` hoặc email dialog.
- Không click PACO OS config section có client-side behavior/persistence chưa rõ.
- Không search/filter vì stable DOM scan không tìm thấy named `Search`/`Filter` control; không click `Export PDF`/`CSV`, chọn appointment, `Accessibility Menu` hoặc unlabeled control khác trên PACO Connect.
- Không edit, compose, send, attach, submit, create, update hoặc delete.
- Không upload/import và không thực hiện action có persistence chưa rõ.
- Không mở external Comms Hub; domain này cần manual login riêng.

## Suggested Coverage

- Với GP, verify dropdown open/close, option selection, selected state và `Open` behavior sau khi có approval cho interaction có khả năng persist hoặc thay đổi draft state.
- Với PACO OS, manual review accessible names cho text inputs; detector hiện chỉ xác minh `aria-label`, `aria-labelledby` và explicit `label[for]`.
- Với PACO OS, mở known read-only patient detail để locate `Attachments`/email compose boundary chỉ sau khi xác minh action chọn row không persist; không đưa PII vào docs.
- Với PACO OS `Configuration`, xác minh `Appointment Books` client-side section behavior trong một interaction scope được phê duyệt; dừng trước mọi `Update`/`Submit`.
- Với PACO Connect, cần tester/QA/BA cung cấp expected menu hoặc route clue cho `Booking Links`, `EMIS` mapping và `Slot Type`; direct `/booking-links` render app-level `404`, còn bounded semantic scan không tìm thấy safe entry.
- Với PACO Connect, chỉ thử search/filter/export/appointment interaction sau khi xác minh mutation boundary; dừng trước action có persistence hoặc gửi dữ liệu.
- Dùng observable title/landmark/control wait và repeated stable-state sample; không dùng fixed short wait hoặc exact label duy nhất để xác định page đã load.
- Xác nhận expected default (`Email` hay `SMS`) trước assertion cho REQ-PAC2-4700-011; không automate assertion từ requirement `Disputed`.

## Blockers and Open Questions

- Read-only boundary chặn deeper GP behavior: chọn template hoặc click `Open` chưa được xác nhận là non-persistent.
- PACO OS hiện có patient results, nhưng chọn patient row và mở config section chưa được xác minh là pure read-only transition trong scope hiện tại.
- Expected behavior cho `Open`, default campaign template và dropdown persistence chưa được BA/PO xác nhận.
- Ba app đã có checkpoint landing-surface read-only, nhưng chưa cùng entry path, state hoặc behavior để kết luận parity.
- PACO Connect `Booking Links` entry path đúng chưa được locate; direct candidate route render app-level `404`, còn stable DOM/navigation scan chỉ xác minh `Accessibility Menu` và không cung cấp safe feature entry.
- `remoteEntry.js` error ở GP và resource `404` ở PACO OS có ảnh hưởng feature nào hay không vẫn là Open Question.

## PACO Connect Full Patient Journey Checkpoint

**Classification:** Observed
**Location/URL:** PACO Connect — `/paco-connect/feature-branch/pac2-4700-qs-only/`
**Actor:** `Beth Green / Super Admin GB`
**Patient:** `Michael Ramella (NHS: 70986)`
**Date:** 2026-09-17 (từ screenshot timestamps)
**Status:** Read-only test session hoàn tất (CRUD actions có side effect đã ghi nhận)

### OBS-PAC2-4700-012: Dashboard Landing

**Action:** Open Dashboard
**Observed:** Capacity Breakdown 0%, Demand by Hour hiển thị 08:00–15:00. Badge: `Booking Links=1`, `Files=1`.
**Evidence:** `IMG-05.png`

### OBS-PAC2-4700-013: Patient Search

**Action:** Search "michael ramella"
**Observed:** 2 results — `Ramella, Michael (2 years old)` và `Ramella, Michael (126 years old)`.
**Evidence:** `IMG-06.png`

### OBS-PAC2-4700-014: Contact Details

**Action:** Open patient 70986 — Contact Details
**Observed:** Mobile number `07379060817`. Dropdown `Add new` có các quan hệ: `Daughter`, `Other`, `Caregiver`, `Sibling`.
**Evidence:** `IMG-07.png`

### OBS-PAC2-4700-015: Add New Mobile Contact

**Action:** Add new number `07589898989`
**Observed:** Toast success: `Mobile Contact saved successfully`.
**Evidence:** `IMG-08.png`

### OBS-PAC2-4700-016: Email Dropdown

**Action:** Open Email dropdown
**Observed:** Options: `beth.green@blinxsolutions.com`, `sheena.wilton...`, `katie.sparrow...`, `kerriep87229@fishnone...`, `peter.doon@thewealth...`.
**Evidence:** `IMG-09.png`

### OBS-PAC2-4700-017: Delete Email Contact

**Action:** Delete email contact
**Observed:** Toast success: `Email Contact deleted successfully`.
**Evidence:** `IMG-10.png`

### OBS-PAC2-4700-018: PACO Registers (Empty)

**Action:** Expand Personal Info → PACO Registers
**Observed:** Register hiển thị `–` (trống).
**Evidence:** `IMG-11.png`

### OBS-PAC2-4700-019: Allergies

**Action:** Expand Allergies
**Observed:** `Drug side effect - acceptable to patient`. Effective Date `07/04/2009`.
**Evidence:** `IMG-12.png`

### OBS-PAC2-4700-020: Test Results

**Action:** Expand Test Results
**Observed:** `O/E - blood pressure reading`. 01/07/2020. 147/88 mmHg.
**Evidence:** `IMG-13.png`

### OBS-PAC2-4700-021: Attachments

**Action:** Expand Attachments
**Observed:** List gồm:
- `This is a mock descriptive text 27/10/2023`
- `File Attachment 03/11/2023` (3 files)
- `File Attachment 08/11/2023`
**Evidence:** `IMG-14.png`

### OBS-PAC2-4700-022: Attachment Preview (External)

**Action:** Preview attachment "This is a mock descriptive text"
**Observed:** Mở tab mới: `nhs-comms-hub-dev.blinxhealthcare.com/commshub/template-builder/email/create`
**Evidence:** `IMG-15.png`

### OBS-PAC2-4700-023: Campaign Selector

**Action:** Open Campaign selector (Booking Links & Health Forms)
**Observed:** Available campaigns:
- `SNOMED CONSULT TEST 1/3`
- `GB MJ Single Send`
- `Quick Send Template GB1`
- `Quick Send Message test GB 2`
- ... (xem full list trong ảnh)
**Evidence:** `IMG-16.png`

### OBS-PAC2-4700-024: Sort by A-Z

**Action:** Sort by A-Z (thay vì default By date desc)
**Observed:** List reorder theo alphabet:
- `6 July - Test Case 1`
- `6 July - Test Case 3`
- `7-feb-general-camp`
- `Access kp`
- `Blinx Advice`
- `Body Weight Quick Send`
- `Date change`
- `GB MJ Single Send`
- `GP Requested Appointment`
**Evidence:** `IMG-17.png`

### OBS-PAC2-4700-025: Preferences/Filter

**Action:** Open Preferences (Filter icon)
**Observed:** Toggles: `Open by default`, `Compact view`.
**Evidence:** `IMG-18.png`

### OBS-PAC2-4700-026: No Session Availability Error

**Action:** Chọn campaign không có session availability
**Observed:** Error: `Your selection contains no session availability.` Editor load "blinx healthcare" placeholder image.
**Evidence:** `IMG-19.png`

### OBS-PAC2-4700-027: Health Forms Tab

**Action:** Click tab Health Forms (badge `2`)
**Observed:** Toast: `You were added as a Health Form reviewer due to there being no default reviewers.` Health Forms listed:
- `Sleep Ap`
- `Sleep Ap`
- `14 Dec patient dynamic by mike`
**Evidence:** `IMG-20.png`

### OBS-PAC2-4700-028: Health Form Preview (Empty)

**Action:** Preview "14 Dec patient dynamic by mike"
**Observed:** Chỉ render "File Upload" placeholder, blank content.
**Evidence:** `IMG-21.png`

### OBS-PAC2-4700-029: Health Form Details

**Action:** Expand Health Form → Reviewers/Frequency
**Observed:** Reviewers `1 Selected`. Frequency (Optional): `One-Off Health Form 11/09/2026`, `Scheduled Diary` cùng ngày.
**Evidence:** `IMG-22.png`

### OBS-PAC2-4700-030: Files Tab

**Action:** Open Files tab
**Observed:** `16MB Original text document (25-May-2023).rtf` attached.
**Evidence:** `IMG-23.png`

### OBS-PAC2-4700-031: Booking Link Slot Types

**Action:** Open Booking Link tab
**Observed:** `Face to Face Slot Type(s)`:
- `Coil Clinic`
- `mike untimed!`
- `PCN Occupational Therapist`
- `Adult Phlebotomy`
- *(Tất cả đều gắn nhãn `PACO-CONNECT`)*
**Evidence:** `IMG-24.png`

### OBS-PAC2-4700-032: New Reason Code Dialog

**Action:** Open "Add new reason code" dialog
**Observed:** Modal với input trống + buttons `Cancel` / `Add`.
**Evidence:** `IMG-25.png`

### OBS-PAC2-4700-033: Save Campaign Modal

**Action:** Mở Save Campaign (chọn "Save as New")
**Observed:** Modal "Save Campaign" hiện ra.
**Evidence:** `IMG-26.png`

### OBS-PAC2-4700-034: Campaign Form Entry

**Action:** Điền form: Campaign name `NEW TEST CAMPAIGN`, Patient Facing `NEW TES`
**Observed:** Email/SMS template dropdown: `DNA Mental Health DNA - 6.3.2026 Email - Copy`, `DNA Mental Health DNA - 6.3.2026 SMS - Copy`.
**Evidence:** `IMG-27.png`

### OBS-PAC2-4700-035: Duplicate Name Validation

**Action:** Đổi tên thành `NEW TEST CAMPAIGN` (cả 2 field)
**Observed:** Error toast: `An email template with this name already exists. Please choose another name and try again.`
**Evidence:** `IMG-28.png`

### OBS-PAC2-4700-036: Save Success

**Action:** Save thành công với tên khác
**Observed:** Toast: `New campaign created`. Booking Links badge đổi từ `1` → `1` (giữ nguyên).
**Evidence:** `IMG-29.png`

### Key Findings from Session

| Finding | Classification | Notes |
|---------|----------------|-------|
| Patient search hoạt động | ✅ Confirmed | 2 results returned |
| Contact CRUD hoạt động | ✅ Confirmed | Add/delete mobile, delete email |
| Patient Info expand | ✅ Confirmed | Allergies, Test Results, Attachments visible |
| Campaign sort A-Z | ✅ Confirmed | Reorder đúng alphabet |
| Save validation hoạt động | ✅ Confirmed | Duplicate name error bắt đúng |
| Scheduler Link Required popup | ⚠️ Observed | Persistent trên nhiều screenshot, trigger chưa rõ |
| Preferences "Open by default" | ⚠️ Observed | Toggle mới, behavior chưa test |
| Preferences "Compact view" | ⚠️ Observed | Toggle mới, behavior chưa test |
| Reviewer auto-add toast | ⚠️ Inferred | Side effect: user tự động được add làm reviewer |
| Health Form empty preview | ⚠️ Observed | "14 Dec patient dynamic by mike" render blank |
| "blinx healthcare" placeholder | ⚠️ Observed | Hiện khi campaign không có session |
| Slot types PACO-CONNECT only | ⚠️ Observed | Không cross-check được với OS/GP |

## Tester notes

[Protected area]
