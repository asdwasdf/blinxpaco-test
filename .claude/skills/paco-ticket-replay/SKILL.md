---
name: paco-ticket-replay
description: Use when replaying historical Jira Done tickets into the QA knowledge base through automated Playwright execution — knowledge-first, with diagnosis and recovery for common blockers.
---

# Paco Ticket Replay

## Scope

Autonomous batch replay of Jira Done tickets into the Paco QA knowledge base. Knowledge discovery is **mandatory** before any browser work. Diagnosis and recovery are normal, not exceptional. Never scan, crawl, or auto-select tickets outside a configured batch run.

## Core principle

**Search existing knowledge → understand the workflow → replay → diagnose → recover → verify → update documentation.**

Do not merely generate reports describing what could not be tested. Make reasonable, safe attempts to complete the testing workflow before declaring a blocker.

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
| Feature-map | `docs/product/feature-map.md`: route/flow entry updated for new flows |
| Auth helper | `scripts/paco-auth-helper.ts`: `CHECK_AUTH_SCRIPT`, `buildFullLoginScript()` |

## Dependencies

Read `paco.config.yaml`, `scripts/mutation-gate.ts`, `scripts/mutation-ledger.ts`, `scripts/discovery-state.ts`, `scripts/child-outcome.ts`, `scripts/load-config.ts`, `scripts/paco-auth-helper.ts`, workflow/evidence/traceability standards and `docs/templates/*.md`. Require valid auth in the current Claude Playwright plugin tab. Never request credentials or read browser auth state.

## Output paths

| Artifact | Path |
|---|---|
| Replay checkpoint | `docs/paco/replay/<batch-id>.replay.yaml` |
| Per-ticket replay record | `docs/paco/tickets/<ticket-key>/replay.md` |
| Flow documentation | `docs/paco/flows/<flow-slug>.md` |
| Knowledge index | `docs/paco/index/flows.md`, `docs/paco/index/tickets.md` |
| Feature map | `docs/product/feature-map.md` (updated for new flows only) |

## Result classification

Use consistently:

- `PASS`: Expected behaviour verified with sufficient execution evidence.
- `FAIL`: Actual behaviour contradicts a clear expected result under valid test conditions.
- `BLOCKED`: The scenario cannot proceed after reasonable recovery attempts.
- `PARTIAL`: Some steps were executed, but the complete scenario remains unverified.
- `NOT_REPRODUCIBLE`: A previously reported issue could not be reproduced under documented conditions.
- `ENVIRONMENT_ISSUE`: A confirmed environment or test-data problem prevents reliable product verification.

Distinguish:
- `PARTIAL` + `ENVIRONMENT_ISSUE`: test data stale or appointments expired → attempt recovery before declaring blocked.
- `PARTIAL` + unknown root cause → attempt diagnosis (see Section 7) before reporting BLOCKED.
- `PARTIAL` + no recovery possible → report `ENVIRONMENT_ISSUE` or `BLOCKED` with specific evidence.

Never mark `PASS` merely because prerequisites selected successfully or no error observed.

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

### 3. Mandatory knowledge discovery — before any browser work

**Do not skip this phase.** Knowledge discovery is required for every ticket, including tickets already in `docs/paco/tickets/` that returned `PARTIAL` or `BLOCKED`.

#### 3a. Search project documentation

Search for relevant information in:
- `CLAUDE.md` and applicable project instructions
- `docs/product/feature-map.md` and `docs/product/workflows/`
- `docs/paco/flows/` — existing deduplicated flows
- `docs/paco/tickets/<key>/` — existing replay, requirements, scenarios
- `docs/paco/index/flows.md` and `docs/paco/index/tickets.md`
- Previously documented user journeys, test scenarios, regression flows
- Automated tests, fixtures, test data utilities and configuration

Search terms:
- Ticket ID and linked ticket IDs
- Feature and module names
- UI labels, buttons, dropdown names
- Domain entities and relationships
- API endpoints, error messages, component names
- Previously documented symptoms and root causes

#### 3b. Search historical Jira knowledge

- Target ticket's description and acceptance criteria
- Comments, attachments, linked issues
- Related Done tickets involving the same feature or workflow
- Previous bugs, fixes, regression findings and follow-up tickets
- Historical explanations of prerequisites, permissions, test data, environment setup
- Previous replay results and recovery procedures

#### 3c. Inspect implementation and test infrastructure

When source access available:
- Frontend components and application state
- API clients, endpoints, request/response handling
- Automated tests, fixtures, seed data
- Configuration, permissions, feature flags
- Git history where useful

#### 3d. Build execution plan

Before interacting with browser, determine:
1. What is already documented and previously verified
2. Which existing flows and test utilities can be reused
3. Which prerequisites, roles, data, environment are required
4. Which behaviour remains unknown or potentially stale
5. Which observations distinguish between plausible root causes
6. Which recovery actions are safe and likely to help
7. What evidence is required to establish the final result

Keep plan concise and actionable. Avoid lengthy preliminary reports that do not improve execution.

