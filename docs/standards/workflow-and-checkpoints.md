# Workflow & Checkpoints

## Phases

```
DISCOVER → INGEST → ANALYZE → LOCATE → EXPLORE → TEST_DESIGN
  → AUTOMATION_REVIEW → AUTOMATE → EXECUTE → REPORT → COMPLETE
```

## Phase Status

- `pending`: chưa bắt đầu
- `in_progress`: đang thực hiện
- `completed`: hoàn thành
- `blocked`: thiếu input/approval/authentication
- `stale`: dependency thay đổi, cần review
- `skipped`: không áp dụng trong scope này
- `failed`: lỗi kỹ thuật

## Skill Outcome

- `completed`: phase hoàn thành
- `completed_with_warnings`: hoàn thành nhưng có cảnh báo
- `blocked`: cần input bên ngoài
- `failed`: lỗi kỹ thuật
- `inconclusive`: chạy được nhưng chưa kết luận đúng/sai
- `no_change`: không có thay đổi cần thiết

## Resume Algorithm

1. Đọc `manifest.yaml` và `status.md`
2. Tính checksum hiện tại của source files
3. So sánh với `input_snapshot.revision`
4. Nếu khác → tăng revision, đánh dấu dependency stale
5. Nếu giống và phase `completed` → skip
6. Existing v1 manifest thiếu `LOCATE` được reconcile trong bộ nhớ: `pending` nếu chưa tới `EXPLORE`, hoặc `skipped/no_change` kèm legacy warning nếu workflow đã đi qua vị trí đó; checkpoint history giữ nguyên
7. Với `LOCATE`, validate checksum, đọc budget/candidate/rejected path và không lặp rejected path khi dependency không đổi
8. Tiếp tục từ phase đầu tiên chưa hoàn thành

`LOCATE` bắt buộc mặc định. Chỉ skip case không phụ thuộc UI và phải ghi lý do cụ thể.

## Idempotency Rules

- Không cấp ID mới cho knowledge tương đương
- Không nhân đôi source/question
- Không reset execution history
- Không ghi đè Tester notes
- Không mark completed trước khi ghi artifact thành công
