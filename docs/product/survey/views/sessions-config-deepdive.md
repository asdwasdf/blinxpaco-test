# Sessions Config - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco-connect/configuration/#clinics` → Sessions

---

## Sessions Page

### Overview
- Total Sessions: 16,397
- Search textbox: "Search Session..."
- Show archived toggle

### Actions
- Add Session button (menu dropdown)

### Grid Columns
- Session Name (with icons: expandable, archived)

### Sample Sessions
1. Sean QA Test Oct5 2026
2. APTEST1 (multiple)
3. AP8862 QA (multiple)
4. OMP QA 8858-8859
5. QA-AUTO-PAC2-8241-20261005-1337
6. Example
7. Templates: "APTEST1 (Template — 2 sessions)", "AP8862 QA (Template — 1 session)", etc.

---

## Session Actions Menu

Right-click or Actions button:
1. **Edit** - Opens Edit Session panel
2. **View Audit** - View audit trail
3. **Archive** - Archive the session
4. **Clone** - Clone the session
5. **Delete** - Delete the session
6. **Cancel session appointments** - Cancel all appointments in session

---

## Edit Session Panel

Opens as side panel when Edit is clicked.

**Fields:**
```
Edit Session
├── Session Name: Sean QA Test Oct5 2026
├── Session Type:
│   ├── Timed Appts (radio, default)
│   └── Untimed Appts (radio)
├── Slot Duration (min): 10 (spinbutton)
├── Time Range: [button]
├── Apply Multi-Org Split: Select split (dropdown)
├── Assigned Slot Types: 6 selected
│   └── test by handsome mike 4 Jul 1, test slot type by mike at 5 Jul,
│       Man demo slot_type, Test Billable, Test Slot Type - Phlebotomy,
│       Sean Test 7366
├── Assigned Appointment Book: 2 selected
│   └── 11 oct -2 -21, 111 PC24
├── Service provider: [dropdown]
├── Assigned Locations: test again
├── Assigned Staff: 1 selected
├── Skills Requirements: View Skills (1)
├── Required Attributes: View Attributes (2)

[Cancel] [Save]
```

---

## Add Session Panel

Opens when Add Session is clicked.

**Fields:**
```
Add Session
├── Session Name: [textbox, empty]
├── Session Type:
│   ├── Timed Appts (radio, default)
│   └── Untimed Appts (radio)
├── Slot Duration (min): 10 (spinbutton)
├── Frequency: [button]
├── Apply Multi-Org Split: Select split (dropdown)
├── Assigned Slot Types: [dropdown, empty]
├── Assigned Appointment Book: [dropdown, empty]
├── Service provider: [dropdown]
└── Location & Care Professional(s)
    ├── Location 1: [dropdown]
    └── Care Professional 1: [dropdown]
    └── [+ Add another] button

[Cancel] [Save]
```

---

## Session Types

### Timed Appts
- Fixed slot durations
- Scheduler shows time blocks

### Untimed Appts
- No fixed duration
- Scheduler shows open-ended slots

---

## Observations

1. **Large dataset**: 16,397 sessions
2. **Template sessions**: Sessions can be templates with multiple recurring instances
3. **Multi-assignment**: Sessions can have multiple slot types, appointment books, locations, and staff
4. **Multi-org support**: Apply Multi-Org Split option
5. **Skills & Attributes**: Sessions can require specific skills and attributes
6. **Archive support**: Sessions can be archived and restored

---

## URL Structure

- PACO Connect Config: `/paco-connect/configuration/`
- Sessions: `/paco-connect/configuration/#clinics`
- Session Edit: Opens as side panel (not a new page)

---

## Related Configuration Items

In Appointment Books tree:
1. Scheduler
2. Appointment Books
3. Sessions (current)
4. Slot Types
5. Appointments
6. External Appt Reminders
