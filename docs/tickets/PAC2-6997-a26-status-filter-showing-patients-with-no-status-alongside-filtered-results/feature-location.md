# PAC2-6997 — Feature Location

## Ticket

`PAC2-6997-a26-status-filter-showing-patients-with-no-status-alongside-filtered-results`

## Location Mode

`LOCATE`

## Environment

`dev` → `https://blinx.dev.blinxpaco-np.com`

## Role

`receptionist` (appointment book access)

## Route Status

**`Blocked: Authentication required`**

## Entry Path

`/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book`

**Or direct:** `/paco-connect/appointment-book`

## Observed Route

1. Navigate to `https://blinx.dev.blinxpaco-np.com/paco/dashboard`
2. Click sidebar `Appointment Book` → `Appointment Book`
3. URL: `/paco-connect/appointment-book`
4. Expected: Day view với Patient Status filter

## Feature Map Entry (existing, still valid)

| Field | Value |
|---|---|
| Entry | authenticated session → sidebar `Appointment Book` → submenu `Appointment Book` |
| Route | `/paco-connect/appointment-book` |
| Role | Receptionist / Practitioner / Manager |
| Environment | dev |
| Classification | `Confirmed` |
| Last verified | 2026-10-07 |
| Source | `PAC2-6997/feature-location.md` |

## Evidence

1. Navigate `/paco-connect/appointment-book` → redirect `/paco/login?src=connect&rd=...` (auth required)
2. Feature-map already has confirmed route from prior tickets

## Blocker

**Auth expired/blocked** — tester cần đăng nhập thủ công trong tab browser hiện tại, sau đó resume LOCATE.

## Budget

- Views counted: 0 (blocked at auth)
- Time: < 1 min

## Next Action

Test đăng nhập xong → báo lại để tiếp tục LOCATE.

## Tester notes
