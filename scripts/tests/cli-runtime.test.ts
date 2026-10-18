// Plan: paco-cli runtime wiring for CLI-first execution.
// Covers (no browser required):
//   1. runCase rejects mcp_first tickets
//   2. runCase rejects missing automation spec
//   3. runBatch aggregates summary counts from synthetic run output
//   4. write-back persists execution.runs into the manifest
//   5. Map+classify: passed JSON maps to Pass/Matched; failed locator error
//      maps to Fail/Automation defect; auth error maps to Blocked/Setup failure
//
// Steps requiring real browser (tester-side manual auth + actual Playwright run)
// are out of scope here.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCase, runBatch } from '../paco-cli.js';
import { createManifest, loadManifest, saveManifest } from '../manifest-utils.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacocli-'));
process.env.PACO_TICKET_OUTPUT = tmp;

const now = '2026-10-17T00:00:00.000Z';
const ticket = { key: 'PAC9-800', folder_name: 'PAC9-800-cli', source_directory: 'ticket/PAC9-800-cli', primary_source: 'ticket.md' };

async function writeCliFirstManifest(ticketKey: string, cases: Array<{ id: string; specPath: string | null }>, mode: 'cli_first' | 'mcp_first' = 'cli_first'): Promise<string> {
  const p = join(tmp, ticketKey, 'manifest.yaml');
  const manifest = createManifest({ ...ticket, key: ticketKey, folder_name: `${ticketKey}-cli` }, { revision: 1, generated_at: now, files: [] }, now);
  manifest.execution.mode = mode;
  manifest.execution.case_ids = cases.map((c) => c.id);
  for (const c of cases) {
    if (c.specPath !== null) {
      manifest.execution.automation[c.id] = { spec_path: c.specPath, diagnostic: false, reason: null, input_revision: 1 };
    }
  }
  await saveManifest(p, manifest);
  return p;
}

test('runCase rejects mcp_first ticket', async () => {
  const ticketKey = 'PAC9-800';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-800-TC-1.spec.ts' }], 'mcp_first');
  await assert.rejects(
    runCase({ ticketKey, caseId: 'TC-1' }),
    /not cli_first/,
  );
});

test('runCase rejects missing automation spec', async () => {
  const ticketKey = 'PAC9-801';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: null }]);
  await assert.rejects(
    runCase({ ticketKey, caseId: 'TC-1' }),
    /spec_path is missing/,
  );
});

test('runBatch skips cases without automation spec_path', async () => {
  const ticketKey = 'PAC9-802';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: null }]);
  const out = await runBatch({ ticketKey });
  assert.equal(out.summary.total, 0);
  assert.equal(out.summary.pass, 0);
  assert.deepEqual(out.runs, {});
});

test('write-back persists execution.runs into the manifest', async () => {
  const ticketKey = 'PAC9-803';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-803-TC-1.spec.ts' }]);
  const fakeRunner = async () => ({
    stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'passed' }] }] }] }] }),
    stderr: '',
    exitCode: 0,
  });
  const before = await loadManifest(join(tmp, ticketKey, 'manifest.yaml'));
  assert.equal(before.execution.runs['TC-1'], undefined);
  const out = await runBatch({ ticketKey, writeBack: true }, now, fakeRunner);
  assert.ok(out.runs['TC-1'], 'run recorded for TC-1');
  assert.equal(out.summary.pass, 1);
  const after = await loadManifest(join(tmp, ticketKey, 'manifest.yaml'));
  assert.ok(after.execution.runs['TC-1'], 'manifest has TC-1 run after write-back');
  assert.equal(after.execution.runs['TC-1'].product_result_changed, false);
  assert.equal(after.execution.runs['TC-1'].result, 'Pass');
  assert.equal(after.execution.runs['TC-1'].verification, 'Matched product result');
});

test('classifies locator failure as Automation defect', async () => {
  const ticketKey = 'PAC9-804';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-804-TC-1.spec.ts' }]);
  const fakeRunner = async () => ({
    stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'failed', error: { message: 'locator getByRole(button:Save) resolved to multiple elements' } }] }] }] }] }),
    stderr: '',
    exitCode: 1,
  });
  const out = await runBatch({ ticketKey, writeBack: true }, now, fakeRunner);
  assert.equal(out.runs['TC-1'].result, 'Fail');
  assert.equal(out.runs['TC-1'].verification, 'Automation defect');
});

test('classifies auth failure as Setup or authentication failure', async () => {
  const ticketKey = 'PAC9-805';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-805-TC-1.spec.ts' }]);
  const fakeRunner = async () => ({
    stdout: '',
    stderr: 'Error: auth session expired (401)',
    exitCode: 1,
  });
  const out = await runBatch({ ticketKey, writeBack: true }, now, fakeRunner);
  assert.equal(out.runs['TC-1'].result, 'Fail');
  assert.equal(out.runs['TC-1'].verification, 'Setup or authentication failure');
});

// ─── New (plan §3) ──────────────────────────────────────────────────────────

