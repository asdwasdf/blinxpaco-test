# Appointment Book - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco-connect/feature-branch/pac2-7137/appointment-book`

---

## Quick Book Flow

### Entry Points
- Click **Quick Book** button in Appointment Book header

### Quick Book Dialog (9 steps)

```
1. Patient Search (required)
   ├── Search textbox "Search patients..."
   ├── "Within Organisations Hierarchy" checkbox
   ├── Results list with patient cards
   ├── Each card shows: Initials, Name, NHS No, DOB, Phone, Postcode
   └── Select patient to proceed

2. Session (required)
   ├── Search textbox "Search sessions"
   └── Results list

3. Slot Type* (required)
   └── "Select an appointment type"

4. Appt Type* (required)
   └── "Select an appointment type"

5. Clinician Gender (optional)
   └── "Select the preferred gender"

6. Clinician (optional)
   └── Search and select clinician

7. Email & SMS* (required)
   └── Shows "No slot types available" if no session selected

8. Location (optional)
   └── Search and select location

9. Date & Time
   └── Calendar picker

Action buttons: [Reset] [Find Appointment]
```

### Navigation
- Steps can be customized (reordered)
- Previous/Next Page buttons to navigate
- "Navigate using tabs or arrows to select your preferences"

---

## Test Results

### Patient Search
- Search "Mickey" → 8 results shown
- Results show initials, name, NHS number, DOB, phone, postcode
- Patient "Mike Wong" (MW) selected successfully

### Session Search
- API errors (CORS, 500) when searching
- Search returns no results (endpoint issue)

### API Errors Observed
```
- 500: GET /api/appointment-books/slot-types:0
- CORS: GET /api/appointments/sessions-appointments
```

---

## Appointment Book Main View

### Header
- Search: "Search patients, clinicians, times..."
- Appointment Book selector: "111 PC24"
- Group Send button
- Export button

### View Controls
- Day / Week / Month / Year toggles
- Previous / Next navigation
- Go to today button
- Date display: "6 October 2026"

### Stats Bar
- Active sessions today: 2
- Booked: 0
- Available: 90
- LIVE: 0

### Action Buttons
- Quick Book
- Filters

### Session Display
- Session Name: "OMP QA 8858-8859 test again"
- Time: 18:00 - 18:45
- Booked: 0, Available: 2

---

## Observations

1. Quick Book requires Session selection before Email & SMS options load
2. Patient search works well with autocomplete
3. API errors in dev environment affect session loading
4. UI has Next/Previous page navigation for steps
5. Steps are dynamic and can be customized in order

---

## Slots Behavior

- Sessions: 2 active today
- Booked: 0
- Available: 90
- LIVE: 0
