# Ticket Status: PAC2-6540

**Input Revision:** 1
**Current Phase:** EXPLORE
**Last Completed Phase:** LOCATE
**Updated:** 2026-09-15T15:20:37Z

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
| DISCOVER | completed | completed | 2026-09-13T03:55:10Z |
| INGEST | completed | completed | 2026-09-13T03:55:10Z |
| ANALYZE | completed | completed_with_warnings | 2026-09-13T03:57:55Z |
| LOCATE | completed | completed | 2026-09-15T15:08:45Z |
| EXPLORE | blocked | blocked | 2026-09-15T15:20:37Z |
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
- Đã chạy lại bằng role `Super Admin GB`; external Comms Hub authentication valid và `Campaign Manager` root mở được.
- Không dùng `Create Campaign`, không chọn campaign, không gửi dữ liệu; mutation `None`.
- Tester đã xác nhận role `Super Admin GB` được phép xem patient/message data trong run này.
- Đã filter exact ticket campaign trong `Campaign Outbox`; không có match tại site/date range hiện tại.

## Warnings & Blockers

- Ticket nói bệnh nhân bị xem là deleted nhưng ví dụ ghi deleted status `False`.
- Count `404 - 23 = 381`, không khớp 379 bệnh nhân `Not Sent`.
- Root `Analytics and Reports` mở được nhưng không thấy `Advanced Search` hoặc deleted-patient filters.
- QA xác nhận top-bar `PaComms` không cần cho ticket; quyền `PaComms` không còn là blocker.
- Route sidebar `Comms Hub` → `Campaign Manager` đã xác minh.
- External Comms Hub authentication đã valid trong lần chạy 2026-09-15 với role `Super Admin GB`.
- `Campaign Manager` root mở được; `Campaign Outbox` visible và enabled.
- Đã mở thành công `Campaign Outbox` root tại `/commshub/campaign-outbox` bằng read-only action.
- Site context quan sát được: `General Practice (Blinx Demo Site) (YGMQJ)`; chưa chọn campaign.

## Feature Location

- Status: Confirmed
- Confirmed partial path: `/paco/dashboard` → `Analytics & Reports` → `Reports` → `/paco/analytics-reports`
- Confirmed path: `/paco/dashboard` → sidebar `Comms Hub` → `Campaign Manager` → `/commshub/campaign-manager` → `Campaign Outbox` → `/commshub/campaign-outbox`
- Candidate for `EXPLORE`: ticket-specific campaign result trong `Outbox`
- Rejected: top-bar `More options` → `PaComms` theo QA clue ngày 2026-09-14
- Rejected: `/paco/patient-search`
- Latest run budget: 3/12 views; 2/15 minutes
- Mutation: None

## Valid Artifacts

- `manifest.yaml`
- `status.md`
- `requirements.md` — SHA-256 `a09b4be4569f240f32cf6bbb101921262066489188b5056b24d882e47b9f1179`
- `feature-location.md` — SHA-256 `96af1b9261943061e02e71220c306fcf9cd0f9b7a40ce3b1703228bf5a83dfd2` — confirmed route record
- `exploration.md` — SHA-256 `785c0ce5bc0c030ecb3f6a2238a8c262d7a4f24327373b7038ba300eb23d8837` — blocked observation record

## Stale Artifacts

- Không có.

## Next Action

Admin cấp Myrtle Practice context cho role/session, hoặc BA/PO cung cấp trusted organisation mapping. Không tìm thấy mapping trong ticket, product docs hoặc artifacts hiện có; QA workflow không thể tự cấp entitlement.

## Checkpoint History

