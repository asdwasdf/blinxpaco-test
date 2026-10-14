# Configuration General - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco/configuration/organisation/general`

---

## Configuration General Page

### Organisation Tree (13 items)
1. General (current)
2. Practice Profiles
3. Locations
4. Skills
5. Code Rule
6. Sharing Agreements
7. Pathways Config
8. Services
9. Dx Priority
10. Org Priority
11. Inbound Priority Flow
12. Announcements
13. Integrations

Plus top-level sections:
- Patient
- Appointment Books
- Quick Pay
- Patients & Proxy
- Users & Staff
- Clinical Config
- Case Prioritisation

---

## General Configuration Sections

### 1. Basic Information

| Field | Value | Editable |
|-------|-------|----------|
| Photo | Upload/Remove buttons | ✓ |
| Organisation Name | General Practice (Demo Site) | ✓ |
| Organisation Type | General Practice | ✓ |
| ODS code | YGMQJ | ✗ (disabled) |

### 2. Location & Contact Information

| Field | Value | Editable |
|-------|-------|----------|
| Address | Warrington, Halton 5, WA4 4AB | ✓ (Edit Address link) |
| Contact Number | +44 1925 552266 | ✓ |
| Email Address | contact@blinxsolutions.com | ✓ |
| Website URL | https://www.blinxhealthcare.com/ | ✓ |

### 3. Opening Hours

#### Regular Opening Hours

| Day | Selected | From | To | Next Day |
|-----|---------|------|-----|----------|
| Monday | ✓ | 09:00 | 17:00 | ✗ |
| Tuesday | ✓ | 09:00 | 17:00 | ✗ |
| Wednesday | ✓ | 09:00 | 19:00 | ✓ |
| Thursday | ✓ | 09:00 | 17:00 | ✓ |
| Friday | ✓ | 09:00 | 17:00 | ✗ |
| Saturday | ✓ | 09:00 | 17:00 | ✗ |
| Sunday | ✗ | 09:00 | 17:00 | ✗ |

#### Special Opening Hours
- "+ Add Special Opening Hours" button

### 4. Communications

#### Standard Header (WYSIWYG Editor)
**Toolbar:**
- Bold
- Italic
- Underline
- Font Size: 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96
- Lists: Ordered (Default, Lower Alpha, Lower Greek, Lower Roman, Upper Alpha, Upper Roman)
- Lists: Unordered (Default, Circle, Disc, Square)
- Alignment: Left, Center, Right, Justify
- Undo/Redo
- Insert Link
- Insert Table
- Fullscreen
- Code View
- **Dynamic Fields**: Practice Name, Practice Webpage, Practice Email, Practice Phone Number, Practice Address
- **Practice Logo** button
- **Font Family**: Arial, Georgia, Impact, Tahoma, Times New Roman, Verdana
- Text Color

#### Standard Footer (WYSIWYG Editor)
- Same toolbar as Header
- Default content:
  ```
  {{{organisation_name}}}
  {{{organisation_website}}}
  {{{organisation_phone_number}}}
  {{{organisation_address}}}
  ```

### Action Buttons
- **Save** button

---

## Observations

1. **Comprehensive org config**: All basic org settings in one place
2. **Rich WYSIWYG editor**: Full formatting for patient communications
3. **Dynamic fields**: Template variables for practice info
4. **Opening hours**: Granular control with "Next Day" option for late hours
5. **ODS code**: Read-only (system-generated)
6. **Photo support**: Organization branding

---

## Dynamic Fields Available

1. `{{{organisation_name}}}`
2. `{{{organisation_website}}}`
3. `{{{organisation_phone_number}}}`
4. `{{{organisation_address}}}`

---

## Editable vs Read-Only Fields

**Editable:**
- Organisation Name
- Organisation Type
- Address
- Contact Number
- Email Address
- Website URL
- Opening Hours (per day)
- Special Opening Hours
- Header/Footer content

**Read-Only:**
- ODS code
