# Manual Test Guide: PAC2-8575 (Double click → arrive slot)

**Ticket:** PAC2-8575 — Reception báo: phải double click slot patient mới arrive được
**Branch host:** `pac2-8575`
**Goal:** Verify xem fix đã apply chưa, scope fix (chỉ Arrive hay mọi status transition), và cơ chế arrive thực sự nằm ở đâu
**Tester:** bạn (manual + record evidence)
**Time estimate:** 20–30 phút nếu có QA-AUTO data; 10 phút nếu chỉ chạy Smoke + Regression
**Output expected:** Video + screenshots + (optional) console log

---

## Chuẩn bị (1 lần)

1. **Mở browser Chrome** (Playwright/Chromium tốt nhất — tương thích PACO Connect)
2. **Tab mới** (Ctrl+T) — quan trọng: dùng fresh tab để tránh stale state (xem Lưu ý cuối)
3. **Login** vào `https://blinx.dev.blinxpaco-np.com/paco-connect/login` với tài khoản reception:
   - User: account reception của bạn
   - Org: `General Practice (Demo Site)` (hoặc org test bạn hay dùng)
   - Location: `test again - old location` (hoặc location tương đương có booked appointments)
4. **Xác nhận đang login đúng role** — top bar hiện tên + role (vd `Reception` / `Blinx Deployment`)

## Mở feature branch

5. Navigate trực tiếp tới URL:
   ```
   https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book
   ```
6. **Đợi Day view render** (~5–10s). Landmarks phải có:
   - Top bar: `Sessions` / `Booked` / `Available` / `LIVE` count
   - Calendar header: `15 October 2026` (hoặc today date) + nút `Day`/`Week`/`Month`/`Year`
   - Nút `Go to today`, `Previous`, `Next`

**Record evidence step này:** Screenshot full page.

---

## CASE 1: Single click mở Appointment Details sidebar (Smoke)

> **Mục đích:** Verify single click không còn no-op. Fix mong đợi: mở sidebar Detail.

7. **Tìm 1 patient slot booked** trên Day view (có tên patient + giờ). Ví dụ: `Mr Floy adhoc` 15:00-15:10.
   - Nếu `Booked 0` → xem Lưu ý #1 (fresh tab)

8. **Single click 1 lần** lên slot đó (click trái, không double click, không drag).

9. **Quan sát ngay:**
   - Sidebar `Appointment Details sidebar` mở ở phải màn hình
   - Sidebar header có: tên patient + NHS Number + nút `PACO Assist`
   - Sidebar body có: `Mark as:`, `Select Patient Status` (chevron ▾), `Slot Count:`, `Reason Code(s):`, `Booking Notes:`
   - **Slot class KHÔNG đổi** (vẫn màu booked ban đầu)

**Record evidence:** Screenshot sidebar mở + DevTools → Elements → tìm `.appointment-slot.appointment-booked` cho patient đó, confirm class list vẫn còn `appointment-booked`.

**Pass criteria:**
- [ ] Sidebar mở cho đúng patient
- [ ] Sidebar có đủ các field trên
- [ ] Slot class không đổi (chưa arrive)

**Fail criteria:**
- Sidebar KHÔNG mở (no-op như reception report trên mainline)
- Sidebar mở nhưng KHÔNG có `Mark as:` / `Select Patient Status`
- Slot class đổi sang `arrived` (mutation lạ)

---

## CASE 2: Double click KHÔNG mutate status (Regression)

> **Mục đích:** Verify double click không còn là cơ chế arrive. Reception report nói phải double click — trên branch này, double click phải benign.

10. **Đóng sidebar** hiện tại (phím `Escape` hoặc click `Close` ở góc sidebar)

11. **Tìm patient slot booked khác** (slot khác slot ở Case 1, ví dụ `Mrs MAJDIYYA FAWZIA DUAL` 08:00-08:10)

12. **Note `Booked` count** trước khi test (ví dụ `Booked 6`)

