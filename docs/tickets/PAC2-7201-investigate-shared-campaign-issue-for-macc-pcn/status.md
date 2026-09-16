# Ticket Status: PAC2-7201

**Input Revision:** 1
**Current Phase:** AUTOMATE
**Last Completed Phase:** AUTOMATION_REVIEW
**Updated:** 2026-09-14

## Progress

| Phase | Status | Outcome | Updated |
|---|---|---|---|
| DISCOVER | completed | completed | 2026-09-14 |
| INGEST | completed | completed | 2026-09-14 |
| ANALYZE | completed | completed_with_warnings | 2026-09-14 |
| LOCATE | completed | completed_with_warnings | 2026-09-14 |
| EXPLORE | completed | completed_with_warnings | 2026-09-14 |
| TEST_DESIGN | completed | completed_with_warnings | 2026-09-14 |
| AUTOMATION_REVIEW | completed | completed | 2026-09-14 |
| AUTOMATE | pending | - | - |
| EXECUTE | pending | - | - |
| REPORT | pending | - | - |
| COMPLETE | pending | - | - |

## Completed Work

- DISCOVER: resolve ticket key PAC2-7201, validate source pattern va confinement.
- INGEST: hash ticket.md (sha256 90b38076..., revision=1).
- ANALYZE: paco-requirements tạo `requirements.md` với 4 atomic requirement (REQ-PAC2-7201-001..004), tất cả `Inferred` (ticket không có Acceptance Criteria), 3 ambiguity và 7 open question. Đã xem `image (1).png` làm evidence hỗ trợ; 2 file video (`BH-41375.mp4`, `Screen sharing...mp4`) chưa được phân tích.
- LOCATE: route `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager` do tester cung cấp trực tiếp, xác nhận ngay (3 views). Ghi vào `feature-location.md`.
- EXPLORE: quan sát bảng `Campaign Manager` tại Blinx Demo Site và Redmoor Liverpool; theo yêu cầu trực tiếp của tester (kèm mutation approval), tạo 1 campaign test, share sang Redmoor Liverpool, và edit — dùng để kiểm tra REQ-003/004. Phát hiện pattern edit-permission đảo ngược theo hướng liên quan Redmoor Liverpool, xác nhận qua 3 nguồn độc lập. Ghi vào `exploration.md`.
- TEST_DESIGN: paco-test-design tạo `test-cases.md` với 6 test case (PAC2-7201-TC-001..006), coverage map cho 4 requirement. TC-001/002/004 ở mức Explored (có evidence ad-hoc từ EXPLORE); TC-003/005/006 Preliminary/Blocked do thiếu tài khoản Redmoor creator và quyền Macclesfield PCN.
- AUTOMATION_REVIEW: xét 6 test case theo Automation Gate (4 criteria: location, role, expected-result basis, blockers). Kết quả: TC-001 ✅ PASS, TC-002 ✅ PASS, TC-003 ❌ BLOCKED (thiếu Redmoor creator), TC-004 ❌ NOT PASS (expected-result Inferred), TC-005/TC-006 ❌ BLOCKED (thiếu quyền Macclesfield PCN + disputed definition). TC-002 ưu tiên cao nhất — phản ánh trực tiếp bug REQ-003. Ghi vào `automation-review.md`.

## Warnings & Blockers

