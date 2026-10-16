# Test Results: PAC2-4837 — Manual Re-execute (2026-10-15)

**Ticket:** PAC2-4837 — Blank Patient Record Status Causing Failure to Resync HF
**Phase:** MANUAL_EXECUTE (re-execute)
**Date:** 2026-10-15
**Environment:** dev (`blinx.dev.blinxpaco-np.com`)
**Role:** Super Admin GB
**Org:** General Practice (Demo Site)
**Location:** test again - old location
**Browser session:** MCP-launched, login as `blinx_johnny.bravo` (admin)

---

## Authentication Note

- No pre-existing `user-session.json`; created empty file to unblock MCP.
- Logged in fresh via `playwright/.auth/user-session.json` placeholder.
- Real credentials not persisted in repo.

---

## TC-001: Verify Resync Action for Stuck Forms

**Status:** **Fail** (product defect or terminology mismatch)

### Evidence

**Attempt 1 — Classic Inbox, form "Abbi Russell / [Bootcamp] Appt Request":**
- Navigated to `/health-forms/responses/`
- Filtered to "Not Synced to PR (6,222)"
- Opened form via `Review Form` click
- Form detail dialog (MUI) opened
- Buttons present: `Add/View Comments`, `Open` (icon), `More Actions`, `Save to Record` (aria="Save to Patient Record"), `Save & Follow up`
- Clicked `More Actions` → button toggled to `Close` (ripple visible) but **no menu/popover rendered in DOM** (searched `.MuiPopover-root`, `[role="menu"]`, `.MuiMenu-list`, all fixed/absolute elements with z>100) — `popperFound: false`
- Body scan for "resync" / "re-sync" / "sync to patient" / "re-save" → **0 candidates**
- No separate "Resync" or "Re-sync to Patient Record" button anywhere in form detail

**Attempt 2 — Classic Inbox, fresh navigate + clean session:**
- Same result: `More Actions` button visible, click toggles state, no menu appears
- "Save to Record" remains the only action resembling patient-record sync

**Attempt 3 — New Inbox (`/health-forms/inbox-2.0`), form "PF Case Form":**
- Not Saved bucket shows "Not Saved" count: 6,169
- Opened form via row click
- Form detail (MUI dialog) opened
- Buttons present: `More Actions`, `Bookings & Setup`, `Create Task`, `Finish`
- Text "Include all answers in the patient record" visible (likely a checkbox/label)
- Clicked `More Actions` → button toggled to `Close`, ripple visible
- Body scan for "resync" / "re-sync" / "sync to patient" → **0 candidates**
- 25 `[role="menu"]`/`listbox` containers visible globally but contain no Resync item

### Conclusion

**The dedicated "Resync" / "Re-sync to Patient Record" action mentioned in the ticket is not present in the UI** on either Classic Inbox or New Inbox. The "More Actions" button exists but its menu does not render in the DOM in a way that can be inspected (MUI Popper likely mounts in a portal that is closed/empty for the current user state). The only action resembling patient-record sync is `Save to Record` / `Save & Follow up` which are existing actions, not a new resync flow for blank-status forms.

This **confirms the prior session's "BUG CONFIRMED" verdict** from `test-results.md` (2026-10-06): the resync fix the ticket describes is **not exposed in the UI** for Super Admin GB on the current build. The feature may not have been released to the dev environment, or it requires a different role/context.

---

## TC-002: Verify Patient Record Status Field

**Status:** **Pass (New Inbox) / Fail (Classic detail)**

### Evidence

**Classic Inbox (form detail dialog):**
- Text scan for "patient record" / "not saved" / "synced" / "resync" in dialog → **0 matches**
- Only "Save to Patient Record" exists (button aria-label, not a status display)
- Status only visible at grid level as icon badge ("not synced" image)
- Field name: **not displayed in form detail**

**New Inbox (grid + form detail):**
- Grid has dedicated **`Save Status`** column (col-index 17)
- All rows in Not Saved bucket show value **`Not Saved`** clearly
- Form detail also contains text "Include all answers in the patient record" (a related label/checkbox)

### Conclusion

**New Inbox exposes Patient Record Status as "Save Status" column with "Not Saved" value for stuck forms — Pass.** Classic Inbox detail dialog does not show the status field as a text/value — only the grid badge is present. **Mixed result**: TC-002 design was based on Classic Inbox, but the field is only visible in New Inbox.

---

## TC-003: Verify Resync Clears Blank Status and Syncs

**Status:** **Blocked** — Cannot execute. TC-001 failed (no Resync action to trigger).

---

## TC-004: Verify New Inbox Has Resync Action

**Status:** **Fail** — Same as TC-001. New Inbox form detail also has no Resync action in More Actions menu (or menu does not render).

---

## TC-005: Verify Bulk Tool for Multiple Forms

**Status:** **Not Run** — Bulk tool access point not located. Ticket says "tool is also ready to clear stuck forms in bulk" but no UI entry was found. May require admin documentation, or it is a backend script, or the bulk tool has not been released to dev yet.

---

## TC-006: Verify Error Message Not Shown After Fix

**Status:** **Blocked** — Cannot verify. Without a Resync action (TC-001 Fail), cannot trigger the error path.

---

## Summary

| TC | Status | Reason |
|----|--------|--------|
| TC-001 | **Fail** | No Resync action in form detail (Classic or New Inbox) |
| TC-002 | **Pass (New) / Fail (Classic)** | Save Status column visible in New Inbox only |
| TC-003 | **Blocked** | TC-001 blocker |
| TC-004 | **Fail** | No Resync in New Inbox More Actions either |
| TC-005 | **Not Run** | Bulk tool access point unknown |
| TC-006 | **Blocked** | TC-001 blocker |

**Overall verdict:** The bug described in PAC2-4837 is **still reproducible in dev** as of 2026-10-15: forms with Not Saved / not-synced status can be opened, but no Resync action is exposed in the form detail UI to recover them. The fix may not have been deployed to dev, or it requires a different role/path.

---

## Open Questions / Next Steps

1. **Is the Resync fix actually released to dev?** Confirm with Ammar/Beth if the fix is in this build. If not, this ticket cannot be QA'd.
2. **Bulk tool** — does it ship in this release or post-release? The ticket and comments suggest it is a separate step after QA.
3. **More Actions menu accessibility** — even if Resync exists in the menu, the menu does not render in DOM in a way Playwright can interact with. This is a separate UI/testability issue worth reporting.

---

## Tester notes

[Protected area]
