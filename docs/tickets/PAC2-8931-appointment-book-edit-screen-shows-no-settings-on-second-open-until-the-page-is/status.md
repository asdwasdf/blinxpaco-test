# PAC2-8931 Status

**Ticket:** PAC2-8931 — Appointment book edit screen shows no settings on second open until the page is refreshed  
**Phase:** EXPLORE  
**Updated:** 2026-10-07

## Bug Summary

- **Issue:** Edit screen for Appointment Book shows blank settings on 2nd+ open
- **Steps:** Open edit → close/save → open edit again → settings blank
- **Workaround:** Page refresh fixes temporarily
- **Root cause (suspected):** State not cleared between modal closes

## Completed

- [x] ANALYZE — requirements.md + video review (85% understanding)
- [x] LOCATE — confirmed route and edit panel

## Route Confirmed

- URL: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8931/configuration/#appointment-books`
- Entry: `Configuration` → tree `Appointment Books` → `Appointment Books` (leaf)
- Edit panel: right-side drawer with `Name` textbox + `Shared Organisations` pills

## Checkpoint

LOCATE done → `EXPLORE` (observe the bug behavior: first open vs second open)

## Next Action

Open edit panel twice to observe: first open = settings displayed, second open = settings blank
