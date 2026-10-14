# Users & Staff - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco/configuration/staff/profiles`

---

## Users & Staff Overview

### Configuration Tree Structure

```
Configuration
├── Organisation (13 items)
│   ├── General
│   ├── Practice Profiles
│   ├── Locations
│   ├── Skills
│   ├── Code Rule
│   ├── Sharing Agreements
│   ├── Pathways Config
│   ├── Services
│   ├── Dx Priority
│   ├── Org Priority
│   ├── Inbound Priority Flow
│   ├── Announcements
│   └── Integrations
├── Patient
├── Appointment Books
├── Quick Pay
├── Patients & Proxy
├── Users & Staff (expanded)
│   ├── Staff Profiles
│   ├── Role Groups
│   └── Teams
├── Clinical Config
└── Case Prioritisation
```

---

## Staff Profiles

### URL
`/paco/configuration/staff/profiles`

### Stats
- **Total Staff:** 587
- **Pagination:** 1-25 of 587 (Page 1 of 24)

### Controls

| Control | Description |
|---------|-------------|
| Filter | Active / Archived |
| Search | Search staff by name |
| My Profile | View own profile |
| Add | Add Care Professional |

### Grid Columns
- First Name
- Last Name
- Gender

### Sample Staff Data

| First Name | Last Name | Gender |
|------------|-----------|--------|
| mike | ___ | male |
| ammar | 01022295446 | - |
| sandra yooo | 01513425986 | female |
| mw | 1010 | unknown |
| mw10 | 1010 | female |
| mw11 | 1010 | female |
| mw12 | 1010 | unknown |

---

## Role Groups

### URL
`/paco/configuration/role-groups`

*To be explored*

---

## Teams

### URL
`/paco/configuration/teams`

*To be explored*

---

## Observations

1. **Large staff database:** 587 staff members
2. **Role-based access:** Role Groups for permissions
3. **Team structure:** Teams for grouping staff
4. **Care professionals:** Staff with clinical roles
5. **Multi-page grid:** 24 pages of staff data
6. **Archive support:** Can archive inactive staff
7. **Profile management:** Individual staff profiles

---

## Staff vs Care Professional

The system distinguishes between:
- **Staff** - General users of the system
- **Care Professional** - Clinical staff (doctors, nurses, etc.)

---

## URL Structure

- Staff Profiles: `/paco/configuration/staff/profiles`
- Role Groups: `/paco/configuration/role-groups`
- Teams: `/paco/configuration/teams`
