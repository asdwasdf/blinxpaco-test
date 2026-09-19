# Paco QA Fast Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây workflow Paco QA nhanh nhưng chính xác: ingest video thành frame/contact sheet, test plugin-first, cho phép mutation đầy đủ trên dev có hostname guard, tích lũy product survey bằng Markdown và generated graph, hỏi QA sớm, lưu evidence bền trong repo.

**Architecture:** Giữ skills làm policy/orchestration, bổ sung các utility TypeScript nhỏ cho video, mutation host guard và graph generation. Markdown trong `docs/product/survey/` là nguồn chuẩn; generated JSON/Mermaid là projection. Browser exploration dùng Claude Playwright plugin; Playwright source chỉ dành cho regression được chọn.

**Tech Stack:** Node.js, TypeScript, `node:test`, `yaml`, native `ffmpeg`/`ffprobe` executables, Claude Playwright plugin, Markdown, Mermaid.

**Spec:** `docs/superpowers/specs/2026-09-19-paco-qa-fast-workflow-design.md`

## Global Constraints

- Không dùng worktree; mọi artifact phải viết vào main repo.
- Không sửa hoặc xóa thay đổi PAC2-4700 đang có.
- Chỉ Paco dev: `https://blinx.dev.blinxpaco-np.com`.
- Production hostname luôn bị chặn; external flow chỉ dùng explicit dev allowlist.
- Không lưu credentials, cookies, auth state hoặc PII vào repo.
- Markdown là nguồn chuẩn; generated graph không sửa tay.
- Plugin-first; `.spec.ts` chỉ cho regression quan trọng, ổn định.
- Không có timebox cứng; blocker nghiệp vụ phải hỏi QA ngay.
- `test-results/` là raw local output; evidence bền được promote vào `docs/tickets/<ticket-folder>/evidence/`.
- Dùng `ffmpeg`/`ffprobe` executable; không thêm npm video dependency.

---

### Task 1: Dev Mutation Guard

**Files:**
- Modify: `paco.config.yaml`
- Modify: `scripts/workflow-types.ts`
- Modify: `scripts/load-config.ts`
- Modify: `scripts/mutation-gate.ts`
- Modify: `scripts/tests/config.test.ts`
- Modify: `scripts/tests/mutation-gate.test.ts`
- Modify: `docs/standards/data-safety.md`

**Interfaces:**
- Consumes: existing `PacoConfig`, `MutationRunScope`, `evaluateMutationGate()`.
- Produces: `safety.mutationEnabledEnvironments: string[]`, `safety.allowedHosts: string[]`, `safety.externalDevHosts: string[]`; `MutationRunScope.current_url`; hostname-aware `evaluateMutationGate()`.

- [ ] **Step 1: Add failing config tests**

Add assertions that valid config parses:

```ts
safety:
  mutationEnabledEnvironments: [dev]
  allowedHosts: [blinx.dev.blinxpaco-np.com]
  externalDevHosts: []
```

Add invalid cases for empty `allowedHosts`, non-string host entries and URL-shaped host values. Run:

```bash
npm run test:fixtures -- --test-name-pattern="config"
```

Expected: FAIL because `PacoConfig.safety` is absent.

- [ ] **Step 2: Add strict safety config**

Extend `PacoConfig` and `loadConfig()` with non-empty string-array parsing. Store hostnames only, lowercase, without scheme/path. Add exact values to `paco.config.yaml`.

Run:

```bash
npm run type-check
npm run test:fixtures -- --test-name-pattern="config"
```

Expected: PASS.

- [ ] **Step 3: Add failing hostname mutation tests**

Extend fixtures with `current_url`. Test:

```ts
assert.equal(evaluateMutationGate(scopeOnDev, approval, guards, now, safety).allowed, true);
assert.equal(evaluateMutationGate(scopeOnProd, approval, guards, now, safety).allowed, false);
assert.equal(evaluateMutationGate(scopeOnUnknownHost, approval, guards, now, safety).allowed, false);
```

Also test allowed external dev hostname and invalid URL. Expected: FAIL before implementation.

- [ ] **Step 4: Enforce hostname before approval checks**

Parse `scope.current_url` using `new URL()`. Require environment in `mutationEnabledEnvironments` and hostname in `allowedHosts` or `externalDevHosts`. Keep exact approval and env flags as defense in depth. Return explicit reasons such as `Mutation blocked outside configured dev hosts`.

Run:

```bash
npm run test:fixtures -- --test-name-pattern="mutation"
```

Expected: PASS.

- [ ] **Step 5: Update safety standard**

