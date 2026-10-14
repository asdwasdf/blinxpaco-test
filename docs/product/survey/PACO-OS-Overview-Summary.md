# PACO OS - Product Overview Summary

**Date:** 2026-10-06  
**Environment:** dev.blinxpaco-np.com  
**Role:** Super Admin GB  

---

## What is PACO OS?

PACO OS is a comprehensive NHS General Practice management platform built by Blinx Healthcare. It provides an all-in-one solution for managing patients, appointments, communications, clinical workflows, and staff operations.

**Key URL:** `https://blinx.dev.blinxpaco-np.com/paco`

---

## Core Modules Overview

### 1. Patient Management

#### Patient Search
- Search by name, NHS number, DOB, postcode, phone
- Real-time NHS PDS lookup
- Patient demographics: name, DOB, gender, address, contact
- Flags system: red, yellow, amber, green
- Contact history: calls, letters, SMS, emails, notes
- Allergies and alerts
- GP and registered nurse information

#### Patient Flags
| Flag | Color | Purpose |
|------|-------|---------|
| Vulnerable | Red | High priority |
| At Risk | Yellow | Monitoring needed |
| Housebound | Amber | Home visits |
| Learning Disability | Green | Special care |

---

### 2. Case Load Management

#### Unallocated Board
- **778 cases** awaiting assignment
- Priority filters: Emergency (68), High (17), Mid (671), Low (21)
- PDS Status: Validated, Validation pending, Not matched
- SLA tracking: Active time counter per case
- Case actions: Request info, Add to Board

#### Priority Levels
1. **Over 72 hour** - SLA breach (red)
2. **12 Hours OOH** - Out of hours priority
3. **Emergency** - Emergency cases
4. **High Priority** - High priority
5. **Mid Priority** - Medium priority
6. **Low Priority** - Low priority

---

### 3. Appointment Management

#### Appointment Book
- Multi-booking support
- Patient search integration
- Multiple slot types
- External appointment reminders

#### Sessions Configuration
- Session types: Open, Bookable, On-the-day
- Session templates
- Slot type management
- Slot allocation
- Templates: 10min, 15min, 20min, 30min, 45min, 1hour
- Rota management
- Bulk actions: Copy week, Cancel sessions

---

### 4. Communications

#### Quick Send Campaigns
- **Multi-channel:** Email, SMS
- **11+ NHS-branded templates:**
  - NHS Dear Patient
  - Health Check
  - Minimal Clean
  - Modern Card
  - Gradient Header
  - Side Accent
  - Dark Theme
  - Private themes
  - Blank template

#### Campaign Builder
- **7-step wizard:** Campaign, Journey, Resources, Tagging, Schedule, Patients, Analytics
- **3 campaign types:** Quick Send, Patient Initiated, Scheduled
- **NHS color palette:** #005EB8 (NHS Blue), #007F3B (NHS Green), etc.
- **Button builder:** Customizable CTA with NHS colors
- **Merge fields:** First name, Last name, DOB, NHS number, email, phone, address
- **WYSIWYG editor:** Full formatting toolbar
- **Confirmations & Reminders:** Automated follow-ups

---

### 5. Health Forms

#### Form Types (4 types)
1. **SPN** - Service Payment Notice
2. **Health Forms** - Patient health questionnaires
3. **Consultation** - Consultation templates
4. **Case Form** - Case intake forms

#### Form Builder (26 items)
| Category | Items |
|----------|-------|
| Clinical | Blood Pressure, Multi BP, BMI |
| Text | Header, Paragraph, LineBreak |
| Inputs | Text, Multiline, Number+Unit, Dropdown |
| Selection | Multiple choice, Checkboxes, Range |
| Date/Contact | Date Picker, Email, Phone |
| Advanced | File Upload, Signature, Rating, Video |
| Layout | Two Column, Three Column |
| Branding | Org Logo, Header, Footer |

#### Clinical Features
- SNOMED code integration
- Total Health Form Score to patient record
- Booking integration (Timed Sessions)
- Multi-organisation sharing
- Reviewer workflow

---

### 6. Staff Management

#### Staff Profiles
- **587 staff members** in system
- Active/Archived filter
- Search functionality
- Staff details: name, gender, contact

#### Role Groups
- Permission-based access control
- Role assignment per staff

#### Teams
- Staff grouping for workflows
- Team-based assignments

---

