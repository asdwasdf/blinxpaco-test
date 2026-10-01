import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateMutationGate, type MutationApproval, type MutationRunScope, type WorkflowMutationAuthorization } from '../mutation-gate.js';
import type { PacoConfig } from '../workflow-types.js';

const scope: MutationRunScope = { run_id: 'run-1', environment: 'dev', current_url: 'https://blinx.dev.blinxpaco-np.com/paco/dashboard', ticket_key: 'PAC9-101', case_id: 'PAC9-101-TC-001', action: 'Update synthetic record', test_data_fingerprint: 'sha256:test', mutation_class: 'Persistent' };
const approval: MutationApproval = { run_id: 'run-1', environment: 'dev', ticket_key: 'PAC9-101', case_ids: ['PAC9-101-TC-001'], actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test', mutation_class: 'Persistent', approved_at: '2026-09-10T00:00:00Z', expires_at: null };
const safety: PacoConfig['safety'] = { mutationEnabledEnvironments: ['dev'], allowedHosts: ['blinx.dev.blinxpaco-np.com'], externalDevHosts: ['scheduler.dev.example.test'] };
const workflowAuthorization: WorkflowMutationAuthorization = {
  product: 'Paco', environment: 'dev', ticket_key: 'PAC9-101', case_ids: ['PAC9-101-TC-001'],
  actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test', source: 'paco-execution-first-workflow',
};

test('allows read-only without approval', () => {
  assert.deepEqual(evaluateMutationGate({ ...scope, mutation_class: 'None' }, null, {}, '2026-09-10T01:00:00Z'), { allowed: true, reason: 'read_only' });
});

test('blocks mutation when configured host safety is omitted', () => {
  assert.deepEqual(
    evaluateMutationGate(scope, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z'),
    { allowed: false, reason: 'Mutation blocked without configured dev host safety' },
  );
  assert.deepEqual(
    evaluateMutationGate(scope, null, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', undefined, workflowAuthorization),
    { allowed: false, reason: 'Mutation blocked without configured dev host safety' },
  );
});

test('requires exact approval and mutation guard', () => {
  assert.equal(evaluateMutationGate(scope, null, {}, '2026-09-10T01:00:00Z', safety).allowed, false);
  assert.equal(evaluateMutationGate(scope, approval, {}, '2026-09-10T01:00:00Z', safety).allowed, false);
  assert.equal(evaluateMutationGate(scope, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety).allowed, true);
  assert.equal(evaluateMutationGate({ ...scope, run_id: 'run-2' }, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z').allowed, false);
});

test('treats unknown as persistent and destructive requires separate guard', () => {
  assert.equal(evaluateMutationGate({ ...scope, mutation_class: 'Unknown' }, approval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety).allowed, true);
  const destructive = { ...scope, mutation_class: 'Destructive' as const };
  const destructiveApproval = { ...approval, mutation_class: 'Destructive' as const };
  assert.equal(evaluateMutationGate(destructive, destructiveApproval, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety).allowed, false);
  assert.equal(evaluateMutationGate(destructive, destructiveApproval, { PACO_ALLOW_MUTATION: 'true', PACO_ALLOW_DESTRUCTIVE: 'true' }, '2026-09-10T01:00:00Z', safety).allowed, true);
});

test('rejects expired approval', () => {
  const expired = { ...approval, expires_at: '2026-09-10T00:30:00Z' };
  assert.equal(evaluateMutationGate(scope, expired, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety).allowed, false);
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

test('allows scoped workflow mutation on configured dev host', () => {
  const result = evaluateMutationGate(scope, null, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety, workflowAuthorization);
  assert.deepEqual(result, { allowed: true, reason: 'workflow_authorized_mutation' });
});

test('allows survey mutation without ticket or case on configured dev host', () => {
  const surveyScope = { ...scope, ticket_key: '', case_id: '' };
  const authorization = {
    product: 'Paco' as const, source: 'paco-explore-survey' as const, environment: 'dev',
    run_id: 'run-1', actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test',
  };
  assert.deepEqual(
    evaluateMutationGate(surveyScope, null, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety, authorization),
    { allowed: true, reason: 'workflow_authorized_mutation' },
  );
});

test('blocks survey mutation outside its run, action, data or configured dev host', () => {
  const surveyScope = { ...scope, ticket_key: '', case_id: '' };
  const authorization = {
    product: 'Paco' as const, source: 'paco-explore-survey' as const, environment: 'dev',
    run_id: 'run-1', actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test',
  };
  const guards = { PACO_ALLOW_MUTATION: 'true' };
  for (const changed of [
    { ...surveyScope, run_id: 'run-2' },
    { ...surveyScope, run_id: '' },
    { ...surveyScope, action: '' },
    { ...surveyScope, test_data_fingerprint: '' },
    { ...surveyScope, action: 'Delete synthetic record' },
    { ...surveyScope, test_data_fingerprint: 'other' },
    { ...surveyScope, environment: 'prod' },
    { ...surveyScope, current_url: 'https://production.example/path' },
    { ...surveyScope, current_url: 'https://unknown.example/path' },
  ]) assert.equal(evaluateMutationGate(changed, null, guards, '2026-09-10T01:00:00Z', safety, authorization).allowed, false);
  for (const invalid of [
    { ...authorization, run_id: '' },
    { ...authorization, actions: [''] },
    { ...authorization, test_data_fingerprint: '' },
  ]) assert.equal(evaluateMutationGate({ ...surveyScope, run_id: invalid.run_id, action: invalid.actions[0], test_data_fingerprint: invalid.test_data_fingerprint }, null, guards, '2026-09-10T01:00:00Z', safety, invalid).allowed, false);
  assert.equal(evaluateMutationGate(surveyScope, null, {}, '2026-09-10T01:00:00Z', safety, authorization).allowed, false);
  assert.equal(evaluateMutationGate({ ...surveyScope, case_id: 'TC-001' }, null, guards, '2026-09-10T01:00:00Z', safety, authorization).allowed, false);
});

test('blocks destructive survey mutation without separate guard', () => {
  const surveyScope = { ...scope, ticket_key: '', case_id: '', mutation_class: 'Destructive' as const };
  const authorization = {
    product: 'Paco' as const, source: 'paco-explore-survey' as const, environment: 'dev',
    run_id: 'run-1', actions: ['Update synthetic record'], test_data_fingerprint: 'sha256:test',
  };
  assert.equal(evaluateMutationGate(surveyScope, null, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety, authorization).allowed, false);
  assert.deepEqual(evaluateMutationGate(surveyScope, null, { PACO_ALLOW_MUTATION: 'true', PACO_ALLOW_DESTRUCTIVE: 'true' }, '2026-09-10T01:00:00Z', safety, authorization), { allowed: true, reason: 'workflow_authorized_destructive' });
});

test('blocks workflow authorization scope mismatch and unsafe hosts', () => {
  const guards = { PACO_ALLOW_MUTATION: 'true' };
  for (const changed of [
    { ...scope, environment: 'staging' },
    { ...scope, ticket_key: 'PAC9-102' },
    { ...scope, case_id: 'PAC9-101-TC-002' },
    { ...scope, action: 'Delete synthetic record' },
    { ...scope, test_data_fingerprint: 'other' },
  ]) assert.equal(evaluateMutationGate(changed, null, guards, '2026-09-10T01:00:00Z', safety, workflowAuthorization).allowed, false);
  assert.equal(evaluateMutationGate(scope, null, {}, '2026-09-10T01:00:00Z', safety, workflowAuthorization).allowed, false);
  assert.equal(evaluateMutationGate({ ...scope, current_url: 'https://production.example/path' }, null, guards, '2026-09-10T01:00:00Z', safety, workflowAuthorization).allowed, false);
  assert.equal(evaluateMutationGate({ ...scope, current_url: 'bad-url' }, null, guards, '2026-09-10T01:00:00Z', safety, workflowAuthorization).allowed, false);
});

test('requires destructive guard for workflow authorization', () => {
  const destructive = { ...scope, mutation_class: 'Destructive' as const };
  assert.equal(evaluateMutationGate(destructive, null, { PACO_ALLOW_MUTATION: 'true' }, '2026-09-10T01:00:00Z', safety, workflowAuthorization).allowed, false);
  assert.deepEqual(
    evaluateMutationGate(destructive, null, { PACO_ALLOW_MUTATION: 'true', PACO_ALLOW_DESTRUCTIVE: 'true' }, '2026-09-10T01:00:00Z', safety, workflowAuthorization),
    { allowed: true, reason: 'workflow_authorized_destructive' },
  );
});
