# PAC2-7150 Scenarios

## SC-001: Start session earlier (Edit Session modal)

**Preconditions:** Authenticated as `Super Admin GB` / session holder. Session tồn tại với start time ≥ 09:00.

**Steps:**
1. Open Edit Session cho session đó.
2. Xác nhận giờ phía trên session start được hiển thị dưới dạng **shaded** (vùng có thể thêm slot sớm hơn).
3. Thêm một slot trong shaded hour (ví dụ: session bắt đầu 09:00 → thêm slot 08:30).
4. Prompt xuất hiện: **"Start session at 08:30"**.
5. Chọn "Start session at 08:30" trong prompt → Save.
6. Board hiển thị session bắt đầu lúc 08:30 với slot mới.

**Expected:** Prompt offer "Start session at [time]". Sau save, board cập nhật session start + slot mới.

**Mutation class:** `Persistent` (cập nhật session trên server)

---

## SC-002: Extend both ends and cancel/accept prompt

**Preconditions:** Authenticated. Same session hoặc session khác.

**Steps:**
1. Trong Edit Session, chọn slots thêm vào cả TRƯỚC start VÀ SAU end của session.
2. Đọc prompt — phải đọc **"Run session [start]–[end]"** (range mới đầy đủ).
3. Nhấn **Cancel** → session và slots giữ nguyên không đổi.
4. Lặp lại bước 1-2.
5. Lần này nhấn **Accept** → cả start và end đều được cập nhật.

**Expected:** Cancel giữ nguyên. Accept cập nhật cả start và end.

**Mutation class:** `Persistent`

---

## SC-003: Start earlier from Appointment Book settings panel

**Preconditions:** Authenticated. Appointment Book mở, có session có thể edit từ settings panel.

**Steps:**
1. Mở session từ Appointment Book settings panel → mở slot preview.
2. Thêm slot trước session start → accept prompt.
3. Save.
4. Kiểm tra session start time cập nhật trong settings panel VÀ trên board.
5. (Nếu earlier time trùng session khác) → clash prompt xuất hiện.

**Expected:** Session start cập nhật ở cả settings panel và board. Clash detection hoạt động.

**Mutation class:** `Persistent`
