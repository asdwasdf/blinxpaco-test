# Paco Execution-First Playwright Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đổi Paco QA sang luồng manual execution kỹ trước, sau đó bắt buộc tạo và chạy Playwright CLI độc lập cho mọi case `Pass`/`Fail`, đồng thời giữ riêng product result và automation verification.

**Architecture:** Nâng manifest lên schema v2 với phase mới và structured per-case execution records; `paco-ticket` dùng các record này để enforce gate thay vì parse Markdown. `paco-playwright` sở hữu cả ba phase `MANUAL_EXECUTE`, `AUTOMATE`, `AUTOMATION_EXECUTE`; MCP chỉ dùng ở manual phase, CLI chỉ dùng ở automation execution. Reconciler chuyển manifest v1 sang v2, giữ checkpoint lịch sử và đánh dấu phần chưa chứng minh là cần chạy lại.

**Tech Stack:** TypeScript 5, Node.js `node:test`, YAML, Markdown skill contracts/templates, Playwright Test.

**Spec:** `docs/superpowers/specs/2026-09-28-paco-execution-first-playwright-design.md`

## Global Constraints

- Prose tiếng Việt; UI terms dùng English trong backtick.
- Chỉ Paco dev host được cấu hình; production và unknown host luôn bị chặn.
- Không lưu credentials, cookies, tokens, headers hoặc serialized auth state.
- Không assertion product correctness từ knowledge `Inferred`.
- `Pass`/`Fail` bắt buộc có `.spec.ts`; intermittent `Inconclusive` bắt buộc có diagnostic spec hoặc blocker cụ thể.
- `Blocked`/`Not Run` được phép không có spec khi ghi lý do.
- Spec phải chạy ngay bằng Playwright CLI trước `REPORT`, trừ blocker kỹ thuật được ghi rõ.
- Product result và automation verification không được ghi đè nhau.
- Giữ nguyên `## Tester notes`, checkpoint history và mọi thay đổi working tree không thuộc plan.
- Side effect trong test scope đã được người dùng cho phép tự động ở configured dev environment; vẫn bắt buộc exact runtime scope, hostname guard, safe test data, mutation ledger và cleanup.
- Không thêm dependency.
- Không commit nếu người dùng chưa yêu cầu; các bước commit dưới đây chỉ áp dụng khi có authorization commit riêng.

## Review Focus

1. Manifest v1 đang ở giữa `AUTOMATION_REVIEW`/`AUTOMATE`/`EXECUTE`: migration phải giữ history nhưng chọn phase mới an toàn, không giả định evidence cũ đủ.
2. Manual `Fail` có ít hơn ba diagnostic attempts hoặc thiếu control path: phase không được hoàn thành như confirmed product failure.
3. `Pass`/`Fail` có spec file nhưng mapping sai case/revision hoặc file stale: không được qua `AUTOMATE`.
4. CLI fail do locator/auth/setup khác product assertion fail: phải phân loại automation failure, không đổi product result.
5. Mutation chạy trên production/unknown host hoặc lệch ticket/case/action/data scope: luôn bị chặn dù workflow cho phép tự động hóa side effect.

---

### Task 1: Định nghĩa workflow v2 và migration deterministic

**Files:**
- Modify: `scripts/workflow-types.ts:1-44`
- Modify: `scripts/manifest-utils.ts:9-27,46-70,78-98,114-127,151-180`
- Modify: `scripts/tests/manifest-utils.test.ts:20-144`

**Interfaces:**
- Consumes: manifest schema v1 hiện tại; `InputSnapshot`, `ArtifactState`, `PhaseStatus`, `SkillOutcomeCode`.
- Produces:
  - `PHASES = [..., 'TEST_DESIGN', 'MANUAL_EXECUTE', 'AUTOMATE', 'AUTOMATION_EXECUTE', 'REPORT', 'COMPLETE'] as const`
  - `ManualCaseExecution`, `AutomationCaseImplementation`, `AutomationCaseExecution`
  - `ExecutionState`
  - `Manifest` schema v2 có `execution: ExecutionState`
  - `reconcileManifest(value: unknown, now: string): unknown`
  - Giữ `reconcileManifestV1` như deprecated alias trong task này nếu caller/test cũ còn dùng; xóa alias chỉ khi search chứng minh không còn caller.

