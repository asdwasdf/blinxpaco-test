# Feature Tree Quick Reference

Tra route nhanh cho ticket Paco. **Observed**, không phải expected result. Phạm vi: `dev`, `Super Admin GB`, đến 2026-09-30. Nguồn chuẩn: [feature tree](feature-tree.md) → [survey views](survey/views/README.md); luôn xác minh lại role/auth/route trong session ticket.

| Ticket nhắc đến | Entry đã quan sát | Tình trạng / nguồn |
|---|---|---|
| `Patient Profile` | `Patient Search > Actions > Profile` → `/paco/patient-profile/<patient-guid>/dashboard` | 13 tab; khớp pinned `Actions` với patient row theo `row-index` ([view](survey/views/patient-profile.md)). |
| `Task` / `Task Workboard` | `Case Load Management > Task Workboards` → `/paco/workboards?tab=task` → chọn board | `Master Task Board` từng là `/paco/workboards/57`; board ID phụ thuộc dữ liệu; `List view` dùng `?view=list` ([view](survey/views/master-task-board.md)). |
| `Case` / `Case Workboard` | `Case Load Management > Case Workboards` → `/paco/workboards?tab=case` → chọn board | `Master Case Board` từng là `/paco/workboards/58`; action chưa xác minh ([view](survey/views/master-case-board.md)). |
| `Unallocated` | `Case Load Management > Unallocated` → `/paco/unallocated` | Search, tabs, filters và list/card đã quan sát ([view](survey/views/unallocated-cases.md)). |
| `Health Form Inbox` | `Health Forms > Inbox` → `/health-forms/responses/` | Summary/filter/grouping đã quan sát; response detail, review/send chưa xác minh ([view](survey/views/health-form-inbox.md)). |
| `Health Form Designer V2` | `Health Forms > Designer V2` → `/paco/health-forms` | `View` mở patient-data form với `Create`; đóng trước mutation ([view](survey/views/health-forms-designer-v2.md)). |
| `Patient Manager` | `Comms Hub > Patient Manager` → external `/commshub/patient-management` | Hoạt động trong Comms Hub session đã xác thực; cần auth riêng khi hết hạn ([view](survey/views/comms-patient-manager.md)). |
| `Care Navigation` | `Patients > Care Navigation` → `/patient-search/` | `Patient Profile Search`, `A-Z Search` và no-match đã quan sát; không còn mặc định coi broken ([view](survey/views/care-navigation-patient-search.md)). |
| `Scheduler Config` | `Configuration > Appointment Books > Scheduler` → `/configuration/#scheduler-config` | Trang cấu hình, **không phải** bằng chứng booking flow ([view](survey/views/appointment-books-scheduler.md)). |
| `Session` | `Configuration > Appointment Books > Sessions` → `/paco-connect/configuration/#clinics` | HTTP 404 + `Loading sessions` trong lần kiểm tra; không xác minh create/edit ([view](survey/views/appointment-books-sessions.md)). |
| `Appointment Book` / `Slot` / `Cancel Appointment` | `Appointment Book > Appointment Book` → `/paco-connect/appointment-book` | HTTP 404 trong lần kiểm tra; block Connect booking/cancel assertion cho tới khi route và flow được xác minh lại ([view](survey/views/appointment-book-route-failure.md)). |
| `Quick Pay` | `Quick Pay > Invoices`; `Configuration > Quick Pay > Product Catalogue` / `Accounts` | Các PACO Connect route báo HTTP 404 **nhưng grid vẫn render**; xem [Invoices](survey/views/quick-pay-invoices.md), [Products](survey/views/quick-pay-product-catalogue.md), [Accounts](survey/views/quick-pay-accounts.md). |
| `Template Library` | `Configuration > Clinical Config > Template Library` | Phân biệt submenu với route báo 404; xem [route issue](survey/views/template-library-route-failure.md) và [workflow](workflows/configuration.md). |
| `Reports` | `Analytics & Reports > Reports` | Trạng thái `not-authorized` từng quan sát cho role này ([view](survey/views/analytics-reports-scr-unauthorized.md)). |

## Handoff có bằng chứng

- `Patient Search > Actions > Profile` mở full `Patient Profile`, khác `Actions > View` modal. `Tasks` detail và card trên board tương ứng có cùng `taskId`, `Board`, `Column`, `Status` sau khi điều hướng riêng qua `Task Workboards`; **chưa** thấy link trực tiếp sang board. `Patient Comms`/`Appointments` chưa xác minh liên kết inbox/booking ([workflow](workflows/patient-profile.md)).
- `Task Workboards` đi từ danh sách board tới board detail, rồi `List view` đổi query. `Filters > Due soon` có `Today`, `Tomorrow`, `In 3 Days`, `In 1 Week`, `Overdue`; chưa áp dụng filter ([view](survey/views/master-task-board.md)).
- `Designer V2 > Actions > View` mở patient-details form có `Create` boundary, không phải detail chỉ đọc ([view](survey/views/health-forms-designer-v2.md)).

## Kiểm tra trước khi thiết kế case

1. Xác minh host, role, auth và entry bằng UI; dùng route ở bảng như clue, không làm route/board ID hard-coded.
2. Đọc ticket requirement, sau đó đối chiếu `Observed` view/workflow; thiếu expected result hoặc safe test data thì ghi câu hỏi, không suy đoán.
3. Dừng ở mutation ngoài scope. Trong ticket execution đã duyệt, dùng dev-host runtime guard, test data/recipient an toàn, mutation ledger và cleanup theo [data-safety](../standards/data-safety.md).
4. Route HTTP 404 có thể vẫn render UI ở Quick Pay; kiểm tra cả HTTP status **và** visible content. `Appointment Book` chưa có workflow xác minh cho role này.

**Chưa dùng làm generic test pattern:** PAC2-8552 booking/cancel, fixed counter delta, `Quick Send > Booking Link`, Patient Scheduler self-book/cancel. Chỉ thêm khi ticket riêng có requirement, route khả dụng và evidence cho đúng flow.
