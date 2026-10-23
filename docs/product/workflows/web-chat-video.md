# Workflow: Web Chat & Video

- Classification: `[Observed: dev, GP - paco assist and Super Admin GB, 2026-09-14 to 2026-09-16]`
- Aliases: `Web Chat & Video`, `Virtual Appointments`, `Media Library`, `Outstanding Reviews`, `Consultations for Review`
- Coverage: `Partial`
- Confidence: `High` cho route và role-dependent render state; `Low` cho expected permission/dependency behavior

## Business context observed

- Visible purpose: quản lý virtual appointments, patient media và consultations cần review.
- Actor/role: `GP - paco assist`; `Super Admin GB`.
- Required context: authenticated Paco session, organisation context, và quyền/dependency của Web Chat module.
- Starting data state: ba child route được mở trực tiếp từ known sidebar map.
- Entities and statuses: appointment, patient media, consultation review; các status chi tiết chỉ từng render với role `GP - paco assist`.

## Entry

1. Dashboard → `Web Chat & Video`.
2. Chọn `Virtual Appointments`, `Media Library`, hoặc `Outstanding Reviews`.
3. Stable routes: `/web-chat/appointments/`, `/web-chat/media-library/`, `/web-chat/review/`.

## Read-only flow

1. **Action:** mở `Virtual Appointments`.
   - **Transition:** route `/web-chat/appointments/`, title `Web Chat & Video`.
   - **Observed result:** `[Observed: GP - paco assist, 2026-09-14]` feature body từng render filter `Appt. Type`, `Date Range` và appointments table. `[Observed: Super Admin GB, 2026-09-16]` sau bounded wait 8 giây chỉ Paco shell/header render; console có HTTP `500`/`401`, `Error fetching current authenticated user`, và page exception.
   - **Evidence:** `test-results/product-survey/batch31/02-virtual-appointments.png`.
2. **Action:** mở `Media Library`.
   - **Transition:** route `/web-chat/media-library/`, title `Web Chat & Video`.
   - **Observed result:** `[Observed: GP - paco assist, 2026-09-14]` feature body từng render `PATIENT`, patient search, `MEDIA TYPE`, và `No Patient Selected`; surname search không trả result hoặc empty/error state. `[Observed: Super Admin GB, 2026-09-16]` chỉ Paco shell/header render; không có visible feature-body search. Console có `PACOMMS` permission-setting và React shared-module version warnings.
   - **Evidence:** `test-results/product-survey/batch31/01-media-library.png`.
3. **Action:** mở `Outstanding Reviews`.
   - **Transition:** route `/web-chat/review/`, title `Web Chat & Video`.
   - **Observed result:** `[Observed: GP - paco assist, 2026-09-14]` feature body từng render breadcrumb `Consultations`, heading `CONSULTATIONS FOR REVIEW` và review table. `[Observed: Super Admin GB, 2026-09-16]` chỉ Paco shell/header render; console có HTTP `403`/`401` và `Error fetching user organisation locations`.
   - **Evidence:** `test-results/product-survey/batch31/03-outstanding-reviews.png`.

## Decision points

- **Visible condition:** feature body render sau Paco shell.
  - **Branch/state A:** role `GP - paco assist` từng thấy full module content.
  - **Branch/state B:** role `Super Admin GB` chỉ thấy shell/header trên cả ba route trong batch 31.
- **Visible condition:** `Media Library` patient được chọn.
  - **Branch/state A:** no patient selected, hiện `No Patient Selected` khi feature body render.
  - **Branch/state B:** `[Open Question]` populated patient media và search trigger đúng; batch 31 không thể re-check vì feature body không render.

## End and exceptional states

- End state observed: route giữ đúng destination nhưng feature body không mount/render cho `Super Admin GB`.
- Empty/loading/error states: shell-only, không có visible loading/error copy; console events khác nhau theo route.
- Cross-feature handoff: patient selection trong `Media Library`; appointment/review actions có thể chuyển sang patient/consultation context nhưng chưa mở.

## Safety boundary

- Last safe read-only state: route landing, visible filter/table, hoặc patient search không chọn result.
- Approval stop: appointment action, review/submit, send, upload, create, edit, hoặc external-system action.
- Actions not performed: không chọn appointment/review action; không send/upload/create/edit.
- Mutation: `None`

## Execution guidance

