# Change Log

Product knowledge updates với timestamp và source.

## Format

Entries chronological, newest first:
- Date
- Change type: Added/Updated/Deprecated/Removed
- What changed
- Source ticket/observation
- Impact hoặc reason

## Log

**2026-10-15**
- Updated: PAC2-9001 MANUAL_EXECUTE rev-2 + AUTOMATE rev-2 reconciliation — added `Configuration → Sessions row kebab 8 items` to Logic (TC-009); added `Slot context menu 19 items + Block Session UX gap` (TC-006 diagnostic, OQ-031, DEF-PAC2-9001-01); `Last verified: 2026-10-15T09:00:00Z`; defect row updated with DEF-PAC2-9001-01.
- Source: `PAC2-9001/manual/rev-2/final-report.md`, `execution-log.md`, `PAC2-9001/automation.md`, `PAC2-9001/defects/DEF-PAC2-9001-01-block-session-ux-gap.md`
- Impact: confirms OQ-033 RESOLVED (entry point = Configuration row kebab); logs new defect DEF-PAC2-9001-01 (Block Session UX gap); marks PAC2-9001 ticket as partial-complete (3 Pass / 6 Blocked / 2 Not Run).

- Updated: `open-questions.md` — OQ-031 marked Answered (with UX gap finding, DEF-PAC2-9001-01); OQ-033 marked Answered 2026-10-15 (entry point = Configuration row kebab). OQ-1/OQ-030/OQ-034/OQ-032 still Open.
- Source: `PAC2-9001/manual/rev-2/final-report.md`
- Impact: closes 2 OQ; surfaces new defect for dev investigation.

- Updated: `workflows/appointment-book.md` `## Logic từ ticket` section for PAC2-9001 — refreshed Defect đã biết (DEF-PAC2-9001-01 added) and Open questions (OQ-033/OQ-031 answered, OQ-2 also answered).
- Source: `PAC2-9001/defects/DEF-PAC2-9001-01-block-session-ux-gap.md`
- Impact: knowledge sync consistent with feature-map and open-questions.

- Added: `playwright/pages/ConfigurationSessionsPage.ts` (page object for Configuration → Sessions row kebab). Source: PAC2-9001 MANUAL_EXECUTE rev-2.
- Source: `playwright/pages/ConfigurationSessionsPage.ts`
- Impact: reusable locator for future ticket specs covering Configuration → Sessions row kebab.

**2026-10-13**
- Updated: PAC2-9001 session cancel RBAC (P7032) feature entry — refreshed `Logic chính` (session card UI 2 buttons, EDIT SESSION drawer 8 buttons, right-click no-op, P7032 not visible in RBAC list, video self-test confirmation); added 3 defect entries (OQ-4 entry-point not found, OQ-1 P7032 not visible, REQ-010 out-of-scope tracker); `Last verified: 2026-10-13T16:00:00Z`
- Source: `PAC2-9001/feature-location.md` (rev 2), `video-notes.md`, `requirements.md` (rev 2)
- Impact: clarifies P7032 deploy status (likely not on dev) + entry-point shape gap (must test at patient slot row level in MANUAL_EXECUTE)

- Updated: `Ticket → feature` table — added row for `PAC2-9001` (EXPLORE; routes R-1..R-4 Confirmed, OQ-1 + OQ-4 still open)
- Source: `PAC2-9001/manifest.yaml`, `status.md`
- Impact: lookup consistency

- Updated: `open-questions.md` — added OQ-030..OQ-034 (5 questions from PAC2-9001: P7032 deploy, block-on-booked, row-kebab content, entry-point shape, template edit trigger)
- Source: `PAC2-9001/requirements.md`, `video-notes.md`, `feature-location.md`
- Impact: surfaces RBAC deploy dependency + entry-point shape gap for MANUAL_EXECUTE

