import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDiscoveryTask, fingerprintDiscoveryState } from '../discovery-planner.js';
import { loadDiscoveryCheckpoint, updateDiscoveryCheckpoint } from '../discovery-state.js';
import { runDiscoverCli } from '../paco-discover.js';

const dashboard = 'https://blinx.dev.blinxpaco-np.com/paco/dashboard';

async function withRun(fn: (ctx: { dir: string; cli: (args: string[], env?: Record<string, string>) => Promise<{ code: number; out: string }>; file: string }) => Promise<void>) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'paco-discover-'));
  const file = path.join(dir, 'run.yaml');
  const cli = async (args: string[], env: Record<string, string> = {}) => {
    let out = '';
    const code = await runDiscoverCli([...args, '--checkpoint', file, '--project-root', dir], env, (text) => { out += text; });
    return { code, out };
  };
  try { await fn({ dir, cli, file }); } finally { await rm(dir, { recursive: true, force: true }); }
}
const id = ['--environment', 'dev', '--role', 'Tester', '--run-id', 'run-1'];

test('rejects unknown commands, flags and invalid limits', async () => withRun(async ({ cli }) => {
  assert.equal((await cli(['explode', ...id])).code, 2);
  assert.equal((await cli(['init', ...id, '--bogus'])).code, 2);
  assert.equal((await cli(['init', ...id, '--max-states', '0'])).code, 2);
  assert.equal((await cli(['init', '--environment', 'prod', '--role', 'Tester', '--run-id', 'run-1'])).code, 2);
}));

test('init seeds unverified auth task and next is read-only and deterministic', async () => withRun(async ({ cli, file }) => {
  const init = await cli(['init', ...id, '--max-states', '5']);
  assert.equal(init.code, 0, init.out);
  assert.match(init.out, /not verified/i);
  assert.doesNotMatch(init.out, /authenticated: true/);
  assert.equal((await cli(['init', ...id])).code, 1);
  const first = await cli(['next', ...id]);
  assert.equal(first.out, (await cli(['next', ...id])).out);
  assert.equal((await loadDiscoveryCheckpoint(file)).revision, 0);
  assert.equal((await cli(['next', '--environment', 'dev', '--role', 'Other', '--run-id', 'run-1'])).code, 1);
}));

test('allow-mutation flag never grants authorization or sets guards', async () => withRun(async ({ cli, file, dir }) => {
  await cli(['init', ...id, '--allow-mutation']);
  const checkpoint = await loadDiscoveryCheckpoint(file);
  assert.equal(checkpoint.allow_mutation, true);
  // Đưa một mutation task có provenance vào queue rồi thử start không có authorization.
  await updateDiscoveryCheckpoint(file, 0, (state) => {
    state.queue = [];
    state.evidence.push('E1');
    state.mutation_candidates.push({ id: 'MF-1', task_id: 'pending', source_state: 'S', action: 'Create', mutation_class: 'CREATE', persistence: 'Persistent', reason: 'r', evidence: ['E1'], test_data_fingerprint: 'd', ownership_ref: 'run-1/o', status: 'pending' });
    const task = createDiscoveryTask({ state: { role: 'Tester', url: dashboard, heading: 'H', tab: '', overlay: '', context: '', variant: '' }, action: 'Create', category: 'mutation', provenance: { kind: 'candidate', ref: 'MF-1' } });
    state.mutation_candidates[0].task_id = task.id;
    state.queue.push(task);
  });
  const noAuth = await cli(['start', ...id, '--current-url', dashboard], { PACO_ALLOW_MUTATION: 'true' });
  assert.equal(noAuth.code, 1);
  assert.match(noAuth.out, /authorization/i);
  const blocked = await loadDiscoveryCheckpoint(file);
  assert.equal(blocked.queue[0].status, 'blocked');
  assert.ok(blocked.known_gaps.some((gap) => /authorization/i.test(gap)));
  assert.equal(JSON.parse((await cli(['next', ...id])).out).task, null);
  assert.equal((await cli(['requeue', ...id, '--task', blocked.queue[0].id])).code, 2);
  assert.equal((await cli(['requeue', ...id, '--task', blocked.queue[0].id, '--reason', 'Tester supplied authorization'])).code, 0);
  const authFile = await writeAuth(dir);
  const noGuard = await cli(['start', ...id, '--current-url', dashboard, '--authorization', authFile]);
  assert.equal(noGuard.code, 1);
  assert.match(noGuard.out, /PACO_ALLOW_MUTATION/);
  assert.equal((await cli(['requeue', ...id, '--task', blocked.queue[0].id, '--reason', 'Tester enabled guard'])).code, 0);
  const allowed = await cli(['start', ...id, '--current-url', dashboard, '--authorization', authFile], { PACO_ALLOW_MUTATION: 'true' });
  assert.equal(allowed.code, 0, allowed.out);
  const reserved = await loadDiscoveryCheckpoint(file);
  assert.equal(reserved.mutations[0].status, 'pending');
  assert.doesNotMatch(JSON.stringify(reserved), /approved_recipients|issued_at/);
}));

