# Feature Location: PAC2-8522

**Input Revision:** 1
**Environment:** dev feature branch `pac2-8522`
**Role:** `Super Admin GB`
**Observed:** 2026-09-28T15:02:00Z
**Status:** Confirmed
**Budget:** 3/12 views; route revalidated from current authenticated session

## Search clues

- Exact terms: `Quick Send`, `Campaign Tags`, campaign detail, tag editor.
- Actor/context: authenticated `Super Admin GB`, patient context.
- Ticket-provided clue: `/paco-connect/feature-branch/pac2-8522/dashboard/?qs_campaign_tags=true`.
- Tester-authorized patient and safe campaign data are intentionally omitted.

## Confirmed entry path

1. Starting state: authenticated PACO Connect feature-branch dashboard with `qs_campaign_tags=true`.
   - Landmark/control: global patient `Search...`.
   - Read-only action: search the tester-authorized patient.
   - Resulting state: patient search result row.
2. Starting state: matching patient result row.
   - Landmark/control: result-row `Patient actions menu` (`+`).
   - Read-only action: open `Patient actions menu`.
   - Resulting state: contextual action menu.
3. Starting state: patient action menu.
   - Landmark/control: `Quick Send`.
   - Read-only action: open `Quick Send`.
   - Resulting state: PACO Connect `Quick Send` composer for the selected patient, retaining the feature-branch URL.
4. Starting state: composer.
   - Landmark/control: selected campaign header, `(click to change)`, campaign tag text, and `Edit campaign tags`/`Add tags` when role permits.
   - Read-only action: inspect a selected existing campaign; do not `Save` or send.
   - Resulting state: selected campaign context suitable for tag cases.

## Context requirements

- Authenticated PACO Connect feature-branch session.
- Role observed: `Super Admin GB`.
- Tester-authorized patient.
- Existing campaign. Tag mutation requires exact safe campaign/tag data and runtime guard.
- Query flag `qs_campaign_tags=true` remained visible on the confirmed PACO Connect route.

## Candidate and rejected paths

- Confirmed: dashboard patient `Search...` → result-row `Patient actions menu` → `Quick Send`.
- Rejected: clicking the patient row navigates to main PACO patient profile and does not validate the PACO Connect feature implementation.
- Rejected: sidebar image `Quick Send` is a Comms Hub launcher, not the ticket's primary composer entry path.

## Observed landmarks

- Global patient `Search...`.
- Result-row `Patient actions menu`.
- `Quick Send` contextual action.
- Composer campaign header and `Campaign tags:` text.
- Existing-tag editor controls when editing is permitted.

## Evidence

- Local raw Playwright snapshots from 2026-09-28 feature branch; local-only because patient data may be present.
- Manual evidence in `automation.md`; no patient identifiers promoted to durable evidence.
- Ticket attachment remains local-only.

## Automation hints

- Use global `Search...`, result-row `Patient actions menu`, then `Quick Send`.
- Wait for composer and campaign-header landmark; do not rely on generated classes.
- Inject approved test data at runtime; do not persist patient identifiers.

## Blockers and next action

- Blocker: None for location.
- TC-002 additionally requires a supported editing-off/no-update context; `Super Admin GB` is not such a context.
- Next action: execute only cases with available data and permission context.

## Tester notes

