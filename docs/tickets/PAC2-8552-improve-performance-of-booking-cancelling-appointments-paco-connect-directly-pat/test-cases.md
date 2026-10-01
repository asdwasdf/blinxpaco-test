# Manual Test Runbook: PAC2-8552

**Input Revision:** 1  
**Design Maturity:** Explored  
**Updated:** 2026-09-28  
**Environment:** dev only  
**PACO role:** `Super Admin GB`  
**Result values:** `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`

## 1. Mục tiêu

Xác minh thay đổi partition key không làm hỏng booking, single cancellation, multi-organisation session cancellation, multi-slot release, split allocation, partition pruning, update guards hoặc slot lookup.

## 2. URL và runtime guard bắt buộc

| Ký hiệu | Exact URL |
|---|---|
| `CONNECT_BOOK` | `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8552/appointment-book` |
| `CONNECT_SESSION` | `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8552/configuration/#clinics` |
| `SCHEDULER_ROOT` | `https://dev.blinxscheduler-np.com/feature-branch/pac2-8552/` |
| `BOOKING_LINK` | Link tạo từ đúng Scheduler feature branch; không ghi query/token vào artifact |

Trước **mỗi** click gây side effect:

1. Connect: address bar phải chứa `/paco-connect/feature-branch/pac2-8552/`.
2. Scheduler: address bar phải chứa `/feature-branch/pac2-8552/`.
3. Segment biến mất: dừng ngay, ghi `Blocked: feature-branch guard failed`.
4. Không click `Save`, `Send Now`, `Book`, `Confirm`, `Cancel Appointment`, `Cancel Session`, `Archive`, `Delete` trên mainline/production/unknown host.
5. Không ghi patient name, NHS number, email, phone, JWT, query string, cookie hoặc token vào tài liệu/evidence.

## 3. Run header và dữ liệu

| Field | Value |
|---|---|
| Run ID | `PAC2-8552-MANUAL-____` |
| Tester |  |
| Started at |  |
| Connect build/commit |  |
| Scheduler build/commit |  |
| Book A | `PAC2-8384 Manual Book A` |
| Book B | `PAC2-8384 Manual Book B` |
| `<FUTURE_DATE>` |  |
| `<SESSION_NAME>` |  |
| `<SESSION_START>` |  |
| `<SESSION_END>` |  |
| Slot duration | `10 min` hoặc giá trị thực tế |
| Synthetic patient | `[redacted local reference]` |
| Verified recipient | `[redacted]` |

Chỉ dùng future date. Session ngày `26/09/2026` là dữ liệu lịch sử, không dùng lại.

## 4. Quy tắc result

- `Pass`: mọi observable bắt buộc đạt, persisted state vẫn đúng sau reload, evidence đầy đủ.
- `Fail`: observable rõ ràng sai và lỗi được xác nhận theo retry protocol.
- `Blocked`: thiếu route, fixture, quyền, safe recipient, owner evidence hoặc backend/DB access.
- `Inconclusive`: attempts không ổn định hoặc evidence không đủ phân biệt product/setup issue.
- `Not Run`: chưa bắt đầu.

Attempt A có vẻ fail thì chưa chốt `Fail`:

| Attempt | Cách chạy | Result | Evidence |
|---|---|---|---|
| A | Fixture hiện tại |  |  |
| B | Cùng data nếu idempotent; nếu không, equivalent appointment mới |  |  |
| C | Clean appointment/session mới |  |  |
| D | Fresh page/browser session, login lại thủ công |  |  |
| Control | Fixture đơn giản đã biết hoạt động, vẫn đúng feature branch |  |  |

Có cả `Pass` và `Fail` giữa attempts: kết luận `Inconclusive`.

## 5. Setup dùng chung

### SETUP-A — Tạo future session

**Mutation:** Temporary/Persistent. Chỉ chạy trên `CONNECT_SESSION`.

