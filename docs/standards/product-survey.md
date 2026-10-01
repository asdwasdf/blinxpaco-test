# Product Survey Standards

## Scope

Survey toàn Paco trên dev, từng role đang đăng nhập. Đổi role thủ công rồi resume checkpoint riêng. Full-site survey chạy ngoài critical path của ticket.

## Traversal

- Dùng Claude Playwright plugin, breadth-first từ dashboard.
- Fingerprint: `role + normalized URL + page heading + dialog/tab state`.
- Lưu queue/checkpoint sau mỗi view.
- Mỗi transition thử một lần trên mỗi fingerprint trong một run.
- Không lặp mutation trên cùng record fingerprint.
- Ceiling view/action chỉ chống runaway; đạt ceiling thì checkpoint và resume, không kết luận coverage đủ.
- Dùng observable waits; không fixed sleep hoặc private API.

## Collection

Lưu normalized route, title/heading, accessible controls, stable selector clues, transitions, role, environment, provenance và mutation outcome. Gộp records cùng cấu trúc thành view template. Không dump raw DOM, network payload, credentials hoặc PII.

## Mutation

Mode `survey` được tự thực hiện mutation trong đúng run/action/test-data scope, không cần ticket/case hoặc approval từng action, khi environment `dev`, hostname allowlist và runtime guards qua `evaluateMutationGate()` với authorization `paco-explore-survey`. `PACO_ALLOW_MUTATION=true` bắt buộc; destructive cần thêm `PACO_ALLOW_DESTRUCTIVE=true`. Production và hostname ngoài allowlist luôn bị chặn. Dùng synthetic/owned data; `Send` cần test recipient đã xác minh. Ghi ledger đã redact và cleanup an toàn, báo leftovers nếu cleanup thất bại. Form thiếu domain rule/test data an toàn phải `Blocked` và Ask QA early, không đoán.

## Knowledge

Markdown trong `docs/product/survey/views/` là nguồn chuẩn. `graph.json` và `graph.mmd` được generate. `Observed` không tự thành `Confirmed`. Protected content conflict phải dừng.
