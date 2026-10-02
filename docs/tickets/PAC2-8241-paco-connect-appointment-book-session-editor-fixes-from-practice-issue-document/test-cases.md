# Test Cases: PAC2-8241

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-02

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-8241-001 | TC-006 | Field lock khi session có booking (Configuration drawer) | Lock `Time Range` không test được trên DEV (entry absent) |
| REQ-PAC2-8241-002 | TC-001 | Boundary error + không lưu slot invalid | Server-side reject chỉ assert gián tiếp (reload) |
| REQ-PAC2-8241-003 | TC-007 | Extend `Time Range` + giữ slot cũ | Blocked trên DEV |
| REQ-PAC2-8241-004 | TC-002, TC-003, TC-005 | Persist sau reopen + fresh reload | — |
| REQ-PAC2-8241-005 | TC-007 | Header/slot cập nhật ngay lần save đầu | Blocked trên DEV |
| REQ-PAC2-8241-006 | TC-002, TC-003 | Bulk/single slot type, Empty, Bookable, `Available` counter | — |
| REQ-PAC2-8241-007 | TC-005 | Cancel + re-book past slot persist sau reload | Phụ thuộc tạo được session quá khứ |

## Shared setup — QA-AUTO session

- **Environment:** dev `https://blinx.dev.blinxpaco-np.com` (DEV main); hostname guard bắt buộc.
- **Role:** `Super Admin GB`
- **Create:** `Configuration` → `Add` → `Add Session`: name `QA-AUTO-PAC2-8241-<YYYYMMDD-HHMM>`, `Timed Appts`, `Slot Duration` 10, slot type có sẵn (vd `Dermatology Clinic`), appointment book đang dùng (`111 PC24` hoặc book hiển thị session), 1 ngày, 08:00–16:00 nếu form cho phép.
- **Cleanup:** cancel booking (nếu có) → `Configuration` → `Archive`/`Delete` session QA-AUTO; verify không còn trong `Appointment Book` ngày đó; ghi leftovers vào ledger nếu fail.
- Không sửa/xóa session có sẵn (vd `8241 PF Test 01/10/2026`).

## Cases

