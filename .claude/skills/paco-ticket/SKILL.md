---
name: paco-ticket
description: Use when processing one explicitly selected Paco ticket through file-backed QA phases or resuming its checkpoint.
---

# Paco Ticket Orchestrator

## Scope
Process one user-selected ticket. Never scan, crawl, or auto-select tickets.

## Dependencies
Read `paco.config.yaml`, workflow/data/evidence standards and `docs/tickets/README.md`. Require ticket selection; optional target phase, environment and run scope. Never guess role, auth validity, test data, domain rule or expected result.

## Ownership
Only this skill writes `manifest.yaml` and `status.md`. `ticket/**` is read-only. Verify child artifact and structured outcome before checkpoint. Preserve final `## Tester notes`; stop on unsafe merge.

## Auto-login (before any MCP browser work)

Before entering any MCP phase (`LOCATE`, `EXPLORE`, `MANUAL_EXECUTE`), determine target app from ticket source or feature docs, then verify the current browser session is authenticated for that app:

1. **Determine app**: If ticket/feature mentions `commshub`, `Comms Hub`, or target URL includes `/commshub/` → **Comms Hub**. Otherwise → **PACO**.
2. Run the appropriate auth-check script via `browser_evaluate`:
   - PACO: `CHECK_AUTH_SCRIPT` from `scripts/paco-auth-helper.ts` → `{ authenticated: boolean, url: string }`
   - Comms Hub: `CHECK_AUTH_SCRIPT` from `scripts/comms-hub-auth-helper.ts` → `{ authenticated: boolean, url: string }`
3. If `authenticated: true` → proceed.
4. If `authenticated: false`:
   - PACO: try `buildFullLoginScript()` from `scripts/paco-auth-helper.ts` (credentials from `.env` via `loadCredentials()`). Skip if env vars missing or returns `{ step: 'login_failed' }`.
   - Comms Hub: try `buildCommsHubLoginScript(username, password)` from `scripts/comms-hub-auth-helper.ts` (credentials from `.env` `PAC_USERNAME`/`PAC_PASSWORD`). Skip if env vars missing or returns `{ step: 'login_failed' }`.
   - If skipped or failed: fall back to manual auth — direct tester to log in manually in the browser. Do not proceed with MCP phases until auth is confirmed.
5. After any login, re-run the auth-check script to confirm `authenticated: true`. If still false, report `Blocked: Authentication failed for [PACO|Comms Hub] after login attempt` and stop dependent phases.

This runs once per ticket session, before the first MCP phase. Subsequent MCP phases reuse the authenticated session. App identity (PACO vs Comms Hub) is sticky per session — do not re-evaluate mid-session.

## Concurrent Execution Isolation

For running multiple tickets concurrently without conflicts:

1. **Use MCP Run Manager** for isolated browser resources:
   ```bash
   # Before starting ticket work, create isolated run:
   npm run mcp:run:create <ticket-id>
   
   # After ticket completes:
   npm run mcp:run:cleanup <run-id>
   ```

2. **In scripts/code**, use `scripts/mcp-run-helper.ts`:
   ```typescript
   import { getMcpLaunchConfig, cleanupRun } from './scripts/mcp-run-helper.js';
   
   const config = await getMcpLaunchConfig('PAC2-1234');
   // config.port, config.userDataDir, config.storageState
   // Use for spawning isolated MCP or Playwright
   await cleanupRun(config.runId);
   ```

3. **Port allocation**: Runs use ports 3200-3209 (10 concurrent max)
4. **Never kill processes by name** — use tracked PIDs from metadata
5. **Verify isolation**: `npm run mcp:run:ports` to see active allocations

## Workflow

**Automatic MCP Run Management (concurrent execution):**
- **On start**: Run `npm run mcp:run:create <ticket-id>` to allocate isolated port (3200-3209)
- **On checkpoint/update**: Check `npm run mcp:run:ports` to verify no conflicts with other runs
- **On COMPLETE or error**: Run `npm run mcp:run:cleanup <run-id>` to release resources

