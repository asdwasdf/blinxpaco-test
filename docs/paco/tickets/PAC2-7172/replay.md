# PAC2-7172 Replay

## Ticket Summary
- **Title**: PACO Connect: Appointment Details Occasionally Partially Hidden Behind Menu Bar When Starting Health Form Consultation
- **Jira**: https://blinxsolutions.atlassian.net/browse/PAC2-7172
- **Original QA**: PASSED on FB and Regression QA in Dev

## Prerequisites
- Auth: Johnny (2255) Bravo @ Blinx Deployment / General Practice (Demo Site)
- Environment: dev chung (blinx.dev.blinxpaco-np.com)
- Role: Clinician with access to PACO Connect

## Steps Attempted
1. Navigate to `/paco-connect/appointment-book` via sidebar
2. Attempted to find booked appointments to start Health Form Consultation
3. Checked Day/Week/Month/Year views - all show **Booked: 0**
4. Attempted to navigate to past dates with potential appointments
5. Verified Quick Book modal opens but cannot create test appointment

## Expected Result
- Click on a booked appointment → Appointment Details sidebar opens
- Click "Start Health Form Consultation" → Health Form Consultation screen opens
- Verify Appointment Details visibility (bug: sometimes partially hidden behind menu bar)

## Actual Result
- **ENVIRONMENT_ISSUE**: Dev chung currently has **0 booked appointments**
- Unable to locate any booked patient appointments to test the scenario
- Quick Book modal works but creating test data is out of scope for regression verification
- This matches known pattern from PAC2-7127: "booked slots off-screen/zero-height" on dev chung

## Evidence
- Screenshot: `.playwright-mcp/page-2026-10-18T16-24-18-076Z.yml` - Appointment Book with Booked: 0
- Screenshot: `.playwright-mcp/page-2026-10-18T16-25-29-705Z.yml` - Quick Book modal opened

## Jira Comments (Original QA)
- **Sean Huynh (2026-10-07)**: PASSED QA on FB
- **Alexander Paul (2026-10-07)**: PASS ON REGRESSION QA IN DEV

## Result Classification
**ENVIRONMENT_ISSUE**

## Recovery Attempts
1. Navigated through Day/Week/Month/Year views - all show Booked: 0
2. Attempted to navigate to different dates via URL - 404 errors
3. Opened Quick Book modal to verify booking functionality works

## Notes
- The original bug was intermittent (UI layout race condition)
- QA already verified fix on FB and Dev on 2026-10-07
- Dev chung test data stale - cannot reproduce scenario without booked appointments
- This is a known limitation of dev chung (see PAC2-7127 notes about booked slots)
