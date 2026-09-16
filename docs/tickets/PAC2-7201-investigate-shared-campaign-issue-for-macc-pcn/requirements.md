# Requirements: PAC2-7201

**Input Revision:** 1
**Generated:** 2026-09-14
**Status:** Active

## Source Summary

Ticket mô tả bug về `shared` patient-initiated `campaign` trong tổ chức Macclesfield PCN (MACC PCN, viết tắt MPCN). Theo mô tả, mọi shared campaign của PCN được tạo và quản lý tại Macclesfield PCN (home organisation), nhưng campaign `Adult Blood Test` và nhiều campaign khác bị thiếu hoàn toàn khỏi Macclesfield PCN, với ước tính tối thiểu 3 campaign bị thiếu cho mỗi practice (đối với nhóm blood test: Adult, LD, Child). Video đính kèm (Jira BH-41375, file cục bộ `BH-41375.mp4`) cho thấy ví dụ tại site "Broken Cross" (DFD) — campaign patient-initiated vẫn truy cập được và có vẻ hoạt động đối với bệnh nhân. Tuy nhiên: (1) `status` của campaign tại Broken Cross và các site khác hiển thị `Failed`; (2) campaign không hiển thị tại home organisation Macclesfield PCN nên không thể quản lý. Reporter nêu giả thuyết cá nhân (chưa xác nhận) về lỗi liên quan tới đăng nhập Comms Hub từ tổ chức Blinx Demo Site. Testing Details đề xuất kịch bản kiểm tra hai chiều: tạo campaign tại Redmoor Liverpool và share sang Blinx Demo Site (và ngược lại), kiểm tra quyền `view`/`edit` từ creator organisation, và sau khi edit cả hai, kiểm tra campaign vẫn `view`/`edit` được và vẫn còn trong `Shared` dropdown của Comms Hub. Ticket không có section Acceptance Criteria chính thức.

Ảnh đính kèm `image (1).png` (không có timestamp/role tường minh trong ticket, chỉ suy ra từ UI) cho thấy trang `Comms Hub` > `Campaign Manager` tại domain `nhs-comms-hub.blinxhealthcare.com` (khác domain môi trường `dev` mặc định trong `paco.config.yaml`), `Viewing data for: Macclesfield PCN`, danh sách `Shared Campaigns (9)` gồm: `MPCN - FeNO Testing Appointment`, `MPCN - Spring 2026 Covid Vaccination (CN)`, `MPCN - Women's Health Hub - Mirena Coil Fitting`, 4 campaign `MPCN - PI MACS (...)`, không thấy campaign tên `Adult Blood Test`/`Blood Test` trong 9 dòng hiển thị (bảng có thể còn cột/dòng bị cắt do cuộn ngang). File video `BH-41375.mp4` và `Screen sharing - 2026-09-14 3_13_51 PM.mp4` là evidence hỗ trợ, chưa được xem/phân tích trong phase `ANALYZE`.

**Bổ sung từ Slack screenshot do tester cung cấp trực tiếp trong hội thoại (2026-09-14):** Trong kênh Slack, Beth Green (9:07 PM) xác nhận tường minh "the videos are from **production environment**" khi Fiona Nguyen hỏi làm rõ test criteria. Beth Green (9:14 PM) lặp lại nguyên văn giả thuyết cá nhân "I think there is a bug affecting comms hub sign in from Blinx Demo Site organisation..." kèm đoạn "You will want to..." — khớp y nguyên với section "Testing Details" của `ticket.md:20-26`. Vậy **Beth Green là tác giả của "Testing Details"**, và **video evidence gốc (Broken Cross, status Failed) được xác nhận rõ ràng là quan sát trên production, không phải dev** — đây là dữ liệu quan trọng vì mọi kiểm tra ở `EXPLORE`/`EXECUTE` của ticket này chỉ thực hiện được trên môi trường `dev`.

## Atomic Requirements

### REQ-PAC2-7201-001

