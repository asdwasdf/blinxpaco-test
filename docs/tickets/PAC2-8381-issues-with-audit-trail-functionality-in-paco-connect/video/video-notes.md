# Video observations — PAC2-8381

## Video sources

- **Video 1:** `126784-Screen sharing - 2026-08-21 1_39_25 PM.mp4` (110s, 113 frames)
- **Video 2:** `126785-no tiles clickable in connect.mp4` (38s, 39 frames)

## Video 1: Direct Connect booking với audit trail

**Environment:** `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8012/appointment-book`  
**Role:** Beth Green, Super Admin GB, General Practice (Demo Site)  
**Date:** 21/08/2026

### Booking flow observed

**Frame 0001-0010:** Loading Appointment Book view, calendar hiển thị các slots vào 21 Aug 2026.

**Frame 0010-0020:** Calendar view với nhiều columns (Johnny Bravo, Vinay Cloe, Mr Test Harness, Darciol Masssolol, Alex Pau). Column "Mr Test Harness" có nhiều yellow slots "Mke Audit Test Update" 13:40-15:00.

**Frame 0020-0030:** Quick Book dialog mở. Patient Search với query "icbael", results hiển thị 2 patients tên Michael Ramella (NHS 70986 và NHS 1000019932).

**Frame 0030-0040:** Chọn patient, Session tab hiển thị session list cho "Test 1231231231" (faded text). Recommended Appointment dialog mở với:
- Slot: **Mike Audit Test Update** with **Mr Test Harness** | 19 Sep test
- Date: **21/08/2026** ⏰ **14:30 - 14:40 (10 mins)**
- Send confirmation checkboxes: Email ☐ SMS ☐
- Book Appointment button

**Frame 0060:** Appointment slidepanel mở sau booking. Header: **Appointment**, date **21/08/2026**, **10 mins**, title **Mike Audit Test Update**.

Right panel metadata:
- PATIENT: Mr Michael Ramella
- HCP: Mr Test Harness
- APPT TYPE: Face to Face 🏠
- APPT LOCATION: 19 Sep test
- HOME PRACTICE: General Practice (Demo Site)
- SERVICE PROVIDER: General Practice (Demo Site)
- SERVICE PROVIDER ODS: YGMQJ
- START TIME: 21/08/2026 14:30
- END TIME: 21/08/2026 14:40
- **BOOKED BY: Beth Green** ✅

**Frame 0080:** Audit tab visible. Description section text:

> **Beth Green created this slot** ⚠️

**Frame 0100-0113:** Calendar view sau booking. Slot 14:30 column "Mr Test Harness" giờ hiển thị **"Mr Michael Ramella"** với warning icon vàng.

### Observations

| Type | Finding | Evidence |
|---|---|---|
| **Confirmed** | Appointment được book thành công trong Connect với patient Michael Ramella, slot "Mike Audit Test Update" 21/08/2026 14:30-14:40. | Frame 0060 slidepanel |
| **Confirmed** | `BOOKED BY` field trong appointment panel hiển thị đúng user **Beth Green**. | Frame 0060 right panel |
| **Confirmed** | Audit tab có entry ghi lại booking action. | Frame 0080 |
| **Confirmed** | Audit text hiện tại: **"Beth Green created this slot"**. | Frame 0080 description |
| **Issue confirmed** | Audit wording không đúng requirement. Ticket yêu cầu: "Jane Doe **booked this appointment**", không phải "created the slot". Từ "created the slot" gây nhầm lẫn với session creation thay vì appointment booking. | Frame 0080, ticket description 1b |
| **Observed** | Slot sau booking hiển thị patient name "Mr Michael Ramella" với warning icon. Không rõ warning về gì. | Frame 0100-0113 |
| **Open question** | Slot amendments (change slot type) có capture trong audit không? Video không demo amendment scenario. | Ticket 1d requirement |

## Video 2: Care Navigator view

**Environment:** `blinx.dev.blinxpaco-np.com/care-navigation/`  
**Role:** Beth Green, Super Admin GB, General Practice (Demo Site)  
**Date:** 21/08/2026

### Content observed

**Frame 0001-0039:** Care Navigator home view không đổi.

Left panel patient card:
- **Michael Ramella**
- NHS Number: 70986
- Male icon
- DOB: 15/03/2024
- Address: street70986 Liverpool Kensington L61PH
- Phone: 07379060817

Center area: "Welcome to Care Navigator" với Search Services textbox.

Service tiles grid:
- NHS C&M Unscheduled Care Hub
- ARB
- Simple EMIS Booking - Flu Jab
- Book Timed EMIS Appointment
- FCMS - Diagnostics
- HCRS School Assessment
- [Bootcamp] Blinx Surgery
- PAC2-4334
- Enable e CN Flow (CAPASS)
- Help Desk
- DEVELOPERS ONLY
- PCN Services
- PAC2-4156
- Best Practice 2025

**Frame 0012:** Cursor hover lên search box.

**Frame 0039:** Cursor ở bottom area page.

### Observations

| Type | Finding | Evidence |
|---|---|---|
| **Observed** | Care Navigator home hiển thị patient Michael Ramella NHS 70986 và service tiles grid. | Frame 0001-0039 |
| **Open question** | Video title "no tiles clickable in connect" nhưng không thấy user attempt click tiles trong video 38s. Issue này có liên quan audit trail ticket không? | Video filename, frames review |
| **Open question** | Ticket 1a requirement: "Book an appointment via Care Navigation and no appointment audit trail in FE". Video 2 không demo booking flow đầy đủ. Cần verify scenario này riêng. | Ticket description 1a |

## Gaps và next steps

1. **Amendment audit:** Ticket 1d yêu cầu verify slot amendments (change slot type) có capture trong audit. Video 1 không demo amendment.
2. **Care Navigation booking audit:** Ticket 1a claim không có audit trail khi book via Care Navigation. Video 2 chỉ show home view, không demo booking flow.
3. **"No tiles clickable" issue:** Video 2 title suggest bug khác, cần clarify có liên quan audit trail ticket không.

## Provenance

- Timeline metadata: `timeline.md`
- Contact sheets: `contact-sheet.webp`
- Frame files: `frames/frame-*.webp`

## Tester notes

[Protected area]
