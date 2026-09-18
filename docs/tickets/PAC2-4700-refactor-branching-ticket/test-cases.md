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
| REQ-PAC2-4700-001, REQ-PAC2-4700-007 | TC-006 | Campaign sort A-Z base vs branch parity | OS/GP sort parity vẫn chưa test |
| REQ-PAC2-4700-001 | TC-007 | Header DOB intermittent display | Cần sample thêm để xác nhận tỉ lệ tái lập |
| REQ-PAC2-4700-001 | TC-008 | Patient Reply icon misroute | Cần BA confirm expected behavior |
| REQ-PAC2-4700-001, REQ-PAC2-4700-004 | TC-009 | Save Campaign disabled trên branch | Cần re-verify + dev xác nhận nguyên nhân |
| REQ-PAC2-4700-001 | TC-011 | Contact Details Add/Delete Number | Chưa test trên branch |
| REQ-PAC2-4700-001 | TC-012 | Search all tabs không filter | Chưa test trên branch |
| N/A (Exploratory) | TC-013 | Escape đóng cả dialog | Cần BA/Dev confirm by-design hay bug |
| REQ-PAC2-4700-001, REQ-PAC2-4700-005 | TC-014 | Email dropdown Add/Edit/Delete UI | Chưa test Save thật, chưa test branch |
| REQ-PAC2-4700-001, REQ-PAC2-4700-005 | TC-015 | Copy to Email/Templates/Button/Resources/Merge Fields | Chưa test branch |
| REQ-PAC2-4700-009 | TC-016 | Significant Info sweep toàn category | Chưa test branch |

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

---

### PAC2-4700-TC-006 — Quick Send Campaign Sort A-Z: Base dev vs Branch parity

**Type:** Regression / Cross-environment comparison
**Risk:** Low
**Priority:** P3
**Requirements:** REQ-PAC2-4700-001, REQ-PAC2-4700-007
**Expected-result basis:** Observed — matched first-five ordering on both environments
**UI-dependent:** Yes
**Feature Location:** Confirmed — Dashboard → Search patient → Consent & Actions `+` → Quick Send → Campaign → (click to change) → sort dropdown
**Entry Path:**
1. Navigate to Dashboard (base: `/paco-connect/`; branch: `/paco-connect/feature-branch/pac2-4700-qs-only/`)
2. Search patient "Michael Ramella" (NHS 70986)
3. Click `+` → Quick Send → Campaign → (click to change) → sort dropdown → A-Z
**Context:** Campaign / global
**Environment:** dev (base) and `pac2-4700-qs-only` (branch)
**Role:** `Super Admin GB`
**Preconditions:** Authenticated on both environments; patient exists identically on both (shared DB, not branch-isolated)
**Test Data Category:** Non-sensitive (campaign names)
**Test Data:** Campaign list, sort option A-Z
**Mutation Class:** Temporary (sort UI state only)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở Campaign selector trên base, chọn sort A-Z | First five: `6 July - Test Case 1`, `6 July - Test Case 3`, `7-feb-general-camp`, `Access kp`, `Blinx Advice` |
| 2 | Lặp lại trên branch | First five giống hệt base |
| 3 | So sánh tổng số campaign | Base có ~1600+ (pagination "Show more"); branch chỉ 30 — khác biệt do data volume, không phải bug |

**Postconditions:** Sort state A-Z active trên cả 2 dialog, không lưu gì
**Cleanup:** Đóng dialog không Save/Send
**Automation:** Later — cần data ổn định để assert list
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — PASS (base và branch khớp nhau, không có regression)

---

### PAC2-4700-TC-007 — Quick Send Header DOB display (intermittent)

**Type:** Bug investigation
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-4700-001
**Expected-result basis:** Observed — DOB hiện `Unknown (Unknown)` 2/3 lần mở trên base, đúng 1/3; branch đúng 2/2 lần
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send dialog header
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send
**Context:** Patient header / global
**Environment:** dev (base) và `pac2-4700-qs-only` (branch)
**Role:** `Super Admin GB`
**Preconditions:** Patient NHS 70986 có DOB thật `15/03/2024`
**Test Data Category:** Non-sensitive
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở Quick Send cho patient trên base nhiều lần liên tiếp | DOB phải luôn hiện đúng `15/03/2024 (2 years old)` |
| 2 | Quan sát thực tế | 2/3 lần hiện `Unknown (Unknown)`, 1/3 lần đúng — có vẻ race condition khi fetch patient detail trước khi render |
| 3 | Lặp lại trên branch | 2/2 lần đúng, không tái lập bug |

