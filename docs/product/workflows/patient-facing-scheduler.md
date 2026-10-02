# Workflow: Patient-facing Scheduler

- Classification: `[Observed: dev, không đăng nhập (patient-facing) / Super Admin GB cross-check, 2026-10-02]` — logic bên dưới giữ tag riêng từng bullet
- Aliases: `Patient Self Booking`, `Digital Front Door`, `Patient Appointment Booker`, `scheduler link`, `nhs-scheduler`
- Coverage: `Minimal`
- Confidence: `Low`

File tạo ngày 2026-10-02 để gom logic từ ticket. Route/landmark xem `docs/product/feature-map.md` (module `Patient-facing Scheduler`).

## Business context observed

- Visible purpose: bệnh nhân đặt/đổi lịch qua scheduler link tokenized, không cần login PACO. `[Observed]` — PAC2-1805/requirements.md, feature-location.md
- Host riêng (`*.blinxscheduler-np.com`), session tách với PACO; đổi host trong cùng tab có thể mất session. `[Observed]` — PAC2-1805/status.md, PAC2-4700/exploration.md
- Mở route feature branch không có token → trang `Link Error`. `[Observed]` — PAC2-1805/feature-location.md
- Ghi chú: chưa có Pass/Fail cho bất kỳ ticket nào trong module này (LOCATE/EXPLORE blocked).

## Logic từ ticket

### Chống double-book qua cùng scheduler link (PAC2-1805)

**Luồng**
1. Patient bấm `Book`; backend ghi bản ghi booking vào `appointment.appointment` của PACO TRƯỚC khi gọi EMIS/SystmOne/paco-connect, trạng thái `Pending` → `Booked` (hoặc release khi EPR từ chối). `[Confirmed]` — PAC2-1805/requirements.md (REQ-001)
2. Trang load đọc bản ghi này: refresh/tab mới/back/đăng xuất-đăng nhập lại không mở lại nút `Book`; patient thấy chi tiết appointment đã đặt. `[Confirmed]` — PAC2-1805/requirements.md (REQ-001)
3. Khi PACO đã có row `booked` nhưng row comms-hub (giờ/clinician/location) chưa tới (cửa sổ 2–5 giây trước EPR xác nhận): hiện trạng thái "in progress" (ví dụ "Your booking is being confirmed"), tiếp tục poll, không hiện booking trống, không cho `Book` lại. QA báo Fixed. `[Confirmed]` — PAC2-1805/requirements.md (REQ-002)
4. Hai tab/hai lần bấm `Book` đồng thời trên cùng link: chỉ một thành công, lần còn lại hiện thông báo kiểu "booking already in progress"; ticket ghi Pass trên feature build (2026-09-07). `[Confirmed]` — PAC2-1805/requirements.md (REQ-003)
5. `Reschedule`: slot cũ chỉ bị hủy SAU khi slot mới relay thành công tới EPR; relay thất bại/EPR từ chối thì appointment cũ được khôi phục (`restored_after_failed_reschedule`) và trạng thái `Cancelled` của appointment mới bị gỡ; release cũ + insert mới trong một transaction; comms chỉ gửi cho thời gian mới. `[Confirmed]` — PAC2-1805/requirements.md (REQ-004)

**Business rules**
- Một link chỉ giữ một booking; muốn đặt thêm phải dùng link khác. Không dùng feature flag (luôn bật khi deploy). Thiết kế cũ (DynamoDB lock, TTL 30s, `BOOKING_LOCK_ENABLED`) đã bị thay thế. `[Confirmed]` — PAC2-1805/requirements.md
- Rollback của attempt thất bại chỉ hủy slot trả về `SessionId`/`AppointmentUID` trong chính attempt đó; không hủy appointment đã có trong EPR do staff book thủ công/ngoài link. QA báo Fixed ở case cụ thể. `[Confirmed]` — PAC2-1805/requirements.md (REQ-005)
- Migration DB (bốn cột + hai unique index) phải chạy trên mọi environment trước khi bật fix; nếu chưa, mọi booking bị từ chối. `[Inferred from: REQ-006, needs confirmation]` — PAC2-1805/requirements.md
- Ngoài scope: follow-up gỡ browser khỏi bước xác nhận; idempotency của `CAMPAIGN_ANALYTICS`. `[Confirmed]` — PAC2-1805/requirements.md
- Patient vào bằng link tokenized (xác thực bằng NHS number/DOB trên link). `[Observed]` — PAC2-1805/requirements.md
- Đặt qua `book-appointment` của `nhs-scheduler-be` phải thành công end-to-end sau tối ưu partition (chưa có runtime evidence). `[Confirmed]` — PAC2-8552/requirements.md (REQ-001)

**Trạng thái**
- Booking: `Pending` → `Booked` / released (EPR từ chối); appointment cũ `restored_after_failed_reschedule`. `[Confirmed]` — PAC2-1805/requirements.md

**Role/permission**
- Patient không cần login PACO. `[Observed]` — PAC2-1805/requirements.md

**Defect đã biết**
- PAC2-1805 · Blocked · LOCATE: không có token link thật; cách lấy token mới là `Resend` ở Comms Hub nhưng lỗi HTTP 400 (xem `comms-hub.md`); EXPLORE/TEST_DESIGN pending. `[Observed]` — PAC2-1805/status.md
- PAC2-1805 · Inconclusive · ảnh ticket có một lần lỗi login "There was an error logging in..."; chưa rõ liên quan race condition. `[Observed]` — PAC2-1805/requirements.md
- PAC2-8552 · Blocked · book/cancel phía patient cần scheduler link/token, patient synthetic, service có availability, cleanup owner. `[Observed]` — PAC2-8552/status.md

**Open questions**
- Fix đã merge/deploy tới môi trường nào (gap review 2026-09-07 "chưa merge/deploy", QA 2026-09-11 chỉ feature stage); migration đã chạy UAT/prod; route dev/prod chính thức của scheduler link; độ trễ 2–4 giây khi hủy appointment cũ ở `Reschedule` (tester: hủy ngay khi click; dev: hủy sau relay — Disputed); phạm vi đầy đủ REQ-005. `[Open Question]` — PAC2-1805/requirements.md

### Patient Self Booking UI

**Luồng**
1. Route `/feature-branch/pac2-8552/patient-self-booking/` render UI đặt lịch (DFD) có ô search dịch vụ. `[Observed]` — PAC2-8552/exploration.md
2. Service không có slot hiện `No availability` kèm warning modal; không xác nhận warning, không book. `[Observed]` — PAC2-8552/exploration.md

### Shared Campaign → scheduler link của child practice (PAC2-6982)

**Luồng**
1. Bệnh nhân thuộc child practice đăng nhập qua scheduler link của Shared Campaign và truy cập Health Form đính kèm, kể cả khi child practice là creator của form và form không `Shared To` practice đó. `[Confirmed]` — PAC2-6982/requirements.md (REQ-001, REQ-002)

**Defect đã biết**
- PAC2-6982 · Blocked · bug reported: login/form access fail trong cấu hình child-created form; route patient chưa truy cập (chưa tạo campaign/link), chưa Pass/Fail. `[Observed]` — PAC2-6982/exploration.md, requirements.md

**Open questions**
- Phương thức xác thực scheduler, thông báo lỗi, cách lấy link an toàn, recipient test an toàn. `[Open Question]` — PAC2-6982/requirements.md (OQ-003)

## Tester notes

