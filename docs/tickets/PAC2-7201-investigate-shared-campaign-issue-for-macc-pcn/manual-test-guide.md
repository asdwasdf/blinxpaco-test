# Hướng dẫn thực hiện thủ công: PAC2-7201

**Mục đích:** Hướng dẫn từng bước để tự tay chạy lại PAC2-7201-TC-001, TC-002, TC-004 (dựa trên `test-cases.md`). TC-003/005/006 đang `Blocked` (thiếu tài khoản/quyền) nên chỉ ghi chú điều kiện cần có, không hướng dẫn chi tiết.

**Trước khi bắt đầu:**
- Môi trường: `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager` (dev)
- Cần đã đăng nhập sẵn (manual auth), tài khoản có home organisation = `General Practice (Blinx Demo Site) (YGMQJ)` và có quyền xem thêm `Redmoor Liverpool (Non-OBE)`
- TC-001, TC-004 là **mutation Persistent** (tạo/sửa dữ liệu thật trên dev) — đã có approval từ phiên làm việc trước; nếu chạy lại vào thời điểm khác, nên xin xác nhận lại
- Đặt tên campaign có tiền tố `PAC2-7201-TC-00X-` kèm timestamp để dễ nhận diện và dọn dẹp sau này

---

## TC-001: Kiểm tra creator org (Blinx Demo Site) giữ quyền Edit/Delete sau khi tạo + share

**Mục tiêu:** Xác nhận tổ chức tạo ra campaign vẫn tự sửa/xoá được nó sau khi share sang org khác.

### Bước 1 — Vào trang Campaign Manager
1. Mở trình duyệt, vào `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/campaign-manager`
2. Chờ trang load xong (biến mất chữ "Gathering data...")
3. Kiểm tra góc trên phải: `Your Home Organisation` phải là `General Practice (Blinx Demo Site) (YGMQJ)`. Nếu không đúng, đây không phải tài khoản phù hợp cho TC-001 — dừng lại.

### Bước 2 — Tạo campaign mới
4. Click nút **`Create Campaign`** (màu xanh ngọc, góc trên phải)
5. Nếu hiện dialog **"Your current Organisation"**, xác nhận ghi đúng `General Practice (Blinx Demo Site)`, bấm **OK**
6. Ở bước **Campaign Setup**:
   - **Campaign Name**: gõ `PAC2-7201-TC-001-<ngày giờ hiện tại>` (ví dụ `PAC2-7201-TC-001-20260914-1500`)
   - **Patient Facing Campaign Display Name**: gõ mô tả bất kỳ, ví dụ `PAC2-7201 TC-001 test`
   - **How would you like to send this campaign?**: chọn **SMS**
   - **Campaign Type(s)**: mở dropdown, **bỏ tick `Scheduled`** (nếu đang tick sẵn), **chỉ giữ tick `Quick Send`**
   - **Select Booking Links**: chọn 1 link bất kỳ trong danh sách (ví dụ `PCN Occupational Therapist (PACO-CONNECT - Timed)`)
   - Bấm **Next**

### Bước 3 — Điền nội dung SMS
7. Ở bước **SMS Content**, mở dropdown **Pick SMS template**, chọn 1 template có sẵn (ví dụ `(Mapped) Flu Vaccination Drive (PACO SMS)`) — nội dung sẽ tự điền
8. Bấm **Next**
9. Nếu hiện dialog **"Please Note"** (cảnh báo độ dài SMS), bấm **Continue** — đây chỉ là cảnh báo thông tin, không phải gửi thật

### Bước 4 — Share sang Redmoor Liverpool
10. Ở bước **Campaign Review**, chọn tab **`Quick Send/PI Sharing`**
11. Trong danh sách org, click mũi tên `>` bên cạnh **`General Practice (Blinx Demo Site)`** để mở rộng
12. Tick chọn **`Redmoor Liverpool (Non-OBE)`**
13. Kiểm tra lại panel bên phải ghi rõ: *"Organisations that this Campaign is shared with will be able to view it and its assets but will NOT be able to edit"* — đây là hành vi **kỳ vọng đúng** để đối chiếu ở TC-002
14. Bấm nút **`Create`** (góc dưới phải)
15. Dialog **"Success"** hiện ra — bấm **Back to Campaigns**

### Bước 5 — Xác nhận quyền Edit/Delete tại org tạo
16. Ở ô **Search campaigns**, gõ tên campaign vừa tạo (ví dụ `PAC2-7201-TC-001`), Enter
17. Mở rộng nhóm **Shared Campaigns**
18. **Kết quả mong đợi:** dòng campaign có đủ 3 icon: `Performance`, ✏️ (Edit), 🗑️ (Delete)
19. Nếu chỉ thấy `Performance` + 👁️ (View) mà **không có** Edit/Delete → **FAIL**, ghi lại ngay (chụp màn hình) vì đây là bằng chứng ngược lại hoàn toàn với kỳ vọng.

**Ghi kết quả:** Pass nếu bước 18 đúng như mô tả.

---

## TC-002: Kiểm tra shared-to org (Redmoor Liverpool) KHÔNG có quyền Edit/Delete

**Mục tiêu:** Xác nhận org được share vào chỉ xem được, không sửa được — đúng chữ trong sản phẩm đã đọc ở TC-001 bước 13. **Đây là case dự kiến sẽ FAIL** dựa trên bằng chứng đã quan sát trước đó — mục tiêu là xác nhận lại bằng dữ liệu mới.

