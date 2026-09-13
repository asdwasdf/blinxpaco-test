---
name: paco-explore
description: Use when locating or observing selected Paco scope through authorized read-only browser work.
---

# Paco Explore

## Scope and dependencies

Require explicit mode `locate` (`LOCATE`) or `observe` (`EXPLORE`), selected ticket, valid requirements, environment, valid local browser auth and role. Read feature-location/data-safety/evidence/knowledge standards and `scripts/manual-login.md`. If auth is missing/expired, return `Blocked: Authentication expired` with `npm run auth:login`; never request credentials. Do not crawl, mutate, probe private APIs, infer intent, design suites or orchestrate phases.

## Ownership

Mode `locate` writes only `feature-location.md`; mode `observe` writes only `exploration.md`. Preserve final `## Tester notes`. Raw locate evidence stays under `test-results/<ticket-key>/locate/<run-id>/`; only reviewed/redacted evidence enters docs.

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

## Outcome

Return `ChildSkillOutcome` v1; `LOCATE` also returns location mode, route status, budget and next action with mutation `None`. Missing auth/role/permission/context or mutation boundary is `Blocked`; exhausted budget with useful candidates is `Inconclusive`; browser/write fault is `Failed`. Direct invocation never updates manifest/status or calls next skill.
