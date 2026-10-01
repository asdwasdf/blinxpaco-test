---
id: organisation-general
title: Organisation General
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - configuration
controls:
  - name: Upload Photo
    kind: mutation
  - name: Remove Photo
    kind: destructive
  - name: Save
    kind: mutation
  - name: Edit Address
    kind: navigation
  - name: Add Special Opening Hours
    kind: mutation
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-organisation-general-1
    from: organisation-general
    to: organisation-pathways-config
    trigger: Pathways Config
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-general-2
    from: organisation-general
    to: organisation-skills
    trigger: Skills
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-general-3
    from: organisation-general
    to: organisation-sharing-agreements
    trigger: Sharing Agreements
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-general-4
    from: organisation-general
    to: organisation-org-priorities
    trigger: Org Priority
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-general-5
    from: organisation-general
    to: organisation-inbound-priority-flow
    trigger: Inbound Priority Flow
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-general-6
    from: organisation-general
    destination_hint: organisation general settings được lưu
    trigger: Save
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
  - id: run-20261001-085609-organisation-general-7
    from: organisation-general
    destination_hint: editor special opening hours
    trigger: + Add Special Opening Hours
    relationship: workflow
    context: []
    classification: Open Question
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Organisation General

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `General` opens `/paco/configuration/organisation/general`.

## Entry and transitions

Page displays `Basic Information` (name, type, ODS code, photo), `Location & Contact Information` (address, phone, email, website), `Opening Hours` (regular weekly schedule, special hours), and `Communications` (header/footer rich-text editors with dynamic fields). Organisation-specific values are omitted.

Reverified on 2026-09-22: `Edit Address` opened an `Enter Address` dialog containing `Address Line 1`, optional `Address Line 2`, `City`, `County`, and `Postcode`, plus `Close`, `Cancel`, and disabled `Confirm`. Existing values were not changed or recorded. `Cancel` closed the dialog. `Add Special Opening Hours`, photo controls, editor fields, and `Save` were not used. Mutation: `None`.

## Execution guidance

- Treat organisation identity, contact info, opening hours as shared production config.
- Only mutate with explicit domain-valid value and rollback plan.
- Rich text editors support dynamic fields: `organisation_name`, `organisation_website`, `organisation_phone_number`, `organisation_address`.

## Automation guidance

- Stable landmarks: route, section headings, field labels, `Save` button.
- Mutation tests require controlled setup, unique synthetic values, restoration.

## Evidence

Accessibility observation, dev, `Super Admin GB`, reverified 2026-09-22. Address-dialog field structure inspected, then cancelled; organisation identity and address values omitted. Mutation: `None`.

## Open questions

- Which fields require validation and which persist immediately remain unverified.

## Discovery run-20261001-085609

Role `Super Admin GB`, environment `dev`, 2026-10-01. Read-only; mọi claim là `Observed` trừ khi ghi khác.

- `Configuration` mở `/paco/configuration/organisation/general`. Menu `Organisation` gồm `General`, `Practice Profiles`, `Locations`, `Skills`, `Code Rule`, `Sharing Agreements`, `Pathways Config`, `Services`, `Dx Priority`, `Org Priority`, `Inbound Priority Flow`, `Announcements`, `Integrations`.
- Các nhóm cấu hình khác: `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation`.

## Tester notes

[Protected area]
