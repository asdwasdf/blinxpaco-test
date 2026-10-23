# Feature Map

Index các feature của Paco và coverage status.

Structured survey nằm tại `docs/product/survey/`. Search `graph.json` trước khi locate ticket; Markdown trong `survey/views/` là nguồn chuẩn. Regenerate bằng `npm run graph:generate`.

## Format

Mỗi feature entry:
- Feature name và category
- Coverage level: Unknown/Minimal/Partial/Substantial/Reviewed
- Ordered `Entry` không chứa ticket-specific test data
- `Role observed`, `Environment`, `Classification: Observed`
- `Source`, `Last verified`, aliases
- Link tới requirements detail và tickets đã test

Chỉ `paco-report` promote route đã verified sau report. Dùng allowlist từ `toSafeFeatureMapEntry()`; không lưu patient/NHS identifier, credential/auth detail, clinical/message content, ticket test data, raw generated class hoặc fragile locator. Route quan sát trên dev không tự thành product intent `Confirmed`.

## Features

Harvest ngày `2026-10-02` từ 15 `feature-location.md`. Mọi entry đều `Classification: Observed` (route quan sát trên `dev`, không phải product intent `Confirmed`). `Route` chỉ ghi path; host feature-branch/external được nêu ở `Entry` hoặc `Note`. Feature-branch dùng pattern `<ticket-branch>` thay cho tên branch cụ thể.

### Module: Appointment Book (PACO Connect)

#### Appointment Book (root)
- Coverage: Partial (read-only), Super Admin GB breadth 7/15, selector boundary 1/4, selector search/baseline 4/7 và draft/filter pass 5/6 giữ riêng; Blinx Deployment 4/15, saved booking lifecycle chưa chạy.
- Entry: authenticated session → direct route `/paco-connect/appointment-book` reverified; sidebar/submenu `Appointment Book` là historical navigation hint.
- Route: `/paco-connect/appointment-book`
- Role observed: `Super Admin GB` (actual header verified); `Blinx Deployment` (pass trước, riêng coverage).
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1742/ledger.md#2` (selector search/baseline); `auto-20261022-1414/ledger.md#9–10` (selector boundary); `auto-20261022-1001/ledger.md#9–11` (breadth); pass trước `auto-20261022-0236/ledger.md#12–15`; lịch sử `PAC2-8241` (`feature-location.md`), `PAC2-8384`, `PAC2-7137`, `PAC2-8552`.
- Last verified: `2026-10-23`
- Aliases: `Appt. Book`, `Appointment Book`, `PACO Connect`, `Day view`
- Tickets: `PAC2-8241`, `PAC2-8384`, `PAC2-7137`, `PAC2-8552`
- Note: document HTTP `404` vẫn render UI; chờ actual header và `Loading your appointment data` biến mất. Selector synthetic search hiện `No appointment books found` nhưng status giữ selected count; clear/reopen/reload giữ selection baseline và blank query. Không đổi selection hoặc thử `Done`/`Cancel`; saved fixture OQ-065 giữ pending.
- Logic chính:
  - Summary `Sessions`/`Booked`/`Available` phải bằng tổng detail block cùng ngày/book/filter `[Confirmed]` (PAC2-7137)
  - Appointment có 2 session holder chỉ tính `1` vào `Booked` `[Confirmed]` (PAC2-7137/TC-004)
  - Slot `Bookable` off vẫn hiện nhãn `Non-bookable`, bị loại khỏi `Available` `[Observed]` (PAC2-7137)
  - Blank `Quick Book` có `Find Appointment` disabled; All/My/All restore được. Calendar/date và synthetic root search/clear có end states, chưa saved booking hoặc count correctness `[Observed]` (`product-explore/auto-20261022-1001/ledger.md#10–11`).
- Defect đã biết (lịch sử, chưa retest trong autonomous):
  - `PAC2-7137` Fail: `Day` `Booked` đếm theo holder (3), `Week` đếm theo appointment (2)
- Chi tiết: `workflows/appointment-book.md#super-admin-gb-breadth--2026-10-22`; pass trước tại `#autonomous-breadth-2026-10-22`, logic ticket tại `#count-summary-dayweek`.
- Relationship mới: owned source Create/rename/Archive reflected trong fresh selector; selection unchanged. `[Observed]` — `product-explore/auto-20261022-1742/ledger.md#3`; source lifecycle giữ riêng bên dưới.
- Later draft/filter behavior: Quick Book `Reset` xóa gender preference nhưng giữ search/hierarchy scope; Close/reopen reset draft. `Booked` criterion giữ qua drawer reopen, reload trả exact baseline; patient no-match completion Inconclusive. `[Observed: dev, Super Admin GB, 2026-10-23]` — `product-explore/auto-20261023-0000/ledger.md#2`.

#### Appointment Sessions source (Configuration)
- Coverage: Partial (interactive), historical draft 5/9 và saved lifecycle 9/15 giữ riêng; generated-occurrence cleanup Inconclusive.
- Entry: Known Configuration root hoặc `Appointment Books` region → `Sessions`.
- Route: `/paco-connect/configuration/`
- Role observed: `Super Admin GB` (actual header verified).
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1742/ledger.md#5–6`; saved pass `product-explore/auto-20261022-2011/ledger.md#2–4`.
- Last verified: `2026-10-22`
- Logic chính: Blank Name native required; named Save cần Slot Type và Appointment Book. Fresh own prerequisites đủ Create, Name/assignments retained trong fresh editor; Edit/Cancel bỏ draft, template Delete verified bằng settled source absence.
- Note: Rename Save Inconclusive, metadata check-time-edit-impact 404 (OQ-072); Archive gate dẫn affected CSV, generated-occurrence cleanup sau Delete chưa proven (OQ-073). Historical Frequency/Untimed/discard defaults giữ riêng; không existing assignment hoặc booking mutation.
- Chi tiết: `workflows/appointment-sessions-settings.md`.

#### Appointment Slot Types source (Configuration)
- Coverage: Partial (interactive), 7/14 bounded branches; owned Create/rename/Archive persistence và fresh Session receiver verified.
- Entry: `Configuration` → button `Appointment Books` → region cùng tên → `Slot Types`.
- Route: `/paco-connect/configuration/#service-types`
- Role observed: `Super Admin GB` (actual header verified).
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1742/ledger.md#6`.
- Last verified: `2026-10-22`
- Logic chính: Minimal owned Name Save retained qua reload/fresh editor; Edit/Cancel bỏ draft, rename retained; Create/rename/Archive reflected trong fresh Session picker, không chọn option hoặc Save Session.
- Note: Name native required absent không chứng minh optional server rule; source search readiness OQ-071. Later prerequisite pass Create/Archive và saved Session assignment retained, fresh picker cleanup verified; historical 7/14 giữ riêng. — `product-explore/auto-20261022-2011/ledger.md#3`.
- Chi tiết: `workflows/appointment-slot-types-settings.md`.

#### Appointment Books source (Configuration)
- Coverage: Partial (interactive), 8/12 bounded source branches; schedule selector coverage giữ riêng.
- Entry: `Configuration` → hover `Appointment Books` → child `Appointment Books`.
- Route: `/paco-connect/configuration/#appointment-books`
- Role observed: `Super Admin GB` (actual header verified).
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1742/ledger.md#3`.
- Last verified: `2026-10-22`
- Aliases: `Add Appointment Book`, `Edit Appointment Book`, `Archive Appointment Book`
- Logic chính:
  - `Name` blank bị native required validation; minimal owned Create retained qua reload/fresh editor.
  - Edit/Cancel bỏ draft; saved rename retained qua reload/fresh editor.
  - Create, rename và Archive reflected trong fresh schedule selector; không thay selected book.
  - Archive/Continue đóng dialog; fresh source/receiver không còn owned option, không chứng minh hard delete hoặc analytics retention.
- Note: Source search/filter correctness Inconclusive (OQ-071). Later prerequisite Create→saved Session assignment và Archive→fresh Session picker absence thêm Book→Session edge; schedule selector cleanup reverified, không schedule occurrence proof. — `product-explore/auto-20261022-2011/ledger.md#3–4`.
- Chi tiết: `workflows/appointment-books-settings.md`.

