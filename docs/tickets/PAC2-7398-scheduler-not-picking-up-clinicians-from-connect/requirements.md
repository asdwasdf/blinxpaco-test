# Requirements: PAC2-7398

**Input Revision:** 1
**Generated:** 2026-10-08
**Status:** Active

## Source Summary

Ticket mô tả bug: Khi map template với CONNECT slot trong Scheduler Configuration, **không có clinicians nào được hiển thị** trong dropdown filter appointments. Nếu template được map với cả EMIS và Connect (2 slot type khác nhau), booking bị giới hạn bởi clinician trong EMIS — user vẫn book được trong Connect nhưng không thể restrict theo clinician cụ thể. **Expected:** Clinicians từ Connect phải xuất hiện trong scheduler filter và có thể restrict được như các platform khác (EMIS).

## Video Coverage

N/A — Không có video đính kèm.

## Atomic Requirements

### REQ-PAC2-7398-001

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Scheduler Configuration / Edit Connections / Clinician Selection
**Search Terms/Aliases:** `scheduler`, `clinician`, `connect`, `slot`, `filter`, `appointment`, `template`
**Known Location:** `/configuration/#scheduler-config` → Edit Connections dialog → `Select a clinician` combobox
**Actor/Role:** Super Admin GB
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing — không có AC trong ticket

**Preconditions:**
- Template đã được map với ít nhất một CONNECT slot (PACO-CONNECT source)
- User có quyền truy cập Scheduler Configuration

**Expected Behavior:**
- Khi chọn `Select a clinician` trong Edit Connections dialog cho template có CONNECT slot, dropdown phải hiển thị **danh sách clinicians có sẵn từ PACO Connect**
- Clinicians từ Connect phải có thể được chọn và hiển thị dưới dạng chip
- Đã chọn clinician từ Connect phải có thể được remove khỏi selection
- Clinicians từ Connect phải xuất hiện trong scheduler filter khi booking appointment với template đó

**Provenance:**
- **Source:** `ticket/PAC2-7398-scheduler-not-picking-up-clinicians-from-connect/ticket.md`
- **Input Revision:** 1
- **First Recorded:** 2026-10-08
- **Last Verified:** 2026-10-08

**Evidence:** Attachment `image-20260715-100926.png` (booking screenshot với "Beth Connect Clinician: Dr Gareth Bartlett")
**Related Tests:** TC-PAC2-7398-001, TC-PAC2-7398-002
**Notes:** Ticket mô tả "Dr Gareth Bartlett" nhưng không clear clinician này thuộc Connect hay EMIS.

---

### REQ-PAC2-7398-002

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Scheduler Configuration / Edit Connections / Dual Source (EMIS + Connect)
**Search Terms/Aliases:** `emis`, `connect`, `dual`, `slot type`, `booking restriction`
**Known Location:** `/configuration/#scheduler-config` → Edit Connections dialog
**Actor/Role:** Super Admin GB
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Template được map với **cả EMIS slot và CONNECT slot** (2 slot type khác nhau)

**Expected Behavior:**
- Clinicians từ **EMIS** xuất hiện trong scheduler filter → **Pass**
- Clinicians từ **Connect** phải xuất hiện trong scheduler filter → **Pass** (hiện tại Fail theo ticket)
- Khi booking trong Connect slot, filter phải cho phép restrict theo clinician từ Connect
- Khi booking trong EMIS slot, filter phải cho phép restrict theo clinician từ EMIS

**Provenance:**
- **Source:** `ticket/PAC2-7398-scheduler-not-picking-up-clinicians-from-connect/ticket.md`
- **Input Revision:** 1
- **First Recorded:** 2026-10-08
- **Last Verified:** 2026-10-08

**Evidence:** Không có video/attachment thể hiện dual mapping
**Related Tests:** TC-PAC2-7398-002
**Notes:** Ticket mô tả "booking is restricted to a clinician in EMIS" khi map cả hai — nhưng không clear đây là bug của Connect hay EMIS. Cần verify behavior khi chỉ có Connect.

---

### REQ-PAC2-7398-003

**Classification:** Confirmed
**Lifecycle:** Candidate
**Feature/Scope:** Patient-facing Scheduler / Clinician Restriction
**Search Terms/Aliases:** `patient scheduler`, `booking link`, `clinician filter`, `connect`
**Known Location:** External scheduler host (patient-facing)
**Actor/Role:** Patient
**Inference Basis:** N/A
**Observation Context:** N/A
**Acceptance Criteria Status:** Missing

**Preconditions:**
- Template đã được map với CONNECT slot
- Template đã được gán clinician(s) từ Connect
- Patient có scheduler link với token

**Expected Behavior:**
- Patient booking qua scheduler link phải thấy appointments với clinicians đã được gán từ Connect
- Clinician restriction phải hoạt động cho Connect-sourced appointments

**Provenance:**
- **Source:** `ticket/PAC2-7398-scheduler-not-picking-up-clinicians-from-connect/ticket.md`
- **Input Revision:** 1
- **First Recorded:** 2026-10-08
- **Last Verified:** 2026-10-08

**Evidence:** Attachment `image-20260715-100926.png`
**Related Tests:** TC-PAC2-7398-003
**Notes:** Ticket đề cập "Beth Connect Clinician: Dr Gareth Bartlett" — booking name "Testing Session: Beth Connect Clinician" gợi ý đây là test data từ Connect platform.

---

## Ambiguities and Conflicts

1. **Ambiguity:** Ticket mô tả "booking is restricted to a clinician in EMIS" khi map cả EMIS và Connect — không rõ đây là:
   - Bug chỉ xảy ra khi có dual mapping (EMIS + Connect)?
   - Hay bug xảy ra cả khi chỉ có Connect mapping?
   - **Source:** `ticket.md` — cần verify bằng manual test
   - **Resolution:** Tách thành 2 test cases: (1) Connect-only mapping, (2) Dual mapping

2. **Ambiguity:** Attachment `image-20260715-100926.png` chưa được đọc — không rõ clinician "Dr Gareth Bartlett" thuộc source nào (EMIS hay Connect).
   - **Source:** `ticket.md` attachment
   - **Resolution:** Cần xem ảnh trong EXPLORE phase

---

## Open Questions

1. **OQ-001:** Clinician selection cho Connect slot có hoạt động không? (hay dropdown trống / không hiện clinicians?)
   - **Impact:** Xác định bug là "không load được clinicians" hay "load được nhưng không filter đúng"

2. **OQ-002:** Bug xảy ra khi nào?
   - Template chỉ có Connect slot?
   - Template có cả EMIS và Connect slot?
   - **Impact:** Cần verify cả 2 scenarios

3. **OQ-003:** Clinician nào ("Dr Gareth Bartlett") là test data từ đâu?
   - **Impact:** Xác định test data cần tạo/sử dụng

4. **OQ-004:** Attachment screenshot thể hiện trạng thái nào?
   - Khi đang chọn clinician?
   - Sau khi đã chọn và booking?
   - **Impact:** Hiểu rõ repro steps

---

## Tester notes

[Protected area]
