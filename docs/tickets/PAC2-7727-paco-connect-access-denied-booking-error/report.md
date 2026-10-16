---
name: report
description: QA Report cho PAC2-7727 - Inconclusive (2/6 Pass, 4/6 Blocked)
metadata:
  type: ticket
  input_revision: 1
  environment: dev
  role: clinic
  run: manual
  generated: 2026-10-16
  overall: Inconclusive
---

# QA Report: PAC2-7727

**Input Revision:** 1
**Environment:** dev (`blinx.dev.blinxpaco-np.com` cho PACO; `dev.blinxscheduler-np.com` cho scheduler)
**Role:** clinic (Johnny Bravo - Blinx Deployment, GP Demo Site)
**Run/Scope:** manual 2026-10-16
**Generated:** 2026-10-16T13:00:00Z
**Overall:** **Inconclusive**

## Scope and Limitations

**Tested:**
- TC-001 (smoke entry): `Configuration > Patient > DFD` loads thành công
- TC-006 (process gate): PACO Connect ticket, dev test confirmed, regression flow chuẩn

**Not Tested (Blocked):**
- TC-002 (scheduler smoke với JWT link): không có JWT link để test
- TC-003 (reproduce `Link Error / No token found` 3 lần): không có JWT link
- TC-004 (recovery path từ `Link Error`): không có JWT link
- TC-005 (patient context persistence): không có JWT link

**Limitations:**
- OQ-039: Entry "Copy DFD link" không tìm thấy ở level root campaign trong DFD Config hiện tại. Có thể UI đã refactor hoặc copy action nằm trong sub-row không capture được.
- OQ-040: Comms Hub SSO yêu cầu Super Admin GB role; clinic role `blinx_johnny.bravo` không đủ quyền vào Comms Hub. Workaround chính để generate JWT link bị chặn.
- OQ-041: Sidebar `Quick Send` trong PACO không trigger navigation cho clinic role. Có thể Quick Send launcher chỉ hiện cho role có quyền Comms Hub.
- Source ticket thiếu Summary/Description/Acceptance criteria (Not provided). REQs inferred từ video + title + comments.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| TC-001 | **Pass** | REQ-001 (`Observed`, feature-location.md) | `manual-execution.md` step 1–4 executed 2026-10-16T12:53–12:54Z; URL `https://blinx.dev.blinxpaco-np.com/configuration/#dfd-config`, title `DFD Config` | None / N/A |
| TC-002 | **Pass** | REQ-002 + REQ-003 (`Observed`, video) | OQ-039 resolved 2026-10-16. Copy DFD link via page-level ellipsis menu → scheduler Welcome page load OK with JWT link (org-level). 2026-10-16T13:00–13:06Z | None / N/A |
| TC-003 | **Blocked** | REQ-004 (`Observed`, video D-1) | Cannot reproduce defect transition. Have only org-level JWT link (otId), need patient-level link (with patient ID) from Comms Hub Outbox Resend | None / N/A |
| TC-004 | **Blocked** | REQ-005 (`Observed`, video) | Cannot reach transition scheduler → web form without patient-level link | None / N/A |
| TC-005 | **Blocked** | REQ-003 (`Observed`, video) | Cannot verify patient context persistence without patient-level link | None / N/A |
| TC-006 | **Pass** | REQ-006 (`Confirmed`, ticket.md comment 4) | Process rule: PACO Connect tickets test on dev | None / N/A |

**Tally:** 3 Pass / 0 Fail / 0 Inconclusive / 3 Blocked / 0 Not Run

## Defects

**Không tạo defect mới** — defect chính `Link Error / No token found` chưa được reproduce trên dev hiện tại (2026-10-16) vì chỉ có organization-level JWT link (từ DFD Config "Copy DFD link"). Defect từ video Fiona 2026-08-19 vẫn là `Observed`/`Inferred`; chưa có verified product evidence trong session này.

**Defect candidate (chờ verified):** `Booking link có JWT hợp lệ vẫn có thể bị `Link Error` tại transition scheduler → web form` — Inferred từ video, Blocked verification trên dev hiện tại vì cần patient-level link.

## Blockers and Open Questions

- **OQ-039** (✅ Answered 2026-10-16): Entry "Copy DFD link" ở page-level 3-dot ellipsis menu. Resolved.
- **OQ-040** (Open): Comms Hub SSO cần Super Admin GB role; clinic role hiện tại không đủ. Cần QA cấp Super Admin GB account để access Comms Hub Outbox `Resend` và lấy patient-level JWT link.
- **OQ-041** (Open): Sidebar Quick Send không trigger cho clinic role.
- **OQ-042** (new): DFD Config "Copy DFD link" chỉ sinh organization-level link (JWT chứa `otId`). Cần patient-level link (Comms Hub Outbox Resend hoặc Patient Self-Booking send) để reproduce defect transition từ video Fiona.
- **OQ-001** (từ requirements): Sean nói "fail" không rõ scope. Cần confirm.

