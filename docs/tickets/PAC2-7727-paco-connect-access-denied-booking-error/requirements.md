---
name: requirements
description: Atomic requirements cho PAC2-7727 - PACO Connect - Access Denied Booking Error
metadata:
  type: ticket
  status: Active
  input_revision: 1
  generated: 2026-10-16
---

# Requirements: PAC2-7727

**Input Revision:** 1
**Generated:** 2026-10-16
**Status:** Active

## Source Summary

Ticket `PAC2-7727 - PACO Connect - Access Denied Booking Error`. Source thiếu Summary/Description/Acceptance criteria (Not provided). Có 6 comments Jira (2026-08-10 → 2026-10-16): Cephas xác nhận PRs đã merge dev, Priscilla xác nhận PACO Connect ticket exception test trên dev, Fiona đã pass trên dev 2026-08-19 với video evidence, Sean (2026-10-16) yêu cầu regression nhưng reassign lại cho Fiona vì thiếu context.

Video evidence (Fiona 2026-08-19, 178.3s) reproduce được flow: từ PACO Configuration → `DFD` menu → scheduler "Request an appointment" → web form. Tại giây 60, page `Link Error` hiển thị "No token found. Your link may have expired — please use the most recent link your healthcare team sent you." Sau đó URL chuyển sang web form và load thành công — flow vẫn tiếp tục đến submit.

Inferred scope: lỗi intermittent `Link Error / "No token found"` xuất hiện trong transition giữa scheduler page (`dev.blinxscheduler-np.com/patient-self-booking/#<jwt>`) và web form page (`dev.blinxscheduler-np.com/web-form/?wf=...`). Có thể liên quan đến JWT token validation, hash fragment parsing, hoặc routing logic.

## Video Coverage

**Timeline:** `docs/tickets/PAC2-7727-paco-connect-access-denied-booking-error/video/video-notes.md` (analyzed by subagent 2026-10-16)
**Contact Sheet:** pending subagent output (không cần cho atomic requirements)

Map behavior/frame timestamp → requirement:
- `0s` PACO Configuration sidebar `Patient > DFD` hover → REQ-001 (entry point)
- `30s` Scheduler page loaded với patient Michael Ramella (NHS 70986) → REQ-002, REQ-003
- `60s` Error page "Link Error / No token found" → REQ-004 (defect scope)
- `90s-178s` Web form load và hoạt động bình thường → REQ-005 (recovery path)

## Atomic Requirements

### REQ-PAC2-7727-001

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Patient-facing scheduler — entry point từ PACO Configuration
**Search Terms/Aliases:** `DFD`, `Digital Front Door`, `Patient DFD`, `scheduler link generator`, `DFD booking link`
**Known Location:** PACO → sidebar `Configuration` → submenu `Patient` → item `DFD` (theo video 0s); cross-ref: `docs/product/workflows/patient-facing-scheduler.md`
**Actor/Role:** PACO user có quyền `DFD` (inferred staff/clinic role)
**Inference Basis:** Video 0s cho thấy menu `DFD` trong sidebar `Patient`; feature-map xác nhận `DFD = Digital Front Door = scheduler`.
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Đã đăng nhập PACO với role có quyền truy cập `Configuration > Patient > DFD`

**Expected Behavior:**
User mở `Configuration > Patient > DFD`, hệ thống hiển thị giao diện generate/copy booking link cho patient (link có chứa JWT token trong URL fragment).

**Provenance:**
- **Source:** `ticket/PAC2-7727-paco-connect-access-denied-booking-error/video-notes.md` step 1
- **Input Revision:** 1
- **First Recorded:** 2026-10-16
- **Last Verified:** 2026-10-16
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 0s
**Related Tests:** TBD (TEST_DESIGN)
**Notes:** Entry-point chi tiết (button "Copy DFD link", v.v.) chưa confirm bằng browser session mới; cần `LOCATE` để xác minh.

---

### REQ-PAC2-7727-002

**Classification:** Observed
**Lifecycle:** Candidate
**Feature/Scope:** Patient-facing scheduler — landing page `Request an appointment`
**Search Terms/Aliases:** `Request an appointment`, `patient self booking`, `scheduler page`, `patient-self-booking`
**Known Location:** `https://dev.blinxscheduler-np.com/patient-self-booking/#<jwt-token>` (host `dev.blinxscheduler-np.com`, JWT trong URL fragment)
**Actor/Role:** Patient (recipient của booking link)
**Observation Context:** Video 2026-08-19 trên dev với patient Michael Ramella (NHS 70986)
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Patient nhận được booking link còn hiệu lực (JWT token chưa expire)
- Token trong URL fragment hợp lệ

