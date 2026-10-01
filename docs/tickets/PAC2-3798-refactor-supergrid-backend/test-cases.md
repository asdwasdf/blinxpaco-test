# Test Cases: PAC2-3798

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-21

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-3798-001 | PAC2-3798-TC-001, PAC2-3798-TC-002 | no-refresh create/clear | Safe mutable report/search data, approval |
| REQ-PAC2-3798-002 | PAC2-3798-TC-003 | separate count/grid refresh | No timing threshold |
| REQ-PAC2-3798-003 | PAC2-3798-TC-004 | cross-table `Aggrid` regression | Complete table inventory |
| REQ-PAC2-3798-004 | PAC2-3798-TC-005 | numerical-value graph | Graph trigger/type/data |
| REQ-PAC2-3798-005 | PAC2-3798-TC-006 | pivot helper and eligibility | Column rules/test data |
| REQ-PAC2-3798-006 | PAC2-3798-TC-007 | old-search migration | Old search and persistence rule |
| REQ-PAC2-3798-007 | PAC2-3798-TC-008 | report URL anchor | Existing safe report |
| REQ-PAC2-3798-008 | PAC2-3798-TC-009 | tab/order/removal/rename | Target order/label |
| REQ-PAC2-3798-009 | PAC2-3798-TC-010, PAC2-3798-TC-011 | CSV and Comms Hub regression | Approval, recipient, expected result |

## Cases

### PAC2-3798-TC-001 — Create report without page refresh

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-001
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:6-9`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Authenticated demo host → direct `/patient-analyser/` → analyser shell
**Context:** report
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Approved safe report context; explicit mutation approval.
**Test Data Category:** Temporary report
**Test Data:** QA-approved disposable report name/data
**Mutation Class:** Temporary
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Record current URL and analyser-shell landmark. | Current page state is identifiable before action. |
| 2 | Activate `New` using approved disposable data. | New report opens without a browser page refresh. |
| 3 | Verify shell continuity and URL/navigation behavior. | No full page reload occurs. |

**Postconditions:** Disposable report state identified.
**Cleanup:** Remove only if QA approves cleanup and report identifier is known; otherwise record remaining identifier.
**Automation:** Blocked — persistent behavior/approval and safe data missing.
**Evidence:** Capture redacted before/after URL and shell landmarks.
**Execution History:** Not Run

### PAC2-3798-TC-002 — Clear `advanced search` without page refresh

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-001
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:6-9`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Direct `/patient-analyser/` → `Patient Analyser` → `Advanced Search`
**Context:** report/search
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA-approved disposable `advanced search` with known clear action.
**Test Data Category:** Temporary search configuration
**Test Data:** QA-approved non-sensitive rule
**Mutation Class:** Temporary
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Apply approved disposable `advanced search`. | Search state is visibly active. |
| 2 | Use the confirmed clear/reset control. | Search criteria clears without a browser page refresh. |
| 3 | Verify analyser shell continuity. | No full page reload occurs. |

**Postconditions:** Search is cleared.
**Cleanup:** Verify zero active search criteria; report remaining state if reset fails.
**Automation:** Blocked — confirmed clear control and safe mutable search data missing.
**Evidence:** Redacted UI state before/after clear.
**Execution History:** Not Run

### PAC2-3798-TC-003 — Patient count remains independent of grid refresh

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-002
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:10-11`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Direct `/patient-analyser/` → `Patient Analyser`
**Context:** report/grid
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA defines a read-only grid-changing control and count/grid loading expectation.
**Test Data Category:** Existing safe report
**Test Data:** QA-approved existing report
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open the approved report and wait for count/grid readiness landmarks. | `Patients:` count and grid rows-loaded footer become observable. |
| 2 | Perform QA-approved read-only grid change. | Patient count loading is independent from grid-data refresh and no page refresh occurs. |

**Postconditions:** Original grid state restored with read-only control if applicable.
**Cleanup:** Restore filter/sort/page state; verify restoration.
**Automation:** Blocked — no measurable performance/count-loading rule or approved read-only change.
**Evidence:** Redacted loading/count/grid landmarks.
**Execution History:** Not Run

### PAC2-3798-TC-004 — Shared `Aggrid` regression across affected tables

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-003
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:12`
**UI-dependent:** Yes
**Feature Location:** Preliminary — only `/patient-analyser/` confirmed; full table inventory unknown.
**Entry Path:** Direct `/patient-analyser/` and QA-provided affected-table routes
**Context:** analytics/supergrid
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA provides affected-table inventory and expected baseline operations.
**Test Data Category:** Existing safe reports
**Test Data:** QA-approved existing reports
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open each QA-listed affected table. | Table renders its expected structural controls and data state. |
| 2 | Perform approved read-only interactions such as sort/filter/paginate. | Each table remains usable after `Aggrid` upgrade. |

