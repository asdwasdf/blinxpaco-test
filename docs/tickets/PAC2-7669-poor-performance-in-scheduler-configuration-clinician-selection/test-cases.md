# PAC2-7669 — Test Cases

**Ticket:** PAC2-7669 — Poor Performance in Scheduler Configuration Clinician Selection
**Date:** 2026-10-01

## Test Case Inventory

### TC-7669-001: Clinician Selection Performance
- **Requirement:** REQ-7669-001
- **Risk:** Critical
- **Priority:** High
- **Maturity:** Ready
- **Mutation:** None

**Environment:** dev
**Role:** Super Admin GB
**Location:** ✓ Verified

**Preconditions:**
- Logged in as Super Admin GB
- On Scheduler Configuration page (`/configuration/#scheduler-config`)

**Test Data:**
- Any available campaign with clinicians

**Steps:**
1. Open Scheduler Configuration
2. Select a campaign (wait for load)
3. Click to open clinician dropdown
4. Select a clinician
5. Measure time from click to clinician appearing

**Expected Result:**
- Clinician appears within 1 second
- No significant delay (>5 seconds pre-fix behavior)

**Observable:**
- Selection appears quickly
- No spinner/loading indicator blocking UI

**Postconditions:** None (read-only)

---

### TC-7669-002: No Page Timeout
- **Requirement:** REQ-7669-002
- **Risk:** High
- **Priority:** High
- **Maturity:** Ready
- **Mutation:** None

**Environment:** dev
**Role:** Super Admin GB
**Location:** ✓ Verified

**Preconditions:**
- Logged in as Super Admin GB

**Test Data:** Any campaign

**Steps:**
1. Open Scheduler Configuration
2. Select a campaign
3. Open clinician dropdown
4. Select clinician

**Expected Result:**
- No "waiting for this page to respond" popup
- UI remains responsive throughout

**Observable:**
- Browser does not show unresponsive warning
- Page responds to interactions

**Postconditions:** None

---

### TC-7669-003: No Crash on Multiple Selections
- **Requirement:** REQ-7669-003
- **Risk:** High
- **Priority:** Medium
- **Maturity:** Ready
- **Mutation:** None

**Environment:** dev
**Role:** Super Admin GB
**Location:** ✓ Verified

**Preconditions:**
- Logged in as Super Admin GB

**Test Data:** Any campaign with multiple clinicians

**Steps:**
1. Open Scheduler Configuration
2. Select a campaign
3. Select Clinician A
4. Clear selection
5. Select Clinician B
6. Clear selection
7. Select Clinician A again

**Expected Result:**
- UI remains responsive
- No page crash or freeze
- All selections work correctly

**Observable:**
- Page stays responsive
- No crash/restart needed

**Postconditions:** None

---

### TC-7669-004: EMIS Org Clinician Selection (Cross-Org)
- **Requirement:** REQ-7669-001, REQ-7669-002
- **Risk:** Medium
- **Priority:** Medium
- **Maturity:** Preliminary (pending PACO Connect org verification)
- **Mutation:** None

**Environment:** dev
**Role:** Super Admin GB
**Location:** ✓ Verified (same route, different org context)

**Preconditions:**
- Logged in as Super Admin GB
- Switched to EMIS organization with proxy enabled

**Test Data:** EMIS org with campaign

**Steps:**
1. Switch to EMIS org
2. Open Scheduler Configuration
3. Select campaign
4. Select clinician

**Expected Result:**
- Same performance as TC-7669-001
- No timeout/crash

**Blocked:** Need EMIS org with proxy to test

---

### TC-7669-005: PACO Connect Org Clinician Selection (Cross-Org)
- **Requirement:** REQ-7669-001, REQ-7669-002
- **Risk:** Medium
- **Priority:** Medium
- **Maturity:** Preliminary (pending PACO Connect org verification)
- **Mutation:** None

**Environment:** dev
**Role:** Super Admin GB
**Location:** ✓ Verified (same route, different org context)

**Preconditions:**
- Logged in as Super Admin GB
- Access to PACO Connect organization

**Test Data:** PACO Connect org with campaign

**Steps:**
1. Switch to PACO Connect org
2. Open Scheduler Configuration
3. Select campaign
4. Select clinician

**Expected Result:**
- Same performance as TC-7669-001
- No timeout/crash

**Blocked:** Need PACO Connect org to test

## QA Blockers/Warnings

| Case | Blocker | Status |
|------|---------|--------|
| TC-7669-004 | Need EMIS org with proxy enabled | Open |
| TC-7669-005 | Need PACO Connect org access | Open |

## Execution Summary

| Case ID | Requirement | Risk | Priority | Mutation | Status |
|---------|-------------|------|----------|----------|--------|
| TC-7669-001 | REQ-7669-001 | Critical | High | None | Ready |
| TC-7669-002 | REQ-7669-002 | High | High | None | Ready |
| TC-7669-003 | REQ-7669-003 | High | Medium | None | Ready |
| TC-7669-004 | REQ-7669-001,002 | Medium | Medium | None | Blocked |
| TC-7669-005 | REQ-7669-001,002 | Medium | Medium | None | Blocked |

## Tester notes

[Protected area]
