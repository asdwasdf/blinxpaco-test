# PAC2-9001 — Video review notes (browser self-test evidence)

## Header

| Field | Value |
|---|---|
| Ticket | `PAC2-9001` — PBT-334 "Cancelling session needs to be behind a admin type RBAC" |
| Source video | `D:/blinxpaco-test/ticket/PAC2-9001-pbt-334-cancelling-session-needs-to-be-behind-a-admin-type-rbac/attachments/129284-pac2-9001-browser-qa.mp4` |
| File size | 30,881,286 bytes (~29.4 MiB) |
| Duration | 456.70 s (~7 min 36 s) |
| Resolution / codec | 1600x960, H.264 (High@4.0), 30 fps, yuvj420p |
| Audio streams | 0 (video only — no spoken narration captured) |
| Generated | 2026-10-13T15:34:54Z |
| Sampler tool | `ffprobe` + `ffmpeg` (Gyan 9.0.1 full build) |
| Contact sheet path | `D:/blinxpaco-test/test-results/PAC2-9001/video/contact-sheet/` (11 main + extras) |

## Contact sheet (representative frames)

| # | File | Time | Description |
|---|---|---|---|
| F1 | `frame-030s.jpg` | 00:30 | Appointment Book, Day view, 11 Nov 2026, "Dan E2E testing" book. Overlay "1/6 · Expected: Access Denied (session cancel needs the new permission) → CHECK". User header is **collapsed/hidden** (J2B avatar not yet rendered) — the tester is on the "non-permission" persona. |
| F2 | `frame-070s.jpg` | 01:10 | Johnny (2255) Bravo / PAC2-9001 QA (temporary) / General Practice (Demo Site) is now visible top-left. A `Block Session` confirm dialog is open: "No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled." with two pill buttons (left empty/disabled, right orange-pink "Block Session"). Overlay: "2/6 · PASS: Block Session dialog opens for a plain user (FR6). Closing with Cancel, nothing is blocked." |
| F3 | `frame-110s.jpg` | 01:50 | Same Appointment Book, mid-board. Overlay "3/6 · PASS: Remove Session denied for non-Admin" (no dialog visible). |
| F4 | `frame-150s.jpg` | 02:30 | Same view, no overlay (inter-frame between steps). |
| F5 | `frame-190s.jpg` | 03:10 | Same view, no overlay. |
| F6 | `frame-230s.jpg` | 03:50 | A `Cancel session appointments` modal: warning triangle, "This will cancel 3 appointments for 3 patients in this session. You can choose to notify all patients or proceed without sending a message."; `Cancellation Reason` select with placeholder "Select a reason" (required); two pill buttons `Cancel only` and `Cancel & notify`. Overlay: "4/6 · PASS: permissions (canEdit:true, canAdmin:false, canCancelSession:true) → cancel dialog opens ('3 appointments for 3 patients'). Closing WITHOUT confirming." |
| F7 | `frame-270s.jpg` | 04:30 | `EDIT SESSION` modal open on session `Dan E2E test` (Blinx Healthcare, Dr Ellie Bartlett, "Has bookings"). Left side has a time-slot column 09:00…10:20 with checkboxes per slot; each slot row has a `…` kebab at the right. Top right of modal: `Tips` button and a **cog/gear** icon. Footer: `Session ends at 16:00`, a left-side empty info bar and a right-side pill action (label mostly off-screen). Overlay: "5/6 · Note: for a session with bookings, the board modal locks the session times (pre-existing), so no time edit is possible here". |
| F8 | `frame-310s.jpg` | 05:10 | Blank white screen with a small Paco loading dots cluster centre — page transition. |
| F9 | `frame-350s.jpg` | 05:50 | `Configuration → Appointment Books → Sessions` list page (left nav shows Organisation, Patient, **Appointment Books**, Quick Pay, Patients & Proxy, Users & Staff, Clinical Config, Case Prioritisation; sub-panel `Sessions` selected). Table columns: Session Name, Assigned Slot…, Weekdays, Frequency, Actions. Rows like "demo as srv provider (Template — 1 session)", "share locate at demo (Template — 1 session)", "MAR Video Clone Test - Original (Template - …)", "1600 17 sep (Clone)6 (Template — 1 session)", "one slot with 15 min (Template — 24 session…", "15 minutes slot (Template — 24 sessions)", "5 slots (Clone) (Template — 23 sessions)", "Session to test clone @ 08/10 (Template — 23 …", "asdasd2 (Template — 274 sessions)", "New test for cloning 0000 (Template — 0 ses…", "1603 - Test on Dev (Template — 4 sessions)", "Extended Access @ Blinx Demo Site - testing#3". Each row ends with a `…` kebab (Actions). Top-right `+` FAB (orange/pink) and "Show archived" toggle. Overlay: "6/6 · Configuration → Sessions (role: User + Cancel Session, NOT Admin)". |
| F10 | `frame-390s.jpg` | 06:30 | Same Sessions page, scrolled — rows: "Northwich Flu Clinic (Template — 7 session…", "mike 20 mar untime", "conflict 2", "yes (Template — 28 sessions)", "indie edit all? (Template — 3 sessions)", "23 FCP", "Hillingdon Phlebotomy (Adult) (Template — …", "Session on 12/09/24 (Template — 2 sessions)", "Hillingdon Travel Vaccine (Template — 30 se…", "Dingle Phlebotomy (Clone)", "Dingle Phlebotomy (Clone) (Clone)". Same 6/6 overlay. |
| F11 | `frame-430s.jpg` | 07:10 | Same Sessions page, lower rows: "QA Unmapped Slot 1789604546165", "QA Empty Slot 178884789510", "QA Empty Slot 1790557567036", "QA Empty Slot 1790557821468", "QA Empty Slot 1790733281993", "QA Empty Slot 1790733585652", "QA Unmapped Slot 1789604882715", "QA Empty Slot 1788308017756", "QA Large Series 1790580541290 (Template — …", "QA Empty Slot 1789345612601", "SEAN TEST 8241", "test pac2 7768". Same 6/6 overlay. |

