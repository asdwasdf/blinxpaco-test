---
name: paco-qa-session-continuity
description: Đọc handoff trong workspace để tiếp tục thiết kế skill Paco mà không mất ngữ cảnh.
metadata:
  type: project
---

# Paco QA Session Continuity

## Đọc trước khi tiếp tục

1. `docs/product/feature-tree.md` — Navigation tree + cross-module links (mới tạo 2026-09-30)
2. `docs/product/feature-tree-quick-ref.md` — Quick lookup guide (mới tạo 2026-09-30)
3. `docs/product/paco-overview.md` — 300+ dòng observations rời rạc
4. `docs/product/survey/views/` — 56 individual view docs

## Đã làm (2026-09-30)

### Tree Map
- Tạo `docs/product/feature-tree.md` với:
  - Full navigation tree (sidebar groups → child items)
  - Cross-module links (Patient ↔ Profile, Connect ↔ Scheduler)
  - Common interaction patterns (AG Grid, Drawer, Status Menu)
  - Quick lookup bằng từ khóa
  - Status + Error guide

### Quick Reference
- Tạo `docs/product/feature-tree-quick-ref.md` với:
  - Keyword → location lookup table
  - Cross-system flow patterns
  - Navigation quick commands
  - URL patterns
  - Test checklists

## Còn phải làm

1. **Deep dive interactions** — Tree map mới có structure, cần chi tiết hơn về micro-interactions:
   - Appointment Book: view, counters, book, cancel
   - Session management: create, edit, preview, cancel
   - Quick Send booking link flow
   - Scheduler patient self-booking

2. **Interaction Playbook** — Reusable step-by-step cho các pattern phổ biến

3. **Error recovery docs** — Khi X xảy ra → làm gì

4. **Feature branches** — Cách test với feature branch (PAC2-8552 pattern)

## Notes

- PAC2-8552 là ví dụ cho thấy flow loằng ngoằng qua nhiều systems (Connect ↔ Scheduler)
- Tree map hiện tại đủ để tra nhanh location, chưa đủ cho micro-interactions
- Next: xây interaction-playbook/ cho các feature phức tạp
