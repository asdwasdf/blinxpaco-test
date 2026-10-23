# Workflow: Analytics & Reports

- Classification: `[Observed: dev, Super Admin GB, 2026-10-01]`
- Aliases: `Analytics & Reports`, `Reports`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`
- Coverage: `Partial`
- Confidence: `Medium`

## Business context observed

- Visible purpose: phân tích dân số bệnh nhân, thuốc, QOF, capacity; báo cáo SCR/NCRS.
- Actor/role: `Super Admin GB`.
- Required context: phiên PACO; Comms Analytics cần phiên Comms Hub.
- Starting data state: analyser có dữ liệu bệnh nhân (PII, không ghi lại).
- Entities and statuses: report, cohort, saved report.

## Entry

1. Sidebar `Analytics & Reports` → submenu `Capacity & Demand`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`, `Reports`.
2. `Patient Analyser`/`Medication Analyser`/`QOF Registers`/`Patient Details` cùng mở app `/patient-analyser-new/`.

## Read-only flow

1. **Action:** `Reports`.
   - **Observed result:** `/paco/analytics-reports?report=scr&error=not-authorized`, tab `SCR`, `Patient Cases`, `Prescriptions`, `NCRS`.
2. **Action:** tab `Patient Cases`/`Prescriptions`/`NCRS`.
   - **Observed result:** `Access Denied` cho cả ba.
3. **Action:** `Advanced Search` trong analyser.
   - **Transition:** dialog `Advanced Patient Search` (`Analyse`, `Import`, `Reference Report(s)`, `Add Rule Group`).

## Decision points

- **Visible condition:** quyền report của role.
  - **Branch A:** SCR mặc định báo `not-authorized`.
  - **Branch B:** các tab khác `Access Denied`. Role nào được xem: `Open Question`.

## End and exceptional states

- Error: `not-authorized`, `Access Denied`.
- Cross-feature handoff: analyser → Comms Hub (`Send to Comms Hub`, `Group Quick Send`); `Comms Analytics` → Comms Hub login.

## Safety boundary

- Last safe read-only state: dialog `Advanced Patient Search` (chưa chạy `Analyse`).
- Approval stop: `Send to Comms Hub`, `Group Quick Send` (SEND), `Save Report`, `Import` (upload).
- Mutation: `None`

## Execution guidance

- Setup/data: cohort bệnh nhân synthetic và recipient được duyệt nếu cần thử luồng gửi.
- Safe manual steps: Entry, Read-only flow 1–3.
- Stop and request approval before: mọi SEND, save, import.
- Evidence to capture: heading và URL của từng tab report.

## Automation guidance

- Stable roles/labels/landmarks: tab text `SCR`/`Patient Cases`/`Prescriptions`/`NCRS`; heading `Access Denied`; dialog `Advanced Patient Search`.
- Observable waits: analyser cần ~9s; menu sidebar có nhãn trùng (`QOF Registers`) nên chọn button visible cuối.
- Data dependencies: cohort synthetic.
- Assertions lacking trusted expected basis: quyền xem report của role; không assert `Access Denied` là defect.

## Provenance and gaps

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-01 (run-20261001-085609)
- Raw evidence: `test-results/product-survey/run-20261001-085609/outcomes/`
- Open questions: quyền report theo role; `error-at-axios-interceptor` của Comms Analytics; `Columns` analyser không click được.
- Exact resume state: checkpoint run trên.

## Autonomous Reports boundary — 2026-10-22

`Observed: dev, Config Admin hiển thị tại destination; intended role Blinx Deployment chưa verified`; provenance `product-explore/auto-20261022-0714/ledger.md#11–12`.

- Sidebar `Reports` mở `/paco/analytics-reports/scr-reports`, landmark `Reporting`, `SCR (0 records)`; tree `SCR`, `Patient Cases`, `Prescriptions`, `NCRS`, `Safeguarding`, `Clinical Guardian`.
- Visible `Search consent...`, `Export`, `Columns`, `Filters`; grid headers `Case ID`, `Consent outcome`, `Accessed By`, `Accessed Time`, `Reason`, `Accessed Date`, `Actions`. Không search/export hoặc mở patient/report rows.
- Destination và Dashboard reconciliation hiển thị `Config Admin`; final targeted Dashboard header không có intended `Blinx Deployment`, dù nhãn đó xuất hiện ngoài header. Dừng, không tự switch role hoặc kết luận permission; whole-page label không chứng minh active role, lịch sử role khác giữ provenance riêng.

### Mutation coverage

| Nhánh/candidate | Thực hiện | End state hoặc lý do |
|---|---|---|
| Reports root dưới intended role | `Skipped` | Role/context chưa verified; chỉ ghi boundary UI |
| Search consent / Columns / Filters | `Skipped` | Dừng trước thao tác vì role mismatch |
| Export hoặc saved report lifecycle | `Skipped` | Không owned report data, role/context chưa verified |