**Điều kiện:** Đã có campaign từ TC-001 (hoặc bất kỳ campaign nào share từ Blinx Demo Site sang Redmoor).

### Bước 1 — Chuyển sang xem dữ liệu Redmoor Liverpool
1. Ở `Campaign Manager`, click vào dropdown **`Viewing data for`** (góc trên phải, cạnh chuông thông báo)
2. Nếu panel chỉ hiện `Select All (2)` mà chưa thấy tên org — đóng dropdown và mở lại 1 lần nữa (UI đôi khi cần mở lại để render đủ)
3. Click mũi tên `>` bên trái **`General Practice (Blinx Demo Site)`** để mở rộng org con
4. Tick chọn **`Redmoor Liverpool (Non-OBE)`**
5. Bỏ tick **`General Practice (Blinx Demo Site)`** (chỉ để lại đúng 1 org được chọn: Redmoor Liverpool)
6. Bấm nút **`Apply`**
7. Kiểm tra: chữ ở dropdown góc trên phải đổi thành `Redmoor Liverpool (Non-OBE) (M850...)`

### Bước 2 — Tìm lại campaign và kiểm tra quyền
8. Gõ lại tên campaign vào ô **Search campaigns**, Enter
9. Mở rộng nhóm **Shared Campaigns**
10. Quan sát icon hành động trên dòng campaign đó:
    - **Kết quả đúng theo thiết kế:** chỉ có `Performance` + 👁️ View — không Edit, không Delete
    - **Kết quả đã quan sát trước đó (nghi vấn lỗi):** có đủ `Performance` + ✏️ Edit + 🗑️ Delete

**Ghi kết quả:** Nếu thấy Edit/Delete xuất hiện ở org KHÔNG phải creator → **FAIL**, đây chính là defect. Chụp màn hình làm evidence (nhớ không có dữ liệu bệnh nhân/nhạy cảm trong ảnh).

---

## TC-004: Kiểm tra sau khi Edit, campaign vẫn còn trong Shared dropdown và vẫn quản lý được

**Điều kiện:** Đã có campaign từ TC-001, đang đứng ở `Viewing data for = Blinx Demo Site` (org tạo).

### Bước 1 — Mở và sửa campaign
1. Đổi `Viewing data for` về lại **`General Practice (Blinx Demo Site)`** (làm ngược lại bước 1-6 của TC-002)
2. Tìm campaign bằng ô Search
3. Click icon ✏️ **Edit**
4. Nếu hiện dialog **"Warning"** ("When there is only 1 action or Booking is not the last action timings can not be used") — đây chỉ là cảnh báo kỹ thuật không liên quan, bấm **OK** để đóng
5. Trong dialog **Campaign Details**, sửa ô **Campaign Name**, thêm hậu tố `-edited` vào cuối
6. Bấm **Save**

### Bước 2 — Xác nhận lưu thành công và vẫn quản lý được
7. Dialog **"Success — The campaign has been updated successfully"** hiện ra → bấm **Close**
8. Tìm lại campaign (search theo tên mới có `-edited`)
9. **Kết quả mong đợi:**
   - Tên mới hiển thị đúng
   - Campaign vẫn nằm trong nhóm **Shared Campaigns** (chưa bị rớt khỏi danh sách share)
   - Vẫn có đủ icon `Performance` + Edit + Delete tại org tạo (Blinx Demo Site)

**Ghi kết quả:** Pass nếu cả 3 ý ở bước 9 đúng.

---

## Dọn dẹp sau khi test (Cleanup)

Theo `data-safety.md`, campaign test tạo ra là mutation `Persistent` — **không tự ý bấm Delete** nếu chưa xin phép riêng (Delete là destructive action).

Cách dọn dẹp ưu tiên: mở lại campaign bằng Edit, tìm nút **`Pause`** ở góc trên phải dialog `Campaign Details`, bấm để chuyển trạng thái. **Lưu ý:** trong lần chạy trước, nút `Pause` không phản hồi với loại campaign `Quick Send` — nếu gặp lại tình huống này, không cần cố xử lý tiếp, chỉ cần **ghi lại tên đầy đủ campaign còn sót lại** vào phần "Cleanup chưa hoàn tất" của `status.md`/`exploration.md` để người khác biết đó là dữ liệu test, không phải dữ liệu thật.

---

## TC-003 / TC-005 / TC-006 — Chưa thể hướng dẫn chi tiết (Blocked)

| Case | Cần gì trước khi test được |
|---|---|
| TC-003 | Tài khoản có **home organisation = Redmoor Liverpool** (để tự tạo campaign tại đó, thay vì chỉ xem) |
| TC-005 | Tài khoản có quyền vào org **Macclesfield PCN**, và xác nhận test trên production hay có bản dev tương đương |
| TC-006 | Giống TC-005, cộng thêm cần định nghĩa rõ trạng thái `Failed` nghĩa là gì (đang Disputed) |

Khi có đủ điều kiện, quay lại `test-cases.md` để lấy step chi tiết và viết thêm hướng dẫn tương tự các case trên.

## Tester notes

[Khu vực dành cho ghi chú của bạn khi thực hiện — phần này không bị ghi đè khi tài liệu được cập nhật]
