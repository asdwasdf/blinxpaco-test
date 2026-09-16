# Exploration: PAC2-6540

**Input Revision:** 1
**Environment:** dev
**Role:** `Super Admin GB`
**Observed:** 2026-09-15T15:17:53Z
**Status:** Inconclusive

## Scope

Quan sát read-only `Campaign Outbox` trên site `General Practice (Blinx Demo Site) (YGMQJ)` để tìm campaign `PCN Spring COVID Invites - 2026 Reminders (email)` và xem existing detail. Tester xác nhận quyền xem patient/message data trong run này.

## Observations

### OBS-PAC2-6540-001

**Classification:** Observed
**Location/URL:** `/commshub/campaign-outbox`
**Action:** Mở `Campaign Outbox` bằng read-only action từ `Campaign Manager`.
**Observed Behavior:** Page hiển thị nhóm `Campaigns`, `Campaign Types`, prompt `Select a Campaign to view communication`, site context `General Practice (Blinx Demo Site) (YGMQJ)` và default date range `17/08/2026 - 15/09/2026`.
**Requirement Links:** REQ-PAC2-6540-002, REQ-PAC2-6540-003, REQ-PAC2-6540-005
**Evidence:** `test-results/PAC2-6540/locate/20260915T151000Z/PAC2-6540-LOCATE-campaign-outbox-20260915T151000Z.png` — local raw evidence
**Sensitive Data Review:** Local only; không chia sẻ trước review/redact.

### OBS-PAC2-6540-002

**Classification:** Observed
**Location/URL:** `/commshub/campaign-outbox`
**Action:** Nhập exact ticket campaign term vào read-only filter `Search campaigns...`.
**Observed Behavior:** Không tìm thấy match cho `PCN Spring COVID Invites - 2026 Reminders` trong default date range và site hiện tại. Một campaign không liên quan vẫn xuất hiện trong page text, nên chưa đủ basis kết luận campaign ticket tồn tại tại context này.
**Requirement Links:** REQ-PAC2-6540-002, REQ-PAC2-6540-003, REQ-PAC2-6540-005
**Evidence:** Browser observation tại 2026-09-15; không lưu screenshot vì page có thể chứa campaign metadata nhạy cảm.
**Sensitive Data Review:** Không ghi tên campaign không liên quan vào artifact.

### OBS-PAC2-6540-003

**Classification:** Observed
**Location/URL:** `/commshub/campaign-outbox`
**Action:** Chọn read-only date preset `All Time`, rồi search exact và các alias `PCN Spring COVID`, `2026 Reminders`, `Spring COVID`, `COVID Invites`.
**Observed Behavior:** Date range đổi thành `01/01/1970 - 15/09/2026`; 4,385 campaign entries được load. Không có exact campaign ticket. Chỉ có một partial COVID-related match không đủ basis để chọn.
**Requirement Links:** REQ-PAC2-6540-002, REQ-PAC2-6540-003, REQ-PAC2-6540-005
**Evidence:** Browser observation; không lưu campaign list vì chứa metadata ngoài scope.
**Sensitive Data Review:** Không ghi campaign metadata ngoài partial non-identifying summary.

### OBS-PAC2-6540-004

**Classification:** Observed
**Location/URL:** `/commshub/campaign-outbox`
**Action:** Mở visible organisation selector và đọc options, không chọn organisation.
**Observed Behavior:** Selector chỉ cung cấp `General Practice (Blinx Demo Site) (YGMQJ)`, `Redmoor Liverpool (Non-OBE) (M85065)`, `3ST (M85055)` và `PC24 Urgent Care (Y05825)`. Không có Myrtle Practice. Một campaign có chữ `Myrtle` xuất hiện trong Blinx Demo Site list nhưng không khớp campaign ticket.
**Requirement Links:** REQ-PAC2-6540-002, REQ-PAC2-6540-003, REQ-PAC2-6540-005
**Evidence:** Browser observation tại 2026-09-15; không lưu screenshot do campaign metadata ngoài scope.
**Sensitive Data Review:** Organisation labels và aggregate counts only; không ghi patient/message data.

## Mismatches and Possible Defects

- Không kết luận defect. Ticket nêu ví dụ từ Myrtle Practice, nhưng session hiện tại ở `General Practice (Blinx Demo Site) (YGMQJ)`.
- Default date range chỉ bao phủ `17/08/2026 - 15/09/2026`, trong khi campaign ticket có thể nằm ngoài range này.

## Actions Not Taken

- Không chọn campaign không khớp ticket.
- Không đổi site/organisation vì chưa có tester-provided target context và action có thể thay session context.
- Không đổi date range vì chưa xác định range chứa campaign và date-picker behavior chưa được phân loại chắc chắn.
- Không dùng `Create Campaign`, không create/update/delete/submit/send/upload/import/download/export.

## Suggested Coverage

- Xác minh site/practice chứa campaign ticket; ticket example chỉ rõ Myrtle Practice.
- Cung cấp date range hoặc campaign run date phù hợp.
- Sau khi target context được xác nhận, filter exact campaign name, mở existing campaign detail read-only và quan sát `Not Sent - Patient Deleted or Inactive` count/status.
- Đối chiếu observation với REQ-PAC2-6540-002, REQ-PAC2-6540-003 và REQ-PAC2-6540-005; không dùng observation làm expected result thay ticket.

## Blockers and Open Questions

- `All Time` đã loại trừ date range là nguyên nhân không thấy campaign trong site hiện tại.
- Myrtle Practice không có trong organisation selector của role/session này.
- Exact campaign không tồn tại trong 4,385 entries của `Blinx Demo Site`; không chọn partial match vì không đủ provenance.
- Cần entitlement/context có Myrtle Practice hoặc trusted mapping từ Myrtle sang một option hiện có. Không tự đổi sang organisation khác khi exact campaign chưa được xác minh từ list hiện tại.
- Trusted-source search trong `ticket/**`, `docs/product/**` và ticket artifacts không tìm thấy ODS code hoặc mapping Myrtle Practice sang `YGMQJ`, `M85065`, `M85055` hay `Y05825`; các occurrence ngoài PAC2-6540 chỉ mô tả quyền multi-org của ticket khác, không phải mapping Myrtle.

## Tester notes

[Protected area]