| Step | Exact thao tác | Expected observable | Actual / Evidence |
|---|---|---|---|
| A1 | Mở `CONNECT_SESSION`. Kiểm tra address bar vẫn chứa `/paco-connect/feature-branch/pac2-8552/`. | Feature-branch guard đạt. |  |
| A2 | Ở panel trái, trong section `Appointment Books`, click `Sessions`. | Main panel có textbox `Search Session...`; grid có cột `Session Name`, `Assigned Slot types`, `Weekdays`, `Frequency`, `Duration`, `Slot Count`, `Assigned Location`, `Actions`. |  |
| A3 | Ở góc trên-phải grid, click nút add/dropdown không có text. | Menu có `Add Session`. |  |
| A4 | Click `Add Session`. | Drawer phải `Add Session` mở. |  |
| A5 | Điền `Session Name` = `<SESSION_NAME>`; chọn `Timed Appts`; điền `Slot Duration (min)`; điền `Frequency`; cấu hình `Apply Multi-Org Split` theo case. | Giá trị hiển thị đúng; chưa save. |  |
| A6 | Chọn `Assigned Slot Types`, `Assigned Appointment Book`, `Service provider`, `Location 1`, `Care Professional 1`. Dùng `Add another` chỉ khi fixture yêu cầu thêm location/care professional. | Drawer không báo required-field error; đúng approved book/test context. |  |
| A7 | Thiết lập future schedule để tạo session tại `<FUTURE_DATE>`, `<SESSION_START>`–`<SESSION_END>`. Nếu UI hiện tại không có control ngày/giờ trong drawer hoặc cần flow khác chưa xác nhận, **dừng**. | Có thể review chính xác future date/time trước save. Nếu không: `Blocked: future schedule control not confirmed`. |  |
| A8 | Kiểm tra URL guard lần cuối; click `Save` một lần. | Drawer đóng hoặc success state xuất hiện; session có trong grid. |  |
| A9 | Trong `Search Session...`, nhập exact `<SESSION_NAME>`. | Chỉ đúng session hoặc đúng template/session rows hiển thị. |  |
| A10 | Ở far-right cột `Actions` của đúng row, click action button; chọn `Edit`; click icon `eye` ở header drawer. | Preview hiển thị slots, từng start/end, available count và `Session ends at: <SESSION_END>`. |  |
| A11 | Đóng preview bằng `Close`; đóng drawer bằng `Cancel` nếu không thay đổi gì. Không dùng `Escape`. | Không phát sinh mutation ngoài session đã tạo. |  |

**SETUP-A outcome**

- `Pass`: session searchable; preview đúng date/time, slot count, slot duration, book/location.
- `Fail`: save báo thành công nhưng session không tồn tại hoặc preview sai cấu hình sau reload; áp dụng retries.
- `Blocked`: không xác định được future date/time controls, required safe data, hoặc guard fail.

### SETUP-B — Tạo/gửi booking link

**Mutation:** Persistent communication send. Recipient đã được tester phê duyệt; không ghi địa chỉ vào artifact.

| Step | Exact thao tác | Expected observable | Actual / Evidence |
|---|---|---|---|
| B1 | Trên Connect feature branch, mở approved synthetic patient profile bằng patient search hiện có. Không dùng global sidebar `Quick Send`. | Đúng test patient context; URL còn feature branch. |  |
| B2 | Trong patient context/actions, click `Quick Send`. | Quick Send composer mở cho đúng patient. |  |
| B3 | Click tab `Booking Link`. | Panel có `Date & Time`, `Refresh Availability`, `Face to Face Slot Type(s)`, `Save`. |  |
| B4 | Trong `Date & Time`, chọn range bao phủ `<FUTURE_DATE>`. | Range hiển thị đúng. |  |
| B5 | Click `Refresh Availability`. | Availability refresh hoàn tất; không error. |  |
| B6 | Mở `Face to Face Slot Type(s)`; chọn exact `First Contact Physio - eGPlearning` hoặc exact slot type của SETUP-A. Click ra ngoài để đóng dropdown; không dùng `Escape`. | Slot type vẫn được chọn; composer không đóng. |  |
| B7 | Click `Save`. Trong dialog `Save Campaign`, chọn `Update existing` nếu dùng campaign đã có; chỉ chọn `Save as New` nếu run data yêu cầu campaign mới. | Campaign state được lưu, send control khả dụng. |  |
| B8 | Mở send menu, chọn `Send Now`. Nếu dialog outside-hours xuất hiện, chọn `Send Now Anyway`. | Send hoàn tất, không error. |  |
| B9 | Mở patient `Patient Comms`; kiểm tra entry `booking links`/communication tương ứng. Kiểm tra verified mailbox ngoài Paco. | Một delivery tới approved recipient; booking link mở đúng Scheduler feature branch. |  |

