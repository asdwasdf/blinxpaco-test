import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appendLedgerEntry, readLedger } from '../mutation-ledger.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoledger-'));
process.env.PACO_TICKET_OUTPUT = tmp;

test('appendLedgerEntry creates file and writes entries with source field', async () => {
  await appendLedgerEntry('PAC9-101', {
    env: 'dev', host: 'blinx.dev.blinxpaco-np.com', skill: 'paco-playwright',
    action_class: 'Update', target: 'rec-1', scope_ref: 'TC-001',
    test_data: 'QA-test-rec-1', source: 'manifest', result: 'executed',
  });
  await appendLedgerEntry('PAC9-101', {
    env: 'dev', host: 'blinx.dev.blinxpaco-np.com', skill: 'paco-playwright',
    action_class: 'Update', target: 'rec-2', scope_ref: 'TC-001',
    test_data: 'QA-test-rec-2', source: 'status', result: 'executed',
  });
  const entries = await readLedger('PAC9-101');
  assert.equal(entries.length, 2);
  assert.equal(entries[0].source, 'manifest');
  assert.equal(entries[1].source, 'status');
  assert.equal(entries[0].result, 'executed');
  assert.match(entries[0].timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test('readLedger returns empty array for unknown ticket', async () => {
  const entries = await readLedger('PAC9-DOES-NOT-EXIST');
  assert.deepEqual(entries, []);
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});
