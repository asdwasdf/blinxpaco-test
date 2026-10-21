# Replay: PAC2-3934 — Allow Health Form Filing Across Different Organisations in PACO Connect

- Imported at: 2026-10-18T02:17:00Z
- Status: **Blocked**
- Reason: host `https://pac2-3934.dev.blinxpaco-np.com/` (from Multiple Test URL) chưa trong `paco.config.yaml` `allowedHosts` / `externalDevHosts`. Theo CLAUDE.md Safety Policy, production/unknown host luôn bị chặn.
- Source: https://blinxsolutions.atlassian.net/browse/PAC2-3934
- Environment (intended): `dev` trên `pac2-3934.dev.blinxpaco-np.com`
- Flow: `cross-org-health-form-filing` (mới, chưa có trong `docs/product/workflows/`)

## Prerequisites (cần resolve trước khi chạy)

- [ ] Tester (Fiona Nguyen) confirm host `pac2-3934.dev.blinxpaco-np.com` đã được approve cho QA scope, hay cần add vào `allowedHosts`.
  - File cần update: `paco.config.yaml` → `safety.allowedHosts`.
- [ ] Test user với role cross-org clinician trên host đó (per AC1). Có thể cần Fiona tạo.
- [ ] 2 test organisations setup (Org A + Org B) — chờ dev ops confirm có sẵn test data ở host.
- [ ] Patient `QA-test-cross-org-<ts>` thuộc `Org B` — tạo khi đến phase EXECUTE.
- [ ] Health form owned-by-Org-A — có thể lấy từ `/health-forms/builder/` trên host.

## Replay phases đã chạy

| Phase | Status | Artifact |
|---|---|---|
| FETCH (snapshot) | ✅ Done (Playwright MCP, không qua `jira:import` CLI) | `docs/paco/replay/pac2-3934-initial-snapshot.yml`, `docs/paco/replay/pac2-3934-testing-snapshot.yml` |
| Ticket source | ✅ Tạo thủ công | `ticket/PAC2-3934-allow-health-form-filing-across-different-organisations-in-paco-connect/ticket.md` |
| Requirements extraction | ✅ | `docs/paco/tickets/PAC2-3934/requirements.md` (REQ-3934-001 → 004) |
| Flow matching | ✅ Done — không match existing flow (clinical cross-org filing không thuộc flow nào đã cover). | — |
| New flow doc | ✅ Tạo mới | `docs/paco/flows/cross-org-health-form-filing.md` |
| Scenario reconstruction | ✅ | `docs/paco/tickets/PAC2-3934/scenarios.md` (S1–S5) |
| Playwright replay | ⛔ Blocked — host not whitelisted | — |
| Video ingestion | ⛔ Not started — 14 attachments chưa download. Theo memory `paco-video-flow`, có thể dispatch subagent `model: sonnet` để analyze frame nếu user yêu cầu. |
| Automation spec (`.spec.ts`) | ⛔ Skipped — không có result nào để automate | — |
| Report | ⛔ Deferred | — |

## Steps reconstructed (từ scenarios.md)

Các step dưới đây chỉ là bản mô tả flow, chưa chạy thực:

### S1 — Cross-org filing happy path (AC1, REQ-1)

1. Login PACO Connect dưới Org A (user Fiona_test).
2. Vào consultation screen → search patient `QA-test-cross-org-<ts>` ở Org B.
3. Verify patient record load cross-org: org tag = "Org B".
4. Attach health form owned by Org A (form `QA-test-cross-<ts>`).
5. Complete fields required → Submit.
6. **Expected:** file filed về record của patient ở Org B.
7. Verify audit log không chứa PII; reference `(patientguid, organisationguid_of_B)`.

### S2 — Cross-org, form only owned by requesting org (AC2, REQ-2)

Same as S1, với form KHÔNG share sang Org B.
- **Expected:** vẫn file thành công (theo fix Mustafa đang review trên `nhs-supergrid-be#2752`).

### S3 — Same-org regression (AC3, REQ-3)

