# Paco Feature Tree Map

**Mục đích:** tra entry và mối liên hệ khi nhận ticket; không dùng observation làm expected result. Phạm vi hiện tại: `dev`, role `Super Admin GB`, khảo sát từng phần đến 2026-09-30. Route, trạng thái, quyền và dữ liệu phải xác minh lại trong session của ticket. Nguồn chuẩn: [`survey/views/`](survey/views/README.md), [`survey/graph.json`](survey/graph.json) và [`workflows/`](workflows/).

## Navigation tree

- `Dashboards`
  - `Dashboard` → `/paco/dashboard` ([view](survey/views/dashboard.md)).
  - `Manager` → `/paco/dashboard/manager-dashboards/overview`; các màn `Staff Performance`, `Organisation Statistics`, `All Patients`, `CQC Compliance`, `Message Outbox`, `Comms Analytics` ([view](survey/views/manager-dashboard.md)).
  - `Clinician` → `/paco/dashboard/clinician-dashboards/main`; `Mi Tasks`, `Mi Time`, `Mi Stats`, `Mi Patients` có các trạng thái riêng ([view](survey/views/clinician-dashboard.md)).
  - `Connect` → `/paco-connect/dashboard`; đã thấy HTTP 404 và trạng thái loading, chưa xác minh workflow ([view](survey/views/connect-dashboard.md)).
- `Analytics & Reports`
  - `Capacity & Demand` → `/capacity-demand/` ([view](survey/views/capacity-demand.md)).
  - `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details` → các tab trong `/patient-analyser-new/` ([view](survey/views/patient-analyser.md)).
  - `Comms Analytics` → Comms Hub external dev; cần session riêng ([view](survey/views/comms-analytics.md)).
  - `Reports` → trạng thái `not-authorized` đã quan sát cho role này; không giả định có thể chạy report ([view](survey/views/analytics-reports-scr-unauthorized.md)).
- `Comms Hub` (external dev, session riêng)
  - `Template Manager` → `/commshub/template-builder`; `Create New Email`/`Create New SMS` là ranh giới mutation ([view](survey/views/comms-template-manager.md)).
  - `Campaign Manager` → `/commshub/campaign-manager`; có `Campaign Outbox` và wizard `Create Campaign`, chưa xác minh gửi campaign ([view](survey/views/comms-campaign-manager.md)).
  - `Patient Manager` → `/commshub/patient-management`; `Lists`/`Patients`, search, date và grid filters hoạt động trong session đã xác thực. Không còn coi route này bị chặn cố định ([view](survey/views/comms-patient-manager.md)).
- `Health Forms`
  - `Inbox` → `/health-forms/responses/`; summary, status, grouping, filters và các grid. Detail/review/send chưa xác minh ([view](survey/views/health-form-inbox.md)).
  - `Designer` → `/health-forms/builder/` ([view](survey/views/health-forms-designer.md)).
  - `Designer V2` → `/paco/health-forms`; `Actions > View` mở form nhập patient data có `Create`, **không phải template detail chỉ đọc**. `View Audit` chưa tạo thay đổi UI quan sát được ([view](survey/views/health-forms-designer-v2.md)).
- `Patients`
  - `Patient Search` → `/paco/patient-search`; AG Grid, `Filters`, `Show archived`, pinned `Actions > Profile` ([view](survey/views/patient-search.md)).
    - `Profile` → `/paco/patient-profile/<patient-guid>/dashboard`; 13 tab, các bộ lọc và ranh giới mutation riêng ([view](survey/views/patient-profile.md), [workflow](workflows/patient-profile.md)).
  - `Care Navigation` → `/patient-search/`; `Patient Profile Search`, `Search Patients...`, `A-Z Search`, explicit no-match. Route đã render cho `Super Admin GB`; lỗi cũ ở role/session khác không chứng minh route hiện broken ([view](survey/views/care-navigation-patient-search.md)).
