# Requirements: PAC2-8998

**Input Revision:** 1
**Generated:** 2026-10-13
**Status:** Active

## Source Summary

Bug PBT-331: full-name patient search không trả về kết quả trong một số tình huống — gõ `First Last` chỉ tìm được ~95% bệnh nhân; `Surname, First` không tìm được; first name hai từ (`Mary Jane Smith`) không tìm được. Fix PR #7376 trên branch `feature-branch/pac2-8998` tokenise `,`/space và match mỗi từ với first/middle/surname ở bất kỳ thứ tự nào. Đồng thời cap top-bar dropdown và PDS panel ở 50 (max 100) để fix slowness tại site lớn. Tony đã verify 7/7 case Pass trên dev với test patient `Phoebe Eileen Smitham`; 15,000 patient prod ở 3 org verify thêm. Severity Critical, services Alder Hey, CAS, OOH, PCAS.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

No video/attachments in source folder. Source chỉ có 4 Jira comment từ Tony.

## Atomic Requirements

### REQ-PAC2-8998-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — tokenise query
**Search Terms/Aliases:** patient search, PDS, search patients
**Known Location:** `/paco/patient-search` (PACO Connect Patient Search page)
**Actor/Role:** Unknown (xem Open Question)
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing (no formal AC; tóm tắt từ Tony comment)

**Preconditions:**
- User đã đăng nhập PACO
- Có quyền truy cập Patient Search
- Patient tồn tại trong org

**Expected Behavior:**
Search box phải split query string thành các token bằng separator là dấu phẩy `,` hoặc khoảng trắng (một hoặc nhiều). Token rỗng do trailing/leading separator phải bị bỏ qua.