Document full dev mutation authorization, production hard block, external allowlist, test recipient requirement for `Send`, mutation ledger and cleanup rule. Remove default language that requires asking before every approved dev mutation; retain ask-QA behavior for missing domain data or unsafe destination.

- [ ] **Step 6: Commit**

```bash
git add paco.config.yaml scripts/workflow-types.ts scripts/load-config.ts scripts/mutation-gate.ts scripts/tests/config.test.ts scripts/tests/mutation-gate.test.ts docs/standards/data-safety.md
git commit -m "feat: guard full dev mutation by hostname" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 2: Video Contact Sheet Pipeline

**Files:**
- Create: `scripts/video-ingest.ts`
- Create: `scripts/tests/video-ingest.test.ts`
- Modify: `package.json`
- Modify: `docs/standards/evidence-handling.md`
- Modify: `docs/templates/requirements.md`
- Modify: `.claude/skills/paco-requirements/SKILL.md`

**Interfaces:**
- Produces: `validateVideoInput(inputPath: string): '.mp4' | '.webm'`; `buildVideoIngestPlan(inputPath: string, outputDir: string): VideoIngestPlan`; CLI `npm run video:ingest -- <input> <output-dir>`.
- `VideoIngestPlan` contains exact `ffprobe` args, scene extraction args, contact-sheet args and output paths.

- [ ] **Step 1: Write failing pure tests**

Test `.mp4` and `.webm`, reject unsupported extensions, reject output outside `docs/tickets/`, ensure executable args remain arrays and never shell strings, and ensure output names are `timeline.md`, `contact-sheet.webp`, `frames/frame-%04d.webp`.

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/video-ingest.test.ts
```

Expected: FAIL because module is absent.

- [ ] **Step 2: Implement input validation and command plans**

Use `spawnSync`/`execFileSync` with argument arrays. Verify input exists, extension is supported, output resolves under `docs/tickets/`, and both `ffmpeg`/`ffprobe` are available. Use scene threshold as a named constant, retain timestamps in filenames or generated metadata, and fail with actionable install message when executables are absent.

- [ ] **Step 3: Implement CLI outputs**

Create output directory, probe metadata JSON, extract scene frames, build contact sheet, and write `timeline.md` with metadata plus a timestamp table whose observation/provenance cells start empty for QA analysis. If scene extraction yields no frame, extract first frame as fallback. Never overwrite `## Tester notes`; abort if an existing timeline contains it and safe merge cannot be guaranteed.

- [ ] **Step 4: Add package command and run tests**

Add:

```json
"video:ingest": "node --loader ts-node/esm scripts/video-ingest.ts"
```

Run:

```bash
npm run type-check
node --loader ts-node/esm/transpile-only --test scripts/tests/video-ingest.test.ts
```

Expected: PASS. Do not require installed ffmpeg in unit tests; mock or test pure plans.

- [ ] **Step 5: Update requirements workflow**

Document video as requirement source, contact sheet/timeline ownership, provenance rules, dense extraction around unclear timestamps and immediate `Open Question` on unreadable/conflicting video.

- [ ] **Step 6: Commit**

```bash
git add scripts/video-ingest.ts scripts/tests/video-ingest.test.ts package.json docs/standards/evidence-handling.md docs/templates/requirements.md .claude/skills/paco-requirements/SKILL.md
git commit -m "feat: ingest ticket videos as contact sheets" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 3: Markdown Survey and Generated Graph

**Files:**
- Create: `scripts/generate-product-graph.ts`
- Create: `scripts/tests/generate-product-graph.test.ts`
- Create: `docs/product/survey/README.md`
- Create: `docs/product/survey/views/README.md`
- Create: `docs/product/survey/roles/README.md`
- Create: `docs/product/survey/mutation-ledger/README.md`
- Create: `docs/product/survey/coverage.md`
- Create: `docs/product/survey/graph.json`
- Create: `docs/product/survey/graph.mmd`
- Modify: `docs/product/feature-map.md`
- Modify: `package.json`

**Interfaces:**
- Produces: `parseSurveyView(markdown: string, sourcePath: string): SurveyView`; `buildProductGraph(views: SurveyView[]): ProductGraph`; CLI `npm run graph:generate`.
- `SurveyView` fields: `id`, `title`, `roles`, `environment`, `status`, `routes`, `controls`, `verified_by`, `last_observed`.

- [ ] **Step 1: Write failing parser/generator tests**

Use temp Markdown fixtures. Assert strict required fields, allowed provenance values, duplicate ID rejection, dangling route reporting, deterministic sorting, JSON shape and Mermaid escaping. Expected: FAIL because module is absent.

- [ ] **Step 2: Implement parser and graph builder**

Use existing `yaml` package for frontmatter. Generate nodes for views and edges for routes, controls and ticket verification. Preserve status/provenance; never promote `Observed` to `Confirmed`.

- [ ] **Step 3: Implement atomic CLI generation**

Read `docs/product/survey/views/**/*.md` except README, validate all documents, then atomically replace `graph.json` and `graph.mmd`. Invalid source exits non-zero without overwriting last valid generated files.

- [ ] **Step 4: Add seed docs and command**

Add the exact schema/example in survey README. Keep view directory empty except README initially; do not fabricate product observations. Generated graph must be a valid empty graph. Add:

```json
"graph:generate": "node --loader ts-node/esm scripts/generate-product-graph.ts"
```

Link survey and generated graph from `docs/product/feature-map.md`.

- [ ] **Step 5: Verify**

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/generate-product-graph.test.ts
npm run graph:generate
npm run type-check
```

