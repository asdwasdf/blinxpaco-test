# Paco Auto-Mutation Without Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the runtime + prompt-level mutation prompt that testers must answer on every action, on configured dev hosts, by replacing it with a file-based `mutationMode: auto` flag in `manifest.yaml` checked at the gate.

**Architecture:** 2-layer change. Layer 1 (code): rewrite `evaluateMutationGate()` to drop the `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE` env var checks and add wildcard host matching, with a new `mutationMode: 'auto' | 'manual'` input that auto-allows when set. Layer 2 (skills + config): update 4 SKILL.md files to remove "không tự bật guard / guard từ ngoài" wording, document the new auto-mode contract, and add a manifest writer helper so `paco-ticket` and `paco-discover` set the flag at ticket intake. Backward compatibility: existing workflow-authorization callers continue to work without changes.

**Tech Stack:** TypeScript (Node ≥ 20), `node:test` runner, YAML (`paco.config.yaml`, `manifest.yaml`).

**Spec:** `docs/superpowers/specs/2026-10-16-paco-auto-mutation-no-prompt-design.md`

## Global Constraints

- Config and skill files must follow the wording and structure already in this repo. Do not rename `paco.config.yaml` keys or SKILL frontmatter fields.
- `manifest.yaml` and `status.md` are the source of truth; do not duplicate policy state in env vars.
- All exports in `scripts/` use `.js` extension in import specifiers (matches `mutation-gate.ts:1`).
- `evaluateMutationGate()` signature stays callable from existing call sites; new parameter is optional and trailing.
- Wildcard syntax: `*` matches any host segment (e.g. `*.blinxpaco-np.com` matches `pac2-8575.dev.blinxpaco-np.com`). No regex.
- Sensitive data (PII, auth tokens) is still hard-blocked by the gate, regardless of mode.
- Test runner: `node --test scripts/tests/*.test.ts` (matches `package.json` if present; otherwise invoked directly).
- Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> on each commit.

## Review Focus

These inputs/failure modes are likely to bite a person using this change but are not directly exercised by any single task's tests:

1. Wildcard with subpath mismatch — `*.blinxpaco-np.com` matches the host but the URL path is on a feature branch route. Expected: gate must still allow (host-only check, not path).
2. Production host that coincidentally contains `-np` substring (e.g. `nonprod.example`). Expected: gate still blocks if not in allowlist. → Pinned in Task 1 test.
3. Ticket `manifest.yaml` missing `mutationMode` key (legacy ticket). Expected: gate falls back to `manual` (asks). → Pinned in Task 2 test.
4. `paco-discover` and `paco-ticket` set the flag at slightly different times; agent reads manifest before the writer flushes. Expected: reader tolerates missing key, no crash. → Pinned in Task 3 test.
5. Two sources of approval both present (`manifest.yaml: auto` + `status.md: APPROVED`). Expected: ledger records one entry with `source: manifest` (higher priority). → Pinned in Task 4 test.

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `scripts/mutation-gate.ts` | Core gate logic. Adds `mutationMode` param + wildcard host match, drops env var check. | Modify |
| `scripts/mutation-gate-helpers.ts` | Wildcard host matcher + manifest reader helpers. | Create |
| `scripts/tests/mutation-gate.test.ts` | Existing tests stay; new cases for wildcard, mutationMode, no env var. | Modify (extend) |
| `scripts/mutation-ledger.ts` | New ledger writer with `source` field. | Create |
| `scripts/tests/mutation-ledger.test.ts` | Tests for ledger write/append. | Create |
| `scripts/manifest-mutation-mode.ts` | Helper that `paco-ticket` and `paco-discover` call to stamp the flag. | Create |
| `scripts/tests/manifest-mutation-mode.test.ts` | Tests for the writer. | Create |
| `paco.config.yaml` | Add one comment line documenting wildcard syntax (no key changes). | Modify (comment only) |
| `.claude/skills/paco-ticket/SKILL.md` | Add `## Mutation Mode` section, drop env var wording. | Modify |
| `.claude/skills/paco-playwright/SKILL.md` | Same. | Modify |
| `.claude/skills/paco-explore/SKILL.md` | Same. | Modify |
| `.claude/skills/paco-discover/SKILL.md` | Same. | Modify |
| `.claude/skills/paco-verify-flow/SKILL.md` | Same. | Modify |
| `.claude/skills/paco-requirements/SKILL.md` | Add `## Mutation Mode` section (no-op content; for audit). | Modify |
| `.claude/skills/paco-test-design/SKILL.md` | Same. | Modify |
| `.claude/skills/paco-report/SKILL.md` | Same. | Modify |

