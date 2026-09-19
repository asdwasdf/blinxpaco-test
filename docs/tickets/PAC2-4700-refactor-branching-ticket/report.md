# QA Report: PAC2-4700

**Input Revision:** 1  
**Environment:** dev — BASE OS, BRANCH-OS, BRANCH-CONNECT, BRANCH-GP  
**Role:** `Super Admin GB`  
**Run/Scope:** Quick retest và parity evidence pass  
**Generated:** 2026-09-19  
**Overall:** Inconclusive

## Scope and Limitations

Retest các nhận xét QA trước trên cùng shared test patient và cùng campaign context khi có thể. Phạm vi gồm default message channel, patient email, DOB, campaign sorting, `Files`, `Health Forms`, `Booking Link`, slot-type controls và alignment.

Performance chỉ là một spot sample, không phải benchmark. Không có exact campaign/template chứa mapped `Virtual Mental Health…` slot. Không đủ matching evidence cho dropdown persistence, sorting theme, newly saved campaign timing, `Test Results` inner scroll và patient-profile side-panel visual parity.

Không click `Save`, `Send Now` hoặc `Schedule`; không upload/import và không tạo persistent mutation trong evidence pass.

## Results

| Area | Result | Evidence | Notes |
|---|---|---|---|
| Default Email vs SMS | Not Run | `IMG-01`, runtime observation | Không tái lập khác biệt: current campaign mở SMS trước trên cả ba environment. |
| Patient email availability | Pass | `IMG-08`, runtime observation | OS, Connect và GP đều expose email option. Value khác nhau giữa OS và GP/Connect. |
| Patient DOB parity | Fail | `IMG-01`, `IMG-07` | OS hiện `Unknown (Unknown)`; GP hiện đúng `15/03/2024 (2 years old)`. Connect có mixed observation nên chưa kết luận riêng. |
| Campaign sorting options | Pass | `IMG-01`, standard-suite runtime | OS và GP có cùng năm sort options; GP-only `Z - A` không tái lập. Grey-box theme chưa đủ evidence. |
| Files loading | Inconclusive | `IMG-02`, `IMG-04`, `IMG-06` | Không tái lập GP permaload. Connect có transient `Loading...`, hoàn tất khoảng `6127ms`; OS khoảng `130ms`; GP đạt expected state trong wait ≤5s. |
| Health Forms performance | Inconclusive | runtime measurements | GP `1969ms`, Connect `1942ms`, OS `1990ms`; một sample không chứng minh khác biệt performance. |
| Booking Link required controls | Pass | `IMG-03`, `IMG-05`, `IMG-07` | STD-08 pass trên BASE-OS, BRANCH-OS, BRANCH-CONNECT và BRANCH-GP. |
| Booking Link alignment | Pass | `IMG-03`, `IMG-05`, `IMG-07` | Current screenshots không tái lập claim Connect text lệch centre. |
| Mapped `Virtual Mental Health…` slot | Inconclusive | Current campaign context | Không có exact mapped fixture; không tự tạo/chỉnh mapping. |
| Scheduler-link popup | Inconclusive | Current campaign chứa `{{{scheduler_link}}}` | Không thấy popup; trigger và expected behavior chưa Confirmed. |

## QA Notes — Quick Retest and Parity Check

### 1. Default message channel and patient email

Cả ba environment mở current campaign bằng SMS template trước và có action `Copy to Email`.

Claim OS mặc định Email trong khi Connect/GP mặc định SMS **không tái lập**.

Patient email hiện diện trên cả ba environment:

- OS: `michael@blinxsolutions.com`
- GP: `qa.pac2.4700.fixed@example.com`
- Connect cũng expose email option trong current patient state.

Value khác nhau cho thấy OS và GP/Connect có thể dùng patient/contact dataset khác nhau.

**Open Question:** OS và GP/Connect có được kỳ vọng dùng dataset khác nhau không?

> **[IMG-01] OS compose evidence:** SMS compose active và có `Copy to Email`.  
> **[IMG-08] GP email evidence:** Email được enable trong local compose state và `qa.pac2.4700.fixed@example.com (Home)` xuất hiện trong `To`.

### 2. Patient DOB khác nhau giữa environment

GP hiển thị DOB đúng:

- `15/03/2024 (2 years old)`

OS hiển thị:

- `Unknown (Unknown)`

Dashboard search result có DOB đúng, nên OS discrepancy nằm trong Quick Send modal thay vì patient search data.

Connect từng hiện `Unknown (Unknown)`, nhưng một Dashboard-entry sample sau đó hiện DOB đúng. Connect cần controlled rerun trước khi phân loại consistently affected.

> **[IMG-01] OS evidence:** Quick Send header hiển thị `DOB: Unknown (Unknown)`.  
> **[IMG-07] GP evidence:** Quick Send header hiển thị `DOB: 15/03/2024 (2 years old)`.

**Result:** OS difference **Confirmed**. Connect behavior **Inconclusive**.

### 3. Campaign sorting

OS và GP expose cùng năm sorting options:

- `By date (descending)`
- `By date (ascending)`
- `By message type`
- `A - Z`
- `Z - A`

Chọn `A - Z` reorder visible campaigns theo alphabet.

Claim GP-only `Z - A` **không tái lập**. Chưa có matching fixed-viewport screenshot của expanded dropdown trên cả ba environment, nên reported GP grey-box styling difference vẫn **Inconclusive**.

> **[IMG-01] OS evidence:** Campaign selector ở state `A - Z`, visible campaigns theo alphabet.

### 4. Files và patient documents

Không tái lập permanent loading state.

Spot results:

- OS: expected state khoảng `130ms`
- GP: expected state trong explicit wait ≤5 giây
- Connect: expected state khoảng `6127ms`

