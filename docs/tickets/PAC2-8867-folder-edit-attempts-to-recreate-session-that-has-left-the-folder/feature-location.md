# Feature Location: PAC2-8867

**LOCATE completed:** 2026-10-06T14:30:00Z
**Environment:** dev
**Role:** Admin (Johnny Bravo — Blinx Deployment)
**URL:** https://blinx.dev.blinxpaco-np.com/paco-connect/configuration

## Entry Path

1. `/paco/dashboard` → click sidebar `Appointment Book` → submenu `Appointment Settings`
2. URL redirects to `/paco-connect/configuration`
3. Wait for sessions grid to load (16,406 rows)
4. Folder templates visible in grid with expand/collapse arrow (e.g., `AP8862 QA (Template — 1 session)`)
5. Click expand arrow to show child sessions

## Route Summary

| Field | Value |
|---|---|
| Entry | `/paco/dashboard` → `Appointment Book` → `Appointment Settings` |
| Route | `/paco-connect/configuration` |
| Role | Admin/Configuration access |
| Landmarks | `Search Session...`, `Show archived` toggle, grid with `Session Name`/`Actions`, `Add Session` menu |
| Note | HTTP 404 on route but SPA renders; wait for `Loading sessions` to finish |

## Observed

- **Folder template display:** `(Template — N sessions)` suffix in grid cell
- **Expand/collapse:** Click `▾` arrow in grid cell to toggle
- **Child sessions:** Appear indented below parent template row when expanded
- **Actions column:** Buttons for each row (Edit, View Audit, Archive, Clone, etc.)
- **Grid size:** 16,406 total sessions

## Candidates

1. **Folder template expand/collapse** — Verified working
2. **Session row actions** — Buttons visible, not tested (mutation)
3. **Edit Session drawer** — Opens from row actions, not tested (mutation)

## Route Sync

Update `docs/product/feature-map.md`:
- Add entry under `#### Appointment Settings — Sessions configuration`
- Classification: `Observed`
- Source: `PAC2-8867/feature-location.md`

## Budget

- Views: 2 (config page, expanded template)
- Minutes: ~10
- Next: `EXPLORE` — observe folder edit behavior, then `TEST_DESIGN`

## Notes

- Video evidence: `ticket/attachments/128874-Dupe session.mp4` (1:22-4:00)
- Key manifestation in video: Edit Session dialog `Session Name` blank when opening on session that left folder