**Expected Behavior:**
Mở booking link → scheduler page `Request an appointment` load với patient context pre-populated (name, NHS No, DOB), button `Send Secure Code` để bắt đầu auth flow.

**Provenance:**
- **Source:** `ticket/PAC2-7727-paco-connect-access-denied-booking-error/video-notes.md` step 2
- **Input Revision:** 1
- **First Recorded:** 2026-10-16
- **Last Verified:** 2026-10-16
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 30s
**Related Tests:** TBD
**Notes:** Quan sát 1 lần trong video 1 tháng trước; cần verify lại trên dev hiện tại (có thể đã thay đổi).

---

### REQ-PAC2-7727-003

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Patient-facing scheduler — patient context persistence
**Search Terms/Aliases:** `patient context`, `pre-populated patient details`, `NHS number`, `DOB`
**Known Location:** Scheduler page header (inferred)
**Actor/Role:** Patient
**Inference Basis:** Video 30s cho thấy Michael Ramella, NHS 70986, DOB 19/08/2026 đã populated sẵn; video 90s xác nhận context vẫn còn sau khi gặp lỗi.
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Booking link mang theo patient identifier trong JWT

**Expected Behavior:**
Sau khi load scheduler (dù thành công hoặc sau recovery từ lỗi), patient context (name, NHS, DOB) phải được giữ nguyên — không yêu cầu patient nhập lại.

**Provenance:**
- **Source:** `ticket/PAC2-7727-paco-connect-access-denied-booking-error/video-notes.md` step 2 + step 4
- **Input Revision:** 1
- **First Recorded:** 2026-10-16
- **Last Verified:** 2026-10-16
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 30s, 90s
**Related Tests:** TBD
**Notes:** Cross-check 30s vs 90s cho thấy context nguyên vẹn qua transition.

---

### REQ-PAC2-7727-004

**Classification:** Observed
**Lifecycle:** Candidate
**Feature/Scope:** Patient-facing scheduler — error page `Link Error / No token found`
**Search Terms/Aliases:** `Link Error`, `No token found`, `link expired`, `token expired`, `Access Denied`
**Known Location:** Scheduler host `dev.blinxscheduler-np.com` — exact route chưa capture trong video (chỉ thấy trang lỗi ở 60s)
**Actor/Role:** Patient
**Observation Context:** Video 2026-08-19 trên dev; xuất hiện ở giây 60 trong transition sang web form
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Booking link không có token hợp lệ, hoặc token đã expire, hoặc hash fragment không được parse đúng

**Expected Behavior:**
Hệ thống hiển thị error page với:
- Heading: `Link Error`
- Body: `No token found. Your link may have expired — please use the most recent link your healthcare team sent you.`
- Visual: info icon (chấm than trong vòng tròn), background xanh nhạt, modal trắng centered, footer "Powered by blinx healthcare"

**Provenance:**
- **Source:** `ticket/PAC2-7727-paco-connect-access-denied-booking-error/video-notes.md` "Error message nguyên văn"
- **Input Revision:** 1
- **First Recorded:** 2026-10-16
- **Last Verified:** 2026-10-16
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 60s
**Related Tests:** TBD — đây là **defect scope** chính
**Notes:**
- Đây là behavior sai: link có token hợp lệ (URL fragment chứa `eyJhbG...` JWT) nhưng vẫn báo "No token found". Bug nằm ở token validation/parsing chứ không phải link thực sự hết hạn.
- Lỗi intermittent — sau đó flow vẫn tiếp tục (90s) → có thể là transient state.

---

### REQ-PAC2-7727-005

**Classification:** Observed
**Lifecycle:** Candidate
**Feature/Scope:** Patient-facing scheduler — recovery path từ `Link Error` sang web form
**Search Terms/Aliases:** `web form`, `web-form`, `wf=`, `Hi <name>`, `Brief description`, `Details of your symptoms today?`
**Known Location:** `https://dev.blinxscheduler-np.com/web-form/?wf=...` (URL pattern từ video 90s)
**Actor/Role:** Patient
**Observation Context:** Video 2026-08-19 — sau 60s error, page tự navigate hoặc user retry, web form load thành công ở 90s
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Link có token hợp lệ
- Sau khi vượt qua error page (auto-recovery hoặc manual retry)

