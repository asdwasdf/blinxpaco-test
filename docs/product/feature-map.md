# Feature Map

Index các feature của Paco và coverage status.

Structured survey nằm tại `docs/product/survey/`. Search `graph.json` trước khi locate ticket; Markdown trong `survey/views/` là nguồn chuẩn. Regenerate bằng `npm run graph:generate`.

## Format

Mỗi feature entry:
- Feature name và category
- Coverage level: Unknown/Minimal/Partial/Substantial/Reviewed
- Ordered `Entry` không chứa ticket-specific test data
- `Role observed`, `Environment`, `Classification: Observed`
- `Source`, `Last verified`, aliases
- Link tới requirements detail và tickets đã test

Chỉ `paco-report` promote route đã verified sau report. Dùng allowlist từ `toSafeFeatureMapEntry()`; không lưu patient/NHS identifier, credential/auth detail, clinical/message content, ticket test data, raw generated class hoặc fragile locator. Route quan sát trên dev không tự thành product intent `Confirmed`.

## Features

Harvest ngày `2026-10-02` từ 15 `feature-location.md`. Mọi entry đều `Classification: Observed` (route quan sát trên `dev`, không phải product intent `Confirmed`). `Route` chỉ ghi path; host feature-branch/external được nêu ở `Entry` hoặc `Note`. Feature-branch dùng pattern `<ticket-branch>` thay cho tên branch cụ thể.

### Module: Appointment Book (PACO Connect)

#### Appointment Book (root)
- Coverage: Partial
- Entry: `/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`
- Route: `/paco-connect/appointment-book`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8241` (`feature-location.md`); cũng quan sát ở `PAC2-8384`, `PAC2-7137`, `PAC2-8552`
- Last verified: `2026-10-02`
- Aliases: `Appt. Book`, `Appointment Book`, `PACO Connect`, `Day view`
- Tickets: `PAC2-8241`, `PAC2-8384`, `PAC2-7137`, `PAC2-8552`
- Note: document response báo HTTP `404` nhưng UI vẫn render; chờ `Loading` biến mất thay vì dựa vào HTTP status. Nội dung phụ thuộc `Appt. Book` selector và ngày đang chọn. Landmarks: `Day`/`Week`/`Month`/`Year`, `Sessions`, `Booked`, `Available`, `Quick Book`, `Filters`, `Group Send`, `Export`.
- Logic chính:
  - Summary `Sessions`/`Booked`/`Available` phải bằng tổng detail block cùng ngày/book/filter `[Confirmed]` (PAC2-7137)
  - Appointment có 2 session holder chỉ tính `1` vào `Booked` `[Confirmed]` (PAC2-7137/TC-004)
  - Slot `Bookable` off vẫn hiện nhãn `Non-bookable`, bị loại khỏi `Available` `[Observed]` (PAC2-7137)
- Defect đã biết:
  - `PAC2-7137` Fail: `Day` `Booked` đếm theo holder (3), `Week` đếm theo appointment (2)
- Chi tiết: `workflows/appointment-book.md#count-summary-dayweek`