---

### Task 1: Add wildcard host matcher + extend `evaluateMutationGate()`

**Files:**
- Create: `scripts/mutation-gate-helpers.ts`
- Modify: `scripts/mutation-gate.ts`
- Modify: `scripts/tests/mutation-gate.test.ts`

**Interfaces:**
- Consumes: `PacoConfig['safety']` (existing shape)
- Produces:
  - `hostMatchesPattern(host: string, patterns: string[]): boolean` — exact or `*`-wildcard
  - `evaluateMutationGate(scope, approval, guards, now, safety?, workflowAuthorization?, mutationMode?)` — same return type, new optional trailing param

- [ ] **Step 1: Write the failing test for wildcard host matching**

In `scripts/tests/mutation-gate.test.ts`, add a `describe` block (or new `test` cases — keep `node:test` style flat) at the end:

```ts
test('hostMatchesPattern supports exact and wildcard entries', () => {
  assert.equal(hostMatchesPattern('blinx.dev.blinxpaco-np.com', ['blinx.dev.blinxpaco-np.com']), true);
  assert.equal(hostMatchesPattern('pac2-8575.dev.blinxpaco-np.com', ['*.blinxpaco-np.com']), true);
  assert.equal(hostMatchesPattern('prod.example.com', ['*.blinxpaco-np.com']), false);
  assert.equal(hostMatchesPattern('nonprod.example.com', ['*.blinxpaco-np.com']), false); // substring does not match
  assert.equal(hostMatchesPattern('blinx.dev.blinxpaco-np.com', ['*.dev.blinxpaco-np.com']), true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/tests/mutation-gate.test.ts 2>&1 | tail -20`
Expected: FAIL with `hostMatchesPattern is not defined` or similar.

- [ ] **Step 3: Create `scripts/mutation-gate-helpers.ts`**

Export:

```ts
export function hostMatchesPattern(host: string, patterns: string[]): boolean {
  const h = host.toLowerCase();
  return patterns.some((p) => {
    const pat = p.toLowerCase();
    if (!pat.includes('*')) return pat === h;
    // Convert glob to regex: * -> .*
    const re = new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
    return re.test(h);
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/tests/mutation-gate.test.ts 2>&1 | tail -20`
Expected: PASS for the new `test`.

- [ ] **Step 5: Write the failing test for the gate's `mutationMode: auto` path**

Append to the same file:

