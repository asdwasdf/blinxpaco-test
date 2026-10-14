# Feature Location: PAC2-9001

**Input Revision:** 2
**Generated:** 2026-10-13T15:00:00Z (rev 1)
**Re-generated:** 2026-10-13T16:05:00Z (rev 2 — after re-auth, LOCATE attempt-4)
**Status:** Active
**Mode:** `locate` (rev 2 attempt-4 inconclusive on OQ-4)

## Scope

Ticket PAC2-9001 ("PBT-334 - Cancelling session needs to be behind a admin type RBAC") yêu cầu tách quyền cancel session khỏi `Appointment Book User`, tạo activity mới `P7032 - Appointment Book Cancel Session`. Code đã build/merge ở 3 PR (paco-connect-be #792, paco-one-db #1022, connect-fe #2875) nhưng **P7032 chưa Confirmed visible trên dev host** (LOCATE rev 1 attempt-3 + rev 1.5 manual session 15:13Z: max P-code trong RBAC list = P7507, không thấy P7032).

## Environment

- **Base URL:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/`
- **Host:** dev (One-PACO), `blinx.dev.blinxpaco-np.com`
- **Role observed (LOCATE rev 1 + rev 2):** `Super Admin GB` (Test Fiona Nguyen, auto-include P7032 qua backend role mapping — không phù hợp test "không thấy Cancel session" cho REQ-002).
- **Browser tab:** `playwright-user` (cookie session live; re-authed 2026-10-13T15:54Z sau attempt-3 auth drop).

## Routes observed (feature-branch scope)

### R-1 · `/paco-connect/feature-branch/pac2-9001/dashboard` — Confirmed
- Entry: navigate tới `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/` → URL rewrite thành `/dashboard`.
- Title: `PACO Connect`.
- Sidebar: `Dashboard`, `Appointment Book`, `Appt. Book`, `Configuration`, `Rocket Bar`. (rev 2 attempt-4 re-verified)
- Header: `TFN / Test Fiona Nguyen / Super Admin GB / General Practice (Demo Site)`.
- Classification: `Observed` (2026-10-13T15:00:00Z, re-verified 2026-10-13T16:00:00Z).

### R-2 · `/paco-connect/feature-branch/pac2-9001/appointment-book` — Confirmed (route) / Entry point incomplete
- Entry: sidebar `Appointment Book`.
- Title: `PACO Connect`.
- Header (rev 2): `Sessions 45 / Booked 2 / Available 2,078 / LIVE 1 / Quick Book`. Day view date 13 October 2026.
- Session card UI structure (rev 2 verified 2026-10-13T16:00:00Z):
  - 2 buttons on session header:
    - `Edit (pencil icon, color pink rgb(225, 8, 121))` — class `mx-3 aria-disabled:opacity-50`, `aria-disabled="false"` (style only, not real disabled), innerHTML = `<svg data-icon="pencil" ...>`. Action: **opens EDIT SESSION drawer** (p-sidebar) with form fields (Session Name, Session Type, Slot Duration, Time Range, Assigned Slot Types, Assigned Appointment Book, Service provider, Assigned Locations, Assigned Staff) + footer `Cancel` / `Save`.
    - `Note icon` — class `bx-session-note-icon me-3`, `aria-label="Add a note to this session"`.
  - 0 Cancel/Block/Remove Session button on session card.
  - Right-click on session name (`a.p-accordion-header-link`) = no context menu opens (rev 2 attempt-4 15:58Z verified via both JS dispatch + Playwright `button: right`).
- **EDIT SESSION drawer** (rev 2 attempt-4 16:00Z verified):
  - Class: `_session-edit-or-add-slidebar_rzrcz_56` (p-sidebar)
  - 8 buttons: Close (X), eye/View icon, Time Range accordion, 3 dropdown triggers, Cancel (footer), Save (footer, `aria-label=submit-changes`)
  - 0 Cancel session / 0 Block session / 0 Remove session entry in drawer.
- Classification: `Observed` (route + session card UI + drawer); entry point for "Cancel session appointments" still `Inconclusive` (OQ-4 open).

### R-3 · `/paco-connect/feature-branch/pac2-9001/configuration` — Confirmed
- Entry: sidebar `Configuration`.
- Sub-menu: `Organisation`, `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation`.
- Default content: `Appointment Books` → `Sessions` table — Session Name, Assigned Slot…, Weekdays, Frequency, Actions. Per-row `…` kebab under Actions.
- Classification: `Observed` (rev 1). Re-verify rev 2 deferred (budget priority on entry-point shape).

### R-4 · `/paco/configuration/staff/role-groups` — Confirmed (route) / P7032 NOT visible
- Actual working path: `https://blinx.dev.blinxpaco-np.com/paco/configuration/staff/role-groups` (PAC2-OS rewrite, NOT `/paco-connect/feature-branch/pac2-9001/configuration/staff/role-groups` which 404).
- Entry: navigate from FB scope `Configuration` → `Users & Staff` → `Role Groups` menu, hoặc direct URL (SPA rewrites to PAC2-OS host).
- Page content: 126 RBAC activities, max P-code = `P7507`, has `P7030` (Appointment Book User) prerequisite.
- P7032 (`Appointment Book Cancel Session`) **NOT visible** in the list (rev 1.5 manual 15:13Z + carry-over rev 2).
- Inferred cause: `paco-one-db #1022` chưa deploy trên dev host, hoặc P-code khác với P7032 (per `Plan approved` comment cũ "Waiting on a dev-DB lookup for the real P-code").
- Classification: `Observed` (route works); P7032 visibility = `Inconclusive` (OQ-1 still open).

## Reusable routes (verified)

- `/paco-connect/feature-branch/pac2-9001/{dashboard,appointment-book,configuration}` (FB scope)
- `/paco/configuration/staff/role-groups` (PAC2-OS rewrite)
- Reusable route within session card: pencil icon → EDIT SESSION drawer (read-only OK).

## Candidates (chưa verified)

- **C-1:** Cancel session entry point — checked 3 locations (session card buttons, right-click, EDIT SESSION drawer), không tìm thấy. Possible untested:
  - Patient slot row level (kebab inside slot row)
  - Session detail page (click session name to navigate, not expand)
  - Week / Month / Year view
  - Patient row inside expanded accordion (e.g. Temi PCN session 10:30 slot 1/1343 — right-click patient row)
  - Configuration > Sessions row-kebab `…` → Cancel option (per video step 6/6, OQ-3 not verified).
- **C-2:** Time-edit dialog (REQ-008) — not visible in this attempt. Per `video-notes.md` step 5/6, EDIT SESSION modal for booked session "locks the session times" + right-side `Session settings` form for name/location/staff (not time). Time-edit cancellation dialog (affected patients list) chưa captured. Per rev 2 QA notes "Session times are already locked in the editor when a session has bookings, so the edit dialog mainly appears for template edits whose generated sessions still hold bookings outside the template times".
- **C-3:** Block session on booked session — video step 2/6 tested trên empty session (Conflict test 48 slots), PASS. OQ-2 (block on session with bookings) still open.
- **C-4:** Configuration → Sessions row-kebab Cancel (Admin-only per matrix) — not verified in attempt-4 (budget priority on entry-point shape).

## Budget

- Views used (cumulative rev 2 attempt-4): 7/12 (2 nav re-auth + 4 in `/appointment-book` + 1 right-click + 1 EDIT drawer verify)
- Time used: ~9/15 minutes
- Outcome: **Inconclusive** on OQ-4 (entry-point shape). R-1/R-2/R-3/R-4 Confirmed.

## Next action

MANUAL_EXECUTE phase sẽ capture entry-point via:
1. Right-click on patient row inside expanded session (Temi PCN session 10:30 slot 1/1343) — likely shows action menu with Cancel session / Block session entries (matches typical Paco session context menu pattern).
2. Configuration > Sessions row-kebab for Super Admin — verify Cancel option visible + clickable (vs Access Denied for User role).
3. Pending OQ-1 (P7032 deploy): tester cần confirm với dev team nếu P7032 vẫn không visible trong Role Groups list.

## Route sync

- `docs/product/feature-map.md` — entry: `Appointment Book — feature-branch route (PAC2-9001)` (Classification: `Observed`, Source: `PAC2-9001/feature-location.md`, Last verified: `2026-10-13`).
- Routes Confirmed: `/paco-connect/feature-branch/pac2-9001/{dashboard,appointment-book,configuration}` + `/paco/configuration/staff/role-groups`.

## Tester notes

[Protected area]
