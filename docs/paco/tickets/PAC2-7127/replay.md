# Replay: PAC2-7127 — Consultation Ended Status Reset

**Ticket:** PAC2-7127
**Batch:** pac2-7127-single
**Executed:** 2026-10-18
**Environment:** dev main (`blinx.dev.blinxpaco-np.com`)
**Result:** Partially Replayed

## Source

- Ticket: `ticket/PAC2-7127-paco-connect-unable-to-remove-consultation-ended-status-once-selected/ticket.md`
- Requirements: `docs/paco/tickets/PAC2-7127/requirements.md`

## QA History

Ticket marked **Done** after two QA passes on feature branch:

1. **Sean Huynh** (2026-10-07): "PASSED QA on FB" — evidence: `Screen Recording 2026-10-07 at 3.43.53 PM.mov`
2. **Abbi Russell** (2026-10-07): "pass" — evidence: `save.mp4`

Original bug reported 2026-07-03 with video `20260703-0837-49.5047989.mp4`: error "Reset failed, but status cleared locally" when attempting to remove "Consultation Ended" status.

## Replay Attempt (2026-10-18)

### Browser State
- Auth: credential từ `.env` `PAC_USERNAME`/`PAC_PASSWORD` (Blinx Deployment, General Practice Demo Site)
- Page: `/paco-connect/appointment-book`
- Day view: 18 Oct 2026 — 0 booked slots visible
- Week view: 12–18 Oct 2026 — 8 booked across week; Thursday 15/10 has 5 booked (14:00–22:00 range)

### Blockers

1. **Booked slots off-screen in Week view** — booked appointments in Thursday column render outside visible viewport (container overflow hidden), preventing direct interaction with existing bookings.
2. **Calendar date picker non-functional** — clicking calendar cells does not navigate to selected date reliably; 15 October not reachable via picker.
3. **Quick Book flow incomplete** — patient search works but booking submission not completed within session scope.
4. **Booked appointment data stale/expired** — 8 booked appointments reported in Week view on 18 Oct 2026 (Thursday 15/10 = 5 booked, 14:00–22:00), but detailed appointment elements have zero height (`height: 0%`) — appointments have been cancelled or expired. Actual appointment data no longer exists in the system.
5. **Calendar picker state loss** — after navigating between Day/Week views, calendar picker reverts to current date (18 Oct) rather than remembering last selected date.

### Navigation Confirmed

- Entry: `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` → `Appointment Book` tab → `/paco-connect/appointment-book`
- HTTP 404 on initial load is expected — SPA renders after 10–15s, wait for "Loading" to disappear
- Auth via PACO OS login → redirects to PACO Connect dashboard
- Role `Blinx Deployment` (Johnny Bravo 2255) can access Appointment Book
- `Quick Book` button opens dialog with patient search
- Week view shows booked count per day: Thursday 15/10 = 5 booked

### Flow Inference

From PAC2-8575 (single-click arrive) and PAC2-6997 (patient status filter) known flows:

1. **Entry point**: Single-click on patient slot → opens `Appointment Details` sidebar with `Mark as: Select Patient Status`
2. **Patient Status options**: `Patient Arrived`, `Consultation Started`, `Consultation Ended`, `Patient Left`, `Did Not Attend`, `Appointment Cancelled`
3. **Reset mechanism**: Selecting a different status from dropdown OR clicking X/clear on the status chip
4. **Bug**: Error "Reset failed, but status cleared locally" — status not actually cleared

## Expected vs Observed

| Aspect | Expected (QA on FB) | Observed (dev main) |
|--------|---|---|---|
| Consultation Ended status selectable | Yes | Not tested |
| Reset clears status | Yes | Not tested |
| Error message | None | Not tested |

## Evidence References

- Bug videos: `ticket/PAC2-7127/attachments/117324-20260703-0837-49.5047989.mp4`, `117325-20260703-0835-20.2549319.mp4`
- QA pass videos: `ticket/PAC2-7127/attachments/129060-save.mp4`, `128962-Screen Recording 2026-10-07 at 3.43.53 PM.mov`

## Open Questions

- Was the fix for PAC2-7127 merged to dev main? QA passed only on feature branch.
- Dev main regression not verified — slot navigation blocked by off-screen rendering and stale test data.
- Quick Book mutation not completed — requires deeper exploration to reach a booked appointment.
- Booked appointment data on dev is ephemeral — 5 booked appointments on Thursday 15/10 visible in summary count, but appointment elements render with zero height. Test data may expire or be cleaned up between sessions.

## Classification

- **Result**: `Partially Replayed`
- **Reason**: Navigation to booked slot not achieved; Quick Book flow not completed; original bug behavior on dev main unconfirmed
- **Confidence**: Low — dev main behavior may differ from feature branch where QA passed

---