**SETUP-B outcome**

- `Pass`: communication entry tồn tại; recipient nhận link; link mở URL có `/feature-branch/pac2-8552/`.
- `Fail`: send báo thành công nhưng không có communication/delivery sau retries.
- `Blocked`: thiếu safe recipient, exact patient context, delivery access hoặc URL không giữ branch segment.

## PAC2-8552-TC-001 — Book appointment end-to-end

**Requirement:** REQ-PAC2-8552-001  
**Risk/Priority:** Critical / P0  
**Mutation:** Temporary  
**Fixture:** SETUP-A + SETUP-B; một available single slot

### Baseline

| Item | Before |
|---|---|
| Book |  |
| Date/session |  |
| Target slot |  |
| `Booked` |  |
| `Available` |  |

### Steps

| Step | URL và vị trí UI | Click/input | Expected observable | Actual / Result / Evidence |
|---|---|---|---|---|
| 1 | `CONNECT_BOOK`; top bar | Chọn `Day`; mở appointment-book selector; chọn approved book; navigate tới `<FUTURE_DATE>`. | Session `<SESSION_NAME>` xuất hiện; target slot available. |  |
| 2 | Cùng page; top counters | Chụp `Booked`, `Available`; chụp target slot và URL branch đã redact query. | Baseline đọc được. |  |
| 3 | `BOOKING_LINK`; address bar | Mở link từ verified mailbox; kiểm tra URL chứa `/feature-branch/pac2-8552/`. | Scheduler flow render; không redirect mainline. |  |
| 4 | Scheduler booking flow | Chọn service/slot type khớp SETUP-A. Nếu service đã preselected, xác minh label thay vì đổi. | `<FUTURE_DATE>` có availability. |  |
| 5 | Scheduler date/time list | Chọn `<FUTURE_DATE>` rồi exact target single slot. | Summary hiện đúng date/time/service. |  |
| 6 | Review/confirmation screen | Kiểm tra branch guard; click final `Book`/`Confirm` đúng **label đang hiển thị** một lần. Nếu không có label này hoặc target không rõ, dừng `Blocked`, không đoán. | Success/confirmation hiển thị; không `APPOINTMENT_NOT_FOUND` hoặc generic error. |  |
| 7 | `CONNECT_BOOK`; same book/date | Hard reload; chọn lại `Day`, book, date. | Appointment block xuất hiện đúng target slot. |  |
| 8 | Top counters | Ghi after values. | 1-slot booking: `Booked = before + 1`; `Available = before - 1`. |  |
| 9 | Occupied appointment block | Click block; xem drawer phải. | Drawer đúng slot type, `Start Time`, `End Time`, `Slot Count = 1`. |  |

### Kết luận TC-001

- **Pass:** Scheduler confirmation thành công; appointment persist sau reload; đúng slot; counters `+1/-1`.
- **Fail:** booking error, wrong slot, appointment mất sau reload, duplicate booking, hoặc counters sai; phải hoàn thành A–D + Control.
- **Blocked:** link/fixture/auth/branch guard/final label không hợp lệ.
- **Inconclusive:** UI confirmation và persisted state mâu thuẫn hoặc attempts mixed.

| Final result | Appointment alias | Evidence | Cleanup |
|---|---|---|---|
|  | `[redacted]` | `TC-001-*-redacted.*` | Giữ cho TC-002 hoặc cancel |

## PAC2-8552-TC-002 — Cancel single appointment qua Patient Hub

