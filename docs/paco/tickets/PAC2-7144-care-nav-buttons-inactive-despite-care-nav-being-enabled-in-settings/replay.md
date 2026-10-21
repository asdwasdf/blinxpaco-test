# PAC2-7144 Replay — Care nav buttons inactive despite care nav being enabled in settings

## Jira

- URL: https://blinxsolutions.atlassian.net/browse/PAC2-7144
- Status: Done
- Resolution: PASSED QA on FB (Sean Huynh 2026-10-07)

## Environment

- Host: `blinx.dev.blinxpaco-np.com`
- Role: `Blinx Deployment` / Johnny (2255) Bravo at `General Practice (Demo Site)`
- Browser: Chromium (Claude Playwright MCP)
- Execution: 2026-10-18

## Bug description

Care nav buttons inactive despite care nav being enabled in settings. When loading a patient into the care navigator, buttons are not selectable despite the Care Navigation config being active.

## Video evidence analysis

### Bug video (2026-07-03) — `117379-Care nav not working.mp4`
- 9.3 MB, 30s, 15 frames extracted
- Patient header shows lightbulb/warning indicator
- Left rail buttons (Care Plan, Investigations, etc.) **greyed out / inactive**
- Care Navigation setting confirmed enabled but buttons non-functional

### QA pass video (2026-10-07) — `128976-Screen Recording 2026-10-07 at 4.33.37 PM.mov`
- 13.7 MB, 66s, 33 frames extracted
- Patient loaded in Care Navigator
- Left-side navigation sidebar visible with **Care Plan, Investigations, VTE, Resus, Handover**
- Buttons **visible, properly styled, and selectable**
- Navigation through VTE Assessment, Discharge, Summary screens — all functional
- Form fields and controls render correctly in each category

### Fix verification
| | Bug (2026-07-03) | Fix (2026-10-07) |
|---|---|---|
| Care nav buttons | Greyed out / inactive | Visible, styled, selectable |
| Patient header | Warning lightbulb, blocked | Clean header, functioning nav sidebar |
| Left rail | Locked/disabled | Accessible |
| Category views | Not reachable | Fully functional (VTE, Resus, Handover, etc.) |

**Fix verified via video evidence.** PASS claim by Sean Huynh consistent with visual evidence.

## Live replay (2026-10-18)

### Auth
- Role: `Blinx Deployment` (Johnny Bravo) at `General Practice (Demo Site)`
- Login via SSO → dashboard OK

### Step 1: Dashboard — Care Nav buttons
- Initial load: `button "Patient Search"` + `button "Care Navigation"` present in DOM (`[ref=f8e413]`)
- Buttons disappeared after session re-authentication
- Root cause: buttons appear conditionally (organisation/role/session state)
- **Diagnosis: B (Invisible Care Nav buttons) — configuration or session state dependent**

### Step 2: Care Navigation patient search
- URL: `https://blinx.dev.blinxpaco-np.com/patient-search/`
- Page: `Patient Profile Search` with `Search Patients...` + `A-Z Search`
- Search "Test Patient": no results (ENVIRONMENT_ISSUE — patient not in scope)
- Top-bar global search: also no results
- **Diagnosis: C (Patient search returns no results) — test patient not in organisation scope**

### Step 3: Post-reauth dashboard
- Care Nav + Patient Search buttons absent from DOM
- Standard dashboard controls present (Dashboard, Appointment Book, CSV exports)
- No console errors related to Care Navigation

## Result

**`PARTIAL`** — Video evidence confirms fix works on feature branch; live replay on dev main blocked by:
1. Care Nav buttons render intermittently (session/role-dependent)
2. No test patient data in current organisation scope for Care Navigation
3. Feature branch environment not available for live verification

## Evidence

- Initial snapshot (buttons present): `page-2026-10-18T11-16-47-850Z.yml`
- Care Navigation page: `page-2026-10-18T11-17-05-360Z.yml`
- Bug video: `ticket/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/attachments/117379-Care nav not working.mp4`
- QA pass video: `ticket/PAC2-7144-care-nav-buttons-inactive-despite-care-nav-being-enabled-in-settings/attachments/128976-Screen Recording 2026-10-07 at 4.33.37 PM.mov`

## Next actions

1. **Verify on feature branch** — ticket says "PASSED QA on FB"; feature-branch host needed for live verification
2. **Find patient in Care Navigation scope** — current org doesn't have test patient data
3. **Check Care Navigation config** — navigate `Configuration → Patient → Care Navigation` to verify settings for `General Practice (Demo Site)`