- [ ] **Step 1: Viết test fail cho phase list và manifest v2**

Thay expectation 11 phase bằng 11 phase mới, kiểm tra không còn phase cũ và có execution state rỗng:

```ts
test('creates workflow v2 with split execution phases', () => {
  const value = manifest();
  assert.deepEqual(Object.keys(value.phases), [
    'DISCOVER', 'INGEST', 'ANALYZE', 'LOCATE', 'EXPLORE', 'TEST_DESIGN',
    'MANUAL_EXECUTE', 'AUTOMATE', 'AUTOMATION_EXECUTE', 'REPORT', 'COMPLETE',
  ]);
  assert.deepEqual(value.execution, { manual: {}, automation: {}, runs: {} });
  assert.equal(validateManifest(value).ok, true);
});
```

- [ ] **Step 2: Viết test fail cho transition mới**

```ts
test('uses the execution-first transition order', () => {
  const value = manifest();
  value.workflow.current_phase = 'TEST_DESIGN';
  value.phases.TEST_DESIGN.status = 'completed';
  value.outputs['test-cases.md'] = {
    owner: 'paco-test-design', path: 'docs/tickets/PAC9-101-test/test-cases.md',
    state: 'valid', input_revision: 1, sha256: null,
  };
  assert.equal(transitionPhase(value, 'MANUAL_EXECUTE', now).ok, true);
  assert.equal(transitionPhase(value, 'AUTOMATE', now).ok, false);
});
```

- [ ] **Step 3: Viết test fail cho migration v1 ở ba vị trí cũ**

Tạo helper `legacyManifestAt(phase)` chứa checkpoint cũ, rồi pin mapping:

```ts
for (const [oldPhase, expected] of [
  ['AUTOMATION_REVIEW', 'MANUAL_EXECUTE'],
  ['AUTOMATE', 'MANUAL_EXECUTE'],
  ['EXECUTE', 'MANUAL_EXECUTE'],
] as const) {
  test(`migrates legacy ${oldPhase} without claiming new execution evidence`, () => {
    const legacy = legacyManifestAt(oldPhase);
    const reconciled = reconcileManifest(legacy, now) as Manifest;
    assert.equal(reconciled.schema_version, 2);
    assert.equal(reconciled.workflow.current_phase, expected);
    assert.deepEqual(reconciled.execution, { manual: {}, automation: {}, runs: {} });
    assert.equal(reconciled.workflow.checkpoints.length, legacy.workflow.checkpoints.length);
    assert.match(reconciled.phases.MANUAL_EXECUTE.warnings.join(' '), /Legacy v1/);
  });
}
```

Thêm case legacy `COMPLETE`: vẫn giữ history nhưng resume tại `MANUAL_EXECUTE`, trừ khi structured evidence mới có thể được chứng minh—v1 không có structured evidence nên không suy đoán.

- [ ] **Step 4: Chạy test để xác nhận fail**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/manifest-utils.test.ts`

Expected: FAIL vì phase/type/schema v2 chưa tồn tại.

- [ ] **Step 5: Cài type và state tối thiểu**

Trong `workflow-types.ts`:

```ts
export const PHASES = [
  'DISCOVER', 'INGEST', 'ANALYZE', 'LOCATE', 'EXPLORE', 'TEST_DESIGN',
  'MANUAL_EXECUTE', 'AUTOMATE', 'AUTOMATION_EXECUTE', 'REPORT', 'COMPLETE',
] as const;

export type ExpectedBasis = 'Confirmed' | 'Observed' | 'Inferred' | 'Open Question';
export type AutomationVerification =
  | 'Matched product result'
  | 'Product behavior mismatch'
  | 'Automation defect'
  | 'Setup or authentication failure'
  | 'Inconclusive';

