# Quick Send - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco/quick-send`

---

## Quick Send Overview

### Navigation Tabs
1. **Templates** - Saved message templates
2. **Campaigns** - Active and historical campaigns
3. **Tags** - Tag management

### Actions
- Create new campaign
- Create new template

---

## Templates Tab

**Grid Columns:**
- Name
- Type
- Comms Type
- Created date
- Created By

---

## Campaigns Tab

**Grid Columns:**
- Campaign
- Status
- Type
- Comms Type
- Recipients
- Last Sent
- Next Scheduled

---

## New Campaign Page

### URL
`/paco/quick-send/campaign`

### Step Navigation (7 tabs)
1. **Campaign** - Core campaign settings
2. **Journey** - Multi-step journey builder
3. **Resources** - Attachments/media
4. **Tagging** - Tag management
5. **Schedule** - Timing settings
6. **Patients** - Patient selection
7. **Analytics** - Reporting

---

## Campaign Tab Fields

### Basic Info
| Field | Value/Type |
|-------|------------|
| Campaign Name | textbox |
| Campaign Type | Quick Send, Patient Initiated, Scheduled |
| Comms Type | dropdown (select comms type...) |
| Channels | Email (checked), SMS |
| Campaign Language | Default English, Patient's Language |

### Email Settings
| Field | Value |
|-------|-------|
| From Address | no-reply@dev.blinxhealthcare.com (disabled) |
| Subject Line | textbox |
| Language | dropdown |

### Templates
**Style Templates:**
1. NHS Dear Patient... Book NHS Blue
2. Health Check Dear Patient... Book NHS Health Check
3. Minimal Minimal Clean
4. Modern Card
5. Gradient Header
6. Side Accent
7. Dark Theme
8. Private Luxury
9. Private Wellness
10. Private Corporate
11. Blank Blank

**Existing Templates:** Search and load from saved templates

---

## Button Builder

Customizable CTA button:

| Property | Options |
|----------|---------|
| Text | "Book Appointment" |
| Shape | Rectangle, Rounded, Pill |
| Background | Color picker + presets |
| Text | Color picker |
| Link | {{{scheduler_link}}} |

**Color Presets (NHS palette):**
- #005EB8 (NHS Blue)
- #007F3B (NHS Green)
- #D5281B (NHS Red)
- #330072 (NHS Purple)
- #003087 (NHS Dark Blue)
- #41B6E6 (NHS Light Blue)
- #ED8B00 (NHS Orange)
- #212B32 (NHS Dark)
- #768692 (NHS Grey)
- #000000 (Black)

---

## Layout Blocks

Drag-and-drop content blocks:
1. NHS Header
2. Divider
3. Image
4. 2 Columns
5. Video
6. Org Header
7. Sender Name
8. Org Footer

---

## Merge Fields

### Patient Variables
- First Name
- Last Name
- Date of Birth
- NHS Number
- Email
- Phone
- Address

### Organisation Variables
- (expandable list)

### Links
- Scheduler link
- Custom URLs

---

## WYSIWYG Editor

### Toolbar Features
**Text Formatting:**
- Bold, Italic, Underline, Strikethrough
- Font Size: 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96

**Alignment:**
- Left, Center, Right, Justify

**Lists:**
- Ordered: Default, Lower Alpha, Lower Greek, Lower Roman, Upper Alpha, Upper Roman
- Unordered: Default, Circle, Disc, Square

**Insert:**
- Link
- Image
- Video
- Table
- Horizontal Line

**Font Family:**
- Arial, Georgia, Impact, Tahoma, Times New Roman, Verdana

**Colors:**
- Text Color
- Background Color

**Spacing:**
- Line Height: Default, Single, 1.15, 1.5, Double
- Decrease Indent
- Increase Indent

**Other:**
- Undo/Redo
- Code View
- Fullscreen

---

## Default Email Template

```html
Dear {{{first_name}}},

Your content here.

[Book Appointment Button]

Kind regards,
{{{organisation_name}}}

© {{{organisation_name}}} | NHS
```

---

## Observations

1. **Multi-channel**: Email and SMS support
2. **Rich editor**: Full WYSIWYG with NHS-branded templates
3. **Journey builder**: Multi-step patient journeys
4. **Scheduling**: Scheduled campaigns with analytics
5. **Personalization**: Extensive merge fields for personalization
6. **NHS branding**: Pre-built NHS-style templates and color palette
7. **Button builder**: Easy CTA customization with NHS colors
8. **Confirmations/Reminders**: Automated follow-up messages
