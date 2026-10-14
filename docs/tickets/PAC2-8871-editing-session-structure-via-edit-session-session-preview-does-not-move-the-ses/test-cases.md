# PAC2-8871 Test Cases

## Ticket
- **ID:** PAC2-8871
- **Title:** Editing session structure via Edit Session / Session Preview does not move the session out of its session template folder
- **Feature Branch:** `pac2-8871`
- **Target Environment:** dev (feature branch)

## Test Data Setup

| Data | Description | Cleanup |
|------|-------------|--------|
| `QA-AUTO-8871-Folder` | Session template folder with 2+ sessions | Delete folder after test |
| Test slot types | `[Bootcamp] Phlebotomy`, `[Bootcamp] Coil Fitting` | - |

## Test Case Inventory

### TC-001: Session Preview slot type change orphans session
- **Requirement:** REQ-002
- **AC:** AC1
- **Risk:** Critical
- **Priority:** P1
- **Status:** Final
- **Mutation:** Persistent

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists with 2+ sessions (e.g., `QA-AUTO-8871-TC001`)
- At least one slot type available (e.g., `[Bootcamp] Phlebotomy`)

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Wait for session grid to load
3. Expand folder `QA-AUTO-8871-TC001 (Template — N sessions)`
4. Select a session inside the folder
5. Click `Actions` → `Preview` (or `Edit` → Preview tab)
6. Change slot type from `[Bootcamp] Phlebotomy` to `[Bootcamp] Coil Fitting`
7. Click `Save`
8. Return to session grid

#### Expected Result
- Session moves OUT of the folder and appears as standalone in the grid
- Folder shows (N-1) sessions remaining

#### Postconditions
- Verify orphaned session exists outside folder
- Verify folder still contains N-1 sessions

#### Cleanup
- Delete orphaned session and folder

---

### TC-002: Edit Session slot time change orphans session
- **Requirement:** REQ-001
- **AC:** AC1
- **Risk:** Critical
- **Priority:** P1
- **Status:** Final
- **Mutation:** Persistent

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists with 2+ sessions

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Select session inside folder
4. Click `Actions` → `Edit`
5. Change slot time (e.g., `Hours (From): 08:00` → `09:00`)
6. Click `Save`
7. Return to grid

#### Expected Result
- Session moves OUT of the folder and appears standalone

#### Postconditions
- Orphaned session visible outside folder

#### Cleanup
- Delete orphaned session and folder

---

### TC-003: No orphan when Edit Session has no changes
- **Requirement:** REQ-003
- **AC:** AC4
- **Risk:** High
- **Priority:** P2
- **Status:** Final
- **Mutation:** None (read-only observation)

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists with 2+ sessions

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Select session inside folder
4. Click `Actions` → `Edit`
5. Open Edit Session drawer
6. Click `Save` WITHOUT making any changes

#### Expected Result
- Session stays INSIDE the folder
- Folder still shows N sessions

#### Postconditions
- No state change

#### Cleanup
- None needed

---

### TC-004: No orphan when Session Preview has no changes
- **Requirement:** REQ-004
- **AC:** AC4
- **Risk:** High
- **Priority:** P2
- **Status:** Final
- **Mutation:** None (read-only observation)

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists with 2+ sessions

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Select session inside folder
4. Click `Actions` → `Preview`
5. Click `Save` WITHOUT making any changes

#### Expected Result
- Session stays INSIDE the folder

#### Postconditions
- No state change

#### Cleanup
- None needed

---

### TC-005: Standalone session not affected by folder bulk edit
- **Requirement:** REQ-005
- **AC:** AC2
- **Risk:** Critical
- **Priority:** P1
- **Status:** Final
- **Mutation:** Persistent

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder with 2+ sessions

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder, select one session, click `Edit`, change slot type, Save → session orphans
3. Verify orphaned session exists outside folder
4. Select the folder (click folder row)
5. Make a bulk edit to the folder (e.g., change clinician)

