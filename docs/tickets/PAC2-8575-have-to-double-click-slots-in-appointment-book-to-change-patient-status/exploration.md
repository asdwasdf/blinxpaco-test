# Exploration: PAC2-8575

**Input Revision:** 1
**Environment:** `dev` (feature-branch host)
**Role:** `Blinx Deployment` (Johnny Bravo 2255, org `General Practice (Demo Site)`, location `test again - old location`)
**Observed:** 2026-10-15T16:08:00Z — 16:17:00Z
**Status:** Inconclusive

## Scope

Appointment Book Day view tại feature-branch `/paco-connect/feature-branch/pac2-8575/appointment-book`. Scope quan sát: behavior click trên patient slot (single click vs double click), state transition `arrive`, sidebar `Appointment Details sidebar` mở khi click slot. KHÔNG thực hiện mutation ngoài scope read-only observation.

## Observations

### OBS-PAC2-8575-001

**Classification:** Observed
**Location/URL:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book`
**Action:** single click lên patient slot (`session-slot-button` parent) cho slot `Mrs MAJDIYYA FAWZIA DUAL` 08:00-08:10 và `Mr Floy adhoc` 15:00-15:10 (NHS 76835143, synthetic test patient — không phải PII thật)
**Observed Behavior:**
- Single click mở **sidebar `Appointment Details sidebar`** ở phải màn hình, focus vào patient slot đó.
- Sidebar header: tên patient + `NHS Number: 76835143` + `PACO Assist Ask about <patient>'s record` button.
- Body: `15/10/2026`, `10 mins`, session name `Home Visit FJ`, `Mark as:`, placeholder `Select Patient Status` (chevron-down `svg[data-icon="chevron-down"]`, không có `onClick` handler trên chain parent — purely visual indicator).
- Slot count, Reason Codes, Booking Notes đều có `Save` button (một số disabled cho past appointments).
- Slot class `appointment-booked` KHÔNG đổi sang class arrived nào sau single click. Status KHÔNG mutate.
- Reception report (ticket description) nói rằng single click no-op, phải double click. **Single click trên branch host này KHÔNG no-op — có observable effect (mở sidebar)**. Fix có vẻ đã apply.
**Requirement Links:** REQ-PAC2-8575-001, REQ-PAC2-8575-002
**Evidence:** `test-results/PAC2-8575/explore/20261015T160530Z/appointment-details-sidebar.yml` (snapshot 16:08:22Z); `test-results/PAC2-8575/explore/20261015T160530Z/day-view-baseline.yml` (snapshot 16:05:25Z)
**Sensitive Data Review:** Redacted; test patient `Floy adhoc` NHS 76835143 là synthetic (cùng data đã dùng trong PAC2-8999 manual test 2026-10-15).

### OBS-PAC2-8575-002

**Classification:** Observed
**Location/URL:** same
**Action:** native double click (`page.locator(...).dblclick()` Playwright API) lên slot parent `Mr Floy adhoc`
**Observed Behavior:**
- Sidebar `Appointment Details sidebar` vẫn mở cho cùng patient, cùng data.
- Slot class KHÔNG đổi (vẫn `appointment-booked`).
- Summary `Booked 6` KHÔNG đổi.
- Không có modal/popover/toast mới ngoài sidebar.
- **Double click KHÔNG phải cơ chế arrive/change status trên branch host này** (trái với reception report trên mainline).
**Requirement Links:** REQ-PAC2-8575-001 (negative: double click no longer needed)
**Evidence:** same as OBS-PAC2-8575-001 + console không có error mới liên quan slot.
**Sensitive Data Review:** None.

### OBS-PAC2-8575-003

**Classification:** Observed
**Location/URL:** same
**Action:** enumerate all `.appointment-slot` elements, filter `appointment-booked`
**Observed Behavior:**
- 6/6 booked slots đều có class parent `isBeforeNow` → tất cả appointments ở **quá khứ** so với current time 16:13Z 2026-10-15.
- Time range quan sát: `08:00-08:10`, `08:10-08:20`, `09:00-09:10`, `15:00-15:10`, `15:50-16:00` (2 × `09:00-09:10` do duplicate session `Mr Michael Ramella`).
- Patients: `Mrs MAJDIYYA FAWZIA DUAL` (2 slots), `Mr Michael Ramella` (2 slots), `Mr Floy adhoc`, `Mr Sean Huynh`.
- Sau page refresh, Booked = 0 (data volatile hoặc session cache).
**Requirement Links:** REQ-PAC2-8575-002 (limitation: cannot test future arrive transition directly)
**Evidence:** inline observation, snapshot `appointment-details-sidebar.yml`.
**Sensitive Data Review:** None (patient names are synthetic, NHS 76835143 known synthetic per PAC2-8999).

