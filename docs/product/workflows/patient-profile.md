# Workflow: Patient Profile

- Classification: `[Observed: dev, Super Admin GB, 2026-09-16]`
- Aliases: `Profile`, `Patient Profile`, clinical record
- Coverage: `Partial`
- Confidence: `High` cho route, controls và empty states đã quan sát; `Low` cho hành vi với populated data
- Bổ sung `[Observed: dev, Super Admin GB, 2026-09-30]`: route `Profile` xác minh lại; `Care Plan`, `Appointments`, `Tasks` khảo sát với một patient, không mutation. Ngày 2026-10-01 xác minh thứ tự 13 tab và dashboard `Risk factors` disclosure trên một patient khác; không mutation.

## Business context observed

- Visible purpose: xem hồ sơ lâm sàng theo patient qua các tab như `Timeline`, `Coding`, `Documents`, `Investigations`, `Payments`.
- Actor/role: `Super Admin GB`.
- Required context: patient tồn tại trong `Patient Search`; mở `Actions > Profile`.
- Starting data state: demo patient tìm bằng surname; các tab được chọn chủ yếu không có record.
- Entities and statuses: timeline event; coding category; document; investigation `Results`/`Requested`; payment. Không có status record vì selected patient ở empty state.

## Entry

1. Mở `/paco/patient-search`, điền surname vào `Search Patients`.
2. Trong AG Grid, mở `[col-id="actions"] button`, chọn exact menu item `Profile`.
3. Xác nhận route `/paco/patient-profile/<patient-guid>/dashboard` và tab `Dashboard`.

## Read-only flow

1. **Action:** mở `Timeline`.
   - **Transition:** route chuyển sang patient-profile `timeline`.
   - **Observed result:** hiển thị year navigation, `Filters`, và empty state `No timeline found`.
   - **Evidence:** `test-results/product-survey/batch29/02-timeline.png`.
2. **Action:** mở `Coding`.
   - **Transition:** route chuyển sang patient-profile `coding`.
   - **Observed result:** `All (0)`, `Conditions (0)`, `Observations (0)`, `Measurements (0)`, `Procedures (0)`, `Risk Stratification`, `Filters`, và `No coding found`.
   - **Evidence:** `test-results/product-survey/batch29/03-coding.png`.
3. **Action:** mở `Documents`.
   - **Transition:** route chuyển sang patient-profile `documents`.
   - **Observed result:** filters `All`/`Pending`/`Reviewed`, `All`/`Mine`; `Showing 0/0 documents`; `There are no patient attachments`. Mutation controls hiện diện nhưng không dùng: `Create Document`, `From Template`, `New Fit Note`, `Upload`.
   - **Evidence:** `test-results/product-survey/batch29/04-documents.png`.
4. **Action:** mở `Investigations`.
   - **Transition:** state mặc định `Results`.
   - **Observed result:** toggle `Results`/`Requested`, label `ICE`, `No records`; mutation control `+ New Request` hiện diện nhưng không dùng.
   - **Evidence:** `test-results/product-survey/batch29/05-investigations-results.png`.
5. **Action:** chọn `Requested`.
   - **Transition:** toggle đổi sang `Requested`; đây là distinct read-only state.
   - **Observed result:** `No records` cho selected patient.
   - **Evidence:** `test-results/product-survey/batch29/06-investigations-requested.png`.
6. **Action:** mở `Payments`.
   - **Transition:** route chuyển sang patient-profile `payments`.
   - **Observed result:** chỉ thấy heading `Payments`; không có record, empty-state copy, loading indicator hoặc permission message.
   - **Evidence:** `test-results/product-survey/batch29/07-payments.png`.

7. **Action:** mở `Care Plan` từ tablist (2026-09-30).
   - **Transition:** route `/paco/patient-profile/<patient-guid>/care-plan`.
   - **Observed result:** `Care plan summary` hiển thị các nhóm `Published`, `Not started`, `Drafts`, `Reviews overdue`, `Reviews due soon`, `Not agreed with patient`; có một card `Comprehensive Geriatric Assessment` ở trạng thái `Not started`, nút `Start` chưa dùng. `Patient's copy` disabled trong state này.
8. **Action:** mở `Appointments`.
   - **Transition:** route `/paco/patient-profile/<patient-guid>/appointments`.
   - **Observed result:** `Search appointments` và grid với `Appt Type`, `Appointment Name`, `Date`, `Start Time`, `End Time`, `Status`, `Actions`; không xác nhận appointment record cho patient này.
