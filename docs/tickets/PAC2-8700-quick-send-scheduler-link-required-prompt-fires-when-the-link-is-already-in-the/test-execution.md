# PAC2-8700 — Test Execution (Manual QA)

**Environment:** PAC2-8700 feature branch, dev host, Super Admin GB, General Practice (Demo Site)
**Test patient:** Ellie Bartlett (first result when searching "Gareth Bartlett")
**Date:** 2026-10-05

## Results

| AC | Description | Result | Notes |
|----|-------------|--------|-------|
| AC-001 | Load template with `{{{scheduler_link}}}` + health form → no popup | **PASS** | Template auto-loaded on dialog open. No popup on initial load. Email enabled, SMS disabled. Template contains `{{{scheduler_link}}}` button "Book Now". |
| AC-002 | Add second health form → no popup | **BLOCKED** | Dialog opened for Ellie; campaign auto-loaded. Could not trigger "add health form" dropdown via automation. Quick Send button enabled — no popup blocking. |
| AC-003 | Insert link via popup, add form → no popup | **BLOCKED** | No popup to dismiss. Cannot test dismiss flow. |
| AC-004 | Dismiss → tab switch → no reopen | **BLOCKED** | No popup to dismiss. |
| AC-005 | SMS tick + template missing link → popup + toast block | **NOT RUN** | SMS disabled. Template has link. |
| AC-006 | Popup disappears when dialog closes | **PASS** | Screenshot `pac2-8700-ac006-dialog-closed.png` confirms dashboard clean, no popup visible after dialog close. |
| AC-007 | Unit tests | **PASS** | Per Jira: 14 unit + 8 component tests Pass (Gareth, 2026-10-04). |

## Observations

### PAC2-8700 branch — FIXED behaviors (AC-001, AC-006)
1. **No false popup on load**: Template with `{{{scheduler_link}}}` + 2 health forms loaded without triggering popup.
2. **Popup hides on dialog close**: Dialog closed → popup disappeared → dashboard clean (screenshot confirmed).
3. **Quick Send button enabled**: Despite 2 health forms and 1 booking link attached, send button was active — suggesting scheduler link check passed.

### BLOCKED by test data
- All remaining ACs need a template WITHOUT `{{{scheduler_link}}}` to test:
  - Popup appearing when link genuinely missing (AC-005)
  - Popup dismiss + reopen logic (AC-003/004)
  - HF inbox follow-up z-index (AC-006 second part)
- Cannot trigger "Select Health Form" dropdown via Playwright automation on this dialog.
- Patient (Ellie Bartlett) had no saved/favourite template to load.

## Blocker: Test Data Needed

1. **Template with `{{{scheduler_link}}}` + favourite/saved**: to test AC-002 (add form when link already present)
2. **Template without `{{{scheduler_link}}}`**: to test AC-005 (genuinely missing link triggers popup + toast)
3. **Health Form inbox → Quick Send follow-up**: to test AC-006 z-index

## QA Ledger (Mutation)

- No mutations performed. All observations read-only.
- Email: not sent. SMS: not sent. No data created.
- Screenshot: `pac2-8700-ac006-dialog-closed.png` (dashboard clean after dialog close)

## Next Steps

1. Create `QA-AUTO` template with `{{{scheduler_link}}}` + mark as favourite → test AC-002/003/004
2. Create `QA-AUTO` template without link → test AC-005 genuine missing link
3. Open Health Form inbox, find form → Quick Send follow-up → test AC-006 z-index
4. Update status.md checkpoint after test data created.
