/**
 * Autonomous paco-explore run bookkeeping: active-time budget, role lock, partial outcome.
 * Chạy: npm run explore:run -- <start|tick|checkpoint|close|status> [flags]
 * Output: một dòng JSON để agent quyết định; không bao giờ in credentials.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseDocument } from 'yaml';

export const STATE_PATH = 'docs/product/explore/autonomous-state.yaml';
export const RUNS_DIR = 'test-results/product-explore';
/** Khoảng cách giữa hai tick lớn hơn mức này coi là pause/compaction, chỉ tính tối đa mức này. */
export const IDLE_CAP_MINUTES = 10;

export interface Budget { max_features: number; max_minutes: number; max_meaningful_states: number }
export interface Used { features: number; minutes: number; meaningful_states: number }
export interface ActiveRun {
  run_id: string | null;
  started_at: string | null;
  budget: Budget;
  used: Used;
  locked_role?: string | null;
  last_tick_at?: string | null;
  stage: string;
  stop_reason?: string | null;
  [k: string]: unknown;
}

export interface TickResult { used: Used; remaining_minutes: number; stop: boolean; stop_reason: string | null }

/** Cộng thời gian active từ tick trước, cắt các khoảng idle dài (pause, compaction, chờ tester). */
export function applyTick(run: ActiveRun, now: Date, opts: { states?: number; featureDone?: boolean; observedRole?: string } = {}): TickResult {
  const used = { ...run.used };
  const last = run.last_tick_at ? Date.parse(run.last_tick_at) : now.getTime();
  const gapMin = Math.max(0, (now.getTime() - last) / 60000);
  used.minutes = round1(used.minutes + Math.min(gapMin, IDLE_CAP_MINUTES));
  used.meaningful_states += opts.states ?? 0;
  if (opts.featureDone) used.features += 1;
  run.used = used;
  run.last_tick_at = now.toISOString();

  let stop_reason: string | null = null;
  if (opts.observedRole !== undefined && run.locked_role && opts.observedRole.trim() !== run.locked_role) stop_reason = 'role_drift';
  else if (used.minutes >= run.budget.max_minutes) stop_reason = 'budget_minutes';
  else if (used.features >= run.budget.max_features) stop_reason = 'budget_features';
  else if (used.meaningful_states >= run.budget.max_meaningful_states) stop_reason = 'budget_states';
  if (stop_reason) run.stop_reason = stop_reason;
  return { used, remaining_minutes: round1(Math.max(0, run.budget.max_minutes - used.minutes)), stop: stop_reason !== null, stop_reason };
}

export function newRunId(now: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `auto-${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}-${p(now.getUTCHours())}${p(now.getUTCMinutes())}`;
}

/** Ghi outcome.json ngay từ đầu run và merge từng feature, để compaction không làm mất outcome. */
export function mergeOutcome(path: string, patch: Record<string, unknown>, feature?: Record<string, unknown>): Record<string, unknown> {
  const current = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
  const next = { ...current, ...patch, updated_at: new Date().toISOString() };
  if (feature) {
    const list: Record<string, unknown>[] = Array.isArray(current.features) ? current.features : [];
    const i = list.findIndex(f => f.feature === feature.feature);
    if (i >= 0) list[i] = { ...list[i], ...feature }; else list.push(feature);
    next.features = list;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(next, null, 2) + '\n');
  return next;
}

/** Đọc PAC_ROLE trong .env (chỉ key này) để cảnh báo auto-login sẽ chọn role khác locked role. */
export function envLoginRole(envPath = '.env'): string | null {
  if (process.env.PAC_ROLE) return process.env.PAC_ROLE;
  if (!existsSync(envPath)) return null;
  const m = readFileSync(envPath, 'utf8').match(/^PAC_ROLE=(.*)$/m);
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : 'Blinx Deployment';
}

function round1(n: number): number { return Math.round(n * 10) / 10; }

function parseFlags(argv: string[]): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const val = argv[i + 1];
    if (val === undefined || val.startsWith('--')) out[key] = true; else { out[key] = val; i++; }
  }
  return out;
}

