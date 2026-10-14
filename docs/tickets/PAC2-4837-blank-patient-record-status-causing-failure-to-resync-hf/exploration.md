# Exploration: PAC2-4837

**Mode:** EXPLORE
**Environment:** dev
**Role:** Super Admin GB (General Practice Demo Site)
**Timestamp:** 2026-10-06

## Scope

Find resync action in HF Inbox. Locate Patient Record Status blank field. Investigate "Not Saved" bucket data.

## Findings

### New Inbox (inbox-2.0) — Not Saved Bucket

- **URL:** `/health-forms/inbox-2.0`
- **Bucket:** `Not Saved (6,155)` — forms NOT yet saved to patient record
- **Form detail:** Opened via "View Form" action from row menu
- **Form detail contents:**
  - Patient header: name, D.O.B, NHS number
  - Form content with answer switches
  - PACO Assist panel with triage analysis
  - `More Actions` button → menu with no resync action found
  - `Finish` button (saves and closes)
  - `Bookings & Setup` button
  - `Create task` button
- **Patient Record Status field:** NOT visible in form detail dialog
- **Resync action:** NOT found in form detail or More Actions menu

### Classic Inbox — Reviewed (not synced)

- **URL:** `/health-forms/responses/`
- **Filter:** Click `Not Synced to PR (6,209)` button in sidebar
- **Grid columns:** `Synced` | `Action`
- **Row actions:** `Review Form` button, `Quick Send` button
- **Resync action:** NOT found in action column
- **Patient Record Status:** "not synced" badge visible in grid

### Key Observations

1. **Resync action NOT FOUND in observed UI**
   - New inbox form detail: no resync in More Actions menu
   - Classic inbox grid: no resync in action column
   - Hypothesis: resync may be inside Classic form detail dialog (not yet opened)

2. **Patient Record Status field NOT visible**
   - New inbox form detail: field not displayed
   - Classic form detail: not yet observed
   - Status reflected as "Not Saved" / "not synced" badge only

3. **Bulk tool access point UNKNOWN**
   - Ticket says "tool is ready to clear stuck forms in bulk"
   - No UI found for bulk tool

4. **Dev data available**
   - Not Saved bucket: 6,155 forms
   - Not Synced to PR: 6,209 forms
   - Likely contains blank-status forms

## Open Questions Status

| OQ | Question | Status |
|----|----------|--------|
| OQ-001 | Bulk tool access point | **Not found** |
| OQ-002 | Patient Record Status blank field location | Partial — badge visible, field not visible |
| OQ-003 | Resync action location | **Not found** — needs form detail dialog |
| OQ-004 | Exact error message "already been submitted" | Not yet observed |
| OQ-005 | Dev has stuck form data | **Yes** — Not Saved bucket (6,155) |
| OQ-006 | Auth role for resync | Super Admin GB OK |

## Budget

- Views: 6 (new inbox, not saved bucket, form detail ×2, classic inbox, not synced filter, form row)
- Time: ~15 minutes
- Status: exhausted, needs form detail dialog

## Next Action

**Open Classic form detail dialog** for a not-synced form. Look for resync action inside dialog. If resync not found, the fix may not be visible in UI or requires specific form state (blank patient record status).

## Evidence

- `classic-inbox-not-synced.png` — Classic inbox grid with not synced badge
- `.playwright-mcp/page-*.yml` — Page snapshots

---

## Tester notes

[Protected area]
