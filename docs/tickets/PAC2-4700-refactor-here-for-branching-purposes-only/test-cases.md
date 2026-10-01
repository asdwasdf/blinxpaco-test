# Test Cases: PAC2-4700

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-23T21:31:35+07:00

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| `REQ-PAC2-4700-001` | `PAC2-4700-TC-001` | Smoke `Quick Send` Connect/OS/baseline; chỉ major visual/functional breakage | Tester: live `/paco/dashboard` = `PAC2-4683`. Pixel không Fail |
| `REQ-PAC2-4700-002` | `PAC2-4700-TC-001` | Primitives nhìn thấy trong dialog (`input`/`textarea`/`dropdown`/`multiselect`/`avatar`) | Checkbox/radio visual ngoài `Send as` không có trong mutation `None`; không Fail thiếu control |
| `REQ-PAC2-4700-003` | `PAC2-4700-TC-002` | Chọn sort option; giá trị hiển thị trên control | EXPLORE chưa chọn option — bước chọn chưa Observed |
| `REQ-PAC2-4700-004` | `PAC2-4700-TC-003` | Tick kênh `Send as` đang selected | Không toggle off→on control khác trong mutation `None`; coverage mỏng, không Fail |
| `REQ-PAC2-4700-005` | `PAC2-4700-TC-001`, `PAC2-4700-TC-003` | Hover/focus trên control enabled; tick visible | Pixel/theming không thuộc Fail |
| `REQ-PAC2-4700-006` | `PAC2-4700-TC-001`, `PAC2-4700-TC-002` | Dialog/tab/sort phản hồi; không đơ | Overlay persist = `REQ-014`, không nhét vào case này |
| `REQ-PAC2-4700-007` | `PAC2-4700-TC-004` | Placeholder `Quick Form` | Location chưa Confirmed; Preliminary + automation Blocked |
| `REQ-PAC2-4700-008` | `PAC2-4700-TC-001`, `PAC2-4700-TC-005`, `PAC2-4700-TC-006` | Connect/OS/baseline Explored; GP/Rocketbar Preliminary | App ngoài `Quick Send` chưa locate; GP `/login/`; Rocketbar không URL |
| `REQ-PAC2-4700-009` | `PAC2-4700-TC-010` | Cùng patient: default `Send as` + listed email | Inferred; fixture Connect first `test` ≠ OS/baseline; không Fail `SMS` khi `email not on file` |
| `REQ-PAC2-4700-010` | `PAC2-4700-TC-011` | Tập sort option | EXPLORE MATCH 3 host; GP grey Observed, không Confirmed Fail |
| `REQ-PAC2-4700-011` | `PAC2-4700-TC-012` | `Files`/documents cùng patient có NHS + documents | Inferred; thiếu fixture → Blocked không Fail; không Fail OS missing Patient Number |
| `REQ-PAC2-4700-012` | `PAC2-4700-TC-013` | Mapped EMIS chip cùng campaign | Inferred; `6 July - Test Case 1` không chip ≠ Fail; centered title ngoài scope |
| `REQ-PAC2-4700-013` | `PAC2-4700-TC-014` | Ghi overlay `Scheduler Link Required` | Disputed; không expected “must popup”; không re-fail PAC2-4683 / PAC2-5776 |
| `REQ-PAC2-4700-014` | `PAC2-4700-TC-015` | Overlay sort dismiss khi click `Files` / ngoài panel | Inferred; EXPLORE không persist; không expected “must persist”; không click campaign list |

## Shared entry (UI-dependent, Confirmed hosts)

1. Tab riêng per host (cùng-tab host switch làm hết session).
2. Authenticated dashboard, role `Super Admin GB`.
3. Global patient search query `test` — **không** click patient row.
4. `button` `Patient actions menu` → `menuitem` `Quick Send`.
5. Last safe state: `dialog` `Quick Send` mở. Không `Save` / `quick-send-action` / `Send` / `Schedule` / `Edit` / `Set up Patient Reply` / chọn campaign / chọn slot / add booking vào draft.