Extra frames (targeted samples at the entry-point / step transitions):

| File | Time | Description |
|---|---|---|
| `extra-15s.jpg` | 00:15 | Overlay "1/6 · Role: Appointment Book User WITHOUT 'Appointment Book Cancel Session' (Admin removed)". User header not yet shown — tester on the "non-permission" persona. |
| `extra-22s.jpg` | 00:22 | Overlay "1/6 · Expected: Access Denied (session cancel needs the new permission) → CHECK" — still on Day view, J2B header hidden. |
| `extra-42s.jpg` | 00:42 | **Access Denied** dialog: pink/orange warning triangle, "You do not have permissions to perform this action. Contact your administrator." with `OK` button. J2B (Johnny Bravo) header now visible. Overlay: "1/6 · Expected: Access Denied … → CHECK". |
| `extra-50s.jpg` | 00:50 | Same Access Denied dialog. Overlay: "1/6 · PASS: 'Access Denied' shown for Cancel session appointments (no request sent)". |
| `extra-55s.jpg` | 00:55 | Day view, no dialog. Overlay: "2/6 · Same user: 'Block session' on an EMPTY session stays an edit (allowed without the new permission)". |
| `extra-60s.jpg` / `extra-64s.jpg` | 01:00 / 01:04 | Block Session dialog with **both buttons rendered** — pink/orange outlined `Cancel` and pink-orange filled `Block Session`. Same 2/6 overlay. |
| `extra-220s.jpg` | 03:40 | Day view, no dialog. Overlay: "4/6 · 'Cancel session appointments' on the booked session → expected: the cancel dialog opens (no Access Denied)". |
| `extra-240s.jpg` | 04:00 | Same Day view (the cancel dialog appears at ~03:50 / F6). Overlay (faded): "4/6 · PASS: permissions (canEdit:true, canAdmin:false, canCancelSession:true) → cancel dialog opens ('3 appointments for 3 patients'). Closing WITHOUT confirming." |
| `extra-250s.jpg` | 04:10 | Edit Session modal, default state (without right-side settings panel) — three rows of 09:00 / 09:20 / 09:40 each with checkbox + `…` kebab. Footer `Save` button (pink) and `Session ends at 16:00`. Overlay: "5/6 · Time edit that drops booked slots: 'Edit Session' on Dan E2E test (09:00–16:00)". |
| `extra-260s.jpg` | 04:20 | Same Edit Session modal with the right-side panel "Session settings" expanded (Session name = `Dan E2E test`, Assigned Locations = `Blinx Healthcare`, Assigned Staff = `1 Selected` (Dr Ellie Bartlett), pink info box "This session has 3 booked patients — Changing location or staff moves their appointments with it. Nobody is notified automatically."). Footer: `Discard` + orange/pink `Done`. Same 5/6 overlay. |

