# Workflow: Patient Search

- Classification: `[Observed: dev, Blinx Deployment, 2026-10-22]`; lịch sử feature-branch `Super Admin GB` giữ riêng bên dưới.
- Aliases: `Patient Search`, `Search Patients`, `top-bar patient search`, `PDS search`
- Coverage: `Partial (interactive)` — autonomous breadth 6/15 nhánh; chỉ owned unsaved draft, chưa saved patient lifecycle.
- Confidence: `Medium` cho flow hiện tại; tokenise/cap trong ticket không reverify ở lần autonomous này.

## Autonomous breadth (2026-10-22)

`[Observed: dev, Blinx Deployment]` — `product-explore/auto-20261022-0236/ledger.md#1–9`.

### Context, entry và actions

- Direct `/paco/patient-search` đã reverify; chờ exact role và loaded heading trước action. Global `Search patients by name or NHS number` khác page `Search Patients...`.
- Page search với synthetic no-match trả `Patient Search (0)`; clear trả loaded grid. Heading và rendered row count khác nhau, không lấy số đang thấy làm requirement.
- `Filters` mở drawer có Title, Age, Gender, Ethnicity, Country of Birth, Language, Postcode, Practice; `Clear all`, `Cancel`, `Save`. Đã Cancel, chưa đổi hoặc Save filter.
- Row ellipsis mở `Profile`, `View`, `Edit`, `View Audit`, `Archive`, `Save for offline access`; chỉ mở/đóng menu, không chọn item trên existing patient. `Offline config` visible nhưng chưa mở.

### Required test data

- Owned draft dùng `QA-test` prefix, synthetic date; tên chứa run digits bị client reject. Dùng alias chỉ chữ, dấu gạch nối và khoảng trắng cho draft; chi tiết fixture nằm trong ledger.
- Chưa có safe registration fixture, trusted required values hoặc saved-patient cleanup đã xác minh; OQ-065 / `DEC-patient-fixture` chặn saved lifecycle, không chặn search hoặc draft.

### Interactive flow (owned test data)

1. `Create new patient` mở `Create New Patient`, mặc định `Patient` / `Registration Type: Permanent`; `Create` disabled.
2. Empty Last Name có `Last name is required`. Surname chứa digits hiện `Only letters, apostrophes, dashes, and spaces are allowed.`; sửa alias hợp lệ và synthetic Date of Birth bỏ lỗi, mở được `Personal` không cần bấm `PDS Check`.
3. Đã vào sáu step visible: `Patient`, `Personal`, `Contact`, `Address`, `Healthcare Provider`, `Relationships & Permissions`; chỉ map form, không thêm relationship/provider hoặc gửi dữ liệu.
4. `Personal`: Title, First Name(s), Last Name, Date of Birth, Gender, Preferred Spoken Language có dấu `*`; English mặc định. Empty First Name hiện `First name is required`; dấu `*` không chứng minh server validation.
5. `Contact`: Phone Numbers/Add Another, Primary Email, Preferred Contact Method, Confirmed By, SMS/Email consent. `Address`: primary address, Postcode có dấu `*`, Add Another. `Healthcare Provider`: GP/Practice, hospital/registration, pharmacy. `Relationships & Permissions`: own draft Primary Patient, empty household, Add Another, Permissions & Access.
6. Header close bỏ draft; fresh reopen surname/Date of Birth trống, close lần nữa. Root restored, không saved patient được submit; search alias là supporting check, không independent persistence proof khi debounce chưa settled.

### Validation behavior

| Field / rule | Input | Message / behavior | Submit blocked? | Classification |
|---|---|---|---|---|
| Last Name | Empty draft | `Last name is required` | `Create` disabled; chưa submit | `Observed` |
| Last Name | Owned name có digits | `Only letters, apostrophes, dashes, and spaces are allowed.` | `Create` disabled | `Observed` |
| Last Name + Date of Birth | Letters-only owned alias + synthetic date | Visible error hết; các step mở được, `PDS Check` enabled | `Create` vẫn disabled vì form chưa đủ | `Observed` |
| First Name(s) | Empty `Personal` | `First name is required` | `Create` disabled | `Observed` |

### Cross-feature relationships

