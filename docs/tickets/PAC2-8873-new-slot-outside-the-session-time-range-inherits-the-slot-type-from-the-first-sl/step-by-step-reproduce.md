# PAC2-8873 - Hướng Dẫn Reproduce Bug Chi Tiết

## Mục Đích
Reproduce bug: New slot outside session time range → inherits Slot Type từ first slot thay vì dùng session default

---

## Bước 0: Truy Cập Môi Trường

1. Mở trình duyệt → truy cập: `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/`
2. Login: `blinx_johnny.bravo` / `Blinx!82`
3. Chọn Organisation: **General Practice (Demo Site)**
4. Chọn Role: **Blinx Deployment**

---

## Bước 1: Tạo Test Data (Slot Types & Session)

### 1.1 Kiểm tra Slot Types
1. Click **Configuration** (sidebar trái)
2. Click **Appointment Books** sub-menu
3. Click **Slot Types**
4. **Verify tồn tại:**
   - ✅ **Test Billable** (đây sẽ là session default)
   - ✅ **Test Slot Type - Phlebotomy** (hoặc slot type khác để change)
   
   Nếu chưa có, tạo mới:
   - Click **Add Slot Type**
   - Name: `Test Billable`
   - Save
   - Click **Add Slot Type** again
   - Name: `Test Slot Type - Phlebotomy`
   - Save

### 1.2 Tạo Session Test
1. Click **Sessions** (trong Appointment Books sub-menu)
2. Click **Add Session** button
3. Điền thông tin:
   - **Session Name:** `PAC2-8873 Test`
   - **Duration:** `10 minutes`
   - **Slot Types Assigned:** Tick chọn cả `Test Billable` VÀ `Test Slot Type - Phlebotomy`
   - **Default Slot Type:** Chọn `Test Billable`
   - **Start Time:** `10:00`
   - **End Time:** `11:00` (tạo 6 slots: 10:00, 10:10, 10:20, 10:30, 10:40, 10:50)
4. Click **Save**

---

## Bước 2: Reproduce Bug

### 2.1 Mở Session Editor
1. Ở grid Sessions, tìm row `PAC2-8873 Test` (hoặc session đã có)
2. **Double-click** vào row đó
3. **HOẶC** click vào row đó rồi click **Edit** button (nếu có)
4. Session Editor modal sẽ mở ra

### 2.2 Thay Đổi First Slot Type
1. Trong Session Editor, tìm **slot list** (list các slots: 10:00, 10:10, 10:20...)
2. Tìm **slot đầu tiên** (10:00)
3. Click vào slot đó
4. Tìm **Slot Type dropdown** 
5. Thay đổi từ `Test Billable` → `Test Slot Type - Phlebotomy`
6. **Save** thay đổi (nếu có save button)

### 2.3 Thêm Slot Mới Ngoài Range
1. Trong Session Editor, tìm button **Add Slot** hoặc tương tự
2. Click để thêm slot mới
3. **QUAN TRỌNG:** Đặt thời gian **NGOÀI** session range:
   - Session range hiện tại: 10:00 - 11:00
   - Thời gian slot mới: **13:00 - 13:10** (hoặc bất kỳ giờ nào khác 10:xx)
4. **KHÔNG thay đổi Slot Type** - để mặc định (nếu có default)

### 2.4 Quan Sát Bug
1. Sau khi thêm, slot mới sẽ xuất hiện trong list
2. **Kiểm tra Slot Type của slot mới:**
   - ❌ **BUG:** Slot mới show `Test Slot Type - Phlebotomy` (từ first slot)
   - ✅ **EXPECTED:** Slot mới nên show `Test Billable` (session default)

---

## Kết Quả Mong Đợi

| Thành phần | Giá Trị |
|------------|---------|
| Session Default Slot Type | `Test Billable` |
| First Slot (10:00) Slot Type | `Test Slot Type - Phlebotomy` (đã change) |
| **New Slot (13:00) Slot Type** | |
| Expected (Bug chưa fix) | `Test Billable` ✅ |
| Actual (Bug) | `Test Slot Type - Phlebotomy` ❌ |

---

## Screenshot Cần Chụp

1. **Screenshot 1:** Session Editor với first slot đã đổi Slot Type sang `Test Slot Type - Phlebotomy`
2. **Screenshot 2:** New slot (13:00) hiển thị **SAI** Slot Type `Test Slot Type - Phlebotomy` (BUG)
3. **Screenshot 3:** Session default Slot Type setting (để prove bug không phải do session default sai)

---

## Dùng Session Có Sẵn (Không Cần Tạo Mới)

Nếu không muốn tạo session mới, dùng session có sẵn:

### Session: **ABCDE 7081**
- Đã có nhiều slot types: `test by handsome mike 4 Jul 1`, `Test Billable`, `Test Slot Type - Phlebotomy`, `PC24 GP Test`, `PC24 Nurse Test`
- Grid position: Scroll đến giữa grid, tìm row có tên `ABCDE 7081`
- Double-click để mở Session Editor

### Session: **APTEST1**
- Slot types: `Sean Test 7366`, `[Bootcamp] Phlebotomy`, `[Bootcamp] Coil Fitting`, `[Bootcamp] Spirometry`

---

## Navigation Path Đầy Đủ

```
Configuration (sidebar)
└── Appointment Books
    ├── Slot Types (verify/create slot types)
    └── Sessions (tạo session test hoặc chọn session có sẵn)
```

---

## Tips

1. **Double-click** để mở Session Editor (workaround cho grid phức tạp)
2. Nếu double-click không work, thử:
   - Single click để select row
   - Press **Enter** key
   - Hoặc tìm **Edit/Preview button** trong toolbar
3. Nếu không thấy button Add Slot trong Editor:
   - Tìm trong tab khác (General, Slots, Advanced...)
   - Hoặc slot được add bằng cách click vào timeline