**Postconditions:** Không thay đổi gì
**Cleanup:** Không cần
**Automation:** Blocked — cần xác định rate tái lập trước khi viết assertion ổn định
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — INCONCLUSIVE (bug candidate, cần sample thêm để xác nhận tỉ lệ)

---

### PAC2-4700-TC-008 — Quick Send Patient Reply icon misroutes to Health Forms

**Type:** Bug
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-4700-001
**Expected-result basis:** Observed — tái lập 2/2 lần trên cả base và branch
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send dialog header, icon "Patient Reply" (chat bubble)
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → click icon Patient Reply
**Context:** Campaign / global
**Environment:** dev (base) và `pac2-4700-qs-only` (branch)
**Role:** `Super Admin GB`
**Preconditions:** Quick Send dialog đang mở ở tab Campaign
**Test Data Category:** N/A
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Từ tab Campaign, click icon Patient Reply (góc phải header) | Kỳ vọng: mở panel/preview patient reply |
| 2 | Quan sát thực tế | Thực tế: tab tự động nhảy sang **Health Forms**, không mở patient reply |
| 3 | Lặp lại trên branch | Hành vi giống hệt |

**Postconditions:** Đang ở tab Health Forms
**Cleanup:** Không cần (không mutation)
**Automation:** Later — cần BA confirm expected behavior của Patient Reply trước khi viết assertion
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — FAIL trên cả base và branch (bug pre-existing, không phải regression riêng branch)

---

### PAC2-4700-TC-009 — Quick Send Save Campaign: Base dev vs Branch parity

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-4700-001, REQ-PAC2-4700-004
**Expected-result basis:** Observed — Save hoạt động trên base, bị disable trên branch
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send dialog, icon Save (sidebar)
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → chọn campaign → click icon Save
**Context:** Campaign / global
**Environment:** dev (base) và `pac2-4700-qs-only` (branch)
**Role:** `Super Admin GB`
**Preconditions:** Campaign "6 July - Test Case 1" đã được chọn ở tab Campaign
**Test Data Category:** Non-sensitive
**Test Data:** Campaign đã chọn sẵn
**Mutation Class:** None thực hiện (đã Cancel dialog Save Campaign trên base; branch không mở được dialog)
**Approval Required:** No (chỉ verify UI state, không xác nhận Update/Save as New thật)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Trên base, click icon Save | Mở dialog "Save Campaign" (Save as New / Update existing) |
| 2 | Cancel dialog | Đóng, không mutation |
| 3 | Lặp lại trên branch (cùng campaign, cùng tab context) | Icon Save có vẻ disabled — click 2 lần không phản hồi, không mở dialog |

**Postconditions:** Không lưu gì trên cả 2 môi trường
**Cleanup:** Không cần
**Automation:** Blocked — cần dev xác nhận nguyên nhân Save bị disable trên branch trước khi automate
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — PASS trên base, **FAIL trên branch** (regression candidate — cần re-verify thêm 1 lần trước khi báo chính thức)

---

### PAC2-4700-TC-011 — Contact Details: Add/Delete Number