## Transcript / narration

- **No audio stream** in the source file (ffprobe reports 0 streams). No spoken narration was captured.
- The video uses **on-screen text captions only** (black-bordered white pill at the bottom of the frame) — these appear to be post-edited captions the tester added in editing, not live browser-rendered text. They are the source of every "Step N/6" overlay mentioned below.
- UI text observed verbatim:
  - "Appointment Book", "Day / Week / Month / Year", "Sessions 5 | Booked 3 | Available 204 | LIVE 0", "Quick Book", "Go to today".
  - "Session Name / Conflict test / Blinx Healthcare / 08:00 – 16:00" (header for Dr Ellie Bartlett column).
  - "Session Name / Dan E2E test / Blinx Healthcare / 09:00 – 16:00" (header for Dr Ellie Bartlett column).
  - Slot rows labelled with patient `DAN E2E` (pink badge).
  - "Block Session", "No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled.", "Cancel" (outlined), "Block Session" (filled).
  - "Access Denied", "You do not have permissions to perform this action. Contact your administrator.", "OK".
  - "Cancel session appointments", "This will cancel 3 appointments for 3 patients in this session.", "You can choose to notify all patients or proceed without sending a message.", "Cancellation Reason *", "Select a reason", "Cancellation Reason is required.", "Cancel only", "Cancel & notify".
  - "EDIT SESSION", "Dan E2E test", "Blinx Healthcare", "Dr Ellie Bartlett", "Has bookings", "Select All (20 available)", "Tips", "Session ends at 16:00", "Session settings", "Assigned Locations", "Assigned Staff", "Discard", "Done", "Save".
  - "Configuration", left sub-nav "Organisation, Patient, Appointment Books, Quick Pay, Patients & Proxy, Users & Staff, Clinical Config, Case Prioritisation"; right panel "Sessions"; columns "Session Name | Assigned Slot… | Weekdays | Frequency | Actions"; "Search Session…", "Show archived", top-right `+` FAB.
  - User header (top-left): "J2B" avatar, "Johnny (2255) Bravo", "PAC2-9001 QA (temporary)", "General Practice (Demo Site)".

## Workflow observed (6 captioned steps)

The video is split into six captioned scenarios by the tester. Each is described only as observed in the UI; nothing is asserted beyond what is on screen.

### Step 1/6 — Cancel session as a user WITHOUT the new permission
- **User header:** hidden (no J2B avatar visible in the first 30 s); caption says the user is "Appointment Book User WITHOUT 'Appointment Book Cancel Session' (Admin removed)".
- **Route:** Appointment Book → Day view, 11 November 2026, session "Dan E2E test" (09:00–16:00) under Dr Ellie Bartlett.
- **Trigger:** the tester invokes "Cancel session appointments" for the booked session (exact click path not captured in the sampled frames — the "kebab / right-click" moment happens off-frame).
- **Result:** a generic **Access Denied** modal renders: warning triangle, "You do not have permissions to perform this action. Contact your administrator.", `OK` button.
- **Caption verdict:** "1/6 · PASS: 'Access Denied' shown for Cancel session appointments (no request sent)".

