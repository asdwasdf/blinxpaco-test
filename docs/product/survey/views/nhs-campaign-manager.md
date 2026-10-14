---
id: nhs-campaign-manager
title: NHS Campaign Manager
roles:
  - NHS Staff
environment: dev
status: Observed
routes:
  - https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager
controls:
  - name: Create Campaign
    kind: action
    mutation: true
  - name: Campaign Outbox
    kind: navigation
  - name: Filter Campaigns
    kind: filter
  - name: Campaign Statuses
    kind: filter
  - name: Campaign Types
    kind: filter
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-nhs-cm-1
    from: nhs-comms-hub
    to: nhs-campaign-manager
    trigger: Campaign Manager link
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# NHS Campaign Manager

## Purpose and context

`Observed`: Create and manage patient communication campaigns.

## Entry

1. NHS Comms Hub → Campaign Manager
2. URL: `/commshub/campaign-manager`

## Controls

- **Create Campaign** button (mutation boundary)
- **Campaign Outbox** button
- Filter Campaigns panel
- Campaign Statuses filter
- Campaign Types filter

## Observations

- Campaign creation and management for NHS communications
- Campaign outbox for tracking sent campaigns

## Provenance

- Environment: dev (externalDevHosts)
- Role: NHS Staff
- Observed at: 2026-10-06T04:35:42Z

## Tester notes
