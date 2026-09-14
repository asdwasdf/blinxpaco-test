# Exploration: PAC2-7201

**Input Revision:** 1
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Role:** `nhat.pham@tda.company`; Home Organisation `General Practice (Blinx Demo Site) (YGMQJ)`; quyền xem thêm `Redmoor Liverpool (Non-OBE) (M85065)`; không có quyền `Macclesfield PCN`
**Observed:** 2026-09-14
**Status:** Complete (trong phạm vi quyền tài khoản hiện có); Inconclusive cho phần liên quan trực tiếp Macclesfield PCN

## Scope

`Comms Hub` > `Campaign Manager` tại `Blinx Demo Site` và `Redmoor Liverpool`. Bao gồm: đọc danh sách/cột chi tiết campaign (read-only), và — theo yêu cầu tường minh của tester kèm mutation approval — tạo 1 campaign test (`PAC2-7201-TEST-BDS-to-Redmoor`), share sang Redmoor Liverpool, và edit lại campaign đó để kiểm tra REQ-003/REQ-004.

## Observations

### OBS-PAC2-7201-001

**Classification:** Observed
**Location/URL:** `.../commshub/commshub/campaign-manager/create` (bước Review > tab `Quick Send/PI Sharing`)
**Action:** Đọc block giải thích "Organisation Sharing" hiển thị ngay trong UI tạo campaign
**Observed Behavior:** Nguyên văn: "Sharing to another Organisation will also share included assets such as Templates and Health Forms. Organisations that this Campaign is shared with will be able to view it and its assets but will **NOT** be able to edit." → Đây là tuyên bố thiết kế chính thức của sản phẩm: org được share vào chỉ có `view`, không `edit`; ngụ ý creator org vẫn giữ `edit`.
**Requirement Links:** REQ-PAC2-7201-001, REQ-PAC2-7201-003
**Evidence:** Screenshot phiên làm việc (chưa curate vào `evidence/`)
**Sensitive Data Review:** None

### OBS-PAC2-7201-002

**Classification:** Observed
**Location/URL:** `Campaign Manager` tại `Redmoor Liverpool`, filter search "Created at Redmoor"
**Action:** Đọc bảng, cột `Created By Organisation`/`Shared To Orgs`/`Created By`/`Created Date`, mở 1 campaign bằng icon `View`
**Observed Behavior:** 2 campaign `Created at Redmoor, Share to PCN Blinx Demo Site (1)` — `Created By Organisation` = **Redmoor Liverpool** (chính là org đang xem, tức creator), `Created By` = Beth Green, `Created Date` = **14/09/2026 14:09 và 14:12 (cùng ngày hôm nay)**. Dù đang xem từ chính creator org, hành động chỉ có `Performance` + `View` — **không có `Edit`/`Delete`**. Dialog view mở được nhưng nút `Save` disabled.
**Bổ sung [2026-09-14, Slack screenshot do tester cung cấp]:** Cùng ngày, trong Slack lúc 21:07–21:14, Beth Green trao đổi với Fiona Nguyen để làm rõ "test criteria", và nội dung bà gửi (giả thuyết bug + 3 bước "You will want to...") khớp y nguyên `ticket.md:20-26`. Nhiều khả năng 2 campaign này chính là kết quả Beth Green tự tay thực hiện theo đúng bước bà đề xuất, trên `dev`, để minh hoạ cho Fiona Nguyen — chưa xác nhận 100% (Inferred, cần hỏi trực tiếp Beth Green nếu cần chắc chắn).
**Requirement Links:** REQ-PAC2-7201-001, REQ-PAC2-7201-003
**Evidence:** Screenshot phiên làm việc (chưa curate)
**Sensitive Data Review:** None (không có dữ liệu bệnh nhân, chỉ tên nhân sự nội bộ)

### OBS-PAC2-7201-003

