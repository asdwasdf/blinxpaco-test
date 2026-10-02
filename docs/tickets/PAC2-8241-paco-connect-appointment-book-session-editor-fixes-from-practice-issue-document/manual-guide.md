# Manual Guide: PAC2-8241

**Input Revision:** 1
**Environment:** dev — `https://blinx.dev.blinxpaco-np.com` (DEV main)
**Role:** `Super Admin GB`
**Cases:** TC-002, TC-003, TC-001, TC-007 (TC-005/006 Blocked — test data)
**Nguồn:** `test-cases.md`, `automation.md` (manual r1), locator xác minh khi chạy CLI 2026-10-02
**Updated:** 2026-10-02

Thứ tự bắt buộc: **Setup → TC-002 → TC-003 → TC-001 → TC-007 → Cleanup** (TC-007 làm revert slot type nên để cuối).

## 0. Chuẩn bị

1. Login DEV `/paco/dashboard`. Nếu hiện modal `Set your status` → chọn `Admin`.
2. Kiểm tra role `Super Admin GB`.
3. Mở DevTools (F12) → tab **Network**, filter `update` để xem status code (200/400/500).

## 1. Setup — tạo session QA-AUTO

| # | Thao tác | Cần thấy / Lưu ý |
|---|---|---|
| 1.1 | Sidebar `Appointment Book` → `Appointment Settings` (`/paco-connect/configuration`) | Document có thể báo 404 nhưng trang vẫn render. **Chờ `Loading sessions` biến mất** (~30–40s) |
| 1.2 | Bấm nút tròn speed-dial → `Add` (+) | Drawer `Add Session` mở |
| 1.3 | `Session Name`: `QA-AUTO-PAC2-8241-<HHMM>` | Bắt buộc tiền tố `QA-AUTO` |
| 1.4 | Mở section `Frequency` → `Hours (From)` `08:00`, `Hours (To)` `16:00`, ngày = **hôm nay** | Không chọn được ngày quá khứ. Click tiêu đề drawer để đóng picker |
| 1.5 | `Assigned Slot Types`: tick `Dermatology Clinic`, chờ ~1s, tick `Test Billable` | Click nhanh → option bị render lại, trượt |
| 1.6 | `Assigned Appointment Book`: `111 PC24` | Spinner cạnh nhãn luôn quay — chỉ là icon, cứ click dropdown |
| 1.7 | `Location 1`: `Temi PCN` | Không cần staff (sẽ `No Match` do `Required Attributes`) |
| 1.8 | Bấm nút lưu cuối drawer | Request tạo session 2xx; grid có `QA-AUTO-PAC2-8241-… (Template — 2 sessions)` |
| 1.9 | `Appointment Book` → Day hôm nay → bấm header `Session Name QA-AUTO-…` | **Pass:** 48 slot 08:00–16:00, 10 phút, `Dermatology Clinic` |

### Mở slot editor (dùng cho mọi case)

1. Mở rộng header session QA-AUTO.
2. **Chuột phải** vào một slot → `Edit Session`.
3. URL có `?preview=true`; modal có `Select All (N available)`, `Actions`, `Close`, footer `Session ends at: 16:00` + `Save`.
4. **Chờ 5–8s** cho slot list tải đủ.
5. Nếu vừa mở đã có `Undo` → còn draft cũ, bấm `Undo` trước.

## 2. TC-002 — Bulk đổi slot type (manual r1: Pass)

| Bước | Thao tác | Pass khi |
|---|---|---|
| B1 | Mở editor → tick `Select All` → `Actions` → `SLOT TYPE` chọn `Test Billable` → `Save` **trong panel** | 48 slot hiện `Test Billable \| 10 min`, footer có `Undo` |
| B2 | `Save` **footer modal** | Network `slots/update` **200**; modal đóng; toast `Session updated successfully` (biến mất nhanh); dashboard `Test Billable` |
| B3 | Mở lại editor | 48 `Test Billable`, không còn `Dermatology Clinic` → `Close` |
| B4 | F5 → mở rộng header → mở editor | Vẫn 48 `Test Billable`. Slot nào về `Dermatology Clinic` = **Fail** |

## 3. TC-003 — Single slot + bulk `Bookable` (manual r1: Pass)

| Bước | Thao tác | Pass khi |
|---|---|---|
| B1 | Mở editor → dòng slot **08:00** bấm nút icon `⋯` (nút duy nhất trên dòng) → panel riêng (`Empty Slot Type`, `Delete`, `SLOT TYPE`, `HEALTH FORM(S)`, `Bookable`, `Save`) → bỏ tick `Bookable` → `Save` **của panel** | 08:00 có tag `NON-BOOKABLE` |
| B2 | Dòng **08:10** bấm `⋯` → `Empty Slot Type` | 08:10 hiện `Empty Slot` |
| B3 | `Save` modal (200) → F5 → mở editor | 08:00 `NON-BOOKABLE`, 08:10 `Empty Slot` → `Close` |
| B4 | Editor → `Select All` → `Actions` → đảm bảo `Bookable` **tắt** (mặc định unchecked khi selection mixed: tick rồi bỏ tick) → `Save` panel → `Save` modal (200) → F5 | Mọi slot (trừ Empty) `NON-BOOKABLE` sau reload |
| B5 | Editor → `Select All` → `Actions` → tick `Bookable` → `Save` panel → `Save` modal (200) → F5 → mở editor | 0 `NON-BOOKABLE`; 47 `Test Billable` + 1 `Empty Slot` |

