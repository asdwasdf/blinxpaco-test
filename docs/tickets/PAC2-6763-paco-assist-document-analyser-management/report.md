# QA Report: PAC2-6763

**Input Revision:** 1
**Environment:** `https://pac2-6763-send-key.dev.blinxpaco-np.com`
**Role:** `Super Admin GB`
**Run/Scope:** Document upload location/exploration; tester-requested closure
**Generated:** 2026-09-28
**Overall:** Not Run

## Scope and Limitations

Đã xác minh read-only hai entry:

- Patient `Profile` → `Documents` → `Upload`.
- `/paco/inbox` → `Upload a document` → dialog `Upload document to inbox`.

Đã quan sát `Document Inbox` board/list, search, counters và visible lifecycle states. Workflow không hoàn tất một upload có kiểm chứng: file chooser của browser automation bị mở lặp và tab sau đó được đóng. Tester cho biết đã test xong nhưng không cung cấp actual result, filename, timestamp, evidence hoặc cleanup status; do đó không thể suy diễn `Pass`/`Fail`.

## Product Result

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| PAC2-6763-TC-001 | Not Run | REQ-PAC2-6763-017; tester-confirmed upload scope, ticket revision 1 context | Không có durable execution evidence | Không có confirmed mutation; cleanup not applicable/unknown |

Không có product `Fail` hoặc defect được xác lập.

## Automation Verification

- Không tạo standalone spec: automation chỉ bắt buộc sau verified manual `Pass`/`Fail`; case hiện là `Not Run`.
- Không chạy Playwright CLI.
- Browser file-chooser issue là execution/tooling limitation, không phải bằng chứng product defect.

## Defects

Không tạo defect.

## Blockers and Open Questions

- Actual tester result (`Pass`/`Fail`) chưa được cung cấp.
- Exact accepted extensions, maximum size, immediate success indicator và analysis SLA chưa được xác nhận.
- Safe cleanup/delete control chưa được xác minh.
- Patient `Documents` upload và inbox `Upload & analyse` là hai entry khác nhau; expected lifecycle không được gộp.

## Video Coverage

Không có video source.

## Mutation Ledger and Durable Evidence

- Workflow không xác nhận upload thành công hoặc record mới.
- Không có confirmed mutation identifier hoặc known leftover.
- Không có durable execution evidence để promote.
- Read-only observations được ghi trong `feature-location.md` và `exploration.md`; patient identifiers đã redact khỏi artifacts.

## Automation Decision

Không automate trong lần đóng này vì thiếu verified manual product result. Nếu mở lại ticket, chạy `PAC2-6763-TC-001` trước; manual `Pass`/`Fail` sẽ kích hoạt standalone spec và CLI verification.

## Regression Recommendations

Khi retest:

1. Dùng unique safe synthetic PDF.
2. Xác minh pre-upload search không có filename.
3. Submit qua `/paco/inbox` → `Upload a document` → `Upload & analyse`.
4. Ghi immediate UI result và bounded lifecycle state.
5. Cleanup chỉ khi có clearly scoped safe action; nếu không, ghi leftover đã redact.

## Product Knowledge Proposals

Không promote semantic product knowledge. Giữ route `/paco/inbox` và dialog labels dưới classification `Observed` tại feature artifacts của ticket.

## Sensitive Data Review

Redacted. Không lưu patient/NHS identifier, credential, token, cookie, header hoặc auth state.

## Tester notes

[Protected area]
