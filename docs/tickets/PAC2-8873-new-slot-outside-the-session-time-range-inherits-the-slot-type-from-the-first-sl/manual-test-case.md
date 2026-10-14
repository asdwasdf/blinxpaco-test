# PAC2-8873 - Manual Test Case

## Ticket
**PAC2-8873:** New slot outside the session time range inherits the slot type from the first slot

## Bug Summary
When adding a new slot outside the session's configured time range, the new slot incorrectly inherits the Slot Type from the first slot instead of using the session's default Slot Type.

---

## Test Environment
| Field | Value |
|-------|-------|
| **URL** | `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/` |
| **Login** | `blinx_johnny.bravo` / `Blinx!82` |
| **Organisation** | General Practice (Demo Site) |
| **Role** | Blinx Deployment |

---

## Test Data Setup

### Prerequisites
1. Navigate to: **Configuration → Appointment Books → Slot Types**
2. Ensure these slot types exist (or create them):
   - **Test Billable** (default session slot type)
   - **Test Slot Type - Phlebotomy** (different slot type)
3. Navigate to: **Configuration → Appointment Books → Sessions**
4. Create or select a session with:
   - Multiple slot types assigned
   - Default slot type: **Test Billable**
   - Time range: e.g., 10:00 - 12:00
   - Multiple slots within the range

### Recommended Test Session
Use existing session **"APTEST1"** or **"ABCDE 7081"** if they have the required slot types configured.

---

## Manual Test Steps

### TC001: Reproduce Bug - New Slot Outside Range Inherits First Slot Type

| Step | Action | Expected Result | Actual Result (Bug) |
|------|--------|-----------------|---------------------|
| 1 | Navigate to: **Configuration → Appointment Books → Sessions** | Session grid loads with list of sessions | ✓ |
| 2 | Select a session with multiple slot types (e.g., APTEST1) | Session is highlighted/selected | ✓ |
| 3 | Double-click on the session row OR click the action button | Session Editor modal opens | ✓ |
| 4 | In the Session Editor, locate the slot list (showing slots 10:00, 10:10, 10:20, etc.) | Slots are displayed with their slot types | ✓ |
| 5 | Change the **first slot's Slot Type** to a different type (e.g., change from "Test Billable" to "Test Slot Type - Phlebotomy") | First slot's slot type changes successfully | ✓ |
| 6 | Add a new slot with time **outside the session range** (e.g., if session is 10:00-12:00, add slot at 13:00-13:10) | New slot appears in the slot list | ✓ |
| 7 | **Observe the Slot Type of the newly added slot** | **EXPECTED:** Should show "Test Billable" (session's default) | **ACTUAL BUG:** Shows "Test Slot Type - Phlebotomy" (inherited from first slot) |
| 8 | Verify the new slot's slot type | ❌ **BUG CONFIRMED** if it shows first slot's type instead of default | |

### TC002: Control Test - Slot Inside Range

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | In the same session, add a slot **within** the session time range | New slot appears |
| 2 | Observe the Slot Type | Should use session's default Slot Type |
| 3 | Compare with bug from TC001 | Bug only occurs for slots outside range |

### TC003: Session Default Slot Type Verification

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | In Session Editor, check the session's default Slot Type setting | Should show "Test Billable" |
| 2 | Add a slot outside range without changing first slot | New slot should use default |
| 3 | Verify behavior matches TC001 step 7 | Confirm bug is related to first slot, not default |

---

## Expected vs Actual Behavior

### Expected Behavior
```
Session Default Slot Type: Test Billable
First Slot Slot Type: Test Billable → Changed to "Test Slot Type - Phlebotomy"
New Slot (outside range): Should use "Test Billable" (session default)
```

### Actual Bug Behavior
```
Session Default Slot Type: Test Billable
First Slot Slot Type: Changed to "Test Slot Type - Phlebotomy"
New Slot (outside range): ❌ Shows "Test Slot Type - Phlebotomy" (from first slot)
```

---

## Bug Classification

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium |
| **Priority** | Medium |
| **Type** | Logic Bug - Incorrect data inheritance |
| **Impact** | Incorrect slot type assignment affects billing, reporting, and scheduling accuracy |
| **Reproducibility** | 100% - Consistent reproduction when steps followed |

---

## Root Cause Hypothesis
When adding a new slot outside the session's time range, the code incorrectly references the first slot's Slot Type instead of the session's default Slot Type setting.

---

## Screenshots/Videos Required
1. Session Editor with first slot's Slot Type changed
2. New slot added outside range showing incorrect Slot Type
3. Session default Slot Type setting visible

---

## Test Session Data

### Session: APTEST1
- Slot Types: Sean Test 7366, [Bootcamp] Phlebotomy, [Bootcamp] Coil Fitting, [Bootcamp] Spirometry
- Weekdays: —
- Frequency: —
- Duration: 10 minutes

### Session: ABCDE 7081
- Slot Types: test by handsome mike 4 Jul 1, Test Billable, Test Slot Type - Phlebotomy, PC24 GP Test, PC24 Nurse Test
- Weekdays: —
- Frequency: —
- Duration: 10 minutes

---

## Notes
- Bug can be reproduced using any session with at least 2 different slot types
- The key is changing the first slot's type before adding a new slot outside the range
- The bug may also occur when adding slots at the beginning of the range if the first slot's type was changed
