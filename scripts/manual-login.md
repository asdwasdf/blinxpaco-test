# Manual Browser Login Guide

Playwright mở browser; tester tự nhập credential trong trang đăng nhập. Credential không đi qua prompt, skill, environment variable, docs hoặc test code.

## Tạo local state

1. Cài Google Chrome trên máy rồi chạy headed browser; không cần tải Playwright Chromium:

```bash
npm run auth:login
```

2. Script mở `https://blinx.dev.blinxpaco-np.com/paco/login`; trong browser, tự nhập credentials và hoàn thành SSO/MFA.
3. Chờ redirect tới `/paco/dashboard`. Script tự lưu Storage State thành `playwright/.auth/user.json` rồi đóng browser.
4. Script dừng với `Blocked` nếu dashboard chưa tải trong 5 phút.
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
