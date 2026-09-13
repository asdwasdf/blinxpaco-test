---
name: paco-playwright
description: Use when assessing, implementing, or executing explicitly selected Paco Playwright cases within safety scope.
---

# Paco Playwright

## Scope and dependencies
Only `AUTOMATION_REVIEW`, `AUTOMATE`, or `EXECUTE`. Require selected valid case, clear expected basis, environment, valid local browser-auth state, role when relevant, and exact mutation approval. For every UI-dependent case, call `evaluateUiLocationGate()` before assessment or code; require valid `feature-location.md`, `Confirmed` entry path, context and test-data category. Read feature-location/data-safety/evidence standards, `docs/templates/automation.md`, and `scripts/manual-login.md`. If auth state is missing or expired, direct tester to `npm run auth:login`; never request or use credentials. Do not automate unassessed cases, infer correctness from `Inferred` knowledge, auto-fill login credentials, or broaden scope.

## Ownership
Own `automation.md` and selected Playwright source; raw output stays in `test-results/`. Preserve final `## Tester notes`.

## Workflow
1. Decide each case `Yes`, `Later`, `No`, or `Blocked` with reason.
2. Prefer Chromium read-only smoke, role locators, observable waits, and sourced assertions. No fixed sleep/private API bypass.
3. Use local ignored storage state without reading it into prompt/docs. Missing or login redirect is `Blocked: Authentication expired`, not product failure.
4. Mutation requires exact approval plus `PACO_ALLOW_MUTATION=true`; destructive also requires `PACO_ALLOW_DESTRUCTIVE=true`.
5. If route is verified but locators are insufficient, use a separate read-only scoped probe with budget and delete-or-promote decision. Keep it outside default smoke, without business assertions or fixed waits; wait for observable dialog/listbox/spinner/landmark.
6. Record `Pass`/`Fail`/`Blocked`/`Not Run`/`Inconclusive`, evidence, mutation, cleanup, leftovers, and redaction. Only clear expected result plus met precondition may `Fail`.

## Direct invocation, stop, outcome
Write owned artifact/source and return proposal; never update manifest/status or call next skill. Stale dependency/auth/approval is `Blocked`; runner fault is `Failed`. Return `ChildSkillOutcome` v1 with checksums, counts, mutation/cleanup, sensitive-data status, blockers/warnings, and next phase.