Expected: PASS and deterministic no-op on second generation.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-product-graph.ts scripts/tests/generate-product-graph.test.ts docs/product/survey docs/product/feature-map.md package.json
git commit -m "feat: generate Paco product graph from Markdown" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 4: Survey Crawler Contract and Checkpoint Template

**Files:**
- Create: `docs/standards/product-survey.md`
- Create: `docs/templates/survey-view.md`
- Create: `docs/templates/survey-checkpoint.yaml`
- Modify: `docs/standards/feature-location.md`
- Modify: `docs/templates/workflow.md`
- Modify: `.claude/skills/paco-explore/SKILL.md`
- Modify: `validate-standards.sh`

**Interfaces:**
- Consumes: survey Markdown schema and graph command from Task 3; mutation guard from Task 1.
- Produces: documented fingerprint `role + normalized URL + page heading + dialog/tab state`; queue/checkpoint schema; role-scoped crawl contract.

- [ ] **Step 1: Add templates and validator expectations**

`survey-view.md` contains exact frontmatter fields consumed by graph generator plus final `## Tester notes`. `survey-checkpoint.yaml` contains environment, role, start URL, queue, visited fingerprints, attempted transitions, mutation fingerprints, blockers and updated timestamp.

Update `validate-standards.sh` arrays so new standard/templates are checked. Run `npm run validate:static`; expect initial failure until docs satisfy template rules.

- [ ] **Step 2: Write survey standard**

Specify breadth-first traversal, current-role-only session, manual role switch, observable waits, page-template dedupe, no raw DOM/network payload, configurable runaway ceiling with resume, mutation ledger, production block and ask-QA stop conditions.

- [ ] **Step 3: Update explore skill and workflow template**

Require graph search before ticket exploration. Keep full-site survey outside ticket critical path. On newly confirmed reusable route, write proposal/owned survey artifact and regenerate graph only after protected-content checks. Replace old hard 15-minute semantics with bounded route search plus blocker escalation; ceilings prevent runaway, not correctness work.

- [ ] **Step 4: Verify and commit**

```bash
npm run validate:static
npm run graph:generate
```

Then:

```bash
git add docs/standards/product-survey.md docs/templates/survey-view.md docs/templates/survey-checkpoint.yaml docs/standards/feature-location.md docs/templates/workflow.md .claude/skills/paco-explore/SKILL.md validate-standards.sh
git commit -m "docs: define resumable Paco product survey" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 5: Plugin-First Automation and Ask-QA-Early

**Files:**
- Modify: `.claude/skills/paco-ticket/SKILL.md`
- Modify: `.claude/skills/paco-test-design/SKILL.md`
- Modify: `.claude/skills/paco-playwright/SKILL.md`
- Modify: `.claude/skills/paco-report/SKILL.md`
- Modify: `docs/templates/automation.md`
- Modify: `docs/templates/open-question.md`
- Modify: `docs/templates/report.md`
- Modify: `docs/standards/workflow-and-checkpoints.md`
- Modify: `docs/standards/traceability.md`
- Modify: `validate-skills.sh`

**Interfaces:**
- Produces policy tokens enforced by static validator: `plugin-first`, `Worth automating`, `Not worth automating`, `Ask QA early`, durable evidence path.

- [ ] **Step 1: Tighten static skill validation first**

Add checks requiring orchestrator/plugin-first decision language, ask-QA blocker payload, and durable evidence promotion. Run `npm run validate:static`; expected FAIL before skill edits.

- [ ] **Step 2: Update orchestrator and test design**

Require ingest of video artifacts before requirement analysis when video exists. Require graph lookup before LOCATE. Define blocker payload: blocker, observation, evidence/timestamp, requested decision, concrete choices and affected test cases. Remove fixed time deadline as completion criterion.

- [ ] **Step 3: Update Playwright skill**

Make Claude Playwright plugin default for exploration and execution. Automation review happens after observable execution. Require explicit `Worth automating`/`Not worth automating`; only create small `.spec.ts` for stable, important regression. Reuse hostname mutation gate and ledger; do not reinstate read-only default on dev.

- [ ] **Step 4: Update report and templates**

Require video-to-requirement coverage, blocker resolution status, mutation ledger reference, automation decision and knowledge promotion. `open-question.md` gets exact ask-QA fields. Preserve every `## Tester notes` section.

