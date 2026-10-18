import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { readMutationMode } from './manifest-mutation-mode.js';
import { runCaseRuntime, runBatchRuntime, type Runner, type RunnerContext, type BatchOutcome } from './paco-cli-runtime.js';
import type { AutomationCaseExecution } from './workflow-types.js';

interface CliArgs {
  ticketKey: string;
  caseId?: string;
  diagnose?: boolean;
  jsonOut?: string;
  writeBack?: boolean;
  env?: string;
  host?: string;
  dryRun?: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { ticketKey: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value) continue;
    if (value === '--diagnose') args.diagnose = true;
    else if (value === '--write-back') args.writeBack = true;
    else if (value === '--dry-run') args.dryRun = true;
    else if (value === '--json') args.jsonOut = argv[++i];
    else if (value === '--env') { const v = argv[++i]; if (v) args.env = v; }
    else if (value === '--host') { const v = argv[++i]; if (v) args.host = v; }
    else if (!args.ticketKey) args.ticketKey = value;
    else if (!args.caseId) args.caseId = value;
  }
  if (!args.ticketKey) throw new Error('Usage: paco-cli <ticket> [<case-id>] [--diagnose] [--write-back] [--json <file>] [--env <name>] [--host <host>] [--dry-run]');
  return args;
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

function adaptRunner(legacy?: (args: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }>): Runner | undefined {
  if (!legacy) return undefined;
  return async (_ctx: RunnerContext, args: string[]) => {
    const r = await legacy(args);
    return { ...r };
  };
}

export type { BatchOutcome };

export async function runCase(args: CliArgs, now = new Date().toISOString(), runner: (args: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }> = runPlaywright): Promise<AutomationCaseExecution> {
  if (!args.caseId) throw new Error('runCase requires caseId');
  return runCaseRuntime(
    { ticketKey: args.ticketKey, caseId: args.caseId, diagnose: args.diagnose, writeBack: args.writeBack, env: args.env, host: args.host, dryRun: args.dryRun },
    { now, runner: adaptRunner(runner) },
  );
}

export async function runBatch(args: CliArgs, now = new Date().toISOString(), runner: (args: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }> = runPlaywright): Promise<BatchOutcome> {
  return runBatchRuntime(
    { ticketKey: args.ticketKey, diagnose: args.diagnose, writeBack: args.writeBack, env: args.env, host: args.host, dryRun: args.dryRun },
    { now, runner: adaptRunner(runner) },
  );
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
  if (args.dryRun) return output;
  // Exit code table: 0 = at least one Pass and no Blocked/Inconclusive/Not Run;
  // 2 = usage error (caller decides); 1 = runtime error (caller decides); 3 = soft-block.
  const runs: AutomationCaseExecution[] = 'runs' in output ? Object.values(output.runs) : [output as AutomationCaseExecution];
  const hasPass = runs.some((r) => r.result === 'Pass');
  const hasSoftBlock = runs.some((r) => r.result === 'Blocked' || r.result === 'Inconclusive' || r.result === 'Not Run');
  if (hasSoftBlock) process.exitCode = 3;
  else if (hasPass) process.exitCode = 0;
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
