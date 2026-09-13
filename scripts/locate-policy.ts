import type { ArtifactState } from './workflow-types.js';

export const DEFAULT_LOCATE_BUDGET = { views_limit: 12, minutes_limit: 15 } as const;
export type LocateAction = 'navigate' | 'view' | 'search' | 'filter' | 'sort' | 'paginate' | 'open_read_only' | 'mutation' | 'unknown';
export interface LocateInputs { environment?: string; role?: string; authenticated: boolean; read_only: boolean }
export interface LocateProgress { views_used: number; views_limit: number; started_at_ms: number; now_ms: number; minutes_limit: number; route_verified: boolean }

export function validateLocateInputs(input: LocateInputs): { allowed: true } | { allowed: false; blocker: string; next_action: string } {
  if (!input.environment) return { allowed: false, blocker: 'Missing environment', next_action: 'Provide environment' };
  if (!input.role) return { allowed: false, blocker: 'Missing role', next_action: 'Provide role' };
  if (!input.authenticated) return { allowed: false, blocker: 'Authentication expired', next_action: 'Run npm run auth:login' };
  if (!input.read_only) return { allowed: false, blocker: 'LOCATE requires read-only mode', next_action: 'Enable read-only mode' };
  return { allowed: true };
}

export function evaluateLocateAction(action: LocateAction): { allowed: true } | { allowed: false; blocker: string } {
  if (action === 'mutation' || action === 'unknown') return { allowed: false, blocker: action === 'mutation' ? 'Mutation boundary' : 'Unknown action persistence' };
  return { allowed: true };
}

export function evaluateLocateProgress(progress: LocateProgress): { continue: boolean; reason: 'route_verified' | 'view_budget' | 'time_budget' | 'continue'; elapsed_minutes: number } {
  const elapsed_minutes = Math.max(0, (progress.now_ms - progress.started_at_ms) / 60_000);
  if (progress.route_verified) return { continue: false, reason: 'route_verified', elapsed_minutes };
  if (progress.views_used >= progress.views_limit) return { continue: false, reason: 'view_budget', elapsed_minutes };
  if (elapsed_minutes >= progress.minutes_limit) return { continue: false, reason: 'time_budget', elapsed_minutes };
  return { continue: true, reason: 'continue', elapsed_minutes };
}

export function validateReusableRoute(input: { views_used: number; landmark_matched: boolean; entry_opened: boolean }): { valid: boolean; reason: string } {
  if (input.views_used < 1 || input.views_used > 3) return { valid: false, reason: 'Reusable route validation requires 1-3 meaningful views' };
  if (!input.landmark_matched || !input.entry_opened) return { valid: false, reason: 'Reusable route did not reach the observed feature landmark' };
  return { valid: true, reason: 'Reusable route verified' };
}

export function filterLocateCandidates(candidates: readonly string[], rejected: ReadonlyArray<{ path: string; dependency_revision: number }>, dependencyRevision: number): string[] {
  const blocked = new Set(rejected.filter((item) => item.dependency_revision === dependencyRevision).map((item) => item.path));
  return candidates.filter((candidate) => !blocked.has(candidate));
}

export type LocationChange = 'feature_alias' | 'actor_context' | 'module_location' | 'entry_path' | 'role_permission' | 'expected_behavior_only';
export function locationNeedsReview(changes: readonly LocationChange[]): boolean {
  return changes.some((change) => change !== 'expected_behavior_only');
}

export function evaluateUiLocationGate(input: {
  ui_dependent: boolean; location_state?: ArtifactState; route_status?: 'Confirmed' | 'Candidate' | 'Blocked' | 'Inconclusive';
  has_entry_path: boolean; has_context: boolean; has_role: boolean; has_test_data_category: boolean;
}): { allowed: true } | { allowed: false; blockers: string[] } {
  if (!input.ui_dependent) return { allowed: true };
  const blockers: string[] = [];
  if (input.location_state !== 'valid') blockers.push('Feature location is missing or stale');
  if (input.route_status !== 'Confirmed') blockers.push('Entry path is not confirmed');
  if (!input.has_entry_path) blockers.push('Ordered entry path is missing');
  if (!input.has_context) blockers.push('Required context is missing');
  if (!input.has_role) blockers.push('Role is missing');
  if (!input.has_test_data_category) blockers.push('Test-data category is missing');
  return blockers.length ? { allowed: false, blockers } : { allowed: true };
}

export interface FeatureMapProposalInput {
  feature: string; entry: string[]; role_observed: string; environment: string; source_ticket: string; last_verified: string; aliases: string[];
  patient_identifier?: string; test_data?: string; locator?: string;
}
export function toSafeFeatureMapEntry(input: FeatureMapProposalInput) {
  const { feature, entry, role_observed, environment, source_ticket, last_verified, aliases } = input;
  return { feature, entry, role_observed, environment, classification: 'Observed' as const, source_ticket, last_verified, aliases };
}