**Hosts Confirmed:** baseline `https://blinx.dev.blinxpaco-np.com/paco/dashboard`; Connect `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard`; OS `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard`.

**Không Confirmed:** GP `https://pac2-4700-qs-only.dev.blinxpaco-np.com/` (`/login/`, host ngoài `allowedHosts`); Rocketbar (không feature-branch URL); `Quick Form` (menuitem thấy, chưa mở).

Tester 2026-09-23: live `/paco/dashboard` = `PAC2-4683` đã merge. Oracle visual `TC-001`.

## Cases

### PAC2-4700-TC-001 — Mở `Quick Send` Connect/OS/baseline; chỉ major breakage

**Type:** Ticket validation / Smoke
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-4700-001`, `REQ-PAC2-4700-002`, `REQ-PAC2-4700-005`, `REQ-PAC2-4700-006`
**Expected-result basis:** `Confirmed` — QA Focus Matthew 2026-02-12 / Katie 2026-04-27 (major visual/functional breakage vs `PAC2-4683`). Không Jira AC. Không lấy expected từ OBS. Tester: live `/paco/dashboard` = `PAC2-4683`.
**UI-dependent:** Yes
**Feature Location:** Confirmed with warnings — `feature-location.md`
**Entry Path:** Shared entry
**Context:** patient result via global search
**Environment:** dev — Connect + OS + baseline stand-in
**Role:** `Super Admin GB`
**Preconditions:** Auth từng host trên tab riêng; query `test` có ít nhất một result với `Patient actions menu`
**Test Data Category:** Search query non-PII
**Test Data:** Query `test`. Không ghi patient name / NHS / phone / email
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở tab riêng, authenticated dashboard của một host Confirmed | Header `Super Admin GB`; global search sẵn |
| 2 | Gõ `test` vào search; không click patient row | Result list với `Patient actions menu` |
| 3 | Click `Patient actions menu` → `menuitem` `Quick Send` | `dialog` `Quick Send` mở. Landmarks Observed (không phải AC vs 4683): `View Patient Details`, `Close`, tabs `Campaign` / `Health Forms` / `Files` / `Booking Link` |
| 4 | Quan sát primitives nhìn thấy: `input`/`textarea`/`dropdown`/`multiselect`/`avatar`; hover/focus một control enabled. Không `Save`/`Send`/`Edit` | [Confirmed] Không major broken sizing/border/alignment; control phản hồi. Pixel-perfect không Fail. Checkbox/radio ngoài `Send as` nếu không có → không Fail `REQ-002` |
| 5 | Đổi tab `Health Forms` / `Files` / `Booking Link` / `Campaign`; không chọn item vào draft | Tab đổi được; không đơ. Không Fail email/attachments/slots trên first `test` Connect ≠ OS (OBS-005) |
| 6 | `Close`. Lặp OS rồi baseline | Dialog đóng; không persist. Visual vs `PAC2-4683`: so sánh được (tester: live dashboard = 4683). Pixel không Fail |

**Postconditions:** Không draft/server change
**Cleanup:** `Close`; not applicable
**Automation:** Later — chỉ open dialog + `Close` trên Connect/OS/baseline. Không pixel-diff. Không assert OBS. Không GP/Rocketbar
**Evidence:** `feature-location.md`; `exploration.md` OBS-001, OBS-005. Screenshot local, không share (PII)
**Execution History:** `20260923-plugin-qs` — Pass smoke; Inconclusive vs 4683. `20260923-plugin-ramella` — Pass vs 4683 (tester: live dashboard = 4683). Mutation None. `automation.md`

### PAC2-4700-TC-002 — Dropdown sort: chọn option, giá trị hiển thị

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-4700-003`, `REQ-PAC2-4700-006`
**Expected-result basis:** `Confirmed` — `ticket.md` Dropdown issues. Tập option là Observed (`REQ-010`), không AC
**UI-dependent:** Yes
**Feature Location:** Confirmed with warnings — cùng entry
**Entry Path:** Shared entry rồi `(click to change)`
**Context:** `Select Campaign` sort control
**Environment:** dev — Connect + OS (baseline tùy)
**Role:** `Super Admin GB`
**Preconditions:** `Quick Send` mở; chưa chọn campaign
**Test Data Category:** UI control only
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Từ dialog, `(click to change)`; không click campaign | Panel `Select Campaign` mở |
| 2 | Mở sort dropdown | Panel sort mở, usable |
| 3 | Click một sort option khác giá trị hiện tại (EXPLORE chưa làm bước này) | [Confirmed] Option chọn được; giá trị hiển thị trên control |
| 4 | Đóng overlay bằng click ngoài panel. Không dùng `Escape` làm expected (OS Escape đóng cả dialog — Observed, không AC) | Overlay đóng. Persist overlay = `REQ-014`, không Fail ở case này |
| 5 | Lặp Connect ↔ OS, tab riêng | Cùng hành vi chọn + hiển thị |