export interface ManualAttempt {
  id: string;
  result: TestResult;
  data_variant: 'same' | 'clean' | 'fresh_session' | 'control' | 'initial';
  evidence: string[];
}

export interface ManualCaseExecution {
  result: TestResult;
  expected_basis: ExpectedBasis;
  attempts: ManualAttempt[];
  control_path_checked: boolean;
  route: string;
  locators: string[];
  skip_or_block_reason: string | null;
}

export interface AutomationCaseImplementation {
  spec_path: string | null;
  diagnostic: boolean;
  reason: string | null;
  input_revision: number;
}

export interface AutomationCaseExecution {
  result: TestResult;
  verification: AutomationVerification;
  evidence: string[];
  product_result_changed: false;
}

export interface ExecutionState {
  manual: Record<string, ManualCaseExecution>;
  automation: Record<string, AutomationCaseImplementation>;
  runs: Record<string, AutomationCaseExecution>;
}
```

Trong `manifest-utils.ts`, đổi `Manifest.schema_version` thành `2`, thêm `execution`, cập nhật transition:

```ts
TEST_DESIGN: ['MANUAL_EXECUTE'],
MANUAL_EXECUTE: ['AUTOMATE'],
AUTOMATE: ['AUTOMATION_EXECUTE'],
AUTOMATION_EXECUTE: ['REPORT'],
```

`createManifest()` khởi tạo `execution: { manual: {}, automation: {}, runs: {} }`. `validateManifest()` yêu cầu schema 2 và ba map execution.

- [ ] **Step 6: Cài migration tối thiểu**

`reconcileManifest()` phải clone v1, đổi phase keys, giữ checkpoint array nguyên vẹn, thêm warning migration, map mọi workflow đã tới phase automation cũ về `MANUAL_EXECUTE`; phase trước đó giữ vị trí tương đương. Không map `EXECUTE` cũ thành `AUTOMATION_EXECUTE` vì provenance không đủ.

`loadManifest()` gọi `reconcileManifest()`. `propagateStale()` đánh dấu ba execution phase stale khi source chính đổi và không xóa execution history.

- [ ] **Step 7: Chạy test và type-check**

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/manifest-utils.test.ts
npm run type-check
```

Expected: PASS. Type errors từ test/utility còn dùng phase cũ phải được sửa đúng tên trong cùng task; không sửa ticket artifacts thật.

- [ ] **Step 8: Commit nếu được phép**

```bash
git add scripts/workflow-types.ts scripts/manifest-utils.ts scripts/tests/manifest-utils.test.ts
git commit -m "feat: split Paco execution workflow phases

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Enforce manual rigor và automation coverage bằng structured child outcome

**Files:**
- Modify: `scripts/child-outcome.ts:7-60`
- Modify: `scripts/manifest-utils.ts:73-98,151-162`
- Modify: `scripts/tests/child-outcome.test.ts:9-45`
- Modify: `scripts/tests/manifest-utils.test.ts`

**Interfaces:**
- Consumes: types `ManualCaseExecution`, `AutomationCaseImplementation`, `AutomationCaseExecution` từ Task 1.
- Produces:
  - `PlaywrightCaseOutcome`
  - optional `ChildSkillOutcome.playwright_cases`
  - `validateExecutionGate(manifest: Manifest, next: Phase): string[]`
  - `applyPlaywrightOutcome(manifest: Manifest, outcome: ChildSkillOutcome): Manifest`

- [ ] **Step 1: Viết child-outcome tests fail cho protocol manual**

Thêm helper outcome `paco-playwright` và tests:

```ts
test('rejects an unverified manual Fail', () => {
  const value = playwrightOutcome('MANUAL_EXECUTE', [{
    case_id: 'TC-1', manual: {
      result: 'Fail', expected_basis: 'Confirmed',
      attempts: [attempt('initial'), attempt('same')],
      control_path_checked: false, route: '/feature', locators: ['button:Save'],
      skip_or_block_reason: null,
    },
  }]);
  const result = validateChildOutcome(value, playwrightExpected('MANUAL_EXECUTE'));
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.issues.join(' '), /three attempts.*control path/i);
});

