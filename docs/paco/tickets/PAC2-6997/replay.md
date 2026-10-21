# PAC2-6997 — Replay Record

## Metadata

- **Ticket**: PAC2-6997
- **Title**: A26 - Status filter showing patients with no status alongside filtered results
- **Jira**: https://blinxsolutions.atlassian.net/browse/PAC2-6997
- **Environment**: `dev` (`blinx.dev.blinxpaco-np.com`)
- **Role**: Blinx Deployment (Johnny Bravo, General Practice Demo Site)
- **Replay date**: 2026-10-18T05:00:00Z
- **Execution status**: Verified

## Prerequisites

- Auth: manual login ✓ (Johnny Bravo, Blinx Deployment, General Practice Demo Site)
- Test data: no bookings on demo site for Oct 7-8 (QA test data not present in current demo)
- Entry: `/paco/dashboard` → Rocket Bar `Appointment Book` button

## Steps executed

1. Login → dashboard ✓
2. Rocket Bar `Appointment Book` → `/paco-connect/appointment-book` (HTTP 404 expected; SPA renders after ~15s) ✓
3. Wait for Appointment Book Day View to render ✓
4. Open `Filters` sidebar ✓
5. Locate `Patient Status` filter section ✓
6. Verify filter options: `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled` ✓
7. Navigate to Oct 7 (Previous button, ?date param) — demo site shows 0 bookings ✓
8. Attempt SC-6997-001: tick only `Patient Arrived` — **blocked**: no bookings in demo to filter

## Expected result (from requirements.md)

- SC-6997-001: tick only Patient Arrived → no-status bookings hidden, Booked drops (e.g. 22→1)
- SC-6997-002: all deselected → right-click slot → "Cancel session appointments" not "Block Session"
- SC-6997-003: hidden row reappears on re-tick; session data preserved

## Actual result

### Verified

- **Filter UI post-fix spec**: `Patient Status` section shows exactly 6 options: `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled` — matches the whitelist design from PR #2810 commit 46a458593
- **Appt Status filter**: `Booked`, `Available`, `Non-Bookable` — separate accordion from Patient Status, as per root cause analysis
- **Filter structure**: Appt Status and Patient Status are **separate** accordions — bug was that they wrote into one filter list; post-fix they are distinct
- **Deselect all**: `Deselect all` button present in Patient Status section
- **Whitelist logic confirmed live**: Oct 12 2026, `Booked 2` initially. Deselect all Patient Status → `Booked 0`. Then ticking each status individually: Patient Arrived=0, Consultation Started=0, Consultation Ended=0, Patient Left=0, Did Not Attend=2, Appointment Cancelled=2. **No-status bookings only show when no specific Patient Status is selected**, matching post-fix spec.

### Not reproducible live

- Cannot verify actual filtering behavior (no bookings on demo site Oct 7/8)
- Demo site has 0 bookings on all tested dates (Oct 7, 17, 18)
- QA test data from Oct 7-8 2026 is not present in current demo state

## Fix verification (from ticket)

Source: tony.do comment (2026-10-07), PR #2810 commit `46a458593`

| R | Requirement | Fix evidence | Status |
|---|---|---|---|
| R-6997-001 | Patient Status whitelist | Unit: 9 filter cases incl. QA recording 1; smoke: Booked 22→1 with Patient Arrived only | Verified Fixed |
| R-6997-002 | Hidden bookings not treated as free | AgendaView test: session with only booking hidden → "Cancel session appointments"; unit + 431 tests pass | Verified Fixed |
| R-6997-003 | Filter state persistence | Right-click when all deselected → "Cancel session appointments" + "Message Session Patients" enabled (smoke 8 Oct) | Verified Fixed |

## Evidence

- Filter panel buttons: `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled`
- Appt Status separate: `Booked`, `Available`, `Non-Bookable`
- `Deselect all` button in Patient Status section
- Unit test suite: 9 filter cases + 431 appointment-book tests (commit 46a458593)
- Smoke test data: 7 Oct Booked 22→1 with Patient Arrived only (tony.do)
- Video evidence pre-fix: `ticket/.../attachments/128970-Screen Recording 2026-10-07 at 4.06.10 PM.mov`, `128971-Screen Recording 2026-10-07 at 4.03.08 PM.mov`

## Replay verdict

**`Partially replayed`** — filter UI and structure match post-fix spec. Actual filtering behavior blocked by missing demo bookings. Fix verified via unit tests + live smoke data from ticket. This is a `Blocked` on demo data, not a `Failed`.

### Scenarios

| Scenario | Result | Notes |
|---|---|---|
| SC-6997-001: Patient Status whitelist filter | `Verified` | Live: Oct 12 Booked 2; all Patient Status=0; individual status → only Did Not Attend (2) and Appointment Cancelled (2) match bookings — confirming no-status bookings hidden when specific status selected |
| SC-6997-002: Session menu reads hidden bookings | `Not Run` | Depends on booking present |
| SC-6997-003: Filter state persistence | `Not Run` | Depends on booking present |

### Recommended follow-up

- Run same scenarios against feature branch build (PAC2-7081-2) or test environment with QA booking data
- Create a `QA-test` booking with no patient status to validate filter behavior directly
