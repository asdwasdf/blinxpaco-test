# PAC2-7138 Replay: PACO Connect — Dark Mode resets to Light Mode when refreshing browser

## Jira
https://blinxsolutions.atlassian.net/browse/PAC2-7138

## Ticket summary
Dark Mode resets to Light Mode when refreshing browser. If a user selects dark mode, it should retain that choice unless changed by the user.

## QA result (original)
- **PASS** — Alexander Paul, 2026-10-07
- Evidence: `20261007-1133-28.3204317.mp4`

## Replay result: `VERIFIED`

### Execution log

| Step | Action | Result |
|---|---|---|
| 1 | Login PACO Connect | ✅ `blinx_johnny.bravo` / `Blinx Deployment` at `General Practice (Demo Site)` |
| 2 | Open PACO Connect Dashboard | ✅ `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` |
| 3 | Check initial theme state | ✅ Body bg: `rgb(38,42,60)` — dark mode active (from previous session) |
| 4 | Toggle dark → light mode | ✅ Click `Switch to light theme` button → body bg: `rgb(245,247,249)` |
| 5 | Verify localStorage persistence | ✅ `selected-ui-theme: "light"` stored in localStorage |
| 6 | Refresh page | ✅ Body bg: `rgb(245,247,249)` — light mode **retained** |
| 7 | Toggle light → dark mode | ✅ Click `Switch to dark theme` → body bg: `rgb(38,42,60)`, ls: `dark` |
| 8 | Refresh page | ✅ Body bg: `rgb(38,42,60)`, button: `Switch to light theme` — dark mode **retained** |

### Theme persistence evidence

```
Light mode toggle → localStorage['selected-ui-theme'] = "light" ✅
Light mode refresh → bodyBg = rgb(245,247,249), button = "Switch to dark theme" ✅

Dark mode toggle → localStorage['selected-ui-theme'] = "dark" ✅
Dark mode refresh → bodyBg = rgb(38,42,60), button = "Switch to light theme" ✅
```

Theme key: `localStorage['selected-ui-theme']` — persists across sessions and page refreshes.

### Confirmed knowledge
- Dark mode preference stored in `localStorage['selected-ui-theme']` (`"light"` or `""dark"`)
- Theme toggle button: sidebar icon with `alt="Switch to light/dark theme"`, parent is a `<button>`
- Bug **FIXED**: theme now persists across page refresh on `blinx.dev.blinxpaco-np.com`
- Toggle button label correctly reflects current state after refresh (`"Switch to light theme"` when dark, vice versa)

## Classification
`VERIFIED` — dark mode preference persists after page refresh on dev host.

## Environment
- Host: `blinx.dev.blinxpaco-np.com`
- Role: `Blinx Deployment` (Johnny Bravo 2255)
- Executed: 2026-10-18T11:11:38Z

## Flow deduplication
Dark mode is a **global setting** applicable to multiple PACO Connect pages. Not a dedicated flow — linked from `PAC2-7136` replay.
