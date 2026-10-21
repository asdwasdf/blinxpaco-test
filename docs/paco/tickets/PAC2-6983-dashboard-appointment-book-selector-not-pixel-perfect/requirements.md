# Requirements: PAC2-6983

**Input Revision:** 1
**Generated:** 2026-10-18
**Status:** Active

## Source Summary

Tab selector `Dashboard` vs `Appointment Book` ở **PACO Connect** (`/paco-connect/dashboard`) không pixel perfect: khi `Dashboard` selected có spacing giữa tab và content area; khi `Appointment Book` selected không có spacing (calendar flush to tabs). Dev đã fix; Sean Huynh PASSED QA trên DEV (2026-10-08). Acceptance criteria ticket = "Not provided".

## Video Coverage

**Timeline:** N/A (subagent xem trực tiếp 3 .mov, ghi `video-notes.md`)
**Contact Sheet:** `docs/paco/tickets/PAC2-6983-.../video/frames/` (24 frames, 8 per video)

Key findings từ `video-notes.md`:
- Entry: `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard`
- Toggle: click `Dashboard` tab (URL `/dashboard`) ↔ click `Appointment Book` tab (URL `/appointment-book`)
- Bug state (Video 1 FB + Video 2 DEV): `Dashboard` selected có spacing; `Appointment Book` không có spacing → inconsistent
- Fix state (Video 3 DEV): cả hai tab đều có spacing nhất quán

## Atomic Requirements

### REQ-PAC2-6983-001

**Classification:** `Confirmed` (PASSED QA on DEV 2026-10-08, evidence video `129123-...mov`)
**Lifecycle:** `Resolved` (fix deployed; only regression risk remains)
**Feature/Scope:** `PACO Connect` — tab selector `Dashboard` ↔ `Appointment Book` ở entry route
**Search Terms/Aliases:** `Dashboard`, `Appointment Book`, `Appt. Book`, `tab selector`, `connect-dashboard`, `connect-tabs`
**Known Location:** `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` (tab row trên top, content area bên dưới)
**Actor/Role:** role test = `Super Admin GB` (Sean Huynh); reception/receptionist có thể cũng relevant nhưng chưa confirm
**Inference Basis:** N/A (Confirmed)
**Observation Context:** dev, `Super Admin GB`, 2026-10-08 21:17:13 GMT+1 (evidence video PASSED)
**Acceptance Criteria Status:** Missing — ticket description chỉ mô tả visual diff, không có AC chính thức

**Preconditions:**
- Authenticated session trong dev (`https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard`)
- Có 2 tab trên page: `Dashboard` và `Appointment Book` (selected có pink background per `video-notes.md`)

**Expected Behavior:**
- Khi `Dashboard` tab selected → spacing giữa tab row và content cards CÓ (visible gap)
- Khi `Appointment Book` tab selected → spacing giữa tab row và calendar grid CÓ (cùng spacing như Dashboard state)
- Hai state phải pixel-perfect đối xứng (cùng spacing). Bug trước fix: `Dashboard` có spacing, `Appointment Book` không có.

**Provenance:**
- **Source:** `ticket/PAC2-6983-dashboard-appointment-book-selector-not-pixel-perfect/ticket.md:13` (Description)
- **Input Revision:** 1
- **First Recorded:** 2026-07-01 (screenshot `116848-...png`, `116849-...png`)
- **Last Verified:** 2026-10-08 (Sean Huynh PASSED QA on DEV, video `129123-...mov`)
- **Status history:** PASSED on FB → FAILED on DEV → PASSED on DEV (after fix)

**Evidence:**
- `attachments/116848-image-20260701-131100.png` — Dashboard state gốc (no spacing → bug)
- `attachments/116849-image-20260701-131109.png` — Appointment Book state gốc (with spacing → baseline)
- `attachments/129106-Screen Recording 2026-10-08 at 7.00.01 PM.mov` — PASSED on FB (bug vẫn có mặt)
- `attachments/129121-Screen Recording 2026-10-08 at 9.05.12 PM.mov` — FAILED on DEV (bug từ FB → DEV)
- `attachments/129123-Screen Recording 2026-10-08 at 9.17.13 PM.mov` — PASSED on DEV (fix deployed)

**Related Tests:** PAC2-6983-TC-001..003 (see `scenarios.md`)

**Notes:**
- Bug visual diff tối thiểu — chỉ spacing giữa tab và content. Quan sát pixel-level cần screenshot compare hoặc DOM inspection (`margin`/`padding` của wrapper giữa tab row và content container).
- Không có AC chính thức; expected = visual symmetry giữa 2 selected states.
- Timeline: FB có bug → DEV inherit bug → fix deploy lên DEV trong ~14 phút (FAILED 21:05:32 → PASSED 21:19:41) — xem OQ-4 dưới.

---

## Ambiguities and Conflicts

- **AC missing**: ticket không có `Acceptance criteria`. "Pixel perfect" subjective — expected dựa trên symmetry quan sát được trong Video 3 (cả 2 tabs có spacing nhất quán).
- **Module scope**: Description chỉ nói "Dashboard/Appointment Book selector"; video xác nhận = tab selector trên **PACO Connect** (`/paco-connect/dashboard`), KHÔNG phải `/paco/dashboard` (top-level PACO OS). Tên ticket "Dashboard" ambiguous — có Dashboard cards trên PACO OS, có Dashboard tab trên PACO Connect, cả hai khác nhau.
- **Toggle URL**: Video 3 frame 6-7 confirm URL thay đổi khi toggle (`/dashboard` ↔ `/appointment-book`). Không rõ đây là SPA route swap hay full navigation.

## Open Questions

- ~~OQ-1~~: Selector là tab row, dropdown, hay 2 card riêng biệt? Video confirm = 2 tab trên cùng row (pink background cho selected state). **[Answered: tab row, confirmed by live browser snapshot + DOM]**
- ~~OQ-2~~: Spacing pixel chính xác là bao nhiêu? **[Answered 2026-10-18 live]: Dashboard tab = 26px, Appointment Book tab = 28px (2px diff from rounding + different container class names). Within tolerance.**
- OQ-3: Fix FB→DEV: PR/commit ID nào resolve? Không có trong ticket comments.
- OQ-4: Tại sao FAILED → PASSED trong ~14 phút trên DEV? (21:05:32 → 21:19:41) — revert→re-apply, hoặc tester mis-click, hoặc cache issue. Video 3 có thể chạy sau khi tester reload page sau khi fix đẩy.
- OQ-5: Role nào khác ngoài `Super Admin GB` dùng selector này? Reception có dùng không?

---

## Tester notes

[Protected area]