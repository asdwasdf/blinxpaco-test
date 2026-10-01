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

## Tester notes
