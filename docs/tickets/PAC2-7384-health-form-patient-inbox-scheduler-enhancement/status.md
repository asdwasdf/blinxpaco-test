# PAC2-7384 — Health form patient inbox - scheduler enhancement

## Current phase
EXPLORE — resumed 2026-10-21. LOCATE closed (routes confirmed). Blocked on B4 (approved recipient / patient-level scheduler link) before scheduler surface can be exercised.

## Phase status
- discover: completed
- ingest: completed
- analyze: completed
- locate: completed_with_warnings
- explore: in_progress (blocked on B4)
- test_design: pending
- manual_execute: pending
- automate: pending
- automation_execute: pending
- report: pending
- complete: pending

## Import
- Jira: https://blinxsolutions.atlassian.net/browse/PAC2-7384
- Imported: 2026-10-13T15:48:28Z
- Source: `ticket/PAC2-7384-health-form-patient-inbox-scheduler-enhancement/ticket.md`
- Source SHA-256: `0d33b40e549e446b3e5df28bfe48ea6fcd9dcf9b202dc1c3cf4b5a843d13a7d5`
- Output: `docs/tickets/PAC2-7384-health-form-patient-inbox-scheduler-enhancement/`

## Description (verbatim, condensed)
Three items (used as AC after tester confirmation 2026-10-13):
1. Expandable HF for detail view (scheduler).
2. Remove confusing HF views; prefer conversational view of HF alongside chat.
3. Bug: mobile view of submitted HF shows thick bar instead of chat bubble.

## Acceptance criteria
Three description bullets above. Tester confirmed 2026-10-13.

## Target environment
- Scheduler feature branch: `https://dev.blinxscheduler-np.com/feature-branch/pac2-7384/`
- Paco Connect inbox (default Paco dev): `https://blinx.dev.blinxpaco-np.com`
- Both hosts in `paco.config.yaml safety.allowedHosts` (uncommitted allowlist update for scheduler host).

## Scope surfaces (per tester, 2026-10-13)
- patient-facing-scheduler-booking
- paco-connect-inbox
- mobile-responsive-cross-surface

## Artifacts
| Path | Owner | SHA-256 |
|------|-------|---------|
| `manifest.yaml` | paco-ticket | pending |
| `status.md` | paco-ticket | pending |
| `requirements.md` | paco-requirements | `1d281ea877f9d8b55d9ff7bd4c4c3aadda35d2583ebc10cf4cf73705829f6d9e` |

## Resumable checkpoint
- 3 atomic requirements emitted (REQ-001 expandable HF, REQ-002 conversational preferred, REQ-003 mobile bubble).
- 7 Open Questions recorded (OQ1 token, OQ2 view modes, OQ3 breakpoint, OQ4 conversational pre-existing?, OQ5 defect state, OQ6 test data, OQ7 remove semantics).
- 3 Ambiguities (A1 REQ-002 surface, A2 "thick bar" visual, A3 REQ-001 baseline).
- Next: tester trả lời OQ1 + OQ2 + OQ6 trước LOCATE; có thể ghép OQ3/OQ5 vào EXPLORE.

## Resume observation — 2026-10-21

LOCATE (resumed, `Observed` trên dev, role `Johnny (2255) Bravo` / Blinx Deployment / General Practice (Demo Site)):

- PACO auth OK sau auto-login. `Comms Hub → Campaign Manager` route xác nhận: `Create Campaign`, `Campaign Outbox`, grid `Non-Shared Campaigns (4135)` / `Shared Campaigns (445)`.
- Campaign wizard Step 1: `Campaign Name` (input), `Patient Facing Campaign Display Name` (React textarea), send-type `#newCampaignSmsBtn` / `#newCampaignEmailBtn`, `Campaign Type(s)` (tail-select), `Campaign Tags`, `#addHealthFormsCheckbox` ("Add Health Form(s) to Campaign?"), `#webformSelectionSearch` (HF search, chỉ hiện khi checkbox bật).
- **Connect inbox** `/health-forms/responses/`: OQ2 answered — chỉ có **2 view mode**: `View By Patient`, `View By Health Form` (+ `Expand All` / `Collapse All`). Không thấy "conversational view" ở Connect inbox → REQ-002 conversational nhiều khả năng là surface scheduler.
- **Quick Send** flow (patient-facing, giống PAC2-6982): `Patient Search` → search patient → `button[title="Quick Send"]` → dialog 4 tab `Campaign` / `Health Forms` / `Files` / `Booking Link`.
  - Tab `Health Forms` → `Select Health Form` → tree picker (`p-overlaypanel`, search `Search...`) → chọn form → `Added Health Forms` + badge `1`.
  - Tab `Booking Link` → `Date & Time`, `Refresh Availability`, slot types (`Face to Face`/`Phone`/`Video`/`Web Chat`), `Select Clinician(s)`, `Select Location(s)`, `Booking Notes`, `Confirmation/Reminder Message`.
- HF form có sẵn dùng được: `Health Form Inbox V2 - Test Form` (Beth Green), `Healthform Inbox Testing` (đã select thành công qua tree picker).
- Test patients trên dev (Blinx Demo Site): `Gareth Bartlett` (gareth@blinxsolutions.com, +447961858340), `Ellie Bartlett` (egittins@doctors.org.uk, +447764247318), `Gareth Bartlett-TestPatient` (không contact → cả SMS và Email disabled trong Quick Send), `Autoqa Tester*` synthetic (chỉ SMS, Email disabled).
- `Comms Hub → Campaign Outbox`: `sendInstanceDropdown` = "No Options available"; chưa có campaign sent để `Resend` lấy link.
- DFD Config `Copy DFD link` chỉ sinh **org-level** JWT (`otId`), không có patient pre-fill → không dùng được cho flow patient.

Blocker B4 (mở): chưa có approved recipient. Email duyệt theo memory là `fiona.nguyen@blinxsolutions.com` — không khớp patient nào tìm thấy. SMS chưa có recipient duyệt.

Config change: thêm `dev.blinxscheduler-np.com` vào `paco.config.yaml safety.allowedHosts` (uncommitted). Manifest cũ ghi đã add 2026-10-13 nhưng file thực tế không có.

Next action: tester chốt recipient (email nào / có cho phép SMS tới số nào / hoặc cấp sẵn tokenized scheduler link). Sau đó EXPLORE tiếp: tạo campaign QA-test có HF + booking link → send → lấy link → mở ở tab mới → đánh giá REQ-001/002/003 (expandable HF, conversational view, mobile bubble) trên `dev.blinxscheduler-np.com/feature-branch/pac2-7384/`.

## Tester notes