**Type:** Functional
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-4700-001
**Expected-result basis:** Observed — Add new number lưu thành công, chọn lại số gốc phục hồi đúng
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send → icon 👁 → Patient Information → Contact Details → Number dropdown
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → icon 👁 → Number dropdown → Add new number
**Context:** Patient detail / global
**Environment:** dev (base) — chưa test branch
**Role:** `Super Admin GB`
**Preconditions:** Patient NHS 70986 có số gốc `07379060817`
**Test Data Category:** Non-sensitive (số điện thoại test `07700900123`, Type: Home)
**Test Data:** `07700900123`
**Mutation Class:** Persistent (đã thực hiện và cleanup)
**Approval Required:** Yes — đã có approval từ tester trong session này

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click dropdown Number | Hiện list số hiện có, mỗi số có icon 🗑️ Delete + role tag, và "+ Add new number" |
| 2 | Click "Add new number", nhập `07700900123`, Type `Home`, Save | Toast "Mobile Contact saved successfully"; số mới thành primary hiển thị |
| 3 | Mở lại dropdown, chọn lại số gốc `07379060817` | Primary number phục hồi về số gốc |
| 4 | Search lại patient (fresh, server-side) | Số hiển thị đúng là `07379060817`, không còn leftover `07700900123` trong list |

**Postconditions:** Contact number giống trạng thái ban đầu
**Cleanup:** Đã thực hiện và verify — không cần thêm
**Automation:** Later — cần môi trường test riêng, không nên automate trên patient data thật
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — PASS (base), cleanup verified; branch chưa test

---

### PAC2-4700-TC-012 — Patient Information: "Search all tabs..." không filter

**Type:** Bug
**Risk:** Low
**Priority:** P3
**Requirements:** REQ-PAC2-4700-001
**Expected-result basis:** Observed — gõ từ khóa khớp data thật nhưng không có phản hồi nào
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send → icon 👁 → Patient Information → "Search all tabs..." (dưới Contact Details, trên Personal Info/Significant Info)
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → icon 👁 → gõ vào "Search all tabs..."
**Context:** Patient detail / global
**Environment:** dev (base) — chưa test branch
**Role:** `Super Admin GB`
**Preconditions:** Patient có data thật trong Significant Info (Test Results: "O/E - blood pressure reading")
**Test Data Category:** Non-sensitive
**Test Data:** Từ khóa `blood`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Gõ `blood` vào "Search all tabs..." | Kỳ vọng: filter/highlight category hoặc item chứa "blood" (Test Results → "O/E - blood pressure reading") |
| 2 | Quan sát danh sách category (Personal Info, Significant Info) | Thực tế: không đổi gì — vẫn hiện đầy đủ category, không lọc, không highlight, không auto-expand |
| 3 | Nhấn Enter | Không có thay đổi thêm |

**Postconditions:** Không thay đổi gì
**Cleanup:** Không cần
**Automation:** Later — cần dev xác nhận search box có chức năng filter hay chỉ là placeholder chưa nối logic
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — FAIL trên base (chưa test branch)

---

### PAC2-4700-TC-013 — Quick Send: Escape đóng cả dialog thay vì chỉ đóng dropdown con

**Type:** Bug / UX observation
**Risk:** Low
**Priority:** P4
**Requirements:** N/A (side effect observation)
**Expected-result basis:** Observed — tái lập khi đang mở dropdown Merge Fields
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send dialog, dropdown "Merge Fields" (icon `+` trong khung soạn nội dung)
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → Campaign → icon `+` → Merge Fields → nhấn Esc
**Context:** Campaign / global
**Environment:** dev (base) — chưa test branch
**Role:** `Super Admin GB`
**Preconditions:** Dropdown Merge Fields đang mở
**Test Data Category:** N/A
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở dropdown Merge Fields, nhấn Esc | Kỳ vọng: chỉ đóng dropdown Merge Fields, dialog Quick Send vẫn mở |
| 2 | Quan sát thực tế | Thực tế: đóng luôn toàn bộ dialog Quick Send, mất draft đang soạn (nếu chưa Save) |

**Postconditions:** Dialog đóng, không lưu draft
**Cleanup:** Không cần (chưa nhập nội dung thật)
**Automation:** Later — cần BA/Dev xác nhận đây là by-design hay bug UX
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — OBSERVED trên base (chưa test branch); có thể gây mất draft nếu người dùng vô tình bấm Esc

---

### PAC2-4700-TC-014 — Contact Details: Email dropdown (Add/Edit/Delete UI)

