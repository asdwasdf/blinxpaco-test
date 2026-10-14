# Automation: PAC2-8241

**Input Revision:** 1
**Environment:** dev â€” `https://blinx.dev.blinxpaco-np.com` (DEV main)
**Role:** `Super Admin GB`
**Updated:** 2026-10-05T13:41Z

## Feature Location Gate

| Test Case | UI-dependent | Location State | Route Status | Entry/Context/Role/Data Ready | Decision |
|---|---|---|---|---|---|
| TC-001 | Yes | valid | Confirmed (path A) | Yes | Allowed |
| TC-002 | Yes | valid | Confirmed (path A) | Yes | Allowed |
| TC-003 | Yes | valid | Confirmed (path A) | Yes | Allowed |
| TC-005 | Yes | valid | Confirmed (path A) | No â€” past-date QA-AUTO session + bookable mapped slot chÆ°a cĂ³ | Not Run |
| TC-006 | Yes | valid | Confirmed (path B / session pencil) | No â€” cáº§n booking tá»« TC-005 | Not Run |
| TC-007 | Yes | staleâ†’corrected | Confirmed in run: pencil icon trĂªn header session QA-AUTO â†’ drawer `Edit Session` cĂ³ `Time Range` | Yes | Allowed |
| **Issue 2** | Yes | valid | Confirmed (path A slot editor + pencil Time Range) | No â€” session creation failed | **Blocked** |

## Execution Summary

| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
| PAC2-8241-TC-001 | Fail | 3 + control | `PAC2-8241-TC-001-002-003-007.spec.ts` | N/A | N/A | â€” |
| PAC2-8241-TC-002 | Pass | 1 (+2 re-verify) | `â€¦TC-001-002-003-007.spec.ts` | N/A | N/A | â€” |
| PAC2-8241-TC-003 | Pass | 2 | `â€¦TC-001-002-003-007.spec.ts` | N/A | N/A | Counter step khĂ´ng quan sĂ¡t Ä‘Æ°á»£c (session á»Ÿ cá»™t `Not Assigned`) |
| PAC2-8241-TC-005 | Blocked | 0 | N/A | N/A | N/A | Test data: date picker khĂ´ng cho ngĂ y quĂ¡ khá»©; session tá»± táº¡o khĂ´ng gĂ¡n Ä‘Æ°á»£c care professional (`No Match` do `Required Attributes`) â†’ `No care professional assigned` khi click slot |
| PAC2-8241-TC-006 | Blocked | 0 | N/A | N/A | N/A | Cáº§n booking (TC-005 Blocked) |
| PAC2-8241-TC-007 | Fail | 4 + control | `â€¦TC-001-002-003-007.spec.ts` | N/A | N/A | â€” |
| **Issue 2 (tester request)** | Blocked | 2 | N/A | N/A | N/A | Configuration Add Session: Appointment Book dropdown interaction failed; validation requires field; MCP cannot complete setup |

## Manual Execution Evidence

### TC-001 â€” boundary (REQ-002, REQ-004)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | initial: drag 16:20â†’16:45 trĂªn session 08:00â€“16:00 | Fail | Confirmed (tony.do 2026-09-22) | UI táº¡o pending slot ngoĂ i range, footer `Session ends at: 16:45`, khĂ´ng cĂ³ message boundary; `Save` â†’ `POST appointment-slots/update 500`, UI im láº·ng, modal váº«n má»Ÿ; reload: 48 slots, khĂ´ng lÆ°u |
| a2 | same (16:20â†’16:40), fresh page | Fail | Confirmed | Giá»‘ng a1 (500, khĂ´ng message). Observed: pending slot 16:20â€“16:45 cá»§a a1 váº«n xuáº¥t hiá»‡n láº¡i sau reload (stale draft) |
| a3 | clean (16:00â†’16:10), fresh page | Fail | Confirmed | pending 16:00â€“16:15, `Save` â†’ 500, khĂ´ng message; reload khĂ´ng lÆ°u |
| control | valid in-range save (TC-002) | Pass | â€” | `appointment-slots/update 200`, persist |

Káº¿t luáº­n: khĂ´ng lÆ°u slot invalid (server reject) nhÆ°ng **khĂ´ng cĂ³ message `Slots must sit inside the sessionâ€¦`** vĂ  lá»—i 500 **silent** â†’ Fail (REQ-002 message, ticket item "failed saves display a clear error").

### TC-002 â€” bulk slot type (REQ-006, REQ-004)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | 48 slots `Dermatology Clinic` â†’ `Test Billable` | Pass | Confirmed + Inferred | `slots/update 200`; dashboard 48 TB; reopen 48 TB; reload+reopen 48 TB |