**Classification:** Observed
**Location/URL:** `Campaign Manager` tại `Redmoor Liverpool`, cùng danh sách "Shared Campaigns (7)"
**Action:** Đọc bảng, so sánh với campaign đối chứng "This is created to share across orgs- Campaign Regression..."
**Observed Behavior:** Campaign đối chứng — `Created By Organisation` = **General Practice (Blinx Demo Site)**, `Shared To Orgs` = **Redmoor Liverpool**, `Created By` = Santhosh Nithya Ragavan, `Created Date` = 24/02/2025 (~1.5 năm trước). Xem từ Redmoor (org được share vào, KHÔNG phải creator) nhưng có đầy đủ `Edit` + `Delete`.
**Requirement Links:** REQ-PAC2-7201-001, REQ-PAC2-7201-003
**Evidence:** Screenshot phiên làm việc (chưa curate)
**Sensitive Data Review:** None

### OBS-PAC2-7201-004 (self-created, kiểm soát đầy đủ)

**Classification:** Observed
**Location/URL:** `Campaign Manager`, tạo tại Blinx Demo Site qua `Create Campaign` wizard (Quick Send), share sang Redmoor Liverpool
**Action:** Tạo campaign `PAC2-7201-TEST-BDS-to-Redmoor` (mutation, có approval), share sang Redmoor Liverpool, sau đó edit tên thành `PAC2-7201-TEST-BDS-to-Redmoor-edited` (mutation, có approval) và Save — thành công ("The campaign has been updated successfully"). Sau đó chuyển `Viewing data for` sang Redmoor Liverpool và kiểm tra lại (read-only).
**Observed Behavior:**
- Từ **Blinx Demo Site (creator)**: `Edit` + `Delete` đầy đủ, edit lưu thành công, campaign vẫn còn trong `Shared Campaigns` sau edit.
- Từ **Redmoor Liverpool (org được share vào, KHÔNG phải creator)**: cũng có đầy đủ `Edit` + `Delete` — **trái với tuyên bố thiết kế ở OBS-001** ("will NOT be able to edit").
- `Create Campaign` luôn tạo dưới home organisation cố định của account đăng nhập (dialog xác nhận "Your current Organisation is General Practice (Blinx Demo Site)"), bất kể `Viewing data for` đang chọn org nào.
**Requirement Links:** REQ-PAC2-7201-003, REQ-PAC2-7201-004
**Evidence:** Screenshot phiên làm việc; campaign còn tồn tại trên hệ thống dev, chưa cleanup hoàn toàn (xem Blockers)
**Sensitive Data Review:** None

## Mismatches and Possible Defects

**Pattern nhất quán qua 3 nguồn độc lập (Beth Green hôm nay, Santhosh ~1.5 năm trước, và test tự tạo hôm nay):**

- Campaign **tạo bởi Blinx Demo Site, share sang Redmoor** → editable từ **cả hai phía** (đúng cho creator, nhưng **sai** cho org được share — vi phạm chính tuyên bố thiết kế của sản phẩm ở OBS-001). Xác nhận độc lập 2 lần (Santhosh 2025 + tự tạo 2026).
- Campaign **tạo bởi Redmoor, share sang org khác** → **không editable ngay cả từ Redmoor (creator của chính nó)** — khớp trực tiếp với mô tả bug trong ticket ("campaigns do not show up in the home organisation... and thereby cannot be managed"). Xác nhận qua 2 campaign của Beth Green, tạo cùng ngày hôm nay.

**Suy luận [Inferred from: OBS-002/003/004, cần xác nhận]:** hành vi cấp quyền `edit` cho shared campaign có vẻ gắn với **hướng cụ thể liên quan tới org Redmoor Liverpool** (và có thể tương tự với Macclesfield PCN, do ticket mô tả cùng triệu chứng "không quản lý được từ home organisation") chứ không phải một swap logic đơn giản giữa creator/shared-to. Chưa xác định được nguyên nhân kỹ thuật chính xác (không có quyền xem log/DB); đây là quan sát hành vi UI, không phải root cause.