- 2026-09-13T03:55:10Z — `INGEST` completed; source SHA-256 `a964d1c3e857a76346f5c483ef0f49ed49431f67ec353886f02184d842f4ca44`.
- 2026-09-13T03:57:55Z — `ANALYZE` completed_with_warnings; `requirements.md` SHA-256 `a09b4be4569f240f32cf6bbb101921262066489188b5056b24d882e47b9f1179`.
- 2026-09-13T03:57:55Z — `LOCATE` blocked trước browser; thiếu role/permission và xác nhận auth.
- 2026-09-13T04:12:05Z — `LOCATE` blocked sau 6 views; root Analytics verified, `PaComms` disabled cho `GP Paco Assist`; `feature-location.md` SHA-256 `378c34b6665eec2d12636da421e0399599ea9d60ed22f1f506532906c75a01ae`; mutation None.
- 2026-09-13T04:20:29Z — `LOCATE` vẫn blocked sau bounded role validation; dashboard xác nhận `Super User`, nhưng `PaComms` vẫn disabled; `feature-location.md` SHA-256 `a85462d7ad137ca66216027ef3da5402e5f4e4fa1e5b08ffcc83652b650e4aa7`; mutation None.
- 2026-09-13T04:29:54Z — `LOCATE` vẫn blocked; dashboard xác nhận `Blinx Deployment`, nhưng `PaComms` vẫn disabled; budget 8/12 views và 15/15 phút; `feature-location.md` SHA-256 `196cc052830405286991536e310f6c0b231c9ec977cfbb8de197dc7f2217d07d`; mutation None.
- 2026-09-14T02:05:10Z — Reconcile QA clue: `PaComms` không cần cho ticket, chuyển thành rejected path; `LOCATE` vẫn blocked vì route thay thế Unknown; `feature-location.md` SHA-256 `b350130539ad7f197c8452a1e863f9860747a2df2808b44c3a803386e059724e`; mutation None.
- 2026-09-14T02:29:04Z — Tìm được route sidebar `Comms Hub` → `Campaign Manager`; external app redirect tới login do auth thiếu/hết hạn; `feature-location.md` SHA-256 `7cc2880b6932807e2864f0369883b2f685208a10ec0a3cdbce5d99e6839b4ff2`; mutation None.
- 2026-09-15T15:02:44Z — Chạy lại với role `Super Admin GB`; authentication valid và `/commshub/campaign-manager` mở được. `Campaign Outbox` không còn tồn tại sau khi dữ liệu tải nên `LOCATE` vẫn blocked tại budget 12/12; `feature-location.md` SHA-256 `9e7d0fd8b60d9e2f25cdaad2ff9665855c390c07d80507f78b02f0682e84a815`; mutation None.
- 2026-09-15T15:08:45Z — Fresh bounded validation xác minh `Campaign Outbox` visible/enabled và mở `/commshub/campaign-outbox`; site context `General Practice (Blinx Demo Site) (YGMQJ)`; `LOCATE` completed, `feature-location.md` SHA-256 `96af1b9261943061e02e71220c306fcf9cd0f9b7a40ce3b1703228bf5a83dfd2`; mutation None.
- 2026-09-15T15:13:36Z — `EXPLORE` read-only filter exact campaign name không tìm thấy match tại `General Practice (Blinx Demo Site) (YGMQJ)` và default date range `17/08/2026 - 15/09/2026`; blocked chờ target site/date; `exploration.md` SHA-256 `f727f4d69374b334a38de12c40da93bd1734ced01939825359fff07d58ffa424`; mutation None.
- 2026-09-15T15:17:53Z — Tự kiểm tra `All Time` (`01/01/1970 - 15/09/2026`), 4,385 campaigns và visible organisation options; exact campaign absent, Myrtle Practice không có trong selector. `EXPLORE` inconclusive; `exploration.md` SHA-256 `57a7ffb18133ea02a1ae4d8f1325a2adaa65f61555bb7f05a33ce7eab0fe72f5`; mutation None.
- 2026-09-15T15:20:37Z — Search trusted local sources không tìm thấy mapping Myrtle Practice sang organisation visible; `EXPLORE` blocked chờ admin entitlement hoặc BA/PO mapping; `exploration.md` SHA-256 `785c0ce5bc0c030ecb3f6a2238a8c262d7a4f24327373b7038ba300eb23d8837`; mutation None.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
