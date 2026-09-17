# Test Cases: PAC2-4700

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-09-17T20:30:00+07:00

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-4700-001 | TC-001, TC-005 | Cross-app UI consistency (campaign sort) | Sort parity chưa test OS/GP |
| REQ-PAC2-4700-002 | TC-003, TC-005 | Attachments/booking-link controls | Scheduler popup trigger unclear |
| REQ-PAC2-4700-007 | TC-001 | Campaign sorting | OS/GP sort parity chưa verify |
| REQ-PAC2-4700-013 | TC-005 | Scheduler-link popup | Trigger và expected behavior chưa confirm |
| REQ-PAC2-4700-009 | TC-003 | Health Form empty preview | Attachments behavior OS vs Connect |
| N/A (Exploratory) | TC-002, TC-004 | Save validation, Reviewer auto-add | Side effect observation |

## Cases

### PAC2-4700-TC-001 — Campaign Sort A–Z

**Type:** Smoke / Regression
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-4700-001, REQ-PAC2-4700-007
**Expected-result basis:** Confirmed — Sort A-Z hoạt động đúng (OBS-PAC2-4700-024)
**UI-dependent:** Yes
**Feature Location:** Confirmed — PACO Connect `/paco-connect/feature-branch/pac2-4700-qs-only/` → Dashboard → Campaign selector
**Entry Path:**
1. Navigate to PACO Connect Dashboard
2. Open Campaign selector (Booking Links & Health Forms)
**Context:** Campaign / global
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Preconditions:**
- Authenticated as `Super Admin GB` trên PACO Connect feature branch
- Dashboard loaded, không có campaign selected
**Test Data Category:** Non-sensitive (test campaign names)
**Test Data:** Campaign list với mixed dates; sort options: `By date (descending)`, `By date (ascending)`, `By message type`, `A–Z`, `Z–A`
**Mutation Class:** Temporary (chỉ thay đổi UI sort state, không persist)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở Campaign selector | Dropdown hiển thị danh sách campaign với sort default `By date (descending)` |
| 2 | Chọn sort `A–Z` | Danh sách reorder theo alphabet: `6 July - Test Case 1`, `6 July - Test Case 3`, `7-feb-general-camp`, ... |
| 3 | Quan sát first item | First item bắt đầu bằng chữ cái đầu alphabet (A) |

**Postconditions:** Campaign selector vẫn mở; sort state `A–Z` active
**Cleanup:** Chọn sort khác hoặc đóng selector
**Automation:** Later — cần stable campaign data; sort options trên OS/GP chưa verify parity
**Evidence:** `IMG-17.png` (Connect A-Z sort)
**Execution History:** 2026-09-17 — PASS (Connect only)

---

### PAC2-4700-TC-002 — Campaign Save Validation (Duplicate Name)

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-4700-001
**Expected-result basis:** Confirmed — Duplicate name error bắt đúng (OBS-PAC2-4700-035)
**UI-dependent:** Yes
**Feature Location:** Confirmed — PACO Connect → Dashboard → Campaign selector → Save as New
**Entry Path:**
1. Navigate to PACO Connect Dashboard
2. Open Campaign selector
3. Chọn "Save as New"
**Context:** Campaign / global
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Preconditions:**
- Authenticated as `Super Admin GB`
- Có campaign `NEW TEST CAMPAIGN` đã tồn tại (từ session trước)
**Test Data Category:** Non-sensitive (test campaign name)
**Test Data:** Campaign name `NEW TEST CAMPAIGN` (đã tồn tại)
**Mutation Class:** Persistent (tạo campaign mới)
**Approval Required:** Yes — mutation Persistent

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở Save Campaign modal (Save as New) | Modal "Save Campaign" hiện với field `Campaign name` và `Patient Facing Name` |
| 2 | Điền cả 2 field với `NEW TEST CAMPAIGN` | Input nhận giá trị |
| 3 | Click Save | Error toast: `An email template with this name already exists. Please choose another name and try again.` |
| 4 | Đóng modal, chọn tên khác | Save thành công: `New campaign created` |

**Postconditions:** Campaign mới được tạo hoặc error hiển thị nếu duplicate
**Cleanup:** Xóa campaign test nếu tạo thành công
**Automation:** No — mutation Persistent; cần manual approval
**Evidence:** `IMG-27.png`, `IMG-28.png`, `IMG-29.png`
**Execution History:** 2026-09-17 — PASS (validation hoạt động đúng)

---

### PAC2-4700-TC-003 — Health Form Preview Empty State

**Type:** Exploratory / Regression
**Risk:** Medium
**Priority:** P3
**Requirements:** REQ-PAC2-4700-002, REQ-PAC2-4700-009
**Expected-result basis:** Observed — "14 Dec patient dynamic by mike" render blank (OBS-PAC2-4700-028)
**UI-dependent:** Yes
**Feature Location:** Confirmed — PACO Connect → Dashboard → Health Forms tab → select health form
**Entry Path:**
1. Navigate to PACO Connect Dashboard
2. Click tab Health Forms (badge `2`)
3. Select health form "14 Dec patient dynamic by mike"
**Context:** Health Form / global
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Preconditions:**
- Authenticated as `Super Admin GB`
- Health Forms tab có available forms
**Test Data Category:** Non-sensitive (health form template)
**Test Data:** Health form "14 Dec patient dynamic by mike"
**Mutation Class:** None (preview only)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click Health Forms tab | Tab active, hiển thị list: `Sleep Ap`, `Sleep Ap`, `14 Dec patient dynamic by mike` |
| 2 | Preview "14 Dec patient dynamic by mike" | Preview panel hiển thị form content hoặc "File Upload" placeholder nếu empty |
| 3 | Quan sát preview content | Không render blank; có data hoặc clear empty state message |

