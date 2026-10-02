# Video timeline 1s — PASSED QA evidence

**Source:** `127720-Screen Recording 2026-09-22 at 4.17.37 PM.mov` (5:08, 1912x1010)
**Sampling:** 1 fps, timestamp overlay → `frames-1s/f-NNNN.jpg` (308 frames), sheets 2x3 → `sheets-1s/s-NNN.jpg` (52 sheets)
**Reviewed:** 2026-10-02. Coverage: 00:01:36–00:05:08 đọc đủ từng frame. 00:00:00–00:01:35 đọc lấy mẫu (sheets 1,3,5,7,9,11,14,17 ≈ 50% frame); sheets 2,4,6,8,10,12,13,15,16 chưa đọc.

## Context (Observed)

- URL: `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8241/...` → **feature branch (FB) trên dev host**, không phải dev main. Incognito.
- User/staff header: `Johnny (2255) Bravo`, `Blinx Deployment`, `The Confederation, Hillingdon`. Role không hiển thị.
- Màn: `Appointment Book` → `Day`, ngày `24 September 2026`.
- Session dùng test: `Sean Test 22SEP2026`, staff `Johnny (2255) Bravo`, location `test again`, time range header `08:00 - 17:00`, slot 10 min. Session không có booking (Booked 0) → `Time Range` không bị khóa.

## Timeline

| Time | Action | Observation |
|---|---|---|
| 00:00–00:05 | `Appointment Book` Day `22 September 2026` (quá khứ) | Booked 3, Available 941 |
| 00:12 | Book vào slot quá khứ | Dialog `Are you sure?` "This appointment time is in the past! Are you sure you wish to proceed?" → `Continue` |
| 00:13–00:36 | `Quick Book Appointment` → patient `SEAN TEST QA TESTING` → `Recommended Appointment` | `Hillingdon Extended Access (Nurse V1)` with `Alex Paul`, `Hillingdon Site A`, 22/09/2026 13:20–13:40; confirm SMS tick → `Book Appointment` |
| 00:37–00:41 | Kết quả | Toast `Appointment created successfully.`; slot 13:20 hiện `SEAN TEST QA TESTING`; Booked 3→4, Available 941→940 |
| 00:48–00:53 | Mở appointment panel | Patient/HCP/time đúng, `Booked by: Johnny (2255) Bravo` |
| 01:00–01:05 | `Cancel Session`/cancel appointment, reason `Patient requested cancellation` → `Cancel only` | Toast `Appointment Cancelled` (sau đó chưa thấy re-book + reload trong phần đã đọc) |
| 01:18–01:23 | Chuyển `24 September 2026`, session `Sean Test 22SEP2026` | Header `08:00 - 16:00`, cột 144 slot |
| 01:36–01:41 | `Edit Session` (drawer): `Hours (To)` 04:00 PM → **05:00 PM**, `Save` | `Time Range`, `Slot Duration` editable (session không có booking) — khớp giải thích dev Issue 2 |
| 01:43–01:53 | Sau save | Toast `Success — Session updated successfully.`; header **ngay lần đầu** đổi `08:00 - 17:00`, cột 144→150, Available 938→944, slot mới tới `16:50/17:00` hiển thị → bug FAILED 20/09 ("header đổi nhưng slot không, phải đổi lần 2") **không tái hiện** |
| 02:00–02:04 | Mở menu slot → `Edit Session` | Menu: Set status / Slot manage (`Edit Slot`, `View Audit Log`) / `Edit Session`, `Block Session`, `Remove Session`, `Message Session Patients` |
| 02:05 | Modal `EDIT SESSION` mở (URL `?preview=true`) | `Select All (54 available)`, footer `Session ends at: 17:00`. 54 slot `test by handsome mike 4 Jul 1 | 10 min` |
| 02:08–02:21 | `Select All` → `Actions` → bulk panel | Panel: `Empty Slot Type`, `Delete`, `SLOT TYPE (54 selected)`, `SLOT LENGTH (MINUTES)`, `HEALTH FORM(S)`, `Bookable`, `Save`. Chọn `Dermatology Clinic` |
| 02:22–02:27 | Bulk save trong panel | 54 slot thành `Dermatology Clinic | 10 min` (pending), footer `Undo`, `Save will change 54 slots` |
| 02:28–02:30 | Slot 08:00 → bỏ `Bookable` | Slot 08:00 hiện tag `NON-BOOKABLE` |
| 02:31–02:35 | Slot 08:10 → `Empty Slot Type` | Slot 08:10 thành `Empty Slot` |
| 02:36–02:47 | Slot 08:20 → đổi type `Man demo slot_type` | Slot 08:20 `Man demo slot_type | 10 min` |
| 02:48–02:55 | Scroll tới cuối; chọn 3 slot 16:30/16:40/16:50 | Slot cuối `16:50/17:00`, không có slot sau 17:00 |
| 02:56–03:05 | Bulk 3 slot → `Test Billable` | 3 slot thành `Test Billable | 10 min` |
| 03:06–03:13 | (thao tác kéo/resize slot cuối, Uncertain) | Toast `Error`: **"Slots must sit inside the session (08:00 to 17:00). Change the session times first."** — khớp rule dev đã mô tả |
| 03:14–03:15 | Bulk `Delete` 3 slot Test Billable | Còn 51 available; footer `Session ends at: 16:30` |
| 03:16–03:20 | Thêm/resize slot lại (cách thao tác Uncertain) | Slot 16:30 `5 min`, 16:35, 16:45 → `Session ends at: 16:55`, `Save will change 57 slots`, 54 available |
| 03:21–03:26 | Tiếp tục thử vượt boundary + bấm `Save` | 2 toast Error boundary cùng text; Save loading |
| 03:27–03:29 | Save xong | Toast **"Session updated successfully."**; modal đóng, dashboard hiển thị `Dermatology Clinic` slots; `Available` 944→942; slot count cột 150→148 |
| 03:30–03:51 | Verify trên dashboard (scroll) | 08:00 `DERMATOLOGY CLIN...` sọc (non-bookable, có icon ∅), 08:10 `Empty Slot`, 08:20 `Man demo slot_type`, còn lại `Dermatology Clinic` xanh. Header vẫn `08:00 - 17:00` |
| 03:52–03:55 | Mở `Quick Book Appointment` (kiểm slot type mapping) | Tab `Appt Type* (0)`: "This slot type isn't mapped to any appointment types yet." + `Set up appointment type mapping`; đóng modal |
| 03:59–04:05 | Reopen `Edit Session` | Modal phản ánh đúng state đã lưu: 08:00 NON-BOOKABLE, 08:10 Empty Slot, 08:20 Man demo, footer `Session ends at: 16:55` → **persist OK, không revert** |
| 04:06–04:19 | Select All → bỏ `Bookable`, type `test by handsome mike 4 Jul 1` → Save | Toast success; 54 slot NON-BOOKABLE sọc; Available 942→890; cột 148→96 |
| 04:29–04:31 | Reopen `Edit Session` | Hiển thị 54 slot `test by handsome mike` NON-BOOKABLE → persist OK |
| 04:33–04:46 | Select All → tick `Bookable` → Save | Pending: tag NON-BOOKABLE biến mất |
| 04:47–04:49 | Save xong | Toast success (lúc 04:47 dashboard vẫn còn sọc ~1s, đến 04:48 refresh thành bookable); Available 890→944; cột 96→150 |
| 04:50–04:55 | Dashboard → menu `Configuration` | |
| 04:56–05:00 | `Configuration` loading `Loading sessions` | ~4s |
| 05:01–05:07 | Configuration grid (dark mode) | Cột `Session Name / Assigned Slot / Weekdays / Frequency / Duration / Slot Count / Actions`; mở menu Actions (`Edit`, `View Audit`, `Unarchive`, `Clone`, `Delete`, `Cancel Session`). Border cột `Actions` có hiển thị. **Không search/mở `Sean Test 22SEP2026`** |