**Provenance:**
- **Source:** `ticket/PAC2-8998-pbt-331-patient-search-not-working-in-way-expected/ticket.md:45` (Tony 12/10 12:34, fix in progress)
- **Source:** `ticket.md:55-56` (PR #7376 decision: "a full-name search now finds a patient when every typed word appears in their first, middle or surname, in any order. Commas and extra spaces separate words")
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-001, TC-002, TC-003, TC-004
**Notes:** Confirmed qua Tony's wording; chưa manual-verify trên feature-branch.

---

### REQ-PAC2-8998-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — word-match against name fields
**Search Terms/Aliases:** full-name, multi-word match, any order
**Known Location:** `/paco/patient-search`
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- REQ-001 tokenise đã pass

**Expected Behavior:**
Mỗi token phải match với ít nhất một phần của first name, middle name, hoặc surname (substring/contains, không phân biệt thứ tự). Patient được trả về nếu TẤT CẢ các token đều match được (logical AND across tokens). Tên `James Paul Smith` tìm bằng `James Paul Smith`, `Smith James Paul`, hoặc `Paul, James Smith` đều trả về cùng patient.

**Provenance:**
- **Source:** `ticket.md:55-56`
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-001, TC-002, TC-003, TC-004, TC-005
**Notes:** Case-insensitive là Inferred (chưa Tony confirm). Middle name matching dựa trên bảng "Before/After" Tony liệt kê.

---

### REQ-PAC2-8998-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — two-word first name support
**Search Terms/Aliases:** two-word first name, multi-word first name, compound first name
**Known Location:** `/paco/patient-search`
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- REQ-001, REQ-002 đã pass
- Patient có first name gồm 2+ từ (vd `Mary Jane`)

**Expected Behavior:**
Search query `Mary Jane Smith` phải trả về patient có first name = `Mary Jane`, surname = `Smith`. Tony note: ~1-5% patients in scope có two-word first name (Alder Hey/Hillingdon/GP Health Partners).

**Provenance:**
- **Source:** `ticket.md:39-42` (Before-fix results table)
- **Source:** `ticket.md:61-62` (After-fix results table)
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-006
**Notes:** Dev test data `Phoebe Eileen Smitham` KHÔNG có two-word first name (Eileen là middle name). Cần Open Question xác nhận dev data có patient với two-word first name hay phải tạo mới.

---

### REQ-PAC2-8998-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — comma separator
**Search Terms/Aliases:** surname first format, last name comma
**Known Location:** `/paco/patient-search`
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- REQ-001, REQ-002 đã pass

**Expected Behavior:**
Query `Smith, James` phải trả về patient có surname `Smith` và first name `James` (cùng patient với `James Smith`).

**Provenance:**
- **Source:** `ticket.md:41` (Before-fix: "Not found for any patient")
- **Source:** `ticket.md:60` (After-fix: "Found → Pass")
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-002
**Notes:** Tony đã manual verify Pass trên feature-branch preview với `Smitham, Phoebe`.

---

### REQ-PAC2-8998-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — trailing separator during typing
**Search Terms/Aliases:** trailing space, empty token, typing in progress
**Known Location:** `/paco/patient-search`
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- REQ-001 tokenise đã pass

**Expected Behavior:**
Khi user đang gõ giữa chừng, trailing space (`phoebe `) hoặc trailing comma (`smitham,`) không được khiến search trả 0 kết quả. Patient phải được tìm thấy dựa trên token không rỗng.

**Provenance:**
- **Source:** `ticket.md:90-92` (feature-branch test 12/10 15:13)
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-007, TC-008
**Notes:** Confirmed bằng Tony's Pass.

---

### REQ-PAC2-8998-006

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Top-bar / dashboard global patient search — dropdown result cap
**Search Terms/Aliases:** top-bar search, dashboard search, global search, header search
**Known Location:** `/paco/dashboard` (top bar, control "Search patients by name or NHS number")
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- User đã đăng nhập PACO và ở dashboard hoặc bất kỳ trang nào có top bar
- Org có > 50 patient match query

**Expected Behavior:**
Top-bar patient search dropdown phải hiển thị tối đa 50 kết quả mỗi lần. Không bao giờ hiển thị > 100. Tổng số match vẫn phải được báo cáo (UI hint như "X of Y" hoặc tương đương — xem Open Question).

**Provenance:**
- **Source:** `ticket.md:72-73` (PR scope update 12/10 13:14: "returns at most one page of results at a time: 50 by default, never more than 100. The total number of matches is still reported.")
- **Source:** `ticket.md:80` ("the top-bar dropdown and the PDS search panels show the first 50 matches, not every match")
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-009, TC-010
**Notes:** Trước fix top-bar load mọi match (no limit) → lag. Dev site có 495k+ patients (xem `docs/product/survey/views/patient-search.md:43`). Dev đủ lớn để trigger cap bằng broad search như `name1` — Tony xác nhận "broad search `name1` → 50 results Pass".

---

### REQ-PAC2-8998-007

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search page result cap
**Search Terms/Aliases:** PDS panel cap, patient list cap
**Known Location:** `/paco/patient-search` (page-level results panel)
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- User đã đăng nhập
- Org có > 50 patient match query

**Expected Behavior:**
Patient Search page (không phải top-bar dropdown) hiển thị tối đa 50 kết quả mỗi lần, max 100. Tổng match vẫn báo cáo. Scope change này chỉ áp dụng top-bar dropdown và PDS panels; các list khác (My Patients, task/case lists) đã là paginated sẵn, không thay đổi.

**Provenance:**
- **Source:** `ticket.md:72-80`
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-011
**Notes:** Các list khác (`My Patients`, task/case) UNCHANGED — phải không regression. Theo `ticket.md:77-78`.

---

### REQ-PAC2-8998-008

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — no regression
**Search Terms/Aliases:** regression, existing behavior
**Known Location:** `/paco/patient-search` và top-bar
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- REQ-001, REQ-002 đã pass

**Expected Behavior:**
Mọi search case đã pass trước fix (`James Smith`, `Smith`, một phần tên, NHS number) phải tiếp tục pass sau fix. Không thêm regression.

**Provenance:**
- **Source:** `ticket.md:55` ("It still finds every patient it found before.")
- **Source:** `ticket.md:64-65` (15,000 patient prod: every name form now finds the patient)
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-012 (regression sweep: single first, single last, NHS number, ID)
**Notes:** Tony verify trên 15k prod patients.

---

### REQ-PAC2-8998-009

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Patient Search — no console/runtime errors
**Search Terms/Aliases:** error free, console clean
**Known Location:** `/paco/patient-search` và top-bar
**Actor/Role:** Unknown
**Inference Basis:** —
**Observation Context:** —
**Acceptance Criteria Status:** Missing

**Preconditions:**
- REQ-001, REQ-002 đã pass

**Expected Behavior:**
Search phải không throw exception, không in error/warning lên UI, không log error ra browser console.

**Provenance:**
- **Source:** `ticket.md:96-97` ("No errors on screen or in the console from search.")
- **Input Revision:** 1
- **First Recorded:** 2026-10-13
- **Last Verified:** 2026-10-13

**Evidence:** ticket.md only
**Related Tests:** TC-013
**Notes:** Áp dụng cho cả top-bar dropdown và Patient Search page.

---

## Ambiguities and Conflicts

### Disputed: Top-bar slowness scope
- `ticket.md:48-49` (comment 1): "the top-bar slowness is fixed in the same PR rather than in a separate ticket" — note riêng, không ở original bug.
- `ticket.md:72` (comment 3): "the top-bar slowness noted earlier is fixed in the same PR" — confirm cùng PR.

→ Hai comment nói cùng điều, không conflict thật. Tuy nhiên từ "separate issue" ở comment 1 vs "same PR" ở comment 3 có thể confuse người đọc. Ghi Open Question để confirm tester scope.

### Inferred: Case-insensitive matching
- Tony dùng `phoebe`, `Smitham` (mixed case) trong test → "Found" → implies case-insensitive.
- Tuy nhiên Tony không nói rõ "case-insensitive" trong decision. **Marked Inferred**.

### Inferred: Middle name present = required match
- Bảng Before/After của Tony có `James Paul Smith` (middle name) → Found before + after. Không rõ patient đó có middle name trong DB hay Tony assume.
- Decision chỉ nói "every typed word appears in their first, middle or surname" → middle name matching là Confirmed, nhưng có phải required match với existing middle name là Inferred.

---

## Open Questions

1. **Role nào access được Patient Search?** Ticket không ghi. Tester confirm Receptionist + Clinician + Admin đều OK, nhưng chưa manual-verify. Impact: REQ-001..009 phải verify trên từng role.
2. **Top-bar = global header search hay Rocket Bar (desktop app)?** Tony comment 1 gọi "top-bar search"; survey `rocket-bar.md` cho thấy Rocket Bar là desktop launcher. Có khả năng Tony refer tới global header search trên web (xem dashboard `Search patients by name or NHS number`). Cần manual-verify trong LOCATE. Impact: REQ-006, REQ-007.
3. **Total match count UI affordance.** Tony nói "total number of matches is still reported" — không rõ dạng nào (text "X of Y", counter, banner). Cần manual-verify.
4. **Dev data có patient với two-word first name không?** Dev có `Phoebe Eileen Smitham` (Eileen là middle). Tony nói "Not covered: a two-word first name (none in dev data; covered by the prod data check)". → Cần tạo data mới (mutation) hay chỉ verify trên prod data (không khả thi vì scope host = dev feature-branch). Có thể chấp nhận REQ-003 chỉ verify bằng prod 15k sweep (Tony) + unit-style. Impact: REQ-003.
5. **Broad search `name1` literal hay data mẫu?** Tony ghi "broad search `name1`" — có thể là data mẫu (literal name) hay là query "name1" literal. Cần manual-verify. Impact: REQ-006 cap test.
6. **Risk-score ordering changed?** Tony note "Patient risk-score ordering: Unchanged" — không thuộc scope fix nhưng nên regression-test. Impact: REQ-008.

## Tester notes
