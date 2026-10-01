import { discoveryHash, type DiscoveryCandidate } from './discovery-planner.js';
import { evaluateMutationGate, type MutationGateDecision } from './mutation-gate.js';
import type { PacoConfig } from './workflow-types.js';

// Authorization do tester cấp ngoài agent; candidate/proposal không bao giờ tự chứa quyền.
export interface DiscoveryAuthorization {
  product: 'Paco'; run_id: string; environment: string; actions: string[];
  mutation_classes: DiscoveryCandidate['mutation_class'][]; test_data_fingerprint: string; ownership_ref: string;
  approved_recipients: string[]; approved_destinations: string[]; allow_destructive: boolean;
  issued_at: string; expires_at: string; legacy_reviewed?: boolean;
}

export const MAX_AUTHORIZATION_MS = 24 * 60 * 60 * 1000;
export interface DiscoveryMutationContext {
  run_id: string; environment: string; current_url: string; now: string;
  guards: { PACO_ALLOW_MUTATION?: string; PACO_ALLOW_DESTRUCTIVE?: string }; safety: PacoConfig['safety'];
}

export function authorizationDigest(authorization: DiscoveryAuthorization): string {
  return discoveryHash(authorization);
}

function deny(reason: string): MutationGateDecision { return { allowed: false, reason }; }

export function evaluateDiscoveryMutation(
  candidate: DiscoveryCandidate, authorization: DiscoveryAuthorization | null, context: DiscoveryMutationContext,
): MutationGateDecision {
  if (!authorization) return deny('External discovery authorization is required');
  if (!candidate.reason.trim() || !candidate.evidence.length) return deny('Mutation necessity and evidence are required');
  if (candidate.persistence === 'Unknown') return deny('Unknown persistence is blocked until classified');
  if (!candidate.test_data_fingerprint.trim() || !candidate.ownership_ref.trim()) return deny('Owned or synthetic test data is required');
  let url: URL;
  try { url = new URL(context.current_url); } catch { return deny('Current URL is invalid'); }
  if (url.protocol !== 'https:' || url.username || url.password) return deny('Mutation requires HTTPS URL without credentials');
  const issued = Date.parse(authorization.issued_at), expires = Date.parse(authorization.expires_at), now = Date.parse(context.now);
  if ([issued, expires, now].some(Number.isNaN) || now < issued || now > expires) return deny('Authorization is not currently valid');
  if (expires - issued > MAX_AUTHORIZATION_MS) return deny('Authorization lifetime exceeds 24 hours');
  if (authorization.product !== 'Paco' || authorization.run_id !== context.run_id || authorization.environment !== context.environment ||
      !authorization.actions.includes(candidate.action) || !authorization.mutation_classes.includes(candidate.mutation_class) ||
      authorization.test_data_fingerprint !== candidate.test_data_fingerprint || authorization.ownership_ref !== candidate.ownership_ref) {
    return deny('Authorization scope does not match this mutation');
  }
  if (candidate.cleanup_of && !candidate.ownership_ref.startsWith(`${context.run_id}/`)) return deny('Cleanup requires ownership by the current run');
  if (candidate.mutation_class === 'SEND' && (!candidate.recipient_fingerprint || !authorization.approved_recipients.includes(candidate.recipient_fingerprint))) {
    return deny('SEND requires an explicitly approved recipient');
  }
  if (candidate.mutation_class === 'EXTERNAL_SIDE_EFFECT' && (!candidate.destination_host ||
      !authorization.approved_destinations.includes(candidate.destination_host) || !context.safety.externalDevHosts.includes(candidate.destination_host))) {
    return deny('External side effect requires an approved configured dev destination');
  }
  const destructive = candidate.mutation_class === 'DELETE' || candidate.persistence === 'Destructive';
  if (destructive && !authorization.allow_destructive) return deny('Destructive mutation requires explicit destructive authorization');
  return evaluateMutationGate(
    { run_id: context.run_id, environment: context.environment, current_url: context.current_url, ticket_key: '', case_id: '',
      action: candidate.action, test_data_fingerprint: candidate.test_data_fingerprint, mutation_class: destructive ? 'Destructive' : candidate.persistence },
    null, context.guards, context.now, context.safety,
    { product: 'Paco', environment: authorization.environment, actions: authorization.actions, test_data_fingerprint: authorization.test_data_fingerprint, source: 'paco-explore-survey', run_id: authorization.run_id },
  );
}
