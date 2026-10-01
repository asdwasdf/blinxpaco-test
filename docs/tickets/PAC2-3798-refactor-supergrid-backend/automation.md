# Automation: PAC2-3798

**Input Revision:** 1
**Environment:** dev — `pac2-3798.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Updated:** 2026-09-29

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| PAC2-3798-TC-001..011 | Yes | valid | Direct `/patient-analyser/` confirmed | Partial — existing reports available; legacy search/schema/target navigation absent | Allowed where ready |
| DEV-COMMENT-01..03 | Yes | valid | Confirmed | Yes | Allowed |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| PAC2-3798-TC-001 | Pass | 1 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. Spec smoke-checks controls only; manual mutation result retained. |
| PAC2-3798-TC-002 | Pass | 1 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. Spec smoke-checks controls only; manual mutation result retained. |
| PAC2-3798-TC-003 | Pass | 3 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser; spec observes redacted request operation metadata around sort. |
| PAC2-3798-TC-004 | Pass | 1 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. |
| PAC2-3798-TC-005 | Pass | 4 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser; spec follows numeric `Age` → `Chart Range` flow. |
| PAC2-3798-TC-006 | Pass | 5 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser; spec covers helper open/close only. |
| PAC2-3798-TC-007 | Pass | 4 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser; spec skips cleanly if exact legacy fixture is unavailable. |
| PAC2-3798-TC-008 | Pass | 1 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. |
| PAC2-3798-TC-009 | Pass | 2 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. |
| PAC2-3798-TC-010 | Not Run | 0 | N/A | N/A | N/A | Commshub Analytics confirmed by developer as separate site and outside ticket verification scope. |
| PAC2-3798-TC-011 | Not Run | 0 | N/A | N/A | N/A | Commshub site/send flow outside agreed scope; no safe ticket-local destination contract. |
| DEV-COMMENT-01 | Pass | 2 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser; spec covers helper exit. |
| DEV-COMMENT-02 | Pass | 2 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. |
| DEV-COMMENT-03 | Pass | 2 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Blocked | N/A | CLI could not connect to manual CDP login browser. |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| TC-001 | fresh page | unsaved report | Pass | Confirmed ticket | `New` remained on `/patient-analyser/`; shell and rows-loaded state remained, no browser navigation. |
| TC-002 | temporary search | existing safe reference report | Pass | Confirmed ticket | Applied reference-report search; `Advanced Search` counter became `2`. Removed group/reference and applied again; counter became `0`, same URL/title, no page navigation. |
| TC-003 | initial/tab load | unsaved Patient Details/Analyser grids | Pass | Confirmed ticket | Separate redacted operations `GetPatientCount` and `getDataForAnalyticsAgGrid` completed successfully; the count operation requested only patient-count data while the grid operation carried paging/grid state. |
| TC-003 | grid-only change | sort `NHS Number` ascending | Pass | Confirmed ticket | Sorting issued one additional `getDataForAnalyticsAgGrid` request with `sortModel`; no additional `GetPatientCount` request appeared, count remained independent, and URL stayed unchanged. |
| TC-004 | tab controls | existing grids | Pass | Confirmed ticket | Patient Details, Patient Analyser and Medication Analyser produced populated AG Grid structures. |
| TC-006 | helper setup | existing grid | Pass | Confirmed ticket | Applied `Birth Year` group, `Birth Month` pivot and `count(Age)` value; exit restored standard columns and cleared row groups/active filters. |
| TC-005 | numeric cell context path | unsaved Patient Details / `Age` | Pass | Confirmed ticket | `Age` displayed numeric values and was recognised as `avg(Age)`. Right-click numeric cell → `Chart Range` → `Column` → `Grouped` opened dialog `Range Chart`; accessibility tree reported `chart, 1 series` and numeric `Age` value. Chart was closed afterward. |
| TC-006 | saved pivot report | existing `Sheena and Gareth Pivot Test 1` | Pass | Confirmed ticket + developer clarification | Report opened at redacted anchor and helper auto-opened with saved fields. After closing helper, Pivot Mode was off; panel retained saved field configuration while the grid rendered standard non-pivot headers. Active pivot state exited without requiring saved configuration deletion. |
| TC-007 | saved legacy-search candidate | `Test - Male in Advanced Search`, created 2024 | Pass | Confirmed ticket | Saved report loaded with `Advanced Search 1`. Current editor reconstructed the stored condition into nested `Demographic Type Rule` → `Gender Description` → `in` → `Male`; `Analyse Search` evaluated the migrated rule and showed its result count. Dialogs were cancelled; no save occurred. |
| TC-008 | saved report | existing report | Pass | Confirmed ticket | URL shape `/patient-analyser/#<report-id>`; pivot report state loaded. |
| DEV-COMMENT-02 | fresh Patient Details | existing grid | Pass | Developer comment | `checked`: no menu. `NHS Number`: `ascending`; 12 rendered rows; no `No results found`; footer `51 / 78,547 Rows Loaded`. |
| DEV-COMMENT-02 | fresh Medication Analyser | existing grid | Pass | Developer comment | `checked`: no menu; normal data columns expose menu; populated footer remained. |
| DEV-COMMENT-03 | Medication Analyser | existing grid | Pass | Developer comment | Collapsed: footer and horizontal viewport visible; scrollbar max 1305 and moved to 500. Expanded: footer/scroll remained visible and scroll position remained 500. |

