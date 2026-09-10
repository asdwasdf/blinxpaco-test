import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateMutationGate, type MutationApproval, type MutationRunScope } from '../mutation-gate.js';

const scope: MutationRunScope = { run_id: 'run-1', environment: 'dev', ticket_key: 'PAC9-101', case_id: 'PAC9-101-TC-001', action: 'Update synthetic record', test_data_fingerprint: 'sha256:test', mutation_class: 'Persistent' };
const approval: MutationApproval = { run_id: 'run-1', environment: 'dev', ticket_key: 'PAC9-101', case_ids: ['PAC9-101-TC-001'], actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test', mutation_class: 'Persistent', approved_at: '2026-09-10T00:00:00Z', expires_at: null };

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