9. **Action:** mở `Tasks`, chọn `Closed`, sau đó `All`.
   - **Transition:** route `/paco/patient-profile/<patient-guid>/tasks`; quick filter `Closed` làm `Total Tasks` về 0, `All` khôi phục 8 trong state quan sát. Có `Date Selection`, search, `Filters`, nhóm `By Task Type`/`By Patient`/`By Team/Stage`/`By Priority`/`By Author`, và `Create New task` chưa dùng. Counts chỉ là observation, không phải expected cố định.
   - **Bổ sung `[Observed: dev, Super Admin GB, 2026-10-01]`:** click populated task mở detail dialog và thêm `?taskId=<task-id>`; dialog hiển thị `Board`, `Column`, `Status`, `Journey`. `Escape` đóng dialog, bỏ query. Qua `Case Load Management > Task Workboards` chọn đúng board theo detail, thấy cùng task trong cột tương ứng; mở card tại `/paco/workboards/<board-id>?taskId=<task-id>` và đối chiếu cùng `taskId`, `Board`, `Column`, `Status`. Không có link trực tiếp từ nhãn `Board` trong dialog được quan sát; hai entry có thể được đối chiếu thủ công bằng UI. Không lưu patient/task identifiers hoặc nội dung live.

10. **Action:** mở `Patient Comms`, chọn `booking links`, rồi `all comms` (2026-09-30).
    - **Observed:** route `patient-comms`; category lưu trong query (`category=booking+links`, `category=all+comms`). Cả hai state hiển thị `No messages to show`. Có `Date Selection`, search và các category `confirmations`, `reminders`, `guidance & advice`, `health forms`, `telephony`. `[Observed: dev, Super Admin GB, 2026-10-01]` Chọn `health forms` giữ route Patient Profile, đặt `category=health+forms`, hiển thị `No Health Forms to show` cho patient được chọn; không dẫn tới `Health Form Inbox`. Chưa có populated message để đối chiếu hai feature.
11. **Action:** mở `Consultations & Admin`, chọn `Draft`, rồi `All`.
    - **Observed:** route `consultations`; `Draft` đổi `aria-pressed` thành `true`, danh sách đổi từ `6 of 7` sang `3 of 4`; chọn lại `All` bỏ status draft khỏi query `cf`. Query có organisation context: không sao chép nguyên URL vào docs. `Consultations`/`Admin` là hai toggle riêng; `Add entry`, `Filters`, `Expand all`, `Full screen` chưa dùng. Counts không phải expected cố định.
12. **Action:** mở `Medication`, `More Filters`, rồi `Cancel`.
    - **Observed:** route `medications`; hai nhóm filter riêng: `All`/`Acute`/`Repeat` và `All`/`Draft`/`Active`/`Past`/`Cancelled`. Drawer `Filters` chứa selector `Organisation`, `Clear all`, `Cancel`, `Save` disabled khi chưa thay đổi. Đóng không thay đổi. `New Prescription` chưa dùng; không mở hoặc sửa medication record.
13. **Action:** mở `Shared Records`.
    - **Observed:** route `shared-records`; `Date Selection`, search, `GP Connect`, `Launch NCRS` xuất hiện. Hai launch controls chưa dùng; chưa xác minh yêu cầu smartcard, external destination hoặc hành vi trao đổi dữ liệu.
14. **Action:** reverify `Dashboard` và mở/đóng `Risk factors` trên một patient khác (2026-10-01).
    - **Observed:** 13 tab theo thứ tự `Dashboard`, `Timeline`, `Coding`, `Consultations & Admin`, `Care Plan`, `Medication`, `Patient Comms`, `Shared Records`, `Investigations`, `Appointments`, `Documents`, `Payments`, `Tasks`. Dashboard có `At a Glance`, `Conditions`, `Registers`, `Pending Documents`, `Risk Stratification`, `Appointments`, `Timeline`, `Active Tasks`, `Patient Communications`; có text `Error loading pharmacies` cho patient này. `Risk factors` đổi `aria-expanded=false` → `true` và hiển thị list 19 structural items, sau đó đóng lại. Không xem/lưu nội dung clinical hoặc patient identifier; lỗi và count không làm expected chung.

15. **Action:** mở `Dashboard > Risk Stratification > Open the full risk score trend` (2026-10-01).
    - **Observed:** dialog `Risk Stratification Trend` mở tại route dashboard hiện tại; `All Time` pressed, bốn khoảng thời gian `Last 1 Month`/`Last 3 Months`/`Last 6 Months`/`Last 12 Months`, chart `Risk score`. `Close` đóng dialog. Không thấy handoff tới `Configuration > Risk Strat Builder`; quan hệ giữa widget và cấu hình chưa xác minh. Không ghi risk score hoặc patient ID.
