# Video review: PAC2-191

**Input Revision:** 1  
**Reviewed:** 2026-09-25  
**Scope:** 7 Jira attachment videos; contact sheets và timestamp timelines

## Review summary

| Video | Thời lượng | Review | Quan sát chính |
|---|---:|---|---|
| `75954` | 90.4s | Reviewed | OAuth bắt đầu từ browser incognito; test mailbox mở trong Outlook; không thấy kết quả SSO cuối cùng. |
| `76121` | 179.4s | Reviewed | SSO không hoàn tất; sau đó user được tạo thủ công trong `User Management`; account xuất hiện trong danh sách. |
| `76418` | 515.4s | Reviewed | SSO auth, `/no-organisation/`, auth loop và Cognito `redirect_mismatch`; trạng thái cuối không rõ. |
| `76419` | 200.9s | Reviewed | SSO user không có organisation thấy `No Organisation Found`; sau khi có org context, account xuất hiện trong `User Management`. |
| `87541` | 533.3s | Reviewed | Tạo SSO user, gán organisation, Microsoft authentication và nhiều lần thử; có mutation lịch sử. |
| `123651` | 193.3s | Reviewed | Feature environment gặp `redirect_mismatch`; standard login trả `Incorrect username or password`; không login thành công. |
| `123768` | 37.2s | Reviewed | Standard username/password login trên feature branch; kết quả không rõ, không thấy SSO/org-assignment assertion. |

## Timestamped anchors

- `75954` `00:00:05–00:00:07`: Microsoft OAuth authorization bắt đầu; không có observable outcome.
- `76121` `00:00:49`: application/network auth error; `02:43–02:59`: manual user creation success và account xuất hiện trong list.
- `76418` khoảng `00:03:15–00:06:39`: `No Organisation Found`, repeated auth và Cognito `redirect_mismatch`.
- `76419` khoảng `00:01:17–00:01:35`: `No Organisation Found`; `00:02:09–00:02:30`: filtered account visible trong `User Management`.
- `87541` `00:02:55–00:03:06`: `Add User`; `00:04:42–00:05:00`: organisation assignment; `00:05:56–00:06:00`: updated user list.
- `123651` `00:02:04`: Cognito `redirect_mismatch`; `00:02:25–00:03:11`: repeated standard-login failures.
- `123768` `00:00:14–00:00:21`: standard login request; video kết thúc ở login page.

## Knowledge classification

- `[Observed: historical dev recordings, roles mostly unknown, 2025–2026]` SSO/auth behavior và error states nêu trên.
- Các recording là historical evidence; không tự xác lập expected behavior hiện tại.
- Ticket thiếu `Description` và `Acceptance criteria`; comments và video có claim mâu thuẫn theo thời gian.
- Không suy luận account auto-created/manual-created nếu recording không hiển thị đầy đủ nguồn tạo.

## Safety and privacy

- Raw frames/contact sheets chứa email, username, user ID, personal names, organisation names/codes, browser saved-login entries, Cognito client ID và DevTools/network details.
- Raw video artifacts là local evidence; không promote hoặc chia sẻ khi chưa redact.
- Một số recording có historical mutations (`Add User`, organisation assignment). Review hiện tại không thực hiện mutation.

## Open questions

- Expected result hiện tại cho SSO account chưa tồn tại trong PACO là thông báo nào và redirect nào?
- Cách xác minh “không auto-create account” qua black-box UI hoặc backend evidence nào được phép?
- Safe SSO test account, organisation assignment state và cleanup procedure nào được dùng cho run hiện tại?
- Cognito `redirect_mismatch` trên feature environment là deployment/config defect hay ngoài scope ticket?

## Tester notes

[Protected area]
