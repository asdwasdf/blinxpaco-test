# Feature Location: PAC2-8999

**Generated:** 2026-10-13T13:25:00.000Z
**Ticket:** PAC2-8999 — PBT-332 appointments not logging in patient audit (regression PBT-252)
**Mode:** `locate`
**Environment:** dev
**Role observed:** `Super Admin GB`
**Host:** `blinx.dev.blinxpaco-np.com`
**Branch(es):** `/paco-connect/feature-branch/pac2-8999/`, `/paco/feature-branch/pac2-8999/`
**Route status:** `Confirmed`
**Evidence:** `test-results/PAC2-8999-pbt-332-appointments-not-logging-in-patient-audit-regression-pbt-252/locate/attempt-1/evidence.md`

## Surface 1 — PACO Patient Audit (read view)

- **Entry path:** PACO dashboard → sidebar `Patient Search` (icon) → `/paco/feature-branch/pac2-8999/patient-search` → row action menu (`cell-renderers--actions` button, `aria-controls="popup_menu_left"`) → menuitem `View Audit`.
- **Route (modal-based):** No URL change. Dialog opens over `/paco/feature-branch/pac2-8999/patient-search`.
- **Dialog title:** `Audit Trail`.
- **Search input:** `Search by category, user, event, NHS number, details…`.
- **Filter:** `Filter audit by date` → `Date & Time`.
- **Grid columns:** `Date/Time`, `Summary`, `Field`, `Previous Value`, `New Value`, `Details`.
- **Alternative entry from same action menu:** `Profile`, `View`, `Edit`, `Archive`, `Save for offline access`. (`Profile` opens `/paco/patient-profile/<id>/…` per feature-map entry; not re-verified here.)
- **Landmarks:** AG Grid headers `Date/Time` + `Summary` are the columns relevant for the expected wording `<user> cancelled appointment`.

## Surface 2 — PACO Connect Booking/Cancel (write side)

- **Entry path:** PACO Connect dashboard `/paco-connect/feature-branch/pac2-8999/dashboard` → sidebar `Appointment Book` → submenu (per `feature-map.md` Appointment Book root).
- **Route:** `/paco-connect/feature-branch/pac2-8999/appointment-book` (per `feature-map.md` Appointment Book — feature-branch route).
- **Role:** `Super Admin GB` observed on auth `Johnny Bravo`.
- **Build:** Same host as PACO; auth shared via Cognito token.

## Reused entries from `docs/product/feature-map.md`

- `Patient Search` (entry `/paco/dashboard` → sidebar `Patient Search`; route `/paco/patient-search`; dev feature-branch `/paco/feature-branch/<ticket-branch>/patient-search`).
- `Appointment Book — feature-branch route` (entry navigate → `/paco-connect/feature-branch/<ticket-branch>/appointment-book`).

## Rejected paths / dependencies

- None. Branch subpaths reused; no `feature-map.md` route hint is stale.

## Budget

- States counted: 4 (max 12). Time elapsed: ~5 min (max 15).
- No further view needed for `locate`; booking/cancel UI details belong in `EXPLORE`.

## Next action (for `EXPLORE`)

- Open PACO Connect `Appointment Book` → pick any `Test Patient` → book, then cancel. Capture exact UI flow (book drawer / cancel drawer / reason / confirmation) and any new action wording.
- After cancel, navigate back to Patient Search on PACO branch → same `Test Patient` → row action `View Audit` → confirm `<user> cancelled appointment` entry appears in `Summary` column with a matching `Date/Time`.
- Open `Profile` action menu from the same row → confirm whether audit lives only in the modal (`View Audit`) or also on a profile-level audit tab. Record both paths so `MANUAL_EXECUTE` can pick the canonical one.

## Route sync record

- New entry `docs/product/feature-map.md` for `Patient Audit (modal from Patient Search)` to be added under `### Module: Patient`. Pending `paco-explore` `observe` outcome.