#### Expected Result
- Orphaned session is NOT affected by folder bulk edit
- Orphaned session retains its changed slot type

#### Postconditions
- Orphaned session unchanged after folder bulk edit

#### Cleanup
- Delete orphaned session and folder

---

### TC-006: Length change still orphans session (regression)
- **Requirement:** REQ-006
- **AC:** AC3
- **Risk:** High
- **Priority:** P1
- **Status:** Final
- **Mutation:** Persistent

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Select session inside folder
4. Click `Actions` → `Edit`
5. Change session length (e.g., `Slot Duration: 10` → `15`)
6. Save

#### Expected Result
- Session moves OUT of the folder (regression check)

#### Postconditions
- Session orphaned

#### Cleanup
- Delete orphaned session and folder

---

### TC-007: Clinician change still orphans session (regression)
- **Requirement:** REQ-006
- **AC:** AC3
- **Risk:** High
- **Priority:** P1
- **Status:** Final
- **Mutation:** Persistent

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Select session inside folder
4. Click `Actions` → `Edit`
5. Change clinician/staff assignment
6. Save

#### Expected Result
- Session moves OUT of the folder

#### Postconditions
- Session orphaned

#### Cleanup
- Delete orphaned session and folder

---

### TC-008: Location change still orphans session (regression)
- **Requirement:** REQ-006
- **AC:** AC3
- **Risk:** High
- **Priority:** P1
- **Status:** Final
- **Mutation:** Persistent

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Select session inside folder
4. Click `Actions` → `Edit`
5. Change location
6. Save

#### Expected Result
- Session moves OUT of the folder

#### Postconditions
- Session orphaned

#### Cleanup
- Delete orphaned session and folder

---

### TC-009: Clash menu appears after session orphaning creates overlap
- **Requirement:** REQ-007
- **AC:** (QA regression concern)
- **Risk:** High
- **Priority:** P2
- **Status:** Preliminary
- **Mutation:** Persistent
- **Blocker:** Needs investigation - PAC2-8867 relationship unclear

#### Preconditions
- Logged in as `Super Admin GB`
- Session template folder exists

#### Steps
1. Navigate to `/paco-connect/feature-branch/pac2-8871/configuration`
2. Expand folder
3. Edit one session to orphan it
4. Edit the orphaned session to overlap with another session (same time slot)
5. Observe if clash menu appears

#### Expected Result
- Clash menu appears when sessions overlap

#### Actual (reported regression)
- No clash menu appears; overlap goes through unflagged

#### Postconditions
- Verify overlap created

#### Cleanup
- Delete test sessions

#### Open Question
- Is this a separate bug (PAC2-8867) or related to 8871 fix?

---

## Case Summary

| ID | Requirement | Risk | Priority | Mutation | Status |
|----|-------------|------|----------|----------|--------|
| TC-001 | REQ-002 | Critical | P1 | Persistent | Final |
| TC-002 | REQ-001 | Critical | P1 | Persistent | Final |
| TC-003 | REQ-003 | High | P2 | None | Final |
| TC-004 | REQ-004 | High | P2 | None | Final |
| TC-005 | REQ-005 | Critical | P1 | Persistent | Final |
| TC-006 | REQ-006 | High | P1 | Persistent | Final |
| TC-007 | REQ-006 | High | P1 | Persistent | Final |
| TC-008 | REQ-006 | High | P1 | Persistent | Final |
| TC-009 | REQ-007 | High | P2 | Persistent | Preliminary |

## Location Status

| Case | Location Valid | Blocker |
|------|---------------|---------|
| TC-001 to TC-008 | Yes | None |
| TC-009 | Partial | PAC2-8867 relationship unclear |

## Environment & Role

- **Environment:** dev (feature branch `pac2-8871`)
- **URL:** `/paco-connect/feature-branch/pac2-8871/configuration`
- **Role:** `Super Admin GB`
- **Test Data Prefix:** `QA-AUTO`

## Tester notes

[Protected area]
