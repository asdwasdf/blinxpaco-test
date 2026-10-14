# PACO OS Tree Map

**Generated:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**Sources:** feature-map.md, survey results, workflow docs

---

## PACO OS (Root)

```
PACO OS (https://blinx.dev.blinxpaco-np.com)
│
├── Sidebar Navigation (14 items)
│
├── 1. Dashboards
│   ├── Dashboard (/paco/dashboard) ★
│   │   ├── day/week/month/year toggles
│   │   ├── Staff Availability
│   │   ├── Quick View
│   │   └── Notifications
│   │
│   ├── Manager (/paco/dashboard/manager-dashboards/*) ★
│   │   ├── Org Tasks
│   │   ├── Staff Performance
│   │   ├── Org Stats
│   │   ├── All Patients
│   │   ├── CQC Readiness
│   │   ├── Message Outbox
│   │   └── Comms Analytics
│   │
│   ├── Connect (/paco-connect/dashboard) ❌ 404
│   │   └── PACO Connect features
│   │
│   └── Clinician (/paco/dashboard/clinician-dashboards/*) ❌ 404
│       └── Clinician-specific dashboard
│
├── 2. Analytics & Reports
│   ├── Capacity & Demand (/capacity-demand/) ★
│   │   ├── Clinician Capacity charts
│   │   ├── Consultation Observations (search-to-add combobox)
│   │   ├── Date range picker
│   │   └── Highcharts tooltips
│   │
│   ├── Patient & Medication Analyser (/patient-analyser-new/) ★
│   │   ├── Patient Analyser tab
│   │   ├── Medication Analyser tab
│   │   ├── QOF Registers tab
│   │   ├── Patient Details tab
│   │   └── Reports panel
│   │
│   ├── Comms Analytics (→ NHS Comms Hub) ⚠ Separate auth
│   │
│   └── Reports (/paco/analytics-reports/scr-reports) ⚠
│       └── SCR records
│
├── 3. Quick Send (→ NHS Comms Hub)
│   ├── Template Manager (/commshub/template-builder) ★
│   ├── Campaign Manager (/commshub/campaign-manager) ★
│   └── Patient Manager (/commshub/patient-management) ⚠
│
├── 4. Health Forms
│   ├── Inbox (/health-forms/responses/) ★
│   │   ├── Stat tiles (Total/Incomplete/Overdue/Completed)
│   │   ├── Alarm Triggered table
│   │   ├── No Alarm Triggered table
│   │   └── All Health Forms panel
│   │
│   ├── Designer V2 (/paco/health-forms) ★
│   │   ├── Health Form Templates
│   │   ├── Filters
│   │   └── Create new (+)
│   │
│   └── Designer (/health-forms/builder/) ❌ 404
│       └── Health Form Builder
│
├── 5. Patient Search (/paco/patient-search) ★
│   ├── AG Grid table (495,000+ patients)
│   ├── Search by name/NHS number
│   ├── Filters drawer
│   ├── Columns controls
│   └── Row Actions menu:
│       ├── View (modal)
│       ├── Edit (modal)
│       ├── Profile (→ Patient Profile module) ★
│       ├── View Audit
│       ├── Archive
│       └── Save for offline access
│
├── 6. Patient Profile (/paco/patient-profile/{id}/*) ★
│   ├── Dashboard tab
│   ├── Timeline tab
│   ├── Coding tab
│   ├── Consultations & Admin tab
│   ├── Medication tab
│   ├── Patient Comms tab
│   ├── Shared Records tab (NHS Smartcard required) ⚠
│   ├── Investigations tab (Results/Requested)
│   ├── Appointments tab
│   ├── Documents tab
│   ├── Payments tab
│   └── Tasks tab
│
├── 7. Web Chat & Video (/web-chat/)
│   ├── Virtual Appointments (/web-chat/appointments/) ⚠ Separate login
│   ├── Media Library (/web-chat/media-library) ⚠ Separate login
│   └── Outstanding Reviews (/web-chat/review) ⚠ Separate login
│
├── 8. Case Load Management
│   ├── My Case (/paco/my-case) ★
│   │   └── Empty state
│   │
│   ├── Unallocated (/paco/unallocated) ★
│   │   ├── Kanban board by OOH breach
│   │   ├── Priority tabs
│   │   ├── Card menu:
│   │   │   ├── Change Priority
│   │   │   ├── View PDS
│   │   │   ├── View Audit
│   │   │   ├── Assign Skills
│   │   │   ├── Quick Book
│   │   │   ├── Quick Send
│   │   │   ├── Close Case
│   │   │   ├── Flag
│   │   │   └── Move Case
│   │   └── List View toggle
│   │
│   ├── Case Workboards (/paco/workboards/{id}) ★
│   │   ├── Master Case Board
│   │   ├── Kanban by priority
│   │   └── Card menu (+ Assign Case, Unassign)
│   │
│   └── Task Workboards (/paco/workboards/{id}) ★
│       ├── Master Task Board
│       ├── Multi-column kanban
│       └── Card menu:
│           ├── View
│           ├── Edit
│           ├── Change Priority
│           ├── Flag
│           ├── Move Task
│           ├── Change Status
│           ├── Duplicate
│           ├── Link Task
│           └── Archive Task
│
├── 9. Appointment Book (→ PACO Connect) ❌ 404
│   ├── Day/Week/Month/Year views
│   ├── Sessions/Booked/Available counters
│   ├── Quick Book
│   └── Filters
│
├── 10. Quick Pay (→ PACO Connect) ❌ 404
│   └── Product Catalogue, Accounts
│
├── 11. Users (→ PACO Connect) ❌ 404
│   └── User Training Portal
│
├── 12. Configuration (/paco/configuration/*) ★
│   ├── Organisation
│   │   ├── General ★
│   │   │   ├── Basic Information
│   │   │   ├── Location & Contact
│   │   │   ├── Opening Hours
│   │   │   └── Communications (Header/Footer)
│   │   ├── Locations
│   │   ├── Skills
│   │   ├── DX Priorities
│   │   ├── Org Priorities
│   │   ├── Code Rule
│   │   ├── Sharing Agreements
│   │   ├── Pathways Config
│   │   ├── Services
│   │   ├── Inbound Priority Flow
│   │   ├── Announcements
│   │   └── Integrations
│   │
│   ├── Patient
│   │   ├── DFD
│   │   └── Care Navigation
│   │
│   ├── Appointment Books
│   │   ├── Scheduler ❌
│   │   ├── Appointment Books
│   │   ├── Sessions ★
│   │   ├── Slot Types
│   │   ├── Appointments
│   │   └── External Appt Reminders
│   │
│   ├── Quick Pay (→ PACO Connect) ❌
│   │   ├── Product Catalogue
│   │   └── Accounts
│   │
│   ├── Patients & Proxy
│   │   └── Role Groups ★
│   │
│   ├── Users & Staff
│   │   ├── Staff Profiles ★
│   │   ├── Role Groups ★
│   │   └── Teams ★
│   │
│   ├── Clinical Config
│   │   ├── Template Library ★
│   │   │   ├── Document Templates
│   │   │   ├── Consultation Templates
│   │   │   └── Prescribing Formularies
│   │   ├── Risk Strat Builder ★
│   │   └── Case Prioritisation ★
│   │
│   └── Case Prioritisation
│
├── 13. Rocket Bar
│   ├── Launch Rocket Bar
│   └── Download Rocket Bar
│
└── 14. Status Dialog (popup)
    ├── Admin
    ├── Screening
    ├── Available
    ├── Away from Desk
    ├── Logged Out
    └── Lunch options
```