### 7. Analytics & Reports

#### Report Types (7 main categories)

| Report | Description |
|--------|-------------|
| Capacity & Demand | Resource planning |
| Patient Analyser | Demographics & statistics |
| Medication Analyser | Prescription analysis |
| QOF Registers | Quality & Outcomes Framework |
| Patient Details | Detailed patient info |
| Comms Analytics | Communication metrics (NHS Comms Hub) |
| Reports | Detailed reporting |

#### Clinical Reports
| Report | Category |
|--------|----------|
| SCR | Summary Care Record |
| Patient Cases | Case tracking |
| Prescriptions | Rx reporting |
| NCRs | National Care Records Service |
| Safeguarding | Safeguarding reports |
| Clinical Guardian | Clinical safety |

---

### 8. Web Chat & Video

#### Staff Availability
- Real-time presence tracking
- Status: Available, On Leave
- Staff list with last active time
- Search clinicians

#### Features
- Virtual Appointments - Video consultations
- Media Library - File management
- Outstanding Reviews - Pending items

---

### 9. Configuration

#### Organisation Settings
- Org name, type, ODS code
- Address, contact, email, website
- Opening hours (Mon-Sun with time ranges)
- Next Day extension option
- Special Opening Hours
- Communications: Standard Header/Footer with WYSIWYG
- Dynamic fields: Practice name, phone, email, address

#### Locations
- Multi-location support
- Assigned staff per location
- Contact details per location

---

## Navigation Structure

### Main Sidebar
```
├── Dashboards
├── Analytics & Reports
├── Quick Send
├── Health Forms
├── Patient Search
├── Web Chat & Video
├── Case Load Management
├── Appointment Book
├── Quick Pay (→ PACO Connect)
├── Users
├── Configuration
└── Rocket Bar
```

### Configuration Tree
```
Configuration
├── Organisation (13 items)
│   ├── General
│   ├── Locations
│   └── [More...]
├── Patient
├── Appointment Books
├── Quick Pay
├── Patients & Proxy
├── Users & Staff
├── Clinical Config
└── Case Prioritisation
```

---

## Key Metrics

| Metric | Value |
|--------|-------|
| Unallocated Cases | 778 |
| Staff Members | 587 |
| Health Form Builder Items | 26 |
| NHS Templates | 11+ |
| Priority Levels | 6 |
| Patient Flag Types | 4+ |
| Report Categories | 7+ |

---

## Integration Points

### Separate Applications
1. **PACO Connect** - Quick Pay, Product Catalogue, Accounts
2. **NHS Comms Hub** - Communication analytics
3. **NHS PDS** - Patient demographics lookup

### External Integrations
- NHS Summary Care Record (SCR)
- National Care Records Service (NCRs)
- SNOMED CT coding
- QOF Registers

---

## User Interface Patterns

### Common UI Elements
- **Grids:** Sortable, paginated data tables
- **Search:** Global search with filters
- **Dropdowns:** Cascading selections
- **WYSIWYG:** Rich text editing
- **Date/Time pickers:** Appointment scheduling
- **Trees:** Configuration navigation
- **Tabs:** Multi-step workflows

### Design System
- NHS color palette
- Sidebar navigation
- Collapsible panels
- Action menus (FAB - Floating Action Button)
- Toast notifications
- Modal dialogs

---

## Notes

### Accessibility
- WCAG compliant
- Accessibility Menu button
- Keyboard navigation

### Theme
- Light/Dark mode toggle
- NHS-branded design

### Session
- Auto-login on dashboard
- Session timeout handling
- Breadcrumb navigation

---

## Summary

PACO OS is a **comprehensive NHS GP management platform** covering:

| Domain | Capabilities |
|--------|-------------|
| **Patients** | Search, demographics, flags, contact history |
| **Cases** | Unallocated board, priority triage, SLA tracking |
| **Appointments** | Sessions, slots, scheduler, reminders |
| **Communications** | Email/SMS campaigns, NHS templates, merge fields |
| **Health Forms** | Clinical forms, BP/BMI tracking, SNOMED |
| **Staff** | 587 users, roles, teams, availability |
| **Analytics** | Capacity, QOF, patient, medication reports |
| **Configuration** | Org settings, locations, opening hours |

The platform integrates with NHS systems (PDS, SCR, NCRs) and includes separate apps for payments (PACO Connect) and communications analytics (NHS Comms Hub).