- Toàn bộ requirement ở mức `Inferred`, cần BA/PO xác nhận trước khi coi là Confirmed.
- Domain trong `image (1).png` (`nhs-comms-hub.blinxhealthcare.com`) khác domain `dev` mặc định (`blinx.dev.blinxpaco-np.com`) trong config, nhưng khớp domain thực tế dev đã dùng (`nhs-comms-hub-dev.blinxhealthcare.com`) — coi như đã làm rõ.
- Không có quyền truy cập org `Macclesfield PCN` (org gốc trong ticket) trên `dev` — REQ-001 (campaign `Adult Blood Test` thiếu) chưa verify trực tiếp được.
- **Cleanup chưa hoàn tất:** campaign test `PAC2-7201-TEST-BDS-to-Redmoor-edited` (Blinx Demo Site, shared to Redmoor Liverpool, status `Available Quick Send`) còn tồn tại trên dev — nút `Pause` không phản hồi qua UI, không thực hiện `Delete` (destructive, chưa có approval riêng).
- REQ-003, REQ-004 đã được test ad-hoc ngoài quy trình `TEST_DESIGN`/`AUTOMATE`/`EXECUTE` chính thức, theo yêu cầu trực tiếp của tester trong hội thoại — chưa có test case ID chính thức, chưa qua automation review.
- [2026-09-14] Video evidence gốc của ticket xác nhận là **production** (Beth Green qua Slack, screenshot do tester cung cấp) — kết quả EXPLORE trên dev chỉ là loại suy (Inferred), chưa verify trực tiếp trên production/Macclesfield PCN. Tester xác nhận quyền production hiện khó xin.
- [2026-09-14] Cần tài khoản single-org trên domain dev (`nhs-comms-hub-dev.blinxhealthcare.com`) để loại trừ khả năng hành vi quan sát được là do đặc thù tài khoản multi-org hiện tại, không phải do org — hiện chưa có tài khoản này.
- [2026-09-14] **Quyết định của tester:** coi 2 open question trên là bất khả thi trong phạm vi ticket này (không chặn workflow). Độ tin cậy thống nhất: pattern lỗi là có thật trên dev (~90%); là root cause trực tiếp của bug Macclesfield PCN trên production thì thấp hơn (~60-65%, do chưa verify trực tiếp môi trường/tổ chức gốc). `TEST_DESIGN`/`REPORT` phải ghi rõ mức độ tin cậy này, không khẳng định tuyệt đối.
- [2026-09-14] **Phát hiện mới (OBS-005):** tester login tài khoản thứ 2 qua `npm run auth:login` (vẫn multi-org: Blinx Demo Site + PC24 Urgent Care, không phải single-org) — tìm thấy campaign `BH-37920 Updated Version` ("macclesfield shared campaign - updated", Beth Green tạo 05/05/2026) xác nhận độc lập lần 3 cùng pattern lỗi, với cặp org hoàn toàn khác Redmoor. Tên campaign gợi ý liên hệ tới Jira BH-37920 — có thể là ticket liên quan/trùng lặp, cần tra cứu thêm nếu muốn xác nhận.
- **AUTOMATION_REVIEW new:** TC-004 không đủ điều kiện automate — expected-result basis chỉ là `Inferred` (từ ticket, không có AC chính thức). Không automate assertion dựa trên Inferred.
- **AUTOMATION_REVIEW new:** TC-006 bị chặn bởi disputed definition của trạng thái `Failed` (chưa BA/PO xác nhận). Không automate được cho đến khi có định nghĩa chính xác.
- **AUTOMATION_REVIEW new:** Campaign test `PAC2-7201-TEST-BDS-to-Redmoor-edited` từ EXPLORE có thể dùng lại cho TC-002 (giảm mutation) — cần kiểm tra tồn tại + trạng thái trước khi AUTOMATE.
- **[2026-09-14] BH-41375 Video Analysis (OBS-006):** Đã phân tích video BH-41375 từ production. Phát hiện quan trọng: **production hoàn toàn đúng hành vi** — Broken Cross Surgery (shared-to org) chỉ có View, không có Edit/Delete. Bug quyền Edit/Delete **chỉ xuất hiện trên dev**, không xuất hiện trên production. Điều này thay đổi đáng kể đánh giá bug: dev có regression, production có thể đã được fix. Evidence đã curate vào `evidence/bh-41375-video-analysis.md`. Exploration và requirements đã cập nhật.

## Feature Location

- Status: Confirmed
- Context/candidate: `Comms Hub` > `Campaign Manager`, `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager`
- Budget: 3/12 views; ~3/15 minutes

## Valid Artifacts

- `requirements.md` (sha256 48494b0a..., input_revision 1)
- `feature-location.md` (sha256 835df4dc..., input_revision 1)
- `exploration.md` (sha256 e4df80b0..., input_revision 1)
- `test-cases.md` (sha256 9e39e197..., input_revision 1)
- `automation-review.md` (sha256 d5732624..., input_revision 1) — mới

## Stale Artifacts

- Không có

## Next Action

AUTOMATE: chạy paco-playwright cho TC-001 và TC-002 (candidate automate từ AUTOMATION_REVIEW). Cần:
1. Mutation approval cho TC-001 (tạo campaign test mới)
2. Kiểm tra campaign test cũ (`PAC2-7201-TEST-BDS-to-Redmoor-edited`) — nếu còn và phù hợp, dùng lại cho TC-002
3. Nếu campaign cũ không dùng được, tạo mới cho cả 2 case

## Checkpoint History

- DISCOVER → completed (2026-09-14)
- INGEST → completed (2026-09-14)
- ANALYZE → completed_with_warnings (2026-09-14)
- LOCATE → completed_with_warnings (2026-09-14)
- EXPLORE → completed_with_warnings (2026-09-14)
- TEST_DESIGN → completed_with_warnings (2026-09-14)
- AUTOMATION_REVIEW → completed (2026-09-14)

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
