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
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-configuration-1
    from: configuration
    to: users-staff-teams
    trigger: Users & Staff > Teams
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-2
    from: configuration
    to: users-staff-role-groups
    trigger: Users & Staff > Role Groups
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-3
    from: configuration
    to: users-staff-profiles
    trigger: Users & Staff > Staff Profiles
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-4
    from: configuration
    to: patient-dfd-route-failure
    trigger: Patient > DFD
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-5
    from: configuration
    to: patient-care-navigation
    trigger: Patient > Care Navigation
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-6
    from: configuration
    to: appointment-books-scheduler
    trigger: Appointment Books > Scheduler
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-7
    from: configuration
    to: appointment-books-sessions
    trigger: Appointment Books > Sessions
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-8
    from: configuration
    to: appointment-books-slot-types
    trigger: Appointment Books > Slot Types
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-9
    from: configuration
    to: appointment-books-appointments
    trigger: Appointment Books > Appointments
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-10
    from: configuration
    to: appointment-books-external-reminders
    trigger: Appointment Books > External Appt Reminders
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-11
    from: configuration
    to: appointment-books
    trigger: Appointment Books > Appointment Books
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-12
    from: configuration
    to: quick-pay-product-catalogue
    trigger: Quick Pay > Product Catalogue
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-13
    from: configuration
    to: quick-pay-accounts
    trigger: Quick Pay > Accounts
    relationship: cross-module handoff
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-14
    from: configuration
    to: patients-proxy-role-groups
    trigger: Patients & Proxy > Role Groups
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-15
    from: configuration
    to: risk-strat-builder
    trigger: Clinical Config > Risk Strat Builder
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-p2-configuration-16
    from: configuration
    to: template-library-route-failure
    trigger: Clinical Config > Template Library
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
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

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- Nhóm `Users & Staff` trong Configuration gồm `Staff Profiles`, `Role Groups`, `Teams`.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- Nhóm `Patient`: `DFD`, `Care Navigation`. Nhóm `Appointment Books`: `Scheduler`, `Appointment Books`, `Sessions`, `Slot Types`, `Appointments`, `External Appt Reminders`. Nhóm `Quick Pay`: `Product Catalogue`, `Accounts`. Nhóm `Patients & Proxy`: `Role Groups`. Nhóm `Clinical Config`: `Risk Strat Builder`, `Template Library`.

## Tester notes

[Protected area]