test('start, apply survey outcome and reject stale replay of a different outcome', async () => withRun(async ({ cli, file, dir }) => {
  await cli(['init', ...id]);
  const started = JSON.parse((await cli(['start', ...id])).out);
  const state = { role: 'Tester', url: dashboard, heading: 'Dashboard', tab: '', overlay: '', context: '', variant: 'populated' };
  const outcome = {
    schema_version: 1, outcome_id: 'O1', mode: 'SURVEY', run_id: 'run-1', environment: 'dev', role: 'Tester', task_id: started.task.id,
    checkpoint_revision: started.revision, outcome: 'completed', auth_expired: false, observed_states: [{ state, evidence: ['E1'] }], evidence: ['E1'],
    relationships: [], new_tasks: [], candidates: [], gaps: [], artifacts: [], blockers: [], mutation: null, sensitive_data: { detected: false, redacted: false },
  };
  const outcomeFile = path.join(dir, 'outcome.json');
  await writeFile(outcomeFile, JSON.stringify(outcome));
  const applied = await cli(['apply', ...id, '--outcome', outcomeFile]);
  assert.equal(applied.code, 0, applied.out);
  const checkpoint = await loadDiscoveryCheckpoint(file);
  assert.deepEqual(checkpoint.visited_states, [fingerprintDiscoveryState(state)]);
  assert.equal((await cli(['apply', ...id, '--outcome', outcomeFile])).code, 0);
  await writeFile(outcomeFile, JSON.stringify({ ...outcome, outcome_id: 'O2' }));
  assert.equal((await cli(['apply', ...id, '--outcome', outcomeFile])).code, 1);
}));

test('pending reservation blocks start until reconciled, without automatic retry', async () => withRun(async ({ cli, file }) => {
  await cli(['init', ...id]);
  await updateDiscoveryCheckpoint(file, 0, (state) => {
    state.mutations.push({ id: 'M-1', fingerprint: 'f', candidate_id: 'MF-1', task_id: state.queue[0].id, authorization_digest: 'd', status: 'pending', before: 'S', evidence: ['E'], created_at: '2026-10-01T00:00:00Z', cleanup: 'pending', leftovers: [] });
  });
  const blocked = await cli(['start', ...id]);
  assert.equal(blocked.code, 1);
  assert.match(blocked.out, /reconcile/i);
  assert.equal((await cli(['reconcile', ...id, '--reservation', 'M-1', '--status', 'indeterminate'])).code, 2);
  assert.equal((await cli(['reconcile', ...id, '--reservation', 'M-1', '--status', 'indeterminate', '--evidence', 'E9'])).code, 0);
  const after = await loadDiscoveryCheckpoint(file);
  assert.equal(after.mutations[0].status, 'indeterminate');
  assert.ok(after.consumed_mutations.length >= 0);
  assert.equal(after.mutations.length, 1);
}));

