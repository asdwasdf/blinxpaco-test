---
id: nhs-analytics
title: NHS Analytics
roles:
  - NHS Staff
environment: dev
status: Observed
routes:
  - https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/analytics
controls:
  - name: Campaign dropdown
    kind: filter
  - name: Date range picker
    kind: filter
  - name: Search by Patient
    kind: search
  - name: Reset/Filter buttons
    kind: action
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-nhs-analytics-1
    from: nhs-comms-hub
    to: nhs-analytics
    trigger: Analytics link
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# NHS Analytics

## Purpose and context

`Observed`: Campaign analytics and conversion tracking.

## Entry

1. NHS Comms Hub → Analytics
2. URL: `/commshub/analytics`

## Controls

- Campaign dropdown filter
- Date range: 01/10/2026 - 06/10/2026
- Search by Patient textbox
- Reset/Filter buttons

## Data

- Note: "Analytics update every 5 minutes for accuracy and performance"
- Conversion charts visible

## Observations

- Campaign performance analytics
- 5-minute refresh cycle

## Provenance

- Environment: dev (externalDevHosts)
- Role: NHS Staff
- Observed at: 2026-10-06T04:36:01Z

## Tester notes
