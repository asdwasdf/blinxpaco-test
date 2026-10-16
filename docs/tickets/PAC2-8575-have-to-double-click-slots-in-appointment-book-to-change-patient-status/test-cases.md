# Test Cases: PAC2-8575

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-15T16:25:00.000Z

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-8575-001 (single click → arrive, no double click needed) | TC-001, TC-002, TC-003, TC-004 | Sidebar trigger + status transition + benign double click | Future booked slot needed for full arrive transition (TC-003) |
| REQ-PAC2-8575-002 (single click = direct arrive or opens popover/sidebar with arrive action) | TC-001, TC-002, TC-003, TC-005, TC-006 | Sidebar open + status transition + right-click + scope beyond Arrive | OQ-035 (chevron-down không clickable) chưa rõ arrive trigger; OQ-036 (status transition khác ngoài Arrive) |

## Cases

### PAC2-8575-TC-001 — Single click mở Appointment Details sidebar

**Type:** Smoke
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-8575-001, REQ-PAC2-8575-002
**Expected-result basis:** UX inference + exploration observation OBS-PAC2-8575-001
**UI-dependent:** Yes
**Feature Location:** Confirmed — `docs/tickets/PAC2-8575-have-to-double-click-slots-in-appointment-book-to-change-patient-status/feature-location.md` (route `/paco-connect/feature-branch/pac2-8575/appointment-book`)
**Entry Path:** authenticated session as `Blinx Deployment` (Johnny Bravo 2255) at `General Practice (Demo Site)` / `test again - old location` → navigate trực tiếp tới `/paco-connect/feature-branch/pac2-8575/appointment-book`
**Context:** global
**Environment:** dev (feature-branch host `blinx.dev.blinxpaco-np.com`)
**Role:** `Blinx Deployment` (recommend re-verify with `Reception` role cho end-to-end)
**Preconditions:**
- Logged in as `Blinx Deployment` (Johnny Bravo) ở org `General Practice (Demo Site)`, location `test again - old location`
- Day view render xong (`Sessions`, `Booked`, `Available` summary visible)
- Có ít nhất 1 patient slot booked trên Day view
**Test Data Category:** existing test data (synthetic patient như `Mr Floy adhoc` NHS 76835143 đã observe ở OBS-PAC2-8575-001)
**Test Data:** không tạo mới; dùng patient có sẵn trên Day view
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate tới `/paco-connect/feature-branch/pac2-8575/appointment-book` | Page render, Day view với `Sessions` / `Booked` / `Available` summary; `15 October 2026` |
| 2 | Identify 1 patient slot `.appointment-slot.appointment-booked` (vd `Mr Floy adhoc` 15:00-15:10) | Slot visible với patient name |
| 3 | Single click lên slot parent `.session-slot-button` | Sidebar `Appointment Details sidebar` mở ở phải màn hình với thông tin patient (NHS Number, ngày, time, session name, `Mark as: Select Patient Status`, slot count, reason codes, booking notes) |
| 4 | Verify slot class `.appointment-slot` | Class KHÔNG đổi (vẫn `appointment-booked`); single click KHÔNG mutate status (chỉ mở sidebar) |

**Postconditions:** Sidebar mở cho patient slot đó; không có mutation nào
**Cleanup:** close sidebar (`Escape` hoặc click `Close` button); không có data mới
**Automation:** Yes
**Evidence:** `test-results/PAC2-8575/explore/20261015T160530Z/appointment-details-sidebar.yml`
**Execution History:** N/A (design only)

### PAC2-8575-TC-002 — Double click KHÔNG mutate status (regression guard)

