---
id: patient-profile
title: Patient Profile
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - patient-search
controls:
  - name: Patient actions
    kind: menu
  - name: Care Plan
    kind: tab
  - name: Tasks
    kind: tab
  - name: Task detail
    kind: navigation
  - name: Patient Comms
    kind: tab
  - name: Consultations & Admin
    kind: tab
  - name: Medication
    kind: tab
  - name: Shared Records
    kind: tab
verified_by: []
last_observed: 2026-10-01
---

# Patient Profile

## Purpose and context

`Observed`: dev, role `Super Admin GB`, manual auth hợp lệ. `Patient Search` → pinned `Actions` → `Profile` mở `/paco/patient-profile/<patient-guid>/dashboard`. Hồ sơ quan sát có 13 tab, gồm `Care Plan` và `Consultations & Admin`. Không ghi patient GUID hoặc nội dung clinical record.

## Entry and transitions

`Observed` ngày 2026-09-30:

| Thao tác | Route suffix / state | Kết quả quan sát | Ranh giới chưa vượt |
|---|---|---|---|
| `Patient actions` | `dashboard`, menu mở | 16 mục gồm `Quick Book`, `Quick Send`, `Quick Form`, `Create Task`, `Show Audit`; đóng bằng `Escape` | Không thực thi menu action |
| `Care Plan` | `care-plan` | Summary; card `Comprehensive Geriatric Assessment` ở `Not started`; `Patient's copy` disabled | `Start` chưa dùng |
| `Appointments` | `appointments` | `Search appointments`; grid `Appt Type`, `Appointment Name`, `Date`, `Start Time`, `End Time`, `Status`, `Actions` | Chưa xác minh populated appointment detail |
| `Tasks` → `Closed` → `All` | `tasks`, quick filter đổi | `Closed` trả 0 tasks; `All` khôi phục populated grid | `Create New task` chưa dùng |
| `Patient Comms` → `booking links` → `all comms` | `patient-comms?category=booking+links`, rồi `category=all+comms` | Cả hai state `No messages to show` | Chưa có message detail/send |
| `Consultations & Admin` → `Draft` → `All` | `consultations`, query `cf` thay đổi | `Draft` được `aria-pressed=true`; danh sách thu hẹp; `All` bỏ status draft khỏi query | `Add entry` chưa dùng |
| `Medication` → `More Filters` → `Cancel` | `medications`, drawer đóng | Filter `Organisation`, `Clear all`, `Cancel`; `Save` disabled khi chưa sửa | `New Prescription` và medication record chưa dùng |
| `Shared Records` | `shared-records` | `Date Selection`, search, `GP Connect`, `Launch NCRS` | Hai launch controls chưa dùng |

`Observed`: `Tasks` grid có các cột `Board Name`, `Team/Stage`, `Assigned To`, `Reviewer`, `Author`. `[Observed: dev, Super Admin GB, 2026-10-01]` Click một task trong grid mở dialog trên `/paco/patient-profile/<patient-guid>/tasks?taskId=<task-id>`, hiển thị `Board`, `Column`, `Status`, `Journey`; `Escape` đóng dialog và bỏ query. Điều hướng riêng bằng `Case Load Management > Task Workboards`, chọn đúng board theo `Board` trong detail, thấy cùng task ở cột tương ứng; mở card cho cùng `taskId` tại `/paco/workboards/<board-id>?taskId=<task-id>` và đối chiếu `Status` không đổi. Đây là liên hệ dữ liệu và detail dùng chung; không thấy link trực tiếp từ dialog `Board` sang workboard trong lần quan sát. Không lưu identifier hoặc nội dung task/patient. `Patient Comms` có category `health forms`; `[Observed: dev, Super Admin GB, 2026-10-01]` chọn category này giữ nguyên Patient Profile, đổi query thành `category=health+forms` và hiển thị `No Health Forms to show` cho patient đang xem. Không mở `Health Form Inbox`; không thấy link trực tiếp trong empty state. Quan hệ với inbox vẫn chưa xác minh.

