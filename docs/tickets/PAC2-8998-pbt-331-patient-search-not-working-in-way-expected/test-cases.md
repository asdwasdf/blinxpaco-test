# Test Cases: PAC2-8998

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-13

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-001 tokenise | TC-001 | PDS page baseline | — |
| REQ-002 word-match any order, first/middle/surname | TC-002, TC-003, TC-004, TC-005 | PDS page (single-word first+last, middle+surname, multi-word incl middle) | — |
| REQ-003 two-word first name | TC-006 | PDS page | **No dev data; tester chose read-only → TC-006 skip_with_reason; covered by Tony's 15k prod sweep** |
| REQ-004 comma separator | TC-007 | PDS page | — |
| REQ-005 trailing separator while typing | TC-008, TC-009 | PDS page (trailing space + trailing comma) | — |
| REQ-006 top-bar dropdown cap 50 | TC-010 | Top-bar dropdown | — |
| REQ-007 PDS page cap 50 | TC-011 | PDS page (broad query) | — |
| REQ-008 no regression | TC-012 | PDS page (NHS, surname-only, partial name) | — |
| REQ-009 no console errors | TC-013 | both surfaces | — |

## Cases

### PAC2-8998-TC-001 — PDS page: tokenise comma + extra spaces

**Type:** Ticket validation
**Risk:** High
**Priority:** P0
**Requirements:** REQ-001
**Expected-result basis:** Confirmed (`ticket.md:55-56`)
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md` Patient Search page route
**Entry Path:** Authenticate → Patient Search sidebar icon (or URL `/paco/feature-branch/pac2-8998/patient-search`) → page-level `Search Patients...` textbox
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:**
- Logged in as Super Admin GB on `blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-8998/...`
- On Patient Search page, heading shows total patient count > 0
- Dev patient `PHOEBE EILEEN SMITHAM` exists in org (verified in EXPLORE)

**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM` (existing dev seed, no PII)
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click page-level `Search Patients...` textbox; type `phoebe  smitham` (two spaces between tokens) | Input visible in textbox; no auto-search yet |
| 2 | Press Enter (or wait for debounce if auto) | Heading updates to `Patient Search (1)`; grid shows 1 row for `PHOEBE EILEEN SMITHAM` (Ms, 27/09/1947, NHS 944 930 7539, Fetcham, Surrey) |

**Postconditions:** Patient grid shows 1 row; heading count = 1
**Cleanup:** None (read-only); clear textbox by clicking `Clear search` or selecting all + delete
**Automation:** Yes (TC-001 spec)
**Evidence:** `test-results/PAC2-8998/manual/r1/` (post-execute)
**Execution History:** (to be filled by `paco-playwright` MANUAL_EXECUTE)

---