User A ở Org A, patient A cũng Org A.
- **Expected:** behavior không đổi.

### S4 — Cross-org with denied access (AC4, REQ-4)

Pre-fix: bug ngăn AC4 (cross-org auth check là tautology).
Post-fix: error message nói rõ "permission/connection", không "org mismatch".
- **Expected:** clean error path.

### S5 — Logging hygiene (no formal AC, code quality)

Verify logs không leak PII (Mustafa requirement).

## Expected result (từ PAC2-3934 Acceptance Criteria)

Tóm tắt:
- AC1 ✅ file về Org B record khi Org A login.
- AC2 ✅ file form không share cũng OK.
- AC3 ✅ same-org baseline giữ nguyên.
- AC4 ✅ error message rõ ràng khi access denied.

## Actual result

**Not executed (Blocked).** Snapshot Jira đã capture; chưa execution on product.

## Evidence references

- `docs/paco/replay/pac2-3934-initial-snapshot.yml` — Jira snapshot (Ticket Details tab)
- `docs/paco/replay/pac2-3934-testing-snapshot.yml` — Testing Details tab + Activity panel
- `ticket/PAC2-3934-.../ticket.md` — chuẩn hoá từ snapshot + import notes
- `docs/paco/tickets/PAC2-3934/requirements.md` — atomic REQ list
- `docs/paco/tickets/PAC2-3934/scenarios.md` — step-by-step
- `docs/paco/flows/cross-org-health-form-filing.md` — flow doc (new)

## Code references

- PR `nhs-supergrid-be#2752` — Requesting changes (Mustafa). Các blocker:
  1. Patient lookup phải dùng full PK `(patientguid, organisationguid)`.
  2. Không fall back sang form/response org khi patient missing.
  3. Fix tautology trong cross-org auth check (để AC4 chạy).
  4. Strip PII khỏi logs.
  5. Tests cho missing-patient, full-PK, denied user.
- PR `nhs-supergrid-fe#4885` — trailing-space only, nên đóng.
- PR `paco-connect-fe#2520` — session null-guards, không thuộc story này.
- Linked ticket `PAC2-5445 — Unable to open consultation mode in connect` (blocker, còn `Ready to Release`).

## Safety log (cho replay phi này)

- Tất cả actions đã chạy: `browser_navigate` (Jira), `browser_snapshot`×2 (saved vào `docs/`), `browser_click` (Testing Details tab), `Write` (artifact files), `Bash` (mkdir + grep + dir listing).
- Không side-effect nào trên Paco hay tài khoản thật.
- Không download attachment (14 video); không truy cập `pac2-3934.dev.blinxpaco-np.com`.
- Console errors trên page Jira (`8 errors`, `Console: 17 errors`) — đến từ Atlassian Rovo/Agents popup + iframe (Tempo "Unauthorized"), không phải action của agent.

## Open questions lúc đóng replay

1. Host whitelist (OQ-6) — cần user quyết; nếu được duyệt, replay pipeline có thể chạy tiếp S1–S4 với subagent Playwright MCP.
2. Trạng thái PR `nhs-supergrid-be#2752` (OQ-2) — phải đợi update từ author/PR activity mới.
3. 14 attachments (OQ-1) — chưa analyze, có thể dispatch subagent `model: sonnet` qua `paco-video-flow` cho 1+ video để xác minh repro step (ưu tiên `3934 AC1 - Fail.mp4`).
4. Consultation screen exact route — chưa biết, cần quan sát trực tiếp trong phase LOCATE.

## Tester notes

[Tester: Fiona Nguyen — host test đã gán cho ticket qua "Multiple Test URL" là `pac2-3934.dev.blinxpaco-np.com`. Host này chưa whitelist trong `paco.config.yaml`. Theo CLAUDE.md Safety Policy, không thể tự ý add host vào whitelist — cần user quyết trước khi phase EXECUTE. Tickets khác như `PAC2-7669` / `PAC2-8575` đã có memory riêng về host-specific; nếu host này đã được approve cho QA, ticket nên được add vào `allowedHosts` rồi replay tiếp.]