test('accepts verified Fail and unstable Inconclusive', () => {
  assert.equal(validateChildOutcome(verifiedFailOutcome(), playwrightExpected('MANUAL_EXECUTE')).ok, true);
  assert.equal(validateChildOutcome(intermittentOutcome(), playwrightExpected('MANUAL_EXECUTE')).ok, true);
});
```

Pin `Fail`: ít nhất ba non-control attempts gồm `same`, `clean`, `fresh_session`, cộng `control`; mỗi attempt có evidence. `Pass`: ít nhất initial attempt + evidence. `Inconclusive`: ít nhất hai differing results + evidence. `Blocked`/`Not Run`: reason non-empty.

- [ ] **Step 2: Viết manifest gate tests fail**

```ts
test('requires specs for every manual Pass and Fail', () => {
  const value = readyAt('AUTOMATE');
  value.execution.manual = {
    'TC-1': manual('Pass'),
    'TC-2': manual('Fail'),
    'TC-3': manual('Blocked', 'Missing safe data'),
  };
  value.execution.automation = {
    'TC-1': implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts'),
    'TC-3': implementation(null, 'Missing safe data'),
  };
  const result = transitionPhase(value, 'AUTOMATION_EXECUTE', now);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.reason, /TC-2.*spec/i);
});

test('requires diagnostic spec or blocker for intermittent Inconclusive', () => {
  const value = readyAt('AUTOMATE');
  value.execution.manual['TC-4'] = intermittentManual();
  value.execution.automation['TC-4'] = implementation(null, null);
  assert.equal(transitionPhase(value, 'AUTOMATION_EXECUTE', now).ok, false);
});
```

Thêm tests cho stale/wrong revision spec record và `Blocked`/`Not Run` có reason được qua gate.

- [ ] **Step 3: Viết automation execution gate tests fail**

```ts
test('blocks REPORT until every implemented spec has a CLI result', () => {
  const value = readyAt('AUTOMATION_EXECUTE');
  value.execution.manual['TC-1'] = manual('Fail');
  value.execution.automation['TC-1'] = implementation('playwright/tests/tickets/PAC9-101-TC-1.spec.ts');
  assert.equal(transitionPhase(value, 'REPORT', now).ok, false);
});

test('keeps manual Fail when CLI fails the expected product assertion', () => {
  const value = fullyExecuted('TC-1', 'Fail', 'Fail', 'Matched product result');
  const moved = transitionPhase(value, 'REPORT', now);
  assert.equal(moved.ok, true);
  assert.equal(value.execution.manual['TC-1'].result, 'Fail');
  assert.equal(value.execution.runs['TC-1'].product_result_changed, false);
});
```

Thêm case locator/auth/setup fail với `verification: 'Automation defect'` hoặc `'Setup or authentication failure'`; gate cho phép đi `REPORT` với warning nhưng manual result giữ nguyên.

- [ ] **Step 4: Chạy tests để xác nhận fail**

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/child-outcome.test.ts
node --loader ts-node/esm/transpile-only --test scripts/tests/manifest-utils.test.ts
```

Expected: FAIL vì metadata và gate chưa tồn tại.

- [ ] **Step 5: Cài `PlaywrightCaseOutcome` và validation**

Trong `child-outcome.ts`:

```ts
export interface PlaywrightCaseOutcome {
  case_id: string;
  manual?: ManualCaseExecution;
  automation?: AutomationCaseImplementation;
  run?: AutomationCaseExecution;
}

export interface ChildSkillOutcome {
  // existing fields
  playwright_cases?: PlaywrightCaseOutcome[];
}
```

Rules:

