# Report: PAC2-9001 — PBT-334 Cancelling session behind Admin RBAC

**Ticket:** PAC2-9001
**Input Revision:** 2
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/`)
**Role:** Super Admin GB (Fiona Nguyen)
**Updated:** 2026-10-15T09:00:00Z

## Scope

Tách quyền cancel session khỏi `Appointment Book User`, tạo activity mới `P7032 - Appointment Book Cancel Session`. 3 PR đã merge: `paco-connect-be #792`, `paco-one-db #1022`, `connect-fe #2875`. Tuy nhiên PAC2-9001 vẫn ở trạng thái **partial-complete** vì P7032 chưa Confirmed visible trên dev host.

## Product Result

Manual execution đã hoàn tất với 11 test cases + 2 derived OQ. Kết quả (3 Pass, 6 Blocked, 2 Not Run):

| Test Case | Manual Result | Reason |
|---|---|---|
| PAC2-9001-TC-001 | Blocked | paco-one-db #1022 not deployed; P7032 absent. |
| PAC2-9001-TC-002 | Blocked | paco-one-db #1022 not deployed; cannot create role + P7032. |
| PAC2-9001-TC-003 | Blocked | Auto-include verification gated by P7032 deploy status. |
| PAC2-9001-TC-004 | Blocked | All dev appointments in completed state; Cancel Appointment disabled. |
| PAC2-9001-TC-005 | Not Run | Blocked by TC-004. |
| PAC2-9001-TC-006 | Blocked | UX gap: Block Session click produces no dialog, no effect (both empty + booked). |
| PAC2-9001-TC-007 | **Pass** | Edit SESSION drawer opens via pencil, footer Cancel + Save verified. |
| PAC2-9001-TC-008 | **Pass** | Configuration → Sessions row kebab shows "Archive" for Admin. |
| PAC2-9001-TC-009 | **Pass** | Configuration → Sessions row kebab shows "Cancel session appointments" for Admin. |
| PAC2-9001-TC-010 | Not Run | OQ-034: template data with bookings-outside-template-times missing. |
| PAC2-9001-TC-011 | Blocked | P7032 ABSENT in 181 P-codes scanned (P0001–P9000, max P7507). paco-one-db #1022 not deployed. |

**OQ derived:**
- OQ-031-block-on-booked: Blocked — covered by TC-006 diagnostic (15 Oct, Booked=2, Block Session enabled in menu but click = no-op).
- OQ-033-entry-point: **RESOLVED** — Cancel session appointments entry point = Configuration → Appointment Books → Sessions → row kebab (8 items: Add Session, Edit, View Audit, Archive, Clone, Delete, Cancel session appointments). NOT in Appointment Book Day view slot menu.

## Automation Verification

5 specs created và chạy qua Playwright CLI. Tất cả blocked ở auth fixture (Login browser not running) — không có manual result bị thay đổi.

| Test Case | Spec | CLI Result | Verification | Manual Result | Match? |
|---|---|---|---|---|---|
| PAC2-9001-TC-007 | PAC2-9001-TC-007.spec.ts | Blocked | Setup or authentication failure | Pass | N/A (auth blocker) |
| PAC2-9001-TC-008 | PAC2-9001-TC-008.spec.ts | Blocked | Setup or authentication failure | Pass | N/A (auth blocker) |
| PAC2-9001-TC-009 | PAC2-9001-TC-009.spec.ts | Blocked | Setup or authentication failure | Pass | N/A (auth blocker) |
| PAC2-9001-TC-006 | PAC2-9001-TC-006.spec.ts | Blocked | Setup or authentication failure | Blocked (UX) | N/A (auth blocker) |
| PAC2-9001-TC-011 | PAC2-9001-TC-011.spec.ts | Blocked | Setup or authentication failure | Blocked (P7032) | N/A (auth blocker) |

**Note:** `npm run auth:login` không chạy khi invoke CLI → tất cả specs fail ở `connectOverCDP` với error `Blocked: Login browser not running`. Đây là setup blocker, không phải product issue. Re-run sau khi auth session live sẽ cho kết quả thực.

