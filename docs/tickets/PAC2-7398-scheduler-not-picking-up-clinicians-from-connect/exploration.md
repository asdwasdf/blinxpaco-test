# PAC2-7398 — Exploration (Updated)

## Ticket
**Summary:** Scheduler Not Picking Up Clinicians from Connect
**Bug:** Scheduler không hiển thị/gợi ý clinicians khi template được map với CONNECT slot.

## Environment
- **Environment:** dev
- **Role:** Super Admin GB
- **Timestamp:** 2026-10-08

## LOCATE (Completed)
- Route: `/configuration/#scheduler-config` ✓
- PACO Connect: `https://blinx.dev.blinxpaco-np.com/paco-connect/` → button "Appointment Book" ✓

## EXPLORE Observations

### PACO Connect Appointment Book
- URL: `https://blinx.dev.blinxpaco-np.com/paco-connect/appointment-book`
- Sessions: 5
- Available: 220 slots
- Date: 17 October 2026
- Session name visible: "PC 24 Test Sophie", "111 PC24"

### Scheduler Configuration - Edit Connections
- Template: "Newly Created with EMIS & Connect Availability"
- Dialog: "Edit Connections" mở được bằng Edit button
- Clinician selection: "Select a clinician" combobox

### Clinician Selection Behavior
- Template đã gán: **"Dr Maldaba Test | Appts: 0"**
- Dropdown: Chỉ hiện clinician đã gán, **không hiện list để chọn clinicians khác**
- **Appts: 0** = 0 appointments available cho clinician này

### Observable Behavior
1. Combobox chỉ hiện clinician đã được gán
2. **Không thấy dropdown list** để chọn clinicians khác
3. PACO Connect có 220 slots trống — nhưng template "Dr Maldaba Test" có 0 appointments

### Possible Root Cause
- Query `getAppointmentSessions` lỗi PG 42803 → không load được clinicians từ Connect
- Hoặc: Session đã map không đúng với template → clinicians không match

## Evidence
- Screenshots:
  - `test-results/PAC2-7398/explore/paco-connect-appointment-book.png`
  - `test-results/PAC2-7398/explore/clinician-dropdown.png`

## Open Questions
1. Dr Maldaba Test có phải là clinician từ Connect không?
2. Session đã map trong template có slot trống không?
3. Dropdown có thực sự trống hay chỉ không hiện đúng?

## Suggested Next Steps
1. Xóa Dr Maldaba Test khỏi template
2. Map template với session "111 PC24" (có 220 slots trống)
3. Verify dropdown "Select a clinician" có hiện clinicians không
4. Hoặc dùng template khác đã map với Connect session

## Tester notes

[Protected area]