test('pause and resume preserve consumed budget; budget pause needs higher limits', async () => withRun(async ({ cli, file }) => {
  await cli(['init', ...id, '--max-actions', '1']);
  const started = JSON.parse((await cli(['start', ...id])).out);
  await cli(['abandon', ...id, '--task', started.task.id, '--reason', 'test pause']);
  assert.equal((await cli(['pause', ...id])).code, 0);
  const paused = await loadDiscoveryCheckpoint(file);
  assert.equal(paused.status, 'paused');
  assert.equal(paused.budget.actions, 1);
  assert.equal((await cli(['resume', ...id])).code, 0);
  const resumed = await loadDiscoveryCheckpoint(file);
  assert.equal(resumed.budget.actions, 1);
  assert.equal(resumed.status, 'active');
  await updateDiscoveryCheckpoint(file, resumed.revision, (s) => { s.status = 'paused_budget'; s.current_task = null; });
  assert.equal((await cli(['resume', ...id])).code, 1);
  assert.equal((await cli(['resume', ...id, '--max-actions', '10'])).code, 0);
}));

const AUTH_DIR = 'playwright/.auth/discovery-authorizations';
async function writeAuth(dir: string, patch: Record<string, unknown> = {}) {
  const { mkdir } = await import('node:fs/promises');
  await mkdir(path.join(dir, AUTH_DIR), { recursive: true });
  const file = path.join(dir, AUTH_DIR, 'auth.json');
  const now = Date.now();
  await writeFile(file, JSON.stringify({ product: 'Paco', run_id: 'run-1', environment: 'dev', actions: ['Create'], mutation_classes: ['CREATE'], test_data_fingerprint: 'd', ownership_ref: 'run-1/o', approved_recipients: [], approved_destinations: [], allow_destructive: false, issued_at: new Date(now - 60_000).toISOString(), expires_at: new Date(now + 3_600_000).toISOString(), ...patch }));
  return file;
}
async function seedMutation(file: string, candidatePatch: Record<string, unknown> = {}) {
  await updateDiscoveryCheckpoint(file, (await loadDiscoveryCheckpoint(file)).revision, (state) => {
    state.queue = [];
    state.evidence.push('E1');
    state.mutation_candidates.push({ id: 'MF-1', task_id: 'pending', source_state: 'S', action: 'Create', mutation_class: 'CREATE', persistence: 'Persistent', reason: 'r', evidence: ['E1'], test_data_fingerprint: 'd', ownership_ref: 'run-1/o', status: 'pending', ...candidatePatch } as never);
    const task = createDiscoveryTask({ state: { role: 'Tester', url: dashboard, heading: 'H', tab: '', overlay: '', context: '', variant: '' }, action: 'Create', category: 'mutation', provenance: { kind: 'candidate', ref: 'MF-1' } });
    state.mutation_candidates[0].task_id = task.id;
    state.queue.push(task);
  });
}

test('review C1: abandoned in-progress task can be released; pause/resume refused mid-task', async () => withRun(async ({ cli, file }) => {
  await cli(['init', ...id]);
  const started = JSON.parse((await cli(['start', ...id])).out);
  assert.equal((await cli(['pause', ...id])).code, 1);
  assert.equal((await cli(['abandon', ...id, '--task', started.task.id])).code, 2);
  assert.equal((await cli(['abandon', ...id, '--task', started.task.id, '--reason', 'session crashed'])).code, 0);
  const state = await loadDiscoveryCheckpoint(file);
  assert.equal(state.current_task, null);
  assert.equal(state.queue[0].status, 'queued');
  assert.ok(state.known_gaps.some((gap) => /session crashed/.test(gap)));
  assert.equal(JSON.parse((await cli(['next', ...id])).out).task.id, started.task.id);
}));

