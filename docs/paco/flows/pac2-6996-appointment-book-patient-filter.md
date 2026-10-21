# Appointment Book — Patient Filter (PAC2-6996)

**Aliases**: Patient filter, Patient Name filter, filter menu

## Classification

Read-only flow — UI verification

## Entry

`https://blinx.dev.blinxpaco-np.com/paco/dashboard` → Rocket Bar `Appointment Book` → toolbar `Filters` button

## Route

`/paco-connect/appointment-book` (filter sidebar opens as right-side panel)

## Role

`Blinx Deployment` at `General Practice (Demo Site)`

## Environment

`dev`

## Source

PAC2-6996 (replay.md, live replay 2026-10-18)

## Logic chính

- Toolbar `Filters` button (icon-only, title="Filters") at toolbar right edge (≈x=2498, y=177 in viewport)
- Filter sidebar: 6 accordions — Healthcare Professional, **Patient**, Appointment Type, Slot Type, Session Name, Location
- Patient accordion expands to show search input + filtered patient list (live search, no static options)
- State pre-fix: blank filter option appeared under Patient Name section (bug captured in smoke test screenshot)
- State post-fix: no blank option; search returns "No results found" when no patients match
- Sidebar can be closed via Escape key or clicking outside

## Defect đã biết

- `PAC2-6996` Resolved: pre-fix — blank filter option under Patient Name in filter menu. Fix deployed 2026-10-07. Live regression verified 2026-10-18.

## Evidence

- `evidence/pac2-6996-appt-book-pre-filters.png`
- `evidence/pac2-6996-filter-panel.png`
- `evidence/pac2-6996-patient-filter-search.png`