**Expected Behavior:**
Web form load với:
- Greeting: `Hi <patient name> 👋`
- NHS No. hiển thị
- Form fields: `Brief description`, `Details of your symptoms today?`
- Cho phép patient điền form, upload file, submit

**Provenance:**
- **Source:** `ticket/PAC2-7727-paco-connect-access-denied-booking-error/video-notes.md` step 4
- **Input Revision:** 1
- **First Recorded:** 2026-10-16
- **Last Verified:** 2026-10-16
**Evidence:** `video/123771-20260819-1424-40.9094421.mp4` @ 90s, 120s, 150s, 178s
**Related Tests:** TBD
**Notes:** Recovery có thể do: (a) auto-retry sau khi error page render, (b) tự động chuyển URL khi token validate thành công ở request tiếp theo, (c) user thao tác gì đó không thấy trong video. Cần xác minh cơ chế.

---

### REQ-PAC2-7727-006

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Cross-environment note — PACO Connect exception
**Search Terms/Aliases:** `PACO Connect exception`, `test on dev`, `up to dev for testing`
**Known Location:** N/A (process rule, không phải UI)
**Actor/Role:** QA / tester
**Inference Basis:** Comment Priscilla Hancock 2026-08-19: "PACO connect tickets is an exception and all go up to dev for testing."
**Acceptance Criteria Status:** Present (process)

**Preconditions:**
- Ticket thuộc PACO Connect scope

**Expected Behavior:**
QA test PACO Connect ticket trên `dev` environment, không cần test ở pre-prod/staging. Vẫn phải qua regression flow bình thường.

**Provenance:**
- **Source:** `ticket/PAC2-7727-paco-connect-access-denied-booking-error/ticket.md` line 45-47 (Priscilla comment)
- **Input Revision:** 1
- **First Recorded:** 2026-10-16
- **Last Verified:** 2026-10-16
**Evidence:** ticket.md comment 4
**Related Tests:** N/A (process gate)
**Notes:** Confirmed bởi Priscilla — không cần xác minh thêm.

---

## Ambiguities and Conflicts

- **Source ticket.md thiếu Summary/Description/Acceptance criteria** — toàn bộ scope phải infer từ video + comments. Marker `## Description` / `## Acceptance criteria` đều ghi `Not provided`. Marker `## Fields` chỉ có 1 dòng placeholder.
- **Title vs observed error**: title nói `Access Denied Booking Error` nhưng error message thực tế trong video là `Link Error / No token found`. Có thể:
  - (a) `Access Denied` là bug label tổng quát, `Link Error` là message UI cụ thể → consistent.
  - (b) Hai bug khác nhau — một về access (RBAC), một về token. Cần xác minh với reporter (Sean) hoặc xem thêm bug khác cùng ticket.
- **Video gốc của Sean "fail"** không có trong ticket — chỉ có video Pass của Fiona 2026-08-19. Sean chỉ mới reassign lại cho Fiona mà chưa attach evidence mới. **Open Question.**

## Open Questions

- **OQ-1:** Sean nói "fail gì" — cụ thể lỗi nào Sean quan sát? Có phải cùng `Link Error / No token found` không, hay khác? Cần hỏi Sean trước `MANUAL_EXECUTE` để biết scope regression.
- **OQ-2:** Lỗi `Link Error` ở 60s — sau đó recovery thành công (90s). Đây là bug đã fix, bug vẫn còn, hay by-design? Cần test lại trên dev hiện tại (2026-10-16) để xem có reproduce được không.
- **OQ-3:** Entry point từ PACO Configuration → DFD (video 0s) — hiện tại menu/label/path có còn đúng không, hay đã refactor? Cần `LOCATE` trên dev hiện tại.
- **OQ-4:** Patient test data — Michael Ramella / NHS 70986 từ video có còn available trên dev để reproduce không, hay cần tạo data mới với prefix `QA-AUTO`?
- **OQ-5:** "PACO Connect" trong title — là app riêng (PACO Connect module) hay là feature trong PACO? Comment Priscilla nói "PACO connect tickets" nhưng feature-map ghi `Module: Patient-facing Scheduler (external host *.blinxscheduler-np.com)`. Cần làm rõ phạm vi.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
