import type { MutationClass, PacoConfig } from './workflow-types.js';

export interface MutationApproval {
  run_id: string;
  environment: string;
  ticket_key: string;
  case_ids: string[];
  actions: string[];
  test_data_fingerprint: string;
  mutation_class: Exclude<MutationClass, 'None'>;
  approved_at: string;
  expires_at: string | null;
}

export type WorkflowMutationAuthorization = {
  product: 'Paco';
  environment: string;
  actions: string[];
  test_data_fingerprint: string;
} & ({
  source: 'paco-execution-first-workflow';
  ticket_key: string;
  case_ids: string[];
} | {
  source: 'paco-explore-survey';
  run_id: string;
});

export interface MutationRunScope {
  run_id: string;
  environment: string;
  current_url?: string;
  ticket_key: string;
  case_id: string;
  action: string;
  test_data_fingerprint: string;
  mutation_class: MutationClass;
}

export type MutationGateDecision =
  | { allowed: true; reason: 'read_only' | 'approved_mutation' | 'approved_destructive' | 'workflow_authorized_mutation' | 'workflow_authorized_destructive' }
  | { allowed: false; reason: string };

export function evaluateMutationGate(
  scope: MutationRunScope,
  approval: MutationApproval | null,
  guards: { PACO_ALLOW_MUTATION?: string; PACO_ALLOW_DESTRUCTIVE?: string },
  now: string,
  safety?: PacoConfig['safety'],
  workflowAuthorization?: WorkflowMutationAuthorization,
): MutationGateDecision {
  if (scope.mutation_class === 'None') return { allowed: true, reason: 'read_only' };
  if (!safety) return { allowed: false, reason: 'Mutation blocked without configured dev host safety' };
  {
    if (!safety.mutationEnabledEnvironments.includes(scope.environment) || !scope.current_url) {
      return { allowed: false, reason: 'Mutation blocked outside configured dev hosts' };
    }
    let hostname: string;
    try {
      hostname = new URL(scope.current_url).hostname.toLowerCase();
    } catch {
      return { allowed: false, reason: 'Mutation blocked outside configured dev hosts' };
    }
    if (![...safety.allowedHosts, ...safety.externalDevHosts].includes(hostname)) {
      return { allowed: false, reason: 'Mutation blocked outside configured dev hosts' };
    }
  }
  const requiredClass = scope.mutation_class === 'Unknown' ? 'Persistent' : scope.mutation_class;
  const workflowMatches = workflowAuthorization?.product === 'Paco' &&
    workflowAuthorization.environment === scope.environment &&
    workflowAuthorization.actions.includes(scope.action) &&
    workflowAuthorization.test_data_fingerprint === scope.test_data_fingerprint &&
    (workflowAuthorization.source === 'paco-execution-first-workflow'
      ? workflowAuthorization.ticket_key === scope.ticket_key && workflowAuthorization.case_ids.includes(scope.case_id)
      : workflowAuthorization.source === 'paco-explore-survey' && Boolean(scope.run_id && scope.action && scope.test_data_fingerprint) &&
        workflowAuthorization.run_id === scope.run_id && scope.ticket_key === '' && scope.case_id === '');
  if (!approval && !workflowMatches) return { allowed: false, reason: 'Explicit approval is required' };
  if (approval) {
    if (approval.run_id !== scope.run_id || approval.environment !== scope.environment || approval.ticket_key !== scope.ticket_key ||
        !approval.case_ids.includes(scope.case_id) || !approval.actions.includes(scope.action) ||
        approval.test_data_fingerprint !== scope.test_data_fingerprint || approval.mutation_class !== requiredClass) {
      return { allowed: false, reason: 'Approval scope does not match this run' };
    }
    if (Number.isNaN(Date.parse(approval.approved_at)) || Number.isNaN(Date.parse(now))) {
      return { allowed: false, reason: 'Approval timestamp is invalid' };
    }
    if (approval.expires_at !== null && (Number.isNaN(Date.parse(approval.expires_at)) || Date.parse(now) > Date.parse(approval.expires_at))) {
      return { allowed: false, reason: 'Approval has expired' };
    }
  }
  if (guards.PACO_ALLOW_MUTATION !== 'true') return { allowed: false, reason: 'PACO_ALLOW_MUTATION=true is required' };
  if (requiredClass === 'Destructive') {
    if (guards.PACO_ALLOW_DESTRUCTIVE !== 'true') return { allowed: false, reason: 'PACO_ALLOW_DESTRUCTIVE=true is required' };
    return { allowed: true, reason: workflowMatches ? 'workflow_authorized_destructive' : 'approved_destructive' };
  }
  return { allowed: true, reason: workflowMatches ? 'workflow_authorized_mutation' : 'approved_mutation' };
}
