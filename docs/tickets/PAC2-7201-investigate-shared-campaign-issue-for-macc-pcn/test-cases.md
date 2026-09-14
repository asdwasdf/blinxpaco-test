# Test Cases: PAC2-7201

**Input Revision:** 1
**Design Maturity:** Explored (đa số case dựa trên `exploration.md`; riêng TC-003, TC-005, TC-006 vẫn Preliminary do thiếu quyền/tài khoản)
**Generated:** 2026-09-14

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-7201-001 | PAC2-7201-TC-003, PAC2-7201-TC-005 | Mirror-org (Redmoor) + direct (Macclesfield PCN) | TC-005 `Blocked` — không có quyền Macclesfield PCN trên production/dev |
| REQ-PAC2-7201-002 | PAC2-7201-TC-006 | Direct | `Blocked` — cùng giới hạn quyền; định nghĩa `Failed` còn Disputed (xem `requirements.md` Ambiguities) |
| REQ-PAC2-7201-003 | PAC2-7201-TC-001, PAC2-7201-TC-002, PAC2-7201-TC-003 | Cả 2 chiều tổ chức (Blinx Demo Site↔Redmoor) | TC-003 `Preliminary` — cần tài khoản có quyền tạo tại Redmoor Liverpool |
| REQ-PAC2-7201-004 | PAC2-7201-TC-004 | Một chiều đã kiểm chứng ad-hoc (Blinx Demo Site là creator) | Chưa có case riêng cho chiều Redmoor là creator (phụ thuộc TC-003) |

## Cases

### PAC2-7201-TC-001 — Creator organisation (Blinx Demo Site) giữ quyền Edit/Delete sau khi tạo và share campaign

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-7201-003
**Expected-result basis:** Confirmed — text thiết kế trong sản phẩm (`Organisation Sharing` panel khi tạo campaign, xem OBS-PAC2-7201-001 trong `exploration.md`)
**UI-dependent:** Yes
**Feature Location:** Confirmed — `docs/tickets/PAC2-7201-investigate-shared-campaign-issue-for-macc-pcn/feature-location.md`
**Entry Path:** Dashboard → `Comms Hub` → `Campaign Manager` → `Create Campaign`
**Context:** Global (Campaign Manager), org context = Blinx Demo Site (home organisation của account)
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Role:** User có quyền tạo campaign tại `General Practice (Blinx Demo Site) (YGMQJ)`
**Preconditions:** Đã đăng nhập, có quyền tạo `Quick Send` campaign, có ít nhất 1 booking link khả dụng
**Test Data Category:** Campaign test data tự tạo, không chứa dữ liệu bệnh nhân thật
**Test Data:** Tên campaign dạng `<TICKET>-TC-001-<timestamp>`, loại `Quick Send`, template SMS có sẵn (ví dụ `(Mapped) Flu Vaccination Drive`)
**Mutation Class:** Persistent
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tại Blinx Demo Site, mở `Create Campaign`, điền Campaign Setup + SMS Content | Wizard cho phép tiến tới bước Review |
| 2 | Ở tab `Quick Send/PI Sharing`, chọn share campaign sang `Redmoor Liverpool` | Redmoor Liverpool được chọn trong danh sách share |
| 3 | Click `Create` | Dialog `Success` hiển thị, campaign xuất hiện trong `Shared Campaigns` |
| 4 | Tại `Campaign Manager`, `Viewing data for = Blinx Demo Site`, tìm campaign vừa tạo | Dòng campaign có đủ icon `Performance`, `Edit` (bút chì), `Delete` (thùng rác) |

**Postconditions:** Campaign tồn tại ở trạng thái `Available Quick Send`, shared sang Redmoor Liverpool
**Cleanup:** Set trạng thái Inactive/Paused nếu khả dụng qua UI; nếu không, ghi rõ identifier campaign còn lại trong report (không tự ý Delete nếu chưa có approval riêng cho destructive action)
**Automation:** Later — đủ điều kiện Automation Gate (location Confirmed, role/env/mutation/expected-result rõ) nhưng cần qua `AUTOMATION_REVIEW` trước
**Evidence:** OBS-PAC2-7201-004 (`exploration.md`) — đã thực hiện ad-hoc 2026-09-14, kết quả khớp Expected Result (Edit/Delete có đủ)
**Execution History:** Ad-hoc, chưa qua `EXECUTE` chính thức — xem `exploration.md`

