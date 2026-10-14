---
id: case-load-management
title: Case Load Management
roles:
  - Super Admin GB
  - Agent
environment: dev
status: Observed
routes: []
controls: []
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# Case Load Management

## Purpose and context

`Observed`: Case Load Management navigation module accessible from PACO dashboard sidebar.

## Entry

1. Navigate to `/paco/dashboard`
2. Click `Case Load Management` in sidebar
3. Submenu opens with 4 options

## Submenu Items

1. **My Case** — link to personal case view
2. **Unallocated** — link to unallocated cases queue
3. **Case Workboards** — link to case workboards
4. **Task Workboards** — link to task workboards

## Observations

- Case Load Management icon in sidebar triggers submenu on click
- No direct navigation to a parent page for this module
- Submenu items appear inline below the menu icon

## Navigation

- Dashboard → Case Load Management submenu → [My Case|Unallocated|Case Workboards|Task Workboards]
- Each item likely navigates to `/paco/<path>` endpoint

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:55:00Z

## Tester notes
