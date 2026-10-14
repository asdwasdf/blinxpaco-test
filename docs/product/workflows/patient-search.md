# Workflow: Patient Search

- Classification: `[Observed: dev feature-branch, Super Admin GB, 2026-10-13]`
- Aliases: `Patient Search`, `Search Patients`, `top-bar patient search`, `PDS search`
- Coverage: `Partial (search/filter behavior observed; mutation paths out of scope)`
- Confidence: `High` for tokenise + cap 50; `Medium` for AG Grid virtual-scroll behavior

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
