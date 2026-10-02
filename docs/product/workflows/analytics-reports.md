# Workflow: Analytics & Reports

- Classification: `[Observed: dev, Super Admin GB, 2026-10-01]`
- Aliases: `Analytics & Reports`, `Reports`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`
- Coverage: `Partial`
- Confidence: `Medium`

## Business context observed

- Visible purpose: phân tích dân số bệnh nhân, thuốc, QOF, capacity; báo cáo SCR/NCRS.
- Actor/role: `Super Admin GB`.
- Required context: phiên PACO; Comms Analytics cần phiên Comms Hub.
- Starting data state: analyser có dữ liệu bệnh nhân (PII, không ghi lại).
- Entities and statuses: report, cohort, saved report.

## Entry

1. Sidebar `Analytics & Reports` → submenu `Capacity & Demand`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`, `Reports`.
2. `Patient Analyser`/`Medication Analyser`/`QOF Registers`/`Patient Details` cùng mở app `/patient-analyser-new/`.

## Read-only flow

1. **Action:** `Reports`.
   - **Observed result:** `/paco/analytics-reports?report=scr&error=not-authorized`, tab `SCR`, `Patient Cases`, `Prescriptions`, `NCRS`.
2. **Action:** tab `Patient Cases`/`Prescriptions`/`NCRS`.
   - **Observed result:** `Access Denied` cho cả ba.
3. **Action:** `Advanced Search` trong analyser.
   - **Transition:** dialog `Advanced Patient Search` (`Analyse`, `Import`, `Reference Report(s)`, `Add Rule Group`).

## Decision points

- **Visible condition:** quyền report của role.
  - **Branch A:** SCR mặc định báo `not-authorized`.
  - **Branch B:** các tab khác `Access Denied`. Role nào được xem: `Open Question`.

## End and exceptional states

- Error: `not-authorized`, `Access Denied`.
- Cross-feature handoff: analyser → Comms Hub (`Send to Comms Hub`, `Group Quick Send`); `Comms Analytics` → Comms Hub login.

## Safety boundary

- Last safe read-only state: dialog `Advanced Patient Search` (chưa chạy `Analyse`).
- Approval stop: `Send to Comms Hub`, `Group Quick Send` (SEND), `Save Report`, `Import` (upload).
- Mutation: `None`

## Execution guidance

- Setup/data: cohort bệnh nhân synthetic và recipient được duyệt nếu cần thử luồng gửi.
- Safe manual steps: Entry, Read-only flow 1–3.
- Stop and request approval before: mọi SEND, save, import.
- Evidence to capture: heading và URL của từng tab report.

## Automation guidance

- Stable roles/labels/landmarks: tab text `SCR`/`Patient Cases`/`Prescriptions`/`NCRS`; heading `Access Denied`; dialog `Advanced Patient Search`.
- Observable waits: analyser cần ~9s; menu sidebar có nhãn trùng (`QOF Registers`) nên chọn button visible cuối.
- Data dependencies: cohort synthetic.
- Assertions lacking trusted expected basis: quyền xem report của role; không assert `Access Denied` là defect.

## Provenance and gaps

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-01 (run-20261001-085609)
- Raw evidence: `test-results/product-survey/run-20261001-085609/outcomes/`
- Open questions: quyền report theo role; `error-at-axios-interceptor` của Comms Analytics; `Columns` analyser không click được.
- Exact resume state: checkpoint run trên.

## Logic từ ticket

Nguồn: `PAC2-3798`, `PAC2-6540`, `PAC2-8384`.

### Patient & Medication Analyser (supergrid)

**Luồng**
1. Route `/patient-analyser/` (`Patient & Medication Analyser`); tab `Patient Details`, `Patient Analyser`, `Medication Analyser`; `Advanced Search N`, `Patients:`/`Observations:` count, `Columns`, `Filters`, panel `Reports` (`New`, `Save`). `[Observed]` — PAC2-3798/feature-location.md, exploration.md
2. `Advanced Patient Search` modal: tab `Analyse`/`Import`; `Reference Report(s)`, `Query builder`, `Add Rule Group`, `Deleted Patients Excluded`; `Import` có `Patient List`, `JSON Search`, `XML Search`. `[Observed]` — PAC2-3798/exploration.md
3. `Pivot Mode` bật → `Column Labels` xuất hiện, mở helper `Pivot Mode`; nút `Pivot` disabled cho tới khi chọn đủ field; tắt trả về trạng thái chuẩn. `[Observed]` — PAC2-3798/exploration.md
4. `Columns` panel `Column List` 81 cột, `Row Groups`, `Values`; `Filters` 80 filter (Medication Analyser 88). `[Observed]` — PAC2-3798/exploration.md

