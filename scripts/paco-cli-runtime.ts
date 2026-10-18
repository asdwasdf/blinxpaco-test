// Harden paco-cli runner for CLI-first execution.
// Owns: diagnostic loop, mutation gate, evidence expansion, manual-vs-CLI compare,
// mutation-ledger append, config loader glue. Public surface lets paco-cli.ts keep
// its legacy `(args, now?, runner?)` signature via adaptRunner shim.

import { spawn } from 'node:child_process';
import { mkdir, writeFile, copyFile, access } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { loadConfig, getDefaultEnvironment } from './load-config.js';
import { loadManifest, saveManifest, type Manifest } from './manifest-utils.js';
import { applyTicketMutationMode } from './apply-ticket-mutation-mode.js';
import { readMutationMode } from './manifest-mutation-mode.js';
import { evaluateMutationGate, type MutationRunScope } from './mutation-gate.js';
import { appendLedgerEntry } from './mutation-ledger.js';
import type {
  AutomationCaseExecution,
  AutomationCaseImplementation,
  AutomationVerification,
  DiagnosticAttempt,
  MutationClass,
  PacoConfig,
  TestResult,
} from './workflow-types.js';

export interface RunnerContext {
  baseUrl: string;
  childEnv: Record<string, string>;
  safety: PacoConfig['safety'];
  ticketKey: string;
  caseId: string;
  envName: string;
  specPath: string;
  variant?: string;
}

export interface RunnerResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  traceZip?: string;
  reportDir?: string;
}

export type Runner = (ctx: RunnerContext, args: string[]) => Promise<RunnerResult>;

export interface RunCaseInput {
  ticketKey: string;
  caseId?: string;
  diagnose?: boolean;
  writeBack?: boolean;
  jsonOut?: string;
  env?: string;
  host?: string;
  dryRun?: boolean;
}

export interface RuntimeOptions {
  now?: string;
  configPath?: string;
  runner?: Runner;
}

export interface BatchOutcome {
  ticket_key: string;
  runs: Record<string, AutomationCaseExecution>;
  summary: { total: number; pass: number; fail: number; blocked: number; not_run: number; inconclusive: number };
}

const DIAGNOSTIC_VARIANTS = ['same', 'clean', 'fresh_session', 'control'] as const;
type DiagnosticVariant = (typeof DIAGNOSTIC_VARIANTS)[number];