### Step 2/6 — Block session on an EMPTY session (control path)
- **User header:** Johnny (2255) Bravo, "PAC2-9001 QA (temporary)", "General Practice (Demo Site)" — top-left avatar `J2B`.
- **Route:** Appointment Book → Day view; the empty session "Conflict test" (08:00–16:00, Daniel Farley column, 48 bookable slots).
- **Trigger:** the tester invokes "Block Session" on the empty session.
- **Result:** `Block Session` dialog: "No patients are booked into this session. This will make all 48 bookable slots non-bookable. No appointments will be cancelled." Two pill buttons — outlined `Cancel` and filled `Block Session`. Tester dismisses with Cancel.
- **Caption verdict:** "2/6 · PASS: Block Session dialog opens for a plain user (FR6). Closing with Cancel, nothing is blocked."

### Step 3/6 — Remove Session as non-Admin
- **Route:** Appointment Book → Day view (no dialog shown in the captured frames).
- **Caption verdict:** "3/6 · PASS: Remove Session denied for non-Admin". The actual denial UI is not captured in the sampled frames (only the caption is).

### Step 4/6 — Cancel session as a user WITH the new permission
- **User header:** Johnny (2255) Bravo.
- **Route:** Appointment Book → Day view, session "Dan E2E test" with 3 booked patients.
- **Trigger:** the tester invokes "Cancel session appointments".
- **Result:** `Cancel session appointments` modal opens with required `Cancellation Reason` select, "This will cancel 3 appointments for 3 patients in this session.", and two pill actions `Cancel only` / `Cancel & notify`. Tester dismisses WITHOUT confirming.
- **Caption verdict:** "4/6 · PASS: permissions (canEdit:true, canAdmin:false, canCancelSession:true) → cancel dialog opens ('3 appointments for 3 patients'). Closing WITHOUT confirming." (The permission triplet `canEdit / canAdmin / canCancelSession` is quoted from the caption — not directly read from the UI in any frame.)

### Step 5/6 — Edit Session on a booked session (pre-existing limitation)
- **Route:** Appointment Book → Day view → opens "Edit Session" on the same "Dan E2E test" session.
- **UI captured:** `EDIT SESSION` modal. Header chips: "Blinx Healthcare · Dr Ellie Bartlett · Has bookings". Left column: 09:00 / 09:10 / 09:20 / 09:30 / 09:40 / 09:50 / 10:00 / 10:10 / 10:20 time labels with checkboxes per slot row; each row has a `…` kebab on the right. Top-right of modal: `Tips` button and a cog/gear icon. Footer: "Session ends at 16:00", with `Discard` / `Done` (or `Save` in the default view) buttons. When the right panel is opened, a `Session settings` form appears: Session name, Assigned Locations, Assigned Staff, and a pink warning "This session has 3 booked patients — Changing location or staff moves their appointments with it. Nobody is notified automatically."
- **Caption verdict:** "5/6 · Note: for a session with bookings, the board modal locks the session times (pre-existing), so no time edit is possible here" and "5/6 · Time edit that drops booked slots: 'Edit Session' on Dan E2E test (09:00–16:00)".

### Step 6/6 — Configuration → Sessions (control path)
- **Route:** left nav `Configuration` → sub-nav `Appointment Books` → right sub-panel `Sessions`.
- **UI captured:** Sessions list with rows covering: demo templates, Northwich Flu Clinic, Hillingdon Phlebotomy / Travel Vaccine, Dingle Phlebotomy (Clone)(Clone), and many QA-generated test rows (`QA Unmapped Slot …`, `QA Empty Slot …`, `QA Large Series …`, `SEAN TEST 8241`, `test pac2 7768`). Each row has a `…` kebab under "Actions". The user is the same Johnny Bravo persona.
- **Caption verdict:** "6/6 · Configuration → Sessions (role: User + Cancel Session, NOT Admin)".