**Classification:** Inferred
**Lifecycle:** Active
**Feature/Scope:** Hiển thị và quản lý `shared campaign` tại home organisation (`Comms Hub` > `Campaign Manager`)
**Search Terms/Aliases:** `Comms Hub`, `Campaign Manager`, `Shared Campaigns`, shared campaign, patient initiated campaign, `PI`, home organisation, `Viewing data for`
**Known Location:** Unknown (clue từ ticket: `Comms Hub` > `Campaign Manager`, `Shared Campaigns` tab; screenshot cho thấy path `/commshub/campaign-manager` trên domain `nhs-comms-hub.blinxhealthcare.com`, khác domain `dev` mặc định — cần `LOCATE` xác minh trên môi trường test thực tế)
**Actor/Role:** Unknown (practice/PCN-level user quản lý shared campaign tại home organisation; role cụ thể chưa nêu)
**Inference Basis:** Ticket không có Acceptance Criteria; suy luận ngược từ mô tả bug "campaigns do not show up in the home organisation of macclesfield PCN, and thereby cannot be managed" — ngụ ý hành vi đúng là campaign phải hiển thị và quản lý được tại home organisation nơi tạo/chia sẻ. Cần BA/PO xác nhận.
**Observation Context:** OBS-PAC2-7201-006: production (Macclesfield PCN) thấy Non-Shared campaigns (7), Shared Campaigns = 0. Dev (Blinx Demo Site): shared campaign hiển thị tốt trong Shared, nhưng shared-to org có Edit/Delete sai (bug).
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Một `patient initiated campaign` được tạo và share trong phạm vi Macclesfield PCN (hoặc PCN tương đương trong môi trường test).
- User có quyền xem `Campaign Manager` tại home organisation của PCN đó.

**Expected Behavior:**
Mọi `shared campaign` do PCN tạo/quản lý phải hiển thị trong danh sách `Shared Campaigns` tại `Campaign Manager` của home organisation, và phải mở/`view`/`edit` được từ đó.

**Provenance:**
- **Source:** `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/ticket.md:5,7,9,16`
- **Input Revision:** 1
- **First Recorded:** 2026-09-14
- **Last Verified:** 2026-09-14

**Evidence:** `evidence/bh-41375-video-analysis.md` (production video); `image (1).png` (ticket source)
**Related Tests:** PAC2-7201-TC-002
**Notes:** [Bổ sung 2026-09-14] Ticket claim cụ thể: campaign `Adult Blood Test` và "SEVERAL others" thiếu hoàn toàn khỏi Macclesfield PCN. Tuy nhiên trong video BH-41375, Macclesfield PCN thấy 7 Non-Shared campaigns, Shared Campaigns = 0. Campaign "Adult Blood Test" có thể nằm ở trạng thái/thư mục khác (ví dụ đã bị xóa hoặc nằm trong tab khác), không nhất thiết là bug hiển thị. Cần verify trực tiếp trên production để xác nhận.

---

### REQ-PAC2-7201-002

**Classification:** Inferred
**Lifecycle:** Active
**Feature/Scope:** `Campaign` `status` của shared campaign tại site nhận (creator hoặc shared-to site)
**Search Terms/Aliases:** campaign status, `Failed`, `Status` column, patient initiated campaign
**Known Location:** Unknown (clue: cột `Status` trong `Campaign Manager`, xem screenshot `image (1).png`)
**Actor/Role:** Unknown
**Inference Basis:** Suy luận từ mô tả "the campaign status is set to 'failed'" đặt cạnh claim campaign "still accessible... and appear to be working" — ngụ ý hành vi đúng là status phản ánh đúng trạng thái hoạt động thực tế của campaign, không hiển thị `Failed` khi campaign vẫn hoạt động cho bệnh nhân. Cần BA/PO xác nhận định nghĩa đúng của trạng thái `Failed` cho loại campaign patient-initiated dùng chung (shared).
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Một `shared patient initiated campaign` đang hoạt động, bệnh nhân truy cập được liên kết/booking của campaign.

