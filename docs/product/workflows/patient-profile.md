# Workflow: Patient Profile

- Classification: `[Observed: dev, Super Admin GB, 2026-09-16]`
- Aliases: `Profile`, `Patient Profile`, clinical record
- Coverage: `Partial`
- Confidence: `High` cho route, controls và empty states đã quan sát; `Low` cho hành vi với populated data

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
- Cross-feature handoff: `Patient Search > Actions > Profile` mở full Patient Profile; `Risk Stratification` và `ICE` có thể là handoff nhưng chưa mở.

## Safety boundary

- Last safe read-only state: tab landing page hoặc toggle `Investigations > Requested`.
- Approval stop: `Create Document`, `From Template`, `New Fit Note`, `Upload`, `+ New Request`, hoặc control create/edit/save khác.
- Actions not performed: không mở mutation control; không upload, submit, create, edit hoặc save.
- Mutation: `None`

## Execution guidance

- Setup/data: environment `dev`, role `Super Admin GB`, manual auth hợp lệ; dùng patient demo không chứa PII trong docs.
- Safe manual steps: search patient, mở `Actions > Profile`, chuyển các tab, dùng toggle `Results`/`Requested`.
- Stop and request approval before: mọi control create/edit/save/upload/request.
- Evidence to capture: route đã redact patient GUID, active tab/toggle, explicit empty/error text, visible mutation boundary.

## Automation guidance

- Stable roles/labels/landmarks: `input[placeholder*="Search Patients"]`, `[col-id="actions"] button`, exact `Profile`, role `tab` với exact names, exact `Requested`.
- Observable waits: chờ AG Grid row xuất hiện sau search; sau tab/toggle click chờ route hoặc active-state/content đổi, không chỉ timeout.
- Data dependencies: patient phải xuất hiện trong search và được role hiện tại xem `Profile`; empty-state assertions chỉ hợp lệ với fixture patient đã biết.
- Assertions lacking trusted expected basis: populated tab content, ý nghĩa `ICE`, và expected behavior của bare `Payments` page.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `Super Admin GB`.
- Observed at: `2026-09-16`.
- Raw evidence: `test-results/product-survey/batch29/`; local only, review/redact trước khi share.
- Open questions: populated record behavior; `Payments` state; ý nghĩa và external boundary của `ICE`; sâu hơn của `Filters` và `Risk Stratification`.
- Exact resume state: tìm patient fixture có populated data cho một tab đã chọn; giữ read-only và dừng trước mutation. Nếu không có fixture, pivot khỏi Patient Profile sang gap khác.

## Tester notes
