import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { calculateChecksum } from '../checksum-utils.js';
import { createDiscoveryCheckpoint, createDiscoveryTask, fingerprintDiscoveryState, startDiscoveryTask, type DiscoveryCandidate } from '../discovery-planner.js';
import { reserveDiscoveryMutation } from '../discovery-state.js';
import { applyDiscoveryOutcome, validateDiscoveryChildOutcome, verifyDiscoveryArtifacts, type DiscoveryChildOutcome } from '../discovery-outcome.js';

const dashboard = 'https://blinx.dev.blinxpaco-np.com/paco/dashboard';
const observedState = { role: 'Tester', url: dashboard, heading: 'Dashboard', tab: '', overlay: '', context: '', variant: 'populated' };
const membersState = { ...observedState, url: 'https://blinx.dev.blinxpaco-np.com/paco/members', heading: 'Members' };

function setup() {
  const checkpoint = createDiscoveryCheckpoint('run-1', 'dev', 'Tester', dashboard, 0);
  const task = startDiscoveryTask(checkpoint, 0)!;
  const outcome: DiscoveryChildOutcome = {
    schema_version: 1, outcome_id: 'O1', mode: 'SURVEY', run_id: 'run-1', environment: 'dev', role: 'Tester', task_id: task.id,
    checkpoint_revision: 0, outcome: 'completed', auth_expired: false,
    observed_states: [{ state: observedState, evidence: ['E1'] }], evidence: ['E1'],
    relationships: [{ id: 'R1', from: fingerprintDiscoveryState(observedState), to: fingerprintDiscoveryState(membersState), trigger: 'Members', relationship: 'navigation', context: [], classification: 'Observed', mutation_boundary: false, evidence: ['E1'], role: 'Tester', environment: 'dev', observed_at: '2026-10-01T00:00:00Z' }],
    new_tasks: [createDiscoveryTask({ state: membersState, action: 'Open Members', category: 'module', provenance: { kind: 'evidence', ref: 'E1' } })],
    candidates: [], gaps: [], artifacts: [], blockers: [], mutation: null, sensitive_data: { detected: false, redacted: false },
  };
  return { checkpoint, task, outcome };
}
const expected = (task: { id: string }) => ({ run_id: 'run-1', environment: 'dev', role: 'Tester', task_id: task.id, revision: 0 });

test('rejects outcomes for another run, role, task or revision', () => {
  const { task, outcome } = setup();
  assert.equal(validateDiscoveryChildOutcome(outcome, expected(task)).ok, true);
  for (const patch of [{ run_id: 'x' }, { role: 'x' }, { task_id: 'x' }, { checkpoint_revision: 3 }, { mode: 'LOCATE' }]) {
    assert.equal(validateDiscoveryChildOutcome({ ...outcome, ...patch } as DiscoveryChildOutcome, expected(task)).ok, false);
  }
});

test('SURVEY cannot report mutation or verified-by-mutation edges', () => {
  const { task, outcome } = setup();
  const mutation = { reservation_id: 'M-1', status: 'observed' as const, after: 'S2', evidence: ['E2'], cleanup: 'not_required' as const, leftovers: [] };
  assert.equal(validateDiscoveryChildOutcome({ ...outcome, mutation }, expected(task)).ok, false);
  const verified = { ...outcome.relationships[0], classification: 'Verified-by-Mutation' as const };
  assert.equal(validateDiscoveryChildOutcome({ ...outcome, relationships: [verified] }, expected(task)).ok, false);
  assert.equal(validateDiscoveryChildOutcome({ ...outcome, sensitive_data: { detected: true, redacted: false } }, expected(task)).ok, false);
});

