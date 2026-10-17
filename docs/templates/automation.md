# Automation: [TICKET-KEY]

**Input Revision:** [revision]
**Environment:** [environment]
**Role:** [role]
**Execution Mode:** [cli_first/mcp_first]
**Updated:** [timestamp]

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| [TC-ID] | [Yes/No] | [valid/stale/missing/N/A] | [Confirmed/Candidate/Blocked/Inconclusive/N/A] | [Yes/No] | [Allowed/Blocked] |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason | Source |
|---|---|---:|---|---|---|---|---|
| [TC-ID] | [Pass/Fail/Blocked/Not Run/Inconclusive] | [count] | [path/N/A] | [result/N/A] | [classification/N/A] | [reason/N/A] | [CLI/Manual/Hybrid/N/A] |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| [TC-ID] | [attempt-id] | [initial/same/clean/fresh_session/control] | [result] | [Confirmed/Observed/Inferred/Open Question] | [refs] |

**Control path checked:** [Yes/No/N/A]
**Persisted state checked:** [method/result]
**Coverage review:** [acceptance criteria and inventory result]

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| [TC-ID] | [Playwright path/N/A] | [Yes/No] | [revision] | [Implemented/block reason] |

## CLI Verification

| Run | Test Case | Result | Verification | Evidence |
|---|---|---|---|---|
| [run-id] | [TC-ID] | [Pass/Fail/Blocked/Not Run/Inconclusive] | [Matched product result/Product behavior mismatch/Automation defect/Setup or authentication failure/Inconclusive] | [refs] |

## Diagnostic Attempts

| Run | Test Case | Attempt | Data Variant | Result | Verification | Evidence |
|---|---|---|---|---|---|---|
| [run-id] | [TC-ID] | [attempt-id] | [initial/same/clean/fresh_session/control] | [Pass/Fail/Inconclusive] | [Matched product result/Product behavior mismatch/Automation defect/Setup or authentication failure/Inconclusive] | [refs] |

## Mutation and Cleanup

**Occurred:** [Yes/No]
**Class:** [class]
**Workflow Scope:** [ticket/case/action/data]
**Cleanup:** [status/method]
**Leftover Identifiers:** [redacted identifiers]

## Blockers and Warnings

[Auth, stale dependency, stability, data, cleanup or technical blocker]

## Tester notes

[Protected area]
