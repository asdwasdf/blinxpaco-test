export const PHASES = [
  'DISCOVER',
  'INGEST',
  'ANALYZE',
  'LOCATE',
  'EXPLORE',
  'TEST_DESIGN',
  'MANUAL_EXECUTE',
  'AUTOMATE',
  'AUTOMATION_EXECUTE',
  'REPORT',
  'COMPLETE',
] as const;

export type Phase = (typeof PHASES)[number];
export type PhaseStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'stale'
  | 'skipped'
  | 'failed';
export type SkillOutcomeCode =
  | 'completed'
  | 'completed_with_warnings'
  | 'blocked'
  | 'failed'
  | 'inconclusive'
  | 'no_change';
export type ArtifactState =
  | 'valid'
  | 'stale'
  | 'review_required'
  | 'needs_review'
  | 'missing'
  | 'corrupt';
export type MutationClass =
  | 'None'
  | 'Temporary'
  | 'Persistent'
  | 'Destructive'
  | 'Unknown';
export type TestResult = 'Pass' | 'Fail' | 'Blocked' | 'Not Run' | 'Inconclusive';
export type ExpectedBasis = 'Confirmed' | 'Observed' | 'Inferred' | 'Open Question';
export type AutomationVerification =
  | 'Matched product result'
  | 'Product behavior mismatch'
  | 'Automation defect'
  | 'Setup or authentication failure'
  | 'Inconclusive';

export interface ManualAttempt {
  id: string;
  result: TestResult;
  data_variant: 'same' | 'clean' | 'fresh_session' | 'control' | 'initial';
  evidence: string[];
}

export interface ManualCaseExecution {
  result: TestResult;
  expected_basis: ExpectedBasis;
  attempts: ManualAttempt[];
  control_path_checked: boolean;
  route: string;
  locators: string[];
  skip_or_block_reason: string | null;
}

export interface AutomationCaseImplementation {
  spec_path: string | null;
  diagnostic: boolean;
  reason: string | null;
  input_revision: number;
}

export interface AutomationCaseExecution {
  result: TestResult;
  verification: AutomationVerification;
  evidence: string[];
  product_result_changed: false;
}

export interface ExecutionState {
  case_ids: string[];
  manual: Record<string, ManualCaseExecution>;
  automation: Record<string, AutomationCaseImplementation>;
  runs: Record<string, AutomationCaseExecution>;
}

export interface PacoEnvironment {
  baseUrl: string;
  dashboardPath: string;
}

export interface PacoConfig {
  product: 'Paco';
  environments: {
    default: string;
    [name: string]: string | PacoEnvironment;
  };
  paths: {
    ticketSource: string;
    ticketOutput: string;
    testResults: string;
    playwrightAuth: string;
  };
  ticket: {
    sourcePattern: string;
    primarySourceFile: 'ticket.md';
  };
  jira: {
    origin: string;
    browsePath: string;
  };
  safety: {
    mutationEnabledEnvironments: string[];
    allowedHosts: string[];
    externalDevHosts: string[];
  };
  defaults: {
    readOnly: true;
    language: 'vi';
    uiTermsLanguage: 'en';
    browser: 'chromium';
    authStrategy: 'manual';
    locateMaxMinutes: number;
    locateMaxViews: number;
    reusableRouteMaxViews: number;
  };
}