**Mutation ledger:** None — specs dùng read-only verification (Cancel drawer, không click Archive / Cancel session destructive action).

## Defects

### DEF-PAC2-9001-01 — Block Session click produces no dialog (regression suspected)

- **Severity:** Medium
- **Priority:** Medium
- **Expected:** Block Session via slot context menu should open a confirmation dialog ("No patients are booked in this session" for empty; per-AC scenario 3 dialog for booked) — per requirements REQ-008 / REQ-002.
- **Actual:** Menu item enabled; click produces no dialog, no error, no visible effect. Reproduced 14 Oct 2026 (empty session, 48 slots) và 15 Oct 2026 (Booked=2, Available=902, count unchanged). UX gap suspected regression.
- **Preconditions:** Dev host with at least one session; slot context menu accessed via right-click on slot.
- **Evidence:** `test-results/PAC2-9001/manual/rev-2/execution-log.md`, `final-report.md`; diagnostic spec `playwright/tests/tickets/PAC2-9001-TC-006.spec.ts`.
- **File:** `docs/tickets/PAC2-9001-pbt-334-cancelling-session-needs-to-be-behind-a-admin-type-rbac/defects/DEF-PAC2-9001-01-block-session-ux-gap.md`

## Limitations

- **P7032 RBAC verification blocked:** paco-one-db #1022 not deployed on dev; 5 RBAC-related test cases (TC-001/002/003/011 + OQ-031) cannot be confirmed. Re-test required after dev confirms deploy.
- **Test data gap:** All dev appointments in completed state; Cancel Appointment disabled. Need Booked/Confirmed appointments to retest TC-004/005.
- **CLI runner blocked:** `npm run auth:login` not running; 5 specs recorded as `Setup or authentication failure`. Re-run after auth session live to obtain real CLI verification.
- **Block Session UX gap:** Possible regression; needs dev investigation. See DEF-PAC2-9001-01.

## Open Questions (carry-over)

| ID | Status | Note |
|---|---|---|
| OQ-1 / OQ-030 (P7032 deploy) | Open | paco-one-db #1022 chưa deploy dev. P7032 ABSENT. |
| OQ-034 (template trigger) | Open | Template data with bookings-outside-template-times missing on dev. |
| OQ-033 (entry-point shape) | **Resolved** | Cancel session appointments = Configuration → Sessions row kebab. |

## Coverage Review

- **Acceptance criteria coverage:** 7/9 AC scenarios trong matrix 7x3 (per tony.do comment 14:31:47Z) đã được covered qua test design, nhưng execution chỉ pass 1 scenario fully (TC-007 Edit SESSION) + 2 entry-point verifications (TC-008, TC-009). 5 scenarios gated by P7032 deploy (REQ-001, REQ-002, REQ-005, REQ-006, REQ-009) chưa run được.
- **Test inventory:** 11 TCs designed; 5 P7032-dep blocked, 2 data-dep blocked, 1 UX-dep blocked, 1 template-dep not run, 3 verified pass.
- **Mutation scope:** 0 mutations performed in this cycle (read-only verification only). Tester must explicitly approve mutation before any destructive step (Archive, Cancel session appointments) in subsequent runs.

## Knowledge Sync

- `docs/product/feature-map.md` — Defect entry, Last verified, Result row for PAC2-9001 (Updated 2026-10-15).
- `docs/product/workflows/appointment-book.md` — `## Logic từ ticket` section updated with OQ-033 RESOLVED, Block Session UX gap finding, automation coverage.
- `docs/product/open-questions.md` — OQ-1/OQ-030 marked Status: Open + carry-over evidence; OQ-033 marked Status: Answered with resolution.
- `docs/product/change-log.md` — Entry: 2026-10-15 / Updated / PAC2-9001 partial-complete + OQ-033 resolved + DEF-PAC2-9001-01 logged.

## Tester notes

[Protected area]
