# Manual Test — PAC2-8999 (Cancel audit regression of PBT-252)

**Date:** 2026-10-15 14:49  
**Environment:** dev  
**Branch:** `pac2-8999` (PACO + PACO Connect)  
**URLs:**  
- PACO Connect: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8999/appointment-book`  
- PACO: `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-8999/patient-search`  
**Actor UI:** `Johnny (2255) Bravo` (role `Super Admin GB` — not re-verified)  
**Test patient (pre-existing on dev):** `Floy adhoc`, NHS `76835143`, DOB 21/01/1970  
**Test session:** `PAC2-7786 Temi PCN`, 15/10/2026, 08:00–16:00  
**Test slot:** 15:00–15:10 (10 min, `Home Visit FJ`, `Face to Face`)  
**Overall:** **Fail** (REQ-001 cancel audit)

---

## Result Matrix

| Step | Action | Pass/Fail | Note |
|---|---|---|---|
| 1 | Capture baseline audit on Floy | **Pass** | 10 rows, no `cancelled` entry pre-test |
| 2 | Book slot 15:00 via Quick Book | **Pass** | `POST /api/appointments/create` 201, slot filled |
| 3 | Verify booking audit | **Pass** | 2 rows: `appointment-create` + `appointment-book-appointment-create`, actor Johnny Bravo |
| 4 | Open appointment details sidebar | **Pass** | Sidebar renders full metadata, `Booked By: Johnny (2255) Bravo` |
| 5 | Open `Mark as:` status menu | **Pass** | 6 menuitems: Patient Arrived / Consultation Started / Consultation Ended / Patient Left / Did Not Attend / Cancel |
| 6 | Click `Cancel` (attempt 1) | **Fail** | No confirm dialog, no API call, no state change |
| 7 | Click `Cancel` (attempt 2 + 3) | **Fail** | Reproducible no-op across click strategies |
| 8 | Verify cancel audit | **Fail** | No `cancelled appointment` row added |

| REQ | Verdict |
|---|---|
| REQ-001 (cancel appointment logged in patient audit) | **Fail** |
| REQ-002 (book appointment logged in patient audit) | **Pass** |

---

## Step-by-step

### Step 1 — Baseline audit (BEFORE)

PACO `/paco/feature-branch/pac2-8999/patient-search` → search "adhoc" → open `Floy adhoc` (NHS 76835143) → actions menu → `View Audit`.

**Result: Pass.** 10 rows loaded. No row containing `cancelled` or `appointment` for this patient. Categories: `Risk stratification`, `Patient record`. Newest row pre-test: `8/31/2026 4:45:10 PM Risk Strat · Calculate · Bulk` (Gareth Bartlett).

### Step 2 — Book appointment

PACO Connect → Day view 15/10/2026 → scroll session `PAC2-7786 Temi PCN 08:00-16:00` → click free slot 15:00 → `Quick Book Appointment` dialog → `Patient Search` tab → type "Floy" → click dropdown row `Floy adhoc NHS No: 76835143` → defaults: session `PAC2-7786`, Appt Type `Face to Face`, Email & SMS `Home Visit FJ (SMS)`, Location `Temi PCN` → click `Book Appointment` → `Recommended Appointment` confirmation dialog → click `Book Appointment` again.

**Result: Pass.** `POST /api/appointments/create` → **201 Created**, followed by `POST /api/appointments/sendBookedAppointmentAnalytics` → 200. Calendar slot 15:00–15:10 changed from `Home Visit FJ` (free) → `Mr Floy adhoc`. Toolbar: `Booked 4 → 5`, `Available 1,020 → 1,019`.

### Step 3 — Verify booking audit (REQ-002)

Reopen Floy audit dialog in PACO.

**Result: Pass.** 2 new rows at top:

| Timestamp | summaryLabel | categoryLabel | user | rawAction |
|---|---|---|---|---|
| `10/15/2026 2:23:20 PM` | `Booked appointment` | `Appointment Create` | Johnny (2255) Bravo | `appointment-create` |
| `10/15/2026 2:23:19 PM` | `Booked appointment` | `Appointment Book Appointment Create` | Johnny (2255) Bravo | `appointment-book-appointment-create` |

- Actor: `Johnny (2255) Bravo` (matches logged-in user)
- Timestamps: 14:23:19 / 14:23:20 (matches click time)
- Wording: `Booked appointment` (noun phrase, not full sentence per dev's `<user> cancelled appointment` hint, but actor + action clear)

**Verdict REQ-002: Pass** on dev build `pac2-8999`. Dev's note (2026-10-13) that "booking not logged" doesn't reproduce on dev is confirmed.

### Step 4 — Open appointment details sidebar

Click slot `15:00 Mr Floy adhoc` on calendar → `p-sidebar` "Appointment Details" opens right.

**Result: Pass.** Sidebar fields: Patient `Mr Floy adhoc` / NHS `76835143`, Date `15/10/2026`, Duration `10 mins`, Session `Home Visit FJ`, Patient `Mr Floy adhoc`, HCP `ammar 01022295446`, Appt Type `Face to Face`, Appt Location `Temi PCN`, Home Practice `General Practice (Demo Site)`, Service Provider `General Practice (Demo Site)`, Service Provider ODS `YGMQJ`, Start `15/10/2026 15:00`, End `15/10/2026 15:10`, **Booked By: `Johnny (2255) Bravo`**. Editable: `Slot Count: 1 slot (ends 15:10)`, `Reason Code(s): Select Reason Codes`, `Booking Notes: <empty>`. Action: `Mark as: <Select Patient Status>` + chevron `aria-label="patient-status-button"`.

### Step 5 — Open `Mark as:` status menu

Click chevron `aria-label="patient-status-button"`.

**Result: Pass.** Menu opens with 6 options (role=`menuitem`):

1. `Patient Arrived`
2. `Consultation Started`
3. `Consultation Ended`
4. `Patient Left`
5. `Did Not Attend`
6. `Cancel` (accessible name `Cancel Appointment`)

Portal position: right edge x≈1632, y 428–620.

### Step 6 — Click `Cancel` (attempt 1)

Click `[role="menuitem"]` text `Cancel` (DOM id `pr_id_2486_5`).

**Result: Fail — Cancel is a no-op.**
- No `<dialog>` / `p-confirm-dialog` / `p-dialog` appeared
- No `PATCH` / `PUT` / `DELETE` / `POST` to any `/api/appointments/.../cancel` endpoint (only recurring `sessions-appointments` poll + `provider-shift-status/me/heartbeat` after click)
- Sidebar `Mark as: <still "Select Patient Status">` — local React state unchanged
- Calendar slot unchanged: `15:00–15:10` still `Mr Floy adhoc`
- `Booked` stat still `5`

### Step 7 — Click `Cancel` (attempts 2 + 3)

Reopen menu, click `Cancel` two more times via varying strategies: `dispatchEvent` MouseEvent sequence (mousedown/mouseup/click) with coordinates, Playwright `browser_click` by id, Playwright `getByRole('menuitem')`.

**Result: Fail — reproducible no-op.** Identical to Step 6 across all 3 attempts. Click event reaches the `<a role="menuitem">` element (DOM id stable at `pr_id_2486_5`) but no state mutation, no network traffic, no UI feedback.

**Possible causes (NOT confirmed, for dev to investigate):**
- (a) React `onClick` bound to wrong element (`<a>` vs `<li>` inside menubar) — handler guard rejects silently
- (b) `Reason Code` required server-side (sidebar's `Reason Code(s):` field empty) — request blocked without UI trace
- (c) Menubar rendered in separate React portal; pointer event chain broken between portal root and sidebar's React tree — synthetic `onClick` never reaches registered handler
- (d) Click treated as menu-close (outside-click semantics) because menuitem's handler is on `onMouseDown`, not `onClick`

### Step 8 — Verify cancel audit (REQ-001)

Reopen Floy audit dialog in PACO.

**Result: Fail.** Top 2 rows still the booking rows from Step 3 (`10/15/2026 2:23:19 PM`, `2:23:20 PM`). **No row** with `summaryLabel` containing `cancel` or `cancelled`. No new row added after 3 Cancel attempts. Risk Strat / Patient record rows (8/2026) unchanged below.

**Verdict REQ-001: Fail.** Cancel action does not write any audit row.

---

## Network log summary

| After action | Endpoint | Status | Note |
|---|---|---|---|
| Book | `POST /api/appointments/create` | 201 | Booking success |
| Book | `POST /api/appointments/sendBookedAppointmentAnalytics` | 200 | Analytics sent |
| Book | `POST /api/appointments/sessions-appointments` (×4) | 200 | Calendar refresh polls |
| Cancel ×3 | (nothing) | — | No cancel request, no PATCH/PUT/DELETE |

Only the recurring `sessions-appointments` GET poll and `provider-shift-status/me/heartbeat` keep firing — no mutation traffic for cancel.

---

## Verdict

- **REQ-PAC2-8999-001 (cancel audit):** **FAIL** on dev build `pac2-8999`. Cancel menuitem in Calendar Day view Appointment Details sidebar is a no-op — no confirmation, no API call, no audit row.
- **REQ-PAC2-8999-002 (book audit):** **PASS** on dev build `pac2-8999`. Booking DOES write 2 rows to patient profile audit. Conflict with ticket description (which says book is also broken) — matches dev note that "booking not logged" does not reproduce on dev.

## Cleanup

- **Orphan appointment left for dev/admin cleanup:** `Mr Floy adhoc` (NHS 76835143) at 15:00–15:10 on 15/10/2026, session `PAC2-7786 Temi PCN`, slot type `Home Visit FJ`, HCP `ammar 01022295446`. Cancellation never reached backend, so slot remains booked. Agent has no delete endpoint in scope.
- Patient, session, appointment book fixtures all pre-existing on dev — agent did not create new test data, did not delete anything.
- No PII captured. No email/SMS confirmation sent (test patient on dev slot, no real contact info).
- Browser state: 2 tabs open (PACO + PACO Connect), audit dialog closed; close manually or via session timeout.

## Open questions for dev

1. Cancel menuitem handler — bound to what element? Required `Reason Code`? Server-side block leaving no UI trace?
2. Is there a confirmation dialog supposed to appear before cancel? (User saw none.)
3. Wording on fix: `<user> cancelled appointment` per dev reply 2026-10-13 — confirm exact phrase, case, punctuation.
4. Try cancel via other paths (right-click slot context menu, Group Send, Appointment Book list view) to see if the no-op is isolated to Calendar Day view's patient-status menubar, or systemic.

## Tester notes

[Protected area]