Note: toast `Session updated successfully` khĂ´ng báº¯t Ä‘Æ°á»£c báº±ng selector trong attempt nĂ y (khĂ´ng assert).

### TC-003 â€” single Empty/Non-bookable + bulk Bookable (REQ-006)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | slot 08:00 bá» `Bookable`, 08:10 `Empty Slot Type` | Pass | Confirmed | reopen + reload: 08:00 `NON-BOOKABLE`, 08:10 `Empty Slot` |
| a2 | `Select All` â†’ `Bookable` off (48 pending NON-BOOKABLE, 200) â†’ reload â†’ on (0 pending, 200) â†’ reload | Pass | Confirmed | Final reload+reopen: 0 NON-BOOKABLE, 47 TB + 1 Empty |

Observed: bulk panel `Bookable` máº·c Ä‘á»‹nh unchecked khi selection mixed. Top `Available` (168) khĂ´ng Ä‘á»•i vĂ¬ session á»Ÿ cá»™t `Not Assigned`.

### TC-007 â€” extend Time Range (REQ-003, REQ-005, REQ-004, REQ-006)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | slots 47 TB + 1 Empty; `Hours (To)` 16:00â†’17:00 (fill) | Fail | Confirmed (tony.do 2026-09-22; Sean 2026-09-20) | `sessions/update 200`, toast `Success â€” Session updated successfully.`; header ngay sau save váº«n `08:00 - 16:00`, sau ~5s `08:00 - 17:00`; **khĂ´ng cĂ³ slot 16:00â€“17:00** (48 slots); **toĂ n bá»™ slot revert vá» `Dermatology Clinic`, Empty slot máº¥t**; modal `Session ends at: 16:00`; persist sau reload |
| a2 | same method, 17:30 (diag script) | Fail | Confirmed | `sessions/update 400` (`FST_ERR_VALIDATION`), UI toast generic `â€¦went wrong!` |
| a3 | clean data (slots set láº¡i 48 TB, verified), 17:30 typed | Fail | Confirmed | request `session_endtime:"17:30"` â†’ 400; message generic; slots khĂ´ng Ä‘á»•i |
| a4 | fresh page, fill `18:00` | Fail | Confirmed | `session_endtime:"18:00"` â†’ 400 generic; khĂ´ng Ä‘á»•i |
| control | chá»‰ Ä‘á»•i `Session Name` â†’ `â€¦-R` | Pass | â€” | `sessions/update 200`; name persist; slots khĂ´ng Ä‘á»•i |

Káº¿t luáº­n: expected (thĂªm default slots, giá»¯ slot cÅ©) khĂ´ng Ä‘áº¡t á»Ÿ má»i attempt â†’ Fail. Hai failure mode: (1) save 200 nhÆ°ng revert slot changes + khĂ´ng sinh slot; (2) giá» dáº¡ng `HH:MM` â†’ 400 vá»›i message khĂ´ng rĂµ. `Inferred`: mode (2) cĂ³ thá»ƒ phá»¥ thuá»™c cĂ¡ch nháº­p (time mask) â€” cáº§n dev xĂ¡c nháº­n.

### Issue 2 â€” move slots + add outside range + expand + verify persist (tester request 2026-10-05)