13. **Double click** lên slot đó (click trái 2 lần nhanh). Có thể dùng:
    - Mouse: click 2 lần liên tiếp nhanh (~300ms apart)
    - Hoặc bật Chrome DevTools → Console → gõ:
      ```js
      document.querySelector('.appointment-slot.appointment-booked').parentElement.dispatchEvent(new MouseEvent('dblclick', {bubbles: true, button: 0}));
      ```

14. **Quan sát:**
    - Sidebar mở cùng patient (giống Case 1)
    - `Booked` count KHÔNG đổi (vẫn `Booked 6`)
    - Không có modal/popover/toast ngoài sidebar
    - Slot class vẫn `appointment-booked`

**Record evidence:** Screenshot sau double click + check `Booked` count + slot class.

**Pass criteria:**
- [ ] `Booked` count không đổi
- [ ] Slot class không đổi
- [ ] Chỉ có sidebar mở, không có UI mutation khác

**Fail criteria:**
- Slot đổi sang `arrived` (reception vẫn dùng double click arrive)
- Có modal/popover/toast mới ngoài sidebar
- `Booked` count giảm (slot bị transition)

---

## CASE 3: Arrive transition end-to-end (Critical, cần QA-AUTO data)

> **Mục đích:** Verify single click + arrive action trong sidebar thực sự đổi status `Booked` → `Arrived`.
> **Blocker:** Cần patient có appointment TRONG TƯƠNG LAI (status Booked). Trên branch hiện tại, 6/6 slots đều past (isBeforeNow).

### Nếu KHÔNG có QA-AUTO data future booked → SKIP case này, ghi "Blocked: no future booked slot" và chuyển Case 4.

### Nếu CÓ QA-AUTO data:

15. **Setup (1 lần trước khi test):**
    - Tạo patient test `QA-AUTO Arrive Test` (synthetic, NHS random 9 digits)
    - Book appointment cho patient này trong 1 session trên Day view hiện tại, giờ future (vd +1h từ bây giờ)
    - Ghi lại appointment ID vào evidence
    - Đảm bảo session đó thuộc org + location đang login

16. **Note `Booked` count** trước test (vd `Booked 7`)

17. **Single click** lên `QA-AUTO Arrive Test` slot

18. **Quan sát sidebar mở:**
    - Verify `Mark as: Select Patient Status` chevron
    - **THỬ click chevron** — quan sát: có mở dropdown status không? Có items: `Arrived`, `In consultation`, `No show`, `Cancelled`?

**Record evidence:** Screenshot sidebar + (nếu có) dropdown mở.

19. **Nếu dropdown mở + có item `Arrived`:** click `Arrived` → quan sát có modal confirm không → confirm → check slot đổi class.

20. **Nếu dropdown KHÔNG mở hoặc không có `Arrived`:** thử alternatives:
    - **Right-click** lên slot → context menu có arrive action?
    - **Keyboard shortcut** (vd `A`, `R`, `Enter`)?
    - Click vào `Mark as:` label hoặc chevron (không phải chevron con)
    - Click vào slot icon `circle-info` (info button) bên phải slot

**Record evidence:** Mỗi alternative thử — screenshot + note kết quả (menu/popup mở, có action arrive, etc.).

21. **Nếu tìm được arrive trigger:** trigger nó, verify slot đổi class (vd `appointment-arrived` hoặc class tương đương), `Booked` count giảm 1, có thể có summary `Arrived` mới.

22. **Cleanup:** revert arrive (nếu có Save) hoặc cancel appointment để giữ data sạch cho test sau.

**Pass criteria:**
- [ ] Tìm được arrive trigger (qua dropdown / right-click / keyboard / button)
- [ ] Status `Booked` → `Arrived` thành công
- [ ] Slot class đổi reflect status mới
- [ ] Summary counts cập nhật

**Fail criteria:**
- Không tìm được cách arrive (reception report vẫn đúng)
- Slot đổi class nhưng `Booked` count không cập nhật (UI desync)

---

## CASE 4: Status transition khác (Exploratory, cần QA-AUTO data)