**Requirement:** REQ-PAC2-8552-002  
**Risk/Priority:** Critical / P0  
**Mutation:** Temporary; cancellation là cleanup  
**Fixture:** Active 1-slot appointment từ TC-001

### Steps

| Step | URL và vị trí UI | Click/input | Expected observable | Actual / Result / Evidence |
|---|---|---|---|---|
| 1 | Patient Hub tại `SCHEDULER_ROOT`/link của appointment | Kiểm tra branch guard. Tại appointment card đúng date/time, đọc `Cancel Appointment` và `Reschedule`. | Card đúng appointment cần cancel. |  |
| 2 | Appointment card | Chụp pre-cancel card; click `Cancel Appointment`. | Dialog `Are you sure?` mở; đúng một appointment được target. |  |
| 3 | Confirmation dialog | Kiểm tra URL guard; click confirm cancellation đúng label trong dialog một lần. | Dialog success `Appointment Cancelled`; text `Your appointment has been cancelled.`; control `Close this window`. |  |
| 4 | Success dialog | Chụp evidence rồi click `Close this window`. | Dialog đóng hoặc flow kết thúc sạch. |  |
| 5 | `CONNECT_BOOK`; same book/date | Hard reload; chọn `Day`, approved book, `<FUTURE_DATE>`. | Appointment block không còn chiếm original slot. |  |
| 6 | Top counters + original slot | Ghi after values; click slot nếu read-only detail khả dụng. | `Booked = before - 1`; `Available = before + 1`; slot available. |  |

### Kết luận TC-002

- **Pass:** đúng success dialog; sau reload appointment inactive; original slot released; counters `-1/+1`.
- **Fail:** success nhưng appointment/slot còn active, wrong appointment cancelled, generic error, hoặc counters sai; chạy A–D + Control.
- **Blocked:** Patient Hub/card không truy cập được, guard fail, appointment đã inactive.
- **Inconclusive:** Scheduler và Connect state mâu thuẫn hoặc attempts mixed.

## PAC2-8552-TC-003 — Cancel single appointment qua PACO Connect

**Requirement:** REQ-PAC2-8552-002  
**Risk/Priority:** Critical / P0  
**Mutation:** Temporary; cancellation là cleanup  
**Fixture:** Dedicated active 1-slot appointment mới; không reuse cancelled record

### Steps

| Step | URL và vị trí UI | Click/input | Expected observable | Actual / Result / Evidence |
|---|---|---|---|---|
| 1 | `CONNECT_BOOK`; top controls | Chọn `Day`, approved book, `<FUTURE_DATE>`; kiểm tra branch guard. | Dedicated appointment block hiển thị đúng slot. |  |
| 2 | Top counters | Ghi `Booked`, `Available`, start/end. | Baseline đầy đủ. |  |
| 3 | Session timeline | Click **occupied appointment block có patient**, không click empty slot, session header hoặc icon. | Drawer phải mở; có slot type heading, `Start Time`, `End Time`, `Slot Count`, `MARK AS: Select Patient Status`, `Save`. |  |
| 4 | Drawer, phần dưới slot fields | Tại dòng `MARK AS`, click text `Select Patient Status`. | Menu hiện `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Cancel Appointment`. |  |
| 5 | Status menu | Kiểm tra branch guard; click `Cancel Appointment` một lần. | Không generic error; drawer đóng hoặc UI chuyển cancelled state. |  |
| 6 | Same page | Hard reload; chọn lại same book/date. | Appointment block không còn active. |  |
| 7 | Top counters + original slot | Ghi after values; inspect original slot. | `Booked = before - 1`; `Available = before + 1`; không orphan block. |  |

### Kết luận TC-003

- **Pass:** cancellation persist; slot released; counters `-1/+1`.
- **Fail:** error, success giả, residual appointment/occupied slot, wrong counters; chạy A–D + Control.
- **Blocked:** không có safe fixture, drawer/menu khác với labels xác nhận, guard fail.
- **Inconclusive:** initial state biến mất nhưng quay lại hoặc attempts mixed.

## PAC2-8552-TC-004 — Cancel session có appointments thuộc nhiều organisations