**Postconditions:** Sort label có thể đổi trong session; không campaign vào draft
**Cleanup:** `Close` dialog
**Automation:** Later — mở sort, chọn option, đọc label. Không assert danh sách option. Không chọn campaign/slot
**Evidence:** `exploration.md` OBS-002
**Execution History:** `20260923-plugin-qs` — Pass OS/Connect/baseline (sort label đổi sau chọn). Mutation None. `automation.md`

### PAC2-4700-TC-003 — `Send as` tick visible; không ép `Email`

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P1
**Requirements:** `REQ-PAC2-4700-004`, `REQ-PAC2-4700-005`
**Expected-result basis:** `Confirmed` — Checkbox/radio + styling regressions. Không Confirmed default `SMS` vs `Email`
**UI-dependent:** Yes
**Feature Location:** Confirmed with warnings
**Entry Path:** Shared entry
**Context:** `Send as` trên dialog
**Environment:** dev — Connect + OS
**Role:** `Super Admin GB`
**Preconditions:** `Quick Send` mở
**Test Data Category:** UI control only
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Quan sát `Send as` `SMS` / `Email` | Kênh đang selected có tick/indicator visible |
| 2 | Nếu `SMS` enabled: click lại `SMS` (đã selected). Không click `Email` nếu disabled; không switch channel | Tick vẫn visible. Không Fail default `SMS`. Switch sang `Email` = draft channel — cấm |
| 3 | Hover/focus `SMS`/`Email` (nếu enabled) và một control enabled khác | [Confirmed] Hover/focus không mất hoàn toàn. Pixel không Fail |
| 4 | Không tick checkbox/radio đưa slot/form vào draft. `Close` | Không mutation |

**Postconditions:** Channel không đổi
**Cleanup:** `Close`
**Automation:** Later — presence + selected indicator. Không pixel. Không assert `Email` enabled hay default channel
**Evidence:** `exploration.md` OBS-001
**Execution History:** `20260923-plugin-qs` — Pass (tick/indicator visible). Không Fail default SMS/Email. Mutation None. `automation.md`

