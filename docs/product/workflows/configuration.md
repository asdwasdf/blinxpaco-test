# Workflow: Configuration

- Classification: `[Observed: dev, Super Admin GB, 2026-09-15 to 2026-09-16]`
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
13. **Action:** re-check `Appointment Books > Scheduler` qua visible navigation.
    - **Transition:** `/paco/configuration/` → expand `Appointment Books` → exact child `Scheduler` → `/configuration/#scheduler-config`.
    - **Observed result:** heading `SCHEDULER CONFIG` và `Loading...` vẫn hiện sau bounded wait 5 giây; không phải body hoàn toàn blank. Console ghi warning về external-sharing initialization nhưng không có page exception trong capture này.
    - **Evidence:** `test-results/product-survey/batch30/scheduler-via-menu.png`.
14. **Action:** re-check `Clinical Config > Template Library > Prescribing Formularies` qua visible navigation.
    - **Transition:** expand `Clinical Config`, expand `Template Library`, chọn exact child `Prescribing Formularies`.
    - **Observed result:** URL giữ nguyên `/paco/configuration/`; submenu vẫn mở; body giữ `Please select a menu item`. Không thấy loading, error hoặc feature heading.
    - **Evidence:** `test-results/product-survey/batch30/prescribing-via-menu.png`.
15. **Action:** re-check legacy `/configuration/#care-navigation-config`.
    - **Transition:** route resolve với title `Care Navigation Config`.
    - **Observed result:** heading `CARE NAVIGATION CONFIG` và header context render; không có configuration body hoặc explicit loading/error message sau bounded wait. Console ghi warning thiếu permission setting `PACOMMS`, nhưng observation chưa chứng minh warning này gây heading-only state.
    - **Evidence:** `test-results/product-survey/batch30/care-navigation.png`.

## Decision points

- **Visible condition:** top-level configuration group.
  - **Expanded group:** child navigation xuất hiện.
  - **Selected child:** route chuyển sang app chính, legacy `/configuration/`, hoặc `/paco-connect/` surface.
- **Visible condition:** child screen có editable configuration.
  - **Read-only branch:** chỉ xem fields, rows và labels.
  - **Mutation branch:** `Add New`, `Add Another`, `Save`, edit/delete controls — dừng để xin approval.

## End and exceptional states

- End state observed: `Case Prioritisation` factor list.
- Empty/loading/error states: `[Observed: dev, Super Admin GB, 2026-09-16]` `Scheduler` hiện heading và persistent `Loading...`; `Care Navigation` hiện heading/header nhưng không có configuration body; `Prescribing Formularies` giữ configuration root với `Please select a menu item`. Đây là stable observed behavior qua nhiều pass, chưa phân loại là product defect vì thiếu trusted expected basis. `Accounts` vẫn là prior blank observation.
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
- Observable waits: top-level labels tải bất đồng bộ; sau route legacy chờ heading và body state. `Scheduler` có observable heading `SCHEDULER CONFIG` nhưng `Loading...` có thể kéo dài; `Care Navigation` có heading `CARE NAVIGATION CONFIG`; `Prescribing Formularies` không đổi URL/body sau click. Không dùng fixed timeout làm expected-result assertion.
- Data dependencies: role/config entitlement và organisation-specific configuration.
- Assertions lacking trusted expected basis: content đúng của legacy/PACO Connect pages, team membership, role permissions và priority-factor values.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-15` và `2026-09-16`.
- Raw evidence: `test-results/product-survey/20260915-continue-config/`, `test-results/product-survey/20260915-config-followup/`, `test-results/product-survey/20260915-clinical-config/`, `test-results/product-survey/batch30/`.
- Open questions: `Scheduler` loading có hoàn tất khi dependency khác hoạt động không; `Care Navigation` thiếu body do permission, data dependency hay app failure; `Prescribing Formularies` có chủ đích ở configuration root hay click handler/route bị thiếu. Warning `PACOMMS` chỉ là correlated console observation, chưa phải causal evidence.
- Exact resume state: không retry ba gap trên khi session/dependency không đổi. Cần product/API owner cung cấp trusted expected behavior hoặc dependency/permission prerequisite; sau đó mới observe lại. Batch 26 (2026-09-16) confirmed `Document Templates` row-click opens inline edit form with safe `CANCEL`; `Consultation Templates` card-click opens side panel with safe `CANCEL`. Safe close actions confirmed.

## Discovery update run-20261001-085609

`Observed: dev, Super Admin GB, 2026-10-01`; autonomous discovery read-only, checkpoint `docs/product/survey/roles/super-admin-gb-run-20261001-085609.discovery.yaml`. Không có mutation; mọi điểm dưới đây là hành vi hiện tại, chưa đối chiếu requirement.

- Menu `Organisation`: `General`, `Practice Profiles`, `Locations`, `Skills`, `Code Rule`, `Sharing Agreements`, `Pathways Config`, `Services`, `Dx Priority`, `Org Priority`, `Inbound Priority Flow`, `Announcements`, `Integrations`; nhóm khác: `Patient`, `Appointment Books`, `Quick Pay`, `Patients & Proxy`, `Users & Staff`, `Clinical Config`, `Case Prioritisation` (rỗng).
- Trạng thái lỗi: `Pathways Config` → `Page Not Found`; `Practice Profiles` → text `Page Not Found`/`Access Denied`; `Template Library` click không điều hướng.
- Handoff sang app khác (không thấy heading sau 4s): `Code Rule`, `Patient > DFD`, `Patient > Care Navigation`, `Appointment Books > Scheduler/Appointments/External Appt Reminders` → `/configuration/`; `Appointment Books > Appointment Books/Sessions/Slot Types` → `/paco-connect/configuration/`; `Quick Pay > Product Catalogue/Accounts` → route Quick Pay của PACO Connect.
- Approval stop rủi ro cao: `Users & Staff > Role Groups` (Add New/Edit/Save — quyền), `Integrations > Save` (hệ thống ngoài), `Announcements > Save` (có thể phát tới user), `Risk Strat Builder > Delete Model`, `Org Priorities`/`Dx Priorities`/`Inbound Priority Flow`/`Services` Add/Remove/Save, `General > Save`.
- Automation: menu item dùng `.p-menuitem` lọc visible (có bản ẩn trùng text); nhóm dùng `.p-panelmenu-header`.

## Logic từ ticket

Nguồn: `PAC2-4399`, `PAC2-7669`; logic cấu hình session xem `appointment-book.md#session-editor-và-khóa-field`.

