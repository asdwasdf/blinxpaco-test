# Workflow & Checkpoints

## Phases

```text
DISCOVER → INGEST → ANALYZE → LOCATE → EXPLORE → TEST_DESIGN
  → MANUAL_EXECUTE → AUTOMATE → AUTOMATION_EXECUTE → REPORT → COMPLETE
```

## Phase responsibilities

- `MANUAL_EXECUTE`: Claude Playwright MCP chạy manual kỹ, ghi structured attempt/route/locator/evidence và product result.
- `AUTOMATE`: tạo standalone `.spec.ts` từ durable manual record; không MCP rediscovery.
- `AUTOMATION_EXECUTE`: chạy Playwright CLI ngay, ghi automation verification riêng product result.

## Phase Status

- `pending`: chưa bắt đầu
- `in_progress`: đang thực hiện
- `completed`: hoàn thành
- `blocked`: thiếu input/authentication/safe data
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

1. Đọc `manifest.yaml` và `status.md`.
2. Tính checksum source hiện tại và so sánh `input_snapshot.revision`.
3. Nếu khác, tăng revision và đánh dấu dependency/ba execution phase stale; không xóa history.
4. Reconcile artifact path/checksum và structured execution records.
5. Nếu schema v1, giữ checkpoint history; map workflow đã tới `AUTOMATION_REVIEW`/`AUTOMATE`/`EXECUTE`/`COMPLETE` về `MANUAL_EXECUTE` vì v1 không chứng minh đủ manual/CLI provenance. Không tự backfill ticket đã hoàn tất nếu ticket chưa resume.
6. Nếu phase `completed` và artifact/gate hợp lệ thì skip; tiếp tục phase đầu chưa hoàn thành.
7. Existing legacy manifest thiếu `LOCATE`: `pending` nếu chưa qua vị trí đó; `skipped/no_change` kèm warning nếu đã qua.
8. Với `LOCATE`, đọc budget/candidate/rejected path và không lặp rejected path khi dependency không đổi.

`LOCATE` bắt buộc mặc định. Chỉ skip case không phụ thuộc UI và phải ghi reason cụ thể.

## Execution gates

- Không vào `MANUAL_EXECUTE` với stale dependency.
- `TEST_DESIGN` persist stable case inventory vào `execution.case_ids`; không rời `MANUAL_EXECUTE` nếu inventory rỗng, thiếu manual result hoặc có result ngoài inventory.
- Manual `Fail` cần tối thiểu ba diagnostic attempts: cùng dữ liệu, dữ liệu sạch, fresh page/session; thêm control path và evidence từng attempt.
- Diagnostic attempts vừa `Fail` vừa `Pass` là `Inconclusive`; `control` success không làm product `Fail` thành mixed result.
- Không rời `AUTOMATE` nếu manual `Pass`/`Fail` thiếu current-revision spec. Spec phải ở `playwright/tests/tickets/`, có checksum artifact và filename map stable case ID.
- Intermittent `Inconclusive` cần diagnostic spec hoặc blocker cụ thể.
- `Blocked`/`Not Run` không cần spec nhưng phải có reason.
- Không vào `REPORT` nếu spec chưa có CLI result, trừ technical blocker được ghi rõ.
- CLI result không được sửa manual product result.
- `COMPLETE` không có nghĩa mọi case `Pass`; mọi case/artifact phải được xử lý hoặc có reason.

Không có timebox cứng để đổi correctness lấy tốc độ. Budget/ceiling chỉ chống runaway và tạo checkpoint. Khi thiếu role, test data, domain rule, expected result, auth, readable video hoặc baseline, dùng **Ask QA early**: blocker, observation, evidence/timestamp, decision, concrete choices và affected cases.

## Idempotency Rules

- Không cấp ID mới cho knowledge tương đương.
- Không nhân đôi source/question.
- Không reset manual/automation execution history.
- Không ghi đè `## Tester notes`.
- Không mark completed trước khi artifact và structured outcome được verify.
