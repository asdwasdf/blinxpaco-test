---
name: test-cases
description: Test cases cho PAC2-7727 - PACO Connect Access Denied Booking Error (regression on dev)
metadata:
  type: ticket
  input_revision: 1
  design_maturity: Explored
  generated: 2026-10-16
---

# Test Cases: PAC2-7727

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-16

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-7727-001 (Entry point DFD) | TC-001 | Smoke entry | - |
| REQ-PAC2-7727-002 (Scheduler landing) | TC-002 | Smoke scheduler load | Token hợp lệ cần Comms Hub |
| REQ-PAC2-7727-003 (Patient context) | TC-002, TC-005 | Observed | Verify trên video evidence |
| REQ-PAC2-7727-004 (Link Error defect) | TC-002, TC-003, TC-004 | Defect scope | Cần JWT token thật (OQ-039 cản trở generate) |
| REQ-PAC2-7727-005 (Recovery path) | TC-004 | Recovery | Cần JWT token thật |
| REQ-PAC2-7727-006 (PACO Connect exception) | TC-006 | Process gate | - |

## Cases

### PAC2-7727-TC-001 — DFD Config page loads từ PACO Configuration sidebar

**Type:** Smoke
**Risk:** Low
**Priority:** P0 (blocker cho toàn bộ test)
**Requirements:** REQ-PAC2-7727-001
**Expected-result basis:** `Observed` (PAC2-7727/feature-location.md, exploration.md O-1)
**UI-dependent:** Yes
**Feature Location:** Confirmed (`docs/tickets/PAC2-7727-paco-connect-access-denied-booking-error/feature-location.md`)
**Entry Path:** `PACO dashboard` → sidebar `Configuration` icon → submenu `Patient` → item `DFD`
**Context:** global (organisation-level)
**Environment:** dev (`blinx.dev.blinxpaco-np.com`)
**Role:** clinic
**Preconditions:**
- Đã đăng nhập PACO dev với role clinic
- Location đã chọn (vd: `test again`)

**Test Data Category:** none (read-only navigation)
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở `https://blinx.dev.blinxpaco-np.com/paco/dashboard` | Load dashboard thành công |
| 2 | Click icon `Configuration` ở sidebar | Navigate tới `/paco/configuration/organisation/general`, hiện Configuration tree |
| 3 | Click submenu `Patient` | Tree expand, hiện các item con: `DFD`, `Care Navigation`, `Bulk Import` |
| 4 | Click item `DFD` | Navigate tới `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config`, title `DFD Config`, render org-chart các campaign DFD |

**Postconditions:** Page ở DFD Config, không có state thay đổi
**Cleanup:** N/A (read-only)
**Automation:** Yes (locus ổn định, entry path đã verified)
**Evidence:** `docs/tickets/PAC2-7727-paco-connect-access-denied-booking-error/feature-location.md`
**Execution History:** -

---

### PAC2-7727-TC-002 — Scheduler landing page load OK với booking link có JWT hợp lệ

**Type:** Regression (smoke)
**Risk:** High
**Priority:** P0
**Requirements:** REQ-PAC2-7727-002, REQ-PAC2-7727-003
**Expected-result basis:** `Observed` (video PAC2-7727/video-notes.md steps 2-4, exploration.md O-2)
**UI-dependent:** Yes
**Feature Location:** Confirmed (TC-001 verified route; scheduler host là external — bước 2 trở đi)
**Entry Path:** Mở booking link từ campaign DFD trong tab mới
**Context:** patient-self-booking (external host)
**Environment:** dev (`dev.blinxscheduler-np.com` cho scheduler; `blinx.dev.blinxpaco-np.com` cho PACO)
**Role:** clinic (PACO side) + patient (scheduler side, không cần auth)
**Preconditions:**
- TC-001 passed
- Đã generate được booking link từ campaign DFD (cần giải OQ-039 — entry "Copy DFD link")
- Có patient test data QA-AUTO (tạo từ PACO Patient Search nếu chưa có)

