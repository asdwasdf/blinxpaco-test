# Status — PAC2-8998

**Ticket:** PBT-331 - Patient Search not working in way expected
**Source:** `ticket/PAC2-8998-pbt-331-patient-search-not-working-in-way-expected/ticket.md`
**Input revision:** 1 (sha256: a1babc1bb1c5375e91fd07844cbc4f13ed0a387b42e5365b22329f509642298d)
**Current phase:** COMPLETE
**Workflow status:** complete
**Overall result:** Pass (12/12 active TC; 1 Skipped — TC-006 REQ-003 2-word first name, no dev data)

## Tester scope (confirmed)
- **Target host:** `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-8998` (feature-branch preview; host `blinx.dev.blinxpaco-np.com` đã trong `allowedHosts`)
- **Dev data:** patient `Phoebe Eileen Smitham` (có sẵn, không tạo mới) + `name{N} surname{N}` literal pattern
- **Roles:** Tester chốt scope Super Admin GB (read-only); Receptionist/Clinician/Admin không verify
- **Scope:** Patient Search page + Top-bar (global header) search
- **Mutation:** read-only, không cần approval
- **Auth:** manual, tester tự đăng nhập

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
| DISCOVER | completed | sources hashed; primary only | 2026-10-13 |
| INGEST | no_change | no video/attachments | 2026-10-13 |
| ANALYZE | completed | 9 REQ (Confirmed 7, Inferred 2); 6 open questions | 2026-10-13 |
| LOCATE | completed | 2 views, 3 min, in budget; route + control verified | 2026-10-13 |
| EXPLORE | completed | 9 query forms tested; cap 50 confirmed; no search errors | 2026-10-13 |
| TEST_DESIGN | completed | 13 TC (12 active + 1 skipped), all UI-dependent, mutation None | 2026-10-13 |
| MANUAL_EXECUTE | completed | 12 Pass / 0 Fail / 0 Inconclusive; 0 retry needed | 2026-10-13 |
| AUTOMATE | not_run | (đề xuất trong report.md; không execute trong scope này) | 2026-10-13 |
| AUTOMATION_EXECUTE | not_run | (n/a) | 2026-10-13 |
| REPORT | completed | Overall Pass; defects: 0; durable evidence promoted; knowledge synced | 2026-10-13 |
| COMPLETE | completed | Workflow complete; no unresolved blockers; see `report.md` | 2026-10-13 |

## Execution Summary

- Manual results: Pass 12, Fail 0, Inconclusive 0, Blocked 0, Not Run 0, Skipped 1
- Automation: Implemented 0, Executed 0, Blocked 0 (đề xuất trong report §Automation Decision; không phải scope của workflow này)

## Fast Path

- Video ingest: not applicable
- Product graph lookup: complete (feature-map updated; new workflow file `workflows/patient-search.md`)
- Unresolved QA blockers: 0
- Mutation ledger: none (read-only run)
- Durable evidence: `docs/tickets/PAC2-8998-pbt-331-patient-search-not-working-in-way-expected/evidence/{locate-r1,manual-r1}.json`

## Summary (from ticket)
Bug: full-name patient search fails for `Smith, James` order, two-word first name (`Mary Jane Smith`). Fix: PR #7376 in branch `feature-branch/pac2-8998` — tokenise commas/spaces, match every word against first/middle/surname in any order. Also caps top-bar dropdown + PDS panels to 50 results (max 100) to fix slowness at large sites (Alder Hey).

## Open questions (resolved + remaining)
- OQ-026 Answered 2026-10-13: Top-bar = global header search (không phải Rocket Bar)
- OQ-027 Answered 2026-10-13: PDS = `Patient Search (N)` heading; top-bar = `Results (50)` label
- OQ-028 Answered 2026-10-13: Dev data không có 2-word first name; TC-006 Skipped
- OQ-029 Open: AG Grid virtual-scroll buffer semantics (low impact, không blocking)
- Role access (Receptionist/Clinician/Admin) chưa verify — không blocking nếu Super Admin GB scope chấp nhận

## Artifacts
- `requirements.md` (9 REQ, all Confirmed/Inferred with provenance)
- `feature-location.md` (route + control verified on dev feature-branch)
- `exploration.md` (live query results + cap 50 observed)
- `test-cases.md` (13 TC, all UI-dependent, mutation None)
- `evidence/manual-r1.json` (12 TC + 1 skipped record)
- `evidence/locate-r1.json` (route/control verification)
- `report.md` (overall Pass; defects: 0; automation recommendation)

## Knowledge sync (during REPORT)
- `docs/product/feature-map.md` Patient Search entry updated (tickets, last verified, logic, defect)
- `docs/product/workflows/patient-search.md` NEW (full read-only flow + `## Logic từ ticket`)
- `docs/product/workflows/README.md` index updated
- `docs/product/open-questions.md` OQ-026..029 added (3 Answered, 1 Open)
- `docs/product/change-log.md` 2026-10-13 entry

## Tester notes
