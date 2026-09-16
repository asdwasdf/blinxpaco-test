# Feature Location: PAC2-1805

**Input Revision:** 1
**Environment:** dev
**Role:** `Patient (scheduler link, no PACO login)` — cross-check thực hiện với `Super Admin GB` (PACO dashboard, tài khoản Test Fiona Nguyen, General Practice (Blinx Demo Site))
**Observed:** 2026-09-16
**Status:** Blocked
**Budget:** 12/12 views; ~14/15 minutes

## Search clues

- `Book Appointment`, `booking link`, `scheduler link`, "Your booking is being confirmed", `Quick Send`, `Campaign Manager`
- Route trong ảnh đính kèm ticket: `dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/` (feature-stage QA của tony.do, 2026-09-11)

## Confirmed entry path

1. Starting state: PACO dashboard (`https://blinx.dev.blinxpaco-np.com/paco/dashboard`), đăng nhập `Super Admin GB`
   - Landmark/control: sidebar icon `Quick Send` (label ẩn, tooltip "Quick Send" — điều hướng tới Comms Hub)
   - Read-only action: click `Quick Send` → mở menu `Template Manager` / `Campaign Manager` / `Patient Manager`
   - Resulting state: menu dropdown 3 mục
   - Context dependency: không cần patient context để mở menu

2. Starting state: menu `Quick Send`
   - Landmark/control: mục `Campaign Manager`
   - Read-only action: click `Campaign Manager`
   - Resulting state: redirect sang `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager` → **chặn tại màn hình login riêng của Comms Hub** (không share session với PACO)
   - Context dependency: cần tài khoản Comms Hub riêng (SSO hoặc Username/Password) — chưa có

3. Starting state: PACO dashboard → sidebar `Quick Send` → `Campaign Manager` (sau khi tester tự đăng nhập Comms Hub thủ công trong phiên này)
   - Landmark/control: search box `Search campaigns...`, filter `Non-Shared Campaigns`
   - Read-only action: search "EMIS Booking" → mở rộng nhóm → tìm thấy campaign **"Simple EMIS Booking - Same Day GP"** (type `Quick Send`, khớp chính xác tên trong ảnh đính kèm ticket)
   - Resulting state: danh sách campaign với action icon `Campaign Outbox` (phong bì), `Performance`, edit, delete
   - Context dependency: Organisation `General Practice (Blinx Demo Site) (YGMQJ)`, cần tài khoản Comms Hub riêng (tester tự đăng nhập)

4. Starting state: click icon Campaign Outbox trên dòng "Simple EMIS Booking - Same Day GP"
   - Landmark/control: trang `Campaign Outbox`, breadcrumb "Comms Hub > Campaign Manager > Simple EMIS Booking - Same Day GP"
   - Read-only action: search communications → thấy 19 dòng lịch sử gửi cho patient **Michael Ramella (NHS 70986)** — đúng patient trong ảnh đính kèm ticket gốc, gồm nhiều `Initial Email`, `Confirmation Email`, `Confirmation SMS` từ 11/09/2026 đến 14/09/2026
   - Resulting state: bảng comm log, cột `Actions` chỉ có nút `Resend` (mutation)
   - Context dependency: cần chọn đúng campaign; token/booking-link thật nằm trong nội dung email/SMS đã gửi, không hiển thị trực tiếp qua UI này

5. Starting state: bảng Campaign Outbox, dòng "Initial Email" 11/09/2026 22:35
   - Landmark/control: nút icon `Resend` (mũi tên xoay) → dialog "Resend Communication — Resend Initial Email to Michael Ramella?"
   - Action (có approval từ tester): bấm `Resend` → **thất bại kỹ thuật**: console ghi `Error: Request failed with status code 400` (3 lần thử độc lập, cách nhau vài phút — 17:40:02, 17:44:25, 17:45:51), kèm exception phụ `TypeError: Cannot read properties of undefined (reading 'map')` tại `editCampaignDetailsModal.js` mỗi lần. Dialog không đóng, không có toast thành công/thất bại hiển thị trên UI cho user biết request đã fail.
   - Resulting state: Resend không tạo được token/link mới ở cả 3 lần thử — **lỗi tái lập ổn định (3/3)**, không phải sự cố tạm thời/network glitch; đã đóng dialog bằng `Cancel`, dừng thử thêm để tránh spam request không cần thiết
   - Context dependency: đây là một technical fault của chính tính năng Resend trên Comms Hub dev — không phải hành vi thuộc phạm vi PAC2-1805, nhưng chặn hoàn toàn khả năng lấy token mới qua đường này

6. Starting state: browser tab mới, không qua PACO
   - Landmark/control: URL trực tiếp `https://dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/` (lấy từ ảnh đính kèm ticket)
   - Read-only action: navigate trực tiếp
   - Resulting state: app `Blinx Scheduler` load thành công, hiển thị card "Link Error — No token found. Your link may have expired." (route hợp lệ, app đang chạy, nhưng thiếu token per-patient trong URL)
   - Context dependency: cần token/query param sinh theo từng patient (qua campaign send) mới vào được flow đặt lịch thật

## Context requirements