---

## External Apps (Cross-App Navigation)

```
NHS Comms Hub (https://nhs-comms-hub-dev.blinxhealthcare.com)
├── Template Builder (/commshub/template-builder) ★
│   ├── Show Org. Default Templates
│   ├── Create New Email/SMS
│   └── Templates table
│
├── Campaign Manager (/commshub/campaign-manager) ★
│   ├── Create Campaign
│   ├── Campaign Outbox
│   ├── Filter Campaigns
│   └── Campaigns table
│
├── Patient Manager (/commshub/patient-management) ⚠
│   └── Lists, Patients tabs
│
├── Analytics (/commshub/analytics) ⚠ Separate auth
│   └── Conversion charts
│
└── Configuration ⚠ Separate auth
```

---

## API Endpoints (Base: dev-paco-api.blinxhealthcare.com/api/)

```
Users & Auth:
├── /api/users/me (GET)
├── /api/users/dexie-encryption-key (GET)
├── /api/users/prescriber-prof-reg (GET)
├── /api/users/provider-roles (GET)
├── /api/users/organisation-locations (GET)
├── /api/provider-shift-status/me (GET)
├── /api/provider-shift-status/me/leave (GET)
├── /api/provider-shift-status/me/heartbeat (POST) ← heartbeat every ~1min
└── /api/shift-activity-status-type?activityState=active (GET)

Patients:
├── /api/patients/search (GET) ← 495k+ patients
├── /api/patient-cases/current-provider-cases (GET)
├── /api/patient-cases/groups (GET) ← 403 Permission Denied ⚠
└── /api/priority-groups (GET) ← 403 Permission Denied ⚠

Workboards:
├── /api/workboards/ (GET)
├── /api/workboards/{id} (GET)
├── /api/workboards/{id}/columns (GET)
├── /api/workboards/stats (GET)
├── /api/task-status-types (GET)
├── /api/task-status-types?workboard_id={id} (GET)
└── /api/tasks/task-priority-types (GET)

Communications:
├── /api/pacomms/conversations (GET)
├── /api/pacomms/invites (GET)
└── /api/nhs/user-info (POST)

Organisation:
└── /api/organisation/registration-types (GET)

Connectivity:
└── /api/connectivity (GET) ← 204 No Content
```

---

## Coverage Status Legend

| Symbol | Meaning |
|--------|---------|
| ★ | Explored, documented |
| ⚠ | Accessible but blocked (auth/permissions/loading) |
| ❌ | 404 / Route Failure |
| (blank) | Not explored in this survey |

---

## Key Findings

### Mutation Blockers (Root Cause)

1. **Create New Task** - `/api/priority-groups` returns 403
2. **Create New Board** - Save action doesn't complete
3. **Set User Status** - Found in popup dialog

### 404 Routes (Environment Issues)

- `/paco-connect/*` (all PACO Connect features)
- `/health-forms/designer` (V1)
- `/paco/reports`
- `/paco/dashboard/connect-dashboards/*`
- `/paco/dashboard/clinician-dashboards/*`

### Separate Auth Required

- NHS Comms Hub (Microsoft SAML2 SSO)
- Web Chat & Video (separate login)

---

## Sources

- Feature Map: `docs/product/feature-map.md`
- Workflows: `docs/product/workflows/*.md`
- Survey: `docs/product/survey/views/`
- This run: `docs/product/survey/run-20261006-024122-report.md`
