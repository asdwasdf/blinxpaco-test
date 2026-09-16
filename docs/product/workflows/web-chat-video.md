# Workflow: Web Chat & Video

- Classification: `[Observed: dev, GP - paco assist and Super Admin GB, 2026-09-14 to 2026-09-16]`
- Aliases: `Web Chat & Video`, `Virtual Appointments`, `Media Library`, `Outstanding Reviews`, `Consultations for Review`
- Coverage: `Partial`
- Confidence: `High` cho route và role-dependent render state; `Low` cho expected permission/dependency behavior

## Business context observed

- Visible purpose: quản lý virtual appointments, patient media và consultations cần review.
- Actor/role: `GP - paco assist`; `Super Admin GB`.
- Required context: authenticated Paco session, organisation context, và quyền/dependency của Web Chat module.
- Starting data state: ba child route được mở trực tiếp từ known sidebar map.
- Entities and statuses: appointment, patient media, consultation review; các status chi tiết chỉ từng render với role `GP - paco assist`.

## Entry

1. Dashboard → `Web Chat & Video`.
2. Chọn `Virtual Appointments`, `Media Library`, hoặc `Outstanding Reviews`.
3. Stable routes: `/web-chat/appointments/`, `/web-chat/media-library/`, `/web-chat/review/`.

## Read-only flow

1. **Action:** mở `Virtual Appointments`.
   - **Transition:** route `/web-chat/appointments/`, title `Web Chat & Video`.
   - **Observed result:** `[Observed: GP - paco assist, 2026-09-14]` feature body từng render filter `Appt. Type`, `Date Range` và appointments table. `[Observed: Super Admin GB, 2026-09-16]` sau bounded wait 8 giây chỉ Paco shell/header render; console có HTTP `500`/`401`, `Error fetching current authenticated user`, và page exception.
   - **Evidence:** `test-results/product-survey/batch31/02-virtual-appointments.png`.
2. **Action:** mở `Media Library`.
   - **Transition:** route `/web-chat/media-library/`, title `Web Chat & Video`.
   - **Observed result:** `[Observed: GP - paco assist, 2026-09-14]` feature body từng render `PATIENT`, patient search, `MEDIA TYPE`, và `No Patient Selected`; surname search không trả result hoặc empty/error state. `[Observed: Super Admin GB, 2026-09-16]` chỉ Paco shell/header render; không có visible feature-body search. Console có `PACOMMS` permission-setting và React shared-module version warnings.
   - **Evidence:** `test-results/product-survey/batch31/01-media-library.png`.
3. **Action:** mở `Outstanding Reviews`.
   - **Transition:** route `/web-chat/review/`, title `Web Chat & Video`.
   - **Observed result:** `[Observed: GP - paco assist, 2026-09-14]` feature body từng render breadcrumb `Consultations`, heading `CONSULTATIONS FOR REVIEW` và review table. `[Observed: Super Admin GB, 2026-09-16]` chỉ Paco shell/header render; console có HTTP `403`/`401` và `Error fetching user organisation locations`.
   - **Evidence:** `test-results/product-survey/batch31/03-outstanding-reviews.png`.

## Decision points

- **Visible condition:** feature body render sau Paco shell.
  - **Branch/state A:** role `GP - paco assist` từng thấy full module content.
  - **Branch/state B:** role `Super Admin GB` chỉ thấy shell/header trên cả ba route trong batch 31.
- **Visible condition:** `Media Library` patient được chọn.
  - **Branch/state A:** no patient selected, hiện `No Patient Selected` khi feature body render.
  - **Branch/state B:** `[Open Question]` populated patient media và search trigger đúng; batch 31 không thể re-check vì feature body không render.

## End and exceptional states

- End state observed: route giữ đúng destination nhưng feature body không mount/render cho `Super Admin GB`.
- Empty/loading/error states: shell-only, không có visible loading/error copy; console events khác nhau theo route.
- Cross-feature handoff: patient selection trong `Media Library`; appointment/review actions có thể chuyển sang patient/consultation context nhưng chưa mở.

## Safety boundary

- Last safe read-only state: route landing, visible filter/table, hoặc patient search không chọn result.
- Approval stop: appointment action, review/submit, send, upload, create, edit, hoặc external-system action.
- Actions not performed: không chọn appointment/review action; không send/upload/create/edit.
- Mutation: `None`

## Execution guidance

- Setup/data: environment `dev`, authenticated role và organisation; xác nhận feature body đã render trước khi dùng page controls.
- Safe manual steps: mở ba child route, chờ observable feature landmark, ghi visible state và console/page errors.
- Stop and request approval before: mọi action gửi, review, upload, create, edit hoặc thay đổi appointment.
- Evidence to capture: route, role/org, feature landmark hay shell-only state, visible error/loading copy, console/page error summary; redact patient data trước khi share.

## Automation guidance

- Stable roles/labels/landmarks: routes trên; `Appt. Type`, `PATIENT`, `MEDIA TYPE`, `CONSULTATIONS FOR REVIEW` khi module render.
- Observable waits: chờ feature landmark hoặc explicit error; Paco shell/header không đủ để coi route load thành công. Bounded timeout chỉ dùng phân loại shell-only, không làm expected-result assertion.
- Data dependencies: role entitlement, current authenticated user, organisation locations, `PACOMMS`, và remote/shared module compatibility.
- Assertions lacking trusted expected basis: role nào phải truy cập từng child; warning nào là causal; patient-search behavior; expected appointment/review dataset.

## Provenance and gaps

- Environment: `dev` (`https://blinx.dev.blinxpaco-np.com`).
- Role: `GP - paco assist`; `Super Admin GB`.
- Observed at: `2026-09-14` và `2026-09-16`.
- Raw evidence: `test-results/product-survey/batch11/` nếu còn local; `test-results/product-survey/batch31/`. Review/redact trước khi share.
- Open questions: `Super Admin GB` thiếu entitlement, user/org context hay remote-module dependency; trusted expected access matrix; `Media Library` patient search trigger và populated state.
- Exact resume state: không retry cùng session/dependency. Cần product/API owner cung cấp expected access, entitlement/dependency prerequisite, hoặc session đã sửa; sau đó verify một route trước rồi mới mở rộng cả ba.

## Tester notes
