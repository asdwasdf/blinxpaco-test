# Script dùng chung cho paco-explore

Mục tiêu: không viết lại cùng một thao tác ở mỗi run. Mọi file ở đây chạy bằng `browser_run_code` với `filename` (không dán code).

## Quy ước

- File là một hàm `async page => { ... }` trả JSON gọn (count, text, status), không trả DOM/HTML.
- Script cần tham số: dòng đầu tiên sau comment là `const P = { ... };` — agent chỉ `Edit` đúng dòng đó rồi chạy bằng `filename`. Không chứa credentials, PII hay id record thật; tên record chỉ dạng `QA-test-...`.
- Mọi script có guard host dev (danh sách như `paco.config.yaml`) và throw nếu sai context.
- Thao tác theo feature nằm ở `actions/<feature-slug>/<action>.js` (ví dụ `actions/health-forms/search-owned.js`).

## Khi nào thêm/promote

1. Trước khi viết script mới trong run, tra bảng dưới.
2. Script viết trong `test-results/product-explore/<run-id>/` chạy thành công và có khả năng dùng lại (mở feature, tìm record `QA-test`, readback sau reload, archive/cleanup) → promote vào `actions/`, tham số hóa bằng `const P`, thêm một dòng vào bảng.
3. Script chỉ dùng một lần (diagnostic) thì để lại trong thư mục run.

## Danh mục

| Script | Mục đích | Tham số `P` |
|---|---|---|
| `preflight.js` | Host allowlist, auth, đóng dialog `Set your status` (chọn `Admin`), role trên header, số dialog/tab | — |
