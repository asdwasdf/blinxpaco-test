import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { createDiscoveryCheckpoint, createDiscoveryTask, fingerprintDiscoveryState, type DiscoveryStateDescriptor } from '../discovery-planner.js';
import { loadDiscoveryCheckpoint, migrateLegacyCheckpoint } from '../discovery-state.js';
import { runDiscoverCli } from '../paco-discover.js';

const base = 'https://blinx.dev.blinxpaco-np.com/paco';
const id = ['--environment', 'dev', '--role', 'Tester', '--run-id', 'run-int'];
const at = (url: string, heading: string, extra: Partial<DiscoveryStateDescriptor> = {}): DiscoveryStateDescriptor =>
  ({ role: 'Tester', url: `${base}/${url}`, heading, tab: '', overlay: '', context: '', variant: 'populated', ...extra });

test('bounded discovery loop: priority, dedup, blocked mutation, safe branch, reservation, crash reconcile, exhaustion', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'discovery-int-'));
  const file = path.join(dir, 'run.yaml');
  let n = 0;
  const cli = async (args: string[], env: Record<string, string> = {}) => {
    let out = '';
    const code = await runDiscoverCli([...args, '--checkpoint', file, '--project-root', dir], env, (text) => { out += text; });
    return { code, out };
  };
  const apply = async (started: { revision: number; task: { id: string } }, body: Record<string, unknown>, mode = 'SURVEY') => {
    const outcomeFile = path.join(dir, `o${++n}.json`);
    await writeFile(outcomeFile, JSON.stringify({ schema_version: 1, outcome_id: `O${n}`, mode, run_id: 'run-int', environment: 'dev', role: 'Tester',
      task_id: started.task.id, checkpoint_revision: started.revision, outcome: 'completed', auth_expired: false, observed_states: [], evidence: [],
      relationships: [], new_tasks: [], candidates: [], gaps: [], artifacts: [], blockers: [], mutation: null, sensitive_data: { detected: false, redacted: false }, ...body }));
    return cli(['apply', ...id, '--outcome', outcomeFile]);
  };
  try {
    assert.equal((await cli(['init', ...id, '--allow-mutation', '--max-states', '5'])).code, 0);

    // Bootstrap: xác minh dashboard, phát hiện 2 module, 1 branch, 1 boundary mutation.
    const boot = JSON.parse((await cli(['start', ...id])).out);
    const dashboard = at('dashboard', 'Dashboard');
    const members = at('members', 'Members');
    const membersTask = createDiscoveryTask({ state: members, action: 'Open Members', category: 'module', provenance: { kind: 'evidence', ref: 'E-dash' } });
    const reportsTask = createDiscoveryTask({ state: at('analytics-reports?report=scr', 'Reports', { meaningful_query: ['report'] }), action: 'Open Reports', category: 'module', provenance: { kind: 'evidence', ref: 'E-dash' } });
    const branchTask = createDiscoveryTask({ state: dashboard, action: 'Expand widget', category: 'branch', provenance: { kind: 'evidence', ref: 'E-dash' } });
    const inviteTask = createDiscoveryTask({ state: at('members', 'Members', { overlay: 'invite-dialog' }), action: 'Send Invite', category: 'mutation', provenance: { kind: 'candidate', ref: 'MF-001' } });
    const candidate = { id: 'MF-001', task_id: inviteTask.id, source_state: fingerprintDiscoveryState(members), action: 'Send Invite', mutation_class: 'SEND', persistence: 'Persistent', reason: 'Post-submit state not visible read-only', evidence: ['E-dash'], test_data_fingerprint: 'sha256:synthetic', ownership_ref: 'run-int/invite', recipient_fingerprint: 'sha256:approved-recipient', status: 'pending' };
    const boundary = { id: 'R-invite', from: fingerprintDiscoveryState(members), destination_hint: 'pending-invitations', trigger: 'Send Invite', relationship: 'workflow', context: ['selected project'], classification: 'Inferred', mutation_boundary: true, evidence: ['E-dash'], role: 'Tester', environment: 'dev', observed_at: '2026-10-01T00:00:00Z' };
    const r1 = await apply(boot, { observed_states: [{ state: dashboard, evidence: ['E-dash'] }, { state: members, evidence: ['E-dash'] }], evidence: ['E-dash'], relationships: [boundary], candidates: [candidate],
      new_tasks: [branchTask, inviteTask, reportsTask, membersTask, membersTask] });
    assert.equal(r1.code, 0, r1.out);
    let state = await loadDiscoveryCheckpoint(file);
    assert.equal(state.queue.filter((t) => t.status === 'queued').length, 4, 'duplicate module proposal deduplicated');

    // Priority: module trước branch trước mutation.
    const order: string[] = [];
    for (let i = 0; i < 3; i++) {
      const next = JSON.parse((await cli(['next', ...id])).out);
      order.push(next.task.category);
      const started = JSON.parse((await cli(['start', ...id])).out);
      // Quay lại dashboard: cycle không tạo task trùng.
      const back = createDiscoveryTask({ state: dashboard, action: 'Expand widget', category: 'branch', provenance: { kind: 'evidence', ref: 'E-dash' } });
      const r = await apply(started, { observed_states: [{ state: started.task.category === 'branch' ? { ...started.task.state, variant: 'expanded' } : started.task.state, evidence: [`E${i}`] }], evidence: [`E${i}`], new_tasks: [back] });
      assert.equal(r.code, 0, r.out);
    }
    assert.deepEqual(order, ['module', 'module', 'branch']);

    // Mutation chưa có authorization: bị chặn, ghi gap, không chọn lại.
    const denied = await cli(['start', ...id, '--current-url', `${base}/members`], { PACO_ALLOW_MUTATION: 'true' });
    assert.equal(denied.code, 1);
    state = await loadDiscoveryCheckpoint(file);
    assert.equal(state.queue.find((t) => t.id === inviteTask.id)?.status, 'blocked');
    assert.equal(state.mutations.length, 0);

    // Tester cấp authorization ngoài agent → requeue có lý do → reserve trước click.
    await mkdir(path.join(dir, 'playwright/.auth/discovery-authorizations'), { recursive: true });
    const auth = path.join(dir, 'playwright/.auth/discovery-authorizations/auth.json');
    await writeFile(auth, JSON.stringify({ product: 'Paco', run_id: 'run-int', environment: 'dev', actions: ['Send Invite'], mutation_classes: ['SEND'], test_data_fingerprint: 'sha256:synthetic', ownership_ref: 'run-int/invite', approved_recipients: ['sha256:approved-recipient'], approved_destinations: [], allow_destructive: false, issued_at: new Date(Date.now() - 60_000).toISOString(), expires_at: new Date(Date.now() + 3_600_000).toISOString() }));
    assert.equal((await cli(['requeue', ...id, '--task', inviteTask.id, '--reason', 'Tester approved recipient'])).code, 0);
    assert.equal((await cli(['start', ...id, '--current-url', 'https://blinx.prod.example.com/paco', '--authorization', auth], { PACO_ALLOW_MUTATION: 'true' })).code, 1, 'production host blocked');
    assert.equal((await cli(['requeue', ...id, '--task', inviteTask.id, '--reason', 'Back on dev host'])).code, 0);
    const reserved = await cli(['start', ...id, '--current-url', `${base}/members`, '--authorization', auth], { PACO_ALLOW_MUTATION: 'true' });
    assert.equal(reserved.code, 0, reserved.out);
    const reservationId = JSON.parse(reserved.out).reservation_id;

    // Crash sau click, trước apply: reload chỉ cho reconcile; không start, không requeue.
    state = await loadDiscoveryCheckpoint(file);
    assert.equal(state.mutations[0].status, 'pending');
    assert.equal((await cli(['start', ...id])).code, 1);
    assert.equal((await cli(['reconcile', ...id, '--reservation', reservationId, '--status', 'observed', '--evidence', 'E-after', '--after', 'pending-invitations'])).code, 0);
    state = await loadDiscoveryCheckpoint(file);
    assert.equal(state.mutations[0].status, 'observed');
    assert.equal((await cli(['requeue', ...id, '--task', inviteTask.id, '--reason', 'retry'])).code, 1, 'reserved mutation never requeued');

    // Hết task có provenance → dừng hữu hạn; retry/reload không tạo state mới.
    assert.equal(state.visited_states.length, 4);
    assert.equal(state.status, 'active');
    assert.equal(state.current_task, null);
    assert.equal(JSON.parse((await cli(['next', ...id])).out).task, null);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('real legacy survey checkpoint migrates without becoming executable tasks', async () => {
  const legacy = YAML.parse(await readFile('docs/product/survey/roles/super-admin-gb-checkpoint.yaml', 'utf8'));
  const migrated = migrateLegacyCheckpoint(legacy, createDiscoveryCheckpoint('legacy-run', legacy.environment, legacy.role, 'https://blinx.dev.blinxpaco-np.com/paco/dashboard'));
  assert.equal(migrated.queue.length, 1, 'only the auth bootstrap task');
  assert.equal(migrated.consumed_mutations.length, (legacy.mutation_fingerprints ?? []).length);
  assert.ok(migrated.legacy_notes.length > 0);
});
