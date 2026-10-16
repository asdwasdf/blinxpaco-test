# Requirements: PAC2-8575

**Input Revision:** 1
**Generated:** 2026-10-15T15:43:22.496Z
**Status:** Active

## Source Summary

Reception team báo cáo: khi muốn **arrive** (chuyển sang trạng thái `Arrived`) một patient trong màn **Appointment Book**, họ phải **double click** vào slot của patient đó mới thấy status thay đổi. Một click đầu tiên không có tác dụng gì; chỉ tới click thứ hai hành vi mới xảy ra. Đây là bug UX: thao tác arrive mong đợi của reception là **single click** trực tiếp lên slot, không phải double click. Ticket nằm trên feature branch host `paco-connect/feature-branch/pac2-8575/appointment-book` — branch này có fix nhưng cần QA xác minh.

**Source language:** Tiếng Anh (reception report verbatim); bản QA chuẩn hoá sang tiếng Việt, giữ UI terms bằng tiếng Anh trong backtick.

## Video Coverage

**Timeline:** N/A
**Contact Sheet:** N/A

Ticket không có video đính kèm; toàn bộ source là text từ `ticket.md` Summary + Description.

## Atomic Requirements

### REQ-PAC2-8575-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Appointment Book — patient status transition (`Arrive`)
**Search Terms/Aliases:** `Appointment Book`, `patient status`, `Arrive`, `arrive patient`, `slot click`, `double click slot`, `reception arrive`, `patient appointment status`, `Booking → Arrived`
**Known Location:** `/paco-connect/feature-branch/pac2-8575/appointment-book` (feature branch host cung cấp bởi tester)
**Actor/Role:** Reception (reception team report; route thuộc Appointment Book — flow thường dùng bởi role reception/admin)
**Inference Basis:** Không áp dụng (Confirmed từ ticket Description)
**Observation Context:** N/A (chưa observe trực tiếp; sẽ thu thập trong phase EXPLORE/MANUAL_EXECUTE)
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Patient có appointment trong `Appointment Book` ngày hiện tại (hoặc slot được chọn), status hiện tại chưa phải `Arrived` (ví dụ `Booked`).
- User đăng nhập với role `Reception` (hoặc role có quyền `arrive` patient).
- Slot tương ứng hiển thị được trong `Appointment Book` (day/week view).

**Expected Behavior:**
- **Single click** lên slot (patient) trong `Appointment Book` phải trigger hành vi arrive — chuyển status patient từ trạng thái hiện tại sang `Arrived` (hoặc mở popover/action cho phép arrive bằng single click tiếp theo). KHÔNG được yêu cầu double click.
- **Double click** trên cùng slot **không** được là cách duy nhất để arrive. Hành vi double click có thể tồn tại (vd mở session editor) nhưng KHÔNG được dùng làm cơ chế arrive chính.
- Status thay đổi được phản ánh trong UI ngay sau khi single click (không cần reload trang).

**Provenance:**
- **Source:** `ticket/PAC2-8575-have-to-double-click-slots-in-appointment-book-to-change-patient-status/ticket.md:13` (Description)
- **Input Revision:** 1
- **First Recorded:** 2026-10-15
- **Last Verified:** 2026-10-15

**Evidence:** N/A (chưa có observation; sẽ ghi `evidence/` khi MANUAL_EXECUTE)
**Related Tests:** (sẽ tạo ở phase TEST_DESIGN)
**Notes:**
- Acceptance criteria ticket ghi "Not provided" → cần test dựa trên expected behavior suy ra từ reception report + best practice UX.
- Chưa xác minh single click có thực sự arrive hay chỉ mở action popover/right-click menu. Phase EXPLORE sẽ xác minh trigger chính xác của single click.

---

### REQ-PAC2-8575-002

**Classification:** Inferred
**Lifecycle:** Active
**Feature/Scope:** Appointment Book — `Arrive` action trigger surface
**Search Terms/Aliases:** `Appointment Book slot`, `patient slot action`, `arrive trigger`, `right click slot`, `context menu`, `status transition`, `single click arrive`
**Known Location:** `/paco-connect/feature-branch/pac2-8575/appointment-book`
**Actor/Role:** Reception
**Inference Basis:** Từ REQ-PAC2-8575-001 (reception expect single click để arrive) + UX pattern phổ biến của Appointment Book; suy luận rằng sau khi fix, single click sẽ trực tiếp trigger arrive hoặc mở action popover rõ ràng chứ không phải "no-op" rồi yêu cầu click lần hai.
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Giống REQ-PAC2-8575-001.

**Expected Behavior:**
- Hành vi single click lên slot có thể là một trong hai dạng (cần xác minh trong EXPLORE):
  1. **Direct arrive:** single click → status chuyển sang `Arrived` ngay, không cần thao tác thêm.
  2. **Open action popover/menu:** single click → popover/menu hiện ra với action `Arrive` (hoặc tương đương) để chọn.
- Cả hai dạng đều đạt yêu cầu "không cần double click để arrive". Dạng (1) đúng với mong đợi reception nhất; dạng (2) vẫn tốt hơn double click nếu chỉ cần single click để popover hiện.

**Provenance:**
- **Source:** suy luận từ `ticket.md:13` Description + UX convention.
- **Input Revision:** 1
- **First Recorded:** 2026-10-15
- **Last Verified:** 2026-10-15

**Evidence:** N/A
**Related Tests:** (sẽ tạo ở phase TEST_DESIGN)
**Notes:** Cần xác minh trong EXPLORE dạng nào được implement. Nếu dạng (2) thì phải test tiếp "second click on `Arrive` action inside popover" cũng phải work, không cần third click.

---

## Ambiguities and Conflicts

- **Acceptance criteria ticket ghi "Not provided"** → expected behavior dựa trên suy luận UX. Cần confirm với BA/PO nếu có yêu cầu cụ thể (vd "chỉ 1 click duy nhất, không popover" vs "1 click mở menu + 1 click chọn action"). Hiện tại ưu tiên "single click = arrive (direct hoặc qua popover 1 step)".
- Chưa có thông tin về **scope status transition khác** (vd `Booked` → `Arrived` vs `Arrived` → `In consultation`). Ticket chỉ nói "change patient status" mà không liệt kê các transition bị ảnh hưởng. Mặc định assume scope: **arrive** transition (reception dùng từ "arrive them" trong description).

## Open Questions

- **OQ-001:** Single click sau fix sẽ **direct arrive** hay **mở popover** rồi mới arrive? (impact: ảnh hưởng expectation test case; cần xác minh trong EXPLORE trước khi test design final).
- **OQ-002:** Bug có ảnh hưởng status transition khác ngoài `Arrive` không (vd `No show`, `Cancelled`, `In consultation`)? Reception chỉ nói "arrive" — có thể bug chỉ ở arrive, có thể ở mọi status change trong slot. Cần verify scope trong EXPLORE.
- **OQ-003:** Trên production hoặc dev chung (không phải feature branch), behavior có còn là double click không? Có thể branch host đã fix; cần xác nhận fix chỉ trên branch hay đã promote. Impact: kết quả test trên branch có generalize không.

---

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
