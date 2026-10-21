# Workflow: Cross-org Health Form Filing (PACO Connect)

- Classification: `[Inferred: ticket PAC2-3934 description + acceptance criteria + code review]` — chưa replay live
- Aliases: `Cross-org filing`, `file health form cross-org`, `cross-PCN health form`, `consultation cross-org`, `PACO Connect cross-org filing`
- Coverage: `None` (chưa observed trên dev)
- Confidence: `Low`

## Business context observed (chưa observed trực tiếp; Inferred từ description + AC + Mustafa review)

- Visible purpose: cho phép clinician đăng nhập ở `Org A` complete + file health form vào record bệnh nhân thuộc `Org B` xuyên federation, miễn user có access/permission hợp lệ — không bắt buộc share form với patient org.
- Actor/role: PACO Connect clinician user (cross-org), applicable cho federated/confederation PCN model.
- Required context: phiên PACO Connect đăng nhập ở `Org A`; patient chọn thuộc `Org B`; health form đã designed ở `Org A`.
- Starting data state: patient row of `Org B` truy cập được trong consultation screen của `Org A`.
- Entities và statuses: `(patientguid, organisationguid_of_B)` lookup key; cross-org authorisation grant (`Permission`); health form `owned_by_org_A`; `filing` action.

## Entry

1. PACO Connect consultation screen (route chưa tự observe; ticket PAC2-3934 không chỉ path; nhiều khả năng `/paco-connect/consultation/<patientId>` — `Open Question`).
2. Patient selector cross-org (display patient name + tag tổ chức patient thuộc về).

## Read-only flow (reconstructed — chưa observed chạy thực)

1. **Action:** login (`Org A`) → vào consultation → select patient (`Org B`).
   - **Transition:** patient record loaded; loaded org GUID = `B`.
   - **Observed result:** chưa observe; backend contract: phải lookup full PK `(patientguid, organisationguid)`.
2. **Action:** attach health form (`owned by A`) → complete + submit.
   - **Observed result mong đợi:** form file về record của patient ở `B`; reference `(patientguid, organisationguid_of_B)`; logs không chứa raw identifiers.

## Decision points

- **Visible condition:** access grant giữa A ↔ B.
  - **Branch A (allowed):** filing proceeds; AC1/AC2 pass.
  - **Branch B (revoked/denied):** filing surfaces error về permission/connection; message KHÔNG nói "organisational mismatch" / "form not shared".
- **Visible condition:** form ownership cross-org.
  - **Branch A (form owned by A, shared hoặc không với B):** vẫn file — AC2.
  - **Branch B (post-fix):** không còn fall back sang form/response org khi patient row missing — chính là phần fix đang trong PR `nhs-supergrid-be#2752`.

## End and exceptional states

- End state: form filed into patient record (Org B); UI confirm + audit log entry.
- Empty/loading/error states: chưa observe; cụ thể error message wording (AC4) còn open do Mustafa flag tautology bug trong cross-org authorisation check.
- Cross-feature handoff: consultation screen ↔ Health Forms Designer (form ownership); consultation ↔ Organisation Sharing Agreements (cross-org grants).

## Safety boundary

- Last safe read-only state: patient profile/consultation summary trước khi `Submit`.
- Approval stop: `Send` / `Submit` / `File` cho mọi health form, đặc biệt cross-org.
- Actions not performed: live replay bị blocked — host `pac2-3934.dev.blinxpaco-np.com` chưa whitelist trong `paco.config.yaml`.
- Mutation: `None` (flow currently Inferred only).

## Execution guidance

- Setup/data:
  - 2 test organisations (`Org A` + `Org B`) trên host test `pac2-3934.dev.blinxpaco-np.com`.
  - Test user có cross-org role (hoặc 2 users tương ứng).
  - Patient test (`QA-test-cross-org-<ts>`) thuộc `Org B`.
  - Health form thuộc `Org A`; variants owned + shared.
  - Cấu hình access grant giữa A ↔ B cho phép clinician (case S1, S2, S3); và revoked cho case S4.
- Safe manual steps: chưa có; chờ host whitelist.
- Stop and request approval before: mọi `Submit` cross-org.
- Evidence to capture: post-condition "file thành công ở Org B"; reference patient org GUID; logs đã strip PII (theo Mustafa requirement).

## Automation guidance

- Stable roles/labels/landmarks: `consultation` view; `Submit` action; org tags trên patient selector; `QA-test-` prefix trên test patient names.
- Observable waits: chờ confirmation message + redirect; tránh fixed sleep.
- Data dependencies: 2 org setup, test patient owned bởi `Org B`, form owned bởi `Org A`.
- Assertions lacking trusted expected basis: wording error message AC4 (current code is tautology so AC4 never runs); backend log format (per code change requested); patient GUID handling.

## Provenance and gaps

- Environment: `dev` (intended) on `https://pac2-3934.dev.blinxpaco-np.com/`
- Role: clinician với cross-org grant (intended)
- Observed at: chưa
- Raw evidence:
  - `ticket/PAC2-3934-.../ticket.md` (description, ticket outcome, AC1–4)
  - `docs/paco/tickets/PAC2-3934/requirements.md` (atomic REQ-1 → 4)
  - `docs/paco/tickets/PAC2-3934/scenarios.md` (S1–S5)
  - PR `nhs-supergrid-be#2752` — review comment Mustafa (full PK, no fall back, fix tautology)
- Open questions:
  - OQ-1 → 6 từ requirements.md, quan trọng nhất OQ-6 (host whitelist).
  - Consultation screen exact route (chưa biết; nhiều khả năng `/paco-connect/consultation/<patientId>` — `Open Question`).
- Exact resume state: không có — chưa execute lần nào.

## Tester notes

[Protected area — host `pac2-3934.dev.blinxpaco-np.com` chưa whitelist; replay phải đợi bổ sung vào `paco.config.yaml`.]
