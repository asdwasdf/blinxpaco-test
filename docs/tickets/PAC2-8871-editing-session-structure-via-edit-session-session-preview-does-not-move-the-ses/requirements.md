# PAC2-8871 Requirements

## Ticket
- **ID:** PAC2-8871
- **Title:** Editing session structure via Edit Session / Session Preview does not move the session out of its session template folder
- **Source:** `ticket/PAC2-8871-editing-session-structure-via-edit-session-session-preview-does-not-move-the-ses/ticket.md`
- **Imported:** 2026-10-07

## Context

As part of PAC2-7081 work, a feature was added that moves a session out of its session template folder when it is edited, so it no longer matches the rest of the folder. The session then sits standalone in the table and bulk edits made to the folder no longer affect it.

**Current broken behavior:** Changing session structure through `Edit Session` or `Session Preview` (slot times, slot types) saves the change but the session stays inside the folder.

**Working behavior:** Changing session length, clinician, or location moves the session out of the folder correctly.

## Requirements

### REQ-001: Orphan session when changing slot times via Edit Session
- **Classification:** Observed (broken)
- **Actor:** Clinician/User
- **Trigger:** Edit Session drawer opened on a session inside a session template folder, change slot time, save
- **Expected:** Session moves out of folder and appears standalone in table
- **Actual (broken):** Session stays inside folder
- **Source:** ticket.md (Description), video `128887`

### REQ-002: Orphan session when changing slot types via Session Preview
- **Classification:** Observed (broken)
- **Actor:** Clinician/User
- **Trigger:** Session Preview opened on a session inside a session template folder, change slot type, save
- **Expected:** Session moves out of folder and appears standalone
- **Actual (broken):** Session stays inside folder
- **Source:** ticket.md (Description), video `128887`

### REQ-003: No orphan when session unchanged in Edit Session
- **Classification:** Expected behavior
- **Actor:** Clinician/User
- **Trigger:** Edit Session opened on a session inside a folder, make no changes, save
- **Expected:** Session stays in folder
- **Source:** ticket.md (AC4)

### REQ-004: No orphan when session unchanged in Session Preview
- **Classification:** Expected behavior
- **Actor:** Clinician/User
- **Trigger:** Session Preview opened on a session inside a folder, make no changes, save
- **Expected:** Session stays in folder
- **Source:** ticket.md (AC4)

### REQ-005: Standalone session not affected by folder bulk edit
- **Classification:** Expected behavior
- **Actor:** Clinician/User
- **Trigger:** Session has been moved out of folder, bulk edit made to the folder
- **Expected:** Standalone session is not affected by folder bulk edit
- **Source:** ticket.md (AC2)

### REQ-006: Length/Clinician/Location change still orphans (no regression)
- **Classification:** Expected behavior (confirmed working per ticket)
- **Actor:** Clinician/User
- **Trigger:** Change session length, clinician, or location via Edit Session
- **Expected:** Session moves out of folder (no regression)
- **Source:** ticket.md (AC3, Description)

### REQ-007: Clash menu still appears when session overlaps (regression concern)
- **Classification:** Open Question (potential regression)
- **Actor:** Clinician/User
- **Trigger:** After a session leaves a folder via edit, clinician has two sessions at the same time
- **Expected:** Clash menu appears to warn user
- **Actual (potential regression):** No clash menu appears; overlap goes through unflagged
- **Source:** ticket comment (Alexander Paul, 2026-10-06) - QA feedback from PAC2-8871 QA branch
- **Ticket reference:** PAC2-8867 mentioned as related issue

## Acceptance Criteria

| ID | Text |
|----|------|
| AC1 | Given a session inside a session template folder When I change slot times or slot types via Edit Session or Session Preview and save Then the session moves out of the folder and appears standalone in the table |
| AC2 | Given a session has been moved out of the folder When I make a bulk edit to the folder Then the standalone session is not affected |
| AC3 | Given a session inside a folder When I change length, clinician or location Then it still moves out of the folder (no regression) |
| AC4 | Given a session inside a folder When I open Edit Session or Session Preview and save without changing anything Then the session stays in the folder |

## Related Tickets

- **PAC2-7081:** Original feature that added folder orphaning behavior
- **PAC2-8867:** Clash menu issue (mentioned in QA feedback, expected to still be present)
- **PAC2-8871 QA branch:** This ticket's feature branch where original fix passes but new clash menu regression found

## QA Feedback (from ticket comment)

Alexander Paul reported 2026-10-06:
- **Passing:** Editing a session in a folder via Preview Session now removes that session from the folder. Works in isolation.
- **Issue 1 (expected):** PAC2-8867 problem still present (no action on this branch)
- **Issue 2 (new regression):** Clash menu no longer appears when clinician has two sessions at same time after folder edit

## Open Questions

1. **Clash menu regression:** Does the clash menu work correctly in isolation (before folder edit creates overlap)?
2. **PAC2-8867 relationship:** Is the clash menu issue the same bug or a separate regression from the 8871 fix branch?
3. **Test data:** What session template folder setup is needed to test this flow?

## Video Evidence

| Video | Description | Status |
|--------|-------------|--------|
| `128887` | Original bug evidence - session stays in folder after structure edit | Ingesting |
| `128888` | QA confirmation - confirms fix on branch | Ingesting |
| `128919` | QA Feedback - shows clash menu regression | Ingesting |

## Tester notes

[Protected area]