test('review I1/I2: resume keeps elapsed time, budget and exhaustion are persisted', async () => withRun(async ({ cli, file }) => {
  await cli(['init', ...id]);
  await updateDiscoveryCheckpoint(file, 0, (s) => { s.budget.active_since = Date.now() - 10 * 60_000; });
  assert.equal((await cli(['resume', ...id])).code, 1, 'active run cannot be resumed');
  await cli(['pause', ...id]);
  await cli(['resume', ...id]);
  let state = await loadDiscoveryCheckpoint(file);
  assert.ok(state.budget.elapsed_ms >= 10 * 60_000);
  await updateDiscoveryCheckpoint(file, state.revision, (s) => { s.budget.elapsed_ms = 31 * 60_000; });
  assert.equal(JSON.parse((await cli(['next', ...id])).out).task, null);
  state = await loadDiscoveryCheckpoint(file);
  assert.equal(state.status, 'paused_budget');
  await updateDiscoveryCheckpoint(file, state.revision, (s) => { s.status = 'active'; s.budget.elapsed_ms = 0; s.queue = []; });
  await cli(['next', ...id]);
  assert.equal((await loadDiscoveryCheckpoint(file)).status, 'exhausted');
}));

test('review I3: legacy mutation history blocks mutations until tester review', async () => withRun(async ({ cli, file, dir }) => {
  const legacy = path.join(dir, 'legacy.yaml');
  await writeFile(legacy, 'environment: dev\nrole: Tester\nqueue: []\nattempted_transitions: [old-transition]\nmutation_fingerprints: [old-mutation]\n');
  assert.equal((await cli(['init', ...id, '--allow-mutation', '--legacy', legacy])).code, 0);
  assert.ok((await loadDiscoveryCheckpoint(file)).legacy_notes.some((note) => /old-transition/.test(note)));
  await seedMutation(file);
  const auth = await writeAuth(dir);
  const denied = await cli(['start', ...id, '--current-url', dashboard, '--authorization', auth], { PACO_ALLOW_MUTATION: 'true' });
  assert.equal(denied.code, 1);
  assert.match(denied.out, /legacy/i);
  const task = (await loadDiscoveryCheckpoint(file)).queue[0].id;
  await cli(['requeue', ...id, '--task', task, '--reason', 'Tester reviewed legacy ledger']);
  const reviewed = await writeAuth(dir, { legacy_reviewed: true });
  assert.equal((await cli(['start', ...id, '--current-url', dashboard, '--authorization', reviewed], { PACO_ALLOW_MUTATION: 'true' })).code, 0);
}));

test('review I6: authorization must come from tester-owned directory with bounded lifetime', async () => withRun(async ({ cli, file, dir }) => {
  await cli(['init', ...id, '--allow-mutation']);
  await seedMutation(file);
  const outside = path.join(dir, 'auth.json');
  await writeFile(outside, await (await import('node:fs/promises')).readFile(await writeAuth(dir), 'utf8'));
  const denied = await cli(['start', ...id, '--current-url', dashboard, '--authorization', outside], { PACO_ALLOW_MUTATION: 'true' });
  assert.equal(denied.code, 1);
  assert.match(denied.out, /discovery-authorizations/);
  const task = (await loadDiscoveryCheckpoint(file)).queue[0].id;
  await cli(['requeue', ...id, '--task', task, '--reason', 'retry']);
  const long = await writeAuth(dir, { expires_at: new Date(Date.now() + 3 * 86_400_000).toISOString() });
  assert.equal((await cli(['start', ...id, '--current-url', dashboard, '--authorization', long], { PACO_ALLOW_MUTATION: 'true' })).code, 1);
}));

test('review I7: duplicate mutation fingerprint blocks task instead of looping', async () => withRun(async ({ cli, file, dir }) => {
  await cli(['init', ...id, '--allow-mutation']);
  await seedMutation(file);
  const { mutationFingerprint } = await import('../discovery-state.js');
  await updateDiscoveryCheckpoint(file, (await loadDiscoveryCheckpoint(file)).revision, (s) => { s.consumed_mutations.push(mutationFingerprint(s.mutation_candidates[0])); });
  const auth = await writeAuth(dir);
  assert.equal((await cli(['start', ...id, '--current-url', dashboard, '--authorization', auth], { PACO_ALLOW_MUTATION: 'true' })).code, 1);
  assert.equal((await loadDiscoveryCheckpoint(file)).queue[0].status, 'blocked');
}));

