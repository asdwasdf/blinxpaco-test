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