- `Profile`/`View` là candidate handoff; chưa theo link hoặc tạo saved source nên chưa có two-sided edge. Household/Practice labels không chứng minh receiver relationship.

### Anomalies and unverified behavior

- Standard clicks đợi stable bị timeout dù button visible/enabled; hit-test reconciliation rồi guarded forced click mở control. Đây automation/actionability observation, chưa product defect.
- Chưa xác minh saved Create, server rules, duplicate, owned Edit/Archive/Restore, profile persistence, PDS, offline hoặc relationship creation. Không reuse existing patient, gọi external PDS hoặc invent NHS/contact/address để vượt gate.

## Mutation coverage

| Workflow branch | Status | Reason if skipped | Validation / state observed | Persistence | Cleanup |
|---|---|---|---|---|---|
| Page search no-match / clear | Performed | — | Empty result rồi loaded root | Không saved mutation | N/A |
| Filters open / Cancel | Performed | — | Drawer đóng, root restored | Chưa thử Save | Done |
| Blank Create gate | Performed | — | Required message, disabled Create | Không submit | Done |
| Invalid → valid owned draft | Performed | — | Name error hết, step gate mở | Draft only | Done |
| Six-step draft map / discard | Performed | — | Form navigation, blank fresh reopen | Draft discard verified | Done |
| Actions menu open / close | Performed | — | Labels mapped, không chọn item | Không saved mutation | Done |
| Filters Save | Skipped | Breadth pass chỉ map/Cancel | Chưa đổi filter | No | N/A |
| Saved Create | Skipped | OQ-065, safe fixture/cleanup chưa có | Client gate only | No | N/A |
| Owned Edit Save / Cancel | Skipped | Cần saved owned patient | Chỉ thấy action | No | N/A |
| Archive / Restore | Skipped | Cần saved owned patient và cleanup | Chỉ thấy Archive | No | N/A |
| Profile / View handoff | Skipped | Không dùng existing patient làm fixture | Chỉ thấy menu | No | N/A |
| View Audit | Skipped | Chưa có owned audit source | Chỉ thấy menu | No | N/A |
| Offline workflow | Skipped | Chưa map scope/lifecycle | Labels only | No | N/A |
| PDS Check | Skipped | External lookup/identity scope chưa rõ | Enabled sau valid draft | No | N/A |
| Relationship add | Skipped | Chưa có owned source/target | Empty relationship state | No | N/A |

- Branches exercised / found: **6/15**, bounded map; root/step views không tự tính thêm branch.
- Dimensions: navigation `done`; main_workflow, branches_states, mutation, validation, persistence, errors_edge `partial`; relationships `none`. Persistence ở đây chỉ draft discard, không saved patient.

## Automation guidance

- Scope create form bằng heading `Create New Patient`, không tổng dialog count vì calendar có `Choose Date` dialog riêng. Step labels không có accessible tab name.
- Chờ role visible, heading/result state và actual row presence; không hardcode một grid container hoặc lấy heading zero đang hydration làm empty-data proof.
- Locator timeout không connector loss; sau partial script đọc lại state trước action tiếp. Header close phải scope riêng, không generic mọi xmark.
- Automated assertions về tokenise/cap chỉ dùng trusted ticket basis bên dưới; autonomous observation không thêm requirement.

## Provenance and gaps

- Environment `dev`, role `Blinx Deployment`, observed `2026-10-22`; raw scoped form/menu snapshots và ledger ở `test-results/product-explore/auto-20261022-0236/`.
- OQ-065 / `DEC-patient-fixture`: safe registration values, owned write effects và UI cleanup; tiếp main workflow khi dependency được cung cấp, không lặp pending branch.
- Autonomous cleanup verified: owned draft discarded, fresh form blank; root không dialog/menu/filter drawer, không saved patient submit. Ticket/discovery checkpoint không đổi.

## Super Admin GB breadth — 2026-10-22

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261022-1001/ledger.md#3–7`. Scope riêng với pass `Blinx Deployment` phía trên; không cộng coverage giữa role.

### Entry và workflow

