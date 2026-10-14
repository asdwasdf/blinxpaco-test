# Requirements: PAC2-9001

**Input Revision:** 2
**Generated:** 2026-10-13T15:24:40Z
**Re-analyzed:** 2026-10-13T15:40:00Z (rev 2; AC matrix now from comment 14:31Z)
**Status:** Active

## Source Summary

Ticket PAC2-9001 ("PBT-334 - Cancelling session needs to be behind a admin type RBAC", bug reporter **Chloe Stephens**) yêu cầu tách quyền cancel session khỏi "Appointment Book User": hiện tại user với appointment-user RBAC có thể cancel session, cần một RBAC mới (P7032 "Appointment Book Cancel Session") riêng cho hành động này.

**Acceptance Criteria nguồn chính thức** (rev 2): comment **tony.do 2026-10-13T14:31:47Z** trong `ticket.md:66-100` chứa:
- **Permissions matrix** (7 actions × 3 roles)
- **Expected behaviour** table (9 scenarios)

Đây là bảng AC rõ ràng nhất; thay thế hoàn toàn assumption "dùng 'Plan approved 2026-10-12' làm AC" từ rev 1.

PRs raised 2026-10-13: paco-connect-be #792, paco-one-db #1022 (activity P7032), paco-connect-fe #2875. Syed approved all 3 với minor follow-ups.

**Browser self-test video** (rev 2 mới): `attachments/129284-pac2-9001-browser-qa.mp4` (456.7s, 1600x960, no audio) — tester tony.do quay 6 captioned steps trên dev environment với persona J2B "PAC2-9001 QA (temporary)". Output review: `docs/tickets/PAC2-9001-.../video/video-notes.md`.

**Bug severity:** Critical (5 trusts: Royal, Alder Hey, CAS, OOH, PCAS). PBT-333 (Royal) downgrade khi PAC2-9001 ship. Pre-existing ngoài ticket: `appointments/cancel` org-check (cần ticket riêng). GP-org out-of-scope.

**Merge/deploy order (strict):** connect-be → paco-one-db → connect-fe. FE không có fallback cho BE cũ. Bug ban đầu repro trên Edge/Chrome/Firefox (production); QA chỉ chạy chromium trên dev.

## Video Coverage

**Timeline:** `D:/blinxpaco-test/test-results/PAC2-9001/video/contact-sheet/` (11 main + 47 extras, 0:05..7:30).
**Reviewed by:** subagent (sonnet), 2026-10-13T15:34:54Z, output `video-notes.md`.
**Coverage:** 6 captioned steps (1/6..6/6); 4 dialogs captured (Access Denied, Block Session, Cancel session appointments, EDIT SESSION); entry-point control cho "Cancel session appointments" KHÔNG captured (tester jumps từ Day board sang dialog). Network panel / server response KHÔNG captured — PASS/FAIL suy ra từ dialog text.

## Permissions Matrix (from AC table, rev 2)

| Action | Appointment Book User | User + Cancel Session | Appointment Book Admin |
|---|---|---|---|
| Cancel a single future appointment | ✅ | ✅ | ✅ |
| Cancel a past appointment | ❌ | ❌ | ✅ |
| Cancel session (appointment book) | ❌ | ✅ | ✅ |
| Block an empty session | ✅ | ✅ | ✅ |
| Change session details / times | ✅ | ✅ | ✅ |
| Remove (archive) session | ❌ | ❌ | ✅ |
| Cancel session from Configuration → Sessions | ❌ | ❌ | ✅ |

## Expected Behaviour (from AC table, rev 2)

1. User without Cancel Session chooses "Cancel session appointments" on a booked session → Option is **visible**; clicking it shows "Access Denied"; nothing is cancelled.
2. User with Cancel Session chooses "Cancel session appointments" → Cancel dialog opens with number of appointments and patients; **reason is required**; "Cancel & notify" opens Quick Send.
3. Any user chooses "Block Session" on a session with no bookings → Block dialog opens; no appointments cancelled.
4. Non-Admin chooses Cancel or Remove Session from Configuration → Sessions → "Access Denied".
5. Admin with no role changes → Can do everything as today.
6. Session edit that would cancel booked appointments → Before save, dialog lists affected patients (name, date, time) and asks for reason.
7. Dialog closed → Nothing saved or cancelled.
8. "Cancel only" → Edit saved; listed appointments cancelled with chosen reason; scheduled reminders cancelled.
9. "Cancel & notify" → Quick Send opens for those patients. Save happens only on Send; closing Quick Send saves nothing.
10. Another booking lands in affected time while dialog open → Save stopped, dialog reappears with updated list.