**Postconditions:** Original read-only state restored.
**Cleanup:** Reset applied filters/sorts/pages.
**Automation:** Blocked — inventory/routes/expected operations unknown.
**Evidence:** Redacted structural screenshots per table.
**Execution History:** Not Run

### PAC2-3798-TC-005 — Graph availability for numerical values

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-3798-004
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:13-14`
**UI-dependent:** Yes
**Feature Location:** Preliminary — graph control not observed.
**Entry Path:** Direct `/patient-analyser/` → QA-provided numerical-value report/graph entry
**Context:** analytics grid
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA provides numerical column, graph trigger and expected graph type.
**Test Data Category:** Existing safe report
**Test Data:** QA-approved numerical dataset
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open QA-provided numerical-value report. | Eligible numerical value is available. |
| 2 | Invoke documented graph control. | Graph is available for the numerical value. |

**Postconditions:** Original report view restored.
**Cleanup:** Close graph/reset view if it changes persisted state; verify.
**Automation:** Blocked — control, expected graph and mutation boundary unknown.
**Evidence:** Redacted graph/control landmarks.
**Execution History:** Not Run

### PAC2-3798-TC-006 — Pivot helper and column eligibility

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-3798-005
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:15-16,32-35`
**UI-dependent:** Yes
**Feature Location:** Preliminary — pivot control/helper not observed.
**Entry Path:** Direct `/patient-analyser/` → QA-provided pivot entry
**Context:** analytics grid/column settings
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA supplies eligible/ineligible columns, expected restrictions, safe report and persistence rule.
**Test Data Category:** Disposable or approved existing report
**Test Data:** QA-approved pivot dataset
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enable documented `pivot mode`. | `pivot mode helper modal` is available. |
| 2 | Configure an eligible aggregate/pivot column. | Eligible configuration is accepted and produces the documented pivot result. |
| 3 | Attempt a QA-defined ineligible configuration. | Ineligible configuration is prevented or handled per supplied rule. |

**Postconditions:** Pivot state restored.
**Cleanup:** Reset column/pivot configuration; verify restoration.
**Automation:** Blocked — rules, route and persistence boundary unknown.
**Evidence:** Redacted helper/validation landmarks.
**Execution History:** Not Run

### PAC2-3798-TC-007 — Load deprecated `advanced search`

**Type:** Migration regression
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-3798-006
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:17-18`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `Advanced Patient Search` modal observed; old-search entry unknown.
**Entry Path:** Direct `/patient-analyser/` → `Patient Analyser` → `Advanced Search` → QA-provided old saved search
**Context:** saved search
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA provides disposable deprecated search, expected mapped criteria and persistence rule.
**Test Data Category:** Temporary legacy saved search
**Test Data:** QA-approved legacy search identifier
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Load the supplied deprecated `advanced search` in editor. | Search is updated to the new form when loaded. |
| 2 | Compare visible migrated criteria against supplied mapping. | Criteria match expected migration mapping. |
| 3 | Reopen search if persistence is specified. | Persistence behavior matches QA-supplied rule. |

**Postconditions:** Legacy search mutation outcome recorded.
**Cleanup:** Restore/delete only with approval; record identifier if cleanup unavailable.
**Automation:** Blocked — old data, mapping and persistence rule missing.
**Evidence:** Redacted criteria structure and migration outcome.
**Execution History:** Not Run

### PAC2-3798-TC-008 — Report URL anchor supports reopen

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-007
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:20-21`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Direct `/patient-analyser/` → QA-approved existing report
**Context:** saved report
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA-approved existing report with known ID; permission to copy URL locally.
**Test Data Category:** Existing safe report
**Test Data:** QA-approved report identifier, not retained in artifact
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open approved saved report. | Report context is loaded. |
| 2 | Inspect URL and copy it only to local test session. | URL contains report ID anchor. |
| 3 | Reopen copied URL in same authenticated session. | Same report opens and is bookmarkable/shareable by URL. |