## P7032 evidence (Appointment Book Cancel Session / RBAC)

- **P7032 / "Appointment Book Cancel Session" permission string is referenced** twice in the video captions:
  - "1/6 · Role: Appointment Book User WITHOUT 'Appointment Book Cancel Session' (Admin removed)"
  - The expected result is a generic **Access Denied** dialog (not a custom block / not silently hiding the menu). This is shown as PASS.
- **A new permission property `canCancelSession`** is quoted in the step-4 caption: "permissions (canEdit:true, canAdmin:false, canCancelSession:true) → cancel dialog opens". This is from the caption, not from any visible console / network panel; the video does not surface a dev tools panel.
- **No RBAC activity list** is shown in the video.
- **Step 1 PASS evidence:** `Access Denied` dialog with copy "You do not have permissions to perform this action. Contact your administrator." (`OK` button).
- **Step 4 PASS evidence:** `Cancel session appointments` modal — title, body count "3 appointments for 3 patients", required `Cancellation Reason` select, two actions `Cancel only` / `Cancel & notify`.
- **Step 2 control:** `Block Session` dialog still works for the same user on an empty session — i.e. the new permission is targeted (not "cancel anything").
- **Step 3 claim:** "Remove Session denied for non-Admin" — the dialog itself is not in the sampled frames.
- **Step 5 control:** "Edit Session" on a booked session is acknowledged as a pre-existing limitation (modal locks session times). Confirms the permission change is scoped to cancel, not edit.

## Notable UI elements (entry-point shape)

- **Entry point for "Cancel session appointments":** **not visible in any sampled frame**. The video transitions directly from the Day board to either the Access Denied dialog (step 1) or the Cancel session appointments modal (step 4). Common Paco patterns for similar actions (not confirmed here) are a right-click context menu on a session card, or a per-session `…` kebab. The video does not capture the dropdown. **Open question: capture the menu/dialog trigger explicitly.**
- **Entry point for "Edit Session":** an icon visible in the Day board session header. In the F6 / F7 column for Dr Ellie Bartlett, the session card shows three small icons next to the "Session Name / Dan E2E test" text: a pencil/edit icon, a clipboard/notes icon, and (to the right of the time range `09:00 – 16:00`) a small downward chevron. The edit pencil is the most likely "Edit Session" trigger.
- **"Block Session" entry point:** not visible in sampled frames. Triggered on the "Conflict test" empty session under Daniel Farley.
- **EDIT SESSION modal controls** (captured in detail at F7 / `extra-250s.jpg` / `extra-260s.jpg`):
  - Top right of modal: `Tips` button + **cog/gear icon** (settings toggle, expands the right-side `Session settings` form).
  - Per-slot row: checkbox on the left, slot label `DAN E2E | 20 min` and time range, `…` kebab on the right.
  - Footer: `Session ends at 16:00` info row; primary actions: `Discard` / `Done` (with settings panel open) or `Save` (default view).
- **Configuration → Sessions** list page: `+` FAB (top-right) for create; row-level `…` kebab under `Actions`; left side-nav: Organisation, Patient, Appointment Books, Quick Pay, Patients & Proxy, Users & Staff, Clinical Config, Case Prioritisation. Sub-rail on this page shows "Sessions" (with "Columns" / "Filters" rail on the right edge).

## Dev environment clues

