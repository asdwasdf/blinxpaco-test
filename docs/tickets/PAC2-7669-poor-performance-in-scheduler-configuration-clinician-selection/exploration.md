# PAC2-7669 — Exploration

## Scope và provenance

- Environment: `dev`, `https://pac2-7669.dev.blinxpaco-np.com`.
- Role hiển thị: `Blinx Deployment`; tester xác nhận quyền tương đương admin.
- Observation date: 2026-10-01.
- Route: `/configuration/`.
- Mutation: `Temporary`; chỉ thay đổi clinician trong unsaved dialog draft.

## Observed

- Trang `Scheduler Configuration` hiển thị `Scheduler Config`, template search, slot list và mapping controls.
- Chọn existing template rồi bấm `Edit` mở dialog `Edit Connections` có `Select a clinician`.
- Existing mappings cho phép quan sát cả source `EMIS` và `PACO Connect` trong cùng authorized context; không cần đổi org.
- Clinician chip xuất hiện sau selection và có thể gỡ khỏi draft.
- Danh sách clinician có thể còn mở sau multi-select; `Escape` đóng list trước khi bấm `Cancel`.
- Không bấm `Save`. Mở lại mapping sau `Cancel` xác nhận persisted state không đổi.

## Performance observations

- `EMIS`: click-to-chip 117.6–149.1 ms qua các diagnostic attempts.
- `PACO Connect`: click-to-chip 113.3–143.7 ms qua các diagnostic attempts.
- Không quan sát delay 5–10 giây, popup `waiting for this page to respond`, freeze hoặc crash.
- Hai số 8.1 và 10.3 giây từ lượt đo ban đầu gồm MCP/tool-call latency, không phải product timing và bị loại. Timing dùng cho kết luận được đo trong cùng browser evaluation.

## Expected-result boundary

- Ticket yêu cầu loại bỏ hoặc giảm đáng kể baseline 5–10 giây.
- Không dùng SLA `< 1 giây` vì ticket không cung cấp benchmark đó.
- Dev fix comment là source claim; QA `Pass` đến từ manual execution trên branch.

## Cleanup

- `EMIS`: gỡ clinician tạm, đóng bằng `Cancel`, mở lại xác minh không có clinician tạm.
- `PACO Connect`: đóng bằng `Cancel`, mở lại xác minh baseline clinician không đổi.
- Không tạo/xóa mapping, gửi SMS hoặc tạo appointment; không có leftover.

## Tester notes

[Protected area]