- Updated: `workflows/appointment-book.md` — added `### Session cancel RBAC (P7032)` section under `## Logic từ ticket`; 7 luồng steps, 8 business rules, 4 trạng thái, role/permission context, 3 defects, 5 open questions (all with `[classification]` tags + `PAC2-9001/<file>` provenance)
- Source: `PAC2-9001/requirements.md`, `video-notes.md`, `feature-location.md`
- Impact: knowledge sync for MANUAL_EXECUTE; entry-point + P7032 deploy still open and deferred to next phase

- Updated: Patient Search feature entry — added `PAC2-8998` to tickets; `Last verified: 2026-10-13`; 2 logic lines `[Confirmed]` (cap 50 top-bar dropdown label `Results (50)`; PDS panel heading `Patient Search (N)` = total match via AG Grid virtual scroll); 1 defect entry Pass; top-bar dropdown footer `Include deleted patients` checkbox noted
- Source: `PAC2-8998/feature-location.md`, `requirements.md`, `exploration.md`, `evidence/manual-r1.json`
- Impact: clarifies cap 50 behavior on both surfaces and total-match reporting; does not upgrade `Observed`/`Inferred` to `Confirmed`

- Updated: `Ticket → feature` table — added row for `PAC2-8998` (REPORT; 12 Pass / 1 Skipped — REQ-003 2-word first name)
- Source: `PAC2-8998/report.md`
- Impact: lookup consistency

- Updated: `open-questions.md` — added OQ-026..OQ-029 (4 questions from PAC2-8998); 3 Answered, 1 Open (AG Grid virtual-scroll buffer semantics)
- Source: `PAC2-8998/exploration.md`, `evidence/manual-r1.json`
- Impact: closes questions about top-bar identity, total-count UI affordance, dev data availability; surfaces AG Grid buffer behavior for future tickets

**2026-10-02**
- Added: PAC2-8381 appointment audit route trên feature branch: booked appointment context menu → nhóm `Appointment` → `View Audit Log`; ghi duplicate slot-audit label, field-level audit rows, mutation boundaries và open questions
- Source: `PAC2-8381/feature-location.md`, `requirements.md`, `exploration.md`
- Impact: hỗ trợ test design audit booking/amend/cancel mà không nhầm appointment audit với slot audit; chưa nâng historical observation thành product verdict

- Added: route và permission-boundary logic cho PACO Assist Chat từ `PAC2-8611`; entry qua patient context → `More options` → `PACO Assist` → `Switch to Chat`; prompt execution pending
- Source: `PAC2-8611/feature-location.md`, `requirements.md`, `exploration.md`
- Impact: cho phép thiết kế/running negative per-domain RBAC cases mà không dùng direct `/paco-talk/`

- Added: tổng hợp logic 17 ticket (`PAC2-191`, `1805`, `3798`, `4399`, `4700`, `5776`, `6540`, `6763`, `6982`, `7137`, `7201`, `7466`, `7669`, `7786`, `8241`, `8384`, `8522`, `8552`) vào `workflows/*.md` (section `## Logic từ ticket`), workflow mới `appointment-book`, `patient-facing-scheduler`, `admin-sso`, `paco-assist`; `feature-map.md` thêm `Logic chính`/`Defect đã biết`/`Chi tiết`, entry chưa có route và bảng `Ticket → feature`; `open-questions.md` thêm OQ-001..OQ-023
- Source: `ticket.md`/`requirements.md`/`exploration.md`/`automation.md`/`report.md` của 17 ticket
- Impact: tra cứu nhanh logic và defect theo feature; không nâng `Observed`/`Inferred` lên `Confirmed`


### Example Format

**2026-09-09**
- Added: Initial glossary structure
- Source: Setup task
- Impact: Foundation for term tracking

**2026-10-15**
- Added: Single-click arrive (PAC2-8575) section in workflows/appointment-book.md
- Added: feature-map.md entry 'Appointment Book — feature-branch route (PAC2-8575)' + 5 logic chính bullets + Ticket → feature row
- Added: OQ-035..038 in open-questions.md
- Source: PAC2-8575/feature-location.md, PAC2-8575/exploration.md
- Impact: branch host observe single click mở sidebar; arrive transition chưa xác minh đủ (thiếu future booked slot); OQ-035 về cơ chế arrive trigger trong sidebar