16. **Action:** mở `Investigations`, chọn `Requested` (2026-10-01).
    - **Observed:** cả `Results` và `Requested` hiển thị `Failed to load ICE. Please try again.` cho session/patient này; khác empty state `No records` từng quan sát. `+ New Request` chưa dùng. Đây là lỗi UI hiện tại, chưa biết nguyên nhân.

17. **Action:** click card `Active Tasks` trên patient `Dashboard` (2026-10-01).
    - **Observed:** chuyển tới tab `Tasks` của cùng patient, route `/paco/patient-profile/<patient-guid>/tasks`; grid có `Active`/`Closed`/`All`, không mở task detail hoặc Task Workboards. Count trên card/grid phụ thuộc dữ liệu hiện tại. `Create New task` chưa dùng.

18. **Action:** click heading card `Patient Communications` và metric `Health Forms` trên `Dashboard` (2026-10-01).
    - **Observed:** card hiển thị `Total Communications` (`Email`/`SMS`) và `Health Forms` (`Completed`/`Incomplete`), đều 0 với patient hiện tại. Hai click không đổi route/tab và không mở dialog. Chưa xác minh populated card có handoff tới `Patient Comms` hoặc `Health Form Inbox` không; count không phải expected cố định.

19. **Action:** với patient tester chỉ định có sẵn Health Forms, click card `Patient Communications`, sau đó vào tab `Patient Comms > health forms` (2026-10-01).
    - **Observed:** card hiển thị `Health Forms` 70 (`Completed` 4, `Incomplete` 66) nhưng click heading/metric không đổi route, tab hoặc mở dialog. Chuyển tab thủ công và chọn category `health forms` mới thấy danh sách form đã gửi; chọn một item mở preview trong `iframe` tại route `patient-comms?category=health+forms`. Không nhập dữ liệu, không dùng link ngoài hay control trong form. Counts chỉ thuộc patient/session này; chưa đối chiếu trực tiếp với `Health Form Inbox`.

20. **Action:** từ profile patient tester chọn, điều hướng `Health Forms > Inbox`, search grid theo patient và so candidate với `Patient Comms > health forms` (2026-10-01).
    - **Observed:** một row Inbox trùng patient, form title và organisation với item đã thấy trong profile. Chưa đủ để xác nhận cùng instance: cột đang xem không có sent timestamp/instance ID, title có thể lặp; form preview đã chọn trước đó không có trong các row đang render. Chưa khảo sát toàn pagination/filter, không dùng `View Form` vì refresh trước đó không ổn định. Xóa search sau đối chiếu; không lưu identifiers.
21. **Action:** kiểm tra `Columns` và `Filters` của grid `All Health Forms` trong Inbox (2026-10-01).
    - **Observed:** `Response ID` là cột ẩn có filter danh sách UUID; `Date Sent` là cột checked với filter `Equals` và ngày `yyyy-mm-dd`. Không thay đổi cột hoặc filter; panel đã đóng. Chưa thấy cùng ID hoặc sent timestamp đủ chính xác phía `Patient Comms` để nối một-một; candidate vẫn chưa xác minh cùng instance.

## Decision points

- **Visible condition:** selected patient có hay không có record trong tab.
  - **Branch/state A:** `[Observed]` selected demo patient không có timeline, coding, document hoặc investigation record.
  - **Branch/state B:** `[Open Question]` populated records render thế nào và cung cấp read-only detail nào.
- **Visible condition:** `Investigations` state.
  - **Branch/state A:** `[Observed]` `Results` hiển thị `No records`.
  - **Branch/state B:** `[Observed]` `Requested` hiển thị `No records`.
- **Visible condition:** `Payments` chỉ có heading.
  - **Branch/state A:** `[Observed]` không có thêm content trong hai lần khảo sát với hai role.
  - **Branch/state B:** `[Open Question]` đây là empty state, permission gate hay widget không load.

## End and exceptional states

- End state observed: selected patient giữ nguyên; chuyển tab không mutate dữ liệu.
- Empty/loading/error states: explicit empty states ở `Timeline`, `Coding`, `Documents`, `Investigations`; `Payments` không có explicit state.
- Cross-feature handoff: `Patient Search > Actions > Profile` mở full Patient Profile; `Dashboard > Active Tasks` mở tab `Tasks` nội bộ, không mở workboard. Card `Patient Communications` không chuyển route/tab khi click heading hoặc metric `Health Forms` ở cả patient rỗng và patient có form; tab `Patient Comms > health forms` phải mở riêng, có list/iframe preview cho patient có dữ liệu. Inbox có candidate trùng patient + form title + organisation qua điều hướng riêng; `Response ID`/`Date Sent` có trong grid nhưng thiếu cùng khóa từ profile, nên cùng instance và tổng count chưa xác minh. `Tasks` detail và workboard card cùng `taskId` được đối chiếu qua điều hướng riêng, không quan sát link trực tiếp. `Risk Stratification` mở dialog trend nội bộ, không phải navigation tới builder trong lần quan sát; `ICE` báo lỗi load, chưa kiểm chứng external handoff.