- [ ] **Step 5: Verify and commit**

```bash
npm run validate:static
```

Then:

```bash
git add .claude/skills/paco-ticket/SKILL.md .claude/skills/paco-test-design/SKILL.md .claude/skills/paco-playwright/SKILL.md .claude/skills/paco-report/SKILL.md docs/templates/automation.md docs/templates/open-question.md docs/templates/report.md docs/standards/workflow-and-checkpoints.md docs/standards/traceability.md validate-skills.sh
git commit -m "feat: make Paco QA plugin-first and blocker-driven" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 6: Durable Evidence and End-to-End Validation

**Files:**
- Modify: `.gitignore`
- Modify: `scripts/tests/synthetic-workflow.test.ts`
- Modify: `docs/templates/manifest.yaml`
- Modify: `docs/templates/status.md`
- Modify: `docs/standards/evidence-handling.md`
- Modify: `docs/templates/README.md`

**Interfaces:**
- Consumes: video timeline, graph generation, mutation ledger and plugin-first policies.
- Produces: synthetic workflow proof that raw evidence remains local and curated evidence is referenced from durable ticket paths.

- [ ] **Step 1: Add failing synthetic assertions**

Extend synthetic test to require automation decision, open-question checkpoint shape, mutation ledger reference when mutation exists, and evidence references rooted under `docs/tickets/<ticket-folder>/evidence/` rather than `test-results/` at REPORT/COMPLETE.

Run:

```bash
npm run test:synthetic
```

Expected: FAIL before template/state updates.

- [ ] **Step 2: Update manifest/status templates**

Add fields for video ingest state, graph lookup, unresolved blocker count, automation decision, mutation ledger and durable evidence promotion. Keep child skills from editing manifest/status; only `paco-ticket` reconciles them.

- [ ] **Step 3: Make raw output local**

Add `/test-results/` to `.gitignore` for new raw artifacts while leaving already tracked historical files untouched. Document promotion command/process and prohibit durable docs from pointing at ephemeral raw output after REPORT.

- [ ] **Step 4: Run complete validation**

```bash
npm run validate
```

Expected: static validators, TypeScript, fixture tests, synthetic workflow and Playwright listing all PASS. Browser execution is not required for this implementation validation.

- [ ] **Step 5: Check protected/user changes**

```bash
git status --short
git diff --check
```

Confirm no pre-existing PAC2-4700 file was staged or modified by implementation. Confirm every edited managed Markdown retains exactly one final `## Tester notes` where required.

- [ ] **Step 6: Commit**

```bash
git add .gitignore scripts/tests/synthetic-workflow.test.ts docs/templates/manifest.yaml docs/templates/status.md docs/standards/evidence-handling.md docs/templates/README.md
git commit -m "feat: preserve durable Paco QA evidence" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

### Task 7: Final Verification and Usage Documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/product/survey/README.md`

**Interfaces:**
- Documents commands: `npm run video:ingest -- <video> <ticket-video-output>`, `npm run graph:generate`, `npm run validate`.

- [ ] **Step 1: Document operator flow**

Add concise flow: manual login, video ingest, graph lookup, plugin execution, ask-QA checkpoint, evidence promotion, optional automation and graph regeneration. State that full-site survey uses current authenticated role and resumes after manual role switch.

- [ ] **Step 2: Run fresh verification**

```bash
npm run validate
npm run graph:generate
git diff --check
```

Expected: all PASS; graph generation leaves no unexpected diff.

- [ ] **Step 3: Review scope**

Use `git diff --name-only 1359b74..HEAD` plus working-tree status. Ensure no PAC2-4700 artifact appears in implementation commits and no credentials/PII/raw media were added.

- [ ] **Step 4: Commit docs**

```bash
git add README.md docs/product/survey/README.md
git commit -m "docs: explain Paco QA fast workflow" -m "Co-Authored-By: Claude Code <noreply@anthropic.com>"
```