- Sidebar `Patients` mở submenu `Patient Search` / `Care Navigation`; `Patient Search` tới `/paco/patient-search`, exact role verified tại destination header.
- Root có page search, `Filters`, `Offline config`, `Create new patient`, patient grid và `Actions` column. Chỉ aggregate UI được kiểm, không chọn existing patient hoặc mở clinical data.
- Synthetic no-match trả `Patient Search (0)` và 0 rows. Sau clear search trong cùng page, zero-result UI còn giữ khi Postcode draft tồn tại; reload khôi phục loaded rows. Không suy search-clear failure độc lập khỏi filter state.
- `Filters` là complementary drawer, có Title, Age, Gender, Ethnicity, Country of Birth, Language, Postcode, Practice và `Clear all` / `Cancel` / `Save`.
- Hai lần isolated từ fresh baseline: đổi Postcode bằng synthetic no-match rồi `Cancel`, drawer đóng nhưng root hiển thị 0 rows và reopen giữ Postcode. Không bấm `Save`; reload đưa Postcode về trống và khôi phục rows. Control `Cancel` không đổi field vẫn có rows nhưng heading count đổi; ý định `Cancel`, thời điểm áp dụng và count semantics chưa xác lập (OQ-067).

### Safety, validation và persistence

- Saved Create không chạy vì `DEC-patient-fixture` còn pending; không retry registration/PDS hoặc dùng existing patient làm fixture. `Offline config` và filter `Save` chưa exercise.
- Không validation submit, saved patient mutation hoặc persisted business state. Chỉ transient search/filter state được đo; reload reset đã verified, không chứng minh server write footprint.
- Cleanup `Done`: fresh reload, search trống, rows hiện, drawer đóng, header đúng role. Không tạo business record/leftover.

### Cross-feature relationships

- `Care Navigation` chỉ submenu label, chưa mở receiver; không saved patient source nên chưa có two-sided relationship. OQ-065 vẫn là fixture prerequisite.

### Mutation coverage — current role

| Workflow branch | Status | End state / reason | Validation / transition | Persistence | Cleanup |
|---|---|---|---|---|---|
| Root access và interaction map | Performed | Loaded grid, destination header verified | Controls mapped | Not Run | Done |
| Synthetic no-match / reload restore | Performed | 0 rows; reload có rows | Empty / loaded | Transient reset only | Done |
| Filters unchanged / Cancel | Performed | Drawer đóng, rows còn | Heading count đổi, cause Open | Not Run | Done |
| Postcode edit / Cancel / reopen / reload | Performed | Zero result, draft retained; reload blank | Hai isolated inputs, no Save | Không giữ qua reload | Done |
| Filters Save / Clear all apply | Skipped | Chưa map apply semantics; ưu tiên breadth | Not Run | No | N/A |
| Saved patient lifecycle | Skipped | OQ-065 / `DEC-patient-fixture` pending | Không submit | No | N/A |
| Offline workflow | Skipped | Scope/cleanup chưa map | Not Run | No | N/A |

- **4/7 bounded branches**, `Partial (read-only)`; chưa enumerate row actions hoặc toàn bộ supported lifecycle cho role này. Không copy 6/15 coverage của role cũ.
- Dimensions: navigation `done`; main_workflow, branches_states, persistence, errors_edge `partial`; mutation, validation, relationships `none`. Persistence chỉ filter reload reset.
- Unexpected behavior `Observed / Open Question`, chưa product verdict hoặc nguyên nhân kỹ thuật. Console chỉ lỗi appointments 403 và asset 404, chưa liên hệ được với filter.
- Automation guidance: chờ drawer animation settled trước footer click; locator timeout cần reconcile, không replay cả batch. Root loaded phải kiểm rows cùng header, không dùng count ngay sau navigation làm proof.

## Offline entry attempt — 2026-10-22

`[Observed: dev, intended Super Admin GB]` — `product-explore/auto-20261022-2011/ledger.md#5`.

