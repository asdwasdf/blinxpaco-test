# PAC2-6996 Requirements

## Ticket

- **Key**: PAC2-6996
- **Title**: A25 - Blank filter appearing under Patient Name in filter menu
- **Type**: Bug
- **Parent Epic**: PAC2-7081 (October 2026 PACO Connect & Appointment Book Mop Up)
- **Label**: `Appointment_Book`

## Description

On the filter menu under 'Patient Name' there is a blank filter that should not be there.

## Affected PACO Module

- **Module**: Appointment Book (PACO Connect)
- **Component**: Filter menu / Patient Name filter
- **Epic**: PAC2-7081

## User Roles

- Super Admin GB (primary observer from previous Appointment Book flows)
- Any role with access to Appointment Book

## Functional Requirements

| ID | Requirement | Classification | Source |
|----|-------------|---------------|--------|
| PAC2-6996-FR-001 | Filter menu in Appointment Book must not display blank/empty filter options under the "Patient Name" section | Bug Fix | ticket description |

## Acceptance Criteria

AC-001: Opening the filter menu in Appointment Book should not show any blank filter option below "Patient Name"
AC-002: Only valid, non-empty filter options should appear in the Patient Name section

## QA Results (from Jira comments)

| Tester | Result | Comment |
|--------|--------|---------|
| Sean Huynh | PASSED | QA on FB (2026-10-07) |
| Alexander Paul | PASSED | Regression DEV (2026-10-07) |
| Michael Ramella | Failed | Smoke test (2026-10-07, screenshot evidence) |
| Alexander Paul | PASSED | FB (2026-10-07, after fix) |

## Test Scenarios

1. **SC-001**: Open Appointment Book → open filter menu → verify no blank filter under "Patient Name"
2. **SC-002**: Apply Patient Name filter → verify filter works correctly with valid patient name
3. **SC-003**: Open filter menu → expand Patient Name section → check all options are non-blank

## Setup Requirements

- Authenticated session with access to Appointment Book
- Dev environment: `https://blinx.dev.blinxpaco-np.com`
- Role: Super Admin GB or equivalent

## Notes

- Michael Ramella's smoke test failure (screenshot `image-20261007-192039.png`) captured the bug state pre-fix
- Alexander Paul's regression DEV pass confirms fix on DEV
- Sean Huynh + Alexander Paul's FB passes confirm fix on FB
- Parent epic PAC2-7081 = "October 2026 - PACO Connect & Appointment Book Mop Up"