**Postconditions:** Original report remains unchanged.
**Cleanup:** Close extra tab/session; do not retain URL if it contains sensitive ID.
**Automation:** Later — requires approved saved report and redaction-safe URL handling.
**Evidence:** Redacted URL shape and report-shell landmark.
**Execution History:** Not Run

### PAC2-3798-TC-009 — Analytics navigation/tab taxonomy update

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-008
**Expected-result basis:** Confirmed — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:22-28`
**UI-dependent:** Yes
**Feature Location:** Preliminary — current sidebar has stale target and still shows `QOF Registers`.
**Entry Path:** Authenticated home → `Analytics & Reports`
**Context:** global analytics navigation
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA provides target tab order and replacement label for `C&D with observations`.
**Test Data Category:** None
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open `Analytics & Reports`. | Tabs/menu follow QA-supplied target order. |
| 2 | Inspect `QOF` and `registers` entries. | Removed entries are absent. |
| 3 | Inspect renamed `C&D with observations` entry. | Entry uses QA-supplied label. |

**Postconditions:** Navigation state may remain expanded.
**Cleanup:** None.
**Automation:** Blocked — target order/label unknown and demo navigation currently mismatches route.
**Evidence:** Redacted navigation structure.
**Execution History:** Not Run

### PAC2-3798-TC-010 — Generate CSV regression

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-3798-009
**Expected-result basis:** Confirmed scope/risk — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:30-35`
**UI-dependent:** Yes
**Feature Location:** Preliminary — CSV control not observed on demo route.
**Entry Path:** QA-provided export-enabled report
**Context:** analytics grid
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** QA approves download and supplies expected CSV schema/content checks.
**Test Data Category:** Existing safe report
**Test Data:** QA-approved export-safe dataset
**Mutation Class:** Unknown
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open export-enabled report. | CSV control is available. |
| 2 | Generate CSV under approval. | Download/result matches QA-supplied expected schema/content rule. |

**Postconditions:** Download retained only in local secure run storage.
**Cleanup:** Delete local download under approved handling; verify deletion.
**Automation:** Blocked — control, approval and expected CSV rule missing.
**Evidence:** Redacted control and result metadata only.
**Execution History:** Not Run

### PAC2-3798-TC-011 — Send to Comms Hub regression

**Type:** Regression
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-3798-009
**Expected-result basis:** Confirmed scope/risk — `ticket/PAC2-3798-refactor-supergrid-backend/ticket.md:30-35`
**UI-dependent:** Yes
**Feature Location:** Preliminary — `send to comms hub` control not observed.
**Entry Path:** QA-provided eligible report/send flow
**Context:** analytics → Comms Hub
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Explicit mutation approval; verified test recipient/destination; cleanup/rollback plan; expected send result.
**Test Data Category:** Approved test recipient/report
**Test Data:** QA-provided non-production recipient/destination
**Mutation Class:** Persistent
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open approved eligible report. | Send control and recipient context are available. |
| 2 | Send only to verified test destination. | Outcome matches QA-supplied expected send behavior. |
| 3 | Verify destination and cleanup/rollback. | No unplanned recipient or persistent data remains. |

**Postconditions:** Mutation ledger and cleanup outcome recorded.
**Cleanup:** QA-approved rollback; record identifiers and failure if incomplete.
**Automation:** Blocked — approval, safe destination, control and expected outcome missing.
**Evidence:** Redacted mutation ledger and outcome evidence.
**Execution History:** Not Run

## Open Questions and Blockers

1. Cung cấp QA-approved safe report, legacy `advanced search`, target `Analytics` order, renamed `C&D` label, graph/pivot rules, table inventory và expected baseline operations.
2. Xác nhận `advanced search` migration persistence/schema/failure behavior. Affects TC-007.
3. Cung cấp measurable patient-count/grid loading expectation. Affects TC-003.
4. Approve temporary/persistent actions for TC-001, TC-002, TC-005, TC-006, TC-007, TC-010, TC-011; TC-011 additionally needs verified test recipient/destination and rollback.
5. Sidebar `Patient Analyser` target `/patient-analyser-new/` returns `404` on demo host; confirm intended route before navigation validation.

## Tester notes

