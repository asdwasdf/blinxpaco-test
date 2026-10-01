# Requirements: PAC2-191

**Input Revision:** 1  
**Generated:** 2026-09-25T20:10:00+07:00  
**Status:** Active with disputed details

## Source Summary

Ticket yêu cầu ngăn SSO tự tạo PACO user khi account chưa có organisation assignment. Source không có `Description` hoặc `Acceptance criteria`; intent được suy ra từ title và comments. Comments lịch sử bổ sung hai kỳ vọng: account không hợp lệ không được login/auto-create; UI phải hiển thị lỗi và quay lại login. Cách xác minh backend, exact error message và redirect cuối vẫn chưa được xác nhận.

Feature environment do tester cung cấp: `https://pac2-191.dev.blinxpaco-np.com/feature-branch/pac2-191/login/`. Role hiện tại: `Super Admin GB`; role này phù hợp kiểm tra `User Management`, nhưng không đại diện cho SSO user chưa được gán organisation.

## Video Coverage

**Review:** `docs/tickets/PAC2-191-prevent-auto-creation-of-sso-user-accounts-without-organisation-assignment/video/review.md`  
**Timelines/contact sheets:** `docs/tickets/PAC2-191-prevent-auto-creation-of-sso-user-accounts-without-organisation-assignment/video/<attachment-id>/`

- `76121` `00:02:43–00:02:59`: manual user creation và account xuất hiện trong `User Management`.
- `76418` khoảng `00:03:15–00:06:39`: historical `No Organisation Found`, auth loop và `redirect_mismatch`.
- `76419` khoảng `00:01:17–00:01:35`: historical `No Organisation Found` cho SSO user thiếu organisation.
- `87541` `00:02:55–00:06:00`: historical `Add User`, organisation assignment và updated user list.
- `123651` `00:02:04–00:03:11`: feature environment gặp `redirect_mismatch` và standard-login failures.

Video là historical observations, chứa PII/auth details và không tự xác lập expected behavior hiện tại.

## Atomic Requirements

### REQ-PAC2-191-001

**Classification:** Inferred  
**Lifecycle:** Active  
**Feature/Scope:** SSO account provisioning guard  
**Search Terms/Aliases:** SSO, `Single Sign On`, auto-create user, organisation assignment, orphaned account, Cognito  
**Known Location:** Feature environment `/feature-branch/pac2-191/login/`; backend verification location Unknown  
**Actor/Role:** SSO identity chưa có PACO user hoặc chưa có organisation assignment  
**Inference Basis:** Ticket title và comments nói account không tồn tại trong PACO không được login; ticket không có Acceptance Criteria.  
**Observation Context:** Historical dev recordings, roles mostly unknown, 2025–2026  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Dùng safe SSO identity chưa có usable PACO account/organisation assignment.
- Có baseline đáng tin để chứng minh account chưa tồn tại trước attempt.

**Expected Behavior:**
SSO attempt không tự tạo usable PACO user khi organisation assignment chưa tồn tại.

