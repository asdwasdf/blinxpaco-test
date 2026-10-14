---
id: dashboard
title: Dashboard
roles:
  - Super Admin GB
environment: dev
status: Observed
routes: []
controls:
  - name: Expand sidebar
    kind: navigation
  - name: Search patients by name or NHS number
    kind: search
  - name: day
    kind: filter
  - name: week
    kind: filter
  - name: month
    kind: filter
  - name: year
    kind: filter
  - name: Accessibility Menu
    kind: dialog
  - name: Switch to dark theme
    kind: preference
  - name: What do these statuses mean?
    kind: help
  - name: A - Z Last Name
    kind: sort
  - name: Status
    kind: sort
  - name: Available
    kind: filter
  - name: On Leave
    kind: filter
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-dashboard-1
    from: dashboard
    to: health-forms-submenu
    trigger: Health Forms
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-2
    from: dashboard
    to: comms-hub-submenu
    trigger: Comms Hub
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-3
    from: dashboard
    to: web-chat-video-submenu
    trigger: Web Chat & Video
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-4
    from: dashboard
    to: rocket-bar-submenu
    trigger: Rocket Bar
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-5
    from: dashboard
    to: appointment-books
    trigger: Appointment Book
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-6
    from: dashboard
    to: organisation-general
    trigger: Configuration
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-7
    from: dashboard
    to: quick-pay-invoices
    trigger: Quick Pay
    relationship: cross-module handoff
    context:
      - PACO -> PACO Connect
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-8
    from: dashboard
    to: user-portal-route-failure
    trigger: User Portal
    relationship: cross-module handoff
    context:
      - PACO -> PACO Connect
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-9
    from: dashboard
    to: my-case
    trigger: Case Load Management > My Case
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-10
    from: dashboard
    to: unallocated-cases
    trigger: Case Load Management > Unallocated
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-11
    from: dashboard
    to: master-task-board
    trigger: Case Load Management > Task Workboards
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-12
    from: dashboard
    to: patient-details-report
    trigger: Analytics & Reports > Patient Details
    relationship: cross-module handoff
    context:
      - Patient & Medication Analyser app
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-13
    from: dashboard
    to: comms-analytics
    trigger: Analytics & Reports > Comms Analytics
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-14
    from: dashboard
    to: analytics-reports-scr-unauthorized
    trigger: Analytics & Reports > Reports
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-15
    from: dashboard
    to: care-navigation-patient-search
    trigger: Patients > Care Navigation
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-16
    from: dashboard
    to: patient-search
    trigger: Patients > Patient Search
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-dashboard-17
    from: dashboard
    to: set-your-status-dialog
    trigger: Session prompt
    relationship: system interrupt
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Dashboard

## Purpose and context

`Observed`: authenticated landing view at `/paco/dashboard` for role `Super Admin GB` in dev. Header identifies organisation context as `General Practice (Blinx Demo Site)`; identity details are omitted.

## Entry and transitions

1. Open `https://blinx.dev.blinxpaco-np.com/paco/dashboard`.
2. Use `Expand sidebar` to expose global product navigation.
3. Visible navigation groups: `Dashboards`, `Analytics & Reports`, `Comms Hub`, `Health Forms`, `Patients`, `Web Chat & Video`, `Case Load Management`, `Appointment Book`, `Quick Pay`, `User Portal`, `Configuration`, `Rocket Bar`.

Dashboard period controls expose `day`, `week`, `month`, and `year`; `day` was initially selected. Selecting `week` updated `aria-selected` while preserving operational dashboard landmarks; selecting `day` restored the initial state. A synthetic no-match value in global `Search patients by name or NHS number` produced no visible listbox, options, or explicit empty-state message; clearing restored the empty search field. No patient result was opened.

Expanded-sidebar `Search menu...` filters global navigation labels. A synthetic no-match query hid all known menu labels without an explicit empty-state message; searching `Configuration` left only that matching label visible. Clearing restored navigation, then the sidebar was collapsed.

