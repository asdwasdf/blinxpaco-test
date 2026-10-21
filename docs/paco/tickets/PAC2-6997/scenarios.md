# PAC2-6997 — Scenarios

## SC-6997-001 — Patient Status whitelist filter

**Entry**: `https://blinx.dev.blinxpaco-np.com/paco/dashboard` → Appointment Book → Day View
**Preconditions**: Logged in as Deployment role; session with a booking that has no patient status
**Mutation class**: `None` (read-only verification)
**Steps**:
1. Navigate to Appointment Book Day View (e.g. 7 Oct 2026 or any date with a no-status booking)
2. Locate the `Patient Status` filter section in the filter toolbar/sidebar
3. Verify current Patient Status filter state (all or partial selected)
4. Deselect all Patient Status options
5. Note the Booked count shown
6. Tick only `Patient Arrived`
7. Observe: no-status bookings are hidden; only arrived patients show
8. Verify Booked count drops (post-fix: from 22 → 1)
9. Deselect all Patient Status
10. Verify Booked count = 0

**Expected**: only patients matching selected Patient Status shown; no-status excluded
**Mutation**: None

## SC-6997-002 — Session menu reads hidden bookings

**Entry**: same session as SC-6997-001
**Preconditions**: After SC-6997-001 step 9 — all Patient Status deselected, no-status booking still in session but row hidden
**Mutation class**: `None`
**Steps**:
1. Right-click any slot in the session "Sean Test 8873" (or any session with a hidden booking)
2. Observe the session context menu options

**Expected**: menu shows "Cancel session appointments" (not "Block Session"), "Message Session Patients" is enabled
**Mutation**: None

## SC-6997-003 — Filter state persistence across deselect/reselect

**Entry**: same session
**Preconditions**: After SC-6997-002
**Mutation class**: `None`
**Steps**:
1. Verify the previously hidden row cannot be booked (no gap rows, no click-to-book)
2. Re-tick `Patient Arrived`
3. Verify the hidden booking row reappears
4. Verify session data is unchanged (booking still exists in backend)

**Expected**: row reappears on re-tick; session data preserved
**Mutation**: None
