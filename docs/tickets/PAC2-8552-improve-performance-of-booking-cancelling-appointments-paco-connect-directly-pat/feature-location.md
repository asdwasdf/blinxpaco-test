# Feature Location: PAC2-8552

**Input Revision:** 1
**Generated:** 2026-09-25T14:00:00+07:00
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Mode:** read-only
**Route Status:** Confirmed with warnings

## Feature Root

`PACO Connect` appointment book tại `/paco-connect/appointment-book` đã render UI dù document response báo HTTP `404`. Page có landmarks `Appointment Book`, view selectors `Day`/`Week`/`Month`/`Year`, date navigation, counters `Sessions`/`Booked`/`Available`/`LIVE`, `Quick Book`, `Filters`, appointment-book selector và loading status.

## Ordered Entry Path

1. Đăng nhập Paco dev bằng role `Super Admin GB`.
2. Từ authenticated Paco shell, chọn sidebar `Appointment Book`.
3. Chọn menu `Appointment Book`.
4. Feature root mở tại `/paco-connect/appointment-book`.

## Related Read-only Route

`Configuration` → `Appointment Books` → `Appointments` mở `/configuration/#appointments`, title `Appointments`. Route hiển thị grid cùng `Fetch Latest Appointments`, `Fetch All Slot Details`, `Show Cancelled Bookings`. Hai `Fetch` controls không được dùng vì side effect chưa rõ.

## Context and Landmarks

- Appointment-book context hiện chọn được hiển thị dạng `Appt. Book 111 PC24`; giá trị live chỉ dùng để xác minh UI, không phải test fixture đã duyệt.
- Feature root có `Quick Book`, nhưng dừng trước click vì booking là mutation.
- Không mở appointment/session detail, không cancel, không edit session, không book.
- Backend-only scope `sessionSplitStatus`, `getAppointmentsBySlotId`, partition pruning và integrity guards không thể locate trực tiếp bằng UI.

## Candidates

1. **Confirmed:** Sidebar `Appointment Book` → menu `Appointment Book` → `/paco-connect/appointment-book` cho booking/session flows.
2. **Confirmed:** `/configuration/#appointments` cho read-only appointment listing và cancelled-booking filter.
3. **Candidate:** `Quick Book` là trigger cho booking flow; chưa mở vì có thể tạo draft/mutation.

## Rejected or Limited Paths

- Survey route `/paco-connect/configuration/#appointment-books`: survey 2026-09-22 ghi shell blank; không dùng làm primary route.
- Survey route `/paco-connect/configuration/#clinics`: survey 2026-09-22 ghi HTTP `404` và persistent `Loading sessions`; không dùng làm session-edit route.
- `/configuration/#scheduler-config`: configuration cho campaigns/templates/slot types, không phải end-user booking/cancellation root.

## Budget

- Meaningful views: 3/12 — authenticated dashboard, appointments listing, appointment-book root.
- Elapsed: dưới 15 phút.
- Mutation: `None`.

## Warnings and Next Action

- `/paco-connect/appointment-book` trả HTTP `404` nhưng UI vẫn render; route usable với warning.
- Current selected appointment book có thể không chứa safe fixtures; không dùng live organisation data nếu chưa được tester phê duyệt.
- Tiếp theo: `EXPLORE` read-only để inspect loading/empty/session structure. Dừng trước `Quick Book`, appointment selection dẫn đến update/cancel, `Group Send`, `Export`, `Fetch Latest Appointments` và `Fetch All Slot Details`.
- Trước `EXECUTE`, cần test data và approval cụ thể cho `Book`, `Cancel`, session edit cùng cleanup.

## Feature-branch Validation

- **Connect URL do tester cung cấp:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8552`
- **Verified entry:** URL redirect/render dashboard, sau đó sidebar `Appointment Book` → submenu `Appointment Book` mở `/paco-connect/feature-branch/pac2-8552/appointment-book`.
- **Observed state:** page load hoàn tất, có `Quick Book` và `Filters`, nhưng current appointment-book/date hiển thị `Sessions 0`, `Booked 0`, `Available 0`, `LIVE 0`, `No available sessions.`
- **Scheduler URL do tester cung cấp:** `https://dev.blinxscheduler-np.com/feature-branch/pac2-8552/patient-self-booking/`
- **Verified entry:** page `Patient Appointment Booker General Practice (Demo Site)` render. Search `appointment` trả nhiều service candidates; một `Availability Test` candidate đã mở read-only và hiển thị `No availability` cùng warning modal. Không click `I understand`, không chọn slot, không book.

## Evidence

[Observed: dev, `Super Admin GB`, 2026-09-25] Browser accessibility snapshots xác minh authenticated role, mainline route, feature-branch Connect route và Scheduler root. Không promote screenshot vì live UI chứa organisation/appointment context; local browser evidence only.

## Supplemental confirmed locations — 2026-09-28

[Observed: dev, `Super Admin GB`, 2026-09-28; read-only]

### Session configuration

- Exact feature-branch URL: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8552/configuration/#clinics`; after navigation UI may normalize it to `/configuration/`. The required branch segment remains present.
- Left panel: expand `Appointment Books`, then choose `Sessions`.
- Main panel top-left: `Search Session...`.
- Main panel top-right: unlabeled add-menu button; opening it exposes `Add Session`.
- `Add Session` opens a right drawer containing `Session Name`, `Session Type` (`Timed Appts`/`Untimed Appts`), `Slot Duration (min)`, `Frequency`, `Apply Multi-Org Split`, `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, `Select Location & Care Professional(s)`, `Add another`, `Cancel`, and `Save`.
- Each results row has an unlabeled button in the far-right `Actions` column. Its menu exposes `Edit`, `View Audit`, `Archive`, `Clone`, `Delete`, and `Cancel Session`.
- `Edit` opens a right `Edit Session` drawer. The footer has `Cancel Session`, `Cancel`, and `Save`. The drawer header has an `eye` preview button.
- The `eye` button opens a read-only slot preview dialog showing `Select All`, available count, `Actions`, individual slot rows, and `Session ends at`. No slot was selected and no mutation was performed.
- `Cancel Session` location is confirmed in both the row action menu and `Edit Session` footer. Confirmation dialog and post-confirm behavior remain unobserved because locate mode stopped before mutation.

### Multi-slot appointment drawer

- Exact route remains `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8552/appointment-book`.
- Existing execution observation confirms: click the occupied appointment block in the session grid, not the session header or an available slot. A right appointment drawer opens with slot type heading, `MARK AS: Select Patient Status`, `Start Time`, `End Time`, `Slot Count`, and `Save`.
- `Slot Count` options use labels such as `Slot 1 (<start>–<end>)`; extending through the third contiguous slot produces a three-slot appointment. Close the option overlay by clicking outside, not `Escape`, before `Save`.

### Locate boundary

No `Save`, `Cancel Session`, `Archive`, `Delete`, slot selection, or other mutation was performed. Confirmation-dialog labels for session cancellation remain preliminary until `MANUAL_EXECUTE`.

## Tester notes

