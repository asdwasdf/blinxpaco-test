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
last_observed: 2026-09-19
---

# Organisation General

## Purpose and context

`Observed`: `Configuration` → `Organisation` → `General` opens `/paco/configuration/organisation/general`.

## Entry and transitions

Page displays `Basic Information` (name, type, ODS code, photo), `Location & Contact Information` (address, phone, email, website), `Opening Hours` (regular weekly schedule, special hours), `Communications` (header/footer rich text editors with dynamic fields).

Organisation name: `General Practice (Blinx Demo Site)`. Organisation type: `General Practice`. ODS code: `YGMQJ` (disabled field). Sensitive organisation values omitted.

## Execution guidance

- Treat organisation identity, contact info, opening hours as shared production config.
- Only mutate with explicit domain-valid value and rollback plan.
- Rich text editors support dynamic fields: `organisation_name`, `organisation_website`, `organisation_phone_number`, `organisation_address`.

## Automation guidance

- Stable landmarks: route, section headings, field labels, `Save` button.
- Mutation tests require controlled setup, unique synthetic values, restoration.

## Evidence

Accessibility observation, dev, `Super Admin GB`, 2026-09-19. Organisation identity values omitted.

## Open questions

- Which fields require validation and which persist immediately remain unverified.

## Tester notes

[Protected area]
