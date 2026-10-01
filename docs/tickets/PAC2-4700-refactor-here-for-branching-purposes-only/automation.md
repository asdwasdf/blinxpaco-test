# Automation: PAC2-4700

**Input Revision:** 1
**Environment:** dev — Connect + OS + GP branch + baseline `/paco/dashboard` (= `PAC2-4683` đã merge, tester 2026-09-23)
**Updated:** 2026-09-23T22:19:21+07:00

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| `PAC2-4700-TC-001` | Yes | valid | Confirmed (QS baseline/Connect/OS) | Yes | Allowed |
| `PAC2-4700-TC-002` | Yes | valid | Confirmed | Yes | Allowed |
| `PAC2-4700-TC-003` | Yes | valid | Confirmed | Yes | Allowed |
| `PAC2-4700-TC-004` | Yes | valid | Confirmed (GP `Quick Form`) | Yes (`Michael Ramella`) | Allowed; executed locate/read-only |
| `PAC2-4700-TC-005` | Yes | valid | Confirmed (GP QS) | Yes (`Michael Ramella`) | Allowed; executed read-only |
| `PAC2-4700-TC-006` | Yes | valid | Confirmed (`Rocket Bar` sidebar on GP branch) | Partial (desktop protocol handler absent) | Executed; Blocked at external app launch |
| `PAC2-4700-TC-010` | Yes | valid | Confirmed | Yes (cùng patient `Michael Ramella`, email on file) | Allowed observe; automation Blocked (`Inferred`) |
| `PAC2-4700-TC-011` | Yes | valid | Confirmed | Yes | Allowed observe; automation Blocked (`Inferred`) |
| `PAC2-4700-TC-012` | Yes | valid | Confirmed | Partial (NHS; `Select Attachment` empty) | Allowed observe; automation Blocked (`Inferred`) |
| `PAC2-4700-TC-013` | Yes | valid | Confirmed QS; fixture không | No (mapped campaign chưa chọn) | Blocked |
| `PAC2-4700-TC-014` | Yes | valid | Confirmed | Yes | Allowed observe; automation Blocked (Disputed/`Inferred`) |
| `PAC2-4700-TC-015` | Yes | valid | Confirmed | Yes | Allowed observe; automation Blocked (`Inferred`) |

## Assessment

| Test Case | Decision | Reason | Mutation | Approval |
|---|---|---|---|---|
| `PAC2-4700-TC-001` | Later | Smoke open+tab+`Close` ổn định. Pixel vs 4683 không automate. Baseline = 4683 (tester) | None | No |
| `PAC2-4700-TC-002` | Later | Chọn sort + đọc label ổn. Không assert option-set. Không chọn campaign | None | No |
| `PAC2-4700-TC-003` | Later | Presence + selected indicator. Không pixel. Không assert default channel | None | No |
| `PAC2-4700-TC-004` | Later | `Quick Form` route/dialog located; không chọn form | None | Yes (tester: check hết) |
| `PAC2-4700-TC-005` | Later | GP auth + allowlist resolved; plugin-first read-only Pass | None | Yes (tester 2026-09-23) |
| `PAC2-4700-TC-006` | Blocked | `Rocket Bar` nằm ở sidebar GP; `Launch Rocket Bar` gọi desktop protocol nhưng test machine không có registered handler | None | Yes (tester: check hết) |
| `PAC2-4700-TC-010` | Blocked | Expected `Inferred`; fixture `Michael Ramella` sẵn — không automate | None | No |
| `PAC2-4700-TC-011` | Blocked | Expected `Inferred`; option-set Observed MATCH, không AC | None | No |
| `PAC2-4700-TC-012` | Blocked | `Inferred`; Files load xong `Select Attachment`; list empty — không Fail | None | No |
| `PAC2-4700-TC-013` | Blocked | `Inferred`; campaign mapped chưa chốt; Connect default campaign ≠ OS | None | No |
| `PAC2-4700-TC-014` | Blocked | Disputed; không assert must-popup | None | No |
| `PAC2-4700-TC-015` | Blocked | `Inferred`; không assert must-persist | None | No |

Không viết `.spec.ts` run này.

## Plugin-first Execution

**Run:** `20260923-plugin-qs` · 2026-09-23T21:38+07:00–21:49+07:00
**Role:** `Super Admin GB`
**Mutation:** None — không `Save` / `Send` / `Edit` / chọn campaign / chọn slot
**Why code is not valuable now:** Locator ổn cho Later; Inferred không automate.

### Rerun `20260923-plugin-ramella` · 2026-09-23T21:58+07:00–22:08+07:00

Tester: live `/paco/dashboard` = `PAC2-4683` đã merge. Fixture query `Michael Ramella` (first result, có phone). Mutation None. Không copy NHS/phone/email.