| Attempt | Data Variant | Result | Expected Basis | Evidence |
|---|---|---|---|---|
| a1 | Bounded setup: táº¡o session `QA-AUTO-PAC2-8241-20261005-1259` (08:00â€“16:00, 111 PC24, Temi PCN, Dermatology Clinic + Test Billable) qua Configuration Add Session drawer | Blocked | User scenario description | Form filled Ä‘áº§y Ä‘á»§ theo spec pattern (DOM click speed dial/Add, fill name/hours, multiselect slot types, dropdowns book/location, Save); drawer closed sau Save; **session khĂ´ng táº¡o Ä‘Æ°á»£c**: khĂ´ng cĂ³ POST /session network request, khĂ´ng xuáº¥t hiá»‡n trong Configuration grid (66 rows checked), khĂ´ng cĂ³ trong Appointment Book. Console khĂ´ng error session creation. Ledger: `test-results/PAC2-8241/manual/issue2-attempt1-ledger.md` |
| a2 | Diagnostic: retry setup `QA-AUTO-PAC2-8241-20261005-1337` vá»›i validation check | Blocked | User scenario description | Name/hours/slot types filled; Appointment Book dropdown: label found nhÆ°ng `parentElement.querySelector('[data-pc-name="dropdown"]')` returns null; broader selector finds 5 dropdowns, clicked dropdown[3], wait 2s, options khĂ´ng visible; `role=option[name="111 PC24"]` khĂ´ng match. Save clicked (button enabled), drawer váº«n má»Ÿ sau 5s. **Validation error:** `"Appointment Book is required."` Diagnostic: `test-results/PAC2-8241/manual/issue2-attempt2-diagnostic.md` |
| a3 | Diagnostic: retry với Location dropdown explicit select | Blocked | User scenario description | Resumed từ a2 drawer state (name/hours/slot types/book đã fill); Location dropdown clicked f22e803 → listbox opened 100+ options → selected `Temi PCN` (dropdownItem_3) → confirmed in label. Save clicked f22e820 → drawer disappeared, no validation message. Verification: network filter `/session/` no POST, Configuration grid 42 rows không có session. **Silent form submission failure** — form appeared valid, drawer closed như thành công nhưng không network request. Ledger: `test-results/PAC2-8241/manual/issue2-attempt3-ledger.md` |
| a4 | Technical investigation: DOM evaluate vs React state | Blocked | User scenario description | Fresh drawer; name via evaluate DOM `input.value` assign + dispatchEvent; hours/dates via `browser_type`; slot types/book/location via click. Pre-Save UI: name `QA-AUTO-PAC2-8241-20261005-1401`, hours 08:00–16:00, 2 slot types, location Temi PCN verified. Save → drawer closed (no validation message). Network: POST /sessions/template/create **400 FST_ERR_VALIDATION**. Request body: `\"session_name\":\"\"` (empty) despite UI value; all other fields (hours, dates, 48 slots, slot types 46+2537, book, location UUID) correct. **Root cause: DOM evaluate insufficient for React controlled input state sync.** Ledger: `test-results/PAC2-8241/manual/issue2-attempt4-ledger.md` |
Kết luận: **Blocked** — Configuration Add Session không tạo được session qua MCP Playwright. Năm failure modes: (a1) silent fail sau Save; (a2) Appointment Book dropdown interaction failed + validation error; (a3) Location dropdown successful nhưng Save silent fail (no POST); (a4/a5) POST sent with `"session_name":""` empty despite UI showing value → 400 FST_ERR_VALIDATION. Root cause a4/a5: React controlled input `#slide-bar-right__name__id` state không sync qua DOM evaluate assign (a4) hay `browser_type` (a5); UI hiển thị value nhưng form submission POST payload gửi empty string. Tất cả field khác (hours, dates, slot types, book, location) captured đúng. Bounded 5 diagnostic attempts completed. Issue 2 scenario (TC-007 variation: move slots + add outside + expand + persist verify) cannot execute without session.
| a3 | Diagnostic: retry với Location dropdown explicit select | Blocked | User scenario description | Resumed từ a2 drawer state (name/hours/slot types/book đã fill); Location dropdown clicked f22e803 → listbox opened 100+ options → selected `Temi PCN` (dropdownItem_3) → confirmed in label. Save clicked f22e820 → drawer disappeared, no validation message. Verification: network filter `/session/` no POST, Configuration grid 42 rows không có session. **Silent form submission failure** — form appeared valid, drawer closed như thành công nhưng không network request. Ledger: `test-results/PAC2-8241/manual/issue2-attempt3-ledger.md` |
Káº¿t luáº­n: **Blocked** â€” Configuration Add Session form Appointment Book/Location dropdown khĂ´ng tÆ°Æ¡ng tĂ¡c Ä‘Æ°á»£c vá»›i MCP Playwright; parent traversal selector khĂ´ng find control, broader selector click khĂ´ng má»Ÿ options list. Form validation requires Appointment Book; Save khĂ´ng submit khi validation fail. Bounded 2 diagnostic attempts completed. Issue 2 scenario (TC-007 variation: move slots + add outside + expand + persist verify) cannot execute without session.
Káº¿t luáº­n: **Blocked** â€” Configuration Add Session khĂ´ng táº¡o Ä‘Æ°á»£c session qua MCP Playwright. Ba failure modes: (a1) silent fail sau Save; (a2) Appointment Book dropdown interaction failed + validation error; (a3) Location dropdown successful nhÆ°ng Save silent fail (no network request, drawer closed, session not created). Bounded 3 diagnostic attempts completed. Issue 2 scenario (TC-007 variation: move slots + add outside + expand + persist verify) cannot execute without session.
**Control path checked:** Yes (TC-002 valid slot save; TC-007 name-only save)
**Persisted state checked:** fresh reload + reopen `Edit Session` má»—i case
**Coverage review:** REQ-001 (TC-006) vĂ  REQ-007 (TC-005) Blocked (test data); REQ-002/003/004/005/006 cĂ³ káº¿t quáº£. Issue 2 closest TC-007 + chÆ°a cĂ³ "move slots within range" coverage.

