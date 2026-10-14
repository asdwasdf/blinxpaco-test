---
id: nhs-patient-manager
title: NHS Patient Manager
roles:
  - NHS Staff
environment: dev
status: Observed
routes:
  - https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/patient-management
controls:
  - name: Lists
    kind: tab
  - name: Patients
    kind: tab
  - name: Date range picker
    kind: filter
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-nhs-pm-1
    from: nhs-comms-hub
    to: nhs-patient-manager
    trigger: Patient Manager link
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# NHS Patient Manager

## Purpose and context

`Observed`: Manage patient lists and communications.

## Entry

1. NHS Comms Hub → Patient Manager
2. URL: `/commshub/patient-management`

## Controls

- Tabs: Lists, Patients
- Date range picker: 07/09/2026 - 06/10/2026

## Observations

- Patient list management for NHS communications
- Date-filtered view

## Provenance

- Environment: dev (externalDevHosts)
- Role: NHS Staff
- Observed at: 2026-10-06T04:35:24Z

## Tester notes
