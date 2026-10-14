# Feature Location: PAC2-4837

**Mode:** LOCATE
**Environment:** dev
**Role:** Super Admin GB (General Practice Demo Site)
**Timestamp:** 2026-10-06
**Route status:** Confirmed

## Entry Path

1. Navigate to `https://blinx.dev.blinxpaco-np.com/health-forms/responses/` (Classic HF Inbox)
   - Sidebar → `Health Forms` → auto-navigates to inbox
2. Or: `/health-forms/inbox-2.0` (New HF Inbox beta)

## Route

### Classic Health Form Inbox
- **URL:** `/health-forms/responses/`
- **Classification:** `Observed`
- **Role:** Any role with HF access (tested: Super Admin GB)
- **Entry:** Sidebar → `Health Forms` icon

### New Health Form Inbox (beta)
- **URL:** `/health-forms/inbox-2.0`
- **Classification:** `Observed`
- **Role:** Any role with HF access

## Key UI Elements Found

### Classic Inbox Grid
- Column `Synced` with icon buttons:
  - `Synced to Primary Care Patient Record` button (synced status)
  - `img` with `alt="not synced"` badge (not synced status)
- `Review Form` action in grid `Action` column
- Forms organized under sections: `Completed By Patient - Alarm Triggered`, `Completed By Patient - No Alarm Triggered`
- Bottom summary tabs: `Reviewed (synced)` / `Reviewed (not synced)` with counts (4,820 / 6,209)

### New Inbox (inbox-2.0)
- Bucket tabs under `Completed` section:
  - `Not Saved (6,155)` — forms NOT yet saved to patient record
  - `Processing (54)` — forms currently being processed
  - `Saved (4,820)` — forms successfully saved
- Grid columns: Patient Name, Age, Health Form Name, RAG, Assist Rating, PACO Assist Summary, Chat, Completed By, Triage Time, Usual Clinician

### Form Detail Dialog (Classic)
- Patient info header: form name, patient name, D.O.B, NHS number
- `Alert Triggered` section with highlighted answers
- Form content (questions + answers)
- Bottom action bar:
  - `More Actions` button
  - `Save to Record` button
  - `Save & Follow up` button

## Patient Record Status Field Location

**Status field location: Unknown** — NOT visible in Classic form detail dialog currently observed. The form detail view shows patient info and answers, but the `Patient Record Status` field itself was not found in the dialog content. The status is reflected in:
- Inbox grid: `Synced` / `not synced` icon badge
- New Inbox: `Not Saved` / `Processing` / `Saved` bucket tabs

**Hypothesis:** Patient Record Status field may only be visible for forms in `Reviewed (not synced)` filter, or may require a specific form state (blank status) to display. Further investigation needed.

## Resync Action

**Resync action: Unknown** — "Resync" or "Re-sync" action not yet located in either Classic or New inbox UI. The ticket says forms "can now be resynced from the Health Form Inbox" but the specific trigger (button, menu, batch action) is not yet found. Options:
- Per-form action within Review Form detail dialog (under "More Actions"?)
- Batch action on selected forms
- Separate admin tool

## Open Questions Resolved

| OQ | Question | Status |
|----|----------|--------|
| OQ-002 | Patient Record Status field location | Partially resolved — visible as Synced/not synced badge in Classic grid; exact status field in detail TBD |
| OQ-003 | Resync action | **Not found** — needs further investigation |

## Open Questions Remaining

| OQ | Question | Impact |
|----|----------|--------|
| OQ-001 | Bulk tool access point (admin UI vs script) | High |
| OQ-003 | Resync action location in HF Inbox | High |
| OQ-004 | Exact error message "already been submitted" | Medium |
| OQ-005 | Dev has stuck form data with blank status? | Medium — need to create or locate |
| OQ-006 | Auth role for resync | Low |

## Budget

- Views visited: 4 (dashboard, classic inbox ×2, new inbox ×2 reload)
- Time: ~12 minutes
- Remaining: within budget

## Reusable Route

- `/health-forms/responses/` — confirmed, 1 view
- `/health-forms/inbox-2.0` — confirmed, 1 view

## Evidence

- `.playwright-mcp/page-2026-10-06T10-09-13-849Z.yml` — Classic HF Inbox with synced/not-synced badges
- `.playwright-mcp/page-2026-10-06T10-14-22-019Z.yml` — New HF Inbox with Not Saved/Processing/Saved buckets
- Classic form detail dialog contains `Save to Patient Record` buttons but no visible Patient Record Status field
- New inbox "Not Saved" bucket (6,155) likely contains forms that failed EMIS save — candidates for blank status testing

---

## Tester notes

[Protected area]
