---
id: master-task-board
title: Master Task Board
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - master-case-board
controls:
  - name: Search this board
    kind: search
  - name: List view
    kind: navigation
  - name: Card view
    kind: navigation
  - name: Filters
    kind: filter
  - name: Create New Task
    kind: mutation
verified_by: []
last_observed: 2026-09-20
---

# Master Task Board

## Purpose and context

`Observed`: `Case Load Management` → `Task Workboards` opens `/paco/workboards/57` and displays `Master Task Board` for role `Super Admin GB` in dev.

## Entry and transitions

`Work Boards` exposes `View My Tasks Only`, `View My Cases Only`, search modes `Board`/`Case ID`/`Patient`, board-name search, `Tasks`/`Cases` navigation, and `Create new board`. The selected task board card view exposes board search, view controls, sort, filters, and `Create New Task`. A synthetic no-match query reduced visible task cards to zero without an explicit empty-state message; clearing restored the board.

Synthetic no-match queries were run in all three search modes: `Board name`, `Case ID`, and `Patient name`. Each changed both board-category result counts to zero; each query was cleared, and `Board` mode was restored. `View My Tasks Only` and `View My Cases Only` were independently enabled and restored off. Selecting `Cases` navigated to `/paco/workboards/58`; no board card was opened.

Opening `Filters` exposed `Assigned To`, `Reviewer`, `Priority Rating`, `Date`, `Due soon`, `Patient`, and `Age`, plus `Clear all`, `Cancel`, and `Save`. The drawer was cancelled unchanged. The sort selector exposed `Time on Board` oldest/newest and `Priority` high/low options; it was closed without selection.

`List view` changed the URL to `/paco/workboards/57?view=list` and exposed three structural rows with columns covering stage/board timing, patient/task identity, task type, team/stage, grouping/position, breach timing, description, priority, creation/update/due dates, movement, assignment/reviewer/author, comments, attachments, and actions. `Card view` restored the default route. Task cards and actions were not opened; task and patient values are omitted.

## Execution guidance

- Treat task cards, patient context, assignments, comments, and attachments as sensitive.
- Use search, sort inspection, filters, and view switching for read-only exploration.
- Require explicit approval and controlled data before `Create New Task`, task actions, or drag-and-drop.

## Automation guidance

- Stable landmarks: route `/paco/workboards/57`, heading `Master Task Board`, search, view controls, sort, and filters.
- Do not assert live task values or counts without controlled data.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Work-board synthetic no-match searches in `Board`, `Case ID`, and `Patient` modes produced zero `Tasks` and `Cases` results and were cleared; both `View My Tasks Only` and `View My Cases Only` were toggled independently and restored. Selected-board synthetic no-match search produced zero cards without explicit message and was cleared. Filter fields and sort options inspected unchanged. List view opened for structural audit, then card view restored. Mutation: `None`; task, patient, staff, and live-count data excluded.

## Open questions

- Task detail, creation, actions, assignment, comments, attachments, and drag-and-drop behavior remain unverified.
- Repeated console errors occurred while board data rendered; user-visible impact beyond successful rendering remains unclear.

## Tester notes

[Protected area]
