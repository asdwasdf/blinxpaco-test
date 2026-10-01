import { lstat, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { calculateChecksum } from './checksum-utils.js';
import {
  fingerprintDiscoveryState, mergeDiscoveryTasks, budgetAvailable,
  type DiscoveryCandidate, type DiscoveryCheckpoint, type DiscoveryRelationship, type DiscoveryStateDescriptor, type DiscoveryTask,
} from './discovery-planner.js';
import { finalizeDiscoveryMutation, type MutationObservation } from './discovery-state.js';
import { parseTesterNotes } from './protected-markdown.js';

// Contract riêng cho discovery ngoài ticket; ChildSkillOutcome v1 của ticket phases giữ nguyên.
export interface DiscoveryChildOutcome {
  schema_version: 1; outcome_id: string; mode: 'SURVEY' | 'VERIFY_FLOW';
  run_id: string; environment: string; role: string; task_id: string; checkpoint_revision: number;
  outcome: 'completed' | 'blocked' | 'failed' | 'no_change'; auth_expired: boolean;
  observed_states: Array<{ state: DiscoveryStateDescriptor; evidence: string[] }>; evidence: string[];
  relationships: DiscoveryRelationship[]; new_tasks: DiscoveryTask[]; candidates: DiscoveryCandidate[];
  gaps: string[]; artifacts: Array<{ path: string; sha256: string }>; blockers: string[];
  mutation: (MutationObservation & { reservation_id: string }) | null;
  sensitive_data: { detected: boolean; redacted: boolean };
}
export interface DiscoveryExpectation { run_id: string; environment: string; role: string; task_id: string; revision: number; reservation_id?: string }
type Result = { ok: true } | { ok: false; issues: string[] };

const OWNED = [/^docs\/product\/paco-overview\.md$/, /^docs\/product\/workflows\/[a-z0-9-]+\.md$/, /^docs\/product\/survey\/views\/[a-z0-9-]+\.md$/];
const CLASSES = ['Observed', 'Verified-by-Mutation', 'Inferred', 'Open Question'];
const MUTATION_CLASSES = ['CREATE', 'UPDATE', 'SEND', 'DELETE', 'EXTERNAL_SIDE_EFFECT'];
const PERSISTENCE = ['Persistent', 'Temporary', 'Destructive', 'Unknown'];

export function validateDiscoveryChildOutcome(value: DiscoveryChildOutcome, expected: DiscoveryExpectation): Result {
  const issues: string[] = [];
  const o = value;
  if (!o || o.schema_version !== 1 || typeof o.outcome_id !== 'string' || !o.outcome_id) return { ok: false, issues: ['invalid outcome schema'] };
  if (!['SURVEY', 'VERIFY_FLOW'].includes(o.mode)) issues.push('mode must be SURVEY or VERIFY_FLOW');
  if (o.run_id !== expected.run_id || o.environment !== expected.environment || o.role !== expected.role) issues.push('run identity mismatch');
  if (o.task_id !== expected.task_id || o.checkpoint_revision !== expected.revision) issues.push('task or revision mismatch');
  if (!['completed', 'blocked', 'failed', 'no_change'].includes(o.outcome)) issues.push('invalid outcome');
  for (const field of ['observed_states', 'evidence', 'relationships', 'new_tasks', 'candidates', 'gaps', 'artifacts', 'blockers'] as const) {
    if (!Array.isArray(o[field])) issues.push(`${field} must be an array`);
  }
  if (issues.length) return { ok: false, issues };
  if (!o.sensitive_data || typeof o.sensitive_data.detected !== 'boolean' || typeof o.sensitive_data.redacted !== 'boolean') issues.push('sensitive_data is required');
  else if (o.sensitive_data.detected && !o.sensitive_data.redacted) issues.push('sensitive data must be redacted');
  for (const candidate of o.candidates) {
    if (!MUTATION_CLASSES.includes(candidate.mutation_class) || !PERSISTENCE.includes(candidate.persistence) ||
        !candidate.id || !candidate.task_id || !candidate.action?.trim() || !candidate.reason?.trim() || !candidate.evidence?.length) {
      issues.push(`${candidate.id ?? 'candidate'}: invalid mutation candidate`);
    }
  }
  if (o.auth_expired && o.outcome !== 'blocked') issues.push('auth expiry must be blocked');
  for (const item of o.observed_states) {
    if (item.state.role !== o.role) issues.push('observed state role mismatch');
    try { fingerprintDiscoveryState(item.state); } catch (error) { issues.push(`observed state: ${(error as Error).message}`); }
    if (!item.evidence.length) issues.push('observed state requires evidence');
  }
  for (const edge of o.relationships) {
    if (!CLASSES.includes(edge.classification) || !edge.evidence.length || edge.role !== o.role || edge.environment !== o.environment) issues.push(`${edge.id}: invalid relationship provenance`);
    if (edge.mutation_boundary && edge.to) issues.push(`${edge.id}: mutation boundary cannot claim destination`);
    if (edge.classification === 'Verified-by-Mutation' && (o.mode !== 'VERIFY_FLOW' || o.mutation?.status !== 'observed' || edge.reservation_id !== o.mutation.reservation_id)) {
      issues.push(`${edge.id}: Verified-by-Mutation requires observed reservation`);
    }
  }
  if (o.mode === 'SURVEY' && o.mutation !== null) issues.push('SURVEY is read-only and cannot report mutation');
  if (o.mode === 'VERIFY_FLOW' && (!o.mutation || o.mutation.reservation_id !== expected.reservation_id) && o.outcome !== 'blocked') {
    issues.push('VERIFY_FLOW requires its reserved mutation observation');
  }
  return issues.length ? { ok: false, issues } : { ok: true };
}

export async function verifyDiscoveryArtifacts(outcome: DiscoveryChildOutcome, projectRoot: string): Promise<Result> {
  const issues: string[] = [];
  const root = await realpath(projectRoot);
  for (const artifact of outcome.artifacts) {
    const normalized = path.posix.normalize(artifact.path.replaceAll('\\', '/'));
    const evidence = normalized.startsWith(`test-results/product-survey/${outcome.run_id}/`);
    if (normalized !== artifact.path || (!OWNED.some(pattern => pattern.test(normalized)) && !evidence)) { issues.push(`${artifact.path}: outside discovery ownership`); continue; }
    const full = path.join(root, normalized);
    try {
      if ((await lstat(full)).isSymbolicLink() || (await realpath(full)) !== full) throw new Error('symlink');
      const content = await readFile(full);
      if (calculateChecksum(content) !== artifact.sha256) issues.push(`${artifact.path}: checksum mismatch`);
      if (normalized.endsWith('.md') && !evidence && !parseTesterNotes(content.toString('utf8')).ok) issues.push(`${artifact.path}: final Tester notes required`);
    } catch { issues.push(`${artifact.path}: missing or not a regular confined file`); }
  }
  return issues.length ? { ok: false, issues } : { ok: true };
}

export function applyDiscoveryOutcome(checkpoint: DiscoveryCheckpoint, outcome: DiscoveryChildOutcome, now = Date.now()): DiscoveryCheckpoint {
  if (checkpoint.applied_outcomes.includes(outcome.outcome_id)) return checkpoint;
  const task = checkpoint.queue.find(item => item.id === outcome.task_id);
  if (!task || checkpoint.current_task !== task.id) throw new Error('Outcome task is not the current task');
  for (const ref of outcome.evidence) if (!checkpoint.evidence.includes(ref)) checkpoint.evidence.push(ref);
  for (const item of outcome.observed_states) {
    const fingerprint = fingerprintDiscoveryState(item.state);
    if (!checkpoint.visited_states.includes(fingerprint)) checkpoint.visited_states.push(fingerprint);
  }
  for (const edge of outcome.relationships) if (!checkpoint.discovered_edges.some(item => item.id === edge.id)) checkpoint.discovered_edges.push(edge);
  for (const candidate of outcome.candidates) if (!checkpoint.mutation_candidates.some(item => item.id === candidate.id)) checkpoint.mutation_candidates.push({ ...candidate, status: 'pending' });
  for (const gap of outcome.gaps) if (!checkpoint.known_gaps.includes(gap)) checkpoint.known_gaps.push(gap);
  checkpoint.queue = mergeDiscoveryTasks(checkpoint, outcome.new_tasks);
  // Candidate phải trỏ tới task có thật và source state đã quan sát; ném lỗi thì cả transaction bị hủy.
  for (const candidate of outcome.candidates) {
    if (!checkpoint.queue.some(item => item.id === candidate.task_id && item.category === 'mutation')) throw new Error(`${candidate.id}: candidate task is not a queued mutation task`);
    if (!checkpoint.visited_states.includes(candidate.source_state)) throw new Error(`${candidate.id}: source_state is not an observed state`);
  }
  if (outcome.mutation) finalizeDiscoveryMutation(checkpoint, outcome.mutation.reservation_id, outcome.mutation);
  if (outcome.auth_expired) {
    task.status = 'queued';
    checkpoint.status = 'blocked_auth';
  } else if (outcome.outcome === 'blocked' || outcome.outcome === 'failed') {
    task.status = task.attempts > checkpoint.budget.max_retries || outcome.outcome === 'blocked' ? 'blocked' : 'queued';
    if (task.status === 'blocked' && !checkpoint.blocked_tasks.includes(task.id)) checkpoint.blocked_tasks.push(task.id);
  } else {
    task.status = outcome.mode === 'VERIFY_FLOW' ? 'verified-by-observation' : 'explored';
    checkpoint.attempted_transitions.push(task.id);
  }
  for (const blocker of outcome.blockers) if (!checkpoint.known_gaps.includes(blocker)) checkpoint.known_gaps.push(blocker);
  checkpoint.current_task = null;
  checkpoint.applied_outcomes.push(outcome.outcome_id);
  if (checkpoint.status === 'active' && !budgetAvailable(checkpoint, now)) checkpoint.status = 'paused_budget';
  return checkpoint;
}