**Test Data Category:** QA-AUTO patient fixture (non-PII)
**Test Data:** Patient name `QA-AUTO Test Patient`, NHS number auto-generated, DOB random
**Mutation Class:** Persistent (tạo patient QA-AUTO) — cần approved scope theo duyệt 2026-10-01
**Approval Required:** Yes (full quyền test đã duyệt)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Từ DFD Config (TC-001), copy booking link của campaign test | URL có dạng `https://dev.blinxscheduler-np.com/patient-self-booking/#eyJhbG...` (JWT trong fragment) |
| 2 | Mở link trong incognito tab mới | Trang scheduler `Request an appointment` load trong ≤5s, không có error page |
| 3 | Quan sát header | Patient context hiển thị đúng: name, NHS No, DOB match với patient test |
| 4 | Quan sát các control | Button `Send Secure Code` enabled; privacy notice visible nếu có |

**Postconditions:** Scheduler session active với patient pre-fill; không tạo record persistent ngoài patient fixture
**Cleanup:** Không cần (scheduler không lưu state nếu chưa qua Send Secure Code)
**Automation:** Yes (sau khi generate link path ổn định)
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 30s
**Execution History:** -

---

### PAC2-7727-TC-003 — Reproduce defect `Link Error / No token found` tại transition scheduler → web form (intermittent)

**Type:** Defect validation (intermittent)
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-7727-004
**Expected-result basis:** `Observed` (video step 3, exploration.md D-1)
**UI-dependent:** Yes
**Feature Location:** Confirmed (TC-001, TC-002)
**Entry Path:** Mở link có JWT hợp lệ (giống TC-002) trong incognito
**Context:** patient-self-booking → web-form transition
**Environment:** dev
**Role:** patient
**Preconditions:**
- TC-002 passed (link có JWT hợp lệ đã verify load OK scheduler page)
- Có 3 link mới generate (mỗi lần test 1 link riêng để tránh cache)

**Test Data Category:** QA-AUTO patient fixture
**Test Data:** 3 booking links riêng biệt cho cùng patient
**Mutation Class:** None (chỉ quan sát)
**Approval Required:** No (read-only)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở link #1 trong incognito | Scheduler page load OK, sau ~10–30s có thể gặp `Link Error / "No token found"` (defect) hoặc auto-transition sang web form |
| 2 | Nếu gặp `Link Error`: capture URL exact, exact error text, timestamp | Record: URL, error text `No token found. Your link may have expired — please use the most recent link your healthcare team sent you.`, time-to-error |
| 3 | Đợi thêm ~30s tại error page | Check xem có auto-recovery sang `https://dev.blinxscheduler-np.com/web-form/?wf=...` không |
| 4 | Đóng tab, mở link #2 trong incognito mới | Lặp lại step 1–3, record kết quả |
| 5 | Đóng tab, mở link #3 trong incognito mới | Lặp lại step 1–3, record kết quả |
| 6 | Tổng hợp: 3 lần, đếm số lần gặp `Link Error` | Nếu ≥1/3 gặp → defect intermittent còn tồn tại trên dev hiện tại → Fail. Nếu 0/3 → đã fix → Pass. Nếu 2/3 hoặc 3/3 không ổn định → Inconclusive. |

**Postconditions:** Có evidence `Link Error` reproduce hay không
**Cleanup:** N/A
**Automation:** Yes (intermittent → cần chạy nhiều lần, có diagnostic spec)
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 60s
**Execution History:** -

---

### PAC2-7727-TC-004 — Verify recovery path từ `Link Error` sang web form

**Type:** Regression (recovery)
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-7727-005
**Expected-result basis:** `Observed` (video step 4-7, exploration.md O-2)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Mở link có JWT hợp lệ
**Context:** patient-self-booking → web-form recovery
**Environment:** dev
**Role:** patient
**Preconditions:**
- TC-003 reproduce được `Link Error` ít nhất 1/3 lần
- DevTools Network tab mở sẵn để capture request

**Test Data Category:** QA-AUTO patient fixture
**Test Data:** 1 booking link + DevTools Network log
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở link có JWT trong incognito + bật DevTools Network tab | Bắt đầu capture request |
| 2 | Nếu gặp `Link Error`, quan sát Network requests | Identify request nào fail (401/403) hoặc thiếu Authorization header |
| 3 | Quan sát Console log | Capture JS error liên quan JWT parsing nếu có |
| 4 | Đợi ~30s | Check xem có request nào tới `dev.blinxscheduler-np.com/web-form/?wf=...` không (auto-recovery) |
| 5 | Nếu recovery thành công: check patient context | Greeting `Hi <name>`, NHS No. hiển thị đúng → patient context nguyên vẹn |
| 6 | Nếu recovery fail (vẫn ở `Link Error`): đóng tab, mở lại link trong incognito mới | Check xem có pass ở attempt thứ 2 không (transient) |

