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

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});