`[Observed: dev, Super Admin GB, 2026-10-01]` Reverify `Patient Search > Actions > Profile`: tablist có 13 tab theo thứ tự `Dashboard`, `Timeline`, `Coding`, `Consultations & Admin`, `Care Plan`, `Medication`, `Patient Comms`, `Shared Records`, `Investigations`, `Appointments`, `Documents`, `Payments`, `Tasks`. `Dashboard` hiển thị `At a Glance`, `Conditions`, `Registers`, `Pending Documents`, `Risk Stratification`, `Appointments`, `Timeline`, `Active Tasks`, `Patient Communications`, cùng `Error loading pharmacies` cho patient đã chọn. `Risk factors` là disclosure; click mở `aria-expanded=true` và list 19 cấu trúc items, click lần nữa đóng. Không sao chép risk/clinical values hoặc patient identifier. `Customise Dashboard`, `Health Report`, patient/task/document controls chưa dùng; mọi count và lỗi chỉ là state của patient/session này, không phải expected cố định.

`[Observed: dev, Super Admin GB, 2026-10-01]` `Dashboard > Risk Stratification > Open the full risk score trend` mở dialog `Risk Stratification Trend` ngay trên patient profile; `All Time` đang chọn, có `Last 1 Month`, `Last 3 Months`, `Last 6 Months`, `Last 12 Months` và chart `Risk score`. `Close` trở về dashboard, route không đổi. Đây là chi tiết nội bộ widget, chưa thấy navigation tới `Risk Strat Builder` trong Configuration. Trong cùng session, tab `Investigations` (`test-results`) ở cả `Results` và `Requested` hiển thị `Failed to load ICE. Please try again.`; không mở `+ New Request`, không kết luận nguyên nhân.

`[Observed: dev, Super Admin GB, 2026-10-01]` Click card `Active Tasks` trên Patient Profile `Dashboard` chuyển trực tiếp sang tab `Tasks` của cùng patient (`/paco/patient-profile/<patient-guid>/tasks`), không mở dialog hay chuyển tới Task Workboards. Tab `Tasks` hiển thị grid, quick filters `Active`/`Closed`/`All` và `Total Tasks` cho patient hiện tại. Không dùng `Create New task`; count là dữ liệu động, không phải expected cố định.

`[Observed: dev, Super Admin GB, 2026-10-01]` Card `Patient Communications` trên `Dashboard` hiển thị `Total Communications` (chia `Email`/`SMS`) và `Health Forms` (chia `Completed`/`Incomplete`) cho patient hiện tại; các count đều bằng 0 trong lần xem này. Click phần heading và metric `Health Forms` không đổi route/tab, không mở dialog. Khác card `Active Tasks`, chưa quan sát được điều hướng từ card này tới `Patient Comms` hoặc `Health Form Inbox`; không suy ra card hoàn toàn không tương tác với mọi dữ liệu.

`[Observed: dev, Super Admin GB, 2026-10-01]` Với patient do tester chỉ định có dữ liệu, card `Patient Communications` hiển thị `Total Communications` bằng 0 và `Health Forms` bằng 70 (`Completed` 4, `Incomplete` 66) ở thời điểm quan sát. Click heading và metric `Health Forms` vẫn không đổi route/tab hoặc mở dialog. Chọn tab `Patient Comms` thủ công → `health forms` hiển thị danh sách form đã gửi; chọn một mục mở preview form trong `iframe` tại cùng route với `category=health+forms`. Preview chứa các control có trạng thái khác nhau; không nhập/chỉnh sửa và không mở link ngoài. Không kiểm chứng một-một giữa 70 trên card và danh sách/`Health Form Inbox`; chưa quan sát link trực tiếp từ card tới Inbox.

`[Observed: dev, Super Admin GB, 2026-10-01]` Điều hướng riêng từ profile sang `Health Forms > Inbox`, search grid theo patient: tìm được một candidate có cùng patient, form title và organisation với một mục trong `Patient Comms > health forms`. Không xác minh cùng form instance do Inbox không hiển thị sent timestamp/instance ID ở các cột quan sát, title có thể trùng; không mở `View Form` vì UI refresh từng không ổn định. Form preview đã chọn trên profile chưa thấy trong các row Inbox đang render, nhưng chưa kiểm tra toàn bộ pagination/filter. Search đã xóa; không đưa patient/form identifiers vào docs.

