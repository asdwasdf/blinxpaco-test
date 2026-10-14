---
id: case-workboards
title: Case Workboards
roles:
  - Super Admin GB
  - Agent
environment: dev
status: Observed
routes:
  - /paco/workboards/58
controls:
  - name: Back to Dashboard
    kind: navigation
  - name: Search all boards
    kind: search
  - name: Board name
    kind: textbox
  - name: Create new board
    kind: action
    mutation: true
  - name: Search this board
    kind: search
  - name: All (13)
    kind: filter
  - name: Emergency (3)
    kind: filter
  - name: Mid Priority (1)
    kind: filter
  - name: Low Priority (1)
    kind: filter
  - name: High Priority (1)
    kind: filter
  - name: Other (7)
    kind: filter
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-case-workboards-1
    from: case-load-management
    to: case-workboards
    trigger: Case Workboards menu item
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Case Workboards

## Purpose and context

`Observed`: Kanban-style workboard for managing cases by priority/status.

## Entry

1. Dashboard → Case Load Management → Case Workboards
2. URL: `/paco/workboards/58`

## Board List View

- Heading: "Work Boards"
- Search all boards textbox
- "Create new board" button (mutation boundary)

## Master Case Board

- Board name: "Master Case Board"
- Search this board textbox
- Filter tabs with counts:
  - All (13)
  - Emergency (3)
  - Mid Priority (1)
  - Low Priority (1)
  - High Priority (1)
  - Other (7)
- 13 case cards displayed

## Observations

- Kanban board with priority-based filtering
- Case cards visible but content not fully captured
- Create new board available but not tested (mutation boundary)

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:57:34Z

## Tester notes
