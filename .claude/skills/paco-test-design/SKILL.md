---
name: paco-test-design
description: Use when creating risk-based Paco test cases from valid versioned requirements and optional exploration.
---

# Paco Test Design

## Scope and dependencies
`TEST_DESIGN` only. Require selected ticket, revision, valid `requirements.md`; exploration is optional. For each UI-dependent case require valid `feature-location.md` or keep the case preliminary and blocked for automation. Read feature-location/traceability/data-safety standards and `docs/templates/test-cases.md`. Do not execute, browse, write Playwright, or orchestrate phases.

## Ownership
Write only `test-cases.md`; preserve final `## Tester notes`.

## Workflow
1. Map stable case IDs to requirement IDs and expected-result basis.
2. Assign relevant coverage, `Critical`/`High`/`Medium`/`Low` risk, and suggested priority.
3. Record environment, role, preconditions, test data, steps, observable expected results, postconditions, and cleanup. For UI-dependent cases, optionally use matching `docs/product/workflows/*.md` for setup, data-state, route, safe-step, branch-coverage and mutation-boundary hints; keep expected results tied to requirement basis, never survey observation.
4. Classify mutation `None`, `Temporary`, `Persistent`, `Destructive`, or `Unknown`; trên configured dev host, non-`None` chạy trong approved scope với hostname guard và mutation ledger. Production luôn bị chặn.
5. For UI-dependent cases record location status, ordered entry path, required context, environment, role, test-data category, mutation class and expected-result basis.
6. Missing/stale/non-`Confirmed` location keeps the case `Preliminary` and automation `Blocked`; never add a guessed locator.
7. Mark preliminary automation candidate; unknown rule becomes open question, never fabricated expected result. Ask QA early với blocker, observation, evidence/timestamp, concrete choices và affected cases.
8. If exploration is absent, mark maturity `Preliminary`.

## Direct invocation, stop, outcome
Write only owned artifact and return proposal; never update manifest/status or call next skill. Invalid/stale requirements are `Blocked`; merge/write error is `Failed`. Preserve IDs/history and avoid irrelevant cases. Return `ChildSkillOutcome` v1 with counts, checksum, mutation summary, blockers/warnings, and next phase.