**Type:** Functional
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-4700-001, REQ-PAC2-4700-005
**Expected-result basis:** Observed — dropdown Email có đầy đủ list + Add new email modal giống Number
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send → icon 👁 → Patient Information → Contact Details → Email dropdown
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → icon 👁 → Email dropdown
**Context:** Patient detail / global
**Environment:** dev (base) — chưa test branch
**Role:** `Super Admin GB`
**Preconditions:** Patient có nhiều email lịch sử (ben.castley@..., mike.wong@..., abbi.russell@..., santhosh.nithya.ragava..., darcio.massala@...), primary Email đang trống
**Test Data Category:** Non-sensitive
**Test Data:** N/A (chỉ mở modal Enter Email, không Save)
**Mutation Class:** None (đã Cancel modal, không Save)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click dropdown Email | Hiện list email cũ, mỗi email có icon 🗑️ Delete, và "+ Add new email" |
| 2 | Click "+ Add new email" | Mở modal "Enter Email" (Email + Type: Home) với nút Save/Cancel |
| 3 | Cancel | Đóng modal, không mutation |

**Postconditions:** Email primary vẫn trống như trước
**Cleanup:** Không cần
**Automation:** Later — cần môi trường test riêng nếu muốn test Save thật (giống pattern TC-011)
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — PASS trên base (UI only, chưa test Save thật và chưa test branch)

---

### PAC2-4700-TC-015 — Campaign compose: Copy to Email, Templates, Button, Resources, Merge Fields

**Type:** Functional
**Risk:** Low
**Priority:** P3
**Requirements:** REQ-PAC2-4700-001, REQ-PAC2-4700-005
**Expected-result basis:** Observed — tất cả control hoạt động đúng, không lỗi
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send → Campaign → compose area (toolbar dưới khung soạn)
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → Campaign
**Context:** Campaign / global
**Environment:** dev (base) — chưa test branch
**Role:** `Super Admin GB`
**Preconditions:** Campaign "6 July - Test Case 1" đã chọn
**Test Data Category:** Non-sensitive
**Test Data:** N/A
**Mutation Class:** None (chỉ mở dialog, đã Cancel/đóng tất cả, không Insert Button, không Use Template)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click icon `+` trong khung soạn | Hiện "Merge Fields" và "Virtual Consult Link" |
| 2 | Click "Merge Fields" | Dropdown hiện đúng field list (First Name, Last Name, DOB, Mobile, NHS, Address, City, State/Province, Postal Code) |
| 3 | Click "Send as" Email icon | Toggle bị disabled do patient không có email primary (khớp finding cũ trong ticket) |
| 4 | Click "Copy to Email" | Chuyển nội dung SMS sang email template đầy đủ (logo Blinx, toolbar rich text, Subject, Copy to SMS, Resources, Button, Templates) |
| 5 | Click "Button" | Mở "Button Builder" (Button Text/URL, Shape, Color, Advanced Options, Preview) — Cancel |
| 6 | Click "Templates" | Mở "Email Templates Library" (14 template) — đóng không Use Template |
| 7 | Click "Resources" | Mở "Healthcare Resources" (NHS/Diabetes/Heart, mỗi link có `+`/copy/external icon) — đóng không insert |

**Postconditions:** Nội dung compose vẫn ở trạng thái sau Copy to Email (không Save/Send)
**Cleanup:** Không cần (chưa Save/Send)
**Automation:** Later — cần data ổn định để assert field list và template list
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — PASS trên base (chưa test branch)

---

### PAC2-4700-TC-016 — Significant Info: sweep toàn bộ category

**Type:** Functional / Data presence sweep
**Risk:** Low
**Priority:** P4
**Requirements:** REQ-PAC2-4700-009
**Expected-result basis:** Observed — Allergies và Test Results có data thật, các mục khác rỗng
**UI-dependent:** Yes
**Feature Location:** Confirmed — Quick Send → icon 👁 → Patient Information → Significant Info
**Entry Path:** Dashboard → Search "Michael Ramella" → `+` → Quick Send → icon 👁 → Significant Info → mở từng category
**Context:** Patient detail / global
**Environment:** dev (base) — chưa test branch
**Role:** `Super Admin GB`
**Preconditions:** N/A
**Test Data Category:** Non-sensitive
**Test Data:** N/A
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở PACO Registers | Rỗng (`-`) |
| 2 | Mở Allergies | Có data: "Drug side effect - acceptable to patient", Effective Date `07/04/2009` |
| 3 | Mở Active Medications | Rỗng |
| 4 | Mở Past Medications | Rỗng |
| 5 | Mở Appointments | Rỗng |
| 6 | Mở Active Problems | Rỗng |
| 7 | Mở Significant Past Problems | Rỗng |
| 8 | Mở Test Results | Có data: "O/E - blood pressure reading" |