test('VERIFY_FLOW verified edge requires observed finalized reservation', () => {
  const { checkpoint, task, outcome } = setup();
  const candidate: DiscoveryCandidate = { id: 'MF-1', task_id: task.id, source_state: 'S1', action: 'Create', mutation_class: 'CREATE', persistence: 'Persistent', reason: 'r', evidence: ['E1'], test_data_fingerprint: 'd', ownership_ref: 'run-1/o', status: 'pending' };
  const reservation = reserveDiscoveryMutation(checkpoint, candidate, 'digest');
  const verified = { ...outcome.relationships[0], classification: 'Verified-by-Mutation' as const, reservation_id: reservation.id };
  const base = { ...outcome, mode: 'VERIFY_FLOW' as const, relationships: [verified] };
  const ctx = { ...expected(task), reservation_id: reservation.id };
  assert.equal(validateDiscoveryChildOutcome({ ...base, mutation: { reservation_id: reservation.id, status: 'indeterminate', evidence: ['E2'], cleanup: 'pending', leftovers: [] } }, ctx).ok, false);
  assert.equal(validateDiscoveryChildOutcome({ ...base, mutation: null }, ctx).ok, false);
  const observed = { ...base, mutation: { reservation_id: reservation.id, status: 'observed' as const, after: 'S2', evidence: ['E2'], cleanup: 'not_required' as const, leftovers: [] } };
  assert.equal(validateDiscoveryChildOutcome(observed, ctx).ok, true);
  applyDiscoveryOutcome(checkpoint, observed);
  assert.equal(checkpoint.mutations[0].status, 'observed');
});

test('apply is idempotent, records states and enqueues grounded tasks', () => {
  const { checkpoint, outcome } = setup();
  applyDiscoveryOutcome(checkpoint, outcome);
  assert.equal(checkpoint.current_task, null);
  assert.equal(checkpoint.visited_states.length, 1);
  assert.equal(checkpoint.queue.filter(t => t.status === 'queued').length, 1);
  assert.equal(checkpoint.queue[0].status, 'explored');
  const snapshot = JSON.stringify(checkpoint);
  applyDiscoveryOutcome(checkpoint, outcome);
  assert.equal(JSON.stringify(checkpoint), snapshot);
});

test('auth expiry pauses run and requeues task without counting states', () => {
  const { checkpoint, outcome } = setup();
  applyDiscoveryOutcome(checkpoint, { ...outcome, outcome: 'blocked', auth_expired: true, observed_states: [], relationships: [], new_tasks: [], blockers: ['Blocked: Authentication expired'] });
  assert.equal(checkpoint.status, 'blocked_auth');
  assert.equal(checkpoint.queue[0].status, 'queued');
  assert.equal(checkpoint.visited_states.length, 0);
});

test('artifact verification enforces ownership, checksum, symlinks and tester notes', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'discovery-artifacts-'));
  try {
    const { outcome } = setup();
    await mkdir(path.join(root, 'docs/product/survey/views'), { recursive: true });
    await mkdir(path.join(root, 'docs/tickets/T-1'), { recursive: true });
    const good = '# View\n\n## Tester notes\n';
    await writeFile(path.join(root, 'docs/product/survey/views/a.md'), good);
    await writeFile(path.join(root, 'docs/product/survey/views/b.md'), '# View\n');
    await writeFile(path.join(root, 'docs/tickets/T-1/manifest.yaml'), 'x');
    await symlink(path.join(root, 'docs/tickets/T-1/manifest.yaml'), path.join(root, 'docs/product/survey/views/link.md'));
    const artifact = (p: string, content: string) => ({ path: p, sha256: calculateChecksum(content) });
    assert.deepEqual(await verifyDiscoveryArtifacts({ ...outcome, artifacts: [artifact('docs/product/survey/views/a.md', good)] }, root), { ok: true });
    for (const bad of [
      artifact('docs/product/survey/views/a.md', 'other'), artifact('docs/product/survey/views/b.md', '# View\n'),
      artifact('docs/tickets/T-1/manifest.yaml', 'x'), artifact('docs/product/survey/views/../../../tickets/T-1/manifest.yaml', 'x'),
      artifact('docs/product/survey/views/link.md', 'x'), artifact('docs/product/survey/roles/run-1.yaml', 'x'),
    ]) assert.equal((await verifyDiscoveryArtifacts({ ...outcome, artifacts: [bad] }, root)).ok, false, bad.path);
  } finally { await rm(root, { recursive: true, force: true }); }
});
