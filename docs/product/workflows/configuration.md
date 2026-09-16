# Workflow: Configuration

- Classification: `[Observed: dev, Super Admin GB, 2026-09-15]`
- Aliases: `Configuration`, `Organisation`, `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation`
- Coverage: `Partial`
- Confidence: `Medium`

## Business context observed

- Visible purpose: quản lý cấu hình organisation, patient, appointment, payment, staff và case prioritisation.
- Actor/role: `Super Admin GB` tại `General Practice (Blinx Demo Site)`.
- Required context: authenticated Paco session và organisation context.
- Starting data state: `/paco/configuration/organisation/general`; child navigation tải bất đồng bộ sau mỗi lần quay lại trang.
- Entities and statuses: organisation, staff role group, team, appointment book/session, account, priority factor.

## Entry

1. Dashboard → `Configuration`.
2. Stable landmark: heading `Configuration` và top-level groups `Organisation`, `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation`.

## Read-only flow

1. **Action:** mở `Patient > Care Navigation`.
   - **Transition:** chuyển sang legacy route `/configuration/#care-navigation-config`.
   - **Observed result:** không có nội dung visible sau bounded wait.
   - **Evidence:** `test-results/product-survey/20260915-continue-config/01-care-navigation.png`.
2. **Action:** mở các child của `Appointment Books`.
   - **Transition:** `Scheduler` → `/configuration/#scheduler-config`; `Appointment Books` → `/paco-connect/configuration/#appointment-books`; `Sessions` → `/paco-connect/configuration/#clinics`; `Appointments` → `/configuration/#appointments`.
   - **Observed result:** không có nội dung visible sau bounded wait trong pass này.
   - **Evidence:** `test-results/product-survey/20260915-continue-config/02-scheduler.png` đến `05-appointments.png`.
3. **Action:** mở `Quick Pay > Accounts`.
   - **Transition:** route `/paco-connect/quick-pay/accounts`.
   - **Observed result:** không có nội dung visible sau bounded wait.
   - **Evidence:** `test-results/product-survey/20260915-continue-config/06-accounts.png`.
4. **Action:** mở `Users & Staff > Role Groups`.
   - **Transition:** route `/paco/configuration/staff/role-groups`.
   - **Observed result:** heading `Role Groups`; `Save` hiện diện nhưng không dùng.
   - **Evidence:** `test-results/product-survey/20260915-continue-config/08-role-groups.png`.
5. **Action:** mở `Users & Staff > Teams`.
   - **Transition:** route `/paco/configuration/staff/teams`.
   - **Observed result:** danh sách team với `Team Name`, `Assign Staff`; controls `Add New`, `Save` không dùng.
   - **Evidence:** `test-results/product-survey/20260915-continue-config/09-teams.png`.
6. **Action:** mở `Case Prioritisation`.
   - **Transition:** route `/paco/configuration/case-prioritisation`.
   - **Observed result:** factors `Patient`, `SPN`, `Age`, `Number cases in last 72hours`, `Day`, `Case Priority`, `Breach Time`, `Out of Hours`; controls `Add Another`, `Save` không dùng.
   - **Evidence:** `test-results/product-survey/20260915-continue-config/11-case-prioritisation.png`.
7. **Action:** mở `Users & Staff > Staff Profiles`.
   - **Transition:** route `/paco/configuration/staff/profiles`.
   - **Observed result:** tabs `Active`, `Archived`, `My Profile`; table columns `First Name`, `Last Name`, `Gender`, `Email`, `Actions`; `Add Care Professional` không dùng.
   - **Evidence:** `test-results/product-survey/20260915-config-followup/01-staff-profiles.png`.
8. **Action:** mở `Clinical Config`.
   - **Transition:** giữ route `/paco/configuration/organisation/general` và mở child navigation.
   - **Observed result:** chỉ có hai child `Risk Strat Builder` và `Template Library`; không thấy `Drug Interactions`, `Prescribing`, `Documents` hoặc `Investigations`.
   - **Evidence:** `test-results/product-survey/20260915-config-followup/02-clinical-config.png`.
9. **Action:** retry các destination blank `Care Navigation`, `Scheduler`, `Accounts` với bounded wait dài hơn.
   - **Transition:** route không đổi so với pass trước.
   - **Observed result:** body vẫn blank; đây là stable blank state trong hai pass, nhưng chưa có trusted expected behavior để kết luận defect.
   - **Evidence:** `test-results/product-survey/20260915-config-followup/08-care-navigation-long-wait.png` đến `10-accounts-long-wait.png`.
10. **Action:** mở `Clinical Config > Risk Strat Builder`.
    - **Transition:** route `/paco/configuration/clinical-config/risk-strat-builder`.
    - **Observed result:** screen quản lý risk models hiển thị model list, tổng `Base`/`Max`, `RAG rating thresholds` và `Risk Factors`; model đang chọn có một factor `BMI` dùng `Clinical Codes`. `New Model`, `Set up thresholds`, `Save`, `Add Risk Factor`, `Delete Model`, `Save Model` không được dùng.
    - **Evidence:** `test-results/product-survey/20260915-clinical-config/01-risk-strat-builder.png`.
