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
last_observed: 2026-09-19
---

# External Appointment Reminders

## Purpose and context

`Observed`: `Configuration` → `Appointment Books` → `External Appt Reminders` configures reminders for appointments booked through PACO. The page states that appointments follow reminder settings configured for their campaign.

## Entry and transitions

The visible reminder structure included `Slot Type`, `Email Template`, `SMS Template`, `Scheduling`, `Save to Patient Record?`, `Add new Reminder`, and `Save`. A success notification reported that EMIS slot types loaded. Opening `Slot Type` exposed a listbox with 83 options; closing it without selection preserved the current value. Existing campaign, slot-type, and template values are omitted. No field value, checkbox, add action, or save action was changed.

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

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-19. Slot-type load notification observed; listbox exposed 83 options and closed without selection. Organisation-specific configuration values redacted. Mutation: `None`.

## Open questions

- Reminder creation/removal lifecycle, validation, campaign precedence, delivery behavior, and patient-record persistence remain unverified.

## Tester notes

[Protected area]
