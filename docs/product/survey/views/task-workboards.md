---
id: task-workboards
title: Task Workboards
roles:
  - Super Admin GB
  - Agent
environment: dev
status: Observed
routes:
  - /paco/workboards/57
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
  - name: Create New Task
    kind: action
    mutation: true
  - name: Filters
    kind: filter
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-task-workboards-1
    from: case-load-management
    to: task-workboards
    trigger: Task Workboards menu item
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Task Workboards

## Purpose and context

`Observed`: Task management board for creating and tracking tasks.

## Entry

1. Dashboard → Case Load Management → Task Workboards
2. URL: `/paco/workboards/57`

## Board List View

- Heading: "Work Boards"
- Search all boards textbox
- "Create new board" button (mutation boundary)

## Master Task Board

- Board name: "Master Task Board"
- Search this board textbox
- "Create New Task" button (mutation boundary)
- Filters button

## Observations

- Similar structure to Case Workboards but for tasks
- Create New Task available (mutation boundary)
- No filter counts visible yet (may appear after board selection)

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:58:36Z

## Tester notes
