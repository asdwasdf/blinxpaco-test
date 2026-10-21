# PAC2-7150 Requirements

## Source

- Jira: https://blinxsolutions.atlassian.net/browse/PAC2-7150
- Imported: 2026-10-18

## Summary

PACO Connect - Can't make sessions earlier. Session holder/super user có thể dễ dàng edit session để thêm appointment ở thời điểm trước session start time.

## Functional Requirements

| ID | Requirement | Classification | Source |
|---|---|---|---|
| REQ-001 | Trong Edit Session, giờ phía trên session start (shaded hour) cho phép thêm slot ở thời điểm trước start time | `Confirmed` | ticket.md comment James Kite 2026-07-03 |
| REQ-002 | Khi thêm slot trong shaded hour (trước start), prompt xuất hiện: "Start session at [time]" | `Confirmed` | ticket.md TC-001 Expected |
| REQ-003 | Chấp nhận prompt "Start session at [time]" và Save → session start time cập nhật, slot mới hiện trên board | `Confirmed` | ticket.md TC-001 Expected |
| REQ-004 | Chọn slots trước VÀ sau session (extend cả hai đầu) → prompt đọc "Run session [start]–[end]" với range mới | `Confirmed` | ticket.md TC-002 Expected |
| REQ-005 | Cancel prompt → giữ nguyên session và slots ban đầu; Accept → cập nhật cả start và end | `Confirmed` | ticket.md TC-002 Expected |
| REQ-006 | Start earlier từ Appointment Book settings panel → session start cập nhật trong settings panel và trên board | `Confirmed` | ticket.md TC-003 Expected |
| REQ-007 | Nếu thời điểm earlier trùng với session khác → hiện clash prompt cảnh báo | `Confirmed` | ticket.md TC-003 Expected |

## Modules Affected

- PACO Connect
- Appointment Book — Session editor
- Configuration → Sessions

## User Roles

- `Session holder`
- `Super Admin` / `Super Admin GB`

## Environment

- Dev: `blinx.dev.blinxpaco-np.com`
- Feature branch: QA trên feature branch riêng (PAC2-7150)

## QA Result

Sean Huynh — 2026-10-07: PASSED QA on FB + DEV
- TC-001: PASSED
- TC-002: PASSED
- TC-003: PASSED

## Evidence

- Screen Recording 2026-10-07 at 3.00.17 PM.mov (TC-001)
- Screen Recording 2026-10-07 at 3.07.40 PM.mov (TC-002)
- Screen Recording 2026-10-07 at 3.09.01 PM.mov (TC-003)
- Screen Recording 2026-10-07 at 10.12.01 PM.mov (PASSED on DEV)
