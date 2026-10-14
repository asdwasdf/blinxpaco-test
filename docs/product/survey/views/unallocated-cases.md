---
id: unallocated-cases
title: Unallocated Cases
roles:
  - Super Admin GB
  - Agent
environment: dev
status: Observed
routes:
  - /paco/unallocated
controls:
  - name: Back to Dashboard
    kind: navigation
  - name: PDS Validated
    kind: filter
  - name: PDS Validation Pending
    kind: filter
  - name: PDS Not Matched
    kind: filter
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-unallocated-1
    from: case-load-management
    to: unallocated-cases
    trigger: Unallocated menu item
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Unallocated Cases

## Purpose and context

`Observed`: Queue view showing unallocated cases waiting to be assigned to staff.

## Entry

1. Dashboard → Case Load Management → Unallocated
2. URL: `/paco/unallocated`

## Header

- Heading: "Unallocated (764)"
- Back to Dashboard link
- Total unallocated cases: 764

## Filter Tabs

- PDS Validated
- PDS Validation Pending
- PDS Not Matched

## Observations

- Cases are displayed in a grid/list format
- Multiple case rows visible (content not fully captured)
- PDS (Personal Demographics Service) status filters available
- Large number of unallocated cases (764)

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:56:23Z

## Tester notes