`[Observed: dev, Super Admin GB, 2026-10-01]` Kiểm tra `Columns`/`Filters` của `Health Form Inbox` thấy `Response ID` (cột ẩn, filter UUID) và `Date Sent` (cột checked, filter ngày). Chưa quan sát cùng ID hoặc timestamp đủ chính xác trong `Patient Comms`; không bật cột, nhập filter hoặc kết luận candidate là cùng instance.

## Execution guidance

- Dùng `Patient Search` và khớp main row với pinned `Actions` bằng `row-index`; không dùng thứ tự button toàn trang.
- Quan sát riêng route, active tab/filter, nội dung trạng thái; không lưu clinical record, danh tính hoặc query `cf` chứa organisation identifiers.
- Mutation được người dùng cho phép cho survey dev; vẫn cần runtime gate, fixture riêng, ledger và cleanup. Không sửa patient đang khảo sát chỉ vì có approval tổng quát.
- Mutation lượt này: `None`. Không gọi integration, tạo prescription, care plan hoặc task.

## Automation guidance

- Locator theo exact role/name cho tab, `Patient actions`, `More Filters`, drawer `Cancel`.
- `All` có thể xuất hiện nhiều lần: scope đúng filter group; không dùng `button:has-text('All')` toàn panel.
- Chờ route suffix và tabpanel; dùng `aria-pressed` cho consultation status. `Tasks` quick filters không có `aria-pressed` ở lần quan sát: cần thêm content assertion, không dựa CSS hash.
- Với populated task: scope đúng grid row trước click; kiểm tra dialog và query `taskId`, rồi đối chiếu board qua UI và cùng `taskId` ở card detail. Redact cả hai ID khi ghi evidence; không click `edit`, `Add` hoặc drag card.
- `Dashboard > Active Tasks` card không có role `button` trong lần quan sát: scope theo text/widget và chờ tab `Tasks` cùng route `/tasks`; không assert count cố định hoặc suy đoán handoff sang workboard.
- Dialog `Risk Stratification Trend`: scope theo role `dialog`, kiểm tra `All Time` pressed và đóng bằng `Close`; không assert chart values theo patient. `Investigations` cần chờ explicit error/empty/content, không coi `Failed to load ICE` là empty state.
- `Patient Communications` card: kiểm tra cấu trúc label và route/tab sau click ở fixture có/không có dữ liệu; không assert count cố định. `Patient Comms > health forms` có thể render `iframe` preview sau khi chọn record; chỉ quan sát, không fill hoặc click link/form control; tránh ghi tên form và patient data vào artifact.
- Counts/empty states phụ thuộc patient fixture; observation không tạo expected nghiệp vụ.

## Evidence

Accessibility snapshot và DOM projection chỉ lấy control/state, ngày 2026-09-30 và 2026-10-01, role `Super Admin GB`, dev. Ngày 2026-10-01: tab order, dashboard widget headings, disclosure `aria-expanded` và structural item count; thêm hai dialog của cùng task từ patient grid và workboard card với route/query, board, column, status đối chiếu trong browser. Không mở widget detail hoặc mutation; không đưa dữ liệu live vào tài liệu. Chi tiết flow tại [patient-profile workflow](../../workflows/patient-profile.md). Raw browser snapshots nằm cục bộ dưới `.playwright-mcp/`; không coi raw output là bằng chứng đã redact để chia sẻ.

## Open questions

- `Care Plan > Start` tạo draft ngay hay chỉ mở editor? Cleanup thế nào?
- `GP Connect`/`Launch NCRS` cần auth nào, có side effect nào?
- Populated appointment detail chưa kiểm chứng. `Patient Comms > health forms` có populated list và iframe preview; `Health Form Inbox` có candidate trùng patient, form title, organisation; Inbox có `Response ID` ẩn và `Date Sent`, nhưng chưa tìm được cùng khóa phía profile để đối chiếu instance hoặc tổng count giữa hai feature. `Tasks` có thể đối chiếu cùng task trên workboard qua điều hướng riêng; link trực tiếp từ detail sang board chưa quan sát được.
- `Risk Stratification Trend` có liên quan cấu hình `Risk Strat Builder` ở mức dữ liệu hay chỉ cùng thuật ngữ? Chưa xác minh. `Investigations` hiện lỗi ICE trong session này; nguyên nhân và khả năng phục hồi chưa rõ.
- Kết quả UI hiện tại không chứng minh nguyên nhân các console errors.

## Tester notes

