# Workflow & Checkpoints

## Phases

```
DISCOVER → INGEST → ANALYZE → EXPLORE → TEST_DESIGN 
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
6. Tiếp tục từ phase đầu tiên chưa hoàn thành

## Idempotency Rules

- Không cấp ID mới cho knowledge tương đương
- Không nhân đôi source/question
- Không reset execution history
- Không ghi đè Tester notes
- Không mark completed trước khi ghi artifact thành công
