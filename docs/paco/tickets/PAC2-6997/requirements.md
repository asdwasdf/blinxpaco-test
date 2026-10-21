# PAC2-6997 — Requirements

## Metadata

- **Ticket**: PAC2-6997
- **Title**: A26 - Status filter showing patients with no status alongside filtered results
- **Source**: Jira import `ticket/PAC2-6997-a26-status-filter-showing-patients-with-no-status-alongside-filtered-results/ticket.md`
- **Imported**: 2026-10-07
- **Resolution**: Done (fix deployed 2026-10-07, commit 46a458593, PR #2810, branch PAC2-7081-2)

## Modules affected

- PACO Connect — Appointment Book
- PACO Connect — Day View (scheduler)
- PACO Connect — Session menu actions

## Roles

- Blinx Deployment / General Practice staff using Appointment Book Day/Week/Month views

## Functional requirements

### R-6997-001 — Patient Status whitelist filter (Fixed)

**Classification**: `Bug` → `Verified Fixed`
**Provenance**: ticket.md comment (tony.do 2026-10-07), QA retest steps

When Patient Status filter is active (one or more statuses selected, e.g. "Patient Left"):

- Only bookings whose patient status matches a **selected** patient status are displayed
- Bookings with **no** patient status must **not** appear alongside filtered results
- Bookings with no patient status only appear when: `Booked` (Appt Status) is ticked AND **none** of Patient Arrived / Consultation Started / Consultation Ended / Patient Left / DNA is unticked

**Expected behaviour** (post-fix):
- Tick only `Patient Arrived` → bookings with no patient status are hidden
- Tick `Booked` + no Patient Status ticked → no bookings shown
- Tick only `Appointment Cancelled` → no-status bookings still visible (cancelled appointments are unlinked from slots)

### R-6997-002 — Hidden bookings must not be treated as free

**Classification**: `Bug` → `Verified Fixed`
**Provenance**: ticket.md comment (tony.do 2026-10-07)

Rows hidden by Patient Status filter are **not** bookable (no gap rows, no click-to-book on calendar, no drag-drop on hidden slot).

However, session-wide actions must consider **all** slots in the session, including hidden bookings:

- Session context menu: "Cancel session appointments" (not "Block Session") when all bookings are filtered out
- Block Session slot list must include hidden booked slots
- Multi-slot move span checks include hidden booked slots
- Week/Month view block/cancel gating reads full session

**Expected behaviour** (post-fix): right-click a slot when all Patient Status are deselected → session menu shows "Cancel session appointments" + "Message Session Patients" enabled.

### R-6997-003 — Filter state does not persist across deselect/reselect

**Classification**: `Bug` → `Verified Fixed`
**Provenance**: ticket.md comment Sean Huynh + tony.do

**Pre-fix behaviour**: Deselecting a patient status removes the booked row from session; re-selecting the same status brings the row back. This caused confusion because the row appears/disappears.

**Post-fix behaviour**: The row still disappears from the board (by design), but the underlying session data is unchanged. Re-ticking a Patient Status brings the row back — this is correct behaviour.

## Setup requirements

- Dev environment (`blinx.dev.blinxpaco-np.com`)
- Auth: manual (logged in as Deployment role)
- Test data: booking with no patient status on a known date (e.g. "111 PC24" 7 Oct 2026, or "Sean Test 8873" 8 Oct)
- Appointment Book Day View access

## Acceptance criteria

- Only patients matching selected Patient Status shown in filtered results
- No-status bookings excluded when specific Patient Status selected
- Session actions read full session including hidden bookings

## Test scenarios (from QA retest steps)

1. Day view, 7 Oct — tick only Patient Arrived → Booked count drops from 22 to 1; no-status bookings gone
2. Deselect all Patient Status → Booked 0
3. 8 Oct, all Patient Status deselected → right-click slot → session menu shows "Cancel session appointments" not "Block Session"

## Evidence sources

- `ticket/PAC2-6997-.../attachments/128970-Screen Recording 2026-10-07 at 4.06.10 PM.mov` — bug evidence (no-status showing alongside filtered)
- `ticket/PAC2-6997-.../attachments/128971-Screen Recording 2026-10-07 at 4.03.08 PM.mov` — deselect removes booked row
- Unit tests: 9 filter cases + 431 appointment-book tests pass
- Live smoke on FB build 46a458593

## QA retest verdict

- **R-6997-001**: Pass (verified post-fix, FB build 46a458593)
- **R-6997-002**: Pass (verified post-fix)
- **R-6997-003**: Pass (row reappears on re-tick; session data preserved)