The global `Accessibility Menu` opens a UserWay iframe dialog with contrast, link highlighting, text size/spacing, animation, image, font, cursor, tooltip, line-height, alignment, and saturation controls. External UserWay links and all preference-changing controls were left unused; closing the dialog restored the dashboard.

`Switch to dark theme` was clicked once, but the control label and computed page colors remained unchanged, so no distinct theme state was established. No further theme interaction was attempted.

`Observed` on 2026-09-21: `What do these statuses mean?` opened inline guidance distinguishing user-selected `Available`/`Triage`/`Break` and `On Leave` from automatic `Away from Desk` and `Logged Out`; clicking the control again closed it. The `Staff Availability` sort selector exposed `A - Z Last Name` and `Status`; selecting `Status` reordered the two visible staff cards, then `A - Z Last Name` restored the initial order. Selecting `On Leave (0)` produced an empty card area without an explicit empty-state message; `Available (2)` restored both cards. A synthetic value in `Search Clinicians...` changed `Available (2)` to `Available (0)` and displayed `No clinicians match that search.`; clearing restored both cards.

`Observed` on 2026-09-22: the board overview selector exposed multiple configured board-overview choices; choosing another option updated the selected overview without navigation. Opening a staff card produced a read-only dialog with a status timeline and duration, then `Close` restored the dashboard. The top-bar `More options` menu exposed `PaComms`, `Quick View`, `PACO Assist`, and two indistinguishable `Success` entries; none were opened. Exact board names, staff identity, and durations are omitted.

Dashboard period controls were completed through `month` and `year`, then restored to `day`. Each selection changed the selected period; exact chart values were not recorded because their business basis is untrusted. A click attempt on the `Staff Status` card content was intercepted by a decorative overlay; no force-click was used and no new state opened.

## Evidence

- Accessibility snapshot, dev, `Super Admin GB`, 2026-09-19.
- Page title: `PACO OS`.
- Stable landmarks: `Expand sidebar`, `Search menu...`, global patient search.
- Dashboard period transitioned `day` → `week` → `day`. Global patient no-match search produced no explicit result state and cleared cleanly.
- Sidebar menu search transitioned all labels → no-match blank state → `Configuration` only → all labels.
- Accessibility dialog opened and closed without changing settings. Theme toggle produced no observable state change.
- Staff-status guidance opened and closed. Sort transitioned `A - Z Last Name` → `Status` → `A - Z Last Name`; availability transitioned `Available (2)` → `On Leave (0)` → `Available (2)`.
- Clinician search transitioned two cards → explicit no-match with `Available (0)` → two cards. Period transitioned `day` → `month` → `year` → `day`.
- `Staff Status` detail remained blocked by a decorative overlay. Mutation: `None`.

## Execution guidance

- Manual setup: authenticate in dev as `Super Admin GB` and open `/paco/dashboard`.
- Safe steps: open status guidance; inspect sort choices; switch between `Available` and `On Leave`; restore `A - Z Last Name` and `Available`.
- Approval stop: do not open a staff card or status editor because persistence behavior is unverified.
- Evidence: capture selected sort/tab state and whether an explicit empty-state message appears.

## Automation guidance

- Prefer accessible labels `What do these statuses mean?`, `Available (n)`, `On Leave (n)`, `A - Z Last Name`, and `Status`.
- Wait for card order or card-area contents after selection; counts and staff data depend on current rota/session state.
- Do not assert exact counts, names, configured statuses, or timing thresholds without a trusted source.

## Open questions

- Dashboard chart meaning and role-dependent content remain outside this checkpoint.
- Whether `Switch to dark theme` is unavailable, delayed, or failed remains unresolved; no observable theme change occurred.
- Whether `Staff Status` has an intended read-only detail remains unresolved because its overlay intercepted pointer events.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- Dashboard đã xác thực; sidebar có 12 mục: `Dashboards`, `Analytics & Reports`, `Comms Hub`, `Health Forms`, `Patients`, `Web Chat & Video`, `Case Load Management`, `Appointment Book`, `Quick Pay`, `User Portal`, `Configuration`, `Rocket Bar`, cộng `Sign Out`.
- Phần lớn mục sidebar là nhóm menu mở submenu; `Quick Pay`, `User Portal`, `Configuration` điều hướng trực tiếp.
- Bộ chọn kỳ `day`/`week`/`month`/`year` và panel `Staff Availability` hiển thị trên dashboard (chưa khám phá variant).