## Atomic Requirements

### REQ-PAC2-9001-001

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cancel session (Appointment Book) — RBAC gate
**Search Terms/Aliases:** "Cancel session", "Cancel session appointments", "session cancel", "P7032", "Appointment Book Cancel Session", `canCancelSession`
**Known Location:** Session context menu (right-click or kebab) on session card in Day view (entry point not confirmed; see OBSERVED); AC table row "Cancel session (appointment book)"
**Actor/Role:** 3 roles: Appt Book User (no P7032), Appt Book User + P7032, Appt Book Admin
**Inference Basis:** N/A
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Preconditions:**
- Một session chứa ≥1 appointment booking trên dev host.
- 3 roles configured: (a) Appt Book User without P7032, (b) `QA-AUTO Appt Book User` + P7032, (c) Appt Book Admin.
- Dev đã deploy đủ 3 PR theo thứ tự connect-be → paco-one-db → connect-fe; P7032 visible trong Role Groups.

**Expected Behavior:**
| Role | Result |
|---|---|
| Appt Book User (no P7032) | "Cancel session appointments" option **visible** trong session menu; clicking → "Access Denied" dialog; nothing cancelled |
| User + P7032 | Cancel dialog opens với số appointments + patients, required reason, two actions "Cancel only" / "Cancel & notify" |
| Admin | Same as User + P7032 |

**Provenance:**
- **Source:** `ticket.md:74-76` (matrix row "Cancel session (appointment book)"), `ticket.md:86-87` (scenario 1-2), `ticket.md:60-65` (Plan approved server rule)
- **Video evidence:** `video-notes.md` step 1/6 (Access Denied dialog) và step 4/6 (Cancel session appointments modal với 3 appointments/3 patients). Entry-point control NOT captured.
- **Input Revision:** 2
- **First Recorded:** 2026-10-13T12:54:42Z
- **Last Verified:** 2026-10-13T15:40:00Z

**Evidence:** `test-results/PAC2-9001/video/contact-sheet/extra-42s.jpg` (Access Denied), `frame-230s.jpg` (Cancel session appointments modal)
**Related Tests:** TC sẽ sinh trong `TEST_DESIGN`
**Notes:** AC scenario 1 explicitly states "Option is visible" — UI không hide option mà user click mới thấy Access Denied. Đây là design choice cho UX (caller biết action tồn tại, nhưng không có permission).

---

### REQ-PAC2-9001-002

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cancel a single future appointment (existing behavior preserved)
**Search Terms/Aliases:** "Cancel appointment", single appointment cancel
**Known Location:** Appointment slot context menu (existing path)
**Actor/Role:** All 3 roles (User, User+P7032, Admin)
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Preconditions:**
- Appointment chưa qua (future).

**Expected Behavior:**
| Role | Result |
|---|---|
| Appt Book User | ✅ Cancel allowed |
| User + P7032 | ✅ Cancel allowed |
| Admin | ✅ Cancel allowed |

**Provenance:** `ticket.md:73` (matrix row "Cancel a single future appointment"). Input Revision 2.
**Related Tests:** TBD

---

### REQ-PAC2-9001-003

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cancel a past appointment (Admin-only)
**Search Terms/Aliases:** "Cancel past appointment"
**Known Location:** Same slot context menu; Admin-only
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Expected Behavior:**
| Role | Result |
|---|---|
| Appt Book User | ❌ Denied |
| User + P7032 | ❌ Denied |
| Admin | ✅ Cancel allowed |

**Provenance:** `ticket.md:74` (matrix row "Cancel a past appointment"). Server-side Admin-only gate. Input Revision 2.
**Related Tests:** TBD