- `Web Chat & Video`
  - `Virtual Appointments` → `/web-chat/appointments/`; có thể chuyển sang xác thực riêng, chưa xác minh booking tại role này ([view](survey/views/virtual-appointments-auth.md)).
  - `Media Library` → `/web-chat/media-library/`; có auth handoff riêng ([view](survey/views/media-library.md)).
  - `Outstanding Reviews` → `/web-chat/review/`; có auth handoff riêng ([view](survey/views/web-chat-outstanding-reviews.md)).
- `Case Load Management`
  - `My Case` → `/paco/my-case`; empty state được quan sát ([view](survey/views/my-case.md)).
  - `Unallocated` → `/paco/unallocated`; search, priority tabs, list/card, filters; card actions và allocation chưa xác minh cho role này ([view](survey/views/unallocated-cases.md)).
  - `Case Workboards` → `/paco/workboards?tab=case` → `/paco/workboards/58` trong dev đã khảo sát; board ID phụ thuộc dữ liệu, không hard-code cho ticket. `List view` dùng `?view=list`; case actions chưa xác minh ([view](survey/views/master-case-board.md)).
  - `Task Workboards` → `/paco/workboards?tab=task` → chọn board phù hợp; `Master Task Board` từng ở `/paco/workboards/57`. Search, filters, sort, `List view` và một task card detail đã quan sát; task mutation chưa xác minh ([view](survey/views/master-task-board.md)).
- `Appointment Book`
  - `Appointment Book` → `/paco-connect/appointment-book`; HTTP 404 khi kiểm tra 2026-09-20. Không dùng route này để suy ra `Day`/`Week`/`Month`/`Year`, counters, booking hay cancel đang khả dụng ([view](survey/views/appointment-book-route-failure.md)).
  - `Appointment Settings` → `/paco-connect/configuration`; HTTP 404 trong cùng lần kiểm tra ([view](survey/views/appointment-book-route-failure.md)).
- `Quick Pay`
  - `Invoices` → `/paco-connect/quick-pay/invoices`; HTTP 404 **nhưng grid vẫn render**. Không suy ra lifecycle của invoice ([view](survey/views/quick-pay-invoices.md)).
  - `Product Catalogue` → `/paco-connect/quick-pay/products`; HTTP 404 **nhưng grid vẫn render**, không phải blank page ([view](survey/views/quick-pay-product-catalogue.md)).
  - `Accounts` → `/paco-connect/quick-pay/accounts`; HTTP 404 **nhưng grid vẫn render**, không phải blank page ([view](survey/views/quick-pay-accounts.md)).
- `User Portal` → `/paco-connect/user-training-portal`; HTTP 404 trong lần kiểm tra ([view](survey/views/user-portal-route-failure.md)).
- `Configuration` → `/paco/configuration/organisation/general` ([view](survey/views/configuration.md))
  - `Organisation`: `General`, `Locations`, `Skills`, `Code Rule`, `Sharing Agreements`, `Pathways Config`, `Services`, `Dx Priority`, `Org Priority`, `Inbound Priority Flow`, `Announcements`, `Integrations`, `Practice Profiles`. Trạng thái từng child tại [survey views](survey/views/README.md); `Pathways Config` và `Practice Profiles` từng trả `Page Not Found`.
  - `Patient`: `DFD` từng trả 404 ([view](survey/views/patient-dfd-route-failure.md)); `Care Navigation Config` là trang cấu hình riêng, không đồng nhất với `Patients > Care Navigation` ([view](survey/views/patient-care-navigation.md)).
  - `Appointment Books`: `Scheduler` → `/configuration/#scheduler-config` có content (`Select Campaign`, template/slot-type search) ([view](survey/views/appointment-books-scheduler.md)); `Sessions` → `/paco-connect/configuration/#clinics` trả HTTP 404 và `Loading sessions` ([view](survey/views/appointment-books-sessions.md)); `Appointment Books`, `Slot Types`, `Appointments`, `External Appt Reminders` có trạng thái riêng trong [survey views](survey/views/README.md).
  - `Quick Pay`: `Product Catalogue` và `Accounts` trỏ tới các grid đã ghi phía trên.
  - `Patients & Proxy`: `Role Groups` ([view](survey/views/patients-proxy-role-groups.md)).
  - `Users & Staff`: `Staff Profiles`, `Role Groups`, `Teams` ([view](survey/views/users-staff-profiles.md)).
  - `Clinical Config`: `Risk Strat Builder`, `Template Library` ([view](survey/views/risk-strat-builder.md), [route issue](survey/views/template-library-route-failure.md)).
  - `Case Prioritisation` ([view](survey/views/case-prioritisation.md)).