Supported workflow branch count chưa map; không cộng boundary vào business coverage. Validation, state transitions, saved persistence và relationships `Not Run`; cleanup `N/A`, không tạo record hoặc leftovers. Resume sau exact intended role được khôi phục và verify.

## Super Admin GB Reports access — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1206/ledger.md#15`. Historical role/context boundary giữ riêng.

- Known route `/paco/analytics-reports/scr-reports` settles tại `/paco/analytics-reports`; `Reporting` shell và actual `Super Admin GB` header verified. SCR body hiển thị `You are not authorized to view Summary Care Record (SCR) report.`
- Tree có `SCR`, `Patient Cases`, `Prescriptions`, `NCRS`, `Safeguarding`, `Clinical Guardian`. Chọn `Patient Cases` tới `/paco/analytics-reports/patient-cases`, hiện `Access Denied`, `Sorry, you are not authorized to access this page.` và `Go to Home`; fresh reload vẫn denied. Không report/patient data inspected.
- Return SCR rồi settled header vẫn đúng role; không suy role switch từ early header assertion. `Analytics` click trong Reporting shell chưa đổi path/headings/report links hoặc denial; intended behavior và alternate navigation chưa xác lập, branch `Inconclusive`.
- Main report data workflow `Blocked`; cần trusted permission/role prerequisite OQ-069. Không thử sibling reports để né gate, không assert denial là defect. Search/filter/export và saved report lifecycle chưa chạy.

### Mutation coverage

| Nhánh | Thực hiện | End state / persistence / lý do | Cleanup |
|---|---|---|---|
| Current-role SCR root/access | `Performed` | Authenticated shell và exact SCR denial; return navigation verified | `Done`: không record |
| Patient Cases access/reload | `Performed` | `Access Denied` giữ sau reload; không data inspected | `Done`: return SCR |
| Analytics alternate navigation | `Skipped` | Click không changed known state; intended end state `Inconclusive` | `N/A` |
| Other report bodies | `Skipped` | Permission prerequisite chưa rõ, không probe sibling gates | `N/A` |
| Report search/filter/columns | `Skipped` | Không authorized report body | `N/A` |
| Export / saved report lifecycle | `Skipped` | Không owned report fixture hoặc authorized data scope | `N/A` |

**2/6 bounded branches**, `Partial (read-only)`. Chỉ permission/error states verified; business mutations, input validation, saved persistence và two-sided relationships `Not Run`; 0 leftovers.

## Super Admin GB Patient Analyser — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1414/ledger.md#7–8`. Independent analyser app; Reports permission gate OQ-069 và historical ticket layouts giữ riêng.

### Entry, data và interactive flow

1. Authenticated session tới known route `/patient-analyser/`; title `Patient & Medication Analyser`, actual role header verified. Root có `1 Selected`, `Save Report`, `Advanced Search`, `Reset View`, `Expand All`, `Collapse All`; không mở patient rows hoặc existing report.
2. `Advanced Search` mở `Advanced Patient Search`: `Query builder`, `Add Patient Rule`, `Add Patient Group`, rule-field picker, `Delete Patient Rule`, `Reference Report(s)`, `Cancel`, `Search`; còn `Tutorial` và `Try New Version`. Layout này khác historical `Analyse`/`Import`; không suy các control cũ vẫn hiện.
3. Field picker quan sát `Full Name`, `Gender`, `Observation Effective Date`, `Observation Term`, `Observation Type`, `Patient ID`; đây không phải inventory đầy đủ vì virtual list. Chọn `Full Name` xuất hiện operator và value pickers.
4. Operator options quan sát `equal to`, `not equal to`, `contains`, `begins with`, `ends with`, `does not contain`, `does not begin with`, `does not end with`, `in`, `not in`. Chọn `contains`, nhập synthetic token rồi chọn đúng option synthetic; typed text đơn thuần chưa là selected value.
5. `Search` đóng dialog, badge đổi từ `0` sang `1`. Reopen giữ field/operator/value; reload rồi reopen vẫn giữ đúng owned rule. Đây là UI query preference persistence, không saved report hoặc server-storage proof.
6. Cleanup bằng `Delete Patient Rule` trên đúng owned synthetic rule, rồi `Search` với query rỗng. Badge về `0`, reload/reopen vẫn `0` và không synthetic value; `Cancel` đóng dialog. Không tạo business record.

### Validation, persistence và exceptional states

- Blank/invalid/duplicate/boundary validation chưa thử; field/operator labels không chứng minh validation rule.
- Query applied có 0 rendered grid rows, pager không có numeric summary và không empty landmark; cohort correctness `Inconclusive`, không kết luận empty dataset hoặc product defect.
- Combobox input bị selection span intercept; click visible selected title mở dropdown tự nhiên. Virtual accessibility list có thể chỉ expose ít options hơn visible dropdown; chờ dropdown settled trước đọc labels, không force-click.
- Chờ dialog hidden sau `Cancel`; immediate DOM count trong animation không chứng minh cancel thất bại.