### PAC2-8241-TC-001 — Slot vượt session end bị từ chối với message rõ và không lưu

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-8241-002, REQ-PAC2-8241-004
**Expected-result basis:** Confirmed — dev comment tony.do 2026-09-22 (`ticket.md`)
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md` path A
**Entry Path:** `Appointment Book` → Day (ngày session QA-AUTO) → right-click slot → `Edit Session` (modal `?preview=true`)
**Context:** Appointment book chứa session QA-AUTO
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Session QA-AUTO không booking, range 08:00–16:00 (hoặc range thực tế R)
**Test Data Category:** Self-created QA-AUTO session
**Test Data:** `QA-AUTO-PAC2-8241-*`
**Mutation Class:** Persistent (setup session); bước test kỳ vọng không lưu
**Approval Required:** No (approved scope 2026-10-02)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở modal `Edit Session`, scroll tới slot cuối | Slot cuối kết thúc tại end time R; footer `Session ends at: <end>` |
| 2 | Thử thêm/kéo dài/di chuyển slot ra sau end time | Toast `Error`: `Slots must sit inside the session (<start> to <end>). Change the session times first.` |
| 3 | `Save` (nếu enabled) hoặc `Close` | Không có slot ngoài range được lưu |
| 4 | Fresh reload trang, mở lại modal | Slots giữ nguyên như trước bước 2; không có phantom slot |

**Postconditions:** Session không đổi
**Cleanup:** Shared cleanup
**Automation:** Later — cần manual record locator thao tác add/resize slot
**Evidence:** TBD
**Execution History:** —

### PAC2-8241-TC-002 — Bulk đổi slot type persist sau reopen và fresh reload

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-8241-006, REQ-PAC2-8241-004
**Expected-result basis:** Confirmed (ticket comments FAILED 2026-09-21: slot types phải hiển thị đúng khi reopen) + Inferred (REQ-004 persist after reload)
**UI-dependent:** Yes
**Feature Location:** Confirmed — path A
**Entry Path:** như TC-001
**Context:** như TC-001
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Session QA-AUTO không booking
**Test Data Category:** Self-created QA-AUTO session
**Test Data:** slot type đích khác type hiện tại (vd `Test Billable`)
**Mutation Class:** Persistent
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | `Select All` → `Actions` → `SLOT TYPE` chọn type đích → panel `Save` | Mọi slot hiển thị type đích (pending), footer `Save will change N slots`, `Undo` |
| 2 | `Save` modal | Toast `Session updated successfully.`; dashboard slot hiển thị type đích |
| 3 | Reopen `Edit Session` | Mọi slot type đích; không stale |
| 4 | Fresh reload (F5), reopen | Vẫn type đích |

**Postconditions:** Slot type đổi
**Cleanup:** Shared cleanup
**Automation:** Yes sau manual Pass/Fail
**Evidence:** TBD
**Execution History:** —

### PAC2-8241-TC-003 — Single slot Empty/Non-bookable + bulk Bookable toggle và `Available` counter

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** REQ-PAC2-8241-006, REQ-PAC2-8241-004
**Expected-result basis:** Confirmed (ticket session-editing items: changes persist without revert) + Observed FB video 02:28–04:49 (procedure only)
**UI-dependent:** Yes
**Feature Location:** Confirmed — path A
**Entry Path:** như TC-001
**Context:** như TC-001
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Session QA-AUTO không booking; ghi lại `Available` ban đầu A0
**Test Data Category:** Self-created QA-AUTO session
**Test Data:** slot 1 (08:00), slot 2 (08:10)
**Mutation Class:** Persistent
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Slot 1 `⋯` → bỏ `Bookable` → panel Save; slot 2 `⋯` → `Empty Slot Type` | Slot 1 tag `NON-BOOKABLE`; slot 2 `Empty Slot` |
| 2 | `Save` modal | Toast success; dashboard slot 1 non-bookable, slot 2 `Empty Slot`; `Available` giảm tương ứng |
| 3 | Reopen modal, rồi fresh reload + reopen | State bước 2 giữ nguyên |
| 4 | `Select All` → bỏ `Bookable` → Save; rồi `Select All` → tick `Bookable` → Save | Lần 1 `Available` giảm hết số slot session; lần 2 tăng lại; reload giữ state cuối |

**Postconditions:** Slots bookable trở lại (trừ Empty)
**Cleanup:** Shared cleanup
**Automation:** Yes sau manual
**Evidence:** TBD
**Execution History:** —

### PAC2-8241-TC-005 — Cancel rồi re-book cùng slot past session persist sau reload

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** REQ-PAC2-8241-007, REQ-PAC2-8241-004
**Expected-result basis:** Confirmed — comment Sean Huynh 2026-09-22 Issue 1 + tony.do ✅ (`ticket.md`)
**UI-dependent:** Yes
**Feature Location:** Confirmed — path A (booking qua `Quick Book`/slot); Candidate cho cancel menu (`Cancel Appointment` trong slot context menu)
**Entry Path:** `Appointment Book` → Day (ngày quá khứ có session QA-AUTO) → slot → book / right-click → `Cancel Appointment`
**Context:** Appointment book chứa session QA-AUTO
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Session QA-AUTO có ngày đã qua (vd hôm qua). Nếu không tạo được session quá khứ → `Blocked`.
**Test Data Category:** Approved test patient
**Test Data:** patient `SEAN TEST QA TESTING`; `Email`/`SMS` confirmation + reminder **bỏ tick**
**Mutation Class:** Persistent (booking) + Temporary (cancel)
**Approval Required:** No (approved 2026-10-02); dừng nếu không bỏ tick được SMS/Email

| Step | Action | Expected Result |
|---|---|---|
| 1 | Book patient vào slot S (xác nhận cảnh báo past nếu có) | Toast `Appointment created successfully.`; slot S hiển thị patient |
| 2 | Cancel appointment slot S (`Cancel only`) | Toast `Appointment Cancelled`; slot S trống |
| 3 | Book lại patient vào slot S | Toast success; slot S hiển thị patient |
| 4 | Fresh reload | Slot S vẫn có appointment mới; không quay về state trước |

**Postconditions:** 1 appointment active trên slot S
**Cleanup:** Cancel appointment (`Cancel only`, không notify) → shared cleanup
**Automation:** Later (dữ liệu patient)
**Evidence:** TBD
**Execution History:** —

### PAC2-8241-TC-006 — Session có booking khóa field slot-structure, cho sửa Name

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** REQ-PAC2-8241-001
**Expected-result basis:** Confirmed — tony.do 2026-09-22 Issue 2
**UI-dependent:** Yes
**Feature Location:** Confirmed — path B (`Configuration` → `Actions` → `Edit`)
**Entry Path:** `Configuration` → search `QA-AUTO-PAC2-8241` → `Actions` → `Edit`
**Context:** Template/session QA-AUTO
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Session QA-AUTO có ≥1 booking (từ TC-005)
**Test Data Category:** Self-created QA-AUTO session + approved patient
**Test Data:** như TC-005
**Mutation Class:** None (chỉ quan sát disabled) — Persistent nếu thử đổi Name
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở drawer `Edit Session` | `Frequency`, `Slot Duration (min)`, `Session Type`, `Assigned Slot Types` (và `Time Range` nếu có) bị khóa |
| 2 | Kiểm tra `Session Name`, location, staff, split | Editable |
| 3 | `Cancel` | Không thay đổi |

**Postconditions:** Không đổi
**Cleanup:** —
**Automation:** Yes sau manual
**Evidence:** TBD
**Execution History:** —
**Notes:** Lock `Time Range` không assert được trên DEV (field absent) → ghi partial.

### PAC2-8241-TC-007 — Extend `Time Range` thêm default slots, giữ slot cũ, cập nhật ngay

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-8241-003, REQ-PAC2-8241-005
**Expected-result basis:** Confirmed — tony.do 2026-09-22 (extend Time Range) + Sean 2026-09-20 bullet 2
**UI-dependent:** Yes
**Feature Location:** Blocked — entry `Time Range` absent trên DEV (`exploration.md`)
**Entry Path:** FB-only: header session bút chì → `Edit Session` → `Time Range`
**Context:** Session QA-AUTO không booking
**Environment:** dev
**Role:** `Super Admin GB`
**Preconditions:** Entry `Time Range` tồn tại
**Test Data Category:** Self-created QA-AUTO session
**Test Data:** end 16:00 → 17:00
**Mutation Class:** Persistent
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Đổi `Hours (To)` 04:00 PM → 05:00 PM, `Save` một lần | Toast success; header `<start> - 17:00`; slot mới 16:00–17:00 hiển thị ngay; slot cũ giữ nguyên |
| 2 | Reload | Giữ nguyên |

**Postconditions:** Session range mở rộng
**Cleanup:** Shared cleanup
**Automation:** Blocked — location
**Evidence:** —
**Execution History:** Expected `Blocked` trên DEV

## Open Questions and Blockers

- DEV không có entry `Time Range` → TC-007 Blocked, TC-006 partial. Cần xác nhận FB đã merge lên DEV chưa.
- Tạo session ngày quá khứ có được không (TC-005)? Nếu không → TC-005 Blocked hoặc dùng slot đã qua giờ trong ngày hiện tại.
- `Add Session` form trên DEV chưa quan sát → field có thể khác shared setup.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
