# Test Cases: PAC2-8381

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-02T21:04:09.4217467+07:00

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-8381-001 | TC-001, TC-002 | Booking audit wording across direct Connect and Care Navigation | Whether concise event supplements/replaces field rows remains open |
| REQ-PAC2-8381-002 | TC-001, TC-002, TC-003, TC-004 | Actor/time for booking, amendment, cancellation | Timestamp format/tolerance unspecified |
| REQ-PAC2-8381-003 | TC-001 | Direct Connect booking audit | Needs owned slot/patient fixture |
| REQ-PAC2-8381-004 | TC-002 | Care Navigation booking to Connect audit | Exact safe tile/flow unknown |
| REQ-PAC2-8381-005 | TC-003 | `Slot Type` amendment audit | Expected old/new display unspecified |
| REQ-PAC2-8381-006 | TC-004 | Cancellation audit | Cleanup ends with cancelled record unless deletion path exists |
| REQ-PAC2-8381-007 | TC-001, TC-002 | Appointment panel attribution | Final label `Booked By` vs `Actioned By` ambiguous |

## Shared Controlled Data Contract

- Host must match configured dev allowlist and URL must retain `/paco-connect/feature-branch/pac2-8381/` for Connect steps.
- Role: `Super Admin GB`.
- Create/use only test data owned by this run, with names prefixed `QA-AUTO-PAC2-8381-<run-id>`.
- No real patient PII. Use approved synthetic patient mapping supplied by tester/environment.
- Ledger records redacted identifiers, action, timestamp, outcome and cleanup status.
- Preferred setup: one owned appointment book/session containing at least two slot types and enough bookable slots for direct, Care Navigation, amendment and cancellation coverage.
- If session/book creation is needed, include them in same run ledger and archive/delete only records created by this run.

## Cases

### PAC2-8381-TC-001 — Direct Connect booking creates clear appointment audit