### OBS-PAC2-8575-004

**Classification:** Observed
**Location/URL:** same
**Action:** inspect React `__reactProps` chain on slot parent
**Observed Behavior:**
- Slot DIV `.appointment-slot` KHÔNG có `onClick` handler trực tiếp.
- Parent `.session-slot-button` có `onClick` minified: `()=>{if(!E){De();return}if(p){In(u);return}c.appointment?r(c.appointment,c):l==null||l(c,u)}`. Logic check state `E`, `p`, `c.appointment` rồi route đến `De` / `In` / `r` / `l`.
- `Select Patient Status` chevron-down inside sidebar: SPAN `.p-2` không có onClick; parent chain 6 levels cũng không có onClick. Có thể arrive trigger không qua chevron mà qua cách khác (keyboard, context menu, drag).
- `Mr Floy adhoc` slot bên trong có button `d-flex` với SVG `data-icon="circle-info"` — có thể là info/menu trigger, không phải arrive.
**Requirement Links:** REQ-PAC2-8575-002 (uncertainty về cơ chế arrive chính xác trên branch)
**Evidence:** inline JS evaluate.
**Sensitive Data Review:** None.

## Mismatches and Possible Defects

- **Mismatch với reception report**: Reception nói `single click no-op → cần double click để arrive`. Trên branch này, single click KHÔNG no-op (mở sidebar). Đây có thể là fix, hoặc chỉ là wrapper mở sidebar mà arrive trigger vẫn ở chỗ khác (chevron không clickable → possible UX gap, không rõ).
- **Status transition arrival chưa rõ**: chevron-down `Select Patient Status` không có onClick — cần khám phá thêm: right-click context menu, keyboard shortcut, drag, double click sau sidebar mở, hoặc nút arrive ẩn.

## Actions Not Taken

- **Mutation:** Không thực hiện arrive transition thực sự (chưa rõ trigger). Không click `Save` cho slot count / reason codes / booking notes.
- **Sidebar interaction deep:** Không click các button trong sidebar detail (Risk Codes, Booking Notes Save, PACO Assist) vì có thể trigger side effect / mutation.
- **Future booked slot:** Không tạo data mới. 6/6 booked slots là past; không thể test arrive transition thực tế trong session này. Có thể cần test data QA-AUTO ở phase MANUAL_EXECUTE.
- **Different date / view:** Đã thử Next day nhưng 0 sessions. Quay lại today thì data thay đổi (Booked 0).

## Suggested Coverage

- **TEST_DESIGN cần cover:**
  - TC-001: Single click lên slot future (cần QA-AUTO test data với appointment future) → verify mở sidebar + có observable effect arrive trigger.
  - TC-002: Double click cùng slot → verify status KHÔNG mutate (regression guard: ensure double click vẫn benign).
  - TC-003: Arrive transition end-to-end (need `QA-AUTO` test patient, book slot, single click, chọn status, save → verify status = Arrived).
  - TC-004: Status transition khác ngoài Arrive (`In consultation`, `No show`, `Cancelled`) — Open Question REQ-002 scope.
  - TC-005: Right-click context menu slot — kiểm tra có arrive action không.
- **Risk:** Branch host có data volatile (Booked 6 → 0 sau refresh) — automation phải handle data setup robust hoặc dùng fixture test patient.

## Blockers and Open Questions

- **OQ-1 (existing REQ-002 OQ-001):** Single click trigger `direct arrive` hay `mở popover/sidebar`? **Observation hiện tại: single click mở sidebar.** Cần verify trong sidebar có arrive action không.
- **OQ-2 (existing REQ-002 OQ-002):** Bug có ảnh hưởng status transition khác ngoài `Arrive` không? Chưa observe được do thiếu future booked slot.
- **OQ-3 (existing REQ-001 OQ-003):** Trên production/dev chung behavior có còn double click không? Chưa test cross-host.
- **OQ-4 (new):** `Select Patient Status` chevron-down inside sidebar không clickable — đây có phải UX gap? Hoặc arrive trigger qua cách khác (right-click, keyboard)?
- **OQ-5 (new):** Data volatile — sau refresh Booked = 0. Ảnh hưởng automation setup.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
