---
name: manual-execution
description: Manual execution results cho PAC2-7727 (2026-10-16) - 2/6 Pass, 4/6 Blocked
metadata:
  type: ticket
  input_revision: 1
  phase: MANUAL_EXECUTE
  environment: dev
  role: clinic
  timestamp: 2026-10-16T12:55:00Z
---

# Manual Execution: PAC2-7727

**Input Revision:** 1
**Phase:** MANUAL_EXECUTE
**Environment:** dev
**Role:** clinic (blinx_johnny.bravo)
**Timestamp:** 2026-10-16T12:55:00Z
**Tester:** Anthropic (auto via Playwright)

## Results Summary

| TC ID | Title | Result | Evidence |
|---|---|---|---|
| TC-001 | DFD Config page loads từ PACO Configuration sidebar | **Pass** | Step 1–4 executed; URL `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config`, title `DFD Config` |
| TC-002 | Scheduler landing page load OK với booking link có JWT hợp lệ | **Blocked** | OQ-039 (entry "Copy DFD link" not found) + OQ-040 (Comms Hub role gap) |
| TC-003 | Reproduce defect `Link Error / No token found` | **Blocked** | Same blockers; cannot generate JWT link |
| TC-004 | Verify recovery path từ `Link Error` | **Blocked** | Same blockers |
| TC-005 | Patient context persistence qua transition | **Blocked** | Same blockers |
| TC-006 | Workflow gate: PACO Connect ticket test on dev | **Pass** | Ticket scope contains "PACO Connect"; rule dev confirmed; regression flow chuẩn |

**Tally:** 2 Pass / 0 Fail / 0 Inconclusive / 4 Blocked / 0 Not Run

**Updated 2026-10-16T13:08Z:** TC-002 chuyển từ Blocked → Pass sau khi tìm được entry "Copy DFD link" qua page-level ellipsis menu. JWT link org-level, mở OK trong incognito (Welcome page, không có `Link Error`). TC-003..005 vẫn Blocked vì cần patient-level link (có patient ID trong JWT) để reproduce defect transition từ video Fiona.

**New tally:** 3 Pass / 0 Fail / 0 Inconclusive / 3 Blocked / 0 Not Run

## TC-001 Execution Detail

| Step | Action | Result | Notes |
|---|---|---|---|
| 1 | Mở `https://blinx.dev.blinxpaco-np.com/paco/dashboard` | Pass | URL = `/paco/dashboard`, title = `PACO OS` |
| 2 | Click icon `Configuration` ở sidebar | Pass | URL = `/paco/configuration/organisation/general` |
| 3 | Click submenu `Patient` | Pass | Tree expand, item `DFD` (id `PATIENT_CONFIG_DFD_CONFIG`) visible |
| 4 | Click item `DFD` | Pass | URL = `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config`, title = `DFD Config`, org-chart render |

**Evidence:** console log `playwright-user` tab 0 (2026-10-16T12:54:32Z), snapshot saved to `.playwright-mcp\page-2026-10-16T12-54-32-615Z.yml`

**Mutation:** None (read-only navigation)

## TC-002 Execution Detail (extended 2026-10-16T13:00–13:06Z)

| Step | Action | Result | Notes |
|---|---|---|---|
| 1 | Từ DFD Config, click ellipsis `...` ở page-level (góc trên phải) | Pass | OQ-039 resolved. Menu `p-overlaypanel` mở với 2 items: `Copy DFD link`, `Copy to Care Navigator` |
| 2 | Click `Copy DFD link` | Pass | Clipboard chứa URL: `https://dev.blinxscheduler-np.com/patient-self-booking/#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdGlkIjoiezEwZDdhNGI1LTg0NGMtNDUxMS1iMDgyLWExODg2NDNlYzkyMH0ifQ.XEGjrGVpa6V6Qi5U3xlOJKv1gx4qEABpm5GEX0-kxAw` |
| 3 | Mở link trong incognito tab mới | Pass | Scheduler `Welcome` page load trong ≤3s, không có `Link Error` |
| 4 | Click `Get started!` | Pass | List services: `PACO DEMO DFD`, `Blinx Surgery` |
| 5 | JWT payload inspection | Note | JWT chỉ chứa `otId` (organization ID), KHÔNG có patient ID → đây là org-level DFD link, không phải patient-level booking link từ video Fiona. TC-002 (smoke scheduler load) vẫn Pass. |

**Evidence:** 
- Console log: `playwright-user` tab 0 (2026-10-16T13:00–13:04Z) — DFD Config ellipsis menu + clipboard copy
- Console log: `playwright-user` tab 1 (2026-10-16T13:06–13:07Z) — scheduler load with JWT link
- JWT payload: decoded via jwt.io (manual)

**Mutation:** None (read-only; clipboard copy là local)

## TC-006 Execution Detail (process gate)

- **Step 1:** Ticket title = `PACO Connect - Access Denied Booking Error` ✓
- **Step 2:** Test trên dev (đang chạy trên `blinx.dev.blinxpaco-np.com`) ✓
- **Step 3:** Regression flow đang theo chuẩn `INGEST → ANALYZE → LOCATE → EXPLORE → TEST_DESIGN → MANUAL_EXECUTE` ✓

## Blockers Summary (TC-002..005)

**OQ-039:** Entry "Copy DFD link" không tìm thấy ở level root campaign trong DFD Config hiện tại (2026-10-16). Chỉ thấy button `+` (class `org-chart__add`) để thêm Campaign/Button. Có thể UI đã refactor hoặc copy action nằm trong sub-row không capture được.

**OQ-040:** Comms Hub SSO yêu cầu Super Admin GB role; clinic role `blinx_johnny.bravo` (Blinx Deployment) không đủ quyền vào Comms Hub. Sidebar `Quick Send` trong PACO không trigger navigation cho role này.

**OQ-041:** Sidebar `Quick Send` launcher không trigger cho clinic role. Có thể chỉ hiện cho role có quyền Comms Hub.

## Workaround Candidates (Not Feasible in This Session)

1. ❌ DFD Config copy link (OQ-039)
2. ❌ Comms Hub Outbox Resend (OQ-040 + OQ-041)
3. ⏸️ Comms Hub API call trực tiếp — chưa verify endpoint generate scheduler link
4. ⏸️ Patient device có sẵn scheduler link — cần QA hỗ trợ

## Outcome

- `outcome`: Inconclusive
- `confidence`: medium
- `cases_pass`: 2 (TC-001 smoke entry + TC-006 process gate)
- `cases_blocked`: 4 (TC-002..005 — need JWT link to reproduce defect)
- `next_action`: dispatch `paco-report` mode `summarize` để viết REPORT cho ticket
- `blockers`: cần Super Admin GB account hoặc patient device có scheduler link thật để chạy TC-002..005

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
