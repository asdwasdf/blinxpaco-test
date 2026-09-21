---
name: paco-explore
description: Use when locating or observing selected Paco scope, or surveying Paco product areas, through authorized read-only browser work.
---

# Paco Explore

## Scope and dependencies

Require explicit mode `locate` (`LOCATE`), `observe` (`EXPLORE`) or `survey` (`SURVEY`), environment, valid auth in the current Claude Playwright plugin browser tab and role. `locate` and `observe` also require selected ticket and valid requirements; `survey` does not. Read feature-location/product-survey/data-safety/evidence/knowledge standards and `scripts/manual-login.md`. Dùng Claude Playwright plugin-first. If auth is missing or expired, navigate the current plugin tab to `/paco/login`, return `Blocked: Authentication expired`, and ask the tester to complete login/SSO/MFA manually in that tab. After the tester reports completion, verify the tab reached `/paco/dashboard` or another authenticated Paco page before resuming. Never request credentials or read, copy, persist, or report cookies, tokens, headers, or browser auth state. Không probe private APIs, infer intent, design suites hoặc orchestrate phases.

## Ownership

Mode `locate` writes only `feature-location.md`; mode `observe` writes only `exploration.md`; mode `survey` writes `docs/product/paco-overview.md` plus selected `docs/product/workflows/<feature>.md` files using `docs/templates/workflow.md`. Preserve final `## Tester notes` in every managed file. Raw locate evidence stays under `test-results/<ticket-key>/locate/<run-id>/`; raw survey evidence stays under `test-results/product-survey/<run-id>/`; only reviewed/redacted evidence enters docs.

## Mode `locate`

1. Require `environment`, `role`, auth and read-only mode. Ask optional module/page/context/menu clues; “không biết” is not blocker and tester clues remain tester-provided.
2. Read exact terms, aliases, actor/context and trigger/target nouns from requirements. Check `feature-map.md`, then matching files under `docs/product/workflows/`; treat survey workflow routes/context only as search hints and validate a reusable route in 1–3 meaningful views.
3. If hinted route is missing/stale/mismatched, scan from dashboard through global navigation, page search, visible menu, authorized contextual menu and read-only detail. Stop at verified route, 12 meaningful views or 15 minutes.
4. Count only new useful page/module/menu/dialog/drawer/search-result states. Retry, reload and same-state screenshot do not count.
5. Allow navigate/view/search/filter/sort/paginate and known read-only detail/menu/dialog. Stop before mutation, send/upload/import, adding an item to a draft/template or unknown persistence.
6. Record ordered entry path, context, landmarks, up to three useful candidates, rejected paths with dependency revision, budget and exact next action. Do not assert business behavior.
7. Capture only useful milestones: module/context landmark, entry control/menu and opened feature root. Never put unredacted PII/auth data in docs.

## Mode `observe`

1. Start only from valid feature location or documented non-UI exception; use matching product workflow only as context and re-verify current state.
2. Record environment, role, scope and timestamp.
3. Observe behavior using read-only actions; stop at mutation/unknown action.
4. Separate `Observed` behavior from intent; record unperformed actions, mismatch, possible defect and suggested coverage.

## Mode `survey`

1. Require `environment`, role và auth; ticket and requirements are optional and must not bound product discovery. Crawl current role only; role switch is manual và uses separate checkpoint.
2. Start from dashboard and resume `survey-checkpoint.yaml`. Traverse breadth-first using fingerprint `role + normalized URL + page heading + dialog/tab state`. View/action ceiling chống runaway; đạt ceiling thì checkpoint/resume, không kết luận coverage đủ.
3. For each selected feature record visible business purpose, actor/role, required context, starting data state, entities/statuses, ordered read-only actions, state transitions, decision branches, end/error/empty/loading states, cross-feature handoffs and exact mutation boundary. Do not infer intent from labels alone.
4. Count only a new state that adds workflow knowledge: page/module/menu/dialog/drawer/search-result, a changed filter/sort/page state, or a read-only detail transition. Retry, reload and same-state screenshot do not count.
5. Full mutation, upload/import/download và relevant external dev flow được phép khi hostname-aware `evaluateMutationGate()` pass. Ghi mutation ledger đã redact; không lặp cùng mutation fingerprint. Production/unknown host luôn bị chặn. Thiếu domain rule/test recipient/test data thì Ask QA early, không đoán.
6. Ghi structured view vào `docs/product/survey/views/`, role coverage/checkpoint vào `docs/product/survey/roles/`, rồi chạy `npm run graph:generate`. Keep `docs/product/paco-overview.md` concise và reusable narrative trong `docs/product/workflows/<feature>.md`. Raw evidence ở `test-results/product-survey/<run-id>/`; chỉ reviewed/redacted evidence vào docs.
7. Include two reusable guidance blocks: `Execution guidance` with manual setup, safe steps, approval stop and evidence to capture; `Automation guidance` with stable labels/landmarks, waits, data dependency and assertions that lack a trusted basis.
8. Classify every claim as `Observed`, `Inferred` or `Open Question`; observation never becomes `Confirmed` without a trusted source. Survey knowledge may guide location, setup, data choice, risk and coverage, but must not create ticket requirements or expected results.
9. Preserve final `## Tester notes`; stop and report conflict rather than overwrite protected content.

## Outcome

Return `ChildSkillOutcome` v1; `LOCATE` also returns location mode, route status, budget and next action with mutation `None`; `SURVEY` returns meaningful-state count, elapsed budget, workflow files created/updated, understood flows, gaps, confidence, coverage and exact resume checkpoint with mutation `None`. Missing auth/role/permission/context or mutation boundary is `Blocked`; exhausted `LOCATE` budget with useful candidates is `Inconclusive`; reaching the `SURVEY` bound is a successful checkpoint, not permission to continue; browser/write fault is `Failed`. Direct invocation never updates manifest/status or calls next skill.