### PAC2-4700-TC-004 — `Quick Form` sau version bump (Preliminary)

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-4700-007`
**Expected-result basis:** `Confirmed` — `ticket.md` Quick form bullet. Chi tiết UI chưa có
**UI-dependent:** Yes
**Feature Location:** Blocked — `menuitem` `Quick Form` thấy trong `Patient actions menu`; chưa mở feature root
**Entry Path:** Không đoán
**Context:** Unknown
**Environment:** Unknown
**Role:** `Super Admin GB`
**Preconditions:** Locate `Quick Form` Confirmed trước khi chạy
**Test Data Category:** Unknown
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No cho locate; mutation trong form hỏi lại

| Step | Action | Expected Result |
|---|---|---|
| 1 | Không mở `Quick Form` run này | Result `Not Run` / `Blocked` — chưa location |
| 2 | Sau locate Confirmed: chỉ lặp bước read-only đã ghi trong `feature-location.md` lúc đó | Không đoán `Close`/`Cancel`/field trước locate |

**Postconditions:** Không đổi
**Cleanup:** not applicable
**Automation:** Blocked — chưa Confirmed location; không đoán locator
**Evidence:** `feature-location.md` Candidate menu
**Execution History:** `20260923-plugin-qs` — Not Run. `menuitem` `Quick Form` thấy. `20260923-plugin-gp-ramella` — Pass locate/read-only: mở `Quick Form` với `Michael Ramella`, thấy dialog, `Select Quick Form`, tabs `Health Form`/`Comments`/`SNOMED Code`/`Advanced`; không chọn form, đóng bằng `Close`. Mutation None. `automation.md`

### PAC2-4700-TC-005 — Consumer GP / Supergrid (Preliminary)

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-4700-008`
**Expected-result basis:** `Confirmed` — thorough test từng consuming app (Matthew 2026-02-12). Không expected từ video GP
**UI-dependent:** Yes
**Feature Location:** Blocked — `https://pac2-4700-qs-only.dev.blinxpaco-np.com/` dừng `/login/`; host ngoài `allowedHosts`; SSO PACO không mang
**Entry Path:** Không đoán Supergrid locator
**Context:** Unknown
**Environment:** GP clue — chưa usable
**Role:** Unknown tới khi auth
**Preconditions:** Auth GP thủ công + allowlist host
**Test Data Category:** Unknown
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No (chưa vào app)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Không bypass `/login/`; không đoán locator | `Blocked` auth — không Fail product |
| 2 | Sau auth + allowlist + locate Confirmed: lặp `PAC2-4700-TC-001`..`003` trên GP, tab riêng | Cùng expected Confirmed của các case đó trên GP |

**Postconditions:** Không đổi
**Cleanup:** not applicable
**Automation:** Blocked — location không Confirmed; host ngoài allowlist
**Evidence:** `feature-location.md` Candidate 2. Login title Observed: `NHS Patient and Care Optimiser`
**Execution History:** `20260923-plugin-qs` — Blocked. `20260923-plugin-gp-ramella` — Pass read-only sau manual auth + allowlist: search `Michael Ramella` → `Patient actions menu` → `Quick Send`; dialog/tabs `Files`/`Booking Link`/`Close` hoạt động; `Select Attachment` load xong; `Refresh Availability` hiện; không popup `Scheduler Link Required`. Mutation None. `automation.md`

### PAC2-4700-TC-006 — Consumer Rocketbar (Preliminary)

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** `REQ-PAC2-4700-008`
**Expected-result basis:** `Confirmed` — bốn consumer gồm Rocketbar (Matthew 2026-02-12; Ammar 2026-09-11 không preview URL)
**UI-dependent:** Yes
**Feature Location:** Unresolved — không feature-branch URL; sidebar `Rocket Bar` không mở trong LOCATE
**Entry Path:** Không đoán
**Context:** Unknown
**Environment:** Unknown
**Role:** Unknown
**Preconditions:** Feature-branch/preview URL + locate Confirmed
**Test Data Category:** Unknown
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Không mở sidebar `Rocket Bar`; không đoán URL | `Blocked` — chưa location |
| 2 | Sau URL + locate Confirmed: lặp `PAC2-4700-TC-001`..`003` | Cùng expected Confirmed trên Rocketbar |

**Postconditions:** Không đổi
**Cleanup:** not applicable
**Automation:** Blocked — chưa locate; không đoán locator
**Evidence:** `feature-location.md` Candidate 3
**Execution History:** `20260923-plugin-qs` — Blocked. Không Rocketbar feature-branch URL. `automation.md`