## Findings

0. **Confirmed (video):** Extend `Time Range` 16:00→17:00 cập nhật header + slot ngay lần save đầu (01:43–01:53).
1. **Confirmed (video):** Bulk đổi slot type, non-bookable, empty slot, đổi single slot type → `Session updated successfully` và **persist khi reopen Edit Session** (03:59, 04:29). Đây là trọng tâm comment FAILED trước (revert/stale khi reopen) → video cho thấy đã fix.
2. **Confirmed:** Boundary rule hiển thị error rõ ràng, đúng text dev cung cấp.
3. **Observed:** Bookable toggle bulk hoạt động hai chiều; counter `Available` cập nhật đúng (944↔890).
4. **Observed (minor):** 04:47 dashboard còn hiển thị state cũ ~1s sau toast trước khi refresh — không phải bug rõ ràng.
5. **Gap:** Phần đã đọc chưa thấy bước reload (F5) sau cancel/re-book past slot (Issue 1 ngày 22/09). Video là **FB**, không phải DEV main. Không test: reload page (F5) sau save, extend `Time Range`, đổi name/location/staff, session có booking (lock fields), booking/cancel trên past session, Configuration của session vừa sửa.
6. **Gap:** Header session vẫn `08:00 - 17:00` trong khi Edit Session footer `Session ends at: 16:55` (slot cuối bị xóa) — có thể đúng thiết kế (session time ≠ last slot); Open Question.
7. **Conflict:** `8241 DEV Not work.mp4` (2026-10-01, Alexander Paul) cho thấy DEV có thể chưa hoạt động → PASSED trên FB không chứng minh DEV.