### PAC2-4700-TC-001 — Pass (vs 4683)

OS / Connect / baseline: dialog mở; `View Patient Details`, `Close`, tabs `Campaign` / `Health Forms` (badge `2`) / `Files` / `Booking Link` (badge `1`); tab đổi được; `Close` đóng. Không major broken sizing. Pixel không Fail. Visual vs 4683: **Pass** major-breakage (baseline = 4683).

### PAC2-4700-TC-010 — Inconclusive (`Inferred`)

Cùng patient 3 host: `sms on file` + `email on file`. `Send as`: `Email enabled` selected, `Enable SMS` không selected. Listed `To:` hiện (giá trị không ghi docs). Connect `To:` khác OS/baseline — Observed dataset, không Fail. Connect DOB dated; OS/baseline `DOB: Unknown` — Observed, không Fail.

### PAC2-4700-TC-012 — Inconclusive (`Inferred`)

Không tooltip missing Patient Number. `Select Attachment` hiện sau load. Baseline Files sẵn; Connect ~8s `Loading...` rồi `Select Attachment`; OS lần 1 còn `Loading...` lúc 5s, lần 2 ~12s rồi `Select Attachment`. Không perma-`Loading...`. Picker không list file — không Fail “phải có documents”.

### PAC2-4700-TC-013 — Blocked

Không chọn campaign. `Booking Link` có `Refresh Availability` + video slot type `Virtual Mental Health Review` 3 host. Không Fail empty chip / must-mapped.

### PAC2-4700-TC-014 — Inconclusive

Không overlay `Scheduler Link Required` trên baseline 4683 / OS / Connect. Không Fail must-popup.

### Rerun `20260923-plugin-gp-ramella` · 2026-09-23T22:15+07:00–22:19+07:00

Tester đã manual login và duyệt thêm GP host vào `allowedHosts`. Query `Michael Ramella`; first result. Mutation None. Không `Save`/`Send`/chọn campaign/slot.

### PAC2-4700-TC-005 — Pass (GP read-only)

GP: global search → `Patient actions menu` → `Quick Send`; dialog mở với `View Patient Details`, `Close`, tabs `Campaign` / `Health Forms` / `Files` / `Booking Link`. `Files` load xong và hiện `Select Attachment`; `Booking Link` hiện `Refresh Availability`; không overlay `Scheduler Link Required`; `Close` đóng dialog. Không major functional breakage. Không copy patient identifiers.

### PAC2-4700-TC-004 — Pass (locate/read-only)

GP `Patient actions menu` → `Quick Form` mở dialog với `Select Quick Form`, `Health Form`, `Comments`, `SNOMED Code`, `Advanced`; không chọn form, không thao tác mutation; `Close` đóng.

### PAC2-4700-TC-006 — Blocked (external Rocket Bar handler)

`Rocket Bar` tồn tại trong sidebar GP. `Launch Rocket Bar` được gọi nhưng browser báo desktop protocol `blinx-paco-rocket://login?...` không có registered handler; remote entry cũng trả 404. Đây là environment/integration blocker, không kết luận product Fail.

### PAC2-4700-TC-001 — Pass (smoke) / Inconclusive (vs 4683)

OS / Connect / baseline: dashboard `Super Admin GB`; search `test`; `Patient actions menu` → `Quick Send`; dialog mở; `View Patient Details`, `Close`, tabs `Campaign` / `Health Forms` / `Files` / `Booking Link`; tab đổi được; `Close` đóng. Không major broken sizing. Pixel không Fail. Visual vs `PAC2-4683`: **Inconclusive** (URL 4683 chưa chốt). Connect first `test` ≠ OS/baseline (OBS-005) — không Fail email/attachments/slots.

### PAC2-4700-TC-002 — Pass (OS, Connect, baseline)

- OS: `A - Z` → `By date (descending)` hiện trên control.
- Connect: `By date (descending)` → `Z - A` hiện.
- Baseline: `Z - A` → `By date (ascending)` hiện.
Không click campaign list. Không `Escape`.

### PAC2-4700-TC-003 — Pass

Tick/indicator visible trên kênh selected. OS: `SMS enabled` (disabled = selected), `Email` disabled, `email not on file`. Connect + baseline: visual selected trên `Email` (underline/semibold) dù `Email` disabled; `SMS` không visual-selected lúc đo. Không Fail default `SMS`. Không switch channel. Hover không mất control.

### PAC2-4700-TC-004 — Not Run

`menuitem` `Quick Form` thấy; chưa mở. `Blocked` location.

### PAC2-4700-TC-005 — Blocked

GP `https://pac2-4700-qs-only.dev.blinxpaco-np.com/` ngoài `allowedHosts`; không navigate. Không Fail product.

