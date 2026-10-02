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

## Workflow
1. Resolve exactly one ticket; validate regex, confinement, duplicate key and `ticket.md`.
2. Hash raw sources; run `reconcileManifest()`, reconcile artifact checksums, classify semantic location changes, call `markFeatureLocationStale()` then propagate stale state. Preserve checkpoint/execution history.
3. Resume first valid unfinished phase or validate requested phase. `LOCATE` is required unless non-UI scope has an exact skip reason. Video input must have contact sheet/timeline reviewed (via subagent → `video/video-notes.md`) before `ANALYZE`.
4. Route one child: `ANALYZE` → `paco-requirements`; `LOCATE` → `paco-explore` mode `locate`; `EXPLORE` → `paco-explore` mode `observe`; `TEST_DESIGN` → `paco-test-design`; `MANUAL_EXECUTE` → `paco-playwright` mode `manual`; `AUTOMATE` → `paco-playwright` mode `generate`; `AUTOMATION_EXECUTE` → `paco-playwright` mode `cli`; `REPORT` → `paco-report`.
5. For `LOCATE`, require environment, role and manual auth. Search product graph/feature map first, validate reusable route in 1–3 meaningful views, otherwise bounded scan from dashboard. Budget prevents runaway; never trades correctness for speed.
6. Khi hoàn thành `TEST_DESIGN`, persist toàn bộ stable test-case ID vào `execution.case_ids`. For `MANUAL_EXECUTE`, reject thiếu case trong inventory; reject product `Fail` unless the child records at least three purposeful diagnostic attempts, control path and evidence. Require inventory/acceptance-criteria review before checkpoint.
7. For every Playwright phase, validate `ChildSkillOutcome`, phase/mode ownership, paths, checksums, structured `playwright_cases`, mutation ledger and durable evidence; specs phải nằm dưới `playwright/tests/tickets/`, xuất hiện trong artifact list, checksum đúng và filename map đúng case ID. Then call `applyPlaywrightOutcome()` before atomically updating manifest/status/checkpoint.
8. Do not leave `AUTOMATE` until every `Pass`/`Fail` has a current standalone spec and intermittent `Inconclusive` has a diagnostic spec or blocker. Do not enter `REPORT` until every created spec has a CLI result or recorded technical blocker.
9. MCP is allowed for `MANUAL_EXECUTE`; do not use MCP during `AUTOMATE`/`AUTOMATION_EXECUTE`. If durable route/locator is missing/stale, return to bounded manual investigation rather than rediscovering implicitly.
10. Never alter manual product result from CLI result. Keep product behavior, automation defect and auth/setup failure distinct.
11. Ask QA early when role, test data, domain rule, expected result, readable video, auth or baseline is missing. Include blocker, observation, evidence/timestamp, decision, concrete choices and affected cases.

## Safety
Execution-first workflow authorization permits selected test side effects without repeated prompts only on configured dev hosts and exact ticket/case/action/test-data scope. Enforce `evaluateMutationGate()`, runtime guards, safe data/recipient, redacted ledger and cleanup. Production/unknown host remains blocked. Never persist credentials, auth state or reusable approval.

## Stop, idempotency, outcome
`Blocked` for missing source/auth/input/safe data; `Failed` for technical/artifact errors. Never expand scope, rerun valid phases, reassign stable IDs, delete history, duplicate sources/questions, overwrite notes or auto-migrate existing ticket artifacts. Return ticket/revision/phase/outcome, artifacts, blockers/warnings and exact next action.