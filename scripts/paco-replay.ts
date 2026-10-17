import { mkdir, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { randomUUID } from 'node:crypto';

const COMMANDS = ['init', 'fetch', 'resume', 'finalize', 'status'] as const;
const VALUE_FLAGS = ['batch-id', 'batch-size', 'environment', 'checkpoint', 'project-root'];
const BOOLEAN_FLAGS = ['skip-imported', 'force'];
const USAGE = `Usage: npm run paco:replay -- <${COMMANDS.join('|')}> --batch-id <id> [--batch-size N] [--environment dev] [--skip-imported] [--force]`;

class UsageError extends Error {}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function now(): string {
  return new Date().toISOString();
}

export interface ReplayTicket {
  key: string;
  summary: string;
  status: string;
  assignee?: string;
  reporter?: string;
  created?: string;
  updated?: string;
  resolution_date?: string;
  labels: string[];
  components: string[];
  linked_issues: string[];
  checksum?: string;
  processed?: boolean;
  result?: 'verified' | 'failed' | 'blocked' | 'partially_replayed' | 'not_reproducible' | 'skipped' | 'pending';
  result_reason?: string;
  evidence_refs?: string[];
  flow_slug?: string;
  linked_existing_flow?: boolean;
}

export interface ReplayCheckpoint {
  schema_version: 1;
  batch_id: string;
  created_at: string;
  updated_at: string;
  environment: string;
  status: 'active' | 'paused' | 'completed' | 'partially_completed' | 'failed';
  batch_size: number;
  skip_imported: boolean;
  tickets: ReplayTicket[];
  processed_count: number;
  verified_count: number;
  failed_count: number;
  blocked_count: number;
  skipped_count: number;
  partially_replayed_count: number;
  not_reproducible_count: number;
  new_flows: string[];
  deduplicated_flows: string[];
  revision: number;
  mutation_mode: 'auto' | 'manual';
}

function parse(argv: string[]): { command: (typeof COMMANDS)[number]; flags: Record<string, string | true> } {
  const [command, ...rest] = argv;
  if (!COMMANDS.includes(command as (typeof COMMANDS)[number])) throw new UsageError(`Unknown command: ${command ?? ''}`);
  const flags: Record<string, string | true> = {};
  for (let index = 0; index < rest.length; index++) {
    const name = rest[index].replace(/^--/, '');
    if (!rest[index].startsWith('--') || (!VALUE_FLAGS.includes(name) && !BOOLEAN_FLAGS.includes(name))) throw new UsageError(`Unknown flag: ${rest[index]}`);
    if (BOOLEAN_FLAGS.includes(name)) { flags[name] = true; continue; }
    const value = rest[++index];
    if (value === undefined || value.startsWith('--')) throw new UsageError(`Missing value for --${name}`);
    flags[name] = value;
  }
  if (!flags['batch-id']) throw new UsageError('--batch-id is required');
  return { command: command as (typeof COMMANDS)[number], flags };
}

async function writeAtomic(file: string, data: unknown): Promise<void> {
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, YAML.stringify(data), 'utf8');
  try { await rm(file, { force: true }); } catch { /* ignore */ }
  await writeFile(file, YAML.stringify(data), 'utf8');
}

async function loadCheckpoint(file: string): Promise<ReplayCheckpoint> {
  const raw = YAML.parse(await readFile(file, 'utf8')) as ReplayCheckpoint;
  if (raw.schema_version !== 1) throw new Error('Invalid checkpoint schema version');
  return raw;
}

async function saveCheckpoint(file: string, checkpoint: ReplayCheckpoint): Promise<void> {
  checkpoint.updated_at = now();
  checkpoint.revision++;
  await writeAtomic(file, checkpoint);
}

function replayDir(projectRoot: string): string {
  return path.resolve(projectRoot, 'docs/paco/replay');
}

function replayFile(projectRoot: string, batchId: string): string {
  return path.join(replayDir(projectRoot), `${slug(batchId)}.replay.yaml`);
}

function ticketOutputDir(projectRoot: string, ticketKey: string): string {
  return path.resolve(projectRoot, 'docs/paco/tickets', ticketKey);
}

function flowOutputDir(projectRoot: string): string {
  return path.resolve(projectRoot, 'docs/paco/flows');
}

function indexDir(projectRoot: string): string {
  return path.resolve(projectRoot, 'docs/paco/index');
}

