# Video notes: 128884-Remove slots time update fail.mp4

**Người thực hiện:** Daniel Farley  
**Mục đích:** Demonstration FAIL - Session time không update khi xóa slots  
**Duration:** 47.6s (49 frames)  
**Environment:** PACO Connect  
**Role:** Super Admin (Dev Access)

## Steps to reproduce

### 1. Initial state (frame-0001, 00:00)
**Screen:** `Appointment Book` view, `Day` tab  
**Date:** `18 November 2026`  
**Session visible:**
- `Session Name`: `Dan E2E test`
- `Dr Ellie Bartlett`
- Time range: `09:00 - 16:00` (hiển thị trên session header)
- Location: `Blinx Healthcare`
- Header metrics: `Booked 23 2`, `Available 19`, `LIVE 2`

**Slots observed:**
- Multiple slots từ `12:40` xuống `15:40`
- Có cả booked slots (vd: `Mr Michael Romello` at `12:40`, `Mr Paul Foster` at `14:20`)
- Có empty `DAN E2E` slots (20min mỗi slot)
- Visual: red vertical bar bên phải timeline chạy từ đầu đến cuối session

### 2. Open Edit Session dialog (frame-0016, 00:14.5s)
**Action:** Right-click vào session area → context menu hiện  
**User hovering:** Option `Edit Session` trong `SLOT MANAGE` section  
**Other options visible:**
- `SET STATUS`: Patient Arrived, Consultation Started, Consultation Ended, Patient Left, Did Not Attend, Cancel Appointment
- `SLOT MANAGE`: Edit Slot, Add a note, View Audit Log, **Edit Session**, Cancel session appointments, Remove Session, Message Session Patients

### 3. Edit Session dialog opened (frame-0020, 00:18.5s)
**Dialog title:** `EDIT SESSION` / `Dan E2E test`  
**Location shown:** `Blinx Healthcare`, `Dr Ellie Bartlett`, `H25 bookings`  
**Header:** `Select All (21 available)`, `Actions` button, `Tips` button

**Slots visible in editor:**
- `14:20 / 14:40 (20m)` - `Mr Paul Foster` (booked, unchecked)
- `14:40 / 15:00 (20m)` - `DAN E2E | 20 min` (có checkmark)
- Scroll xuống thấy thêm slots `15:00`, `15:20`, `15:40` 
- **Bottom notice:** `Session ends at: 16:00`
- `Save` button (orange) bottom-right

### 4. Slots selected for deletion (frame-0025, 00:23.7s)
**View:** User đã scroll trong dialog, thấy các slots cuối:
- `15:00 / 15:20 (20m)` - `DAN E2E | 20 min` (unchecked)
- `15:20 / 15:40 (20m)` - `DAN E2E | 20 min` (unchecked)
- `15:40 / 16:00 (20m)` - `DAN E2E | 20 min` (unchecked)

**Notice at bottom (không rõ text chính xác, có thể là):** Message về số slots sẽ thay đổi  
**Critical observation:** `Session ends at: 16:00` vẫn không đổi trong dialog (chưa update theo slots còn lại)

### 5. After Save - back to agenda (frame-0030, 00:28.8s)
**Screen:** `Appointment Book` agenda view  
**Session header:** `Dan E2E test`, time range **vẫn là `09:00 - 16:00`** (BUG - không update)  
**Slots visible:** User scrolled, thấy:
- `12:40` - `Mr Michael Romello`
- Empty `DAN E2E` slots: `13:00`, `13:20`, `13:40`, `14:00`
- `14:20` - `Mr Paul Foster`

### 6. Final result (frame-0049, 00:47.3s)
**Screen:** `Appointment Book` agenda view  
**Date observed:** `11 November 2026` (có thể user đổi date hoặc đây là view khác ngày)  
**Toast notification:** `Session updated successfully.` (green checkmark, top-right)

**Session header:**
- `Dan E2E test`, `Dr Ellie Bartlett`
- **Time range: `09:00 - 16:00`** (BUG CONFIRMED - không update dù đã xóa slots)
- Metrics thay đổi: `Booked 23 0`, `Available 16`, `LIVE 0`

**Slots visible:** Scroll xuống thấy nhiều `Empty Slot` placeholders:
- `14:20`, `14:40`, `15:00`, `15:20`, `15:40` đều hiện `Empty Slot` (dotted border)
- Visual: red vertical bar vẫn chạy đến `16:00` (chưa thu ngắn)

## Observed behavior (BUG)

Khi user xóa các slots ở cuối session (trong demo là các slots từ `14:40` trở đi hoặc một số slots cuối), session time range **không tự động update**.

**Expected:** Session header `09:00 - 16:00` phải update thành `09:00 - <thời-gian-slot-cuối-còn-lại>` (vd: nếu slot cuối còn lại là `14:20`, header nên là `09:00 - 14:40`).

**Actual:** Session header vẫn giữ `09:00 - 16:00` sau khi save, dù các slots sau `14:20` đã bị xóa thành `Empty Slot`.

**UI manifestation:**
- Time range text không đổi
- Red vertical timeline bar vẫn chạy đến thời gian cũ (`16:00`)
- Các slots đã xóa hiện `Empty Slot` placeholder, không bị remove khỏi view

## Understanding level

**~75%** - Hiểu rõ repro flow và bug manifestation từ UI, nhưng còn một số chi tiết cần làm rõ:

### Confirmed understanding:
- User workflow: `Edit Session` → select slots → `Save` → session time range không update
- Bug location: Session header time range và visual timeline bar
- Affected component: Appointment Book session editor
- Role và permission: Super Admin có quyền edit session

### Open questions:
- Slots nào chính xác bị xóa? (cần xem lại frame 20-25 kỹ hơn, hoặc có video timestamp chính xác của checkbox clicks)
- Date thay đổi từ 18 Nov → 11 Nov ở frame 49: user có chủ động đổi hay đây là bug riêng?
- "Save will change 4 slots": message này xuất hiện khi nào? (không thấy rõ trong frames đã đọc)
- Session end time calculation logic: backend tính dựa trên slot cuối còn lại hay có business rule khác?
- Empty slots có bị xóa khỏi DB hay chỉ marked as empty?

## Evidence references

- Initial state: `frame-0001.webp` (00:00)
- Edit Session menu: `frame-0016.webp` (00:14.5s)
- Edit dialog opened: `frame-0020.webp` (00:18.5s)
- Slots selected: `frame-0025.webp` (00:23.7s)
- After save: `frame-0030.webp` (00:28.8s)
- Final bug confirmation: `frame-0049.webp` (00:47.3s)

## Tester notes

[Protected area]