```ts
test('evaluateMutationGate allows mutation when mutationMode=auto on configured dev host without env var', () => {
  const result = evaluateMutationGate(
    scope,
    null,                    // no approval
    {},                      // no env guards
    '2026-09-10T01:00:00Z',
    safety,
    undefined,
    'auto',
  );
  assert.deepEqual(result, { allowed: true, reason: 'auto_mode' });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `node --test scripts/tests/mutation-gate.test.ts 2>&1 | tail -20`
Expected: FAIL (current code returns `{ allowed: false, reason: 'PACO_ALLOW_MUTATION=true is required' }`).

- [ ] **Step 7: Modify `evaluateMutationGate()` to accept `mutationMode` and drop env var checks when `auto`**

In `scripts/mutation-gate.ts`:

1. Extend `MutationGateDecision` to add `{ allowed: true; reason: 'auto_mode' }`.
2. Add an optional 7th parameter `mutationMode?: 'auto' | 'manual'`.
3. After the existing host/scope checks (line 67 in the current file), insert:

```ts
if (mutationMode === 'auto') {
  if (requiredClass === 'Destructive') {
    return { allowed: true, reason: 'auto_mode' };
  }
  return { allowed: true, reason: 'auto_mode' };
}
```

4. Replace the host check (line 64) `if (![...safety.allowedHosts, ...safety.externalDevHosts].includes(hostname))` with:

```ts
if (!hostMatchesPattern(hostname, [...safety.allowedHosts, ...safety.externalDevHosts])) {
```

5. Add import: `import { hostMatchesPattern } from './mutation-gate-helpers.js';`

(If you choose to keep env var check for non-auto paths, that is fine — only `auto` skips it. But spec says drop; this plan follows the spec.)

- [ ] **Step 8: Run all mutation-gate tests to verify they pass**

Run: `node --test scripts/tests/mutation-gate.test.ts 2>&1 | tail -30`
Expected: All existing tests still pass, plus the 2 new ones. If any existing test depends on `PACO_ALLOW_MUTATION` blocking, update that test to set `mutationMode: 'manual'` explicitly (do not delete the test).

- [ ] **Step 9: Commit**

```bash
git add scripts/mutation-gate-helpers.ts scripts/mutation-gate.ts scripts/tests/mutation-gate.test.ts
git commit -m "feat(mutation-gate): add wildcard host match and mutationMode=auto path"
```

---

### Task 2: Mutation ledger writer with `source` field

**Files:**
- Create: `scripts/mutation-ledger.ts`
- Create: `scripts/tests/mutation-ledger.test.ts`

**Interfaces:**
- Consumes: `MutationRunScope` (existing)
- Produces:
  - `appendLedgerEntry(ticketKey: string, entry: Omit<LedgerEntry, 'timestamp' | 'ticket_key'>): Promise<void>`
  - `readLedger(ticketKey: string): Promise<LedgerEntry[]>`
  - `LedgerEntry` interface (matching spec section 8)

- [ ] **Step 1: Write the failing test**

`scripts/tests/mutation-ledger.test.ts`:

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appendLedgerEntry, readLedger } from '../mutation-ledger.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoledger-'));
process.env.PACO_TICKET_OUTPUT = tmp;

test('appendLedgerEntry writes a single record per source', async () => {
  await appendLedgerEntry('PAC9-101', { env: 'dev', host: 'blinx.dev.blinxpaco-np.com', skill: 'paco-playwright', action_class: 'Update', target: 'rec-1', scope_ref: 'TC-001', test_data: 'QA-test-rec-1', source: 'manifest', result: 'executed' });
  await appendLedgerEntry('PAC9-101', { env: 'dev', host: 'blinx.dev.blinxpaco-np.com', skill: 'paco-playwright', action_class: 'Update', target: 'rec-2', scope_ref: 'TC-001', test_data: 'QA-test-rec-2', source: 'status', result: 'executed' });
  const entries = await readLedger('PAC9-101');
  assert.equal(entries.length, 2);
  assert.equal(entries[0].source, 'manifest');
  assert.equal(entries[1].source, 'status');
});

rmSync(tmp, { recursive: true, force: true });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/tests/mutation-ledger.test.ts 2>&1 | tail -20`
Expected: FAIL — `mutation-ledger.js` not found.

- [ ] **Step 3: Implement `scripts/mutation-ledger.ts`**

```ts
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface LedgerEntry {
  timestamp: string;
  ticket_key: string;
  env: string;
  host: string;
  skill: string;
  action_class: string;
  target: string;
  scope_ref: string;
  test_data: string;
  source: 'manifest' | 'status';
  result: 'executed' | 'blocked' | 'failed' | 'cleanup-done';
  leftover?: string;
}

function ledgerPath(ticketKey: string): string {
  const base = process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets';
  return join(base, ticketKey, 'mutation-ledger.md');
}

export async function appendLedgerEntry(
  ticketKey: string,
  entry: Omit<LedgerEntry, 'timestamp' | 'ticket_key'>,
): Promise<void> {
  const full: LedgerEntry = { ...entry, timestamp: new Date().toISOString(), ticket_key: ticketKey };
  const p = ledgerPath(ticketKey);
  await mkdir(join(p, '..'), { recursive: true });
  const exists = await readFile(p, 'utf8').catch(() => '');
  if (!exists) await writeFile(p, '# Mutation ledger\n\n| timestamp | ticket | env | host | skill | class | target | scope | data | source | result | leftover |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n');
  await appendFile(p, `| ${full.timestamp} | ${full.ticket_key} | ${full.env} | ${full.host} | ${full.skill} | ${full.action_class} | ${full.target} | ${full.scope_ref} | ${full.test_data} | ${full.source} | ${full.result} | ${full.leftover ?? ''} |\n`);
}

export async function readLedger(ticketKey: string): Promise<LedgerEntry[]> {
  const p = ledgerPath(ticketKey);
  const text = await readFile(p, 'utf8').catch(() => '');
  const lines = text.split('\n').filter((l) => l.startsWith('|') && !l.startsWith('|---') && !l.startsWith('| timestamp'));
  return lines.map((l) => {
    const cells = l.split('|').map((c) => c.trim()).filter(Boolean);
    return {
      timestamp: cells[0],
      ticket_key: cells[1],
      env: cells[2],
      host: cells[3],
      skill: cells[4],
      action_class: cells[5],
      target: cells[6],
      scope_ref: cells[7],
      test_data: cells[8],
      source: cells[9] as 'manifest' | 'status',
      result: cells[10] as LedgerEntry['result'],
      leftover: cells[11] || undefined,
    };
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/tests/mutation-ledger.test.ts 2>&1 | tail -20`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/mutation-ledger.ts scripts/tests/mutation-ledger.test.ts
git commit -m "feat(ledger): add mutation ledger writer with source field"
```

---

### Task 3: `manifest-mutation-mode` writer helper

**Files:**
- Create: `scripts/manifest-mutation-mode.ts`
- Create: `scripts/tests/manifest-mutation-mode.test.ts`

**Interfaces:**
- Consumes: existing `manifest.yaml` (YAML).
- Produces:
  - `setMutationMode(manifestPath: string, mode: 'auto' | 'manual', actor: string): Promise<void>`
  - `readMutationMode(manifestPath: string): Promise<'auto' | 'manual' | null>` — returns `null` if key missing or file unreadable.

- [ ] **Step 1: Write the failing test**

`scripts/tests/manifest-mutation-mode.test.ts`:

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setMutationMode, readMutationMode } from '../manifest-mutation-mode.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacomanifest-'));

test('readMutationMode returns null on missing key', async () => {
  const p = join(tmp, 'm1.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\n');
  assert.equal(await readMutationMode(p), null);
});

test('setMutationMode writes auto with actor and timestamp; preserves other keys', async () => {
  const p = join(tmp, 'm2.yaml');
  writeFileSync(p, 'phase: TEST_DESIGN\nexisting: keep\n');
  await setMutationMode(p, 'auto', 'paco-ticket');
  const after = readFileSync(p, 'utf8');
  assert.match(after, /mutationMode: auto/);
  assert.match(after, /mutationModeSetBy: paco-ticket/);
  assert.match(after, /mutationModeSetAt: \d{4}-\d{2}-\d{2}T/);
  assert.match(after, /existing: keep/);
  assert.equal(await readMutationMode(p), 'auto');
});

test('readMutationMode tolerates malformed manifest (returns null)', async () => {
  const p = join(tmp, 'm3.yaml');
  writeFileSync(p, 'this is: not: valid: yaml: ::\n  oops');
  assert.equal(await readMutationMode(p), null);
});

rmSync(tmp, { recursive: true, force: true });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/tests/manifest-mutation-mode.test.ts 2>&1 | tail -20`
Expected: FAIL — `manifest-mutation-mode.js` not found.

- [ ] **Step 3: Implement `scripts/manifest-mutation-mode.ts`**

```ts
import { readFile, writeFile } from 'node:fs/promises';
import yaml from 'js-yaml';

export type MutationMode = 'auto' | 'manual';

export async function setMutationMode(manifestPath: string, mode: MutationMode, actor: string): Promise<void> {
  const text = await readFile(manifestPath, 'utf8').catch(() => '');
  const data = (yaml.load(text) as Record<string, unknown> | null) ?? {};
  data.mutationMode = mode;
  data.mutationModeSetBy = actor;
  data.mutationModeSetAt = new Date().toISOString();
  await writeFile(manifestPath, yaml.dump(data, { lineWidth: 120, noRefs: true }), 'utf8');
}

export async function readMutationMode(manifestPath: string): Promise<MutationMode | null> {
  const text = await readFile(manifestPath, 'utf8').catch(() => '');
  if (!text) return null;
  try {
    const data = yaml.load(text) as { mutationMode?: unknown } | null;
    const m = data?.mutationMode;
    return m === 'auto' || m === 'manual' ? m : null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/tests/manifest-mutation-mode.test.ts 2>&1 | tail -20`
Expected: PASS for all 3 tests.

- [ ] **Step 5: Verify `js-yaml` is available**

Run: `node -e "import('js-yaml').then(() => console.log('ok'))"`
If missing, run: `npm install --save-dev js-yaml @types/js-yaml`

- [ ] **Step 6: Commit**

```bash
git add scripts/manifest-mutation-mode.ts scripts/tests/manifest-mutation-mode.test.ts package.json package-lock.json
git commit -m "feat(manifest): add mutationMode reader/writer"
```

---

### Task 4: Wire the new gate into `paco-ticket` and `paco-discover` via the manifest writer

**Files:**
- Modify: `.claude/skills/paco-ticket/SKILL.md`
- Modify: `.claude/skills/paco-discover/SKILL.md`
- Create: `scripts/apply-ticket-mutation-mode.ts`
- Create: `scripts/tests/apply-ticket-mutation-mode.test.ts`

**Interfaces:**
- Produces: `applyTicketMutationMode(ticketKey: string, env: 'dev' | string, host: string, actor: 'paco-ticket' | 'paco-discover'): Promise<MutationMode>` — returns the mode that was set.

- [ ] **Step 1: Write the failing test**

`scripts/tests/apply-ticket-mutation-mode.test.ts`:

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyTicketMutationMode } from '../apply-ticket-mutation-mode.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoapply-'));
process.env.PACO_TICKET_OUTPUT = tmp;

