---
id: configuration
title: Configuration
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - dashboard
controls:
  - name: Organisation
    kind: navigation
  - name: Patient
    kind: navigation
  - name: Appointment Books
    kind: navigation
  - name: Patients & Proxy
    kind: navigation
  - name: Users & Staff
    kind: navigation
  - name: Clinical Config
    kind: navigation
  - name: Case Prioritisation
    kind: navigation
  - name: Quick Pay
    kind: navigation
verified_by: []
last_observed: 2026-09-20
---

# Configuration

## Purpose and context

`Observed`: global `Configuration` opens `/paco/configuration`.

## Entry and transitions

Default state asks the user to select a menu item. Categories are `Organisation`, `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config` and `Case Prioritisation`.

Observed read-only child navigation:

- `Organisation`: `General`, `Practice Profiles`, `Locations`, `Skills`, `Code Rule`, `Sharing Agreements`, `Pathways Config`, `Services`, `Dx Priority`, `Org Priority`, `Inbound Priority Flow`, `Announcements`, `Integrations`.
- `Patient`: `DFD`, `Care Navigation`.
- `Appointment Books`: `Scheduler`, `Appointment Books`, `Sessions`, `Slot Types`, `Appointments`, `External Appt Reminders`.
- `Quick Pay`: `Product Catalogue`, `Accounts`.
- `Patients & Proxy`: `Role Groups`.
- `Users & Staff`: `Staff Profiles`, `Role Groups`, `Teams`.
- `Clinical Config`: `Risk Strat Builder`, `Template Library`.
- `Case Prioritisation`: dedicated route `/paco/configuration/case-prioritisation` with `View audit`, `Add Another` and `Save`.

No editor form was changed or saved. `Add Another`/`Save` require a valid prioritisation rule and cleanup plan; mutation permission alone does not provide domain-safe values.

## Execution guidance

- Confirm exact category, expected setting and cleanup before editing.
- Treat organisation, user, staff and patient settings as sensitive.
- Capture menu structure only during general survey.

## Automation guidance

- Stable landmarks: route, heading and category labels.
- Configuration assertions require controlled setup and restoration.

## Evidence

Accessibility observation reverified, dev, `Super Admin GB`, 2026-09-20. `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, and `Clinical Config` categories expanded successfully and exposed the documented children. Mutation: `None`; no PII retained.

## Open questions

- Mutation behavior and permission boundaries inside child pages remain unverified.

## Tester notes

[Protected area]
