# Manual Login Guide

Playwright dùng authentication state do tester tạo thủ công. Không nhập credential vào prompt, skill, docs hoặc test code.

## Tạo local state

1. Chạy headed browser:

```bash
rtk npx playwright codegen https://blinx.dev.blinxpaco-np.com/paco/dashboard
```

2. Tự nhập credentials và hoàn thành SSO/MFA.
3. Xác nhận dashboard tải xong.
4. Trong Playwright Inspector, lưu Storage State thành `playwright/.auth/user.json`.
5. Chỉ tạo role-specific state khi role thật đã được xác định.

## Security

- `playwright/.auth/` Git ignored và local-only.
- Không đọc nội dung state vào prompt.
- Không copy state, token, cookie hoặc header vào report/evidence/defect.
- Không commit hoặc chia sẻ state file.

## Expiration

Missing state trả `Blocked: Authentication state not found.`. Redirect về login trả `Blocked: Authentication expired`; đây không phải product failure. Tạo lại state bằng quy trình thủ công trên.

## Read-only smoke

Liệt kê test mà không mở Paco:

```bash
rtk npx playwright test --list
```

Chỉ chạy smoke sau authorization riêng. Test dashboard không click mutation control, fill, submit, upload, import hoặc probe private API.
