# PAC2-8873 - Hướng Dẫn Chi Tiết (Cơ Bản Nhất)

## Điều Kiện Tiên Quyết
Trước khi test bug, cần tạo 2 thứ:
1. **Slot Types** (loại slot) 
2. **Session** (phiên làm việc)

---

## PHẦN 1: Tạo Slot Types

### Slot Type là gì?
Là loại appointment, ví dụ:
- "Khám bệnh" 
- "Xét nghiệm máu"
- "Tái khám"

### Cách tạo:

1. **Mở trình duyệt** → vào: `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/`

2. **Login:**
   - Username: `blinx_johnny.bravo`
   - Password: `Blinx!82`

3. **Chọn Org:** General Practice (Demo Site)

4. **Click Configuration** (menu bên trái)

5. **Click Appointment Books** (menu con)

6. **Click Slot Types**

7. **Tạo 2 Slot Types:**
   
   **Slot Type 1:**
   - Click **Add Slot Type**
   - Name: `Test Billable`
   - Click **Save**

   **Slot Type 2:**
   - Click **Add Slot Type**
   - Name: `Test Slot Type - Phlebotomy`
   - Click **Save**

---

## PHẦN 2: Tạo Session Để Test

### Session là gì?
Là lịch làm việc, ví dụ:
- "Lịch khám buổi sáng" (8h-12h)
- "Lịch khám buổi chiều" (13h-17h)

### Cách tạo:

1. **Click Sessions** (menu con của Appointment Books)
   - (Đang ở Configuration → Appointment Books → Sessions)

2. **Click Add Session** (nút ở góc trên/phải)

3. **Điền thông tin THEO THỨ TỰ:**

```
┌─────────────────────────────────────────────┐
│  Add Session                                │
├─────────────────────────────────────────────┤
│                                             │
│  Session Name: [PAC2-8873 Test          ]  │
│                                             │
│  Duration: [10 minutes ▼                 ]  │
│                                             │
│  Default Slot Type: [Test Billable ▼     ]  │
│                                             │
│  Slot Types Assigned:                       │
│    ☑ Test Billable                         │
│    ☑ Test Slot Type - Phlebotomy           │
│                                             │
│  Frequency: [Daily ▼] ← CHỌN TRƯỚC       │
│                                             │
│  (SAU KHI CHỌN DAILY, MỚI HIỆN:)         │
│  Start Time: [10:00] ← ĐIỀN SAU           │
│  End Time: [11:00]                         │
│                                             │
│  [Cancel]              [Save]              │
└─────────────────────────────────────────────┘
```

4. **Click Save**

**THỨ TỰ QUAN TRỌNG:**
1. Điền Name, Duration, Default Slot Type, Slot Types
2. **Chọn Frequency = Daily** (hoặc Weekly + chọn ngày)
3. **SAU ĐÓ** mới điền Start/End Time

**Kết quả:** Tạo được session với 6 slots:
- 10:00
- 10:10
- 10:20
- 10:30
- 10:40
- 10:50

---

## PHẦN 3: Reproduce Bug

### Bug là gì?
- Mỗi slot có một "Slot Type" (loại)
- Bug: Khi thêm slot mới NGOÀI giờ làm việc (ngoài 10:00-11:00), slot mới bị SAI Slot Type

### Cách reproduce:

**Bước 3.1: Mở Session Editor**
1. Ở grid Sessions, tìm row `PAC2-8873 Test`
2. Double-click vào row đó
3. Một cửa sổ (modal) sẽ mở ra → **Session Editor**

**Bước 3.2: Đổi Slot Type của slot ĐẦU TIÊN**

Trong Session Editor, bạn sẽ thấy danh sách slots:

```
┌─────────────────────────────────────────────┐
│  Session Editor: PAC2-8873 Test             │
├─────────────────────────────────────────────┤
│                                             │
│  Slots:                                     │
│  ┌───────────────────────────────────────┐  │
│  │ □ 10:00  │ Test Billable ▼           │  │
│  │ □ 10:10  │ Test Billable             │  │
│  │ □ 10:20  │ Test Billable             │  │
│  │ □ 10:30  │ Test Billable             │  │
│  │ □ 10:40  │ Test Billable             │  │
│  │ □ 10:50  │ Test Billable             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [+ Add Slot]                               │
│                                             │
│  [Cancel]              [Save]               │
└─────────────────────────────────────────────┘
```

3. Click vào slot **10:00** (slot đầu tiên)
4. Thay đổi Slot Type dropdown từ `Test Billable` → `Test Slot Type - Phlebotomy`

**Bước 3.3: Thêm Slot Mới NGOÀI Range**

1. Click **+ Add Slot**
2. Điền thời gian: **13:00 - 13:10**
   - (ĐÂY LÀ THỜI GIAN NGOÀI 10:00-11:00!)

```
┌─────────────────────────────────────────────┐
│  Add Slot                                   │
├─────────────────────────────────────────────┤
│                                             │
│  Start Time: [13:00]                        │
│  End Time:   [13:10]                        │
│                                             │
│  [Cancel]              [Add]               │
└─────────────────────────────────────────────┘
```

3. Click **Add**

**Bước 3.4: KIỂM TRA BUG!**

Sau khi thêm, kiểm tra Slot Type của slot mới (13:00):

```
┌─────────────────────────────────────────────┐
│  Session Editor: PAC2-8873 Test             │
├─────────────────────────────────────────────┤
│                                             │
│  Slots:                                     │
│  ┌───────────────────────────────────────┐  │
│  │ □ 10:00  │ Test Slot Type - Phleb... │ ← (đã đổi)    │
│  │ □ 10:10  │ Test Billable             │  │
│  │ □ 10:20  │ Test Billable             │  │
│  │ □ 10:30  │ Test Billable             │  │
│  │ □ 10:40  │ Test Billable             │  │
│  │ □ 10:50  │ Test Billable             │  │
│  │ □ 13:00  │ ❌ Test Slot Type - Phleb │ ← BUG!         │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Cancel]              [Save]               │
└─────────────────────────────────────────────┘
```

**Kết quả:**
- ❌ **BUG:** Slot 13:00 hiện `Test Slot Type - Phlebotomy` (từ slot 10:00)
- ✅ **EXPECTED:** Slot 13:00 nên hiện `Test Billable` (session default)

---

## Tóm Tắt Bằng Hình

```
THỰC TẾ (BUG):
┌─────────┬───────────────────────┬──────────────┐
│ Session │ Default: Test Billable│ ←─────── Nên dùng cái này
├─────────┼───────────────────────┼──────────────┤
│ Slot    │ Slot Type             │ ←───────────┐
│ 10:00   │ Test Slot Type - Phleb│ Đã đổi     │
│ 13:00   │ Test Slot Type - Phleb│ ← BUG! ─────┘ (copy từ 10:00)
└─────────┴───────────────────────┴──────────────┘

ĐÚNG PHẢI LÀ:
┌─────────┬───────────────────────┐
│ Slot    │ Slot Type             │
│ 10:00   │ Test Slot Type - Phleb│ (đã đổi)
│ 13:00   │ Test Billable        │ ← (session default)
└─────────┴───────────────────────┘
```

---

## Screenshot Cần Chụp

1. **Screenshot 1:** Session Editor sau khi đổi slot 10:00 sang `Test Slot Type - Phlebotomy`
2. **Screenshot 2:** Slot 13:00 hiện SAI `Test Slot Type - Phlebotomy` (BUG)
3. **Screenshot 3:** Session settings showing default `Test Billable`

---

## Các Bước Nhanh (Nếu Đã Có Data)

Nếu đã có sẵn session với 2 slot types:
1. Mở session đó (double-click)
2. Đổi slot đầu tiên sang slot type khác
3. Thêm slot mới: 13:00-13:10
4. Check slot mới → BUG nếu show slot type của slot đầu tiên
