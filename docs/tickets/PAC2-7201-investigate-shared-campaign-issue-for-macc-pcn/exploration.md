# Exploration: PAC2-7201

**Input Revision:** 1
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Role:** `blinx_johnny.bravo`; Home Organisation `General Practice (Blinx Demo Site) (YGMQJ)`; quyền xem thêm `Redmoor Liverpool (Non-OBE) (M85065)`; không có quyền `Macclesfield PCN`
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

### OBS-PAC2-7201-005 [bổ sung 2026-09-14, tài khoản khác]

**Classification:** Observed
**Location/URL:** `Campaign Manager`, `Viewing data for = PC24 Urgent Care (Y05825)` — tài khoản đăng nhập qua `npm run auth:login` (khác tài khoản dùng ở OBS-001..004; tài khoản này có home organisation = Blinx Demo Site, quyền xem thêm PC24 Urgent Care thay vì Redmoor Liverpool — vẫn multi-org, chưa phải single-org)
**Action:** Tìm kiếm `macclesfield` trong ô Search campaigns (read-only)
**Observed Behavior:** Tìm thấy đúng 1 kết quả: campaign **"BH-37920 Updated Version"**, description **"macclesfield shared campaign - updated"**. Chi tiết: `Created By Organisation` = **General Practice (Blinx Demo Site)**, `Shared To Orgs` = **PC24 Urgent Care**, `Created By` = **Beth Green**, `Created Date` = **05/05/2026 09:56** (hơn 4 tháng trước ticket này). Xem từ PC24 Urgent Care (org được share vào, KHÔNG phải creator) — campaign có đầy đủ icon `Performance` + ✏️ Edit + 🗑️ Delete.
**Requirement Links:** REQ-PAC2-7201-001, REQ-PAC2-7201-003
**Evidence:** Screenshot phiên làm việc qua Playwright/CDP (chưa curate vào `evidence/`)
**Sensitive Data Review:** None (không có dữ liệu bệnh nhân)

**Ý nghĩa:** Đây là nguồn độc lập **thứ 3** (sau Santhosh/2025 và self-test/2026 tại Redmoor) xác nhận cùng 1 pattern: org được share vào (không phải creator) lại có đầy đủ quyền Edit/Delete — với **một cặp tổ chức hoàn toàn khác** (Blinx Demo Site → PC24 Urgent Care, không liên quan Redmoor). Quan trọng hơn: tên campaign **"BH-37920"** trùng định dạng mã Jira với các tham chiếu khác đã thấy trong ticket (`BH-41375` video, tab `[BH-37378] MACC PC...` trong `image (1).png`), và mô tả **"macclesfield shared campaign"** — cùng tác giả **Beth Green** (người viết "Testing Details" của chính ticket PAC2-7201). Gợi ý mạnh rằng đây có thể là cùng một vấn đề Beth Green đã điều tra từ tháng 5/2026 (ticket BH-37920 khả năng liên quan/trùng lặp), không chỉ là hành vi tương tự ngẫu nhiên. Vẫn giữ mức **Inferred** cho việc "đây chính là cùng 1 bug" — chưa xác nhận trực tiếp quan hệ giữa BH-37920 và PAC2-7201.

## Mismatches and Possible Defects

**Pattern nhất quán qua 4 nguồn độc lập (Beth Green hôm nay tại Redmoor, Santhosh ~1.5 năm trước, test tự tạo hôm nay, và Beth Green tháng 5/2026 tại PC24 Urgent Care):**

- Campaign **tạo bởi Blinx Demo Site, share sang org khác** (Redmoor HOẶC PC24 Urgent Care) → editable từ **cả hai phía** (đúng cho creator, nhưng **sai** cho org được share — vi phạm chính tuyên bố thiết kế của sản phẩm ở OBS-001). Xác nhận độc lập 3 lần (Santhosh 2025 tại Redmoor, tự tạo 2026 tại Redmoor, Beth Green 05/2026 tại PC24 Urgent Care — OBS-005). Không phụ thuộc org cụ thể nào được share vào, mà có vẻ là hành vi hệ thống chung mỗi khi Blinx Demo Site share ra.
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
- Open question: hành vi quan sát được là do org-level permission hay user-level (tài khoản `blinx_johnny.bravo` hiện có quyền multi-org) — cần test với tài khoản single-org **trên cùng domain dev** (`nhs-comms-hub-dev.blinxhealthcare.com`) để loại trừ. Tính đến 2026-09-14, đã thử tài khoản thứ 2 (qua `npm run auth:login`) nhưng vẫn là multi-org (Blinx Demo Site + PC24 Urgent Care thay vì + Redmoor Liverpool) — chưa có tài khoản single-org thật sự.
- Open question mới [2026-09-14, OBS-005]: campaign `BH-37920 Updated Version` ("macclesfield shared campaign - updated", tạo bởi Beth Green 05/05/2026) có phải cùng ticket/điều tra với PAC2-7201 không? Nếu đúng, đây là bằng chứng rất mạnh cho thấy pattern lỗi đã tồn tại và được biết tới từ nhiều tháng trước — nên hỏi trực tiếp Beth Green hoặc tra Jira BH-37920 để xác nhận quan hệ.
- Open question [2026-09-14]: video evidence gốc của ticket xác nhận là **production**, không phải dev (theo Beth Green qua Slack) — pattern quan sát được trên dev chỉ là loại suy, chưa verify trực tiếp trên production hoặc trên org Macclesfield PCN. Tester xác nhận việc xin quyền production/Macclesfield PCN hiện khó thực hiện.

