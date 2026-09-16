# Ticket Status: PAC2-1805

**Input Revision:** 1
**Current Phase:** LOCATE (blocked)
**Last Completed Phase:** ANALYZE
**Updated:** 2026-09-16

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
| DISCOVER | completed | completed | 2026-09-16 |
| INGEST | completed | completed | 2026-09-16 |
| ANALYZE | completed | completed_with_warnings | 2026-09-16 |
| LOCATE | blocked | blocked | 2026-09-16 |
| EXPLORE | pending | - | - |
| TEST_DESIGN | pending | - | - |
| AUTOMATION_REVIEW | pending | - | - |
| AUTOMATE | pending | - | - |
| EXECUTE | pending | - | - |
| REPORT | pending | - | - |
| COMPLETE | pending | - | - |

## Completed Work

- DISCOVER: resolve ticket key `PAC2-1805`, validate source pattern và confinement, không trùng lặp folder output.
- INGEST: hash `ticket.md` (sha256 `e9123830...`, revision=1).
- ANALYZE: `paco-requirements` tạo `requirements.md` với 6 atomic requirement (`REQ-PAC2-1805-001..006`):
  - REQ-001: booking state được lưu ở backend, chặn re-entry qua refresh/logout/back button (bug chính của ticket).
  - REQ-002: trạng thái "in progress" khi PACO đã có row `booked` nhưng comms-hub row chưa tới.
  - REQ-003: hai tab/hai lần bấm `Book` đồng thời — chỉ một thành công.
  - REQ-004: reschedule không huỷ slot cũ trước khi slot mới relay thành công; restore khi thất bại.
  - REQ-005: rollback chỉ huỷ đúng slot của attempt hiện tại, không huỷ appointment không do chính link tạo.
  - REQ-006 (Inferred): unique index migration là điều kiện tiên quyết hạ tầng cho các fix trên hoạt động ngoài dev.
  - 3 ambiguity (Disputed): timing huỷ khi reschedule (Beth vs. log tony.do), phạm vi đầy đủ của fix REQ-005, thiết kế OLD (DynamoDB lock) vs. Current.
  - 6 open question, quan trọng nhất: trạng thái deploy/migration của các fix trên UAT/prod tại thời điểm test, và route production/dev chính thức cho scheduler patient link.

- LOCATE (lần 1): `paco-explore` mode `locate` xác nhận PACO dashboard (đăng nhập `Super Admin GB`, Test Fiona Nguyen). Sidebar `Quick Send` > `Campaign Manager` redirect sang **Comms Hub** (`nhs-comms-hub-dev.blinxhealthcare.com`) — yêu cầu tài khoản riêng, không share session với PACO. Thử candidate trực tiếp `dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/` (URL lấy từ ảnh đính kèm ticket) — app còn sống nhưng báo "Link Error — No token found" (thiếu token per-patient). Kết quả: `Blocked`.
- LOCATE (lần 2, sau khi tester tự đăng nhập Comms Hub): mở được `Campaign Manager`, tìm thấy campaign **"Simple EMIS Booking - Same Day GP"** (Quick Send) khớp ảnh ticket; `Campaign Outbox` cho thấy 19 dòng lịch sử gửi cho patient **Michael Ramella (NHS 70986)** — đúng patient trong ảnh ticket. Với approval của tester, thử `Resend` "Initial Email" để lấy token mới — **thất bại kỹ thuật HTTP 400, tái lập ổn định qua 3 lần thử độc lập** (17:40, 17:44, 17:45 — cùng lỗi console mỗi lần, không phải glitch tạm thời). Budget hết (12/12 views). Kết quả: vẫn `Blocked`. Ghi vào `feature-location.md`.

## Warnings & Blockers