**Postconditions:** Không thay đổi gì
**Cleanup:** Không cần
**Automation:** Later — cần data ổn định trước khi assert presence/absence từng category
**Evidence:** `test-results/PAC2-4700/execute/20260918-quicksend-base-vs-branch/summary.json`
**Execution History:** 2026-09-18 — PASS trên base (chưa test branch)

## Open Questions and Blockers

| ID | Question | Blocker | Owner |
|----|----------|---------|-------|
| OQ-1 | Scheduler popup trigger condition là gì? | Yes — cần BA confirm expected behavior | BA/PO |
| OQ-2 | Reviewer auto-add có phải expected behavior? | Yes — cần confirm hay fix | BA/PO |
| OQ-3 | Health Form blank preview là bug hay expected? | Yes — cần verify form có content | Dev |
| OQ-4 | Sort A-Z parity OS/GP vs Connect? | No — OS/GP chưa test | QA |
| OQ-5 | Scheduler popup persistence đúng hay bug? | Yes — cần confirm dismiss behavior | BA/Dev |
| OQ-6 | Header DOB "Unknown" trên base — race condition thật hay do infra/network session này? | No — cần sample thêm | Dev |
| OQ-7 | Patient Reply icon lẽ ra phải mở gì? Health Forms navigation là bug hay mislabel? | Yes — cần BA confirm | BA |
| OQ-8 | Vì sao Save bị disable trên branch pac2-4700-qs-only mà base hoạt động bình thường? | Yes — regression candidate cần dev điều tra | Dev |
| OQ-10 | "Search all tabs..." trong Patient Information có chức năng filter không, hay chỉ là placeholder chưa nối logic? | Yes — cần dev xác nhận | Dev |
| OQ-11 | Esc đóng cả Quick Send dialog khi đang mở dropdown con — by-design hay bug UX? | Yes — cần BA/Dev confirm | BA/Dev |

## Automation Summary

| Case | Automation | Reason |
|------|------------|--------|
| TC-001 Sort A-Z | Later | Cần verify OS/GP parity; data stability |
| TC-002 Save Validation | No | Mutation Persistent; cần manual approval |
| TC-003 Health Form Preview | Later | Blank state behavior chưa confirm là bug |
| TC-004 Reviewer Auto-add | No | Side effect cần BA confirm; mutation Persistent |
| TC-005 Scheduler Popup | Blocked | Trigger và expected behavior chưa confirm |
| TC-006 Sort A-Z base vs branch | Later | Cần verify OS/GP; data stability |
| TC-007 Header DOB intermittent | Blocked | Cần xác nhận tỉ lệ tái lập trước khi automate |
| TC-008 Patient Reply misroute | Later | Cần BA confirm expected behavior |
| TC-009 Save disabled trên branch | Blocked | Regression candidate, cần dev điều tra nguyên nhân |
| TC-011 Contact Details Add/Delete Number | Later | Cần môi trường test riêng, không automate trên patient thật |
| TC-012 Search all tabs không filter | Later | Cần dev xác nhận search box có logic filter hay chưa nối |
| TC-013 Escape đóng cả dialog | Later | Cần BA/Dev confirm by-design hay bug UX |
| TC-014 Email dropdown Add/Edit/Delete UI | Later | Cần môi trường test riêng nếu test Save thật |
| TC-015 Copy to Email/Templates/Button/Resources/Merge Fields | Later | Cần data ổn định để assert field/template list |
| TC-016 Significant Info sweep | Later | Cần data ổn định trước khi assert presence/absence |

## Tester notes

[Protected area]
