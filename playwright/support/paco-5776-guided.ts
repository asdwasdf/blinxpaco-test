import type { MutationRunScope } from '../../scripts/mutation-gate.js';

export const PAC2_5776_TC_004_SCOPE: MutationRunScope = {
  run_id: 'PAC2-5776-TC-004-guided-2026-09-10',
  environment: 'dev',
  ticket_key: 'PAC2-5776',
  case_id: 'PAC2-5776-TC-004',
  action: 'Insert one Booking Link and one Health Form into one Quick Send draft',
  test_data_fingerprint: 'patient=katie sparrow;slot=Virtual Mental Health;form=sleep ap',
  mutation_class: 'Unknown',
};

export function parseGuidedApproval(value: string | undefined): {
  approved: true;
  scope: MutationRunScope;
} {
  if (!value) throw new Error('Blocked: PACO_MUTATION_APPROVAL_JSON is required');

  const parsed: unknown = JSON.parse(value);
  const expected = { approved: true as const, scope: PAC2_5776_TC_004_SCOPE };
  if (JSON.stringify(parsed) !== JSON.stringify(expected)) {
    throw new Error('Blocked: approval scope does not match PAC2-5776-TC-004');
  }
  return expected;
}

export function classifySchedulerPopup(visible: boolean): string {
  return visible
    ? 'Observed: Scheduler Link Required popup reproduced'
    : 'Pass for this run: popup not observed';
}

export function classifySchedulerPopupStages(stages: {
  afterBookingLink: boolean;
  afterHealthForm: boolean;
}): string {
  if (!stages.afterBookingLink) {
    return 'Inconclusive: scheduler popup was not observed after Booking Link';
  }
  return stages.afterHealthForm
    ? 'Observed: scheduler popup reopened after Health Form'
    : 'Pass for this run: scheduler popup handled after Booking Link and did not reopen after Health Form';
}