function manifestPathFor(ticketKey: string): string {
  return join(process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets', ticketKey, 'manifest.yaml');
}

function evidenceBaseFor(ticketKey: string): string {
  return process.env.PACO_TEST_RESULTS ?? 'test-results';
}

export function buildChildEnv(config: PacoConfig, envName: string): { childEnv: Record<string, string>; safety: PacoConfig['safety']; baseUrl: string } {
  const envEntry = config.environments[envName] ?? getDefaultEnvironment(config);
  const envObj = typeof envEntry === 'string' ? getDefaultEnvironment(config) : envEntry;
  const baseUrl = envObj.baseUrl;
  const childEnv: Record<string, string> = { ...(process.env as Record<string, string>), BASE_URL: baseUrl, PACO_DEFAULT_ENV: envName, PACO_ALLOWED_HOSTS: config.safety.allowedHosts.join(','), PACO_MUTATION_ENVS: config.safety.mutationEnabledEnvironments.join(',') };
  return { childEnv, safety: config.safety, baseUrl };
}

export function defaultRunner(): Runner {
  return async (ctx, args) => {
    const result = await new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolveRun) => {
      const child = spawn('npx', ['playwright', 'test', ...args, '--reporter=json,json'], { env: ctx.childEnv, stdio: ['ignore', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
      child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
      child.on('close', (code) => resolveRun({ stdout, stderr, exitCode: code ?? 1 }));
    });
    // Trace zip lives under <testDir>/<spec-title>/trace.zip when trace is enabled.
    const traceZip = await findFirstFile(ctx, 'trace.zip');
    return { ...result, traceZip, reportDir: process.env.PLAYWRIGHT_HTML_REPORT };
  };
}

async function findFirstFile(ctx: RunnerContext, filename: string): Promise<string | undefined> {
  const root = resolve(evidenceBaseFor(ctx.ticketKey));
  const candidate = join(root, ctx.caseId, filename);
  try { await access(candidate); return candidate; } catch { return undefined; }
}

interface JsonReport { suites?: Array<{ specs?: Array<{ title: string; tests?: Array<{ results?: Array<{ status: string; error?: { message?: string } }> }> }> }> }

function parseJsonReporter(stdout: string): JsonReport {
  const start = stdout.indexOf('{');
  if (start < 0) return {};
  try { return JSON.parse(stdout.slice(start)) as JsonReport; } catch { return {}; }
}

function mapStatus(status: string): TestResult {
  switch (status) {
    case 'passed': return 'Pass';
    case 'failed': return 'Fail';
    case 'timedOut': return 'Inconclusive';
    case 'skipped': return 'Not Run';
    case 'interrupted': return 'Blocked';
    default: return 'Inconclusive';
  }
}

function classifyVerification(message: string | undefined): AutomationVerification {
  if (!message) return 'Matched product result';
  if (/locator|selector|getByRole|getByText/i.test(message) && /not found|resolved to|multiple elements/i.test(message)) return 'Automation defect';
  if (/auth|session|login|expired|401|403/i.test(message)) return 'Setup or authentication failure';
  if (/expected|assertion|toBeVisible|toEqual/i.test(message)) return 'Matched product result';
  return 'Inconclusive';
}

function compareToManual(manual: Manifest['execution']['manual'][string] | undefined, cliResult: TestResult, rawVerification: AutomationVerification): AutomationVerification {
  // Raw verification wins for clear defect/auth signals; otherwise fall back to manual compare.
  if (rawVerification === 'Automation defect' || rawVerification === 'Setup or authentication failure') return rawVerification;
  if (!manual) return rawVerification === 'Inconclusive' ? 'Inconclusive' : 'Matched product result';
  // ponytail: paco-report will consume verification as Product Result input;
  // add feature-map lookup here when product knowledge sync lands.
  if (manual.result === cliResult) return 'Matched product result';
  if ((manual.result === 'Pass' && cliResult === 'Fail') || (manual.result === 'Fail' && cliResult === 'Pass')) return 'Product behavior mismatch';
  if (manual.result === 'Pass' && (cliResult === 'Blocked' || cliResult === 'Inconclusive' || cliResult === 'Not Run')) return 'Product behavior mismatch';
  return 'Inconclusive';
}

async function writeEvidenceDir(dir: string, content: { stdout: string; stderr: string; verification: string; raw?: unknown; traceZip?: string; reportDir?: string; blockedReason?: string }): Promise<void> {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'stdout.txt'), content.stdout, 'utf8');
  await writeFile(join(dir, 'stderr.txt'), content.stderr, 'utf8');
  await writeFile(join(dir, 'verification.txt'), content.verification, 'utf8');
  if (content.raw !== undefined) await writeFile(join(dir, 'runner.json'), JSON.stringify(content.raw, null, 2), 'utf8');
  if (content.traceZip) {
    const target = join(dir, 'trace.zip');
    try { await copyFile(content.traceZip, target); } catch { /* copy failure is non-fatal */ }
  }
  if (content.blockedReason) await writeFile(join(dir, 'blocked-reason.txt'), content.blockedReason, 'utf8');
}

function relativePosix(from: string, to: string): string {
  return relative(from, to).split('\\').join('/');
}

function mutationClassOf(impl: AutomationCaseImplementation | undefined): MutationClass {
  if (!impl) return 'None';
  const candidate = (impl as { mutation_class?: unknown }).mutation_class;
  if (candidate === 'Temporary' || candidate === 'Persistent' || candidate === 'Destructive' || candidate === 'None') return candidate;
  return 'None';
}

interface PreparedRun {
  manifest: Manifest;
  caseId: string;
  specPath: string;
  automation: AutomationCaseImplementation;
  manual: Manifest['execution']['manual'][string] | undefined;
  mutationClass: MutationClass;
  mutationMode: 'auto' | 'manual' | null;
  safety: PacoConfig['safety'];
  baseUrl: string;
  envName: string;
  childEnv: Record<string, string>;
  config: PacoConfig;
}

