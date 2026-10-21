# QA Report: PAC2-3934

**Input Revision:** 1
**Environment:** dev (`blinx.dev.blinxpaco-np.com`)
**Role:** Blinx Deployment (Johnny 2255, org General Practice (Demo Site))
**Run/Scope:** PAC2-3934 — đã thử chạy live trên dev chung theo lựa chọn của tester
**Generated:** 2026-10-18T03:10:00Z
**Overall:** **Blocked** (technical — not test design/tooling failure)

## Scope and Limitations

**Đã làm:**
- INGEST: snapshot Jira (`docs/paco/replay/pac2-3934-initial-snapshot.yml` + `pac2-3934-testing-snapshot.yml`), `ticket.md`, requirements.md được dựng.
- ANALYZE: `requirements.md` (REQ-1 → REQ-4) + `scenarios.md` (S1–S5) — cả hai Inferred từ ticket + code review của Mustafa trên `nhs-supergrid-be#2752`.
- LOCATE: khảo sát 4 views trên dev chung (`/paco/dashboard`, `/paco-connect/dashboard`, `/paco/health-forms`, `/paco/health-forms/inbox`) — chi tiết ở `feature-location.md`.

**Không làm được (Blocked):**
- EXPLORE / TEST_DESIGN / MANUAL_EXECUTE / AUTOMATE / AUTOMATION_EXECUTE — consultation screen không accessible trên dev chung. Cần unblock PAC2-5445 hoặc whitelist `pac2-3934.dev.blinxpaco-np.com` để chạy AC1–AC4.

**Tester đã quyết (lúc intake):** chạy trên dev chung, KHÔNG whitelist host riêng.

## Results

| Test Case | Result | Requirement Basis | Evidence | Mutation/Cleanup |
|---|---|---|---|---|
| TC-3934-001 / S1 — Cross-org filing happy path (AC1) | **Not Run** | REQ-3934-001 (Confirmed) | Không có evidence — route blocked | None / n/a |
| TC-3934-002 / S2 — Form owned by requesting org only (AC2) | **Not Run** | REQ-3934-002 (Confirmed) | Không có evidence — route blocked | None / n/a |
| TC-3934-003 / S3 — Same-org regression (AC3) | **Not Run** | REQ-3934-003 (Confirmed) | Không có evidence — route blocked | None / n/a |
| TC-3934-004 / S4 — Denied access shows correct error (AC4) | **Not Run** | REQ-3934-004 (Confirmed) | Không có evidence — route blocked | None / n/a |
| TC-3934-005 / S5 — Logging hygiene | **Not Run** | Mustafa code review note | Không có evidence — route blocked | None / n/a |

## Defects

Không có defect mới — không có manual reproduction trên dev chung.

**Known defects (từ upstream, không phải discovery của session này):**
- PAC2-3934 (Open, P2) — original ticket bug: AC4 hiện bị nullify bởi tautology `patientOrganisationGuid === patientOrganisationGuid` trong PR `nhs-supergrid-be#2752`. PR đang `Requesting changes`.
- PAC2-5445 (Ready to Release, P1) — linked blocker, consultation mode không mở — đây là blocker **cứng** cho PAC2-3934 ở dev chung.

## Blockers and Open Questions

**Blockers ngăn chạy live:**
1. **PAC2-5445** (linked blocker) — consultation mode không mở trên PACO Connect. PAC2-3934 phụ thuộc vào entry point này.
2. **Host `pac2-3934.dev.blinxpaco-np.com` chưa whitelist** trong `paco.config.yaml`. Tester chọn không add host riêng lúc intake. Dev chung không có consultation screen accessible.

**Open Questions:**
- OQ-7: backend fix `nhs-supergrid-be#2752` đã deploy lên host nào (dev chung / host riêng PAC2-3934 / chưa)? Không verify được — không có route.
- OQ-8: PAC2-5445 sẽ release khi nào → không nằm trong scope của session này.
- OQ-2: trạng thái PR `nhs-supergrid-be#2752` sau `Requesting changes` — không thay đổi từ session trước.

## Video Coverage

N/A — 14 attachments metadata only. Chưa download. Theo memory `paco-video-flow`, nếu cần analyze frame, dispatch subagent `model: sonnet` qua 9router. Hiện không cần vì đã Blocked vì technical.

## Mutation Ledger and Durable Evidence

- **No mutation executed** trong session này — không có test data tạo, không có cleanup.
- Durable evidence: chỉ có Jira snapshot + ticket.md. Path: `docs/paco/replay/pac2-3934-{initial,testing}-snapshot.yml`.

## Automation Decision

**Not worth automating now** — không có manual `Pass`/`Fail` nào để leverage. Khi ticket unblock, automation sẽ follow cli_first:
- Tạo `.spec.ts` standalone cho từng TC-001 → TC-005 trong `playwright/tests/tickets/`.
- Sử dụng role cross-org clinician + patient `QA-test-cross-org-<ts>` + form `QA-test-cross-org-form-<ts>`.

## Regression Recommendations

None — không có baseline mới từ session này.

## Product Knowledge Proposals

- **`docs/product/feature-map.md`** — thêm row cho consultation route `Open` ở dev chung (404 trên mainline, blocked by PAC2-5445).
- **`docs/product/open-questions.md`** — đóng OQ-6 (host whitelist) với note "tester declined; offered host riêng"; thêm OQ-7 (backend fix deployment state) + OQ-8 (PAC2-5445 release timeline).
- **`docs/product/workflows/`** — không có file mới vì flow cross-org chỉ là Inferred.

## Sensitive Data Review

- Không capture patient/PII, credential, hay auth state trong session này (chỉ public-facing dashboard, route 404, sidebar labels).
- Mutation ledger: trống (no mutation executed).

## Outcome

**Ticket: Blocked** — outcome không phải Pass/Fail. Lý do blocker được ghi rõ trong `status.md`. `paco-ticket` sẽ mark COMPLETE với checkpoint cho resume sau.

Tester muốn resume: cần unblock PAC2-5445 hoặc whitelist `pac2-3934.dev.blinxpaco-np.com`. Khi đó, replay lại S1–S5 từ `scenarios.md` với role cross-org clinician + `QA-test` data.