- Setup/data: environment `dev`, authenticated role và organisation; xác nhận feature body đã render trước khi dùng page controls.
- Safe manual steps: mở ba child route, chờ observable feature landmark, ghi visible state và console/page errors.
- Stop and request approval before: mọi action gửi, review, upload, create, edit hoặc thay đổi appointment.
- Evidence to capture: route, role/org, feature landmark hay shell-only state, visible error/loading copy, console/page error summary; redact patient data trước khi share.

## Automation guidance

- Stable roles/labels/landmarks: routes trên; `Appt. Type`, `PATIENT`, `MEDIA TYPE`, `CONSULTATIONS FOR REVIEW` khi module render.
- Observable waits: chờ feature landmark hoặc explicit error; Paco shell/header không đủ để coi route load thành công. Bounded timeout chỉ dùng phân loại shell-only, không làm expected-result assertion.
- Data dependencies: role entitlement, current authenticated user, organisation locations, `PACOMMS`, và remote/shared module compatibility.
- Assertions lacking trusted expected basis: role nào phải truy cập từng child; warning nào là causal; patient-search behavior; expected appointment/review dataset.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `GP - paco assist`; `Super Admin GB`.
- Observed at: `2026-09-14` và `2026-09-16`.
- Raw evidence: `test-results/product-survey/batch11/` nếu còn local; `test-results/product-survey/batch31/`. Review/redact trước khi share.
- Open questions: `Super Admin GB` thiếu entitlement, user/org context hay remote-module dependency; trusted expected access matrix; `Media Library` patient search trigger và populated state.
- Exact resume state: không retry cùng session/dependency. Cần product/API owner cung cấp expected access, entitlement/dependency prerequisite, hoặc session đã sửa; sau đó verify một route trước rồi mới mở rộng cả ba.

## Discovery update run-20261001-085609

`Observed: dev, Super Admin GB, 2026-10-01`; autonomous discovery read-only, checkpoint `docs/product/survey/roles/super-admin-gb-run-20261001-085609.discovery.yaml`. Không có mutation; mọi điểm dưới đây là hành vi hiện tại, chưa đối chiếu requirement.

- Submenu: `Virtual Appointments`, `Media Library`, `Outstanding Reviews`.
- Với role `Super Admin GB` đã đăng nhập PACO, cả ba mục chuyển `/web-chat/?rd=/<page>/` → màn `Welcome Back` với nút `Log in` → `login.microsoftonline.com` (`Sign in to your account`). Web Chat dùng SSO Microsoft riêng.
- Tester quyết định bỏ qua Web Chat trong run này; không đăng nhập, không lưu URL SAML.

## Autonomous breadth 2026-10-22

`Observed: dev, Blinx Deployment, 2026-10-22`; autonomous product exploration run `auto-20261022-0500`, checkpoint `docs/product/explore/autonomous-state.yaml`. Không có mutation; mọi điểm dưới đây là hành vi hiện tại, chưa đối chiếu requirement.

### Mutation coverage

| Nhánh | Thực hiện | End state hoặc lý do |
|---|---|---|
| Menu tới feature root | `Performed` | Filters và appointments table render |
| `Video Consultations` rồi `All Appointment Types` | `Performed` | Cả hai tới empty state; chưa xác minh selected marker hoặc data accuracy |
| `Yesterday` rồi `Cancel` | `Performed` | Giữ `Today`, picker đóng |
| `Yesterday` rồi `Apply`, khôi phục `Today` | `Performed` | Label đổi, có rendered row; khôi phục empty state |
| Search | `Skipped` | Hai search inputs chưa exercise |
| `Columns` | `Skipped` | Deferred theo breadth gate |
| `Filters` panel | `Skipped` | Deferred theo breadth gate |
| Owned appointment action/lifecycle | `Skipped` | Chưa có owned booking, patient fixture và slot/cleanup |

4/8 bounded nhánh, `Partial (read-only)`. Submission validation và business state transitions chưa thử; filter state không phải saved persistence. Cleanup filter UI `Done`: `Today`, picker đóng, searches blank, `All Appointment Types` đã click nhưng selected marker chưa verified; không tạo business record hoặc leftover. `Media Library` và `Outstanding Reviews` chưa mở.

### Entry và render

- Entry: Dashboard → sidebar `Web Chat & Video` → submenu `Virtual Appointments`.
- Route: `/web-chat/appointments/` trên configured dev host.
- Role verified: `Blinx Deployment` trước click.
- Full body render: title `Web Chat & Video`, `Date Range` visible, không SSO redirect trong lần này.
- Root snapshot: `virtual-appointments-root.yml` (local test-results).