### PAC2-4700-TC-006 — Blocked

Không Rocketbar feature-branch URL. Không mở sidebar `Rocket Bar`.

### PAC2-4700-TC-010 — Blocked

Thiếu cùng patient NHS + email. Connect first result `NHS Nr: 0` / DOB dated; OS/baseline `NHS Nr: -` / `DOB: Unknown`. Không Fail `SMS` khi `email not on file`.

### PAC2-4700-TC-011 — Inconclusive

Option set lại MATCH 3 host: `By date (descending)`, `By date (ascending)`, `By message type`, `A - Z`, `Z - A`. Expected `Inferred` — không Pass AC, không Fail option-set. GP grey chưa observe.

### PAC2-4700-TC-012 — Blocked

Thiếu fixture NHS + documents. OS Files: tooltip `Failed to load attachments due to a missing Patient Number` — không Fail `REQ-011`. Connect: `Select Campaign` còn sau click `Files` (picker/disabled) — không Fail 4683 Files freeze.

### PAC2-4700-TC-013 — Blocked

Không campaign mapped đã duyệt. OS default `6 July - Test Case 1`; Connect default khác; baseline `TR Logo - KS Test`. Không chọn slot. Không Fail empty chip.

### PAC2-4700-TC-014 — Inconclusive

Không overlay `Scheduler Link Required` / `I'll Choose Where` / `Add at End` trên OS/Connect/baseline. Không Fail must-popup. Không re-fail PAC2-4683 / PAC2-5776.

### PAC2-4700-TC-015 — Inconclusive

OS: sort overlay đóng khi click `Files`. Connect: `Select Campaign` vẫn trong dialog sau click `Files`. Không Fail must-persist. Không click campaign item.

**Direct execution result (suite `20260923-plugin-qs`):** completed with warnings — 3 Pass Confirmed; 3 Blocked locate; 2 Blocked fixture; 3 Inconclusive Inferred/Disputed; 1 Not Run. Không Fail.

**Direct execution result (suite `20260923-plugin-ramella`):** completed with warnings — `TC-001` Pass vs 4683; `TC-010`/`012`/`014` Inconclusive Inferred; `TC-013` Blocked mapped-campaign. Không Fail. Mutation None.

**Direct execution result (suite `20260923-plugin-gp-ramella`):** completed with warnings — `TC-004` Pass locate/read-only; `TC-005` Pass read-only; `TC-006` Blocked external desktop protocol handler. 0 Fail. Mutation None.

### Deep rerun `20260923-plugin-three-link-deep` · 2026-09-23T23:09+07:00–23:14+07:00

Sau manual re-auth, chạy lại cùng fixture trên baseline (`PAC2-4683`), Connect branch và OS branch. Read-only; không chọn campaign/slot/form/file, không `Refresh Availability`, không `Save`/`Send`.

- Cả 3 link: patient search → `Patient actions menu` → `Quick Send` mở; dialog 1152×600 trong viewport 1536×674, header/controls/nav không overlap; `Close` hoạt động.
- Baseline + OS: campaign hiện cùng label; Connect ở `Choose template`. Đây là dataset/config difference, không phải regression có expected basis.
- Connect: editor toolbar hiện đủ; `Send as` bị disabled khi chưa chọn template. Baseline/OS có campaign nên controls khác state. Không kết luận bug vì precondition khác.
- `Files`: Connect và OS đều rời `Loading...`, hiện `Select Attachment`; OS chậm nhưng hoàn tất trong khoảng 15 giây. Không reproduce freeze/permanent loading.
- `Booking Link`: Connect và OS đều hiện `Refresh Availability`, date/time, slot-type, clinician/location controls. Không click action; không thấy `Scheduler Link Required` overlay.
- Baseline dialog cũng mở ổn với cùng fixture; prior run đã xác nhận tab navigation/close và baseline = `PAC2-4683`.
- Console có lỗi/warning nền trên PACO pages, nhưng không có observable functional breakage gắn được với PAC2-4700; không tạo defect chỉ từ console noise.

**Result:** 0 Fail mới. Confirm lại `TC-001` Pass; `TC-012`/`014` vẫn Inconclusive vì expected Inferred/Disputed; `TC-013` vẫn Blocked mapped campaign. Mutation None; `Close` cleanup hoàn tất.

### Focused rerun `20260924-plugin-quick-send-no-send` · 2026-09-24T11:10+07:00–11:22+07:00

Cùng patient fixture trên baseline (`PAC2-4683`), OS và GP. Chỉ mở `Quick Send`, đọc state, chuyển `Files`, rồi `Close`; không `Send`, không `Schedule`, không chọn slot/campaign/file.

