# PAC2-7150 Replay

## Ticket

| Field | Value |
|---|---|
| Jira | https://blinxsolutions.atlassian.net/browse/PAC2-7150 |
| Summary | PACO Connect - Can't make sessions earlier |
| Status | Done |
| Resolution | Fixed |
| QA Result | PASSED (FB + DEV) |

## Replay summary

Feature verified via Sean Huynh QA PASSED 2026-10-07 (3 test cases) và PASSED on DEV. Videos reviewed. No live replay needed — fix already confirmed by QA tester.

## Prerequisites

- Auth: `Super Admin GB` (Fiona Nguyen GB)
- Role: Session holder hoặc Super Admin
- Data: Session với start time ≥ 09:00
- Environment: `blinx.dev.blinxpaco-np.com` (dev); feature branch PAC2-7150 cho FB QA

## Scenario coverage

| Scenario | Method | Result | Evidence |
|---|---|---|---|
| SC-001: Start session earlier | Video (FB) | PASSED | 128961-Screen Recording 2026-10-07 at 3.00.17 PM.mov |
| SC-002: Extend both ends + cancel/accept | Video (FB) | PASSED | 128958-Screen Recording 2026-10-07 at 3.07.40 PM.mov |
| SC-003: Start earlier from Appointment Book panel | Video (FB) | PASSED | 128960-Screen Recording 2026-10-07 at 3.09.01 PM.mov |
| DEV verification | Video (DEV) | PASSED | 129046-Screen Recording 2026-10-07 at 10.12.01 PM.mov |

## Expected behaviour

1. **Shaded hour zone** trong Edit Session modal cho phép thêm slot trước session start
2. **Prompt "Start session at [time]"** xuất hiện khi thêm slot trong shaded zone
3. **Prompt "Run session [start]–[end]"** xuất hiện khi extend cả hai đầu
4. **Cancel** → giữ nguyên; **Accept** → cập nhật
5. **Settings panel** và **board** đều cập nhật sau save
6. **Clash detection** hoạt động nếu earlier time trùng session khác

## Actual behaviour (from QA videos)

- TC-001: Shaded hour cho phép thêm slot → prompt "Start session at 08:30" → accept → save → board cập nhật ✓
- TC-002: Extend cả hai đầu → prompt đọc "Run session 08:30–17:00" → Cancel → giữ nguyên; Accept → cập nhật ✓
- TC-003: Từ Appointment Book panel → slot preview → thêm trước start → accept → save → settings + board cập nhật ✓
- DEV: PASSED ✓

## Result classification

**VERIFIED** — feature confirmed working via QA video evidence

## Flow

`docs/paco/flows/pac2-7150-session-extend-earlier.md`

## Execution timestamp

2026-10-18
