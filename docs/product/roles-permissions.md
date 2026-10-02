# Roles & Permissions

Role capability matrix cho Paco.

## Format

Mỗi role entry:
- Role name
- Classification: Confirmed/Observed/Inferred
- Capabilities list
- Source và provenance
- Last verified timestamp

## Role selection rules

- `Admin` hoặc `Blinx Deployment` đều là role hợp lệ cho workflow Paco QA, gồm `LOCATE`, `EXPLORE`, manual execution và product discovery; dùng role nào đang đăng nhập và đủ quyền cho scope.
- Luôn ghi đúng role thực tế trong artifact/evidence; không map role này thành role kia.
- Quyền truy cập cụ thể của role vẫn phải được quan sát trên đúng environment; role hợp lệ không tự chứng minh capability.
- Đổi role cần đăng nhập/chuyển role thủ công và checkpoint riêng theo workflow hiện hành.

## Roles

### Blinx Deployment

**Role:** `Blinx Deployment`  
**Classification:** Confirmed  
**Capabilities:**
- Có thể được tester chọn làm execution role cho Paco QA.
- Capability theo feature chưa được xác nhận; phải verify trong từng run.

**Source:** Tester confirmation, 2026-10-01  
**Last Verified:** 2026-10-01

### Example Format

**Role:** `Admin`
**Classification:** Observed
**Capabilities:**
- Can access dashboard
- Can view reports

**Source:** Observation, dev environment, 2026-09-09
**Last Verified:** 2026-09-09