> **Mục đích:** Scope bug — chỉ Arrive hay mọi status transition đều bị ảnh hưởng?

23. **Setup:** tạo 3 QA-AUTO appointments future cho cùng patient hoặc patients khác nhau:
    - Slot A: status `Booked`
    - Slot B: status `Booked`
    - Slot C: status `Booked`

24. **Single click slot A → sidebar mở → tìm action `In consultation`** (nếu có)
    - Trigger nếu tìm được
    - Verify status đổi

25. **Lặp lại với slot B (`No show`), slot C (`Cancelled`)**

**Record evidence:** Screenshots từng transition.

**Pass criteria:**
- [ ] Cả 3 transition đều work với single click (scope chỉ Arrive)
- [ ] HOẶC tất cả cần double click (scope rộng hơn reception report)
- [ ] HOẶC mix (vd Arrive cần double, No show single)

---

## CASE 5: Cross-host behavior (Optional, ngoài scope)

> **Mục đích:** So sánh fix đã promote từ branch `pac2-8575` sang mainline chưa.

26. **Mở tab mới**, navigate tới mainline:
    ```
    https://blinx.dev.blinxpaco-np.com/paco-connect/appointment-book
    ```
    (không có `feature-branch/pac2-8575/`)

27. **Single click + Double click** một patient slot booked tương tự Case 1 + Case 2

28. **So sánh** với branch host:
    - Single click: mở sidebar (giống branch) hay no-op (giống reception report cũ)?
    - Double click: có mutate status (mainline cũ) hay benign (branch fix)?

**Record evidence:** Screenshots compare branch vs mainline.

---

## Lưu ý quan trọng

### Lưu ý #1: Stale tab state

**Bug gặp 2026-10-15:** Existing tab navigate lại nhiều lần trả `Booked 0`; fresh tab trả `Booked 6` đúng.

**Workaround:** LUÔN dùng **fresh tab (Ctrl+T)** cho mỗi test session. Nếu tab hiện tại trả `Booked 0`:
1. Mở tab mới
2. Navigate lại URL trên
3. Test tiếp

### Lưu ý #2: Reception role

Tôi test ở role `Blinx Deployment` (Super Admin equivalent). Nếu bạn login với role `Reception`, behavior có thể khác (vd một số action chỉ visible cho admin). **Recommend test với reception** trước khi automation.

### Lưu ý #3: Data volatile

Sessions test có thể bị cleanup sau các session manual khác. Nếu ngày test không có booked slots, chuyển sang `Next` date hoặc tạo data mới.

### Lưu ý #4: Privacy

- KHÔNG commit evidence chứa real PII vào public repo
- Test patient names `Mr Floy adhoc`, `Mrs MAJDIYYA FAWZIA DUAL` etc. đã là synthetic — OK
- NHS numbers trong evidence chỉ dùng cho test data, không phải patient thật

---

## Evidence checklist (submit cho agent)

Khi bạn xong, gửi cho agent:
- [ ] Screenshot step 6 (Day view render OK)
- [ ] Screenshot step 9 (sidebar mở sau single click)
- [ ] Screenshot step 14 (sau double click — confirm không mutate)
- [ ] Video ngắn (30s-1min) cho Case 3 nếu chạy được
- [ ] Console log nếu có error/warning lạ
- [ ] Note về alternatives thử được ở Case 3 step 20 (right-click / keyboard / button)

## Pass / Fail report format

Sau khi xong, tóm tắt cho agent:

```
CASE 1: PASS / FAIL — note
CASE 2: PASS / FAIL — note
CASE 3: PASS / FAIL / BLOCKED — note (arrive trigger tìm được ở đâu?)
CASE 4: PASS / FAIL / BLOCKED — note
CASE 5: PASS / FAIL / BLOCKED — note (cross-host khác gì?)

Overall: reception report còn đúng không?
- [ ] Reception đúng: double click vẫn cần (fix chưa work)
- [ ] Fix đã work: single click mở sidebar, arrive trigger ở ...
- [ ] Khác: ...
```