---

### REQ-PAC2-9001-004

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Block an empty session — RBAC gate (no P7032 needed)
**Search Terms/Aliases:** "Block session", "block empty session"
**Known Location:** Session context menu (same as Cancel session)
**Actor/Role:** All 3 roles (User, User+P7032, Admin)
**Acceptance Criteria Status:** Present (rev 2 AC table + Plan approved)

**Expected Behavior:**
| Role | Result |
|---|---|
| All roles | ✅ Block dialog opens (no appointments cancelled) |

**Provenance:** `ticket.md:76` (matrix row "Block an empty session"), `ticket.md:87` (scenario 3). Input Revision 2.
**Video evidence:** `video-notes.md` step 2/6 — Block Session dialog "No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled." (frame-070s.jpg, extra-60s.jpg).
**Related Tests:** TBD

---

### REQ-PAC2-9001-005

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Change session details / times — RBAC gate (no P7032 needed)
**Search Terms/Aliases:** "Edit Session", "session times", "session details"
**Known Location:** Session context menu Edit; EDIT SESSION modal (per video)
**Actor/Role:** All 3 roles
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Expected Behavior:** All roles can change session details/times. **Pre-existing limitation:** session times locked in editor khi session có bookings — `video-notes.md` step 5/6 caption "for a session with bookings, the board modal locks the session times (pre-existing), so no time edit is possible here".

**Provenance:** `ticket.md:77` (matrix row "Change session details / times"). Input Revision 2.
**Video evidence:** `video-notes.md` step 5/6 — EDIT SESSION modal (frame-270s.jpg, extra-250s.jpg, extra-260s.jpg).
**Related Tests:** TBD

---

### REQ-PAC2-9001-006

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Remove (archive) session — Admin-only
**Search Terms/Aliases:** "Remove session", "archive session"
**Known Location:** Configuration → Sessions row menu; potentially Appointment Book menu
**Actor/Role:** Admin only
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Expected Behavior:**
| Role | Result |
|---|---|
| Appt Book User | ❌ Denied (Access Denied) |
| User + P7032 | ❌ Denied (Access Denied) |
| Admin | ✅ Archive allowed |

**Provenance:** `ticket.md:78` (matrix row "Remove (archive) session"), `ticket.md:88` (scenario 4). Input Revision 2.
**Video evidence:** `video-notes.md` step 3/6 caption "Remove Session denied for non-Admin" (frame-110s.jpg); actual denial UI not captured in sampled frames.
**Related Tests:** TBD

---

### REQ-PAC2-9001-007

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Cancel session from Configuration → Sessions — Admin-only
**Search Terms/Aliases:** "Configuration Sessions Cancel", "cancel from config"
**Known Location:** Configuration → Appointment Books → Sessions row menu Actions (per video step 6/6)
**Actor/Role:** Admin only (per matrix)
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Expected Behavior:**
| Role | Result |
|---|---|
| Appt Book User | ❌ "Access Denied" |
| User + P7032 | ❌ "Access Denied" |
| Admin | ✅ Cancel from Configuration |

**Provenance:** `ticket.md:79` (matrix row "Cancel session from Configuration → Sessions"), `ticket.md:88` (scenario 4). Input Revision 2.
**Video evidence:** `video-notes.md` step 6/6 — Configuration → Sessions list page reachable for User +P7032 (NOT Admin); row kebab `…` visible per row. **Tester did NOT open row kebab** — content (Cancel option cho User+P7032? hidden?) chưa verify. Step 6 caption "Configuration → Sessions (role: User + Cancel Session, NOT Admin)" PASS means page reachable, NOT that Cancel option visible.
**Related Tests:** TBD (cần click row kebab trong QA pass)
**Notes:** Reachable ≠ allowed. UI có thể show Cancel trong row kebab nhưng click → Access Denied. Cần QA pass mở row kebab và verify menu items.

---