11. **Action:** mở `Clinical Config > Template Library`.
    - **Transition:** parent chỉ expand submenu tại route hiện tại; ba child visible là `Document Templates`, `Consultation Templates`, `Prescribing Formularies`.
    - **Observed result:** `Document Templates` mở `/paco/configuration/clinical-config/document-templates`, hiển thị `Manage Templates` và columns `Name`, `Category`, `Merge Fields`, `Author`, `Created`, `Actions`. `Consultation Templates` mở `/paco/configuration/clinical-config/consultation-templates`, hiển thị template cards với style/type và created date. `Create`, `Create New Template`, `Edit`, `Rename`, `Delete` không được dùng.
    - **Evidence:** `test-results/product-survey/20260915-clinical-config/05-template-library.png` đến `07-consultation-templates.png`.
12. **Action:** mở `Template Library > Prescribing Formularies`.
    - **Transition:** route `/paco/configuration/`.
    - **Observed result:** chỉ hiển thị heading `Configuration` và message `Please select a menu item`; chưa có trusted basis để kết luận đây là expected empty state hay navigation defect.
    - **Evidence:** `test-results/product-survey/20260915-clinical-config/08-prescribing-formularies.png`.

## Decision points

- **Visible condition:** top-level configuration group.
  - **Expanded group:** child navigation xuất hiện.
  - **Selected child:** route chuyển sang app chính, legacy `/configuration/`, hoặc `/paco-connect/` surface.
- **Visible condition:** child screen có editable configuration.
  - **Read-only branch:** chỉ xem fields, rows và labels.
  - **Mutation branch:** `Add New`, `Add Another`, `Save`, edit/delete controls — dừng để xin approval.

## End and exceptional states

- End state observed: `Case Prioritisation` factor list.
- Empty/loading/error states: `Care Navigation`, `Scheduler` và `Accounts` vẫn blank sau bounded wait dài hơn ở pass thứ hai. `Prescribing Formularies` chuyển về configuration root với `Please select a menu item`. Chưa phân loại các trạng thái này là product defect.
- Cross-feature handoff: `Appointment Books` và `Quick Pay` chuyển sang PACO Connect; một số cấu hình chuyển sang legacy `/configuration/`; template configuration dùng route chính `/paco/configuration/clinical-config/...` ngoại trừ observed transition của `Prescribing Formularies`.

## Safety boundary

- Last safe read-only state: xem navigation, route, headings, list rows và labels.
- Approval stop: `Save`, `Add New`, `Add Another`, edit/delete, upload/remove hoặc thay đổi selection có thể persist.
- Actions not performed: toàn bộ mutation controls.
- Mutation: `None`

## Execution guidance

- Setup/data: login role `Super Admin GB`; chọn organisation; đợi navigation render ít nhất vài giây sau mỗi route reset.
- Safe manual steps: mở top-level group rồi child item; ghi route và stable landmark; chỉ xem list/config values.
- Stop and request approval before: mọi `Save`, add/edit/delete/upload/remove hoặc thay đổi persisted setting.
- Evidence to capture: route, role/org, heading, child navigation, empty/loading/error state; redact staff và organisation-sensitive data trước khi chia sẻ.

## Automation guidance

- Stable roles/labels/landmarks: heading `Configuration`; group labels và headings `Role Groups`, `Teams`, `Case Prioritisation`.
- Observable waits: top-level labels tải bất đồng bộ; không kết luận blank ngay sau navigation; chờ visible landmark hoặc bounded stable blank state.
- Data dependencies: role/config entitlement và organisation-specific configuration.
- Assertions lacking trusted expected basis: content đúng của legacy/PACO Connect pages, team membership, role permissions và priority-factor values.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-15`.
- Raw evidence: `test-results/product-survey/20260915-continue-config/`, `test-results/product-survey/20260915-config-followup/`, `test-results/product-survey/20260915-clinical-config/`.
- Open questions: các destination blank do loading, permission hay app failure; `Prescribing Formularies` có chủ đích quay về configuration root hay navigation bị lỗi; read-only detail behavior của từng risk model và template chưa khảo sát vì row/card selection có persistence chưa rõ.
- Exact resume state: khảo sát read-only detail/menu của `Document Templates` và `Consultation Templates` chỉ khi xác minh selection không mutate; không dùng create/edit/rename/delete/save controls; không retry các blank destination nếu session/dependency không đổi. Batch 26 (2026-09-16) confirmed `Document Templates` row-click opens inline edit form with safe `CANCEL`; `Consultation Templates` card-click opens side panel with safe `CANCEL`. Safe close actions confirmed.

## Tester notes
