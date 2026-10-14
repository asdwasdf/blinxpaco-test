# Video Notes - PAC2-8867

## Frame-by-Frame Analysis

### Frame 0:00 — Add Session Dialog
- Dialog `Add Session` mở, form điền `Session Name` = "AP"
- `Session Type` chọn `Timed Appts`, `Slot Duration (min)` = 10
- Bên trái danh sách sessions trong `Configuration` > `Appointment Books`
- Visible sessions: `AP ABC (Template — 1 session)`, `AP ABCE`, `Sean QA Test Oct5 2026`, etc.
- Row count: 15,044 sessions

### Frame 1:22 — Loading State
- Trang `/paco-connect/configuration` hiển thị loading spinner trung tâm
- Navigation đang load, không có content visible

**Note**: Section 1:22 đến 3:21 — tester đang tìm session đúng, không phải bug flow chính.

### Frame 1:40 — Template Row Hover
- `Configuration` > `Appointment Books` list
- Template `AP Dupe Session Test (Template — 3 sessions)` ở top
- Mouse hover over template row
- Template chưa expand, chỉ hiển thị summary row

### Frame 2:00 — Appointment Book Day View
- `Appointment Book`, Day view, 6 October 2026
- Column "Mickey Mouse": session `AP 5313 Now` (08:00-16:00), slots màu đỏ `PC24 GP Test`
- Column "S Tig": session `AP 5 June` (08:00-16:00), slots màu hồng `PC24 Nurse Test`
- Booked appointments trong một số time slots

### Frame 2:30 — Template Expanded (Bug Evidence Start)
- `Configuration` > `Appointment Books` list
- Template `AP Dupe Session Test (Template — 3 sessions)` đã expand
- Hiển thị 3 child sessions **cùng tên** `AP Dupe Session Test`
- Cả 3 sessions có `Assigned Slot Types` = `PC24 GP Test, PC24 Nurse`
- Một row highlight màu xanh nhạt
- **Observation**: duplicate sessions trong cùng template folder

### Frame 3:21 — Calendar Picker Open
- `Appointment Book`, Day view, 10 October 2026
- Calendar picker mở, tháng October 2026
- Ngày 5 October highlight trong calendar
- Sessions visible: `AP 5313 Now` và `AP 5 June` với appts

### Frame 4:00 — Edit Session Bug (Core Bug State)
- Dialog `Edit Session` mở bên phải
- **Bug**: `Session Name` field **trống**
- `Session Type` = `Timed Appts`, `Slot Duration (min)` = 10
- Bên trái list vẫn hiển thị template với 3 child sessions duplicate tên `AP Dupe Session Test`
- Sessions khác: `AP ABCE`, `AP ABC`, `Sean QA Test Oct5 2026`, `Sean QA Test Oct5`
- **Observation**: edit dialog không load session name → system attempting to recreate session

## Bug Flow Summary

1. **Setup**: Session nằm trong folder/template (template `AP Dupe Session Test` có nhiều sessions)
2. **Action**: Session được move hoặc leave folder (không capture trong video frames)
3. **Trigger**: User mở `Edit Session` cho session đã leave folder
4. **Bug manifestation** (frame 4:00):
   - `Session Name` field trống
   - System không load existing session data
   - Behavior suggests system attempting to recreate session thay vì edit existing
5. **Result** (evidence ở frame 2:30, 4:00):
   - Multiple duplicate sessions cùng tên `AP Dupe Session Test` trong template
   - Cả 3 sessions có identical `Assigned Slot Types`

## Key Observations

### Confirmed
- **Duplicate sessions**: template có 3 sessions cùng tên `AP Dupe Session Test` (frame 2:30, 4:00)
- **Empty edit form**: dialog `Edit Session` có `Session Name` trống (frame 4:00) khi mở edit trên session trong list
- **Consistent slot types**: cả 3 duplicate sessions có cùng `PC24 GP Test, PC24 Nurse`

### Not Captured in Frames
- **Clash tool**: expected bug flow mention clash tool xuất hiện sau khi duplicate session created, nhưng không visible trong 7 frames này
- **Actual session move/leave action**: frames không capture moment session leaves folder ban đầu

### Navigation Pattern (1:22-3:21)
- Tester mất thời gian navigate: config → loading → appointment book day view → calendar picker → quay lại config
- Section này không phải bug flow, là tester tìm đúng session/date để reproduce

## Evidence Files
- 7 frames extracted từ bug video
- Timestamps: 0:00, 1:22, 1:40, 2:00, 2:30, 3:21, 4:00
- Location: `docs/tickets/PAC2-8867-folder-edit-attempts-to-recreate-session-that-has-left-the-folder/video/`
