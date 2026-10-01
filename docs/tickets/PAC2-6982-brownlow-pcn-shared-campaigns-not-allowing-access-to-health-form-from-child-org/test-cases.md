# Test Cases: PAC2-6982

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-01

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-6982-001 | PAC2-6982-TC-001 | Scheduler login with child-created form | Safe test patient/link not yet selected |
| REQ-PAC2-6982-002 | PAC2-6982-TC-001 | Open attached form without child `Shared To` | Exact owned form must be verified |
| REQ-PAC2-6982-001, REQ-PAC2-6982-002 | PAC2-6982-TC-002 | Positive control with valid sharing | Control form/campaign must be selected or created |

## Cases

### PAC2-6982-TC-001 — Child patient opens child-created form without `Shared To`

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-6982-001, REQ-PAC2-6982-002
**Expected-result basis:** `Confirmed`, ticket `Description`, revision 1
**UI-dependent:** Yes
**Feature Location:** Confirmed setup roots in `feature-location.md`; scheduler endpoint discovered during execution from created campaign
**Entry Path:** Paco `Health Forms` → `Designer`; Comms Hub `Campaign Manager` → parent context → `Create Campaign`; patient scheduler link
**Context:** `General Practice (Demo Site)` → PCN `Redmoor Liverpool (Non-OBE)` → child `Primary Care 24` or `3ST`
**Environment:** configured dev hosts only
**Role:** `Admin` for setup; patient flow uses approved test patient
**Preconditions:** Exact active form is verified as created by selected child and not `Shared To` that child. Separate synthetic shared campaign uses parent PCN and targets selected child. Safe test patient belongs to selected child. Supported scheduler link is available.
**Test Data Category:** Synthetic/owned campaign plus verified existing child-owned form and safe test patient
**Test Data:** Campaign prefix `PAC2-6982`; no patient/contact/token values in docs
**Mutation Class:** Persistent
**Approval Required:** No — QA approved ticket-scoped separate campaign creation and send; runtime guard remains required

| Step | Action | Expected Result |
|---|---|---|
| 1 | In child context, inspect selected form ownership/sharing | Creator is selected child; `Shared To` does not include that same child |
| 2 | In parent PCN context, create separate `Shared Campaign`, attach selected form, target child | Campaign setup accepts exact ticket configuration without changing existing campaign |
| 3 | Add verified safe test patient and generate/send using approved UI path | Scheduler link is issued only to safe recipient; mutation ledger records redacted identifiers |
| 4 | Open scheduler link in fresh patient session and complete supported login | Login succeeds; it does not fail because form creator is child practice |
| 5 | Open attached `Health Form` | Form is accessible to patient of targeted child despite no `Shared To` relation for creator child |

**Postconditions:** Manual result records product behavior separately from setup/auth issues.
**Cleanup:** Remove/archive synthetic campaign only if UI supports safe approved cleanup; otherwise record redacted campaign identifier as intentional leftover. Never remove existing form/patient. Verify campaign no longer active/sendable when cleaned.
**Automation:** Yes after manual result and durable route/locators. Standalone spec mandatory for `Pass`/`Fail`.
**Evidence:** Redacted form relationship, campaign configuration, scheduler login outcome, opened form; no token/contact/clinical content.
**Execution History:** Not Run

### PAC2-6982-TC-002 — Shared-form positive control

**Type:** Regression control
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-6982-001, REQ-PAC2-6982-002
**Expected-result basis:** `Confirmed` ticket expectation for scheduler login/form access; control relationship itself must be observed and recorded
**UI-dependent:** Yes
**Feature Location:** Confirmed setup roots in `feature-location.md`
**Entry Path:** Same as PAC2-6982-TC-001
**Context:** Same parent, child and safe patient where possible
**Environment:** configured dev hosts only
**Role:** `Admin` setup; approved test patient
**Preconditions:** Active control form is validly available to selected child through `Shared To`, or controlled copy is created. Safe patient/link available.
**Test Data Category:** Synthetic/owned control campaign; verified shared form
**Test Data:** Campaign prefix `PAC2-6982-control`; no sensitive values in docs
**Mutation Class:** Persistent
**Approval Required:** No within approved ticket scope; runtime guard required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Verify control form has valid `Shared To` relation for child | Relationship is visible before campaign setup |
| 2 | Create otherwise equivalent campaign and safe patient flow | Control scheduler link is produced without modifying TC-001 campaign |
| 3 | Login and open control form | Login/form path succeeds, providing control for setup/auth infrastructure |

**Postconditions:** Control result does not override TC-001 result.
**Cleanup:** Same rule as TC-001; record leftovers if safe cleanup unavailable.
**Automation:** Yes if executed and manual result is `Pass`/`Fail`; otherwise blocker reason required.
**Evidence:** Redacted sharing relation and control-path outcome.
**Execution History:** Not Run

## Execution gates

- Set `PACO_ALLOW_MUTATION=true` for persistent campaign actions; hostname must match configured dev host.
- Mutation ledger: timestamp, case ID, action, host, redacted campaign/form/patient fingerprints, outcome, cleanup.
- Never use existing patient merely because visible. Recipient/test patient must be explicitly verified safe before `Send`.
- If PAC2-6982-TC-001 first attempt fails: retry same data, clean data, fresh page/session, plus PAC2-6982-TC-002 control; mixed diagnostic results become `Inconclusive`.
- Do not modify existing campaign supplied as visual example.

## Open Questions and Blockers

1. Which child (`Primary Care 24` or `3ST`) has an existing active form whose creator and no-`Shared To` relationship can be verified?
2. Which patient/recipient is approved and belongs to that child?
3. Which supported UI path generates scheduler link, and can synthetic campaign be archived/deleted safely?
4. Control form with valid `Shared To` remains unselected.

Until items 1–2 are resolved, both cases remain `Not Run`; this is test-data blocking, not product failure.

## Tester notes
