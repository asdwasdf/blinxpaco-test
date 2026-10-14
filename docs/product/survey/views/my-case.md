---
id: my-case
title: My Case
roles:
  - Super Admin GB
  - Agent
environment: dev
status: Observed
routes: []
controls: []
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-my-case-1
    from: case-load-management
    to: unallocated
    trigger: Unallocated button
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# My Case

## Purpose and context

`Observed`: Personal case view for the logged-in user showing assigned cases.

## Entry

1. Dashboard → Case Load Management → My Case
2. URL: `/paco/my-case`

## Empty State

- Message: "There are no new cases"
- Secondary: "You don't have any active case assigned to you"
- State: user has no cases assigned

## Observations

- Empty state displayed when no cases are assigned to the current user
- Page loads successfully with empty state messaging

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:55:36Z

## Tester notes
