# Care Navigator — Patient View Buttons (PAC2-7144)

**Aliases**: Care Navigation, care nav buttons, care navigator buttons, inactive buttons

## Classification

Bug fix verified on feature branch — read-only observation on dev main

## Entry

`https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` → click `Care Navigation` button

## Route

`/patient-search/` (Care Navigation patient search) → search → select patient → Care Navigator view

## Role

`Blinx Deployment` (Super Admin equivalent) at `General Practice (Demo Site)`

## Environment

`dev` (feature branch of PAC2-7144 used for QA 2026-10-07)

## Source

PAC2-7144 (replay.md, QA comments + video evidence, 2026-10-07)

## Logic chính

1. **Dashboard Care Nav buttons**: `Patient Search` + `Care Navigation` buttons appear conditionally (session/org/role dependent)
2. **Care Navigation patient search**: `Patient Profile Search` at `/patient-search/` with `Search Patients...` + `A-Z Search`
3. **Patient load**: Search by name → select patient → loads in Care Navigator
4. **Bug (pre-fix)**: Patient loaded but left rail buttons (Care Plan, Investigations, VTE, Resus, Handover) greyed out / inactive despite Care Navigation setting enabled
5. **Patient header**: Pre-fix shows lightbulb/warning indicator; post-fix clean header
6. **Post-fix**: Left-side navigation sidebar fully functional — all category buttons visible, styled, selectable
7. **Category views**: VTE Assessment, Discharge, Summary screens all render with forms and controls

## Bug video (2026-07-03)

`ticket/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/attachments/117379-Care nav not working.mp4`

- Left rail buttons: greyed out / inactive
- Patient header: lightbulb/warning indicator visible
- Care Navigation setting: enabled but non-functional

## QA pass video (2026-10-07)

`ticket/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/attachments/128976-Screen Recording 2026-10-07 at 4.33.37 PM.mov`

- Left rail buttons: visible, styled, selectable
- Patient header: clean
- Full navigation: Care Plan, Investigations, VTE, Resus, Handover — all accessible
- VTE Assessment, Discharge, Summary: forms render correctly

## Defect đã biết

- `PAC2-7144` **Resolved**: pre-fix — Care Navigator buttons greyed out despite config active; fix deployed 2026-10-07 on feature branch. QA passed on FB 2026-10-07 (Sean Huynh).
- `PAC2-7144` Regression on dev main: **Not verified** — Care Nav buttons render intermittently (session/org-dependent); test patient data unavailable in current org scope.

## Evidence

- Bug video: `ticket/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/attachments/117379-Care nav not working.mp4`
- QA pass: `ticket/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/attachments/128976-Screen Recording 2026-10-07 at 4.33.37 PM.mov`
- Replay: `docs/paco/tickets/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/replay.md`

## Chi tiết

- `docs/paco/tickets/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/replay.md`
- `docs/product/survey/views/patient-care-navigation.md`
- `docs/product/survey/views/care-navigation-patient-search.md`
