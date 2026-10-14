# Configuration Pages - Route Test Results

**Tested:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev

---

## Configuration Pages Route Test Results

| Route | Status | Notes |
|-------|--------|-------|
| `/paco/configuration` | ✓ Works | Main config page |
| `/paco/configuration/#organisation` | ✓ Works | Sidebar anchor |
| `/paco/configuration/organisation/general` | ✓ Works | Org name, ODS, opening hours, comms |
| `/paco/configuration/organisation/locations` | ✓ Works | Locations grid |
| `/paco/configuration/organisation/skills` | ✓ Works | Skills grid |
| `/paco/configuration/organisation/sharing-agreements` | ✓ Works | Empty state |
| `/paco/configuration/organisation/integrations` | ✓ Works | Empty state |
| `/paco/configuration/organisation/announcements` | ✓ Works | 8 errors in console |
| `/paco/configuration/organisation/services` | ✓ Works | Empty state |
| `/paco/configuration/organisation/dx-priority` | ❌ 404 | Page Not Found |
| `/paco/configuration/organisation/pathways-config` | ❌ 404 | Page Not Found |
| `/paco/configuration/organisation/practice-profiles` | ⚠️ Not tested | - |
| `/paco/configuration/organisation/code-rule` | ⚠️ Not tested | - |
| `/paco/configuration/organisation/org-priority` | ⚠️ Not tested | - |
| `/paco/configuration/organisation/inbound-priority-flow` | ⚠️ Not tested | - |
| `/paco/configuration/clinical-config` | ⚠️ Loading slow | - |
| `/paco/configuration/case-prioritisation` | ✓ Works | Add Another, Save buttons |
| `/paco/configuration/quick-pay` | ❌ 404 | Page Not Found |
| `/paco/configuration/patients-and-proxy` | ❌ 404 | Page Not Found |
| `/paco/configuration/patient` | ❌ 404 | Page Not Found |
| `/paco/configuration/users-and-staff` | ❌ 404 | Page Not Found |

---

## Organisation Sub-pages

### General (✓ Works)
Route: `/paco/configuration/organisation/general`

**Fields:**
- Basic Information
  - Organisation Name: General Practice (Demo Site)
  - Organisation Type: General Practice
  - ODS code: YGMQJ
  - Photo upload
- Location & Contact
  - Address: Warrington, Halton 5, WA4 4AB
  - Contact: +44 1925 552266
  - Email: contact@blinxsolutions.com
  - Website: https://www.blinxhealthcare.com/
- Opening Hours
  - Mon-Sat 09:00-17:00 (selected)
  - Wed 09:00-19:00 (selected)
  - Next Day option for each day
- Special Opening Hours
  - Add button present
- Communications
  - Standard Header (WYSIWYG editor with bold/italic/underline, font sizes, alignment)
  - Standard Footer (with dynamic fields: Practice Name, Email, Phone, Address)
  - Dynamic field options: Practice Name, Practice Webpage, Practice Email, Practice Phone Number, Practice Address

### Locations (✓ Works)
Route: `/paco/configuration/organisation/locations`
- Search Locations textbox
- Grid with location data

### Skills (✓ Works)
Route: `/paco/configuration/organisation/skills`
- Search Skills textbox
- Grid with skill data

### Sharing Agreements (✓ Works)
Route: `/paco/configuration/organisation/sharing-agreements`
- Empty state (no data)

### Integrations (✓ Works)
Route: `/paco/configuration/organisation/integrations`
- Empty state (no data)

### Announcements (✓ Works, 8 errors)
Route: `/paco/configuration/organisation/announcements`
- Console errors present

### Services (✓ Works)
Route: `/paco/configuration/organisation/services`
- Empty state (no data)

### Case Prioritisation (✓ Works)
Route: `/paco/configuration/case-prioritisation`
- Add Another button
- Save button
- View audit button

---

## Failed Routes (404)

| Route | Status |
|-------|--------|
| `/paco/configuration/organisation/dx-priority` | 404 |
| `/paco/configuration/organisation/pathways-config` | 404 |
| `/paco/configuration/quick-pay` | 404 |
| `/paco/configuration/patients-and-proxy` | 404 |
| `/paco/configuration/patient` | 404 |
| `/paco/configuration/users-and-staff` | 404 |

---

## PACO Sidebar Routes

| Route | Status |
|-------|--------|
| `/paco/rocket-bar` | 404 |
| `/paco/web-chat` | 404 |
| `/paco/quick-send` | 404 |
| `/paco/patient-search` | ✓ Works |
| `/paco/appointment-book` | HTTP 404 but renders |
| `/paco/case-load-management` | ✓ Works |

---

## Summary

**Working:** ~12 configuration pages  
**404:** 6 configuration pages  
**Not tested:** 5 configuration pages (Clinical Config, Practice Profiles, Code Rule, Org Priority, Inbound Priority Flow)