#### Appointment Book — feature-branch route
- Coverage: Minimal
- Entry: authenticated session → navigate trực tiếp tới route feature-branch (hoặc `/paco-connect/feature-branch/<ticket-branch>/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`)
- Route: `/paco-connect/feature-branch/<ticket-branch>/appointment-book` (có thể kèm `?viewAs=agenda`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-7137`, `PAC2-8552` (`feature-location.md`)
- Last verified: `2026-09-30`
- Aliases: `feature-branch appointment book`
- Tickets: `PAC2-7137`, `PAC2-8552`
- Note: phải giữ prefix `feature-branch/<ticket-branch>`; route mặc định chỉ là control path, không chứng minh build của ticket.
- Logic chính:
  - Phải giữ prefix `feature-branch/<ticket-branch>`; route mặc định chỉ là control path `[Observed]` (PAC2-7137, PAC2-8552)
  - Navigation có thể trả 404/redirect qua role selection nhưng UI vẫn render; không assert response đầu `[Observed]` (PAC2-7137)
- Defect đã biết:
  - `PAC2-7137` Blocked: control trên route mặc định bị HTTP 404 rồi redirect login
- Chi tiết: `workflows/appointment-book.md#count-summary-dayweek`

#### Appointment Book — Filters / Location
- Coverage: Minimal
- Entry: `Appointment Book` root → toolbar `Filters` → sidebar `Filters` → `Location`
- Route: `/paco-connect/appointment-book`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8384` (`feature-location.md`)
- Last verified: `2026-09-25`
- Aliases: `Filters`, `Location filter`
- Tickets: `PAC2-8384`
- Note: danh sách option phụ thuộc appointment book và date range đang chọn; chờ `Loading your appointment data` biến mất.
- Logic chính:
  - Multi-book: `Location`/`Slot Type`/`Session`/`Clinician`/`Patient` lấy option từ tất cả book chọn `[Confirmed]` (PAC2-8384)
  - `Appointment Type` chỉ liệt kê type đang dùng trong book, lọc cả session lẫn slot `[Confirmed]` (PAC2-8384)
  - Chip `Location` ở toolbar và loading-vs-empty chỉ là đề xuất `[Inferred, Candidate]` (PAC2-8384)
- Defect đã biết:
  - `PAC2-8384` Fail (DEF-001): chọn hai book cùng location thì `Location` trả `No results found`
- Chi tiết: `workflows/appointment-book.md#filter-trong-appointment-book`

#### Appointment Book — Session slot editor (`Edit Session`)
- Coverage: Minimal
- Entry: `Appointment Book` root (Day view) → right-click slot trong cột session → `Edit Session`
- Route: `/paco-connect/appointment-book` (modal, URL thêm `?preview=true`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8241` (`feature-location.md`)
- Last verified: `2026-10-02`
- Aliases: `Edit Session modal`, `slot menu`, `Session ends at`
- Tickets: `PAC2-8241`
- Note: context menu gồm `Edit Slot`, `Add a note`, `View Audit Log`, `Edit Session`, `Block Session`, `Remove Session`, `Message Session Patients`; slot list tải ~5-8s. `Time Range` trong drawer `Edit Session` từ session header đã được sửa thành `Confirmed` sau `MANUAL_EXECUTE` (trên session test tự tạo).
- Logic chính:
  - Session có booking: khóa `Time Range`, `Frequency`, `Slot Duration`, `Session Type`, `Slot Types` `[Confirmed]` (PAC2-8241)
  - Slot ngoài start/end phải bị từ chối với message boundary, server cũng reject `[Confirmed]` (PAC2-8241)
  - Đổi slot type/`Empty Slot`/`Bookable` rồi `Save` persist qua reopen và reload `[Observed]` (PAC2-8241/TC-002, 003)
- Defect đã biết:
  - `PAC2-8241` Fail (TC-001): slot ngoài range trả 500, UI im lặng, stale pending slot
  - `PAC2-8241` Fail (TC-007): extend `Hours (To)` toast success nhưng không sinh slot, slot đã chỉnh revert
- Chi tiết: `workflows/appointment-book.md#session-editor-và-khóa-field`

#### Appointment Settings — Sessions configuration
- Coverage: Partial
- Entry: `/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Settings`
- Route: `/paco-connect/configuration` (feature-branch: `/paco-connect/feature-branch/<ticket-branch>/configuration`; UI có thể normalize sang `/configuration/#clinics`)
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8241`, `PAC2-7786`, `PAC2-8552` (`feature-location.md`)
- Last verified: `2026-10-02`
- Aliases: `Appointment Settings`, `Sessions`, `Session Configuration`, `diary`, `Configuration > Appointment Books > Sessions`
- Tickets: `PAC2-8241`, `PAC2-7786`, `PAC2-8552`
- Note: landmarks `Search Session...`, toggle `Active`/`Removed`, grid cột `Session Name`/`Actions`; row `Actions` → `Edit`, `View Audit`, `Archive`, `Clone` (và `Delete`, `Cancel Session` ở feature-branch `PAC2-8552`); `Add Session`/`Edit` mở drawer `Edit Session` (Time Range nằm dưới section `Frequency`). `Loading sessions` có thể 30-40s; document response `404` nhưng SPA render. Dừng trước `Save`/`Archive`/`Delete`/`Cancel Session`.
- Logic chính:
  - `Active` → `Cancel Session` → `Removed` (archive) → `Restore`; `Delete Session` không có trong menu `[Observed]` (PAC2-7786)
  - Xóa session không booking cần confirmation trước mutation; session có booking phải bị từ chối (`SESSION_HAS_BOOKINGS`) `[Confirmed]` (PAC2-7786)
  - Tạo session cần book, location, slot type, care professional, ngày, tần suất, giờ, slot duration `[Observed]` (PAC2-7786, PAC2-8241)
- Defect đã biết:
  - `PAC2-7786` Fail: không có `Delete Session`; `Cancel Session` chỉ archive (TC-001, 003, 004)
  - `PAC2-7786` Blocked/Inconclusive: TC-002 thiếu data an toàn, TC-005 Delete vs Block còn Disputed
- Chi tiết: `workflows/appointment-book.md#session-delete--archive`; `workflows/appointment-book.md#session-editor-và-khóa-field`

#### Configuration — Appointments listing
- Coverage: Minimal
- Entry: `Configuration` → `Appointment Books` → `Appointments`
- Route: `/configuration/#appointments`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8552` (`feature-location.md`)
- Last verified: `2026-09-25`
- Aliases: `Appointments`, `Show Cancelled Bookings`
- Tickets: `PAC2-8552`
- Note: `Fetch Latest Appointments` và `Fetch All Slot Details` chưa rõ side effect, không dùng.
- Logic chính:
  - Có `Show Cancelled Bookings`, `Fetch Latest Appointments`, `Fetch All Slot Details` (side effect nút fetch chưa rõ) `[Observed]` (PAC2-8552)
  - Cancel/book phải không trả success im lặng khi zero rows hoặc trạng thái nửa vời `[Confirmed]` (PAC2-8552)
- Defect đã biết:
  - `PAC2-8552` Blocked: 9/9 case, thiếu approval mutation/fixture/DB owner
- Chi tiết: `workflows/appointment-book.md#hiệu-năng-bookingcancel-partitioned-table`

### Module: Configuration

#### Code Rule Config
- Coverage: Minimal
- Entry: `/paco/dashboard` → `Configuration` → `Organisation` → `Code Rule`
- Route: `/configuration/#code-rules-config`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-4399` (`feature-location.md`)
- Last verified: `2026-09-22`
- Aliases: `Code Rule`, `Code Rule Config`, `SNOMED code rules`
- Tickets: `PAC2-4399`
- Note: route đã verified nhưng chưa chứng minh liên quan tới mapping của ticket; chọn value tạo draft rule, `Submit` là mutation boundary.
- Logic chính:
  - Mục tiêu ticket: cập nhật SNOMED code cho blood-pressure khi file vào EMIS (code cũ deprecated) `[Confirmed]` (PAC2-4399)
  - SYS/DIA không được đổi/mất/đảo/duplicate sau đổi code `[Inferred]` (PAC2-4399)
  - Chưa chứng minh `Code Rule Config` là nơi quyết định mapping của ticket `[Open Question]` (PAC2-4399)
- Defect đã biết:
  - `PAC2-4399` Blocked: TC-001..003 thiếu quyền EMIS/evidence DB; overall Inconclusive
- Chi tiết: `workflows/configuration.md#code-rule-config-và-quy-tắc-clinical-code-blood-pressure`

### Module: Comms Hub (external host `nhs-comms-hub-dev.blinxhealthcare.com`)

#### Campaign Manager
- Coverage: Partial
- Entry: `/paco/dashboard` → expand sidebar → `Comms Hub` (icon label `Quick Send`) → submenu `Campaign Manager` → login riêng của Comms Hub (tester đăng nhập thủ công) → `Campaign Manager`
- Route: `/commshub/campaign-manager`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6982` (`feature-location.md`); cũng quan sát ở `PAC2-6540`, `PAC2-7201`, `PAC2-1805`
- Last verified: `2026-10-01`
- Aliases: `Campaign Manager`, `Comms Hub`, `PaComms` (top-bar, khác module sidebar)
- Tickets: `PAC2-6982`, `PAC2-6540`, `PAC2-7201`, `PAC2-1805`
- Note: Paco session không share với Comms Hub; cần login riêng. Landmarks: `Create Campaign`, `Campaign Outbox`, `Search campaigns`, `Clear Filters`, `Show All Columns`, `Viewing data for` (org context), nhóm `Non-Shared Campaigns`/`Shared Campaigns`. Dropdown `Viewing data for` dễ đóng ngoài ý muốn. Role `GP Paco Assist`/`Super User`/`Blinx Deployment` thấy top-bar `PaComms` bị disabled (`PAC2-6540`).
- Logic chính:
  - Site Comms Hub riêng, login riêng, không share session PACO `[Observed]` (PAC2-1805, PAC2-6540, PAC2-6982)
  - Nhóm `Non-Shared Campaigns`/`Shared Campaigns`; `Create Campaign` luôn tạo dưới home org `[Observed]` (PAC2-6982, PAC2-7201)
  - Shared campaign: org được share chỉ `view`, creator giữ `edit` (thiết kế) `[Observed]` (PAC2-7201)
- Defect đã biết:
  - `PAC2-7201` Fail dự kiến: dev cho org được share `Edit`+`Delete`; pattern ngược cho org tạo
  - `PAC2-1805` Fail kỹ thuật: `Resend` HTTP 400, không toast (ngoài scope ticket)
- Chi tiết: `workflows/comms-hub.md#campaign-manager-và-campaign-outbox`; `workflows/comms-hub.md#shared-campaign-và-quyền-viewedit`

#### Campaign Outbox
- Coverage: Minimal
- Entry: `Comms Hub` → `Campaign Manager` → `Campaign Outbox`
- Route: `/commshub/campaign-outbox`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6540` (`feature-location.md`)
- Last verified: `2026-09-15`
- Aliases: `Outbox`, `Campaign Outbox`
- Tickets: `PAC2-6540`
- Note: root hiển thị `Campaigns`, `Campaign Types`, prompt chọn campaign. Chọn campaign có thể mở dữ liệu bệnh nhân/message; dòng có `Resend` là mutation (đã quan sát lỗi HTTP 400 ổn định ở `PAC2-1805`, defect riêng).
- Logic chính:
  - Status `Not Sent - Patient Deleted or Inactive` cho bệnh nhân deleted/inactive `[Confirmed]` (PAC2-6540)
  - Tập người nhận campaign phải khớp patient set trong report `[Confirmed]` (PAC2-6540)
  - Org selector chỉ liệt kê org trong entitlement `[Observed]` (PAC2-6540)
- Defect đã biết:
  - `PAC2-6540` Not Run: TC-003 đối chiếu Outbox do org gốc không trong selector
  - `PAC2-1805` Fail kỹ thuật: `Resend` HTTP 400
- Chi tiết: `workflows/comms-hub.md#campaign-manager-và-campaign-outbox`

### Module: Health Forms

#### Health Forms Designer
- Coverage: Minimal
- Entry: `/paco/dashboard` → `Expand sidebar` → `Health Forms` → `Designer`
- Route: `/health-forms/builder/`
- Role observed: `Admin` (QA xác nhận trong hội thoại, chưa độc lập xác minh trên UI)
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6982` (`feature-location.md`)
- Last verified: `2026-10-01`
- Aliases: `Designer`, `Health Forms`, `form builder`
- Tickets: `PAC2-6982`
- Note: grid có cột `Health Form Name`, `Created By Organisation`, `Shared To Organisation(s)`, `Archived`, `Editable`, `Actions`. Chỉ xem; không mở row/`Actions`.
- Logic chính:
  - Component `Blood Pressure`: `SYS`/`DIA`, ghi nhận combined hoặc `Separate Diastolic and Systolic entries` `[Observed]` (PAC2-4399)
  - Form có `Created by` và `Shared To`; Shared Campaign cho child org truy cập form `[Confirmed]` (PAC2-6982)
  - Editor không hiển thị ConceptID/DescriptionID nên không đủ làm bằng chứng mapping `[Observed]` (PAC2-4399)
- Defect đã biết:
  - `PAC2-6982` Blocked: TC-001/002 chưa xác minh form child tạo không `Shared To`
- Chi tiết: `workflows/health-forms.md#health-form-designer--component-blood-pressure`

### Module: Patient

#### Patient Search
- Coverage: Minimal
- Entry: `/paco/dashboard` → sidebar `Patient Search` (nếu click sidebar không điều hướng thì mở trực tiếp route)
- Route: `/paco/patient-search`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6763` (`feature-location.md`); cũng quan sát ở `PAC2-6540` (role `GP Paco Assist`)
- Last verified: `2026-09-28`
- Aliases: `Patient Search`, `Search Patients`
- Tickets: `PAC2-6763`, `PAC2-6540`
- Note: có `Filters`, `Actions` column, `Create new patient`; không có `Advanced Search` hay deleted-patient filter ở state quan sát (`PAC2-6540`). Chỉ dùng row do tester duyệt là synthetic `Test Patient`; không ghi identifier.
- Logic chính:
  - Global header search khác `Patients → Patient Search`; kết quả có `Quick Form`, `Care Navigator`, `Quick Send` `[Observed]` (PAC2-4399, PAC2-4700)
  - Connect branch: chọn patient chuyển sang profile baseline (mất branch context) `[Observed]` (PAC2-4700)
- Defect đã biết:
  - `PAC2-4399` Inconclusive: `Quick Form` lỗi thiếu patient number trên demo patient
- Chi tiết: `workflows/patient-profile.md#patient-search-và-patient-actions`

#### Patient Profile — Documents
- Coverage: Minimal
- Entry: `Patient Search` → row (safe `Test Patient`) `Actions` → `Profile` → tab `Documents`
- Route: `/paco/patient-profile/<redacted>/documents`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6763` (`feature-location.md`)
- Last verified: `2026-09-28`
- Aliases: `Documents`, `patient attachments`, `Upload`
- Tickets: `PAC2-6763`
- Note: dừng trước `Upload` (chọn file/upload là mutation). Feature-branch host riêng cho ticket.
- Logic chính:
  - Filter `All`/`Pending`/`Reviewed`, scope `All`/`Mine`, `Card view`/`List view`, counter `Showing 50/N` `[Observed]` (PAC2-6763)
  - Fix 403 liên quan permission `View patient documents` `[Confirmed]` (PAC2-7466)
  - Upload ở `Documents` và inbox `Upload & analyse` có thể là hai flow khác nhau `[Open Question]` (PAC2-6763)
- Defect đã biết:
  - `PAC2-7466` Blocked: performance/memory leak chưa ANALYZE
- Chi tiết: `workflows/patient-profile.md#documents-tab`

#### Document Inbox — Upload dialog
- Coverage: Minimal
- Entry: `/paco/inbox` → `Document Inbox` → sidebar `Upload a document` → dialog `Upload document to inbox`
- Route: `/paco/inbox`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6763` (`feature-location.md`)
- Last verified: `2026-09-28`
- Aliases: `Document Inbox`, `Upload & analyse`
- Tickets: `PAC2-6763`
- Note: dừng trước `Choose a document` / `Upload & analyse`.
- Logic chính:
  - Lifecycle `Analysing` → `Needs review` → `Ready to file` → `Filed & rejected` `[Observed]` (PAC2-6763)
  - `Upload & analyse` disabled đến khi chọn file; `Source type`/`Source name` tùy chọn `[Observed]` (PAC2-6763)
  - Inbox liên kết `S3` và `MESH` mailbox `[Confirmed]` (PAC2-6763)
- Defect đã biết:
  - `PAC2-6763` Not Run: TC-001 upload (file chooser mở lặp)
- Chi tiết: `workflows/paco-assist.md#document-inbox`

#### Quick Send (patient actions menu)
- Coverage: Partial
- Entry: dashboard → global patient search (không click row) → result `Patient actions menu` → `Quick Send`
- Route: dialog `Quick Send` trên dashboard (`/paco/dashboard`); Connect feature-branch: `/paco-connect/feature-branch/<ticket-branch>/dashboard/`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8522`, `PAC2-4700` (`feature-location.md`)
- Last verified: `2026-09-28`
- Aliases: `QS`, `Quick Send`, `Rocketbar` (chưa locate), `patient actions`
- Tickets: `PAC2-8522`, `PAC2-4700`
- Note: dialog có tab `Campaign`, `Health Forms`, `Files`, `Booking Link`; composer hiển thị campaign header và `Campaign tags:`. Dừng trước `Save`/send/schedule/`Edit`/thêm campaign vào draft. Click patient row mở patient profile, không phải entry này. Sidebar icon `Quick Send` thực chất là launcher `Comms Hub`. Placeholder search khác nhau theo host: baseline/OS `Search patients by name or NHS number`, Connect `Search...`.
- Logic chính:
  - Composer mở từ `Patient actions` menu; sidebar icon `Quick Send` chỉ là launcher `Comms Hub` `[Observed]` (PAC2-8522, PAC2-4700)
  - `Send as` bị disable khi patient thiếu contact tương ứng `[Observed]` (PAC2-4700, PAC2-4399)
  - Popup `Scheduler Link Required` không ổn định/bị che sau hộp `Quick Send` `[Confirmed]` (PAC2-5776)
- Defect đã biết:
  - `PAC2-5776` Inconclusive: popup intermittent, không tái hiện được
  - `PAC2-4700` Inconclusive: `Escape` đóng cả dialog (OS), default channel, sort, attachments; Blocked: TC-006, TC-013
- Chi tiết: `workflows/comms-hub.md#quick-send-dialog`; `workflows/comms-hub.md#popup-scheduler-link-required`

### Module: Analytics & Reports

#### Analytics and Reports (root)
- Coverage: Minimal
- Entry: `/paco/dashboard` → sidebar `Analytics & Reports` → submenu `Reports`
- Route: `/paco/analytics-reports`
- Role observed: `GP Paco Assist`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-6540` (`feature-location.md`)
- Last verified: `2026-09-13`
- Aliases: `Analytics Reports`, `Reports`, `Analytics & Reports`
- Tickets: `PAC2-6540`
- Note: chỉ root; role này thấy cảnh báo không được xem `Summary Care Record (SCR) report`. Chưa xác minh `Advanced Search`/deleted-patient filter.
- Logic chính:
  - `Advanced Search` không ở root, phải qua `Patient Details` `[Observed]` (PAC2-6540)
  - `Advanced Search` nhất quán giữa `Deleted Patients Included`/`Excluded` `[Confirmed]` (PAC2-6540)
- Defect đã biết:
  - `PAC2-6540` Inconclusive: TC-002 rerun trên dataset mutable (TC-001 Pass)
- Chi tiết: `workflows/analytics-reports.md#deleted-patients-trong-advanced-search`

#### Patient & Medication Analyser
- Coverage: Minimal
- Entry: authenticated demo host → direct route `/patient-analyser/` (menu `Analytics & Reports` → `Patient Analyser` dẫn tới route cũ trả 404 trên host này)
- Route: `/patient-analyser/`
- Role observed: `Super Admin GB`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-3798` (`feature-location.md`)
- Last verified: `2026-09-21`
- Aliases: `Patient Analyser`, `Medication Analyser`, `supergrid`, `Advanced Search`
- Tickets: `PAC2-3798`
- Note: tab `Patient Details`, `Patient Analyser`, `Medication Analyser`; `Advanced Search 0`, `Columns`, `Filters`; `New`/`Save` là mutation boundary. Chờ `Patients:` count và footer rows-loaded; không assert giá trị. Xem conflict bên dưới.
- Logic chính:
  - Tạo/clear `advanced search` không refresh; `Patient count` tải độc lập với grid `[Confirmed]` (PAC2-3798)
  - `Pivot mode` + helper; URL `/patient-analyser/#<report-id>` tải lại đúng report `[Confirmed]` (PAC2-3798)
  - Search cũ deprecated được dựng lại thành rule lồng nhau khi load `[Confirmed]` (PAC2-3798)
- Defect đã biết:
  - `PAC2-3798` Inconclusive: sidebar trỏ `/patient-analyser-new/` 404; AG Grid license `Invalid License`
- Chi tiết: `workflows/analytics-reports.md#patient--medication-analyser-supergrid`

### Module: Patient-facing Scheduler (external host `*.blinxscheduler-np.com`)

#### Patient Self Booking
- Coverage: Minimal
- Entry: truy cập trực tiếp route (không cần login PACO) → `Search Services...` → chọn service → màn `Patient Details`
- Route: `/patient-self-booking/` (feature-branch: `/feature-branch/<ticket-branch>/patient-self-booking/`)
- Role observed: không đăng nhập (patient-facing); cross-check bằng `Super Admin GB` ở Paco
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-8552`, `PAC2-1805` (`feature-location.md`)
- Last verified: `2026-09-25`
- Aliases: `Digital Front Door`, `Patient Appointment Booker`, `scheduler link`
- Tickets: `PAC2-8552`, `PAC2-1805`
- Note: dừng trước nhập thông tin xác minh bệnh nhân, `Send Secure Link`, `I understand`, chọn slot, `Book`. Route có token per-patient không có token trả `Link Error`.
- Logic chính:
  - Link tokenized, không cần login PACO; thiếu token → `Link Error` `[Observed]` (PAC2-1805)
  - Một link chỉ giữ một booking; refresh/back không mở lại `Book` `[Confirmed]` (PAC2-1805)
  - Service không slot hiện `No availability` + warning modal `[Observed]` (PAC2-8552)
- Defect đã biết:
  - `PAC2-1805` Blocked: không có token link thật; `PAC2-8552` Blocked: thiếu link/patient synthetic
- Chi tiết: `workflows/patient-facing-scheduler.md#chống-double-book-qua-cùng-scheduler-link-pac2-1805`; `workflows/patient-facing-scheduler.md#patient-self-booking-ui`

### Module: Feature có logic từ ticket nhưng chưa có route verified

Harvest 2026-10-02 từ 17 ticket. Mọi entry `Classification: Observed/Confirmed/Inferred` theo từng bullet `Logic chính`; `Route: chưa verified`, không dùng làm automation gate. `Last verified: -`.

#### Health Form Inbox
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-4399, PAC2-5776 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-4399`, `PAC2-5776`
- Note: `/health-forms/responses/` (workflow `health-forms.md`) — chưa được paco-report promote.
- Logic chính:
  - `View Form` read-only; response đang được người khác review bị lock, có `Click Here to Take Over` `[Observed]` (PAC2-4399)
  - Summary phân biệt `Reviewed (synced)`/`Reviewed (not synced)` `[Observed]` (PAC2-4399)
  - `Quick Send` là follow-up action từ Inbox `[Confirmed]` (PAC2-5776)
- Defect đã biết:
  - `PAC2-4399` Inconclusive: modal kẹt loading (3/6 response); trùng accessible label; Blocked: filing EMIS HTTP 403
- Chi tiết: `workflows/health-forms.md#health-form-inbox`

#### Session delete / archive (`Cancel Session`, `Block Session`, `Restore`)
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-7786 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-7786`
- Note: Chung route với `Appointment Settings — Sessions configuration`; nêu riêng vì logic phong phú.
- Logic chính:
  - `Block Session`: mọi bookable slot thành non-bookable, không hủy appointment `[Observed]` (PAC2-7786)
  - `Delete Session` phải còn khả dụng; coexist hay thay bằng `Block Session` chưa quyết `[Confirmed, Disputed]` (PAC2-7786)
  - Archive template bị chặn bởi `Session Can't Be Archived`; owned session xóa qua permanent delete `[Observed]` (PAC2-8384)
- Defect đã biết:
  - `PAC2-7786` Fail: TC-001, 003, 004; Blocked TC-002; Inconclusive TC-005
- Chi tiết: `workflows/appointment-book.md#session-delete--archive`

#### Booking / Cancel appointment (backend, partitioned tables)
- Coverage: Unknown
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-8552 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-8552`
- Note: Chưa có route; `Quick Book` là route hint chưa mở.
- Logic chính:
  - Thêm `bx_organisation_uuid` vào query/write của `appointment`/`appointment_slot` khi org xác định an toàn `[Confirmed]` (PAC2-8552)
  - Cancel multi-slot phải release mọi slot; không success im lặng khi zero rows `[Confirmed]` (PAC2-8552)
  - Semantics `bx_organisation_uuid` khác nhau giữa `nhs-scheduler-be` và `paco-connect-be` `[Confirmed]` (PAC2-8552)
- Defect đã biết:
  - `PAC2-8552` Blocked: 9/9 case
- Chi tiết: `workflows/appointment-book.md#hiệu-năng-bookingcancel-partitioned-table`

#### Shared Campaign — quyền view/edit
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-7201, PAC2-6982 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-7201`, `PAC2-6982`
- Note: Nằm trong `Campaign Manager` (tab `Shared Campaigns`).
- Logic chính:
  - Share cũng chia sẻ assets (Templates, Health Forms); org được share chỉ `view` `[Observed]` (PAC2-7201)
  - Shared Campaign cho phép truy cập form từ child org `[Confirmed]` (PAC2-6982)
  - Quyền edit có thể gắn với hướng share cụ thể; root cause chưa biết `[Inferred]` (PAC2-7201)
- Defect đã biết:
  - `PAC2-7201` Fail dự kiến (dev cho org được share `Edit`/`Delete`); `PAC2-6982` Blocked
- Chi tiết: `workflows/comms-hub.md#shared-campaign-và-quyền-viewedit`; `workflows/health-forms.md#health-form-designer--component-blood-pressure`

#### Quick Send — Campaign tags
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-8522 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-8522`
- Note: Bật bằng query `qs_campaign_tags=true` trên feature branch; route như `Quick Send`.
- Logic chính:
  - Campaign hiển thị tag; overflow `+N`, hover xem phần còn lại `[Confirmed]` (PAC2-8522)
  - Tag gắn nhưng vắng `getAllTags` vẫn hiển thị và không bị xóa im lặng `[Confirmed]` (PAC2-8522)
  - Chỉ người có quyền update campaign sửa tag `[Confirmed]` (PAC2-8522)
- Defect đã biết:
  - `PAC2-8522` Blocked: TC-002, 005, 006; Not Run TC-007 (không Fail)
- Chi tiết: `workflows/comms-hub.md#campaign-tags-trong-quick-send`

#### Comms Analytics
- Coverage: Unknown
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-3798 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-3798`
- Note: Redirect sang login Comms Hub; route đích chưa verified.
- Logic chính:
  - Site riêng, ngoài scope ticket `[Confirmed]` (PAC2-3798)
  - `Export to CSV` trả HTTP 200 JSON, không download trực tiếp `[Observed]` (PAC2-3798)
- Defect đã biết:
  - `PAC2-3798` Inconclusive: schema CSV chưa có contract
- Chi tiết: `workflows/comms-hub.md#comms-analytics`

#### Advanced Search — Deleted Patients Included/Excluded
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-6540 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-6540`
- Note: Qua `Analytics & Reports` → `Reports` → `Patient Details` → `Advanced Search`; chưa promote riêng.
- Logic chính:
  - Kết quả nhất quán giữa `Deleted Patients Included` và `Excluded` `[Confirmed]` (PAC2-6540)
  - Saved Reference Report và direct Advanced Search từng trả patient set khác nhau `[Inferred]` (PAC2-6540)
  - So sánh patient set, không chỉ count; count phụ thuộc dataset `[Observed]` (PAC2-6540)
- Defect đã biết:
  - `PAC2-6540` Pass TC-001; Inconclusive TC-002
- Chi tiết: `workflows/analytics-reports.md#deleted-patients-trong-advanced-search`

#### SSO login / `User Management`
- Coverage: Unknown
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-191 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-191`
- Note: Chưa locate; host feature chưa trong allowlist.
- Logic chính:
  - SSO identity chưa có organisation assignment không được tự tạo PACO user `[Inferred]` (PAC2-191)
  - User bị từ chối thấy lỗi rõ ràng và có đường về `login`; user hợp lệ vẫn login `[Inferred]` (PAC2-191)
- Defect đã biết:
  - `PAC2-191` Blocked: LOCATE pending, chưa có Pass/Fail
- Chi tiết: `workflows/admin-sso.md#sso-không-tự-tạo-user-khi-thiếu-organisation-assignment-pac2-191`

#### Document Intelligence (PACO Assist)
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-6763 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-6763`
- Note: Scope gốc rộng; chỉ quan sát inbox/dialog upload.
- Logic chính:
  - Tự xử lý inbound document với HP oversight; nhận diện source, patient khớp, addressee, summary, action `[Confirmed]` (PAC2-6763)
  - Mỗi `SNOMED CT` code gợi ý phải accept/decline trước khi áp dụng `[Confirmed]` (PAC2-6763)
  - `Admin entry` gate bởi PAC2-7193 (trạng thái chưa rõ) `[Confirmed]` (PAC2-6763)
- Defect đã biết:
  - `PAC2-6763` Not Run: TC-001 upload
- Chi tiết: `workflows/paco-assist.md#document-inbox`

#### Scheduler link — Book / Reschedule (race, rollback)
- Coverage: Unknown
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-1805 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-1805`
- Note: Route patient cần token; chưa verified.
- Logic chính:
  - Ghi `appointment.appointment` (`Pending` → `Booked`) trước khi gọi EPR `[Confirmed]` (PAC2-1805)
  - `Reschedule`: slot cũ chỉ hủy sau khi slot mới relay thành công; thất bại thì khôi phục `[Confirmed]` (PAC2-1805)
  - Rollback chỉ hủy slot của chính attempt, không hủy appointment ngoài link `[Confirmed]` (PAC2-1805)
- Defect đã biết:
  - `PAC2-1805` Blocked: LOCATE không có token; chưa có Pass/Fail
- Chi tiết: `workflows/patient-facing-scheduler.md#chống-double-book-qua-cùng-scheduler-link-pac2-1805`

#### UI component library refactor (`Bx*` components)
- Coverage: Minimal
- Entry: chưa verified
- Route: chưa verified
- Classification: `Observed`/`Inferred` theo bullet (route chưa quan sát)
- Source: PAC2-4700 (`logic từ ticket`)
- Last verified: `-`
- Tickets: `PAC2-4700`
- Note: Cross-cutting (Connect, GP Supergrid, PC24/OS, Rocketbar); không có route riêng.
- Logic chính:
  - Không đổi UX/visual/layout; so với baseline, chỉ ghi major breakage `[Confirmed]` (PAC2-4700)
  - Control trong scope: `input`, `textarea`, `dropdown`, `multiselect`, `checkbox`, `radio`, `avatar` `[Confirmed]` (PAC2-4700)
- Defect đã biết:
  - `PAC2-4700` không Fail: 5 Pass / 2 Blocked / 5 Inconclusive
- Chi tiết: `workflows/comms-hub.md#ui-component-library-refactor-pac2-4700`

### Conflicts / ghi chú đối chiếu

- `Campaign Manager`: `PAC2-1805`/`PAC2-6540` ghi redirect login rồi cần login thủ công; `PAC2-6982` (mới nhất) xác nhận host external nằm trong `paco.config.yaml`. Giữ `PAC2-6982`.
- `Patient Analyser`: survey/menu trỏ `/patient-analyser-new/` nhưng `PAC2-3798` quan sát 404 trên demo host; giữ `/patient-analyser/` (mới hơn, ticket-provided). Cần re-verify trên host chính.
- `Appointment Settings`: `PAC2-7786` loại `/paco-connect/configuration` trên shared host vì không chứng minh build feature-branch; `PAC2-8241` xác nhận route đó là DEV main. Hai kết luận không mâu thuẫn (khác mục đích); dùng route feature-branch khi test ticket branch.
- `Scheduler Configuration` (entry đã có bên dưới, `PAC2-7669`): `/configuration/` cũng là gốc của `/configuration/#appointments`, `#clinics`, `#code-rules-config`; `PAC2-8552` ghi `/configuration/#scheduler-config` là cấu hình campaign/template/slot type, chưa verify độc lập.
- `Quick Send`: `PAC2-1805` mô tả sidebar icon `Quick Send` dẫn tới `Comms Hub`; `PAC2-4700`/`PAC2-8522` xác nhận đó là launcher, không phải composer. Composer dùng patient actions menu.
- Role: `PAC2-6982` ghi role `Admin` do QA xác nhận, chưa verify trên UI.

### Route hints (chưa verified)

Chưa đủ điều kiện làm entry chuẩn; không dùng làm automation gate.

- `Template Manager`, `Patient Manager` (submenu `Comms Hub`): chỉ thấy button submenu, chưa mở root (`PAC2-1805`, `PAC2-6982`, `PAC2-6540`).
- Shared campaign → patient scheduler link (PCN/child org): route patient chưa verified, cần campaign/link thật (`PAC2-6982`, `PAC2-7201`). Context org hierarchy đã được QA xác nhận nhưng không ghi tên org ở đây.
- `Rocketbar` (PACO OS sidebar): chưa locate, không có feature-branch URL (`PAC2-4700`).
- GP Supergrid login `/login/` trên host feature-branch GP: `Blocked` (auth/host ngoài `allowedHosts`) (`PAC2-4700`).
- `Quick Book` trong `Appointment Book`: trigger booking, chưa mở vì có thể tạo draft/mutation (`PAC2-8552`).
- Appointment drawer đa slot (`Slot Count`): mở bằng click block appointment đã có trong session grid; chỉ từ execution observation (`PAC2-8552`).
- `Capacity & Demand` `/capacity-demand/`: route từ survey, bị loại khỏi scope `PAC2-4399`; chưa re-verify (`PAC2-4399`).
- Patient filing flow cho blood-pressure (qua `Patient Search` → patient context): chưa xác nhận exact entry (`PAC2-4399`).
- Cancel Session confirmation dialog (Configuration `Sessions`): label chưa quan sát (`PAC2-8552`).
- `Patient Analyser` tab và `Advanced Search` dialog trong `/patient-analyser/`: visible, chưa mở (`PAC2-3798`).
- `/paco-connect/dashboard` (mainline): survey ghi 404, không reusable; feature-branch `/dashboard` hoạt động (`PAC2-4700`, `PAC2-7786`).
- `PACO Assist` qua `More options`: rejected cho scope upload của `PAC2-6763`.

### Entries đã có (giữ nguyên)

### Navigation
- Coverage: Unknown
- Requirements: N/A
- Tickets: None
- Updated: -
- Logic chính:
  - Chưa có logic từ ticket.
- Defect đã biết:
  - Không có.
- Chi tiết: chưa có

### Dashboard
- Coverage: Unknown
- Requirements: N/A
- Tickets: None
- Updated: -
- Logic chính:
  - Chưa có logic từ ticket; dashboard feature-branch là entry cho Connect/OS (xem route hints) `[Observed]` (PAC2-4700, PAC2-7786)
- Defect đã biết:
  - Không có.
- Chi tiết: chưa có

### Scheduler Configuration
- Coverage: Partial
- Entry: Direct route to `Scheduler Configuration`
- Route: `/configuration/`
- Role observed: `Blinx Deployment`
- Environment: `dev`
- Classification: `Observed`
- Source: `PAC2-7669`
- Last verified: `2026-10-01`
- Aliases: `Scheduler Config`
- Tickets: `PAC2-7669`
- Logic chính:
  - Chọn clinician (source `EMIS`/`PACO Connect`) không được freeze/trễ 5–10 giây, không có SLA tuyệt đối `[Confirmed]` (PAC2-7669)
  - Draft clinician chỉ nằm trong dialog; `Cancel` không đổi persisted state `[Observed]` (PAC2-7669)
  - Click-to-chip ~110–150 ms sau fix `[Observed]` (PAC2-7669)
- Defect đã biết:
  - `PAC2-7669` không có defect (Pass 5/5; automation CLI Blocked do login)
- Chi tiết: `workflows/configuration.md#scheduler-configuration--chọn-clinician`

## Ticket → feature

Lookup tổng hợp 2026-10-02 từ 17 ticket. `Final status` là phase/kết quả ở thời điểm tổng hợp (từ `manifest.yaml`/`status.md`/`report.md`), không phải xác nhận product correct.

| Ticket | Short title | Modules / feature | Final status |
|---|---|---|---|
| `PAC2-191` | Chặn SSO tự tạo user khi thiếu organisation assignment | Admin/SSO (`SSO login / User Management`) | LOCATE pending; Blocked, chưa có Pass/Fail |
| `PAC2-1805` | Scheduler cho book nhiều appointment liên tiếp (race) | Patient-facing Scheduler, Comms Hub (`Campaign Outbox` `Resend`) | LOCATE Blocked (không có token link); defect `Resend` ngoài scope |
| `PAC2-3798` | Refactor supergrid backend | Analytics (`Patient & Medication Analyser`), Comms Analytics | Manual 8 Pass / 1 Not Run; automation CLI Blocked |
| `PAC2-4399` | Update O/E blood pressure codes | Configuration (`Code Rule Config`), Health Forms (Designer, Inbox), Patient | COMPLETE; overall Inconclusive (TC-001..003 Blocked) |
| `PAC2-4700` | Refactor UI component library (branching) | Comms Hub (`Quick Send`), Patient (`Quick Form`), UI `Bx*` | COMPLETE; 5 Pass / 2 Blocked / 5 Inconclusive, 0 Fail |
| `PAC2-5776` | Popup `Scheduler Link Required` intermittent | Comms Hub (`Quick Send`), Health Forms (Inbox) | AUTOMATION_REVIEW; Inconclusive, cases Blocked |
| `PAC2-6540` | Deleted patients trong Comms Hub/Analytics | Analytics (Advanced Search), Comms Hub (`Campaign Outbox`) | EXPLORE; TC-001 Pass, TC-002 Inconclusive, TC-003 Not Run |
| `PAC2-6763` | Paco Assist document analyser | Paco Assist (`Document Inbox`), Patient (Documents) | COMPLETE; TC-001 Not Run |
| `PAC2-6982` | Shared campaign không truy cập health form từ child org | Comms Hub (Shared Campaign), Health Forms, Patient-facing Scheduler | MANUAL_EXECUTE; Blocked, chưa có Pass/Fail |
| `PAC2-7137` | Session slot count lệch với top view | Appointment Book (count `Day`/`Week`, `Non-bookable`) | MANUAL_EXECUTE xong; TC-001/002/003/005 Pass, TC-004 Fail |
| `PAC2-7201` | Shared campaign issue (PCN) | Comms Hub (Shared Campaign quyền view/edit) | AUTOMATE; chưa execute chính thức, defect pattern quan sát trên dev |
| `PAC2-7466` | Documents tab performance/memory leak | Patient (Documents) | INGEST; Blocked, chưa ANALYZE |
| `PAC2-7669` | Chậm chọn clinician ở Scheduler Configuration | Configuration (`Scheduler Configuration`) | COMPLETE; Pass 5/5, automation CLI Blocked |
| `PAC2-7786` | Xóa diary/session trong Appointment Book không hoạt động | Appointment Book (Settings: session delete/archive) | AUTOMATE; TC-001/003/004 Fail, TC-002 Blocked, TC-005 Inconclusive |
| `PAC2-8241` | Session editor fixes (Connect Appointment Book) | Appointment Book (session editor, slot) | AUTOMATION_EXECUTE; 2 Pass / 2 Fail / 2 Blocked |
| `PAC2-8384` | Fix filtering trong Appointment Book | Appointment Book (Filters / Location) | COMPLETE; 0 Pass / 1 Fail / 2 Inconclusive / 3 Not Run |
| `PAC2-8522` | Quick Send xem/thêm/sửa campaign tag | Comms Hub (`Quick Send` tags), Patient | LOCATE (manifest); manual 3 Pass / 3 Blocked / 1 Not Run |
| `PAC2-8552` | Hiệu năng booking/cancel (partitioned tables) | Appointment Book, Patient-facing Scheduler (backend) | EXECUTE; 9/9 Blocked |
