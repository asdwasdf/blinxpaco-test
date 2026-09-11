# Requirements: PAC2-5776

**Input Revision:** 1
**Generated:** 2026-09-10T19:55:13+07:00
**Status:** Active

## Source Summary

Ticket mô tả lỗi không ổn định trong Quicksend v2.0. Khi tải template có booking link hoặc health form rồi thêm health form hoặc booking link vào template hiện có, hệ thống có thể yêu cầu thêm scheduler link dù template đã có một scheduler link. Trong luồng dùng quicksend làm follow-up action tại HF inbox, popup có thể xuất hiện phía sau hộp quicksend, không thể tương tác và chặn việc gửi. Ticket chưa cung cấp `Ticket Outcome` hoặc `Acceptance Criteria` thực tế; cả hai đang là placeholder `Add text`.

## Atomic Requirements

### REQ-PAC2-5776-001

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Quicksend v2.0 — chỉnh sửa template có booking link hoặc health form
**Actor/Role:** Unknown
**Inference Basis:** Mô tả lỗi cho biết popup yêu cầu scheduler link xuất hiện dù một scheduler link đã có; hành vi mong muốn được suy ra là không yêu cầu link thừa. Ticket không có `Acceptance Criteria` xác nhận.
**Observation Context:** Không áp dụng; chưa quan sát trực tiếp Paco
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Một template hiện có chứa scheduler link.
- Người dùng tải booking link hoặc health form template.
- Người dùng thêm health form hoặc booking link vào template hiện có.

**Expected Behavior:**
Hệ thống không hiển thị yêu cầu thêm scheduler link khi template đã có scheduler link hợp lệ.

**Provenance:**
- **Source:** `ticket/PAC2-5776-intermittent-scheduler-link-needed-popup/ticket.md:9-15`
- **Input Revision:** 1
- **First Recorded:** 2026-09-10
- **Last Verified:** 2026-09-10

**Evidence:** Chưa có
**Related Tests:** Chưa thiết kế
**Notes:** Cần BA/PO xác nhận expected behavior và định nghĩa “scheduler link hợp lệ”.

---

### REQ-PAC2-5776-002

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** HF inbox — quicksend follow-up action
**Actor/Role:** Unknown
**Inference Basis:** Mô tả lỗi nói popup nằm phía sau hộp quicksend, không thể tương tác và chặn gửi; suy ra UI phải giữ luồng tương tác khả dụng. Ticket không có `Acceptance Criteria` xác nhận.
**Observation Context:** Không áp dụng; chưa quan sát trực tiếp Paco
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Người dùng ở HF inbox.
- Người dùng chọn quicksend làm follow-up action.
- Điều kiện gây popup scheduler link xảy ra.

**Expected Behavior:**
Nếu popup xuất hiện, popup phải có thể tương tác và không bị hộp quicksend che hoặc chặn, để người dùng có thể tiếp tục hoặc hủy luồng gửi một cách rõ ràng.

**Provenance:**
- **Source:** `ticket/PAC2-5776-intermittent-scheduler-link-needed-popup/ticket.md:17-17`
- **Input Revision:** 1
- **First Recorded:** 2026-09-10
- **Last Verified:** 2026-09-10

**Evidence:** Chưa có
**Related Tests:** Chưa thiết kế
**Notes:** Đây là expected behavior suy luận; ticket chưa xác nhận popup phải biến mất hay chỉ cần hiển thị đúng lớp.

---

## Ambiguities and Conflicts

- `Ticket Outcome` tại `ticket.md:19-21` là placeholder `Add text`; outcome mong muốn chưa được xác nhận.
- `Acceptance Criteria` tại `ticket.md:23-25` là placeholder `Add text`; không có tiêu chí `Pass`/`Fail` được xác nhận.
- “Appears to happen” tại `ticket.md:9` cho thấy lỗi intermittent nhưng không cung cấp tần suất, dữ liệu hoặc chuỗi bước tái hiện đầy đủ.
- Ví dụ “add health form to blood test booking link” tại `ticket.md:13` chưa nêu tên template, loại scheduler link hoặc dữ liệu test cụ thể.
- Ticket không nêu `role`, browser, environment, trạng thái record hoặc permission cần thiết.
- Chưa rõ popup scheduler link là popup sai hoàn toàn hay popup hợp lệ nhưng sai z-index/layer trong HF inbox.

## Open Questions

1. Expected behavior chính xác khi template đã có scheduler link là gì: không hiện popup, tái sử dụng link hiện có, hay cho phép chọn/thay link?
2. Scheduler link nào được xem là hợp lệ: bất kỳ link hiện có hay phải cùng booking/health form context?
3. Các bước tái hiện đầy đủ, template và test data cụ thể là gì?
4. Lỗi áp dụng cho luồng chỉnh sửa template, HF inbox follow-up action, hay cả hai?
5. Với HF inbox, sửa mong muốn là loại bỏ popup hay đưa popup lên trước hộp quicksend?
6. `role`, environment và browser nào nằm trong scope xác nhận?
7. Điều kiện `Pass` cho lỗi intermittent là gì: số lần lặp hoặc khoảng thời gian quan sát bao nhiêu?

---

## Tester notes

[Protected area]