**Postconditions:** Preview panel hiển thị health form content
**Cleanup:** Select health form khác hoặc close preview
**Automation:** Later — empty state behavior chưa confirm là bug hay expected
**Evidence:** `IMG-21.png` (blank preview observed)
**Execution History:** 2026-09-17 — FAIL (blank preview observed)

---

### PAC2-4700-TC-004 — Health Form Reviewer Auto-add Toast

**Type:** Exploratory
**Risk:** Low
**Priority:** P4
**Requirements:** N/A (side effect observation)
**Expected-result basis:** Inferred — Side effect: user tự động được add làm reviewer (OBS-PAC2-4700-027)
**UI-dependent:** Yes
**Feature Location:** Confirmed — PACO Connect → Dashboard → Health Forms tab
**Entry Path:**
1. Navigate to PACO Connect Dashboard
2. Click Health Forms tab
**Context:** Health Form / global
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Preconditions:**
- User không phải default reviewer của any health form
**Test Data Category:** N/A
**Test Data:** N/A
**Mutation Class:** Persistent (adds user as reviewer)
**Approval Required:** Yes — mutation Persistent; side effect cần confirm expected behavior

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click Health Forms tab | Toast hiển thị: `You were added as a Health Form reviewer due to there being no default reviewers.` |
| 2 | Verify user được add | Reviewers list của health form có user hiện tại |

**Postconditions:** User là reviewer của health form
**Cleanup:** Manual remove user khỏi reviewer list
**Automation:** No — side effect behavior cần BA confirm expected; persistent mutation
**Evidence:** `IMG-20.png` (toast observed)
**Execution History:** 2026-09-17 — OBSERVED (toast hiện; chưa confirm expected hay bug)

---

### PAC2-4700-TC-005 — Scheduler Link Required Popup Behavior

**Type:** Exploratory
**Risk:** Unknown
**Priority:** P3
**Requirements:** REQ-PAC2-4700-002, REQ-PAC2-4700-013
**Expected-result basis:** Observed — Popup persistent trên nhiều screenshot (OBS-PAC2-4700-012..036), trigger chưa rõ
**UI-dependent:** Yes
**Feature Location:** Candidate — PACO Connect → Campaign → Booking Links
**Entry Path:**
1. Navigate to PACO Connect Dashboard
2. Open Campaign selector
3. Chọn campaign có booking link
**Context:** Campaign / Booking Link
**Environment:** dev (`pac2-4700-qs-only`)
**Role:** `Super Admin GB`
**Preconditions:**
- Authenticated as `Super Admin GB`
- Có campaign với booking link configured
**Test Data Category:** Non-sensitive
**Test Data:** Campaign có scheduler/booking link
**Mutation Class:** Unknown (popup behavior chưa xác minh)
**Approval Required:** Yes — trigger/persistence chưa rõ

| Step | Action | Expected Result |
|---|---|---|
| 1 | Chọn campaign | Nếu campaign có booking link configured → scheduler popup xuất hiện |
| 2 | Interact với popup | Popup có thể dismiss hoặc cần action |
| 3 | Verify persistent behavior | Popup không tự động dismiss khi chuyển tab |

**Postconditions:** Popup state
**Cleanup:** Dismiss popup nếu xuất hiện
**Automation:** Blocked — trigger condition và expected behavior chưa BA confirm
**Evidence:** IMG-05..IMG-29 (popup observed across session screenshots)
**Execution History:** 2026-09-17 — INCONCLUSIVE (popup persistent nhưng trigger unknown)

## Open Questions and Blockers

| ID | Question | Blocker | Owner |
|----|----------|---------|-------|
| OQ-1 | Scheduler popup trigger condition là gì? | Yes — cần BA confirm expected behavior | BA/PO |
| OQ-2 | Reviewer auto-add có phải expected behavior? | Yes — cần confirm hay fix | BA/PO |
| OQ-3 | Health Form blank preview là bug hay expected? | Yes — cần verify form có content | Dev |
| OQ-4 | Sort A-Z parity OS/GP vs Connect? | No — OS/GP chưa test | QA |
| OQ-5 | Scheduler popup persistence đúng hay bug? | Yes — cần confirm dismiss behavior | BA/Dev |

## Automation Summary

| Case | Automation | Reason |
|------|------------|--------|
| TC-001 Sort A-Z | Later | Cần verify OS/GP parity; data stability |
| TC-002 Save Validation | No | Mutation Persistent; cần manual approval |
| TC-003 Health Form Preview | Later | Blank state behavior chưa confirm là bug |
| TC-004 Reviewer Auto-add | No | Side effect cần BA confirm; mutation Persistent |
| TC-005 Scheduler Popup | Blocked | Trigger và expected behavior chưa confirm |

## Tester notes

[Protected area]