### Scheduler Configuration — chọn clinician

**Luồng**
1. Route `/configuration/` → chọn template → `Edit` mở dialog `Edit Connections` có `Select a clinician`; mapping thuộc source `EMIS` hoặc `PACO Connect`. `[Observed]` — PAC2-7669/exploration.md
2. Chọn clinician → chip hiện, gỡ được khỏi draft; list có thể còn mở sau multi-select (`Escape` đóng). `[Observed]` — PAC2-7669/exploration.md
3. `Cancel` rồi mở lại: persisted state không đổi (draft chỉ nằm trong dialog chưa save). `[Observed]` — PAC2-7669/exploration.md, automation.md

**Business rules**
- Khi proxy bật, chọn clinician từng chậm 5–10 giây, có thể freeze/crash hoặc popup `waiting for this page to respond`; yêu cầu bỏ hoặc giảm đáng kể độ trễ cho cả source `EMIS` và `PACO Connect`, không freeze khi chọn liên tiếp; không có SLA tuyệt đối. `[Confirmed]` — PAC2-7669/requirements.md (REQ-001..003)
- Dev comment: đã sửa memory leak và redundant API fetching (fix claim, không phải kết quả QA). `[Confirmed]` — PAC2-7669/requirements.md
- Nguyên nhân điều tra (view proxy DB thiếu index, row-by-row session fetching, render). `[Inferred from: dev comment, needs confirmation]` — PAC2-7669/requirements.md
- Click-to-chip ~110–150 ms cho cả hai source; không thấy delay 5–10 giây/popup/freeze; số 8,1 và 10,3 giây ban đầu là latency của tool nên bị loại. `[Observed]` — PAC2-7669/exploration.md

**Trạng thái**
- Draft selection (dialog) → `Save` mới persist. `[Observed]` — PAC2-7669/exploration.md

**Role/permission**
- Role quan sát `Blinx Deployment` (quyền tương đương admin theo tester). `[Observed]` — PAC2-7669/requirements.md

**Defect đã biết**
- PAC2-7669 · Pass (TC-001..005, 5/5) · không tái hiện độ trễ/freeze sau fix; automation spec tạo và validate nhưng CLI Blocked vì login browser không chạy (blocker kỹ thuật, không đổi product result). `[Observed]` — PAC2-7669/report.md, status.md

**Open questions**
- Proxy-enabled là precondition nhưng không có UI indicator để QA xác minh; không có SLA tuyệt đối. `[Open Question]` — PAC2-7669/requirements.md

### Code Rule Config và quy tắc clinical code blood-pressure

**Luồng**
1. `Configuration` → `Organisation` → `Code Rule` → `/configuration/#code-rules-config`; landmark `Code Rule Config`, `Search Snomed Code`, `Create or update rules:`, `Submit`. `[Observed]` — PAC2-4399/feature-location.md
2. Chọn value tạo draft rule; `Submit` là mutation boundary. `[Observed]` — PAC2-4399/feature-location.md

**Business rules**
- Mục tiêu ticket: cập nhật SNOMED code Paco dùng khi file blood-pressure reading vào EMIS; code cũ không có trong EMIS selector, code thay thế gần nhất đã deprecated (hết hiệu lực từ 2021). `[Confirmed]` — PAC2-4399/requirements.md
- Code đích đề xuất là cặp ConceptID/DescriptionID của `Blood pressure (observable entity)` (từ comment dev/BA, không phải AC). `[Inferred from: comment dev/BA, needs confirmation]` — PAC2-4399/requirements.md (REQ-001)
- Sau đổi code, giá trị SYS/DIA không được đổi, mất, đảo hoặc duplicate. `[Inferred from: REQ-003, needs confirmation]` — PAC2-4399/requirements.md
- Dữ liệu/config mang code cũ cần migrate/correct, không để mapping hỗn hợp. `[Inferred from: REQ-002, needs confirmation]` — PAC2-4399/requirements.md
- Chưa có bằng chứng `Code Rule Config` là nơi quyết định mapping blood-pressure của ticket. `[Open Question]` — PAC2-4399/exploration.md, report.md

**Role/permission**
- `Super Admin GB` truy cập được. `[Observed]` — PAC2-4399/feature-location.md

**Defect đã biết**
- PAC2-4399 · Blocked (TC-001, 002, 003) · không có quyền EMIS để xem code đã filed, thiếu evidence DB redacted; overall Inconclusive, không tạo defect. `[Observed]` — PAC2-4399/report.md

**Open questions**
- Ticket mâu thuẫn: Description "likely need hard update in the DB" vs field Jira không cần DB change; phạm vi migrate (mọi record mang code deprecated hay theo `DescriptionID`). `[Open Question]` — PAC2-4399/requirements.md
- Dev nói code legacy không còn dùng ở bảng cấu hình câu hỏi trên DEV/UAT/PROD (2026-08-07) nhưng chưa có evidence query. `[Open Question]` — PAC2-4399/requirements.md

## Tester notes
