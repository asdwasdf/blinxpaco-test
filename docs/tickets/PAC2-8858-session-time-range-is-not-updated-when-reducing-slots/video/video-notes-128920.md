# Video notes — 128920 (Alexander Paul Third QA)

## Metadata

- **Review date:** 2026-10-06
- **Video source:** `128920-8858 Third QA.mp4`
- **Duration:** 27.221313 seconds
- **Reporter:** Alexander Paul
- **Content:** Popup bug "Slots run past the session end"
- **Environment:** PACO Connect dev (blinx.dev.blinxpaco-np.com)
- **Role:** Super Admin (Dev Access) - Alex Prout, General Practice (Demo Site)

## Flow tái hiện

### 1. Initial state (frame 0001)
- **Screen:** `Appointment Book` → `Day` view
- **Date:** 20 October 2026, Session 3
- **Sessions visible:**
  - ammar 01022295446 (09:00-16:40, 48 slots)
  - Rosie Do (10:00-17:00, 38 slots) 
  - Capital Name (08:00-16:15, 47 slots)
- **Target session:** APSBSB2 QA tại Capital Name / HP - Training Location

### 2. Open Edit Session (frames 0004-0007)
- Click context menu → `Edit Session`
- **Modal:** EDIT SESSION - UNSAVED / APSBSB2 QA
- **Slot list:** 10 min slots từ 08:00, hiển thị PC24 Test | 10 min (empty) (10m)
- **Footer:** `Session ends at: 16:15`
- **Available count:** 48 available

### 3. Scroll slot list (frames 0010-0013)
- Slots chạy xuống: 14:30, 15:00, 15:10, 15:30, 15:40, 15:50, 16:00, 16:10
- Footer vẫn: `Session ends at: 16:15`

### 4. Delete slots (frames 0014-0016)
- Click vào slot → slot detail panel hiển thị bên phải:
  - `Empty Slot Type` / `Delete` buttons
  - Dropdown: PC24 Test
  - Health form: "Please attach health form(s)"
  - Checkbox: `Bookable`
  - Orange `Save` button
- User click `Delete`
- **Available count thay đổi:** 48 → 47 → 46
- **Warning message:** "Save will change end time to 16:25 and 1 slot"
- **Footer update:** `Session ends at: 16:25` (changed from 16:15)

### 5. Click Save (frame 0017)
- Slots còn lại visible: 15:30-16:40 range, PC24 Test | 10 min entries
- Footer: `Session ends at: 16:25`
- Warning: "Save will change end time to 16:25 and 3 slots"
- User click orange `Save` button

### 6. Popup xuất hiện (frame 0018) — CRITICAL

**Modal dialog trắng centered over Session Editor:**

**Title (bold):**
```
Slots run past the session end
```

**Body text (exact verbatim):**
```
One slot would end after the session ends at 16:25. Extend the session to 16:25 to keep them?
```

**Buttons:**
- `Cancel` (gray/white button, left)
- `Extend session to 16:25` (orange-to-pink gradient button, right)

### 7. User accept (frames 0020-0023)
- User click `Extend session to 16:25` button
- Button có pressed state
- Popup biến mất
- Session Editor vẫn mở, slot detail panel bên phải hiển thị

### 8. Session saved (frames 0025-0027)
- Session Editor đóng
- Quay về `Appointment Book` view
- Sessions hiển thị với updated data
- Context menu visible tại Capital Name session (frame 0027):
  - **SET STATUS:** Patient Arrived, Consultation Started, Consultation Ended, Patient Left, Did Not Attend, Cancel Appointment
  - **SLOT MANAGE:** Edit Slot, Add a note, View Audit Log, Edit Session, Block Session, Remove Session, Message Session Patients

## Popup text — EXACT VERBATIM

### Title
```
Slots run past the session end
```

### Body
```
One slot would end after the session ends at 16:25. Extend the session to 16:25 to keep them?
```

### Buttons
- `Cancel`
- `Extend session to 16:25`

## Comparison với ticket expected

**Ticket expected (từ Alexander Paul comment):**
```
Slots run past the session end
2 slots would end after the session ends at 17:10. Extend the session to 17:10 to keep them?
```

**Actual (video 128920):**
```
Slots run past the session end
One slot would end after the session ends at 16:25. Extend the session to 16:25 to keep them?
```

### Pattern analysis

**Giống:**
- Title: `Slots run past the session end` (exact match)
- Body structure: `[COUNT] slot[s] would end after the session ends at [TIME]. Extend the session to [TIME] to keep them?`
- Buttons: Cancel action + Extend action với time cụ thể

