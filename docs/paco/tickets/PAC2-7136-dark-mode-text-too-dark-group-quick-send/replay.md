# PAC2-7136 Replay: PACO Connect - Dark Mode Text is too dark on Group Quick Send

## Jira
https://blinxsolutions.atlassian.net/browse/PAC2-7136

## Ticket summary
Dark Mode Text is too dark on Group Quick Send. Really Hard to see.

## QA result (original)
- **Feature Branch:** PASS — Alexander Paul 2026-10-07 (`20261007-1138-13.2817021.mp4`)
- **Dev:** PASS — Daniel Farley 2026-10-07 (`Dark mode pass.mp4`)

## Replay result: `VERIFIED`

### Execution log

| Step | Action | Result |
|---|---|---|
| 1 | Login PACO Connect | ✅ `blinx_johnny.bravo` / `Blinx Deployment` at `General Practice (Demo Site)` |
| 2 | Navigate to PACO Connect Dashboard | ✅ Dashboard loaded |
| 3 | Toggle dark mode | ✅ Theme switched to dark (`bgColor: rgb(6,7,10)`, `textColor: rgb(255,255,255)`) |
| 4 | Navigate to Comms Hub | ✅ `nhs-comms-hub-dev.blinxhealthcare.com` — dark mode applied (body `bgColor: rgb(6,7,10)`) |
| 5 | Open Campaign Manager | ✅ Grid rendered, dark mode confirmed |
| 6 | Filter Quick Send campaigns | ✅ Available Quick Send filter applied (campaign count updated) |
| 7 | Verify text contrast in dark mode | ✅ All text: white on `rgb(6,7,10)` — readable throughout UI |

### Evidence
- Comms Hub dark mode confirmed: `body.bgColor = rgb(6,7,10)`, `body.color = rgb(255,255,255)` via computed style
- Campaign Manager filter sidebar: white text on dark background ✅
- Campaign rows: white text on dark background ✅
- Status badges: visible and readable in dark mode ✅
- Quick Send filter: correctly lists Available Quick Send campaigns ✅
- Screenshot: `.playwright-mcp/page-2026-10-18T10-49-15-183Z.png`

## Confirmed knowledge
- Comms Hub inherits PACO Connect dark mode setting (session/theme shared via localStorage or session cookie)
- Dark mode text contrast fixed: white text (`rgb(255,255,255)`) on dark background (`rgb(6,7,10)`)
- PACO Connect and Comms Hub share dark mode state (toggle in PACO Connect applies to Comms Hub)
- Group Quick Send (Campaign Manager with Quick Send filter) fully readable in dark mode

## Linked tickets
- `PAC2-7138` — dark mode persistence after refresh (same flow, verified `VERIFIED` on `blinx.dev.blinxpaco-np.com` 2026-10-18)

## Classification
`VERIFIED` — dark mode text contrast issue resolved; fix confirmed on `nhs-comms-hub-dev.blinxhealthcare.com`.

## Environment
- Host: `nhs-comms-hub-dev.blinxhealthcare.com` (Comms Hub)
- PACO Connect host: `blinx.dev.blinxpaco-np.com`
- Role: Comms Hub authenticated (via PACO Connect session bridge)
- Executed: 2026-10-18T10:49:00Z