test('diagnostic loop records up to 4 attempts across same/clean/fresh_session/control', async () => {
  const ticketKey = 'PAC9-810';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-810-TC-1.spec.ts' }]);
  let attempt = 0;
  const fakeRunner = async () => {
    attempt += 1;
    if (attempt <= 3) return { stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'failed' }] }] }] }] }), stderr: '', exitCode: 1 };
    return { stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'passed' }] }] }] }] }), stderr: '', exitCode: 0 };
  };
  const out = await runBatch({ ticketKey, diagnose: true, writeBack: true }, now, fakeRunner);
  const diag = out.runs['TC-1'].diagnostic_attempts;
  assert.ok(diag, 'diagnostic_attempts should be present');
  assert.equal(diag.length, 4, 'four attempts should run when first three fail');
  assert.deepEqual(diag.map((a) => a.data_variant), ['same', 'clean', 'fresh_session', 'control']);
  assert.equal(diag[0].result, 'Fail');
  assert.equal(diag[3].result, 'Pass');
  for (const item of diag) {
    assert.ok(item.evidence.length >= 1);
    assert.ok(item.evidence[0].includes(item.data_variant));
  }
});

test('diagnostic loop stops early on first Pass', async () => {
  const ticketKey = 'PAC9-811';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-811-TC-1.spec.ts' }]);
  const fakeRunner = async () => ({ stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'passed' }] }] }] }] }), stderr: '', exitCode: 0 });
  const out = await runBatch({ ticketKey, diagnose: true }, now, fakeRunner);
  const diag = out.runs['TC-1'].diagnostic_attempts!;
  assert.equal(diag.length, 1);
  assert.equal(diag[0]?.data_variant, 'same');
  assert.equal(diag[0]?.result, 'Pass');
});

test('manual vs CLI mismatch sets Product behavior mismatch', async () => {
  const ticketKey = 'PAC9-812';
  const p = await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-812-TC-1.spec.ts' }]);
  // Pre-seed manual result so compareToManual emits Product behavior mismatch.
  const manifest = await loadManifest(p);
  manifest.execution.manual['TC-1'] = { result: 'Pass', expected_basis: 'Confirmed', control_path_checked: false, route: '/paco/dashboard', locators: [], attempts: [], skip_or_block_reason: null };
  await saveManifest(p, manifest);
  const fakeRunner = async () => ({ stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'failed' }] }] }] }] }), stderr: '', exitCode: 1 });
  const out = await runBatch({ ticketKey, writeBack: true }, now, fakeRunner);
  assert.equal(out.runs['TC-1'].result, 'Fail');
  assert.equal(out.runs['TC-1'].verification, 'Product behavior mismatch');
});

test('mutation class Temporary with auto mode appends to ledger and keeps verification', async () => {
  const ticketKey = 'PAC9-813';
  const p = await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-813-TC-1.spec.ts' }]);
  const manifest = await loadManifest(p);
  // ponytail: mutation_class is an optional property on the automation entry;
  // validateManifest does not reject unknown keys, so reading is safe.
  (manifest.execution.automation['TC-1'] as { mutation_class?: string }).mutation_class = 'Temporary';
  await saveManifest(p, manifest);
  const { setMutationMode } = await import('../manifest-mutation-mode.js');
  await setMutationMode(p, 'auto', 'test');
  const fakeRunner = async () => ({ stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'passed' }] }] }] }] }), stderr: '', exitCode: 0 });
  const out = await runBatch({ ticketKey, writeBack: true, env: 'dev', host: 'blinx.dev.blinxpaco-np.com' }, now, fakeRunner);
  assert.equal(out.runs['TC-1'].result, 'Pass');
  assert.equal(out.runs['TC-1'].verification, 'Matched product result');
  const { readLedger } = await import('../mutation-ledger.js');
  const entries = await readLedger(ticketKey);
  assert.equal(entries.length, 1, 'one ledger entry should be appended');
  assert.equal(entries[0].source, 'manifest');
  assert.equal(entries[0].action_class, 'Temporary');
  assert.equal(entries[0].target, 'playwright/tests/tickets/PAC9-813-TC-1.spec.ts');
});

test('loadConfig base URL is propagated to RunnerContext child env', async () => {
  const ticketKey = 'PAC9-814';
  await writeCliFirstManifest(ticketKey, [{ id: 'TC-1', specPath: 'playwright/tests/tickets/PAC9-814-TC-1.spec.ts' }]);
  // Inject a Runner-shaped fake directly so we can capture RunnerContext.
  const { runCaseRuntime } = await import('../paco-cli-runtime.js');
  let captured: Record<string, string> | undefined;
  const fakeRunner = async (ctx: { childEnv: Record<string, string> }) => {
    captured = ctx.childEnv;
    return { stdout: JSON.stringify({ suites: [{ specs: [{ title: 'TC-1', tests: [{ results: [{ status: 'passed' }] }] }] }] }), stderr: '', exitCode: 0 };
  };
  await runCaseRuntime({ ticketKey, caseId: 'TC-1' }, { now, runner: fakeRunner as never });
  assert.ok(captured, 'runner should have been called with context');
  assert.match(captured!.BASE_URL, /^https?:\/\//);
  assert.ok(typeof captured!.PACO_ALLOWED_HOSTS === 'string' && captured!.PACO_ALLOWED_HOSTS.length > 0);
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});