### REQ-PAC2-9001-008

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Time-edit dialog (session change would cancel booked appointments)
**Search Terms/Aliases:** "Edit Session", "time edit", "dry-run", "affected patients", "Cancellation Reason"
**Known Location:** EDIT SESSION modal; left side time slot column; footer "Discard" / "Done"
**Actor/Role:** All 3 roles (whoever can edit session)
**Acceptance Criteria Status:** Present (rev 2 AC scenarios 6-10)

**Preconditions:**
- User edit session details/times dẫn tới ≥1 booking bị cancel.
- Per AC scenario: "Session times are already locked in the editor when a session has bookings" → dialog mainly appears for **template edits** whose generated sessions hold bookings outside template times.

**Expected Behavior:**
Khi time edit sẽ cancel ≥1 booking:
1. Trước save: danh sách affected patients (name, date, time) + Cancellation Reason (required).
2. Nếu dialog bị close → nothing saved or cancelled.
3. "Cancel only" → edit saved, listed appointments cancelled với chosen reason, scheduled reminders cancelled.
4. "Cancel & notify" → Quick Send opens cho patients. Save happens only on Send.
5. Concurrent booking change while dialog open → save stopped, dialog reappears với updated list.

**Provenance:** `ticket.md:90-94` (scenarios 6-10), `ticket.md:99-100` (QA notes). Input Revision 2.
**Video evidence:** `video-notes.md` step 5/6 — EDIT SESSION modal (frame-270s.jpg). Right-side "Session settings" form: Session name, Assigned Locations, Assigned Staff; warning "This session has 3 booked patients — Changing location or staff moves their appointments with it. Nobody is notified automatically." Lưu ý: warning trong video KHÔNG đề cập time-edit cancellation dialog riêng — đây là về location/staff change, không phải time edit. Time-edit cancellation dialog (REQ-005) **NOT captured in video** — needs QA pass on template edit flow.
**Related Tests:** TBD (cần test với template edit, không phải session edit trực tiếp)
**Notes:** Per QA notes rev 2, dialog chủ yếu cho template edits. Trực tiếp session edit khi có bookings thì times locked — không trigger dialog.

---

### REQ-PAC2-9001-009

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** RBAC activity P7032 + Admin auto-include
**Search Terms/Aliases:** "P7032", "Appointment Book Cancel Session", "Role Management", "Admin", "scheduling Role Group"
**Known Location:** `/paco/configuration/staff/role-groups` (PAC2-OS, NOT paco-connect)
**Actor/Role:** Trust admin (grant P7032); Admin (auto-include qua backend role mapping)
**Acceptance Criteria Status:** Present (rev 2 AC table)

**Preconditions:**
- paco-one-db #1022 đã deploy dev (activity P7032).
- Tester login `/paco/configuration/staff/role-groups` (SPA rewrite từ paco-connect FB qua menu "Role Groups").

**Expected Behavior:**
- Trust admin grant activity `P7032 - Appointment Book Cancel Session` cho Appt Book User role.
- P7032 = `canCancelSession` permission property (per video caption step 4/6 "permissions (canEdit:true, canAdmin:false, canCancelSession:true) → cancel dialog opens").
- P7032 chỉ hoạt động cùng Appt Book User (per ticket.md:99 "It is granted on top of Appointment Book User and does nothing on its own").
- Admin auto-include P7032 qua backend role mapping.
- P7032 chỉ visible ở Account Management UI khi paco-one-db change đã deploy (per QA notes rev 2).

**Provenance:**
- **Source:** `ticket.md:60-65` (Plan approved), `ticket.md:73` (matrix row), `ticket.md:99` (QA notes "It only appears once the paco-one-db change is on the environment")
- **Video evidence:** KHÔNG show RBAC activity list. P7032 existence inferred from Cancel session dialog opening trong step 4/6.
- **LOCATE finding 2026-10-13T15:13Z:** P7032 NOT visible ở `/paco/configuration/staff/role-groups` (max P7507, 126 P-codes, có P7030 prerequisite). → paco-one-db #1022 có thể CHƯA deploy trên dev host.
- **Input Revision:** 2
- **Last Verified:** 2026-10-13T15:40:00Z

