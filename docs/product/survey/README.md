# Paco Product Survey

Nguồn knowledge black-box có cấu trúc. Markdown trong `views/` là nguồn chuẩn; `graph.json` và `graph.mmd` được tạo bằng `npm run graph:generate`, không sửa tay.

## Flow

1. Đăng nhập thủ công bằng role cần survey.
2. Resume `survey-checkpoint.yaml` của role.
3. Dùng Claude Playwright plugin để duyệt breadth-first.
4. Ghi view đã redact bằng `docs/templates/survey-view.md`.
5. Ghi mutation bằng alias/hash vào ledger; không lưu PII.
6. Chạy `npm run graph:generate`.
7. Đổi role thủ công rồi tạo/resume checkpoint khác.

Crawler được phép mutation đầy đủ trên dev khi hostname guard pass. Production hoặc hostname ngoài allowlist luôn bị chặn. Thiếu domain rule, recipient hoặc expected result phải hỏi QA ngay.
