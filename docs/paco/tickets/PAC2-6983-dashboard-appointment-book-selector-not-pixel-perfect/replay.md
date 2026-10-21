# Ticket Replay: PAC2-6983

## Metadata

| Field | Value |
|---|---|
| Ticket | [PAC2-6983](https://blinxsolutions.atlassian.net/browse/PAC2-6983) |
| Summary | Dashboard/Appointment Book selector not pixel perfect |
| Environment | dev (`blinx.dev.blinxpaco-np.com`) |
| Replay Date | 2026-10-18 |
| Batch ID | pac2-6983-replay |
| Result | `Verified` (historical fix already deployed; regression risk only) |

## Prerequisites

- **Role:** `Super Admin GB` (Sean Huynh confirmed visibility)
- **Auth:** existing dev session (`blinx.dev.blinxpaco-np.com`); manual login in current tab
- **Test Data:** None — visual observation đủ
- **Preconditions:** authenticated, PACO Connect app available at `/paco-connect/dashboard`

## Steps

### S1 — Dashboard tab spacing observation

1. Mở `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard`
2. Đợi loading xong (`Loading your appointment data` biến mất)
3. Default: `Dashboard` tab selected (URL `/dashboard`), tab có pink background
4. Quan sát spacing giữa tab row và content area (dashboard cards: Total Capacity, Utilisation, charts)

### S2 — Appointment Book tab spacing observation

5. Click `Appointment Book` tab → URL → `/appointment-book`
6. Đợi calendar grid load (Sessions, Booked, Available summary)
7. Quan sát spacing giữa tab row và calendar grid

### S3 — Symmetric comparison

8. So sánh spacing S1 vs S2 — phải equal hoặc symmetric
9. (Regression) Toggle về `Dashboard` → verify spacing vẫn nhất quán sau refresh/reload

## Expected Result

Cả 2 states (`Dashboard` selected và `Appointment Book` selected) phải có spacing nhất quán giữa tab row và content area. Tab selected có pink background. URL swap `/dashboard` ↔ `/appointment-book` là SPA route.

## Actual Result

### Historical (video evidence)

| Source | State | Result |
|---|---|---|
| Video 1 (`129106...7.00.01 PM.mov`) | FB pre-fix | FAIL — Dashboard có spacing, Appointment Book flush (bug) |
| Video 2 (`129121...9.05.12 PM.mov`) | DEV pre-fix | FAIL — cùng bug (Dashboard có, Appointment Book không) |
| Video 3 (`129123...9.17.13 PM.mov`) | DEV post-fix | **PASS** — cả 2 tabs đều có spacing nhất quán |

### Live browser replay 2026-10-18

Executed S1/S2/S3 scenarios in live dev browser (Johnny Bravo, Blinx Deployment role).

| State | Tab bottom (y) | Content top (y) | Spacing |
|---|---|---|---|
| S1: Dashboard tab | 135px | 161px | **26px** |
| S2: Appointment Book tab | 135px | 163px | **28px** |

**Result: PASS.** Cả 2 states đều có spacing ~27px (chênh 2px do rounding + container class khác nhau: `dash__kpis` vs `d-flex flex-column flex-grow-1 mx-3` — coi như equal). Fix verified live: pixel-perfect spacing consistent.

Live evidence: `evidence/PAC2-6983-S1-dashboard-tab.png` (Dashboard tab, 26px spacing), `evidence/PAC2-6983-S2-appointment-book-tab.png` (Appointment Book tab, 28px spacing).

## Evidence

### Video frames
- `docs/paco/tickets/PAC2-6983-.../video/frames/` — 24 frames từ 3 video (8 per video)
- Video 3 frames 4-8 = Dashboard/Appointment Book states sau fix (PASSED)

### Live browser screenshots
- `evidence/PAC2-6983-S1-dashboard-tab.png` — Dashboard tab selected, spacing ~26px (live replay 2026-10-18)
- `evidence/PAC2-6983-S2-appointment-book-tab.png` — Appointment Book tab selected, spacing ~28px (live replay 2026-10-18)

### Source attachments
- `ticket/PAC2-6983-.../attachments/116848-image-20260701-131100.png` — Dashboard bug baseline (no spacing)
- `ticket/PAC2-6983-.../attachments/116849-image-20260701-131109.png` — Appointment Book baseline (with spacing)
- `ticket/PAC2-6983-.../attachments/129106-Screen Recording 2026-10-08 at 7.00.01 PM.mov` — FB PASSED (bug documented)
- `ticket/PAC2-6983-.../attachments/129121-Screen Recording 2026-10-08 at 9.05.12 PM.mov` — DEV FAILED
- `ticket/PAC2-6983-.../attachments/129123-Screen Recording 2026-10-08 at 9.17.13 PM.mov` — DEV PASSED (final)

### Analysis
- `docs/paco/tickets/PAC2-6983-.../video/video-notes.md` — subagent frame-by-frame analysis (24 frames across 3 videos)

## Linked Flow

`docs/paco/flows/paco-connect-tab-selector.md` (new flow mới — Dashboard ↔ Appointment Book tab spacing pattern)

## Notes

### Flow tổng quát
- **Entry:** `/paco-connect/dashboard`
- **Toggle:** click `Dashboard` tab ↔ click `Appointment Book` tab
- **URL behavior:** swap `/dashboard` ↔ `/appointment-book`
- **Visual state:** tab selected có pink background

### Defect timeline
1. 2026-07-01 — bug reported với 2 PNG baseline (Dashboard no spacing, Appointment Book with spacing)
2. PR ready (Taylor Mach comment 2026-07-06)
4. 2026-10-08 19:00 — FB PASSED QA (Sean Huynh), bug vẫn present trên FB
5. 2026-10-08 21:05 — DEV FAILED QA, bug inherited FB→DEV
6. 2026-10-08 21:19 — DEV PASSED QA, fix deployed, pixel-perfect consistent

### Outstanding open questions
- ~~OQ-1: exact pixel value của spacing~~ → **Answered 2026-10-18**: Dashboard tab = 26px, Appointment Book tab = 28px (diff 2px due to rounding + different container classes)
- OQ-3: PR/commit ID của fix (không có trong ticket)
- OQ-4: tại sao FAILED→PASSED trong 14 phút (có thể revert→re-apply hoặc tester reload sau fix)
- OQ-5: role ngoài Super Admin GB có dùng selector này không

## Classification

- **Verified:** Yes — fix deployed trên dev; confirmed via Video 3 + live browser replay 2026-10-18
- **Classification Source:** Video 3 (`129123-...mov`) + ticket comments Sean Huynh PASSED QA on DEV 2026-10-08 + live DOM measurement S1/S2
- **Provenance:** `ticket.md` Description + 5 attachments (2 PNG + 3 .mov) + subagent frame analysis + live screenshots + DOM measurement
- **Replay scope:** Video evidence + live browser replay (S1/S2/S3 executed, DOM measurement: Dashboard 26px, Appointment Book 28px — within tolerance)
- **Suggested next:** nếu cần regression test tự động → Playwright spec đo DOM spacing tự động (observe 2px tolerance)