## Safety boundary

- Last safe read-only state: tab landing page, toggle `Investigations > Requested`, `Tasks` quick filter hoặc detail dialog của task đã có. Không dùng `edit`, `Add` comment hoặc drag card.
- Approval stop: `Create Document`, `From Template`, `New Fit Note`, `Upload`, `+ New Request`, `Care Plan > Start`, `Create New task`, hoặc control create/edit/save khác.
- Actions not performed: không mở mutation control; không upload, submit, create, edit hoặc save.
- Mutation: `None`

## Execution guidance

- Setup/data: environment `dev`, role `Super Admin GB`, manual auth hợp lệ; dùng patient demo không chứa PII trong docs.
- Safe manual steps: search patient, mở `Actions > Profile`, chuyển các tab, dùng toggle `Results`/`Requested`; với populated `Tasks`, mở detail, ghi route đã redact và đối chiếu cùng task trên board tìm qua `Task Workboards`.
- Stop and request approval before: mọi control create/edit/save/upload/request.
- Evidence to capture: route đã redact patient GUID/task ID/board ID, active tab/toggle, explicit empty/error text, visible mutation boundary; đối chiếu cùng task giữa hai dialog mà không xuất dữ liệu live.

## Automation guidance

- Stable roles/labels/landmarks: `input[placeholder*="Search Patients"]`, pinned row `[col-id="actions"] button` matched to main row by `row-index`, exact `Profile`, role `tab` với exact names, exact `Requested`. Task grid có nhiều rowgroup cùng `row-index`: scope main row/cell thay vì selector `row-index` toàn panel. Không dùng numeric button index; validate row alignment trước click.
- Observable waits: chờ AG Grid row xuất hiện sau search; sau tab/toggle click chờ route hoặc active-state/content đổi, không chỉ timeout. `Active Tasks` card click phải chờ tab `Tasks` selected và route `/tasks`, không giả định card có role `button`. Với `Investigations`, phân biệt `No records` và `Failed to load ICE`; trend dialog scope theo role `dialog`, kiểm tra `All Time` pressed, không assert patient score.
- Data dependencies: patient phải xuất hiện trong search và được role hiện tại xem `Profile`; empty-state assertions chỉ hợp lệ với fixture patient đã biết.
- Assertions lacking trusted expected basis: populated tab content, ý nghĩa `ICE`, và expected behavior của bare `Payments` page.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-16`.
- Raw evidence: `test-results/product-survey/batch29/`; local only, review/redact trước khi share.
- Open questions: populated appointment detail và `Care Plan > Start` behavior; `Payments` state; ý nghĩa và external boundary của `ICE`; sâu hơn của `Filters` và `Risk Stratification`.
- `[Observed: dev, Super Admin GB, 2026-09-30]` Menu `Actions > Profile` dẫn tới `/paco/patient-profile/<patient-guid>/dashboard`; tablist có **13** tab, gồm `Care Plan` và `Consultations & Admin`. `Care Plan`, `Appointments`, `Tasks` khảo sát bằng accessibility snapshot; patient GUID, row content và PII không ghi vào artifact.
- `[Observed: dev, Super Admin GB, 2026-10-01]` Cùng một task xuất hiện trong patient `Tasks` và board chọn qua `Task Workboards`; hai dialog có cùng `taskId`, board, column và status. Browser-only snapshots chứa dữ liệu live, chưa review/redact để chia sẻ. Mutation: `None`.
- `[Observed: dev, Super Admin GB, 2026-10-01]` `Patient Comms > health forms` hiển thị `No Health Forms to show` ngay trong profile; chưa xác minh record tương ứng tại `Health Form Inbox`. Không lưu patient identifier; browser snapshot cục bộ, chưa review/redact để chia sẻ. Mutation: `None`.
- `[Observed: dev, Super Admin GB, 2026-10-01]` Inbox `Columns` có `Response ID` ẩn và `Date Sent` checked; `Filters` có danh sách UUID cho `Response ID` và phép `Equals` theo ngày cho `Date Sent`. Panel đóng không thay đổi. Không lưu giá trị ID/patient hoặc bật cột; mutation `None`.
- Exact resume state: candidate profile–Inbox chưa đối chiếu cùng instance vì thiếu cùng ID hoặc timestamp phía profile. Nếu cần chứng minh một-một, tìm khóa chung bằng UI read-only trên fixture an toàn; không dùng `View Form` đang bất ổn hoặc suy từ tên form. Nếu không có khóa, pivot sang gap khác.

## Tester notes
