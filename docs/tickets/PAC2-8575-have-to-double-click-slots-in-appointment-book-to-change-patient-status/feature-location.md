# Feature Location: PAC2-8575

**Input Revision:** 1
**Environment:** `dev` (feature-branch host)
**Role:** `Blinx Deployment`
**Observed:** 2026-10-15T15:58:00Z
**Status:** Confirmed
**Budget:** 1/12 views; ~3/15 minutes

## Search clues

- Exact term: `Appointment Book` (PACO Connect module)
- Aliases: `Appt. Book`, `Appointment Book`, `PACO Connect`, `Day view`
- Actor/context: Reception flow (`arrive patient`); ticket PAC2-8575
- Trigger noun: `arrive`, `patient status`, `double click slot`
- Target noun: `slot` (patient appointment slot in Day view)
- Tester-provided route: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book`

## Confirmed entry path

1. Starting state: `https://blinx.dev.blinxpaco-np.com/paco/login` (auth expired at session start)
   - Landmark/control: `User Name` textbox, `Password` textbox
   - Read-only action: fill `blinx_johnny.bravo` / `Blinx!82` (per `playwright/support/admin-login.ts`) → `Log in` button (manual via MCP since fixture path requires own page instance)
   - Resulting state: `https://blinx.dev.blinxpaco-np.com/paco/location-roles?rd=%2Fpaco%2Fdashboard`
   - Context dependency: 3 dropdowns `Organisation` / `Location` / `Role`

2. Starting state: `/paco/location-roles`
   - Landmark/control: `Organisation` dropdown, `Location` dropdown, `Role` dropdown, `Next` button
   - Read-only action: select `General Practice (Demo Site)` → `test again - old location` → `Blinx Deployment` → `Next`
   - Resulting state: `https://blinx.dev.blinxpaco-np.com/paco/dashboard`
   - Context dependency: account must have role `Blinx Deployment` (or equivalent Super Admin) at chosen org+location

3. Starting state: `/paco/dashboard` (authenticated as Johnny Bravo / Blinx Deployment / General Practice (Demo Site))
   - Landmark/control: browser address bar
   - Read-only action: navigate trực tiếp tới feature-branch URL `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book`
   - Resulting state: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book` — PACO Connect Appointment Book, Day view, `15 October 2026`
   - Context dependency: phải giữ prefix `feature-branch/pac2-8575/` để đảm bảo load đúng build của ticket (theo `paco-known-feature-routes.md`)

## Context requirements

- Global context: org `General Practice (Demo Site)`, location `test again - old location`, role `Blinx Deployment` (Johnny Bravo 2255).
- Date context: Day view mặc định là `15 October 2026`; cần ngày có session + slot có patient để test arrive.
- Ticket scope: chỉ Appointment Book root + slot click/right-click context (reception arrive). Configuration/Settings out of scope cho ticket này.

## Candidate and rejected paths

- Candidate: `/paco/dashboard` → sidebar `Appointment Book` → submenu `Appointment Book` (default route). Rejected vì default route không chứng minh build của feature-branch; chỉ là control path. Tester cung cấp explicit feature-branch URL nên dùng URL đó.
- Rejected: `/paco-connect/appointment-book` (default Connect route, không có build của ticket) — confirmed ở PAC2-9001.
- Rejected: `/paco-connect/configuration` — Settings/Sessions, out of scope cho arrive flow.

## Observed landmarks

- Sidebar items: `Dashboard`, `Appointment Book` (icon `Appt. Book`), `Quick Send` (icon), `Quick Book`.
- View toggle: `Day` / `Week` / `Month` / `Year` (default `Day`).
- Date control: `15 October 2026`, `Go to today`.
- Summary cards: `Sessions`, `Booked`, `Available` (count values quan sát được).
- `LIVE` indicator.
- Session header có `Session Name`, `Time`, `Appointment`; slots có time range `(10m)`, patient name (`Mrs MAJDIYYA FAWZIA DUAL`...), phone/ID hint.
- Top-bar account info: `Johnny (2255) Bravo`, `Blinx Deployment`, `General Practice (Demo Site)`.

## Evidence

- `test-results/PAC2-8575/locate/20261015T155741Z/appointment-book-root.yml` — initial navigation snapshot (15:57:31Z, page title "PACO Connect", URL feature-branch confirmed).
- `test-results/PAC2-8575/locate/20261015T155741Z/appointment-book-day-view.yml` — Day view rendered (15:58:40Z, summary `Sessions 23` / `Booked 6` / `Available 1,018`).
- Local evidence; redaction: KHÔNG có patient identifier / clinical / auth data trong evidence; chỉ UI landmark + summary count. Patient name xuất hiện trong slot là `Mrs MAJDIYYA FAWZIA DUAL` — synthetic test data (tên + role labels giả định, không phải PII thật).

## Automation hints

- Stable URL: `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-8575/appointment-book` (HTTP có thể trả 4xx nhưng UI render — same pattern với PAC2-7137/9001).
- Wait: chờ DOM `readyState=complete` + summary card text chứa `Sessions` xuất hiện; tránh HTTP status check.
- Day view default; để chuyển view dùng `Day/Week/Month/Year` toggle.
- `Go to today` resets date về `2026-10-15`.
- Patient slot có time range (e.g. `08:00 08:10 (10m)`) + patient name; chọn slot có status chưa `Arrived` để test arrive.

## Blockers and next action

- Blocker: None.
- Next action: Sang phase `EXPLORE` (`paco-explore` mode `observe`) để quan sát behavior click slot trên feature-branch host, xác minh single click đã trigger arrive (fix) hay vẫn cần double click (regression). Verify scope (chỉ `Arrive` hay mọi status transition) — trả lời Open Question REQ-PAC2-8575-002.

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