- **Brand:** `paco` (logo top-left, "PACO" wordmark).
- **Browser user shown:** Johnny (2255) Bravo, persona `PAC2-9001 QA (temporary)`, site `General Practice (Demo Site)`. The "(temporary)" suffix and the "QA (temporary)" label strongly suggest a temporary dev/QA account. J2B avatar text matches the username initials.
- **Test data naming:** many rows prefixed `QA Empty Slot <id>`, `QA Unmapped Slot <id>`, `QA Large Series …`. Other tickets referenced by name in the data: `SEAN TEST 8241`, `test pac2 7768`. Patient name `DAN E2E` (booked patient in Dan E2E test session). Session names like `Dan E2E test`, `Conflict test`. Locations: `Blinx Healthcare`, `Coil Clinic`, `Extended Access @ Blin…`, `Mike Audit Test Create`, `Dermatology Clinic`, `Northwich Flu Clinic`, `Hillingdon Phlebotomy`, `Hillingdon Travel Vacc…`, `Test Billable`, `First Contact Physio - e…`, `Andy Mike Test 1`, `Mike Tayla Emmanuel D…`.
- **Calendar:** Day view date `11 November 2026` (a Wednesday).
- **Base URL / host:** **not visible** in any captured frame — the URL bar / address bar is not shown. The page is rendered inside a 1600x960 viewport (Paco app chrome only). The user label "PAC2-9001 QA (temporary)" matches the ticket key PAC2-9001, which is the dev test-bed for this ticket.
- **No network panel / dev tools** is shown. P-code prefix / RBAC activity list / server responses are **not visible** in the video.

## Open questions / contradictions

- **The exact entry-point control for "Cancel session appointments" is not captured** in the video (no right-click menu frame, no kebab dropdown frame). The tester jumps from the Day board to the resulting modal/dialog. The next QA pass should capture the menu/dropdown opening to confirm the menu shape and the "Cancel Session" item label.
- **Step 3 ("Remove Session denied for non-Admin")** only shows the caption — the dialog/toast that produced the PASS verdict is not in the sampled frames.
- **Step 1 (Access Denied)** — the user header (J2B avatar) is not visible in the first ~30 s while the caption says this is a "non-permission" persona. Two readings: (a) the tester logged in as a different user and switched persona via the in-app avatar menu before step 2, or (b) the user header was simply scrolled out of the captured viewport. The video itself does not show the login or persona-switch action.
- **Server response / network panel** is not shown. PASS/FAIL of the access-denied path is inferred from the dialog text, not from a 401/403 response visible to the camera.
- **The "Access Denied" copy is generic** ("You do not have permissions to perform this action. Contact your administrator.") — same wording as other RBAC blocks elsewhere in Paco (not specific to the new "Appointment Book Cancel Session" permission). It does not name the missing permission, which is consistent with a server-side guard but makes the user-facing diagnosis weaker.
- **The pre-existing "Edit Session on a booked session" limitation** is acknowledged in step 5 caption as a pre-existing constraint ("locks the session times … so no time edit is possible here"). The video does not demonstrate whether the *new* cancel permission also gates the Edit Session flow or only the Cancel session appointments action. The 5/6 caption reads as a pre-existing note rather than a P7032 verdict.
- **Configuration → Sessions (step 6) is shown for a non-Admin user but the page is rendered** — the test only checks reachability/visibility, not whether the row kebab shows admin-only actions. The video does not click the row kebab.

## Open menu / dialog items — verbatim (where observed)

- `Block Session` (dialog title) — buttons `Cancel` and `Block Session`.
- `Access Denied` (dialog title) — body "You do not have permissions to perform this action. Contact your administrator." — button `OK`.
- `Cancel session appointments` (dialog title) — body "This will cancel 3 appointments for 3 patients in this session. You can choose to notify all patients or proceed without sending a message." — field `Cancellation Reason *` with helper "Cancellation Reason is required." — buttons `Cancel only` and `Cancel & notify`.
- `EDIT SESSION` (modal title) — fields `Session name`, `Assigned Locations`, `Assigned Staff` — info box "This session has 3 booked patients — Changing location or staff moves their appointments with it. Nobody is notified automatically." — buttons `Discard` / `Done` (or `Save` in default view).
- `Configuration` / `Appointment Books` / `Sessions` — table columns `Session Name | Assigned Slot… | Weekdays | Frequency | Actions` — controls `Search Session…`, `Show archived`, top-right `+` FAB.

— end —
