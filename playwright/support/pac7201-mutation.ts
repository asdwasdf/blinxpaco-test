import type { MutationRunScope } from '../../scripts/mutation-gate.js';

export const PAC2_7201_TC_001_SCOPE: MutationRunScope = {
  run_id: 'PAC2-7201-TC-001-auto-2026-09-14',
  environment: 'dev',
  ticket_key: 'PAC2-7201',
  case_id: 'PAC2-7201-TC-001',
  action:
    'Create Quick Send campaign at Blinx Demo Site, share to Redmoor Liverpool, verify creator retains Edit+Delete',
  test_data_fingerprint:
    'creator=Blinx Demo Site;shared_to=Redmoor Liverpool;campaign_type=Quick Send',
  mutation_class: 'Persistent',
};

export const PAC2_7201_TC_002_SCOPE: MutationRunScope = {
  run_id: 'PAC2-7201-TC-002-auto-2026-09-14',
  environment: 'dev',
  ticket_key: 'PAC2-7201',
  case_id: 'PAC2-7201-TC-002',
  action:
    'View shared campaign from Redmoor Liverpool (shared-to org), verify Edit+Delete are absent',
  test_data_fingerprint:
    'reuse_from=PAC2-7201-TEST-BDS-to-Redmoor-edited (EXPLORE phase);creator=Blinx Demo Site;shared_to=Redmoor Liverpool',
  mutation_class: 'None',
};
