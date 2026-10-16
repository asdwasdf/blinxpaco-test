# Automation: PAC2-8999

**Input Revision:** 1
**Environment:** dev
**Role:** Super Admin GB (per PAC2-8381 baseline; observed 2026-10-15)
**Updated:** 2026-10-15T08:15:00.000Z

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| TC-PAC2-8999-001 | Yes | valid (feature-location.md) | Confirmed | Yes (Floy adhoc NHS 76835143 pre-existing on dev; session `PAC2-7786 Temi PCN` 15/10/2026) | Allowed |
| TC-PAC2-8999-002 | Yes | valid (feature-location.md) | Confirmed | Yes (same data) | Allowed |
| TC-PAC2-8999-003 | Yes | valid (feature-location.md) | Confirmed | Yes (orphan `Mr Floy adhoc` 15:00–15:10 still on dev; if cleaned, spec re-runs TC-001 path) | Allowed (FAIL-encoded) |
| TC-PAC2-8999-004 | Yes | valid (feature-location.md) | Confirmed | Yes (same as TC-003) | Allowed (FAIL-encoded) |
| TC-PAC2-8999-005 | Yes | valid (feature-location.md) | Confirmed | Yes (same as TC-001) | Allowed |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| TC-PAC2-8999-001 | Pass | 1 | `playwright/tests/tickets/PAC2-8999-TC-001-002-005.spec.ts` | TBD (AUTOMATION_EXECUTE) | TBD | — |
| TC-PAC2-8999-002 | Pass | 1 | `playwright/tests/tickets/PAC2-8999-TC-001-002-005.spec.ts` (same spec) | TBD | TBD | — |
| TC-PAC2-8999-003 | Fail | 3 | `playwright/tests/tickets/PAC2-8999-TC-003-004.spec.ts` (same spec) | TBD | TBD | FAIL-encoded diagnostic |
| TC-PAC2-8999-004 | Fail | 3 | `playwright/tests/tickets/PAC2-8999-TC-003-004.spec.ts` (same spec) | TBD | TBD | FAIL-encoded diagnostic |
| TC-PAC2-8999-005 | Pass | 1 | `playwright/tests/tickets/PAC2-8999-TC-001-002-005.spec.ts` (same spec) | TBD | TBD | — |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| TC-PAC2-8999-001 | manual-1 | initial (Floy adhoc pre-existing) | Pass | Confirmed (dev reply 2026-10-13) | `manual-test.md` Step 2+3 (POST /api/appointments/create 201, 2 audit rows) |
| TC-PAC2-8999-002 | manual-1 | initial | Pass | Confirmed (PAC2-8381 baseline actor identity) | `manual-test.md` Step 3 (actor Johnny (2255) Bravo) |
| TC-PAC2-8999-003 | manual-1..3 | initial/same/control | Fail | Confirmed (dev reply 2026-10-13) | `manual-test.md` Step 6+7+8 (no API call, no audit row, 4 indicator) |
| TC-PAC2-8999-004 | manual-1..3 | initial/same/control | Fail | Confirmed | `manual-test.md` Step 6+7 (no p-confirm-dialog/p-dialog) |
| TC-PAC2-8999-005 | manual-1 | initial | Pass | Confirmed (PAC2-8381 baseline) | `manual-test.md` Step 3 (timestamp 14:23:19/20 matches click window) |