**Expected Behavior:**
`Status` của shared campaign tại site (ví dụ Broken Cross) phải phản ánh đúng trạng thái hoạt động thực tế; không hiển thị `Failed` khi campaign vẫn accessible/hoạt động với bệnh nhân.

**Provenance:**
- **Source:** `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/ticket.md:11,15`
- **Input Revision:** 1
- **First Recorded:** 2026-09-14
- **Last Verified:** 2026-09-14

**Evidence:** Video `BH-41375.mp4` đã phân tích — xem `evidence/bh-41375-video-analysis.md` và OBS-PAC2-7201-006 trong `exploration.md`
**Related Tests:** PAC2-7201-TC-002
**Notes:** [Bổ sung 2026-09-14] Sau khi phân tích video BH-41375 (OBS-006): production hoàn toàn **đúng hành vi** — Broken Cross (shared-to org) chỉ có View, không có Edit/Delete. Bug chỉ xuất hiện trên **dev** (OBS-003/004/005). Điều này gợi ý bug có thể đã được fix trên production, hoặc dev chưa sync code mới.

---

### REQ-PAC2-7201-003

**Classification:** Inferred
**Lifecycle:** Active
**Feature/Scope:** `view`/`edit` shared campaign từ creator organisation sau khi share cross-organisation
**Search Terms/Aliases:** share campaign, shared to, creator organisation, view campaign, edit campaign, `Shared` dropdown
**Known Location:** Unknown
**Actor/Role:** Unknown (user tại creator organisation với quyền tạo/share campaign)
**Inference Basis:** Suy luận từ đề xuất test trong "Testing Details" (không phải AC chính thức) — reporter kỳ vọng creator organisation giữ quyền `view`/`edit` campaign đã share, ở cả hai chiều tổ chức. Cần BA/PO xác nhận đây là hành vi đúng bắt buộc.
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Một `campaign` được tạo mới tại một organisation (creator) và share sang một organisation khác.
- Áp dụng cho cả hai chiều tổ chức được ticket nêu: Redmoor Liverpool → Blinx Demo Site, và Blinx Demo Site → Redmoor Liverpool.

**Expected Behavior:**
Sau khi share, creator organisation vẫn `view` và `edit` được campaign đó.

**Provenance:**
- **Source:** `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/ticket.md:24-25`
- **Input Revision:** 1
- **First Recorded:** 2026-09-14
- **Last Verified:** 2026-09-14

**Evidence:** OBS-PAC2-7201-001 (design text), OBS-PAC2-7201-006 (production = đúng), OBS-PAC2-7201-003/004/005 (dev = sai)
**Related Tests:** PAC2-7201-TC-001, PAC2-7201-TC-002
**Notes:** [Bổ sung 2026-09-14] Production (BH-41375 video, OBS-006): ✅ creator org (Macclesfield) có đầy đủ View/Edit/Delete, shared-to org (Broken Cross) chỉ có View — **hành vi đúng**. Dev (OBS-003/004/005): ❌ shared-to org (Redmoor Liverpool, PC24 Urgent Care) **cũng có Edit/Delete** — **hành vi sai (bug)**. Bug chỉ xuất hiện trên dev, production đúng. Đây là mutation action (`Create`, `Share`); cần approval tường minh trước khi thực hiện ở `AUTOMATE`/`EXECUTE`.

---

### REQ-PAC2-7201-004

**Classification:** Inferred
**Lifecycle:** Active
**Feature/Scope:** Tính bền vững của shared campaign sau khi edit (giữ trong `Shared` dropdown, vẫn `view`/`edit` được)
**Search Terms/Aliases:** edit campaign, `Shared` dropdown, shared campaign list, view campaign, edit campaign
**Known Location:** Unknown
**Actor/Role:** Unknown
**Inference Basis:** Suy luận từ đề xuất test "Edit both and check can still view & edit, and that campaign stays in the Shared dropdown in Comms Hub" — ngụ ý hành vi đúng là edit không phá vỡ trạng thái shared hay quyền truy cập hai chiều.
**Observation Context:** Không áp dụng
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Cả hai campaign ở REQ-PAC2-7201-003 đã được tạo và share thành công.

