# Requirements: PAC2-7132

**Input Revision:** 1
**Generated:** 2026-10-18
**Status:** Active

## Source Summary

Trong PACO Connect Appointment Book, khi session có 5-minute slots, patient name bị truncate/overflow do layout không đủ width. Yêu cầu: đặt patient name ở bên phải của slot time + slot duration, bên trái của non-bookable icon.

## Atomic Requirements

### REQ-PAC2-7132-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** PACO Connect / Appointment Book / Slot cell layout
**Search Terms/Aliases:** `slot layout`, `5 minute slot`, `patient name position`, `slot cell`, `slot rendering`
**Known Location:** `/paco-connect/appointment-book` (Day view)
**Actor/Role:** Super Admin GB (observed from QA evidence)
**Inference Basis:** N/A
**Observation Context:** DEV + Feature Branch, 2026-10-07, Sean Huynh QA
**Acceptance Criteria Status:** Missing (ticket không có AC chính thức)

**Preconditions:**
- PACO Connect session authenticated
- Appointment Book có session với 5-minute slot duration
- Có booked appointments hiển thị trong slot

**Expected Behavior:**
Patient name hiển thị đầy đủ trong slot cell, được đặt ở vị trí: [slot time] [slot duration] [patient name] [non-bookable icon] theo thứ tự từ trái sang phải.

**Provenance:**
- **Source:** `ticket/PAC2-7132-.../ticket.md` description
- **Input Revision:** 1
- **First Recorded:** 2026-10-18
- **Last Verified:** 2026-10-07 (Sean Huynh QA on FB + DEV)

**Evidence:**
- `attachments/129044-Screen Recording 2026-10-07 at 10.08.04 PM.mov` — QA PASS on DEV
- `attachments/128963-Screen Recording 2026-10-07 at 3.50.17 PM.mov` — QA PASS on FB

**Related Tests:** Sean Huynh manual QA (PASS on FB + DEV)
**Notes:** Không có AC chính thức; expected layout dựa trên mô tả description và video evidence.

---

## Ambiguities and Conflicts

- Ticket không có formal acceptance criteria — expected layout spacing chỉ có trong description, không có design spec hoặc pixel value.
- Vị trí chính xác của non-bookable icon và spacing giữa các elements chưa được define rõ ràng.

---

## Open Questions

- OQ-1: Pixel-spec cho layout: slot time | duration | patient name | non-bookable icon — khoảng cách spacing giữa các elements là bao nhiêu?
- OQ-2: Layout này có apply cho tất cả slot durations (5/10/15/20 min) hay chỉ 5-min?
- OQ-3: CSS class/selector nào control layout này (để future regression test)?

---

## Tester notes
