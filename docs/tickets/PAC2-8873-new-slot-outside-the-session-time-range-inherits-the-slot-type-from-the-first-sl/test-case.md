# PAC2-8873 - Test Case

## Ticket
**PAC2-8873:** New slot outside the session time range inherits the slot type from the first slot

## Bug Summary
When adding a new slot outside the session's configured time range, the new slot incorrectly inherits the Slot Type from the first slot instead of using the session's default Slot Type.

## Test Environment
- **URL:** `blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8873/`
- **Login:** `blinx_johnny.bravo` / `Blinx!82`
- **Org:** General Practice (Demo Site)
- **Role:** Blinx Deployment

## Test Data Required
1. **Session** with multiple slots (e.g., "Test Billable" slot type)
2. **Slot Types:** At least 2 different types (e.g., "Test Billable", "Test Slot Type")
3. **Session** with configured time range (e.g., 10:00 - 12:00)

## Test Steps

### Precondition
- User is logged in with appropriate permissions
- User is in Configuration → Appointment Books → Sessions

### Test Case 1: Add Slot Outside Range After Changing First Slot Type
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create or select a session with multiple slots (e.g., 10:00-12:00 with 4 slots) | Session has default Slot Type (e.g., "Test Billable") |
| 2 | Open Session Editor/Preview for this session | Session Editor modal opens |
| 3 | Change the Slot Type of the first slot to a different type (e.g., "Test Slot Type") | First slot now shows "Test Slot Type" |
| 4 | Add a new slot with time outside the session range (e.g., 11:45-12:15) | New slot appears in the slot list |
| 5 | Observe the Slot Type of the newly added slot | **ACTUAL BUG:** New slot shows "Test Slot Type" (inherited from first slot) |
| 6 | Verify expected behavior | **EXPECTED:** New slot should show "Test Billable" (session's default Slot Type) |

### Test Case 2: Add Slot Inside Range (Control Test)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create or select a session with multiple slots | Session has default Slot Type |
| 2 | Change first slot's Slot Type to different type | First slot shows new type |
| 3 | Add a new slot WITHIN the session range | New slot appears |
| 4 | Verify Slot Type of new slot | New slot should use session's default (control test) |

## Expected vs Actual Behavior

### Expected
- New slot outside time range → should use session's default Slot Type
- This ensures slot types remain consistent regardless of slot position or timing

### Actual (Bug)
- New slot outside time range → inherits Slot Type from first slot
- This causes incorrect slot type assignment when adding slots outside the configured range

## Bug Severity
**Medium** - Incorrect data assignment that affects billing/reporting accuracy

## Test Data Setup
1. Navigate to: Configuration → Appointment Books → Sessions
2. Create or select session "APTEST1" or similar with test data
3. Ensure session has:
   - Multiple slots
   - Default Slot Type configured
   - Time range (e.g., 10:00 - 12:00)

## Notes
- Bug reproduced in video evidence (see attached video)
- Slot Types can be created/modified in Configuration → Slot Types
- Session Editor accessed via double-click or action button on session row
