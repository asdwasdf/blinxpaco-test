# Exploration: PAC2-4700

**Input Revision:** 1
**Environment:** baseline `https://blinx.dev.blinxpaco-np.com/paco/dashboard`; Connect `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard`; OS `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard`
**Role:** `Super Admin GB`
**Observed:** 2026-09-23T20:16:00+07:00
**Status:** Complete with warnings

## Scope

Read-only `Quick Send` dialog trên baseline PACO OS, Connect branch, OS branch. Entry: global patient search `test` → `Patient actions menu` → `menuitem` `Quick Send`. Tab riêng per host (cùng-tab host switch làm hết session). Không `Save` / `Send` / `Schedule` / `Edit` / `Set up Patient Reply` / chọn campaign / chọn slot. GP và Rocketbar ngoài scope lần này.

## Observations

### OBS-PAC2-4700-001

**Classification:** Observed
**Location/URL:** OS branch `/paco/feature-branch/pac2-4700-qs-only/dashboard`; Connect `/paco-connect/feature-branch/pac2-4700-qs-only/dashboard`; baseline `/paco/dashboard`
**Action:** Mở `Quick Send` từ first `test` result; không click patient row.
**Observed Behavior:** Dialog mở trên cả ba host. Landmarks: `Quick Send rocket icon`; `View Patient Details`; `Close`; `Send as:` `SMS` / `Email`; `Preview`; `Edit`; `Copy to Email`; `Resources`; `quick-send-action`; tabs `Campaign` / `Health Forms` / `Files` / `Booking Link`; `Save`. Default campaign label `6 July - Test Case 1` + `(click to change)`. `sms on file`; `email not on file`. `Send as` mặc định `SMS`; `Email` disabled. `To:` prefix `+44` (OS). Không popup `Scheduler Link Required` dù body campaign chứa `{{{scheduler_link}}}`.
**Requirement Links:** REQ-PAC2-4700-001, REQ-PAC2-4700-008, REQ-PAC2-4700-009, REQ-PAC2-4700-013
**Evidence:** Live Playwright plugin 2026-09-23; không promote screenshot (PII).
**Sensitive Data Review:** Redacted — không ghi patient name / NHS / phone / email vào docs.

### OBS-PAC2-4700-002

**Classification:** Observed
**Location/URL:** OS branch; Connect; baseline — cùng dialog `Select Campaign`
**Action:** `(click to change)` rồi mở sort dropdown. Không chọn campaign / option.
**Observed Behavior:** Sort options trên cả ba: `By date (descending)`, `By date (ascending)`, `By message type`, `A - Z`, `Z - A`. Label hiện tại `A - Z`. Control usable.
**Requirement Links:** REQ-PAC2-4700-003, REQ-PAC2-4700-010
**Evidence:** Live DOM `p-dropdown-panel` 2026-09-23
**Sensitive Data Review:** None

### OBS-PAC2-4700-003

**Classification:** Observed
**Location/URL:** OS branch; Connect
**Action:** Sort panel đang mở, click `tab-Files`.
**Observed Behavior:** OS: `.p-dropdown-panel` đóng; không persist overlay. Tooltip `Failed to load attachments due to a missing Patient Number. Please try again.` — không thấy `No available options` hay `Loading...` perma. Connect: sort panel cũng đóng; `Files` mang class disabled khi `Select Campaign` còn mở; không thấy attachment list / `Loading...`. Left panel cả hai: `Patient missing NHS number in order to show patient details`.
**Requirement Links:** REQ-PAC2-4700-011, REQ-PAC2-4700-014
**Evidence:** Live 2026-09-23 OS tooltip + Connect tab class
**Sensitive Data Review:** None

### OBS-PAC2-4700-004