**Không kết luận `Fail` chính thức** vì REQ-PAC2-7201-001 (claim gốc: `Adult Blood Test` thiếu tại Macclesfield PCN) chưa thể verify trực tiếp do thiếu quyền truy cập org đó trong môi trường dev hiện tại — xem Blockers.

**Cảnh báo môi trường [bổ sung 2026-09-14 từ Slack screenshot do tester cung cấp]:** Beth Green (tác giả "Testing Details" của ticket, xác nhận qua Slack) xác nhận tường minh trong Slack rằng video evidence gốc của ticket (Broken Cross, status `Failed`) là quan sát trên **production**, không phải `dev`. Toàn bộ OBS-002/003/004 ở trên đều thực hiện trên **dev**. Vì vậy pattern quan sát được (dù nhất quán qua 3 nguồn) chỉ nên coi là **loại suy có cơ sở (Inferred)** cho hành vi trên production/Macclesfield PCN, không phải xác nhận trực tiếp — do khác biệt cả về **môi trường** (dev vs production) lẫn **tổ chức** (Redmoor Liverpool vs Macclesfield PCN).

## Actions Not Taken

- Không tạo campaign tại Redmoor Liverpool (không có quyền — `Create Campaign` chỉ tạo được dưới home org cố định của account)
- Không thử `Send`/`Activate`/gửi thực tế tới bệnh nhân
- Không xoá (`Delete`) bất kỳ campaign nào (kể cả campaign test tự tạo)
- Không đăng nhập bằng tài khoản khác (Beth Green, Santhosh) để loại trừ khả năng hành vi phụ thuộc user thay vì org

## Suggested Coverage

- Test case xác nhận trực tiếp: tài khoản có quyền Macclesfield PCN tạo/kiểm tra campaign `Adult Blood Test` (REQ-001)
- Test case xác nhận: tài khoản gốc của Redmoor Liverpool (không phải tài khoản đa-org như hiện tại) tự kiểm tra `edit` trên campaign do chính Redmoor tạo — loại trừ giả thuyết user-based
- Test case: share 1 campaign sang nhiều org cùng lúc, kiểm tra edit access ở từng org

## Blockers and Open Questions

- Blocker quyền: không có tài khoản truy cập `Macclesfield PCN` trên `dev` để verify trực tiếp REQ-001
- **Cleanup chưa hoàn tất:** campaign test `PAC2-7201-TEST-BDS-to-Redmoor-edited` (Quick Send, status `Available Quick Send`) còn tồn tại tại Blinx Demo Site, shared sang Redmoor Liverpool. Nút `Pause`/`Resend` trong dialog Campaign Details không phản hồi (có thể không áp dụng cho loại `Quick Send`). Không thực hiện `Delete` (destructive, chưa có approval riêng theo `data-safety.md`). Identifier còn lại: tên campaign `PAC2-7201-TEST-BDS-to-Redmoor-edited`, org `General Practice (Blinx Demo Site) (YGMQJ)`, shared to `Redmoor Liverpool (Non-OBE) (M85065)`.
- Open question: hành vi quan sát được là do org-level permission hay user-level (tài khoản `nhat.pham` hiện có quyền multi-org) — cần test với tài khoản single-org **trên cùng domain dev** (`nhs-comms-hub-dev.blinxhealthcare.com`) để loại trừ. Tính đến 2026-09-14, chưa có tài khoản single-org khả dụng cho việc này.
- Open question [2026-09-14]: video evidence gốc của ticket xác nhận là **production**, không phải dev (theo Beth Green qua Slack) — pattern quan sát được trên dev chỉ là loại suy, chưa verify trực tiếp trên production hoặc trên org Macclesfield PCN. Tester xác nhận việc xin quyền production/Macclesfield PCN hiện khó thực hiện.

## Tester notes

[Protected area]
