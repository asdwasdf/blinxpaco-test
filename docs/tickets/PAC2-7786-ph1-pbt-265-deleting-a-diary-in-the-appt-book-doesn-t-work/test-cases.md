# Test Cases: PAC2-7786

**Input Revision:** 1  
**Design Maturity:** Explored  
**Generated:** 2026-10-01

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-7786-001 | PAC2-7786-TC-001 | Xóa session mới, đủ điều kiện, không booking | Cần tạo dữ liệu riêng trong execution |
| REQ-PAC2-7786-002 | PAC2-7786-TC-002 | Từ chối xóa session có booking và không báo success giả | Exact UI message chưa được quy định |
| REQ-PAC2-7786-003 | PAC2-7786-TC-003 | Xóa archived/removed session đủ điều kiện | Cần xác nhận entry action trên row test riêng |
| REQ-PAC2-7786-004 | PAC2-7786-TC-004 | Confirmation trước mutation; cancel giữ nguyên dữ liệu | Copy/dialog type chưa được quy định |
| REQ-PAC2-7786-005 | PAC2-7786-TC-005 | Availability của `Delete Session` và `Block Session` | Product rule đang `Disputed`; case chỉ thu thập trạng thái, không phán định Pass/Fail |

## Cases

### PAC2-7786-TC-001 — Xóa session mới không có booking

**Type:** Ticket validation  
**Risk:** Critical  
**Priority:** P0  
**Requirements:** REQ-PAC2-7786-001  
**Expected-result basis:** Confirmed — `ticket.md:13`, `ticket.md:40-48`, `ticket.md:81-99`, `ticket.md:135-139`  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`  
**Entry Path:** Feature-branch `/dashboard` → `Appointment Book` → `Appointment Settings` → feature-branch `/configuration`  
**Context:** Session configuration, `Active`  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB`  
**Preconditions:** Runtime hostname guard passes; authenticated role can manage sessions; no pre-existing record is modified.  
**Test Data Category:** Run-owned appointment-book session  
**Test Data:** Session name prefix `QA-AUTO-PAC2-7786-TC001-<run-id>`; future bounded date range; no patient/booking; dedicated test appointment book/location/slot type selected from approved non-PII test data.  
**Mutation Class:** Destructive  
**Approval Required:** No repeated prompt in `MANUAL_EXECUTE`; execution-first scope applies. Runtime destructive guard and ledger required.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tạo session test theo data trên và lưu identifier vào ledger. | Session xuất hiện trong configuration, không có booking. |
| 2 | Mở row action của đúng session test. | Action xóa phù hợp được hiển thị; nếu không có, ghi observed menu và dừng case theo diagnostic policy. |
| 3 | Bắt đầu action xóa và xác nhận. | Hệ thống không báo success trước confirmation; sau xác nhận, thao tác hoàn tất không lỗi. |
| 4 | Search theo identifier trong `Active` và `Removed`, rồi refresh. | Session đủ điều kiện không còn tồn tại trong configuration sau khi xóa thành công. |

**Postconditions:** Session test không tồn tại; không ảnh hưởng session có sẵn.  
**Cleanup:** Xóa session test là hành vi chính. Nếu case dừng trước xóa, cleanup bằng đúng session identifier; verify qua search sau refresh. Cleanup fail phải ghi leftover identifier đã redact.  
**Automation:** Yes — route/landmarks confirmed; cần locator association row/action được xác minh trong manual execution.  
**Evidence:** `requirements.md`; `feature-location.md`; `exploration.md`; execution evidence pending  
**Execution History:** Chưa chạy

### PAC2-7786-TC-002 — Từ chối xóa session có booked appointment

