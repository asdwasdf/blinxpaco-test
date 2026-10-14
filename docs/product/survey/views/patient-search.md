---
id: patient-search
title: Patient Search
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/patient-search
controls:
  - name: Search patients
    kind: search
  - name: Audit Modal
    kind: dialog
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-patient-search-1
    from: dashboard
    to: patient-search
    trigger: Patient Search
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Patient Search

## Purpose and context

`Observed`: Search and manage patients in the PACO system.

## Entry

1. Dashboard → Patient Search
2. URL: `/paco/patient-search`

## Page Header

- Heading: "Patient Search (495,069)"
- Total patients in system: 495,069

## Controls

- Search patients textbox (top bar)
- Audit Modal visible (possibly access audit log)

## Observations

- Large patient database (495k+ patients)
- Patient list grid visible

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:46:34Z

## Tester notes