export async function runReplayCli(argv: string[], write: (text: string) => void = text => process.stdout.write(text)): Promise<number> {
  const print = (value: unknown) => write(`${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}\n`);
  try {
    const { command, flags } = parse(argv);
    const projectRoot = path.resolve(typeof flags['project-root'] === 'string' ? flags['project-root'] : process.cwd());
    const batchId = flags['batch-id'] as string;
    const batchSize = typeof flags['batch-size'] === 'string' ? parseInt(flags['batch-size'], 10) : 10;
    const environment = typeof flags['environment'] === 'string' ? flags['environment'] : 'dev';
    const skipImported = flags['skip-imported'] !== undefined ? true : true;
    const force = flags['force'] !== undefined;
    const checkpointPath = typeof flags.checkpoint === 'string' ? flags.checkpoint : replayFile(projectRoot, batchId);

    if (command === 'init') {
      const checkpoint: ReplayCheckpoint = {
        schema_version: 1,
        batch_id: batchId,
        created_at: now(),
        updated_at: now(),
        environment,
        status: 'active',
        batch_size: batchSize,
        skip_imported: skipImported,
        tickets: [],
        processed_count: 0,
        verified_count: 0,
        failed_count: 0,
        blocked_count: 0,
        skipped_count: 0,
        partially_replayed_count: 0,
        not_reproducible_count: 0,
        new_flows: [],
        deduplicated_flows: [],
        revision: 0,
        mutation_mode: 'auto',
      };
      await mkdir(replayDir(projectRoot), { recursive: true });
      await writeAtomic(checkpointPath, checkpoint);
      print({ checkpoint: checkpointPath, batch_id: batchId, status: checkpoint.status, batch_size: batchSize, environment });
      return 0;
    }

    if (command === 'status') {
      const checkpoint = await loadCheckpoint(checkpointPath);
      print({
        batch_id: checkpoint.batch_id,
        status: checkpoint.status,
        total_tickets: checkpoint.tickets.length,
        processed: checkpoint.processed_count,
        verified: checkpoint.verified_count,
        failed: checkpoint.failed_count,
        blocked: checkpoint.blocked_count,
        skipped: checkpoint.skipped_count,
        partially_replayed: checkpoint.partially_replayed_count,
        not_reproducible: checkpoint.not_reproducible_count,
        new_flows: checkpoint.new_flows.length,
        deduplicated: checkpoint.deduplicated_flows.length,
      });
      return 0;
    }

    if (command === 'fetch') {
      const checkpoint = await loadCheckpoint(checkpointPath);
      const ticketSourceDir = path.resolve(projectRoot, 'ticket');
      const ticketOutputDir = path.resolve(projectRoot, 'docs/paco/tickets');

      // List existing imported tickets if skip_imported
      const imported = new Set<string>();
      if (checkpoint.skip_imported) {
        try {
          const existing = await readdir(ticketOutputDir);
          existing.forEach(name => imported.add(name));
        } catch { /* ignore */ }
      }

      // Scan ticket source for Done tickets
      const sourceTickets: ReplayTicket[] = [];
      try {
        const entries = await readdir(ticketSourceDir, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          const keyMatch = entry.name.match(/^([A-Z][A-Z0-9]*-[0-9]+)-/);
          if (!keyMatch) continue;
          const key = keyMatch[1];

          // Check if already imported
          if (checkpoint.skip_imported && imported.has(key)) continue;

          // Check if already in checkpoint
          if (checkpoint.tickets.some(t => t.key === key)) continue;

          // Read ticket.md for summary and labels
          const ticketMdPath = path.join(ticketSourceDir, entry.name, 'ticket.md');
          let summary = key;
          let labels: string[] = [];
          try {
            const content = await readFile(ticketMdPath, 'utf8');
            const summaryMatch = content.match(/^#\s+(.+)$/m);
            if (summaryMatch) summary = summaryMatch[1];
            const labelMatch = content.match(/Labels?:\s*(.+)/i);
            if (labelMatch) labels = labelMatch[1].split(/[,\s]+/).filter(Boolean);
          } catch { /* ignore */ }

          sourceTickets.push({
            key,
            summary,
            status: 'Done',
            labels,
            components: [],
            linked_issues: [],
          });

          if (sourceTickets.length >= checkpoint.batch_size) break;
        }
      } catch (error) {
        throw new Error(`Failed to scan ticket source: ${(error as Error).message}`);
      }

      // Merge new tickets into checkpoint
      checkpoint.tickets.push(...sourceTickets);
      await saveCheckpoint(checkpointPath, checkpoint);

      print({
        batch_id: checkpoint.batch_id,
        fetched: sourceTickets.length,
        total_tickets: checkpoint.tickets.length,
        already_imported: checkpoint.skip_imported ? imported.size : 0,
      });
      return 0;
    }

    if (command === 'resume') {
      const checkpoint = await loadCheckpoint(checkpointPath);
      const pending = checkpoint.tickets.filter(t => !t.processed || (force && t.result === 'pending'));
      print({
        batch_id: checkpoint.batch_id,
        status: checkpoint.status,
        pending: pending.length,
        processed: checkpoint.processed_count,
        hint: 'Run skill paco-ticket-replay to process pending tickets',
      });
      return 0;
    }

    if (command === 'finalize') {
      const checkpoint = await loadCheckpoint(checkpointPath);

      // Count results
      const counts = {
        verified: checkpoint.tickets.filter(t => t.result === 'verified').length,
        failed: checkpoint.tickets.filter(t => t.result === 'failed').length,
        blocked: checkpoint.tickets.filter(t => t.result === 'blocked').length,
        partially_replayed: checkpoint.tickets.filter(t => t.result === 'partially_replayed').length,
        not_reproducible: checkpoint.tickets.filter(t => t.result === 'not_reproducible').length,
        skipped: checkpoint.tickets.filter(t => t.result === 'skipped').length,
        pending: checkpoint.tickets.filter(t => !t.processed || t.result === 'pending').length,
      };

      checkpoint.status = counts.pending === 0 ? 'completed' : 'partially_completed';
      await saveCheckpoint(checkpointPath, checkpoint);

      print({
        batch_id: checkpoint.batch_id,
        status: checkpoint.status,
        ...counts,
        new_flows: checkpoint.new_flows,
        deduplicated_flows: checkpoint.deduplicated_flows,
        next: counts.pending > 0 ? 'Run paco-ticket-replay to process remaining' : 'Batch complete',
      });
      return 0;
    }

    throw new UsageError(USAGE);
  } catch (error) {
    print(error instanceof UsageError ? `${error.message}\n${USAGE}` : `Error: ${(error as Error).message}`);
    return error instanceof UsageError ? 2 : 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) process.exitCode = await runReplayCli(process.argv.slice(2));
