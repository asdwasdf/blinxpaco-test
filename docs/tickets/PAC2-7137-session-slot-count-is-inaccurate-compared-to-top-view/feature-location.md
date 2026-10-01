# Feature Location: PAC2-7137

**Input Revision:** 1  
**Environment:** dev (`https://blinx.dev.blinxpaco-np.com`)  
**Role:** `Super Admin GB`  
**Observed:** 2026-09-30  
**Status:** Confirmed  
**Budget:** 3/12 views; 4/15 minutes

## Search clues

- Exact terms: `Appointment Book`, `Sessions`, `Booked`, `Available`, `Day`, `Week`, session slot.
- Aliases: `Appt. Book`, top bar, top view, non-bookable, blocked slot, `Edit Slot`.
- Target: summary counts và session/detail blocks trong appointment book.
- Ticket URL clue: `/paco-connect/appointment-book`.

## Confirmed entry path

1. Starting state: authenticated Paco dashboard tại `/paco/dashboard`.
   - Landmark/control: sidebar image `Appointment Book`.
   - Read-only action: click sidebar `Appointment Book`.
   - Resulting state: flyout có buttons `Appointment Book` và `Appointment Settings`.
   - Context dependency: authenticated role `Super Admin GB` trên dev.
2. Starting state: `Appointment Book` flyout.
   - Landmark/control: button `Appointment Book`.
   - Read-only action: click button `Appointment Book`.
   - Resulting state: default feature root `/paco-connect/appointment-book`.
   - Context dependency: appointment-book permission.
3. Starting state: authenticated Paco page; tester-provided ticket baseline.
   - Landmark/control: exact URL `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`.
   - Read-only action: direct navigation; wait for visible `Appointment Book` instead of initial `Loading` state.
   - Resulting state: feature-branch appointment book renders at the exact URL with `Dashboard`, `Appointment Book`, `Appt. Book`, summary/detail area and empty/session state.
   - Context dependency: authenticated `Super Admin GB`; selected safe appointment book/date.
4. Starting state: feature-branch root.
   - Landmark/control: buttons `Dashboard`, `Appointment Book`; view controls; `Appt. Book` selector; summary/detail area.
   - Read-only action: view only.
   - Resulting state: `PAC2-8384 Manual Book A` context displayed; observed empty state `No available sessions.` at the current date.
   - Context dependency: selected appointment book/date determines whether sessions and counts appear.

## Context requirements

- Environment: configured `dev` host.
- Role verified in UI: `Super Admin GB`; QA explicitly approved using this role after initial `Config Admin` choice differed from authenticated role.
- Authentication: manual browser session.
- Appointment book context: a safe dev appointment book containing sessions/slots is required for `EXPLORE` and execution.
- Read-only locate did not select a different appointment book or change date/filter.

## Candidate and rejected paths

- Confirmed default route: sidebar `Appointment Book` → flyout `Appointment Book` → `/paco-connect/appointment-book`.
- Confirmed ticket baseline from tester: direct `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`; same configured dev hostname, feature UI rendered after observable wait.
- Confirmed safe context: `PAC2-8384 Manual Book A/B` per QA; current rendered selection shows `PAC2-8384 Manual Book A`.
- Rejected: `Appointment Settings`; ticket targets displayed session counts, not settings navigation.

## Observed landmarks

- Sidebar image accessible name: `Appointment Book`.
- Flyout buttons: `Appointment Book`, `Appointment Settings`.
- Default feature URL: `/paco-connect/appointment-book`.
- Ticket baseline URL: `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`.
- Page title: `PACO Connect`.
- Feature controls: `Dashboard`, `Appointment Book`, patient/clinician/time search, `Appt. Book` selector, `Group Send`, `Export`.
- Current content landmark: `No available sessions.`.
- Observable wait: feature controls and either sessions/detail blocks or explicit empty state become visible.

## Evidence

- Raw local snapshots: `.playwright-mcp/page-2026-09-30T11-57-30-783Z.yml`, `.playwright-mcp/page-2026-09-30T12-03-24-099Z.yml`, `.playwright-mcp/page-2026-09-30T12-03-48-171Z.yml`, `.playwright-mcp/page-2026-09-30T12-04-09-727Z.yml`, `.playwright-mcp/page-2026-09-30T12-37-41-546Z.yml`.
- Environment: dev; role: `Super Admin GB`; date: 2026-09-30.
- Evidence is local and not promoted: snapshot includes account/appointment-book context.

## Automation hints

- PAC2-7137 execution phải dùng ticket baseline `/paco-connect/feature-branch/pac2-7137/appointment-book?viewAs=agenda`; default route chỉ là control path.
- Có thể direct navigate tới ticket baseline sau khi auth; chờ `Appointment Book` button plus sessions area hoặc `No available sessions.`; không đánh giá initial `Loading` state.
- Navigate default route through accessible name `Appointment Book`; avoid sidebar generated classes.
- Resolve appointment-book selector and date/view context from approved test data; never hard-code account names observed during locate.
- Do not assert HTTP navigation status alone: app shell rendered despite navigation response reporting 404.

## Blockers and next action

- Blocker: None for route location.
- Next action: invalidate default-route execution observations, then repeat bounded read-only `EXPLORE` on the confirmed PAC2-7137 feature-branch baseline using QA-approved `PAC2-8384 Manual Book A/B`.

## Tester notes
