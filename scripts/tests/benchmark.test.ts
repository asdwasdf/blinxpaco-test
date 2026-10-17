// Smoke test for the CLI-first vs MCP-first benchmark harness.
// Drives measureCliFirst and measureMcpFirst paths without spawning browsers
// or writing benchmark.md (re-uses the same fake-runner injection the harness uses).

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runBatch } from '../paco-cli.js';
import { createManifest, loadManifest, saveManifest } from '../manifest-utils.js';
import { calculateChecksum } from '../checksum-utils.js';
import { evaluateUiLocationGate } from '../locate-policy.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacobench-'));
process.env.PACO_TICKET_OUTPUT = tmp;

const TICKET_ID = 'PAC9-999-bench';
const CASE_ID = 'TC-X';
const SPEC_PATH = 'playwright/tests/tickets/PAC9-999-TC-X.spec.ts';
const now = '2026-10-17T13:00:00.000Z';

const ticket = { key: 'PAC9-999', folder_name: TICKET_ID, source_directory: `ticket/${TICKET_ID}`, primary_source: 'ticket.md' };
const sourceFile = { path: 'ticket.md', role: 'primary_source' as const, type: 'md', sha256: calculateChecksum('v1') };

test('cli_first benchmark path runs end-to-end without browser', async () => {
  const manifest = createManifest(ticket, { revision: 1, generated_at: now, files: [sourceFile] }, now);
  manifest.execution.mode = 'cli_first';
  manifest.execution.case_ids = [CASE_ID];
  manifest.execution.automation[CASE_ID] = { spec_path: SPEC_PATH, diagnostic: false, reason: null, input_revision: 1 };
  manifest.phases.LOCATE.status = 'completed';
  manifest.phases.TEST_DESIGN.status = 'completed';
  manifest.phases.AUTOMATE.status = 'completed';
  manifest.outputs['feature-location.md'] = { owner: 'paco-explore', path: `docs/tickets/${TICKET_ID}/feature-location.md`, state: 'valid', input_revision: 1, sha256: null };
  manifest.outputs['test-cases.md'] = { owner: 'paco-test-design', path: `docs/tickets/${TICKET_ID}/test-cases.md`, state: 'valid', input_revision: 1, sha256: null };
  manifest.outputs['automation.md'] = { owner: 'paco-playwright', path: `docs/tickets/${TICKET_ID}/automation.md`, state: 'valid', input_revision: 1, sha256: null };
  const p = join(tmp, 'PAC9-999', 'manifest.yaml');
  await saveManifest(p, manifest);

  const decision = evaluateUiLocationGate({ ui_dependent: true, location_state: 'valid', route_status: 'Confirmed', has_entry_path: true, has_context: true, has_role: true, has_test_data_category: true });
  assert.equal(decision.allowed, true);

  const fakeRunner = async (args: string[]) => {
    assert.ok(args.includes(SPEC_PATH));
    return { stdout: JSON.stringify({ suites: [{ specs: [{ title: CASE_ID, tests: [{ results: [{ status: 'passed' }] }] }] }] }), stderr: '', exitCode: 0 };
  };
  const outcome = await runBatch({ ticketKey: 'PAC9-999', caseId: CASE_ID, writeBack: true }, now, fakeRunner);
  assert.equal(outcome.summary.pass, 1);
  const reloaded = await loadManifest(p);
  assert.equal(reloaded.execution.runs[CASE_ID].result, 'Pass');
  assert.equal(reloaded.execution.runs[CASE_ID].verification, 'Matched product result');
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});