**Requirements:** REQ-PAC2-8552-003, REQ-PAC2-8552-007  
**Risk/Priority:** Critical / P0  
**Mutation:** Destructive  
**Default:** `Blocked` nếu backend/data owner chưa xác nhận multi-org fixture

### Fixture gate

- [ ] Disposable future session có ít nhất hai active appointments.
- [ ] Owner xác nhận Appointment A/B có organisation values khác nhau trong backend; UI label không đủ chứng minh.
- [ ] Biết requested appointment count và total occupied slot count.
- [ ] Session cancellation/cleanup được duyệt.

### Steps

| Step | URL và vị trí UI | Click/input | Expected observable | Actual / Result / Evidence |
|---|---|---|---|---|
| 1 | `CONNECT_BOOK` | Chọn correct book/date/session; ghi aliases A/B, từng slot count, counters. Không ghi PII. | Baseline tổng requested appointments/slots đầy đủ. |  |
| 2 | `CONNECT_SESSION`; left `Appointment Books` → `Sessions` | Nhập exact `<SESSION_NAME>` vào `Search Session...`. | Exact session row hiển thị. |  |
| 3 | Exact row; far-right `Actions` | Click action button; xác minh menu có `Edit`, `View Audit`, `Archive`, `Clone`, `Delete`, `Cancel Session`. | Đúng session action menu. |  |
| 4 | Menu | Kiểm tra branch guard; click `Cancel Session`. | **Confirmation UI chưa được locate trước đó.** Ghi exact heading/text/buttons. Không confirm nếu session/count không rõ. |  |
| 5 | Confirmation UI | Nếu UI target đúng disposable session và final destructive control rõ ràng, kiểm tra guard rồi click final confirm một lần. Nếu không, `Blocked`. | Operation hoàn tất; không false `APPOINTMENT_NOT_FOUND`; không success im lặng khi partial. |  |
| 6 | `CONNECT_BOOK`; same book/date | Hard reload. | Tất cả original A/B appointments không còn active. |  |
| 7 | Entire original session range | Kiểm tra mọi original occupied slot và counters. | Tất cả slots released; `Booked` giảm đúng appointment count; `Available` tăng đúng occupied slot count. |  |

### Kết luận TC-004

- **Pass:** owner-proven multi-org fixture; tất cả requested appointments cancelled; tất cả slots released; counts chính xác.
- **Fail:** stable partial/zero-row update, false success, residual appointment/slot, wrong count; chạy A–D + Control bằng disposable fixtures.
- **Blocked:** fixture không được backend xác nhận hoặc confirmation target không rõ.
- **Inconclusive:** mixed attempts hoặc không đủ evidence về organisation semantics.

## PAC2-8552-TC-005 — Full-slot release khi session edit ảnh hưởng multi-slot appointment

**Requirements:** REQ-PAC2-8552-004, REQ-PAC2-8552-007  
**Risk/Priority:** Critical / P0  
**Mutation:** Destructive  
**Fixture:** Disposable future session; appointment chiếm ba contiguous slots

### Fixture arithmetic

Ví dụ 10 phút: S1 `14:00–14:10`, S2 `14:10–14:20`, S3 `14:20–14:30`. Session window mới phải làm chỉ một phần appointment out-of-range, ví dụ new end `14:20`. Expected: appointment bị xử lý theo ticket và **cả S1, S2, S3** được release.

### Part A — Tạo/verify multi-slot appointment

| Step | URL và vị trí UI | Click/input | Expected observable | Actual / Result / Evidence |
|---|---|---|---|---|
| 1 | `CONNECT_BOOK` | Chọn `Day`, approved book, `<FUTURE_DATE>`; kiểm tra guard. | Disposable session có ít nhất ba contiguous slots. |  |
| 2 | Existing dedicated appointment block | Click occupied block để mở right drawer. | Drawer có `Start Time`, `End Time`, `Slot Count`, `Save`. |  |
| 3 | Drawer lower half, `Slot Count` | Mở dropdown; chọn option kéo dài qua ba slots. Options có dạng `Slot 1 (<start>–<end>)`. | Selected duration bao phủ S1–S3. |  |
| 4 | Bên ngoài dropdown trong drawer | Click vùng trống để đóng overlay; **không dùng `Escape`**. | Drawer vẫn mở; selection giữ nguyên. |  |
| 5 | Drawer footer | Kiểm tra guard; click `Save` một lần. | Drawer đóng/success; appointment block chiếm ba contiguous slots. |  |
| 6 | Same page | Hard reload; mở lại appointment drawer. | `Slot Count = 3`; start/end bao phủ chính xác S1–S3. |  |
| 7 | Top counters/session | Ghi pre-edit `Booked`, `Available`; chụp toàn bộ S1–S3. | Baseline đầy đủ. |  |

