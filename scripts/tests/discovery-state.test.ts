import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDiscoveryCheckpoint, type DiscoveryCandidate } from '../discovery-planner.js';
import { initializeDiscoveryCheckpoint, loadDiscoveryCheckpoint, updateDiscoveryCheckpoint, reserveDiscoveryMutation, finalizeDiscoveryMutation, migrateLegacyCheckpoint } from '../discovery-state.js';

const candidate: DiscoveryCandidate = { id: 'C1', task_id: 'T1', source_state: 'S1', action: 'Create', mutation_class: 'CREATE', persistence: 'Persistent', reason: 'Discover created state', evidence: ['E1'], test_data_fingerprint: 'owned-data', ownership_ref: 'owner-1', status: 'pending' };

test('checkpoint is revision checked and retains durable pending mutations after reload', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'discovery-'));
  const file = path.join(directory, 'run.yaml');
  try {
    const initial = createDiscoveryCheckpoint('run-1', 'dev', 'Tester', 'https://example.test/dashboard');
    await initializeDiscoveryCheckpoint(file, initial);
    await assert.rejects(initializeDiscoveryCheckpoint(file, initial));
    await updateDiscoveryCheckpoint(file, 0, state => { reserveDiscoveryMutation(state, candidate, 'external-digest'); });
    const loaded = await loadDiscoveryCheckpoint(file, { run_id: 'run-1', role: 'Tester', environment: 'dev' });
    assert.equal(loaded.mutations[0].status, 'pending');
    assert.throws(() => reserveDiscoveryMutation(loaded, { ...candidate, id: 'renamed' }, 'external-digest'), /already reserved/);
    await assert.rejects(updateDiscoveryCheckpoint(file, 0, () => {}), /revision/);
    await assert.rejects(loadDiscoveryCheckpoint(file, { run_id: 'run-1', role: 'Other', environment: 'dev' }), /identity/);
    await writeFile(`${file}.lock`, 'occupied');
    await assert.rejects(updateDiscoveryCheckpoint(file, 1, () => {}), /EEXIST/);
    assert.equal((await loadDiscoveryCheckpoint(file)).revision, 1);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('mutation finalization requires observed evidence and never drops reservation', () => {
  const state = createDiscoveryCheckpoint('run-1', 'dev', 'Tester', 'https://example.test/dashboard');
  const entry = reserveDiscoveryMutation(state, candidate, 'digest');
  assert.throws(() => finalizeDiscoveryMutation(state, entry.id, { status: 'observed', after: 'S2', evidence: [], cleanup: 'pending', leftovers: [] }), /evidence/);
  finalizeDiscoveryMutation(state, entry.id, { status: 'indeterminate', evidence: ['E2'], cleanup: 'pending', leftovers: ['owned-record-ref'] });
  assert.equal(state.mutations.length, 1);
  assert.equal(state.mutations[0].status, 'indeterminate');
});

test('legacy migration preserves notes and consumed mutation fingerprints', () => {
  const initial = createDiscoveryCheckpoint('run-1', 'dev', 'Tester', 'https://example.test/dashboard');
  const migrated = migrateLegacyCheckpoint({ environment: 'dev', role: 'Tester', queue: ['Explore next module'], mutation_fingerprints: ['legacy-used'] }, initial);
  assert.deepEqual(migrated.legacy_notes, ['Explore next module', 'legacy-mutation: legacy-used']);
  assert.deepEqual(migrated.consumed_mutations, ['legacy-used']);
  assert.equal(migrated.queue.length, 1);
  assert.throws(() => migrateLegacyCheckpoint({ environment: 'dev', role: 'Other' }, initial), /identity/);
});

test('invalid update never replaces checkpoint', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'discovery-'));
  const file = path.join(directory, 'run.yaml');
  try {
    await initializeDiscoveryCheckpoint(file, createDiscoveryCheckpoint('run-1', 'dev', 'Tester', 'https://example.test/dashboard'));
    const before = await readFile(file, 'utf8');
    await assert.rejects(updateDiscoveryCheckpoint(file, 0, state => { state.budget.max_actions = -1; }), /budget/);
    assert.equal(await readFile(file, 'utf8'), before);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
