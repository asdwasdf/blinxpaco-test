# Requirements: PAC2-1805

**Input Revision:** 1
**Generated:** 2026-09-16
**Status:** Active

## Source Summary

Ticket mô tả một race condition trong `scheduler`: bệnh nhân refresh trang hoặc đăng xuất/đăng nhập lại ngay sau khi bấm `Book` (trước khi EPR xác nhận và audit landing ở `CAMPAIGN_ANALYTICS`) có thể quay lại flow booking và đặt trùng lịch (double-book) không giới hạn số lần.

Ticket có hai thiết kế giải pháp nối tiếp nhau:
- **Thiết kế cũ (OLD, đã superseded):** distributed lock trên DynamoDB, key theo `patient_guid:campaign_id:communications_id`, TTL 30s, feature flag `BOOKING_LOCK_ENABLED`.
- **Thiết kế hiện tại (Current, thay thế thiết kế cũ):** mỗi booking được ghi vào bảng `appointment.appointment` trong PACO bởi backend *trước* khi gọi EMIS/SystmOne/paco-connect, với trạng thái `Pending → Booked` (hoặc release khi EPR từ chối). Trang load đọc row này nên refresh/tab thứ hai/back button không thể mở lại nút `Book`. Một link chỉ giữ một booking; không có feature flag (luôn bật khi deploy).

Ticket còn có nhiều comment mô tả các bug liên quan được phát hiện trong QA vòng feature stage (tony.do, 2026-09-11) và tester Beth, cùng review gaps (tony.do, 2026-09-07) đã fix trên nhánh nhưng **chưa merge/deploy** tại thời điểm review đó. Ticket không có mục "Acceptance Criteria" tách biệt rõ ràng theo format chuẩn — chỉ có một dòng AC mô tả hành vi mong đợi tổng quát, phần lớn chi tiết hành vi nằm trong "Current solution" và "How to test".

Ảnh đính kèm (05 file `.jpg`) là các khung hình từ video ghi màn hình (`Screen sharing - 2026-09-11 2_36_01 PM.mp4`) minh hoạ flow: patient `Michael Ramella` (NHS No. 70986) đăng nhập vào `dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/`, chọn appointment "Simple EMIS Booking - Same Day GP", chọn ngày/giờ, chọn clinician. Một khung hình cho thấy lỗi login ("There was an error logging in...") trên cùng flow — chưa rõ liên quan trực tiếp tới race condition hay là sự cố phụ.

## Atomic Requirements

### REQ-PAC2-1805-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Scheduler` booking flow — persist trạng thái booking để chặn re-entry
**Search Terms/Aliases:** `Book Appointment`, `booking`, `scheduler link`, "Your booking is being confirmed", double-book, đặt lịch trùng
**Known Location:** Scheduler patient-facing link, ví dụ `https://dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/` (feature stage); route production/dev chính thức: Unknown, cần LOCATE
**Actor/Role:** Patient (bệnh nhân, không cần login PACO — xác thực bằng NHS No./D.O.B trên link scheduler)
**Acceptance Criteria Status:** Present (một dòng AC + chi tiết hoá trong "Current solution")

**Preconditions:**
- Bệnh nhân mở một scheduler link hợp lệ (chưa từng book, hoặc đã book qua chính link đó).

**Expected Behavior:**
Sau khi bấm `Book`, nếu bệnh nhân bấm `Back Home` rồi chờ, hoặc đăng xuất/refresh ngay lập tức, khi quay lại/đăng nhập lại phải thấy chi tiết appointment đã book (không còn nút `Book`). Booking được ghi nhận ở backend (PACO `appointment.appointment`, trạng thái `Pending`/`Booked`) trước khi gọi EPR, nên refresh/tab mới/back button không thể mở lại flow booking để đặt thêm lần nữa qua cùng link. Muốn đặt appointment thứ hai bắt buộc phải dùng một link khác.

**Provenance:**
- **Source:** ticket.md — Acceptance Criteria; section "Current solution (supersedes the DynamoDB lock design above)"
- **Input Revision:** 1
- **First Recorded:** 2026-09-16
- **Last Verified:** 2026-09-16

**Evidence:** ảnh đính kèm (khung hình flow booking trên feature stage, xem Source Summary)
**Related Tests:** —
**Notes:** Đây là requirement lõi của ticket (bug chính). Route production chưa xác nhận — cần `LOCATE`.

---

