---
id: capacity-demand
title: Capacity & Demand
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /capacity-demand/
controls: []
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-capacity-demand-1
    from: analytics-reports-submenu
    to: capacity-demand
    trigger: Capacity & Demand
    relationship: navigation
    context: [PACO -> Analytics app]
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Capacity & Demand

## Purpose and context

`Observed`: Capacity and demand analytics view.

## Entry

1. Dashboard → Analytics & Reports → Capacity & Demand
2. URL: `/capacity-demand/`

## Page Title

- "Capacity & Demand"

## Observations

- Cross-app navigation: PACO → Analytics app
- Multiple chart/panel areas visible
- Top bar shows TFN org context

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T04:10:29Z

## Tester notes
