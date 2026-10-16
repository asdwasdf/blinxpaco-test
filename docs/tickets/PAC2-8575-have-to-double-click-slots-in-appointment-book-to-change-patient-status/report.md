# QA Report: PAC2-8575

**Input Revision:** 1
**Environment:** dev (feature-branch host `blinx.dev.blinxpaco-np.com`)
**Role:** `Blinx Deployment` (Johnny Bravo 2255, org `General Practice (Demo Site)`, location `test again - old location`)
**Run/Scope:** `manual-exec-20261015T162817Z` (2/7 TCs executed; 5/7 Blocked)
**Generated:** 2026-10-15T16:40:00.000Z
**Overall:** **Inconclusive** (partial coverage — TC-001+TC-002 Pass; TC-003..007 Blocked)

## Scope and Limitations

**In scope (tested):**
- Single click → Appointment Details sidebar open (TC-001)
- Double click benign regression (TC-002)
- Diagnostic on stale tab state (4 attempts in TC-001, identifies root cause as tab state not product data)

**Out of scope (blocked):**
- TC-003 Arrive transition end-to-end — cần QA-AUTO test patient với appointment future
- TC-004 Single click + arrive trigger — same blocker
- TC-005 Right-click context menu — exploratory, cùng blocker
- TC-006 Status transition khác (In consultation, No show, Cancelled) — same blocker
- TC-007 Cross-host behavior (production/mainline) — out of current scope

**Reason for blocker:** 6/6 booked slots trên branch host `pac2-8575` đều `isBeforeNow` (past appointments). Reception test data chỉ có future appointments ở mainline/dev chung, không promote qua branch. Tester cần setup QA-AUTO test data với appointment future trong session tương lai.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| TC-001 Single click mở sidebar | **Pass** | REQ-PAC2-8575-001 + REQ-PAC2-8575-002 (UX inference + OBS-PAC2-8575-001) | `evidence/manual-exec-eval-log.json` (TC-001 section); `manual-execution.md` TC-001 table | None / N/A |
| TC-002 Double click benign | **Pass** | REQ-PAC2-8575-001 (regression guard, OBS-PAC2-8575-002) | `evidence/manual-exec-eval-log.json` (TC-002 section); `manual-execution.md` TC-002 table | None / N/A |
| TC-003 Arrive transition end-to-end | **Blocked** | REQ-PAC2-8575-001/002 — cần QA-AUTO future booked | `test-cases.md` TC-003; `manual-execution.md` "Cases NOT executed" | None / N/A (no setup performed) |
| TC-004 Single click đủ (no double click) | **Blocked** | REQ-PAC2-8575-001 — same blocker | `test-cases.md` TC-004 | None / N/A |
| TC-005 Right-click context menu | **Blocked** | REQ-PAC2-8575-002 (OQ-035) | `test-cases.md` TC-005 | None / N/A |
| TC-006 Status transition khác | **Blocked** | REQ-PAC2-8575-002 (OQ-036) | `test-cases.md` TC-006 | None / N/A |
| TC-007 Cross-host behavior | **Blocked** | REQ-PAC2-8575-001 (OQ-037) | `test-cases.md` TC-007 | None / N/A |

## Product Result

| Test Case | Verdict | Note |
|---|---|---|
| TC-001 | Pass | Single click mở `Appointment Details sidebar`; slot class `appointment-booked` không mutate; `Mark as: Select Patient Status` chevron-down visible. Reception report "single click no-op" KHÔNG còn đúng trên branch host. |
| TC-002 | Pass | Double click native: sidebar mở cùng patient; `Booked 6→6`; không có modal/popover/toast ngoài sidebar. Reception report "double click arrive" KHÔNG còn đúng trên branch host (regression safe). |
| TC-003..007 | Blocked | Thiếu QA-AUTO test data future booked. |

**Product Result overall:** Reception report "double click arrive" no longer reproduces on branch host `pac2-8575`. Single click has new observable effect (sidebar opens) confirming fix is partially in place. However, arrive transition end-to-end not yet verified — pending QA-AUTO test data setup.

## Automation Verification

Không có automation specs tạo (skill `paco-playwright` mode `manual` không generate spec). 2 cases Pass đủ điều kiện `AUTOMATE` mode `generate` cho follow-up nếu cần.

**Recommendation:** Generate Playwright `.spec.ts` cho TC-001 + TC-002 trong follow-up session. TC-003..006 cần QA-AUTO data setup trước.

## Defects

**Không có defect confirmed** trong scope đã chạy. Theo skill rule: "Create defect only with clear expected basis, met precondition and verified product evidence. Otherwise record limitation/open question or `Inconclusive`."

- **TC-001 + TC-002 đều Pass** → không có defect.
- **TC-003..007 Blocked** → limitation/inconclusive, không phải defect.

`defects/` directory: không tạo (no defect to file).

## Blockers and Open Questions

**Blocker:** Thiếu QA-AUTO test data với appointment future trên branch host `pac2-8575`. Tester cần:
- Cung cấp QA-AUTO test patient name pattern (vd `QA-AUTO Arrive Test`)
- Hoặc cho phép setup tự động với mutation ledger