**Type:** Ticket validation  
**Risk:** Critical  
**Priority:** P0  
**Requirements:** REQ-PAC2-8381-001, REQ-PAC2-8381-002, REQ-PAC2-8381-003, REQ-PAC2-8381-007  
**Expected-result basis:** Confirmed — `requirements.md` REQ-001/002/003/007 from ticket description  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`  
**Entry Path:** feature-branch `Appointment Book` → controlled book/date → `Quick Book` → controlled slot → appointment → right-click → group `Appointment` → `View Audit Log`  
**Context:** Global Appointment Book, owned booking  
**Environment:** `dev` feature branch `pac2-8381`  
**Role:** `Super Admin GB`  
**Preconditions:** Auth active; controlled `QA-AUTO` book/session/slot and approved synthetic patient; browser clock/time noted immediately before booking  
**Test Data Category:** Synthetic appointment  
**Test Data:** `QA-AUTO-PAC2-8381-<run-id>-DIRECT`, approved synthetic patient, controlled slot type A  
**Mutation Class:** Temporary  
**Approval Required:** No repeated prompt under execution-first ticket scope; runtime hostname guard and mutation ledger required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Record visible logged-in user and current time; open controlled date/book. | Actor/time baseline captured without sensitive data. |
| 2 | Use `Quick Book` to book synthetic patient into owned slot; disable email/SMS confirmation. | Appointment is created once; no external notification sent. |
| 3 | Open appointment slide panel. | Booking attribution is populated for actual booking user; label/value presentation is captured. |
| 4 | Right-click appointment and choose appointment-group `View Audit Log`. | `Audit | Activity Log` opens for appointment, not slot. |
| 5 | Inspect all relevant rows under `All time`, including scroll/pagination if present. | A booking event clearly states equivalent of `<user> booked this appointment`; wording is not `created this slot`; actor matches step 1 and time corresponds to booking. |
| 6 | Record field-level rows separately. | Additional field rows do not substitute for missing clear booking event. |

**Postconditions:** Owned appointment exists for TC-003 or cleanup.  
**Cleanup:** Prefer retain through TC-003 then cancel through TC-004; after suite, delete/archive only owned appointment/session/book if supported. Verify no active `QA-AUTO` booking remains; report leftover identifier if hard delete unavailable.  
**Automation:** Yes — stable route/menu/dialog; requires deterministic synthetic fixture and cleanup  
**Evidence:** Redacted appointment panel and audit row; actor/time baseline; mutation ledger  
**Execution History:** None

### PAC2-8381-TC-002 — Care Navigation booking appears in Connect audit

**Type:** Ticket validation  
**Risk:** Critical  
**Priority:** P0  
**Requirements:** REQ-PAC2-8381-001, REQ-PAC2-8381-002, REQ-PAC2-8381-004, REQ-PAC2-8381-007  
**Expected-result basis:** Confirmed — `requirements.md` REQ-001/002/004/007  
**UI-dependent:** Yes  
**Feature Location:** Confirmed for target Connect audit; Care Navigation source route candidate only  
**Entry Path:** approved `Care Navigation` tile/flow → book controlled PAC2-8381 appointment → feature-branch `Appointment Book` → find owned booking → appointment-group `View Audit Log`  
**Context:** Cross-feature Care Navigation to Connect  
**Environment:** configured `dev`; resulting audit verified on feature branch `pac2-8381`  
**Role:** `Super Admin GB`  
**Preconditions:** Tester supplies exact approved Care Navigation tile mapped to controlled session, synthetic patient, and cleanup path  
**Test Data Category:** Synthetic cross-feature appointment  
**Test Data:** `QA-AUTO-PAC2-8381-<run-id>-CN`; exact tile TBD  
**Mutation Class:** Temporary  
**Approval Required:** No repeated prompt once exact tile/data scope is supplied; hostname guard and ledger required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open approved Care Navigation patient/service context and record actor/time. | Correct controlled context shown; no existing patient data altered. |
| 2 | Book owned appointment without email/SMS notification. | Booking succeeds once and returns traceable non-sensitive appointment details. |
| 3 | Open resulting appointment in PAC2-8381 Connect branch. | Matching appointment is identifiable without relying on real PII. |
| 4 | Open appointment audit. | Clear booking event exists with correct actor/time and booking wording; `Booked By`/final attribution field is populated correctly. |

**Postconditions:** Owned Care Navigation appointment exists pending cleanup.  
**Cleanup:** Cancel/delete only owned appointment; verify slot release and no active `QA-AUTO` booking. Archive/delete any owned setup records. Report leftovers.  
**Automation:** Blocked until exact safe Care Navigation tile/route and deterministic mapping are supplied  
**Evidence:** Redacted source confirmation, Connect appointment panel, audit entry, ledger  
**Execution History:** None

### PAC2-8381-TC-003 — Slot Type amendment creates appointment audit

**Type:** Ticket validation  
**Risk:** High  
**Priority:** P1  
**Requirements:** REQ-PAC2-8381-002, REQ-PAC2-8381-005  
**Expected-result basis:** Confirmed — `requirements.md` REQ-002/005  
**UI-dependent:** Yes  
**Feature Location:** Confirmed for appointment/audit; mutation route observed in `exploration.md`  
**Entry Path:** owned booked appointment → right-click → `Edit Slot`/documented appointment amendment path → change from controlled slot type A to B → save → appointment-group `View Audit Log`  
**Context:** Owned appointment created by TC-001  
**Environment:** `dev` feature branch `pac2-8381`  
**Role:** `Super Admin GB`  
**Preconditions:** TC-001 appointment active; two safe slot types; baseline audit captured  
**Test Data Category:** Synthetic appointment amendment  
**Test Data:** owned appointment; slot type A → B, both `QA-AUTO` or approved non-sensitive types  
**Mutation Class:** Temporary  
**Approval Required:** No repeated prompt under exact case scope; guard and ledger required

| Step | Action | Expected Result |
|---|---|---|
| 1 | Capture baseline audit row count/descriptions and actor/time. | Baseline preserved for comparison. |
| 2 | Change appointment `Slot Type` from A to B using correct amendment control; save once. | Change persists on appointment after reopen/refresh. |
| 3 | Reopen appointment audit under `All time`. | New audit record captures amendment and correct actor/time; audit is not unchanged. |
| 4 | Inspect description. | Description identifies changed appointment/slot type; old/new-value format recorded as observation because ticket does not define exact text. |

**Postconditions:** Appointment remains active with slot type B for TC-004.  
**Cleanup:** If TC-004 cannot run, revert B → A only when safe and ledger both amendments; otherwise cancel/delete appointment during suite cleanup.  
**Automation:** Yes — after manual route/locator capture proves correct amendment control  
**Evidence:** Redacted before/after appointment state, audit delta and ledger  
**Execution History:** None

### PAC2-8381-TC-004 — Appointment cancellation records actor and time

**Type:** Ticket validation  
**Risk:** High  
**Priority:** P1  
**Requirements:** REQ-PAC2-8381-002, REQ-PAC2-8381-006  
**Expected-result basis:** Confirmed — `requirements.md` REQ-002/006  
**UI-dependent:** Yes  
**Feature Location:** Confirmed; `Cancel Appointment` observed in appointment context menu  
**Entry Path:** owned appointment → right-click → `Cancel Appointment` → confirm with test reason → reopen/include cancelled booking → appointment-group `View Audit Log`  
**Context:** Owned appointment from TC-001 or TC-002  
**Environment:** `dev` feature branch `pac2-8381`  
**Role:** `Super Admin GB`  
**Preconditions:** Owned active appointment; cancellation reason allowed; route to display cancelled appointment known  
**Test Data Category:** Synthetic cancellation  
**Test Data:** owned `QA-AUTO` appointment  
**Mutation Class:** Destructive  
**Approval Required:** No repeated prompt under execution-first exact case scope; `PACO_ALLOW_DESTRUCTIVE=true` runtime guard must already be enabled externally; agent must not enable it

| Step | Action | Expected Result |
|---|---|---|
| 1 | Capture actor/time and pre-cancellation audit. | Baseline captured. |
| 2 | Cancel owned appointment with `QA-AUTO PAC2-8381 audit test` reason and confirm once. | Appointment becomes cancelled; unrelated records unchanged. |
| 3 | Reopen cancelled appointment through supported view/filter. | Same appointment remains traceable for audit inspection. |
| 4 | Open appointment audit. | Cancellation event records correct cancelling user and corresponding time. |

**Postconditions:** Appointment cancelled; slot released according to product behavior.  
**Cleanup:** Verify no active booking remains. If hard delete of cancelled owned appointment is supported and guard/scope permits, delete; otherwise record redacted leftover identifier and leave cancelled. Delete/archive only owned setup session/book after all cases.  
**Automation:** Yes — destructive guard, deterministic cancelled-record lookup and cleanup required  
**Evidence:** Redacted status transition, cancellation audit, slot state and ledger  
**Execution History:** None

## Open Questions and Blockers

1. **TC-002 blocker:** exact Care Navigation tile/service mapped to controlled appointment and safe cleanup path.
2. **All mutation cases:** approved synthetic patient identifier and owned `QA-AUTO` appointment book/session/slots.
3. **TC-004 runtime guard:** tester/environment must externally set `PACO_ALLOW_DESTRUCTIVE=true`; agent cannot enable it.
4. Booking audit contract: concise sentence additional to field rows or replacement?
5. Final slide-panel label: `Booked By`, `Actioned By`, or both?
6. Timestamp format/tolerance and timezone.
7. Amendment description: must include old/new `Slot Type`, or action-only entry sufficient?
8. Cleanup: whether cancelled appointment can be hard-deleted; otherwise controlled cancelled leftover is expected and must be reported.

## Tester notes

[Protected area]