**Evidence:** N/A (route confirmed tại `/paco/configuration/staff/role-groups` nhưng P7032 không thấy trong danh sách)
**Related Tests:** TBD
**Notes:** Per LOCATE attempt-3 (15:13Z) — max P-code trên dev là P7507, KHÔNG có P7032. Cần dev confirm deploy status paco-one-db #1022 trên dev host.

---

### REQ-PAC2-9001-010 (Out of scope, tracked for context)

**Classification:** Confirmed
**Lifecycle:** Active
**Feature/Scope:** Pre-existing - `appointments/cancel` org check
**Actor/Role:** -
**Acceptance Criteria Status:** N/A (out of scope)

**Expected Behavior:** Pre-existing bug: `appointments/cancel` không check appointment thuộc org của caller. Cần ticket riêng, **không thuộc scope PAC2-9001**.

**Provenance:** `ticket.md:119` (carry-over từ rev 1). Input Revision 2.
**Notes:** Theo dõi để không nhầm vào test matrix.

---

## Ambiguities and Conflicts

- **P-code nguồn:** comment tony.do lúc đầu ghi "Waiting on a dev-DB lookup for the real P-code", sau đó chốt P7032 (ticket.md:127 cũ). Rev 2 không có comment đó (chỉ có 3 comments). Hiện tại vẫn dùng P7032; nếu dev-DB lookup trả P-code khác thì cần update REQ-009.
- **"Access Denied" dialog copy:** "You do not have permissions to perform this action. Contact your administrator." — generic, không name missing permission. Đây là server-side guard (per AC scenario 1), nhưng UX diagnosis yếu.
- **"Cancel session appointments" entry point:** video KHÔNG capture control shape (right-click context menu vs kebab dropdown vs menu icon). AC scenario 1 nói "Option is visible" → option vẫn render trong session menu, không bị hide. QA pass phải capture menu opening.
- **Configuration Sessions row kebab:** step 6/6 PASS = page reachable cho User +P7032, không phải Cancel option visible. Cần click row kebab trong QA pass để xác minh menu content).
- **Admin auto-include mechanism:** Per rev 2 comment, "Appointment Book Admin includes it automatically" — chưa rõ qua config trong paco-one-db hay hardcoded trong connect-be.
- **Delete session:** KHÔNG thuộc scope PAC2-9001. Per rev 1 Katie, "delete" → "archive" với audit; sẽ là ticket/scope khác.
- **Test data:** dev tenant có session "Dan E2E test" (3 booked patients), session "Conflict test" (empty). Dev còn nhiều test rows `QA Empty Slot <id>`, `QA Unmapped Slot <id>`, `SEAN TEST 8241`, `test pac2 7768` — leftover QA data cần cleanup.

## Open Questions

- **OQ-1 (rev 2 mới):** paco-one-db #1022 đã deploy dev chưa? LOCATE attempt-3 thấy max P7507, có P7030 prerequisite nhưng không có P7032. Cần dev confirm. *Impact:* nếu P7032 chưa deploy, REQ-009 setup Blocked, REQ-001/006/007/008 không thể test trên dev.
- **OQ-2 (carry-over rev 1):** `Block session` trên session có ≥1 booking: option "block" có hiển thị không? Video step 2/6 test trên empty session (Conflict test 48 slots) — PASS. Chưa test trên session có booking.
- **OQ-3 (carry-over rev 1):** Configuration Sessions row kebab menu content cho User +P7032 (NOT Admin): Cancel option có visible hay hidden? *Impact:* REQ-007 PASS định nghĩa "Access Denied" khi click Cancel — nhưng nếu option bị hide (UI gate), scenario vẫn đạt nhưng khác UX. Cần QA mở row kebab.
- **OQ-4 (rev 2 mới):** "Cancel session appointments" entry point shape — right-click vs kebab dropdown vs menu icon? Video KHÔNG capture. *Impact:* cần QA pass capture menu opening để automate.
- **OQ-5 (rev 2 mới):** Time-edit cancellation dialog (REQ-008 scenarios 6-10) trigger bằng template edit (per QA notes) — cần test data template có bookings ngoài times. Có sẵn trên dev không? *Impact:* REQ-008 không verify được nếu không có template edit trigger.

## Tester notes

[Protected area]