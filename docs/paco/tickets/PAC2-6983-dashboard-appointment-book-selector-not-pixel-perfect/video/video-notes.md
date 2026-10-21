# Video Evidence Analysis

**Ticket:** PAC2-6983 - Dashboard/Appointment Book selector không pixel-perfect

**Bug:** Khi `Dashboard` được chọn có khoảng cách giữa selector card và nội dung; khi `Appointment Book` được chọn thì KHÔNG có khoảng cách (không pixel-perfect).

---

## Video 1: Feature Branch PASSED QA

**Source:** `129106-Screen Recording 2026-10-08 at 7.00.01 PM.mov`

**URL Base:** `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-6983/`

**Frame-by-frame:**

1. **Frame 1:** `Dashboard` selected tại `/dashboard`, content cards hiển thị bên dưới selector tabs. **Spacing có mặt** giữa selector và content.

2. **Frames 2-3:** Cursor hover `Appointment Book` tab, chuẩn bị click để toggle.

3. **Frame 4:** `Appointment Book` selected tại `/appointment-book`, calendar grid hiển thị với sessions. **Không có spacing** giữa selector tabs và calendar content - calendar bắt đầu ngay sát dưới tabs.

4. **Frames 5-7:** Toggle qua lại giữa hai tabs, cursor di chuyển, hover states.

5. **Frame 8:** `Appointment Book` view ổn định với cursor hover `Dashboard`, calendar grid hiển thị các time slots.

**Kết luận:** Feature branch có bug - `Dashboard` có spacing, `Appointment Book` không có spacing.

---

## Video 2: DEV Environment FAILED QA

**Source:** `129121-Screen Recording 2026-10-08 at 9.05.12 PM.mov`

**URL Base:** `blinx.dev.blinxpaco-np.com/paco-connect/`

**Frame-by-frame:**

1. **Frames 1-2:** Loading spinner tại `/appointment-book`, blank screen với message "Loading your appointment data".

2. **Frame 3:** URL chuyển sang `/dashboard`, loading spinner, blank screen.

3. **Frame 4:** Accidentally navigated tới PACO OS (`blinx.dev.blinxpaco-np.com/paco/dashboard`) - interface khác với Dashboard widgets, không có selector tabs `Dashboard`/`Appointment Book`.

4. **Frame 5:** Quay về PACO Connect tại `/dashboard`, `Dashboard` selected, content cards hiển thị. **Spacing có mặt** giữa selector tabs và content cards. Cursor hover `Dashboard` tab.

5. **Frame 6:** `Appointment Book` selected tại `/appointment-book`, calendar grid loading. **Không có spacing** giữa selector tabs và calendar.

6. **Frames 7-8:** `Appointment Book` view fully loaded, calendar grid hiển thị sessions (Sophie Friar, beth green, Mr Test Harness, Mr Matthew Lynas), scrolled down. **Không có spacing** giữa tabs và calendar content.

**Kết luận:** DEV environment có cùng bug - `Dashboard` có spacing, `Appointment Book` không có spacing.

---

## Video 3: DEV Environment PASSED QA (After Fix)

**Source:** `129123-Screen Recording 2026-10-08 at 9.17.13 PM.mov`

**URL Base:** `blinx.dev.blinxpaco-np.com/paco-connect/`

**Frame-by-frame:**

1. **Frames 1-3:** Loading spinner tại `/appointment-book`, blank screen với sidebar menu visible, page đang load.

2. **Frame 4:** `Appointment Book` selected tại `/appointment-book`, calendar grid fully loaded với sessions. **Spacing hiện diện** giữa selector tabs và calendar content - đây là sự thay đổi quan trọng.

3. **Frame 5:** `Appointment Book` view với session headers collapsed/minimized. **Spacing vẫn có mặt** giữa tabs và content. Cursor hover `Appointment Book` tab.

4. **Frames 6-7:** Toggle sang `Dashboard` selected tại `/dashboard`, content cards hiển thị (Total Capacity 861, Utilisation 3%, charts). **Spacing có mặt** giữa selector tabs và dashboard cards.

5. **Frame 8:** `Dashboard` view ổn định, cursor hover `Appointment Book` tab. **Spacing vẫn có mặt**.

**Kết luận:** Bug đã fix - cả `Dashboard` và `Appointment Book` đều có spacing nhất quán giữa selector tabs và content.

---

## Toggle Flow Pattern

**Reproduce steps:**

1. Truy cập PACO Connect Dashboard tại `blinx.dev.blinxpaco-np.com/paco-connect/dashboard`
2. Observe spacing giữa selector tabs (`Dashboard`/`Appointment Book`) và content area
3. Click `Appointment Book` tab để toggle
4. URL chuyển sang `/appointment-book`, page load calendar grid
5. Observe spacing giữa selector tabs và calendar content
6. Click `Dashboard` tab để toggle ngược lại
7. Compare spacing ở cả hai states

**Navigation behavior:**
- Toggle giữa `Dashboard` ↔ `Appointment Book` thay đổi URL path (`/dashboard` ↔ `/appointment-book`)
- Mỗi tab selected có pink background color
- Content area load tương ứng (dashboard cards vs calendar grid)

---

## Spacing Observations

### Before Fix (Video 1 FB, Video 2 DEV)

**`Dashboard` selected:**
- Có khoảng cách rõ ràng giữa selector tab card và dashboard content cards
- Spacing nhất quán, tạo visual separation giữa navigation và content

**`Appointment Book` selected:**
- KHÔNG có khoảng cách giữa selector tabs và calendar grid
- Calendar content bắt đầu ngay sát dưới tabs
- Tạo cảm giác cramped, không nhất quán với `Dashboard` state

**Bug impact:** Inconsistent spacing behavior giữa hai tabs không pixel-perfect, vi phạm design consistency.

### After Fix (Video 3 DEV)

**Cả `Dashboard` và `Appointment Book` selected:**
- Đều có spacing nhất quán giữa selector tabs và content area
- Visual separation tương đồng ở cả hai states
- Pixel-perfect spacing match giữa hai tabs

---

## FB vs DEV Differences

### Video 1: Feature Branch (PASSED QA with known bug)

- URL prefix: `/paco-connect/feature-branch/pac2-6983/`
- Bug tồn tại: `Dashboard` có spacing, `Appointment Book` không có spacing
- QA passed để document bug behavior trên feature branch

### Video 2: DEV Environment (FAILED QA)

- URL prefix: `/paco-connect/` (base DEV)
- Cùng bug: `Dashboard` có spacing, `Appointment Book` không có spacing
- Flow bao gồm accidental navigation tới PACO OS (Frame 4) trước khi quay về PACO Connect
- Failed QA vì inconsistent spacing behavior

### Video 3: DEV Environment (PASSED QA after fix)

- URL prefix: `/paco-connect/` (base DEV)
- Bug đã fix: Cả `Dashboard` và `Appointment Book` đều có spacing nhất quán
- Passed QA với pixel-perfect spacing consistency giữa hai tab states

**Timeline:**
1. Feature branch có bug (Video 1)
2. DEV environment có cùng bug (Video 2 failed QA)
3. Fix deployed lên DEV, spacing đã nhất quán (Video 3 passed QA)

---

## Tester notes

(Reserved for manual tester feedback)