**Type:** Regression
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-8575-001 (negative: double click should not be required)
**Expected-result basis:** UX inference + exploration observation OBS-PAC2-8575-002
**UI-dependent:** Yes
**Feature Location:** Confirmed (same as TC-001)
**Entry Path:** same as TC-001
**Context:** global
**Environment:** dev (feature-branch)
**Role:** `Blinx Deployment`
**Preconditions:** same as TC-001
**Test Data Category:** existing test data
**Test Data:** existing patient slot booked
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate tới feature-branch Appointment Book | Day view render |
| 2 | Note `Booked` count summary (vd `Booked 6`) | Summary visible |
| 3 | Native double click lên slot parent `.session-slot-button` (Playwright `dblclick()`) | Sidebar mở cùng patient; slot class vẫn `appointment-booked` |
| 4 | Verify `Booked` count summary | KHÔNG đổi (vd vẫn `Booked 6`) |
| 5 | Verify không có modal/popover/toast ngoài sidebar | Sidebar là side effect duy nhất |

**Postconditions:** Status không mutate; sidebar mở
**Cleanup:** close sidebar
**Automation:** Yes
**Evidence:** `test-results/PAC2-8575/explore/20261015T160530Z/appointment-details-sidebar.yml`
**Execution History:** N/A

### PAC2-8575-TC-003 — Arrive transition end-to-end (single click → arrive status)

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8575-001, REQ-PAC2-8575-002
**Expected-result basis:** UX inference (REQ-002 Inferred) — single click mở sidebar có arrive action hoặc direct arrive
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** same as TC-001
**Context:** global + patient (cần QA-AUTO test patient với appointment future)
**Environment:** dev (feature-branch)
**Role:** `Blinx Deployment` (recommend re-verify with `Reception` role end-to-end)
**Preconditions:**
- Cần QA-AUTO test patient (synthetic, NHS number mới) với appointment trong tương lai (status `Booked`)
- QA-AUTO patient được tạo trong setup phase bằng Reception/Admin role; có appointment future trong 1 session trên Day view
- Test patient nằm trong org `General Practice (Demo Site)`, location `test again - old location`
**Test Data Category:** QA-AUTO (synthetic; cleanup sau test)
**Test Data:**
- Patient: `QA-AUTO Arrive Test` (synthetic, NHS number random 9 digits)
- Session: existing session có slot trống; book slot với `QA-AUTO Arrive Test` cho giờ future (vd +1h từ now)
- Status trước test: `Booked`
**Mutation Class:** Temporary (create appointment + arrive + cleanup; reversible)
**Approval Required:** Yes (mutation approved blanket cho PAC2-8575, test data `QA-AUTO` prefix; ghi ledger)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Setup: tạo QA-AUTO patient + book appointment future (xem Preconditions); document appointment ID | Appointment ID ghi vào execution log |
| 2 | Navigate tới feature-branch Appointment Book, Day view | Day view render; QA-AUTO patient slot visible với status `Booked` |
| 3 | Single click lên QA-AUTO patient slot | Sidebar `Appointment Details sidebar` mở; slot class vẫn `Booked` (chưa mutate) |
| 4 | Trong sidebar: tìm action arrive — quan sát `Mark as: Select Patient Status` chevron-down; nếu clickable → click; nếu không → khám phá (right-click slot, keyboard shortcut, drag, hoặc tìm button arrive ẩn) | Action arrive trigger; nếu cần additional step → note cho OQ-035 |
| 5 | Confirm arrive transition (modal Save / inline / toast) | Status patient thay đổi từ `Booked` → `Arrived`; slot class đổi (vd `appointment-arrived` hoặc class tương đương); summary `Booked` giảm 1, có thể có summary `Arrived` mới (nếu có) |
| 6 | Verify UI phản ánh ngay (không cần reload) | Slot visible với status mới không cần F5 |
| 7 | Cleanup: cancel arrived appointment (nếu cần); giữ QA-AUTO patient để chạy lại nếu test Pass | Mutation ledger ghi action, đối tượng, kết quả; verification appointment ID đã cleanup |

**Postconditions:** QA-AUTO patient slot ở status `Arrived` (hoặc revert nếu cleanup); không còn mutation pending
**Cleanup:** Cancel arrived appointment + remove QA-AUTO patient nếu có thể; ghi residuals; nếu patient/appointment không xóa được → document và báo leftovers
**Automation:** Yes
**Evidence:** TBD khi MANUAL_EXECUTE chạy; cần capture network log + slot class before/after
**Execution History:** N/A

