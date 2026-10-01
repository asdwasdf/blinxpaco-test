# Requirements: PAC2-6982

**Input Revision:** 1
**Generated:** 2026-10-01
**Status:** Active

## Source Summary

`Shared Campaign` gửi từ PCN organisation tới child practices có đính kèm `Health Form` do một child practice tạo. Practice tạo form chỉ có quan hệ `Created by`, không có `Shared To` cho chính practice đó. Ticket mô tả bệnh nhân thuộc practice này đăng nhập qua scheduler link bị lỗi và không truy cập được form. Yêu cầu: đăng nhập và truy cập form vẫn thành công trong cấu hình này.

Nguồn: `ticket/PAC2-6982-brownlow-pcn-shared-campaigns-not-allowing-access-to-health-form-from-child-org/ticket.md`, mục `Description` (dòng nội dung bắt đầu `User story`). SHA-256: `8cdad3f787c3dc5743c908bfb56d136ca976474fbb7b9df874c7603cc0b23db0`, revision 1. Comments chỉ yêu cầu liên kết/review PR; không xác nhận fix hoặc environment.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

Source không có video hoặc attachment.

## Atomic Requirements

### REQ-PAC2-6982-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Đăng nhập qua scheduler link của `Shared Campaign`.
**Search Terms/Aliases:** `Shared Campaign`, `Shared Campaigns`, `Campaign`, `Campaigns`, `scheduler link`, `Scheduler`, `Health Form`, `Health Forms`, PCN, child organisation, child practice.
**Known Location:** Unknown
**Actor/Role:** Bệnh nhân thuộc child practice; role cấu hình campaign chưa xác định.
**Inference Basis:** N/A
**Observation Context:** Chưa quan sát website.
**Acceptance Criteria Status:** Present trong `Description`; mục `Acceptance criteria` riêng ghi `Not provided`.

**Preconditions:**
- PCN organisation gửi `Shared Campaign` tới child practice.
- Campaign đính kèm `Health Form` do chính child practice này tạo.
- Form có quan hệ `Created by` với practice, không có `Shared To` cho chính practice đó.
- Bệnh nhân hợp lệ thuộc practice nhận scheduler link của campaign.

**Expected Behavior:** Bệnh nhân đăng nhập thành công qua scheduler link; việc practice tạo form không gây lỗi đăng nhập.

**Provenance:**
- **Source:** `ticket/PAC2-6982-brownlow-pcn-shared-campaigns-not-allowing-access-to-health-form-from-child-org/ticket.md`, `Description`: “The login does not fail when the form was created by the child practice.”
- **Input Revision:** 1
- **First Recorded:** 2026-10-01
- **Last Verified:** 2026-10-01 (đối chiếu source, chưa verify product)

**Evidence:** Ticket source ở trên.
**Related Tests:** Chưa thiết kế.
**Notes:** Ticket không nêu phương thức xác thực, thông báo lỗi hoặc test patient cụ thể.

### REQ-PAC2-6982-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Truy cập `Health Form` từ child organisation qua scheduler link của `Shared Campaign`.
**Search Terms/Aliases:** `Health Form`, `Health Forms`, `Shared To`, `Created by`, `Shared Campaign`, scheduler link.
**Known Location:** Unknown
**Actor/Role:** Bệnh nhân thuộc child practice tạo form; role cấu hình form chưa xác định.
**Inference Basis:** N/A
**Observation Context:** Chưa quan sát website.
**Acceptance Criteria Status:** Present trong `Description`; mục riêng ghi `Not provided`.

**Preconditions:** Như REQ-PAC2-6982-001; bệnh nhân đã đăng nhập qua scheduler link.

**Expected Behavior:** Bệnh nhân truy cập được form đính kèm dù form không được đánh dấu `Shared To` cho child practice tạo form. Campaign chia sẻ cho phép truy cập form từ child organisation này.

**Provenance:**
- **Source:** `ticket/PAC2-6982-brownlow-pcn-shared-campaigns-not-allowing-access-to-health-form-from-child-org/ticket.md`, `Description`: “The form is accessible even when it is not marked as \"Shared To\" for the child practice.” và “The shared campaign allows access to the health form from the child organisation.”
- **Input Revision:** 1
- **First Recorded:** 2026-10-01
- **Last Verified:** 2026-10-01 (đối chiếu source, chưa verify product)

**Evidence:** Ticket source ở trên.
**Related Tests:** Chưa thiết kế.
**Notes:** User story nêu mục đích hoàn thành form; không có tiêu chí chi tiết về `Submit`, lưu câu trả lời hoặc visibility cho practice không nhận campaign. Không tự suy ra các expected result đó.

## Ambiguities and Conflicts

- Acceptance criteria có trong `Description`, không có trong field riêng. Giữ nguồn rõ; không coi toàn bộ AC là thiếu.
- Lỗi trong description là reported behavior, không phải observation của run hiện tại.
- Chưa có PR, build, branch hoặc xác nhận fix trong source; không kết luận trạng thái fix.

## Open Questions

### OQ-PAC2-6982-001 — Environment và role

Configured default: `dev`, `https://blinx.dev.blinxpaco-np.com`. QA cần xác nhận dùng host này hay configured dev host khác, role thao tác PCN/child practice và manual auth đang dùng. Ảnh hưởng `LOCATE` và toàn bộ UI execution. Nguồn thiếu: ticket `Description`/`Fields`.

### OQ-PAC2-6982-002 — Safe test data và hierarchy

Cần PCN organisation, child practice tạo form, campaign/form tương ứng và bệnh nhân test hợp lệ thuộc child practice; xác minh quan hệ `Created by` có nhưng `Shared To` không có. Không đưa dữ liệu bệnh nhân thật, credentials hoặc scheduler token vào artifact. Ảnh hưởng cả hai requirements và setup/control path.

### OQ-PAC2-6982-003 — Patient authentication và recipient

Cần phương thức đăng nhập scheduler, cách lấy link an toàn và recipient test nếu cần `Send`. Người dùng đăng nhập thủ công; không yêu cầu credentials trong hội thoại. Chưa có dữ liệu đủ để thực hiện campaign hoặc patient flow.

### OQ-PAC2-6982-004 — Control path

Cần cấu hình control hợp lệ (ví dụ form có `Shared To` cho practice khác trong cùng shared campaign), cùng expected behavior được QA xác nhận trước khi dùng làm đối chứng. Ticket chưa xác lập rule cho organisation ngoài scope nhận campaign.

## Tester notes
