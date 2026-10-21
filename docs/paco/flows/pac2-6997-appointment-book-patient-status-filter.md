# Appointment Book — Patient Status Filter (PAC2-6997)

**Aliases**: Patient Status filter, Patient Status whitelist, Patient Status accordions

## Classification

Bug fix verified — Read-only flow, UI verification

## Entry

`https://blinx.dev.blinxpaco-np.com/paco/dashboard` → Rocket Bar `Appointment Book` → toolbar `Filters` button

## Route

`/paco-connect/appointment-book` (filter sidebar opens as right-side panel; HTTP 404 on initial load is expected — SPA renders after 10-15s)

## Role

`Blinx Deployment` at `General Practice (Demo Site)`

## Environment

`dev`

## Source

PAC2-6997 (replay.md, live replay 2026-10-18)

## Logic chính

- Toolbar `Filters` button (icon-only, title="Filters") at toolbar right edge
- Filter sidebar: 6+ accordions — Healthcare Professional, Patient, Appointment Type, Slot Type, Session Name, Location, **Appointment Status**, **Patient Status**
- Appointment Status accordion (separate from Patient Status): `Booked`, `Available`, `Non-Bookable`
- Patient Status accordion (whitelist): `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled`
- `Deselect all` button in Patient Status section
- A booking with **no** patient status only appears when: `Booked` is ticked AND none of Patient Arrived/Consultation Started/Consultation Ended/Patient Left/DNA is unticked
- Unticking only `Appointment Cancelled` keeps no-status bookings visible (cancelled appointments are unlinked from slots)
- Deselecting every patient status hides all bookings
- Rows hidden by Patient Status filter are NOT bookable, but session actions read the full session (including hidden bookings)
- Session context menu: "Cancel session appointments" (not "Block Session") when all bookings are filtered out
- Sidebar can be closed via Escape key or clicking `×` button

## Defect đã biết

- `PAC2-6997` Fixed: pre-fix — patients with no patient status shown alongside filtered results when a specific status selected (e.g. Patient Left). Fix deployed 2026-10-07 commit 46a458593 (PR #2810 branch PAC2-7081-2). Verified: unit 9 filter cases + 431 tests pass; smoke Booked 22→1 with Patient Arrived only.
- `PAC2-6997` Fixed: pre-fix — deselecting a patient status removed the booked row from session, causing "Block Session" instead of "Cancel session appointments" in context menu. Fix: session actions now read full session including hidden bookings.

## Evidence

- Filter panel options confirmed: 6 Patient Status + 3 Appt Status options
- `Deselect all` button present
- Unit test suite: 9 filter cases + 431 appointment-book tests (PR #2810)
- Smoke data: 7 Oct Booked 22→1 with Patient Arrived only (tony.do, 2026-10-07)
