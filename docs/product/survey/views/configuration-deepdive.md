# Configuration & Remaining Features - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  

---

## Configuration Tree Structure (Complete)

```
Configuration
├── Organisation (13 items)
│   ├── General ✓
│   ├── Practice Profiles (404 - no direct URL)
│   ├── Locations ✓ - Practice locations management
│   ├── Skills (404)
│   ├── Code Rule (404)
│   ├── Sharing Agreements (404)
│   ├── Pathways Config (404)
│   ├── Services (404)
│   ├── Dx Priority (404)
│   ├── Org Priority (404)
│   ├── Inbound Priority Flow (404)
│   ├── Announcements (404)
│   └── Integrations (404)
├── Patient (404)
├── Appointment Books (404)
├── Quick Pay ✓ (PACO Connect app)
│   ├── Product Catalogue (PACO Connect)
│   └── Accounts (PACO Connect)
├── Patients & Proxy (404)
├── Users & Staff ✓
│   ├── Staff Profiles ✓ (587 staff)
│   ├── Role Groups
│   └── Teams
├── Clinical Config (404)
└── Case Prioritisation (404)
```

---

## Locations Page

**URL:** `/paco/configuration/organisation/locations`

### Controls
- Search Locations
- Add button

### Grid Columns
- Name
- Address
- Contact Number
- Email Address
- Assigned Staff
- Created Date
- Created By
- Updated Date
- Updated By

---

## Quick Pay (PACO Connect)

**URL:** `/paco-connect/quick-pay/*`

### Sub-items
- Product Catalogue
- Accounts

### Note
Quick Pay runs as separate PACO Connect application (not within main PACO OS)

---

## Clinical Config (Not accessible)

Pages returning 404:
- `/paco/configuration/clinical/conditions`
- `/paco/configuration/clinical/medications`

---

## Rocket Bar

**URL:** `/paco/rocket-bar`
**Status:** 404 - Not found

---

## Web Chat & Video (Completed)

**URL:** `/paco/web-chat`

### Features
- Staff Availability
  - Filter: Available (6), On Leave (0)
  - Search Clinicians
  - Staff list with status
- Virtual Appointments
- Media Library
- Outstanding Reviews

---

## Summary

### Successfully Documented
1. Configuration General - Org settings, hours, comms
2. Locations - Practice locations management
3. Users & Staff - 587 staff, Role Groups, Teams
4. Quick Pay - PACO Connect (separate app)
5. Web Chat & Video - Staff availability, video

### 404 Pages (Not accessible or not built)
- Practice Profiles
- Skills
- Code Rule
- Sharing Agreements
- Pathways Config
- Services
- Dx Priority
- Org Priority
- Inbound Priority Flow
- Announcements
- Integrations
- Patient config
- Appointment Books
- Patients & Proxy
- Clinical Config
- Case Prioritisation
- Rocket Bar
- Clinical conditions/medications

### Separate Apps
- Quick Pay: PACO Connect app
- Comms Analytics: NHS Comms Hub external

---

## Recommendations for Further Investigation

1. Verify URLs for Practice Profiles, Skills, etc. with development team
2. Clinical Config pages need proper routing
3. Rocket Bar feature may be deprecated or renamed
4. Quick Pay and Comms Analytics are separate applications