**Type:** Ticket validation / Regression  
**Risk:** Critical  
**Priority:** P0  
**Requirements:** REQ-PAC2-7786-002  
**Expected-result basis:** Confirmed — `ticket.md:111-129`  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`  
**Entry Path:** Feature-branch `/dashboard` → `Appointment Book` → `Appointment Settings` → feature-branch `/configuration`  
**Context:** Session configuration plus appointment booking for run-owned data  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB`  
**Preconditions:** Runtime guards pass; safe booking setup exists without real-patient PII; session and booking belong to run.  
**Test Data Category:** Run-owned session and synthetic/test booking  
**Test Data:** `QA-AUTO-PAC2-7786-TC002-<run-id>` with at least one booked appointment using approved synthetic/test patient context.  
**Mutation Class:** Destructive  
**Approval Required:** No repeated prompt in `MANUAL_EXECUTE`; destructive guard, safe synthetic data, ledger and cleanup required.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tạo session test và ít nhất một booked appointment an toàn. | Session có booking count tối thiểu 1; setup được ghi ledger. |
| 2 | Mở action xóa của session test và confirm. | Hệ thống từ chối xóa; không hiển thị thông báo success giả. |
| 3 | Quan sát failure UI và trạng thái row sau refresh. | Failure rõ ràng; session và booked appointment vẫn tồn tại. Basis kỹ thuật yêu cầu `SESSION_HAS_BOOKINGS` cùng booking count, nhưng exact user-facing copy không bị hard-code. |

**Postconditions:** Session/booking vẫn tồn tại sau refusal cho tới cleanup.  
**Cleanup:** Hủy/xóa booking test trước, sau đó xóa session test; verify cả hai không còn. Cleanup fail ghi leftovers đã redact.  
**Automation:** Later — blocked cho tới khi có safe synthetic booking setup và locator booking path bền.  
**Evidence:** `requirements.md`; execution evidence pending  
**Execution History:** Chưa chạy

### PAC2-7786-TC-003 — Xóa archived/removed session đủ điều kiện

**Type:** Ticket validation / Regression  
**Risk:** High  
**Priority:** P0  
**Requirements:** REQ-PAC2-7786-003  
**Expected-result basis:** Confirmed — `ticket.md:127-129`  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`  
**Entry Path:** Feature-branch `/dashboard` → `Appointment Book` → `Appointment Settings` → `/configuration` → `Removed`  
**Context:** Session configuration, archived/removed state  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB`  
**Preconditions:** Run-owned session exists, has no bookings/references, and can be moved to archived/removed state without touching existing data.  
**Test Data Category:** Run-owned archived session  
**Test Data:** `QA-AUTO-PAC2-7786-TC003-<run-id>`; no bookings; dedicated test dependencies.  
**Mutation Class:** Destructive  
**Approval Required:** No repeated prompt in `MANUAL_EXECUTE`; destructive guard and ledger required.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tạo session test, rồi dùng supported action để đưa session vào archived/removed state. | Session xuất hiện trong `Removed` và không có booking/reference blocker. |
| 2 | Mở action menu của đúng row test trong `Removed`. | Có đường xóa session archived/removed; nếu không có, ghi menu và dừng trước action khác. |
| 3 | Thực hiện xóa và confirm. | Archived state không gây HTTP/UI 500 và không tự làm thao tác thất bại. |
| 4 | Search cả `Removed` và `Active`, rồi refresh. | Session không còn tồn tại sau successful deletion. |

**Postconditions:** Session test không tồn tại.  
**Cleanup:** Hành vi chính là cleanup. Nếu bị chặn, thử restore rồi xóa chỉ khi nằm trong approved case scope; nếu vẫn fail, ghi leftover identifier.  
**Automation:** Later — cần manual xác minh exact archive/delete entry action và row association.  
**Evidence:** `requirements.md`; `exploration.md` (đã quan sát toggle `Removed` và `Restore`); execution evidence pending  
**Execution History:** Chưa chạy

### PAC2-7786-TC-004 — Confirmation xảy ra trước mutation và cancel giữ nguyên session

**Type:** Regression  
**Risk:** Critical  
**Priority:** P0  
**Requirements:** REQ-PAC2-7786-004  
**Expected-result basis:** Confirmed — `ticket.md:157-161`  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`  
**Entry Path:** Feature-branch `/dashboard` → `Appointment Book` → `Appointment Settings` → feature-branch `/configuration`  
**Context:** Run-owned active session linked to run-owned appointment book  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB`  
**Preconditions:** Run-owned eligible session exists and is visible in appointment book/configuration.  
**Test Data Category:** Run-owned session  
**Test Data:** `QA-AUTO-PAC2-7786-TC004-<run-id>`; no bookings.  
**Mutation Class:** Destructive  
**Approval Required:** No repeated prompt in `MANUAL_EXECUTE`; destructive guard and ledger required.

