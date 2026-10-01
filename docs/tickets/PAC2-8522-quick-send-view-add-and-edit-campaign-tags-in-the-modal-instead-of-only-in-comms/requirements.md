# Requirements: PAC2-8522

**Input Revision:** 1
**Generated:** 2026-09-28T14:02:07Z
**Status:** Active

## Source Summary

Ticket yêu cầu đưa khả năng xem và chỉnh các `Campaign Tags` vào modal `Quick Send`. Campaign đã chọn phải hiển thị tag hiện có; người có quyền có thể tìm, thêm, bỏ tag hiện có rồi `Save`; người không có quyền chỉ xem. Ticket cũng mô tả `Save as new Campaign` là phần còn thiếu, vì vậy chưa xem là behavior đã hoàn tất. Jira không có trường Acceptance Criteria riêng; các câu `Given/When/Then` nằm trong `Description` được dùng làm nguồn xác nhận.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

Ticket không có video.

## Atomic Requirements

### REQ-PAC2-8522-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Hiển thị tag của campaign trong modal `Quick Send`
**Search Terms/Aliases:** `Quick Send`, `Campaign Tags`, campaign tag, tags, campaign detail, campaign modal
**Known Location:** Modal `Quick Send`; ordered route chưa xác minh
**Actor/Role:** Người dùng có thể mở campaign trong `Quick Send`; role cụ thể Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present trong `Description`; Jira AC field Missing

**Preconditions:**
- Một campaign được chọn trong modal `Quick Send`.

**Expected Behavior:**
Các tag hiện tại của campaign được hiển thị cạnh tên campaign. Campaign không có tag không render vùng tag khi editing tắt. Trên desktop/mobile, overflow được thu gọn thành `+N`, phần còn lại xuất hiện khi hover.

**Provenance:**
- **Source:** `ticket.md:13` — description và embedded acceptance criteria
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** `ticket.md:35`, attachment `attachments/128293-image-20260926-102919.png`
**Related Tests:** Chưa thiết kế
**Notes:** Các chi tiết chip/overflow đến từ narrative triển khai; cần quan sát UI để xác nhận behavior thực tế.

---

### REQ-PAC2-8522-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Tìm và chọn tag tổ chức đã tồn tại
**Search Terms/Aliases:** `Campaign Tags`, tag editor, tag search, `FilterListItem`, existing tag
**Known Location:** Dialog chỉnh tag từ campaign detail trong modal `Quick Send`; ordered route chưa xác minh
**Actor/Role:** Người dùng có quyền update campaign; permission được nêu là `qsNewCampaignCreator` nhưng cần xác nhận
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present trong `Description`; Jira AC field Missing

**Preconditions:**
- Campaign được mở trong `Quick Send`.
- Tổ chức có tag tồn tại.
- Người dùng có quyền chỉnh campaign.

**Expected Behavior:**
Khi nhập vài ký tự đầu, hệ thống đề xuất tag đã tồn tại của tổ chức. Chọn tag đó không tạo duplicate. Danh sách searchable hiển thị các tag đang gắn ở trạng thái ticked.

**Provenance:**
- **Source:** `ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** `ticket.md:35`, attachment `attachments/128293-image-20260926-102919.png`
**Related Tests:** Chưa thiết kế
**Notes:** Tạo tag mới ngoài scope vì backend route bị tắt.

---

### REQ-PAC2-8522-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Thêm/bỏ tag và lưu vào campaign hiện có
**Search Terms/Aliases:** `Campaign Tags`, add tag, remove tag, `Save`, campaign update, `Comms Hub`
**Known Location:** Dialog chỉnh tag trong modal `Quick Send`; ordered route chưa xác minh
**Actor/Role:** Người dùng có quyền update campaign; role cụ thể Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present trong `Description`; Jira AC field Missing

**Preconditions:**
- Campaign hiện có được mở trong `Quick Send`.
- Có tag tổ chức phù hợp.
- Người dùng có quyền chỉnh campaign.

**Expected Behavior:**
Người dùng có thể thêm hoặc bỏ tag trong một interaction và `Save`. Sau khi lưu, tag persist với campaign và hiển thị trong `Comms Hub` mà không cần refresh campaign library.

**Provenance:**
- **Source:** `ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** `ticket.md:42`, attachment `attachments/128292-image-20260926-103032.png`
**Related Tests:** Chưa thiết kế
**Notes:** Đây là mutation persistent trên shared org-level object; cần safe campaign/tag test data và ledger.