**Business rules**
| Yêu cầu | Tag | Kết quả manual | Provenance |
|---|---|---|---|
| Tạo report mới/clear `advanced search` không refresh trang | `[Confirmed]` | Pass (TC-001, 002) | PAC2-3798/requirements.md, automation.md |
| `Patient count` tải độc lập với grid data | `[Confirmed]` | Pass (TC-003: sort chỉ gọi lại request grid) | PAC2-3798/automation.md |
| `Aggrid` nâng cấp áp dụng toàn `supergrid` | `[Confirmed]` | Pass (TC-004); inventory đầy đủ chưa có | PAC2-3798/automation.md |
| Graph cho numerical value trong grid | `[Confirmed]` | Pass (TC-005: `Chart Range` mở, 1 series) | PAC2-3798/automation.md |
| `Pivot mode` + helper modal, chỉ column phù hợp mới aggregate/pivot | `[Confirmed]` (eligibility: Open Question) | Pass (TC-006) | PAC2-3798/automation.md |
| Search cũ deprecated, cập nhật dạng mới khi load vào editor | `[Confirmed]` | Pass (TC-007, không save) | PAC2-3798/automation.md |
| URL chứa report ID dạng anchor để share | `[Confirmed]` | Pass (TC-008: `/patient-analyser/#<report-id>` tải lại đúng) | PAC2-3798/automation.md |
| Reorder tab theo tần suất; bỏ `QOF`/`registers`; đổi tên `C&D with observations` | `[Confirmed]` (đích: Open Question) | Pass (TC-009) | PAC2-3798/automation.md |
| `generate CSV`, `send to comms hub` còn hoạt động | `[Confirmed]` | Not Run (Comms Hub site riêng) | PAC2-3798/automation.md |

- Hồi quy theo comment dev: thoát pivot không xóa cấu hình đã lưu; cột checkbox không có menu cột, cột thường có menu và dữ liệu vẫn hiển thị khi sort; collapse/expand panel `Reports` giữ footer và horizontal scroll (đều Pass). `[Observed]` — PAC2-3798/automation.md
- Thứ tự sidebar baseline: `Capacity & Demand`, `Patient Analyser`, `Medication Analyser`, `QOF Registers`, `Patient Details`, `Comms Analytics`, `Reports`; `QOF Registers` còn hiển thị. `[Observed]` — PAC2-3798/exploration.md

**Defect đã biết**
- PAC2-3798 · Inconclusive (possible defect) · sidebar `Patient Analyser` trỏ `/patient-analyser-new/` trả 404 trên demo host, trong khi `/patient-analyser/` dùng được. `[Observed]` — PAC2-3798/feature-location.md, exploration.md
- PAC2-3798 · Inconclusive · console báo AG Grid/AG Charts Enterprise license không tương thích; helper hiện `Invalid License`; tác động lên graph chưa xác minh. `[Observed]` — PAC2-3798/exploration.md
- PAC2-3798 · Blocked · automation CLI không kết nối được browser đăng nhập thủ công; manual result giữ nguyên. `[Observed]` — PAC2-3798/automation.md

**Open questions**
- Thứ tự đích và nhãn mới của tab; eligibility column cho pivot; old search migrate in-memory hay persist; ngưỡng timing cho "loads faster". `[Open Question]` — PAC2-3798/requirements.md

### Deleted patients trong Advanced Search

**Luồng**
1. `Analytics & Reports` → `Reports` (`/paco/analytics-reports`) → `Patient Details` → `Advanced Search` với `Reference Report` và lựa chọn `Deleted Patients Included`/`Excluded`. `[Observed]` — PAC2-6540/report.md, status.md
2. Root `Analytics & Reports` không hiện `Advanced Search`/filter deleted trực tiếp. `[Observed]` — PAC2-6540/status.md

**Business rules**
- `Advanced Search` phải trả kết quả nhất quán cho `Deleted Patient Included` và `Excluded`. `[Confirmed]` — PAC2-6540/requirements.md (REQ-004)
- Defect gốc: saved Reference Report vs direct Advanced Search trả patient set khác nhau khi loại deleted; đã fix. `[Inferred from: evidence post-fix của tester, needs confirmation]` — PAC2-6540/report.md
- Count tuyệt đối phụ thuộc dataset, không dùng làm expected cố định; regression nên dùng seeded report có cả deleted/non-deleted, so patient set (không chỉ count) và chạy lặp (bug intermittent). `[Observed]` — PAC2-6540/report.md
- Book đã archive vẫn còn trong lịch sử/analytics theo thiết kế sau cleanup test. `[Observed]` — PAC2-8384/report.md

**Role/permission**
- Role `GP Paco Assist` thấy cảnh báo không được xem `Summary Care Record (SCR) report`. `[Observed]` — PAC2-6540/feature-location.md (qua feature-map)

**Defect đã biết**
- PAC2-6540 · Pass (TC-001) · chạy `Reference Report` với `Deleted Patients Excluded`, dựa evidence post-fix do tester cung cấp (Jira `Verify passed`). `[Observed]` — PAC2-6540/report.md
- PAC2-6540 · Inconclusive (TC-002) · rerun trên dataset mutable (kết quả 0, dataset thay đổi). `[Observed]` — PAC2-6540/report.md

**Open questions**
- Xem `comms-hub.md#campaign-manager-và-campaign-outbox` (đối chiếu deleted/inactive với Outbox). `[Open Question]` — PAC2-6540/requirements.md

## Tester notes