### PAC2-8998-TC-002 — PDS page: first + last name

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-002
**Expected-result basis:** Confirmed (`ticket.md:55-56, 64-65`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `phoebe smitham` | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-003 — PDS page: middle + surname (no first name)

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-002 (middle name matching)
**Expected-result basis:** Confirmed (`ticket.md:60-62` "James Paul Smith (with middle name) Found")
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `Eileen Smitham` | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM, middle=`EILEEN`, surname=`SMITHAM`) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-004 — PDS page: full name including middle (any order)

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-002
**Expected-result basis:** Confirmed (`ticket.md:60-62`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `phoebe eileen smitham` | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-005 — PDS page: search by NHS number (non-name field)

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-002 (other fields) + REQ-008
**Expected-result basis:** Confirmed (Tony verified 15k prod data; search still finds by NHS)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** NHS `944 930 7539` (PHOEBE EILEEN SMITHAM)
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `9449307539` (no spaces) | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-006 — PDS page: two-word first name

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-003
**Expected-result basis:** Confirmed (`ticket.md:60-62`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:**
- Dev data KHÔNG có patient với 2-word first name (verified by Tony 12/10 15:13 và EXPLORE)
- Tester đã chọn read-only scope (không tạo data mới)

**Test Data Category:** seed
**Test Data:** N/A (no 2-word first name patient in dev data)
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | (N/A) Skip — không có test data phù hợp trên dev feature-branch | Result: **Skipped with reason** |

**Postconditions:** N/A
**Cleanup:** N/A
**Automation:** Blocked (no data → cannot automate without new test data; covered by Tony's 15k prod sweep)
**Evidence:** `exploration.md` notes
**Execution History:** Skipped
**Skip or Block Reason:** Dev feature-branch không có patient với 2-word first name; tester chọn read-only → không tạo data mới; Tony đã cover qua 15,000 patient prod sweep (`ticket.md:64-65`).

---

### PAC2-8998-TC-007 — PDS page: comma separator `Surname, First`

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-004
**Expected-result basis:** Confirmed (`ticket.md:60` After table)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `Smitham, Phoebe` | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-008 — PDS page: trailing space

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-005
**Expected-result basis:** Confirmed (`ticket.md:90-92`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `phoebe ` (trailing space) | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-009 — PDS page: trailing comma

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-005
**Expected-result basis:** Confirmed (`ticket.md:90-92`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:** `PHOEBE EILEEN SMITHAM`
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `smitham,` (trailing comma, no first name) | — |
| 2 | Press Enter | Heading `Patient Search (1)`; grid shows 1 row (PHOEBE EILEEN SMITHAM) |

**Postconditions:** 1 row
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-010 — Top-bar dropdown: cap 50 results

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-006
**Expected-result basis:** Confirmed (`ticket.md:72-73, 80`) + observed in EXPLORE (`exploration.md` top-bar dropdown)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Authenticate → on any page with top-bar (e.g. dashboard) → top-bar `Search patients by name or NHS number` textbox
**Context:** global header search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:**
- Top-bar visible
- Org has > 50 patients matching broad query (verified: `name1` literal matches 100+ in dev seed)

**Test Data Category:** seed
**Test Data:** query `name1` (literal dev seed pattern: `name{N} surname{N}`)
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click top-bar search textbox; type `name1` | Dropdown opens below textbox |
| 2 | Observe dropdown | Dropdown shows `Results (50)` label; exactly 50 patient items (not 51+); no infinite scroll, no full list |
| 3 | Verify item count rendered | 50 patient rows in dropdown DOM (count by row ref or by visible items) |

**Postconditions:** Top-bar dropdown still open; do not select any item
**Cleanup:** None (read-only); press Escape or click outside to close
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-011 — PDS page: cap 50 results (broad query)

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-007
**Expected-result basis:** Confirmed (`ticket.md:72-80`) — PDS panel cap 50
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** Org has > 50 patients matching broad query
**Test Data Category:** seed
**Test Data:** query `name1` literal
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear textbox; type `name1` | — |
| 2 | Press Enter | Heading `Patient Search (50)` (cap 50, not 51+); grid renders up to 50 rows; no infinite scroll beyond |

**Postconditions:** 50 rows visible; no more
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-012 — PDS page: regression (surname-only, partial, NHS)

**Type:** Regression
**Risk:** High
**Priority:** P1
**Requirements:** REQ-008
**Expected-result basis:** Confirmed (`ticket.md:55, 64-65`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:** as TC-001
**Test Data Category:** seed
**Test Data:**
- Query variants: `Smitham` (surname only), `Phoebe` (first only), `Smith` (partial surname → match), `944` (partial NHS)
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Sub-step 12a: type `Smitham` → Enter | Heading ≥ 1; PHOEBE EILEEN SMITHAM in results |
| 2 | Sub-step 12b: type `Phoebe` → Enter | Heading ≥ 1; PHOEBE EILEEN SMITHAM in results |
| 3 | Sub-step 12c: type `Smith` → Enter | Heading ≥ 1; PHOEBE EILEEN SMITHAM in results (partial surname match) |
| 4 | Sub-step 12d: type `944` → Enter | Heading ≥ 1; PHOEBE EILEEN SMITHAM in results (partial NHS match) |

**Postconditions:** each sub-step shows ≥ 1 match including PHOEBE EILEEN SMITHAM
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

### PAC2-8998-TC-013 — No console/runtime errors during search

**Type:** Smoke
**Risk:** Medium
**Priority:** P1
**Requirements:** REQ-009
**Expected-result basis:** Confirmed (`ticket.md:96-97`)
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** as TC-001
**Context:** patient search
**Environment:** dev (feature-branch)
**Role:** Super Admin GB
**Preconditions:**
- DevTools console open and cleared at start
- All previous TC pass

**Test Data Category:** seed
**Test Data:** as TC-002..009
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Clear console baseline; execute TC-001..TC-009 query sequence | Console shows no new error/warning caused by search |
| 2 | Execute TC-010 (top-bar `name1`) | Console shows no error/warning from search; pre-existing webchat 403 / phone-calling asset 404 OK |

**Postconditions:** Console state = baseline + pre-existing (no new search-related errors)
**Cleanup:** None
**Automation:** Yes
**Evidence:** TBD
**Execution History:** TBD

---

## Open Questions and Blockers

1. **Role access for Receptionist/Clinician**: TC-001..TC-013 designed với role Super Admin GB (theo tester confirm). Chưa manual-verify Receptionist/Clinician access. Nếu role khác bị block, tất cả TC fail với reason. Có thể kết thúc với Super Admin GB only nếu tester chấp nhận.
2. **TC-006 2-word first name**: skipped per tester read-only decision. Nếu sau muốn cover, cần tạo data mới (`QA-AUTO Two-Word`) qua `Create new patient` button. Hiện tại: blocked by data availability, not by capability.
3. **Auto-search vs Enter key**: chưa rõ PDS page textbox auto-searches on type hay cần Enter. EXPLORE dùng cả hai. TC explicit Enter để deterministic.

## Tester notes
