# Test Cases: PAC2-8522

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-28T14:35:29Z

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-8522-001 | PAC2-8522-TC-001, PAC2-8522-TC-002 | display, no-tag state, diagnostic baseline | overflow `+N` needs campaign with > visible capacity |
| REQ-PAC2-8522-002 | PAC2-8522-TC-003 | existing-tag search and no duplicate | current editor not rendered |
| REQ-PAC2-8522-003 | PAC2-8522-TC-004 | add/remove/save/persistence/cleanup | requires safe tag and mutation |
| REQ-PAC2-8522-004 | PAC2-8522-TC-005 | missing-option tag preservation | missing-tag test data unavailable |
| REQ-PAC2-8522-005 | PAC2-8522-TC-006 | read-only permission | no low-permission account |
| REQ-PAC2-8522-006 | PAC2-8522-TC-007 | `Save as new Campaign` scope placeholder | scope conflict unresolved |

## Cases

### PAC2-8522-TC-001 — Hiển thị current campaign tags trong Quick Send

**Type:** Ticket validation
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-8522-001
**Expected-result basis:** Confirmed — `ticket.md:13`
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`; corrected by `exploration.md` OBS-PAC2-8522-004
**Entry Path:** exact feature URL → search/select tester-authorized patient → `Patient actions` → `Quick Send`
**Context:** patient / Quick Send composer
**Environment:** dev feature branch `pac2-8522`
**Role:** `Super Admin GB`
**Preconditions:** Authenticated session; query `qs_campaign_tags=true`; campaign `Test (updated due to duplicate name) updated 2` selected.
**Test Data Category:** Existing tester-owned campaign with attached tags
**Test Data:** Campaign from ticket attachment; no patient identifiers persisted
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open the Quick Send composer through `Patient actions` → `Quick Send`. | Composer opens with the selected campaign name. |
| 2 | Inspect the campaign header. | Current campaign tags are displayed as chips next to the campaign name. |
| 3 | If tags exceed available width, inspect overflow and hover it. | Overflow collapses to `+N`; hover reveals remaining tags. |

**Postconditions:** No state changed.
**Cleanup:** Close modal; none.
**Automation:** Yes after manual result; current mismatch requires diagnostic attempts if `Fail`.
**Evidence:** Ticket attachment `128292-image-20260926-103032.png`; exploration OBS-PAC2-8522-005.
**Execution History:** None

### PAC2-8522-TC-002 — Campaign untagged không render tag UI khi editing off

**Type:** Regression
**Risk:** Medium
**Priority:** P1
**Requirements:** REQ-PAC2-8522-001
**Expected-result basis:** Confirmed — `ticket.md:13`
**UI-dependent:** Yes
**Feature Location:** Confirmed — same route
**Entry Path:** exact feature URL → patient → `Patient actions` → `Quick Send` → choose known untagged campaign
**Context:** patient / Quick Send composer
**Environment:** dev feature branch `pac2-8522`
**Role:** `Super Admin GB`
**Preconditions:** Known untagged campaign; editing disabled through supported UI/permission context.
**Test Data Category:** Existing untagged campaign
**Test Data:** Unknown
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open a known untagged campaign with editing off. | No tag chip/editor area renders. |

**Postconditions:** No state changed.
**Cleanup:** Close modal.
**Automation:** Blocked — untagged data/editing-off context not identified.
**Evidence:** Ticket narrative.
**Execution History:** None

### PAC2-8522-TC-003 — Search và chọn existing organization tag

**Type:** Ticket validation
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-8522-002
**Expected-result basis:** Confirmed — embedded AC in `ticket.md:13`
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Quick Send composer → campaign tag edit control
**Context:** patient / campaign tag dialog
**Environment:** dev feature branch `pac2-8522`
**Role:** `Super Admin GB`
**Preconditions:** Tag editor is visible; organization has existing `[Bootcamp]...` tag.
**Test Data Category:** Existing organization tag
**Test Data:** Candidate tag from attachment; exact label must be read from dialog
**Mutation Class:** Temporary
**Approval Required:** No — authorized execution-first dev scope; runtime guard and ledger required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open tag editor. | Searchable tag list opens; current campaign tags are ticked. |
| 2 | Type the first few characters of an existing tag. | Existing tag is offered. |
| 3 | Select it once without saving. | One selection exists; no duplicate tag is created. |
| 4 | Cancel dialog. | No persisted change. |

**Postconditions:** Campaign unchanged.
**Cleanup:** `Cancel`; verify original chips unchanged.
**Automation:** Yes after manual execution.
**Evidence:** Ticket attachment and narrative.
**Execution History:** None

### PAC2-8522-TC-004 — Add/remove tag, save, persist, cross-check, cleanup

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8522-003
**Expected-result basis:** Confirmed — embedded AC in `ticket.md:13`
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Quick Send composer → campaign tag edit control → `Save`
**Context:** patient / Quick Send + Communications Hub
**Environment:** dev feature branch and Communications Hub dev
**Role:** `Super Admin GB`
**Preconditions:** Safe existing campaign and safe existing tag; original tag set recorded; mutation host allowlisted; `PACO_ALLOW_MUTATION=true`.
**Test Data Category:** Tester-owned campaign and reversible existing tag
**Test Data:** Campaign `Test (updated due to duplicate name) updated 2`; candidate tag `[Bootcamp]...` once exact label is confirmed
**Mutation Class:** Persistent
**Approval Required:** No — authorized execution-first dev scope; runtime guard and ledger required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Record original tags. | Baseline is captured. |
| 2 | Add one unselected existing tag and `Save`. | Save succeeds; added tag appears in Quick Send. |
| 3 | Open same campaign in Communications Hub without refreshing campaign library. | Added tag is visible. |
| 4 | Reopen Quick Send, remove that tag, and `Save`. | Removal succeeds. |
| 5 | Cross-check Communications Hub. | Original tag set is restored. |

**Postconditions:** Original tags restored.
**Cleanup:** Restore exact baseline tag IDs; verify in both Quick Send and Communications Hub. On cleanup failure, record campaign identifier in redacted ledger and stop.
**Automation:** Yes after manual result.
**Evidence:** Ticket attachment `128292-image-20260926-103032.png`; mutation ledger required.
**Execution History:** None

### PAC2-8522-TC-005 — Preserve attached tag missing from getAllTags options

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-8522-004
**Expected-result basis:** Confirmed narrative — `ticket.md:13`
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Quick Send composer → campaign tag editor
**Context:** patient / campaign tag dialog
**Environment:** dev feature branch
**Role:** `Super Admin GB`
**Preconditions:** Campaign attached to a tag absent from current organization tag list.
**Test Data Category:** Shared/removed-list attached tag
**Test Data:** Unknown
**Mutation Class:** Persistent
**Approval Required:** No within approved scope; runtime guard/ledger required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open editor for prepared campaign. | Missing-option attached tag remains visible and ticked. |
| 2 | Save without altering that tag. | Tag remains attached after save. |

**Postconditions:** Original tags unchanged.
**Cleanup:** Restore baseline if altered.
**Automation:** Blocked — required data unavailable.
**Evidence:** Ticket narrative.
**Execution History:** None

### PAC2-8522-TC-006 — User without update permission sees tags read-only

**Type:** Permission regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-8522-005
**Expected-result basis:** Confirmed — embedded AC in `ticket.md:13`
**UI-dependent:** Yes
**Feature Location:** Confirmed route, role variant unavailable
**Entry Path:** feature URL → patient → `Patient actions` → `Quick Send`
**Context:** patient / Quick Send composer
**Environment:** dev feature branch
**Role:** User without campaign update permission
**Preconditions:** Authenticated no-update-permission account; campaign with tags.
**Test Data Category:** Existing tagged campaign
**Test Data:** Campaign candidate from ticket
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open tagged campaign. | Tags are visible. |
| 2 | Inspect tag controls. | No editable tag control is available. |

**Postconditions:** No state changed.
**Cleanup:** None.
**Automation:** Blocked — no suitable account and permission mapping unconfirmed.
**Evidence:** Ticket narrative.
**Execution History:** None

### PAC2-8522-TC-007 — Tags trong Save as new Campaign

**Type:** Exploratory placeholder
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-8522-006
**Expected-result basis:** Open Question — ticket says backend supports it but UI is `Still to do`
**UI-dependent:** Yes
**Feature Location:** Preliminary for this subflow
**Entry Path:** Quick Send → `Save as new Campaign`
**Context:** patient / save-new-campaign modal
**Environment:** dev feature branch
**Role:** `Super Admin GB`
**Preconditions:** Scope decision required.
**Test Data Category:** New disposable campaign
**Test Data:** Not selected
**Mutation Class:** Persistent
**Approval Required:** No within approved scope after expected result clarified

| Step | Action | Expected Result |
|---|---|---|
| 1 | Do not execute until scope is clarified. | No fabricated assertion. |

**Postconditions:** Not Run.
**Cleanup:** Delete/retire disposable campaign only if explicitly allowed by designed run.
**Automation:** Blocked — expected behavior disputed.
**Evidence:** Ticket narrative.
**Execution History:** None

## Open Questions and Blockers

- Current composer lacks chips/edit control shown in ticket attachment; TC-001 likely starts as diagnostic `Fail` candidate and requires at least initial, same-data, clean-data, fresh-session plus control-path evidence before final result.
- Exact existing tag label and safe mutation eligibility must be confirmed from editor before TC-003/004 mutation.
- TC-002 lacks known untagged campaign/editing-off setup.
- TC-005 lacks shared/removed tag fixture.
- TC-006 lacks no-update-permission account; permission mapping `qsNewCampaignCreator` remains unconfirmed.
- TC-007 scope is disputed and stays `Not Run` until clarified.

## Tester notes