### PAC2-4700-TC-010 — Cùng patient: default `Send as` và listed email

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** `REQ-PAC2-4700-009`
**Expected-result basis:** `Inferred` — Beth 2026-09-11/17 + PNG 127146. Jira AC trống. OBS-001 default `SMS` khi `email not on file` không phải Fail
**UI-dependent:** Yes
**Feature Location:** Confirmed `Quick Send` baseline/Connect/OS; GP/Rocketbar Preliminary
**Entry Path:** Shared entry trên **cùng** patient đã duyệt
**Context:** patient + `Send as` / `To:`
**Environment:** dev — Connect/OS/baseline; GP Preliminary
**Role:** `Super Admin GB`
**Preconditions:** Cùng patient NHS + email on file trên từng host. First `test` Connect ≠ OS/baseline (OBS-005) **không** dùng
**Test Data Category:** Approved same-patient fixture (chưa có)
**Test Data:** Không identifier trong docs
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Chốt cùng patient đã duyệt trên từng host | Thiếu fixture → `Blocked`, không Fail |
| 2 | Mở `Quick Send` qua `Patient actions menu`. Không `Save`/`Send`/chọn campaign | Dialog đúng patient context |
| 3 | Ghi `Send as` default, `email on file`/`email not on file`, listed `To:` (không copy giá trị PII vào docs) | Trạng thái channel + on-file được ghi |
| 4 | So sánh giữa host | [Inferred] cùng patient/state: channel default + listed email không lệch trừ dataset đã xác nhận. `SMS` khi `email not on file` (cả 3 host) không Fail. Beth “open email first” chưa Confirmed |

**Postconditions:** Không đổi
**Cleanup:** `Close`
**Automation:** Blocked — expected chỉ `Inferred`; fixture lệch
**Evidence:** `exploration.md` OBS-001, OBS-005
**Execution History:** `20260923-plugin-qs` — Blocked (query `test`). `20260923-plugin-ramella` — Inconclusive. Cùng patient `Michael Ramella`: `email on file` + `Email enabled` 3 host. Connect `To:` khác OS — Observed. Expected Inferred. `automation.md`