export function runCli(argv: string[], statePath = STATE_PATH, now = new Date()): Record<string, unknown> {
  const [cmd, ...rest] = argv;
  const flags = parseFlags(rest);
  const doc = parseDocument(readFileSync(statePath, 'utf8'));
  const role = typeof flags.role === 'string' ? flags.role : null;
  const roles = doc.toJS().roles ?? {};
  const roleKey = role ?? Object.keys(roles).find(k => roles[k]?.active_run?.stage && roles[k].active_run.stage !== 'done') ?? null;
  if (!roleKey) return { ok: false, error: 'Cần --role (không có active run nào đang mở)' };
  const runPath = ['roles', roleKey, 'active_run'];
  const run = (doc.getIn(runPath) as { toJSON(): ActiveRun } | undefined)?.toJSON();
  const save = (r: ActiveRun) => { doc.setIn(runPath, doc.createNode(r)); writeFileSync(statePath, doc.toString()); };
  const outcomePath = (id: string) => join(RUNS_DIR, id, 'outcome.json');

  switch (cmd) {
    case 'start': {
      if (run && run.stage !== 'done') return { ok: false, error: `Run ${run.run_id} đang ${run.stage}; resume hoặc close trước` };
      const budget: Budget = {
        max_features: Number(flags['max-features'] ?? run?.budget?.max_features ?? 6),
        max_minutes: Number(flags['max-minutes'] ?? run?.budget?.max_minutes ?? 120),
        max_meaningful_states: Number(flags['max-states'] ?? run?.budget?.max_meaningful_states ?? 80),
      };
      const id = newRunId(now);
      const next: ActiveRun = {
        ...(run ?? {}), run_id: id, started_at: now.toISOString(), budget,
        used: { features: 0, minutes: 0, meaningful_states: 0 }, locked_role: roleKey, last_tick_at: now.toISOString(),
        stage: 'running', stop_reason: null, pending_mutation: null,
        ledger_path: join(RUNS_DIR, id, 'ledger.md'), outcome_path: outcomePath(id),
      };
      save(next);
      mergeOutcome(outcomePath(id), { mode: 'AUTONOMOUS', run_id: id, role: roleKey, stage: 'running', started_at: next.started_at, budget, features: [] });
      const loginRole = envLoginRole();
      return { ok: true, run_id: id, locked_role: roleKey, budget, warning: loginRole && loginRole !== roleKey ? `auto-login (.env PAC_ROLE) chọn '${loginRole}', khác locked role` : null };
    }
    case 'tick': {
      if (!run || run.stage === 'done') return { ok: false, error: 'Không có active run' };
      run.locked_role ??= roleKey; // run tạo trước khi có role lock
      if (flags.resume) run.last_tick_at = now.toISOString(); // resume sau /clear: không tính khoảng nghỉ
      const res = applyTick(run, now, {
        states: flags.states ? Number(flags.states) : 0,
        featureDone: flags['feature-done'] === true,
        observedRole: typeof flags['observed-role'] === 'string' ? flags['observed-role'] : undefined,
      });
      if (res.stop_reason === 'role_drift') run.stage = 'paused';
      save(run);
      return { ok: true, run_id: run.run_id, ...res };
    }
    case 'checkpoint': {
      if (!run?.run_id) return { ok: false, error: 'Không có active run' };
      const feature = typeof flags.feature === 'string'
        ? { feature: flags.feature, status: flags.status ?? 'partial', summary: flags.summary ?? null, ledger_refs: flags.ledger ?? null }
        : undefined;
      mergeOutcome(outcomePath(run.run_id), { stage: run.stage, used: run.used, stop_reason: run.stop_reason ?? null }, feature);
      return { ok: true, outcome_path: outcomePath(run.run_id), feature: feature?.feature ?? null };
    }
    case 'close': {
      if (!run?.run_id) return { ok: false, error: 'Không có active run' };
      applyTick(run, now);
      run.stage = flags.paused ? 'paused' : 'done';
      run.stop_reason = typeof flags.reason === 'string' ? flags.reason : run.stop_reason ?? 'closed';
      save(run);
      mergeOutcome(outcomePath(run.run_id), { stage: run.stage, stop_reason: run.stop_reason, used: run.used, closed_at: now.toISOString() });
      return { ok: true, run_id: run.run_id, stage: run.stage, used: run.used };
    }
    case 'status': {
      if (!run) return { ok: false, error: 'Không có active run' };
      return { ok: true, run_id: run.run_id, stage: run.stage, locked_role: run.locked_role ?? roleKey, used: run.used, budget: run.budget, pending_mutation: run.pending_mutation ?? null };
    }
    default:
      return { ok: false, error: 'Usage: explore:run <start|tick|checkpoint|close|status> [--role R]' };
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const result = runCli(process.argv.slice(2));
  process.stdout.write(JSON.stringify(result) + '\n');
  process.exitCode = result.ok ? 0 : 1;
}