---

### PAC2-7201-TC-002 — Shared-to organisation (Redmoor Liverpool) KHÔNG được có quyền Edit/Delete trên campaign được share vào

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-7201-003
**Expected-result basis:** Confirmed — cùng nguồn text thiết kế ở TC-001 ("...will be able to view it and its assets but will NOT be able to edit")
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Dashboard → `Comms Hub` → `Campaign Manager` → đổi `Viewing data for` sang `Redmoor Liverpool`
**Context:** Global (Campaign Manager), org context = Redmoor Liverpool (org được share vào, không phải creator)
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Role:** User có quyền xem dữ liệu Redmoor Liverpool (không cần quyền tạo)
**Preconditions:** Đã có campaign từ TC-001 (hoặc tương đương) share từ Blinx Demo Site sang Redmoor Liverpool
**Test Data Category:** Dùng lại campaign của TC-001
**Test Data:** Không cần thêm
**Mutation Class:** None
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Đổi `Viewing data for` sang `Redmoor Liverpool` | Danh sách campaign cập nhật theo org mới |
| 2 | Tìm campaign đã tạo ở TC-001 trong `Shared Campaigns` | Campaign xuất hiện (đúng, vì đã được share) |
| 3 | Quan sát icon hành động trên dòng campaign đó | Chỉ có `Performance` + `View` (mắt); **KHÔNG** có `Edit`/`Delete` |

**Postconditions:** Không có thay đổi dữ liệu
**Cleanup:** Không cần (read-only)
**Automation:** Later — đủ điều kiện Automation Gate, chờ `AUTOMATION_REVIEW`
**Evidence:** OBS-PAC2-7201-004 (`exploration.md`) — **kết quả ad-hoc thực tế TRÁI với Expected Result**: Redmoor Liverpool lại có đủ `Edit`+`Delete`, không đúng thiết kế. Đây là case dự kiến sẽ `Fail` khi chạy chính thức.
**Execution History:** Ad-hoc, chưa qua `EXECUTE` chính thức — xem `exploration.md` (OBS-003, OBS-004)

---

### PAC2-7201-TC-003 — Creator organisation (Redmoor Liverpool) giữ quyền Edit/Delete sau khi tạo và share campaign (chiều đối xứng với TC-001)

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-7201-001 (mirror-org), REQ-PAC2-7201-003
**Expected-result basis:** Confirmed — cùng nguồn text thiết kế ở TC-001
**UI-dependent:** Yes
**Feature Location:** Confirmed cho route `Campaign Manager`; **chưa Confirmed riêng cho hành động `Create Campaign` dưới home organisation = Redmoor Liverpool** (tài khoản hiện có không tạo được tại Redmoor — xem `feature-location.md` Blockers)
**Entry Path:** Dashboard → `Comms Hub` → `Campaign Manager` → `Create Campaign` (yêu cầu tài khoản có home organisation = Redmoor Liverpool)
**Context:** Global (Campaign Manager), org context = Redmoor Liverpool (creator)
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Role:** User có home organisation = `Redmoor Liverpool (Non-OBE) (M85065)` — **hiện chưa có tài khoản này**
**Preconditions:** Tài khoản test có quyền tạo campaign tại Redmoor Liverpool (chưa thoả)
**Test Data Category:** Campaign test data tự tạo
**Test Data:** Tên campaign dạng `<TICKET>-TC-003-<timestamp>`
**Mutation Class:** Persistent
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Đăng nhập tài khoản có home organisation = Redmoor Liverpool | `Create Campaign` tạo campaign dưới Redmoor Liverpool |
| 2 | Tạo campaign, share sang Blinx Demo Site (hoặc org khác) | Campaign xuất hiện trong `Shared Campaigns` tại Redmoor |
| 3 | Tại `Campaign Manager`, `Viewing data for = Redmoor Liverpool`, tìm campaign vừa tạo | Dòng campaign có đủ `Edit`/`Delete` |

