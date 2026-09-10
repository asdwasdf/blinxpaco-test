---
name: paco-test-design
description: Use when creating risk-based Paco test cases from valid versioned requirements and optional exploration.
---

# Paco Test Design

## Scope and dependencies
`TEST_DESIGN` only. Require selected ticket, revision, valid `requirements.md`; exploration is optional. Read traceability/data-safety standards and `docs/templates/test-cases.md`. Do not execute, browse, write Playwright, or orchestrate phases.

## Ownership
Write only `test-cases.md`; preserve final `## Tester notes`.

## Workflow
1. Map stable case IDs to requirement IDs and expected-result basis.
2. Assign relevant coverage, `Critical`/`High`/`Medium`/`Low` risk, and suggested priority.
3. Record environment, role, preconditions, test data, steps, observable expected results, postconditions, and cleanup.
4. Classify mutation `None`, `Temporary`, `Persistent`, `Destructive`, or `Unknown`; non-`None` requires approval.
5. Mark preliminary automation candidate; unknown rule becomes open question, never fabricated expected result.
6. If exploration is absent, mark maturity `Preliminary`.

## Direct invocation, stop, outcome
Write only owned artifact and return proposal; never update manifest/status or call next skill. Invalid/stale requirements are `Blocked`; merge/write error is `Failed`. Preserve IDs/history and avoid irrelevant cases. Return `ChildSkillOutcome` v1 with counts, checksum, mutation summary, blockers/warnings, and next phase.
