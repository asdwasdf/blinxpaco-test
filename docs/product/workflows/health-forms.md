# Workflow: Health Forms

- Classification: `[Observed: dev, Super Admin GB, 2026-10-01]`
- Aliases: `Health Forms`, `Inbox`, `Designer`, `Designer V2`, `Health Form Templates`
- Coverage: `Partial`
- Confidence: `Medium`

## Business context observed

- Visible purpose: gửi, theo dõi và review health form của bệnh nhân; thiết kế form.
- Actor/role: `Super Admin GB`, site `General Practice (Demo Site)`.
- Required context: phiên PACO đã đăng nhập.
- Starting data state: Inbox counters đều 0; Designer có danh sách form.
- Entities and statuses: health form (type, reviewer, archived, editable), response (sent, incomplete, overdue, completed, awaiting review).

## Entry

1. Sidebar `Health Forms` mở submenu `Inbox`, `Designer`, `Designer V2`.
2. `Inbox` → `/health-forms/responses/`; `Designer` → `/health-forms/builder/` (Health Forms app riêng); `Designer V2` → `/paco/health-forms` (`Health Form Templates`, trong PACO).

## Read-only flow

1. **Action:** mở `Inbox`.
   - **Observed result:** `Health Form Inbox`, auto refresh `Refreshing in N seconds`, counters `Total Sent to Patient`/`Incomplete`/`Overdue from Patient`/`Completed by Patient` = 0, `View By Patient`/`View By Health Form`.
2. **Action:** `Filters` trong Inbox.
   - **Transition:** panel `Inbox Filters` (`Date Range` `All time`, `Health Form`, `Reviewers`).
3. **Action:** mở `Designer`.
   - **Observed result:** danh sách form với cột type, reviewer, name, created/updated, shared organisations, archived, editable, actions.

## Decision points

- **Visible condition:** `Designer` vs `Designer V2`.
  - **Branch A:** app Health Forms riêng (`/health-forms/builder/`).
  - **Branch B:** trang trong PACO (`/paco/health-forms`). Quan hệ giữa hai designer: `Open Question`.

## End and exceptional states

- Empty: Inbox không có response.
- Loading: app cần 8–12s để render; title rỗng trong lúc tải.
- Cross-feature handoff: PACO → Health Forms app.

## Safety boundary

- Last safe read-only state: Designer list, Inbox filters panel.
- Approval stop: `New Health Form` (draft, persistence chưa rõ), mọi action gửi form cho bệnh nhân.
- Mutation: `None`

## Execution guidance

- Setup/data: cần form synthetic đã gửi để xem luồng review.
- Safe manual steps: Entry 1–2, Read-only flow 1–3.
- Stop and request approval before: `New Health Form`, gửi form.
- Evidence to capture: counters Inbox, danh sách cột Designer.

## Automation guidance

- Stable roles/labels/landmarks: button `Filters`, `Columns`, `View By Health Form`; text `Health Form Inbox`.
- Observable waits: chờ text `Health Form Inbox` hoặc counters; tránh fixed sleep.
- Data dependencies: response synthetic.
- Assertions lacking trusted expected basis: giá trị counters, khác biệt Designer/Designer V2. `Filters`/`Columns` trong Designer không click được trong 8s ở run này.

## Provenance and gaps

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-01 (run-20261001-085609)
- Raw evidence: `test-results/product-survey/run-20261001-085609/outcomes/`
- Open questions: Designer vs Designer V2; menu row actions trong Designer chưa quan sát.
- Exact resume state: checkpoint run trên, task variant `Switch Inbox View By Health Form` còn queued.

## Tester notes
