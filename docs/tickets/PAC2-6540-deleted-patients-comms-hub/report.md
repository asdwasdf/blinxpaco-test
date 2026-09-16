# QA Report: PAC2-6540

**Input Revision:** 1
**Environment:** dev
**Role:** `Super Admin GB`
**Run/Scope:** Manual post-fix verification evidence và supplemental read-only self-check
**Generated:** 2026-09-15
**Overall:** Pass

## Scope and Limitations

Tester xác nhận ảnh/video cung cấp là post-fix evidence và ticket comment ghi `Verify passed`. Evidence cho thấy flow `Patient Details` → `Advanced Search` với existing `Reference Report` hoàn tất và trả kết quả sau fix. Payload có count 709 và 1,078 là evidence trước fix, không phải expected count sau fix.

Count 68,034 trong video phụ thuộc dataset tại thời điểm quay, không phải expected value cố định. Supplemental self-check ngày 2026-09-15 chạy cùng UI flow trên dataset hiện tại và trả 0; kết quả này không chứng minh regression vì dataset/reference-report contents có thể thay đổi. Supplemental run không đối chiếu được Myrtle campaign hoặc patient set.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| PAC2-6540-TC-001 — Chạy existing `Reference Report` qua `Advanced Search` với `Deleted Patients Excluded` | Pass | REQ-PAC2-6540-004 — Confirmed từ ticket revision 1 | Tester-supplied post-fix screenshots/video; Jira comment `Verify passed` | Không mutation; không cần cleanup |
| PAC2-6540-TC-002 — Supplemental rerun cùng UI flow trên mutable Blinx Demo dataset | Inconclusive | REQ-PAC2-6540-004 — Confirmed từ ticket revision 1 | Manual observation 2026-09-15: `Duplicate Report Test1`, `Include`, `Deleted Patients Excluded`, result 0 | Chỉ thay draft search state theo scoped approval; không `Save Report`, `Import`, upload hoặc send; không có persisted leftover |
| PAC2-6540-TC-003 — Đối chiếu Myrtle campaign patient set và `Outbox` status | Not Run | REQ-PAC2-6540-001/002/003/005 — Confirmed từ ticket revision 1 | Myrtle Practice không có trong organisation selector của session | Không mutation; không cần cleanup |

## Defects

Không tạo defect mới. Chênh lệch 709 và 1,078 thuộc evidence lỗi trước fix; post-fix evidence đã được tester xác nhận `Pass`.

## Blockers and Open Questions

- Không có blocker ngăn đóng ticket theo post-fix evidence đã được tester xác nhận.
- Coverage bổ sung chưa xác minh Myrtle `Campaign Outbox`, count 379 hoặc patient-set reconciliation.
- Ticket source có mâu thuẫn lịch sử: 404 trừ 23 bằng 381, không phải 379; không dùng các count này làm expected cố định.
- Supplemental report hiện trả 0 do mutable data/reference state; cần seeded dataset nếu muốn regression test lặp lại độc lập.

## Regression Recommendations

- Dùng seeded reference report có deleted và non-deleted patients.
- So sánh patient set, không chỉ aggregate count, giữa saved-report path và direct `Advanced Search` path.
- Chạy lại cùng query nhiều lần và kiểm tra cả `Deleted Patients Included` lẫn `Deleted Patients Excluded`.
- Chỉ thêm `Campaign Outbox` reconciliation khi có campaign/report dùng cùng patient snapshot.

## Product Knowledge Proposals

Không promote thêm product knowledge. Route `Analytics & Reports` → `Patient Details` → `Advanced Search` chỉ được ghi nhận trong scope ticket này.

## Sensitive Data Review

Ảnh/video và payload nguồn có patient-identifying data. Không copy identifier, payload body hoặc ảnh chưa redact vào repository. Report chỉ giữ aggregate counts và UI state.

## Tester notes

[Protected area]