- Chỉ `paco-playwright` được có `playwright_cases`.
- `MANUAL_EXECUTE` yêu cầu mỗi item chỉ có `manual`.
- `AUTOMATE` yêu cầu mỗi item chỉ có `automation`.
- `AUTOMATION_EXECUTE` yêu cầu mỗi item chỉ có `run`.
- Duplicate `case_id` bị reject.
- `Fail` phải đúng retry/control/evidence protocol.
- `Inferred` hoặc `Open Question` không được manual `Fail`; dùng `Inconclusive`.
- Artifact ownership tiếp tục chỉ cho `automation.md` và `playwright/**/*.spec.ts`; raw `test-results/` không đưa vào artifact list.

- [ ] **Step 6: Cài merge và gate thuần dữ liệu**

`applyPlaywrightOutcome()` clone manifest và merge đúng map theo phase; không cập nhật workflow/checkpoint. `validateExecutionGate()`:

```ts
if (next === 'AUTOMATION_EXECUTE') {
  // Pass/Fail => non-null spec_path, matching revision
  // intermittent Inconclusive => diagnostic spec or non-empty reason
  // Blocked/Not Run => reason required when no spec
}
if (next === 'REPORT') {
  // every non-null spec_path => run exists
  // run.product_result_changed must be false
}
```

`transitionPhase()` và requested `planResume()` gọi cùng helper để tránh logic lệch nhau.

- [ ] **Step 7: Chạy focused tests và full fixture tests**

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/child-outcome.test.ts scripts/tests/manifest-utils.test.ts
npm run test:fixtures
npm run type-check
```

Expected: PASS.

- [ ] **Step 8: Commit nếu được phép**

```bash
git add scripts/child-outcome.ts scripts/manifest-utils.ts scripts/tests/child-outcome.test.ts scripts/tests/manifest-utils.test.ts
git commit -m "feat: enforce Paco execution evidence gates

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Giữ mutation automation an toàn nhưng không hỏi lặp trong approved workflow

**Files:**
- Modify: `scripts/mutation-gate.ts:3-70`
- Modify: `scripts/tests/mutation-gate.test.ts`
- Modify: `docs/standards/data-safety.md:11-58`

**Interfaces:**
- Consumes: `MutationRunScope`, configured `PacoConfig['safety']`, env guards.
- Produces:
  - `WorkflowMutationAuthorization`
  - `evaluateMutationGate(scope, approval, guards, now, safety, workflowAuthorization?)`
- Compatibility: exact `MutationApproval` vẫn hợp lệ; workflow authorization chỉ áp dụng cho Paco QA-generated manual/spec execution, không phải arbitrary browser action.

- [ ] **Step 1: Viết tests fail cho durable workflow authorization**

```ts
const workflowAuthorization = {
  product: 'Paco' as const,
  environment: 'dev',
  ticket_key: 'PAC9-101',
  case_ids: ['TC-1'],
  actions: ['Update'],
  test_data_fingerprint: 'safe-data',
  source: 'paco-execution-first-workflow' as const,
};

test('allows scoped workflow mutation on configured dev host', () => {
  const result = evaluateMutationGate(scope({ current_url: 'https://allowed.dev/path' }), null,
    { PACO_ALLOW_MUTATION: 'true' }, now, safety, workflowAuthorization);
  assert.deepEqual(result, { allowed: true, reason: 'workflow_authorized_mutation' });
});

test('blocks workflow authorization scope mismatch and unsafe hosts', () => {
  assert.equal(evaluateMutationGate(scope({ case_id: 'TC-2' }), null, guards, now, safety, workflowAuthorization).allowed, false);
  assert.equal(evaluateMutationGate(scope({ current_url: 'https://production.example/path' }), null, guards, now, safety, workflowAuthorization).allowed, false);
});
```