- Flow patient-facing (`Book Appointment`, refresh/re-entry bug) đòi hỏi một **scheduler link đã được gửi cho một patient cụ thể** (chứa token), không phải một route cố định trong PACO dashboard.
- Link được sinh ra khi practice user gửi campaign qua Comms Hub `Campaign Manager` (hoặc `Quick Send`/`Template Manager`) tới patient — cần tài khoản Comms Hub riêng biệt với PACO.
- Domain patient-facing: `*.blinxscheduler-np.com` (tách biệt hoàn toàn khỏi domain PACO `blinx.dev.blinxpaco-np.com` và Comms Hub `*.blinxhealthcare.com`).

## Candidate and rejected paths

- Candidate (route context đã Confirmed, token vẫn chưa lấy được): `Comms Hub > Campaign Manager > "Simple EMIS Booking - Same Day GP" (Quick Send) > Campaign Outbox` — patient Michael Ramella (NHS 70986), tổ chức General Practice (Blinx Demo Site). Đây là entry path đúng về mặt context nhưng chưa mở khoá được token thật.
- Rejected: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager` truy cập trực tiếp (gõ URL/click từ PACO trước khi tester đăng nhập) — auth boundary, đã fix sau khi tester tự đăng nhập thủ công (dependency revision: input_revision 1, không đổi).
- Rejected: `https://dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/` (không token) — xác nhận route/app còn sống, nhưng không phải entry path dùng được để test flow booking (thiếu token, "Link Error").
- Rejected: `Resend` action trên Campaign Outbox (để sinh token mới) — **technical fault**: HTTP 400 từ backend Comms Hub, không phải auth/permission boundary. Đã thử 3 lần độc lập (17:40:02, 17:44:25, 17:45:51), cùng lỗi mỗi lần — tái lập ổn định. Dừng thử thêm (tránh spam mutation).

## Observed landmarks

- PACO dashboard: header "Hi [Patient Name]" pattern quan sát được qua ảnh đính kèm ticket (không phải browse trực tiếp lần này); sidebar icon accessible name `Quick Send` (tooltip xác nhận qua `find`).
- Comms Hub login: heading "Welcome Back — Welcome back to Communications Hub.", nút `Sign In`, toggle "Username and Password -->".
- Blinx Scheduler (no token): heading "Link Error", text "No token found. Your link may have expired.", footer "Powered by blinx healthcare".

## Evidence

- Screenshot Comms Hub login (không chứa PII, an toàn lưu tham chiếu; ảnh gốc không copy vào docs theo evidence-handling).
- Screenshot Blinx Scheduler "Link Error" (không chứa PII).
- Ảnh đính kèm gốc trong ticket (`ticket/PAC2-1805-.../*.jpg`, 5 file) đã xem ở ANALYZE — cho thấy flow thật khi có token hợp lệ (patient Michael Ramella, NHS No. 70986, feature stage 2026-09-11); không copy lại NHS No./patient name vào evidence curated ở đây (patient/NHS identifier phải redact theo data-safety).

## Automation hints

- Domain/app riêng cho patient booking: `*.blinxscheduler-np.com` — automation cho REQ-001..005 cần một cách sinh token hợp lệ trước (qua Comms Hub API/UI hoặc fixture có sẵn), không thể hardcode URL cố định.
- Landmark ổn định quan sát được (từ ảnh ticket, chưa tự verify trực tiếp): heading "Hi [PatientName]", card "Appointment Invite", button "Book Appointment", card "Available Dates" (calendar), toggle "View time as: Range/Slot", button "View Appointment".

## Blockers and next action

- Blocker 1 (đã giải quyết một phần): thiếu quyền Comms Hub — tester đã tự đăng nhập thủ công trong phiên này, mở khoá được `Campaign Manager` và `Campaign Outbox`.
- Blocker 2 (còn tồn tại, đã re-verify): tính năng `Resend` trên Campaign Outbox — con đường duy nhất quan sát được qua UI để lấy nội dung link/token thật — thất bại với lỗi kỹ thuật HTTP 400, tái lập ổn định qua **3 lần thử độc lập** (không phải glitch tạm thời). Đây nhiều khả năng là một defect riêng của Comms Hub (ngoài phạm vi PAC2-1805) cần báo cáo riêng, và nó chặn hoàn toàn khả năng lấy token mới qua UI trong phiên LOCATE này.
- Budget đã cạn (12/12 views, ~14/15 phút) — dừng LOCATE tại đây theo stop condition.
- Next action (cần tester xác nhận một trong các lựa chọn):
  1. Cung cấp trực tiếp một scheduler link (token) còn hiệu lực đã có sẵn (ví dụ từ email/SMS thật của số test +447379060817, hoặc link khác đã lưu), hoặc
  2. Thử lại `Resend` trên môi trường khác/thời điểm khác (nếu nghi ngờ lỗi 400 là tạm thời) — cần approval mutation riêng cho lần thử tiếp theo, hoặc
  3. Báo cáo lỗi `Resend` (HTTP 400 + exception `editCampaignDetailsModal.js`) như một defect riêng (không thuộc PAC2-1805) trước, rồi quay lại LOCATE sau khi có cách khác lấy token, hoặc
  4. Đánh dấu `EXPLORE` cho PAC2-1805 là blocked với lý do cụ thể (không lấy được token thật) và tiến hành `TEST_DESIGN` ở mức `Preliminary` (route context đã Confirmed một phần qua Campaign Outbox, nhưng chưa có token thật để verify hành vi UI — automation gate sẽ chặn cho tới khi có route đầy đủ).

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