- `Rocket Bar`: `Launch Rocket Bar`, `Download Rocket Bar`; chưa xác minh hành vi sau khi chọn ([view](survey/views/rocket-bar.md)).

## Handoff và thao tác được xác minh

| Entry | Chuyển trạng thái đã quan sát | Ranh giới / chưa xác minh |
|---|---|---|
| `Patient Search > Actions > Profile` | Mở full `Patient Profile` trên `/paco/patient-profile/<patient-guid>/dashboard` | Khớp pinned `Actions` với main row bằng `row-index`; `View` là modal khác, không thay thế `Profile` ([view](survey/views/patient-search.md)). |
| `Patient Profile` | Có **13 tab**: `Dashboard`, `Timeline`, `Coding`, `Consultations & Admin`, `Care Plan`, `Medication`, `Patient Comms`, `Shared Records`, `Investigations`, `Appointments`, `Documents`, `Payments`, `Tasks` | `Care Plan > Start`, `Create New task`, `New Prescription`, `GP Connect`/`Launch NCRS` chưa dùng ([view](survey/views/patient-profile.md)). |
| `Patient Profile > Tasks` ↔ `Task Workboards` | Click task mở `/paco/patient-profile/<patient-guid>/tasks?taskId=<task-id>`; chọn board tương ứng qua `Task Workboards`, thấy cùng task/card ở cột tương ứng; card detail mở `/paco/workboards/<board-id>?taskId=<task-id>` với cùng board, column, status | Đối chiếu thủ công hai entry, không quan sát link trực tiếp từ nhãn `Board`; ID không hard-code, mutation chưa dùng ([view](survey/views/patient-profile.md), [board](survey/views/master-task-board.md)). |
| `Case Load Management > Task Workboards` | `/paco/workboards?tab=task` → chọn `Master Task Board` → `/paco/workboards/57`; `List view` thêm `?view=list` | Board ID không phải route cố định; detail của một task trên board khác đã mở read-only, mutation chưa xác minh ([view](survey/views/master-task-board.md)). |
| `Health Forms > Designer V2 > Actions > View` | Mở dialog với các trường patient bắt buộc và `Create` disabled khi trống | Dừng trước nhập dữ liệu hoặc `Create`; không gọi đây là preview thuần read-only ([view](survey/views/health-forms-designer-v2.md)). |
| `Configuration > Appointment Books > Scheduler` | Mở trang `Scheduler Config` với `Select Campaign` và tìm template/slot type | Không suy ra booking, session editing hay liên kết sang Patient Scheduler ([view](survey/views/appointment-books-scheduler.md)). |

## Khi nhận ticket

1. Tra entry ở tree và mở view/workflow được dẫn; ghi role, environment, route và trạng thái xác thực hiện tại.
2. Xác minh landmark và handoff bằng UI trong session ticket. Nếu route 404/loading/redirect, ghi `Blocked` hoặc `Inconclusive` đúng bằng chứng; không thay bằng luồng suy đoán.
3. Tách ticket requirement khỏi `Observed` survey. Expected result chỉ lấy từ ticket hoặc nguồn nghiệp vụ tin cậy. Mutation cần đúng scope, dev-host guard, test data/recipient an toàn, ledger và cleanup theo [data-safety](../standards/data-safety.md).

**Chưa xác minh:** `Appointment Book` booking/cancel/counters, `Sessions` create/edit, generic `Quick Send` booking link, Patient Scheduler self-book/cancel, và handoff giữa `Patient Comms`/`Health Form Inbox`. Tài liệu ticket cũ không tự biến các flow này thành pattern chung.
