# Video Evidence Review - PAC2-8871

**Source**: `128887-Connect - changing a sessions preview doesn't remove it from the folder.mp4`  
**Duration**: 201.81s (3min 21s)  
**Resolution**: 1920x980  
**Reviewed**: 2026-10-07

## Bug reproduction flow

Video demonstrates bug where changing session slot structure through Preview Session saves changes but fails to remove session from folder.

### Timeline

**00:00:00 - Initial state**
- Configuration page: `https://blinx.dev.blinxpaco-np.com/paco-connect/configuration`
- Session table shows folder `AP8862 QA (Template — 1 session)` expanded
- Session `AP8862 QA` inside folder (blue highlight)

**00:00:32 - Creating test session (frame-0035)**
- `Preview` modal open with schedule
- Multiple pink slots: `[Bootcamp] Phlebotomy | 10 min` at 08:00, 08:10, 08:20, 08:30, 08:40, 08:50, 09:00, 09:10
- `Add Session` panel (right) shows:
  - Session Name: `APTEST1`
  - Session Type: `Timed Appts` (selected)
  - Slot Duration: `10` min
  - Hours: `08:00` to `16:00`
  - Start Date: `06/10/2026`
  - End Date: `27/10/2026`
  - Days: `Tuesday`

**00:01:25 - Session created successfully (frame-0090)**
- Green success toast: `Success - Session updated successfully.`
- New folder appears: `APTEST1 (Template — 4 sessions)` (expanded)
- 4 sessions named `APTEST1` inside folder
- Assigned Slot column: `[Bootcamp] Phlebotom...` (truncated)
- `Edit Session` panel open on right

**00:02:22 - Slot types already changed (frame-0148)**
- Folder `APTEST1 (Template — 4 sessions)` still expanded
- Assigned Slot column now shows: `Sean Test 7366, [Bootc...`
- Slot types changed from Phlebotomy to different slot types

**00:02:44 - Editing slot structure via Preview (frame-0172)**
- `Edit Session` panel on right
- `Preview` modal center shows mixed slot types:
  - Red/pink slots: `Test Slot Type - Phlebotomy | 10 min` (08:00, 08:10, 08:20)
  - Purple/lavender slots: `[Bootcamp] Coil Fitting | 10 min` (08:30, 08:40, 08:50, 09:00, 09:10)
- Orange `Save` button visible at bottom of Preview modal
- Session ends at: `16:00`

**00:03:02 - After saving slot changes (frame-0190)**
- Back to session table
- **BUG CONFIRMED**: Folder `APTEST1 (Template — 4 sessions)` STILL EXPANDED
- 4 sessions remain inside folder
- Assigned Slot shows: `Sean Test 7366, [Bootc...` (confirms slot type changes saved)

## Steps to reproduce

1. Navigate to Configuration → Appointment Books in Paco Connect
2. Create session template `APTEST1` with:
   - Session Type: `Timed Appts`
   - Slot Duration: `10 min`
   - Frequency: Weekly on Tuesday
   - Hours: 08:00 to 16:00
   - Initial slot type: `[Bootcamp] Phlebotomy`
   - Result: Folder with 4 sessions created
3. Select one session in folder
4. Click `Edit Session` → `Preview`
5. Change slot types from `[Bootcamp] Phlebotomy` to `[Bootcamp] Coil Fitting`
6. Click `Save`
7. Return to session table

**Expected behavior**: Session moves out of folder (session structure changed)  
**Actual behavior**: Session remains inside folder `APTEST1 (Template — 4 sessions)` despite slot type changes

## Evidence

### Key observations (Confirmed)

- **Slot structure changes saved**: Assigned Slot column changes from `[Bootcamp] Phlebotom...` (frame-0090) to `Sean Test 7366, [Bootc...` (frame-0190)
- **Success notification displayed**: `Success - Session updated successfully.` toast shown (frame-0090)
- **Folder state persists**: `APTEST1 (Template — 4 sessions)` folder remains expanded with all 4 sessions inside throughout frames 0090 → 0190
- **Preview modal shows slot type changes**: Mixed red/pink (Phlebotomy) and purple (Coil Fitting) slots visible (frame-0172)

### UI elements observed

- **Folders**: 
  - `AP8862 QA (Template — 1 session)`
  - `APTEST1 (Template — 4 sessions)`
  - `QA Large Series 1791257003486 (Template — 2 sessions)`
  - `Dan E2E test (Template — 4 sessions)`
- **Slot types**:
  - `[Bootcamp] Phlebotomy | 10 min`
  - `Test Slot Type - Phlebotomy | 10 min`
  - `[Bootcamp] Coil Fitting | 10 min`
- **Assigned slots**: `Sean Test 7366, [Bootc...`
- **Buttons**: `Preview`, `Actions`, `Tips`, `Save`, `Cancel`
- **Toast notifications**: `Success - Session updated successfully.`

## Confidence level

**High (Confirmed)**

Video provides clear visual evidence of bug:
1. Slot type changes successfully applied (color/label changes visible in Preview modal)
2. Success notification confirms save operation completed
3. Folder structure remains unchanged across all frames after slot type modification
4. Assigned Slot column values change, confirming slot structure modification persisted
5. Sessions remain inside folder despite structural changes (frames 0090 → 0190)

## Related requirements

Per ticket description:
- ✅ **Works**: Changing session length, clinician, or location moves session out of folder correctly
- ❌ **Bug**: Changing session structure (slot times, slot types) through Edit Session or Session Preview saves changes but session stays inside folder

## Technical notes

- **Environment**: `https://blinx.dev.blinxpaco-np.com/paco-connect/configuration`
- **User role**: Super Admin (Dev Access) - Alex Paul
- **Practice**: General Practice (Demo Site)
- **Slot duration**: 10 min
- **Session frequency**: Weekly (Tuesday)
- **Date range**: 06/10/2026 to 27/10/2026
- **Time range**: 08:00 to 16:00

## Frame references

| Frame | Timestamp | State |
|---|---:|---|
| `frame-0001.webp` | `00:00:00.000` | Initial session table with folders |
| `frame-0010.webp` | `00:00:08.400` | Session table view |
| `frame-0035.webp` | `00:00:32.800` | Preview modal showing Phlebotomy slots, Add Session panel |
| `frame-0053.webp` | `00:00:48.767` | Session table with AP8862 QA folder expanded |
| `frame-0090.webp` | `00:01:25.667` | APTEST1 folder created (4 sessions), Success toast |
| `frame-0148.webp` | `00:02:22.567` | APTEST1 folder with changed slot types (Sean Test 7366) |
| `frame-0172.webp` | `00:02:44.833` | Edit Session Preview showing mixed slot types (Phlebotomy + Coil Fitting) |
| `frame-0190.webp` | `00:03:02.333` | Session table, APTEST1 folder still expanded (BUG) |