### Date Range filter

- **Yesterday Cancel**: chọn Yesterday → Cancel giữ label Today, picker đóng, 0 rows, empty state.
- **Yesterday Apply**: chọn Yesterday → Apply đổi label Yesterday, 1 rendered row visible (không đọc/click row), picker đóng.
- **Today restore**: chọn Today → Apply khôi phục label Today, 0 rows, empty state, picker đóng.
- Filter state không phải saved business persistence; cleanup restored Today.

### Appointment Type filter

- **Video Consultations**: chờ tới empty state (0 rows, Today, picker đóng, search inputs blank).
- **All Appointment Types**: chờ tới empty state (0 rows, Today, picker đóng, search inputs blank).
- Selected filter marker và data accuracy chưa verified.

### Mutation boundary

- Không có `Create`/`Book` button visible trong pass này.
- Appointment action fixture chưa có (OQ-065 patient fixture làm context hint cho appointment-dependent workflows).
- Không mutate existing appointment; Search/Columns/Filter interactions/lifecycle skipped.

### Evidence

- Provenance: `product-explore/auto-20261022-0500/ledger.md#6–7`; chronology và diagnostic counts nằm trong ledger.
- Final baseline: exact role visible, `Today`, empty state, picker đóng, searches blank.

### Open questions

- Không khẳng định nguyên nhân dataset empty, permission requirement cho Create/Book, hay historical SSO defect resolved với role này.
- Appointment lifecycle, current role variant access và appointment action fixture scope vẫn là open questions (OQ-065 context hint).

## Media Library (autonomous 2026-10-22)

`Observed: dev, intended Blinx Deployment label, 2026-10-22`; run `auto-20261022-0714`, checkpoint `docs/product/explore/autonomous-state.yaml`. Exact label observed nhưng chưa independently established là active-role header; không mutation, giữ qualification từ ledger #12.

### Mutation coverage

| Nhánh | Thực hiện | End state hoặc lý do |
|---|---|---|
| Menu tới feature root | `Performed` | `No Patient Selected` prompt và controls render |
| Patient Search → select patient → media grid | `Skipped` | Chờ owned patient fixture (OQ-065) |
| Media Type filter → result verification | `Skipped` | Chờ owned patient và media fixture |

1/3 bounded nhánh, `Partial (read-only)`. Patient selection lifecycle, media fixture ownership/cleanup và media-type filtering chưa thử; không tạo business record hoặc leftover.

### Entry và render

- Entry: Dashboard → sidebar `Web Chat & Video` → submenu `Media Library`.
- Route: `/web-chat/media-library/` trên configured dev host.
- Exact label `Blinx Deployment` observed tại root; vị trí active-role/header chưa independently established, cần reverify trước role-access assertion.
- Full body render: heading `Media Library`, `No Patient Selected` prompt và controls visible.
- Root evidence: `product-explore/auto-20261022-0714/ledger.md#8`; không có standalone root snapshot trong run folder.

### No Patient Selected state

- Prompt: `No Patient Selected` với exact text `To view media files, please select a patient from the control panel on the left.`
- Controls visible: `PATIENT` Search input, `MEDIA TYPE` filter với 4 options (Audio, Chat Transcript, Message Log, Video).
- Không thấy Upload/Add New/Create button trong bounded root check này; không khẳng định tính năng unsupported.

### Mutation boundary

- Patient search không submit query; patient selection chờ owned fixture (OQ-065).
- Media Type filter không click; media fixture ownership/cleanup riêng chưa xác lập.
- Không Upload/Create/Edit/Delete media hoặc select existing patient.

### Evidence

- Provenance: `product-explore/auto-20261022-0714/ledger.md#8,#12`.
- Final baseline: exact role visible, `No Patient Selected`, controls render, 0 patient/media actions.

### Open questions

- Owned patient prerequisite nằm trong OQ-065 / `DEC-patient-fixture`; media fixture ownership/cleanup/scope riêng chưa biết.
- Upload/Create workflow có tồn tại không, hay Media Library chỉ read-only view.
- Patient→media relationship persistence và media-type accuracy chưa verified.

## Outstanding Reviews (autonomous 2026-10-22)

`Observed: dev, intended Blinx Deployment label, 2026-10-22`; run `auto-20261022-0714`, checkpoint `docs/product/explore/autonomous-state.yaml`. Exact label observed nhưng chưa independently established là active-role header; không mutation, giữ qualification từ ledger #12.

