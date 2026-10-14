---
id: appointment-books-sessions
title: Appointment Books Sessions Configuration
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco-connect/configuration/#clinics
controls: []
verified_by: []
last_observed: 2026-10-01
relationships: []
---

# Appointment Books Sessions Configuration

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `Sessions` navigates to a PACO Connect configuration route.

## Entry and transitions

Reverified on 2026-09-22: the route returned HTTP 404 and remained on an explicit `Loading sessions` status after a bounded wait. No session configuration, empty state, terminal UI error, or actionable content became available. Mutation: `None`.

## Execution guidance

- Safe steps: open route and record HTTP status plus visible loading/error state.
- Do not infer session behavior or retry actions from the route fragment.
- Capture route, HTTP status, page title, and accessibility state.

## Automation guidance

- Stable landmarks currently limited to route and page title `PACO Connect`.
- Wait for configuration content or explicit terminal error; persistent `Loading` is not success.
- Expected authorization and route availability lack trusted basis.

## Evidence

Navigation and accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. HTTP 404 with persistent `Loading sessions` after a three-second bounded wait. Mutation: `None`.

## Observations (2026-10-06)

### Appointment Books Configuration (root)

Route: `/paco-connect/configuration/`
- Shows sidebar with tree navigation
- Appointment Books tree item expands to show sub-items:
  - Scheduler
  - Appointment Books
  - Sessions
  - Slot Types
  - Appointments
  - External Appt Reminders

### Sessions Configuration

Route: `/paco-connect/configuration/#clinics`

**Grid:**
- Total rows: 16,384 sessions
- Search Session... text input
- Show archived checkbox
- Columns: Session Name, Actions
- Actions button per row

**Session row names visible:**
- QA-AUTO-PAC2-8241-20261005-1337 (QA test session)
- Sean QA Test Oct5 2026
- Cancel session and name change on child test (Template — 4 sessions)
- Dev Book (Template — 4 sessions)
- Today Tomorrow (Template — 4 sessions)
- 1104 (Template — 37 sessions)
- AH - Book Appointment Demo1-tony1 (Template — 35 sessions)
- Paediatric Neurology Clinic (Template — 13/7 sessions)
- Test edit session-tony (Template — 8 sessions)
- PAC2-2620
- And many more...

**Session Actions Menu:**
- Edit - opens Edit Session drawer
- View Audit - opens audit dialog
- Archive - archives session
- Clone - clones session
- Delete - deletes session (NOW VISIBLE in this environment!)
- Cancel session appointments - cancels all appointments in session

### Edit Session Drawer Fields

Opened for: "QA-AUTO-PAC2-8241-20261005-1337"

| Field | Type | Value/Notes |
|-------|------|-------------|
| Session Name | textbox | QA-AUTO-PAC2-8241-20261005-1337 |
| Session Type | radio | Timed Appts (selected) |
| Slot Duration (min) | spinbutton | 10 |
| Time Range | button | collapsed section |
| Apply Multi-Org Split | dropdown | "Select split" |
| Assigned Slot Types | multi-select | Dermatology Clinic, Test Billable (2 Selected) |
| ⚠️ Warning | alert | "This slot type isn't linked to an Email/SMS campaign. Patients booked into it won't be notified..." |
| Assigned Appointment Book | single select | 111 PC24 (1 Selected) |
| Service provider | combobox | (empty) |
| Assigned Locations | single select | Temi PCN (1 Selected) |
| Assigned Staff | combobox | "-" (dash) |
| Required Attributes | button | "View Attributes (1)" |

**Actions:** Cancel, Save

### Slot Types Configuration

Route: `/paco-connect/configuration/#service-types`

**Grid columns:**
- Slot Type
- Service Setting
- Context Type
- Actions

**Actions per row:** (to be confirmed)

## Open questions

- Whether route is stale, unavailable in dev, permission-dependent, or defective remains unresolved.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Appointment Books > Sessions` trong Configuration chuyển sang app `/paco-connect/configuration/`; không thấy heading sau 4s.

## Tester notes

[Protected area]