**Control path checked:** Yes — fresh page, three analyser tabs, standard sortable columns, existing saved report, collapse/expand.
**Persisted state checked:** Existing report anchor reload verified; no report was saved or modified.
**Coverage review:** All 11 designed cases and three developer-comment regressions reviewed. TC-003 functional independence was confirmed from redacted operation metadata; missing trusted fixtures/contracts remain `Inconclusive`, not inferred outcomes.

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| TC-001/002 | `playwright/tests/tickets/PAC2-3798.spec.ts` | No | 1 | Control smoke only; no report/search mutation in CLI. |
| TC-003 | `playwright/tests/tickets/PAC2-3798.spec.ts` | Yes | 1 | Sort observes operation names only; does not retain network payload. |
| TC-004/005/006 | `playwright/tests/tickets/PAC2-3798.spec.ts` | No | 1 | Read-only structural/grid/chart/helper flows. |
| TC-007 | `playwright/tests/tickets/PAC2-3798.spec.ts` | No | 1 | Exact known fixture; skips if unavailable; no save. |
| TC-008/009 | `playwright/tests/tickets/PAC2-3798.spec.ts` | No | 1 | Anchor reload and navigation structure. |
| DEV-COMMENT-01..03 | `playwright/tests/tickets/PAC2-3798.spec.ts` | No | 1 | Pivot-exit, checkbox/menu, reports layout regressions. |
| TC-010/011 | `playwright/tests/tickets/PAC2-3798.spec.ts` | No | 1 | Explicitly skipped; Comms Hub is outside ticket scope. |

## CLI Verification

| Run | Test Case | Result | Verification | Evidence |
|---|---|---|---|---|
| 2026-09-29 CLI-01 | PAC2-3798 spec | Blocked | Setup or authentication failure | CDP port `9222` had no manual login browser; product results unchanged. |

## Mutation and Cleanup

**Occurred:** Yes — temporary advanced-search and grid configuration
**Class:** Temporary
**Workflow Scope:** PAC2-3798 / TC-002, TC-005, TC-006, TC-007 / existing safe reports and unsaved configuration
**Cleanup:** Advanced-search counter restored from `2` to `0`; later reference-report analysis was cancelled without `Search`/`Save`; temporary `Range Chart` was closed; fresh navigation used between flows; no send, import or upload.
**Leftover Identifiers:** None retained; report anchor redacted.

## Blockers and Warnings

- TC-003 performance claim “loads faster” remains unmeasured because no timing threshold exists; functional count/grid independence passed.
- TC-005 passed through the numeric-cell context menu. Earlier inspection missed the nested `Chart Range` submenu; AG Charts warnings did not prevent chart rendering.
- TC-006 passed after distinguishing active Pivot Mode from retained saved field configuration; helper auto-open is stateful UX, not evidence that exit failed.
- TC-007 passed with a dated saved Advanced Search candidate: legacy stored condition was reconstructed and executable in the current editor. Persistence-on-save was not exercised because the ticket only requires update when loaded into the editor.
- TC-010/011: developer confirmed Commshub is a separate site and outside this ticket.
- Browser console emitted repeated errors/warnings; no product result inferred solely from console output.

## Tester notes

