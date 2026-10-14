# Test Cases: PAC2-8867

**Input Revision:** 1
**Design Maturity:** Explored
**Generated:** 2026-10-06T14:50:00Z

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-PAC2-8867-001 | TC-001, TC-005 | Basic + Smoke | None |
| REQ-PAC2-8867-002 | TC-002 | Clash tool | Clash tool UI not observed |
| REQ-PAC2-8867-003 | TC-003 | Multi-clinician | No video evidence |
| REQ-PAC2-8867-004 | TC-004 | Session moved date | No video evidence |
| REQ-PAC2-8867-005 | — | N/A | Known limitation, not testable |

## Cases

### PAC2-8867-TC-001 — Session leaves folder, parent folder edit does not recreate duplicate

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8867-001
**Expected-result basis:** Confirmed — ticket.md:14-15
**UI-dependent:** Yes
**Feature Location:** Confirmed (`feature-location.md` + `exploration.md`)
**Entry Path:** `/paco/dashboard` → sidebar `Appointment Book` → `Appointment Settings` → `/paco-connect/configuration`
**Context:** Configuration / Sessions
**Environment:** dev (feature branch TBD)
**Role:** Admin
**Preconditions:**
- Folder template exists with ≥2 child sessions across different dates
- At least 1 child session is still part of folder
**Test Data Category:** QA-managed
**Test Data:** `QA-AUTO-PAC2-8867-TC001` folder with 2 sessions on different dates (e.g., Mon + Tue)
**Mutation Class:** Persistent
**Approval Required:** No (mutation guard enabled)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/paco-connect/configuration` | Sessions grid loads |
| 2 | Search for `QA-AUTO-PAC2-8867-TC001` | Folder template row visible with `(Template — 2 sessions)` suffix |
| 3 | Click expand arrow `▾` on folder row | Child sessions visible, indented below parent |
| 4 | Note child session dates and names | Two sessions on different dates visible |
| 5 | Click Actions button on first child session | Actions menu opens: Edit, View Audit, Archive, Clone, Delete, Cancel session appointments |
| 6 | Click `Edit` | Edit Session drawer opens with all fields populated |
| 7 | Change `Slot Duration` (e.g., 10 → 20 min) or `Time Range` | Field updated |
| 8 | Click `Save` | Drawer closes; session updated in grid |
| 9 | Wait 2s; verify session still visible in grid | Session appears in grid, now independent (not under folder) |
| 10 | Collapse folder (click `▴` arrow) | Folder collapses; child session count decreases by 1 |
| 11 | Expand folder again | Only 1 child session visible under folder |
| 12 | Click Actions button on folder parent row | Actions menu opens |
| 13 | Click `Edit` on folder row | Folder edit drawer opens |
| 14 | Change `Slot Duration` (e.g., 10 → 15 min) | Field updated |
| 15 | Click `Save` on folder drawer | Folder saved |
| 16 | Reload page | Page refreshes |
| 17 | Search for `QA-AUTO-PAC2-8867-TC001` | Folder template visible with `(Template — 2 sessions)` |
| 18 | Expand folder | 2 child sessions visible |
| 19 | Verify no duplicate session exists | Only 2 sessions under folder; independent session from step 9 is separate row |

**Postconditions:** Folder has 2 child sessions; 1 independent session exists separately (from step 9).
**Cleanup:** Archive/delete folder template and all child sessions; archive/delete independent session.
**Automation:** Later — Add Session form has React state sync issues with MCP (PAC2-8241 Issue 2). Folder template creation + session leave flow requires multiple mutations.
**Evidence:** `feature-location.md`, `exploration.md`, `requirements.md`
**Execution History:** None

---

### PAC2-8867-TC-002 — Clash tool clearly distinguishes existing vs new session

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-PAC2-8867-002
**Expected-result basis:** Confirmed — ticket.md:17-19 (suggested fix); clash tool UI not yet observed
**UI-dependent:** Yes
**Feature Location:** Not observed — clash tool appears only when duplicate detected
**Entry Path:** Same as TC-001
**Context:** Configuration / Sessions / Clash resolution
**Environment:** dev (no fix deployed — bug state)
**Role:** Admin
**Preconditions:**
- Session has already left folder (state from TC-001 step 9)
- Folder edit will trigger duplicate detection
**Test Data Category:** Continues from TC-001
**Test Data:** Independent session from TC-001 step 9 + same date under folder
**Mutation Class:** Persistent
**Approval Required:** No (mutation guard enabled)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Continue from TC-001 state | Folder with 1 child + 1 independent session on same date |
| 2 | Edit parent folder (change Slot Duration) | Folder saved |
| 3 | Observe clash/resolution dialog | Dialog appears with options; each option clearly labeled with session identifier (name/date/time) |
| 4 | Verify session distinction | Options clearly state which is "existing" and which is "new from folder" |

**Postconditions:** Depends on chosen clash option.
**Cleanup:** Delete all test sessions.
**Automation:** Later — depends on TC-001 execution and bug presence.
**Evidence:** `requirements.md` REQ-PAC2-8867-002
**Execution History:** None
**Open Questions:**
- Exact clash tool UI not observed — options and labels unknown. **QA must provide:** What are the exact options? What text distinguishes the sessions?

---

### PAC2-8867-TC-003 — Multi-clinician: only clinician group that left is skipped

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-PAC2-8867-003
**Expected-result basis:** Inferred — tony.do 2026-10-06 fix description
**UI-dependent:** Yes
**Feature Location:** Confirmed (same as TC-001)
**Entry Path:** Same as TC-001
**Context:** Configuration / Sessions
**Environment:** dev (feature branch TBD)
**Role:** Admin
**Preconditions:**
- Folder template with ≥2 clinicians assigned on same date
- One clinician's session has left the folder
**Test Data Category:** QA-managed
**Test Data:** `QA-AUTO-PAC2-8867-TC003` folder with multi-clinician on same date
**Mutation Class:** Persistent
**Approval Required:** No (mutation guard enabled)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/paco-connect/configuration` | Sessions grid loads |
| 2 | Create/search `QA-AUTO-PAC2-8867-TC003` folder with ≥2 clinicians | Folder visible |
| 3 | Expand folder; note clinicians and dates | Multiple clinicians visible on same date |
| 4 | Edit one clinician's session (change Slot Duration) | Session leaves folder |
| 5 | Collapse and re-expand folder | Clinician count decreases by 1 for that date |
| 6 | Edit parent folder (change Slot Duration) | Folder saved |
| 7 | Verify: clinicians that stayed are recreated | All clinicians except the one that left have sessions under folder |
| 8 | Verify: clinician that left remains independent | Independent session exists separately |

