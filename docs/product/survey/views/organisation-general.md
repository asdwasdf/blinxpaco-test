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
last_observed: 2026-09-22
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

## Tester notes

[Protected area]
