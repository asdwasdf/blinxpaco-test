# Manual Execution: PAC2-8575

**Input Revision:** 1
**Mode:** `manual` (paco-playwright)
**Environment:** dev (feature-branch host `blinx.dev.blinxpaco-np.com`)
**Role:** `Blinx Deployment` (Johnny Bravo 2255, org `General Practice (Demo Site)`, location `test again - old location`)
**Date Executed:** 2026-10-15T16:33:00Z — 16:35:30Z
**Run ID:** `manual-exec-20261015T162817Z`
**Tester:** Claude (acting as test executor) per `paco-playwright` skill mode `manual`
**Auth state:** Valid (login xong ở phase LOCATE; tab fresh 16:33Z reuses authenticated session)

## Cases executed

### PAC2-8575-TC-001 — Single click mở Appointment Details sidebar

**Verdict:** Pass

| Step | Action | Result |
|---|---|---|
| 1 | Navigate tới `/paco-connect/feature-branch/pac2-8575/appointment-book` | Day view render: `Sessions 23` / `Booked 6` / `Available 1,018` / `15 October 2026` |
| 2 | Identify patient slot `Mr Floy adhoc` 15:00-15:10 (NHS 76835143, synthetic) | Slot visible tại `.appointment-slot.appointment-booked` |
| 3 | Single click lên slot parent `.session-slot-button` | `Appointment Details sidebar` mở; text chứa `Appointment` / `Mr Floy adhoc` / `NHS Number: 76835143` / `Mark as: Select Patient Status` / `PACO Assist` / `Slot Count:` / `Reason Code(s):` / `Booking Notes:` |
| 4 | Verify slot class không mutate | floy class vẫn `appointment-slot ... appointment-booked`; `floyIsArrived: false`; `Booked` count 6→6 |

**Diagnostic attempts (4 total, min 3):**
- Attempt 1: navigate in existing tab → precondition FAIL (`Booked 0`). Data issue: tab state stale.
- Attempt 2: navigate Next 5 days (17-21 Oct 2026) → all 5/5 dates `Booked 0 / Total 0` (no sessions). Confirms issue không phải date.
- Attempt 3: navigate control path `/paco-connect/feature-branch/pac2-9001/appointment-book` → cũng `Booked 0 / Total 1793` (cross-branch confirms data issue không phải location).
- Attempt 4: open fresh tab via `browser_tabs new` + navigate → `Booked 6 / Total 1024 / 15 October 2026` (matches EXPLORE OBS-003). PASS.

**Evidence:**
- `test-results/PAC2-8575/manual/manual-exec-20261015T162817Z/tc-001-001-baseline.yml` (initial failed attempt)
- `test-results/PAC2-8575/manual/manual-exec-20261015T162817Z/tc-001-002-fresh-tab-baseline.yml` (fresh tab baseline)
- Inline `browser_run_code_unsafe` output 2026-10-15T16:34:29Z

**Sensitive Data Review:** Redacted. `Mr Floy adhoc` NHS 76835143 là synthetic test patient (cùng pattern PAC2-8999 manual test 2026-10-15). 5 booked slots còn lại không reveal trong evidence.

**Consistency with Explore:** Stable. Single click → sidebar open đã được observe ở EXPLORE OBS-PAC2-8575-001 (16:08Z). Manual execution (16:34Z) confirm.

---

### PAC2-8575-TC-002 — Double click KHÔNG mutate status (regression guard)

**Verdict:** Pass

| Step | Action | Result |
|---|---|---|
| 1 | Same tab, route preserved | Day view còn, `Booked 6` |
| 2 | Note `Booked 6` summary before | Count = 6 |
| 3 | Native double click lên slot parent `Mr Floy adhoc` (Playwright `page.locator(...).dblclick()`) | Aside mở cho cùng patient; no mutation |
| 4 | Verify `Booked` count unchanged | 6→6 (no count change) |
| 5 | Verify không có modal/popover ngoài sidebar | aside là side effect duy nhất |

**Diagnostic attempts:** 0 (succeeded on first attempt; preconditions đã có từ TC-001).

**Evidence:** Inline `browser_run_code_unsafe` output 2026-10-15T16:35:19Z — `before{bookedCount:6, floyClass:'appointment-booked', modals:0}` → `after{bookedCount:6, floyClass:'appointment-booked', floyIsArrived:false, asideOpen:true, asideText matches Mr Floy}`.

**Sensitive Data Review:** Redacted (same as TC-001).

**Consistency with Explore:** Stable. Double click benign đã observe ở EXPLORE OBS-PAC2-8575-002. Manual confirm.

## Cases NOT executed (blocked)

| Case | Reason |
|---|---|
| PAC2-8575-TC-003 (arrive transition end-to-end) | Cần QA-AUTO test patient với appointment future. Trên branch host hiện tại, 6/6 booked slots đều `isBeforeNow` (past). Tester cần setup data với appointment trong tương lai. |
| PAC2-8575-TC-004 (single click đủ, không cần double click) | Same blocker như TC-003. Cần future booked data. |
| PAC2-8575-TC-005 (right-click context menu) | Same blocker. Exploratory; có thể chạy trên existing past slots nhưng less useful. |
| PAC2-8575-TC-006 (status transition khác ngoài Arrive) | Same blocker. |
| PAC2-8575-TC-007 (cross-host behavior) | Out of current scope; recommend separate session. |

## Mutation summary

- **Mutations performed:** 0
- **Data created:** 0
- **Data modified:** 0
- **Data deleted:** 0
- **Cleanup required:** false
- **Leftovers:** []

## Recommended next phase

`AUTOMATE` (mode `generate`) cho TC-001 + TC-002 (đều Pass → encode vào spec Playwright). TC-003..007 cần MANUAL_EXECUTE tiếp với QA-AUTO test data (ngoài scope hiện tại). Hoặc `REPORT` phase nếu tester chấp nhận partial coverage.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
