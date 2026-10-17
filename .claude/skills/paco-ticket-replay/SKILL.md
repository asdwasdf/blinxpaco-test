---
name: paco-ticket-replay
description: Use when replaying historical Jira Done tickets into the QA knowledge base through automated Playwright execution.
---

# Paco Ticket Replay

## Scope

Autonomous batch replay of Jira Done tickets into the Paco QA knowledge base. Never scan, crawl, or auto-select tickets outside a configured batch run.

## Integration points

| Component | Reused from |
|---|---|
| Orchestration | `paco-discover` pattern: CLI state management, checkpoint, bounded scan |
| Browser sessions | `paco-video-flow` / `paco-verify-flow`: Playwright MCP, mutation gate, auth pattern |
| Flow representation | `docs/product/workflows/*.md` template + `docs/templates/workflow.md` |
| Checkpoint | `paco-discover` / `paco-ticket`: atomic YAML checkpoint with revision |
| Mutation ledger | `paco-discover`: `scripts/mutation-ledger.ts` |
| Evidence | `paco-ticket` / `paco-video-flow`: durable `docs/tickets/<ticket>/evidence/` |
| Documentation | existing conventions: `docs/paco/flows/`, `docs/paco/tickets/` |
| Requirements extraction | `paco-requirements`: atomic ID, classification, provenance |
| Test design | `paco-test-design`: mutation class, risk, coverage |
| Playwright spec | `paco-playwright` mode `generate` + `cli` |

## Dependencies

Read `paco.config.yaml`, `scripts/mutation-gate.ts`, `scripts/mutation-ledger.ts`, `scripts/discovery-state.ts`, `scripts/child-outcome.ts`, `scripts/load-config.ts`, workflow/evidence/traceability standards and `docs/templates/*.md`. Require valid auth in the current Claude Playwright plugin tab. Never request credentials or read browser auth state.

## Output paths

| Artifact | Path |
|---|---|
| Replay checkpoint | `docs/paco/replay/<batch-id>.replay.yaml` |
| Per-ticket replay record | `docs/paco/tickets/<ticket-key>/replay.md` |
| Flow documentation | `docs/paco/flows/<flow-slug>.md` |
| Knowledge index | `docs/paco/index/flows.md`, `docs/paco/index/tickets.md` |

## Workflow

### 1. Batch init

`npm run paco:replay -- init --batch-id <id> [--batch-size N] [--environment dev] [--skip-imported]`

CLI creates `docs/paco/replay/<batch-id>.replay.yaml`:
- `batch_id`, `created_at`, `environment`, `status: active`
- `batch_size` (default 10), `skip_imported: true` by default
- `tickets: []` — empty, filled by fetch
- `processed`, `failed`, `skipped` counts

### 2. Fetch Done tickets

`npm run paco:replay -- fetch --batch-id <id>`

CLI queries Jira for Done-status tickets in configurable batch:
- Fetches: key, summary, description, status, assignee, reporter, created, updated, resolution date, labels, components, linked issues, comments, attachments (metadata only)
- Filters out already-imported tickets (`docs/paco/tickets/<key>/`)
- Stops at `batch_size` tickets
- Updates checkpoint: `tickets[]` with fetched metadata

### 3. Requirement extraction

For each ticket:
1. Read `ticket/<key>-*/ticket.md` if exists; otherwise use Jira description
2. Extract via `paco-requirements` pattern:
   - Functional requirements as atomic IDs
   - Affected PACO modules (from components, labels, description keywords)
   - User roles (from description, comments)
   - Setup requirements (preconditions, test data categories)
   - Expected behaviour (from acceptance criteria, description)
   - Test scenarios (from comments, linked issues, attachments)
3. Write `docs/paco/tickets/<key>/requirements.md` using `docs/templates/requirements.md`

### 4. Flow matching