test('sets auto when env=dev and host matches wildcard', async () => {
  const m = join(tmp, 'PAC9-200', 'manifest.yaml');
  writeFileSync(m, 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-200', 'dev', 'pac2-8575.dev.blinxpaco-np.com', 'paco-ticket');
  assert.equal(result, 'auto');
});

test('sets manual when env is not dev', async () => {
  const m = join(tmp, 'PAC9-201', 'manifest.yaml');
  writeFileSync(m, 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-201', 'prod', 'blinx.example.com', 'paco-ticket');
  assert.equal(result, 'manual');
});

test('sets manual when host not in allowlist', async () => {
  const m = join(tmp, 'PAC9-202', 'manifest.yaml');
  writeFileSync(m, 'phase: INGEST\n');
  const result = await applyTicketMutationMode('PAC9-202', 'dev', 'evil.example.com', 'paco-ticket');
  assert.equal(result, 'manual');
});

rmSync(tmp, { recursive: true, force: true });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/tests/apply-ticket-mutation-mode.test.ts 2>&1 | tail -20`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `scripts/apply-ticket-mutation-mode.ts`**

```ts
import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';
import { join } from 'node:path';
import { hostMatchesPattern } from './mutation-gate-helpers.js';
import { setMutationMode, type MutationMode } from './manifest-mutation-mode.js';

export async function applyTicketMutationMode(
  ticketKey: string,
  env: string,
  host: string,
  actor: 'paco-ticket' | 'paco-discover',
): Promise<MutationMode> {
  const base = process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets';
  const manifestPath = join(base, ticketKey, 'manifest.yaml');
  const cfgText = await readFile('paco.config.yaml', 'utf8');
  const cfg = yaml.load(cfgText) as { safety: { mutationEnabledEnvironments: string[]; allowedHosts: string[]; externalDevHosts: string[] } };
  const onDev = cfg.safety.mutationEnabledEnvironments.includes(env);
  const onHost = hostMatchesPattern(host, [...cfg.safety.allowedHosts, ...cfg.safety.externalDevHosts]);
  const mode: MutationMode = onDev && onHost ? 'auto' : 'manual';
  await setMutationMode(manifestPath, mode, actor);
  return mode;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test scripts/tests/apply-ticket-mutation-mode.test.ts 2>&1 | tail -20`
Expected: PASS for all 3 cases.

- [ ] **Step 5: Update `paco-ticket/SKILL.md` to call the helper at intake**

In the `## Workflow` section of `.claude/skills/paco-ticket/SKILL.md`, add a step between current step 1 and step 2:

```text
1a. Read `paco.config.yaml` for `safety.allowedHosts` and `safety.externalDevHosts`; call `applyTicketMutationMode(ticketKey, env, host, 'paco-ticket')` to stamp `mutationMode` into `manifest.yaml` before any child skill runs. If the host is unknown at intake, default to `manual` and re-evaluate when the child first reports URL.
```

Add a new section before `## Safety`:

```text
## Mutation Mode

Read `manifest.yaml:mutationMode` before any side effect. If `auto`:
- Skip all approval prompts and skip the legacy `PACO_ALLOW_MUTATION` / `PACO_ALLOW_DESTRUCTIVE` env var checks for this ticket.
- Still enforce: hostname matches allowlist, safe test data (no real PII), recipient is approved, SMS requires explicit tester confirmation, production/unknown host is blocked, and ledger is written.
- If both `manifest.yaml:mutationMode=auto` and `status.md:Mutation Policy=APPROVED` exist, prefer manifest and record ledger `source=manifest` once.

If `manual` or missing: legacy behavior — ask the tester per case.
```

Replace the existing `## Safety` paragraph that mentions `evaluateMutationGate()` with:

```text
## Safety

Auto-mutation only on configured dev hosts via `mutationMode: auto` in `manifest.yaml`. Still enforce `evaluateMutationGate()` (with `mutationMode` param), runtime guards, safe data/recipient, redacted ledger and cleanup. Production/unknown host remains blocked. Never persist credentials, auth state or reusable approval.
```

- [ ] **Step 6: Update `paco-discover/SKILL.md` similarly**

In `.claude/skills/paco-discover/SKILL.md`, replace the line that says "Không tự bật `PACO_ALLOW_MUTATION`/`PACO_ALLOW_DESTRUCTIVE`" with:

```text
- Auto-mutation is enabled by `mutationMode: auto` in the discovery task's `manifest.yaml`, written by `applyTicketMutationMode()`. Do not edit env vars or write `manifest.yaml` directly. External authorization from tester is still required for destructive mutations and SMS.
```

Add `## Mutation Mode` section after `## Scope` matching the same contract as `paco-ticket`.

- [ ] **Step 7: Commit**

```bash
git add scripts/apply-ticket-mutation-mode.ts scripts/tests/apply-ticket-mutation-mode.test.ts .claude/skills/paco-ticket/SKILL.md .claude/skills/paco-discover/SKILL.md
git commit -m "feat(skills): wire mutationMode into paco-ticket and paco-discover intake"
```

---

### Task 5: Update phase skills to read `mutationMode` and stop asking

**Files:**
- Modify: `.claude/skills/paco-playwright/SKILL.md`
- Modify: `.claude/skills/paco-explore/SKILL.md`
- Modify: `.claude/skills/paco-verify-flow/SKILL.md`
- Modify: `.claude/skills/paco-test-design/SKILL.md`
- Modify: `.claude/skills/paco-requirements/SKILL.md`
- Modify: `.claude/skills/paco-report/SKILL.md`

- [ ] **Step 1: In each of the 6 files above, add a `## Mutation Mode` section** (verbatim from Task 4 Step 5) and remove any sentence that says "không tự bật" or "guard từ ngoài" or "phải hỏi tester trước" for non-SMS, non-PII, non-production cases.

- [ ] **Step 2: In `paco-playwright/SKILL.md` mode `cli`, replace the sentence "Vẫn bắt buộc hostname-aware `evaluateMutationGate()`, `PACO_ALLOW_MUTATION=true`, destructive guard riêng" with:

```text
Pass `mutationMode` (read from `manifest.yaml`) into `evaluateMutationGate()`. When `auto`, the gate skips the legacy env var checks; otherwise it requires `PACO_ALLOW_MUTATION=true` and `PACO_ALLOW_DESTRUCTIVE=true` for destructive actions as before.
```

- [ ] **Step 3: In `paco-verify-flow/SKILL.md`, replace the section that requires `PACO_ALLOW_MUTATION=true` check with the same pattern.** The reservation model from tester still gates destructive mutations and SMS, but the env var check inside `evaluateMutationGate()` is now bypassed when `auto`.

- [ ] **Step 4: Static scan — confirm no file still contains `PACO_ALLOW_MUTATION` or `PACO_ALLOW_DESTRUCTIVE` in a way that says "must be set by tester"** (warnings about destructive guard, when manual mode is in effect, are OK).

Run: `grep -RIn "PACO_ALLOW_MUTATION\|PACO_ALLOW_DESTRUCTIVE" .claude/skills/`
Expected: only one or zero hits, and any hit must say "when manual mode, the agent must set env var" — not "the tester must set".

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/paco-playwright/SKILL.md .claude/skills/paco-explore/SKILL.md .claude/skills/paco-verify-flow/SKILL.md .claude/skills/paco-test-design/SKILL.md .claude/skills/paco-requirements/SKILL.md .claude/skills/paco-report/SKILL.md
git commit -m "docs(skills): document mutationMode contract and drop env var prompting"
```

---

### Task 6: Add wildcard comment to `paco.config.yaml` and run full test suite

**Files:**
- Modify: `paco.config.yaml`

- [ ] **Step 1: Add a comment under `safety:` block**

```yaml
safety:
  # Hostnames use exact match or `*` wildcard on a single segment
  # (e.g. `*.blinxpaco-np.com` matches `pac2-8575.dev.blinxpaco-np.com`).
  # Production hosts are expected NOT to contain `-np`; review if that changes.
  mutationEnabledEnvironments: [dev]
  allowedHosts: [...]
  externalDevHosts: [...]
```

(Do not change the array values.)

- [ ] **Step 2: Run the full test suite**

Run: `node --test scripts/tests/*.test.ts 2>&1 | tail -40`
Expected: all PASS, including:
- `mutation-gate.test.ts` (existing + new wildcard + new auto-mode cases)
- `mutation-ledger.test.ts` (new)
- `manifest-mutation-mode.test.ts` (new)
- `apply-ticket-mutation-mode.test.ts` (new)
- All previously existing tests (`discovery-safety.test.ts`, `paco-discover.test.ts`, `synthetic-workflow.test.ts`)

- [ ] **Step 3: Verify the gate from a manual scratch call**

```bash
node -e "
import('./scripts/mutation-gate.js').then(async ({ evaluateMutationGate }) => {
  const result = evaluateMutationGate(
    { run_id: 'r1', environment: 'dev', current_url: 'https://pac2-8575.dev.blinxpaco-np.com/path', ticket_key: 'PAC9-300', case_id: 'TC-1', action: 'Click', test_data_fingerprint: 'fp', mutation_class: 'Persistent' },
    null, {}, new Date().toISOString(),
    { mutationEnabledEnvironments: ['dev'], allowedHosts: ['*.blinxpaco-np.com'], externalDevHosts: [] },
    undefined, 'auto',
  );
  console.log(JSON.stringify(result));
});
"
```
Expected: `{"allowed":true,"reason":"auto_mode"}`

- [ ] **Step 4: Commit**

```bash
git add paco.config.yaml
git commit -m "docs(config): document wildcard host syntax in safety block"
```

---

### Task 7: End-to-end scenario check on a real ticket

**Files:** none — manual scenario per spec section 10.2.

- [ ] **Step 1: Pick a low-risk ticket from `docs/tickets/` that has dev host in scope** (e.g. `PAC2-4700` if applicable; ask the tester if unsure).

- [ ] **Step 2: Run `paco-ticket <ticket>` and confirm at intake it writes `mutationMode: auto` to `manifest.yaml`**

Verify by reading the manifest after the intake step.

- [ ] **Step 3: Run one `MANUAL_EXECUTE` case that has a `click Save` step.** Confirm: no prompt for mutation; ledger gains 1 entry with `source=manifest`; `manifest.yaml` still says `auto` after the run.

- [ ] **Step 4: Negative case: temporarily edit the ticket's `manifest.yaml` to `mutationMode: manual` and rerun the same case.** Confirm: gate returns `manual` decision (or the agent asks before clicking). Restore the file to `auto`.

- [ ] **Step 5: Negative case: run a test whose URL points to a host not in the allowlist** (use a hardcoded `current_url` in a unit test if no real browser). Confirm: gate returns `{ allowed: false, reason: 'Mutation blocked outside configured dev hosts' }`.

- [ ] **Step 6: Update `status.md` of the ticket** with a short note: `mutationMode verified on <date> by <tester>`, and link to the mutation ledger entry.

- [ ] **Step 7: Commit any files that changed during the scenario**

```bash
git add docs/tickets/<ticket>/manifest.yaml docs/tickets/<ticket>/status.md docs/tickets/<ticket>/mutation-ledger.md
git commit -m "test(ticket): verify mutationMode=auto on <ticket>"
```

---

## Self-Review

**1. Spec coverage:**
- §3 (Ranh giới): Task 1+4 enforce env=dev + allowlist + scope + PII gate.
- §4 (Phạm vi 7 skill): Tasks 4+5 patch all 7 SKILL.md.
- §5 (Sơ đồ): The plan produces behavior matching the diagram (gates then auto-run, then ledger). Mermaid itself lives in spec.
- §6.1 (manifest inject): Task 3+4.
- §6.2 (skill con read): Task 5.
- §6.3 (tương thích ngược): `status.md: APPROVED` path preserved — `paco-mutation-approval-pattern.md` is unchanged; spec section 6.3 says the gate falls back. Task 5 step 1+2 keeps the fallback wording.
- §7 (runtime guard wildcard): Task 1.
- §8 (ledger with source): Task 2.
- §9 (cleanup): Not gated by mutation mode; existing skills already require cleanup. No new task needed.
- §10 (acceptance): Task 6 step 2 (tests) + Task 4 step 4 (static scan).
- §12 (open questions): Acknowledged; not blockers. Decision deferred to implementation per spec.

**2. Step scan:** No TBD. Every step has a runnable check or a single concrete action.

**3. Type consistency:** `MutationMode = 'auto' | 'manual'` defined once in `manifest-mutation-mode.ts`, re-exported and reused. `LedgerEntry.source` matches spec exactly.

**4. Review focus:** Items 1-5 are pinned in tests: Task 1 step 1 covers item 2; Task 4 step 1 covers item 3; Task 2 step 1 covers item 5; item 1 (subpath) is implicitly covered because host check is host-only. Item 4 (race) is partially covered by `readMutationMode` returning `null` on missing key (Task 3 step 1 test 1).

**5. Proportion:** Plan is shorter than the spec; the longest blocks are code listings, which is appropriate because TypeScript signatures need to be exact.
