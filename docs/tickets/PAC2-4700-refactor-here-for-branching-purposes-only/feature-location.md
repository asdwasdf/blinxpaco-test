# Feature Location: PAC2-4700

**Input Revision:** 1
**Environment:** dev baseline `https://blinx.dev.blinxpaco-np.com/paco/dashboard`; Connect `https://blinx.dev.blinxpaco-np.com/paco-connect/feature-branch/pac2-4700-qs-only/dashboard`; OS `https://blinx.dev.blinxpaco-np.com/paco/feature-branch/pac2-4700-qs-only/dashboard`; GP `https://pac2-4700-qs-only.dev.blinxpaco-np.com/` (login only)
**Role:** `Super Admin GB`
**Located:** 2026-09-23T20:02:41+07:00
**Status:** Confirmed with warnings
**Budget:** 11/12 views; ~7/15 minutes
**Mutation:** None

## Search clues

- Exact: `Quick Send`, `Select Campaign`, `Booking Link`, `Health Forms`, `Attachments`, `Scheduler Link Required`
- Aliases: `QS`, `Rocketbar`, `patient actions`, `+`
- Actor/context: authenticated staff; patient selected from global search; `Quick Send` dialog
- Tester-provided (optional): global patient search → `+` (`aria-label="Patient actions menu"`) → `Quick Send`; do not click patient row

## Product Graph Lookup

`docs/product/feature-map.md` không có entry `Quick Send`.

`docs/product/survey/graph.json`:

- `patient-search` (`/paco/patient-search`) — survey `Patients` → `Patient Search`; **không** phải global header search dùng cho QS
- `connect-dashboard` (`/paco-connect/dashboard`) — survey mainline Connect 404; **không** reusable cho feature branch
- Sidebar survey không ghi dialog `Quick Send`

Không có reusable QS route để validate 1–3 views. Scan từ dashboard.

## Confirmed entry path

Áp dụng trên **baseline PACO OS**, **Connect branch**, **OS branch**. Cùng role `Super Admin GB`, read-only.

1. Starting state: authenticated dashboard
   - Landmark: header role `Super Admin GB`; global patient search
   - Read-only action: type vào search (không click patient row)
   - Resulting state: patient result list với `Patient actions menu`
   - Context dependency: organisation session; search query
2. Open `Patient actions menu` (`aria-label="Patient actions menu"`)
   - Landmark: `menu` với `menuitem` `Quick Send` (cùng `Quick Book`, `Quick Form`, `Care Navigation`, …)
   - Read-only action: click `menuitem` `Quick Send`
   - Resulting state: `dialog` `Quick Send`
   - Context dependency: một patient result đã chọn qua menu, không qua row click
3. Feature root: `Quick Send` dialog
   - Landmarks: `Quick Send rocket icon`; `View Patient Details`; `Close`; `SMS`; `Email`; `Preview`; `Edit`; `Copy to Email`; `Resources`; `quick-send-action`; tabs `Campaign`, `Health Forms`, `Files`, `Booking Link`; `Save`
   - Last safe state: dialog mở, không `Save` / `quick-send-action` / `Send` / `Schedule`
   - Mutation boundary: `Save`; send/schedule via `quick-send-action`; `Edit` draft; `Set up Patient Reply`; adding campaign/files/booking into draft

Baseline search placeholder: `Search patients by name or NHS number`. Connect placeholder: `Search...`. OS branch khớp baseline placeholder.

## Context requirements

- Global header patient search (không phải `Patients` → `Patient Search` module)
- Authorized `Patient actions menu` trên một result
- Patient context trong dialog (`View Patient Details`, SMS/email-on-file icons)
- Không cần Comms Hub

## Candidate and rejected paths

- Candidate 1 — **Confirmed** feature root: `Quick Send` dialog via patient actions, trên baseline + Connect branch + OS branch
- Candidate 2 — GP Supergrid `https://pac2-4700-qs-only.dev.blinxpaco-np.com/`: host không nằm `allowedHosts`; session PACO không mang; dừng tại `/login/` (`NHS Patient and Care Optimiser`). Auth GP thủ công chưa có. Route **Blocked** (auth), không Fail
- Candidate 3 — `Rocket Bar` sidebar item trên PACO OS: consumer trong ticket; không có feature-branch URL (Ammar). Không mở trong LOCATE (budget). **Unresolved**
- Rejected: sidebar icon alt `Quick Send` với label `Comms Hub` — Comms Hub, không phải QS modal. Dependency revision 1; không lặp nếu source không đổi
- Rejected: click patient row để vào QS — tester/memory clue cấm; không dùng

## Observed landmarks

- Header: `Super Admin GB`
- Search: `Search patients by name or NHS number` (PACO OS / OS branch); `Search...` (Connect)
- `button` `Patient actions menu`
- `menuitem` `Quick Send`
- `dialog` chứa `Quick Send rocket icon`, `View Patient Details`, tabs `Campaign` / `Health Forms` / `Files` / `Booking Link`
- `button` `Close` đóng dialog không persist
- GP: `/login/`, title `NHS Patient and Care Optimiser`

## Evidence

Raw (PII trong screenshot — local, not shareable):

- `test-results/PAC2-4700/locate/20260923-qs/baseline-quick-send-dialog.png`
- `test-results/PAC2-4700/locate/20260923-qs/connect-quick-send-dialog.png`
- `test-results/PAC2-4700/locate/20260923-qs/os-quick-send-dialog.png`

Không promote vào `docs/tickets/.../evidence/`.

## Automation hints

- `getByPlaceholder('Search patients by name or NHS number')` trên PACO OS; Connect dùng `Search...`
- `getByRole('button', { name: 'Patient actions menu' })` rồi `getByRole('menuitem', { name: 'Quick Send' })`
- `getByRole('dialog')` + `View Patient Details` / `tab-Booking Link`
- Không assert patient identity, NHS, campaign body, hoặc `{{{scheduler_link}}}` content
- GP host cần allowlist + auth riêng trước mutation/automation

## Budget

Meaningful views (11/12):

1. Baseline dashboard (auth)
2. Sidebar expanded (`Comms Hub` vs icon `Quick Send`)
3. Baseline search results
4. Baseline `Patient actions menu`
5. Baseline `Quick Send` dialog
6. Connect dashboard
7. Connect search results (`Search...`)
8. Connect `Quick Send` dialog
9. OS branch dashboard
10. OS `Quick Send` dialog
11. GP `/login/`

Elapsed ~7/15 phút. Mutation: None. Đóng dialog bằng `Close`.

## Blockers and next action

- Blocker: GP chưa authenticated; host `pac2-4700-qs-only.dev.blinxpaco-np.com` ngoài `allowedHosts`
- Blocker: Rocketbar chưa locate
- Warning: graph không có reusable QS route; Connect search placeholder khác OS
- Warning: screenshots chứa patient identifiers — không share
- Next action: EXPLORE read-only trên baseline + Connect + OS từ dialog đã Confirmed. GP/Rocketbar cần auth/allowlist/URL trước khi locate tiếp. Không `Save`/`Send`/`Schedule`

## Tester notes

[Protected area]
