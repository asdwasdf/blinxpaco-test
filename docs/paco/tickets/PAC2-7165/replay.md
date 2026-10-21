# PAC2-7165 Replay

## Ticket
- Key: PAC2-7165
- Summary: Live appointment filter does not update correctly in Year View

## Environment
- Host: blinx.dev.blinxpaco-np.com
- Role: Admin (Blinx Deployment)
- Executed: 2026-10-18T16:05:00Z

## Prerequisites
- Logged in to Paco Connect
- Appointment Book selected

## Test Scenarios

### TC1: Year view shows live appointments for the year

**Steps:**
1. Navigate to Appointment Book
2. Click Year view button

**Expected:** Year Live counts arrived/in-consultation appointments across the year

**Actual:** Year view shows **LIVE 23** - correct count displayed

**Result:** PASS

### TC2: Year Live matches month figures

**Steps:**
1. In Year view, click October month cell
2. Note October Live count
3. Switch to Month view for October

**Expected:** Year Live for October equals Month Live for October

**Actual:** Year view header shows LIVE 23 total, but does NOT display monthly breakdown with Live per month. Cannot compare October-specific figures between Year and Month views.

**Result:** PARTIAL - Year Live total works, but no monthly Live breakdown visible in Year grid

### TC3: Day/Week/Month Live counts work as before

**Steps:**
1. Switch to Month view
2. Observe Live count

**Expected:** Month Live shows appointments in the displayed period

**Actual:** Month view shows **LIVE 3** for October

**Result:** PASS

### TC4: Live in Year updates after reload

**Steps:**
1. Reload page
2. Click Year view
3. Observe Live count

**Actual:** Year view shows **LIVE 23** on reload

**Result:** PASS

## Summary

| Scenario | Expected | Actual | Result |
|---|---|---|---|
| TC1: Year Live for year | Live = arrived/in-consultation in year | Live 23 | PASS |
| TC2: Year Live vs Month Live | October in Year = October in Month | No monthly breakdown in Year | PARTIAL |
| TC3: Month Live | Live = arrived/in-consultation in month | Live 3 | PASS |
| TC4: Year Live on reload | Live updates on reload | Live 23 | PASS |

## Jira Evidence
- Original bug: Year Live showed 0 (only checked today's appointments)
- Fix deployed: commit 46a458593 on branch PAC2-7081-2
- Re-test on FB: Year Live = 54, Month Oct Live = 10 (match)

## Current State (2026-10-18)
- Bug FIX confirmed: Year view now shows Live count (not 0)
- Year Live = 23 (vs 0 before fix)
- Month view Live = 3 (current October)
- **Missing**: Monthly Live breakdown in Year grid not visible in current UI

## Result Classification
- **PASS (Verified)**: Core bug fixed - Year Live no longer shows 0
- **PARTIAL**: Monthly Live breakdown not visible in Year grid to compare with Month view

## Jira Link
https://blinxsolutions.atlassian.net/browse/PAC2-7165