#### 3e. Reuse without blind trust

- Reuse documented flows when prerequisites match current environment
- Validate critical assumptions before relying on historical results
- Do not repeat successful discovery unnecessarily
- If current behaviour contradicts existing documentation, investigate discrepancy
- If knowledge is missing, incomplete or outdated, discover missing parts through UI, DOM, browser state, network/API responses, source code
- Never claim to have inspected a source that was inaccessible or never actually read

### 4. Flow matching

For each ticket:
1. Check `docs/product/workflows/` for equivalent existing flows
2. Check `docs/paco/flows/` for deduplicated scenarios
3. Score by: module match, role match, step similarity, expected outcome
4. If match found (score > threshold): **link to existing flow, record deduplication, do NOT create new flow doc**
5. If no match: queue for Playwright replay

**Deduplication gate — this is mandatory, not optional:**
When a new ticket's scenario overlaps an existing flow, you MUST:
- Append ticket key to the existing flow's `Tickets` line
- Add a `Source` line citing the ticket
- Write `replay.md` citing the existing flow doc
- Update `docs/paco/index/flows.md` to link the ticket to the existing flow
- STOP here — do not proceed to Scenario reconstruction or Playwright replay for this scenario

Do not create a new flow doc for a scenario that already exists.

### 5. Requirement extraction

For each queued (unmatched) ticket:
1. Read `ticket/<key>-*/ticket.md` if exists; otherwise use Jira description
2. Extract via `paco-requirements` pattern:
   - Functional requirements as atomic IDs
   - Affected PACO modules (from components, labels, description keywords)
   - User roles (from description, comments)
   - Setup requirements (preconditions, test data categories)
   - Expected behaviour (from acceptance criteria, description)
   - Test scenarios (from comments, linked issues, attachments)
3. Write `docs/paco/tickets/<key>/requirements.md` using `docs/templates/requirements.md`

### 6. Scenario reconstruction

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

### 7. Autonomy diagnosis and recovery

**Do not stop at the first failed click, empty result or missing record.** Do not endlessly retry the same action without a new hypothesis or recovery step.

#### A. Missing or invisible appointment records (height: 0%, zero dimensions)

Symptoms: summary counts report existing appointments but UI elements have zero height or are off-screen.

**Diagnosis:**
1. Inspect DOM dimensions, visibility, layout, relevant frontend state and console errors
2. Inspect available network/API responses and returned record identifiers
3. Compare summary counts, returned records, rendered elements
4. Verify date ranges, timezone conversion, filters, record statuses, relationships
5. Check whether existing documentation describes a known issue or established workaround

**Recovery — attempt in order:**
1. Navigate to a different date range (Day/Week view change)
2. Switch view modes (Day/Week/Month) to reset layout
3. Filter to reduce visible records and see if any become interactable
4. Attempt to create fresh test data via Quick Book if auth+mutation permits

**Escalation:** If recovery exhausted and appointment data genuinely stale (expired/cancelled), classify as `ENVIRONMENT_ISSUE` with evidence from DOM/network. Do not report as product `FAIL`.

#### B. Calendar picker navigation fails (clicking date cells doesn't navigate)

Symptoms: clicking a date cell does not change displayed date; date picker popup doesn't trigger navigation.

**Diagnosis:**
1. Inspect current selected date, visible month, view mode
2. Check event handling, application state, navigation requests
3. Try alternative supported navigation path (keyboard, prev/next arrows)
4. Verify whether Day/Week view switch resets selected date

**Recovery:**
1. Use Previous/Next arrows to navigate months instead of picker
2. Use keyboard navigation (arrow keys, Enter)
3. Compare behaviour with known working flows (e.g. PAC2-8575, PAC2-6997)
4. Navigate to target date via a known working entry path

**Escalation:** If navigation is consistently broken across all methods, classify as `BLOCKED: Calendar navigation non-functional` with evidence. Distinguish from ephemeral date-picker bug vs. fundamental navigation failure.

#### C. Quick Book cannot find time slots (selection succeeds, no slots appear)

Symptoms: patient selection succeeds, session template narrowing works, location auto-fills, but time options never appear.

**Diagnosis:**
1. Inspect slot-search API request and response
2. Validate date, timezone, session configuration, location, scheduling constraints
3. Determine whether no eligible slots genuinely exist, or request/configuration problem, or frontend rendering failure
4. Reuse documented working combinations of session, location, date

**Recovery:**
1. Try another valid date or session template
2. Try a different location
3. Attempt Quick Book with a different patient
4. Check whether session templates need configuration (PACO Configuration → Sessions)

**Escalation:** If slot search consistently returns empty for all valid configurations, classify as `ENVIRONMENT_ISSUE` (no available slots) or `BLOCKED: Quick Book slot search broken` with API evidence. Do not report as product `FAIL` unless configuration is correct and slots should exist.

#### D. General recovery policy

