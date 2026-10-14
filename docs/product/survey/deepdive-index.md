# PACO OS - Deep Dive Survey Complete

**Date:** 2026-10-06  
**Environment:** dev.blinxpaco-np.com  
**Role:** Super Admin GB  

---

## 📋 Overview Summary

**Main file:** `PACO-OS-Overview-Summary.md` - Complete product overview with all 11 deep dives summarized

---

## Completed Deep Dives (11)

| # | Feature | File | Key Findings |
|---|---------|------|-------------|
| 1 | Appointment Book - Quick Book | `appointment-book-deepdive.md` | Scheduler, slot types, patient search, multi-booking |
| 2 | Patient Search | `patient-search-deepdive.md` | NHS search, demographics, flags, contact history |
| 3 | Sessions Config | `sessions-config-deepdive.md` | Session types, templates, slots, rota management |
| 4 | Configuration General | `configuration-general-deepdive.md` | Org settings, hours, WYSIWYG comms |
| 5 | Case Load Management | `case-load-management-deepdive.md` | 778 unallocated, priority tiers, SLA tracking |
| 6 | Quick Send | `quick-send-deepdive.md` | Campaign builder, NHS templates, merge fields |
| 7 | Health Forms | `health-forms-deepdive.md` | 4 form types, 26 builder items, clinical fields |
| 8 | Users & Staff | `users-staff-deepdive.md` | 587 staff, Role Groups, Teams |
| 9 | Analytics & Reports | `analytics-reports-deepdive.md` | 7 reports: Capacity, Patient, QOF, etc. |
| 10 | Web Chat & Video | `web-chat-video-deepdive.md` | Staff availability, video, media |
| 11 | Configuration & Others | `configuration-deepdive.md` | Locations, config tree, 404 pages |

---

## Documentation Location

```
D:\blinxpaco-test\docs\product\survey\
├── appointment-book-deepdive.md
├── patient-search-deepdive.md
├── sessions-config-deepdive.md
├── configuration-general-deepdive.md
├── case-load-management-deepdive.md
├── quick-send-deepdive.md
├── health-forms-deepdive.md
├── users-staff-deepdive.md
├── analytics-reports-deepdive.md
├── web-chat-video-deepdive.md
├── configuration-deepdive.md
└── deepdive-index.md (this file)
```

---

## PACO OS Navigation Structure

```
Sidebar Menu:
├── Dashboards
├── Analytics & Reports
├── Quick Send
├── Health Forms
├── Patient Search
├── Web Chat & Video
├── Case Load Management
├── Appointment Book
├── Quick Pay
├── Users
├── Configuration
└── Rocket Bar

Configuration Sub-items:
├── Organisation (13 items)
├── Patient
├── Appointment Books
├── Quick Pay
├── Patients & Proxy
├── Users & Staff
├── Clinical Config
└── Case Prioritisation
```

---

## Key Metrics Observed

| Metric | Value |
|--------|-------|
| Unallocated Cases | 778 |
| Staff Members | 587 |
| Sessions Config Pages | Multiple (scheduler, slot types, appointments, reminders) |
| Health Form Builder Items | 26 types |
| Quick Send Templates | 11+ style templates |
| Communication Channels | Email, SMS |
| Report Types | 7+ (SCR, QOF, NCRs, etc.) |

---

## Separate Applications

1. **PACO Connect** - Quick Pay module
2. **NHS Comms Hub** - Comms Analytics

---

## Pages with Issues (404)

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
- Appointment Books sub-pages
- Patients & Proxy
- Clinical Config
- Case Prioritisation
- Rocket Bar
- Clinical conditions/medications

---

## Summary

PACO OS is a comprehensive NHS GP management system covering:
- **Patient Management:** Search, demographics, flags, contact history
- **Case Management:** Unallocated board, priority tiers, SLA tracking
- **Appointments:** Session config, scheduler, slot types, reminders
- **Communications:** Quick Send campaigns, NHS templates, multi-channel
- **Health Forms:** Customizable forms with clinical fields (BP, BMI)
- **Analytics:** Capacity, QOF, Patient, Medication reports
- **Staff:** 587 staff, role groups, teams, availability tracking
- **Configuration:** Org settings, locations, opening hours
