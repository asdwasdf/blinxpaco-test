# Scenarios: PAC2-6983

**Generated:** 2026-10-18
**Mutation Class:** `None` (read-only visual diff)
**Host:** `blinx.dev.blinxpaco-np.com` (dev)

## Scenario Map

| Scenario | Module | Toggle | Expected | Replay Status |
|---|---|---|---|---|
| S1 | PACO Connect | `Dashboard` tab | spacing between tab row and content area | Manual review only (visual) |
| S2 | PACO Connect | `Appointment Book` tab | spacing between tab row and calendar (symmetric với S1) | Manual review only (visual) |
| S3 | PACO Connect | Toggle Dashboard ↔ Appointment Book | spacing nhất quán cả 2 states | Replay Confirmed via Video 3 evidence |

## S1 — Dashboard tab selected

**Entry:** `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` → click `Dashboard` tab (URL → `/dashboard`)
**Precondition:** authenticated, `Super Admin GB` role
**Mutation:** None
**Expected:** tab row có visible gap xuống content cards (dashboard widgets: Total Capacity, Utilisation, charts)
**Visual evidence (Dev after fix):** `video/frames/video-3-frame-6.png`, `video-3-frame-7.png`, `video-3-frame-8.png`
**Visual evidence (Dev before fix):** `video/frames/video-2-frame-5.png`

## S2 — Appointment Book tab selected

**Entry:** `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` → click `Appointment Book` tab (URL → `/appointment-book`)
**Precondition:** authenticated, `Super Admin GB` role
**Mutation:** None
**Expected:** tab row có visible gap xuống calendar grid (Sessions, Booked, Available)
**Visual evidence (Dev after fix):** `video/frames/video-3-frame-4.png`, `video-3-frame-5.png`
**Visual evidence (Dev before fix):** `video/frames/video-2-frame-7.png`, `video-2-frame-8.png`

## S3 — Symmetric spacing (S1 vs S2)

**Compare:** S1 spacing ≈ S2 spacing
**Fail condition:** asymmetric — một tab có spacing, tab kia flush to content
**Confirmed via:** Video 3 (Sean Huynh PASSED QA 2026-10-08 21:19:41Z); both tabs nhất quán spacing sau fix deploy
**Historical fail:** Video 1 FB + Video 2 DEV — asymmetric (Dashboard có, Appointment Book không)

## Reproduce steps (tổng hợp)

1. Mở `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard`
2. Wait cho `Loading your appointment data` biến mất (per Video 2 frame 1-3)
3. Default view: Dashboard tab selected. Observe spacing giữa tab row và content.
4. Click `Appointment Book` tab. URL → `/appointment-book`. Wait calendar load.
5. Observe spacing giữa tab row và calendar grid.
6. Compare spacing ở cả 2 states — phải equal hoặc symmetric.
7. (Regression test) Click `Dashboard` tab quay lại. Verify spacing vẫn nhất quán.

## Mutation boundary

- Read-only. KHÔNG touch patient data, session config, hoặc appointment booking.
- KHÔNG cần test data — visual observation đủ.
- Auth: dùng existing session, không cần login mới.

---

## Tester notes

[Protected area]