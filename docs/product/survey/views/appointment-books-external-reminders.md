---
id: appointment-books-external-reminders
title: External Appointment Reminders
roles: [Super Admin GB]
environment: dev
status: Observed
routes: [/configuration/#externalApptReminders]
controls:
  - { name: Slot Type, kind: mutation }
  - { name: Email Template, kind: mutation }
  - { name: SMS Template, kind: mutation }
  - { name: Scheduling, kind: mutation }
  - { name: Save to Patient Record?, kind: mutation }
  - { name: Add new Reminder, kind: mutation }
  - { name: Save, kind: mutation }
verified_by: []
last_observed: 2026-09-22
---

# External Appointment Reminders

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `External Appt Reminders` configures reminders for appointments booked through PACO. The page states that appointments follow reminder settings configured for their campaign.

## Entry and transitions

The visible reminder structure includes `Slot Type`, `Email Template`, `SMS Template`, `Scheduling`, `Save to Patient Record?`, `Add new Reminder`, and `Save`. Reverified on 2026-09-22: opening `Slot Type` exposed a searchable listbox with the current option selected. A synthetic no-match search displayed explicit `No results found`; closing the dropdown without selection preserved the configured value. The `Email Template` and `SMS Template` selectors likewise exposed searchable option lists; synthetic no-match searches displayed `No results found`, then `Escape` dismissed each list without selection. Existing campaign, slot-type, and template values are omitted. No field value, checkbox, add action, or save action was changed. Mutation: `None`.

## Execution guidance

- Safe steps: open page and inspect headings, field labels, and load state only.
- Stop before changing selectors, scheduling, `Save to Patient Record?`, `Add new Reminder`, or `Save`.
- Capture route, field structure, redacted load state, and mutation boundary.

## Automation guidance

- Stable landmarks: route fragment `#externalApptReminders`, title `External Appointment Reminders`, and labelled reminder fields.
- Wait for slot types and reminder configuration to load, or record explicit empty/error state.
- Campaign, template, schedule, and record-save values are organisation-specific.
- No trusted basis exists for expected templates, timing, consent, or patient-record behavior.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. `Slot Type`, `Email Template`, and `SMS Template` searchable lists each showed explicit `No results found` for synthetic queries and were dismissed without selection. Organisation-specific configuration values redacted. Mutation: `None`.

## Open questions

- Reminder creation/removal lifecycle, validation, campaign precedence, delivery behavior, and patient-record persistence remain unverified.

## Tester notes

[Protected area]