Gap / Open Question:

- `Sign Out` không khám phá vì có side effect lên phiên.
- Ô tìm bệnh nhân trên dashboard cần nhập định danh bệnh nhân; không khám phá.

## Discovery run-20261001-085609 (part 3)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- Chọn kỳ `month` thay đổi nội dung dashboard (variant mới); `week`/`year` chưa ghi vào checkpoint vì hết budget.

## Discovery run-20261001-085609 (part 5 — direct mutation discovery)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- Phiên PACO bị đăng xuất 2 lần (Cognito logout → `/paco/login`) trong lúc khám phá; kiểm chứng: mở Comms Hub rồi quay lại không gây logout, nên nhiều khả năng là hết hạn phiên.

Gap / Open Question:

- Thời lượng phiên PACO và nguyên nhân logout chưa xác định (Open Question).

## Tester notes

[Protected area]

## Discovery run-20261006-024122 (Agent survey)

Role `Super Admin GB`, environment `dev`, 2026-10-06. Read-only; claim là `Observed` trừ khi ghi khác.

### Additional navigation items explored

- Health Forms → Inbox: navigates to `/health-forms/responses/` (cross-app)
- Health Forms → Designer: not explored
- Health Forms → Designer V2: not explored
- Comms Hub → Template Manager: requires Microsoft SSO (gap)
- Comms Hub → Campaign Manager: not explored
- Comms Hub → Patient Manager: not explored
- Appointment Book: returns 404 `/paco-connect/appointment-book`
- Configuration: navigates to `/paco/configuration/organisation/general`
- Patient Search: navigates to `/paco/patient-search` (495,069 patients)
- Case Load Management → My Case: navigates to `/paco/my-case` (empty state)
- Case Load Management → Unallocated: navigates to `/paco/unallocated` (764 cases, PDS filters)
- Case Load Management → Case Workboards: navigates to `/paco/workboards/58` (Master Case Board)
- Case Load Management → Task Workboards: navigates to `/paco/workboards/57` (Master Task Board)

### Gaps / Open Questions

- Comms Hub sub-items require separate SSO - cannot test without separate auth
- Appointment Book returns 404 - possibly requires specific configuration
- Designer, Designer V2 not explored
- Campaign Manager, Patient Manager not explored
- Exact content of workboards not captured in detail

## Tester notes

## Discovery run-20261006-024122 (Agent survey - part 2)

Role `Super Admin GB`, environment `dev`, 2026-10-06. Read-only; claim là `Observed` trừ khi ghi khác.

### Additional navigation items explored

- Rocket Bar → Launch Rocket Bar (active state, no nav), Download Rocket Bar
- Users → 404 `/paco-connect/user-training-portal`
- Quick Pay → 404 `/paco-connect/quick-pay/invoices`
- Dashboards → Dashboard (same page), Manager (7 tabs), Connect, Clinician
- Analytics & Reports → Capacity & Demand (`/capacity-demand/`), Patient Analyser, Medication Analyser, QOF Registers, Patient Details, Comms Analytics, Reports
- Web Chat & Video → Virtual Appointments (`/web-chat/appointments/`), Media Library, Outstanding Reviews

### Routes returning 404
- Appointment Book → `/paco-connect/appointment-book`
- Users → `/paco-connect/user-training-portal`
- Quick Pay → `/paco-connect/quick-pay/invoices`

### Gap summary
- Comms Hub sub-items require separate SSO
- Designer, Designer V2 not explored
- Health Forms sub-items partially explored
- Rocket Bar exact behavior unclear
- Some analytics items not explored

## Tester notes

---

# Final Survey Summary - run-20261006-024122

