# Automation: PAC2-8522

**Input Revision:** 1
**Environment:** dev feature branch `pac2-8522`
**Role:** `Super Admin GB`
**Updated:** 2026-09-28T15:02:00Z

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| PAC2-8522-TC-001 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8522-TC-002 | Yes | valid | Confirmed | Partial — known untagged campaign; editing-off unavailable under two roles | Blocked |
| PAC2-8522-TC-003 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8522-TC-004 | Yes | valid | Confirmed | Yes | Allowed |
| PAC2-8522-TC-005 | Yes | valid | Confirmed | No — missing-option fixture unverified | Blocked |
| PAC2-8522-TC-006 | Yes | valid | Confirmed | No — no no-update-permission account | Blocked |
| PAC2-8522-TC-007 | Yes | valid | Candidate | No — expected behavior disputed | Blocked |

`evaluateUiLocationGate()` trả `{"allowed":true}` cho route PACO Connect: search patient → `Patient actions menu` → `Quick Send`.

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| PAC2-8522-TC-001 | Pass | 1 | N/A | N/A | N/A | Feature branch dialog hiển thị existing campaign tags và `Edit campaign tags`. |
| PAC2-8522-TC-002 | Blocked | 2 | N/A | N/A | N/A | Untagged fixture retains enabled `Add tags` under both tested roles; no editing-off context. |
| PAC2-8522-TC-003 | Pass | 1 | N/A | N/A | N/A | Search existing tag, select once, `Cancel`; không persisted. |
| PAC2-8522-TC-004 | Pass | 1 | N/A | N/A | N/A | Add/save/reopen/remove/save; baseline restored. |
| PAC2-8522-TC-005 | Blocked | 1 | N/A | N/A | N/A | Không xác minh được campaign có attached checked tag vắng khỏi option list. |
| PAC2-8522-TC-006 | Blocked | 0 | N/A | N/A | N/A | Không có account/role không có campaign update permission. |
| PAC2-8522-TC-007 | Not Run | 0 | N/A | N/A | N/A | `Save as new Campaign` còn `Open Question`. |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| PAC2-8522-TC-001 | A1 | feature branch | Pass | Confirmed — `ticket.md:13` | 2026-09-28T14:54:03Z; local raw `.playwright-mcp/page-2026-09-28T14-54-03-387Z.yml`; campaign `Test (updated due to duplicate name) updated 2` shows `[Bootcamp] Email 1st, SMS 2nd` and `Edit campaign tags`. |
| PAC2-8522-TC-003 | A1 | cancel | Pass | Confirmed — `ticket.md:13` | 2026-09-28T14:54:36Z; search `[Bootcamp] QOF`, select `[Bootcamp] QOF [AST007]`, `Save tags` enabled, then `Cancel`; local raw `.playwright-mcp/page-2026-09-28T14-54-36-268Z.yml`. |
| PAC2-8522-TC-004 | A1 | add-remove | Pass | Confirmed — `ticket.md:13` | 2026-09-28T14:56:58Z–14:57:38Z; added `[Bootcamp] QOF [AST007]`, tag appeared/reopened checked, removed then saved; baseline restored. Local raw `.playwright-mcp/page-2026-09-28T14-56-58-317Z.yml`, `.playwright-mcp/page-2026-09-28T14-57-38-523Z.yml`. |
| PAC2-8522-TC-002 | A1 | `Super Admin GB`, known untagged | Blocked | Confirmed — `ticket.md:13` | 2026-09-28T15:00:17Z; selected `Campaign containing no tags - Quick Send - Shared Organisation`; no chips, but `Add tags` visible. Local raw `.playwright-mcp/page-2026-09-28T15-00-17-573Z.yml`. |
| PAC2-8522-TC-002 | A2 | `Blinx Deployment`, same fixture | Blocked | Confirmed — `ticket.md:13` | 2026-09-28T15:18:33Z; role visibly `Blinx Deployment`; selected same campaign in unsaved composer. No chips, but enabled `Add tags` rendered. No `Save`/send. Local raw `.playwright-mcp/page-2026-09-28T15-18-33-229Z.yml`. |
| PAC2-8522-TC-005 | A1 | fixture search | Blocked | Confirmed — `ticket.md:13` | 2026-09-28T15:01:15Z; campaign picker search could not identify ticket-specific missing-option fixture; no unsupported selection/save. Local raw `.playwright-mcp/page-2026-09-28T15-01-15-198Z.yml`. |

**Control path checked:** Yes — PACO Connect result-row `Patient actions menu` → `Quick Send` retains feature branch URL and opens tag editor.
**Persisted state checked:** TC-004 add persisted into reopened tag dialog; subsequent removal restored baseline. TC-003 cancelled without persistence.
**Coverage review:** REQ-001/002/003 covered. REQ-004/005 blocked by fixture/account. REQ-006 not run because expected result disputed.

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| PAC2-8522-TC-001 | `playwright/tests/tickets/PAC2-8522-TC-001-003-004.spec.ts` | No | 1 | Spec generated; needs test data env vars. |
| PAC2-8522-TC-002 | N/A | No | 1 | Blocked — editing-off context unavailable. |
| PAC2-8522-TC-003 | `playwright/tests/tickets/PAC2-8522-TC-001-003-004.spec.ts` | No | 1 | Spec generated; needs test data env vars. |
| PAC2-8522-TC-004 | `playwright/tests/tickets/PAC2-8522-TC-001-003-004.spec.ts` | No | 1 | Spec generated; needs test data env vars; cleanup pending. |
| PAC2-8522-TC-005 | N/A | No | 1 | Blocked — missing-option fixture unavailable. |
| PAC2-8522-TC-006 | N/A | No | 1 | Blocked — account unavailable. |
| PAC2-8522-TC-007 | N/A | No | 1 | Blocked — expected behavior disputed. |

## Environment Variables Required

```bash
PACO_BASE_URL=https://dev.blinxpaco-np.com
PACO_TEST_PATIENT_NHS=NHS 000000  # Replace with actual from tester
PACO_TEST_PATIENT_SEARCH=TEST_PATIENT
PACO_TEST_TAG=[Bootcamp] QOF [AST007]
PACO_STEP_MS=1000
```

## CLI Verification

Chưa chạy; thuộc phase `AUTOMATION_EXECUTE`.

## Mutation and Cleanup

**Occurred:** Yes
**Class:** Persistent
**Workflow Scope:** PAC2-8522 / TC-004 / add and remove existing organization tag / authorized campaign.
**Cleanup:** Removed `[Bootcamp] QOF [AST007]`, saved, observed original tag set only.
**Leftover Identifiers:** None

## Blockers and Warnings

- TC-002 fixture found: `Campaign containing no tags - Quick Send - Shared Organisation`. `Add tags` rendered for both `Super Admin GB` and user role `Blinx Deployment`; neither provides required editing-off context.
- TC-005 chưa có campaign/attached-tag identity đáng tin cậy để chứng minh tag absent from option list. Không suy đoán từ campaign/tag names.
- Raw snapshots chứa patient data, local-only.

## Tester notes

