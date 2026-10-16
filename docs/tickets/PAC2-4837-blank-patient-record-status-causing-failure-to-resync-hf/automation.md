# Automation: PAC2-4837

**Input Revision:** 5c0d8311c10f94927b29426793ff7e66a6306b185cc9f705f0560d56ef18cc18
**Environment:** dev
**Role:** Super Admin GB
**Updated:** 2026-10-15

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| TC-001 | Yes | valid | Confirmed | Yes | Allowed |
| TC-002 | Yes | valid | Confirmed | Yes | Allowed |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| TC-001 | Fail | 3+ | `playwright/tests/tickets/PAC2-4837-TC-001.spec.ts` | pending | pending | — |
| TC-002 | Pass (New) / Fail (Classic) | 1+ | `playwright/tests/tickets/PAC2-4837-TC-002.spec.ts` | pending | pending | Classic Inbox skipped per ticket scope; spec targets New Inbox |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| TC-001 | 2026-10-15-001 | initial | Fail | Open Question (resync action exists in More Actions) | `test-results-manual.md` — Classic Inbox, More Actions toggle, no menu items |
| TC-001 | 2026-10-15-002 | clean (re-navigate) | Fail | same | `test-results-manual.md` — same result, fresh page |
| TC-001 | 2026-10-15-003 | new_inbox (inbox-2.0) | Fail | same | `test-results-manual.md` — New Inbox More Actions also lacks Resync |
| TC-002 | 2026-10-15-001 | new_inbox | Pass | Confirmed (Save Status column visible) | `test-results-manual.md` — col-index 17, value "Not Saved" |

**Control path checked:** Yes (TC-001 attempts 2 and 3 across fresh navigation + New Inbox variant)
**Persisted state checked:** No (read-only navigation; no state mutations)
**Coverage review:** TC-001 covers Classic Inbox More Actions; TC-002 covers New Inbox Save Status column. TC-003/004/005/006 skipped per manual outcome (Blocked / Not Run) and ticket scope.

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| TC-001 | `playwright/tests/tickets/PAC2-4837-TC-001.spec.ts` | No (encodes product requirement) | 5c0d8311c10f94927b29426793ff7e66a6306b185cc9f705f0560d56ef18cc18 | Implemented. Spec fails on product assertion until Resync action is exposed. |
| TC-002 | `playwright/tests/tickets/PAC2-4837-TC-002.spec.ts` | No | same | Implemented. Spec targets New Inbox Save Status column. |

## CLI Verification

| Run | Test Case | Result | Verification | Evidence |
|---|---|---|---|---|
| pending | TC-001 | pending | pending | pending — requires `npm run auth:login` then `npx playwright test playwright/tests/tickets/PAC2-4837-TC-001.spec.ts` |
| pending | TC-002 | pending | pending | pending — same |

## Mutation and Cleanup

**Occurred:** No
**Class:** None
**Workflow Scope:** ticket/PAC2-4837/TC-001+TC-002/navigation-only
**Cleanup:** N/A (read-only)
**Leftover Identifiers:** None

## Blockers and Warnings

- **Authentication required for CLI run:** specs use `auth-fixtures` which requires `npm run auth:login` running on CDP port 9222. Without it, the run is `Blocked: Login browser not running`.
- **Page object extension:** `playwright/pages/HealthFormsPage.ts` was extended with HF Inbox locators (`classicInboxUrl`, `newInboxUrl`, `notSyncedFilterButton`, `reviewFormCell`, `formDetailDialog`, `moreActionsButton`, `resyncMenuItem`, `saveStatusColumnHeader`). Source comment in file references `test-results-manual.md`.
- **Stability:** MUI `More Actions` toggle did not render a visible menu in 2026-10-15 manual run. If the menu portal is detached or empty in the production build, the spec may time out waiting for `resyncMenuItem` even when the action exists. Observable wait at `toBeVisible({ timeout: 5_000 })` will fail with a clear message identifying the missing menu item.
- **Test data:** relies on dev having >0 rows in `Not Synced to PR` (6,222 observed) and `Not Saved` (6,169 observed) buckets as of 2026-10-15. If the bucket count drops to 0, TC-001 reviewCell and TC-002 bucket clicks will fail with a clear message.

## Tester notes

[Protected area]
