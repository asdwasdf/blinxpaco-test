# Exploration: PAC2-7786

**Input Revision:** 1  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB`  
**Observed:** 2026-10-01  
**Status:** Complete

## Scope

Quan sát read-only trang session configuration, hai trạng thái `Active`/`Removed`, và menu action của một row. Không chạy action có side effect.

## Observations

### OBS-PAC2-7786-001

**Classification:** Observed  
**Location/URL:** `/paco-connect/feature-branch/pac2-7786/configuration`  
**Action:** Mở `Appointment Settings` từ feature-branch dashboard.  
**Observed Behavior:** Trang hiển thị `Search Session...`, toggle `Active`/`Removed`, `Add Session`, session grid và cột `Actions`. `Active` được chọn mặc định.  
**Requirement Links:** REQ-PAC2-7786-001, REQ-PAC2-7786-003, REQ-PAC2-7786-005  
**Evidence:** `feature-location.md`; Playwright accessibility observation, 2026-10-01  
**Sensitive Data Review:** Redacted; không đưa row data vào artifact.

### OBS-PAC2-7786-002

**Classification:** Observed  
**Location/URL:** `/paco-connect/feature-branch/pac2-7786/configuration`  
**Action:** Chọn toggle `Removed`.  
**Observed Behavior:** `Removed` chuyển sang trạng thái pressed; grid vẫn hiển thị session rows và cùng bộ cột. Thống kê grid thay đổi từ active-filtered set sang removed-filtered set.  
**Requirement Links:** REQ-PAC2-7786-001, REQ-PAC2-7786-003  
**Evidence:** `test-results/PAC2-7786/explore/20261001-145820/removed-sessions.yml`  
**Sensitive Data Review:** Raw local evidence; artifact này không chép dữ liệu row.

### OBS-PAC2-7786-003

**Classification:** Observed  
**Location/URL:** `/paco-connect/feature-branch/pac2-7786/configuration`  
**Action:** Trở lại `Active`, mở menu action của row đầu tiên; không chọn menu item.  
**Observed Behavior:** Menu hiển thị `Edit`, `View Audit`, `Restore`, `Clone`, `Cancel Session`, `Block Session`. Không thấy `Delete Session` trong menu được quan sát. `Restore` xuất hiện dù toggle `Active` đang pressed.  
**Requirement Links:** REQ-PAC2-7786-001, REQ-PAC2-7786-003, REQ-PAC2-7786-005  
**Evidence:** `test-results/PAC2-7786/explore/20261001-145820/active-row-actions.yml`; Playwright menu snapshot, 2026-10-01  
**Sensitive Data Review:** Raw local evidence; không đưa row identity vào artifact.

## Mismatches and Possible Defects

- Possible mismatch với REQ-PAC2-7786-005: menu quan sát có `Block Session` nhưng không có `Delete Session`. Chưa kết luận defect vì requirement đang `Disputed` và availability có thể phụ thuộc row state/type.
- Possible state mismatch: `Restore` xuất hiện trong menu khi `Active` đang selected. Cần xác minh row thực tế có archived/removed state hay UI action bị gắn sai.
- Chưa quan sát confirmation, booking refusal, successful delete hoặc persistence; không có product result.

## Actions Not Taken

- Không chọn `Edit`, `Restore`, `Clone`, `Cancel Session`, `Block Session` hoặc `Add Session` vì có mutation/unknown persistence.
- Không thử xóa session có sẵn; dữ liệu không do run này tạo.
- Không mở flow confirmation hoặc gọi private API.

## Suggested Coverage

- Xác minh action menu theo `Active` và `Removed`, session mới không booking, session có booking, archived session và template-referenced session.
- Kiểm tra `Delete Session` có coexist với `Block Session` theo quyết định sản phẩm.
- Khi execution được thiết kế, dùng test data riêng và kiểm tra confirmation xảy ra trước mutation; cancel phải giữ nguyên dữ liệu.
- Tách kiểm tra UI menu availability khỏi backend deletion result và persistence sau refresh.

## Blockers and Open Questions

- `Delete Session` bị ẩn do feature behavior, role, row state hay defect?
- Tại sao `Restore` xuất hiện khi đang xem `Active`?
- Row action button và row content được render ở các rowgroup tách biệt; automation cần locator dựa trên row association đã xác minh, không dùng `nth()`.
- Exact behavior của `Cancel Session` và `Block Session` chưa được quan sát vì mutation boundary.

## Tester notes

[Protected area]
