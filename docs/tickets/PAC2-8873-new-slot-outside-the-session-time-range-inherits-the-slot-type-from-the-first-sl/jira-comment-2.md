# PAC2-8873 - Additional Bug Comment (Bug mới)

---

FAIL – PAC2-8873: On the feature branch pac2-8873, after changing first slot's Slot Type and adding a new slot outside range, the first slot auto-reverts to session default.

---

## Chi tiết:

**Bug mới phát hiện:**
- Sau khi đổi slot đầu tiên (10:00) sang Test Slot Type - Phlebotomy
- Thêm slot mới (13:00-13:10) ngoài range
- Slot 10:00 TỰ ĐỘNG revert về Test Billable (session default)

**Expected:** Slot 10:00 giữ nguyên Test Slot Type - Phlebotomy
**Actual:** Slot 10:00 tự revert về Test Billable

---

## Cách reproduce:
1. Tạo session với 2 slot types: Test Billable (default) + Test Slot Type - Phlebotomy
2. Đổi slot 10:00 → Test Slot Type - Phlebotomy
3. Thêm slot 13:00-13:10 (ngoài range)
4. Check lại slot 10:00 → Đã tự revert về Test Billable

---

## Comment Jira ngắn:
```
FAIL – PAC2-8873: On the feature branch pac2-8873, after changing first slot's Slot Type and adding a new slot outside range, the first slot auto-reverts to session default.
```