### PAC2-4700-TC-011 — Tập sort `Select Campaign`; không Fail theming GP grey

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P3
**Requirements:** `REQ-PAC2-4700-010`
**Expected-result basis:** `Inferred` — Beth “Sorting options now match”; PNG 127142/127144. EXPLORE MATCH (OBS-002). GP grey Observed, chưa Confirmed major vs 4683
**UI-dependent:** Yes
**Feature Location:** Confirmed sort dropdown baseline/Connect/OS; GP Preliminary
**Entry Path:** Shared entry → `(click to change)` → sort
**Context:** `Select Campaign`
**Environment:** dev — 3 host Confirmed; GP Preliminary
**Role:** `Super Admin GB`
**Preconditions:** `Quick Send` mở
**Test Data Category:** UI control only
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Quick Send` baseline/Connect/OS | Dialog mở |
| 2 | `(click to change)` → mở sort. **Không** chọn option/campaign | Panel sort mở |
| 3 | Ghi option: `By date (descending)`, `By date (ascending)`, `By message type`, `A - Z`, `Z - A` | [Inferred] cùng tập + control usable. EXPLORE MATCH — không Fail option-set |
| 4 | GP: Preliminary. Grey panel PNG 127144 | Observed visual diff; không Confirmed Fail trừ QA chốt major vs 4683 |

**Postconditions:** Không đổi
**Cleanup:** `Close`
**Automation:** Blocked — `Inferred`; GP chưa locate; không assert theming
**Evidence:** `exploration.md` OBS-002
**Execution History:** `20260923-plugin-qs` — Inconclusive. Option-set MATCH 3 host. Expected Inferred — không Pass AC, không Fail theming. GP grey chưa observe. `automation.md`

### PAC2-4700-TC-012 — `Attachments` cùng patient có documents

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** `REQ-PAC2-4700-011`
**Expected-result basis:** `Inferred` — Beth Connect có documents / GP `Loading...` / OS `No available options`. EXPLORE: OS tooltip missing Patient Number; Connect `Files` disabled khi `Select Campaign` mở. Không Fail fixture không documents/NHS
**UI-dependent:** Yes
**Feature Location:** Confirmed tab `Files` baseline/Connect/OS; GP Preliminary
**Entry Path:** Shared entry → đóng picker campaign nếu mở → tab `Files`
**Context:** patient documents
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Cùng patient NHS + documents tồn tại từng backend
**Test Data Category:** Approved same-patient + documents (chưa có)
**Test Data:** Không identifier
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Chốt fixture NHS + documents | Thiếu → `Blocked`, không Fail |
| 2 | Mở `Quick Send`. Đóng `Select Campaign` nếu đang mở | Connect `Files` disabled khi picker mở = Observed possible defect, **không** Fail `REQ-011` và **không** Fail lại PAC2-4683 Files freeze trừ khi regress vs 4683 cùng state |
| 3 | Mở tab `Files`. Không add file vào draft | List hoặc empty/error observable |
| 4 | So sánh availability | [Inferred] cùng patient có document: load xong, không perma-`Loading...`. OS missing Patient Number (OBS-003) không Fail `REQ-011` |

**Postconditions:** Không file vào draft
**Cleanup:** `Close`
**Automation:** Blocked — `Inferred`; fixture documents+NHS chưa có
**Evidence:** `exploration.md` OBS-003, OBS-005
**Execution History:** `20260923-plugin-qs` — Blocked (query `test`). `20260923-plugin-ramella` — Inconclusive. `Select Attachment` sau load 3 host; OS Files chậm (~12s) không treo. Picker empty — không Fail. `automation.md`

### PAC2-4700-TC-013 — Mapped EMIS slot chip cùng campaign

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** `REQ-PAC2-4700-012`
**Expected-result basis:** `Inferred` — Beth OS/GP empty vs Connect chip `Virtual Mental Health`. OBS-004: không chip trên `6 July - Test Case 1`; OS list có option. Centered title ngoài scope
**UI-dependent:** Yes
**Feature Location:** Confirmed tab `Booking Link` baseline/Connect/OS; GP Preliminary
**Entry Path:** Shared entry → tab `Booking Link`
**Context:** campaign mapped slot
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Cùng campaign có mapped EMIS slot trên Connect, lặp OS/GP. Không dùng `6 July - Test Case 1` làm Fail empty chip
**Test Data Category:** Approved campaign + mapped slot (chưa có)
**Test Data:** Không chọn slot
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Chốt campaign mapped | `6 July - Test Case 1` không chip (OBS-004) → không Fail; thiếu campaign mapped → `Blocked` |
| 2 | Mở `Booking Link`. Không chọn slot, không `Refresh Availability`, không add booking | Fields Observed: `Date & Time`, slot-type comboboxes, `Select Clinician(s)`, `Select Location(s)` — landmarks, không AC |
| 3 | Quan sát chip mapped vs combobox | [Inferred] mapped tương đương nếu cùng campaign+config. OS list có option ≠ Pass; thiếu chip campaign chưa map ≠ Fail. Centered title không Fail |

**Postconditions:** Không booking vào draft
**Cleanup:** `Close`. Không `Escape` làm expected (OS đóng cả dialog)
**Automation:** Blocked — `Inferred`; chưa cùng campaign mapped
**Evidence:** `exploration.md` OBS-004
**Execution History:** `20260923-plugin-qs` — Blocked. `20260923-plugin-ramella` — Blocked mapped-campaign. `Booking Link` có `Refresh Availability` + video slot type 3 host. Không chọn slot. `automation.md`

### PAC2-4700-TC-014 — `Scheduler Link Required` — ghi, không “must popup”

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** `REQ-PAC2-4700-013`
**Expected-result basis:** `Inferred` + `Disputed`. Beth Connect popup dù link present; OS/GP không. EXPLORE không reproduce dù `{{{scheduler_link}}}`. PAC2-4683 đã log Connect prompt persist after link added; PAC2-5776 intermittent
**UI-dependent:** Yes
**Feature Location:** Confirmed editor baseline/Connect/OS; GP Preliminary
**Entry Path:** Shared entry; campaign mặc định OK
**Context:** campaign chứa scheduler placeholder
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Campaign có `{{{scheduler_link}}}` (`6 July - Test Case 1` OK). Không add `Booking Link` vào draft
**Test Data Category:** Existing default campaign
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Quick Send` campaign có `{{{scheduler_link}}}`. Không `Save`/`Send`/add booking | Dialog mở |
| 2 | Ghi overlay `Scheduler Link Required` / `I'll Choose Where` / `Add at End` present\|absent từng host | Observation only |
| 3 | So sánh | Không Fail vì “phải popup”. Non-repro EXPLORE ≠ Fail. Fail PAC2-4700 **chỉ** khi regress vs PAC2-4683 cùng state — không re-fail 4683 prompt-persist hay PAC2-5776 |