**Note:** TC-003 là critical test, nhưng phase EXPLORE không có future booked QA-AUTO data → TC-003 cần chạy sau khi setup data trong MANUAL_EXECUTE. Có thể chia thành TC-003a (setup data) + TC-003b (arrive transition) nếu cần.

### PAC2-8575-TC-004 — Arrive transition không cần double click (regression)

**Type:** Regression
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8575-001 (reception report fix)
**Expected-result basis:** UX inference (REQ-001 Confirmed từ reception report)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** same as TC-001
**Context:** same as TC-003
**Environment:** dev (feature-branch)
**Role:** `Blinx Deployment`
**Preconditions:** QA-AUTO patient với appointment future, status `Booked` (same as TC-003 setup)
**Test Data Category:** QA-AUTO
**Test Data:** same as TC-003 (hoặc tạo appointment mới trong cùng session)
**Mutation Class:** Temporary
**Approval Required:** Yes (blanket)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Setup: tạo QA-AUTO appointment future mới (nếu TC-003 đã mutate) | Status `Booked` |
| 2 | Note `Booked` count summary trước test | Count ghi vào log |
| 3 | Single click lên QA-AUTO patient slot | Sidebar mở; status `Booked` chưa đổi (chỉ mở sidebar) |
| 4 | Trigger arrive action (per TC-003 step 4) | Status chuyển `Arrived` |
| 5 | Verify double click KHÔNG cần thiết (single click + arrive action là đủ) | Status `Arrived` chỉ sau TC step 3-4, KHÔNG cần double click trước/sau |

**Postconditions:** Status `Arrived`; double click đã verify benign ở TC-002
**Cleanup:** same as TC-003
**Automation:** Yes
**Evidence:** TBD
**Execution History:** N/A

### PAC2-8575-TC-005 — Right-click context menu trên patient slot

**Type:** Exploratory
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-8575-002 (OQ-035 — explore arrive trigger alternatives)
**Expected-result basis:** UX pattern (right-click menu có thể có arrive action)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** same as TC-001
**Context:** same as TC-003
**Environment:** dev (feature-branch)
**Role:** `Blinx Deployment`
**Preconditions:** QA-AUTO patient slot booked, status `Booked` (same as TC-003 setup)
**Test Data Category:** QA-AUTO
**Test Data:** existing QA-AUTO appointment
**Mutation Class:** None (read-only context menu exploration)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Right-click lên QA-AUTO patient slot | Context menu mở (hoặc không — note) |
| 2 | Nếu context menu mở: list items tìm `Arrive` / `Mark as arrived` / `Change status` | Nếu có → action arrive khả thi qua context menu; ghi items |
| 3 | Nếu context menu không mở hoặc không có arrive item | Document cho OQ-035 |

**Postconditions:** Không có mutation; context menu đóng
**Cleanup:** close context menu (Escape hoặc click ngoài)
**Automation:** Later (sau MANUAL_EXECUTE biết shape)
**Evidence:** TBD
**Execution History:** N/A

### PAC2-8575-TC-006 — Status transition khác ngoài Arrive (In consultation, No show, Cancelled)

**Type:** Exploratory
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-8575-002 (OQ-036 — scope của bug)
**Expected-result basis:** UX pattern (status transition đa dạng)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** same as TC-001
**Context:** same as TC-003
**Environment:** dev (feature-branch)
**Role:** `Blinx Deployment`
**Preconditions:** QA-AUTO patient slot booked, status `Booked`
**Test Data Category:** QA-AUTO
**Test Data:** existing QA-AUTO appointment(s)
**Mutation Class:** Temporary
**Approval Required:** Yes (blanket)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Setup: tạo nhiều QA-AUTO appointment future (một cho mỗi status transition test) | N slots với status `Booked` |
| 2 | Single click slot 1 → mở sidebar → tìm status transition `In consultation` | Nếu có → trigger; nếu không → note OQ-036 |
| 3 | Verify single click đủ (không cần double click); status chuyển `In consultation` | Pass nếu status chuyển sau 1 click + action |
| 4 | Lặp lại với `No show` (slot 2), `Cancelled` (slot 3) | Document cho từng transition |
| 5 | Verify OQ-036: bug chỉ ở Arrive hay mọi status transition | Nếu mọi transition đều single click → scope chỉ là Arrive (reception report); nếu một transition nào đó cần double click → scope rộng hơn |