- Ticket chỉ có một dòng Acceptance Criteria tổng quát; phần lớn chi tiết hành vi nằm rải rác trong comment kỹ sư (không phải format AC chuẩn) — coi là `Confirmed` vì có log/commit cụ thể kèm theo, nhưng cần lưu ý khi báo cáo kết quả.
- Nhiều fix được mô tả "Fixed" trong comment nhưng **chưa xác nhận đã deploy tới UAT/prod** tại thời điểm test (2026-09-16). Gap review 2026-09-07 ghi rõ "Nothing is merged or deployed yet"; QA report 2026-09-11 chỉ xác nhận trên feature stage (`dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/`). Cần làm rõ ở `LOCATE` môi trường nào thực sự phản ánh code đã fix trước khi test.
- Không có route production/dev chính thức trong text ticket cho scheduler patient link — chỉ có URL feature-branch xuất hiện trong ảnh đính kèm (khung hình video). `LOCATE` cần xác định route thật (có thể patient link được sinh động theo campaign, không phải trang cố định trong PACO dashboard).
- REQ-005 (không huỷ appointment không do chính link tạo): fix xác nhận cho case cụ thể (rollback theo slot id), nhưng Beth mô tả concern rộng hơn và không replicate được với patient khác — phạm vi đầy đủ chưa được xác nhận. Không automate assertion rộng hơn phạm vi đã Confirmed.
- REQ-006 (unique index migration) không thể test trực tiếp qua black-box UI; chỉ quan sát gián tiếp (nếu migration chưa chạy trên môi trường test, mọi booking sẽ fail).
- **Phát hiện mới (LOCATE lần 2, đã re-verify):** nút `Resend` trên Comms Hub `Campaign Outbox` lỗi kỹ thuật HTTP 400, **tái lập ổn định qua 3 lần thử độc lập** (có approval mỗi lần), kèm exception phụ tại `editCampaignDetailsModal.js` mỗi lần. Không có toast lỗi hiển thị cho user — dialog vẫn đứng yên như thể chưa xử lý. Đây nhiều khả năng là defect riêng của Comms Hub, **không thuộc phạm vi PAC2-1805**, nhưng hiện đang chặn hoàn toàn khả năng tự lấy token/scheduler-link mới qua UI cho patient test. Đáng cân nhắc báo cáo như một defect riêng.

## Feature Location

- Status: Blocked
- Route context đã xác nhận: `Comms Hub > Campaign Manager > "Simple EMIS Booking - Same Day GP" (Quick Send) > Campaign Outbox`, patient Michael Ramella (NHS 70986) — đúng patient/campaign trong ảnh đính kèm ticket
- Route app patient-facing đã xác nhận sống: `https://dev.blinxscheduler-np.com/feature-branch/pac2-1805-booking-state/` (không token → "Link Error")
- Còn thiếu: token/scheduler-link thật để vào flow booking — nút `Resend` (cách duy nhất quan sát được để lấy token mới) lỗi kỹ thuật HTTP 400
- Budget: 12/12 views; ~14/15 phút (đã hết)

## Valid Artifacts

- `requirements.md` (sha256 `794602d8...`, input_revision 1)
- `feature-location.md` (sha256 `bac6003d...`, input_revision 1)

## Stale Artifacts

- Không có

## Next Action

`LOCATE` vẫn `Blocked` (budget đã hết, `Resend` xác nhận lỗi ổn định 3/3 lần) — cần một trong các việc sau trước khi tiếp tục:
1. Cung cấp trực tiếp một scheduler link (token) còn hiệu lực đã có sẵn (từ email/SMS thật của số test, hoặc lưu từ trước); hoặc
2. Báo lỗi `Resend` (HTTP 400, tái lập 3/3) như một defect riêng của Comms Hub (ngoài phạm vi PAC2-1805) trước; hoặc
3. Cho phép `TEST_DESIGN` chạy ở mức `Preliminary` (route context đã Confirmed một phần, nhưng chưa có token thật) — automation sẽ bị chặn cho tới khi có route đầy đủ.

## Checkpoint History

- DISCOVER → completed (2026-09-16)
- INGEST → completed (2026-09-16)
- ANALYZE → completed_with_warnings (2026-09-16)
- LOCATE → blocked (2026-09-16)

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