---

### REQ-PAC2-8522-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Giữ tag campaign không có trong danh sách tag hiện tại
**Search Terms/Aliases:** shared tag, removed tag, missing option, selected tag, campaign tag
**Known Location:** Dialog chỉnh tag trong modal `Quick Send`; ordered route chưa xác minh
**Actor/Role:** Người dùng có quyền update campaign; role cụ thể Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Campaign giữ một tag mà `getAllTags` không trả về.

**Expected Behavior:**
Tag đó vẫn visible và tickable trong editor, không bị silently removed ở lần save tiếp theo.

**Provenance:**
- **Source:** `ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Không có attachment riêng
**Related Tests:** Chưa thiết kế
**Notes:** Ticket nêu shared-from-other-org hoặc removed-from-list là ví dụ; test data phù hợp chưa được cung cấp.

---

### REQ-PAC2-8522-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Read-only tag visibility khi thiếu quyền update
**Search Terms/Aliases:** `Campaign Tags`, read-only, permission, `qsNewCampaignCreator`, `enableCampaignTagEditing`
**Known Location:** Campaign detail trong modal `Quick Send`; ordered route chưa xác minh
**Actor/Role:** Người dùng không có campaign update permission; role cụ thể Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Present trong `Description`; Jira AC field Missing

**Preconditions:**
- Người dùng không có campaign update permission.
- Campaign có ít nhất một tag.

**Expected Behavior:**
Tags visible nhưng không editable.

**Provenance:**
- **Source:** `ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Không có attachment riêng
**Related Tests:** Chưa thiết kế
**Notes:** Permission đúng cần được BA/PO xác nhận.

---

### REQ-PAC2-8522-006

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Tag trong flow `Save as new Campaign`
**Search Terms/Aliases:** `Save as new Campaign`, new campaign, campaign tags, `SaveCampaignModal`
**Known Location:** `Quick Send` save-new-campaign modal; ordered route chưa xác minh
**Actor/Role:** Người dùng được phép tạo campaign; role cụ thể Unknown
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Ambiguous

**Preconditions:**
- Người dùng đi qua flow `Save as new Campaign`.

**Expected Behavior:**
Ticket kỳ vọng flow tạo campaign mới hỗ trợ tags, nhưng đồng thời ghi rõ UI field vẫn `Still to do`; chưa thể dùng làm assertion pass cho delivery hiện tại nếu chưa xác nhận scope.

**Provenance:**
- **Source:** `ticket.md:13`
- **Input Revision:** 1
- **First Recorded:** 2026-09-28
- **Last Verified:** 2026-09-28

**Evidence:** Không có
**Related Tests:** Chưa thiết kế
**Notes:** Scope conflict cần QA/PO quyết định.

---

## Ambiguities and Conflicts

- Jira field `Acceptance criteria` ghi `Not provided`, nhưng `Description` chứa bốn câu `Given/When/Then`; các câu này được coi là acceptance criteria embedded.
- `Description` vừa nói backend hỗ trợ tags khi save new, vừa ghi UI `Save as new Campaign` `Still to do`. REQ-PAC2-8522-006 giữ `Candidate`, chưa assertion pass/fail.
- Ticket nói editing gated bởi `qsNewCampaignCreator`, đồng thời yêu cầu “user with permission to update a campaign”; chưa xác nhận hai khái niệm này tương đương.
- Narrative nói đã verified trên feature-branch deployment, nhưng configured default environment là dev chung; không tự coi là bằng chứng cho dev hiện tại.

## Open Questions

1. Role/account nào đại diện cho user có `qsNewCampaignCreator` và user không có quyền? Ảnh hưởng REQ-002, 003, 005.
2. Campaign test nào an toàn để update, và tag nào có thể add/remove rồi cleanup? Ảnh hưởng REQ-003.
3. Có test data cho tag shared/removed nhưng đang attached không? Nếu không, REQ-004 sẽ `Blocked` hoặc `Not Run`.
4. `Save as new Campaign` nằm trong scope test PAC2-8522 hay được chấp nhận là follow-up chưa làm? Ảnh hưởng REQ-006.
5. Cần test feature-branch host riêng hay dev default đã chứa change? Ticket không cung cấp URL deployment.

---

## Tester notes

