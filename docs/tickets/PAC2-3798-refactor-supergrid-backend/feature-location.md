# Feature Location: PAC2-3798

**Input Revision:** 1
**Environment:** dev
**Role:** `Super Admin GB`
**Observed:** 2026-09-21
**Status:** Confirmed
**Budget:** 3/12 views; <15/15 minutes

## Search clues

- Ticket terms: `supergrid`, `Analytics`, `Patient Analyser`, `Advanced Search`, `pivot mode`, `patient count`, report URL anchor.
- Reusable survey route: `Analytics & Reports` → `Patient Analyser` was previously observed for `Super Admin GB`, but its `/patient-analyser-new/` target is stale on the PAC2-3798 demo host.

## Confirmed entry path

1. Starting state: authenticated demo-host home `/`
   - Landmark/control: sidebar item `Analytics & Reports`
   - Read-only action: open the sidebar group
   - Resulting state: menu exposes `Patient Analyser`
   - Context dependency: authenticated Paco session; role `Super Admin GB`
2. Sidebar `Analytics & Reports` menu
   - Landmark/control: button `Patient Analyser`
   - Read-only action: activate menu item
   - Resulting state: `/patient-analyser-new/` returns `404 Not Found` on this demo host
   - Context dependency: none observed
3. Demo route `/patient-analyser/`
   - Landmark/control: breadcrumb `Analytics`, heading text `Patient & Medication Analyser`, report panel `Reports`
   - Read-only action: navigate to ticket-provided demo route
   - Resulting state: shared analyser shell opens with tabs `Patient Details`, `Patient Analyser`, `Medication Analyser`; `Advanced Search 0`; patient count; grid; `Columns` and `Filters`
   - Context dependency: currently selected report is `New report [Unsaved]`; do not use `New` or `Save` during read-only exploration

## Context requirements

- Authenticated dev session on `pac2-3798.dev.blinxpaco-np.com`.
- Role `Super Admin GB`.
- Existing/safe report data is needed to cover saved report URL anchors and old `advanced search` migration.
- `send to comms hub` requires separately verified test recipient/destination and mutation approval.

## Candidate and rejected paths

- Candidate: direct `/patient-analyser/`; ticket-supplied demo route, confirmed shared analyser root.
- Rejected: `Analytics & Reports` → `Patient Analyser` → `/patient-analyser-new/`; `404 Not Found` on demo host; dependency revision 1.
- Candidate: `Patient Analyser` tab within `/patient-analyser/`; visible but not opened during LOCATE because root location is sufficient.

## Observed landmarks

- Breadcrumb link `Analytics` at `/analytics-home/`; page title `Patient & Medication Analyser`.
- `Reports` panel with report search, `New` and `Save`; mutation boundary at `New` and `Save`.
- Tablist: `Patient Details` (selected), `Patient Analyser`, `Medication Analyser`.
- `Advanced Search 0`, `Patients:` count, `Expand All`, `Collapse All`, grid, `Columns`, `Filters`.
- Observable grid readiness: patient count appears and footer changes to rows-loaded state. Grid initially exposes `Loading...`.

## Evidence

- Local Playwright accessibility observations, 2026-09-21, dev, `Super Admin GB`; not promoted because the page contains patient/NHS data and is not shareable.
- Route observation: `/patient-analyser-new/` rendered `404 Not Found`; no sensitive data retained.

## Automation hints

- Use page title `Patient & Medication Analyser`, `Advanced Search 0`, tab names and `Columns`/`Filters` as observed structural landmarks.
- Wait for `Patients:` count and rows-loaded footer; do not assert count value or patient rows without trusted expected-result basis.

## Blockers and next action

- Blocker: Saved/old `advanced search` test data, target tab order/rename, pivot eligibility rules, and approved `send to comms hub` destination remain unknown.
- Next action: run read-only `EXPLORE` from `/patient-analyser/`; first inspect `Patient Analyser` tab and `Advanced Search` dialog. Stop before any create/save/send action.

## Tester notes

