---
id: patient-analyser
title: Patient & Medication Analyser
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /patient-analyser-new/
controls:
  - name: Patient Analyser
    kind: tab
  - name: Medication Analyser
    kind: tab
  - name: QOF Registers
    kind: tab
  - name: Patient Details
    kind: tab
  - name: Advanced Search
    kind: action
  - name: Save Report
    kind: action
  - name: Reset View
    kind: action
  - name: Expand All
    kind: action
  - name: Collapse All
    kind: action
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-patient-analyser-1
    from: analytics-reports-submenu
    to: patient-analyser
    trigger: Patient Analyser
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Patient & Medication Analyser

## Purpose and context

`Observed`: Patient analytics and medication analysis module.

## Entry

1. Analytics & Reports → Patient Analyser
2. URL: `/patient-analyser-new/`
3. Page title: "Patient & Medication Analyser"

## Controls

- Tabs: Patient Analyser (selected), Medication Analyser, QOF Registers, Patient Details
- Advanced Search button
- Save Report button
- Reset View, Expand All, Collapse All buttons
- Reports section with search
- Date Range: All Time

## Data

- "50 / 12,941 Rows Loaded" - showing 50 of 12,941 total patients
- Grid with patient data

## Observations

- Cross-app navigation: PACO → Analytics app
- Comprehensive patient analytics
- QOF (Quality and Outcomes Framework) registers available
- Patient details view available

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T06:17:22Z

## Tester notes
