# PAC2-7165 Requirements

## Ticket
- Key: PAC2-7165
- Summary: Live appointment filter does not update correctly in Year View

## Source
- Jira: https://blinxsolutions.atlassian.net/browse/PAC2-7165
- Imported: 2026-10-07

## Functional Requirements

| ID | Requirement | Classification | Provenance |
|---|---|---|---|
| PAC2-7165-R1 | Year view Live count must include arrived/in-consultation appointments across the whole year | Observed | tony.do comment 2026-10-07 |
| PAC2-7165-R2 | Year Live must match the sum of monthly Live figures | Observed | tony.do comment 2026-10-07 |
| PAC2-7165-R3 | Day/Week/Month Live count appointments in the displayed period | Observed | tony.do comment 2026-10-07 |
| PAC2-7165-R4 | Year Live updates on page load/reload | Observed | tony.do comment 2026-10-07 |

## Affected Modules
- Appointment Book
- Year View
- Live Appointments filter

## User Roles
- Front desk / admin

## Setup Requirements
- Appointment book with known appointments
- Some appointments with Patient Arrived / Consultation Started / Consultation Ended status

## Expected Behavior
- Year view shows total Live appointments (arrived/in-consultation) across the year
- Year Live figure should match Month Live when viewing a single month
- Live count should update when switching to Year view or reloading

## Test Scenarios
- TC1: Year view shows live appointments for the year
- TC2: Year Live matches the month figures for same month
- TC3: Day/Week/Month Live counts work as before
- TC4: Live in Year updates after reload