Thêm mismatch ticket/action/data/environment, thiếu env guard, destructive thiếu `PACO_ALLOW_DESTRUCTIVE`, malformed URL.

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/mutation-gate.test.ts`

Expected: FAIL vì overload/type/reason mới chưa có.

- [ ] **Step 3: Cài authorization nhỏ nhất**

```ts
export interface WorkflowMutationAuthorization {
  product: 'Paco';
  environment: string;
  ticket_key: string;
  case_ids: string[];
  actions: string[];
  test_data_fingerprint: string;
  source: 'paco-execution-first-workflow';
}
```

Sau host checks, chấp nhận `approval` chính xác **hoặc** `workflowAuthorization` chính xác. Cả hai vẫn phải qua `PACO_ALLOW_MUTATION`; destructive vẫn cần `PACO_ALLOW_DESTRUCTIVE`. Không serialize authorization vào manifest, docs hoặc spec; generated spec dựng exact scope từ ticket/case/test-data constants, không chứa secret.

- [ ] **Step 4: Cập nhật safety standard**

Ghi rõ authorization workflow đã duyệt chỉ bỏ bước hỏi lặp, không bỏ host/env/runtime/data guards; production/unknown host vẫn hard block; action ngoài test case vẫn cần approval mới.

- [ ] **Step 5: Chạy tests**

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/mutation-gate.test.ts
npm run type-check
```

Expected: PASS.

- [ ] **Step 6: Commit nếu được phép**

```bash
git add scripts/mutation-gate.ts scripts/tests/mutation-gate.test.ts docs/standards/data-safety.md
git commit -m "feat: scope Paco workflow mutation authorization

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Cập nhật skill contracts, templates và status projection

**Files:**
- Modify: `.claude/skills/paco-ticket/SKILL.md:8-31`
- Modify: `.claude/skills/paco-playwright/SKILL.md:8-24`
- Modify: `.claude/skills/paco-report/SKILL.md:8-26`
- Modify: `docs/templates/manifest.yaml:1-62`
- Modify: `docs/templates/status.md:1-65`
- Modify: `docs/templates/automation.md:1-50`
- Modify: `docs/standards/workflow-and-checkpoints.md:1-51`
- Modify: `scripts/status-utils.ts:8-68`
- Modify: `scripts/tests/status-utils.test.ts:8-28`
- Modify: `validate-skills.sh:12-16`

**Interfaces:**
- Consumes: v2 phase names/gates và structured execution records từ Tasks 1–2.
- Produces: executable natural-language contracts cho orchestrator/child skill, v2 templates, status output có manual/automation summaries.

- [ ] **Step 1: Viết status test fail**

```ts
test('renders split execution phases and result summaries', () => {
  const value = manifestWithExecution();
  const output = renderStatus(value, 'Chạy `AUTOMATION_EXECUTE`.');
  assert.equal((output.match(/^\| (?:DISCOVER|INGEST|ANALYZE|LOCATE|EXPLORE|TEST_DESIGN|MANUAL_EXECUTE|AUTOMATE|AUTOMATION_EXECUTE|REPORT|COMPLETE) /gm) ?? []).length, 11);
  assert.match(output, /Manual results: Pass 1, Fail 1, Inconclusive 1/);
  assert.match(output, /Automation: Implemented 3, Executed 2, Blocked 1/);
});
```

- [ ] **Step 2: Chạy status test để xác nhận fail**

Run: `node --loader ts-node/esm/transpile-only --test scripts/tests/status-utils.test.ts`

Expected: FAIL vì summary chưa render.

- [ ] **Step 3: Cập nhật `paco-ticket` contract**

Nêu chính xác routing:

```text
MANUAL_EXECUTE → paco-playwright mode manual
AUTOMATE → paco-playwright mode generate
AUTOMATION_EXECUTE → paco-playwright mode cli
```

Enforce:

- manual protocol trước khi chấp nhận `Fail`;
- apply structured child outcome trước checkpoint;
- không `REPORT` trước CLI result/blocker;
- MCP không được dùng lại trong `AUTOMATE`/`AUTOMATION_EXECUTE` trừ durable route/locator stale hoặc thiếu, khi đó quay về bounded manual investigation;
- không tự sửa product result từ CLI result.

- [ ] **Step 4: Cập nhật `paco-playwright` contract**

Thay assessment-first bằng ba mode độc lập:

1. `MANUAL_EXECUTE`: MCP, từng case, evidence từng attempt, fail retry matrix/control path, inventory review.
2. `AUTOMATE`: mọi `Pass`/`Fail` có standalone spec; intermittent `Inconclusive` có diagnostic repeat spec; `Blocked`/`Not Run` reason; no MCP rediscovery.
3. `AUTOMATION_EXECUTE`: Playwright CLI đúng scope, phân loại result/mismatch, promote durable evidence cần report.

Ghi side-effect workflow authorization + tất cả guard Task 3. `Direct invocation` chỉ ghi owned artifact/source và structured proposal, không manifest/status.

- [ ] **Step 5: Cập nhật `paco-report` contract**

Bắt buộc hai section:

```markdown
## Product Result
## Automation Verification
```

Defect chỉ dựa trên product result/evidence; CLI fail đúng expected assertion hỗ trợ reproduction, không phải automation defect. Locator/auth/setup failure không chứng minh product `Fail`.

- [ ] **Step 6: Cập nhật templates và standard**

`manifest.yaml`: schema 2, phase mới, `execution.manual`, `execution.automation`, `execution.runs`; bỏ `automation_decision` global.

`automation.md` dùng bảng đã duyệt:

```markdown
| Test case | Manual result | Attempts | Spec path | CLI result | Match | Skip/block reason |
|---|---|---:|---|---|---|---|
```

Thêm sections `Manual Execution Evidence`, `Automation Implementation`, `CLI Verification`, `Mutation and Cleanup`; giữ đúng một `## Tester notes` cuối file.

