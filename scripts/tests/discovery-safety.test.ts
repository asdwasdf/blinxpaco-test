import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { DiscoveryCandidate } from '../discovery-planner.js';
import { evaluateDiscoveryMutation, authorizationDigest, type DiscoveryAuthorization } from '../discovery-safety.js';
import type { PacoConfig } from '../workflow-types.js';

const safety: PacoConfig['safety'] = { mutationEnabledEnvironments: ['dev'], allowedHosts: ['blinx.dev.blinxpaco-np.com'], externalDevHosts: ['send.dev.blinxpaco-np.com'] };
const candidate: DiscoveryCandidate = { id: 'MF-001', task_id: 'T1', source_state: 'S1', action: 'Create synthetic record', mutation_class: 'CREATE', persistence: 'Persistent', reason: 'Post-submit state not visible read-only', evidence: ['E1'], test_data_fingerprint: 'sha256:owned', ownership_ref: 'run-1/owned', status: 'pending' };
const authorization: DiscoveryAuthorization = { product: 'Paco', run_id: 'run-1', environment: 'dev', actions: ['Create synthetic record'], mutation_classes: ['CREATE'], test_data_fingerprint: 'sha256:owned', ownership_ref: 'run-1/owned', approved_recipients: [], approved_destinations: [], allow_destructive: false, issued_at: '2026-10-01T00:00:00Z', expires_at: '2026-10-02T00:00:00Z' };
const context = { run_id: 'run-1', environment: 'dev', current_url: 'https://blinx.dev.blinxpaco-np.com/paco/dashboard', now: '2026-10-01T01:00:00Z', guards: { PACO_ALLOW_MUTATION: 'true' }, safety };

test('allows exactly authorized owned mutation on configured dev host', () => {
  assert.equal(evaluateDiscoveryMutation(candidate, authorization, context).allowed, true);
  assert.match(authorizationDigest(authorization), /^[a-f0-9]{64}$/);
});

test('blocks missing guards, production or unknown hosts and unsafe URLs', () => {
  const blocked = [
    { ...context, guards: {} },
    { ...context, current_url: 'https://blinx.prod.blinxpaco.com/paco' },
    { ...context, current_url: 'https://unknown.example.test/' },
    { ...context, current_url: 'http://blinx.dev.blinxpaco-np.com/paco' },
    { ...context, current_url: 'https://u:p@blinx.dev.blinxpaco-np.com/paco' },
    { ...context, environment: 'prod' },
  ];
  for (const item of blocked) assert.equal(evaluateDiscoveryMutation(candidate, authorization, item).allowed, false);
});

test('blocks scope mismatches and missing or expired authorization', () => {
  assert.equal(evaluateDiscoveryMutation(candidate, null, context).allowed, false);
  for (const auth of [
    { ...authorization, run_id: 'other' }, { ...authorization, actions: ['Other'] }, { ...authorization, mutation_classes: ['UPDATE' as const] },
    { ...authorization, test_data_fingerprint: 'sha256:other' }, { ...authorization, ownership_ref: 'other' },
    { ...authorization, expires_at: '2026-10-01T00:30:00Z' }, { ...authorization, issued_at: '2026-10-02T00:00:00Z' },
  ]) assert.equal(evaluateDiscoveryMutation(candidate, auth, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation({ ...candidate, test_data_fingerprint: '' }, { ...authorization, test_data_fingerprint: '' }, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation({ ...candidate, persistence: 'Unknown' }, authorization, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation({ ...candidate, reason: '' }, authorization, context).allowed, false);
});

test('SEND requires approved recipient and external effects require approved destination', () => {
  const send = { ...candidate, mutation_class: 'SEND' as const };
  const sendAuth = { ...authorization, mutation_classes: ['SEND' as const] };
  assert.equal(evaluateDiscoveryMutation(send, sendAuth, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation({ ...send, recipient_fingerprint: 'r1' }, { ...sendAuth, approved_recipients: ['r2'] }, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation({ ...send, recipient_fingerprint: 'r1' }, { ...sendAuth, approved_recipients: ['r1'] }, context).allowed, true);
  const external = { ...candidate, mutation_class: 'EXTERNAL_SIDE_EFFECT' as const, destination_host: 'send.dev.blinxpaco-np.com' };
  const externalAuth = { ...authorization, mutation_classes: ['EXTERNAL_SIDE_EFFECT' as const] };
  assert.equal(evaluateDiscoveryMutation(external, externalAuth, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation(external, { ...externalAuth, approved_destinations: ['send.dev.blinxpaco-np.com'] }, context).allowed, true);
  assert.equal(evaluateDiscoveryMutation({ ...external, destination_host: 'evil.example.test' }, { ...externalAuth, approved_destinations: ['evil.example.test'] }, context).allowed, false);
});

test('destructive requires flag and explicit destructive authorization', () => {
  const del = { ...candidate, mutation_class: 'DELETE' as const, persistence: 'Destructive' as const };
  const delAuth = { ...authorization, mutation_classes: ['DELETE' as const] };
  const guards = { PACO_ALLOW_MUTATION: 'true', PACO_ALLOW_DESTRUCTIVE: 'true' };
  assert.equal(evaluateDiscoveryMutation(del, delAuth, { ...context, guards }).allowed, false);
  assert.equal(evaluateDiscoveryMutation(del, { ...delAuth, allow_destructive: true }, context).allowed, false);
  assert.equal(evaluateDiscoveryMutation(del, { ...delAuth, allow_destructive: true }, { ...context, guards }).allowed, true);
});

test('cleanup requires ownership by the current run', () => {
  const cleanup = { ...candidate, action: 'Delete owned record', mutation_class: 'DELETE' as const, persistence: 'Destructive' as const, cleanup_of: 'M-1', ownership_ref: 'other-run/owned' };
  const auth = { ...authorization, actions: ['Delete owned record'], mutation_classes: ['DELETE' as const], allow_destructive: true, ownership_ref: 'other-run/owned' };
  const guards = { PACO_ALLOW_MUTATION: 'true', PACO_ALLOW_DESTRUCTIVE: 'true' };
  assert.equal(evaluateDiscoveryMutation(cleanup, auth, { ...context, guards }).allowed, false);
  assert.equal(evaluateDiscoveryMutation({ ...cleanup, ownership_ref: 'run-1/owned' }, { ...auth, ownership_ref: 'run-1/owned' }, { ...context, guards }).allowed, true);
});
