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
  - name: Task card detail
    kind: navigation
verified_by: []
last_observed: 2026-10-01
---

# Master Task Board

## Purpose and context

`Observed`: `Case Load Management` → `Task Workboards` opens `/paco/workboards/57` and displays `Master Task Board` for role `Super Admin GB` in dev.

## Entry and transitions

`Work Boards` exposes `View My Tasks Only`, `View My Cases Only`, search modes `Board`/`Case ID`/`Patient`, board-name search, `Tasks`/`Cases` navigation, and `Create new board`. The selected task board card view exposes board search, view controls, sort, filters, and `Create New Task`. A synthetic no-match query reduced visible task cards to zero without an explicit empty-state message; clearing restored the board.

Synthetic no-match queries were run in all three search modes: `Board name`, `Case ID`, and `Patient name`. Each changed both board-category result counts to zero; each query was cleared, and `Board` mode was restored. `View My Tasks Only` and `View My Cases Only` were independently enabled and restored off. Selecting `Cases` navigated to `/paco/workboards/58`; no board card was opened.

Opening `Filters` exposed `Assigned To`, `Reviewer`, `Priority Rating`, `Date`, `Due soon`, `Patient`, and `Age`, plus `Clear all`, `Cancel`, and `Save`. The drawer was cancelled unchanged. The sort selector exposed `Time on Board` oldest/newest and `Priority` high/low options; it was closed without selection.

`List view` changed the URL to `/paco/workboards/57?view=list` and exposed three structural rows with columns covering stage/board timing, patient/task identity, task type, team/stage, grouping/position, breach timing, description, priority, creation/update/due dates, movement, assignment/reviewer/author, comments, attachments, and actions. `Card view` restored the default route. Task cards and actions were not opened; task and patient values are omitted.

`[Observed: dev, Super Admin GB, 2026-09-30]` `Case Load Management` flyout → `Task Workboards` first opened `/paco/workboards?tab=task`, then selected `Master Task Board` at `/paco/workboards/57`. `List view` changed query to `?view=list`. Opening `Filters` in list view showed the same fields listed above; `Due soon` list offered `Today`, `Tomorrow`, `In 3 Days`, `In 1 Week`, `Overdue`. `Escape` dismissed the list and drawer without selecting/saving. The list grid exposed `Actions` in a pinned region; no row opened and no task mutation. Do not use live task values or counts as assertions.

`[Observed: dev, Super Admin GB, 2026-10-01]` Từ `Patient Profile > Tasks`, detail của một task hiển thị `Board`, `Column`, `Status` và `Journey`. Qua `Case Load Management > Task Workboards`, chọn board theo tên trong detail (khác `Master Task Board`), thấy cùng task ở cột tương ứng; click card mở dialog tại `/paco/workboards/<board-id>?taskId=<task-id>`. `taskId`, `Board`, `Column`, `Status` khớp detail bên patient; `Escape` đóng dialog. Đây là phép đối chiếu cùng task trên hai entry, **không** phải bằng chứng có link trực tiếp giữa chúng. Board ID phụ thuộc dữ liệu; không hard-code.

## Execution guidance

- Treat task cards, patient context, assignments, comments, and attachments as sensitive.
- Use search, sort inspection, filters, and view switching for read-only exploration.
- Require explicit approval and controlled data before `Create New Task`, task actions, or drag-and-drop.

## Automation guidance

- Stable landmarks: route `/paco/workboards/<board-id>`, heading board theo dữ liệu, search, view controls, sort, filters và `taskId` query khi mở card. Không giả định mọi task thuộc `Master Task Board`.
- Do not assert live task values or counts without controlled data.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Work-board synthetic no-match searches in `Board`, `Case ID`, and `Patient` modes produced zero `Tasks` and `Cases` results and were cleared; both `View My Tasks Only` and `View My Cases Only` were toggled independently and restored. Selected-board synthetic no-match search produced zero cards without explicit message and was cleared. Filter fields and sort options inspected unchanged. List view opened for structural audit, then card view restored. Ngày 2026-10-01, accessibility snapshots của board/card/detail đối chiếu cùng `taskId` với patient task dialog; raw snapshots nằm cục bộ dưới `.playwright-mcp/`, không chia sẻ khi chưa redact. Mutation: `None`; task, patient, staff, identifier và live-count data excluded.

## Open questions

- Task detail đã quan sát read-only cho một task; creation, edit, assignment, comments, attachments và drag-and-drop behavior chưa kiểm chứng. Link trực tiếp từ `Patient Profile > Tasks` tới board chưa quan sát được.
- Repeated console errors occurred while board data rendered; user-visible impact beyond successful rendering remains unclear.

## Tester notes

[Protected area]
