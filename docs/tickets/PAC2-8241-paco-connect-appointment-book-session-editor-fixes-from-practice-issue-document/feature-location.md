# Feature Location: PAC2-8241

**Input Revision:** 1
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com` (DEV main, không phải path `feature-branch`)
**Role:** `Super Admin GB`
**Observed:** 2026-10-02T02:29Z–02:34Z
**Status:** Confirmed (slot editor + Configuration editor); Candidate-missing (Appointment Book session drawer có `Time Range`)
**Budget:** 7/12 views; ~6/15 minutes

## Search clues

- Ticket/video terms: `Appointment Book`, `Day`, `Edit Session`, `Time Range`, `Hours (To)`, `Select All`, `Actions`, `Bookable`, `Session ends at`, `Configuration`
- FB video (`video/timeline-1s.md`): icon bút chì cạnh session name → drawer `Edit Session` có `Time Range` (01:24–01:36); slot menu → `Edit Session` modal `?preview=true` (02:00–02:05)

## Confirmed entry path

### A. Slot editor modal (REQ-002, REQ-006)

1. Dashboard `/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`
   - Resulting state: `/paco-connect/appointment-book`, title `PACO Connect`. HTTP document status **404** nhưng SPA render đầy đủ sau vài giây (Day view `2 October 2026`, `Sessions`, `Booked`, `Available`, `Quick Book`)
   - Context: Appointment book selector `Appt. Book 111 PC24`
2. Right-click một slot (`button "slots span"`) trong cột session
   - Resulting state: context menu: `Set Status` group (disabled cho slot trống), `Slot manage`: `Edit Slot`, `Add a note`, `View Audit Log`, `Edit Session`, `Block Session`, `Remove Session`, `Message Session Patients`
3. Click `Edit Session`
   - Resulting state: URL `?preview=true`, dialog `Select All (N available)` + `Actions` + `Preview` + `Tips` + `Close`; footer `Session ends at: <HH:MM>` + `Save`. Slot list tải sau ~5–8s
   - Đã đóng bằng `Close`, không save

### B. Configuration session editor (REQ-001 lock fields)

1. Navigate `/paco-connect/configuration` (sidebar `Appointment Book` → `Appointment Settings`) — HTTP 404 document, SPA render; `Loading sessions` ~30–40s
2. Grid cột `Session Name`, `Assigned Slot types`, …, `Actions`; row `Actions` button → menu `Edit`, `View Audit`, `Archive`, `Clone`
3. `Edit` → drawer heading `Edit Session`: `Session Name`, `Session Type` (`Timed Appts`/`Untimed Appts`), `Slot Duration (min)`, `Frequency`, `Apply Multi-Org Split`, `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, Location/Care Professional, `Skills Requirements`, `Cancel`, `submit-changes`
   - Đã `Cancel`, không save

## Context requirements

- Appointment book context (`Appt. Book` selector) quyết định session hiển thị; session test cho ticket phải nằm trong book đang chọn.
- Ngày Day view cần chọn ngày có session test.

## Candidate and rejected paths

- **Missing on DEV:** Icon bút chì cạnh session name (FB) → drawer `Edit Session` có `Time Range`/`Hours (From)`/`Hours (To)`. Trên DEV vị trí đó chỉ có `Add a note to this session` → dialog `Session Note`. Right-click session header không mở menu. Evidence `test-results/PAC2-8241/locate/r1/03-session-header.png`. (Observed — khác biệt UI DEV vs FB; Inferred: code FB chưa deploy lên DEV)
- Configuration `Edit Session` (template) không hiển thị `Time Range` trong snapshot đã đọc (có thể nằm trong section khác/scroll — chưa xác minh). Candidate cho REQ-003/005 cần verify ở `EXPLORE`.
- Rejected: `Add a note to this session` (mở `Session Note`, không phải editor), rev 1.

## Observed landmarks

- `heading "Configuration"`, `textbox "Search Session..."`, grid `columnheader "Session Name"`, `status "Loading sessions"`
- Slot modal: `dialog "Select All (... available) Actions Preview Tips"`, `button "Close"`, `button "Save"`, text `Session ends at:`
- FB modal header có `EDIT SESSION <session name>`; DEV header hiển thị `Preview` (Observed difference)
- Configuration drawer: `heading "Edit Session" level=2`, `spinbutton "Slot Duration (min)"`, `button "Frequency"`, `button "Cancel"`, `button "submit-changes"`

## Evidence

- `test-results/PAC2-8241/locate/r1/03-session-header.png` — DEV session header (no PII), 2026-10-02
- Accessibility snapshots `.playwright-mcp/page-2026-10-02T02-*.yml` (raw, có tên patient — không copy vào docs)
- Full-page screenshot slot modal timeout (tool), không có

## Automation hints

- Chờ `status "Loading"`/`Loading sessions` biến mất thay vì dựa vào HTTP status (document luôn 404).
- Slot context menu mở bằng right-click trên `button "slots span"`.

## Correction (MANUAL_EXECUTE 2026-10-02)

- Drawer `Edit Session` có `Time Range` **tồn tại trên DEV**: icon bút chì (button không accessible name, trước `Add a note to this session`) trên header session QA-AUTO tự tạo. Session có sẵn đã xem không có icon (Inferred: do có booking/không editable).
- `Configuration` Add/Edit drawer: `Time Range` nằm dưới section collapsed `Frequency` (`Hours (From)`, `Hours (To)`, `Start Date`, `End Date`, `Days`, `Reoccurrence`).
- Status path cho REQ-003/005 sửa thành Confirmed.

## Blockers and next action

- Blocker: Không có cho LOCATE. Warning: entry drawer `Time Range` từ Appointment Book không tồn tại trên DEV.
- Data: cần session test `QA-AUTO` không booking (REQ-003/005/006) và có booking (REQ-001); session `8241 PF Test 01/10/2026` là dữ liệu có sẵn → không sửa.
- Next action: `EXPLORE` (observe read-only) để xác nhận vị trí `Time Range` trên DEV, hoặc `TEST_DESIGN`.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