## Environment
- **Base URL:** https://blinx.dev.blinxpaco-np.com
- **Role:** Super Admin GB
- **Date:** 2026-10-06

## Navigation Map

### Sidebar Items (14)
| Item | Route | Status | Notes |
|------|-------|--------|-------|
| Dashboards | submenu | ✓ | Dashboard, Manager, Connect, Clinician |
| Analytics & Reports | submenu | ✓ | 7 items, cross-app nav |
| Quick Send | ? | ⚠ | not explored |
| Health Forms | submenu | ⚠ | Inbox ✓, Designer 404 |
| Patient Search | /paco/patient-search | ✓ | 495k patients |
| Web Chat & Video | submenu | ⚠ | Virtual Appointments loading |
| case load management | submenu | ✓ | My Case, Unallocated, Boards |
| Appointment Book | /paco-connect/... | ❌ | 404 |
| Quick Pay | /paco-connect/... | ❌ | 404 |
| Users | /paco-connect/... | ❌ | 404 |
| Configuration | /paco/configuration/... | ✓ | Tabs visible |
| Rocket Bar | submenu | ⚠ | Launch behavior unclear |

### Key Routes Explored
- `/paco/dashboard` ✓
- `/paco/patient-search` ✓ (495k)
- `/paco/my-case` ✓ (empty)
- `/paco/unallocated` ✓ (764)
- `/paco/workboards/57` ✓ (Task Boards)
- `/paco/workboards/58` ✓ (Case Boards)
- `/paco/workboards/57` ✓ (Task Boards)
- `/capacity-demand/` ✓
- `/patient-analyser-new/` ✓ (12,941 patients)
- `/web-chat/appointments/` ⚠ (loading)

### NHS Comms Hub (externalDevHosts)
- **URL:** https://nhs-comms-hub-dev.blinxhealthcare.com
- **Auth:** Microsoft SAML2 SSO
- **Sub-pages:**
  - Template Manager ✓ (2 templates)
  - Patient Manager ✓
  - Campaign Manager ✓
  - Analytics ✓
  - Configuration (not explored)

## Verify Flow Results

| Candidate | Status | Blocker |
|-----------|--------|---------|
| Create New Task | BLOCKED | Date validation bug + no column options |
| Create New Board | BLOCKED | Save doesn't complete |
| Set User Status | NO_CHANGE | Control not found |

## 404 Routes Identified
- `/paco-connect/appointment-book`
- `/paco-connect/quick-pay/invoices`
- `/paco-connect/user-training-portal`
- `/health-forms/designer`
- `/health-forms/designer-v2`
- `/paco/reports`

## Test Artifacts
- 25+ view documents in `docs/product/survey/views/`
- 3 verify flow results in `test-results/product-survey/run-20261006-024122/verify-flow/`

## Gaps (not explored)
- Quick Send
- Health Forms Designer
- Rocket Bar behavior
- PACO Connect (all 404)
- Web Chat & Video sub-pages
- Connect/Clinician dashboards

---

# Additional Discoveries - 2026-10-06T06:30

## Status Control Found
User status control is in a popup dialog (not TFN dropdown as initially searched).
- Triggered by "Show" button in top bar or first-login prompt
- Available statuses: Admin, Available, Away from Desk, Logged Out, Lunch options, etc.

## Additional Views Documented
| View | Status |
|------|--------|
| Quick Send | ✓ Comms Hub menu (Template/Campaign/Patient Manager) |
| Rocket Bar | ✓ Desktop launcher (Launch/Download) |
| Connect Dashboard | ❌ 404 |
| Clinician Dashboard | ❌ 404 |

## 404 Routes (Updated)
- PACO Connect features (Appointment Book, Quick Pay, Users)
- Health Forms Designer V1/V2
- PACO Reports
- Connect Dashboard
- Clinician Dashboard

## Gaps Remaining
- Web Chat & Video sub-pages (Media Library, Outstanding Reviews)
- PACO Connect features (all 404)
- Rocket Bar desktop behavior

## Final View Count: 28+
