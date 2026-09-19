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

Mutation đầy đủ được phép khi environment và hostname qua `evaluateMutationGate()`. Production và hostname ngoài allowlist luôn bị chặn. `Send` cần test recipient đã xác minh. Form thiếu domain rule phải `Blocked` và Ask QA early, không đoán.

## Knowledge

Markdown trong `docs/product/survey/views/` là nguồn chuẩn. `graph.json` và `graph.mmd` được generate. `Observed` không tự thành `Confirmed`. Protected content conflict phải dừng.