#### Appointment Book — feature-branch route
- Coverage: Minimal
- Entry: authenticated session → navigate trực tiếp tới route feature-branch (hoặc `/paco-connect/feature-branch/<ticket-branch>/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`)
- Route: `/paco-connect/feature-branch/<ticket-branch>/appointment-book` (có thể kèm `?viewAs=agenda`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-7137`, `PAC2-8552` (`feature-location.md`)
- Last verified: `2026-09-30`
- Aliases: `feature-branch appointment book`
- Tickets: `PAC2-7137`, `PAC2-8552`
- Note: phải giữ prefix `feature-branch/<ticket-branch>`; route mặc định chỉ là control path, không chứng minh build của ticket.
- Logic chính:
  - Phải giữ prefix `feature-branch/<ticket-branch>`; route mặc định chỉ là control path `[Observed]` (PAC2-7137, PAC2-8552)
  - Navigation có thể trả 404/redirect qua role selection nhưng UI vẫn render; không assert response đầu `[Observed]` (PAC2-7137)
- Defect đã biết:
  - `PAC2-7137` Blocked: control trên route mặc định bị HTTP 404 rồi redirect login
- Chi tiết: `workflows/appointment-book.md#count-summary-dayweek`

#### PACO Connect — Tab selector (Dashboard ↔ Appointment Book)

- Coverage: Partial
- Entry: `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard`
- Route: `/paco-connect/dashboard` (Dashboard tab, default) ↔ `/paco-connect/appointment-book` (Appointment Book tab)
- Role observed: `Super Admin GB`, `Blinx Deployment` (Johnny Bravo 2255)
- Environment: `dev`
- Classification: `Confirmed` (live browser + video evidence)
- Source: `PAC2-6983` (`replay.md`, live replay 2026-10-18)
- Last verified: `2026-10-18T04:20:00Z` (DOM measurement: Dashboard 26px, Appointment Book 28px)
- Aliases: `connect dashboard`, `connect tab`, `connect tabs`, `tab selector`
- Tickets: `PAC2-6983`
- Note: tab row gồm 2 button `Dashboard` | `Appointment Book`; selected tab có pink background. URL swap là SPA route, không full navigation. Spacing giữa tab row và content area phải nhất quán (pixel-perfect ~27px cho cả 2 states). Bug pre-fix: Dashboard có spacing, Appointment Book flush to tabs.
- Logic chính:
  - Dashboard tab: spacing ~26px (tab bottom y=135 → content top y=161); content = dashboard cards (Total Capacity, Utilisation, Capacity Breakdown, By Slot Type, Demand by Hour/Day, Clinician table, etc.)
  - Appointment Book tab: spacing ~28px (tab bottom y=135 → content top y=163); content = calendar grid (Sessions, Booked, Available summary, day view slots)
  - Spacing consistent ~27px sau fix (diff 2px do rounding + container class khác nhau) `[Confirmed]` (PAC2-6983 replay.md)
- Defect đã biết:
  - `PAC2-6983` Resolved: pre-fix — Dashboard có spacing, Appointment Book flush to tabs. Fix deployed 2026-10-08. Live regression verified 2026-10-18.
- Chi tiết: `flows/paco-connect-tab-selector.md`

#### Appointment Book — Patient Status Filter (PAC2-6997)
- Coverage: Partial
- Entry: `/paco/dashboard` → Rocket Bar `Appointment Book` → toolbar `Filters` button
- Route: `/paco-connect/appointment-book` (filter sidebar opens as right-side panel)
- Role observed: `Blinx Deployment` (Johnny Bravo 2255)
- Environment: `dev`
- Classification: `Confirmed` (unit tests + smoke data + filter UI verified live)
- Source: `PAC2-6997` (replay.md, live replay 2026-10-18)
- Last verified: `2026-10-18T05:00:00Z`
- Aliases: `Patient Status filter`, `Patient Status whitelist`, `Patient Status accordions`
- Tickets: `PAC2-6997`
- Note: HTTP 404 on initial load is expected — SPA renders after 10-15s. Filter panel: Appointment Status (`Booked`, `Available`, `Non-Bookable`) is **separate** accordion from Patient Status (`Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled`). Demo site had 0 bookings on Oct 7/8; actual filtering verified via unit tests (9 filter cases) + smoke data from ticket.
- Logic chính:
  - Patient Status is a whitelist: a booking with no patient status appears only when `Booked` ticked AND none of Patient Arrived/Consultation Started/Consultation Ended/Patient Left/DNA unticked `[Confirmed]` (PR #2810, 46a458593)
  - Unticking only `Appointment Cancelled` keeps no-status bookings visible (cancelled appointments unlinked from slots) `[Confirmed]`
  - Deselecting every patient status hides all bookings; session actions read full session including hidden bookings `[Confirmed]`
- Defect đã biết:
  - `PAC2-6997` Fixed: pre-fix — patients with no patient status shown alongside filtered results when specific status selected. Fix deployed 2026-10-07 (commit 46a458593, PR #2810). Unit: 9 filter cases + 431 tests pass.
  - `PAC2-6997` Fixed: pre-fix — deselecting patient status removed booked row from session, causing "Block Session" instead of "Cancel session appointments" in context menu.
- Chi tiết: `flows/pac2-6997-appointment-book-patient-status-filter.md`

#### Appointment Book — feature-branch route (PAC2-8575)
- Coverage: Minimal
- Entry: authenticated session → navigate trực tiếp tới `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book`
- Route: `/paco-connect/feature-branch/pac2-8575/appointment-book`
- Role observed: `Blinx Deployment` (Johnny Bravo 2255, org `General Practice (Demo Site)`, location `test again - old location`)
- Environment: `dev` (feature-branch)
- Classification: `Observed`
- Source: `PAC2-8575` (`feature-location.md`)
- Last verified: `2026-10-15T16:35:30Z` (TC-001 + TC-002 Pass; TC-003..007 Blocked)
- Aliases: `pac2-8575 double click arrive`, `arrive patient single click fix`, `appointment status transition`
- Tickets: `PAC2-8575`
- Note: scope ticket PAC2-8575 — fix double click → single click để arrive patient trong Day view. Landmarks observed: `Sessions 23` / `Booked 6` / `Available 1,018` / `15 October 2026`; `Day`/`Week`/`Month`/`Year` toggle; `Go to today`; `LIVE` indicator. Sample slot rendered (`Mrs MAJDIYYA FAWZIA DUAL`, `08:00 08:10 (10m)`) — synthetic, không phải PII thật.
- Logic chính:
  - Phải giữ prefix `feature-branch/pac2-8575/`; route mặc định chỉ là control path `[Observed]` (PAC2-8575/feature-location.md, replicate PAC2-9001 pattern)
  - UI render OK sau `readyState=complete`; không assert HTTP response đầu `[Observed]` (PAC2-8575/feature-location.md, replicate PAC2-7137/9001)
  - Top-bar account info confirms role: `Blinx Deployment` (Johnny Bravo 2255) at `General Practice (Demo Site)` `[Observed]` (PAC2-8575/feature-location.md)
  - **Single click** lên patient slot parent `.session-slot-button` mở `Appointment Details sidebar`; slot class KHÔNG mutate; sidebar có `Mark as: Select Patient Status` (chevron không clickable trong chain 6 levels) `[Confirmed: Pass]` (PAC2-8575/manual-execution.md TC-001, replicate OBS-001/OBS-004)
  - **Double click** native cùng slot KHÔNG mutate status; sidebar vẫn mở cùng patient; reception report nói double click arrive — trên branch này fix có vẻ đã move arrive sang sidebar hoặc trigger chỗ khác `[Confirmed: Pass regression]` (PAC2-8575/manual-execution.md TC-002, replicate OBS-002)
  - 6/6 booked slots trên Day view đều `isBeforeNow`; cần QA-AUTO test data future booked để test arrive transition đầy đủ `[Inconclusive: Blocked TC-003..006]` (PAC2-8575/exploration.md OBS-003, PAC2-8575/test-cases.md TC-003..006)
  - Diagnostic note: data chỉ có ở fresh tab; existing tab state có thể trả về `Booked 0` do stale state — automation cần handle `[Observed]` (PAC2-8575/manual-execution.md attempts 1-3 vs attempt 4)
- Defect đã biết:
  - PAC2-8575 · **Limit chưa confirm** · arrive transition end-to-end chưa xác minh được (TC-003..006 Blocked do thiếu QA-AUTO future booked test data) · không có defect confirmed
- Chi tiết: `workflows/appointment-book.md#single-click-arrive-pac2-8575`

#### Appointment Book — Patient Status Change / Consultation Ended Reset (PAC2-7127)
- Coverage: Partial
- Entry: `https://blinx.dev.blinxpaco-np.com/paco-connect/appointment-book` → single-click on patient slot → sidebar
- Route: `/paco-connect/appointment-book` (Day or Week view)
- Role observed: `Blinx Deployment` (Johnny Bravo 2255)
- Environment: `dev` (feature branch used for QA)
- Classification: `Observed` (verified on FB, dev main regression not tested)
- Source: `PAC2-7127` (replay.md, 2026-10-18)
- Last verified: `2026-10-07T15:43:00Z` (QA pass on feature branch)
- Aliases: `reset Consultation Ended`, `patient status reset`, `clear status`, `change patient status`
- Tickets: `PAC2-7127`
- Note: Single-click patient slot → Appointment Details sidebar with `Mark as: Select Patient Status`. Status options: `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled`. Original bug: error "Reset failed, but status cleared locally" when removing Consultation Ended; status not actually cleared. Fix deployed 2026-10-07. Dev main regression unverified (booked slots off-screen in Week view).
- Logic chính:
  - Single click on patient slot opens sidebar with `Mark as: Select Patient Status` `[Confirmed: Pass]` (PAC2-8575/manual-execution.md TC-001, PAC2-7127 QA pass)
  - Selecting different status + Save → status persists `[Confirmed: Pass]` (PAC2-7127 QA pass)
  - Original bug (pre-fix): error "Reset failed, but status cleared locally" on Consultation Ended reset; status NOT cleared `[Confirmed]` (bug video 2026-07-03)
- Defect đã biết:
  - `PAC2-7127` Resolved: pre-fix — "Reset failed, but status cleared locally" error on Consultation Ended reset. Fix deployed 2026-10-07 on feature branch. QA passed (Sean Huynh + Abbi Russell).
  - `PAC2-7127` Regression: dev main not verified — booked slots off-screen in Week view prevents direct testing.
- Chi tiết: `flows/pac2-7127-consultation-ended-status-reset.md`

#### Appointment Book — feature-branch route (PAC2-9001)
- Coverage: Minimal
- Entry: authenticated session → navigate trực tiếp tới `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/` → URL rewrite `/dashboard` → sidebar `Appointment Book`
- Route: `/paco-connect/feature-branch/pac2-9001/appointment-book`, `/paco-connect/feature-branch/pac2-9001/configuration`
- Role observed: `Super Admin GB` (Test Fiona Nguyen, auto-include P7032 qua backend role mapping)
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-9001` (`feature-location.md`, `video-notes.md`, `automation.md`, `report.md`)
- Last verified: `2026-10-15T09:00:00Z` (MANUAL_EXECUTE rev-2 + AUTOMATE rev-2 reconciled)
- Aliases: `pac2-9001 session cancel RBAC`, `P7032 Appointment Book Cancel Session`, `canCancelSession`
- Tickets: `PAC2-9001` (rev-2, outcome: partial_complete — 3 Pass / 6 Blocked / 2 Not Run)
- Note: scope ticket PAC2-9001 — RBAC activity mới `P7032` tách quyền cancel session khỏi `Appointment Book User`. Appt Book agenda grid render OK (Sessions 45, Booked 2); session header có 2 buttons (Edit pencil + Note icon) — KHÔNG có Cancel/Block/Remove Session trực tiếp. EDIT SESSION drawer (mở từ pencil) có 8 buttons, cũng KHÔNG có Cancel/Block/Remove session entry. Right-click session name = no context menu. **OQ-033 RESOLVED 2026-10-15**: entry point for "Cancel session appointments" = `Configuration → Appointment Books → Sessions → row kebab → Cancel session appointments` (kebab has 8 items: Add Session, Edit, View Audit, Archive, Clone, Delete, Cancel session appointments). Role Groups URL: `/paco/configuration/staff/role-groups`; P7032 NOT visible trong list (max P7507, P7030 prerequisite present, P7032 missing → OQ-1: paco-one-db #1022 likely chưa deploy dev, confirmed by TC-011 diagnostic scan 2026-10-15). Video self-test 6 captioned steps reviewed: 4 dialogs captured (Access Denied, Block Session, Cancel session appointments, EDIT SESSION), entry-point NOT captured. Permissions matrix 7 actions x 3 roles (per AC tony.do comment 14:31:47Z 2026-10-13).
- Logic chính:
  - Session card có 2 buttons: `Edit pencil` (class `mx-3 aria-disabled:opacity-50`, pink color rgb(225, 8, 121), opens EDIT SESSION drawer) + `Note icon` (class `bx-session-note-icon me-3`, aria "Add a note to this session"); 0 Cancel/Block/Remove session button on card `[Observed]` (PAC2-9001/feature-location.md R-2)
  - EDIT SESSION drawer (p-sidebar `_session-edit-or-add-slidebar_rzrcz_56`) có 8 buttons: Close, eye/View, Time Range accordion, 3 dropdowns, Cancel (footer), Save (footer `aria-label=submit-changes`); 0 Cancel session / 0 Block session / 0 Remove session entry in drawer `[Observed]` (PAC2-9001/feature-location.md R-2)
  - Right-click trên session name (`a.p-accordion-header-link`) = no context menu opens `[Observed]` (PAC2-9001/feature-location.md R-2, verified via JS dispatch + Playwright `button: right` 2026-10-13T15:58Z)
  - **Configuration → Sessions row kebab has 8 items**: `Add Session, Edit, View Audit, Archive, Clone, Delete, Cancel session appointments` (7th); only `Cancel session appointments` triggers the new RBAC-gated flow. `[Observed]` (PAC2-9001/manual/rev-2/final-report.md, TC-009)
  - **Slot context menu (right-click slot) has 19 items** including `Block Session` (enabled) and `Cancel Appointment` (disabled when appointments in completed state). Block Session click produces no dialog, no error, no visible effect on both empty and booked sessions. UX gap suspected regression. `[Observed]` (PAC2-9001/manual/rev-2/execution-log.md, TC-006 diagnostic)
  - P7032 RBAC activity NOT visible trong `/paco/configuration/staff/role-groups` list (max P7507, 181 P-codes scanned P0001–P9000); P7030 Appointment Book User prerequisite present. Confirmed paco-one-db #1022 chưa deploy dev `[Confirmed via diagnostic spec TC-011]` (PAC2-9001/automation.md)
  - Video self-test (456.7s) confirm Access Denied cho User no P7032 + Cancel session dialog cho User+P7032, cùng Server-side rule reject (Plan approved 2026-10-12) `[Observed]` (PAC2-9001/video-notes.md steps 1/6, 4/6)
- Defect đã biết:
  - `PAC2-9001` **DEF-PAC2-9001-01 Block Session UX gap**: slot context menu `Block Session` enabled but click produces no dialog, no error, no effect on empty or booked sessions. Possible regression. `[Observed]` (PAC2-9001/defects/DEF-PAC2-9001-01-block-session-ux-gap.md, TC-006 diagnostic)
  - `PAC2-9001` Inconclusive (OQ-1/OQ-030): P7032 not visible in Role Groups; paco-one-db #1022 deploy status unknown on dev host `[Confirmed via diagnostic spec TC-011]` (PAC2-9001/automation.md, feature-location.md R-4)
  - `PAC2-9001` Pre-existing `appointments/cancel` org-check split out of scope (REQ-010) `[Confirmed]` (PAC2-9001/requirements.md REQ-010)
- Chi tiết: `workflows/appointment-book.md#session-cancel-rbac-p7032`

#### Appointment Book — Filters / Location
- Coverage: Minimal
- Entry: `Appointment Book` root → toolbar `Filters` → sidebar `Filters` → `Location`
- Route: `/paco-connect/appointment-book`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8384` (`feature-location.md`)
- Last verified: `2026-09-25`
- Aliases: `Filters`, `Location filter`
- Tickets: `PAC2-8384`
- Note: danh sách option phụ thuộc appointment book và date range đang chọn; chờ `Loading your appointment data` biến mất.
- Logic chính:
  - Multi-book: `Location`/`Slot Type`/`Session`/`Clinician`/`Patient` lấy option từ tất cả book chọn `[Confirmed]` (PAC2-8384)
  - `Appointment Type` chỉ liệt kê type đang dùng trong book, lọc cả session lẫn slot `[Confirmed]` (PAC2-8384)
  - Chip `Location` ở toolbar và loading-vs-empty chỉ là đề xuất `[Inferred, Candidate]` (PAC2-8384)
- Defect đã biết:
  - `PAC2-8384` Fail (DEF-001): chọn hai book cùng location thì `Location` trả `No results found`
- Chi tiết: `workflows/appointment-book.md#filter-trong-appointment-book`

#### Appointment Book — Patient filter (PAC2-6996)
- Coverage: Minimal
- Entry: `Appointment Book` root → toolbar `Filters` button (icon, title="Filters", right edge of toolbar) → sidebar `Patient` accordion
- Route: `/paco-connect/appointment-book` (filter sidebar right-side panel)
- Role observed: `Blinx Deployment` (Johnny Bravo 2255)
- Environment: `dev`
- Classification: `Observed` (live replay 2026-10-18)
- Source: `PAC2-6996` (`replay.md`, live replay 2026-10-18)
- Last verified: `2026-10-18T04:45:00Z`
- Aliases: `Patient filter`, `Patient Name filter`, `blank filter bug`
- Tickets: `PAC2-6996`
- Note: Filter sidebar has 6 accordions — Healthcare Professional, Patient, Appointment Type, Slot Type, Session Name, Location. Patient accordion renders as live-search input + filtered list (no static options). Pre-fix bug: blank filter option appeared under Patient Name. Post-fix: "No results found" when no match.
- Logic chính:
  - Filter sidebar opens via toolbar `Filters` button; close via Escape or click outside `[Observed]` (PAC2-6996)
  - Patient accordion content = search input + item list (live-filtered, no blank options) `[Observed]` (PAC2-6996)
  - Sidebar header: "Filters" + "Reset all" button + "All Appts" / "My Appts" toggle `[Observed]` (PAC2-6996)
- Defect đã biết:
  - `PAC2-6996` Resolved: pre-fix — blank filter option under Patient Name. Fix deployed 2026-10-07. Live regression verified 2026-10-18.
- Chi tiết: `flows/pac2-6996-appointment-book-patient-filter.md`

#### Appointment Book — Session slot editor (`Edit Session`)
- Coverage: Minimal
- Entry: `Appointment Book` root (Day view) → right-click slot trong cột session → `Edit Session`
- Route: `/paco-connect/appointment-book` (modal, URL thêm `?preview=true`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8241` (`feature-location.md`)
- Last verified: `2026-10-02`
- Aliases: `Edit Session modal`, `slot menu`, `Session ends at`
- Tickets: `PAC2-8241`
- Note: context menu gồm `Edit Slot`, `Add a note`, `View Audit Log`, `Edit Session`, `Block Session`, `Remove Session`, `Message Session Patients`; slot list tải ~5-8s. `Time Range` trong drawer `Edit Session` từ session header đã được sửa thành `Confirmed` sau `MANUAL_EXECUTE` (trên session test tự tạo).
- Logic chính:
  - Session có booking: khóa `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types` `[Confirmed]` (PAC2-8241)
  - Slot ngoài start/end phải bị từ chối với message boundary, server cũng reject `[Confirmed]` (PAC2-8241)
  - Đổi slot type/`Empty Slot`/`Bookable` rồi `Save` persist qua reopen và reload `[Observed]` (PAC2-8241/TC-002, 003)
- Defect đã biết:
  - `PAC2-8241` Fail (TC-001): slot ngoài range trả 500, UI im lặng, stale pending slot
  - `PAC2-8241` Fail (TC-007): extend `Hours (To)` toast success nhưng không sinh slot, slot đã chỉnh revert
- Chi tiết: `workflows/appointment-book.md#session-editor-và-khóa-field`

#### Session — extend earlier (PAC2-7150)
- Coverage: Minimal
- Entry: `Appointment Book` (Day view) → session card → `Edit` (pencil icon) **HOẶC** `Configuration` → `Sessions` → row → `Edit`
- Route: `/paco-connect/appointment-book` (Day view) → Edit Session drawer
- Role observed: `Super Admin GB` / session holder
- Environment: `dev`
- Classification: `Confirmed`
- Source: `PAC2-7150` (replay.md, Sean Huynh QA PASSED 2026-10-07)
- Last verified: `2026-10-18`
- Aliases: `start session earlier`, `extend session start`, `shaded hour`, `earlier slot`
- Tickets: `PAC2-7150`
- Note: Shaded hour phía trên session start cho phép thêm slot ở thời điểm trước start time. Prompt "Start session at [time]" xuất hiện khi thêm slot trong shaded zone. Extend cả hai đầu → prompt "Run session [start]–[end]". Clash detection nếu earlier time trùng session khác.
- Logic chính:
  - Shaded hour zone trong Edit Session cho phép thêm slot trước start `[Confirmed]` (PAC2-7150/TC-001)
  - Single-direction prompt "Start session at [time]" khi thêm slot trong shaded zone; Accept → session start cập nhật + slot mới `[Confirmed]` (PAC2-7150/TC-001)
  - Dual-direction prompt "Run session [start]–[end]" khi extend cả hai đầu; Cancel → giữ nguyên, Accept → cập nhật cả start và end `[Confirmed]` (PAC2-7150/TC-002)
  - Start earlier từ Appointment Book settings panel → cập nhật cả settings panel và board `[Confirmed]` (PAC2-7150/TC-003)
  - Clash detection khi earlier time trùng session khác `[Confirmed]` (PAC2-7150/TC-003)
- Defect đã biết:
  - `PAC2-7150` Resolved: pre-fix — không thể thêm slot trong shaded hour phía trên session start. Fix deployed + QA passed 2026-10-07.
- Chi tiết: `flows/pac2-7150-session-extend-earlier.md`

#### Appointment Settings — Sessions configuration
- Coverage: Partial
- Entry: `/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Settings`
- Route: `/paco-connect/configuration` (feature-branch: `/paco-connect/feature-branch/<ticket-branch>/configuration`; UI có thể normalize sang `/configuration/#clinics`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8241`, `PAC2-7786`, `PAC2-8552` (`feature-location.md`)
- Last verified: `2026-10-02`
- Aliases: `Appointment Settings`, `Sessions`, `Session Configuration`, `diary`, `Configuration > Appointment Books > Sessions`
- Tickets: `PAC2-8241`, `PAC2-7786`, `PAC2-8552`
- Note: landmarks `Search Session...`, toggle `Active`/`Removed`, grid cột `Session Name`/`Actions`; row `Actions` → `Edit`, `View Audit`, `Archive`, `Clone` (và `Delete`, `Cancel Session` ở feature-branch `PAC2-8552`); `Add Session`/`Edit` mở drawer `Edit Session` (Time Range nằm dưới section `Frequency`). `Loading sessions` có thể 30-40s; document response `404` nhưng SPA render. Dừng trước `Save`/`Archive`/`Delete`/`Cancel Session`.
- Logic chính:
  - `Active` → `Cancel Session` → `Removed` (archive) → `Restore`; `Delete Session` không có trong menu `[Observed]` (PAC2-7786)
  - Xóa session không booking cần confirmation trước mutation; session có booking phải bị từ chối (`SESSION_HAS_BOOKINGS`) `[Confirmed]` (PAC2-7786)
  - Tạo session cần book, location, slot type, care professional, ngày, tần suất, giờ, slot duration `[Observed]` (PAC2-7786, PAC2-8241)
- Defect đã biết:
  - `PAC2-7786` Fail: không có `Delete Session`; `Cancel Session` chỉ archive (TC-001, 003, 004)
  - `PAC2-7786` Blocked/Inconclusive: TC-002 thiếu data an toàn, TC-005 Delete vs Block còn Disputed
- Chi tiết: `workflows/appointment-book.md#session-delete--archive`; `workflows/appointment-book.md#session-editor-và-khóa-field`

#### Configuration — Appointments listing
- Coverage: Minimal
- Entry: `Configuration` → `Appointment Books` → `Appointments`
- Route: `/configuration/#appointments`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8552` (`feature-location.md`)
- Last verified: `2026-09-25`
- Aliases: `Appointments`, `Show Cancelled Bookings`
- Tickets: `PAC2-8552`
- Note: `Fetch Latest Appointments` và `Fetch All Slot Details` chưa rõ side effect, không dùng.
- Logic chính:
  - Có `Show Cancelled Bookings`, `Fetch Latest Appointments`, `Fetch All Slot Details` (side effect nút fetch chưa rõ) `[Observed]` (PAC2-8552)
  - Cancel/book phải không trả success im lặng khi zero rows hoặc trạng thái nửa vời `[Confirmed]` (PAC2-8552)
- Defect đã biết:
  - `PAC2-8552` Blocked: 9/9 case, thiếu approval mutation/fixture/DB owner
- Chi tiết: `workflows/appointment-book.md#hiệu-năng-bookingcancel-partitioned-table`

### Module: Case Load Management

#### Case Workboards
- Current-role coverage: `Super Admin GB` breadth 3/8 và independent search/presentation 4/6 giữ riêng; current-board no-match/clear, Case ID/Patient mode/clear và List/Card reload/restoration verified. Sources `product-explore/auto-20261022-1206/ledger.md#16`, `product-explore/auto-20261023-0000/ledger.md#3`; no saved mutation, DEC-workboard-create pending.
- Current-role reusable behavior: Board search no-match hiển thị Tasks/Cases zero, `Clear search` restore sidebar; current-board search có explicit no-match helper. Case ID/Patient đổi input, matching completion Inconclusive; List marker và `?view=list` giữ qua reload, Card/Board/blank searches restored. Filters unchanged Save disabled; delayed-score cause Open, không patient card opened.
- Current-role chi tiết: `workflows/case-load-management.md#independent-search-modes-và-presentation--2026-10-23`; historical denominators và context giữ riêng.
- Coverage lịch sử: Partial (read-only), 3/9 bounded branches, destination context chưa verified
- Entry: `/paco/dashboard` → sidebar `Case Load Management` → submenu `Case Workboards`
- Route: `/paco/workboards?tab=case` (auto-select existing board → `/paco/workboards/:id`)
- Role context: intended `Blinx Deployment`, chưa verified tại destination; Reports và Dashboard sau đó hiển thị `Config Admin`.
- Environment: `dev`
- Classification: `Observed`
- Source: historical `product-explore/auto-20261022-0714/ledger.md#10–12`; current-role `product-explore/auto-20261023-0000/ledger.md#3`
- Last verified: `2026-10-23`
- Aliases: `Workboards`, `Case Boards`, `My Case`
- Logic chính:
  - Controls: search mode `Board`/`Case ID`/`Patient`, Board name field, `Tasks`/`Cases` counts, `Create new board`, `Search this board`, List/Card view toggle, `Filters` `[Observed]`.
  - `Create new board` mở form blank `/paco/workboards/new-workboard`: fields Assign Staff/Team, Board Owner, Organisation, Type (options Case/Task opened, not selected), Add Actioned Cases, Permission, Display resolved, Home Visit Board, Default Consultation Template, Columns. Save và Cancel enabled; không nhập name, không Save `[Observed]`.
  - `Cancel` đóng form, list auto-select board khác có sẵn; form absent sau đó `[Observed]`.
  - `My Case` submenu handoff tới `/paco/patient-profile/:id/cases/:id`; rời ngay không đọc clinical content `[Observed]`.
  - Historical empty `My Case` (2026-09-15, 2026-10-01) khác current handoff; giữ cả hai provenance, không kết luận data condition `[Observed]`.
- Gaps: 3/9 performed (root, blank form Type/Cancel, My Case handoff); 6 skipped (search, view toggle, Filters, saved create/readback, board update/cleanup, assignment/case/task lifecycle). Không thấy saved persistence/validation/two-sided relationship. Scoped cleanup/private/default visibility unknown; create class `unknown-scope`, không reuse shared-list/staff rootcause. OQ-066 cho safe owned fixture.
- Chi tiết: `workflows/case-load-management.md#autonomous-work-boards--2026-10-22`; không dùng observation context-unverified làm permission proof.

### Module: Configuration

#### Organisation — Skills
- Coverage: Partial (interactive), 8/14 nhánh có end state
- Entry: `/paco/dashboard` → sidebar `Configuration` → `Organisation` → `Skills`
- Route: `/paco/configuration/organisation/skills`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1359/ledger.md#2`–`#7`, `#11`
- Last verified: `2026-10-21`
- Aliases: `Add Skill`, `Edit Skill`, `Copy Skill`, `Archive Skill`
- Logic chính:
  - Create minimal với Name; duplicate bị từ chối bằng `Resource already exist` / `The resource you are trying to add already exists` `[Observed; ledger #3, #5]`.
  - Edit Cancel bỏ draft; Save rename còn sau reload; Copy tự nối ` copy` vào Name đã nhập `[Observed; ledger #4–#5]`.
  - Archive có Cancel/Confirm; Confirm bỏ row khỏi active grid, toast `Skill deleted successfully`; không chứng minh hard deletion `[Observed; ledger #7]`.
  - Create/rename/archive source phản ánh exact Name trong fresh Staff Profile `Skill Capabilities` picker; không chọn/lưu profile, chưa chứng minh saved assignment `[Observed; ledger #11]`.
- Gaps: audit end state, mapping Pathways/SNOMED/RBAC, empty/whitespace server validation, archive retention chưa verified; không có defect confirmed.
- Chi tiết: `workflows/organisation-skills.md`

#### Organisation — Services
- Coverage: Partial (read-only + unsaved draft), 2/7 nhánh có end state; persisted mutation 0
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Services`
- Route: `/paco/configuration/organisation/services`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1359/ledger.md#14`–`#15`
- Last verified: `2026-10-21`
- Aliases: `Add Another`, `Remove service`, `Service ID`, `Service Name`, `Case Type`
- Logic chính:
  - Editable list có `Service ID`, `Service Name`, `Case Type`, `Add Another`, `Remove service` và footer `Save` chung. Không chỉnh row có sẵn `[Observed; ledger #15]`.
  - Owned draft: Add/Remove quay lại baseline; Add/reload không persist, 0 owned inputs. ID lọc non-digit và max15; Name max255; Case Type mở 14 options nhưng không chọn/lưu `[Observed; ledger #15]`.
- Gaps: shared-list Save footprint, server required/unique/domain rule, persisted CRUD và receiver chưa verified; không defect verdict.
- Chi tiết: `workflows/organisation-services.md`; safety gap `OQ-052`.

#### Organisation — Pathways Config
- Coverage: Minimal (read-only), Blocked
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Pathways Config`
- Route: `/paco/configuration/organisation/pathways`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1359/ledger.md#8`
- Last verified: `2026-10-21`
- Logic chính: visible menu hiện tới `Page Not Found`; tái hiện qua menu, reload, fresh tab. Skills control render được. Chưa map được CRUD hoặc chứng minh quan hệ Skills/Pathways; không kết luận HTTP status/root cause.
- Chi tiết: `workflows/organisation-pathways.md`; blocker `OQ-049`.

#### Organisation — Practice Profiles
- Coverage: Partial (read-only), Blocked — 0/1 nhánh truy cập feature root
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Practice Profiles`
- Route: `/paco/configuration/organisation/practice-profiles`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1626/ledger.md#13`, `practice-profiles-route-check.js`
- Last verified: `2026-10-21`
- Aliases: `Practice Profiles`
- Logic chính: visible menu tới `Page Not Found` / `Sorry, the page you are looking for does not exist.`; reload và fresh tab cùng context tái hiện; Skills control render được. Không tạo data/draft/mutation. Purpose/entities/consumers chưa biết; không suy cùng root cause với Pathways Config (OQ-049).
- Chi tiết: `workflows/practice-profiles.md`; blocker `OQ-057`.

#### Organisation — Locations
- Coverage: Partial (interactive), 7/12 nhánh trong inventory giới hạn có end state; cleanup `Done`
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Locations`
- Route: `/paco/configuration/organisation/locations`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1844/ledger.md#3–19`, `ui-observations.json`
- Last verified: `2026-10-21T20:00:15.316Z` (read-only cleaned/cancelled Names0/dialogs0/roleVerifiedtrue; latest connector notice sau Sharing Agreements menu chưa recheck)
- Aliases: `Add Location`, `Location`, `Enter Address`, `View Audit`, `Archive`
- Logic chính:
  - Scoped `Location` Save tạo owned record; search/reload rồi nested Address reopen xác nhận persistence. Edit Name/City/Line2 qua Address Confirm và parent Save còn đúng sau reload/reopen; contacts giữ nguyên `[Observed; ledger #7–11]`.
  - Empty Email Save giữ dialog với native `Please fill out this field.`; Address trống có custom `Address is required`. Empty/whitespace Name, invalid Email và Confirm gating chỉ kiểm client; không suy server rule `[Observed; ledger #4–7]`.
  - Nested Address Cancel/Close giữ draft trong cùng parent; parent Close rồi fresh reload/reopen trả persisted City gốc. Add Name-only draft Close/no Save có exact row0/dialogs0 sau reload. Parent Save sau nested Cancel và intent/root cause chưa biết `[Observed; ledger #9–10,#15]`.
  - Archive cleanup: Cancel/reload giữ owned row, read-only Edit assignment+sharing empty, Close, exact Archive warning, confirm1; owned row0 ngay sau confirm và sau reload, dialogs0/roleVerifiedtrue. UI Archive cleanup Done, không status-cell/hard deletion/retention/Restore proof `[Observed; ledger #14]`.
- Gaps: `View Audit`, retention/Restore, server duplicate/invalid/boundary rules, staff/sharing assignment và receiver chưa verified. Original notice recovered cho cleanup; notice sau Add Close recovered qua auth/role/read-only reconciliation20:00:15.316Z. Latest notice sau Sharing Agreements menu chưa recheck. Không product Fail/root cause inferred hoặc observed relationship edge mới.
- Chi tiết: `workflows/organisation-locations.md`; câu hỏi `OQ-058`, `OQ-059`.

#### Organisation — Dx Priority
- Coverage: Partial (read-only), 4/7 nhánh trong inventory giới hạn có end state; 3 `Skipped`
- Entry: `Configuration` → `Organisation` → visible menu `Dx Priority`
- Route: `/paco/configuration/organisation/dx-priorities`
- Role observed: `Blinx Deployment` verified trước run; sau fresh Dx reload exact role label absent, current role chưa verified
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-0158/ledger.md#1–5`, `ui-observations.json`; preflight `resume-preflight-20261022-0151/ledger.md#2–4`
- Last verified: root `2026-10-22T02:00:25.168Z`, search/pickers `02:02–02:03Z`; last measured root `02:05:30.280Z` nhưng role label absent. Global `More options` mở `02:06:23.494Z`; subsequent snapshot không timestamp riêng. Later `CONNECTION_CLOSED` chặn current recheck; không current-role/product verdict.
- Aliases: `Dx Priority`, `DX Priorities`, `Search Priorities...`
- Logic chính:
  - Root có `Disposition Code`, `Disposition Text`, `Service`, `Priority`, `Add Service & Priority`, `Remove pair` và disabled shared `Save`; chưa thấy isolated owned target trong bounded root `[Observed; ledger #2]`.
  - Synthetic no-match có `No priorities match “<synthetic-query>”`; clear phục hồi rendered baseline. Đây search, không domain validation `[Observed; ledger #3]`.
  - Service/Priority pickers read-only mở/đóng, không chọn/Save; populated options không relationship proof. Reload root render nhưng exact role absent; cause chưa biết `[Observed; ledger #3–4]`.
- Gaps: shared Add/Remove/change/Save `Skipped`, owned target/write footprint/domain rules/saved persistence/consumer OQ-062; active-role readback sau reload OQ-063. No mutation/new records/receiver/possible defect; last global menu open, final UI sweep Blocked.
- Chi tiết: `workflows/organisation-dx-priorities.md`.

#### Organisation — Announcements
- Coverage: Partial (interactive) — 4/8 nhánh giới hạn có end state, 4 `Skipped`; chỉ own unsaved drafts
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Announcements`
- Route: `/paco/configuration/organisation/announcements`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-2259/ledger.md#5–10`, `ui-observations.json#announcements`
- Last verified: `2026-10-22T01:07:48.305Z` — chỉ read-only cleanup reconciliation: Service editors1/exact own matches0/0/dialogs0/roletrue; không full feature revalidation. Nguồn `resume-preflight-20261022-0103/ledger.md#4`, run2259 ledger #12–13; latest connector notice sau sweep lại chặn current recheck, timestamp null.
- Aliases: `Announcements`, `Welcome Message`, `Service Updates`, `Apply to locations`
- Logic chính:
  - Root có Welcome Message/Service Updates accordion và page-level `Save`. Welcome 2 existing blocks, Service 1 block; toolbar formatting/link/table/image và `Apply to locations` picker 285 rendered options (không dataset total). Không sửa existing content/chọn location `[Observed; ledger #5–6]`.
  - Own Service draft: `Add another` baseline1→2, fill unique synthetic, scoped `Delete` unique editor/button → baseline1; fresh reload owned text0. `Add`/reload không `Save`/`Delete` cũng baseline1/owned text0. Cleanup Done: dialogs0, no pending Save `[Observed; ledger #7–10]`.
  - Shared page-level `Save` write footprint, persisted lifecycle/validation, location effect và recipients/triggers chưa xác lập (OQ-061). Không bấm `Save` `[Open Question]`.
- Gaps: saved announcement create/update/delete, server validation rules, location assignment persistence, delivery/receiver và Welcome/formatting branches chưa verified; không defect verdict.
- Chi tiết: `workflows/organisation-announcements.md`; câu hỏi `OQ-061`.

#### Organisation — Sharing Agreements
- Coverage: Partial (read-only), cumulative 4/5 bounded branches có end state; 1 nhánh Skipped
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Sharing Agreements`
- Route: `/paco/configuration/organisation/sharing-agreements`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1844/ledger.md#17–19`, `auto-20261021-2259/ledger.md#1–4`, `ui-observations.json#sharing_agreements`
- Last verified: `2026-10-22T01:08:14.018Z` — chỉ read-only route/role và layout baseline six200px/unpinned/dialogs0/menu absent, không replay experiment/full feature revalidation. Nguồn `resume-preflight-20261022-0103/ledger.md#4`, run2259 ledger #12–13; latest connector notice sau sweep chặn current recheck, timestamp null. Run1844 menu click `20:04:00.999Z`, subsequent snapshot không timestamp riêng.
- Aliases: `Organisations you share data with`, `Column Menu`
- Logic chính:
  - Root có heading `Organisations you share data with`, columns `ODS Code`, `Name`, `Address`, `Access`, `Status`, `ID`; ba rendered center rows không phải dataset total `[Observed; run 1844 ledger #18]`.
  - Status label `active` và Access labels `prescribing`, `consultations`, `documents`, `codings` chỉ là display; chưa thử permission/effect/relationship `[Observed; run 1844 ledger #18]`.
  - Header `Name` mở `Column Menu` với tabs `general`/`columns`; columns tab six checked columns, Filter Columns Input `Status` filters column names only (layout search), clear restored six, no checkbox changed `[Observed; run 2259 ledger #2]`.
  - General layout `Autosize This Column` → Name width 200→279px; fresh reload six headers 200px/unpinned, no layout persistence trong context đã thử; baseline restored `23:02:44.955Z`, dialogs `0` `[Observed; run 2259 ledger #3–4]`.
  - Paging four controls `visible:false`/`hidden ancestor` measured `23:01:07.299Z`; visibility only, no navigation/support proof; branch Skipped not `Not supported` `[Observed; run 2259 ledger #2]`.
  - Bounded root không thấy feature Add/Save/row Actions/search/input; không kết luận CRUD unsupported. Column menu/filter chỉ layout UI preference only, no agreement-record mutations/domain persistence/receiver `[Observed; run 1844 #18–19, run 2259 #1–4]`.
- Gaps: purpose/lifecycle/owned prerequisite/write footprint, CRUD/validation/persistence và receiver; general other choices (pin/autosize all/reset, column toggle/order, data-row sort/filter) untested; paging navigation Skipped. Coverage dimensions: navigation done, main_workflow partial, branches_states partial (4/5), mutation none, validation none, persistence partial (own layout reload only, NOT business data), relationships none, errors_edge none. Confidence Medium bounded navigation/layout, no product verdict/deep/Complete. Connector blocker recovered trong preflight 2253 cho run 2259 measurements. Không product Fail/root cause inferred hoặc observed edge.
- Chi tiết: `workflows/organisation-sharing-agreements.md`; câu hỏi `OQ-060`.

#### Users & Staff — Teams
- Coverage: Minimal (read-only + unsaved draft), persisted mutation 0
- Entry: `/paco/dashboard` → `Configuration` → `Users & Staff` → `Teams`
- Route: `/paco/configuration/staff/teams`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1359/ledger.md#9`
- Last verified: `2026-10-21`
- Logic chính: `Add New` mở Name (`50 characters max`); Add tạo draft, reload bỏ draft. `Save` chung cho editable team list chưa click do chưa xác lập shared-data write footprint. Không đổi staff/member có sẵn.
- Chi tiết: `workflows/staff-teams.md`; safety gap `OQ-050`.

#### Users & Staff — Staff Profiles
- Coverage: Partial (read-only), 4/9 nhánh có end state; Staff Profile mutation 0
- Entry: `/paco/dashboard` → `Configuration` → `Users & Staff` → `Staff Profiles`
- Route: `/paco/configuration/staff/profiles`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1359/ledger.md#10`–`#11`
- Last verified: `2026-10-21`
- Aliases: `Add Care Professional`, `Skill Capabilities & Attributes`
- Logic chính:
  - List có `Active`/`Archived`, search, pagination; Add dialog có `General`, `Roles & Permissions`, `Skill Capabilities & Attributes`; General yêu cầu First/Last Name, Gender, Email. Chưa submit `Create` `[Observed; ledger #10]`.
  - Fresh `Skill Capabilities` picker phản ánh owned Skill create/rename/archive; receiver draft đóng, không chọn/lưu, không email/invite `[Observed; ledger #11]`.
- Gaps: safe Email/identity/invite side effects, saved capability/roles/Attributes, Teams consumer chưa verified.
- Chi tiết: `workflows/staff-profiles.md`; safety gap `OQ-051`.

#### Users & Staff / Role Groups
- Current-role coverage: `Super Admin GB` 3/8 bounded branches read-only; actual header verified tại root/reload, synthetic search/clear và paging markers restored. Source `product-explore/auto-20261022-1206/ledger.md#2`; data accuracy chưa verified.
- Coverage lịch sử: Partial (read-only), 3/8 bounded branches có end state, role qualification giữ riêng.
- Entry: `/paco/dashboard` → sidebar `Configuration` → `Users & Staff` → `Role Groups`
- Route: `/paco/configuration/staff/role-groups`
- Role context: exact `Blinx Deployment` label checked trước navigation và tại Media Library/Outstanding Reviews; chưa independently established là active-role header hoặc checked tại Role Groups root.
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-0714/ledger.md#6–9,#11–12`
- Last verified: `2026-10-22`
- Aliases: `Role Groups`, `Search Role Groups`
- Logic chính:
  - Root có heading Role Groups, Search input, page controls, Add New/Edit buttons. Grid fields Role, Role Group, RBAC Role, RBAC Activities, Activity Status. Footer Save disabled `[Observed]` (ledger #7).
  - Search synthetic no-match không có role rows, không empty message; clear restore list, Save vẫn disabled `[Observed]` (ledger #7).
  - Pagination Page 2 active content đổi, Page 1 restore marker về 1, content khác trong memory compare, Search blank `[Observed]` (ledger #7).
- Gaps: Add New/Edit/Save shared config chưa bấm do write footprint chưa xác lập (OQ-064 / `DEC-shared-list-save`). Domain validation, RBAC/Status changes, staff assignment receiver chưa verified.
- Chi tiết: `workflows/admin-sso.md#autonomous-role-groups-breadth--2026-10-22`

#### Code Rule Config
- Coverage: Minimal
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Code Rule`
- Route: `/configuration/#code-rules-config`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-4399` (`feature-location.md`)
- Last verified: `2026-09-22`
- Aliases: `Code Rule`, `Code Rule Config`, `SNOMED code rules`
- Tickets: `PAC2-4399`
- Note: route đã verified nhưng chưa chứng minh liên quan tới mapping của ticket; chọn value tạo draft rule, `Submit` là mutation boundary.
- Logic chính:
  - Mục tiêu ticket: cập nhật SNOMED code cho blood-pressure khi file vào EMIS (code cũ deprecated) `[Confirmed]` (PAC2-4399)
  - SYS/DIA không được đổi/mất/đảo/duplicate sau đổi code `[Inferred]` (PAC2-4399)
  - Chưa chứng minh `Code Rule Config` là nơi quyết định mapping của ticket `[Open Question]` (PAC2-4399)
- Defect đã biết:
  - `PAC2-4399` Blocked: TC-001..003 thiếu quyền EMIS/evidence DB; overall Inconclusive
- Chi tiết: `workflows/configuration.md#code-rule-config-và-quy-tắc-clinical-code-blood-pressure`

### Module: Comms Hub (external host `nhs-comms-hub-dev.blinxhealthcare.com`)

#### Campaign Manager
- Coverage: Partial (read-only), current authenticated external pass 4/12 bounded branches; old Blinx Deployment login-boundary pass 1/7 giữ riêng
- Entry: exact external dev Login → authenticated Home → `Campaign Manager` link; Paco sidebar handoff verified trong pass trước
- Route: `/commshub/campaign-manager`
- Role observed: `Super Admin GB` tại source Paco; external role chưa xác minh, không carry permissions
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1001/ledger.md#13–14`; lịch sử `PAC2-6982` (`feature-location.md`), `PAC2-6540`, `PAC2-7201`, `PAC2-1805`, `auto-20261022-0500/ledger.md#2–3`
- Last verified: `2026-10-22` cho authenticated root/search/Outbox read-only
- Aliases: `Campaign Manager`, `Comms Hub`, `PaComms` (top-bar, khác module sidebar)
- Tickets: `PAC2-6982`, `PAC2-6540`, `PAC2-7201`, `PAC2-1805`
- Note: Paco session không share với Comms Hub; cần login riêng. Landmarks: `Create Campaign`, `Campaign Outbox`, `Search campaigns`, `Clear Filters`, `Show All Columns`, `Viewing data for` (org context), nhóm `Non-Shared Campaigns`/`Shared Campaigns`. Dropdown `Viewing data for` dễ đóng ngoài ý muốn. Role `GP Paco Assist`/`Super User`/`Blinx Deployment` thấy top-bar `PaComms` bị disabled (`PAC2-6540`).
- Logic chính:
  - Site Comms Hub riêng, login riêng, không share session PACO `[Observed]` (PAC2-1805, PAC2-6540, PAC2-6982)
  - Nhóm `Non-Shared Campaigns`/`Shared Campaigns`; `Create Campaign` luôn tạo dưới home org `[Observed]` (PAC2-6982, PAC2-7201)
  - Shared campaign: org được share chỉ `view`, creator giữ `edit` (thiết kế) `[Observed]` (PAC2-7201)
- Defect đã biết:
  - `PAC2-7201` Fail dự kiến: dev cho org được share `Edit`+`Delete`; pattern ngược cho org tạo
  - `PAC2-1805` Fail kỹ thuật: `Resend` HTTP 400, không toast (ngoài scope ticket)
- Current blocker: auth riêng đã qua; external role và owned lifecycle cleanup chưa verified, OQ-040 role requirement giữ Open. Root search/clear và Outbox keyboard search có end states, chưa campaign mutation/Send.
- Chi tiết: `workflows/comms-hub.md#authenticated-breadth--2026-10-22`; pass trước tại `#autonomous-breadth-exploration-2026-10-22`, logic ticket tại `#campaign-manager-và-campaign-outbox` và `#shared-campaign-và-quyền-viewedit`

#### Campaign Outbox
- Coverage: Partial (read-only root/search), chưa selected campaign hoặc Resend
- Entry: `Comms Hub` → `Campaign Manager` → `Campaign Outbox`
- Route: `/commshub/campaign-outbox`
- Role observed: Source Paco `Super Admin GB`; external role unverified, historical role giữ riêng
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1001/ledger.md#14`; lịch sử `PAC2-6540` (`feature-location.md`)
- Last verified: `2026-10-22` cho root và synthetic keyboard search/clear
- Aliases: `Outbox`, `Campaign Outbox`
- Tickets: `PAC2-6540`
- Note: root hiển thị `Campaigns`, `Campaign Types`, prompt chọn campaign. Chọn campaign có thể mở dữ liệu bệnh nhân/message; dòng có `Resend` là mutation (đã quan sát lỗi HTTP 400 ổn định ở `PAC2-1805`, defect riêng).
- Logic chính:
  - Status `Not Sent - Patient Deleted or Inactive` cho bệnh nhân deleted/inactive `[Confirmed]` (PAC2-6540)
  - Tập người nhận campaign phải khớp patient set trong report `[Confirmed]` (PAC2-6540)
  - Org selector chỉ liệt kê org trong entitlement `[Observed]` (PAC2-6540)
- Defect đã biết:
  - `PAC2-6540` Not Run: TC-003 đối chiếu Outbox do org gốc không trong selector
  - `PAC2-1805` Fail kỹ thuật: `Resend` HTTP 400
- Chi tiết: `workflows/comms-hub.md#campaign-manager-và-campaign-outbox`

### Module: Health Forms

#### Health Forms Designer
- Current-role coverage: `Super Admin GB` saved lifecycle 8/14 và independent unsaved Preview 5/7 giữ riêng, `Partial (interactive)`. Preview answer retained nhưng Required marker vẫn visible sau blur; config/draft reset verified, không response submit. Sources `product-explore/auto-20261022-1206/ledger.md#3–13`, `product-explore/auto-20261023-0000/ledger.md#8`; prior draft-only 4/8 riêng.
- Coverage lịch sử: `Blinx Deployment` Partial (8/18 workflow branches, interactive); saved lifecycle giữ scope/provenance riêng.
- Entry: `/paco/dashboard` → `Expand sidebar` → `Health Forms` → `Designer`
- Route: `/health-forms/builder/`
- Role observed: `Super Admin GB` (actual header verified 2026-10-23); `Admin` (QA xác nhận trong hội thoại, chưa độc lập xác minh trên UI); `Blinx Deployment` (autonomous 2026-10-21)
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6982` (`feature-location.md`); cross-org scope `PAC2-3934` (Blocked 2026-10-18); autonomous `product-explore/auto-20261021-1626/ledger.md`
- Last verified: `2026-10-23` (Super Admin GB unsaved Preview 5/7; saved lifecycle và historical role giữ riêng)
- Aliases: `Designer`, `Health Forms`, `form builder`, `Consultation Form`
- Tickets: `PAC2-6982`, `PAC2-3934` (Blocked)
- Note: grid có cột `Health Form Name`, `Created By Organisation`, `Shared To Organisation(s)`, `Archived`, `Editable`, `Actions`. PAC2-3934 survey 2026-10-18 chỉ xem, không mở row/`Actions`; thấy consultation template nhưng không có consultation submit/file screen. Autonomous 2026-10-21 đã exercise 8/18 nhánh trên owned template. Dimensions navigation/main_workflow/persistence done trong scope đã chạy, branches_states/mutation/validation/relationships/errors_edge partial; Clone/V2/response persistence chưa verified.
- Logic chính:
  - `Blood Pressure` có `SYS`/`DIA`, combined hoặc `Separate Diastolic and Systolic entries`; editor không lộ ConceptID/DescriptionID nên không đủ proof mapping `[Observed]` (PAC2-4399). Shared Campaign cho child org truy cập form là rule `[Confirmed]` từ PAC2-6982, không re-test trong autonomous run.
  - Owned `Health Form Title` + một `Text Input`, `Save Form`, sharing0, `Continue`: list reload thấy `Active`/`Editable Yes`, reopen còn label/Required/record-question/score config. Title empty làm Save disabled, whitespace enabled nhưng không invalid submit `[Observed]` (run1626 ledger #3–5; OQ-056).
  - Rename draft qua breadcrumb discard giữ tên gốc; `Update Form`/`Continue` persist tên mới sau reload `[Observed]` (run1626 ledger #6).
  - Archive/filter/reload thấy `Archived`; trên Archived source `Cancel` giữ status, button `Archive` restore `Active`, re-Archive cleanup giữ `Archived`. Active owned0/retained1/draft0/dialog0; UI Archive không hard deletion `[Observed]` (run1626 ledger #7–10; OQ-053).
- Gaps/unexpected observations: Archived-source Clone blank hai lần, no Save, source Edit control có content (OQ-054); V2 chưa load rows sau fresh reload/wait20s, relationship `Inconclusive`, không observed edge (OQ-055). Còn 10/18 nhánh chưa có end state; không product verdict hoặc Complete/deep.
- Defect đã biết:
  - `PAC2-6982` Blocked: TC-001/002 chưa xác minh form child tạo không `Shared To`. Autonomous observations không tự thành defect verdict.
- Current-role reusable behavior: sharing `0`, saved Text Input config readback, rename discard/save và Archive persistence đã verified; Actions rỗng ở tab cũ nhưng fresh tab có controls, root cause Open. UI Archive giữ retained record, không hard delete `[Observed]` — `product-explore/auto-20261022-1206/ledger.md#6–13`.
- Chi tiết: `workflows/health-forms.md#super-admin-gb-unsaved-preview--2026-10-23`, `workflows/health-forms.md#super-admin-gb-saved-lifecycle--2026-10-22`, `workflows/health-forms.md#health-form-designer--component-blood-pressure`, `workflows/health-forms.md#autonomous-exploration-2026-10-21`

#### Health Forms Designer V2
- Current-role coverage: `Super Admin GB` read-only receiver probe, `Inconclusive`; query retained, loading indicator gone nhưng không data rows. Source legacy có exact Active record lúc probe; resource errors chưa chứng minh causality — `product-explore/auto-20261022-1206/ledger.md#12`, verified `2026-10-22`.
- Coverage lịch sử: Partial (read-only probe), `Blocked` loading; không persisted mutation
- Entry: `/paco/dashboard` → sidebar `Health Forms` → `Designer V2`
- Route: `/paco/health-forms/`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261021-1626/ledger.md#7`, `ui-observations.json#designer_v2`
- Last verified: `2026-10-21`
- Logic chính: heading `Health Form Templates`, list/search/filter landmark đã thấy. Fresh reload chờ20s chưa có rendered data rows; legacy control có owned source `Active` lúc probe. Document GET200/console errors2 không đủ backend diagnosis hoặc proof data absence.
- Gaps: Designer relationship `Inconclusive`, source hiện Archived nên receiver archived visibility cũng chưa biết (OQ-055). Không retry cùng loading blocker nếu context chưa đổi.
- Chi tiết: `workflows/health-forms.md#cross-feature-relationships`

### Module: Web Chat & Video

#### Virtual Appointments
- Current-role result: `Blocked`; verified `Super Admin GB` Paco header, module `Welcome Back`/`Log in` gate tại `/web-chat/`, không feature body. 0/1 bounded authenticated-root branch, OQ-068; source `product-explore/auto-20261022-1001/ledger.md#15`.
- Coverage lịch sử: Partial (4/8 bounded branches, read-only, role label `Blinx Deployment`; không cộng vào current-role coverage)
- Entry: `/paco/dashboard` → sidebar `Web Chat & Video` → submenu `Virtual Appointments`
- Route: `/web-chat/appointments/`
- Role context: exact `Blinx Deployment` label observed tại root (2026-10-22), active-role/header chưa independently established; `GP - paco assist` giữ provenance lịch sử 2026-09-14.; `Super Admin GB` (shell-only 2026-09-16, SSO redirect 2026-10-01)
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-0500/ledger.md#6–7`; lịch sử survey batch31
- Last verified: `2026-10-22`
- Aliases: `Virtual Appointments`, `Web Chat`, `Video Consultations`
- Note: Full body render không SSO trong pass này với role `Blinx Deployment`. Landmarks: `Date Range`, `Appt. Type` (Video Consultations/All Appointment Types), appointment grid. Lịch sử role `Super Admin GB` gặp SSO redirect; `GP - paco assist` từng render full module.
- Logic chính:
  - Date Range Yesterday Cancel giữ Today label; Yesterday Apply hiện 1 row rendered, không đọc/click; Today restore về 0 rows `[Observed]` (`ledger.md#7`).
  - Video Consultations và All Appointment Types chờ tới empty state (0 rows, Today, picker đóng, search blank) `[Observed]` (`ledger.md#7`).
  - Không có `Create`/`Book` visible trong pass này; appointment action fixture chưa có `[Observed]`.
  - Selected filter marker và data accuracy vẫn chưa verified `[Open Question]`.
- Gaps: Search/Columns/Filters interactions, appointment lifecycle, Create/Book flow chưa chạy. Không khẳng định entitlement cause, permission requirement hay dataset empty reason.
- Chi tiết: `workflows/web-chat-video.md#autonomous-breadth-2026-10-22`

#### Media Library
- Coverage: Partial (1/3 bounded branches, read-only)
- Entry: `/paco/dashboard` → sidebar `Web Chat & Video` → submenu `Media Library`
- Route: `/web-chat/media-library/`
- Role context: exact `Blinx Deployment` label observed tại root (2026-10-22), active-role/header chưa independently established; `GP - paco assist` giữ provenance lịch sử 2026-09-14.
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-0714/ledger.md#8`
- Last verified: `2026-10-22`
- Aliases: `Media Library`
- Note: Root render với `No Patient Selected` prompt. Controls: `PATIENT` Search, `MEDIA TYPE` (Audio/Chat Transcript/Message Log/Video). Không thấy Upload/Add New/Create trong bounded root check.
- Logic chính:
  - No Patient Selected hiện prompt `To view media files, please select a patient from the control panel on the left.` `[Observed]`.
  - PATIENT Search và MEDIA TYPE filter visible nhưng không submit/select; patient fixture chờ OQ-065, media fixture riêng chưa xác lập `[Observed]`.
  - Không Upload/Add New/Create visible trong pass này; không khẳng định tính năng unsupported `[Observed]`.
- Gaps: Patient selection lifecycle, media fixture ownership/cleanup, media-type filtering, Upload/Create workflow. 1/3 bounded branches performed (root/no-patient); patient→media và media-type results skipped chờ fixture.
- Chi tiết: `workflows/web-chat-video.md#media-library-autonomous-2026-10-22`

#### Outstanding Reviews
- Coverage: Partial (2/7 bounded branches, read-only)
- Entry: `/paco/dashboard` → sidebar `Web Chat & Video` → submenu `Outstanding Reviews`
- Route: `/web-chat/review/`
- Role context: exact `Blinx Deployment` label observed tại root (2026-10-22), active-role/header chưa independently established; `GP - paco assist` giữ provenance lịch sử 2026-09-14.
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-0714/ledger.md#8–9`
- Last verified: `2026-10-22`
- Aliases: `Outstanding Reviews`, `Consultations for Review`
- Note: Breadcrumb `Consultations`, heading `CONSULTATIONS FOR REVIEW`. Grid columns: Patient Name, Appt. Type, Clinician Name, Review Status, Appt. Time, Pt. Arrived, Wait Time, Call Ended, Call Duration, Action. Empty state `No Rows To Show`.
- Logic chính:
  - Date Range open/Cancel giữ `Today`, picker đóng, grid empty `[Observed]`.
  - Grid columns từ ledger; empty state 0 rows, không đọc existing clinical records `[Observed]`.
- Gaps: Date Range Apply, Search, Columns, Filters interactions, owned review action fixture/lifecycle. 2/7 bounded branches performed (root-empty, DateRangeCancel); 5 skipped chờ breadth gate và consultation fixture.
- Chi tiết: `workflows/web-chat-video.md#outstanding-reviews-autonomous-2026-10-22`

### Module: Patient

#### Patient Search
- Coverage: Partial
- Entry: `/paco/dashboard` → sidebar `Patients` → submenu `Patient Search`; direct route là historical fallback.
- Route: `/paco/patient-search` (dev feature-branch: `/paco/feature-branch/<ticket-branch>/patient-search`)
- Role observed: `Super Admin GB` (current autonomous header tại root); `Blinx Deployment` (pass trước, coverage riêng)
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1001/ledger.md#3–7`; pass trước `auto-20261022-0236/ledger.md#1–9`; lịch sử `PAC2-6763`, `PAC2-6540`
- Last verified: `2026-10-22`
- Aliases: `Patient Search`, `Search Patients`
- Tickets: `PAC2-6763`, `PAC2-6540`, `PAC2-8998`, `PAC2-8999`
- Note: có `Filters`, `Actions` column, `Create new patient`; không có `Advanced Search` hay deleted-patient filter ở state quan sát (`PAC2-6540`). Chỉ dùng row do tester duyệt là synthetic `Test Patient`; không ghi identifier. Top-bar dropdown có footer `Include deleted patients` checkbox `[Observed]` (PAC2-8998).
- Logic chính:
  - Global header search khác `Patients → Patient Search`; kết quả có `Quick Form`, `Care Navigator`, `Quick Send` `[Observed]` (PAC2-4399, PAC2-4700)
  - Connect branch: chọn patient chuyển sang profile baseline (mất branch context) `[Observed]` (PAC2-4700)
  - Top-bar patient search dropdown cap 50 results mỗi lần (max 100); label `Results (50)` `[Confirmed]` (PAC2-8998/REQ-006)
  - PDS panel hiển thị tối đa 50 rows qua AG Grid virtual scroll; heading `Patient Search (N)` = total match (không phải visible count) `[Confirmed]` (PAC2-8998/REQ-007)
  - Owned draft: valid Last Name + synthetic Date of Birth mở demographic steps không cần bấm `PDS Check`; tên chứa digits hiện client error `[Observed]` (`product-explore/auto-20261022-0236/ledger.md#5–6`)
  - Close rồi fresh reopen bỏ owned draft; saved Create/Edit/Archive chưa exercise vì safe registration fixture/cleanup chưa xác minh, OQ-065 `[Observed / Open Question]` (cùng ledger #6–9)
- Defect đã biết:
  - `PAC2-4399` Inconclusive: `Quick Form` lỗi thiếu patient number trên demo patient
  - `PAC2-8998` Pass: fix PR #7376 tokenise `,`/space + match từng token với first/middle/surname ở bất kỳ thứ tự nào; cap 50 dropdown + PDS panel
- Current role coverage: historical `Super Admin GB` 4/7 bounded branches `Partial (read-only)`; root/search và filter Cancel/reset, intent/count semantics OQ-067. Later independent offline entry 0/1 `Blocked` tại OS role picker, chưa feature body hoặc destination role verification; Connect header không chứng minh OS auth. Saved lifecycle vẫn chờ OQ-065, không cộng passes. `[Observed: dev, 2026-10-22]` — `product-explore/auto-20261022-2011/ledger.md#5`.
- Chi tiết: `workflows/patient-search.md#super-admin-gb-breadth--2026-10-22`; pass trước `#autonomous-breadth-2026-10-22`; lịch sử patient actions: `workflows/patient-profile.md#patient-search-và-patient-actions`

#### Care Navigator — Patient View (PAC2-7144)
- Current-role entry: Sidebar `Patients` > `Care Navigation` > `/patient-search/?careRoute`; actual `Super Admin GB` header và `Care Navigator`/`Search Patients...` verified. `[Observed: dev, 2026-10-22]` — `product-explore/auto-20261022-1414/ledger.md#2–3`.
- Current-role coverage: historical 4/7 và later A-Z result experiment 2/3 giữ riêng, `Partial (read-only)`; First Name+A và fresh Last Name+A có populated grid, field-switch completion Inconclusive do `Fetching results...`. Reload reset blank; không patient selection hoặc clinical handoff, OQ-065 giữ pending. Source `product-explore/auto-20261022-1742/ledger.md#4`; chi tiết `workflows/care-navigation.md`.
- Historical coverage: Minimal
- Entry: `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` → `Care Navigation` button → `patient-search/` → search patient → Care Navigator view
- Route: `/patient-search/` → Care Navigator patient view
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-7144` (replay.md, video evidence)
- Last verified: `2026-10-18T11:27Z`
- Aliases: `Care Navigation`, `care nav buttons`, `care navigator`
- Tickets: `PAC2-7144`
- Note: Care Nav buttons (Care Plan, Investigations, VTE, Resus, Handover) in patient view sidebar. Bug: greyed out pre-fix despite config active. Fix: buttons clickable post-fix. Dashboard `Care Navigation` button appears conditionally (session/org/role dependent).
- Logic chính:
  - Dashboard: `Patient Search` + `Care Navigation` buttons in `[ref=f8e413]` container; appear conditionally
  - Patient search: `/patient-search/` with `Search Patients...` + `A-Z Search`
  - Bug (pre-fix): patient loaded but left rail greyed out; patient header shows lightbulb/warning indicator
  - Fix (post-fix): left rail fully functional; Care Plan, Investigations, VTE, Resus, Handover all accessible
  - Category views: VTE Assessment, Discharge, Summary — forms render correctly
- Defect đã biết:
  - `PAC2-7144` Resolved: buttons greyed out despite config active; fix deployed 2026-10-07 on feature branch. QA passed on FB (Sean Huynh).
  - `PAC2-7144` Regression dev main: PARTIAL — Care Nav buttons intermittent (session/org-dependent); no test patient in current org scope.
- Chi tiết: `flows/pac2-7144-care-nav-buttons-inactive.md`

#### Patient Profile — Documents
- Coverage: Minimal
- Entry: `Patient Search` → row (safe `Test Patient`) `Actions` → `Profile` → tab `Documents`
- Route: `/paco/patient-profile/<redacted>/documents`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6763` (`feature-location.md`)
- Last verified: `2026-09-28`
- Aliases: `Documents`, `patient attachments`, `Upload`
- Tickets: `PAC2-6763`
- Note: dừng trước `Upload` (chọn file/upload là mutation). Feature-branch host riêng cho ticket.
- Logic chính:
  - Filter `All`/`Pending`/`Reviewed`, scope `All`/`Mine`, `Card view`/`List view`, counter `Showing 50/N` `[Observed]` (PAC2-6763)
  - Fix 403 liên quan permission `View patient documents` `[Confirmed]` (PAC2-7466)
  - Upload ở `Documents` và inbox `Upload & analyse` có thể là hai flow khác nhau `[Open Question]` (PAC2-6763)
- Defect đã biết:
  - `PAC2-7466` Blocked: performance/memory leak chưa ANALYZE
- Chi tiết: `workflows/patient-profile.md#documents-tab`

#### Patient Audit (modal from Patient Search)
- Coverage: Minimal
- Entry: `Patient Search` → row (safe `Test Patient`) `Actions` (`cell-renderers--actions`, `aria-controls="popup_menu_left"`) → menuitem `View Audit`
- Route: modal `Audit Trail` mở trên `/paco/feature-branch/<ticket-branch>/patient-search` (không đổi URL)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8999` (`feature-location.md`); modal-based audit của patient, không phải appointment-level audit
- Last verified: `2026-10-15T07:50:00Z` (PAC2-8999 manual test)
- Aliases: `Audit Trail`, `Patient Audit`, `View Audit`
- Tickets: `PAC2-8999`
- Note: dialog `Audit Trail` có search `Search by category, user, event, NHS number, details…`, filter `Filter audit by date` → `Date & Time`, AG Grid columns `Date/Time`/`Summary`/`Field`/`Previous Value`/`New Value`/`Details`. Booking entry observed: `Booked appointment` actor `Johnny (2255) Bravo` với 2 row `appointment-create` + `appointment-book-appointment-create` (PAC2-8999/manual-test.md, test patient `Floy adhoc` NHS 76835143, dev build `pac2-8999`, 2026-10-15 14:23). Cancel entry KHÔNG observed sau 3 attempts — xem defect. Cùng patient row còn có menuitem `Profile`/`View`/`Edit`/`Archive`/`Save for offline access`.
- Logic chính:
  - Audit view là modal, không có route riêng `[Observed]` (PAC2-8999/feature-location.md R-1)
  - Columns: `Date/Time` (timestamp), `Summary` (event description), `Field`/`Previous Value`/`New Value` (change-detail), `Details` (extra) `[Observed]` (PAC2-8999/feature-location.md R-1)
  - Booking entry: `Booked appointment` + summaryLabel category `Appointment Create` hoặc `Appointment Book Appointment Create` actor = JWT authenticated user `[Observed]` (PAC2-8999/manual-test.md Step 3)
  - Cancel entry: KHÔNG observed sau cancel attempt trong Calendar Day view Appointment Details sidebar — click menuitem `Cancel` là no-op `[Confirmed]` (PAC2-8999/manual-test.md Step 6+7+8)
- Defect đã biết:
  - `PAC2-8999` REQ-001 Fail: Cancel menuitem trong Calendar Day view Appointment Details sidebar không trigger confirm dialog / API call / state mutation / audit row. Reproducible ×3 attempts, 4 indicator (dialog/network/sidebar state/calendar slot) đều no-op (PAC2-8999/manual-test.md).
- Chi tiết: `workflows/patient-profile.md#patient-audit-modal`

#### Document Inbox — Upload dialog
- Coverage: Minimal
- Entry: `/paco/inbox` → `Document Inbox` → sidebar `Upload a document` → dialog `Upload document to inbox`
- Route: `/paco/inbox`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6763` (`feature-location.md`)
- Last verified: `2026-09-28`
- Aliases: `Document Inbox`, `Upload & analyse`
- Tickets: `PAC2-6763`
- Note: dừng trước `Choose a document` / `Upload & analyse`.
- Logic chính:
  - Lifecycle `Analysing` → `Needs review` → `Ready to file` → `Filed & rejected` `[Observed]` (PAC2-6763)
  - `Upload & analyse` disabled đến khi chọn file; `Source type`/`Source name` tùy chọn `[Observed]` (PAC2-6763)
  - Inbox liên kết `S3` và `MESH` mailbox `[Confirmed]` (PAC2-6763)
- Defect đã biết:
  - `PAC2-6763` Not Run: TC-001 upload (file chooser mở lặp)
- Chi tiết: `workflows/paco-assist.md#document-inbox`

#### Quick Send (patient actions menu)
- Coverage: Partial
- Entry: dashboard → global patient search (không click row) → result `Patient actions menu` → `Quick Send`
- Route: dialog `Quick Send` trên dashboard (`/paco/dashboard`); OS branch đã kiểm tra: `/paco/feature-branch/pac2-7579/dashboard`; Connect feature-branch: `/paco-connect/feature-branch/<ticket-branch>/dashboard/`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8522`, `PAC2-4700`, `PAC2-7579` (`feature-location.md`; PAC2-7579 chỉ verified entry/form, chưa full campaign-base flow)
- Last verified: `2026-10-21`
- Aliases: `QS`, `Quick Send`, `Rocketbar` (chưa locate), `patient actions`
- Tickets: `PAC2-8522`, `PAC2-4700`, `PAC2-7579`
- Note: dialog có tab `Campaign`, `Health Forms`, `Files`, `Booking Link`; composer hiển thị campaign header và `Campaign tags:`. Dừng trước `Save`/send/schedule/`Edit`/thêm campaign vào draft. Click patient row mở patient profile, không phải entry này. Sidebar icon `Quick Send` thực chất là launcher `Comms Hub`. Placeholder search khác nhau theo host: baseline/OS `Search patients by name or NHS number`, Connect `Search...`.
- Logic chính:
  - Composer mở từ `Patient actions` menu; sidebar icon `Quick Send` chỉ là launcher `Comms Hub` `[Observed]` (PAC2-8522, PAC2-4700)
  - `Send as` bị disable khi patient thiếu contact tương ứng `[Observed]` (PAC2-4700, PAC2-4399)
  - Popup `Scheduler Link Required` không ổn định/bị che sau hộp `Quick Send` `[Confirmed]` (PAC2-5776)
  - Tạo campaign mới bằng `PACO Assist` từ Quick Send có Comms Hub tag không được tự kế thừa Comms Hub tag nguồn `[Confirmed]` (PAC2-7579/requirements.md; expected từ ticket Description, chưa có kết quả live)
- PAC2-7579 checkpoint mới nhất: tagged SMS source mới persisted ở NHS, chọn được trong branch picker; `Generate Templates` trả UI `HTTP error! status: 403` ở hai cấu hình options và fresh admin login. UI-triggered POST tới `/paco/feature-branch/pac2-7579/undefined/v1/chat/completions` trả `403` `[Observed]`; AI base URL thiếu/sai cấu hình là `[Inferred]`, chưa biết exact config/root cause reject. Không B/Save/Send; tag inheritance `Blocked`, không `Fail`. Source mới cleanup tới deleted/restore state, source cũ retained. `[Observed: 2026-10-21]` — `PAC2-7579/test-data-ledger.md#source2-paco-handoff-và-assist--2026-10-21`; chi tiết `workflows/comms-hub.md#paco-assist--không-kế-thừa-comms-hub-tag-pac2-7579`.
- Defect đã biết:
  - `PAC2-5776` Inconclusive: popup intermittent, không tái hiện được
  - `PAC2-4700` Inconclusive: `Escape` đóng cả dialog (OS), default channel, sort, attachments; Blocked: TC-006, TC-013
- Chi tiết: `workflows/comms-hub.md#quick-send-dialog`; `workflows/comms-hub.md#popup-scheduler-link-required`; `workflows/comms-hub.md#paco-assist--không-kế-thừa-comms-hub-tag-pac2-7579`

### Module: Analytics & Reports

#### Analytics and Reports (root)
- Current-role coverage: `Super Admin GB` 2/6 bounded read-only branches; root/Patient Cases permission end states verified, report-data workflow `Blocked` theo OQ-069. Source `product-explore/auto-20261022-1206/ledger.md#15`, verified `2026-10-22`.
- Current-role entry/route: authenticated session → known SCR route → `/paco/analytics-reports`; actual header verified, SCR not-authorized message. `Patient Cases` → `/paco/analytics-reports/patient-cases` giữ `Access Denied` sau reload; Analytics click chưa changed known state.
- Current-role gaps: report body/search/filter/export/saved lifecycle chưa chạy; không patient/report data inspected hoặc two-sided edge. Chi tiết: `workflows/analytics-reports.md#super-admin-gb-reports-access--2026-10-22`.
- Coverage lịch sử: Minimal
- Entry: `/paco/dashboard` → sidebar `Analytics & Reports` → submenu `Reports`
- Route: `/paco/analytics-reports`
- Role observed: `GP Paco Assist`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6540` (`feature-location.md`)
- Last verified: `2026-09-13`
- Aliases: `Analytics Reports`, `Reports`, `Analytics & Reports`
- Tickets: `PAC2-6540`
- Note: chỉ root; role này thấy cảnh báo không được xem `Summary Care Record (SCR) report`. Chưa xác minh `Advanced Search`/deleted-patient filter.
- Logic chính:
  - `Advanced Search` không ở root, phải qua `Patient Details` `[Observed]` (PAC2-6540)
  - `Advanced Search` nhất quán giữa `Deleted Patients Included`/`Excluded` `[Confirmed]` (PAC2-6540)
- Defect đã biết:
  - `PAC2-6540` Inconclusive: TC-002 rerun trên dataset mutable (TC-001 Pass)
- Chi tiết: `workflows/analytics-reports.md#deleted-patients-trong-advanced-search`

#### Reports — autonomous context boundary (2026-10-22)
- Coverage: root boundary only; intended-role workflow `Blocked`
- Entry: sidebar `Analytics & Reports` → `Reports`
- Route: `/paco/analytics-reports/scr-reports`
- Role context: `Config Admin` visible tại Reports và Dashboard header; intended `Blinx Deployment` không có ở final header check nhưng có ngoài header.
- Environment: `dev`
- Classification: `Observed / Open Question`
- Source: `product-explore/auto-20261022-0714/ledger.md#11–12`; OQ-063
- Last observed: `2026-10-22`
- Logic chính: `Reporting`, `SCR (0 records)`, report tree và `Search consent...`/`Export`/`Columns`/`Filters` visible; không thao tác data/export hoặc suy quyền `Blinx Deployment`.
- Gaps: exact intended role/context phải verified trước navigation tiếp; cause và thời điểm context khác chưa biết.
- Chi tiết: `workflows/analytics-reports.md#autonomous-reports-boundary--2026-10-22`

#### Patient & Medication Analyser
- Coverage: Partial (read-only), current-role 5/11 bounded branches; query apply/reopen, reload retention và owned-rule cleanup verified, chưa saved report lifecycle.
- Entry: authenticated session → direct known route `/patient-analyser/`; actual header verified. Historical menu route `/patient-analyser-new/` chưa reverified trong pass này.
- Route: `/patient-analyser/`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `product-explore/auto-20261022-1414/ledger.md#7–8`; lịch sử `PAC2-3798` (`feature-location.md`)
- Last verified: `2026-10-22`
- Aliases: `Patient Analyser`, `Medication Analyser`, `supergrid`, `Advanced Search`
- Tickets: `PAC2-3798`
- Current behavior: `Advanced Patient Search` có `Query builder`, Full Name field/operator/value, `Reference Report(s)`, `Search`/`Cancel`; synthetic contains query đổi badge 0 thành 1 và retained qua reload/reopen. Xóa đúng owned rule rồi Search khôi phục badge 0 qua reload, không business record.
- Gaps: grid 0 rendered rows nhưng pager blank, cohort correctness `Inconclusive`; `Save Report` target/cleanup chưa established. Historical tabs/Columns/Filters và menu-route conflict giữ riêng, chưa reverified.
- Logic chính:
  - Tạo/clear `advanced search` không refresh; `Patient count` tải độc lập với grid `[Confirmed]` (PAC2-3798)
  - `Pivot mode` + helper; URL `/patient-analyser/#<report-id>` tải lại đúng report `[Confirmed]` (PAC2-3798)
  - Search cũ deprecated được dựng lại thành rule lồng nhau khi load `[Confirmed]` (PAC2-3798)
- Defect đã biết:
  - `PAC2-3798` Inconclusive: sidebar trỏ `/patient-analyser-new/` 404; AG Grid license `Invalid License`
- Chi tiết: `workflows/analytics-reports.md#super-admin-gb-patient-analyser--2026-10-22`; logic ticket tại `#patient--medication-analyser-supergrid`.

### Module: Patient-facing Scheduler (external host `*.blinxscheduler-np.com`)

#### Patient Self Booking
- Coverage: Minimal
- Entry: truy cập trực tiếp route (không cần login PACO) → `Search Services...` → chọn service → màn `Patient Details`
- Route: `/patient-self-booking/` (feature-branch: `/feature-branch/<ticket-branch>/patient-self-booking/`)
- Role observed: không đăng nhập (patient-facing); cross-check bằng `Super Admin GB` ở Paco
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8552`, `PAC2-1805` (`feature-location.md`)
- Last verified: `2026-09-25`
- Aliases: `Digital Front Door`, `Patient Appointment Booker`, `scheduler link`
- Tickets: `PAC2-8552`, `PAC2-1805`
- Note: dừng trước nhập thông tin xác minh bệnh nhân, `Send Secure Link`, `I understand`, chọn slot, `Book`. Route có token per-patient không có token trả `Link Error`.
- Logic chính:
  - Link tokenized, không cần login PACO; thiếu token → `Link Error` `[Observed]` (PAC2-1805)
  - Một link chỉ giữ một booking; refresh/back không mở lại `Book` `[Confirmed]` (PAC2-1805)
  - Service không slot hiện `No availability` + warning modal `[Observed]` (PAC2-8552)
- Defect đã biết:
  - `PAC2-1805` Blocked: không có token link thật; `PAC2-8552` Blocked: thiếu link/patient synthetic
- Chi tiết: `workflows/patient-facing-scheduler.md#chống-double-book-qua-cùng-scheduler-link-pac2-1805`; `workflows/patient-facing-scheduler.md#patient-self-booking-ui`

### Module: Feature có logic từ ticket nhưng chưa có route verified

Harvest 2026-10-02 từ 17 ticket. Mọi entry `Classification: Observed/Confirmed/Inferred` theo từng bullet `Logic chính`; `Route: chưa verified`, không dùng làm automation gate. `Last verified: -`.

#### Health Form Inbox
- Coverage: Minimal
- Entry: `/paco/dashboard` → sidebar `Health Forms` → `Inbox` (v2.0) HOẶC `/health-forms/inbox-2.0`
- Route: `/health-forms/inbox-2.0` (v2.0, bucket `Not Saved`), `/health-forms/responses/` (classic với filter `Not Synced to PR`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-4399`, `PAC2-5776`, `PAC2-4837` (`feature-location.md`, `exploration.md`)
- Last verified: `2026-10-06`
- Tickets: `PAC2-4399`, `PAC2-5776`, `PAC2-4837`
- Note: v2.0 `Not Saved` bucket chứa form chưa lưu vào patient record. Classic Inbox `/health-forms/responses/` có filter `Not Synced to PR`. Patient Record Status field không hiển thị trong form detail dialog. Resync action không tìm thấy trong form detail `More Actions` menu.
- Logic chính:
  - `View Form` read-only; response đang được người khác review bị lock, có `Click Here to Take Over` `[Observed]` (PAC2-4399)
  - Summary phân biệt `Reviewed (synced)`/`Reviewed (not synced)` `[Observed]` (PAC2-4399)
  - `Quick Send` là follow-up action từ Inbox `[Confirmed]` (PAC2-5776)
  - v2.0 form detail: Patient Record Status field không visible; `Finish` lưu và đóng; `More Actions` menu không chứa resync `[Observed]` (PAC2-4837)
- Defect đã biết:
  - `PAC2-4399` Inconclusive: modal kẹt loading (3/6 response); trùng accessible label; Blocked: filing EMIS HTTP 403
  - `PAC2-4837` Blocked: resync action không tìm thấy; Patient Record Status blank gây failure to resync health form
- Chi tiết: `workflows/health-forms.md#health-form-inbox`

#### Session delete / archive (`Cancel Session`, `Block Session`, `Restore`)
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-7786 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-7786`
- Note: Chung route với `Appointment Settings — Sessions configuration`; nêu riêng vì logic phong phú.
- Logic chính:
  - `Block Session`: mọi bookable slot thành non-bookable, không hủy appointment `[Observed]` (PAC2-7786)
  - `Delete Session` phải còn khả dụng; coexist hay thay bằng `Block Session` chưa quyết `[Confirmed, Disputed]` (PAC2-7786)
  - Archive template bị chặn bởi `Session Can't Be Archived`; owned session xóa qua permanent delete `[Observed]` (PAC2-8384)
- Defect đã biết:
  - `PAC2-7786` Fail: TC-001, 003, 004; Blocked TC-002; Inconclusive TC-005
- Chi tiết: `workflows/appointment-book.md#session-delete--archive`

#### Booking / Cancel appointment (backend, partitioned tables)
- Coverage: Minimal
- Entry: `/paco-connect/appointment-book` → toolbar `Quick Book` (booking); filter `Show Cancelled Bookings` (cancel listing)
- Route: `/paco-connect/appointment-book`; cancel route: `/configuration/#appointments`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: PAC2-8552 (`exploration.md`)
- Last verified: `2026-09-25`
- Aliases: `Quick Book`, `Cancel booking`, `Show Cancelled Bookings`, `booking`, `cancel`
- Tickets: `PAC2-8552`
- Note: Backend fix (partitioned tables, org UUID); UI entry đã observe `Quick Book` button và cancelled-booking filter. Appointment book selector, patient/time search, `Group Send`, `Export` cũng visible.
- Logic chính:
  - Thêm `bx_organisation_uuid` vào query/write của `appointment`/`appointment_slot` khi org xác định an toàn `[Confirmed]` (PAC2-8552)
  - Cancel multi-slot phải release mọi slot; không success im lặng khi zero rows `[Confirmed]` (PAC2-8552)
  - Semantics `bx_organisation_uuid` khác nhau giữa `nhs-scheduler-be` và `paco-connect-be` `[Confirmed]` (PAC2-8552)
- Defect đã biết:
  - `PAC2-8552` Blocked: 9/9 case
- Chi tiết: `workflows/appointment-book.md#hiệu-năng-bookingcancel-partitioned-table`

#### Shared Campaign — quyền view/edit
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-7201, PAC2-6982 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-7201`, `PAC2-6982`
- Note: Nằm trong `Campaign Manager` (tab `Shared Campaigns`).
- Logic chính:
  - Share cũng chia sẻ assets (Templates, Health Forms); org được share chỉ `view` `[Observed]` (PAC2-7201)
  - Shared Campaign cho phép truy cập form từ child org `[Confirmed]` (PAC2-6982)
  - Quyền edit có thể gắn với hướng share cụ thể; root cause chưa biết `[Inferred]` (PAC2-7201)
- Defect đã biết:
  - `PAC2-7201` Fail dự kiến (dev cho org được share `Edit`/`Delete`); `PAC2-6982` Blocked
- Chi tiết: `workflows/comms-hub.md#shared-campaign-và-quyền-viewedit`; `workflows/health-forms.md#health-form-designer--component-blood-pressure`

#### Quick Send — Campaign tags
- Coverage: Minimal
- Entry: dashboard → global patient search → result row `Patient actions menu` → `Quick Send` (với query `qs_campaign_tags=true`)
- Route: `/paco-connect/feature-branch/<ticket-branch>/dashboard/` + `?qs_campaign_tags=true`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: PAC2-8522 (`feature-location.md`, `MANUAL_EXECUTE`)
- Last verified: `2026-09-28`
- Aliases: `Campaign tags`, `Edit campaign tags`, `tag editor`
- Tickets: `PAC2-8522`
- Note: Bật bằng query `qs_campaign_tags=true` trên feature branch; composer hiển thị campaign header và `Campaign tags:`. Landmark: existing-tag editor controls khi editing permitted.
- Logic chính:
  - Campaign hiển thị tag; overflow `+N`, hover xem phần còn lại `[Confirmed]` (PAC2-8522)
  - Tag gắn nhưng vắng `getAllTags` vẫn hiển thị và không bị xóa im lặng `[Confirmed]` (PAC2-8522)
  - Chỉ người có quyền update campaign sửa tag `[Confirmed]` (PAC2-8522)
- Defect đã biết:
  - `PAC2-8522` Blocked: TC-002, 005, 006; Not Run TC-007 (không Fail)
- Chi tiết: `workflows/comms-hub.md#campaign-tags-trong-quick-send`

#### Comms Analytics
- Coverage: Minimal
- Entry: PACO → sidebar `Analytics & Reports` → `Comms Analytics` (redirect sang Comms Hub login riêng)
- Route: `/paco/dashboard` → sidebar `Analytics & Reports` → `Comms Analytics`; Comms Hub external `nhs-comms-hub-dev.blinxhealthcare.com` → `Analytics`
- Role observed: `Super Admin GB`
- Environment: `dev` (PACO → Comms Hub external)
- Classification: `Observed`
- Source: PAC2-3798 (`exploration.md`)
- Last verified: `2026-09-21`
- Aliases: `Comms Analytics`, `Campaign Analytics`, `Export to CSV`
- Tickets: `PAC2-3798`
- Note: PACO session redirect sang Comms Hub login riêng; sau login hiển thị campaign grid. `Export to CSV` trả HTTP 200 JSON, không observable download.
- Logic chính:
  - Site riêng, ngoài scope ticket `[Confirmed]` (PAC2-3798)
  - `Export to CSV` trả HTTP 200 JSON, không download trực tiếp `[Observed]` (PAC2-3798)
- Defect đã biết:
  - `PAC2-3798` Inconclusive: schema CSV chưa có contract
- Chi tiết: `workflows/comms-hub.md#comms-analytics`

#### Advanced Search — Deleted Patients Included/Excluded
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-6540 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-6540`
- Note: Qua `Analytics & Reports` → `Reports` → `Patient Details` → `Advanced Search`; chưa promote riêng.
- Logic chính:
  - Kết quả nhất quán giữa `Deleted Patients Included` và `Excluded` `[Confirmed]` (PAC2-6540)
  - Saved Reference Report và direct Advanced Search từng trả patient set khác nhau `[Inferred]` (PAC2-6540)
  - So sánh patient set, không chỉ count; count phụ thuộc dataset `[Observed]` (PAC2-6540)
- Defect đã biết:
  - `PAC2-6540` Pass TC-001; Inconclusive TC-002
- Chi tiết: `workflows/analytics-reports.md#deleted-patients-trong-advanced-search`

#### SSO login / `User Management`
- Coverage: Unknown
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-191 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-191`
- Note: Chưa locate; host feature chưa trong allowlist.
- Logic chính:
  - SSO identity chưa có organisation assignment không được tự tạo PACO user `[Inferred]` (PAC2-191)
  - User bị từ chối thấy lỗi rõ ràng và có đường về `login`; user hợp lệ vẫn login `[Inferred]` (PAC2-191)
- Defect đã biết:
  - `PAC2-191` Blocked: LOCATE pending, chưa có Pass/Fail
- Chi tiết: `workflows/admin-sso.md#sso-không-tự-tạo-user-khi-thiếu-organisation-assignment-pac2-191`

#### Document Intelligence (PACO Assist)
- Coverage: Minimal
- Entry: `/paco/inbox` → board `Upload a document` button; alternative: `/paco/patient-profile/<id>/documents` → inline upload area
- Route: `/paco/inbox` (organisation-level inbox); `/paco/patient-profile/<id>/documents` (patient-level)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: PAC2-6763 (`exploration.md`)
- Last verified: `2026-09-28`
- Aliases: `PACO Assist`, `Document Inbox`, `Upload & analyse`, `Upload a document`
- Tickets: `PAC2-6763`
- Note: Scope gốc rộng; chỉ quan sát upload entry (document analysis pending PAC2-7193). Two upload flows: organisation-level inbox và patient-level documents. Dialog có `Upload & analyse` button disabled đến khi chọn file.
- Logic chính:
  - Tự xử lý inbound document với HP oversight; nhận diện source, patient khớp, addressee, summary, action `[Confirmed]` (PAC2-6763)
  - Mỗi `SNOMED CT` code gợi ý phải accept/decline trước khi áp dụng `[Confirmed]` (PAC2-6763)
  - `Admin entry` gate bởi PAC2-7193 (trạng thái chưa rõ) `[Confirmed]` (PAC2-6763)
- Defect đã biết:
  - `PAC2-6763` Not Run: TC-001 upload
- Chi tiết: `workflows/paco-assist.md#document-inbox`

#### Scheduler link — Book / Reschedule (race, rollback)
- Coverage: Minimal
- Entry: PACO → Comms Hub → Campaign Manager → Quick Send campaign → Outbox (lấy scheduler link); patient-facing: `https://dev.blinxscheduler-np.com/feature-branch/<ticket-branch>/` (cần token per patient)
- Route: PACO `/paco/dashboard` → sidebar `Quick Send` → Campaign Manager; Comms Hub external host `nhs-comms-hub-dev.blinxhealthcare.com`; Patient scheduler `dev.blinxscheduler-np.com`
- Role observed: `Super Admin GB`
- Environment: `dev` (PACO + Comms Hub); feature branch `pac2-1805` (scheduler)
- Classification: `Observed`
- Source: PAC2-1805 (`feature-location.md`)
- Last verified: `2026-09-16`
- Aliases: `scheduler link`, `booking link`, `patient scheduler`, `Quick Send`
- Tickets: `PAC2-1805`
- Note: Patient-facing scheduler route cần token per patient (lấy từ Comms Hub Outbox `Resend`). `Resend` button trên Outbox hiện lỗi HTTP 400 (defect riêng của Comms Hub, không thuộc PAC2-1805 scope). Route mặc định không có token → "Link Error".
- Logic chính:
  - Ghi `appointment.appointment` (`Pending` → `Booked`) trước khi gọi EPR `[Confirmed]` (PAC2-1805)
  - `Reschedule`: slot cũ chỉ hủy sau khi slot mới relay thành công; thất bại thì khôi phục `[Confirmed]` (PAC2-1805)
  - Rollback chỉ hủy slot của chính attempt, không hủy appointment ngoài link `[Confirmed]` (PAC2-1805)
- Defect đã biết:
  - `PAC2-1805` Blocked: LOCATE không có token; chưa có Pass/Fail
- Chi tiết: `workflows/patient-facing-scheduler.md#chống-double-book-qua-cùng-scheduler-link-pac2-1805`

#### UI component library refactor (`Bx*` components)
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-4700 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-4700`
- Note: Cross-cutting (Connect, GP Supergrid, PC24/OS, Rocketbar); không có route riêng.
- Logic chính:
  - Không đổi UX/visual/layout; so với baseline, chỉ ghi major breakage `[Confirmed]` (PAC2-4700)
  - Control trong scope: `input`, `textarea`, `dropdown`, `multiselect`, `checkbox`, `radio`, `avatar` `[Confirmed]` (PAC2-4700)
- Defect đã biết:
  - `PAC2-4700` không Fail: 5 Pass / 2 Blocked / 5 Inconclusive
- Chi tiết: `workflows/comms-hub.md#ui-component-library-refactor-pac2-4700`

### Conflicts / ghi chú đối chiếu

- `Campaign Manager`: `PAC2-1805`/`PAC2-6540` ghi redirect login rồi cần login thủ công; `PAC2-6982` (mới nhất) xác nhận host external nằm trong `paco.config.yaml`. Giữ `PAC2-6982`.
- `Patient Analyser`: survey/menu trỏ `/patient-analyser-new/` nhưng `PAC2-3798` quan sát 404 trên demo host; giữ `/patient-analyser/` (mới hơn, ticket-provided). Cần re-verify trên host chính.
- `Appointment Settings`: `PAC2-7786` loại `/paco-connect/configuration` trên shared host vì không chứng minh build feature-branch; `PAC2-8241` xác nhận route đó là DEV main. Hai kết luận không mâu thuẫn (khác mục đích); dùng route feature-branch khi test ticket branch.
- `Scheduler Configuration` (entry đã có bên dưới, `PAC2-7669`): `/configuration/` cũng là gốc của `/configuration/#appointments`, `#clinics`, `#code-rules-config`; `PAC2-8552` ghi `/configuration/#scheduler-config` là cấu hình campaign/template/slot type, chưa verify độc lập.
- `Quick Send`: `PAC2-1805` mô tả sidebar icon `Quick Send` dẫn tới `Comms Hub`; `PAC2-4700`/`PAC2-8522` xác nhận đó là launcher, không phải composer. Composer dùng patient actions menu.
- `PACO Connect` dev chung: `PAC2-7579/feature-location.md` quan sát `/paco-connect/dashboard` render dashboard sau auth ngày 2026-10-21 dù document HTTP `404`; không tổng quát hóa nhận định route thiếu từ survey cũ. `/paco-connect/campaigns/create` vẫn hiện UI `404` sau SPA load trong context đã kiểm tra; không suy ra cần branch.
- Role: `PAC2-6982` ghi role `Admin` do QA xác nhận, chưa verify trên UI.

### Module: User Portal

#### User Guides / FAQs
- Entry: Sidebar `Users` > `User Portal`.
- Route: `/paco-connect/user-training-portal`
- Role/environment/date: `Super Admin GB`, `dev`, `2026-10-23`.
- Classification: `Observed`; sources `product-explore/auto-20261022-1414/ledger.md#4–5`, `product-explore/auto-20261023-0000/ledger.md#5`.
- Coverage: `Partial (read-only)`, historical 6/10 và independent viewer/FAQ 6/8 giữ riêng; category View All/back, outer guide boundary, video/playback/pop-out, FAQ search/category reset verified.
- Logic chính: Users mở help/training; guide iframe refused-to-connect OQ-074. Video Maximise mở loaded/paused about:blank tab và pause source; FAQ known match/clear/category/reload trả baseline. Help prose không là permission spec, document HTTP404 vẫn render app.
- Chi tiết: `workflows/user-training-portal.md`; embedded guide content Blocked, Technical Support scope chưa kiểm; own UI/media/tab cleanup Done.

### Route hints (chưa verified)

Chưa đủ điều kiện làm entry chuẩn; không dùng làm automation gate.

- `Template Manager`, `Patient Manager` (submenu `Comms Hub`): chỉ thấy button submenu, chưa mở root (`PAC2-1805`, `PAC2-6982`, `PAC2-6540`).
- Shared campaign → patient scheduler link (PCN/child org): route patient chưa verified, cần campaign/link thật (`PAC2-6982`, `PAC2-7201`). Context org hierarchy đã được QA xác nhận nhưng không ghi tên org ở đây.
- `Rocketbar` (PACO OS sidebar): historical PAC2-4700 chưa locate; current `Super Admin GB` sidebar entry đã verified ngày 2026-10-22, mở menu `Launch Rocket Bar`/`Download Rocket Bar`, không đổi source route. 1/3 bounded launcher branches, client main flow `Blocked` OQ-070; chưa launch/download/install. `[Observed: dev]` — `product-explore/auto-20261022-1414/ledger.md#6`; chi tiết `workflows/rocket-bar.md`.
- GP Supergrid login `/login/` trên host feature-branch GP: `Blocked` (auth/host ngoài `allowedHosts`) (`PAC2-4700`).
- `Quick Book` trong `Appointment Book`: trigger booking, chưa mở vì có thể tạo draft/mutation (`PAC2-8552`).
- Appointment drawer đa slot (`Slot Count`): mở bằng click block appointment đã có trong session grid; chỉ từ execution observation (`PAC2-8552`).
- `Capacity & Demand` `/capacity-demand/`: actual `Super Admin GB` header verified; historical date pass 4/9 và independent role/card pass 2/5 giữ riêng. Date Apply/reload và `All Time` restore observed; later Doctor grey→non-grey/reload retention và info hover/dismiss observed, exact original marker chưa capture. Session/observation controls computed hidden (`Blocked`), natural chart tooltip `Inconclusive`; metric correctness chưa kiểm. `[Observed: dev, 2026-10-22]` — `product-explore/auto-20261022-1206/ledger.md#17–18`, `auto-20261022-2011/ledger.md#6–7`; chi tiết: `workflows/capacity-demand.md`.
- Patient filing flow cho blood-pressure (qua `Patient Search` → patient context): chưa xác nhận exact entry (`PAC2-4399`).
- Cancel Session confirmation dialog (Configuration `Sessions`): label chưa quan sát (`PAC2-8552`).
- `Patient Analyser` tab và `Advanced Search` dialog trong `/patient-analyser/`: visible, chưa mở (`PAC2-3798`).
- `/paco-connect/dashboard` (mainline): survey ghi 404, không reusable; feature-branch `/dashboard` hoạt động (`PAC2-4700`, `PAC2-7786`).
- `PACO Assist` qua `More options`: rejected cho scope upload của `PAC2-6763`.
- `PACO Assist` campaign-base flow (`PAC2-7579`): tester cung cấp `/paco/feature-branch/pac2-7579`, UI tới branch dashboard; global patient search → `Patient actions menu` → `Quick Send` → `PACO Assist` → `Write my templates` mở `Create Campaign with PACO Assist` dưới `Super Admin GB` / `Haringey Demo Org` (2026-10-21). Entry form và chọn tagged source mới verified trên `SMS`; full A → Assist → B chưa verified vì `Generate Templates` trả UI `403` ở hai cấu hình options, không dùng làm automation gate. Source mới cleanup tới deleted/restore state; source cũ unavailable vẫn là lịch sử riêng. License tooltip và campaign list HTTP `404` phía trên chỉ là quan sát mainline, chưa chứng minh blocker tương ứng trên branch. `[Observed]` — `PAC2-7579/feature-location.md`.
- `Consultation screen` (cross-org filing entry point): 2026-10-18 dev chung survey: `/paco-connect/dashboard` 404, `/paco/health-forms/inbox` 404; consultation template tồn tại nhưng thiếu entry point. 2026-10-18 retry: host `pac2-3934.dev.blinxpaco-np.com` được add vào `paco.config.yaml` `allowedHosts`; root URL redirect `https://pac2-3934.dev.blinxpaco-np.com/login/` (page title "NHS Patient and Care Optimiser" — GP Supergrid, không phải PACO Connect mainline). Cần user login manual để verify consultation screen + cross-org filing entry (`PAC2-3934/feature-location.md`).

### Entries đã có (giữ nguyên)

### Navigation
- Coverage: Unknown
- Requirements: N/A
- Tickets: None
- Updated: -
- Logic chính:
  - Chưa có logic từ ticket.
- Defect đã biết:
  - Không có.
- Chi tiết: chưa có

### Dashboard
- Coverage: Unknown
- Requirements: N/A
- Tickets: None
- Updated: -
- Logic chính:
  - Chưa có logic từ ticket; dashboard feature-branch là entry cho Connect/OS (xem route hints) `[Observed]` (PAC2-4700, PAC2-7786)
- Defect đã biết:
  - Không có.
- Chi tiết: chưa có

### Scheduler Configuration
- Coverage: Partial
- Entry: Direct route to `Scheduler Configuration`
- Route: `/configuration/`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-7669`
- Last verified: `2026-10-01`
- Aliases: `Scheduler Config`
- Tickets: `PAC2-7669`
- Logic chính:
  - Chọn clinician (source `EMIS`/`PACO Connect`) không được freeze/trễ 5–10 giây, không có SLA tuyệt đối `[Confirmed]` (PAC2-7669)
  - Draft clinician chỉ nằm trong dialog; `Cancel` không đổi persisted state `[Observed]` (PAC2-7669)
  - Click-to-chip ~110–150 ms sau fix `[Observed]` (PAC2-7669)
- Defect đã biết:
  - `PAC2-7669` không có defect (Pass 5/5; automation CLI Blocked do login)
- Chi tiết: `workflows/configuration.md#scheduler-configuration--chọn-clinician`

### Patient DFD Config
- Coverage: Confirmed entry
- Entry: PACO sidebar `Configuration` → submenu `Patient` → `DFD`
- Route: `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config`
- Role observed: `clinic` (Johnny Bravo - Blinx Deployment, General Practice Demo Site)
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-7727/feature-location.md`
- Last verified: `2026-10-16T13:08Z`
- Aliases: `DFD`, `Digital Front Door`, `DFD Config`, `Patient DFD`, `scheduler link generator`
- Tickets: `PAC2-7727`
- Logic chính:
  - Page list các campaign DFD đã tạo (vd: `MAR GB Copy Test`, `Alex & Mike Campaign Test`, `PACO DEMO DFD`) dưới dạng org-chart. Mỗi campaign có button `+` (class `org-chart__add`) mở menu 2 options: `Campaign` (thêm sub-campaign) hoặc `Button` (thêm button action) `[Observed]` (PAC2-7727/exploration.md O-1)
  - **Entry "Copy DFD link" ở page-level 3-dot ellipsis menu** (`<svg data-icon="ellipsis">` tại `absolute right-[25px] top-[17px]` của page container DFD Config) — KHÔNG phải ở level node card. Click ellipsis → `p-overlaypanel` mở với 2 items: `Copy DFD link`, `Copy to Care Navigator`. Click `Copy DFD link` → copy URL `https://dev.blinxscheduler-np.com/patient-self-booking/#<jwt>` vào clipboard `[Observed]` (PAC2-7727/exploration.md O-5)
  - JWT payload decode: `{ "otId": "{<organization-uuid>}" }` → **organization-level link** (PACO Connect entry, không có patient pre-fill). Khác với video Fiona (link có patient context trong JWT). Cần patient-level link từ Comms Hub Outbox `Resend` hoặc Patient Self-Booking send để vào flow `Request an appointment` với patient pre-fill `[Inferred]` (PAC2-7727/exploration.md O-5)
  - Booking link org-level mở OK trong incognito → scheduler `Welcome` page → click `Get started!` → list services. KHÔNG gặp `Link Error` nếu JWT hợp lệ `[Observed]` (PAC2-7727/manual-execution.md TC-002)
  - Lỗi `Link Error / "No token found"` xuất hiện intermittent ở transition scheduler → web form (video Fiona 2026-08-19); flow vẫn recovery trong ~30s. Chưa reproduce được trên dev 2026-10-16 vì chỉ có org-level link `[Inferred]` (PAC2-7727/video-notes.md)
- Defect đã biết:
  - `PAC2-7727` (Inconclusive): `Link Error / No token found` trong transition scheduler → web form — chưa reproduce trên dev 2026-10-16 (TC-003..005 Blocked vì cần patient-level link từ Comms Hub SSO gap OQ-040). 3/6 TC Pass (TC-001 entry, TC-002 scheduler load, TC-006 process gate), 3/6 Blocked
- Chi tiết: `workflows/patient-facing-scheduler.md#booking-link-generation--dfd`

## Ticket → feature

Lookup tổng hợp 2026-10-02 từ 17 ticket. `Final status` là phase/kết quả ở thời điểm tổng hợp (từ `manifest.yaml`/`status.md`/`report.md`), không phải xác nhận product correct.

| Ticket | Short title | Modules / feature | Final status |
|---|---|---|---|
| `PAC2-191` | Chặn SSO tự tạo user khi thiếu organisation assignment | Admin/SSO (`SSO login / User Management`) | LOCATE pending; Blocked, chưa có Pass/Fail |
| `PAC2-1805` | Scheduler cho book nhiều appointment liên tiếp (race) | Patient-facing Scheduler, Comms Hub (`Campaign Outbox` `Resend`) | LOCATE Blocked (không có token link); defect `Resend` ngoài scope |
| `PAC2-3798` | Refactor supergrid backend | Analytics (`Patient & Medication Analyser`), Comms Analytics | Manual 8 Pass / 1 Not Run; automation CLI Blocked |
| `PAC2-4399` | Update O/E blood pressure codes | Configuration (`Code Rule Config`), Health Forms (Designer, Inbox), Patient | COMPLETE; overall Inconclusive (TC-001..003 Blocked) |
| `PAC2-4837` | Blank patient record status causing failure to resync HF | Health Forms (Inbox v2.0), Patient (profile) | EXPLORE; Blocked — resync action not found in Inbox UI |
| `PAC2-4700` | Refactor UI component library (branching) | Comms Hub (`Quick Send`), Patient (`Quick Form`), UI `Bx*` | COMPLETE; 5 Pass / 2 Blocked / 5 Inconclusive, 0 Fail |
| `PAC2-5776` | Popup `Scheduler Link Required` intermittent | Comms Hub (`Quick Send`), Health Forms (Inbox) | AUTOMATION_REVIEW; Inconclusive, cases Blocked |
| `PAC2-6540` | Deleted patients trong Comms Hub/Analytics | Analytics (Advanced Search), Comms Hub (`Campaign Outbox`) | EXPLORE; TC-001 Pass, TC-002 Inconclusive, TC-003 Not Run |
| `PAC2-6763` | Paco Assist document analyser | Paco Assist (`Document Inbox`), Patient (Documents) | COMPLETE; TC-001 Not Run |
| `PAC2-6982` | Shared campaign không truy cập health form từ child org | Comms Hub (Shared Campaign), Health Forms, Patient-facing Scheduler | MANUAL_EXECUTE; Blocked, chưa có Pass/Fail |
| `PAC2-7137` | Session slot count lệch với top view | Appointment Book (count `Day`/`Week`, `Non-bookable`) | MANUAL_EXECUTE xong; TC-001/002/003/005 Pass, TC-004 Fail |
| `PAC2-7201` | Shared campaign issue (PCN) | Comms Hub (Shared Campaign quyền view/edit) | AUTOMATE; chưa execute chính thức, defect pattern quan sát trên dev |
| `PAC2-7466` | Documents tab performance/memory leak | Patient (Documents) | INGEST; Blocked, chưa ANALYZE |
| `PAC2-7579` | PACO Assist copying campaign tag configuration | Comms Hub (`Quick Send`, `PACO Assist`, campaign tags) | LOCATE Blocked; tagged source mới chọn được, generation UI 403; EXPLORE stale; chưa có B hoặc Pass/Fail |
| `PAC2-7669` | Chậm chọn clinician ở Scheduler Configuration | Configuration (`Scheduler Configuration`) | COMPLETE; Pass 5/5, automation CLI Blocked |
| `PAC2-7727` | PACO Connect - Access Denied Booking Error | Patient DFD Config, Patient-facing Scheduler | REPORT; 3/6 Pass (TC-001, TC-002, TC-006), 3/6 Blocked (TC-003..005 cần patient-level JWT link từ Comms Hub SSO gap OQ-040) |
| `PAC2-7786` | Xóa diary/session trong Appointment Book không hoạt động | Appointment Book (Settings: session delete/archive) | AUTOMATE; TC-001/003/004 Fail, TC-002 Blocked, TC-005 Inconclusive |
| `PAC2-8241` | Session editor fixes (Connect Appointment Book) | Appointment Book (session editor, slot) | AUTOMATION_EXECUTE; 2 Pass / 2 Fail / 2 Blocked |
| `PAC2-8384` | Fix filtering trong Appointment Book | Appointment Book (Filters / Location) | COMPLETE; 0 Pass / 1 Fail / 2 Inconclusive / 3 Not Run |
| `PAC2-8522` | Quick Send xem/thêm/sửa campaign tag | Comms Hub (`Quick Send` tags), Patient | LOCATE (manifest); manual 3 Pass / 3 Blocked / 1 Not Run |
| `PAC2-8552` | Hiệu năng booking/cancel (partitioned tables) | Appointment Book, Patient-facing Scheduler (backend) | EXECUTE; 9/9 Blocked |
| `PAC2-8998` | Full-name patient search không trả về một số trường hợp | Patient (`Patient Search`, top-bar search) | REPORT; 12 Pass / 1 Skipped (REQ-003 2-word first name — no dev data) |
| `PAC2-9001` | Cancel session cần RBAC admin-type (`P7032`) | Appointment Book (session cancel RBAC) | EXPLORE; routes R-1/R-2/R-3/R-4 Confirmed, entry-point (OQ-4) + P7032 deploy (OQ-1) still open |
| `PAC2-8575` | Double click slot để arrive patient trong Appointment Book | Appointment Book (slot click → arrive / sidebar detail) | MANUAL_EXECUTE; TC-001+TC-002 Pass (single click mở sidebar, double click benign), TC-003..007 Blocked (cần QA-AUTO future booked); partial coverage |

## Tester notes
