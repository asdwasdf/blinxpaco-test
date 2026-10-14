---
id: configuration
title: Configuration
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/configuration/organisation/general
controls:
  - name: Save
    kind: action
    mutation: true
  - name: Edit Address
    kind: action
    mutation: true
  - name: Remove Photo
    kind: action
    mutation: true
  - name: Add Special Opening Hours
    kind: action
    mutation: true
verified_by: []
last_observed: 2026-10-06
relationships:
  - id: run-20261006-024122-config-1
    from: dashboard
    to: configuration
    trigger: Configuration
    relationship: navigation
    context: []
    classification: Observed
    mutation_boundary: false
    evidence: []
---

# Configuration

## Purpose and context

`Observed`: Organisation configuration and settings management.

## Entry

1. Dashboard → Configuration
2. URL: `/paco/configuration/organisation/general`

## Configuration Sidebar Items

1. Organisation (expanded) - General sub-page
2. Patient
3. Appointment Books
4. Quick Pay
5. Patients & Proxy
6. Users & Staff
7. Clinical Config
8. Case Prioritisation

## Organisation General Page

### Basic Information
- Photo (with Remove Photo button)
- Organisation name

### Location & Contact
- Address: Warrington, Halton 5, WA4 4AB
- Edit Address link
- Contact Number field
- Email Address: contact@blinxsolutions.com
- Website URL: https://www.blinxhealthcare.com/

### Opening Hours
- Regular Opening Hours (Mon-Fri with From/To comboboxes)
- Special Opening Hours: "+ Add Special Opening Hours" button

### Communications
- Standard Header (rich text editor)
- Standard Footer (rich text editor)

## Observations

- Read-only view of organisation configuration
- Save button present (mutation boundary)
- Special Opening Hours addable (mutation boundary)

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T03:27:14Z

## Tester notes

## Status Options Discovered

Status dialog shows available statuses:
- Admin
- Screening
- Activity status test
- Lunch - 30 mins
- Lunch - 50 mins
- Lunch - 20 mins
- TEST STATUS
- Available
- Away from Desk
- Logged Out

User can set status to control visibility to colleagues.

---

# Configuration Sub-pages Discovered

## Menu Items (8 categories)
1. **Organisation** - General (expanded by default)
   - Basic Information, Location & Contact, Opening Hours, Communications
   - Standard Header/Footer for communications
2. **Patient** - (expanded shows region, content not loaded)
3. **Appointment Books** - 404 link
4. **Quick Pay** - 404 link
5. **Patients & Proxy** - link
6. **Users & Staff** - link
7. **Clinical Config** - link
8. **Case Prioritisation** - link

## Opening Hours Configuration
- Regular Opening Hours (Mon-Fri): 09:00 - 17:00
- Thursday: 09:00 - 19:00
- Special Opening Hours: Add button available

## Communications
- Standard Header (rich text editor)
- Standard Footer (4 words)
