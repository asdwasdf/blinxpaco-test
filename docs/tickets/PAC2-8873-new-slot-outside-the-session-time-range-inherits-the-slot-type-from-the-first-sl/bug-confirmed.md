# PAC2-8873 - BUG CONFIRMED

## Reproduction Evidence

**Session:** `PAC2-8873 Manual Sess...`
**Time Range:** 10:00 - 13:10
**Test Date:** 2026-10-07
**Tester:** Manual QA

## Bug Status: ✅ CONFIRMED

### Steps to Reproduce:
1. Create session `PAC2-8873 Manual Sess...` with:
   - Duration: 10 minutes
   - Time range: 10:00 - 11:00
   - Default Slot Type: `Test Billable`
   - Assigned Slot Types: `Test Billable`, `Test Slot Type - Phlebotomy`
2. Change first slot (10:00-10:10) Slot Type to `Test Slot Type - Phlebotomy`
3. Add new slot at 13:00-13:10 (outside original 10:00-11:00 range)
4. Observe new slot's Slot Type

### Expected Behavior:
- Slot 13:00-13:10 should have Slot Type = `Test Billable` (session default)

### Actual Behavior (BUG):
- Slot 13:00-13:10 has Slot Type = `Test Slot Type - Phlebotomy` (inherited from first slot)

## Impact
All slots in the session (including those outside the original time range) inherit the Slot Type from the first slot instead of using the session's default Slot Type.

## Severity
**Medium** - Incorrect data assignment affects billing, reporting, and scheduling accuracy.

## Screenshot
User provided screenshot showing all 7 slots (10:00-10:50 within range + 13:00-13:10 outside range) all display `Test Slot Type - Phlebotomy` as Slot Type, confirming the bug.
