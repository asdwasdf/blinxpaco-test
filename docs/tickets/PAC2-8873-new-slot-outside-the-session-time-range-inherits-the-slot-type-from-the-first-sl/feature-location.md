# PAC2-8873 Feature Location

## Route
`blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/`

## Entry Points
1. **Configuration → Appointment Books → Sessions grid**
   - URL: `/configuration`
   - Click row to select session
   - Click expand icon (expand/collapse) to expand template
   - Double-click or click action button to open Session Editor modal

2. **Appointment Book view**
   - URL: `/appointment-book`
   - Select appointment book from dropdown
   - View session schedule
   - Click session to open Session Editor

## Bug Location
**Session Editor modal** (Preview/Edit Session)
- Accessed via: Configuration → Sessions → Select session → Edit/Preview
- Bug trigger: Add new slot outside session time range after changing first slot's Slot Type

## UI Components
- Session grid with expand/collapse icons (icons: expand, collapse)
- Session Editor modal with:
  - Time slot list
  - Slot Type dropdown per slot
  - Add slot button
  - Save/Cancel buttons

## Test Data
- APTEST1 template sessions (multiple)
- Available Slot Types: Test Billable, Test Slot Type, etc.
- Session timing: multiple slots with configurable durations

## Navigation Notes
- Grid navigation uses expand/collapse icons in first column
- Selected rows have `[selected]` attribute
- Session Editor modal opens on row double-click or action button
- Appointment Books dropdown allows switching between books
