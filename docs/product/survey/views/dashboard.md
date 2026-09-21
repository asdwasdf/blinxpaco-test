---
id: dashboard
title: Dashboard
roles:
  - Super Admin GB
environment: dev
status: Observed
routes: []
controls:
  - name: Expand sidebar
    kind: navigation
  - name: Search patients by name or NHS number
    kind: search
  - name: day
    kind: filter
  - name: week
    kind: filter
  - name: month
    kind: filter
  - name: year
    kind: filter
  - name: Accessibility Menu
    kind: dialog
  - name: Switch to dark theme
    kind: preference
  - name: What do these statuses mean?
    kind: help
  - name: A - Z Last Name
    kind: sort
  - name: Status
    kind: sort
  - name: Available
    kind: filter
  - name: On Leave
    kind: filter
verified_by: []
last_observed: 2026-09-21
---

# Dashboard

## Purpose and context

`Observed`: authenticated landing view at `/paco/dashboard` for role `Super Admin GB` in dev. Header identifies organisation context as `General Practice (Blinx Demo Site)`; identity details are omitted.

## Entry and transitions

1. Open `https://blinx.dev.blinxpaco-np.com/paco/dashboard`.
2. Use `Expand sidebar` to expose global product navigation.
3. Visible navigation groups: `Dashboards`, `Analytics & Reports`, `Comms Hub`, `Health Forms`, `Patients`, `Web Chat & Video`, `Case Load Management`, `Appointment Book`, `Quick Pay`, `User Portal`, `Configuration`, `Rocket Bar`.

Dashboard period controls expose `day`, `week`, `month`, and `year`; `day` was initially selected. Selecting `week` updated `aria-selected` while preserving operational dashboard landmarks; selecting `day` restored the initial state. A synthetic no-match value in global `Search patients by name or NHS number` produced no visible listbox, options, or explicit empty-state message; clearing restored the empty search field. No patient result was opened.

Expanded-sidebar `Search menu...` filters global navigation labels. A synthetic no-match query hid all known menu labels without an explicit empty-state message; searching `Configuration` left only that matching label visible. Clearing restored navigation, then the sidebar was collapsed.

The global `Accessibility Menu` opens a UserWay iframe dialog with contrast, link highlighting, text size/spacing, animation, image, font, cursor, tooltip, line-height, alignment, and saturation controls. External UserWay links and all preference-changing controls were left unused; closing the dialog restored the dashboard.

`Switch to dark theme` was clicked once, but the control label and computed page colors remained unchanged, so no distinct theme state was established. No further theme interaction was attempted.

`Observed` on 2026-09-21: `What do these statuses mean?` opened inline guidance distinguishing user-selected `Available`/`Triage`/`Break` and `On Leave` from automatic `Away from Desk` and `Logged Out`; clicking the control again closed it. The `Staff Availability` sort selector exposed `A - Z Last Name` and `Status`; selecting `Status` reordered the two visible staff cards, then `A - Z Last Name` restored the initial order. Selecting `On Leave (0)` produced an empty card area without an explicit empty-state message; `Available (2)` restored both cards. A synthetic value in `Search Clinicians...` changed `Available (2)` to `Available (0)` and displayed `No clinicians match that search.`; clearing restored both cards. No staff card or status editor was opened.

Dashboard period controls were completed through `month` and `year`, then restored to `day`. Each selection changed the selected period; exact chart values were not recorded because their business basis is untrusted. A click attempt on the `Staff Status` card content was intercepted by a decorative overlay; no force-click was used and no new state opened.

## Evidence

- Accessibility snapshot, dev, `Super Admin GB`, 2026-09-19.
- Page title: `PACO OS`.
- Stable landmarks: `Expand sidebar`, `Search menu...`, global patient search.
- Dashboard period transitioned `day` → `week` → `day`. Global patient no-match search produced no explicit result state and cleared cleanly.
- Sidebar menu search transitioned all labels → no-match blank state → `Configuration` only → all labels.
- Accessibility dialog opened and closed without changing settings. Theme toggle produced no observable state change.
- Staff-status guidance opened and closed. Sort transitioned `A - Z Last Name` → `Status` → `A - Z Last Name`; availability transitioned `Available (2)` → `On Leave (0)` → `Available (2)`.
- Clinician search transitioned two cards → explicit no-match with `Available (0)` → two cards. Period transitioned `day` → `month` → `year` → `day`.
- `Staff Status` detail remained blocked by a decorative overlay. Mutation: `None`.

## Execution guidance

- Manual setup: authenticate in dev as `Super Admin GB` and open `/paco/dashboard`.
- Safe steps: open status guidance; inspect sort choices; switch between `Available` and `On Leave`; restore `A - Z Last Name` and `Available`.
- Approval stop: do not open a staff card or status editor because persistence behavior is unverified.
- Evidence: capture selected sort/tab state and whether an explicit empty-state message appears.

## Automation guidance

- Prefer accessible labels `What do these statuses mean?`, `Available (n)`, `On Leave (n)`, `A - Z Last Name`, and `Status`.
- Wait for card order or card-area contents after selection; counts and staff data depend on current rota/session state.
- Do not assert exact counts, names, configured statuses, or timing thresholds without a trusted source.

## Open questions

- Dashboard chart meaning and role-dependent content remain outside this checkpoint.
- Whether `Switch to dark theme` is unavailable, delayed, or failed remains unresolved; no observable theme change occurred.
- Whether `Staff Status` has an intended read-only detail remains unresolved because its overlay intercepted pointer events.

## Tester notes

[Protected area]
