# Appointment Book — Patient Status Reset / Change (PAC2-7127)

**Aliases**: reset Consultation Ended, change patient status, remove status, clear status

## Classification

Bug fix verified on feature branch — mutation flow

## Entry

`https://blinx.dev.blinxpaco-np.com/paco-connect/appointment-book` (Day or Week view)

## Route

`/paco-connect/appointment-book` (SPA, HTTP 404 on initial load expected)

## Role

`Blinx Deployment` (Super Admin equivalent) at `General Practice (Demo Site)`

## Environment

`dev` (feature branch of PAC2-7127 used for QA)

## Source

PAC2-7127 (replay.md, QA comments + video evidence, 2026-10-07)

## Logic chính

1. **Single click** on patient slot → opens `Appointment Details` sidebar on the right with patient info + `Mark as: Select Patient Status` chevron-down. `[Confirmed: Pass]` — PAC2-8575/exploration.md OBS-001, PAC2-7127 QA pass
2. **Dropdown options**: `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled` — from PAC2-6997 Patient Status filter accordion
3. **Change status**: click chevron-down → select different status → `Save` button → status persists
4. **Reset/clear status**: select empty/blank option or click X on status chip → status clears
5. **Original bug (pre-fix)**: attempting to reset "Consultation Ended" threw error "Reset failed, but status cleared locally" and status did NOT actually clear
6. **Post-fix**: status change/reset works without error; new status persists after save

## Defect đã biết

- `PAC2-7127` **Resolved**: pre-fix — error "Reset failed, but status cleared locally" when trying to remove Consultation Ended status; status not cleared. Fix deployed 2026-10-07 on feature branch. QA passed on FB 2026-10-07 (Sean Huynh + Abbi Russell).
- `PAC2-7127` Regression on dev main: **Not verified** — booked slots render off-screen in Week view; direct navigation to booked appointment blocked. Dev main regression status unknown.

## Evidence

- Bug video (2026-07-03): `ticket/PAC2-7127/attachments/117324-20260703-0837-49.5047989.mp4`
- QA pass Sean: `ticket/PAC2-7127/attachments/128962-Screen Recording 2026-10-07 at 3.43.53 PM.mov`
- QA pass Abbi: `ticket/PAC2-7127/attachments/129060-save.mp4`

## Chi tiết

- `docs/paco/tickets/PAC2-7127/replay.md`
- `docs/product/workflows/appointment-book.md#single-click-arrive-pac2-8575`
- `docs/paco/flows/pac2-6997-appointment-book-patient-status-filter.md`
