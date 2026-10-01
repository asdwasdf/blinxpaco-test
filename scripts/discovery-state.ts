import { randomUUID } from 'node:crypto';
import { open, readFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { discoveryHash, type DiscoveryCandidate, type DiscoveryCheckpoint, type DiscoveryReservation } from './discovery-planner.js';

export interface DiscoveryIdentity { run_id: string; environment: string; role: string }

function positive(value: unknown): boolean { return typeof value === 'number' && Number.isFinite(value) && value > 0; }

export function validateDiscoveryCheckpoint(value: unknown): DiscoveryCheckpoint {
  const c = value as DiscoveryCheckpoint;
  if (!c || typeof c !== 'object' || c.schema_version !== 1) throw new Error('Invalid checkpoint schema');
  for (const field of ['run_id', 'environment', 'role'] as const) if (typeof c[field] !== 'string' || !c[field].trim()) throw new Error(`Invalid checkpoint ${field}`);
  if (!Number.isInteger(c.revision) || c.revision < 0) throw new Error('Invalid checkpoint revision');
  for (const field of ['queue', 'visited_states', 'attempted_transitions', 'evidence', 'discovered_edges', 'mutation_candidates', 'mutations', 'consumed_mutations', 'blocked_tasks', 'known_gaps', 'applied_outcomes', 'legacy_notes'] as const) {
    if (!Array.isArray(c[field])) throw new Error(`Invalid checkpoint ${field}`);
  }
  const b = c.budget;
  if (!b || !['max_states', 'max_actions', 'max_minutes'].every(key => positive(b[key as keyof typeof b])) ||
      !Number.isInteger(b.max_retries) || b.max_retries < 0 || b.actions < 0 || b.elapsed_ms < 0) throw new Error('Invalid checkpoint budget');
  if (!['active', 'paused_budget', 'blocked_auth', 'paused', 'exhausted'].includes(c.status)) throw new Error('Invalid checkpoint status');
  return c;
}

export async function loadDiscoveryCheckpoint(file: string, identity?: DiscoveryIdentity): Promise<DiscoveryCheckpoint> {
  const checkpoint = validateDiscoveryCheckpoint(YAML.parse(await readFile(file, 'utf8')));
  if (identity && (checkpoint.run_id !== identity.run_id || checkpoint.environment !== identity.environment || checkpoint.role !== identity.role)) {
    throw new Error('Checkpoint identity does not match run, environment and role');
  }
  return checkpoint;
}

async function writeAtomic(file: string, checkpoint: DiscoveryCheckpoint): Promise<void> {
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.${randomUUID()}.tmp`);
  const handle = await open(temporary, 'wx');
  try { await handle.writeFile(YAML.stringify(checkpoint), 'utf8'); await handle.sync(); } finally { await handle.close(); }
  try { await rename(temporary, file); } catch (error) { await rm(temporary, { force: true }); throw error; }
  const directory = await open(path.dirname(file), 'r');
  try { await directory.sync(); } catch { /* directory fsync unsupported */ } finally { await directory.close(); }
}

async function withLock<T>(file: string, operation: () => Promise<T>): Promise<T> {
  // Lock bị bỏ lại sau crash phải do tester xác minh rồi xóa; không tự cướp lock.
  const lock = await open(`${file}.lock`, 'wx');
  try { await lock.writeFile(`${process.pid} ${new Date().toISOString()}\n`); return await operation(); } finally {
    await lock.close(); await rm(`${file}.lock`, { force: true });
  }
}

export async function initializeDiscoveryCheckpoint(file: string, checkpoint: DiscoveryCheckpoint): Promise<void> {
  validateDiscoveryCheckpoint(checkpoint);
  await withLock(file, async () => {
    const handle = await open(file, 'wx');
    await handle.close();
    try { await writeAtomic(file, checkpoint); } catch (error) { await rm(file, { force: true }); throw error; }
  });
}

export async function updateDiscoveryCheckpoint(
  file: string, expectedRevision: number, update: (checkpoint: DiscoveryCheckpoint) => void,
): Promise<DiscoveryCheckpoint> {
  return withLock(file, async () => {
    const checkpoint = await loadDiscoveryCheckpoint(file);
    if (checkpoint.revision !== expectedRevision) throw new Error(`Stale checkpoint revision ${expectedRevision}; current ${checkpoint.revision}`);
    const next = structuredClone(checkpoint);
    update(next);
    next.revision = checkpoint.revision + 1;
    next.checkpoint_time = new Date().toISOString();
    validateDiscoveryCheckpoint(next);
    if (next.run_id !== checkpoint.run_id || next.environment !== checkpoint.environment || next.role !== checkpoint.role) throw new Error('Checkpoint identity is immutable');
    await writeAtomic(file, next);
    return next;
  });
}

export function mutationFingerprint(candidate: DiscoveryCandidate): string {
  return discoveryHash([candidate.source_state, candidate.action, candidate.mutation_class, candidate.test_data_fingerprint, candidate.recipient_fingerprint ?? '', candidate.destination_host ?? '', candidate.cleanup_of ?? '']);
}

export function reserveDiscoveryMutation(checkpoint: DiscoveryCheckpoint, candidate: DiscoveryCandidate, authorizationDigest: string): DiscoveryReservation {
  const fingerprint = mutationFingerprint(candidate);
  if (checkpoint.consumed_mutations.includes(fingerprint) || checkpoint.mutations.some(entry => entry.fingerprint === fingerprint)) {
    throw new Error('Mutation fingerprint already reserved or consumed');
  }
  if (checkpoint.mutations.some(entry => entry.status === 'pending')) throw new Error('Another mutation is pending reconciliation');
  if (!authorizationDigest.trim()) throw new Error('External authorization digest required');
  const entry: DiscoveryReservation = {
    id: `M-${fingerprint.slice(0, 12)}`, fingerprint, candidate_id: candidate.id, task_id: candidate.task_id,
    authorization_digest: authorizationDigest, status: 'pending', before: candidate.source_state, evidence: [...candidate.evidence],
    created_at: new Date().toISOString(), cleanup: 'pending', leftovers: [],
  };
  checkpoint.mutations.push(entry);
  checkpoint.consumed_mutations.push(fingerprint);
  const stored = checkpoint.mutation_candidates.find(item => item.id === candidate.id);
  if (stored) stored.status = 'reserved';
  return entry;
}

export interface MutationObservation {
  status: 'observed' | 'indeterminate'; after?: string; evidence: string[];
  cleanup: DiscoveryReservation['cleanup']; leftovers: string[];
}

export function finalizeDiscoveryMutation(checkpoint: DiscoveryCheckpoint, reservationId: string, observation: MutationObservation): DiscoveryReservation {
  const entry = checkpoint.mutations.find(item => item.id === reservationId);
  if (!entry) throw new Error('Unknown mutation reservation');
  if (entry.status !== 'pending') throw new Error('Mutation reservation already finalized');
  if (!observation.evidence.length) throw new Error('Mutation observation requires evidence');
  if (observation.status === 'observed' && !observation.after?.trim()) throw new Error('Observed mutation requires after-state');
  Object.assign(entry, { status: observation.status, after: observation.after, evidence: [...entry.evidence, ...observation.evidence], cleanup: observation.cleanup, leftovers: observation.leftovers });
  const candidate = checkpoint.mutation_candidates.find(item => item.id === entry.candidate_id);
  if (candidate) candidate.status = observation.status === 'observed' ? 'observed' : 'blocked';
  if (observation.status === 'indeterminate') checkpoint.blocked_tasks.push(entry.task_id);
  return entry;
}

export const LEGACY_MUTATION_NOTE = 'legacy-mutation: ';
export interface LegacyCheckpoint { environment?: string; role?: string; queue?: unknown[]; mutation_fingerprints?: unknown[]; blockers?: unknown[]; visited_fingerprints?: unknown[]; attempted_transitions?: unknown[] }

export function migrateLegacyCheckpoint(legacy: LegacyCheckpoint, initial: DiscoveryCheckpoint): DiscoveryCheckpoint {
  if (legacy.environment !== initial.environment || legacy.role !== initial.role) throw new Error('Legacy checkpoint identity does not match');
  const text = (items: unknown[] | undefined) => (items ?? []).map(item => typeof item === 'string' ? item : JSON.stringify(item));
  const migrated = structuredClone(initial);
  // Fingerprint legacy dùng scheme khác nên không so khớp được: ghi chú để chặn mọi mutation tới khi tester review.
  migrated.legacy_notes = [...text(legacy.queue), ...text(legacy.blockers).map(item => `blocker: ${item}`), ...text(legacy.visited_fingerprints).map(item => `visited: ${item}`),
    ...text(legacy.attempted_transitions).map(item => `attempted: ${item}`), ...text(legacy.mutation_fingerprints).map(item => `${LEGACY_MUTATION_NOTE}${item}`)];
  migrated.consumed_mutations = text(legacy.mutation_fingerprints);
  return validateDiscoveryCheckpoint(migrated);
}
