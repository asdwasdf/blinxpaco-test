# Health Forms - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco/health-forms`

---

## Health Forms Overview

### Template Types (4 types)
1. **SPN** (Service Payment Notice)
2. **Health Forms** - Patient health questionnaires
3. **Consultation** - Consultation templates
4. **Case Form** - Case intake forms

### Actions
- Create new SPN
- Create new health forms
- Create new consultation
- Create new case form

---

## Templates Grid

**Columns:**
- Name
- Type
- Created date
- Created by
- Updated date
- Archived
- Editable
- Updated by
- Archived date

### Sample Templates

| Name | Type | Created | Editable |
|------|------|---------|----------|
| Date Range Filter 061026012534 | Case Form | 06/10/2026 | Yes |
| AutoTest Consultation Form | Consultation | 06/10/2026 | Yes |
| Routine Appt Request | Health Form | 22/11/2024 | Yes |
| Blood Pressure Testing | Health Form | 29/09/2026 | Yes |

---

## Health Form Designer

### URL
`/paco/health-forms/create-health-form-template`

### Sidebar Settings

| Field | Type |
|-------|------|
| Health Form Name | textbox |
| Health Form Type | One-off Health Form, Scheduled Diary |
| Share with Organisations | dropdown |
| Reviewers | dropdown |
| Tags | dropdown |
| SNOMED Code | search autocomplete |
| Add Total Health Form Score to Patient Record | checkbox |
| Default Booking Settings | section |
| Use Timed Session | checkbox |
| Appointment Configuration | (loads) |
| Save to Record Without Review | checkbox |

---

## Form Builder Items (26 types)

### Clinical Measurements
1. **Blood Pressure** - Single BP reading
2. **Multi Blood Pressure** - Multiple readings over time
3. **BMI** - Body Mass Index calculator

### Text & Content
4. **Header** - Section header
5. **Paragraph** - Rich text paragraph
6. **LineBreak** - Spacing element

### Input Fields
7. **Text Input** - Single line text
8. **Multiline Text Input** - Multi-line text area
9. **Number Input with Unit** - Number + unit (e.g., cm, kg)
10. **Dropdown** - Select from options
11. **Multiple choice** - Radio buttons
12. **Checkboxes** - Multiple selections
13. **Range** - Slider input

### Date & Contact
14. **Date Picker** - Date selection
15. **Email** - Email address field
16. **Phone Number** - Phone number field

### Advanced
17. **File Upload** - Attach documents
18. **Signature** - Digital signature capture
19. **Rating** - Star/numeric rating
20. **Dynamic Consultation** - Dynamic form section
21. **Video** - Embedded video

### Layout
22. **Two Column Row** - 2-column layout
23. **Three Columns Row** - 3-column layout

### Organisation
24. **Organisation Logo** - Practice logo
25. **Organisation Header** - Practice header
26. **Organisation Footer** - Practice footer

---

## Form Designer UI

```
┌─────────────────────────────────────────────────────┐
│ Health Form Designer                                │
├──────────────┬────────────────────────────────────┤
│ Settings     │                                    │
│              │                                    │
│ Name         │  Dropzone                         │
│ Type         │  ┌─────────────────────────────┐  │
│ Share        │  │ Click + to add form items   │  │
│ Reviewers    │  └─────────────────────────────┘  │
│ Tags         │                                    │
│ SNOMED       │                                    │
│ Booking      │                                    │
│              │                                    │
│ [Save Form]  │  ─── Toolbar ───                  │
│ [Cancel]     │  Blood Pressure                   │
│ [+] Open     │  Multi BP                         │
│               │  BMI                             │
│               │  Header                          │
│               │  Paragraph                       │
│               │  ... (26 items)                  │
└──────────────┴────────────────────────────────────┘
```

---

## Observations

1. **Multi-type forms**: SPN, Health Forms, Consultations, Case Forms
2. **Clinical focus**: BP, BMI, blood pressure tracking
3. **Rich form builder**: 26 different form item types
4. **Clinical coding**: SNOMED integration
5. **Booking integration**: Timed session support
6. **Multi-org sharing**: Share forms across organisations
7. **Review workflow**: Reviewer assignment
8. **Scoring**: Total health form score to patient record
9. **Signature capture**: Digital signature support
10. **Organisation branding**: Logo, header, footer

---

## Form Types Explained

### One-off Health Form
- Patient fills out once
- Typically for intake or screening

### Scheduled Diary
- Recurring/scheduled health monitoring
- Multiple readings over time (e.g., BP tracking)

---

## URL Structure

- Health Forms List: `/paco/health-forms`
- Create Health Form: `/paco/health-forms/create-health-form-template`
- Create SPN: `/paco/health-forms/create-spn-form`
- Create Consultation: `/paco/health-forms/create-consultation-template`
- Create Case Form: `/paco/health-forms/create-case-form`
