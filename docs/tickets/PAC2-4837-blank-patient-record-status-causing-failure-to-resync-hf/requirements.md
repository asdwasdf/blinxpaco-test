# Requirements: PAC2-4837

**Input Revision:** 5c0d8311c10f94927b29426793ff7e66a6306b185cc9f705f0560d56ef18cc18
**Generated:** 2026-10-06
**Status:** Active

## Source Summary

Ticket mô tả: khi form HF lưu lần đầu vào patient record thất bại (ví dụ EMIS mất kết nối), form bị stuck với blank Patient Record Status → hệ thống nhầm là "already submitted" → staff không thể gửi lại. Fix: forms stuck với blank status giờ có thể resync từ Health Form Inbox. Đã test end-to-end trên dev. Bulk tool đã sẵn sàng (chạy sau release).

## Video Coverage

**N/A** — Không có video input.

## Atomic Requirements

### REQ-4837-001

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Health Forms / Health Form Inbox / Patient Record Status sync
**Search Terms/Aliases:** health form inbox, HF inbox, patient record status, resync, resynchronise, stuck form, blank status, already submitted, EMIS sync
**Known Location:** Health Form Inbox (`/health-forms/responses/`), bulk resync tool
**Actor/Role:** Unknown — HF staff/practice staff
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing (ticket không có AC chi tiết)

**Preconditions:**
- Một Health Form đã được fill và submit thất bại ở lần lưu đầu tiên vào patient record (do EMIS connection issue hoặc tương tự)
- Patient Record Status của form đó bị để trống (blank)
- System đã từng treat blank status = "already submitted"

**Expected Behavior:**
- Forms stuck với blank Patient Record Status có thể được resync từ Health Form Inbox mà không bị báo lỗi "already been submitted"
- Sau resync, form có Patient Record Status hợp lệ và có thể được xử lý tiếp bình thường

**Provenance:**
- **Source:** `ticket/PAC2-4837-blank-patient-record-status-causing-failure-to-resync-hf/ticket.md:39` (Ammar.hashad comment)
- **Input Revision:** 5c0d8311c10f94927b29426793ff7e66a6306b185cc9f705f0560d56ef18cc18
- **First Recorded:** 2026-10-06

**Evidence:** Comment: "forms stuck like this can now be resynced from the Health Form Inbox as normal"
**Related Tests:** TC-001, TC-002 (planned)

**Notes:** QA cần verify behavior trên UI — blank status display, resync action, post-resync status.

---

### REQ-4837-002

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Health Forms / Bulk stuck-form clearing
**Search Terms/Aliases:** bulk clear, bulk tool, stuck forms, clear stuck, batch resync
**Known Location:** Unknown — tool có thể là script hoặc admin feature
**Actor/Role:** Unknown — admin/practice manager
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Nhiều Health Forms stuck với blank Patient Record Status trong hệ thống (bulk scenario)

**Expected Behavior:**
- Bulk tool có thể clear tất cả stuck forms mà không cần resync từng cái một
- Sau khi chạy tool, các forms không còn bị stuck với blank status

**Provenance:**
- **Source:** `ticket/PAC2-4837-blank-patient-record-status-causing-failure-to-resync-hf/ticket.md:45` (Ammar.hashad comment)
- **Input Revision:** 5c0d8311c10f94927b29426793ff7e66a6306b185cc9f705f0560d56ef18cc18
- **First Recorded:** 2026-10-06

**Evidence:** Comment: "A tool is also ready to clear stuck forms in bulk, so practices won't have to resend them one by one." Beth comment: "tool is also ready to clear stuck forms in bulk... the final step listed can be initiated"
**Related Tests:** TC-003 (planned)

**Notes:** Tool là bước cuối sau release. QA cần xác định tool access point (admin UI? script?) trước khi design test.

---

### REQ-4837-003

**Classification:** Inferred
**Lifecycle:** Candidate
**Feature/Scope:** Health Forms / System treatment of blank patient record status
**Search Terms/Aliases:** blank status, patient record status, already submitted error
**Known Location:** Health Form Inbox response detail view
**Actor/Role:** System (automated behavior)
**Inference Basis:** Bug description: "system then wrongly treated it as 'already submitted'". Fix implies the condition (blank status) was being treated as submitted. QA should verify the condition is correctly identified and handled post-fix.
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- HF form có Patient Record Status blank (pre-fix data edge case)

**Expected Behavior:**
- Blank Patient Record Status KHÔNG được treat là "already submitted"
- Staff nhìn thấy form ở trạng thái cho phép resync, không phải error/blocked

**Provenance:**
- **Source:** `ticket/PAC2-4837-blank-patient-record-status-causing-failure-to-resync-hf/ticket.md:39`
- **Input Revision:** 5c0d8311c10f94927b29426793ff7e66a6306b185cc9f705f0560d56ef18cc18
- **First Recorded:** 2026-10-06

**Evidence:** Comment: "the form was left with a blank Patient Record Status — and the system then wrongly treated it as 'already submitted', so staff could never send it again"
**Related Tests:** TC-001, TC-002

**Notes:** Inferred từ bug description; cần verify chính xác behavior trên UI post-fix.

---

## Ambiguities and Conflicts

1. **Bulk tool access point** — Comment chỉ nói "tool is ready" nhưng không xác định là admin UI feature hay backend script. Cần explore để xác định cách trigger. → `Open Question`

2. **Patient Record Status field location** — Blank status hiển thị ở đâu trong HF Inbox? Cần locate trên UI. → `Open Question`

3. **Resync action trigger** — Action "resync" có phải là button trên form response detail không, hay là batch action trên Inbox list? → `Open Question`

4. **"Already been submitted" error display** — Exact error message/text cần thiết để verify fix. → `Open Question`

5. **Pre-existing stuck forms on dev** — Dev có sẵn data với blank Patient Record Status để test không, hay cần tạo synthetic data? → `Open Question`

## Open Questions

| # | Question | Impact | Priority |
|---|----------|--------|----------|
| OQ-001 | Bulk tool access point: admin UI hay script? URL/endpoint? | TC-003 design | High |
| OQ-002 | Patient Record Status field display location in HF Inbox? | TC-001/TC-002 locate | High |
| OQ-003 | Resync action: per-form button hay batch action? | TC-001/TC-002 design | High |
| OQ-004 | Exact error message "already been submitted"? | TC verification | Medium |
| OQ-005 | Dev environment có sẵn stuck form data không? | Test data setup | Medium |
| OQ-006 | Auth role nào có quyền resync? | TC actor setup | Medium |

---

## Tester notes

[Protected area]