| Step | Action | Expected Result |
|---|---|---|
| 1 | Search session test và ghi trạng thái trước action. | Session tồn tại trong appointment book/configuration. |
| 2 | Bắt đầu remove/delete nhưng chưa confirm. | Confirmation xuất hiện trước khi session bị remove; trạng thái nền chưa đổi. |
| 3 | Chọn cancel/close confirmation. | Session vẫn tồn tại và còn liên kết như trước sau refresh. |
| 4 | Lặp lại action, lần này confirm. | Mutation chỉ xảy ra sau confirmation; session biến mất theo REQ-PAC2-7786-001. |

**Postconditions:** Session test đã xóa sau bước confirm cuối; cancel không gây mutation.  
**Cleanup:** Hành vi confirm cuối cleanup session. Nếu test dừng sau cancel, xóa session bằng scoped cleanup; verify search sau refresh.  
**Automation:** Yes — sau manual xác minh dialog locator và observable pre-confirm state.  
**Evidence:** `requirements.md`; video provenance trong `requirements.md`; execution evidence pending  
**Execution History:** Chưa chạy

### PAC2-7786-TC-005 — Ghi nhận availability của `Delete Session` và `Block Session`

**Type:** Exploratory / Ticket validation  
**Risk:** High  
**Priority:** P1  
**Requirements:** REQ-PAC2-7786-005  
**Expected-result basis:** Confirmed but `Disputed` — `ticket.md:145-155`; chưa có product decision xác định coexist/replace rule  
**UI-dependent:** Yes  
**Feature Location:** Confirmed — `feature-location.md`  
**Entry Path:** Feature-branch `/dashboard` → `Appointment Book` → `Appointment Settings` → feature-branch `/configuration`  
**Context:** `Active` và `Removed`; multiple run-owned state variants khi khả dụng  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB`  
**Preconditions:** Ít nhất một run-owned active session; reuse run-owned states từ TC-001/TC-003 khi execution order cho phép.  
**Test Data Category:** Run-owned sessions; không thao tác session có sẵn  
**Test Data:** Reuse `QA-AUTO-PAC2-7786-*` identifiers.  
**Mutation Class:** None for menu observation  
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở row menu của run-owned active session; ghi toàn bộ labels. | Availability được ghi theo state; không click mutation action. |
| 2 | Mở row menu của run-owned archived/removed session; ghi toàn bộ labels. | Availability được ghi riêng theo state; không click mutation action. |
| 3 | So sánh `Delete Session`, `Block Session`, `Restore`, `Cancel Session`. | Trả observation matrix. Không gán Pass/Fail cho coexist/replace cho tới khi product rule được xác nhận. |

**Postconditions:** Không thay đổi dữ liệu.  
**Cleanup:** None trong case; dữ liệu do các case mutation sở hữu cleanup.  
**Automation:** Blocked — expected product rule đang `Disputed`; có thể tạo diagnostic spec sau manual observation nhưng không assertion Pass/Fail về coexistence.  
**Evidence:** `exploration.md` — menu hiện quan sát có `Block Session`, `Restore`, không thấy `Delete Session`; execution evidence pending  
**Execution History:** Chưa chạy

## Open Questions and Blockers

- Cần approved synthetic/test patient setup cho PAC2-7786-TC-002; không dùng PII bệnh nhân thật.
- Cần xác minh appointment book/location/slot type test nào an toàn cho dữ liệu `QA-AUTO`.
- Exact user-facing failure message cho session có bookings chưa được quy định; assert failure truthful, no false success, persistence retained.
- Product decision cho `Delete Session` coexist hay bị thay bởi `Block Session` vẫn mở; PAC2-7786-TC-005 không được kết luận Pass/Fail trước khi có xác nhận.
- Exploration thấy `Restore` trong menu khi `Active` pressed; manual execution phải xác minh row/action association trước khi dùng locator.

## Tester notes

[Protected area]
