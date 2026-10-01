import { mkdir, readdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { budgetAvailable, createDiscoveryCheckpoint, selectNextDiscoveryTask, startDiscoveryTask, type DiscoveryCheckpoint, type DiscoveryTask } from './discovery-planner.js';
import { applyDiscoveryOutcome, validateDiscoveryChildOutcome, verifyDiscoveryArtifacts, type DiscoveryChildOutcome } from './discovery-outcome.js';
import { authorizationDigest, evaluateDiscoveryMutation, type DiscoveryAuthorization } from './discovery-safety.js';
import { finalizeDiscoveryMutation, initializeDiscoveryCheckpoint, LEGACY_MUTATION_NOTE, loadDiscoveryCheckpoint, migrateLegacyCheckpoint, mutationFingerprint, reserveDiscoveryMutation, updateDiscoveryCheckpoint } from './discovery-state.js';
import { loadConfig } from './load-config.js';
import type { PacoEnvironment } from './workflow-types.js';

// CLI chỉ quản lý discovery state. Không mở browser, không đọc auth state, không bật guard hay cấp authorization.
const COMMANDS = ['init', 'next', 'start', 'apply', 'reconcile', 'requeue', 'abandon', 'pause', 'resume', 'status'] as const;
const VALUE_FLAGS = ['environment', 'role', 'run-id', 'checkpoint', 'project-root', 'max-states', 'max-actions', 'max-minutes', 'max-retries',
  'outcome', 'authorization', 'current-url', 'reservation', 'status', 'evidence', 'after', 'legacy', 'task', 'reason'];
const BOOLEAN_FLAGS = ['allow-mutation'];
const USAGE = `Usage: npm run paco:discover -- <${COMMANDS.join('|')}> --environment dev --role "<role>" [--run-id <id>] [options]`;

class UsageError extends Error {}
type Flags = Record<string, string | true>;
type Env = Record<string, string | undefined>;

function parse(argv: string[]): { command: (typeof COMMANDS)[number]; flags: Flags } {
  const [command, ...rest] = argv;
  if (!COMMANDS.includes(command as (typeof COMMANDS)[number])) throw new UsageError(`Unknown command: ${command ?? ''}`);
  const flags: Flags = {};
  for (let index = 0; index < rest.length; index++) {
    const name = rest[index].replace(/^--/, '');
    if (!rest[index].startsWith('--') || (!VALUE_FLAGS.includes(name) && !BOOLEAN_FLAGS.includes(name))) throw new UsageError(`Unknown flag: ${rest[index]}`);
    if (BOOLEAN_FLAGS.includes(name)) { flags[name] = true; continue; }
    const value = rest[++index];
    if (value === undefined || value.startsWith('--')) throw new UsageError(`Missing value for --${name}`);
    flags[name] = value;
  }
  for (const name of ['environment', 'role']) if (typeof flags[name] !== 'string' || !(flags[name] as string).trim()) throw new UsageError(`--${name} is required`);
  return { command: command as (typeof COMMANDS)[number], flags };
}

function limit(flags: Flags, name: string, allowZero = false): number | undefined {
  if (flags[name] === undefined) return undefined;
  const value = Number(flags[name]);
  if (!Number.isInteger(value) || value < (allowZero ? 0 : 1)) throw new UsageError(`--${name} must be a ${allowZero ? 'non-negative' : 'positive'} integer`);
  return value;
}

function applyLimits(checkpoint: DiscoveryCheckpoint, flags: Flags): boolean {
  const updates: Array<[keyof DiscoveryCheckpoint['budget'], number | undefined]> = [
    ['max_states', limit(flags, 'max-states')], ['max_actions', limit(flags, 'max-actions')], ['max_minutes', limit(flags, 'max-minutes')], ['max_retries', limit(flags, 'max-retries', true)],
  ];
  let raised = false;
  for (const [key, value] of updates) if (value !== undefined) { raised ||= value > checkpoint.budget[key]!; (checkpoint.budget[key] as number) = value; }
  return raised;
}

function slug(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

const AUTHORIZATION_DIR = 'playwright/.auth/discovery-authorizations';

function closeClock(state: DiscoveryCheckpoint, now: number): void {
  const b = state.budget;
  if (b.active_since !== null) { b.elapsed_ms += Math.max(0, now - b.active_since); b.active_since = null; }
}

// Ghi trạng thái dừng khi không còn task: hết budget là paused_budget, hết task có provenance là exhausted.
function settledStatus(state: DiscoveryCheckpoint, now: number): DiscoveryCheckpoint['status'] | null {
  if (state.status !== 'active' || state.current_task || state.mutations.some(item => item.status === 'pending')) return null;
  if (!budgetAvailable(state, now)) return 'paused_budget';
  return selectNextDiscoveryTask(state, now) ? null : 'exhausted';
}

function hostAllowed(url: string, hosts: string[]): boolean {
  try { return hosts.includes(new URL(url).hostname.toLowerCase()); } catch { return false; }
}

function modeFor(task: DiscoveryTask): 'SURVEY' | 'VERIFY_FLOW' { return task.category === 'mutation' ? 'VERIFY_FLOW' : 'SURVEY'; }

function summary(checkpoint: DiscoveryCheckpoint) {
  return {
    run_id: checkpoint.run_id, environment: checkpoint.environment, role: checkpoint.role, revision: checkpoint.revision, status: checkpoint.status,
    current_task: checkpoint.current_task, queued: checkpoint.queue.filter(task => task.status === 'queued').length,
    visited_states: checkpoint.visited_states.length, edges: checkpoint.discovered_edges.length, blocked_tasks: checkpoint.blocked_tasks.length,
    pending_mutations: checkpoint.mutations.filter(item => item.status === 'pending').map(item => item.id), known_gaps: checkpoint.known_gaps.length, budget: checkpoint.budget,
  };
}

export async function runDiscoverCli(argv: string[], env: Env = process.env, write: (text: string) => void = text => process.stdout.write(text)): Promise<number> {
  const print = (value: unknown) => write(`${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}\n`);
  try {
    const { command, flags } = parse(argv);
    const config = loadConfig();
    const environmentName = flags.environment as string;
    const environment = config.environments[environmentName];
    if (environmentName === 'default' || typeof environment !== 'object') throw new UsageError(`Unknown environment: ${environmentName}`);
    const role = flags.role as string;
    const projectRoot = path.resolve(typeof flags['project-root'] === 'string' ? flags['project-root'] : process.cwd());
    const rolesDir = path.join(projectRoot, 'docs/product/survey/roles');
    let runId = typeof flags['run-id'] === 'string' ? flags['run-id'] : '';
    if (!runId && command === 'init') runId = `run-${new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)}`;
    if (!runId && typeof flags.checkpoint !== 'string') {
      // Không truyền --run-id: chỉ tự chọn khi role có đúng một discovery checkpoint.
      const prefix = `${slug(role)}-`;
      const matches = (await readdir(rolesDir).catch(() => [] as string[])).filter(name => name.startsWith(prefix) && name.endsWith('.discovery.yaml'));
      if (matches.length !== 1) throw new Error(`${matches.length ? 'Several' : 'No'} discovery checkpoints for role ${role}; pass --run-id${matches.length ? ` (${matches.join(', ')})` : ' or run init first'}`);
      runId = (YAML.parse(await readFile(path.join(rolesDir, matches[0]), 'utf8')) as DiscoveryCheckpoint).run_id;
    }
    if (!runId) throw new UsageError('--run-id is required with --checkpoint');
    const identity = { run_id: runId, environment: environmentName, role };
    const file = path.resolve(typeof flags.checkpoint === 'string' ? flags.checkpoint : path.join(rolesDir, `${slug(role)}-${slug(runId)}.discovery.yaml`));

    if (command === 'init') {
      const dashboard = new URL((environment as PacoEnvironment).dashboardPath, (environment as PacoEnvironment).baseUrl).toString();
      let checkpoint = createDiscoveryCheckpoint(runId, environmentName, role, dashboard);
      if (typeof flags.legacy === 'string') checkpoint = migrateLegacyCheckpoint(YAML.parse(await readFile(flags.legacy, 'utf8')), checkpoint);
      applyLimits(checkpoint, flags);
      checkpoint.allow_mutation = flags['allow-mutation'] === true;
      await mkdir(path.dirname(file), { recursive: true });
      await initializeDiscoveryCheckpoint(file, checkpoint);
      print({ checkpoint: file, ...summary(checkpoint), authentication: 'not verified by CLI',
        next: 'Trong phiên Claude đang giữ Playwright plugin tab, chạy skill paco-discover; skill tự xác minh trang authenticated và role trước task đầu.' });
      return 0;
    }

    const checkpoint = await loadDiscoveryCheckpoint(file, identity);
    if (command === 'status') { print(summary(checkpoint)); return 0; }
    if (command === 'next' || command === 'start') {
      const now = Date.now();
      const settled = settledStatus(checkpoint, now);
      if (settled) {
        const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => { if (settled === 'paused_budget') closeClock(state, now); state.status = settled; });
        if (command === 'start') throw new Error(`No eligible task; run is ${settled}`);
        print({ revision: next.revision, task: null, status: settled, reason: settled === 'exhausted' ? 'no grounded eligible task remains; this is not proof of full coverage' : 'budget reached' });
        return 0;
      }
    }
    if (command === 'next') {
      const task = selectNextDiscoveryTask(checkpoint);
      print(task ? { revision: checkpoint.revision, mode: modeFor(task), task } : { revision: checkpoint.revision, task: null, status: checkpoint.status, reason: checkpoint.current_task ? 'task in progress' : 'no eligible task or budget/status stops run' });
      return 0;
    }
    if (command === 'pause' || command === 'resume') {
      const now = Date.now();
      if (checkpoint.current_task) throw new Error('A task is in progress; apply its outcome or abandon it before pause/resume');
      const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => {
        closeClock(state, now);
        if (command === 'pause') {
          if (state.status === 'active') state.status = 'paused';
          return;
        }
        if (state.status === 'active') throw new Error('Run is already active');
        if (state.status === 'exhausted') throw new Error('Run is exhausted; requeue a blocked task with a reason to continue');
        const raised = applyLimits(state, flags);
        if (state.status === 'paused_budget' && !raised) throw new Error('Budget reached; resume requires a higher limit');
        state.status = 'active';
        state.budget.active_since = now;
      });
      print(summary(next));
      return 0;
    }
    if (command === 'start') {
      const pending = checkpoint.mutations.find(item => item.status === 'pending');
      if (pending) throw new Error(`Mutation ${pending.id} is pending; reconcile it from read-only observation before any further task`);
      const preview = selectNextDiscoveryTask(checkpoint);
      if (!preview) throw new Error('No eligible task; check status, budget or blockers');
      let authorization: DiscoveryAuthorization | null = null;
      if (preview.category === 'mutation') {
        const candidate = checkpoint.mutation_candidates.find(item => item.task_id === preview.id && item.status === 'pending');
        let denial: string | null = null;
        if (!candidate) denial = 'Mutation task has no pending candidate';
        else if (typeof flags.authorization !== 'string') denial = 'Mutation task requires externally supplied --authorization';
        else if (typeof flags['current-url'] !== 'string') denial = 'Mutation task requires --current-url from the plugin tab';
        else if (checkpoint.consumed_mutations.includes(mutationFingerprint(candidate)) || checkpoint.mutations.some(item => item.fingerprint === mutationFingerprint(candidate))) {
          denial = 'Mutation fingerprint already reserved or consumed';
        } else {
          const authDir = await realpath(path.join(projectRoot, AUTHORIZATION_DIR)).catch(() => null);
          const authPath = await realpath(flags.authorization).catch(() => null);
          if (!authDir || !authPath || !authPath.startsWith(`${authDir}${path.sep}`)) denial = `Authorization must be a tester-owned file under ${AUTHORIZATION_DIR}/`;
          else authorization = JSON.parse(await readFile(authPath, 'utf8')) as DiscoveryAuthorization;
        }
        if (!denial && candidate && authorization) {
          const decision = evaluateDiscoveryMutation(candidate, authorization, {
            run_id: runId, environment: environmentName, current_url: flags['current-url'] as string, now: new Date().toISOString(),
            guards: { PACO_ALLOW_MUTATION: env.PACO_ALLOW_MUTATION, PACO_ALLOW_DESTRUCTIVE: env.PACO_ALLOW_DESTRUCTIVE }, safety: config.safety,
          });
          if (!decision.allowed) denial = `Mutation blocked: ${decision.reason}`;
          else if (checkpoint.legacy_notes.some(note => note.startsWith(LEGACY_MUTATION_NOTE)) && authorization.legacy_reviewed !== true) {
            denial = 'Legacy mutation history exists; tester must review the legacy ledger and set legacy_reviewed in the authorization';
          }
        }
        if (denial) {
          // Ghi blocker để planner không chọn lại vô hạn; branch an toàn khác vẫn tiếp tục.
          await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => {
            const task = state.queue.find(item => item.id === preview.id)!;
            task.status = 'blocked';
            task.reason = denial!;
            if (!state.blocked_tasks.includes(task.id)) state.blocked_tasks.push(task.id);
            const gap = `${task.id}: ${denial}`;
            if (!state.known_gaps.includes(gap)) state.known_gaps.push(gap);
          });
          throw new Error(denial);
        }
      }
      let started: DiscoveryTask | null = null;
      let reservationId: string | undefined;
      const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => {
        started = startDiscoveryTask(state);
        if (!started || started.id !== preview.id) throw new Error('Selected task changed; retry');
        if (authorization) {
          const candidate = state.mutation_candidates.find(item => item.task_id === started!.id && item.status === 'pending')!;
          // Reserve trước side effect để crash không bao giờ khiến click lặp lại.
          reservationId = reserveDiscoveryMutation(state, candidate, authorizationDigest(authorization)).id;
        }
      });
      print({ revision: next.revision, mode: modeFor(started!), task: started, reservation_id: reservationId ?? null });
      return 0;
    }
    if (command === 'apply') {
      if (typeof flags.outcome !== 'string') throw new UsageError('--outcome is required');
      const outcome = JSON.parse(await readFile(flags.outcome, 'utf8')) as DiscoveryChildOutcome;
      if (checkpoint.applied_outcomes.includes(outcome.outcome_id)) { print({ ...summary(checkpoint), replay: true }); return 0; }
      const urls = [...(outcome.observed_states ?? []).map(item => item.state?.url), ...(outcome.new_tasks ?? []).map(task => task.state?.url)];
      if (urls.some(url => typeof url !== 'string' || !hostAllowed(url, [...config.safety.allowedHosts, ...config.safety.externalDevHosts]))) throw new Error('Invalid outcome: state URL outside configured Paco hosts');
      const reservation = checkpoint.mutations.find(item => item.task_id === checkpoint.current_task && item.status === 'pending');
      const valid = validateDiscoveryChildOutcome(outcome, { ...identity, task_id: checkpoint.current_task ?? '', revision: checkpoint.revision, reservation_id: reservation?.id });
      if (!valid.ok) throw new Error(`Invalid outcome: ${valid.issues.join('; ')}`);
      const artifacts = await verifyDiscoveryArtifacts(outcome, projectRoot);
      if (!artifacts.ok) throw new Error(`Invalid artifacts: ${artifacts.issues.join('; ')}`);
      const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => { applyDiscoveryOutcome(state, outcome); });
      print(summary(next));
      return 0;
    }
    if (command === 'abandon') {
      if (typeof flags.task !== 'string' || typeof flags.reason !== 'string' || !flags.reason.trim()) throw new UsageError('abandon requires --task and --reason');
      const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => {
        const task = state.queue.find(item => item.id === flags.task);
        if (!task || task.status !== 'exploring' || state.current_task !== task.id) throw new Error('Only the in-progress task can be abandoned');
        if (state.mutations.some(item => item.task_id === task.id)) throw new Error('Task has a mutation reservation; reconcile it instead');
        task.status = task.attempts > state.budget.max_retries ? 'blocked' : 'queued';
        if (task.status === 'blocked' && !state.blocked_tasks.includes(task.id)) state.blocked_tasks.push(task.id);
        state.known_gaps.push(`${task.id}: abandoned: ${flags.reason as string}`);
        state.current_task = null;
      });
      print(summary(next));
      return 0;
    }
    if (command === 'requeue') {
      if (typeof flags.task !== 'string' || typeof flags.reason !== 'string' || !flags.reason.trim()) throw new UsageError('requeue requires --task and --reason');
      const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => {
        const task = state.queue.find(item => item.id === flags.task);
        if (!task || task.status !== 'blocked') throw new Error('Only a blocked task can be requeued');
        if (state.mutations.some(item => item.task_id === task.id)) throw new Error('Task already has a mutation reservation; requeue would risk repeating a side effect');
        task.status = 'queued';
        task.reason = `requeued: ${flags.reason as string}`;
        if (state.status === 'exhausted') { state.status = 'active'; state.budget.active_since = Date.now(); }
        state.blocked_tasks = state.blocked_tasks.filter(item => item !== task.id);
      });
      print(summary(next));
      return 0;
    }
    if (command === 'reconcile') {
      const status = flags.status;
      if (typeof flags.reservation !== 'string' || (status !== 'observed' && status !== 'indeterminate') || typeof flags.evidence !== 'string') {
        throw new UsageError('reconcile requires --reservation, --status observed|indeterminate and --evidence');
      }
      if (status === 'observed' && typeof flags.after !== 'string') throw new UsageError('observed reconciliation requires --after');
      const next = await updateDiscoveryCheckpoint(file, checkpoint.revision, (state) => {
        const entry = finalizeDiscoveryMutation(state, flags.reservation as string, {
          status, after: typeof flags.after === 'string' ? flags.after : undefined, evidence: [flags.evidence as string], cleanup: 'pending', leftovers: [],
        });
        if (state.current_task === entry.task_id) {
          const task = state.queue.find(item => item.id === entry.task_id);
          if (task) task.status = status === 'observed' ? 'verified-by-observation' : 'blocked';
          state.current_task = null;
        }
      });
      print(summary(next));
      return 0;
    }
    throw new UsageError(USAGE);
  } catch (error) {
    print(error instanceof UsageError ? `${error.message}\n${USAGE}` : `Error: ${(error as Error).message}`);
    return error instanceof UsageError ? 2 : 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) process.exitCode = await runDiscoverCli(process.argv.slice(2));