`status.md` và `workflow-and-checkpoints.md`: phase/gate/migration mới. Standard nói rõ budget manual không được dùng để giảm correctness; fail retry tối thiểu ba diagnostic attempts + control path.

- [ ] **Step 7: Cài status summaries**

Trong `status-utils.ts`, count trực tiếp từ `manifest.execution`; không parse Markdown. Không render test data identifiers hoặc evidence content.

- [ ] **Step 8: Strengthen static skill validation**

Trong `validate-skills.sh`, thay check `Plugin-first` bằng exact contract markers:

```bash
grep -q 'MANUAL_EXECUTE' .claude/skills/paco-playwright/SKILL.md
grep -q 'AUTOMATION_EXECUTE' .claude/skills/paco-playwright/SKILL.md
grep -q 'tối thiểu ba' .claude/skills/paco-playwright/SKILL.md
grep -q 'Product Result' .claude/skills/paco-report/SKILL.md
grep -q 'Automation Verification' .claude/skills/paco-report/SKILL.md
```

- [ ] **Step 9: Chạy focused/static tests**

Run:

```bash
node --loader ts-node/esm/transpile-only --test scripts/tests/status-utils.test.ts
bash validate-skills.sh
bash validate-standards.sh
npm run type-check
```

Expected: PASS.

- [ ] **Step 10: Commit nếu được phép**