**2026-10-15 (REPORT)**
- Updated: Single-click arrive (PAC2-8575) section in workflows/appointment-book.md — Trạng thái confirmed TC-001/TC-002 Pass, TC-003..007 Blocked; defect section note diagnostic attempt for stale tab state
- Updated: feature-map.md PAC2-8575 entry — Last verified 2026-10-15T16:35:30Z, Defect đã biết section added (no defect confirmed; limit TC-003..006 chưa confirm), Ticket → feature row updated MANUAL_EXECUTE partial coverage
- Updated: OQ-038 status Partially Answered (data volatile thực ra là stale tab state, fresh tab vẫn có Booked 6)
- Source: PAC2-8575/manual-execution.md, PAC2-8575/test-cases.md, PAC2-8575/evidence/
- Impact: ticket overall Inconclusive; reception report double click arrive KHÔNG còn tái hiện trên branch (regression safe), nhưng arrive transition end-to-end chưa confirm do thiếu QA-AUTO data

- Updated: workflows/patient-facing-scheduler.md — `## Logic từ ticket` thêm section "Booking link generation & Access Denied error (PAC2-7727)"; mô tả flow DFD Config org-chart, scheduler base behavior, possible defect `Link Error / No token found` intermittent
- Updated: feature-map.md Patient DFD Config module — added Logic chính, Defect đã biết, Chi tiết link; Ticket → feature row PAC2-7727 status EXPLORE
- Added: OQ-039 về entry "Copy DFD link" không tìm thấy ở level root campaign trong DFD Config hiện tại (2026-10-16)
- Source: PAC2-7727/exploration.md, PAC2-7727/feature-location.md, PAC2-7727/video-notes.md
- Impact: ticket scope confirmed observable on dev (DFD Config + scheduler base); cần generate JWT link đầy đủ để reproduce defect transition; possible defect intermittent cần MANUAL_EXECUTE với test data QA-AUTO

- Updated: exploration.md O-4 (Comms Hub role gap, 2026-10-16 retry)
- Added: OQ-040 về Comms Hub SSO yêu cầu Super Admin GB role (clinic role không đủ)
- Added: OQ-041 về sidebar Quick Send không trigger cho clinic role
- Source: PAC2-7727/exploration.md O-4
- Impact: 2 workaround candidates để generate JWT scheduler link bị chặn. Cần QA cấp Super Admin GB account hoặc patient device có sẵn scheduler link

- Created: manual-execution.md PAC2-7727 — 2/6 Pass (TC-001 entry, TC-006 process), 4/6 Blocked (TC-002..005 cần JWT link)
- Updated: status.md MANUAL_EXECUTE completed, outcome Inconclusive, current_phase REPORT
- Source: PAC2-7727/manual-execution.md
- Impact: smoke entry + process gate confirmed; defect transition reproduction blocked bởi role gap (OQ-040) + DFD entry missing (OQ-039)

- Updated: PAC2-7727 OQ-039 → Answered — entry "Copy DFD link" ở page-level 3-dot ellipsis menu (not node-level)
- Updated: exploration.md O-5 — full flow verified; clipboard copy URL `https://dev.blinxscheduler-np.com/patient-self-booking/#<jwt>` (org-level, otId)
- Updated: manual-execution.md TC-002 → Pass; tally 3/6 Pass, 3/6 Blocked
- Added: OQ-042 — DFD Config "Copy DFD link" chỉ sinh org-level link; cần patient-level link từ Comms Hub để reproduce defect transition
- Source: PAC2-7727/exploration.md O-5, PAC2-7727/manual-execution.md TC-002, screenshot từ tester
- Impact: TC-002 smoke scheduler load OK với org-level JWT link. TC-003..005 vẫn Blocked vì cần patient-level link (Comms Hub SSO gap OQ-040)