**Control path checked:** Yes (mark-as menu opened 6 menuitems; cancel reproducible no-op across regular click / getByRole / dispatchEvent)
**Persisted state checked:** Yes (audit dialog re-opened after each action, top rows confirmed; calendar slot unchanged)
**Coverage review:** All 5 acceptance-criteria-relevant cases (REQ-001 cancel, REQ-002 book, REQ-004 actor, REQ-005 timestamp; REQ-003 check-in/move optional — out of scope) have automation specs. REQ-006 regression baseline covered by book-audit spec.

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| TC-PAC2-8999-001 | `playwright/tests/tickets/PAC2-8999-TC-001-002-005.spec.ts` | No | 1 | Implemented |
| TC-PAC2-8999-002 | `playwright/tests/tickets/PAC2-8999-TC-001-002-005.spec.ts` | No | 1 | Implemented (same spec, separate assertions) |
| TC-PAC2-8999-003 | `playwright/tests/tickets/PAC2-8999-TC-003-004.spec.ts` | Yes (FAIL-encoded, defect reproduction) | 1 | Implemented |
| TC-PAC2-8999-004 | `playwright/tests/tickets/PAC2-8999-TC-003-004.spec.ts` | Yes (FAIL-encoded) | 1 | Implemented (same spec) |
| TC-PAC2-8999-005 | `playwright/tests/tickets/PAC2-8999-TC-001-002-005.spec.ts` | No | 1 | Implemented (same spec) |

## CLI Verification

| Run | Test Case | Result | Verification | Evidence |
|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD (populated by AUTOMATION_EXECUTE) |

## Mutation and Cleanup

**Occurred:** Yes (booking via Quick Book creates one appointment per run; orphan may accumulate if cancel fails)
**Class:** Quick Book create (allowed; pre-existing orphan cannot be cleaned by agent per tester decision 2026-10-15)
**Workflow Scope:** ticket/case/TC-PAC2-8999-001-005/action=Quick Book/data=pre-existing dev patient + slot
**Cleanup:** None automated (no delete endpoint in agent scope). Each TC-003/004 run re-uses existing Floy adhoc slot first, books a new one only if none exists. Orphan count grows by at most 1 per TC-003/004 run when session has no Floy slot.
**Leftover Identifiers:** `Mr Floy adhoc` NHS 76835143, session `PAC2-7786 Temi PCN` 15/10/2026 15:00–15:10 (orphan from manual 2026-10-15 14:49; pre-existing before AUTOMATE). Future TC-003 runs may add 1 more per run if no Floy slot exists.

## Blockers and Warnings

- **Warning:** Both specs are UI-dependent; require `npm run auth:login` browser running on CDP port 9222 before AUTOMATION_EXECUTE. As of 2026-10-15 08:15, CDP port 9222 was NOT responding — browser login session is not active. Tester must run `npm run auth:login` (keep browser open) before re-running.
- **Warning:** Both specs hard-code `Floy adhoc` NHS `76835143` and session `PAC2-7786 Temi PCN` 15/10/2026. TC-003/004 spec self-books if no Floy slot exists (orphan accumulates per run). TC-001/002/005 spec auto-skips if no free slot.
- **Warning:** TC-001/005 spec uses `Date.parse()` against AG Grid `Date/Time` cell text. The cell format observed in manual run was `10/15/2026 2:23:20 PM` (en-US style). If dev changes locale/format, `Number.isFinite(parsed)` will fail — review format before re-run.
- **Warning:** TC-003/004 spec is FAIL-encoded. It will reproduce the defect by design. If a future run observes a real fix (dialog appears, API call fires, audit row written), the spec will fail with the diagnostic counters — reclassify as `Pass` and update manual verdict in `manifest.yaml`.
- **Warning:** Page object `AppointmentBookPage` was extended with Day view / Quick Book / Mark-as menu / Audit dialog locators (Source: PAC2-8999). All locators are sourced from `manual-test.md` 2026-10-15 14:49. If dev changes the menu, the new spec may need locator re-verification.
- **Warning:** Tester (2026-10-15) cannot ask dev to clean the pre-existing `Mr Floy adhoc` orphan. Spec accepts orphan growth — REVIEWER must monitor orphan count and request cleanup when convenient.
- **Open:** Exact wording for cancel audit entry (`<user> cancelled appointment` per dev reply) not yet produced by product — TC-003 spec searches `cancel` to be tolerant of any wording form.
- **Open:** Check-in / move audit entries (REQ-003) — dev replied "optional"; not in this ticket's scope and not automated.

## Tester notes