**Khác:**
- Slot count: `One slot` vs `2 slots`
- Time: `16:25` vs `17:10`
- Grammar: "One slot ... them" (singular/plural mismatch)

**Popup message pattern CONFIRMED** — đúng format, chỉ khác data (count, time).

## Trigger condition

Popup xuất hiện khi:

1. User đang edit session có slots
2. User thực hiện thay đổi (xóa slots, edit slot times) khiến session end time tự động update
3. Kết quả: có slot(s) end time > session end time (conflict)
4. User click `Save` button
5. System detect conflict → show popup prompt
6. User chọn `Extend session to [TIME]` để giữ slots hoặc `Cancel` để quay lại edit

## Data context từ video

- **Session:** APSBSB2 QA
- **Location:** Capital Name / HP - Training Location
- **Slot duration:** 10 min
- **Original end time:** 16:15
- **Auto-updated end time:** 16:25 (sau khi delete slots)
- **Conflicting slots:** 1 slot (likely 16:15-16:25 hoặc sau)
- **Available slots:** 48 → 47 → 46 (giảm dần khi delete)

## Understanding level

**90%**

- **Confirmed:** Exact popup text, title, buttons (visual observation frame 0018)
- **Confirmed:** Trigger flow: edit session → delete slots → session end time auto-update → save → conflict detected → popup
- **Confirmed:** Popup pattern matches ticket report với khác data (count, time)
- **Inferred:** Exact conflicting slot không thấy chi tiết (chỉ biết có 1 slot end after 16:25)
- **Inferred:** Auto end time calculation logic (tại sao 16:15 → 16:25 sau delete?)

## Open questions

1. **Auto end time calculation logic:**
   - Tại sao delete slots khiến session end time TỰ ĐỘNG thay đổi từ 16:15 → 16:25?
   - System có auto-calculate end time based on latest slot end time?
   - Hoặc user đã manually edit end time off-screen?

2. **Grammar mismatch:**
   - Message: "One slot would end ... keep them?" (singular + plural)
   - Có phải template message dùng "them" cho cả singular/plural?
   - Hoặc có nhiều slots conflict nhưng message chỉ count "One slot"?

3. **Popup wording logic:**
   - "One slot would end AFTER the session ends at 16:25. Extend TO 16:25"
   - Nếu slot end AFTER 16:25 thì extend TO 16:25 không đủ
   - Có thể message ý nghĩa: slot end time nằm sau thời điểm session end (16:25)
   - Hoặc wording bug: should say "at or after" not just "after"

4. **Exact conflicting slot:**
   - Video không show chi tiết slot nào exactly conflict
   - Slot list visible: 15:30, 15:40, 15:50, 16:00, 16:10, 16:20, 16:30+
   - Cần manual test để verify which slot triggers popup

5. **Subsequent behavior:**
   - User click `Extend session to 16:25` → session end time có update đúng không?
   - Video kết thúc ngay sau popup close, không thấy verify result

## Test data reconstruction

Để reproduce scenario này:

**Session setup:**
- Slot duration: 10 min
- Session có end time cụ thể (vd 16:15)
- Slots chạy past end time (vd có slot 16:10-16:20, 16:20-16:30)

**Reproduce steps:**
1. Edit session
2. Delete một số slots ở giữa hoặc đầu (để trigger auto end time recalc?)
3. Observe: session end time auto-update
4. Click Save
5. Expected: popup "Slots run past the session end" nếu có conflict

**Alternative scenario (từ ticket):**
- Extend session bằng cách add slots
- Subsequent edit session → reduce end time manually
- Click Save → popup trigger

## Evidence classification

- **Confirmed (visual observation):**
  - Popup title: "Slots run past the session end"
  - Popup body: "One slot would end after the session ends at 16:25. Extend the session to 16:25 to keep them?"
  - Buttons: Cancel, Extend session to 16:25
  - Trigger: Save session khi có slot end > session end time
  
- **Confirmed (implicit from flow):**
  - Session end time auto-update từ 16:15 → 16:25 sau delete slots
  - Popup xuất hiện TRƯỚC save completes (blocking dialog)
  
- **Inferred (high confidence):**
  - Popup pattern generic: supports different slot counts, times
  - Conflict detection happens on Save click, not on slot edit
  
- **Open question:**
  - Auto end time calculation trigger
  - Exact slot conflict identification
  - Grammar singular/plural handling

## Related bugs

Video này confirm popup bug report từ Alexander Paul (comment lines 82-116 trong ticket.md). Pattern match với minor wording questions.

Không demonstrate session time range bug (128884 Daniel Farley về header không update), đó là bug độc lập.
