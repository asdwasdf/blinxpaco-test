---
id: nhs-template-manager
title: NHS Template Manager
roles:
  - NHS Staff
environment: dev
status: Observed
routes:
  - https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/template-builder
controls:
  - name: Show Org. Default Templates
    kind: toggle
  - name: Create New Email
    kind: action
    mutation: true
  - name: Create New SMS
    kind: action
    mutation: true
  - name: Search Templates
    kind: search
  - name: Set Org. Defaults
    kind: action
    mutation: true
  - name: Reset Column Widths
    kind: action
  - name: Show All Columns
    kind: action
  - name: Clear Filters
    kind: action
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-nhs-tm-1
    from: nhs-comms-hub
    to: nhs-template-manager
    trigger: Template Manager link
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# NHS Template Manager

## Purpose and context

`Observed`: Manage email and SMS templates for NHS patient communications.

## Entry

1. NHS Comms Hub → Template Manager
2. URL: `/commshub/template-builder`

## Controls

- **Show Org. Default Templates** toggle
- **Create New Email** button (mutation boundary)
- **Create New SMS** button (mutation boundary)
- Search Templates textbox
- Set Org. Defaults button (mutation boundary)
- Column controls: Reset, Show All Columns, Clear Filters

## Grid

- 2 templates visible
- Pagination: 1 to 2 of 2

## Observations

- NHS-specific template management
- Create email/SMS templates available
- Organisation defaults configurable

## Provenance

- Environment: dev (externalDevHosts)
- Role: NHS Staff
- Observed at: 2026-10-06T04:35:03Z

## Tester notes