### Part B — Edit session window

| Step | URL và vị trí UI | Click/input | Expected observable | Actual / Result / Evidence |
|---|---|---|---|---|
| 8 | `CONNECT_SESSION`; left `Appointment Books` → `Sessions` | Search exact `<SESSION_NAME>`. | Exact session row hiển thị. |  |
| 9 | Exact row; far-right `Actions` | Click action button → `Edit`. | Right drawer heading `Edit Session`; header có `eye`; footer có `Cancel Session`, `Cancel`, `Save`. |  |
| 10 | Drawer header | Click `eye`. | Preview có `Select All`, available count, `Actions`, slot rows, `Session ends at: <old end>`. |  |
| 11 | Preview | Chụp/redact complete S1–S3 relationship; click `Close`. Không chọn slots; không click preview `Actions`. | Quay lại `Edit Session`. |  |
| 12 | `Edit Session` fields | Xác định control thực sự thay đổi session end/window. **Control này chưa được xác nhận trong locate snapshot. Nếu không thấy rõ exact field, dừng `Blocked`; không sửa `Frequency`, slot duration hoặc field khác để giả lập.** | Exact end/window control được xác định hoặc case dừng an toàn. |  |
| 13 | Confirmed end/window control | Đổi end từ old value sang boundary làm S3 out-of-range nhưng S1–S2 vẫn in-range. | New value hiển thị đúng; target session không đổi. |  |
| 14 | Drawer footer | Kiểm tra guard; click `Save` một lần. Ghi mọi warning/confirmation exact text. | Save hoàn tất hoặc cancellation/affected-appointment warning rõ ràng; không false success. |  |
| 15 | `CONNECT_BOOK`; same book/date | Hard reload. | Original appointment không còn active block nếu expected cancellation đã xảy ra. |  |
| 16 | Entire original range | Inspect **S1, S2, S3**, không chỉ S3. | Cả ba slots available; không slot nào còn association với cancelled appointment. |  |
| 17 | Top counters | Ghi after values. | `Booked = pre-edit - 1`; `Available = pre-edit + 3`. |  |

### Kết luận TC-005

- **Pass:** appointment 3-slot được persist trước edit; session window change xử lý appointment; cả S1–S3 release; counters `-1/+3`.
- **Fail:** success nhưng bất kỳ S1/S2/S3 vẫn occupied, appointment residual, partial count, hoặc stable zero-row error; chạy A–D + Control.
- **Blocked:** exact session-end/window control chưa xác nhận, fixture không disposable, hoặc guard fail.
- **Inconclusive:** state thay đổi không ổn định hoặc chưa phân biệt được configuration error với product defect.

| Field | Value |
|---|---|
| Final result |  |
| S1/S2/S3 |  |
| Out-of-range slot(s) |  |
| Released slots |  |
| `Booked` before → after |  |
| `Available` before → after |  |
| Success with residual state |  |
| Cleanup | Dùng confirmed Connect cancellation; verify mọi original slot |

## PAC2-8552-TC-006 — Preserve active split-allocation counts

**Requirement:** REQ-PAC2-8552-005  
**Default:** `Blocked` — cần backend/integration owner, active split fixture và trusted before/after counts.

Owner chạy supported `get-session-split-status` flow trên exact build; xác minh counts không đổi và appointment lookup không bị filter sai bởi token organisation. UI observation không đủ kết luận.

## PAC2-8552-TC-007 — PostgreSQL partition pruning

