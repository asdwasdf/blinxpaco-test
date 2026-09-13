# Manual Browser Login Guide

Playwright mở browser; tester tự nhập credential trong trang đăng nhập. Credential không đi qua prompt, skill, environment variable, docs hoặc test code.

## Tạo local state

1. Cài Google Chrome trên máy rồi chạy headed browser; không cần tải Playwright Chromium:

```bash
npm run auth:login
```

2. Script mở `https://blinx.dev.blinxpaco-np.com/paco/login`; trong browser, tự nhập credentials và hoàn thành SSO/MFA.
3. Chờ redirect tới `/paco/dashboard`. Script giữ Chrome profile test và browser đang đăng nhập mở để Playwright kết nối qua CDP local tại `127.0.0.1`.
4. Giữ browser mở; chạy Playwright trong PowerShell khác. Tự đóng browser sau khi test xong.
5. Script dừng với `Blocked` nếu dashboard chưa tải trong 5 phút.
6. Chỉ tạo role-specific profile khi role thật đã được xác định.

## Security

- `playwright/.auth/` Git ignored và local-only; Chrome profile test nằm tại `playwright/.auth/chrome-profile/`.
- CDP chỉ bind `127.0.0.1`; không dùng profile Chrome cá nhân.
- Không đọc nội dung profile/state vào prompt.
- Không copy state, token, cookie hoặc header vào report/evidence/defect.
- Không commit hoặc chia sẻ state file.

## Expiration

Nếu browser login không chạy, fixture trả `Blocked: Login browser not running.`. Redirect về login trả `Blocked: Authentication expired`; đây không phải product failure. Chạy lại quy trình thủ công trên.

## Read-only smoke

Liệt kê test mà không mở Paco:

```bash
rtk npx playwright test --list
```

Chỉ chạy smoke sau authorization riêng. Test dashboard không click mutation control, fill, submit, upload, import hoặc probe private API.
