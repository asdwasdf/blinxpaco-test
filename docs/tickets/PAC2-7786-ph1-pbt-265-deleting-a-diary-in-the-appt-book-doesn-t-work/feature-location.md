# Feature Location: PAC2-7786

**Input Revision:** 1  
**Environment:** `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`  
**Role:** `Super Admin GB` (visible session role)  
**Observed:** 2026-10-01  
**Status:** Located  
**Budget:** 3/12 meaningful views; within 15-minute limit

## Search clues

- Exact terms: `Appointment Book`, `Appointment Settings`, `Sessions`, `Delete Session`, `Block Session`.
- Aliases: diary, session, appointment-book configuration, remove session.
- Reusable product-survey hint: dashboard sidebar `Appointment Book` → `Appointment Settings` → `/paco-connect/configuration`.

## Confirmed entry path

1. Open `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-7786`.
   - Read-only result: redirect tới `/paco-connect/feature-branch/pac2-7786/dashboard`.
   - Landmark: authenticated `PACO Connect` shell; visible role `Super Admin GB`.
2. Chọn navigation image `Appointment Book`.
   - Read-only result: submenu hiện `Appointment Book` và `Appointment Settings`.
3. Chọn `Appointment Settings`.
   - Read-only result: mở `/paco-connect/feature-branch/pac2-7786/configuration`.
   - Feature-root landmarks: `Search Session...`, toggle `Active`/`Removed`, grid session có cột `Actions`.

## Context requirements

- Authenticated session trên shared dev host.
- Visible role hiện tại: `Super Admin GB`; capability được quan sát trực tiếp cho route này.
- Feature branch phải giữ prefix `/paco-connect/feature-branch/pac2-7786` khi chuyển từ dashboard sang configuration.

## Candidate and rejected paths

- Confirmed: feature-branch dashboard → `Appointment Book` → `Appointment Settings` → feature-branch configuration.
- Rejected: `https://pac2-7786.dev.blinxpaco-np.com/paco-connect/configuration`; HTTP 404, sai deployment shape.
- Rejected: `https://blinx.dev.blinxpaco-np.com/paco-connect/configuration`; shared non-feature route, không chứng minh build PAC2-7786.

## Observed landmarks

- Feature dashboard URL: `/paco-connect/feature-branch/pac2-7786/dashboard`.
- Navigation image: `Appointment Book`.
- Submenu buttons: `Appointment Book`, `Appointment Settings`.
- Feature root URL: `/paco-connect/feature-branch/pac2-7786/configuration`.
- Session controls: `Search Session...`, `Active`, `Removed`; session grid có `Actions`.

## Evidence

- `test-results/PAC2-7786/locate/20261001-145432/feature-branch-root.yml` — feature-branch root navigation, 2026-10-01; local raw evidence.
- Playwright accessibility observation, 2026-10-01 — feature-branch dashboard, visible role `Super Admin GB`, navigation `Appointment Book` → `Appointment Settings`.
- Playwright accessibility observation, 2026-10-01 — feature-branch configuration with `Search Session...`, `Active`/`Removed`, session grid and `Actions`.
- Earlier `20261001-144144` and `20261001-145200` evidence documents rejected non-feature URLs only; không dùng làm evidence cho feature root.

## Automation hints

- Stable visible entry labels: `Appointment Book`, `Appointment Settings`.
- Assert destination host before continuing into PACO Connect.
- Wait for session-configuration landmark or explicit terminal HTTP/error state; do not treat `PACO Connect` title alone as route success.

## Blockers and next action

- Không còn blocker cho `LOCATE`; feature-root đã được xác nhận trên đúng feature-branch path.
- Next action: chuyển sang `EXPLORE` read-only tại configuration để quan sát `Active`/`Removed`, row actions và mutation boundary của diary/session deletion.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
