import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateMutationGate, type MutationApproval, type MutationRunScope } from '../mutation-gate.js';
import type { PacoConfig } from '../workflow-types.js';

const scope: MutationRunScope = { run_id: 'run-1', environment: 'dev', current_url: 'https://blinx.dev.blinxpaco-np.com/paco/dashboard', ticket_key: 'PAC9-101', case_id: 'PAC9-101-TC-001', action: 'Update synthetic record', test_data_fingerprint: 'sha256:test', mutation_class: 'Persistent' };
const approval: MutationApproval = { run_id: 'run-1', environment: 'dev', ticket_key: 'PAC9-101', case_ids: ['PAC9-101-TC-001'], actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test', mutation_class: 'Persistent', approved_at: '2026-09-10T00:00:00Z', expires_at: null };
const safety: PacoConfig['safety'] = { mutationEnabledEnvironments: ['dev'], allowedHosts: ['blinx.dev.blinxpaco-np.com'], externalDevHosts: ['scheduler.dev.example.test'] };

test('allows read-only without approval', () => {
  assert.deepEqual(evaluateMutationGate({ ...scope, mutation_class: 'None' }, null, {}, '2026-09-10T01:00:00Z'), { allowed: true, reason: 'read_only' });
});

test('requires exact approval and mutation guard', () => {
  assert.equal(evaluateMutationGate(scope, null, {}, '2026-09-10T01:00:00Z').allowed, false);
  assert.equal(evaluateMutationGate(scope, approval, {}, '2026-09-10T01:00:00Z').allowed, false);
  assert.equal(evaluateMutationGate(scope, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z').allowed, true);
  assert.equal(evaluateMutationGate({ ...scope, run_id: 'run-2' }, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z').allowed, false);
});

test('treats unknown as persistent and destructive requires separate guard', () => {
  assert.equal(evaluateMutationGate({ ...scope, mutation_class: 'Unknown' }, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z').allowed, true);
  const destructive = { ...scope, mutation_class: 'Destructive' as const };
  const destructiveApproval = { ...approval, mutation_class: 'Destructive' as const };
  assert.equal(evaluateMutationGate(destructive, destructiveApproval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z').allowed, false);
  assert.equal(evaluateMutationGate(destructive, destructiveApproval, { PACO_ALLOW_MUTATION: 'true', PACO_ALLOW_DESTRUCTIVE: 'true' }, '2026-09-10T01:00:00Z').allowed, true);
});

test('rejects expired approval', () => {
  const expired = { ...approval, expires_at: '2026-09-10T00:30:00Z' };
  assert.equal(evaluateMutationGate(scope, expired, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z').allowed, false);
});

test('allows mutation only on configured dev hosts', () => {
  const guards = { PACO_ALLOW_MUTATION: 'true' };
  assert.equal(evaluateMutationGate(scope, approval, guards, '2026-09-10T01:00:00Z', safety).allowed, true);
  assert.equal(evaluateMutationGate({ ...scope, current_url: 'https://scheduler.dev.example.test/path' }, approval, guards, '2026-09-10T01:00:00Z', safety).allowed, true);
  assert.deepEqual(
    evaluateMutationGate({ ...scope, current_url: 'https://blinx.prod.example.com' }, approval, guards, '2026-09-10T01:00:00Z', safety),
    { allowed: false, reason: 'Mutation blocked outside configured dev hosts' },
  );
  assert.equal(evaluateMutationGate({ ...scope, current_url: 'not-a-url' }, approval, guards, '2026-09-10T01:00:00Z', safety).allowed, false);
  assert.equal(evaluateMutationGate({ ...scope, environment: 'prod' }, approval, guards, '2026-09-10T01:00:00Z', safety).allowed, false);
});
