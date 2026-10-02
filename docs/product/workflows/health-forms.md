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

## Logic từ ticket

Nguồn: `PAC2-4399`, `PAC2-5776`, `PAC2-6982`.

### Health Form Designer — component Blood Pressure

**Luồng**
1. `Health Forms` → `Designer` → `/health-forms/builder/`; list search theo title; form có type `Scheduled One-Off`/`One-off Health Form`, status `Active`, cột editable. `[Observed]` — PAC2-4399/exploration.md
2. Grid cột `Health Form Name`, `Created By Organisation`, `Shared To Organisation(s)`, `Archived`, `Editable`, `Actions`; nhiều form hiện `-` ở creator/shared nên không đủ chứng minh ownership. `[Observed]` — PAC2-6982/exploration.md
3. Component `Blood Pressure`: label, hint, hai input `SYS`/`DIA`; `Select Emis Header`, `Record Question/Answer in Patient Record`, `Search SNOMED Code`; chọn ghi nhận (a) một entry kết hợp "O/E - blood pressure reading <sys>/<dia> mmHg" hoặc (b) `Separate Diastolic and Systolic entries`; form-level `Add Total Health Form Score to Patient Record`. `[Observed]` — PAC2-4399/exploration.md, report.md

**Business rules**
- Danh sách là AG Grid với pinned action column: mapping row center ↔ pinned bằng row-id; map theo index có thể mở nhầm form. `[Observed]` — PAC2-4399/exploration.md
- Editor không hiển thị ConceptID/DescriptionID đã chọn nên UI không đủ làm bằng chứng mapping. `[Observed]` — PAC2-4399/exploration.md
- Health Form có hai quan hệ tổ chức `Created by` và `Shared To`; form do child practice tạo, không `Shared To` chính practice đó, vẫn phải truy cập được khi nằm trong Shared Campaign của PCN gửi tới practice (campaign share hiệu lực thay cho `Shared To` của form). `[Confirmed]` — PAC2-6982/requirements.md (REQ-002)

**Role/permission**
- Rule truy cập với organisation ngoài phạm vi nhận campaign chưa rõ. `[Open Question]` — PAC2-6982/requirements.md (OQ-004)

**Defect đã biết**
- PAC2-4399 · Pass (cấu hình UI, theo yêu cầu tester) · side panel `Blood Pressure` có lựa chọn combined O/E được chọn, `Separate...` không chọn; không phải xác nhận EMIS code đã filed. `[Observed]` — PAC2-4399/report.md
- PAC2-6982 · Blocked (TC-001 P0, TC-002 positive control) · chưa xác minh form do child tạo không `Shared To` và chưa có patient/recipient an toàn; chưa có Pass/Fail. `[Observed]` — PAC2-6982/status.md

**Open questions**
- Behavior `Submit`/lưu câu trả lời; control path hợp lệ (form có `Shared To` khác). `[Open Question]` — PAC2-6982/requirements.md

### Health Form Inbox

**Luồng**
1. `Health Forms` → `Inbox` → `/health-forms/responses/`; `View By Health Form` lọc ra response hoàn thành với trạng thái `synced`; header `Synced to Primary Care Patient Record`. `[Observed]` — PAC2-4399/exploration.md
2. Summary phân biệt `Reviewed (synced)` và `Reviewed (not synced)`. `[Observed]` — PAC2-4399/exploration.md
3. `View Form` mở dialog read-only (SYS/DIA disabled); `Add/View Comments`, `More Actions`, `Send to Patient Record` (mutation). `[Observed]` — PAC2-4399/exploration.md
4. `Quick Send` làm follow-up action từ Inbox (xem `comms-hub.md#popup-scheduler-link-required`). `[Confirmed]` — PAC2-5776/requirements.md

**Business rules**
- Response đang được user khác review: dialog hiện lock notice, nút filing disable, có `Click Here to Take Over`. `[Observed]` — PAC2-4399/exploration.md

**Trạng thái**
- Response: `synced`, `Reviewed (synced)`, `Reviewed (not synced)`, locked (đang review). `[Observed]` — PAC2-4399/exploration.md

**Defect đã biết**
- PAC2-4399 · Inconclusive (possible defect) · modal `Review Answers`/`View Form` kẹt loading (loader hiện, content ẩn, không empty/error/retry); mẫu 6 response: 3 kẹt, 1 unlocked, 2 locked; không phải lỗi do lock. `[Observed]` — PAC2-4399/exploration.md
- PAC2-4399 · Inconclusive (possible defect, accessibility) · `Save to Record` và `Save & Follow up` cùng accessible label; icon `expand` không có accessible name. `[Observed]` — PAC2-4399/exploration.md
- PAC2-4399 · Blocked · `Save to Patient Record` (đã duyệt): dialog xác nhận vẫn mở, request filing lên EMIS trả HTTP 403, không đổi trạng thái `synced`. `[Observed]` — PAC2-4399/exploration.md

**Open questions**
- Nguyên nhân modal kẹt loading chưa triage; 403 là authorization hay server rejection. `[Open Question]` — PAC2-4399/exploration.md

## Tester notes