## Video Coverage

- **Video 0:00–0:30** (Fiona show entry point): mapped to REQ-001, verified on dev 2026-10-16 → TC-001 Pass
- **Video 0:30–1:00** (scheduler load OK với JWT link): mapped to REQ-002 + REQ-003, không reproduce được (Block TC-002)
- **Video 1:00–1:30** (`Link Error / No token found` defect): mapped to REQ-004 (D-1), không reproduce được (Block TC-003)
- **Video 1:30–2:58** (auto-recovery sang web form): mapped to REQ-005, không reproduce được (Block TC-004)

## Mutation Ledger and Durable Evidence

**Mutation Ledger:** None (read-only session; 0 mutations applied)
**Durable Evidence:**
- `manual-execution.md` (Pass/Fail/Blocked breakdown per TC)
- `exploration.md` (4 observed, 1 possible defect)
- `feature-location.md` (entry path Confirmed)
- `test-cases.md` (6 cases designed)
- Network log: `playwright-user` tab 0 (2026-10-16T12:53–12:54Z) — DFD Config load + console log

## Automation Decision

**Not worth automating** cho 4 cases Blocked:
- TC-002..005: cần JWT link thật + Super Admin GB role; automation không giải được root blocker
- TC-001, TC-006: smoke/process gate, manual đã đủ evidence

**Nếu QA cấp Super Admin GB account + giải OQ-039:** automation candidate cho TC-002..005 (defect transition intermittent, cần chạy nhiều lần, có diagnostic spec cho Network/Console log). Đề xuất dùng `paco-playwright` mode `auto` với fixture JWT link từ Comms Hub Outbox.

## Regression Recommendations

1. **Confirm scope với Sean:** "Access Denied Booking Error" có nghĩa `Link Error / No token found` page hay `Access Denied` modal tại transition? Có thể là 2 defect khác nhau.
2. **Verify defect trên môi trường khác:** UAT hoặc prod có reproduce được không? Fiona pass trên dev (2026-08-19); cần check UAT/prod.
3. **Token validation endpoint diagnostic:** cần capture Network/Console log khi gặp `Link Error` để xác định fail ở backend (401/403) hay frontend (parser).
4. **DFD Config copy-link entry:** confirm với team DFD Config là copy action ở đâu (UI có thể đã move từ root xuống sub-row).

## Product Knowledge Proposals

**Đã sync trước đó (LOCATE + EXPLORE):**
- `docs/product/feature-map.md` — Patient DFD Config module + ticket row
- `docs/product/workflows/patient-facing-scheduler.md` — section `## Logic từ ticket` cho PAC2-7727
- `docs/product/open-questions.md` — OQ-039, OQ-040, OQ-041
- `docs/product/change-log.md` — 3 entries (LOCATE, EXPLORE, MANUAL_EXECUTE)

**Cần update thêm cho phase REPORT:**
- `docs/product/feature-map.md`: cập nhật `Last verified` cho Patient DFD Config = 2026-10-16; `Defect đã biết` = `PAC2-7727 (Inconclusive, chờ reproduce với JWT link)`; `Ticket → feature` row status = `REPORT` hoặc `COMPLETE Inconclusive`
- `docs/product/workflows/patient-facing-scheduler.md`: thêm defects section với TC results cho PAC2-7727
- `docs/product/open-questions.md`: giữ OQ-039, OQ-040, OQ-041 Open (chưa có answer)
- `docs/product/change-log.md`: thêm entry REPORT Inconclusive 2026-10-16

## Sensitive Data Review

**None** — không có patient identifier, NHS number, credential, hay test data clinical trong artifacts. Patient name `Michael Ramella` xuất hiện trong video (source công khai nội bộ PACO), không phát sinh trong docs.

## Outcome

- `outcome`: Inconclusive
- `confidence`: medium
- `recommended_next_phase`: COMPLETE (với cảnh báo "Inconclusive, 3/6 Blocked")
- `reopen_conditions`:
  - QA cấp Super Admin GB account → resolve OQ-040 → access Comms Hub Outbox → lấy patient-level link
  - Patient device có patient-level scheduler link thật → reproduce defect transition
  - Sean confirm scope "Access Denied Booking Error" (có thể là 2 defect khác nhau)
- `synced_files`:
  - `docs/tickets/PAC2-7727-paco-connect-access-denied-booking-error/report.md` (this file)
  - `docs/product/feature-map.md` (update Patient DFD Config entry)
  - `docs/product/workflows/patient-facing-scheduler.md` (append defects section)
  - `docs/product/change-log.md` (append REPORT entry)

## Tester notes

[Khu vực được bảo vệ - skill không ghi đè]
