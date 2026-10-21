---
name: paco-playwright
description: Use when manually executing, generating, or running standalone Paco Playwright cases within the selected ticket scope.
---

# Paco Playwright

## Scope and dependencies
Only `MANUAL_EXECUTE`, `AUTOMATE`, or `AUTOMATION_EXECUTE`. Require selected valid cases, environment, role, current revision, valid local browser-auth state, and a valid `feature-location.md` for every UI-dependent case. Call `evaluateUiLocationGate()` before UI work. Read feature-location, workflow, data-safety and evidence standards plus `docs/templates/automation.md`.

**Auth pre-flight (mode `manual`):**
1. Run `CHECK_AUTH_SCRIPT` from `scripts/paco-auth-helper.ts` via `browser_evaluate`. If `authenticated: true` → proceed.
2. If `authenticated: false`, call `buildFullLoginScript()` from `scripts/paco-auth-helper.ts` via `browser_evaluate`. Retry `CHECK_AUTH_SCRIPT`.
3. If still unauthenticated, return `Blocked: Authentication expired`; direct tester to `npm run auth:login`. Do not proceed until auth confirmed.

Never request credentials, read serialized auth state, infer expected behavior, broaden scope, or automate assertions based only on `Inferred`/`Open Question` knowledge.

## Concurrent Execution Isolation

When running multiple tickets in parallel, use isolated browser resources:

1. **Before MCP work**: Create isolated run via `npm run mcp:run:create <ticket-id>`
2. **Check port allocation**: `npm run mcp:run:ports` to verify no conflicts
3. **After completion**: Cleanup with `npm run mcp:run:cleanup <run-id>`

For code integration:
```typescript
import { getMcpLaunchConfig, cleanupRun } from './scripts/mcp-run-helper.js';
const config = await getMcpLaunchConfig('PAC2-1234');
// Use config.port, config.userDataDir, config.storageState
await cleanupRun(config.runId);
```

## Ownership
Own `automation.md`, selected Playwright source, and structured `playwright_cases` proposals. Raw runner output stays in `test-results/`; durable reviewed/redacted evidence is promoted for `REPORT`. Preserve final `## Tester notes`. Never update `manifest.yaml` or `status.md`.

## Modes

### `MANUAL_EXECUTE` — mode `manual`

1. Dùng Claude Playwright MCP chạy từng case đúng environment, role, precondition và safe test data. Ghi route, role locator, sequence, observable wait, expected basis, timestamp và evidence từng attempt.
2. Kiểm tra UI result và persisted state sau reload/navigation. Dùng network observation chỉ để phân biệt nguyên nhân; không bypass UI behavior cần test.
3. Attempt đầu `Fail` phải chạy lại tối thiểu ba diagnostic attempts: cùng dữ liệu, dữ liệu mới/sạch, fresh page/session; thêm control path gần nhất. Mỗi retry phải có mục đích và evidence. Chỉ ghi `Fail` khi tái hiện ổn định hoặc evidence xác định product cause.
4. Fail rồi pass/outcome không ổn định là `Inconclusive`, không ép thành `Fail`. `Blocked`/`Not Run` phải có reason. Trước khi hoàn thành, rà acceptance criteria, requirement mapping và toàn bộ case inventory để tránh bỏ case/step.
5. Trả structured `playwright_cases[].manual`; không tạo spec trong phase này.
6. Giữ output browser gọn: case đã biết rõ expected thì `browser_run_code`/`browser_evaluate` chỉ `return` Giá trị cần assert (text, count, status, error); snapshot đầy đủ khi state mới/không như kỳ vọng hoặc khi điều tra `Fail`. Log/DOM lớn cần làm evidence thì ghi file và chỉ trả path + tóm tắt. Đoạn code dài dùng lại nhiều lần thì viết ra file rồi chạy, không dán lại vào context.

### `AUTOMATE` — mode `generate`

