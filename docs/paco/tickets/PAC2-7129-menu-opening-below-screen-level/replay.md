# PAC2-7129 — Replay

**Bug:** Menu opening below screen level
**Epic:** PAC2-7081 October 2026 - PACO Connect & Appointment Book Mop Up
**Status:** Done
**Environment:** dev (`blinx.dev.blinxpaco-np.com`)

---

## Prerequisites

| | |
|---|---|
| Auth | credential từ `.env` `PAC_USERNAME`/`PAC_PASSWORD` — pre-filled on login page |
| Role | GP at General Practice (Demo Site), location "test again - old location" |
| Entry | `https://blinx.dev.blinxpaco-np.com/paco/dashboard` |
| Feature branch | `pac2-7081-2` — access denied (no permission); DEV used instead |

---

## Steps

1. Navigate to `https://blinx.dev.blinxpaco-np.com/paco/login`
2. Credentials pre-filled → click `Log in`
3. Redirected to `/paco/location-roles` → select Organisation → Location → Role (GP) → `Next`
4. Arrive at `/paco/dashboard` → dismiss status dialog → dismiss "Remind me later"
5. Click `More options` button (user area, top-right)
6. Menu renders — check position

---

## Expected result

Dropdown menu opens within viewport — visible, accessible, not clipped below screen.

---

## Actual result

✅ **PASS — Verified on DEV (2026-10-18)**

Menu renders at correct position, fully visible within viewport. Items: PaComms (0), Quick View, PACO Assist, Success (×2). No clipping or overflow.

Feature-branch URL (`pac2-7081-2`) returns "Access Denied" — no permission for this account. FB not retested.

---

## Evidence

| | |
|---|---|
| S1: Menu position | `evidence/pac2-7129-menu-position.png` |

---

## QA history

| Who | Result | Environment | Date |
|---|---|---|---|
| Sean Huynh | PASSED QA | DEV | Oct 2026 |
| Sean Huynh | PASSED on FB | `pac2-7081-2` | Oct 2026 |
| Replay | PASS | DEV | 2026-10-18 |

---

## Notes

- Bug title refers to menus/dropdowns opening off-screen — a CSS `overflow` or `position` issue.
- The `More options` menu on the Dashboard user bar was the primary test target (matching the QA screen recordings attached to the ticket).
- All dropdowns tested (Organisation, Location, Role) opened at correct position.
- `Appointment Settings` button in Appointment Book tab navigates to `/paco-connect/configuration` → 404 — unrelated to this bug, but noted as a potential navigation defect.