For each ticket:
1. Check `docs/product/workflows/` for equivalent existing flows
2. Check `docs/paco/flows/` for deduplicated scenarios
3. Score by: module match, role match, step similarity, expected outcome
4. If match found (score > threshold): link to existing flow, skip replay steps
5. If no match: queue for Playwright replay

### 5. Scenario reconstruction

For unmatched tickets:
1. Parse test scenarios from `requirements.md`
2. Map each scenario to Playwright steps:
   - Entry point (URL / route from `feature-map.md`)
   - Preconditions (role, data state, context)
   - Interaction sequence (from scenario steps)
   - Observable assertions (expected vs possible outcomes)
   - Cleanup steps
3. Assign mutation class: `None` / `Temporary` / `Persistent` / `Destructive`
4. Write `docs/paco/tickets/<key>/scenarios.md`

### 6. Playwright replay

For each reconstructed scenario:
1. Verify auth in plugin tab
2. Call `evaluateMutationGate()` before any mutation
3. Execute steps using Playwright MCP:
   - Navigate to entry point
   - Execute interaction sequence with observable waits
   - Assert observable outcomes
   - Record actual vs expected
4. Compare observed behaviour with documented expectations
5. Classify result:
   - `Verified`: observed matches expectation with evidence
   - `Failed`: observed differs from expectation with evidence
   - `Blocked`: missing auth / fixture / data / route
   - `Partially replayed`: some steps executed, others blocked
   - `Not reproducible`: cannot reproduce documented scenario
6. Write evidence to `docs/paco/tickets/<key>/evidence/<scenario-id>/`
7. Update mutation ledger

### 7. Documentation

For each processed ticket:
1. Write `docs/paco/tickets/<key>/replay.md`:
   - Prerequisites (auth, role, test data)
   - Steps (numbered, observable)
   - Expected result (from requirements)
   - Actual result (from replay)
   - Evidence references
   - Jira link
   - Environment
   - Execution status
2. Update `docs/paco/index/tickets.md` with ticket row
3. Update `docs/paco/index/flows.md` with flow links
4. For new flows: write `docs/paco/flows/<flow-slug>.md` using `docs/templates/workflow.md`

### 8. Batch finalize

`npm run paco:replay -- finalize --batch-id <id>`

CLI:
- Updates checkpoint with final counts
- Sets `status: completed` or `status: partially_completed`
- Reports: processed, verified, failed, blocked, skipped, not_reproducible
- Logs deduplicated flows and new knowledge

## Resume and incremental

- CLI stores state in `docs/paco/replay/<batch-id>.replay.yaml`
- Resume: `npm run paco:replay -- resume --batch-id <id>`
- Only reprocess tickets whose content changed (checksum comparison) or whose linked flow changed
- Explicit `--force` flag required to revisit processed tickets

## Mutation Mode

Read checkpoint `mutationMode` before any side effect. Default is `auto` on configured dev host.

`auto`:
- Spec can `Create`/`Update`/`Save`/`Send`/`Delete`/`Restore`/`Upload`/`Import`/`Download` on owned test data without per-action approval
- Still enforce: hostname allowlist, `QA-test` prefix, approved recipient (`fiona.nguyen@blinxsolutions.com`), production blocked, ledger written, cleanup on pass/fail, leftover log

`manual`: ask tester per case; env var guards still apply

## Safety

- Read-only on Paco unless action is part of authorized scenario and authorized by mutation mode
- Hostname gate: never replay to host outside `paco.config.yaml`
- No real PII. Test data must be `QA-test` prefixed
- Cleanup: delete test records in `finally { cleanup() }`; log leftovers to `test-results/<spec>/leftovers.txt`
- Never mark scenario as verified without execution evidence

## Direct invocation, stop, outcome

Run `npm run paco:replay -- <command>` for CLI commands. Skill handles ticket-level replay within a batch. Never call other skills directly; delegate through CLI orchestration.

Return batch summary: processed, verified, failed, blocked, skipped, not_reproducible, new_flows, deduplicated, blockers, warnings.