**Classification:** Observed
**Location/URL:** OS branch; Connect — `tab-Booking Link`
**Action:** Mở tab; OS mở `Face to Face Slot Type(s)` combobox, không chọn option; Escape đóng overlay (OS Escape cũng đóng cả dialog).
**Observed Behavior:** Cả hai: `Date & Time`, `Refresh Availability`, `Face to Face Slot Type(s)`, `Phone Slot Type(s)`, `Video Slot Type(s)`, `Web Chat Slot Type(s)`, `Select Clinician(s)` `All Clinicians Included`, `Select Location(s)` `All Locations Included`, `Booking Notes (optional)`. Không chip `Virtual Mental Health`. OS dropdown load nhiều slot type (nhãn org `PACO-CONNECT` trên item) — list không empty; không pre-select mapped chip trên campaign hiện tại. Không overlay `Scheduler Link Required` / `I'll Choose Where` / `Add at End`.
**Requirement Links:** REQ-PAC2-4700-012, REQ-PAC2-4700-013
**Evidence:** Live 2026-09-23
**Sensitive Data Review:** None

### OBS-PAC2-4700-005

**Classification:** Observed
**Location/URL:** so sánh first `test` result giữa host
**Action:** Cùng query `test`, first `Patient actions menu`.
**Observed Behavior:** OS branch và baseline: dialog `NHS Nr: -`, `DOB: Unknown (Unknown)`. Connect: `NHS Nr: 0`, DOB dated (infant). First-rank search **không** cùng patient record giữa Connect vs OS/baseline. Không dùng làm fixture so sánh email/attachments/slots.
**Requirement Links:** REQ-PAC2-4700-009, REQ-PAC2-4700-011, REQ-PAC2-4700-012
**Evidence:** Live dialog header landmarks 2026-09-23
**Sensitive Data Review:** Redacted identifiers

## Mismatches and Possible Defects

Không kết luận `Fail`. Expected REQ-009..014 vẫn `Inferred` / REQ-013 `Disputed`.

- REQ-009: Beth “open email first” vs Observed default `SMS` khi `email not on file` trên cả ba host đã mở. Có thể data, không phải breakage đã Confirmed.
- REQ-010: sort option **khớp** OS / Connect / baseline lần này. GP theming chưa observe.
- REQ-011: OS không `No available options`; fail vì missing Patient Number. Connect Files không load list trong pass này (picker / disabled). Fixture thiếu NHS — không so sánh availability.
- REQ-012: không chip mapped trên campaign `6 July - Test Case 1` (OS và Connect). Khác PNG Beth (campaign/slot khác). OS slot list **có** option.
- REQ-013: body có `{{{scheduler_link}}}` nhưng **không** popup trên OS/Connect/baseline. Không reproduce Connect overlay từ video 2026-09-11.
- REQ-014: sort panel **không** persist khi click `Files` trên OS và Connect lần này. Khác video 127147.

Possible defect (Observed only, chưa Fail): `Files` disabled khi `Select Campaign` còn mở (Connect); Escape trên OS đóng cả `Quick Send` chứ không chỉ overlay slot.

## Actions Not Taken

- `Save`, `quick-send-action` (send/schedule), `Edit`, `Set up Patient Reply`, `Copy to Email`, favorite campaign
- Chọn campaign khác, chọn sort option, chọn slot type, `Refresh Availability`
- GP host (auth Blocked; ngoài `allowedHosts`)
- Rocketbar (không feature-branch URL)
- Screenshot shareable (PII)

## Suggested Coverage

- Cùng patient fixture có NHS + email + documents + mapped EMIS slot trên Connect/OS/GP trước khi so sánh REQ-009/011/012
- Campaign có `{{scheduler_link}}` đã chốt rule popup (REQ-013) — không automate expected
- GP login + allowlist rồi lặp sort/Files/Booking
- Replay overlay-dismiss trên OS với bước giống video 127147 (click campaign list / email khi sort mở)
- Mutation (`Send`/`Save`) chỉ sau approval + test recipient

## Blockers and Open Questions

- GP: chưa auth; host `pac2-4700-qs-only.dev.blinxpaco-np.com` ngoài `allowedHosts`
- Rocketbar: không preview URL
- First `test` result Connect ≠ OS/baseline — cần patient ID đã duyệt
- Rule `Scheduler Link Required` vẫn Disputed
- Baseline live `/paco/dashboard` ≠ URL `PAC2-4683` trong ticket (Open Question ANALYZE)

## Tester notes

[Protected area]
