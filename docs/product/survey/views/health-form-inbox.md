---
id: health-form-inbox
title: Health Form Inbox
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - health-forms-submenu
controls: []
verified_by: []
last_observed: 2026-10-01
relationships: []
---
# Health Form Inbox

## Overview

**URL:** `https://blinx.dev.blinxpaco-np.com/health-forms/responses/`

View để quản lý và theo dõi health form responses từ bệnh nhân.

## Role & Environment

- **Role:** Super Admin GB
- **Site:** General Practice (Demo Site)
- **Auth:** Manual login tại Paco

## UI Structure

### Statistics Panel

| Metric | Description |
|--------|-------------|
| Total Sent to Patient | Tổng số health forms đã gửi |
| Incomplete | Số forms chưa hoàn thành |
| Overdue from Patient | Số forms quá hạn |
| Completed by Patient | Số forms đã hoàn thành |
| Reviewed | Số forms đã được review |

### Status Filters

- All
- Incomplete
- Overdue
- Completed
- Awaiting Review
- Reviewed

### Grid View Modes

1. **View By Patient** — Group theo patient name
2. **View By Health Form** — Group theo form name

### Action Controls

- Expand All / Collapse All
- Search
- Filters button
- Columns configuration

## Columns (Available via Columns Panel)

| Column | Default | Notes |
|--------|---------|-------|
| Response ID | Off (opt-in) | Unique identifier cho mỗi response |
| Patient Name | Off (opt-in) | Tên bệnh nhân |
| Patient Email Address | On | Email bệnh nhân |
| Patient Mobile Number | On | Số điện thoại |
| Patient ID | Off (opt-in) | ID trong hệ thống |
| Health Form Name | Off (opt-in) | Tên form |
| Health Form Type | On | Loại form |
| Quick Form/Health Form | On | Phân biệt quick form vs health form |
| Is External | On | Form external/internal |
| Patient Age | On | Tuổi bệnh nhân |
| Patient Gender | On | Giới tính |
| Organisation Name | On | Tên tổ chức |
| Is Alerted | Off | Cờ alert |

### Missing Column

- **Date Sent** — Không có column này trong Columns panel
  - Backend có `agg--response_actual_date` trong raw data
  - Nhưng không expose thành visible column

## Grid Behavior

- AG Grid với row grouping
- Expand/collapse patient rows để xem individual responses
- Response ID chỉ hiển thị khi expand row
- Auto-refresh mỗi 15 giây

## Row Data (Sample)

```json
{
  "patient_derived_fullname": "Rosie Do",
  "patient_patientguid": "...",
  "count": "9",
  "agg--response_actual_date": "2026-09-28T03:56:03.241Z"
}
```

## Related Views

- `health-forms-designer-v2.md` — Form designer
- `health-form-inbox.md` — (this file)

## Observations

- **Observed:** Health Form Inbox là primary view cho health form responses trong Paco
- **Observed:** Comms Hub (Patient Comms) không có health form response view — campaigns và analytics không expose health form data
- **Observed:** Response ID có thể enable qua Columns panel nhưng không hiển thị ở collapsed state

## Discovery run-20261001-085609 (part 2)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Health Forms > Inbox` mở `/health-forms/responses/` (Health Forms app), tự refresh (`Refreshing in N seconds`); bộ đếm `Total Sent to Patient`/`Incomplete`/`Overdue from Patient`/`Completed by Patient` đều 0; `View By Patient`/`View By Health Form`, `Filters`, `Columns`.

Gap / Open Question:

- Luồng review cần form synthetic đã gửi (data dependency).

## Discovery run-20261001-085609 (part 3)

Role `Super Admin GB`, dev, 2026-10-01. Read-only; claim là `Observed` trừ khi ghi khác.

- `Filters` mở panel `Inbox Filters`: `Date Range` (`All time`), `Health Form`, `Reviewers`.

## Tester notes

- Column panel cần click ngoài để apply changes
- Date Sent field không khả dụng — cần xác minh backend API nếu cần
