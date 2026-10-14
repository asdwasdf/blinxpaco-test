# Test Cases: PAC2-9001

**Input Revision:** 2
**Design Maturity:** Preliminary (entry-point not confirmed; OQ-033 + OQ-030 blockers active)
**Generated:** 2026-10-14T00:00:00Z
**AC source:** tony.do comment 2026-10-13T14:31:47Z (matrix 7×3 + 9 scenarios)
**Video source:** `attachments/129284-pac2-9001-browser-qa.mp4` (456.7s, 1600×960, no audio)
**Video review:** `docs/tickets/PAC2-9001-pbt-334-cancelling-session-needs-to-be-behind-a-admin-type-rbac/video/video-notes.md`

## Coverage Map

| Requirement | Cases | Coverage | Gap |
|---|---|---|---|
| REQ-001 Cancel session (RBAC gate) | TC-001 (User no P7032), TC-002 (User+P7032), TC-003 (Admin) | Full role matrix | Entry-point OQ-033 not confirmed; session with ≥1 booking needed |
| REQ-002 Cancel single future appt | TC-004 | Covered | Existing path only |
| REQ-003 Cancel past appt | TC-005 | Covered | Admin-only confirmed |
| REQ-004 Block empty session | TC-006 | Covered (empty session) | Block on booked session (OQ-031) not covered |
| REQ-005 Change session details | TC-007 | Covered (Edit drawer) | Entry-point for Edit confirmed; time-edit triggered by template edit only |
| REQ-006 Remove archive session | TC-008 | Covered (Admin only) | Row kebab entry (OQ-032) not confirmed |
| REQ-007 Cancel from Config → Sessions | TC-009 | Covered (Admin only) | Row kebab content (OQ-032) not confirmed; P7032 deploy (OQ-030) prerequisite |
| REQ-008 Time-edit dialog | TC-010 | Covered (template edit) | Template edit trigger data (OQ-034) not available on dev |
| REQ-009 P7032 visibility | TC-011 | Covered (Role Groups) | paco-one-db #1022 deploy status (OQ-030) prerequisite |
| REQ-010 Out of scope | — | — | Tracked separately |

## Cases

---

