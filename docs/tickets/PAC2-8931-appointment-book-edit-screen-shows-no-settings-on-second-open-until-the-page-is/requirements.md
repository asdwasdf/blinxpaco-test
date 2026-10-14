# PAC2-8931 Requirements

**Ticket:** PAC2-8931  
**Title:** Appointment book edit screen shows no settings on second open until the page is refreshed  
**Phase:** ANALYZE  
**Updated:** 2026-10-07

## Source

- Ticket: `ticket/PAC2-8931-appointment-book-edit-screen-shows-no-settings-on-second-open-until-the-page-is/ticket.md` (SHA256: `39f9581d4f0586a72afa2aff6403762ba0b49ccbe6a8b7d1aacbc97419727206`)
- Video: `attachments/128932-8931.mp4` → `video/video-notes.md` (Reviewed 2026-10-07)

## Bug Summary

Appointment book edit screen displays settings correctly on first open, but shows blank fields on second open without page refresh.

## Open Questions

- OQ-001: Does bug occur if user saves changes on first open before closing?
- OQ-002: Does closing via backdrop click vs X button vs Save make a difference?
- OQ-003: Are fields actually empty (data cleared) or just not rendering (display bug)?

## Requirements

### REQ-001 — Display settings on every edit open
- **Classification:** `Observed` (video frame 0060, 0070 vs 0100, 0101)
- **Actor:** Super Admin GB
- **Trigger:** Click `Edit` on appointment book row
- **Target:** Edit panel form fields
- **Expected:** `Name` field and `Shared Organisations` pills render with stored values
- **Evidence:** First open shows `Name` = "111 PC24", pills `Primary Care 24`, `General Practice (Demo Site)`

### REQ-002 — Settings persist after save
- **Classification:** `Observed` (Jira description)
- **Trigger:** Save appointment book edits, then open edit again
- **Target:** Stored appointment book data
- **Expected:** Saved settings display unchanged after save + re-open
- **Note:** Bug description confirms settings blank on second open even after save

### REQ-003 — No refresh required
- **Classification:** `Observed` (Jira description)
- **Trigger:** Open edit panel multiple times in same session
- **Target:** Edit panel state
- **Expected:** Settings display without page refresh on any open attempt
- **Workaround observed:** Page refresh temporarily fixes, but bug repeats

### REQ-004 — Shared Organisations pills render
- **Classification:** `Observed` (video frame 0060 vs 0101)
- **Trigger:** Open edit panel
- **Target:** `Shared Organisations` field
- **Expected:** Selected organizations render as removable pink pills below dropdown
- **First open:** Pills visible for `Primary Care 24`, `General Practice (Demo Site)`
- **Second open:** Pills missing (dropdown may show text but pills do not render)

## Acceptance Criteria from Ticket

| ID | Given | When | Then |
|----|-------|------|------|
| AC-001 | I have opened edit on an appointment book | I close it or save, then open edit again | The name and shared organisations are displayed as saved |
| AC-002 | I open edit repeatedly in the same sitting | I do so any number of times | The settings display every time without a page refresh |
| AC-003 | I open edit on an appointment book | I save without changing anything | The stored settings are unchanged |

## Feature Location

- **Route:** `/paco-connect/appointment-book` (or `/paco-connect/feature-branch/<branch>/appointment-book`)
- **Entry:** `PACO Connect` → `Configuration` → `Appointment Books` → row menu → `Edit`
- **Component:** Right-side edit panel `Edit Appointment Book`
- **Fields:** `Name` (textbox), `Shared Organisations` (dropdown + pills)
- **Evidence:** `video/video-notes.md` frames 0060, 0070 (working), 0100, 0101 (broken)

## Tester Notes

*(Protected — do not overwrite)*