**Postconditions:** Folder has sessions for clinicians that stayed; independent session exists for clinician that left.
**Cleanup:** Archive/delete all test sessions.
**Automation:** Later — requires folder creation + multi-clinician setup.
**Evidence:** `requirements.md` REQ-PAC2-8867-003
**Execution History:** None

---

### PAC2-8867-TC-004 — Session moved to different date: folder skips original date only

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-8867-004
**Expected-result basis:** Inferred — tony.do 2026-10-06 fix description
**UI-dependent:** Yes
**Feature Location:** Confirmed (same as TC-001)
**Entry Path:** Same as TC-001
**Context:** Configuration / Sessions
**Environment:** dev (feature branch TBD)
**Role:** Admin
**Preconditions:**
- Session has left folder and been moved to a different date
**Test Data Category:** QA-managed
**Test Data:** `QA-AUTO-PAC2-8867-TC004` — folder with session on Date A; session moved to Date B
**Mutation Class:** Persistent
**Approval Required:** No (mutation guard enabled)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/paco-connect/configuration` | Sessions grid loads |
| 2 | Search `QA-AUTO-PAC2-8867-TC004` | Folder visible |
| 3 | Expand folder | Child sessions visible on Date A and Date B |
| 4 | Verify session on Date A is independent (not under folder) | Date A session exists outside folder |
| 5 | Verify session on Date B is under folder | Date B session visible under folder |
| 6 | Edit parent folder (change Slot Duration) | Folder saved |
| 7 | Verify no new session created for Date A | Only independent session on Date A; no duplicate under folder |
| 8 | Verify Date B session updated | Date B session reflects folder changes |

**Postconditions:** Date A has independent session only; Date B has folder child session.
**Cleanup:** Archive/delete all test sessions.
**Automation:** Later — requires session move mutation.
**Evidence:** `requirements.md` REQ-PAC2-8867-004
**Execution History:** None

---

### PAC2-8867-TC-005 — Smoke: folder edit with all sessions intact (no session left)

**Type:** Smoke
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-PAC2-8867-001 (negative case)
**Expected-result basis:** Confirmed — basic folder edit should work normally
**UI-dependent:** Yes
**Feature Location:** Confirmed
**Entry Path:** Same as TC-001
**Context:** Configuration / Sessions
**Environment:** dev (feature branch TBD)
**Role:** Admin
**Preconditions:**
- Folder template with ≥2 sessions, all intact (no session left)
**Test Data Category:** Existing
**Test Data:** `Dev Book (Template — 4 sessions)` — dates 09-12/07/2026
**Mutation Class:** Persistent
**Approval Required:** No (mutation guard enabled)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/paco-connect/configuration` | Sessions grid loads |
| 2 | Search for `Dev Book` | Folder template visible with `(Template — 4 sessions)` |
| 3 | Expand folder | 4 child sessions visible with dates 09-12/07/2026 |
| 4 | Click Actions on folder parent row → `Edit` | Folder edit drawer opens |
| 5 | Change `Slot Duration` (e.g., 10 → 15 min) | Field updated |
| 6 | Click `Save` | Drawer closes |
| 7 | Reload page | Page refreshes |
| 8 | Search for `Dev Book`; expand | 4 child sessions visible under folder |
| 9 | Verify no extra/duplicate sessions | Exactly 4 child sessions |

**Postconditions:** Folder with 4 child sessions, all intact.
**Cleanup:** None (uses existing data)
**Automation:** Yes — folder expand + edit is less complex than creation
**Evidence:** `exploration.md` (Dev Book template data)
**Execution History:** None

---

## Open Questions and Blockers

| Item | Impact | Action |
|---|---|---|
| Clash tool exact UI (options, labels, text) | TC-002 expected results | QA must provide observed clash tool behavior or clarify expected labels |
| Add Session form React state sync | TC-001/003/004 setup | PAC2-8241 Issue 2 blocked same form; manual setup or API approach needed |
| DB fix deployment status | All mutation TCs | Bug may not reproduce if paco-one-db #1000 deployed |
| Session move to different date | TC-004 setup | Requires additional mutation to move session date |

## Tester notes