### Cross-feature relationships và safety

- Không selected `Reference Report(s)`, saved report, patient row hoặc send destination; chưa có owned source/receiver hai phía.
- `Save Report` chưa chạy: root có `1 Selected`, target và cleanup footprint chưa established. Không suy đây là scoped create, không overwrite existing report.
- Chỉ own synthetic query preference; không patient/clinical writes, import/export/download hoặc gửi cohort. Business mutation `None`; cleanup `Done`, 0 leftovers.

### Mutation coverage

**5/11 bounded branches**, `Partial (read-only)`; denominator chỉ current analyser surface, không toàn Analytics module.

| Branch | Exercised | End state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Current-role analyser root | Performed | Route, title, actual header và controls | Reload root | Done |
| Full Name field/operator/value draft | Performed | Visible options, contains và selected synthetic value | Own draft only | Done |
| Synthetic Search / reopen | Performed | Dialog closed, badge 1, same rule retained | Reopen verified | Done |
| Query preference reload | Performed | Field/operator/value và badge retained | UI reload verified | Done |
| Delete owned rule / clear query | Performed | Badge 0, synthetic absent, empty query after reload/reopen | UI reset verified | Done |
| Multiple rules/groups và edited Cancel | Skipped | Deferred sau single-query breadth | Chưa kiểm | N/A |
| Input validation / boundaries | Skipped | Chưa chạy blank, invalid hoặc boundary values | Chưa kiểm | N/A |
| Reference Report(s) | Skipped | Không owned report fixture | Chưa kiểm | N/A |
| Save Report lifecycle | Skipped | Target/ownership và cleanup footprint chưa established | Chưa kiểm | N/A |
| Other analyser/grid modes | Skipped | Tabs, Columns, Filters và grid operations deferred | Chưa kiểm | N/A |
| Import/export/send và receiver | Skipped | Không owned scoped report/cohort hoặc receiver prerequisite | Chưa kiểm | N/A |

### Execution và automation guidance

- Verify settled actual role và exact configured dev origin trước query edits; scope field/operator/value trong dialog, không nhầm `Reference Report(s)` picker.
- Wait selected synthetic tag trước `Search`, dialog hidden trước badge readback; reload/reopen để kiểm query preference, không đọc storage/auth state.
- Chỉ reset rule do run hiện tại tạo; không dùng page-level reset trên existing report configuration chưa rõ scope. Saved report lifecycle cần owned target và UI cleanup đã xác lập.
- Evidence: `analyser-observation.json`, `analyser-query.js`, `final-baseline.json` trong run evidence directory. Remaining branches giữ frontier; query badge không là assertion về patient count hoặc saved report.

## Logic từ ticket

Nguồn: `PAC2-3798`, `PAC2-6540`, `PAC2-8384`.

### Patient & Medication Analyser (supergrid)

**Luồng**
1. Route `/patient-analyser/` (`Patient & Medication Analyser`); tab `Patient Details`, `Patient Analyser`, `Medication Analyser`; `Advanced Search N`, `Patients:`/`Observations:` count, `Columns`, `Filters`, panel `Reports` (`New`, `Save`). `[Observed]` — PAC2-3798/feature-location.md, exploration.md
2. `Advanced Patient Search` modal: tab `Analyse`/`Import`; `Reference Report(s)`, `Query builder`, `Add Rule Group`, `Deleted Patients Excluded`; `Import` có `Patient List`, `JSON Search`, `XML Search`. `[Observed]` — PAC2-3798/exploration.md
3. `Pivot Mode` bật → `Column Labels` xuất hiện, mở helper `Pivot Mode`; nút `Pivot` disabled cho tới khi chọn đủ field; tắt trả về trạng thái chuẩn. `[Observed]` — PAC2-3798/exploration.md
4. `Columns` panel `Column List` 81 cột, `Row Groups`, `Values`; `Filters` 80 filter (Medication Analyser 88). `[Observed]` — PAC2-3798/exploration.md