For other failure types:
1. Identify the failed step and expected result
2. Search existing knowledge for similar failures
3. Form a testable hypothesis
4. Gather minimum useful evidence
5. Try an appropriate safe recovery action
6. Revalidate the result
7. Stop when recovery is exhausted or further attempts would be unsafe or unproductive

**Do not hardcode recovery logic.** Apply the same diagnostic principles dynamically.

### 8. Playwright replay

For each reconstructed scenario:
1. **Auth check:** Run `CHECK_AUTH_SCRIPT` from `scripts/paco-auth-helper.ts` via `browser_evaluate`. If `authenticated: false`, call `buildFullLoginScript()` and retry. Report `Blocked: Authentication failed` if still unauthenticated.
2. **Mutation gate:** Call `evaluateMutationGate()` before any mutation
3. **Execute steps** using Playwright MCP:
   - Navigate to entry point
   - Execute interaction sequence with observable waits
   - Assert observable outcomes
   - Record actual vs expected
4. **Compare** observed behaviour with documented expectations
5. **Classify result:** `Verified` / `Failed` / `Blocked` / `Partially replayed` / `Not reproducible`
6. **Diagnose and recover** per Section 7 before escalating to BLOCKED
7. **Write evidence** to `docs/paco/tickets/<key>/evidence/<scenario-id>/`
8. **Update mutation ledger**

### 9. Documentation

For each processed ticket:
1. Write `docs/paco/tickets/<key>/replay.md`:
   - Prerequisites (auth, role, test data)
   - Steps (numbered, observable)
   - Expected result (from requirements)
   - Actual result (from replay)
   - Evidence references
   - Jira link
   - Environment (host, branch/build if known)
   - Execution timestamp
   - Result classification
   - Recovery attempts and outcomes
   - Confirmed root causes and remaining hypotheses
   - Outstanding blockers and next actions
2. Update `docs/paco/index/tickets.md` with ticket row
3. Update `docs/paco/index/flows.md` with flow links

### 9b. Feature-map update (for new flows only)

When Step 9 creates a new `docs/paco/flows/<flow-slug>.md`, also append an entry to `docs/product/feature-map.md`:

1. Read the new flow file to extract: `Flow Slug`, `Aliases`, `Classification`, `Entry`, `Route`, `Role`, `Environment`, `Source` (ticket key), `Last verified`, `Tickets`, `Defect đã biết`.
2. Determine which module section to append under.
3. Find the last route/entry within that module section and insert the new entry after it.
4. If a new module section is needed, insert it in appropriate position within the module.

**Entry pattern:**
```
#### [Feature name] ([ticket key])
- Coverage: Minimal
- Entry: [URL]
- Route: [route pattern]
- Role observed: [role]
- Environment: dev
- Classification: [Observed/Confirmed]
- Source: [ticket key] (replay.md)
- Last verified: [ISO timestamp]
- Aliases: [from flow]
- Tickets: [ticket key]
- Note: [1-line summary]
- Logic chính:
  - [bullet points, max 2-3]
- Defect đã biết:
  - [ticket key] [result]: [summary]
- Chi tiết: flows/[flow-slug].md
```

### 10. Batch finalize

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
- **Resuming PARTIAL/BLOCKED tickets:** Re-run knowledge discovery (Section 3) before replay. Prior recovery attempts may have resolved the blocker. Check whether test data has changed.

## Environment strategy

- **Always replay on `blinx.dev.blinxpaco-np.com` (dev chung).** Feature-branch hosts are out of scope for replay.
- Jira comments mentioning feature-branch hosts (e.g. "PASSED QA on FB <url>") are historical context only — they describe where original QA was done, not where replay must run.
- Use `blinx.dev.blinxpaco-np.com` for all replay, regardless of which host the ticket was originally QA'd on.
- Record actual host (`blinx.dev.blinxpaco-np.com`), execution timestamp and user role in replay.md.
- If a feature's behaviour depends on code not yet merged to dev chung, report as `ENVIRONMENT_ISSUE: feature not available on dev chung`.

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
- Never invent hostnames, credentials, permissions or successful setup results

## PAC2-7127 pilot notes

PAC2-7127 is a **pilot acceptance test**, not embedded skill logic. Keep findings as ticket data:

- PAC2-7127 returned `PARTIAL` because: (1) booked appointments off-screen/zero-height, (2) calendar navigation non-functional, (3) Quick Book incomplete, (4) test data stale, (5) date-picker state loss
- The three diagnosis/recovery patterns in Section 7 were derived from these blockers
- PAC2-7127 knowledge applies to other tickets only when genuinely the same failure mode
- Do not hardcode PAC2-7127-specific logic, ticket IDs, dates, hosts or recovery procedures into the generic replay workflow

## Direct invocation, stop, outcome

Run `npm run paco:replay -- <command>` for CLI commands. Skill handles ticket-level replay within a batch. Never call other skills directly; delegate through CLI orchestration.

Return batch summary: processed, verified, failed, blocked, skipped, not_reproducible, new_flows, deduplicated, blockers, warnings.
