# Exploration: PAC2-8384

**Input Revision:** 1
**Environment:** dev
**Role:** `Super Admin GB`
**Observed:** 2026-09-25T10:10:00+07:00
**Status:** Inconclusive

## Scope

Read-only observation at confirmed route `/paco-connect/appointment-book`: inspect single-book `Location`, open the existing appointment-book selector, select an additional existing book, then inspect the `Location` region. No business form, filter option, `Reset all`, `Quick Book`, `Group Send`, `Export`, or destructive control was used.

## Observations

### OBS-PAC2-8384-001

**Classification:** Observed
**Location/URL:** `/paco-connect/appointment-book`
**Action:** Open `Filters` then expand `Location` for the initially selected single book.
**Observed Behavior:** `Location` displayed a `Search...` textbox and visible checkbox option `Temi PCN` after appointment data loading completed.
**Requirement Links:** REQ-PAC2-8384-001
**Evidence:** `test-results/PAC2-8384/locate/20260925-0957/filters-location.png` (local raw evidence)
**Sensitive Data Review:** None in artifact body; local-only pending share review.

### OBS-PAC2-8384-002

**Classification:** Observed
**Location/URL:** `/paco-connect/appointment-book`
**Action:** Open the existing appointment-book selector, add `111 PC24` while retaining the prior selected book, select `Done`, then inspect expanded `Location`.
**Observed Behavior:** Toolbar changed to `Appt. Book 111 PC24 +1`, and selector reported `2 selected`. The expanded `Location` region displayed `Search...` and one visible option, `Temi PCN`.
**Requirement Links:** REQ-PAC2-8384-002, REQ-PAC2-8384-004
**Evidence:** `test-results/PAC2-8384/explore/20260925-1010/multi-book-location.png` (local raw evidence)
**Sensitive Data Review:** None in artifact body; local-only pending share review.

### OBS-PAC2-8384-003

**Classification:** Observed
**Location/URL:** `/paco-connect/appointment-book`
**Action:** Observe filter-sidebar controls without applying any filter option.
**Observed Behavior:** Sidebar exposed `Healthcare Professional`, `Patient`, `Appointment Type`, `Slot Type`, `Session Name`, and `Location`; no assertion was made about their option contents because they were not opened in this run.
**Requirement Links:** REQ-PAC2-8384-003, REQ-PAC2-8384-005
**Evidence:** Playwright accessibility snapshots from 2026-09-25T10:10:00+07:00; local run only.
**Sensitive Data Review:** None persisted.

## Mismatches and Possible Defects

- Không kết luận `Pass`/`Fail` cho REQ-PAC2-8384-002: hai book đã được chọn, nhưng không có mapping tin cậy xác nhận `111 PC24` phải đóng góp location nào trong date range `25 September 2026`. Một option `Temi PCN` không chứng minh aggregate đa-book đúng hoặc sai.
- Không kết luận defect từ HTTP status `404`: UI Appointment Book tải và tương tác read-only được; đây là technical warning cần theo dõi riêng.

## Actions Not Taken

- Không chọn `Location` option hoặc bất kỳ option filter nào; thay đổi filtered result là state change ngoài scope quan sát hiện tại.
- Không mở `Appointment Type`, `Slot Type`, `Session Name`, `Patient`, hoặc `Healthcare Professional` để tránh mở rộng scope khi chưa có dataset mapping.
- Không dùng `Reset all`, `Quick Book`, `Group Send`, `Export`, hay business action nào.

## Suggested Coverage

- Với hai book có mapping xác nhận: kiểm tra union option của `Location`, `Slot Type`, `Session Name`, `Healthcare Professional`, `Patient`.
- Áp dụng từng filter và đối chiếu session/slot/result với mapping expected.
- Regression `Appointment Type`: option chỉ thuộc book hiện hành; selection lọc cả session và slot khớp appointment type, theo comment ticket.
- Xác nhận riêng scope của `Location` chip và loading/empty states trước khi coi chúng là expected result.

## Blockers and Open Questions

- Blocker cho correctness verdict: thiếu test data/mapping xác nhận giữa ít nhất hai appointment book, date range và các expected filter option/result.
- Open question: `Temi PCN` có thuộc một hay cả hai book đã chọn trong date range hiện tại? Không suy đoán từ UI.
- Open question: multi-book API/UI phải union, deduplicate, hay có rule khác cho filter options?

## Tester notes

[Protected area]
