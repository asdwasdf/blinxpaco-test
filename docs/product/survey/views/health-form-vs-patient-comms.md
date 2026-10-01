# Health Form Inbox vs Patient Comms — So sánh

## Tổng quan

Survey read-only để so sánh form giữa Patient Comms và Health Form Inbox, xác định Response ID và Date Sent trong mỗi hệ thống.

- **Environment:** dev (`blinx.dev.blinxpaco-np.com`)
- **Role:** Super Admin GB / General Practice (Demo Site)
- **Date:** 2026-10-01

---

## Health Form Inbox

### Vị trí
- **URL:** `https://blinx.dev.blinxpaco-np.com/health-forms/responses/`
- **Entry:** Health Forms menu → Inbox

### Chức năng
Quản lý và theo dõi health form responses từ bệnh nhân.

### Statistics Panel
| Metric | Description |
|--------|-------------|
| Total Sent to Patient | Tổng forms đã gửi |
| Incomplete | Forms chưa hoàn thành |
| Overdue from Patient | Forms quá hạn |
| Completed by Patient | Forms đã hoàn thành |
| Reviewed | Forms đã review |

### Grid Columns (Available)

| Column | Default | Trạng thái |
|--------|---------|------------|
| Response ID | Off (opt-in) | ✅ Có — enable qua Columns panel |
| Patient Name | Off | ✅ Có |
| Patient Email Address | On | ✅ Mặc định bật |
| Patient Mobile Number | On | ✅ Mặc định bật |
| Patient ID | Off | ✅ Có |
| Health Form Name | Off | ✅ Có |
| Health Form Type | On | ✅ Mặc định bật |
| Quick Form/Health Form | On | ✅ Mặc định bật |
| Is External | On | ✅ Mặc định bật |
| Patient Age | On | ✅ Mặc định bật |
| Patient Gender | On | ✅ Mặc định bật |
| Organisation Name | On | ✅ Mặc định bật |
| Is Alerted | Off | ✅ Có |

### Missing Column
- **Date Sent** — ❌ **Không có** column này trong Columns panel
  - Backend có `agg--response_actual_date` trong raw data
  - Không expose thành visible column

### View Modes
- **View By Patient** — Group theo patient name
- **View By Health Form** — Group theo form name

### Grid Behavior
- AG Grid với row grouping
- Expand/collapse patient rows để xem individual responses
- Response ID chỉ hiển thị khi expand row
- Auto-refresh mỗi 15 giây

---

## Patient Comms / Comms Hub

### Vị trí
- **URL:** `https://nhs-comms-hub-dev.blinxhealthcare.com/commshub/`
- **Auth:** Separate login từ Comms Hub domain

### Sections

| Section | URL | Chức năng |
|---------|-----|------------|
| Template Manager | `/commshub/commshub/template-builder` | Quản lý message templates |
| Patient Manager | `/commshub/patient-management` | Lists (tags) và Patients grid |
| Campaign Manager | `/commshub/campaign-manager` | Tạo và quản lý campaigns |
| Analytics | `/commshub/analytics` | Campaign conversion metrics |
| Configuration | `/commshub/configuration` | Cấu hình |

### Patient Manager
- **Lists tab:** Danh sách tags/lists
  - Tags: Health Check Invites TH, Health Form Complete, HF Stop Send, Diabetes - QOF, EILEEN, etc.
- **Patients tab:** Grid bệnh nhân với search
- Date range filter: 02/09/2026 - 01/10/2026
- **Không có health form response view trực tiếp**

### Campaign Manager
- Tạo và quản lý campaigns
- Campaign Outbox
- Filter: Campaign Statuses, Campaign Types
- **Không có health form response view**

### Analytics
- Campaign conversion metrics
- Date range filter
- **Không có health form analytics**

---

## Health Form Designer

### Designer V2

**URL:** `/paco/health-forms`

#### Template List
Columns: `Archived`, `Editable`, `Name`, `Type`, `Created date`, `Created by`, `Updated date`, `Updated by`, `Archived date`, `Actions`

#### Form Editor
**URL:** `/health-forms/builder/editor/`

**Settings Panel:**
- Health Form Type (dropdown)
- Diary Frequency (Optional)
- Select Default Reviewers (combobox slot types clinician)
- View Tag List
- Add Total Health Form Score to Patient Record (checkbox + SNOMED Code combobox)
- Default Booking Settings
  - Use a Timed Session? (checkbox)
  - Slot Types
- Save to Record Without Review (checkbox)

**Toolbox Fields:**
| Category | Fields |
|----------|--------|
| Medical | Blood Pressure, Multi Blood Pressure, BMI |
| Layout | Header Text, Paragraph, Line Break, Two Column Row, Three Columns Row |
| Input | Text Input, Multi-line Input, Number Input Unit |
| Choice | Dropdown, Multiple Choice, Checkboxes, Range |
| Specialized | Date, Email, Phone Number |
| Media | File Upload, Image, Video |
| Interactive | Rating, Signature, Website |
| Integration | Dynamic Consultation |
| Branding | Organisation Logo, Organisation Header, Organisation Footer |

**Actions:** Preview Form, Save Form

### Designer V1

**URL:** `/health-forms/builder/`

Columns: `Health Form type`, `Health Form Reviewer`, `Health Form Name`, `Created Date`, `Created By`, `Created By Organisation`, `Shared To Organisation(s)`, `Updated Date`, `Updated By`, `Archived`, `Archived Date`, `Editable`, `Actions`

Type hiển thị: "Scheduled One-Off"

---

## So sánh chính

### Response ID
| Hệ thống | Có Response ID? | Ghi chú |
|----------|----------------|---------|
| Health Form Inbox | ✅ Có (opt-in) | Enable qua Columns panel |
| Comms Hub | ❌ Không | Không có health form view |

### Date Sent
| Hệ thống | Có Date Sent? | Ghi chú |
|----------|---------------|---------|
| Health Form Inbox | ❌ Không | Backend có data nhưng không expose |
| Comms Hub | ❌ Không | Không có health form view |

### Khả năng quản lý Health Forms
| Hệ thống | Health Form | Notes |
|----------|-----------|-------|
| Health Form Inbox | ✅ Có | Primary view cho responses |
| Comms Hub | ❌ Không | Chỉ có campaigns/templates |

---

## Observations

- **Observed:** Health Form Inbox là primary view cho health form responses trong Paco
- **Observed:** Comms Hub không có health form response view — tập trung vào campaigns và templates
- **Observed:** Response ID có thể enable qua Columns panel nhưng không hiển thị ở collapsed state
- **Observed:** Date Sent field không khả dụng trong Health Form Inbox grid
- **Observed:** Health Form Designer V2 có 27 field types bao gồm medical (Blood Pressure, BMI), interactive (Rating, Signature), và integration (Dynamic Consultation)
- **Observed:** Comms Hub cần separate login từ Paco

---

## Related Files

- `health-form-inbox.md` — Health Form Inbox chi tiết
- `patient-comms-hub.md` — Comms Hub chi tiết
- `health-forms-designer-v2.md` — Designer V2 chi tiết

---

## Tester notes

[Protected area]