## Automation Implementation

- Spec: `playwright/tests/tickets/PAC2-8241-TC-001-002-003-007.spec.ts` (sha256 `9e11a8f3â€¦f059`), serial, Chromium, auth qua CDP fixture.
- Flow: setup táº¡o `QA-AUTO-PAC2-8241-<stamp>` (08:00â€“16:00 hĂ´m nay, 111 PC24, Temi PCN, Dermatology Clinic + Test Billable) â†’ TC-002 â†’ TC-003 â†’ TC-001 â†’ TC-007 â†’ `afterAll` cleanup `Configuration` â†’ `Delete`.
- Guard: hostname check + `evaluateMutationGate()` (`PACO_ALLOW_MUTATION=true`), action `qa-auto-session-create-update-delete`.
- TC-001/TC-007 encode Confirmed expected (boundary message; extend thĂªm 6 slot + giá»¯ slot cÅ©) â†’ ká»³ vá»ng fail khi defect cĂ²n.
- TC-005/006 khĂ´ng cĂ³ spec: Blocked (test data).
- Rá»§i ro locator: menu `â‹¯` single slot (TC-003) vĂ  confirm `Delete` (cleanup) khĂ´ng cĂ³ trong manual record.

## CLI Verification

Run r1 (2026-10-02, partial, debug spec):

| Case | CLI result | Classification |
|---|---|---|
| setup | Pass | â€” |
| PAC2-8241-TC-002 | Pass | Matched product result |
| PAC2-8241-TC-003 | Fail (locator `â‹¯` panel) â†’ sá»­a, chÆ°a cháº¡y láº¡i | Automation defect |
| PAC2-8241-TC-001 | Not Run | Setup or authentication failure (login browser killed) |
| PAC2-8241-TC-007 | Not Run | Setup or authentication failure |

Ledger: `test-results/PAC2-8241/cli/r1/ledger.md`; leftovers: none.

## Mutation and Cleanup

**Occurred:** Yes
**Class:** Persistent
**Workflow Scope:** PAC2-8241 / TC-001,002,003,007 / create+update session & slots / QA-AUTO data only
**Ledger:** `test-results/PAC2-8241/manual/r1/ledger.md`
**Cleanup:** Done 03:29Z â€” `Configuration` â†’ `Delete` 2 template QA-AUTO (200), verify grid + Appointment Book 02/10 khĂ´ng cĂ²n
**Leftover Identifiers:** None. KhĂ´ng booking/patient data nĂ o Ä‘Æ°á»£c táº¡o; khĂ´ng Email/SMS gá»­i.

## Blockers and Warnings

- LOCATE/EXPLORE káº¿t luáº­n "DEV khĂ´ng cĂ³ `Time Range`" sai: (a) Configuration/Add Session cĂ³ `Time Range` dÆ°á»›i nhĂ£n `Frequency` (collapsed); (b) icon bĂºt chĂ¬ (button khĂ´ng cĂ³ accessible name) cĂ³ trĂªn header session QA-AUTO â†’ drawer cĂ³ `Time Range`. Session cĂ³ sáºµn Ä‘Ă£ xem khĂ´ng cĂ³ icon (cĂ³ thá»ƒ do booking â€” Inferred).
- ToĂ n bá»™ route document tráº£ 404 nhÆ°ng SPA render.
- Script automation máº¯c lá»—i chá»n option bulk á»Ÿ diag d1/d2 (khĂ´ng Ă¡p dá»¥ng type) â€” Ä‘Ă£ loáº¡i khá»i evidence, re-verify manual.

## Tester notes

[Khu vá»±c Ä‘Æ°á»£c báº£o vá»‡ - skill khĂ´ng ghi Ä‘Ă¨]
- **TC-007 blocker (2026-10-05):** Configuration Add Session `session_name` validation fail. DOM fill không trigger React onChange. Request body `"session_name":""` → 400 FST_ERR_VALIDATION. Prior agents 5x same failure. Tested: DOM assignment + dispatchEvent, ID locator fill. All show UI value, request empty. Requires manual tester setup session hoặc alternative creation path. Evidence: `test-results/PAC2-8241-TC-007-blocker-2026-10-05.md`.

