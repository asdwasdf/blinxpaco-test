---
name: paco-explore
description: Use when locating or observing selected Paco scope, or surveying one assigned Paco discovery task, through read-only browser work.
---

# Paco Explore

## Scope and dependencies

Require explicit mode `locate` (`LOCATE`), `observe` (`EXPLORE`) or `survey` (`SURVEY`), environment, valid auth in the current Claude Playwright plugin browser tab and role. `locate` and `observe` also require selected ticket and valid requirements; `survey` does not. Read feature-location/product-survey/data-safety/evidence/knowledge standards and `scripts/manual-login.md`. Dùng Claude Playwright plugin-first. If auth is missing or expired, navigate the current plugin tab to `/paco/login`, return `Blocked: Authentication expired`, and ask the tester to complete login/SSO/MFA manually in that tab. After the tester reports completion, verify the tab reached `/paco/dashboard` or another authenticated Paco page before resuming. Never request credentials or read, copy, persist, or report cookies, tokens, headers, or browser auth state. Không probe private APIs, infer intent, design suites hoặc orchestrate phases.

## Ownership

Mode `locate` writes `feature-location.md` plus its feature entry route fields in `docs/product/feature-map.md`; mode `observe` writes `exploration.md` plus the ticket knowledge sync (`docs/product/feature-map.md` entry + `Ticket → feature` row, `docs/product/workflows/<module>.md` section `## Logic từ ticket`, `docs/product/open-questions.md`, `docs/product/change-log.md`); mode `survey` writes `docs/product/paco-overview.md`, selected `docs/product/workflows/<feature>.md` files using `docs/templates/workflow.md` and `docs/product/survey/views/*.md`; never discovery checkpoint, ledger or ticket files. Preserve final `## Tester notes` in every managed file. Raw locate evidence stays under `test-results/<ticket-key>/locate/<run-id>/`; raw survey evidence stays under `test-results/product-survey/<run-id>/`; only reviewed/redacted evidence enters docs.

## Mode `locate`

1. Require `environment`, `role`, auth and read-only mode. Ask optional module/page/context/menu clues; “không biết” is not blocker and tester clues remain tester-provided.
2. Read exact terms, aliases, actor/context and trigger/target nouns from requirements. Check `feature-map.md`, then matching files under `docs/product/workflows/`; treat survey workflow routes/context only as search hints and validate a reusable route in 1–3 meaningful views.
3. If hinted route is missing/stale/mismatched, scan from dashboard through global navigation, page search, visible menu, authorized contextual menu and read-only detail. Stop at verified route, 12 meaningful views or 15 minutes.
4. Count only new useful page/module/menu/dialog/drawer/search-result states. Retry, reload and same-state screenshot do not count.
5. Allow navigate/view/search/filter/sort/paginate and known read-only detail/menu/dialog. Stop before mutation, send/upload/import, adding an item to a draft/template or unknown persistence.
6. Record ordered entry path, context, landmarks, up to three useful candidates, rejected paths with dependency revision, budget and exact next action. Do not assert business behavior.
7. Keep browser output compact: full `browser_snapshot` once per new state; do not re-snapshot an unchanged known state; `browser_evaluate`/`browser_run_code` return only the values needed (labels, counts, status, error text), never full DOM/HTML. Exploration may still snapshot fully whenever a state is new or unexpected, so unknown behavior is not missed.
8. Capture only useful milestones: module/context landmark, entry control/menu and opened feature root. Never put unredacted PII/auth data in docs.
9. **Route sync:** once route status is `Confirmed`, add/update the feature entry in `docs/product/feature-map.md` (ordered `Entry`, `Route`, role, environment, `Classification: Observed`, `Last verified`, source `PAC2-xxxx/feature-location.md`) using allowlisted fields only. Unverified candidates go to `Route hints (chưa verified)`. Return synced file + checksum in outcome.

## Mode `observe`

1. Start only from valid feature location or documented non-UI exception; use matching product workflow only as context and re-verify current state.
2. Record environment, role, scope and timestamp.
3. Observe behavior using read-only actions; stop at mutation/unknown action.
4. Separate `Observed` behavior from intent; record unperformed actions, mismatch, possible defect and suggested coverage.
5. **Ticket knowledge sync (mandatory before `MANUAL_EXECUTE`, also when `EXPLORE` ends `Blocked`/`Inconclusive`):** merge requirements-derived logic (keep `Confirmed`/`Inferred` from `requirements.md`) and observed behavior into `docs/product/workflows/<module>.md` under `## Logic từ ticket` (flow steps, business rules, states, role/permission, possible defects, open questions; every bullet keeps classification tag + `PAC2-xxxx/<file>` provenance; create the module file and index it in `workflows/README.md` if none fits). In `docs/product/feature-map.md` update `Logic chính` (2–4 rules), `Chi tiết:` link and the `Ticket → feature` row (status = current phase). Append unresolved questions to `open-questions.md` and a dated `change-log.md` line. Dedupe; on conflict keep both with provenance; never upgrade to `Confirmed`; no PII/test data/fragile locators; preserve `## Tester notes`. Unsafe merge is a blocker, never a silent skip. List synced files + checksums in the outcome.

