---
id: appointment-book-feature-branch
title: Appointment Book (PAC2-7137 Feature Branch)
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco-connect/feature-branch/pac2-7137/appointment-book
controls: []
verified_by: []
last_observed: 2026-10-06
relationships:
  - PAC2-7137
  - PAC2-8384
  - PAC2-7786
  - PAC2-8241
  - PAC2-8552
---

# Appointment Book (Feature Branch PAC2-7137)

## Entry

Navigate to: `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`

**Key:** Default `/paco-connect/appointment-book` returns HTTP 404 but UI renders. Feature branch URL works.

## Observations (2026-10-06)

### Summary Header
- **Sessions:** 1
- **Booked:** 0
- **Available:** 88
- **LIVE:** 0

### Session Details
- **Provider:** Mickey Mouse
- **Session:** "Sean QA Test Oct5 2026"
- **Time:** 08:00 - 22:45
- **Slots:** 88 slots visible, all with ✓ checkmark
- **Slot Types:** test by handsome mike, Test Billable, Man demo slot_type, Sean Test 7366, Test Slot Type - Phlebotomy

### Count Consistency Check
✓ Summary Available: 88 = Session slots: 88 (counts match)

### Controls
| Control | Type | Notes |
|---------|------|-------|
| Day/Week/Month/Year | Toggle buttons | View modes |
| Previous/Next | Buttons | Navigate dates |
| Go to today | Button | Jump to current date |
| Quick Book | Button | Opens booking wizard |
| Filters | Button | Opens filter panel |
| Appt. Book selector | Dropdown | Shows "111 PC24" |

## Quick Book Wizard

### Flow
1. **Patient Search** - Select patient
2. **Session** - Select session (required, enables subsequent steps)
3. **Slot Type*** - Select slot type (required)
4. **Appt Type*** - Select appointment type (required)
5. **Clinician Gender** - Optional
6. **Clinician** - Optional
7. **Email & SMS*** - Shows "No slot types available" until Session selected
8. **Location** - Optional
9. **Date & Time** - Select available slot

### Buttons
- **Find Appointment** - Disabled until all required fields complete
- **Reset** - Disabled until form has data

## Dependencies
- Session must be selected first before Slot Type options appear
- Email & SMS locked until Session selected

## Known Issues (from tickets)
- PAC2-7137: Day Booked count mismatch (holder vs appointment counting)
- PAC2-7786: Delete Session missing from menu
- PAC2-8241: Slot outside time range returns 500

## Provenance
- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T07:23:29Z
- Appt Book: PAC2-8384 Manual Book A (111 PC24)
