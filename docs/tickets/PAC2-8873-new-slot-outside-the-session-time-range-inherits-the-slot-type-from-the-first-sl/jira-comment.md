## PAC2-8873 - Bug Comment

---

**✅ Bug CONFIRMED on Feature Branch pac2-8873**

### Cách reproduce:

**1. Tạo Session** với:
- Default Slot Type: `Test Billable`
- Slot Types Assigned: `Test Billable` + `Test Slot Type - Phlebotomy`
- Time: 10:00 - 11:00 (tạo slots: 10:00, 10:10, 10:20...)

**2. Đổi Slot đầu tiên (10:00)** từ `Test Billable` → `Test Slot Type - Phlebotomy`

**3. Thêm Slot mới (13:00-13:10)** - slot nằm NGOÀI session range

### Kết quả:

| Slot | Expected | Actual |
|------|---------|--------|
| 13:00 | `Test Billable` (default) | `Test Slot Type - Phlebotomy` ❌ |

### Bug:
Khi thêm slot ngoài session range, slot mới tự động lấy Slot Type từ **slot đầu tiên** thay vì **session default**.

### Fix:
Thay vì lấy Slot Type từ slot đầu tiên → dùng session's default Slot Type.

---

**Evidence:** [Video attached]

**Environment:** blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/