### REQ-PAC2-1805-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Scheduler` — trạng thái "in progress" khi chưa có đủ chi tiết booking
**Search Terms/Aliases:** "in progress", "booking is being confirmed", blank time/clinician, decodeToken
**Known Location:** Unknown, cần LOCATE
**Actor/Role:** Patient
**Acceptance Criteria Status:** Present (mô tả trong bảng QA report của tony.do, đánh dấu "Fixed")

**Preconditions:**
- PACO đã ghi nhận booking (`booked: true`) nhưng row comms-hub (chứa giờ/clinician/location) chưa tồn tại — cửa sổ 2–5s trước khi EPR xác nhận xong.

**Expected Behavior:**
Trong khoảng thời gian PACO đã có row `booked` nhưng comms-hub row (giờ/clinician/location) chưa tới, hệ thống phải hiển thị trạng thái "in progress" (ví dụ "Your booking is being confirmed") và tiếp tục poll, **không** hiển thị booking trống giờ/clinician và **không** cho phép bấm `Book` lại.

**Provenance:**
- **Source:** ticket.md — Comment tony.do 2026-09-11, hàng "Booking shows blank time/clinician after navigating back quickly" (Fixed, nhs-scheduler-be c66b25b)
- **Input Revision:** 1
- **First Recorded:** 2026-09-16
- **Last Verified:** 2026-09-16

**Evidence:** CloudWatch trace `sch:55636:214052` (dẫn chứng trong ticket, không kèm ảnh)
**Related Tests:** How-to-test bước 1 trong ticket
**Notes:** Fix được mô tả là đã merge vào code (commit hash cụ thể) nhưng deploy status trên môi trường có thể chưa đồng bộ — xem Open Questions.

---

### REQ-PAC2-1805-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Scheduler` — hai tab/hai lần bấm `Book` đồng thời trên cùng một link
**Search Terms/Aliases:** "booking already in progress", concurrent booking, double click Book, two tabs same link
**Known Location:** Unknown, cần LOCATE
**Actor/Role:** Patient
**Acceptance Criteria Status:** Present (How to test bước 2)

**Preconditions:**
- Cùng một scheduler link mở ở hai tab/hai lần bấm `Book` gần như đồng thời.

**Expected Behavior:**
Chỉ một lần bấm `Book` thành công (một appointment được tạo trong EPR); lần còn lại hiển thị thông báo "booking already in progress" (hoặc tương đương) thay vì tạo thêm booking.

**Provenance:**
- **Source:** ticket.md — "How to test", bước 2
- **Input Revision:** 1
- **First Recorded:** 2026-09-16
- **Last Verified:** 2026-09-16

**Evidence:** —
**Related Tests:** How-to-test bước 2
**Notes:** Ticket ghi "Steps 1 and 2 passed on the feature build on 2026-09-07 (paco-connect practice)" — đã pass trên feature stage cho paco-connect; EMIS/SystmOne chưa xác nhận riêng.

---

### REQ-PAC2-1805-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Scheduler` — reschedule không được huỷ appointment cũ trước khi appointment mới thành công
**Search Terms/Aliases:** Reschedule, cancel old slot, rollback, "This patient is not booked in this slot", EMIS cancel
**Known Location:** Unknown, cần LOCATE
**Actor/Role:** Patient
**Acceptance Criteria Status:** Present (How to test bước 3; mô tả chi tiết trong bảng gap-review và QA report)

**Preconditions:**
- Bệnh nhân đã có một appointment qua scheduler link, bấm `Reschedule` để chọn slot khác.

**Expected Behavior:**
Khi bấm `Reschedule`: slot cũ chỉ bị huỷ **sau khi** slot mới được relay thành công tới EPR (không huỷ ngay khi click); nếu relay thất bại hoặc EPR từ chối slot mới, appointment cũ phải được khôi phục (`restored_after_failed_reschedule`) và trạng thái `Cancelled` của appointment mới bị gỡ. Toàn bộ release-cũ + insert-mới nằm trong một transaction. Kết quả cuối: slot cũ bị huỷ, slot mới được book, comms chỉ gửi cho thời gian mới.