**Postconditions:** Campaign tồn tại, shared từ Redmoor Liverpool
**Cleanup:** Tương tự TC-001
**Automation:** Blocked — thiếu tài khoản creator tại Redmoor Liverpool, không có locator/role xác nhận cho bước 1
**Evidence:** OBS-PAC2-7201-002 (`exploration.md`) — bằng chứng gián tiếp: 2 campaign do Beth Green tạo tại Redmoor hôm nay (14/09/2026) cho kết quả **TRÁI** Expected Result (không có Edit/Delete ngay cả từ Redmoor). Chưa phải kết quả từ case này chạy trực tiếp (khác test data, khác thời điểm quan sát).
**Execution History:** Chưa chạy chính thức — case này Preliminary, chờ tài khoản phù hợp

---

### PAC2-7201-TC-004 — Sau khi Edit, shared campaign vẫn giữ trong Shared dropdown và vẫn view/edit được từ creator

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-7201-004
**Expected-result basis:** Inferred — suy luận từ đề xuất test của reporter (`ticket.md:26`), chưa có AC chính thức
**UI-dependent:** Yes
**Feature Location:** Confirmed — `feature-location.md`
**Entry Path:** Dashboard → `Comms Hub` → `Campaign Manager` → mở campaign bằng icon `Edit`
**Context:** Global (Campaign Manager), org context = creator (ví dụ Blinx Demo Site)
**Environment:** dev — `https://nhs-comms-hub-dev.blinxhealthcare.com`
**Role:** User có quyền edit campaign tại org creator
**Preconditions:** Có campaign đã tạo + share (ví dụ từ TC-001)
**Test Data Category:** Dùng lại campaign của TC-001
**Test Data:** Đổi tên campaign thêm hậu tố `-edited`
**Mutation Class:** Persistent
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Mở campaign bằng icon `Edit` tại creator org | Dialog `Campaign Details` mở, field editable, nút `Save` active |
| 2 | Sửa `Campaign Name`, click `Save` | Dialog `Success` — "The campaign has been updated successfully" |
| 3 | Quay lại danh sách, tìm campaign đã sửa | Tên mới hiển thị đúng; campaign vẫn nằm trong nhóm `Shared Campaigns` |
| 4 | Vẫn ở creator org, kiểm tra icon hành động | Vẫn có đủ `Edit`/`Delete` (không bị mất quyền sau khi sửa) |

**Postconditions:** Campaign đã đổi tên, vẫn ở trạng thái shared
**Cleanup:** Như TC-001
**Automation:** Later — chờ `AUTOMATION_REVIEW`
**Evidence:** OBS-PAC2-7201-004 (`exploration.md`) — đã thực hiện ad-hoc 2026-09-14, kết quả khớp Expected Result cho chiều Blinx Demo Site là creator
**Execution History:** Ad-hoc, chưa qua `EXECUTE` chính thức. **Gap:** chưa kiểm chứng chiều Redmoor Liverpool là creator (phụ thuộc TC-003)

---

### PAC2-7201-TC-005 — Campaign patient-initiated (vd. `Adult Blood Test`) hiển thị và quản lý được tại home organisation Macclesfield PCN

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-PAC2-7201-001
**Expected-result basis:** Inferred — suy luận từ mô tả bug trong ticket, chưa có AC chính thức
**UI-dependent:** Yes
**Feature Location:** Blocked — chưa từng LOCATE trong org `Macclesfield PCN`; không có quyền truy cập với tài khoản/môi trường hiện có (xem `feature-location.md` Blockers, `exploration.md` Open Questions)
**Entry Path:** Not applicable (chưa xác nhận)
**Context:** Global (Campaign Manager), org context = Macclesfield PCN
**Environment:** Production (theo xác nhận của Beth Green qua Slack — video gốc của ticket quan sát trên production, không phải dev) — **chưa xác nhận có thể test trên dev tương đương hay không**
**Role:** User có quyền quản lý campaign tại Macclesfield PCN — **hiện không có**
**Preconditions:** Cần role/tài khoản Macclesfield PCN; cần xác nhận môi trường test được phép (production hay dev tương đương)
**Test Data Category:** Không áp dụng (chưa LOCATE)
**Test Data:** Không áp dụng
**Mutation Class:** None (chỉ cần xem)
**Approval Required:** No (khi có quyền, bước xem là read-only)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Đăng nhập tài khoản có quyền Macclesfield PCN | Vào được `Campaign Manager`, `Viewing data for = Macclesfield PCN` |
| 2 | Tìm campaign `Adult Blood Test` (hoặc tên tương đương nhóm blood test: Adult/LD/Child) trong `Shared Campaigns` | Campaign xuất hiện trong danh sách |
| 3 | Mở campaign, kiểm tra quyền quản lý | Có đủ `Edit`/`Delete` (Macclesfield PCN là creator) |