async function prepareRun(input: RunCaseInput, opts: RuntimeOptions): Promise<PreparedRun> {
  if (!input.caseId) throw new Error('runCase requires caseId');
  const config = loadConfig(opts.configPath);
  const manifestPath = manifestPathFor(input.ticketKey);
  const manifest = await loadManifest(manifestPath);
  if (manifest.execution.mode !== 'cli_first') throw new Error('Ticket execution.mode is not cli_first');
  const automation = manifest.execution.automation[input.caseId];
  if (!automation?.spec_path) throw new Error(`${input.caseId}: automation spec_path is missing`);
  const envName = input.env ?? config.environments.default;
  const { childEnv, safety, baseUrl } = buildChildEnv(config, envName);
  const mutationClass = mutationClassOf(automation);
  const mutationMode = await readMutationMode(manifestPath);
  return { manifest, caseId: input.caseId, specPath: automation.spec_path, automation, manual: manifest.execution.manual[input.caseId], mutationClass, mutationMode, safety, baseUrl, envName, childEnv, config };
}

interface AttemptResult { result: TestResult; verification: AutomationVerification; evidence: string[]; traceZip?: string }

async function runAttempt(runner: Runner, ctx: RunnerContext, specPath: string): Promise<AttemptResult> {
  const raw = await runner(ctx, [specPath]);
  const report = parseJsonReporter(raw.stdout);
  const firstResult = report.suites?.flatMap((s) => s.specs ?? []).flatMap((s) => s.tests ?? []).flatMap((t) => t.results ?? [])[0];
  const status = firstResult?.status ?? (raw.exitCode === 0 ? 'passed' : 'failed');
  const result = mapStatus(status);
  const verification = classifyVerification(firstResult?.error?.message ?? raw.stderr);
  return { result, verification, evidence: [], traceZip: raw.traceZip };
}