**Requirement:** REQ-PAC2-8552-006  
**Default:** `Blocked` — cần DB owner, approved non-production DB và exact affected SQL.

Chạy `EXPLAIN (ANALYZE, BUFFERS)` before/after; evidence phải chứng minh expected partition(s), buffers/time và unchanged correctness row count. Không dùng UI timing làm bằng chứng.

## PAC2-8552-TC-008 — Reject silent zero-row/partial updates

**Requirement:** REQ-PAC2-8552-007  
**Default:** `Blocked` cho full conclusion — cần isolated backend harness.

Owner phải test zero-row update, original requested IDs so với found IDs, transaction integrity và targeted `paco-connect-be` regressions. TC-002–005 cung cấp manual oracle: success nhưng residual appointment/slot là fail candidate; vẫn phải chạy retries.

## PAC2-8552-TC-009 — Preserve appointment lookup by slot

**Requirement:** REQ-PAC2-8552-008  
**Default:** `Blocked` — cần backend harness/query instrumentation.

Owner tạo scheduler-created và PACO-created fixtures; chạy `getAppointmentsBySlotId`; xác minh đúng mapping, không false not-found, dead query không chạy, partition scope chỉ áp dụng khi organisation value an toàn.

## 6. Coverage map

| Requirement | Cases | Manual state |
|---|---|---|
| REQ-PAC2-8552-001 | TC-001 | Runnable sau SETUP-A/B |
| REQ-PAC2-8552-002 | TC-002, TC-003 | Runnable với fresh appointment/path |
| REQ-PAC2-8552-003 | TC-004 | Conditional: owner-proven multi-org fixture |
| REQ-PAC2-8552-004 | TC-005 | Conditional: exact end/window control cần xác nhận |
| REQ-PAC2-8552-005 | TC-006 | Owner-assisted |
| REQ-PAC2-8552-006 | TC-007 | DB-owner |
| REQ-PAC2-8552-007 | TC-004, TC-005, TC-008 | Manual oracle + backend-owner |
| REQ-PAC2-8552-008 | TC-009 | Backend-owner |

## 7. Mutation ledger

| At | Case/Setup | Branch guard | Action | Redacted fixture | Expected | Actual | Cleanup | Evidence |
|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |

## 8. Final summary

| Case | Result | Attempts | Evidence | Defect/blocker | Cleanup |
|---|---|---|---|---|---|
| TC-001 | `Not Run` |  |  |  |  |
| TC-002 | `Not Run` |  |  |  |  |
| TC-003 | `Not Run` |  |  |  |  |
| TC-004 | `Not Run` |  |  |  |  |
| TC-005 | `Not Run` |  |  |  |  |
| TC-006 | `Not Run` |  |  | Owner-assisted | N/A |
| TC-007 | `Not Run` |  |  | DB-owner | N/A |
| TC-008 | `Not Run` |  |  | Backend-owner |  |
| TC-009 | `Not Run` |  |  | Backend-owner | N/A |

## 9. Evidence checklist

- [ ] Filename có case + attempt, ví dụ `TC-005-A-before-redacted.png`.
- [ ] URL visible chứng minh feature branch; crop/redact query/token.
- [ ] Before/after counters và toàn bộ affected slots.
- [ ] Expected vs actual + timestamp.
- [ ] Không chứa PII/auth data.
- [ ] Durable evidence chỉ vào `docs/tickets/PAC2-8552-improve-performance-of-booking-cancelling-appointments-paco-connect-directly-pat/evidence/` sau review/redaction.

## 10. Blockers còn lại

- TC-004: cần backend/data owner xác nhận fixture thật sự multi-org.
- TC-005: `Edit Session` route/drawer đã xác nhận; exact session end/window control chưa xuất hiện trong read-only snapshot, nên dừng trước mutation nếu tester không thấy rõ.
- TC-006–009: cần backend/DB owner và harness.
- Scheduler hostname chưa nằm trong `paco.config.yaml` allowlist; agent automation không được mutation. Manual tester vẫn phải giữ exact feature-branch guard.

## Tester notes

