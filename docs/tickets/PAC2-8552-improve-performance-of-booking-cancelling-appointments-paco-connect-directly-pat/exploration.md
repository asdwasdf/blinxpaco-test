# Exploration: PAC2-8552

**Input Revision:** 1
**Observed:** 2026-09-25
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Scope:** read-only

## Starting State

Valid location: sidebar `Appointment Book` → menu `Appointment Book` → `/paco-connect/appointment-book`. Appointment-book context was already selected by the application. No fixture was selected or changed by this run.

## Observations

1. `[Observed: dev, Super Admin GB, 2026-09-25]` Route document reported HTTP `404`, while the `PACO Connect` appointment-book UI rendered and completed its loading state.
2. `[Observed: dev, Super Admin GB, 2026-09-25]` Day view exposed date navigation, `Sessions`, `Booked`, `Available`, `LIVE`, `Quick Book`, `Filters`, appointment-book selector, patient/time search, `Group Send` and `Export`.
3. `[Observed: dev, Super Admin GB, 2026-09-25]` After loading, five expanded session regions were visible for the selected day. Each exposed booked/available counters and time-slot structure. Live names, locations and counts are not expected values and are omitted from shareable evidence.
4. `[Observed: dev, Super Admin GB, 2026-09-25]` No visible `Cancel` control appeared at the current page level. Cancellation likely requires selecting an appointment or another context; that boundary was not crossed.
5. `[Observed: dev, Super Admin GB, 2026-09-25]` Related `/configuration/#appointments` route rendered an appointment grid plus `Show Cancelled Bookings`; `Fetch Latest Appointments` and `Fetch All Slot Details` were visible but not used.
6. `[Observed: dev feature branch, Super Admin GB, 2026-09-25]` Connect URL `/paco-connect/feature-branch/pac2-8552/appointment-book` load thành công nhưng appointment-book/date hiện tại có `Sessions 0`, `Booked 0`, `Available 0`, `LIVE 0` và `No available sessions.`
7. `[Observed: Scheduler feature branch, public patient flow, 2026-09-25]` `/feature-branch/pac2-8552/patient-self-booking/` render DFD. Search `appointment` trả service candidates. Candidate `Clinician Appointment Doctor or Carley Moore (ANP)` thuộc `Availability Test` hiển thị `No availability`; warning modal xuất hiện. Không xác nhận warning và không book.

## Mutation Boundary

Không click `Quick Book`, slot, patient/appointment, session edit, `Group Send`, `Export`, `Fetch Latest Appointments`, `Fetch All Slot Details` hoặc bất kỳ cancel/update control nào. Mutation ledger: `None`.

## Requirement Coverage from Observation

- `REQ-PAC2-8552-001`: booking entry candidate `Quick Book` observed; booking behavior not executed.
- `REQ-PAC2-8552-002`: appointment listing and cancelled-booking filter route observed; single cancellation not executed.
- `REQ-PAC2-8552-003`/`004`: session and slot structure observed; multi-org/multi-slot data state not verified.
- `REQ-PAC2-8552-005`/`006`/`007`/`008`: backend/DB behavior cannot be proven through this read-only UI observation.

## Mismatches and Risks

- Possible routing defect: usable appointment-book UI arrives with HTTP `404`; expected HTTP status lacks trusted basis, so no Fail conclusion.
- UI-only timing cannot prove partition pruning. `EXPLAIN ANALYZE` remains required.
- Current day shows no booked appointments at the aggregate level during observation; unsuitable for cancellation coverage without approved fixture/date/book selection.
- Session names suggest test-like data, but ownership/safety was not confirmed; do not mutate based on labels alone.

## Suggested Coverage

1. Approved `Book` flow using a dedicated slot/patient, then cleanup via approved cancellation.
2. Single cancellation through both scheduler and PACO Connect paths using dedicated appointments.
3. Session cancellation with appointments spanning more than one organisation.
4. Session-window edit involving a multi-slot appointment with mixed in-range/out-of-range slots.
5. Active split-allocation count comparison.
6. DB-owner `EXPLAIN ANALYZE` before/after plus approved diagnostic query.

## Blockers

- Safe test patient, appointment book, slot/date and cleanup procedure chưa được xác nhận.
- Mutation approval chưa có cho `Book`, `Cancel` hoặc session edit.
- Tester xác nhận dev deploy cả `nhs-scheduler-be#524` và `paco-connect-be#742`.
- Feature-branch Connect context hiện không có available session; Scheduler candidate đã kiểm tra cũng `No availability`. Cần owner chỉ định service/slot/date có availability nếu muốn book.
- Không có DB access/owner trong run này.

## Tester notes