```bash
git add .claude/skills/paco-ticket/SKILL.md .claude/skills/paco-playwright/SKILL.md .claude/skills/paco-report/SKILL.md docs/templates/manifest.yaml docs/templates/status.md docs/templates/automation.md docs/standards/workflow-and-checkpoints.md scripts/status-utils.ts scripts/tests/status-utils.test.ts validate-skills.sh
git commit -m "docs: define execution-first Paco skill contracts

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Cập nhật project contract và synthetic end-to-end check

**Files:**
- Modify: `scripts/tests/synthetic-workflow.test.ts:40-91`
- Modify: `CLAUDE.md` workflow/safety sections
- Modify: `docs/superpowers/specs/2026-09-09-paco-qa-skills-design.md:8-33,188-258` hoặc thêm explicit supersession note trỏ tới spec mới
- Test: toàn bộ validation suite

**Interfaces:**
- Consumes: manifest v2, child outcomes, execution gates, mutation authorization, templates/contracts từ Tasks 1–4.
- Produces: một runnable synthetic workflow chứng minh luồng mới không cần Paco access; project-level instructions nhất quán.

- [ ] **Step 1: Mở rộng synthetic test thành full new phase flow**

Sau location setup, tạo synthetic `test-cases.md`, manual outcome, spec artifact và CLI outcome. Dùng một case `Pass`, một verified `Fail`, một `Blocked`, một intermittent `Inconclusive`. Assertions tối thiểu:

```ts
assert.equal(transitionPhase(manifest, 'MANUAL_EXECUTE', now).ok, true);
manifest = applyPlaywrightOutcome(manifest, manualOutcome);
assert.equal(transitionPhase(manifest, 'AUTOMATE', now).ok, true);
manifest = applyPlaywrightOutcome(manifest, automateOutcome);
assert.equal(transitionPhase(manifest, 'AUTOMATION_EXECUTE', now).ok, true);
manifest = applyPlaywrightOutcome(manifest, cliOutcome);
assert.equal(transitionPhase(manifest, 'REPORT', now).ok, true);
assert.equal(manifest.execution.manual['TC-FAIL'].result, 'Fail');
assert.equal(manifest.execution.runs['TC-FAIL'].verification, 'Matched product result');
```

Synthetic `.spec.ts` chỉ là artifact text; test không mở website. Kiểm tra source `ticket.md` checksum không đổi và Tester notes vẫn giữ.

- [ ] **Step 2: Chạy synthetic test để xác nhận fail trước phần fixture hoàn chỉnh**

Run: `npm run test:synthetic`

Expected: FAIL tại phase/artifact mới còn thiếu trong fixture.

- [ ] **Step 3: Hoàn tất fixture và project instructions**

`CLAUDE.md` phase list thành:

```text
DISCOVER → INGEST → ANALYZE → LOCATE → EXPLORE → TEST_DESIGN → MANUAL_EXECUTE → AUTOMATE → AUTOMATION_EXECUTE → REPORT → COMPLETE
```

Ghi:

- manual failure verification protocol;
- mandatory standalone spec + immediate CLI run;
- product/automation result separation;
- durable workflow authorization chỉ trong configured dev/test scope, hard block production/unknown host.

Ở design spec 2026-09-09, không rewrite lịch sử. Thêm đầu file:

```markdown
> **Superseded in part:** Workflow/automation sections are replaced by `2026-09-28-paco-execution-first-playwright-design.md`.
```

- [ ] **Step 4: Chạy synthetic và full validation**

Run:

```bash
npm run test:synthetic
npm run validate
```

Expected: tất cả PASS, gồm static validation, TypeScript, fixture tests, synthetic workflow và `playwright test --list`.

- [ ] **Step 5: Kiểm tra không sửa ticket artifacts hiện có**

Run:

```bash
git diff --name-only -- docs/tickets ticket playwright/tests/tickets
```

Expected: không có file mới do plan này. Các thay đổi đã tồn tại trước task phải được nhận diện từ baseline, không revert/overwrite.

- [ ] **Step 6: Rà protected content và obsolete phase names**

Run:

```bash
rg -n 'AUTOMATION_REVIEW|\bEXECUTE\b' .claude/skills docs/standards docs/templates CLAUDE.md scripts --glob '!docs/superpowers/specs/2026-09-09-paco-qa-skills-design.md'
rg -n '^## Tester notes$' docs/templates/automation.md docs/templates/status.md
```

Expected: obsolete names chỉ xuất hiện trong migration code/tests hoặc explicit historical text; mỗi protected template có đúng một final `## Tester notes`.

- [ ] **Step 7: Commit nếu được phép**

```bash
git add scripts/tests/synthetic-workflow.test.ts CLAUDE.md docs/superpowers/specs/2026-09-09-paco-qa-skills-design.md
git commit -m "test: verify execution-first Paco workflow

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## Final Verification

- [ ] Run: `npm run validate`
- [ ] Run: `git diff --check`
- [ ] Review only plan-owned paths; do not stage/revert unrelated working-tree changes.
- [ ] Confirm no credentials/auth state under diff: `git diff -- . ':!playwright/.auth/**'`
- [ ] Confirm no ticket artifact migration occurred automatically.
- [ ] Confirm spec coverage: phase order, manual rigor, mandatory specs, immediate CLI, result separation, mutation guard, migration, protected notes, stale propagation, direct child ownership.