- Independent `Offline config` open/map/Cancel experiment chưa tới feature body: known Patient Search route chuyển tới OS role picker. Exact offered context được chọn, `Next` một lần vẫn ở picker, không alert; không retry Login/Next.
- Actual `Super Admin GB` ở Connect trước navigation không xác lập OS destination auth/role. Current Patient Search access `Blocked` tại context prerequisite; historical verified root phía trên vẫn giữ provenance, không coi access đã reverified.
- **0/1 bounded branch**, `Partial (read-only)`: offline open/map/close `Skipped`, result `Blocked`; validation/transitions/persistence `Not Run`, cleanup `N/A`. Không offline control click, patient selection, download, enable hoặc Save.
- Không tạo record, new relationship hoặc mutation; saved-patient decision OQ-065 vẫn pending. Chỉ retry offline entry khi OS context prerequisite thay đổi.

## Super Admin GB saved lifecycle — 2026-10-23

`[Observed: dev, Super Admin GB]` — `product-explore/auto-20261023-0223/ledger.md#2–4`. Authorization `DEC-patient-fixture` đã answered; historical breadth và offline boundary giữ riêng, không cộng denominators.

### Main workflow, validation và persistence

1. Mở `Create new patient`, điền owned synthetic surname letters-only và Date of Birth; `Personal` chọn offered `Title`, `Gender`, First Name, giữ English. Không cần `PDS Check` để đi tiếp.
2. `Contact` để email/phone trống và SMS/Email consent off. `Address` yêu cầu `Postcode`: invalid synthetic text và special postcode hiện `Please enter a valid UK postcode`; ordinary-format non-residential postcode bỏ message và bật `Create`. Chưa có trusted contract cho special postcode nên không kết luận defect.
3. `Create` một lần đóng form và hiện `New patient created.`; exact owned list search trước/sau reload đều một row với identity/DOB đúng. NHS Number trống vẫn Create thành công trong flow này, không suy server-wide optional rule.
4. Owned `Edit` → `Personal` → `Known As`: header Close bỏ draft, separate reopen readback blank. Sau đổi value synthetic khác và `Save` một lần, reload exact query giữ `known_as` cell mới.
5. Owned row `Actions` → `Profile` tới `/paco/patient-profile/:id/dashboard`; actual role, owned identity và updated `Known As` đều visible. Đây two-sided source/update → Profile receiver edge, không clinical mutation.

### Mutation coverage — saved pass

| Branch | Status | Observed end state / reason | Persistence | Cleanup |
|---|---|---|---|---|
| Owned Create / submit | Performed | Form closed, owned result verified | Reload verified | Retained (approved) |
| Invalid / accepted Postcode gate | Performed | Exact message rồi enabled Create | Draft only | Done |
| Exact search / reload readback | Performed | Một owned row, identity/DOB giữ | Verified | Retained (approved) |
| Edit Known As / Close | Performed | Separate owned reopen giữ blank | Discard verified | Done |
| Edit Known As / Save | Performed | Exact updated cell sau reload | Verified | Retained (approved) |
| Profile handoff | Performed | Owned identity và updated field tại receiver | Receiver readback | Retained (approved) |
| Duplicate / server-required validation | Skipped | Chưa attempt duplicate hoặc bypass client gate | Not Run | N/A |
| Archive / Restore | Skipped | Fixture được duyệt giữ cho booking/media | Not Run | N/A |
| PDS / NHS / offline / relationship creation | Skipped | Independent scopes chưa chạy | Not Run | N/A |

- **6/9 bounded branches**, 2 persisted mutations trên 1 owned patient, 1 two-sided relationship. Dimensions navigation `done`; main_workflow, branches_states, mutation, validation, persistence, relationships, errors_edge `partial` vì các lifecycle còn lại chưa exercise.
- Automation: hidden tab controls vẫn mounted; scope visible panel hoặc exact label. Pinned Actions row dùng cùng row index với exact owned result, không assume tên nằm trong pinned row. Native pointer/menu geometry có delayed/stale end state; chờ specific heading trước action tiếp, không replay full batch sau timeout.
- `patient-edit.js` Inconclusive do unexpected blank Create ở reopen; reconciliation độc lập verified discard, riêng Save continuation và reload verified update. Script execution khác branch outcome; không đổi full script thành Pass.
- Cleanup: không unsaved draft còn lại, patient cố ý retained theo approval; historical Session occurrence uncertainty không đổi. Duplicate, server rules, audit và clinical filing chưa verified.

## Lịch sử ticket / feature-branch (2026-10-13)