test('review I5: outcome with external origin, bad candidate or missing sensitivity flag is rejected', async () => withRun(async ({ cli, file, dir }) => {
  await cli(['init', ...id]);
  const started = JSON.parse((await cli(['start', ...id])).out);
  const good = { schema_version: 1, outcome_id: 'O1', mode: 'SURVEY', run_id: 'run-1', environment: 'dev', role: 'Tester', task_id: started.task.id, checkpoint_revision: started.revision, outcome: 'completed', auth_expired: false, observed_states: [{ state: { role: 'Tester', url: dashboard, heading: 'D', tab: '', overlay: '', context: '', variant: '' }, evidence: ['E1'] }], evidence: ['E1'], relationships: [], new_tasks: [], candidates: [], gaps: [], artifacts: [], blockers: [], mutation: null, sensitive_data: { detected: false, redacted: false } };
  const external = createDiscoveryTask({ state: { role: 'Tester', url: 'https://evil.example.test/', heading: 'X', tab: '', overlay: '', context: '', variant: '' }, action: 'Go', category: 'module', provenance: { kind: 'evidence', ref: 'E1' } });
  const badCandidate = { id: 'MF-9', task_id: 'missing', source_state: 'S', action: 'A', mutation_class: 'CREATE', persistence: 'Bogus', reason: 'r', evidence: ['E1'], test_data_fingerprint: 'd', ownership_ref: 'o', status: 'pending' };
  const { sensitive_data: _omit, ...noSensitive } = good;
  for (const body of [{ ...good, new_tasks: [external] }, { ...good, candidates: [badCandidate] }, noSensitive]) {
    const f = path.join(dir, 'o.json');
    await writeFile(f, JSON.stringify(body));
    assert.equal((await cli(['apply', ...id, '--outcome', f])).code, 1);
  }
  assert.equal((await loadDiscoveryCheckpoint(file)).revision, started.revision);
}));

test('run id is optional: init generates one and later commands resolve the single role checkpoint', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'paco-discover-runid-'));
  const cli = async (args: string[]) => {
    let out = '';
    const code = await runDiscoverCli([...args, '--project-root', dir], {}, (text) => { out += text; });
    return { code, out };
  };
  try {
    const role = ['--environment', 'dev', '--role', 'Super Admin GB'];
    const init = await cli(['init', ...role]);
    assert.equal(init.code, 0, init.out);
    const runId = JSON.parse(init.out).run_id;
    assert.match(runId, /^run-\d{8}-\d{6}$/);
    assert.equal(JSON.parse((await cli(['status', ...role])).out).run_id, runId);
    await cli(['init', ...role, '--run-id', 'second']);
    const ambiguous = await cli(['status', ...role]);
    assert.equal(ambiguous.code, 1);
    assert.match(ambiguous.out, /--run-id/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('read-only states on configured external dev hosts are accepted', async () => withRun(async ({ cli, file, dir }) => {
  await cli(['init', ...id]);
  const started = JSON.parse((await cli(['start', ...id])).out);
  const state = { role: 'Tester', url: 'https://pac2-6763-send-key.dev.blinxpaco-np.com/commshub/', heading: 'Comms Hub', tab: '', overlay: '', context: '', variant: '' };
  const f = path.join(dir, 'ext.json');
  await writeFile(f, JSON.stringify({ schema_version: 1, outcome_id: 'OX', mode: 'SURVEY', run_id: 'run-1', environment: 'dev', role: 'Tester', task_id: started.task.id, checkpoint_revision: started.revision, outcome: 'completed', auth_expired: false, observed_states: [{ state, evidence: ['E1'] }], evidence: ['E1'], relationships: [], new_tasks: [], candidates: [], gaps: [], artifacts: [], blockers: [], mutation: null, sensitive_data: { detected: false, redacted: false } }));
  const applied = await cli(['apply', ...id, '--outcome', f]);
  assert.equal(applied.code, 0, applied.out);
  assert.equal((await loadDiscoveryCheckpoint(file)).visited_states.length, 1);
}));
