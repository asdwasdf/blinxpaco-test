# Test Cases: PAC2-4837

**Ticket:** PAC2-4837 — Blank Patient Record Status Causing Failure to Resync HF
**Phase:** TEST_DESIGN
**Updated:** 2026-10-06

---

## TC-001: Verify Resync Action for Stuck Forms (Not Saved Status)

**Description:** Forms with blank Patient Record Status (stuck/not saved) should have a resync action available.

**Route:** Classic Health Form Inbox → Not Synced to PR filter → Review Form → More Actions

**Steps:**
1. Navigate to `/health-forms/responses/`
2. Click "Not Synced to PR (6,209)" filter
3. Click on a form row with "not synced" badge
4. Open "More Actions" menu in form detail
5. Verify "Resync" or "Re-sync to Patient Record" action exists

**Expected Result:**
- Resync action is visible and clickable
- Clicking resync triggers patient record sync
- Form status updates to "synced" after successful resync

**Test Data:** Any form in "Not Synced to PR" bucket (6,209 forms available in dev)

**Priority:** High

---

## TC-002: Verify Patient Record Status Field

**Description:** Forms should display Patient Record Status field clearly in form detail.

**Route:** Classic Health Form Inbox → Review Form

**Steps:**
1. Navigate to `/health-forms/responses/`
2. Open any "not synced" form
3. Verify Patient Record Status field is visible
4. Check status shows "Not saved to patient record" or blank

**Expected Result:**
- Patient Record Status field visible in form detail
- Status shows "Not saved" or blank for stuck forms

**Priority:** High

---

## TC-003: Verify Resync Clears Blank Status and Syncs to Patient Record

**Description:** Resync action should clear blank status and successfully sync form to patient record.

**Route:** Classic Health Form Inbox → Not Synced form → Resync

**Precondition:** Form must have blank Patient Record Status (caused by previous failed sync)

**Steps:**
1. Find form with "not synced" badge and blank Patient Record Status
2. Click "More Actions" → "Resync" (or similar)
3. Verify sync completes successfully
4. Verify form status updates to "synced"

**Expected Result:**
- Blank status cleared
- Form synced to patient record
- Status shows "Synced to Primary Care Patient Record"
- No "already been submitted" error

**Test Data:** Dev has 6,209 forms in Not Synced to PR bucket

**Priority:** High

---

## TC-004: Verify New Inbox Has Resync Action (Not Saved Bucket)

**Description:** New Inbox (inbox-2.0) should also have resync action for Not Saved forms.

**Route:** New Health Form Inbox → Not Saved bucket → View Form → More Actions

**Steps:**
1. Navigate to `/health-forms/inbox-2.0`
2. Filter to "Not Saved (6,155)" bucket
3. Open a form
4. Check "More Actions" menu for resync

**Expected Result:**
- Resync action visible in More Actions menu
- Same functionality as Classic inbox

**Priority:** Medium

---

## TC-005: Verify Bulk Tool for Multiple Stuck Forms

**Description:** Bulk tool should allow resyncing multiple stuck forms at once.

**Route:** Unknown (ticket mentions bulk tool ready)

**Steps:**
1. Navigate to Health Form Inbox
2. Select multiple "not synced" forms
3. Look for bulk action menu
4. Click "Resync Selected" or similar

**Expected Result:**
- Bulk resync option available
- Multiple forms sync in batch
- Progress indicator during sync

**Note:** Bulk tool access point not found during exploration. May require dev documentation.

**Priority:** Medium

---

## TC-006: Verify Error Message Not Shown After Fix

**Description:** After fix, stuck forms should not show "already been submitted" error.

**Route:** Classic Health Form Inbox → Stuck form → Attempt resync

**Steps:**
1. Find form with blank Patient Record Status
2. Click resync action
3. Verify NO "already been submitted" error appears

**Expected Result:**
- Resync proceeds without error
- No error message about form already being submitted

**Priority:** High

---

## Open Issues from Exploration

| Issue | Status | Notes |
|-------|--------|-------|
| Resync action location | Needs verification | Not found in More Actions during exploration |
| Bulk tool access point | Not found | Ticket says tool ready but UI location unknown |
| Patient Record Status field | Not visible in screenshots | Field may be inside form detail panel |
| Session expired during testing | N/A | Need fresh session for manual verification |

---

## Screenshots Captured

- `classic-inbox-not-synced.png` — Classic grid with not synced badge
- `classic-form-detail.png` — Form detail panel (buttons not visible in viewport)
- `not-synced-form-detail.png` — Not synced form detail
- `full-page.png` — Full page screenshot showing form detail panel

---

## Test Execution Notes

1. **Auth:** Super Admin GB (General Practice Demo Site)
2. **Environment:** dev (`blinx.dev.blinxpaco-np.com`)
3. **Data Available:** 6,209 Not Synced forms, 6,155 Not Saved forms
4. **Session:** May expire during testing, reload may be needed
