# PAC2-6997 — Status

## Current Phase

**MANUAL_EXECUTE** — Complete

## Checkpoint

Fix confirmed: Patient Status filter hoạt động đúng. Chỉ hiện patients có status được chọn.

## Test Results

| Case | Expected | Actual | Result |
|------|----------|--------|--------|
| TC1: Filter Patient Arrived | Chỉ Katie Sparrow (1 patient) | Katie Sparrow hiện, Booked = 1 | **Pass** |
| TC2: Deselect all Patient Status | Booked = 0 | Booked = 0, grid trống | **Pass** |
| TC3: 8 Oct, deselect all | Booked = 0 | Booked = 0 | **Pass** |

## Evidence

- Screenshot: `pac2-6997-oct7-arrived.png` — Katie Sparrow với badge "Patient Arrived" (màu tím), Booked count = 1
- Fix deploy: commit `46a458593`, PR #2810, branch `PAC2-7081-2`
- Environment: dev chung

## Summary

- Bug gốc: Patient Status filter trong Appointment Book Day view show cả patients with no status khi filter một status cụ thể
- Fix đã verify: filter hoạt động đúng — chỉ hiện patients có status được tick
- Fix đã deploy trên dev chung

## QA Retest Checklist

- [x] Day view, 7 Oct 2026. Appt Status all ticked, tick only Patient Arrived. Chỉ arrived patients hiện (Booked 1)
- [x] Deselect all Patient Status. No bookings show (Booked 0)
- [x] 8 Oct, Patient Status all deselected: Booked 0

## Next Action

Update manifest → COMPLETE. Không cần automation vì bug fix đã verify Pass.

## Tester notes