**Provenance:**
- **Source:** `ticket.md:1`, `ticket.md:49`, `ticket.md:63`, `ticket.md:159`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/review.md:12-17` hỗ trợ historical behavior, không xác nhận expected result.  
**Related Tests:** Chưa thiết kế  
**Notes:** Cần backend/API hoặc trusted `User Management` before/after evidence để phân biệt “login blocked” với “account không được auto-create”.

---

### REQ-PAC2-191-002

**Classification:** Inferred  
**Lifecycle:** Disputed  
**Feature/Scope:** SSO login denial UI  
**Search Terms/Aliases:** `Unable to Log In`, `No Organisation Found`, login error, redirect to login, `Single Sign On`  
**Known Location:** `/feature-branch/pac2-191/login/`, historical `/unable-to-login/`, historical `/no-organisation/`  
**Actor/Role:** SSO identity không có usable PACO account/organisation assignment  
**Inference Basis:** Comment yêu cầu hiển thị “cannot log in” và redirect về login; historical recordings hiển thị nhiều error/redirect khác nhau.  
**Observation Context:** Historical dev recordings, roles mostly unknown, 2025–2026  
**Acceptance Criteria Status:** Missing/Ambiguous

**Preconditions:**
- SSO identity thỏa negative-case setup của REQ-PAC2-191-001.
- SSO configuration hợp lệ; không bị deployment `redirect_mismatch` chặn trước business behavior.

**Expected Behavior:**
User bị từ chối truy cập bằng một visible login error và có đường quay lại `login`; exact message/route cần QA xác nhận.

**Provenance:**
- **Source:** `ticket.md:61-65`, `ticket.md:131-141`, `ticket.md:159-170`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/review.md:13-17,23-27`  
**Related Tests:** Chưa thiết kế  
**Notes:** `No Organisation Found`, `Unable to Log In`, blank page và `redirect_mismatch` cùng xuất hiện theo thời gian; không tự chọn một variant làm expected.

---

### REQ-PAC2-191-003

**Classification:** Inferred  
**Lifecycle:** Active  
**Feature/Scope:** Existing valid account regression  
**Search Terms/Aliases:** existing PACO account, organisation assigned, successful SSO, standard login regression  
**Known Location:** `/feature-branch/pac2-191/login/`; valid post-login landing Unknown  
**Actor/Role:** Existing PACO user có valid organisation assignment  
**Inference Basis:** Comments ghi sau khi user được tạo vẫn không login được và successful login case failing; bug fix không được phá valid login.  
**Observation Context:** Historical dev recordings, roles mostly unknown, 2025–2026  
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Safe existing PACO user có confirmed valid organisation assignment.
- Authentication method và expected landing được xác nhận.

**Expected Behavior:**
Existing valid user vẫn login thành công và tới authorised landing page.

**Provenance:**
- **Source:** `ticket.md:67-73`, `ticket.md:155-170`
- **Input Revision:** 1
- **First Recorded:** 2026-09-25
- **Last Verified:** 2026-09-25

**Evidence:** `video/review.md:14-17,24-27` chỉ ghi historical attempts; chưa xác nhận current behavior.  
**Related Tests:** Chưa thiết kế  
**Notes:** Cần tách SSO regression khỏi standard username/password regression nếu cả hai nằm trong scope.

## Ambiguities and Conflicts

- Ticket không có `Description` hoặc `Acceptance criteria`; cả ba requirements hiện là `Inferred`.
- Title nói “without organisation assignment”; comment lại diễn đạt “account does not exist in PACO”. Hai điều kiện có thể khác nhau.
- Historical UI lần lượt hiển thị `No Organisation Found`, `Unable to Log In`, blank page và Cognito `redirect_mismatch`; exact expected result bị `Disputed`.
- Comment 2026-08-19 cho rằng standard username/password login existing account fail, nhưng ticket chủ yếu nói SSO.
- `redirect_mismatch` có thể là deployment/configuration blocker, không phải business behavior của ticket.
- Ticket comments chứa credentials-like test data; không reuse hoặc lưu vào automation/docs mới.

## Open Questions

1. Negative case chính xác là PACO account hoàn toàn chưa tồn tại, hay account tồn tại nhưng không có organisation assignment?
2. Exact error message và final route mong đợi là gì: `Unable to Log In`, `No Organisation Found`, hay login page với inline error?
3. QA cho phép dùng safe SSO identity nào, và cách reset/cleanup account state giữa các attempts?
4. Nguồn nào được phép dùng để chứng minh account không auto-created: `User Management`, backend/Cognito evidence, hay developer confirmation?
5. Existing-valid-account regression cần test SSO, username/password, hay cả hai?
6. Cognito `redirect_mismatch` trên feature environment phải được xử lý trước khi test business behavior hay được xem là ticket failure?

---

## Tester notes

[Protected area]
