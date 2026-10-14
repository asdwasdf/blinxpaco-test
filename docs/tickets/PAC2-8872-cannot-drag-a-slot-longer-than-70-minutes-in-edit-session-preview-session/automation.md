# Automation: PAC2-8872

**Input Revision:** 8872-20261007
**Environment:** dev
**Role:** Johnny (2255) Bravo — General Practice (Demo Site)
**Updated:** 2026-10-07T15:30:00Z

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| PAC2-8872-TC-001 | Yes | Valid | Confirmed | Yes | Allowed |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| PAC2-8872-TC-001 | Pass | 1 | playwright/tests/tickets/PAC2-8872-drag-slot-over-70-minutes.spec.ts | Pending | — | — |

## Manual Execution Evidence

| Test Case | Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|---|
| PAC2-8872-TC-001 | Sean Huynh 2026-10-07 | Feature Branch | Pass | Confirmed | `Screen Recording 2026-10-07 at 11.59.28 AM.mov` |

**Control path checked:** Yes
**Persisted state checked:** Yes — session extends to 19:45 after drag
**Coverage review:** Acceptance criteria met — drag slot >70 min works, existing bug (delete past 23:00) logged separately

## Automation Implementation

| Test Case | Source | Diagnostic | Input Revision | Status/Reason |
|---|---|---|---:|---|
| PAC2-8872-TC-001 | playwright/tests/tickets/PAC2-8872-drag-slot-over-70-minutes.spec.ts | No | 8872-20261007 | Implemented |

## CLI Verification

| Run | Test Case | Result | Verification | Evidence |
|---|---|---|---|---|
| r1 | PAC2-8872-TC-001 | Pending | — | — |

## Mutation and Cleanup

**Occurred:** Yes
**Class:** Persistent (session create/delete)
**Workflow Scope:** ticket/case/setup-teardown
**Cleanup:** Session deleted by spec afterAll via Configuration grid
**Leftover Identifiers:** `QA-AUTO-PAC2-8872-*`

## Blockers and Warnings

None — feature location confirmed from PAC2-8241 spec reuse

## Tester notes

[Protected area]