**Postconditions:** Không có thay đổi dữ liệu
**Cleanup:** Không cần
**Automation:** Blocked — thiếu location, role, môi trường xác nhận
**Evidence:** Không có (chưa observe trực tiếp); tham chiếu gián tiếp OBS-PAC2-7201-002 (pattern tương tự tại Redmoor Liverpool trên dev)
**Execution History:** Not Run

---

### PAC2-7201-TC-006 — Campaign `status` tại site chia sẻ không hiển thị `Failed` khi campaign vẫn hoạt động

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** REQ-PAC2-7201-002
**Expected-result basis:** Inferred — suy luận từ mô tả ticket, có mâu thuẫn nội tại chưa giải quyết (xem `requirements.md` Ambiguities — định nghĩa `Failed` chưa rõ)
**UI-dependent:** Yes
**Feature Location:** Blocked — cùng giới hạn quyền Macclesfield PCN/Broken Cross như TC-005; ngoài ra cần xác nhận cách quan sát "campaign vẫn accessible với bệnh nhân" (có thể cần vai trò patient-facing, ngoài phạm vi Comms Hub)
**Entry Path:** Not applicable (chưa xác nhận)
**Context:** Global (Campaign Manager) + patient-facing link (context khác, chưa LOCATE)
**Environment:** Production (theo Slack) — chưa xác nhận môi trường thay thế
**Role:** User có quyền xem site Broken Cross (hoặc site con tương đương của Macclesfield PCN) — hiện không có
**Preconditions:** Cần role Macclesfield PCN/site con; cần định nghĩa rõ `Failed` là gì trước khi thiết kế assertion chi tiết
**Test Data Category:** Không áp dụng
**Test Data:** Không áp dụng
**Mutation Class:** None (dự kiến chỉ cần xem trạng thái + thử booking link, không gửi campaign)
**Approval Required:** No (cho phần xem trạng thái); Yes nếu cần thử click booking link thật

| Step | Action | Expected Result |
|---|---|---|
| 1 | Đăng nhập tài khoản có quyền site con Macclesfield PCN (vd. Broken Cross) | Vào được `Campaign Manager` cho site đó |
| 2 | Tìm campaign patient-initiated tương ứng, xem cột `Status` | **Unknown/Open Question** — chưa có expected value rõ ràng do `Failed` chưa được định nghĩa chính thức |
| 3 | (Nếu an toàn, read-only) Thử mở booking link patient-facing của campaign | Link mở được, không lỗi |

**Postconditions:** Không có thay đổi dữ liệu
**Cleanup:** Không cần
**Automation:** Blocked — thiếu location, thiếu expected-result rõ ràng (chỉ có Inferred, không đủ điều kiện Automation Gate)
**Evidence:** Không có (chưa observe trực tiếp)
**Execution History:** Not Run

## Open Questions and Blockers

1. TC-003, TC-005, TC-006 cần tài khoản/role hiện chưa có (Redmoor Liverpool creator; Macclesfield PCN/Broken Cross) — theo quyết định của tester (2026-09-14), coi là bất khả thi trong phạm vi ticket hiện tại, không chặn các case còn lại.
2. TC-005, TC-006 còn phụ thuộc câu hỏi môi trường: test trên production (đúng với evidence gốc) hay có bản tương đương trên dev đủ tin cậy?
3. TC-006: định nghĩa chính xác của trạng thái `Failed` chưa rõ (Disputed trong `requirements.md`) — cần BA/PO hoặc technical team xác nhận trước khi viết assertion chi tiết.
4. TC-001, TC-002, TC-004 đã có bằng chứng ad-hoc từ `EXPLORE` (2026-09-14) nhưng chưa chạy qua `EXECUTE` chính thức với evidence đã curate — cần quyết định có tái chạy formal hay dùng lại ad-hoc evidence khi viết `report.md`.

## Tester notes

[Protected area]