**Provenance:**
- **Source:** ticket.md — comment tony.do 2026-09-07 "Gap 4 Reschedule failure reopens link" (Fixed, nhs-scheduler-be #517); comment tony.do 2026-09-11 QA report hàng "EMIS appointment cancelled the second I click Reschedule" (No change — hành vi click không tức thời huỷ, mà huỷ 2–4s sau relay); "How to test" bước 3
- **Input Revision:** 1
- **First Recorded:** 2026-09-16
- **Last Verified:** 2026-09-16

**Evidence:** CloudWatch timestamps dẫn trong ticket (13:31:53 book new → 13:31:57 cancel old, và biến thể khác)
**Related Tests:** How-to-test bước 3
**Notes:** Beth báo "the second I click reschedule, my appointment in EMIS is cancelled — not held until I select a new time"; tony.do phản bác bằng log (No change, hành vi khác với mô tả của Beth) — xem Ambiguities/Conflicts.

---

### REQ-PAC2-1805-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** `Scheduler` — rollback chỉ được huỷ đúng slot mà chính attempt đó vừa tạo
**Search Terms/Aliases:** rollback, SessionId, AppointmentUID, cancel wrong slot, manually booked appointment cancelled
**Known Location:** Unknown, cần LOCATE
**Actor/Role:** Patient / Practice staff (người book thủ công trong EMIS ngoài scheduler)
**Acceptance Criteria Status:** Present (mô tả trong QA report + gap review, nhưng phạm vi đầy đủ còn Ambiguous — xem Open Questions)

**Preconditions:**
- Một patient/slot có một appointment được book thủ công trong EMIS (không qua scheduler link đang chạy), và scheduler retry/rollback xảy ra cho cùng slot id.

**Expected Behavior:**
Khi FE rollback một booking attempt thất bại, chỉ những slot **thực sự trả về `SessionId`/`AppointmentUID` trong chính attempt đó** mới bị huỷ. Scheduler không được huỷ một appointment đã tồn tại trong EPR mà không phải do chính scheduler link đó tạo ra trong attempt hiện tại.

**Provenance:**
- **Source:** ticket.md — comment tony.do 2026-09-11, hàng "Manually booked 16:30 EMIS appointment was cancelled by the scheduler" (Fixed, nhs-scheduler 88d0ac8f); comment Beth (không ghi ngày rõ trong nguồn) mô tả cùng hiện tượng
- **Input Revision:** 1
- **First Recorded:** 2026-09-16
- **Last Verified:** 2026-09-16

**Evidence:** CloudWatch timestamps 13:33:56–13:35:30 dẫn trong ticket
**Related Tests:** —
**Notes:** Beth thử replicate với patient khác nhưng không thành công ("This patient is not booked in this slot" — bị từ chối ở bước cancel), nên chưa xác nhận được liệu fix đã bao phủ hết mọi biến thể của tình huống bà mô tả. Xem Open Questions.

---

### REQ-PAC2-1805-006

**Classification:** Inferred from: mô tả migration + gap review trong ticket, needs confirmation
**Lifecycle:** Active
**Feature/Scope:** Data layer — unique constraint cho booking dedup trên mọi environment
**Search Terms/Aliases:** unique index, migration, appointment.appointment, appointment.session, paco-one-db
**Known Location:** Không áp dụng UI trực tiếp (data/infra); Unknown
**Actor/Role:** Không áp dụng (backend/infra)
**Acceptance Criteria Status:** Ambiguous (mô tả kỹ thuật, không phải AC theo nghĩa hành vi UI)

**Preconditions:**
- Deploy migration `paco-one-db` #908 trước khi bật fix #517 trên UAT/prod.

**Expected Behavior:**
Bốn cột và hai unique index bắt buộc phải tồn tại trên mọi environment (dev/UAT/prod) trước khi #517 được bật, nếu không mọi scheduler booking trên UAT/prod sẽ bị từ chối. Đây là điều kiện tiên quyết hạ tầng cho REQ-001..005 hoạt động đúng ngoài dev.

**Provenance:**
- **Source:** ticket.md — comment tony.do 2026-09-07, "Gap 1 Unique indexes not shipped"
- **Input Revision:** 1
- **First Recorded:** 2026-09-16
- **Last Verified:** 2026-09-16

**Evidence:** —
**Related Tests:** Không applicable cho black-box UI test trực tiếp; ảnh hưởng gián tiếp tới khả năng test REQ-001..005 trên UAT/prod
**Notes:** Không thể tự QA black-box; cần xác nhận với BA/PO hoặc quan sát gián tiếp qua hành vi booking có hoạt động trên UAT/prod hay không (nếu migration chưa chạy, mọi booking sẽ fail — dấu hiệu dễ quan sát).

---

## Ambiguities and Conflicts

- **Reschedule-cancel timing (REQ-004):** Beth mô tả "appointment bị huỷ ngay khi bấm Reschedule, trước khi chọn giờ mới". Tony.do dẫn log cho thấy huỷ xảy ra 2–4s **sau** khi relay booking mới, không phải tại thời điểm click, và kết luận "No change" (không phải bug, là hiểu lầm UX/timing). Ticket giữ nguyên hai mô tả này cạnh nhau, không có xác nhận cuối cùng nào nói rõ liệu từ góc nhìn UX (độ trễ cảm nhận được) có cần cải thiện hay không. Đánh dấu **Disputed** giữa "no bug" (tony.do, có log) và "trải nghiệm người dùng thấy bị huỷ ngay" (Beth, không có log kèm theo trong ticket).
- **Phạm vi fix "không huỷ appointment không do chính link tạo" (REQ-005):** Bug cụ thể (rollback theo slot id) được xác nhận Fixed bằng log. Nhưng yêu cầu tổng quát hơn của Beth — "we still cannot be cancelling appointments that were not created by that specific scheduler link" — không có bằng chứng log xác nhận đã bao phủ **mọi** trường hợp (Beth tự nhận không replicate được với patient khác). Coi là **Disputed/chưa đủ chứng cứ** cho phạm vi đầy đủ, dù bug case cụ thể đã Fixed.
- **Design cũ vs. design hiện tại:** Toàn bộ phần "Solution design (OLD)" (DynamoDB lock, feature flag `BOOKING_LOCK_ENABLED`) bị thay thế bởi "Current solution". Không dùng phần OLD làm cơ sở cho bất kỳ requirement hay test case nào — chỉ giữ làm ngữ cảnh lịch sử.

## Open Questions

- Các fix trong bảng QA report (tony.do, 2026-09-11) và gap review (tony.do, 2026-09-07) đã merge/deploy tới môi trường nào tại thời điểm test (2026-09-16)? Ticket chỉ nói "the feature stage redeploys automatically" và "Please retest ... there" (2026-09-11), và riêng gap review nói rõ "Nothing is merged or deployed yet" (2026-09-07). Cần xác nhận trạng thái deploy hiện tại trước khi coi REQ-002, 004, 005 là verified trên bất kỳ environment nào. Impact: Cao — quyết định môi trường/route nào dùng để test.
- Migration `paco-one-db` #908 (REQ-006) đã chạy trên UAT/prod chưa? Nếu chưa, mọi test booking trên các environment đó sẽ fail toàn bộ (theo mô tả gap 1). Impact: Cao nếu test target không phải dev.
- REQ-005 (rollback không huỷ appointment không do chính link tạo): fix đã xác nhận cho trường hợp cụ thể (rollback theo slot id trong cùng attempt), nhưng Beth's report gốc rộng hơn và bà không replicate được với patient khác — chưa rõ có còn edge case nào khác (ví dụ appointment được book thủ công bởi một link scheduler *khác*, hoặc bởi practice staff hoàn toàn ngoài hệ thống). Impact: Trung bình-cao, vì đây là concern về an toàn dữ liệu bệnh nhân (huỷ nhầm appointment thật).
- Ticket không có route/URL production hoặc dev chính thức cho scheduler link ngoài feature-stage URL đính kèm ảnh (`dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/`). Route thật cần xác nhận ở `LOCATE` — patient scheduler link thường được sinh động (per-patient/campaign), không phải một trang cố định trong PACO dashboard. Impact: Cao, ảnh hưởng trực tiếp khả năng thực hiện `LOCATE`/`EXPLORE`.
- Khung hình lỗi login ("There was an error logging in. If this error persists, please contact your GP practice.") xuất hiện trong một ảnh đính kèm — không có mô tả kèm theo trong text ticket giải thích bối cảnh (NHS No./D.O.B nhập sai, hay lỗi hệ thống liên quan race condition). Impact: Thấp-trung bình, cần làm rõ trước khi coi đây là liên quan tới bug chính.
- Follow-up ticket PAC2-8220 (out of scope, "removes the browser from the confirmation step entirely") và out-of-scope item "CAMPAIGN_ANALYTICS idempotency" — xác nhận với BA/PO rằng hai mục này thực sự nằm ngoài phạm vi PAC2-1805 và không cần test ở đây. Impact: Thấp.

---

## Tester notes

[Protected area]
