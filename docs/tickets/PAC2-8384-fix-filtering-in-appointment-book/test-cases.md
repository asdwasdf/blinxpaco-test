# Test Cases: PAC2-8384

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-25T10:25:00+07:00

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-8384-001 | PAC2-8384-TC-001 | Single-book `Location` options | Definition of “newly added” sync latency remains unknown |
| REQ-PAC2-8384-002 | PAC2-8384-TC-002 | Multi-book `Location` union | None after controlled data setup |
| REQ-PAC2-8384-003 | PAC2-8384-TC-003 | Multi-book options across all confirmed filter sections | `Book` label from video differs from current sidebar labels |
| REQ-PAC2-8384-004 | PAC2-8384-TC-004 | Applied filters across two books | Exact empty-slot rule only confirmed for `Appointment Type` |
| REQ-PAC2-8384-005 | PAC2-8384-TC-005 | `Appointment Type` regression | None for rule stated in ticket comment |
| REQ-PAC2-8384-006 | PAC2-8384-TC-006 | Loading/empty-state exploratory check | Proposed fix is `Inferred`; no verdict or automation |
| REQ-PAC2-8384-007 | PAC2-8384-TC-007 | `Location` discoverability exploratory check | Proposed fix is `Inferred`; no verdict or automation |

## Shared controlled test data

- Environment: `dev`, allowed host `blinx.dev.blinxpaco-np.com`.
- Role: `Super Admin GB`.
- Approved scope: create two isolated appointment books, test all filters, then delete if verified safe; otherwise archive.
- Book A: `PAC2-8384 Book A <run-id>`.
- Book B: `PAC2-8384 Book B <run-id>`.
- Distinct locations: `PAC2-8384 Location A <run-id>`, `PAC2-8384 Location B <run-id>`.
- Distinct sessions: `PAC2-8384 Session A <run-id>`, `PAC2-8384 Session B <run-id>`.
- Distinct slot types and appointment types: suffix `A`/`B` with same run ID.
- Existing authorized test `Patient`: `Michael Ramella`.
- Existing authorized test `Clinician`: `Michael Ramella`.
- Use a future date/time range unique to the run. Record exact values in mutation ledger before execution.
- Guard: `PACO_ALLOW_MUTATION=true`; hostname must pass configured dev gate.

## Cases

### PAC2-8384-TC-001 — Single-book `Location` option loads

**Type:** Ticket validation
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-8384-001
**Expected-result basis:** Confirmed — `ticket.md:13`, item 6a
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** `Dashboard` → sidebar `Appointment Book` → menu `Appointment Book` → toolbar `Filters` → `Location`
**Context:** Controlled Book A and unique future date range
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Book A, Location A, Session A and matching slots exist in the selected range.
**Test Data Category:** Isolated synthetic appointment-book data
**Test Data:** Shared controlled data, Book A only
**Mutation Class:** Temporary
**Approval Required:** Yes — granted for this run

| Step | Action | Expected Result |
|---|---|---|
| 1 | Select only Book A and the controlled date range. | Toolbar identifies Book A; appointment data finishes loading. |
| 2 | Open `Filters`, then `Location`. | Section reaches a visible loaded state. |
| 3 | Inspect options. | Location A is present; Location B is absent. |

**Postconditions:** No filter option selected.
**Cleanup:** Shared cleanup after all cases; delete if safe, otherwise archive both books; verify names no longer appear as active selections.
**Automation:** Later — controlled setup and cleanup must be reliable first.
**Evidence:** Screenshot of Book A selector/date plus `Location` options.
**Execution History:** Not Run

### PAC2-8384-TC-002 — Multi-book `Location` options are merged

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8384-002
**Expected-result basis:** Confirmed — `ticket.md:13`, multi-book defect and item 6b
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Confirmed route; appointment-book selector → Book A + Book B → `Filters` → `Location`
**Context:** Controlled two-book date range
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Both controlled books have distinct location-backed sessions/slots in the same range.
**Test Data Category:** Isolated synthetic multi-book data
**Test Data:** Book A→Location A; Book B→Location B
**Mutation Class:** Temporary
**Approval Required:** Yes — granted for this run

| Step | Action | Expected Result |
|---|---|---|
| 1 | Select Book A and Book B, then confirm selection. | Selector reports two selected books; data reload completes. |
| 2 | Open `Filters` → `Location`. | Loaded options are displayed, not an unexplained blank state. |
| 3 | Inspect options. | Both Location A and Location B are present once each. |

**Postconditions:** Both books remain selected; no option applied.
**Cleanup:** Shared cleanup.
**Automation:** Yes candidate after setup helper is proven.
**Evidence:** Screenshot showing two selected books and both location options.
**Execution History:** Not Run

### PAC2-8384-TC-003 — Multi-book option lists cover all filters

**Type:** Ticket validation / Regression
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-8384-003
**Expected-result basis:** Confirmed — `ticket.md:13`, multi-book option-loading scope and item 6c
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Confirmed route → Book A + Book B → `Filters`
**Context:** Controlled two-book date range
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Distinct A/B session, slot type, appointment type data; authorized test patient/clinician associated where supported.
**Test Data Category:** Isolated synthetic multi-book data plus existing test entities
**Test Data:** `Michael Ramella` patient and clinician; A/B named entities
**Mutation Class:** Temporary
**Approval Required:** Yes — granted for this run

