# Feature Location: PAC2-7201

**Input Revision:** 1
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com` (domain do tester cung cấp trực tiếp; khác `dashboardPath` mặc định trong `paco.config.yaml` nhưng cùng hậu tố `-dev` với domain production thấy trong `image (1).png` của ticket)
**Role:** `blinx_johnny.bravo`, manual auth có sẵn trong Chrome profile của tester. Home Organisation cố định: `General Practice (Blinx Demo Site) (YGMQJ)`. Quyền xem thêm (không phải creator): `Redmoor Liverpool (Non-OBE) (M85065)`. Không có quyền truy cập `Macclesfield PCN`.
**Observed:** 2026-09-14
**Status:** Confirmed
**Budget:** 3/12 views; ~3/15 minutes (route do tester cung cấp trực tiếp, xác nhận gần như ngay lập tức)

## Search clues

- Route do tester cung cấp trực tiếp: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager`
- Khớp với breadcrumb `Comms Hub` > `Campaign Manager` thấy trong `image (1).png` đính kèm ticket

## Confirmed entry path

1. Starting state: điều hướng trực tiếp tới URL trên (đã có session đăng nhập sẵn trong Chrome, không cần thao tác login)
   - Landmark/control: header `Communications Hub`, breadcrumb `Comms Hub` > `Campaign Manager`
   - Read-only action: chờ trang load (`Gathering data...`)
   - Resulting state: bảng `Campaign Manager` hiển thị nhóm `Non-Shared Campaigns` và `Shared Campaigns`, dropdown `Viewing data for` ở góc trên phải
   - Context dependency: `Viewing data for` mặc định = home organisation (`General Practice (Blinx Demo Site)`); có thể mở rộng chọn thêm org khác trong scope quyền của account (Redmoor Liverpool)

## Context requirements

- `Viewing data for` dropdown quyết định org context đang xem (không quyết định org tạo campaign mới — `Create Campaign` luôn dùng home organisation cố định của account, xác nhận qua dialog "Your current Organisation is General Practice (Blinx Demo Site)")
- Cần mở rộng tree trong dropdown (icon `>`) để thấy org con; UI dropdown khá nhạy, dễ đóng ngoài ý muốn khi click lệch tọa độ

## Candidate and rejected paths

- Không có candidate/rejected path khác — route do tester cung cấp trực tiếp và xác nhận đúng ngay lần đầu.

## Observed landmarks

- Breadcrumb text: `Comms Hub` › `Campaign Manager`
- Nút `Create Campaign`, `Campaign Outbox` (top right)
- Dropdown `Viewing data for:` (top right, kế `Your Home Organisation:`)
- Bảng campaign với cột `Shared Campaign?`, `Campaign`, `Status`, `Description`, `Campaign Type`, và (sau `Show All Columns`) `Created By Organisation`, `Shared To Orgs`, `Created By`, `Created Date`
- Icon hành động theo dòng: `Performance` luôn có; `View` (mắt) khi không có quyền edit; `Edit` (bút chì) + `Delete` (thùng rác) khi có quyền edit

## Evidence

- Screenshot toàn trang `Campaign Manager` tại Blinx Demo Site và Redmoor Liverpool (không lưu raw vào `docs/`, chỉ tham chiếu qua session browser; chưa curate vào `evidence/` do chưa redact)
- `ticket/.../image (1).png` (nguồn từ ticket, môi trường khác — dùng làm search clue, không dùng làm Observed evidence trực tiếp cho môi trường dev)

## Automation hints

- Ổn định: text breadcrumb `Campaign Manager`, label cột `Shared Campaign?`, `Created By Organisation`, `Shared To Orgs`; icon action phân biệt theo `title`/`aria-label` chưa xác minh (mới suy đoán từ hình ảnh, cần probe riêng nếu automate)
- Cảnh báo: dropdown `Viewing data for` có behavior đóng ngoài ý muốn khi click ngoài checkbox chính xác — cần locator ổn định hơn là tọa độ nếu automate

## Blockers and next action

- Blocker: Không có quyền truy cập org `Macclesfield PCN` (org gốc trong ticket) với account hiện tại — không thể LOCATE/verify trực tiếp claim "Adult Blood Test thiếu tại Macclesfield PCN" (REQ-001) trong môi trường này.
- Next action: Nếu cần verify REQ-001 trực tiếp, cần role/account có quyền `Macclesfield PCN` trên `dev`, hoặc xác nhận domain `nhs-comms-hub-dev` có đúng là môi trường tương ứng `dev` chính thức không.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
