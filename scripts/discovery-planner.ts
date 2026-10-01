import { createHash } from 'node:crypto';

export interface DiscoveryStateDescriptor {
  role: string; url: string; heading: string; tab: string; overlay: string; context: string; variant: string;
  volatile_segments?: number[]; meaningful_query?: string[];
}
export type DiscoveryCategory = 'module' | 'branch' | 'handoff' | 'transition' | 'mutation' | 'variant';
export type DiscoveryTaskStatus = 'unseen' | 'queued' | 'exploring' | 'explored' | 'blocked' | 'mutation-candidate' | 'verified-by-observation' | 'exhausted';
export interface DiscoveryProvenance { kind: 'bootstrap' | 'evidence' | 'edge' | 'gap' | 'candidate'; ref: string }
export interface DiscoveryTask {
  id: string; state: DiscoveryStateDescriptor; action: string; category: DiscoveryCategory;
  provenance: DiscoveryProvenance; status: DiscoveryTaskStatus; attempts: number; reason?: string;
}
export interface DiscoveryBudget {
  max_states: number; max_actions: number; max_minutes: number; max_retries: number;
  actions: number; elapsed_ms: number; active_since: number | null;
}
export interface DiscoveryRelationship {
  id: string; from: string; to?: string; destination_hint?: string; trigger: string;
  relationship: string; context: string[]; classification: 'Observed' | 'Verified-by-Mutation' | 'Inferred' | 'Open Question';
  mutation_boundary: boolean; evidence: string[]; role: string; environment: string; observed_at: string; reservation_id?: string;
}
export interface DiscoveryCandidate {
  id: string; task_id: string; source_state: string; action: string;
  mutation_class: 'CREATE' | 'UPDATE' | 'SEND' | 'DELETE' | 'EXTERNAL_SIDE_EFFECT';
  persistence: 'Persistent' | 'Temporary' | 'Destructive' | 'Unknown';
  reason: string; evidence: string[]; test_data_fingerprint: string; ownership_ref: string;
  recipient_fingerprint?: string; destination_host?: string; cleanup_of?: string;
  status: 'pending' | 'blocked' | 'reserved' | 'observed';
}
export interface DiscoveryReservation {
  id: string; fingerprint: string; candidate_id: string; task_id: string; authorization_digest: string;
  status: 'pending' | 'observed' | 'indeterminate'; before: string; after?: string;
  evidence: string[]; created_at: string; cleanup: 'pending' | 'not_required' | 'completed' | 'failed'; leftovers: string[];
}
export interface DiscoveryCheckpoint {
  schema_version: 1; run_id: string; environment: string; role: string; revision: number;
  status: 'active' | 'paused_budget' | 'blocked_auth' | 'paused' | 'exhausted'; current_task: string | null;
  queue: DiscoveryTask[]; visited_states: string[]; attempted_transitions: string[]; evidence: string[];
  discovered_edges: DiscoveryRelationship[]; mutation_candidates: DiscoveryCandidate[]; mutations: DiscoveryReservation[];
  consumed_mutations: string[]; blocked_tasks: string[]; known_gaps: string[]; applied_outcomes: string[];
  legacy_notes: string[]; budget: DiscoveryBudget; checkpoint_time: string; allow_mutation: boolean;
}
export function discoveryHash(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
const SENSITIVE_QUERY = /^(token|access_token|id_token|code|session|auth|password|secret|key|email|phone|patient.*|nhs.*|dob|name)$/i;
const MEANINGFUL_QUERY = ['tab', 'status', 'filter', 'sort', 'page', 'view', 'type'];
const FREE_TEXT_QUERY = ['filter'];

// Query không phân loại được thì chặn để thành gap; không đoán và không ghi giá trị nhạy cảm.
export function normalizeDiscoveryUrl(input: string, volatileSegments: number[] = [], meaningfulQuery: string[] = []): string {
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('HTTPS without credentials required');
  // Hash route có thể đổi flow nên được giữ; hash khác dạng route (vd. token) bị chặn.
  if (url.hash && !/^#\/[A-Za-z0-9_\-/]*$/.test(url.hash)) throw new Error('Unclassified hash fragment');
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_.*|timestamp|cacheBust|_)$/.test(key)) url.searchParams.delete(key);
    else if (SENSITIVE_QUERY.test(key)) throw new Error(`Sensitive query: ${key}`);
    else if (!MEANINGFUL_QUERY.includes(key) && !meaningfulQuery.includes(key)) throw new Error(`Unclassified query: ${key}`);
  }
  // Giá trị free-text (filter) có thể chứa PII: chỉ lưu hash, idempotent khi chuẩn hoá lại.
  for (const key of FREE_TEXT_QUERY) {
    const value = url.searchParams.get(key);
    if (value && !value.startsWith('h:')) url.searchParams.set(key, `h:${discoveryHash(value).slice(0, 16)}`);
  }
  url.searchParams.sort();
  const segments = url.pathname.split('/');
  for (const index of volatileSegments) {
    if (!Number.isInteger(index) || index < 1 || index >= segments.length) throw new Error('Invalid volatile segment');
    segments[index] = ':id';
  }
  url.pathname = segments.join('/');
  return url.toString();
}
export function fingerprintDiscoveryState(input: DiscoveryStateDescriptor): string {
  return discoveryHash([input.role, normalizeDiscoveryUrl(input.url, input.volatile_segments, input.meaningful_query), input.heading, input.tab, input.overlay, input.context, input.variant]);
}
export function createDiscoveryTask(input: Pick<DiscoveryTask, 'state' | 'action' | 'category' | 'provenance'>): DiscoveryTask {
  if (!input.action.trim() || !input.provenance.ref.trim()) throw new Error('Task action and provenance required');
  const state = { ...input.state, url: normalizeDiscoveryUrl(input.state.url, input.state.volatile_segments, input.state.meaningful_query) };
  return { ...input, state, id: discoveryHash([fingerprintDiscoveryState(state), input.category, input.action]), status: 'queued', attempts: 0 };
}
export function createDiscoveryCheckpoint(run: string, environment: string, role: string, dashboard: string, now = Date.now()): DiscoveryCheckpoint {
  if (!/^[a-zA-Z0-9_-]+$/.test(run) || !role.trim() || !environment.trim()) throw new Error('Invalid run identity');
  const task = createDiscoveryTask({ state: { role, url: dashboard, heading: '', tab: '', overlay: '', context: '', variant: 'unverified-auth' }, action: 'Verify authenticated dashboard', category: 'module', provenance: { kind: 'bootstrap', ref: dashboard } });
  return { schema_version: 1, run_id: run, environment, role, revision: 0, status: 'active', current_task: null,
    queue: [task], visited_states: [], attempted_transitions: [], evidence: [], discovered_edges: [], mutation_candidates: [], mutations: [], consumed_mutations: [], blocked_tasks: [], known_gaps: [], applied_outcomes: [], legacy_notes: [],
    budget: { max_states: 30, max_actions: 100, max_minutes: 30, max_retries: 2, actions: 0, elapsed_ms: 0, active_since: now }, checkpoint_time: new Date(now).toISOString(), allow_mutation: false };
}
export function mergeDiscoveryTasks(checkpoint: DiscoveryCheckpoint, proposals: DiscoveryTask[]): DiscoveryTask[] {
  const tasks = new Map(checkpoint.queue.map(task => [task.id, task]));
  for (const task of proposals) {
    const { kind, ref } = task.provenance;
    const grounded = kind === 'evidence' ? checkpoint.evidence.includes(ref) : kind === 'edge' ? checkpoint.discovered_edges.some(edge => edge.id === ref) : kind === 'gap' ? checkpoint.known_gaps.includes(ref) : kind === 'candidate' && checkpoint.mutation_candidates.some(candidate => candidate.id === ref);
    if (!grounded || task.state.role !== checkpoint.role) throw new Error('Invalid task provenance or role');
    const normalized = createDiscoveryTask(task);
    if (normalized.id !== task.id) throw new Error('Invalid task fingerprint');
    if (!tasks.has(task.id) && !checkpoint.attempted_transitions.includes(task.id)) tasks.set(task.id, normalized);
  }
  return [...tasks.values()];
}
export function budgetAvailable(checkpoint: DiscoveryCheckpoint, now: number): boolean {
  const b = checkpoint.budget;
  return checkpoint.visited_states.length < b.max_states && b.actions < b.max_actions &&
    b.elapsed_ms + (b.active_since === null ? 0 : Math.max(0, now - b.active_since)) < b.max_minutes * 60_000;
}
export function selectNextDiscoveryTask(checkpoint: DiscoveryCheckpoint, now = Date.now()): DiscoveryTask | null {
  if (checkpoint.status !== 'active' || checkpoint.current_task || !budgetAvailable(checkpoint, now)) return null;
  const priorities: DiscoveryCategory[] = ['module', 'branch', 'handoff', 'transition', 'mutation', 'variant'];
  return checkpoint.queue.filter(task => task.status === 'queued' && task.attempts <= checkpoint.budget.max_retries &&
    !checkpoint.attempted_transitions.includes(task.id) && (task.category !== 'mutation' || checkpoint.allow_mutation))
    .sort((a, b) => priorities.indexOf(a.category) - priorities.indexOf(b.category) || a.id.localeCompare(b.id))[0] ?? null;
}
export function startDiscoveryTask(checkpoint: DiscoveryCheckpoint, now = Date.now()): DiscoveryTask | null {
  const task = selectNextDiscoveryTask(checkpoint, now);
  if (!task) return null;
  task.status = 'exploring'; task.attempts++; checkpoint.budget.actions++; checkpoint.current_task = task.id;
  return task;
}
