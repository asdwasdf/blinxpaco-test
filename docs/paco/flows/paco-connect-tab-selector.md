# Workflow: PACO Connect Tab Selector (Dashboard ↔ Appointment Book)

- Classification: `[Confirmed: dev, Super Admin GB, 2026-10-08, Video 3 evidence Sean Huynh PASSED QA]`
- Aliases: `Dashboard tab`, `Appointment Book tab`, `connect tab selector`, `connect tabs`, `Appt Book tab`
- Coverage: `Complete for the visual regression scope`
- Confidence: `Medium` — visual diff chỉ spacing, không có concrete pixel spec, không cover role khác ngoài Super Admin GB

## Business context observed

- Visible purpose: cho phép user switch giữa 2 view chính của PACO Connect app: dashboard cards (KPIs, charts) và appointment book calendar (sessions/booked/available). Visual consistency yêu cầu spacing giữa tab row và content area phải nhất quán giữa 2 states.
- Actor/role: `Super Admin GB` (Sean Huynh confirmed). Reception/other role có thể cũng relevant nhưng chưa confirm.
- Required context: authenticated PACO Connect session, no patient/appointment data dependency.
- Starting data state: dashboard view mặc định (`/dashboard`); calendar view cần có session data mới hiện calendar grid.
- Entities and statuses: 2 tab states (`Dashboard` selected, `Appointment Book` selected); URL path tương ứng (`/dashboard`, `/appointment-book`); tab selected có pink background color.

## Entry

1. Mở `https://blinx.dev.blinxpaco-np.com/paco-connect/dashboard` (default → Dashboard tab selected, URL `/dashboard`).
2. Stable landmark: tab row gồm 2 tabs `Dashboard` | `Appointment Book` ở top của content area; tab selected có pink background.

## Read-only flow

1. **Action:** click `Dashboard` tab.
   - **Transition:** URL → `/dashboard`; content area shows dashboard cards (Total Capacity, Utilisation, charts, etc).
   - **Observed result:** tab row có visible gap (spacing) xuống content cards.
   - **Evidence:** `video-notes.md` Video 3 frames 6-8 (after fix); Video 2 frame 5 (before fix).
2. **Action:** click `Appointment Book` tab.
   - **Transition:** URL → `/appointment-book`; content area shows calendar grid (Sessions/Booked/Available summary + day-view slots).
   - **Observed result (after fix):** tab row có visible gap xuống calendar grid — symmetric với Dashboard state.
   - **Observed result (before fix):** calendar flush ngay dưới tab row, no spacing — asymmetric với Dashboard state.
   - **Evidence:** `video-notes.md` Video 3 frames 4-5 (after fix); Video 2 frames 7-8 (before fix).

## Decision points

- **Visible condition:** tab selection state.
  - **State A (`Dashboard` selected, URL `/dashboard`):** content = dashboard cards, spacing consistent.
  - **State B (`Appointment Book` selected, URL `/appointment-book`):** content = calendar grid, spacing phải = State A.
- **Visible condition:** pre-fix vs post-fix (regression check).
  - **Pre-fix (Video 1 FB + Video 2 DEV):** State A có spacing, State B không có → asymmetric → bug.
  - **Post-fix (Video 3 DEV):** State A và State B đều có spacing nhất quán → pixel-perfect.

## End and exceptional states

- End state observed: tab đã click trở thành active (pink background); URL swap; content reload phù hợp.
- Empty/loading states: khi toggle tab, có thể có loading state (Video 2 frames 1-3 = `Loading your appointment data`). Sau khi load xong, content render với spacing nhất quán (post-fix) hoặc asymmetric (pre-fix).
- Cross-feature handoff: từ PACO Connect, có thể navigate tới PACO OS top-level (Video 2 frame 4 accidental nav tới `/paco/dashboard` — interface khác, không có tab selector này).

## Safety boundary

- Last safe read-only state: `/paco-connect/dashboard` hoặc `/paco-connect/appointment-book` sau khi calendar load.
- Approval stop: KHÔNG book/cancel appointment, KHÔNG modify session, KHÔNG navigate sang patient detail/audit.
- Actions not performed: chưa test role khác ngoài Super Admin GB.
- Mutation: `None` — visual diff only, no data write.

## Execution guidance

- Setup/data: chỉ cần authenticated session. Có calendar grid (sessions) mới quan sát được Appointment Book state fully; nếu không có session data, calendar sẽ empty nhưng tab spacing vẫn observe được.
- Safe manual steps: open `/paco-connect/dashboard`, click giữa 2 tabs, observe spacing top region.
- Stop and request approval before: không applicable (read-only).
- Evidence to capture: screenshot top region (~200px từ top) cho cả 2 states, hoặc DOM inspect `margin`/`padding` của wrapper giữa tab row và content container.

## Automation guidance

- Stable roles/labels: tab selector dùng accessible name `Dashboard` và `Appointment Book`; selected state dùng `aria-selected="true"` (assumed, cần verify).
- Observable waits: đợi `Loading your appointment data` biến mất trước khi observe spacing; đợi calendar grid render hoặc empty state.
- Data dependencies: Appointment Book state cần có session data trong date range đang xem để render calendar; Dashboard state luôn có content.
- Assertions lacking trusted expected basis: exact pixel value của spacing chưa có spec — chỉ có thể assert "spacing exists" vs "no spacing" (qualitative), không assert "spacing = 16px" trừ khi có design spec.

## Provenance and gaps

- Environment: dev (`blinx.dev.blinxpaco-np.com`)
- Role: `Super Admin GB`
- Observed at: 2026-10-08 (Sean Huynh PASSED QA on DEV) + replay 2026-10-18 (subagent video analysis)
- Raw evidence: `ticket/PAC2-6983-.../attachments/129106-...mov` (FB), `129121-...mov` (DEV failed), `129123-...mov` (DEV passed); 2 PNG baseline
- Open questions:
  - OQ-1: exact pixel value của spacing (chưa extract từ PNG)
  - OQ-3: PR/commit ID của fix (không có trong ticket)
  - OQ-4: tại sao FAILED→PASSED trong 14 phút
  - OQ-5: role ngoài Super Admin GB có dùng selector này không
- Exact resume state: nếu cần regression test live, bắt đầu từ `/paco-connect/dashboard` sau khi authenticated, no session modification needed.

## Tester notes