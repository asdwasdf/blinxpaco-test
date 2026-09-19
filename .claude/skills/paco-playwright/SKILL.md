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
1. **Plugin-first:** dùng Claude Playwright plugin để explore và execute observable test trước khi viết code. Quyết định mỗi case `Worth automating`, `Not worth automating`, `Later`, hoặc `Blocked` với lý do.
2. Chỉ tạo `.spec.ts` nhỏ khi regression quan trọng, expected result dựa trên `Confirmed`/`Observed`, flow/locator ổn định và chạy lại có giá trị. Không automate để khám phá expected behavior.
3. Prefer Chromium, role locators, observable waits, and sourced assertions. No fixed sleep/private API bypass.
4. Use local ignored storage state without reading it into prompt/docs. Missing or login redirect is `Blocked: Authentication expired`, not product failure.
5. Trên dev, mutation đầy đủ phải gọi hostname-aware `evaluateMutationGate()` với `paco.config.yaml`, exact approval và runtime guards. Production/unknown host luôn bị chặn; mọi mutation ghi ledger đã redact.
6. Nếu thiếu domain rule, test recipient, test data hoặc expected result, **Ask QA early** với blocker, observation, evidence/timestamp, decision, concrete choices và affected cases; không đoán hoặc viết automation để né blocker.
7. Record `Pass`/`Fail`/`Blocked`/`Not Run`/`Inconclusive`, durable evidence, mutation, cleanup, leftovers, and redaction. Raw output ở `test-results/`; evidence dùng sau `REPORT` phải promote vào `docs/tickets/<ticket-folder>/evidence/`. Only clear expected result plus met precondition may `Fail`.

## Direct invocation, stop, outcome
Write owned artifact/source and return proposal; never update manifest/status or call next skill. Stale dependency/auth/approval is `Blocked`; runner fault is `Failed`. Return `ChildSkillOutcome` v1 with checksums, counts, mutation/cleanup, sensitive-data status, blockers/warnings, and next phase.
