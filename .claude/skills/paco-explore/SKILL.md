---
name: paco-explore
description: Use when locating or observing selected Paco scope, or surveying Paco product areas, through authorized read-only browser work.
---

# Paco Explore

## Scope and dependencies

Require explicit mode `locate` (`LOCATE`), `observe` (`EXPLORE`) or `survey` (`SURVEY`), environment, valid local browser auth and role. `locate` and `observe` also require selected ticket and valid requirements; `survey` does not. Read feature-location/data-safety/evidence/knowledge standards and `scripts/manual-login.md`. If auth is missing/expired, return `Blocked: Authentication expired` with `npm run auth:login`; never request credentials. Do not crawl without the mode's bound, mutate, probe private APIs, infer intent, design suites or orchestrate phases.

## Ownership

Mode `locate` writes only `feature-location.md`; mode `observe` writes only `exploration.md`; mode `survey` writes only `docs/product/paco-overview.md`. Preserve final `## Tester notes`. Raw locate evidence stays under `test-results/<ticket-key>/locate/<run-id>/`; raw survey evidence stays under `test-results/product-survey/<run-id>/`; only reviewed/redacted evidence enters docs.

## Mode `locate`

1. Require `environment`, `role`, auth and read-only mode. Ask optional module/page/context/menu clues; “không biết” is not blocker and tester clues remain tester-provided.
2. Read exact terms, aliases, actor/context and trigger/target nouns from requirements. Check `feature-map.md`; validate reusable route in 1–3 meaningful views.
3. If route is missing/stale/mismatched, scan from dashboard through global navigation, page search, visible menu, authorized contextual menu and read-only detail. Stop at verified route, 12 meaningful views or 15 minutes.
4. Count only new useful page/module/menu/dialog/drawer/search-result states. Retry, reload and same-state screenshot do not count.
5. Allow navigate/view/search/filter/sort/paginate and known read-only detail/menu/dialog. Stop before mutation, send/upload/import, adding an item to a draft/template or unknown persistence.
6. Record ordered entry path, context, landmarks, up to three useful candidates, rejected paths with dependency revision, budget and exact next action. Do not assert business behavior.
7. Capture only useful milestones: module/context landmark, entry control/menu and opened feature root. Never put unredacted PII/auth data in docs.

## Mode `observe`

1. Start only from valid feature location or documented non-UI exception.
2. Record environment, role, scope and timestamp.
3. Observe behavior using read-only actions; stop at mutation/unknown action.
4. Separate `Observed` behavior from intent; record unperformed actions, mismatch, possible defect and suggested coverage.

## Mode `survey`

1. Require `environment`, role, auth and read-only mode; ticket and requirements are optional and must not bound product discovery.
2. Start from dashboard. Visit global navigation, visible modules and known read-only detail/menu/dialog states. Stop at 12 meaningful views or 15 minutes per run; resume from the last recorded checkpoint rather than restart or crawl without a bound.
3. Count only new useful page/module/menu/dialog/drawer/search-result states. Retry, reload and same-state screenshot do not count.
4. Allow navigate/view/search/filter/sort/paginate and known read-only detail/menu/dialog. Stop before mutation, send/upload/import, draft/template changes or unknown persistence. Do not probe private APIs.
5. Write only redacted reusable product knowledge to `docs/product/paco-overview.md`: environment, role, timestamp, visited area, ordered navigation path, visible purpose/landmarks, coverage and exact resume checkpoint. Keep raw evidence under `test-results/product-survey/<run-id>/`.
6. Classify every claim as `Observed`, `Inferred` or `Open Question`; observation never becomes `Confirmed` without a trusted source. Do not turn observed behavior into ticket requirements.
7. Preserve final `## Tester notes`; stop and report conflict rather than overwrite protected content.

## Outcome

Return `ChildSkillOutcome` v1; `LOCATE` also returns location mode, route status, budget and next action with mutation `None`; `SURVEY` returns visited-view count, elapsed budget, coverage and resume checkpoint with mutation `None`. Missing auth/role/permission/context or mutation boundary is `Blocked`; exhausted `LOCATE` budget with useful candidates is `Inconclusive`; reaching the `SURVEY` bound is a successful checkpoint, not permission to continue; browser/write fault is `Failed`. Direct invocation never updates manifest/status or calls next skill.
