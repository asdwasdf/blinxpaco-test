# Feature Location: PAC2-8384

**Input Revision:** 1
**Environment:** dev
**Role:** `Super Admin GB`
**Observed:** 2026-09-25T09:57:00+07:00
**Status:** Confirmed
**Budget:** 3/12 views; 4/15 minutes

## Search clues

- Exact ticket terms: `Appointment Book`, `Filters`, `Location`, `Slot Type`, `Session Name`, `Patient`, `Appointment Type`.
- Context: one or more appointment books selected, current date range.
- Trigger: toolbar `Filters` button.
- Target: `Location` section in `Filters` sidebar.

## Confirmed entry path

1. Starting state: authenticated Paco `Dashboard`.
   - Landmark/control: sidebar `Appointment Book` icon.
   - Read-only action: open menu and select `Appointment Book`.
   - Resulting state: `/paco-connect/appointment-book`; `Appointment Book` breadcrumb and toolbar visible.
   - Context dependency: authenticated `Super Admin GB` session.
2. Appointment Book root.
   - Landmark/control: toolbar `Filters` button.
   - Read-only action: select `Filters`.
   - Resulting state: sidebar with heading `Filters`.
   - Context dependency: selected appointment book shown by toolbar control `Appt. Book 11 oct -2 -21`; current date `25 September 2026`.
3. Filters sidebar.
   - Landmark/control: `Location` button.
   - Read-only action: expand `Location`.
   - Resulting state: `Location` region with `Search...` textbox and one visible option, `Temi PCN`.
   - Context dependency: the currently selected appointment book and date range determine available options.

## Context requirements

- Environment `dev`, host `blinx.dev.blinxpaco-np.com`.
- Authenticated role `Super Admin GB` in `General Practice (Demo Site)`.
- Current appointment book selection and date range affect the filter-option set.
- Multi-book behavior requires test data with multiple selected books and known option mapping; not validated during locate.

## Candidate and rejected paths

- Candidate: `/paco-connect/appointment-book` — verified route; UI title reports `PACO Connect` and transport status displayed `404`, but authenticated Appointment Book UI loaded and is usable.
- Rejected: product graph route search — `graph.json` has Appointment Book-related configuration views but no reusable live route for the filter sidebar; input revision 1.

## Observed landmarks

- Sidebar image `Appointment Book`, then menu button `Appointment Book`.
- Root breadcrumb/button `Appointment Book`.
- Toolbar button `Filters`.
- Sidebar heading `Filters` and button `Location`.
- Expanded region `Location` with textbox `Search...` and visible checkbox option `Temi PCN`.
- Observable wait: `Loading your appointment data` disappears before opening `Filters`.

## Evidence

- `test-results/PAC2-8384/locate/20260925-0957/filters-location.png` — 2026-09-25T09:57:00+07:00, dev, `Super Admin GB`, local raw evidence; not shareable pending redact review.
- Playwright accessibility snapshot at same timestamp — local run observation; no credential/auth-state data persisted in this artifact.

## Automation hints

- `page.getByRole('button', { name: 'Filters' })`.
- `page.getByRole('button', { name: 'Location', exact: true })`.
- Scope assertions to the sidebar `Filters` and region `Location`; wait for visible option or explicit empty/loading state, never a fixed delay.

## Blockers and next action

- Blocker: None for feature location.
- Next action: run `EXPLORE` read-only to observe single- and multi-book filter behavior; ask QA for known multi-book test-data mapping before evaluating ticket requirements.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
