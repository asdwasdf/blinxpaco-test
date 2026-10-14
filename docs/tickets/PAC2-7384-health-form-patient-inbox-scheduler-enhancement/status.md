# PAC2-7384 — Health form patient inbox - scheduler enhancement

## Current phase
LOCATE — waiting on tester input (Open Questions OQ1 token, OQ2 HF view modes, OQ6 test data) before bounded scan / reusable-route check.

## Phase status
- discover: completed
- ingest: completed
- analyze: completed
- locate: in_progress (blocked on OQ)
- explore: pending
- test_design: pending
- manual_execute: pending
- automate: pending
- automation_execute: pending
- report: pending
- complete: pending

## Import
- Jira: https://blinxsolutions.atlassian.net/browse/PAC2-7384
- Imported: 2026-10-13T15:48:28Z
- Source: `ticket/PAC2-7384-health-form-patient-inbox-scheduler-enhancement/ticket.md`
- Source SHA-256: `0d33b40e549e446b3e5df28bfe48ea6fcd9dcf9b202dc1c3cf4b5a843d13a7d5`
- Output: `docs/tickets/PAC2-7384-health-form-patient-inbox-scheduler-enhancement/`

## Description (verbatim, condensed)
Three items (used as AC after tester confirmation 2026-10-13):
1. Expandable HF for detail view (scheduler).
2. Remove confusing HF views; prefer conversational view of HF alongside chat.
3. Bug: mobile view of submitted HF shows thick bar instead of chat bubble.

## Acceptance criteria
Three description bullets above. Tester confirmed 2026-10-13.

## Target environment
- Scheduler feature branch: `https://dev.blinxscheduler-np.com/feature-branch/pac2-7384/`
- Paco Connect inbox (default Paco dev): `https://blinx.dev.blinxpaco-np.com`
- Both hosts in `paco.config.yaml safety.allowedHosts` (uncommitted allowlist update for scheduler host).

## Scope surfaces (per tester, 2026-10-13)
- patient-facing-scheduler-booking
- paco-connect-inbox
- mobile-responsive-cross-surface

## Artifacts
| Path | Owner | SHA-256 |
|------|-------|---------|
| `manifest.yaml` | paco-ticket | pending |
| `status.md` | paco-ticket | pending |
| `requirements.md` | paco-requirements | `1d281ea877f9d8b55d9ff7bd4c4c3aadda35d2583ebc10cf4cf73705829f6d9e` |

## Resumable checkpoint
- 3 atomic requirements emitted (REQ-001 expandable HF, REQ-002 conversational preferred, REQ-003 mobile bubble).
- 7 Open Questions recorded (OQ1 token, OQ2 view modes, OQ3 breakpoint, OQ4 conversational pre-existing?, OQ5 defect state, OQ6 test data, OQ7 remove semantics).
- 3 Ambiguities (A1 REQ-002 surface, A2 "thick bar" visual, A3 REQ-001 baseline).
- Next: tester trả lời OQ1 + OQ2 + OQ6 trước LOCATE; có thể ghép OQ3/OQ5 vào EXPLORE.

## Tester notes