## Mode `survey`

1. Require `environment`, role, auth và đúng một task do `paco-discover` giao (`run_id`, `task_id`, checkpoint `revision`). Ticket/requirements không bound discovery. Crawl current role only; role switch is manual và uses separate checkpoint. Gọi trực tiếp không có task thì chỉ quan sát read-only và trả proposal; không bắt đầu vòng lặp, không sửa checkpoint.
2. Quan sát task được giao rồi các state lân cận trong budget nhỏ. Mô tả state bằng `DiscoveryStateDescriptor`: role, URL, heading/module, tab, dialog/drawer, entity/context type và data-state variant; khai báo `meaningful_query`/`volatile_segments` chỉ khi đã quan sát chúng đổi workflow. Query/segment không phân loại được thì ghi gap, không đoán. Planner/checkpoint thuộc parent; đạt ceiling không kết luận coverage đủ.
3. For each selected feature record visible business purpose, actor/role, required context, starting data state, entities/statuses, ordered read-only actions, state transitions, decision branches, end/error/empty/loading states, cross-feature handoffs and exact mutation boundary. Do not infer intent from labels alone.
4. Count only a new state that adds workflow knowledge: page/module/menu/dialog/drawer/search-result, a changed filter/sort/page state, or a read-only detail transition. Retry, reload and same-state screenshot do not count.
5. `survey` strictly read-only: không mutation, upload, import, send hoặc action chưa rõ persistence. Gặp action như vậy thì dừng trước nó và trả mutation candidate (class `CREATE`/`UPDATE`/`SEND`/`DELETE`/`EXTERNAL_SIDE_EFFECT`, persistence, lý do cần thiết, evidence, required test data/recipient, `destination_hint` chỉ là giả thuyết). Relationship tại boundary có `mutation_boundary: true` và không có `to`. Mutation chỉ do `paco-verify-flow` thực hiện sau khi parent reserve. Thiếu domain rule/test recipient/test data thì Ask QA early, không đoán.
6. Ghi structured view vào `docs/product/survey/views/` (thêm `relationships` có provenance khi có). Checkpoint `docs/product/survey/roles/*.discovery.yaml` và graph regenerate thuộc `paco-discover`. Keep `docs/product/paco-overview.md` concise và reusable narrative trong `docs/product/workflows/<feature>.md`. Raw evidence ở `test-results/product-survey/<run-id>/`; chỉ reviewed/redacted evidence vào docs.
7. Include two reusable guidance blocks: `Execution guidance` with manual setup, safe steps, approval stop and evidence to capture; `Automation guidance` with stable labels/landmarks, waits, data dependency and assertions that lack a trusted basis.
8. Classify every claim as `Observed`, `Inferred` or `Open Question` (`Verified-by-Mutation` chỉ từ `paco-verify-flow`); observation never becomes `Confirmed` without a trusted source. Survey knowledge may guide location, setup, data choice, risk and coverage, but must not create ticket requirements or expected results.
9. Preserve final `## Tester notes`; stop and report conflict rather than overwrite protected content.

## Outcome

`LOCATE`/`OBSERVE` return `ChildSkillOutcome` v1; `LOCATE` also returns location mode, route status, budget and next action with mutation `None`. `SURVEY` returns `DiscoveryChildOutcome` (`scripts/discovery-outcome.ts`) với `mode: SURVEY`, `mutation: null`, observed states, evidence refs, relationships, new grounded tasks (provenance trỏ evidence/edge/gap/candidate), mutation candidates, gaps, artifacts kèm SHA-256 và blockers; ghi JSON vào `test-results/product-survey/<run-id>/outcomes/`. Auth hết hạn: `auth_expired: true`. Missing auth/role/permission/context or unsafe mutation boundary is `Blocked`; exhausted `LOCATE` budget with useful candidates is `Inconclusive`; reaching the `SURVEY` bound is a successful checkpoint, not permission to continue; browser/write fault is `Failed`. Direct invocation never updates manifest/status or calls next skill.