Connect còn `Loading...` tại thời điểm screenshot nhưng hoàn tất sau đó. Đây là transient load, không phải permaload.

Claim GP documents bị kẹt tại permaload **không tái lập**.

> **[IMG-02] OS Files evidence:** `Files` surface render.  
> **[IMG-04] Connect Files evidence:** patient-record selector tạm hiện `Loading...`; runtime xác nhận hoàn tất khoảng `6127ms`.  
> **[IMG-06] GP Files evidence:** `Files` surface đạt expected state; không thấy permanent loading.

**Result:** Không tái lập permaload. Connect chậm hơn OS trong một sample.

### 5. Health Forms performance

Thời gian đạt expected `Health Forms` surface:

- GP: `1969ms`
- Connect: `1942ms`
- OS: `1990ms`

Ba giá trị gần ngang nhau. Claim GP chậm đáng kể hơn Connect **không tái lập**.

**Result:** Chưa xác lập performance difference. Cần repeated cold-load samples nếu muốn kết luận.

### 6. Booking Link controls

Mọi target render required surface:

- `Date & Time`
- `Refresh Availability`
- `Face to Face Slot Type(s)`
- `Phone Slot Type(s)`
- `Video Slot Type(s)`
- `Web Chat Slot Type(s)`
- `Select Clinician(s)`
- `Select Location(s)`
- `Booking Notes (optional)`
- `Confirmation/Reminder Message`

STD-08 pass trên BASE OS, branch OS, branch Connect và branch GP.

Local booking-note marker giữ qua tab switch rồi được clear. Không save.

> **[IMG-03] OS Booking Link evidence:** bốn slot-type groups render.  
> **[IMG-05] Connect Booking Link evidence:** bốn slot-type groups và clinician/location controls render.  
> **[IMG-07] GP Booking Link evidence:** cùng required controls render.

**Result:** Required controls consistent trên cả bốn target.

### 7. Booking Link alignment

Current OS, Connect và GP screenshots cho thấy heading và main control layout centered nhất quán.

Claim Connect text không centered trong khi GP/OS centered **không tái lập** tại current viewport.

> **[IMG-03] OS comparison.**  
> **[IMG-05] Connect comparison.**  
> **[IMG-07] GP comparison.**

### 8. Mapped slot type

Mapped `Virtual Mental Health…` slot không có trong current campaign/context.

Empty slot controls không chứng minh specific EMIS mapping hoạt động hay lỗi. Không tạo hoặc sửa mapping trong retest.

**Result:** **Inconclusive**. Cần exact campaign/template đã biết có mapped slot.

### 9. Scheduler-link popup

Current campaign content có `{{{scheduler_link}}}`, nhưng không quan sát scheduler-link popup trong parity pass.

Trigger và expected behavior chưa Confirmed, nên chưa phân loại absence là failure.

**Result:** **Inconclusive**.

### 10. Claims vẫn cần controlled evidence

- GP grey-box sorting theme.
- Dropdown persistence khác nhau giữa OS và Connect/GP.
- Attachment records trên cùng patient state.
- Newly saved campaign load speed.
- `Test Results` individual scroll-area difference.
- Patient-profile side-panel visual difference.
- Exact mapped `Virtual Mental Health…` slot.
- Scheduler-link popup trigger.

Các claim này giữ **Inconclusive**, không báo thành confirmed regression.

## Defects

### DEF-PAC2-4700-001 — Quick Send DOB không resolve trên OS

- **Environment:** BASE-OS và BRANCH-OS.
- **Actual:** Quick Send header hiển thị `DOB: Unknown (Unknown)`.
- **Comparison:** Shared patient search context và GP Quick Send hiển thị `15/03/2024 (2 years old)`.
- **Evidence:** `IMG-01`, `IMG-07`; standard-suite DOB samples trong `automation.md`.
- **Provenance:** Confirmed trên OS; Connect-specific behavior chưa ổn định.

## Blockers and Open Questions

1. OS và GP/Connect có expected dùng cùng patient/contact dataset không?
2. Exact campaign/template nào chứa mapped `Virtual Mental Health…` slot?
3. Scheduler-link popup phải trigger tại bước nào?
4. Grey-box sorting theme và dropdown persistence có acceptance criterion không?
5. Cần repeated cold-cache sample count và threshold nào cho campaign/Health Forms performance?

## Regression Recommendations

1. Giữ STD-08 parity cho bốn target, assert required control visibility và local booking-note cleanup; không assert inferred mapped slot.
2. Thêm deterministic DOB assertion cho shared test patient trên Quick Send header sau khi product team xác nhận expected source.
3. Performance test chỉ thêm khi có agreed sample count, cold/warm-cache definition và threshold.
4. Không automate visual/theme hoặc persistence claim trước khi có exact selector, interaction và expected basis.

## Product Knowledge Proposals

- Dashboard global `Search...` → embedded `Patient actions menu` → `Quick Send` là entry path đúng cho GP và Connect parity; không cần vào `/patient-profile/...` trong GP flow.
- Booking Link observable contract gồm bốn slot-type groups, clinician/location, booking notes và confirmation/reminder; EMIS-specific assertion cần fixture riêng.
- Connect `Files` có thể ở transient `Loading...` trên một sample khoảng sáu giây; fixed short wait dễ tạo false permaload report.

## Sensitive Data Review

Evidence chứa shared dev-test patient name/contact values. Chỉ dùng nội bộ QA/dev.

Screenshot login vô tình chụp sau session timeout có credential autofill đã bị xóa ngay và không nằm trong evidence set. Không lưu credential, auth state hoặc reusable token trong report.

Evidence index và mô tả đầy đủ:

`docs/tickets/PAC2-4700-refactor-branching-ticket/evidence/README.md`

## Tester notes

[Protected area]