**Postconditions:** Multiple QA-AUTO appointment ở các status khác nhau
**Cleanup:** cancel/cleanup tất cả QA-AUTO appointments; remove QA-AUTO patients; ghi residuals
**Automation:** Later
**Evidence:** TBD
**Execution History:** N/A

### PAC2-8575-TC-007 — Cross-host behavior: production/mainline vs feature-branch

**Type:** Exploratory
**Risk:** Medium
**Priority:** P3
**Requirements:** REQ-PAC2-8575-001 (OQ-037 — fix promote?)
**Expected-result basis:** Ticket note (reception report trên mainline? chưa rõ)
**UI-dependent:** Yes
**Feature Location:** NOT applicable cho branch host; cần verify mainline route
**Entry Path:** navigate tới `/paco-connect/appointment-book` (default Connect route, không có prefix `feature-branch/`)
**Context:** global
**Environment:** dev (mainline/dev chung) — KHÔNG phải feature-branch
**Role:** `Blinx Deployment`
**Preconditions:**
- Tester cần cấu hình mainline dev host trong `paco.config.yaml allowedHosts` (hiện tại đã có `blinx.dev.blinxpaco-np.com`).
- Có patient slot booked trên mainline dev Day view (có thể cùng test data)
**Test Data Category:** existing (mainline dev)
**Test Data:** không tạo mới
**Mutation Class:** None
**Approval Required:** No (read-only observation)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate tới `/paco-connect/appointment-book` (mainline, không phải branch) | Day view render |
| 2 | Single click lên patient slot | Quan sát behavior: mở sidebar (giống branch) hoặc no-op (giống reception report mainline?) |
| 3 | Double click lên patient slot | Quan sát: no-op (branch pattern) hoặc arrive (mainline reception report) |
| 4 | So sánh behavior branch vs mainline | Document cho OQ-037: fix đã promote chưa? |

**Postconditions:** Không có mutation
**Cleanup:** N/A
**Automation:** No (cross-host comparison; manual)
**Evidence:** TBD
**Execution History:** N/A

**Note:** TC-007 chỉ chạy được nếu mainline dev có cùng data; nếu data khác, có thể thay bằng compare screenshots giữa 2 hosts. Có thể bỏ qua nếu scope ticket chỉ giới hạn branch.

## Open Questions and Blockers

- **OQ-035** (inherited from exploration): Arrive trigger cụ thể nằm ở đâu trong sidebar (chevron-down không clickable)? TC-005 right-click + TC-003 step 4 sẽ explore.
- **OQ-036** (inherited): Scope status transition ngoài Arrive. TC-006 cover.
- **OQ-037** (inherited): Cross-host behavior. TC-007 cover.
- **OQ-038** (inherited): Data volatile (Booked 6 → 0 sau refresh). Ảnh hưởng TC-001/TC-002 setup — automation cần retry hoặc setup QA-AUTO data robust.
- **Blocker 1:** TC-003, TC-004, TC-005, TC-006 cần QA-AUTO test data với appointment future. Tester cần cung cấp patient name pattern + session template; hoặc automation setup tự tạo.
- **Blocker 2:** Reception role chưa được test ở ticket này (chỉ test `Blinx Deployment`). Có thể behavior khác giữa 2 role — recommend re-verify với Reception ở TC-003/TC-004 trước khi automation.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
