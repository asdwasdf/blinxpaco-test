---
id: master-case-board
title: Master Case Board
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - unallocated-cases
controls:
  - name: Search this board
    kind: search
  - name: List view
    kind: navigation
  - name: Card view
    kind: navigation
  - name: Filters
    kind: filter
verified_by: []
last_observed: 2026-10-01
relationships:
  - id: run-20261001-085609-p2-master-case-board-1
    from: master-case-board
    destination_hint: work board mới
    trigger: Create new board
    relationship: workflow
    context: []
    classification: Inferred
    mutation_boundary: true
    evidence:
      - test-results/product-survey/run-20261001-085609/outcomes/
---

# Master Case Board

## Purpose and context

`Observed`: `Case Load Management` → `Case Workboards` opens `/paco/workboards/58` and displays `Master Case Board` for role `Super Admin GB` in dev.

## Entry and transitions

Card view exposes board search, sort, filters, priority tabs, and case cards. A synthetic no-match query reduced visible case cards to zero without an explicit empty-state message; clearing restored cards. Every visible priority tab was visited and `All` restored: `Mid Priority`, `High Priority`, `Low Priority`, `Emergency`, and `Other`.

Opening `Filters` exposed `Age`, `Incoming Service`, `Pathway`, `Skills`, `Priority`, `Case Status`, and `PDS Validated Status`, plus `Clear all`, `Cancel`, and disabled `Save`. The drawer was cancelled unchanged.

`List view` changed the URL to `/paco/workboards/58?view=list` and exposed 42 structural rows with visible columns `Indicators`, `Date`, `Case Status`, `Priority`, `Case Score`, `Case ID`, `Viewer`, and `Actions`. `Card view` restored the default route. Case cards and actions were not opened; case and patient values are omitted.

`[Observed: dev, Super Admin GB, 2026-10-01]` `Case Load Management > Case Workboards` mở danh sách `/paco/workboards?tab=case`, rồi `Master Case Board` tại `/paco/workboards/58`. `List view` thêm `?view=list`; `Group by: By Priority` gom grid thành các row nhóm, xuất hiện `Clear grouping`. Cột đang hiển thị gồm `Indicators`, `Priority`, `Date`, `Case Status`, `Case Score`, `Case ID`, `Viewer`, `Patient Name`, `Age`, `Time Received`, `Active Time`, `Time to breach`, và pinned `Actions`. `Clear grouping` khôi phục ungrouped grid; `Card view` khôi phục URL mặc định. Không expand nhóm hay mở case; không lưu tên, ID, tuổi, priority value hoặc live count.

## Execution guidance

- Treat case cards, patient context, and board counts as sensitive.
- Use search, priority tabs, sort inspection, filters, and view switching for read-only exploration.
- Require explicit approval and controlled data before case actions or drag-and-drop.

## Automation guidance

- Stable landmarks: route prefix `/paco/workboards/`, heading `Master Case Board`, search, view controls, priority tabs, and filters.
- Do not assert live counts or case values without controlled data.

## Evidence

Accessibility and targeted DOM observation, dev, `Super Admin GB`, 2026-09-20. Synthetic no-match search produced zero cards without explicit message and was cleared. Every visible priority tab was visited and `All` restored. Filter drawer opened and cancelled unchanged. List view opened, grid structure observed, then card view restored. On 2026-10-01, UI navigation, `List view > By Priority > Clear grouping > Card view` verified with no group expansion. Mutation: `None`; case, patient, and live-count data excluded.

## Open questions

- Case-card detail, actions, allocation, status transitions, and drag-and-drop behavior remain unverified.
- Repeated console errors occurred while board data rendered; user-visible impact beyond successful rendering remains unclear.

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Case Workboards` mở một board cụ thể `/paco/workboards/<id>`: `Work Boards`, `Master Case Board`, cột `Awaiting patient validation`; có `Create new board`.

## Tester notes

[Protected area]