export async function runCaseRuntime(input: RunCaseInput, opts: RuntimeOptions = {}): Promise<AutomationCaseExecution> {
  const now = opts.now ?? new Date().toISOString();
  const prepared = await prepareRun(input, opts);
  const { manifest, caseId, specPath, mutationClass, mutationMode, safety, baseUrl, envName, childEnv, config } = prepared;
  const runId = now.replace(/[:.]/g, '-');
  const runner = opts.runner ?? defaultRunner();
  const evidenceRoot = resolve(evidenceBaseFor(input.ticketKey), caseId, runId);

  // Mutation gate: refuse to run mutating spec when host is not allowed.
  if (mutationClass !== 'None' && input.env && input.host) {
    await applyTicketMutationMode(input.ticketKey, input.env, input.host, 'paco-ticket');
    const scope: MutationRunScope = {
      run_id: runId,
      environment: input.env,
      current_url: baseUrl,
      ticket_key: input.ticketKey,
      case_id: caseId,
      action: 'execute-spec',
      test_data_fingerprint: `cli:${specPath}:rev${prepared.automation.input_revision}`,
      mutation_class: mutationClass,
    };
    const decision = evaluateMutationGate(scope, null, { PACO_ALLOW_MUTATION: process.env.PACO_ALLOW_MUTATION, PACO_ALLOW_DESTRUCTIVE: process.env.PACO_ALLOW_DESTRUCTIVE }, now, safety, undefined, mutationMode ?? undefined);
    if (!decision.allowed) {
      const blockedDir = join(evidenceRoot, 'blocked');
      await writeEvidenceDir(blockedDir, { stdout: '', stderr: '', verification: 'Inconclusive', blockedReason: decision.reason });
      const execution: AutomationCaseExecution = { result: 'Blocked', verification: 'Inconclusive', evidence: [relativePosix(process.cwd(), blockedDir)], product_result_changed: false };
      if (input.writeBack) {
        manifest.execution.runs[caseId] = execution;
        await saveManifest(manifestPathFor(input.ticketKey), manifest);
      }
      return execution;
    }
  }

  if (input.diagnose) {
    const attempts: DiagnosticAttempt[] = [];
    for (const variant of DIAGNOSTIC_VARIANTS) {
      const ctx: RunnerContext = { baseUrl, childEnv, safety, ticketKey: input.ticketKey, caseId, envName, specPath, variant };
      const attemptDir = join(evidenceRoot, variant);
      const attempt = await runAttempt(runner, ctx, specPath);
      await writeEvidenceDir(attemptDir, { stdout: '', stderr: '', verification: attempt.verification, raw: attempt });
      const evidence: string[] = [relativePosix(process.cwd(), attemptDir)];
      if (attempt.traceZip) evidence.push(relativePosix(process.cwd(), attempt.traceZip));
      attempts.push({ id: `diag-${runId}-${variant}`, data_variant: variant, result: attempt.result, evidence, verification: attempt.verification });
      if (attempt.result === 'Pass') break;
    }
    const finalResult = attempts.find((a) => a.result === 'Pass')?.result ?? attempts[attempts.length - 1]?.result ?? 'Inconclusive';
    const lastAttempt = attempts[attempts.length - 1];
    const finalVerification = compareToManual(prepared.manual, finalResult, lastAttempt?.verification ?? 'Inconclusive');
    const execution: AutomationCaseExecution = { result: finalResult, verification: finalVerification, evidence: [relativePosix(process.cwd(), evidenceRoot)], product_result_changed: false, diagnostic_attempts: attempts };
    // Ledger for mutating diagnose runs (auto mode only).
    if (mutationClass !== 'None' && mutationMode === 'auto' && input.env && input.host) {
      await appendLedgerEntry(input.ticketKey, { env: input.env, host: input.host, skill: 'paco-cli', action_class: mutationClass, target: specPath, scope_ref: `${input.ticketKey}:${caseId}`, test_data: 'cli-runner', source: 'manifest', result: 'executed' });
    }
    if (input.writeBack) {
      manifest.execution.runs[caseId] = execution;
      await saveManifest(manifestPathFor(input.ticketKey), manifest);
    }
    return execution;
  }

  // Single attempt
  const ctx: RunnerContext = { baseUrl, childEnv, safety, ticketKey: input.ticketKey, caseId, envName, specPath };
  const attempt = await runAttempt(runner, ctx, specPath);
  await writeEvidenceDir(evidenceRoot, { stdout: '', stderr: '', verification: attempt.verification, raw: attempt, traceZip: attempt.traceZip });
  const evidence = [relativePosix(process.cwd(), evidenceRoot)];
  if (attempt.traceZip) {
    const copied = join(evidenceRoot, 'trace.zip');
    try { await copyFile(attempt.traceZip, copied); } catch { /* ignore */ }
    evidence.push(relativePosix(process.cwd(), copied));
  }
  const verification = compareToManual(prepared.manual, attempt.result, attempt.verification);
  const execution: AutomationCaseExecution = { result: attempt.result, verification, evidence, product_result_changed: false };
  // Ledger for mutating single-attempt runs (auto mode only).
  if (mutationClass !== 'None' && mutationMode === 'auto' && input.env && input.host) {
    await appendLedgerEntry(input.ticketKey, { env: input.env, host: input.host, skill: 'paco-cli', action_class: mutationClass, target: specPath, scope_ref: `${input.ticketKey}:${caseId}`, test_data: 'cli-runner', source: 'manifest', result: 'executed' });
  }
  if (input.writeBack) {
    manifest.execution.runs[caseId] = execution;
    await saveManifest(manifestPathFor(input.ticketKey), manifest);
  }
  return execution;
}

export async function runBatchRuntime(input: RunCaseInput, opts: RuntimeOptions = {}): Promise<BatchOutcome> {
  const manifestPath = manifestPathFor(input.ticketKey);
  const manifest = await loadManifest(manifestPath);
  if (manifest.execution.mode !== 'cli_first') throw new Error('Ticket execution.mode is not cli_first');
  const cases = manifest.execution.case_ids.filter((caseId) => manifest.execution.automation[caseId]?.spec_path);
  const runs: Record<string, AutomationCaseExecution> = {};
  for (const caseId of cases) {
    runs[caseId] = await runCaseRuntime({ ...input, caseId }, opts);
  }
  const summary = { total: cases.length, pass: 0, fail: 0, blocked: 0, not_run: 0, inconclusive: 0 };
  for (const run of Object.values(runs)) {
    const key = run.result.toLowerCase().replace(' ', '_') as keyof typeof summary;
    summary[key] += 1;
  }
  if (input.writeBack) {
    manifest.execution.runs = { ...manifest.execution.runs, ...runs };
    await saveManifest(manifestPath, manifest);
  }
  return { ticket_key: input.ticketKey, runs, summary };
}