- Baseline và OS mở dialog ổn. Cả hai hiện `Email enabled`; OS hiện dòng `To:`, baseline không render dòng này trong snapshot cùng state. Expected chỉ `Inferred`, chưa kết luận defect.
- GP mở dialog ổn nhưng khác state: campaign `6 July - Test Case 1`, `SMS enabled`, nội dung chứa scheduler placeholder. `Files` thoát loading và hiện `Select Attachment`; không có attachment sẵn.
- Baseline `Files` cũng thoát loading và hiện `Select Attachment`; không có attachment sẵn. Không reproduce perma-loading.
- Connect: từ đúng branch dashboard, chọn cùng patient luôn điều hướng sang baseline `/paco/patient-profile/...`, làm mất prefix `/paco-connect/feature-branch/pac2-4700-qs-only`. Reproduce hai lần. Vì branch context mất trước khi mở dialog, các assertion `Quick Send` Connect trong run này là **Inconclusive**. Đây là observation điều hướng mới; chưa tạo defect vì ticket không cung cấp expected route basis.
- OS campaign picker: sort options quan sát được gồm `By date (ascending)`, `By message type`, `A - Z`, `Z - A`; khi chuyển sang `Files`, sort overlay đóng. Không reproduce panel persistence ở OS.
- Không kiểm tra hành vi `Schedule`; không bấm action `quick-send-action`. Không có mutation server-side.

**Result:** 0 Fail theo requirement basis hiện có. `TC-005` GP Pass reconfirmed; `TC-010/011/012/015` Inconclusive; `TC-013` Blocked mapped campaign; Connect branch-context loss ghi nhận để QA xác nhận expected.

## Automated Tests

| Test Case | Source | Requirement Basis | Status |
|---|---|---|---|
| `PAC2-4700-TC-001` | Không có | `REQ-001/002/005/006` Confirmed QA Focus | Not Implemented — Later |
| `PAC2-4700-TC-002` | Không có | `REQ-003/006` Confirmed | Not Implemented — Later |
| `PAC2-4700-TC-003` | Không có | `REQ-004/005` Confirmed | Not Implemented — Later |
| `PAC2-4700-TC-004`..`006` | Không có | `REQ-007/008` | Not Implemented — Blocked |
| `PAC2-4700-TC-010`..`015` | Không có | `REQ-009`..`014` Inferred/Disputed | Not Implemented — Blocked |

## Execution History

| Run | Result | Environment | Role | Revision | Evidence |
|---|---|---|---|---|---|
| `20260923-plugin-qs` | See plugin-first | dev Connect/OS/baseline | `Super Admin GB` | 1 | Live Playwright plugin; snapshot local PII, không promote |
| `20260923-plugin-ramella` | `TC-001` Pass vs 4683; `010`/`012`/`014` Inconclusive; `013` Blocked | same + fixture `Michael Ramella` | `Super Admin GB` | 1 | Baseline = 4683 (tester). Không copy PII |
| `20260923-plugin-gp-ramella` | `TC-004`/`005` Pass read-only; `TC-006` Blocked external handler | GP branch + fixture `Michael Ramella` | authenticated GP user | 1 | Manual auth + allowlist approved; no PII promoted |
| `20260923-plugin-three-link-deep` | `TC-001` Pass reconfirmed; 0 Fail mới; `TC-012/014` Inconclusive; `TC-013` Blocked | baseline/Connect/OS + cùng fixture | `Super Admin GB` | 1 | Live Playwright; PII không promote |

## Mutation and Cleanup

**Occurred:** No
**Class:** None
**Approval Scope:** N/A
**Cleanup:** `Close` dialog từng host; not required. Rerun `ramella` và GP cũng `Close`.
**Leftover Identifiers:** Không có

## Blockers and Warnings

1. GP resolved: manual auth + `allowedHosts`; `TC-004`/`005` Pass read-only.
2. Rocketbar route resolved: sidebar GP → `Launch Rocket Bar`; external desktop protocol handler chưa cài nên `TC-006` Blocked.
3. Mapped campaign + documents list trong `Select Attachment` nếu còn test `TC-012`/`013`.
5. Baseline `/paco/dashboard` = `PAC2-4683` (tester 2026-09-23).
6. Không Fail lại PAC2-4683 (scheduler prompt persist, Files freeze) trừ regression vs 4683 cùng state.
7. Không Fail: pixel; default `SMS` khi `email not on file`; OS missing Patient Number; empty chip; must-popup; must-persist; Connect first-search ≠ OS.
8. Connect `Send as`: visual selected trên `Email` disabled — Observed, không Fail `REQ-004`.
9. Tab riêng bắt buộc; cùng-tab host switch hết session.

## Tester notes

[Protected area]