**Expected Behavior:**
Sau khi `edit` một shared campaign (từ creator hoặc từ site nhận), campaign vẫn `view`/`edit` được từ cả hai phía và vẫn xuất hiện trong `Shared` dropdown của Comms Hub.

**Provenance:**
- **Source:** `ticket/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/ticket.md:26`
- **Input Revision:** 1
- **First Recorded:** 2026-09-14
- **Last Verified:** 2026-09-14

**Evidence:** Không có
**Related Tests:** Chưa thiết kế
**Notes:** Phụ thuộc REQ-PAC2-7201-003 (cần campaign đã tạo/share trước). Đây là mutation action (`Update`); cần approval tường minh.

---

## Ambiguities and Conflicts

- `ticket.md:11` và `ticket.md:15` mâu thuẫn nội tại: campaign được mô tả vừa "still accessible... and appear to be working" (qua video) vừa có `status` = `Failed`. Ticket không giải thích `Failed` là do lỗi hiển thị status, lỗi đồng bộ, hay lỗi thực sự về gửi/booking không liên quan đến khả năng patient truy cập link. Chưa chọn cách hiểu nào làm chuẩn.
- `ticket.md:20` là giả thuyết cá nhân của reporter (xác nhận danh tính: Beth Green, qua Slack screenshot do tester cung cấp 2026-09-14), chưa được kỹ thuật xác nhận; không dùng làm cơ sở expected behavior, chỉ ghi nhận như hướng điều tra khả dĩ.
- Evidence `image (1).png` chụp tại domain `nhs-comms-hub.blinxhealthcare.com`, không khớp domain `dev` mặc định (`blinx.dev.blinxpaco-np.com`) trong `paco.config.yaml`. Domain thực tế dùng được ở `dev` khi `LOCATE` là `nhs-comms-hub-dev.blinxhealthcare.com` (coi như tương ứng). Tuy nhiên Slack screenshot (2026-09-14) xác nhận **video evidence gốc của ticket là từ production**, không phải dev — nên mọi kết quả `EXPLORE`/`EXECUTE` trên `dev` chỉ có giá trị loại suy (Inferred), không thay thế được việc verify trực tiếp trên production hoặc trên đúng org Macclesfield PCN.

## Open Questions

1. Danh sách đầy đủ và chính xác các campaign bị thiếu tại Macclesfield PCN là gì (ngoài "Adult Blood Test")? Con số "at least 3 per practice" dựa trên phép đếm nào?
2. `Failed` status trong `ticket.md:15` có nghĩa chính xác là gì trong hệ thống (gửi thất bại, đồng bộ thất bại, hiển thị sai) và có phải nguyên nhân campaign không xuất hiện ở home organisation không, hay là hai vấn đề độc lập?
3. Domain `nhs-comms-hub.blinxhealthcare.com` trong `image (1).png` có tương ứng với môi trường `dev` cấu hình sẵn (`blinx.dev.blinxpaco-np.com`) không, hay là môi trường khác cần xác nhận trước khi test?
4. Role/permission cụ thể nào được dùng để quản lý shared campaign tại home organisation, và role nào dùng để tạo/share campaign tại Redmoor Liverpool / Blinx Demo Site trong môi trường test?
5. Có thể quan sát hiện tượng (campaign thiếu, status `Failed`) bằng read-only browsing trên dữ liệu có sẵn không, hay bắt buộc phải tạo mới campaign (mutation, cần approval) để tái hiện theo "Testing Details"?
6. Giả thuyết đăng nhập Comms Hub từ Blinx Demo Site (`ticket.md:20`) có liên quan/ảnh hưởng phạm vi test không, hay chỉ là ghi chú riêng của reporter gửi technical team?
7. Video `BH-41375.mp4` đã phân tích (OBS-PAC2-7201-006) — production cho thấy hành vi đúng, dev có bug. `Screen sharing - 2026-09-14 3_13_51 PM.mp4` chưa xem.

---

## Tester notes

[Protected area]