| Step | Action | Expected Result |
|---|---|---|
| 1 | With both books selected, expand `Slot Type`. | Both A and B slot types are present once. |
| 2 | Expand `Session Name`. | Both A and B sessions are present once. |
| 3 | Expand `Healthcare Professional`. | Authorized clinician `Michael Ramella` is present where assigned. |
| 4 | Expand `Patient`. | Authorized patient `Michael Ramella` is present where assigned. |
| 5 | Expand `Appointment Type`. | Used A/B appointment types are shown according to current-book usage rule. |

**Postconditions:** No filter option remains selected.
**Cleanup:** Use `Reset all` if any selection occurs accidentally; shared data cleanup afterward.
**Automation:** Later — option provenance and entity assignment must be deterministic.
**Evidence:** One scoped screenshot per expanded section; redact any unexpected personal data.
**Execution History:** Not Run

### PAC2-8384-TC-004 — Applied filters return correct multi-book results

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8384-004
**Expected-result basis:** Confirmed — `ticket.md:13`, item 5d
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Confirmed route → Book A + Book B → `Filters`
**Context:** Controlled two-book date range
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Each book has uniquely labelled visible session/slot records matching its A/B filter values.
**Test Data Category:** Isolated synthetic multi-book data
**Test Data:** Shared controlled dataset
**Mutation Class:** Temporary
**Approval Required:** Yes — granted for this run

| Step | Action | Expected Result |
|---|---|---|
| 1 | Apply Location A. | Only records associated with Location A remain; Book B-only Location B records do not. |
| 2 | Reset; apply Location B. | Only records associated with Location B remain. |
| 3 | Repeat for Slot Type A/B and Session A/B. | Each filter shows only its mapped controlled records. |
| 4 | Apply clinician and patient filters. | Results contain only records associated with the selected authorized test entity. |
| 5 | Clear all filters. | Baseline controlled records from both books return. |

**Postconditions:** Filters reset; both books selected.
**Cleanup:** Shared cleanup.
**Automation:** Later — business-result assertions require deterministic rendered records.
**Evidence:** Before/after screenshots with controlled labels only.
**Execution History:** Not Run

### PAC2-8384-TC-005 — `Appointment Type` filters session and matching slots

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-8384-005
**Expected-result basis:** Confirmed — ticket comment `ticket.md:31-35`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Confirmed route → controlled books → `Filters` → `Appointment Type`
**Context:** Controlled data containing used Type A and Type B plus non-matching slots
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Appointment types are attached to controlled appointments; comparison slots exist.
**Test Data Category:** Isolated synthetic appointment data
**Test Data:** Type A/Type B labels scoped by run ID
**Mutation Class:** Temporary
**Approval Required:** Yes — granted for this run

| Step | Action | Expected Result |
|---|---|---|
| 1 | Inspect `Appointment Type` options. | Only types used in selected controlled books/range appear. |
| 2 | Select Type A. | Matching sessions and slots containing Type A appointments remain; non-matching controlled records are hidden. |
| 3 | Reset and select Type B. | Equivalent Type B result is shown. |

**Postconditions:** Filters reset.
**Cleanup:** Shared cleanup.
**Automation:** Yes candidate after deterministic data factory exists.
**Evidence:** Option list and filtered-result screenshots.
**Execution History:** Not Run

### PAC2-8384-TC-006 — Loading and empty states are distinguishable

**Type:** Exploratory
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-8384-006
**Expected-result basis:** Inferred — proposed fix in `ticket.md:13`, needs BA/PO confirmation
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Confirmed route → `Filters` → any lazy-loaded section
**Context:** Controlled populated range, then a known empty range
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Controlled data exists; an empty date range is identifiable.
**Test Data Category:** Controlled data plus empty range
**Test Data:** Shared dataset
**Mutation Class:** Temporary
**Approval Required:** Yes — granted only for setup; assertion scope remains unconfirmed

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open a section for the first time in the populated range. | Observe and record loading presentation; no pass/fail verdict. |
| 2 | Switch to empty range and open section. | Observe and record empty presentation; no pass/fail verdict. |

**Postconditions:** Restore controlled range.
**Cleanup:** Shared cleanup.
**Automation:** Blocked — expected result is `Inferred`.
**Evidence:** Screenshots/video of both states.
**Execution History:** Not Run

### PAC2-8384-TC-007 — `Location` discoverability from toolbar/search area

**Type:** Exploratory
**Risk:** Low
**Priority:** P3
**Requirements:** REQ-PAC2-8384-007
**Expected-result basis:** Inferred — proposed fix in `ticket.md:13`, needs BA/PO confirmation
**UI-dependent:** Yes
**Feature Location:** Confirmed only for sidebar; proposed toolbar control unconfirmed
**Entry Path:** Appointment Book root toolbar/search area
**Context:** Global Appointment Book view
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Authenticated Appointment Book page.
**Test Data Category:** None
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Inspect toolbar/search area without opening sidebar. | Record whether a visible `Location` chip/control exists; no pass/fail verdict. |

**Postconditions:** Unchanged.
**Cleanup:** None.
**Automation:** Blocked — proposed UI and locator are unconfirmed.
**Evidence:** Toolbar screenshot.
**Execution History:** Not Run

## Open Questions and Blockers

- Before execution, verify `Michael Ramella` resolves to an explicitly authorized test patient and an explicitly authorized clinician; same display name alone does not prove entity type.
- Confirm UI-safe setup route and cleanup capability before first create. If delete is unavailable, archive as approved and verify both test books are inactive.
- If creating locations is organisation-global or affects other books, stop and request narrower approved existing locations; current approval covers isolated ticket test data, not modification of shared production-like records.
- REQ-PAC2-8384-006 and REQ-PAC2-8384-007 remain `Inferred`; no automated business assertion or ticket verdict.

## Tester notes

[Protected area]
