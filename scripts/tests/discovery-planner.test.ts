import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fingerprintDiscoveryState, normalizeDiscoveryUrl, createDiscoveryTask, mergeDiscoveryTasks, selectNextDiscoveryTask, createDiscoveryCheckpoint, startDiscoveryTask } from '../discovery-planner.js';

const state = { role: 'Tester', url: 'https://blinx.dev.blinxpaco-np.com/paco/dashboard', heading: 'Dashboard', tab: '', overlay: '', context: 'practice', variant: 'populated' };
const evidence = { kind: 'evidence' as const, ref: 'E1' };

test('normalizes only declared volatile identifiers and tracking values', () => {
  assert.equal(normalizeDiscoveryUrl(`${state.url}?utm_source=x&status=open`), `${state.url}?status=open`);
  assert.notEqual(fingerprintDiscoveryState(state), fingerprintDiscoveryState({ ...state, url: `${state.url}?status=open` }));
  assert.throws(() => normalizeDiscoveryUrl(`${state.url}?patient=secret`), /Sensitive query/);
  assert.throws(() => normalizeDiscoveryUrl('https://user:password@example.test/'), /credentials/);
  assert.equal(normalizeDiscoveryUrl('https://example.test/items/123', [2]), 'https://example.test/items/:id');
  assert.notEqual(normalizeDiscoveryUrl('https://example.test/items/123'), normalizeDiscoveryUrl('https://example.test/items/456'));
});

test('fingerprint separates role, tab, context, overlays and data variants', () => {
  for (const field of ['role', 'tab', 'context', 'overlay', 'variant'] as const) {
    assert.notEqual(fingerprintDiscoveryState(state), fingerprintDiscoveryState({ ...state, [field]: 'different' }));
  }
  assert.equal(fingerprintDiscoveryState(state), fingerprintDiscoveryState({ ...state, url: `${state.url}?utm_source=ignored` }));
});

test('grounded queue deduplicates transitions and selects stable priorities', () => {
  const checkpoint = createDiscoveryCheckpoint('run-1', 'dev', 'Tester', state.url, 0);
  checkpoint.queue = [];
  checkpoint.evidence = ['E1'];
  const branch = createDiscoveryTask({ state, action: 'Details', category: 'branch', provenance: evidence });
  const module = createDiscoveryTask({ state, action: 'Members', category: 'module', provenance: evidence });
  checkpoint.queue = mergeDiscoveryTasks(checkpoint, [branch, module, module]);
  assert.equal(checkpoint.queue.length, 2);
  assert.equal(selectNextDiscoveryTask(checkpoint, 0)?.id, module.id);
  checkpoint.attempted_transitions.push(module.id);
  assert.equal(selectNextDiscoveryTask(checkpoint, 0)?.id, branch.id);
  assert.throws(() => mergeDiscoveryTasks(checkpoint, [{ ...module, provenance: { kind: 'evidence', ref: 'invented' } }]), /provenance/);
});

test('retry and budget bound repeated tasks without counting new states', () => {
  const checkpoint = createDiscoveryCheckpoint('run-1', 'dev', 'Tester', state.url, 0);
  const task = startDiscoveryTask(checkpoint, 0)!;
  assert.equal(task.status, 'exploring');
  assert.equal(checkpoint.budget.actions, 1);
  assert.equal(checkpoint.visited_states.length, 0);
  assert.equal(selectNextDiscoveryTask(checkpoint, 0), null);
  task.status = 'queued';
  task.attempts = 3;
  assert.equal(selectNextDiscoveryTask(checkpoint, 0), null);
  task.attempts = 0;
  checkpoint.budget.actions = checkpoint.budget.max_actions;
  assert.equal(selectNextDiscoveryTask(checkpoint, 0), null);
  checkpoint.budget.actions = 0;
  assert.equal(selectNextDiscoveryTask(checkpoint, 31 * 60_000), null);
});

test('observed meaningful query keys are kept while undeclared keys stay blocked', () => {
  const url = 'https://blinx.dev.blinxpaco-np.com/paco/analytics-reports?report=scr&error=not-authorized';
  assert.throws(() => fingerprintDiscoveryState({ ...state, url }), /Unclassified query/);
  const declared = { ...state, url, meaningful_query: ['report', 'error'] };
  assert.notEqual(fingerprintDiscoveryState(declared), fingerprintDiscoveryState({ ...declared, url: url.replace('scr', 'other') }));
  assert.throws(() => normalizeDiscoveryUrl(url, [], ['token']), /Unclassified query/);
  assert.throws(() => normalizeDiscoveryUrl(`${url}&token=x`, [], ['report', 'error', 'token']), /Sensitive query/);
});

test('review I4: hash routes stay distinct, stored task URL is normalized and free-text filter values are hashed', () => {
  assert.notEqual(normalizeDiscoveryUrl(`${state.url}#/a`), normalizeDiscoveryUrl(`${state.url}#/b`));
  assert.throws(() => normalizeDiscoveryUrl(`${state.url}#access_token=x`), /hash/i);
  assert.doesNotMatch(normalizeDiscoveryUrl(`${state.url}?filter=John%20Smith`), /John/);
  const task = createDiscoveryTask({ state: { ...state, url: 'https://example.test/items/123?utm_source=x&filter=John', volatile_segments: [2] }, action: 'Open', category: 'branch', provenance: evidence });
  assert.doesNotMatch(task.state.url, /123|John|utm/);
});

test('review I8: same state and action in different categories are separate tasks', () => {
  const survey = createDiscoveryTask({ state, action: 'Send Invite', category: 'transition', provenance: evidence });
  const mutation = createDiscoveryTask({ state, action: 'Send Invite', category: 'mutation', provenance: evidence });
  assert.notEqual(survey.id, mutation.id);
});
