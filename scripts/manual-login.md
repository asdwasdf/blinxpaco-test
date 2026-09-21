# Manual Browser Login Guide

Claude Playwright plugin mở và điều khiển browser tab; tester tự nhập credential trong trang đăng nhập. Credential không đi qua prompt, skill, environment variable, docs hoặc test code.

## Đăng nhập trong plugin browser

1. Dùng Claude Playwright plugin mở tab hiện tại tới `https://blinx.dev.blinxpaco-np.com/paco/login`.
2. Tester tự nhập credentials và hoàn thành SSO/MFA trong tab đó.
3. Chờ redirect tới `/paco/dashboard` hoặc một trang Paco đã authenticated, rồi báo cho skill tiếp tục.
4. Skill kiểm tra URL và UI landmark của trang authenticated trước khi resume checkpoint.
5. Giữ tab plugin mở trong suốt lần explore. Role switch vẫn do tester thực hiện thủ công và dùng checkpoint riêng.

## Security

- Không nhập credentials vào prompt, skill, environment variable, docs hoặc test code.
- Skill không đọc, copy, persist hoặc report cookie, token, header hay browser auth state.
- Không lưu auth state từ plugin browser vào `playwright/.auth/`.
- Không chụp hoặc đưa credential/SSO form vào evidence.
- Không dùng profile Chrome cá nhân ngoài tab do Claude Playwright plugin quản lý.

## Expiration

Nếu plugin browser chưa có tab authenticated hoặc redirect về `/paco/login`, trả `Blocked: Authentication expired`; đây không phải product failure. Điều hướng tab hiện tại tới trang login, để tester đăng nhập thủ công, rồi verify lại trước khi tiếp tục.

## Read-only smoke

Sau khi auth hợp lệ, chỉ điều hướng, xem, search, filter, sort và paginate trong scope đã duyệt. Không click mutation control, fill business form, submit, upload, import, download hoặc probe private API nếu chưa có approval riêng.