Ghi chú: counter `Available` không đổi vì session ở cột `Not Assigned` → bước counter **không quan sát được**, ghi note, không tính Fail.

## 4. TC-001 — Slot ngoài session end (manual r1: Fail)

| Bước | Thao tác | Expected (tony.do 2026-09-22) | Thực tế DEV r1 |
|---|---|---|---|
| B1 | Mở editor, cuộn xuống cuối | Slot cuối kết thúc 16:00; `Session ends at: 16:00` | Đúng |
| B2 | Trên cột lịch trong modal: nhấn giữ chuột ở vạch **16:00**, kéo xuống **16:10**, thả | Toast `Error`: *Slots must sit inside the session (08:00 to 16:00). Change the session times first.*; không tạo slot | **Fail** — không toast; tạo pending slot 16:00–16:15; footer `Session ends at: 16:15` |
| B3 | Nếu `Save` bấm được → bấm, xem Network `appointment-slots/update` | Thông báo lỗi rõ | **Fail** — **500**, UI im lặng, modal vẫn mở |
| B4 | `Undo` → `Close` → F5 → mở editor | Vẫn 48 slot, end 16:00 | Pass (server không lưu). Có thể thấy draft 16:xx cũ hiện lại → `Undo` |

Diagnostic: lặp B2–B4 với (a) kéo 16:20→16:40, (b) trang vừa F5. Cả 3 lần giống nhau → **Fail**.

## 5. TC-007 — Extend `Time Range` (manual r1: Fail)

| Bước | Thao tác | Expected (tony.do 2026-09-22; Sean 2026-09-20) | Thực tế DEV r1 |
|---|---|---|---|
| B1 | Trên **header** session QA-AUTO bấm **icon bút chì** (nút không có chữ; **không** chuột phải slot) → drawer `Edit Session` → mở `Time Range` | Drawer có `Hours (From)`/`Hours (To)` | Đúng (session có booking có thể không có bút chì) |
| B2 | `Hours (To)`: xoá, gõ `17:00`, **Tab** → lưu **một lần**; xem Network `sessions/update` | 200 + toast `Success — Session updated successfully.`; header **ngay lập tức** `08:00 - 17:00`; thêm 6 slot 16:00–17:00 (54); slot cũ giữ 47 `Test Billable` + 1 `Empty Slot` | **Fail** — 200 + toast, header ~5s sau mới đổi; **không slot mới** (48); **mọi slot revert `Dermatology Clinic`**, Empty mất |
| B3 | F5 | Giữ như B2 | Giữ trạng thái lỗi |

Biến thể: gõ `17:30` / `18:00` → **400** `FST_ERR_VALIDATION`, UI chỉ `…went wrong!` (lỗi thứ hai: message không rõ).
Control: chỉ đổi `Session Name` → 200, slot không đổi (lỗi nằm ở đổi giờ).

## 6. Cleanup

| # | Thao tác | Pass khi |
|---|---|---|
| 1 | `Configuration`, chờ hết `Loading sessions` | |
| 2 | `Search Session...`: `QA-AUTO-PAC2-8241` | Thấy dòng session test |
| 3 | Cột `Actions` (ghim bên phải) → bấm icon không chữ | Menu `Edit`, `View Audit`, `Archive`, `Clone`, `Delete`, `Cancel Session` |
| 4 | `Delete` | Popup `Are you sure? This action cannot be undone…` |
| 5 | Tick **ô vuông** `I understand this is permanent` (click chữ không tick được) | Ô được tick |
| 6 | `Continue` | Network `sessions/deleteSessionById` **200** |
| 7 | **F5** (grid không tự refresh) → search lại | Không còn dòng QA-AUTO; `Appointment Book` hôm nay không còn session |

## 7. Ghi kết quả

| Case | Kỳ vọng hiện tại | Evidence cần có |
|---|---|---|
| TC-002 | Pass | Ảnh editor sau F5 (48 `Test Billable`) |
| TC-003 | Pass | Ảnh sau F5 (08:00 `NON-BOOKABLE`, 08:10 `Empty`) + ảnh cuối (0 non-bookable) |
| TC-001 | Fail | Ảnh pending 16:00–16:15 không toast; Network 500 |
| TC-007 | Fail | Ảnh header trước/sau, 48 slot toàn `Dermatology Clinic`; Network 200 + 400 |

Result chỉ dùng `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`. Fail/pass không ổn định giữa các lần → `Inconclusive`.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