**Business rules**
| Yêu cầu | Tag | Kết quả manual | Provenance |
|---|---|---|---|
| Tạo report mới/clear `advanced search` không refresh trang | `[Confirmed]` | Pass (TC-001, 002) | PAC2-3798/requirements.md, automation.md |
| `Patient count` tải độc lập với grid data | `[Confirmed]` | Pass (TC-003: sort chỉ gọi lại request grid) | PAC2-3798/automation.md |
| `Aggrid` nâng cấp áp dụng toàn `supergrid` | `[Confirmed]` | Pass (TC-004); inventory đầy đủ chưa có | PAC2-3798/automation.md |
| Graph cho numerical value trong grid | `[Confirmed]` | Pass (TC-005: `Chart Range` mở, 1 series) | PAC2-3798/automation.md |
| `Pivot mode` + helper modal, chỉ column phù hợp mới aggregate/pivot | `[Confirmed]` (eligibility: Open Question) | Pass (TC-006) | PAC2-3798/automation.md |
| Search cũ deprecated, cập nhật dạng mới khi load vào editor | `[Confirmed]` | Pass (TC-007, không save) | PAC2-3798/automation.md |
| URL chứa report ID dạng anchor để share | `[Confirmed]` | Pass (TC-008: `/patient-analyser/#<report-id>` tải lại đúng) | PAC2-3798/automation.md |
| Reorder tab theo tần suất; bỏ `QOF`/`registers`; đổi tên `C&D with observations` | `[Confirmed]` (đích: Open Question) | Pass (TC-009) | PAC2-3798/automation.md |
| `generate CSV`, `send to comms hub` còn hoạt động | `[Confirmed]` | Not Run (Comms Hub site riêng) | PAC2-3798/automation.md |

- Hồi quy theo comment dev: thoát pivot không xóa cấu hình đã lưu; cột checkbox không có menu cột, cột thường có menu và dữ liệu vẫn hiển thị khi sort; collapse/expand panel `Reports` giữ footer và horizontal scroll (đều Pass). `[Observed]` — PAC2-3798/automation.md
- Thứ tự sidebar baseline: `Capacity & Demand`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`, `Reports`; `QOF Registers` còn hiển thị. `[Observed]` — PAC2-3798/exploration.md

**Defect đã biết**
- PAC2-3798 · Inconclusive (possible defect) · sidebar `Patient Analyser` trỏ `/patient-analyser-new/` trả 404 trên demo host, trong khi `/patient-analyser/` dùng được. `[Observed]` — PAC2-3798/feature-location.md, exploration.md
- PAC2-3798 · Inconclusive · console báo AG Grid/AG Charts Enterprise license không tương thích; helper hiện `Invalid License`; tác động lên graph chưa xác minh. `[Observed]` — PAC2-3798/exploration.md
- PAC2-3798 · Blocked · automation CLI không kết nối được browser đăng nhập thủ công; manual result giữ nguyên. `[Observed]` — PAC2-3798/automation.md

**Open questions**
- Thứ tự đích và nhãn mới của tab; eligibility column cho pivot; old search migrate in-memory hay persist; ngưỡng timing cho "loads faster". `[Open Question]` — PAC2-3798/requirements.md

### Deleted patients trong Advanced Search

**Luồng**
1. `Analytics & Reports` → `Reports` (`/paco/analytics-reports`) → `Patient Details` → `Advanced Search` với `Reference Report` và lựa chọn `Deleted Patients Included`/`Excluded`. `[Observed]` — PAC2-6540/report.md, status.md
2. Root `Analytics & Reports` không hiện `Advanced Search`/filter deleted trực tiếp. `[Observed]` — PAC2-6540/status.md

**Business rules**
- `Advanced Search` phải trả kết quả nhất quán cho `Deleted Patient Included` và `Excluded`. `[Confirmed]` — PAC2-6540/requirements.md (REQ-004)
- Defect gốc: saved Reference Report vs direct Advanced Search trả patient set khác nhau khi loại deleted; đã fix. `[Inferred from: evidence post-fix của tester, needs confirmation]` — PAC2-6540/report.md
- Count tuyệt đối phụ thuộc dataset, không dùng làm expected cố định; regression nên dùng seeded report có cả deleted/non-deleted, so patient set (không chỉ count) và chạy lặp (bug intermittent). `[Observed]` — PAC2-6540/report.md
- Book đã archive vẫn còn trong lịch sử/analytics theo thiết kế sau cleanup test. `[Observed]` — PAC2-8384/report.md

**Role/permission**
- Role `GP Paco Assist` thấy cảnh báo không được xem `Summary Care Record (SCR) report`. `[Observed]` — PAC2-6540/feature-location.md (qua feature-map)

**Defect đã biết**
- PAC2-6540 · Pass (TC-001) · chạy `Reference Report` với `Deleted Patients Excluded`, dựa evidence post-fix do tester cung cấp (Jira `Verify passed`). `[Observed]` — PAC2-6540/report.md
- PAC2-6540 · Inconclusive (TC-002) · rerun trên dataset mutable (kết quả 0, dataset thay đổi). `[Observed]` — PAC2-6540/report.md

**Open questions**
- Xem `comms-hub.md#campaign-manager-và-campaign-outbox` (đối chiếu deleted/inactive với Outbox). `[Open Question]` — PAC2-6540/requirements.md

## Tester notes