Các phần dưới mô tả scope read-only cũ, không phải safety policy cho autonomous hiện tại.

## Business context observed

- Visible purpose: Find an existing patient by name / NHS number / partial query; supports 2 surfaces (top-bar dropdown for quick find, full PDS page for grid-level navigation).
- Actor/role: Super Admin GB (verified). Other roles not manually verified (Receptionist/Clinician/Admin).
- Required context: Authenticated session on dev (`blinx.dev.blinxpaco-np.com/paco/feature-branch/<branch>/...`).
- Starting data state: Dev org `General Practice (Demo Site)` with 78,974 patients including seed `PHOEBE EILEEN SMITHAM` and `name{N} surname{N}` literal pattern.
- Entities and statuses: Patient record (Registration Type, Title, First/Middle/Last/Known-as Name, DOB, DOD, Gender, NHS Number, contact info, address, GP, Hospital Number, Date of Registration). No `Advanced Search`. Top-bar dropdown has `Include deleted patients` checkbox (footer).

## Entry

1. Top-bar: any route with global header visible → `Search patients by name or NHS number` textbox (placeholder).
2. PDS page: `/paco/patient-search` (or feature-branch equivalent) → `Search Patients...` textbox + filters + AG Grid.

## Read-only flow

1. **Action:** Top-bar: type query, Enter or wait for debounce.
   - **Transition:** Dropdown opens; results list rendered; per-item `Patient actions menu` button.
   - **Observed result:** Label `Results (50)` (cap 50, never more than 100 per PR #7376); 50 items rendered max. Footer `Include deleted patients` checkbox.
   - **Evidence:** `evidence/manual-r1.json` TC-010.

2. **Action:** PDS page: type query, Enter.
   - **Transition:** AG Grid virtual scroll; heading `Patient Search (N)` updates to total match count.
   - **Observed result:** Cap 50 visible rows via virtual scroll (AG Grid renders buffer ~48 unique first names at typical viewport); heading = total match (e.g. `Patient Search (5,023)` for broad query `name1`).
   - **Evidence:** `evidence/manual-r1.json` TC-011.

## Decision points

- **Visible condition:** Tokenise query (separator: `,`, space, multiple spaces)
  - **Branch A:** Single token (`Smitham`) → match by first/middle/surname substring.
  - **Branch B:** Multiple tokens (`phoebe smitham`, `Smitham, Phoebe`, `Eileen Smitham`) → logical AND across tokens, each token matches first/middle/surname in any order.
  - **Branch C:** Trailing separator (`phoebe `, `smitham,`) → empty token ignored, match proceeds on non-empty tokens.
  - **Branch D:** Two-word first name (`Mary Jane Smith`) → match requires all tokens found in name fields. (Not testable on dev seed; covered by Tony 15k prod sweep.)
  - **Evidence:** `evidence/manual-r1.json` TC-001..TC-009.

- **Visible condition:** Match field
  - **Branch A:** First / Middle / Last name fields.
  - **Branch B:** NHS Number (full or partial, e.g. `944`, `9449307539`).
  - **Evidence:** `evidence/manual-r1.json` TC-002..TC-005, TC-012c/d.

- **Visible condition:** Result count
  - **Branch A:** Total match = 1 → `Patient Search (1)`; no pagination needed.
  - **Branch B:** Total match > 50 → heading shows total; grid virtual-scroll caps visible at ≤ 50.
  - **Evidence:** `evidence/manual-r1.json` TC-011.

## End and exceptional states

- End state observed: Grid renders matched rows (PHOEBE EILEEN SMITHAM found via 8 different query forms on dev seed); no console errors caused by search.
- Empty/loading/error states: Not exercised in this run.
- Cross-feature handoff: Selecting a row opens patient profile (out of scope for this ticket).

## Safety boundary

- Last safe read-only state: grid rendered, no row clicked.
- Approval stop: `Create new patient` button, `Filters` modifications, row click, any `Patient actions menu` action.
- Actions not performed: Create / Update / Delete patient; `Include deleted patients` toggle; row click / profile open.
- Mutation: `None` (read-only this run).

## Execution guidance

- Setup/data: dev feature-branch `pac2-8998`; login as Super Admin GB; ensure seed `PHOEBE EILEEN SMITHAM` exists.
- Safe manual steps: PDS page + top-bar dropdown only. No row selection. No filters. No Create button.
- Settlement: PDS page uses AG Grid; wait ~2-3s after Enter for results to render. Top-bar dropdown opens on type with ~1-2s delay.
- Scope guard: Stop at first failed precondition; report rather than fix.
- Evidence capture: heading text, total match count, first row data (First/Middle/Last/NHS), top-bar dropdown label, item count.

## Logic từ ticket

Tổng hợp defects theo từng feature từ các ticket đã test; mỗi bullet có tag `Confirmed`/`Observed`/`Inferred`/`Open Question` kèm provenance. Tag `Confirmed` ở đây là ý định ghi trong ticket/comment, không phải spec đầầy đủ.

### Luồng

- **Patient search tokenise by `,`/space and match each token với first/middle/surname ở bất kỳ thứ tự nào** `[Confirmed]` (PR #7376; `PAC2-8998/ticket.md:55-56`)
- **Trailing separator (space hoặc comma) bị bỏ qua, không làm search trả 0** `[Confirmed]` (`PAC2-8998/ticket.md:90-92`)
- **Top-bar dropdown cap 50, max 100; tổng match báo cáo** `[Confirmed]` (`PAC2-8998/ticket.md:72-73`; manual evidence `evidence/manual-r1.json` TC-010)
- **PDS panel cap 50, max 100; tổng match báo cáo** `[Confirmed]` (`PAC2-8998/ticket.md:72-80`; manual evidence `evidence/manual-r1.json` TC-011)
- **Two-word first name (`Mary Jane Smith`) trả về patient với first = `Mary Jane`** `[Confirmed]` (`PAC2-8998/ticket.md:60-62`)

### Business rules

- **Logical AND across tokens** (tất cả token phải match được) `[Confirmed]` (`PAC2-8998/ticket.md:55-56`)
- **Case-insensitive** `[Inferred]` (Tony wording "every typed word appears in their first, middle or surname" không nói case; observe trong run nhưng chưa Tony confirm; `PAC2-8998/requirements.md` note)

### Trạng thái

- **Top-bar dropdown label `Results (50)`** khi cap bị áp dụng (không hiện total match) `[Observed]` (`PAC2-8998/exploration.md`, `evidence/manual-r1.json` TC-010)
- **PDS page heading `Patient Search (N)`** = total match count, không phải visible-row count `[Observed]` (`PAC2-8998/exploration.md`, `evidence/manual-r1.json` TC-011)
- **AG Grid virtual scroll renders buffer rows** (~48 unique first names at typical viewport); cap 50 là virtual scroll cap, không phải DOM-render cap `[Open Question]` (`OQ-029`)

### Role/permission

- Super Admin GB có full access (verified) `[Observed]` (`PAC2-8998/feature-location.md`)
- Receptionist/Clinician/Admin chưa manual-verify `[Open Question]` (PAC2-8998/requirements.md Open Question)

### Defect đã biết

- **`PAC2-8998` Pass:** fix PR #7376 tokenise `,`/space + match từng token với first/middle/surname ở bất kỳ thứ tự nào; cap 50 dropdown + PDS panel — 12 active TC Pass, TC-006 (REQ-003 2-word first name) Skipped do no dev data (`PAC2-8998/evidence/manual-r1.json`, `report.md`)

### Open questions

- **`OQ-029`:** AG Grid virtual-scroll buffer rows — user-perceived behavior (≤50 visible) vs implementation detail (buffer render 48+). `[Open]` (acceptable, low impact) — xem `docs/product/open-questions.md`
- **`OQ-028`:** Dev data không có 2-word first name; TC-006 Skipped với reason (covered by Tony 15k prod sweep) `[Answered 2026-10-13]`
- **`OQ-027`:** UI affordance cho total match = `Patient Search (N)` heading ở PDS page; `Results (50)` label ở top-bar dropdown (hai cách khác nhau) `[Answered 2026-10-13]`
- **`OQ-026`:** Top-bar = global header search, không phải `Rocket Bar` desktop app launcher `[Answered 2026-10-13]`

## Tester notes