**Postconditions:** Không đổi
**Cleanup:** `Close`
**Automation:** Blocked — Disputed/`Inferred`; không assert “must popup”
**Evidence:** `exploration.md` OBS-001, OBS-004; `ticket/PAC2-4683-qs-sms-improve-with-paco-assist/ticket.md` Connect scheduler prompt persist
**Execution History:** `20260923-plugin-qs` — Inconclusive. `20260923-plugin-ramella` — Inconclusive trên baseline 4683 + OS + Connect. Không overlay. Không Fail must-popup. `automation.md`

### PAC2-4700-TC-015 — Overlay sort dismiss — không “must persist”

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P2
**Requirements:** `REQ-PAC2-4700-014`
**Expected-result basis:** `Inferred` — Beth OS boxes persist; video 127147. EXPLORE OBS-003: panel đóng khi click `Files`. Không expected “must persist”
**UI-dependent:** Yes
**Feature Location:** Confirmed sort baseline/Connect/OS; GP Preliminary
**Entry Path:** Shared entry → `(click to change)` → sort
**Context:** overlay dismiss
**Environment:** dev — OS primary; Connect/baseline đối chứng
**Role:** `Super Admin GB`
**Preconditions:** `Quick Send` mở
**Test Data Category:** UI control only
**Test Data:** Không
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `Quick Send` OS (+ Connect). `(click to change)` → mở sort. Không chọn campaign/option | Panel sort mở |
| 2 | Click tab `Files` **hoặc** click ngoài panel. Không click item campaign list (select-into-draft risk) | Overlay đóng hoặc còn — ghi actual |
| 3 | So sánh | [Inferred] panel đóng, không che list. EXPLORE đã đóng — không Fail vì “phải persist”. Persist chỉ candidate Fail nếu tái hiện **và** regression vs 4683/Connect |

**Postconditions:** Không campaign vào draft
**Cleanup:** `Close`. Không `Escape` làm expected
**Automation:** Blocked — `Inferred`; non-repro vs video; không chọn campaign
**Evidence:** `exploration.md` OBS-003
**Execution History:** `20260923-plugin-qs` — Inconclusive. OS overlay đóng khi Files; Connect `Select Campaign` còn. Không Fail must-persist. `automation.md`

## Open Questions and Blockers

1. Tester 2026-09-23: live `/paco/dashboard` = `PAC2-4683` đã merge. Visual `TC-001` so sánh được.
2. Fixture `Michael Ramella` (first result, có phone) dùng cho `TC-010`/`012`/`013`/`014`. Documents list trong `Select Attachment` vẫn empty. Mapped campaign chưa chọn. GP/Rocketbar/`Quick Form` còn Blocked.
3. GP: auth thủ công + `allowedHosts` cho `pac2-4700-qs-only.dev.blinxpaco-np.com`.
4. Rocketbar: feature-branch/preview URL.
5. `Quick Form` locate (mở menuitem) trước `TC-004`.
6. Rule `Scheduler Link Required` (Disputed) — không automate expected.
7. App ngoài `Quick Send` (REQ-008 “throughout each app”) chưa locate — không bịạ route.
8. Mutation `Save`/`Send` ngoài scope; cần approval + test recipient nếu mở.
9. Không Fail lại bug PAC2-4683 (scheduler prompt persist, Files freeze Rocketbar) trừ regression vs 4683 cùng state.
10. Không Fail: pixel/centered title/GP grey; Escape đóng dialog; `Files` disabled khi `Select Campaign` mở; default `SMS` khi `email not on file`; empty chip `6 July - Test Case 1`; must-popup; must-persist.

## Tester notes

[Protected area]
