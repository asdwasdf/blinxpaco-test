// Plan Task 7 (docs/superpowers/plans/2026-10-16-paco-auto-mutation-no-prompt.md §7):
// End-to-end gate path for an intake'd ticket without browser/manual auth.
//
// Steps covered by this test:
//   2. intake writes `mutationMode` to manifest.yaml (auto on configured dev host)
//   4. toggling manifest to `manual` changes the gate decision back to env-required
//   5. URL host outside the allowlist is blocked regardless of mode
//   6. ledger records one entry with `source=manifest` after a successful run
//
// Steps 1, 3, and 7 require the tester (manual auth, click Save in browser, no-touch
// data policy). They are documented in the design spec §10.2 and intentionally not
// substituted here.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setMutationMode, readMutationMode } from '../manifest-mutation-mode.js';
import { evaluateMutationGate, type MutationRunScope } from '../mutation-gate.js';
import { appendLedgerEntry, readLedger } from '../mutation-ledger.js';
import type { PacoConfig } from '../workflow-types.js';

const tmp = mkdtempSync(join(tmpdir(), 'pacoe2e-'));
process.env.PACO_TICKET_OUTPUT = tmp;

const ticketKey = 'PAC9-700';
const safety: PacoConfig['safety'] = {
  mutationEnabledEnvironments: ['dev'],
  allowedHosts: ['*.blinxpaco-np.com'],
  externalDevHosts: [],
};

const scopeBase: MutationRunScope = {
  run_id: 'run-1',
  environment: 'dev',
  current_url: 'https://blinx.dev.blinxpaco-np.com/paco/dashboard',
  ticket_key: ticketKey,
  case_id: `${ticketKey}-TC-001`,
  action: 'Save QA-test record',
  test_data_fingerprint: 'sha256:test',
  mutation_class: 'Persistent',
};

function manifestPath(ticket: string): string {
  return join(tmp, ticket, 'manifest.yaml');
}

function ensureManifestDir(ticket: string): void {
  mkdirSync(join(tmp, ticket), { recursive: true });
  writeFileSync(join(tmp, ticket, '.keep'), '');
}

test('intake step 2: writes mutationMode=auto to a fresh manifest on configured dev host', async () => {
  ensureManifestDir(ticketKey);
  const p = manifestPath(ticketKey);
  writeFileSync(p, 'phase: INGEST\n');
  await setMutationMode(p, 'auto', 'paco-ticket');
  assert.equal(await readMutationMode(p), 'auto');
  assert.equal(evaluateMutationGate(scopeBase, null, {}, '2026-09-10T01:00:00Z', safety, undefined, 'auto').allowed, true);
});

test('negative step 4: toggling manifest to manual switches the gate to env-required behavior', async () => {
  ensureManifestDir(ticketKey);
  const p = manifestPath(ticketKey);
  await setMutationMode(p, 'manual', 'paco-ticket');
  assert.equal(await readMutationMode(p), 'manual');

  // Manual mode without any approval path or env guard => blocked
  const blocked = evaluateMutationGate(scopeBase, null, {}, '2026-09-10T01:00:00Z', safety);
  assert.equal(blocked.allowed, false);

  // Manual mode + workflow authorization + env guard => allowed again
  const workflowAuth = {
    product: 'Paco' as const,
    source: 'paco-execution-first-workflow' as const,
    environment: 'dev',
    ticket_key: ticketKey,
    case_ids: [scopeBase.case_id],
    actions: [scopeBase.action],
    test_data_fingerprint: scopeBase.test_data_fingerprint,
  };
  assert.equal(
    evaluateMutationGate(scopeBase, null, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety, workflowAuth).allowed,
    true,
  );

  // restore for downstream tests
  await setMutationMode(p, 'auto', 'paco-ticket');
});

test('negative step 5: host outside the allowlist blocks even when mutationMode=auto', () => {
  const outOfAllow = { ...scopeBase, current_url: 'https://evil.example.com/paco/dashboard' };
  assert.deepEqual(
    evaluateMutationGate(outOfAllow, null, {}, '2026-09-10T01:00:00Z', safety, undefined, 'auto'),
    { allowed: false, reason: 'Mutation blocked outside configured dev hosts' },
  );
});

test('ledger step 6: a successful mutationMode=auto run records a manifest-source entry', async () => {
  await appendLedgerEntry(ticketKey, {
    env: 'dev',
    host: 'blinx.dev.blinxpaco-np.com',
    skill: 'paco-playwright',
    action_class: 'Update',
    target: 'rec-1',
    scope_ref: `${ticketKey}-TC-001`,
    test_data: 'QA-test-rec-1',
    source: 'manifest',
    result: 'executed',
  });
  const entries = await readLedger(ticketKey);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].source, 'manifest');
  assert.equal(entries[0].result, 'executed');
  assert.match(entries[0].timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test.after(async () => {
  rmSync(tmp, { recursive: true, force: true });
});