**Postconditions:** Có Network/Console log làm diagnostic evidence
**Cleanup:** N/A
**Automation:** Yes (diagnostic spec — intermittent case)
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 90s
**Execution History:** -

---

### PAC2-7727-TC-005 — Patient context persistence qua transition scheduler → web form

**Type:** Regression (data integrity)
**Risk:** Medium
**Priority:** P1
**Requirements:** REQ-PAC2-7727-003
**Expected-result basis:** `Observed` (video step 2 vs step 4, exploration.md O-2)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Mở link có JWT hợp lệ
**Context:** patient-self-booking
**Environment:** dev
**Role:** patient
**Preconditions:**
- TC-002 passed
- Patient test data QA-AUTO đã tạo với identifier rõ ràng (NHS number riêng)

**Test Data Category:** QA-AUTO patient fixture
**Test Data:** Patient name `QA-AUTO Booking Error Test`, NHS number ghi rõ
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở link có JWT trong incognito | Scheduler page load với patient `QA-AUTO Booking Error Test`, NHS number đúng |
| 2 | Quan sát 3 fields: Name, NHS No, DOB | Tất cả khớp với patient test data |
| 3 | Nếu xảy ra `Link Error` rồi recovery sang web form: check greeting `Hi <name>` | Name hiển thị đúng, không bị mất context |
| 4 | Check NHS No. hiển thị trên web form header | NHS No. khớp với patient test |
| 5 | Nếu context bị mất (blank) → bug data loss | Record defect với evidence |

**Postconditions:** N/A
**Cleanup:** N/A
**Automation:** Yes
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 30s, @ 90s
**Execution History:** -

---

### PAC2-7727-TC-006 — Workflow gate: PACO Connect ticket test on dev (process rule)

**Type:** Process gate
**Risk:** Low
**Priority:** P2
**Requirements:** REQ-PAC2-7727-006
**Expected-result basis:** `Confirmed` (ticket.md comment 4, Priscilla Hancock 2026-08-19)
**UI-dependent:** No
**Feature Location:** Not applicable (process rule, không phải UI)
**Entry Path:** N/A
**Context:** N/A
**Environment:** dev (theo rule)
**Role:** QA process
**Preconditions:** Ticket thuộc PACO Connect scope
**Test Data Category:** none
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Verify ticket title/scope có chứa "PACO Connect" | Pass — title `PACO Connect - Access Denied Booking Error` |
| 2 | Theo rule, test trên dev (không cần pre-prod/staging) | Confirm đúng — em đang test trên dev |
| 3 | Regression flow vẫn phải qua đủ phase | Pass — đang theo workflow chuẩn |

**Postconditions:** Process rule acknowledged
**Cleanup:** N/A
**Automation:** No (process rule, không cần script)
**Evidence:** `ticket.md` lines 45-47
**Execution History:** -

---

## Open Questions and Blockers

- **OQ-039 (blocker cho TC-002, TC-003, TC-004, TC-005):** Entry "Copy DFD link" không tìm thấy ở level root campaign trong DFD Config hiện tại. Cần explore thêm hoặc dùng Comms Hub workflow để có link thật.
  - Affected cases: TC-002, TC-003, TC-004, TC-005
  - Workaround tạm: dùng Comms Hub → Campaign Manager → Quick Send → Outbox `Resend` để có link có JWT
  - Action: dispatch subagent hoặc manual explore DFD Config kỹ hơn trước MANUAL_EXECUTE

- **OQ-1 (từ requirements):** Sean nói "fail" không rõ scope. Inferred scope: defect transition `Link Error / No token found`. Cần confirm với Sean trước khi close ticket.

- **Patient test data (QA-AUTO):** Chưa có sẵn. Cần tạo 1 patient QA-AUTO để generate link. Theo safety policy đã duyệt 2026-10-01, OK với host dev.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