### OBS-PAC2-7201-006 [2026-09-14, video BH-41375 — PRODUCTION ground truth]

**Classification:** Observed
**Location/URL:** Video BH-41375 (file `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/BH-41375.mp4`)
**Environment:** Production — `nhs-comms-hub.blinxhealthcare.com` (xác nhận bởi Beth Green qua Slack)
**Role:** Victoria F / Alex Paul / Nicholas — staff của Macclesfield PCN và Broken Cross Surgery
**Action:** Đọc bảng `Campaign Manager` tại 2 góc nhìn: Macclesfield PCN (home org) và Broken Cross Surgery (site được share tới)
**Observed Behavior:**

**View 1 — Macclesfield PCN (Home Organisation):**
- `Viewing data for: Macclesfield PCN`, tab `Non-Shared Campaigns (7)` / `Shared Campaigns (0)`
- 7 campaign đều **Non-Shared**, do Macclesfield PCN tạo
- Icon: 👁️ View + ✏️ Edit + 🗑️ Delete đầy đủ
- **Hành vi đúng** — creator org có full quyền

**View 2 — Broken Cross Surgery (N81632) — Shared-to org:**
- `Viewing data for: Broken Cross Surgery`, tab `Shared Campaigns (4)`
- Tất cả campaign: `Created By Organisation = Macclesfield PCN`, `Shared To = Broken Cross Surgery`
- Icon: **CHỈ có 👁️ View — KHÔNG có ✏️ Edit và KHÔNG có 🗑️ Delete**
- **Hành vi đúng theo thiết kế** — shared-to org chỉ có quyền view, không edit

**Requirement Links:** REQ-PAC2-7201-003, REQ-PAC2-7201-001
**Evidence:** `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/BH-41375.mp4`; curated vào `evidence/bh-41375-video-analysis.md`
**Sensitive Data Review:** Tên nhân sự (Victoria F, Alex Paul, Nicholas) — thông tin nội bộ, cân nhắc redact nếu shared rộng. Không có dữ liệu bệnh nhân.

**Ý nghĩa — PHÁT HIỆN QUAN TRỌNG:**
Đây là **ground truth từ production** — hành vi hoàn toàn **đúng theo thiết kế**: shared-to org (Broken Cross) chỉ có View, không có Edit/Delete. Kết hợp với OBS-PAC2-7201-003/004/005 trên dev cho thấy:

| Environment | Shared-to org | Edit/Delete? | Status |
|---|---|---|---|
| Production (BH-41375) | Broken Cross | ❌ Không | ✅ Đúng |
| Dev (OBS-003/004/005) | Redmoor Liverpool / PC24 Urgent Care | ✅ Có | ❌ Bug |

→ **Dev có bug, production đúng** — đây là discrepancy lớn, thay đổi đáng kể đánh giá độ tin cậy của bug PAC2-7201.

---

## Updated Analysis [2026-09-14, sau khi xem BH-41375 video]

### Production vs Dev Discrepancy

**Trước khi xem video:** OBS-002/003/004/005 xác nhận bug trên dev → giả định bug cũng tồn tại trên production.

**Sau khi xem video (OBS-006):** Production hoàn toàn **đúng hành vi**. Bug chỉ xuất hiện trên **dev**.

**Giả thuyết khả dĩ:**
1. **Bug đã được fix trên production** — dev chưa sync code mới
2. **Môi trường deploy độc lập** — production và dev có version khác nhau
3. **Bug chỉ xảy ra với cặp org cụ thể** trên dev (Blinx Demo Site + Redmoor/PC24) nhưng không xảy ra với Macclesfield + Broken Cross trên production

**Độ tin cậy đã điều chỉnh:**
- Bug trên dev: **Confirmed** (4 nguồn độc lập, bao gồm test của user)
- Bug trên production (Macclesfield PCN): **Inferred** (chưa verify trực tiếp; video BH-41375 cho thấy production đúng behavior, không thấy bug)
- Root cause giống nhau: **Unconfirmed** — chưa có bằng chứng production cũng bị bug

### Split Conclusion

**Ticket PAC2-7201 có thể mô tả 2 vấn đề riêng biệt:**

| Issue | Evidence | Classification |
|---|---|---|
| Bug quyền Edit/Delete trên dev (Redmoor/PC24) | OBS-003/004/005/006 (dev) | **Confirmed** (dev only) |
| Campaign "Adult Blood Test" thiếu ở Macclesfield PCN | ticket.md, OBS-006 (video) | **Inferred** — video không thấy campaign đó; Shared Campaigns = 0 tại Macclesfield, nhưng có thể nằm ở trạng thái khác |
| Bug quyền Edit/Delete trên production (Macclesfield) | OBS-006 (video) | **Not Confirmed** — video cho thấy production đúng behavior |

**Khuyến nghị:**
- Báo cáo bug trên dev như **defect riêng** (REGRESSION trên môi trường dev)
- Ticket PAC2-7201 gốc (production/Macclesfield) vẫn cần verify trực tiếp — claim "campaign Adult Blood Test thiếu" chưa được xác nhận trong video (Macclesfield Shared = 0, nhưng đó có thể không phải campaign Adult Blood Test)

## Tester notes

[Protected area]