1. Resolve exactly one ticket; validate regex, confinement, duplicate key and `ticket.md`.
1a. Read `paco.config.yaml` `safety.allowedHosts` and `safety.externalDevHosts`; call `applyTicketMutationMode(ticketKey, env, host, 'paco-ticket')` to stamp `mutationMode` into `manifest.yaml` before any child skill runs. If the host is unknown at intake, default to `manual` and re-evaluate when the child first reports URL.
1a1. Call `applyTicketExecutionMode(ticketKey, 'paco-ticket')` to stamp `execution.mode` into `manifest.yaml`. Default cho intake mới là `cli_first`; existing manifest với `mode: mcp_first` giữ nguyên qua intake (backward compat). Mode không phụ thuộc host/env; nó chỉ chọn execution pipeline.
1b. **Create MCP run**: `npm run mcp:run:create <ticket-id>`. Save runId to `manifest.yaml:execution.mcpRunId` for cleanup later.
2. Hash raw sources; run `reconcileManifest()`, reconcile artifact checksums, classify semantic location changes, call `markFeatureLocationStale()` then propagate stale state. Preserve checkpoint/execution history.
3. Resume first valid unfinished phase or validate requested phase. `LOCATE` is required unless non-UI scope has an exact skip reason. Video input must have contact sheet/timeline reviewed (via subagent → `video/video-notes.md`) before `ANALYZE`.
4. Route one child: `ANALYZE` → `paco-requirements`; `LOCATE` → `paco-explore` mode `locate`; `EXPLORE` → `paco-explore` mode `observe`; `TEST_DESIGN` → `paco-test-design`; `MANUAL_EXECUTE` → `paco-playwright` mode `manual`; `AUTOMATE` → `paco-playwright` mode `generate`; `AUTOMATION_EXECUTE` → `paco-playwright` mode `cli`; `REPORT` → `paco-report`. Với `execution.mode === 'cli_first'`: transition `TEST_DESIGN` → `AUTOMATE` (skip `MANUAL_EXECUTE`); transition `AUTOMATE` → `AUTOMATION_EXECUTE` chạy `npm run paco:cli -- <ticket> <case>` thay cho MCP per-case. Với `execution.mode === 'mcp_first'`: giữ flow 7-phase.
5. For `LOCATE`, require environment and role. Auth is handled by the Auto-login section above. Search product graph/feature map first, validate reusable route in 1–3 meaningful views, otherwise bounded scan from dashboard. Budget prevents runaway; never trades correctness for speed.
6. Khi hoàn thành `TEST_DESIGN`, persist toàn bộ stable test-case ID vào `execution.case_ids`. Với `execution.mode === 'mcp_first'`, `MANUAL_EXECUTE` reject thiếu case trong inventory và reject product `Fail` nếu thiếu ba diagnostic attempts + control path + evidence. Với `execution.mode === 'cli_first'`, gate `MANUAL_EXECUTE` không bắt buộc: `AUTOMATE` chỉ cần `case_ids` không rỗng + `feature-location.md` đã valid + page object verified. `MANUAL_EXECUTE` vẫn tồn tại nhưng chỉ route về khi CLI fails thiếu expected basis hoặc locator stale. Require inventory/acceptance-criteria review before checkpoint.
7. For every Playwright phase, validate `ChildSkillOutcome`, phase/mode ownership, paths, checksums, structured `playwright_cases`, mutation ledger and durable evidence; specs phải nằm dưới `playwright/tests/tickets/`, xuất hiện trong artifact list, checksum đúng và filename map đúng case ID. Then call `applyPlaywrightOutcome()` before atomically updating manifest/status/checkpoint.
8. Do not leave `AUTOMATE` until every `Pass`/`Fail` has a current standalone spec and intermittent `Inconclusive` has a diagnostic spec or blocker. Do not enter `REPORT` until every created spec has a CLI result or recorded technical blocker. Do not checkpoint `COMPLETE` until the `paco-report` outcome lists the final knowledge sync (defects/results/`Last verified` in `feature-map.md` and `workflows/<module>.md`) and `bash validate-docs-structure.sh` passes.
9. Do not enter `MANUAL_EXECUTE` until the `LOCATE` outcome lists the `feature-map.md` route sync (or a non-UI skip reason) and the `EXPLORE` outcome lists the ticket knowledge sync (`feature-map.md` entry + ticket row, `workflows/<module>.md` `## Logic từ ticket`) and `bash validate-docs-structure.sh` passes. MCP is allowed for `MANUAL_EXECUTE`; do not use MCP during `AUTOMATE`/`AUTOMATION_EXECUTE`. If durable route/locator is missing/stale, return to bounded manual investigation rather than rediscovering implicitly.
10. Never alter manual product result from CLI result. Keep product behavior, automation defect and auth/setup failure distinct.
11. Bounded diagnosis: khi `execution.runs[case].verification === 'Inconclusive'` từ CLI runner, rerun `npm run paco:cli -- <ticket> <case> --diagnose` để thu thập `diagnostic_attempts` (same/clean/fresh_session/control) tối đa ba attempts có mục đích. Hết ceiling hoặc ổn định → giữ nguyên product result với `Inconclusive`. Không retry mutation khi side effect state chưa rõ; không mở rộng `PACO_ALLOW_*` scope.
12. Ask QA early when role, test data, domain rule, expected result, readable video, auth or baseline is missing. Include blocker, observation, evidence/timestamp, decision, concrete choices and affected cases.

## Mutation Mode
Read `manifest.yaml:mutationMode` before any side effect. Default is `auto` whenever the host is in `paco.config.yaml: safety.allowedHosts` or `externalDevHosts` (set by `applyTicketMutationMode()` on intake). Mutations are normal QA operations, not exceptional actions requiring per-action approval.

`auto` (default on configured dev host):
- Manifest authorization is the primary gate. Do not re-prompt per CRUD action, form submit, validation test, or cleanup of own test data.
- Still enforce: hostname matches allowlist, safe test data (no real PII, `QA-test` prefix on records this run creates/updates; historical `QA-AUTO` accepted), approved recipient (`fiona.nguyen@blinxsolutions.com` for email; SMS requires explicit tester confirmation each time), production/unknown host is blocked, mutation ledger written, cleanup on pass/fail, leftover log on cleanup fail.
- `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE` env vars are an optional local safety guard, not the primary gate. Do not require them when manifest says `auto`.

`manual` (only when tester or intake forces it): legacy behavior — ask tester per case; env var guards still apply.

## Safety
Auto-mutation only on configured dev hosts via `mutationMode: auto` in `manifest.yaml`. Still enforce `evaluateMutationGate()` (with `mutationMode` param), runtime guards, safe data/recipient, redacted ledger and cleanup. Production/unknown host remains blocked. Never persist credentials, auth state or reusable approval.

## Stop, idempotency, outcome

**MCP Run Cleanup:**
- Before checkpointing `COMPLETE`, must cleanup: `npm run mcp:run:cleanup <run-id>` where runId from `manifest.yaml:execution.mcpRunId`
- On `Failed` or `Blocked`, still cleanup the run to release port
- If cleanup fails (port still in use), log warning but don't block checkpoint

`Blocked` for missing source/auth/input/safe data; `Failed` for technical/artifact errors. Never expand scope, rerun valid phases, reassign stable IDs, delete history, duplicate sources/questions, overwrite notes or auto-migrate existing ticket artifacts. Return ticket/revision/phase/outcome, artifacts, blockers/warnings and exact next action.
