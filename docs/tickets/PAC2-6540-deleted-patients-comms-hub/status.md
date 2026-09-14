# Ticket Status: PAC2-6540

**Input Revision:** 1
**Current Phase:** LOCATE
**Last Completed Phase:** ANALYZE
**Updated:** 2026-09-14T02:29:04Z

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
| DISCOVER | completed | completed | 2026-09-13T03:55:10Z |
| INGEST | completed | completed | 2026-09-13T03:55:10Z |
| ANALYZE | completed | completed_with_warnings | 2026-09-13T03:57:55Z |
| LOCATE | blocked | blocked | 2026-09-14T02:29:04Z |
| EXPLORE | pending | - | - |
| TEST_DESIGN | pending | - | - |
| AUTOMATION_REVIEW | pending | - | - |
| AUTOMATE | pending | - | - |
| EXECUTE | pending | - | - |
| REPORT | pending | - | - |
| COMPLETE | pending | - | - |

## Completed Work

- Đã chọn duy nhất ticket `PAC2-6540-deleted-patients-comms-hub`.
- Đã xác thực convention, source confinement và revision 1.
- Đã hoàn thành `ANALYZE`: 5 atomic requirements `Confirmed`, 4 ambiguity/conflict và 8 open questions.
- Đã xác nhận tester dùng role `GP Paco Assist` và manual authentication trên `dev` còn valid.
- Đã locate read-only root `Analytics & Reports` → `Reports` → `/paco/analytics-reports`.
- Đã kiểm tra candidate `/paco/patient-search` và `PaComms`; không có mutation.
- Đã đổi context thủ công sang role `Super User`; dashboard xác nhận role nhưng `PaComms` vẫn disabled.
- Đã đổi context thủ công sang role `Blinx Deployment`; dashboard xác nhận role nhưng `PaComms` vẫn disabled.
- QA xác nhận top-bar `PaComms` không cần cho ticket; candidate này đã chuyển thành rejected path, giữ provenance.
- Đã tìm được route đúng: sidebar `Comms Hub` → `Campaign Manager` → external Comms Hub app.
- External app redirect tới login; không nhập credential và không có mutation.

## Warnings & Blockers

- Ticket nói bệnh nhân bị xem là deleted nhưng ví dụ ghi deleted status `False`.
- Count `404 - 23 = 381`, không khớp 379 bệnh nhân `Not Sent`.
- Root `Analytics and Reports` mở được nhưng không thấy `Advanced Search` hoặc deleted-patient filters.
- QA xác nhận top-bar `PaComms` không cần cho ticket; quyền `PaComms` không còn là blocker.
- Route sidebar `Comms Hub` → `Campaign Manager` đã xác minh.
- External Comms Hub authentication thiếu hoặc hết hạn; redirect tới `/commshub/login?loggedout=true&msg=error-at-axios-interceptor`.
- Chưa thể mở campaign results hoặc `Outbox`.

## Feature Location

- Status: Blocked
- Confirmed partial path: `/paco/dashboard` → `Analytics & Reports` → `Reports` → `/paco/analytics-reports`
- Confirmed partial path: `/paco/dashboard` → sidebar `Comms Hub` → `Campaign Manager` → external Comms Hub login
- Candidate after auth: campaign results/`Outbox` trong external app
- Rejected: top-bar `More options` → `PaComms` theo QA clue ngày 2026-09-14
- Rejected: `/paco/patient-search`
- Budget: 10/12 views; 15/15 minutes
- Mutation: None

## Valid Artifacts

- `manifest.yaml`
- `status.md`
- `requirements.md` — SHA-256 `a09b4be4569f240f32cf6bbb101921262066489188b5056b24d882e47b9f1179`
- `feature-location.md` — SHA-256 `7cc2880b6932807e2864f0369883b2f685208a10ec0a3cdbce5d99e6839b4ff2` — blocked route record

## Stale Artifacts

- Không có.

## Next Action

Đăng nhập thủ công external Comms Hub app trong browser test, rồi quay lại Paco dashboard. Sau đó resume read-only theo route `Comms Hub` → `Campaign Manager`; không tạo hoặc gửi campaign.

## Checkpoint History

- 2026-09-13T03:55:10Z — `INGEST` completed; source SHA-256 `a964d1c3e857a76346f5c483ef0f49ed49431f67ec353886f02184d842f4ca44`.
- 2026-09-13T03:57:55Z — `ANALYZE` completed_with_warnings; `requirements.md` SHA-256 `a09b4be4569f240f32cf6bbb101921262066489188b5056b24d882e47b9f1179`.
- 2026-09-13T03:57:55Z — `LOCATE` blocked trước browser; thiếu role/permission và xác nhận auth.
- 2026-09-13T04:12:05Z — `LOCATE` blocked sau 6 views; root Analytics verified, `PaComms` disabled cho `GP Paco Assist`; `feature-location.md` SHA-256 `378c34b6665eec2d12636da421e0399599ea9d60ed22f1f506532906c75a01ae`; mutation None.
- 2026-09-13T04:20:29Z — `LOCATE` vẫn blocked sau bounded role validation; dashboard xác nhận `Super User`, nhưng `PaComms` vẫn disabled; `feature-location.md` SHA-256 `a85462d7ad137ca66216027ef3da5402e5f4e4fa1e5b08ffcc83652b650e4aa7`; mutation None.
- 2026-09-13T04:29:54Z — `LOCATE` vẫn blocked; dashboard xác nhận `Blinx Deployment`, nhưng `PaComms` vẫn disabled; budget 8/12 views và 15/15 phút; `feature-location.md` SHA-256 `196cc052830405286991536e310f6c0b231c9ec977cfbb8de197dc7f2217d07d`; mutation None.
- 2026-09-14T02:05:10Z — Reconcile QA clue: `PaComms` không cần cho ticket, chuyển thành rejected path; `LOCATE` vẫn blocked vì route thay thế Unknown; `feature-location.md` SHA-256 `b350130539ad7f197c8452a1e863f9860747a2df2808b44c3a803386e059724e`; mutation None.
- 2026-09-14T02:29:04Z — Tìm được route sidebar `Comms Hub` → `Campaign Manager`; external app redirect tới login do auth thiếu/hết hạn; `feature-location.md` SHA-256 `7cc2880b6932807e2864f0369883b2f685208a10ec0a3cdbce5d99e6839b4ff2`; mutation None.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