### PAC2-9001-TC-001 — Cancel session: User (no P7032) → Access Denied

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-001
**Expected-result basis:** `Confirmed` — AC table row "Cancel session (appointment book)" + scenario 1 (`ticket.md:86`)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — session card buttons (Edit pencil + Note icon) verified; Cancel session entry NOT found in session card, EDIT drawer, or right-click on session name. LOCATE attempt-4 R-2 inconclusive. Entry point must be at **patient slot row level** (candidate C-1). Blocked by OQ-033.
**Entry Path:** Not confirmed — candidate: patient slot row inside expanded session accordion, or session detail page
**Context:** global / appointment-book / session
**Environment:** dev (`blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-9001/`)
**Role:** Appointment Book User (no P7032) — `J2B` / `Johnny Bravo` per video header
**Preconditions:**
- Session with ≥1 appointment booking available on dev (dev has "Dan E2E test" with 3 bookings per video; current available: Temi PCN session with slot 10:30 showing ≥1 patient)
- User role authenticated as Appt Book User without P7032
- P7032 activity visible in `/paco/configuration/staff/role-groups` (requires paco-one-db #1022 deploy — OQ-030 blocker)
**Test Data Category:** Synthetic — QA-created session with ≥1 booking
**Test Data:** Session name: `Dan E2E test` (3 bookings, per video) or `Temi PCN` slot 10:30 (≥1 booking, current dev)
**Mutation Class:** Temporary (Cancel dialog → confirm → appointment cancelled; must be reversed by re-booking in test cleanup)
**Approval Required:** Yes (mutation on appointments)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as Appt Book User (no P7032) | Authenticated; role header shows "J2B" or equivalent non-Admin persona |
| 2 | Navigate to `/paco-connect/feature-branch/pac2-9001/appointment-book` | Day view loads; sessions listed |
| 3 | Select date with booked session (13 Oct 2026, or date with "Dan E2E test") | Session with ≥1 booking visible |
| 4 | **Locate entry point** — expand session accordion, then right-click patient slot row | **Entry point not confirmed** — tester to find: patient slot row level, or kebab, or patient row context menu. TC-001 result depends on finding this control. |
| 5 | Invoke "Cancel session appointments" | Option is **visible** in menu (per AC scenario 1: "Option is visible; clicking → Access Denied") |
| 6 | Click "Cancel session appointments" | "Access Denied" dialog opens — exact text: `"You do not have permissions to perform this action. Contact your administrator."` (generic copy) + `OK` button |
| 7 | Click `OK` | Dialog closes; nothing cancelled; appointments still present in session |

**Postconditions:** Session and appointments unchanged; Access Denied dialog shown.
**Cleanup:** None needed (no mutation occurred on confirm step).
**Automation:** Later (entry point not confirmed; OQ-033 blocker must resolve first)
**Evidence:** `video-notes.md` step 1/6 (`extra-42s.jpg`, `extra-50s.jpg`) — Access Denied dialog captured in video for User no P7032; entry-point NOT captured
**Execution History:** —

**Open Questions / Blockers:**
- **BLOCKER (OQ-033):** Entry point for "Cancel session appointments" not confirmed in LOCATE attempt-4 (session card buttons, EDIT drawer, right-click session name all checked, no Cancel entry). MANUAL_EXECUTE must test at patient slot row level to locate the control.
- **BLOCKER (OQ-030):** paco-one-db #1022 deploy status unknown. If P7032 not on dev, User role cannot be configured with P7032 prerequisite for TC-002/003. Dev team must confirm deploy.

---

### PAC2-9001-TC-002 — Cancel session: User + P7032 → Cancel dialog opens

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-001
**Expected-result basis:** `Confirmed` — AC table row "Cancel session (appointment book)" + scenario 2 (`ticket.md:86-87`)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — same as TC-001 (entry point unresolved; OQ-033)
**Entry Path:** Not confirmed — same as TC-001
**Context:** global / appointment-book / session
**Environment:** dev
**Role:** Appointment Book User + P7032 (QA-AUTO test role; must be created via `/paco/configuration/staff/role-groups` by Super Admin — mutation, requires tester approval)
**Preconditions:**
- Same session with ≥1 booking as TC-001
- QA-AUTO Appt Book User + P7032 role created (mutation, tester approval required in MANUAL_EXECUTE)
- paco-one-db #1022 deployed (OQ-030 prerequisite)
**Test Data:** Same session as TC-001
**Mutation Class:** Temporary (cancel appointments → must re-book in cleanup)
**Approval Required:** Yes (create role + cancel appointments)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Super Admin creates `QA-AUTO Appt Book User` role + grants P7032 via `/paco/configuration/staff/role-groups` | Role created; grant visible in role list |
| 2 | Login as QA-AUTO Appt Book User + P7032 | Authenticated; role header shows QA-AUTO persona |
| 3 | Navigate to `/paco-connect/feature-branch/pac2-9001/appointment-book` | Day view loads |
| 4 | Select booked session, locate "Cancel session appointments" entry point | Control found (same location as TC-001 step 4) |
| 5 | Invoke "Cancel session appointments" | Cancel session dialog opens |
| 6 | Verify dialog content | Dialog shows: number of appointments + patients affected; `Cancellation Reason` dropdown (required); two pill actions: `Cancel only` and `Cancel & notify` |
| 7 | Select a reason, click `Cancel only` | Dialog closes; listed appointments cancelled; reason persisted; session reflects cancelled state |
| 8 | Verify appointments cancelled | Affected appointment slots show cancelled/available state after reload |

**Postconditions:** Appointments cancelled; session updated.
**Cleanup:** Re-book appointments for affected patients (or note as test data requiring manual cleanup).
**Automation:** Later (entry point + role creation must be resolved first)
**Evidence:** `video-notes.md` step 4/6 (`frame-230s.jpg`) — Cancel session appointments dialog captured in video with 3 appointments/3 patients, reason dropdown, `Cancel only` / `Cancel & notify` pills; entry-point NOT captured
**Execution History:** —

**Open Questions / Blockers:**
- BLOCKER (OQ-033): Entry point unresolved (same as TC-001)
- BLOCKER (OQ-030): P7032 deploy prerequisite
- BLOCKER: QA-AUTO role creation requires mutation (tester approval in MANUAL_EXECUTE)

---

### PAC2-9001-TC-003 — Cancel session: Admin → Cancel dialog opens

**Type:** Ticket validation
**Risk:** Critical
**Priority:** P1
**Requirements:** REQ-001
**Expected-result basis:** `Confirmed` — AC table + scenario 2 (Admin = same as User+P7032)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — same as TC-001 (entry point unresolved; OQ-033)
**Entry Path:** Not confirmed
**Context:** global / appointment-book / session
**Environment:** dev
**Role:** Super Admin GB (Fiona Nguyen — current authenticated session; has P7032 via auto-include)
**Preconditions:** Session with ≥1 booking available
**Test Data:** Same session as TC-001
**Mutation Class:** Temporary
**Approval Required:** Yes (cancel appointments)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as Super Admin GB (Fiona Nguyen) | Authenticated; P7032 auto-included |
| 2 | Navigate to appointment-book | Day view loads |
| 3 | Select booked session, invoke "Cancel session appointments" | Cancel dialog opens |
| 4 | Verify dialog | Same content as TC-002 step 6 |
| 5 | Select reason, click `Cancel only` | Dialog closes; appointments cancelled |

**Postconditions:** Appointments cancelled; session updated.
**Cleanup:** Re-book appointments.
**Automation:** Later
**Evidence:** Same as TC-002 video evidence; Admin auto-include mechanism confirmed by LOCATE attempt-4
**Execution History:** —

**Open Questions / Blockers:**
- BLOCKER (OQ-033): Entry point unresolved (same as TC-001)

---

### PAC2-9001-TC-004 — Cancel single future appointment: all roles allowed

**Type:** Regression
**Risk:** Medium
**Priority:** P1
**Requirements:** REQ-002
**Expected-result basis:** `Confirmed` — AC table row "Cancel a single future appointment" (`ticket.md:73`)
**UI-dependent:** Yes
**Feature Location:** `Confirmed` — Appointment slot context menu (existing path; per REQ-002 "Known Location: Appointment slot context menu")
**Entry Path:** `/appointment-book` → Day view → expand session → right-click appointment slot row → `Cancel Appointment`
**Context:** global / appointment-book / appointment slot
**Environment:** dev
**Role:** All 3 roles
**Preconditions:**
- At least one future appointment booked in any session
- 3 roles: User, User+P7032, Admin
**Test Data:** Any booked appointment slot (Temi PCN slot 10:30, or other available)
**Mutation Class:** Temporary
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as each role in turn (User, User+P7032, Admin) | Authenticated with correct role |
| 2 | Navigate to `/appointment-book` | Day view loads |
| 3 | Expand session with ≥1 booked appointment | Appointment slots visible |
| 4 | Right-click booked appointment slot | Context menu opens with "Cancel Appointment" option |
| 5 | Click "Cancel Appointment" | Cancel dialog opens (existing path, not session cancel) |
| 6 | Confirm cancellation | Appointment cancelled; slot shows available after reload |

**Postconditions:** Single appointment cancelled; session otherwise intact.
**Cleanup:** Re-book cancelled appointment.
**Automation:** Yes (existing path, no new RBAC gate)
**Evidence:** Per REQ-002 — existing behavior, no video evidence in PAC2-9001 self-test
**Execution History:** —

**Open Questions / Blockers:** None (existing confirmed path)

---

### PAC2-9001-TC-005 — Cancel past appointment: Admin-only

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-003
**Expected-result basis:** `Confirmed` — AC table row "Cancel a past appointment" (`ticket.md:74`)
**UI-dependent:** Yes
**Feature Location:** `Confirmed` — Same appointment slot context menu as TC-004
**Entry Path:** Same as TC-004 (right-click appointment slot)
**Context:** global / appointment-book / appointment slot (past)
**Environment:** dev
**Role:** User (no P7032) → denied; Admin → allowed
**Preconditions:** At least one past appointment in any session
**Test Data:** Past-dated appointment slot
**Mutation Class:** Temporary
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as User (no P7032) | Authenticated |
| 2 | Navigate to appointment-book | Day view loads |
| 3 | Right-click past appointment slot | Context menu with "Cancel Appointment" visible |
| 4 | Click "Cancel Appointment" | "Access Denied" dialog OR button disabled (server-side gate) |
| 5 | Login as Admin | Authenticated |
| 6 | Right-click same past appointment | Context menu with "Cancel Appointment" visible |
| 7 | Click "Cancel Appointment" | Cancel dialog opens |
| 8 | Confirm | Appointment cancelled |

**Postconditions:** Past appointment cancelled by Admin only.
**Cleanup:** Re-book or note for manual cleanup.
**Automation:** Yes (existing path)
**Evidence:** Per REQ-003 — server-side Admin-only gate; no video evidence in PAC2-9001 self-test
**Execution History:** —

**Open Questions / Blockers:** None

---

### PAC2-9001-TC-006 — Block empty session: all roles allowed

**Type:** Ticket validation
**Risk:** Medium
**Priority:** P2
**Requirements:** REQ-004
**Expected-result basis:** `Confirmed` — AC table row "Block an empty session" (`ticket.md:76`) + scenario 3 (`ticket.md:87`)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — same as TC-001 (entry point for session-level action menu not confirmed; OQ-033). Same entry as Cancel session (likely same context menu).
**Entry Path:** Not confirmed — same as TC-001
**Context:** global / appointment-book / session
**Environment:** dev
**Role:** All 3 roles
**Preconditions:** Session with **zero** appointments (empty session)
**Test Data:** `Conflict test` (48 slots, 0 bookings per video step 2/6) or any QA Empty Slot session
**Mutation Class:** Temporary (block → slots non-bookable; unblock via session edit)
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as each role in turn | Authenticated with correct role |
| 2 | Navigate to `/appointment-book` | Day view loads |
| 3 | Select **empty** session (0 bookings) | Session visible |
| 4 | Locate "Block Session" entry point (same menu as Cancel session) | "Block Session" visible in menu |
| 5 | Click "Block Session" | Block confirmation dialog opens |
| 6 | Verify dialog content | Text: `"No patients are booked into this session. This will make all N bookable slots non-bookable. No appointments will be cancelled."` + `Cancel` (outlined) + `Block Session` (filled) |
| 7 | Click `Cancel` | Dialog closes; no change; session unchanged |
| 8 | Click `Block Session` | Dialog closes; all bookable slots become non-bookable |

**Postconditions:** All slots in session marked non-bookable; no appointments cancelled.
**Cleanup:** Edit session → re-enable bookable slots.
**Automation:** Later (entry point + slot state verification needed)
**Evidence:** `video-notes.md` step 2/6 (`frame-070s.jpg`, `extra-60s.jpg`) — Block Session dialog captured with empty session "48 bookable slots" text; PASS confirmed by tester

**Open Questions / Blockers:**
- BLOCKER (OQ-033): Entry point unresolved
- **OQ-031 open:** Block Session on session **with** ≥1 booking — is "Block" visible? Does block still work? Same menu entry should work; test confirms empty session only.

---

### PAC2-9001-TC-007 — Change session details: all roles allowed

**Type:** Regression
**Risk:** Low
**Priority:** P2
**Requirements:** REQ-005
**Expected-result basis:** `Confirmed` — AC table row "Change session details / times" (`ticket.md:77`)
**UI-dependent:** Yes
**Feature Location:** `Confirmed` — Edit pencil button on session card header → EDIT SESSION drawer. LOCATE attempt-4 verified: pencil button opens drawer, 8 buttons, drawer content confirmed. Entry confirmed via LOCATE attempt-4.
**Entry Path:** `/appointment-book` → Day view → click pencil icon on session header → EDIT SESSION drawer opens
**Context:** global / appointment-book / session
**Environment:** dev
**Role:** All 3 roles
**Preconditions:** Session available (booked or empty)
**Test Data:** Any session (Temi PCN, empty QA slot)
**Mutation Class:** Persistent (changes persist)
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as each role | Authenticated with correct role |
| 2 | Navigate to `/appointment-book` | Day view loads |
| 3 | Click Edit pencil icon on session header | EDIT SESSION drawer opens (p-sidebar `_session-edit-or-add-slidebar_rzrcz_56`) |
| 4 | Verify drawer fields | Fields: Session Name, Session Type (Timed/Untimed), Slot Duration, Time Range, Assigned Slot Types, Assigned Appointment Book, Service provider, Assigned Locations, Assigned Staff; footer: Cancel + Save |
| 5 | Modify a non-locked field (e.g., Session Name or Assigned Locations for booked session) | Field editable |
| 6 | Click `Cancel` | Drawer closes; no changes saved |
| 7 | Re-open drawer, modify field, click `Save` | Drawer closes; toast `"Session updated successfully."`; changes persist after reload |

**Postconditions:** Session details updated.
**Cleanup:** Revert changes or note for test data management.
**Automation:** Yes (pencil button + drawer confirmed; locators available)
**Evidence:** LOCATE attempt-4 (2026-10-13T16:00Z) confirmed pencil button → drawer; `video-notes.md` step 5/6 confirms drawer content

**Open Questions / Blockers:**
- Pre-existing limitation: session times locked when session has bookings (per REQ-005). TC-007 covers non-locked fields only.
- **OQ-034:** Time-edit cancellation dialog (REQ-008 scenarios 6-10) triggered by template edit — TC-010 covers this separately.

---

### PAC2-9001-TC-008 — Remove/archive session: Admin-only

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-006
**Expected-result basis:** `Confirmed` — AC table row "Remove (archive) session" (`ticket.md:78`)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — Configuration → Sessions row kebab `…` (per video step 6/6). LOCATE attempt-4 did NOT open Configuration → Sessions row kebab (budget priority on appointment-book entry-point). OQ-032 blocks this TC.
**Entry Path:** Not confirmed — candidate: `Configuration` → `Appointment Books` → `Sessions` table → row `…` kebab → "Remove Session"
**Context:** global / configuration / sessions
**Environment:** dev
**Role:** User (no P7032) → denied; User+P7032 → denied; Admin → allowed
**Preconditions:**
- Session available in Configuration → Sessions
- Admin role authenticated
**Test Data:** Any session in Configuration list (e.g., "8871 Testing" per LOCATE rev 1)
**Mutation Class:** Persistent (archive is persistent)
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as User (no P7032) | Authenticated |
| 2 | Navigate to `/paco-connect/feature-branch/pac2-9001/configuration` → Appointment Books → Sessions | Sessions table loads |
| 3 | Click row `…` kebab | Menu opens |
| 4 | Verify menu items | No "Remove Session" visible OR visible but clicking → "Access Denied" |
| 5 | Login as Admin | Authenticated |
| 6 | Navigate to same Configuration → Sessions | Sessions table loads |
| 7 | Click row `…` kebab | Menu opens with "Remove Session" |
| 8 | Click "Remove Session" | Session archived → removed from Active list; visible in Removed filter |

**Postconditions:** Session archived.
**Cleanup:** Restore via "Restore" action in Removed state.
**Automation:** Later (row kebab entry not confirmed; OQ-032 must resolve)
**Evidence:** `video-notes.md` step 3/6 caption "Remove Session denied for non-Admin" — denial UI NOT captured; step 6/6 shows Configuration → Sessions reachable for User+P7032

**Open Questions / Blockers:**
- BLOCKER (OQ-032): Configuration → Sessions row kebab menu content not verified. MANUAL_EXECUTE must open kebab to capture menu items.
- **Ambiguity:** "Remove Session" may be labeled differently (e.g., "Archive Session"). Tester must capture exact label.

---

### PAC2-9001-TC-009 — Cancel session from Configuration → Sessions: Admin-only

**Type:** Ticket validation
**Risk:** High
**Priority:** P1
**Requirements:** REQ-007
**Expected-result basis:** `Confirmed` — AC table row "Cancel session from Configuration → Sessions" (`ticket.md:79`)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — Same row kebab as TC-008 (OQ-032). Also requires paco-one-db #1022 deploy (OQ-030).
**Entry Path:** Not confirmed — candidate: `Configuration` → `Appointment Books` → `Sessions` table → row `…` kebab → "Cancel Session"
**Context:** global / configuration / sessions
**Environment:** dev
**Role:** Admin only
**Preconditions:**
- Session with ≥1 booking available in Configuration list
- paco-one-db #1022 deployed (P7032 visible in RBAC)
**Test Data:** Same booked session as TC-001/002
**Mutation Class:** Temporary (cancel appointments)
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Login as User (no P7032) | Authenticated |
| 2 | Navigate to Configuration → Sessions | Sessions table loads |
| 3 | Click row `…` kebab | Menu opens |
| 4 | Attempt to invoke "Cancel Session" | Not visible OR visible → "Access Denied" |
| 5 | Login as Admin | Authenticated |
| 6 | Navigate to Configuration → Sessions | Sessions table loads |
| 7 | Select session with ≥1 booking, click `…` kebab | Menu opens |
| 8 | Click "Cancel Session" | Cancel dialog opens (same as TC-002 step 6) |

**Postconditions:** Appointments cancelled via Configuration path.
**Cleanup:** Re-book appointments.
**Automation:** Later (row kebab + entry not confirmed; blockers OQ-030 + OQ-032)
**Evidence:** `video-notes.md` step 6/6 (`frame-350s.jpg`) — Configuration → Sessions page reachable for User+P7032; row kebab visible but NOT opened in video

**Open Questions / Blockers:**
- BLOCKER (OQ-030): P7032 deploy prerequisite
- BLOCKER (OQ-032): Row kebab content not confirmed (same as TC-008)

---

### PAC2-9001-TC-010 — Time-edit cancellation dialog: template edit trigger

**Type:** Ticket validation
**Risk:** High
**Priority:** P2
**Requirements:** REQ-008
**Expected-result basis:** `Confirmed` — AC scenarios 6-10 (`ticket.md:90-94`)
**UI-dependent:** Yes
**Feature Location:** **Not confirmed** — Template edit workflow (REQ-008 notes: dialog mainly appears for template edits whose generated sessions hold bookings outside template times). OQ-034 open: no template with this data state known to exist on dev.
**Entry Path:** Not confirmed — candidate: Configuration → Session Templates → edit template → time range change → affected generated session with bookings outside template times → dialog opens
**Context:** global / configuration / session templates
**Environment:** dev
**Role:** Any role with edit session permission
**Preconditions:**
- Session template with generated child sessions
- At least one generated child session with bookings **outside** the template's time range
- This specific data state may not exist on dev (OQ-034 blocker)
**Test Data:** Template with misaligned bookings — data state unknown on dev
**Mutation Class:** Temporary (cancel appointments)
**Approval Required:** Yes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Identify or create a template where generated session has bookings outside template time range | Precondition may require test data creation |
| 2 | Edit template time range (e.g., extend or shift) | System detects ≥1 booking would be cancelled |
| 3 | Before save: time-edit cancellation dialog opens | Dialog shows: affected patients list (name, date, time) + required `Cancellation Reason` |
| 4 | Close dialog without saving | Nothing saved; bookings unchanged (per scenario 7) |
| 5 | Select reason, click `Cancel only` | Edit saved; listed appointments cancelled; scheduled reminders cancelled |
| 6 | Verify | Cancelled appointments show in session; reminders cancelled |

**Postconditions:** Template and appointments updated per action taken.
**Cleanup:** Restore appointments if cancelled.
**Automation:** Later (template edit + specific data state required; OQ-034 must resolve first)
**Evidence:** Per REQ-008 — dialog NOT captured in PAC2-9001 video (step 5/6 only shows EDIT SESSION drawer, not time-edit dialog)

**Open Questions / Blockers:**
- BLOCKER (OQ-034): Template edit trigger data not available on dev. Tester must either (a) create required template data state in MANUAL_EXECUTE, or (b) escalate to dev to provide test data.

---

### PAC2-9001-TC-011 — P7032 visibility in Role Groups after paco-one-db deploy

**Type:** Setup verification
**Risk:** Critical
**Priority:** P0
**Requirements:** REQ-009
**Expected-result basis:** `Confirmed` — AC table + REQ-009 ("P7032 visible after paco-one-db #1022 deploy")
**UI-dependent:** Yes
**Feature Location:** `Confirmed` — `/paco/configuration/staff/role-groups` (PAC2-OS rewrite, confirmed in LOCATE attempt-4). Route confirmed but P7032 NOT visible (max P7507 per 15:13Z scan).
**Entry Path:** Navigate to `/paco/configuration/staff/role-groups` (direct URL or via PAC2-OS menu)
**Context:** global / admin / role-groups
**Environment:** dev
**Role:** Super Admin (required to access Role Groups)
**Preconditions:** paco-one-db #1022 deployed (OQ-030 — THIS IS THE TEST)
**Test Data:** N/A
**Mutation Class:** None (read-only verification)
**Approval Required:** No

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `/paco/configuration/staff/role-groups` | Role Groups page loads; list of RBAC activities displayed |
| 2 | Scroll or search for `P7032` | Activity `P7032 - Appointment Book Cancel Session` visible in list |
| 3 | Click `P7032` activity | Activity detail panel opens; shows `canCancelSession` permission property |
| 4 | Verify prerequisite | P7030 (Appointment Book User) listed as prerequisite |

**Postconditions:** P7032 visible in Role Groups list.
**Cleanup:** N/A (read-only)
**Automation:** Yes (simple URL navigation + text verification)
**Evidence:** LOCATE attempt-4 R-4 confirmed URL works; LOCATE attempt-3 (15:13Z) confirmed P7032 NOT visible (max P7507); TC-011 verdict determines if all other TCs can proceed

**Open Questions / Blockers:**
- **BLOCKER (OQ-030) — this is the test:** If P7032 still NOT visible, paco-one-db #1022 has NOT deployed on dev. All RBAC TCs (TC-001, TC-002, TC-003, TC-009) blocked until dev confirms deploy. Escalate to dev team immediately.

---

## Open Questions and Blockers

| ID | Description | Impact | Affected TCs | Resolution |
|---|---|---|---|---|
| OQ-030 (OQ-033 from requirements) | paco-one-db #1022 deploy status unknown; P7032 NOT visible on dev (max P7507) | **Critical** | TC-001, TC-002, TC-009, TC-011 | Dev team confirms deploy status. TC-011 verdict gates all other TCs. |
| OQ-033 (OQ-034 from requirements) | Entry point for "Cancel session appointments" not confirmed — LOCATE attempt-4 checked session card, EDIT drawer, right-click session name, found nothing. Candidate: patient slot row level | **Critical** | TC-001, TC-002, TC-003, TC-006 | MANUAL_EXECUTE must test patient slot row inside expanded session accordion (e.g., Temi PCN slot 10:30 with ≥1 patient). Right-click or kebab on patient row expected. |
| OQ-031 (OQ-032 from requirements) | Block Session on session with ≥1 booking — is "Block" visible? Does it work? | Medium | TC-006 | Test with booked session (Dan E2E test or similar). Expect: Block visible but may be blocked by P7032 if logic gates it. |
| OQ-032 (OQ-033 from requirements) | Configuration → Sessions row kebab content not verified — Cancel/Remove visible for whom? | Medium | TC-008, TC-009 | MANUAL_EXECUTE must open row kebab for each role (User, User+P7032, Admin) and capture menu items. |
| OQ-034 (OQ-035 from requirements) | Time-edit cancellation dialog trigger (template edit) — no known template with bookings-outside-template-times data on dev | High | TC-010 | MANUAL_EXECUTE must either (a) create test template data, or (b) escalate to dev. |

## Tester notes

[Protected area]