1. Tạo standalone `.spec.ts` cho mọi case trong `execution.case_ids` mà chưa có spec. `Pass`/`Fail` encode expected requirement nên spec được phép fail đúng product assertion khi defect còn tồn tại. Với `execution.mode === 'cli_first'`, spec sinh ra từ `requirements.md` + `feature-location.md` + `playwright/pages/*.ts` + `docs/product/workflows/<module>.md` mà không cần manual record trước. Với `mcp_first`, manual `Pass`/`Fail` là gate.
2. Intermittent/flaky `Inconclusive` tạo diagnostic repeat spec nhưng không encode unsupported correctness conclusion. `Blocked`/`Not Run` được skip chỉ với reason.
3. Tái dùng durable route/locator/precondition từ `playwright/pages/` và feature-location; không dùng MCP khám phá lại. Nếu locator/page object thiếu/stale, route về bounded manual investigation (MCP) thay vì suy đoán.
4. Prefer Chromium, role locators, observable waits và sourced assertions. Không private API bypass hoặc assertion chỉ từ `Inferred`.
   - Pacing (tester yêu cầu 2026-10-02): Paco UI (PrimeReact dropdown/multiselect, modal tải slot) re-render chậm, click quá nhanh làm option detach. Mọi spec có `settle()` = `page.waitForTimeout(Number(process.env.PACO_STEP_MS ?? 1000))` sau mỗi `click`/`fill`/`press`, và chờ thêm ~3s sau khi mở modal/list tải dữ liệu, kết hợp với observable wait (không thay thế assertion).
5. Page objects: spec sinh ra phải import từ `playwright/pages/` trước (xem `playwright/pages/README.md`); locator mới đã xác minh thì thêm vào page object đúng khu vực kèm comment `Source:`, không viết inline. Page object không assert kết quả nghiệp vụ.
6. Đặt spec dưới `playwright/tests/tickets/`; filename phải chứa stable case ID. Trả spec trong artifact list với checksum cùng structured `playwright_cases[].automation` gồm spec path, diagnostic flag, reason và input revision.

### `AUTOMATION_EXECUTE` — mode `cli`

1. Chạy Playwright CLI ngay, đúng ticket/test scope; không dùng MCP. Với `execution.mode === 'cli_first'`, gọi `npm run paco:cli -- <ticket> <case-id>` thay cho MCP orchestration; với `mcp_first`, giữ legacy CLI invocation manual.
2. Ghi exit status, case result và phân loại: `Matched product result`, `Product behavior mismatch`, `Automation defect`, `Setup or authentication failure`, hoặc `Inconclusive`.
3. CLI fail đúng expected product assertion tái hiện manual `Fail`; không phải automation defect. Locator/auth/setup failure không chứng minh product `Fail`. Không sửa product result từ automation result.
4. Trả structured `playwright_cases[].run`; evidence cần report phải durable/redacted. Khi gọi `--diagnose`, runner ghi `run.diagnostic_attempts[]` hợp lệ schema; cap ba attempts.

## Mutation Mode

Read `manifest.yaml:mutationMode` before any side effect. Default is `auto` whenever the host is in `paco.config.yaml: safety.allowedHosts` or `externalDevHosts`. In `auto` mode the standalone spec can `Create`/`Update`/`Save`/`Submit`/`Send`/`Delete`/`Restore`/`Upload`/`Import`/`Download` on owned test data without per-action approval: the spec is the authorization.

Still enforce in `auto` mode: `evaluateMutationGate()` with the `mutationMode` param; hostname matches allowlist; safe test data only (no real PII, `QA-test` prefix on records the spec creates/updates; historical `QA-AUTO` accepted); approved recipient (`fiona.nguyen@blinxsolutions.com` for email; SMS requires explicit tester confirmation each time); production/unknown host is blocked; mutation ledger written with redacted before/after state; cleanup in `finally { cleanup() }`; leftover log on cleanup fail. `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE` env vars are an optional local safety guard, not the primary gate.

`manual` (only when tester or intake forces it): pass `mutationMode` into `evaluateMutationGate()`; legacy behavior — require `PACO_ALLOW_MUTATION=true` and `PACO_ALLOW_DESTRUCTIVE=true` for destructive actions and ask the tester per case.

Record result chỉ bằng `Pass`, `Fail`, `Blocked`, `Not Run`, `Inconclusive`. Raw output ở `test-results/`; không lưu credential, cookie, token, header hoặc auth state.

## Direct invocation, stop, outcome
Write only owned artifact/source and return `ChildSkillOutcome` v1 with structured cases, checksums, counts, mutation/cleanup, sensitive-data status, blockers/warnings and recommended next phase. Stale dependency/auth/data is `Blocked`; runner fault is `Failed`. Never call another skill or update workflow checkpoint.
