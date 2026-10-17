import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { loadManifest, saveManifest } from './manifest-utils.js';
import { readMutationMode } from './manifest-mutation-mode.js';
import type { AutomationCaseExecution, AutomationVerification, TestResult } from './workflow-types.js';

interface CliArgs {
  ticketKey: string;
  caseId?: string;
  diagnose?: boolean;
  jsonOut?: string;
  writeBack?: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { ticketKey: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value) continue;
    if (value === '--diagnose') args.diagnose = true;
    else if (value === '--write-back') args.writeBack = true;
    else if (value === '--json') args.jsonOut = argv[++i];
    else if (!args.ticketKey) args.ticketKey = value;
    else if (!args.caseId) args.caseId = value;
  }
  if (!args.ticketKey) throw new Error('Usage: paco-cli <ticket> [<case-id>] [--diagnose] [--write-back] [--json <file>]');
  return args;
}

interface JsonReport {
  suites?: Array<{ specs?: Array<{ title: string; tests?: Array<{ results?: Array<{ status: string; error?: { message?: string } }> }> }> }>;
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

async function runPlaywright(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolveRun) => {
    const child = spawn('npx', ['playwright', 'test', ...args, '--reporter=json,json'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on('close', (code) => resolveRun({ stdout, stderr, exitCode: code ?? 1 }));
  });
}

// ponytail: surface runner injection when test layout grows past one fake spec
export const _runner = { runPlaywright };

function parseJsonReporter(stdout: string): JsonReport {
  const jsonStart = stdout.indexOf('{');
  if (jsonStart < 0) return {};
  try { return JSON.parse(stdout.slice(jsonStart)) as JsonReport; } catch { return {}; }
}

async function writeEvidence(ticketKey: string, caseId: string, runId: string, stdout: string, stderr: string, baseUrl = process.env.PACO_TEST_RESULTS ?? 'test-results'): Promise<string> {
  const outDir = resolve(baseUrl, ticketKey, caseId, runId);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'stdout.txt'), stdout, 'utf8');
  await writeFile(join(outDir, 'stderr.txt'), stderr, 'utf8');
  return outDir;
}

export interface BatchOutcome {
  ticket_key: string;
  runs: Record<string, AutomationCaseExecution>;
  summary: { total: number; pass: number; fail: number; blocked: number; not_run: number; inconclusive: number };
}

async function executeOne(
  manifest: Awaited<ReturnType<typeof loadManifest>>,
  ticketKey: string,
  caseId: string,
  diagnose: boolean,
  now: string,
  runner: (args: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }> = runPlaywright,
): Promise<AutomationCaseExecution> {
  const implemented = manifest.execution.automation[caseId];
  if (!implemented?.spec_path) throw new Error(`${caseId}: automation spec_path is missing`);
  const runId = now.replace(/[:.]/g, '-');
  const evidenceDir = await writeEvidence(ticketKey, caseId, runId, '', '');
  const cliResult = await runner([implemented.spec_path]);
  await writeFile(join(evidenceDir, 'stdout.txt'), cliResult.stdout, 'utf8');
  await writeFile(join(evidenceDir, 'stderr.txt'), cliResult.stderr, 'utf8');
  const report = parseJsonReporter(cliResult.stdout);
  const firstResult = report.suites?.flatMap((s) => s.specs ?? []).flatMap((s) => s.tests ?? []).flatMap((t) => t.results ?? [])[0];
  const status = firstResult?.status ?? (cliResult.exitCode === 0 ? 'passed' : 'failed');
  const result = mapStatus(status);
  const verification = classifyVerification(firstResult?.error?.message ?? cliResult.stderr);
  const output: AutomationCaseExecution = {
    result,
    verification,
    evidence: [evidenceDir],
    product_result_changed: false,
  };
  if (diagnose) {
    output.diagnostic_attempts = [{
      id: `diag-${runId}`,
      data_variant: 'fresh_session',
      result,
      evidence: [evidenceDir],
      verification,
    }];
  }
  return output;
}

export async function runCase(args: CliArgs, now = new Date().toISOString(), runner: (args: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }> = runPlaywright): Promise<AutomationCaseExecution> {
  if (!args.caseId) throw new Error('runCase requires caseId');
  const manifestPath = join(process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets', args.ticketKey, 'manifest.yaml');
  const manifest = await loadManifest(manifestPath);
  if (manifest.execution.mode !== 'cli_first') throw new Error('Ticket execution.mode is not cli_first');
  const output = await executeOne(manifest, args.ticketKey, args.caseId, args.diagnose ?? false, now, runner);
  if (args.writeBack) {
    manifest.execution.runs[args.caseId] = output;
    await saveManifest(manifestPath, manifest);
  }
  return output;
}

export async function runBatch(args: CliArgs, now = new Date().toISOString(), runner: (args: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }> = runPlaywright): Promise<BatchOutcome> {
  const manifestPath = join(process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets', args.ticketKey, 'manifest.yaml');
  const manifest = await loadManifest(manifestPath);
  if (manifest.execution.mode !== 'cli_first') throw new Error('Ticket execution.mode is not cli_first');
  const cases = manifest.execution.case_ids.filter((caseId) => manifest.execution.automation[caseId]?.spec_path);
  const runs: Record<string, AutomationCaseExecution> = {};
  for (const caseId of cases) {
    runs[caseId] = await executeOne(manifest, args.ticketKey, caseId, args.diagnose ?? false, now, runner);
  }
  const summary = { total: cases.length, pass: 0, fail: 0, blocked: 0, not_run: 0, inconclusive: 0 };
  for (const run of Object.values(runs)) {
    summary[run.result.toLowerCase().replace(' ', '_') as keyof typeof summary] += 1;
  }
  if (args.writeBack) {
    manifest.execution.runs = { ...manifest.execution.runs, ...runs };
    await saveManifest(manifestPath, manifest);
  }
  return { ticket_key: args.ticketKey, runs, summary };
}

export async function main(argv = process.argv.slice(2)): Promise<AutomationCaseExecution | BatchOutcome | null> {
  const args = parseArgs(argv);
  const manifestPath = join(process.env.PACO_TICKET_OUTPUT ?? 'docs/tickets', args.ticketKey, 'manifest.yaml');
  const mode = await readMutationMode(manifestPath);
  if (mode) process.stderr.write(`mutationMode=${mode}\n`);
  const output = args.caseId ? await runCase(args) : await runBatch(args);
  if (args.jsonOut) {
    await mkdir(dirname(args.jsonOut), { recursive: true });
    await writeFile(args.jsonOut, JSON.stringify(output, null, 2), 'utf8');
  }
  return output;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((output) => {
    if (output) process.stdout.write(`${JSON.stringify(output)}\n`);
    else process.exitCode = 2;
  }).catch((error: Error) => {
    process.stderr.write(`paco-cli error: ${error.message}\n`);
    process.exitCode = 1;
  });
}
