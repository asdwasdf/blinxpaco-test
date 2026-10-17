# Plan: Paco CLI-first Execution Pipeline

Date: 2026-10-17
Status: in progress
Owner: paco-ticket + paco-playwright

## Context

`paco-ticket` orchestrator was MCP-first: every manual case was an MCP round-trip
before any `.spec.ts` could be generated. Each ticket required dozens of MCP tool
calls just to populate `execution.manual[]`, then a second pass through `paco-playwright`
to produce specs, then a third pass to execute. The result: testers wait while
context fills with browser snapshots.

The `paco-video-flow` skill already proved a faster pattern: build a reusable
Playwright spec from knowledge + page objects, run it via CLI, then escalate to
MCP only when evidence is ambiguous. We are generalising that pattern into the
default ticket pipeline.

## Goals

- Default intake stamps `execution.mode: cli_first`.
- `AUTOMATE` generates specs from durable knowledge without waiting on manual MCP
  evidence.
- `AUTOMATION_EXECUTE` runs `npm run paco:cli` and writes `execution.runs[]` from
  the CLI outcome.
- `MANUAL_EXECUTE` is optional fallback for `Open Question` expected basis or
  when the CLI run returns `Inconclusive`.
- Product result, automation defect and setup/auth failure stay separate.

## Non-goals

- Touching `paco-discover`, `paco-verify-flow` discovery architecture.
- Auto-granting mutation authorization, env vars, or destructive approval.
- Replacing `paco-report` ingestion (it still accepts manual or CLI runs).
- Rewriting historical `mcp_first` tickets; their mode stays as recorded.

## Runtime wiring (committed)

| Task | Result |
| --- | --- |
| Add `ExecutionMode` schema field with reader/writer | `scripts/manifest-execution-mode.ts` |
| Stamp mode at intake with backward compat | `scripts/apply-ticket-execution-mode.ts` |
| CLI runner that maps Playwright JSON into `AutomationCaseExecution` | `scripts/paco-cli.ts` |
| Add `cli_first` branch to `validateExecutionGate` so AUTOMATE/AUTOMATION_EXECUTE skip manual gate | `scripts/manifest-utils.ts` |
| Add `TEST_DESIGN → AUTOMATE` direct transition for `cli_first` | `scripts/manifest-utils.ts` |
| Reconcile legacy v2 manifests with missing `execution.mode` to `mcp_first` | `scripts/manifest-utils.ts` |

## Skill wiring (committed)

- `paco-ticket` calls `applyTicketExecutionMode(ticketKey, 'paco-ticket')` at
  intake (step 1a1).
- `paco-playwright` AUTOMATION_EXECUTE routes `cli_first` to
  `npm run paco:cli -- <ticket> <case-id>` instead of MCP orchestration.
- `paco-video-flow` aligns with the same `cli_first` execution path.
- All eight skills gain an `## Mutation Mode` section for the `mutationMode`
  decision documented in `docs/superpowers/plans/2026-10-16-paco-auto-mutation-no-prompt.md`.

## Tests (committed, no browser required)

1. `applyTicketExecutionMode` defaults to `cli_first` on a fresh manifest.
2. Honors existing `mcp_first` opt-out on intake.
3. `setExecutionMode` preserves unrelated keys and stamps `modeSetBy/modeSetAt`.
4. `validateExecutionGate` allows `AUTOMATE` in `cli_first` when
   `feature-location.md` is valid without manual entries.
5. `validateExecutionGate` allows `AUTOMATION_EXECUTE` in `cli_first` when every
   case has a current-revision automation spec.
6. `validateExecutionGate` blocks `AUTOMATION_EXECUTE` in `cli_first` when any
   case lacks a spec.
7. `validateExecutionGate` blocks `REPORT` in `cli_first` until every implemented
   spec has a CLI run record.
8. `reconcileManifest` normalizes legacy v2 manifests missing `execution.mode`
   to `mcp_first`.
9. `paco-cli.runCase` rejects `mcp_first` tickets.
10. `paco-cli.runCase` rejects missing automation spec.
11. `paco-cli.runBatch` skips cases without automation spec.
12. `paco-cli.runBatch` persists `execution.runs` when `--write-back` is passed.
13. `paco-cli` classifies a passing JSON report as `Pass / Matched product result`.
14. `paco-cli` classifies a locator failure as `Fail / Automation defect`.
15. `paco-cli` classifies an auth/session failure as `Fail / Setup or authentication failure`.

## Backward compatibility

- Existing manifests with `execution.mode: mcp_first` are honored and stay
  `mcp_first` through intake, validation, and resume.
- Legacy v1 manifests still reconcile to `MANUAL_EXECUTE` and the
  `mcp_first` default.
- The CLI runner rejects `mcp_first` tickets so legacy workflows cannot
  accidentally bypass their manual gate.

## Open / future

- Bounded MCP investigation policy for missing locators (out of scope here;
  handled in `paco-explore` mode `locate`).
- Bench harness for MCP-first vs CLI-first timing (needs tester authorization
  to run against the dev host).
- Spec for `paco-cli` `--diagnose` retry budget and variant selection
  (currently `fresh_session` only; expand when we add `same / clean / control`).