**Open Questions (inherited + new):**
- **OQ-035** (active): Arrive trigger cụ thể nằm ở đâu trong sidebar? `Select Patient Status` chevron-down không clickable. Possible triggers: right-click context menu, keyboard shortcut, drag, button arrive ẩn. Cần explore trong MANUAL_EXECUTE TC-005.
- **OQ-036** (active): Scope status transition ngoài `Arrive` (In consultation, No show, Cancelled). Cần test ở MANUAL_EXECUTE TC-006.
- **OQ-037** (active): Cross-host behavior (production/mainline) có còn double click arrive? Cần test ở MANUAL_EXECUTE TC-007.
- **OQ-038** (Partially Answered 2026-10-15): Data KHÔNG volatile; chỉ là stale tab state. 4 diagnostic attempts (TC-001 attempts 1-3: existing tab; 4: fresh tab) cho thấy cookie/date persistence per-tab gây ra `Booked 0` ở existing tab. Fresh tab vẫn trả `Booked 6`. **Automation cần fresh-tab context hoặc explicit session reload.**

## Video Coverage

Không có video evidence trong session này. (`paco-playwright` mode `manual` chỉ dùng inline `browser_evaluate` / `browser_run_code_unsafe` output.)

## Mutation Ledger and Durable Evidence

**Mutations performed:** 0

**Durable evidence promoted to `docs/tickets/PAC2-8575-have-to-double-click-slots-in-appointment-book-to-change-patient-status/evidence/`:**
- `manual-exec-eval-log.json` (sha256: `7bf0b5ed2de7842406ae21d1a03bfa57e566629118465d1cb73dfc1dff6cbe13`) — TC-001 + TC-002 inline browser output với 4 diagnostic attempts
- `explore-day-view-baseline.yml` (sha256: `8d126d438add6f156fb773d7b611251b342678996846f5a4df5177ed3cd1ecbf`) — Day view snapshot 16:05:25Z
- `explore-sidebar-snapshot.yml` (sha256: `a954a7e2087aa22f8e36bae0b8d4b5eeea2d28ea421705d15c23d232af891c33`) — Sidebar mở cho Mr Floy adhoc 16:08:22Z

**Raw test-results:** `test-results/PAC2-8575/explore/20261015T160530Z/`, `test-results/PAC2-8575/manual/manual-exec-20261015T162817Z/`

**Cleanup:** N/A — no mutations performed.

## Automation Decision

**Worth automating:**
- TC-001 Single click mở sidebar — Pass, scope test rõ, có thể encode thành `.spec.ts`
- TC-002 Double click benign regression — Pass, guard regression quan trọng

**Not worth automating now:**
- TC-003..006 — cần QA-AUTO data setup; setup complexity cao hơn giá trị regression test
- TC-007 — cross-host comparison; chỉ relevant nếu có multiple branches cần so sánh

**Recommend:** Generate Playwright `.spec.ts` cho TC-001 + TC-002 trong follow-up `AUTOMATE` mode `generate`. Page object: cần `AppointmentBookPage` với locators `.session-slot-button` (parent), `.appointment-slot.appointment-booked` (slot), `[aria-label="Appointment Details sidebar"]` (aside), `[aria-label="patient-status-button"]` (status chevron). Wait: `page.waitForTimeout(2500)` sau click + observable wait cho aside visible.

## Regression Recommendations

- **TC-001 + TC-002 nên thành regression spec** trong CI gate cho branch host `pac2-8575` (và mainline sau khi promote). Đảm bảo fix không regress.
- **TC-003 cần run trên data setup**: nếu team maintain QA-AUTO patient với appointment future trong test data, TC-003 có thể chạy daily để verify arrive transition end-to-end.

## Product Knowledge Proposals

Đã sync vào (theo skill yêu cầu Knowledge sync mandatory trước COMPLETE):

1. `docs/product/feature-map.md`:
   - Entry `Appointment Book — feature-branch route (PAC2-8575)`: `Last verified` → `2026-10-15T16:35:30Z`; `Logic chính` thêm 1 bullet (diagnostic note tab state); `Defect đã biết` section thêm (no defect confirmed; limit chưa confirm)
   - `Ticket → feature` row: phase `EXPLORE` → `MANUAL_EXECUTE`; status "partial coverage"

2. `docs/product/workflows/appointment-book.md`:
   - Section `### Single-click arrive (PAC2-8575)`: `Trạng thái` confirmed TC-001/TC-002 Pass + TC-003..007 Blocked; `Defect đã biết` update với diagnostic note stale tab state; `Open questions` update OQ-4 partially answered

3. `docs/product/open-questions.md`:
   - OQ-038 status → Partially Answered với answer (stale tab state, fresh tab vẫn có data)
   - OQ-035..037 giữ Open (chưa có data để answer)

4. `docs/product/change-log.md`: thêm entry 2026-10-15 (REPORT)

**Synced file checksums:**
- `docs/product/feature-map.md` (updated)
- `docs/product/workflows/appointment-book.md` (updated)
- `docs/product/open-questions.md` (updated)
- `docs/product/change-log.md` (updated)

## Sensitive Data Review

**Redacted:** Patient names `Mr Floy adhoc` (NHS 76835143), `Mrs MAJDIYYA FAWZIA DUAL`, `Mr Michael Ramella`, `Mr Sean Huynh` xuất hiện trong evidence. Tất cả là synthetic test patients (cùng pattern PAC2-8999 manual test 2026-10-15). NHS number 76835143 đã có sẵn trong workspace như test data fixture.

**Không có:** Auth credentials, tokens, cookies, browser auth state, real patient PII, clinical content, credential data.

**Do not share externally:** `evidence/` folder chứa raw eval log; OK cho internal ticket reference nhưng không commit vào public repo.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