### Mutation coverage

| Nhánh | Thực hiện | End state hoặc lý do |
|---|---|---|
| Menu tới feature root | `Performed` | Empty grid, breadcrumb và controls render |
| Date Range open/Cancel | `Performed` | Picker mở/đóng, giữ Today |
| Date Range Apply | `Skipped` | Deferred theo breadth gate |
| Search | `Skipped` | Deferred theo breadth gate |
| Columns | `Skipped` | Deferred theo breadth gate |
| Filters | `Skipped` | Deferred theo breadth gate |
| Owned review action | `Skipped` | Chờ consultation fixture và lifecycle |

2/7 bounded nhánh, `Partial (read-only)`. Date Range Apply/filter, Search, Columns, Filters interactions và owned review lifecycle chưa thử; không tạo business record hoặc leftover. Cleanup UI `Done`: `Today`, picker đóng, empty grid.

### Entry và render

- Entry: Dashboard → sidebar `Web Chat & Video` → submenu `Outstanding Reviews`.
- Route: `/web-chat/review/` trên configured dev host.
- Exact label `Blinx Deployment` observed tại root; vị trí active-role/header chưa independently established, cần reverify trước role-access assertion.
- Full body render: breadcrumb `Consultations`, heading `CONSULTATIONS FOR REVIEW`, grid và controls visible.
- Root evidence: `product-explore/auto-20261022-0714/ledger.md#9`; không có standalone root snapshot trong run folder.

### Empty grid state

- Heading: `CONSULTATIONS FOR REVIEW`.
- Grid columns: Patient Name, Appt. Type, Clinician Name, Review Status, Appt. Time, Pt. Arrived, Wait Time, Call Ended, Call Duration, Action.
- Empty state: `No Rows To Show`, 0 rendered data rows.
- Không đọc existing clinical records; grid chỉ observation context, không dataset total.

### Date Range filter

- **Open**: Date Range control mở picker với Cancel/Apply buttons.
- **Cancel**: chọn Cancel đóng picker, giữ label `Today`, grid vẫn empty.
- Filter state không phải saved business persistence; cleanup restored `Today`, picker đóng.

### Mutation boundary

- Date Range Apply không thử; Search/Columns/Filters không open.
- Consultation review action fixture chưa có; không select row/submit review.
- Không mutate existing consultation; owned review lifecycle `Not Run`.

### Evidence

- Provenance: `product-explore/auto-20261022-0714/ledger.md#9,#12`.
- Final baseline: exact role visible, breadcrumb Consultations, empty grid, `Today`, picker đóng.

### Open questions

- Dataset empty nguyên nhân (permission, org context, hay dev data absence) chưa biết.
- Consultation fixture ownership/cleanup và saved review action scope chưa xác lập.
- Search/Columns/Filters/Apply behavior và review lifecycle chưa verified.

## Super Admin GB auth boundary — 2026-10-22

`[Observed / Open Question: dev, Super Admin GB]` — `product-explore/auto-20261022-1001/ledger.md#15`.

- Entry reverified: authenticated Dashboard → `Web Chat & Video` → `Virtual Appointments`. Current active-role header verified before navigation and in destination shell.
- Destination resolves to `/web-chat/` with `Welcome Back` and `Log in`; `Date Range` and appointments body do not render within bounded wait. No password form in module body.
- Paco Login recovery uses shared `.env` helper once, then fresh header verification; never replay credentials at context picker or module `Log in`. Module authentication is distinct from Paco shell authentication.
- Historical same-role SSO boundary from 2026-10-01 remains relevant. Current pass does not click module `Log in` or navigate/interact with external identity provider; approved module session prerequisite remains OQ-068.
- Current result: `Blocked`. Prior role filter/body observations remain historical, not current-role coverage. No inferred entitlement cause or product defect.

### Mutation coverage

| Nhánh | Thực hiện | End state hoặc lý do |
|---|---|---|
| Authenticated `Virtual Appointments` root | `Skipped` | Module `Welcome Back` gate; Paco header authenticated nhưng feature body chưa access |

0/1 bounded workflow branch; auth gate observed only. Search/date/layout controls chưa map trong current-role body; validation, saved state transitions, persistence và relationships `Not Run`. Không patient fixture retry hoặc record mutation; cleanup `N/A`, không leftover. Resume từ T4 `Health Forms`, không lặp gate khi prerequisite chưa đổi.

## Tester notes
